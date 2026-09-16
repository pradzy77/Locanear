// Cloudflare Pages Function: /api/location
// Updates caller's GPS coordinates and returns confirmed friends' latest positions in Cloudflare D1

function corsHeaders() {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}

export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders() });
}

export async function onRequestPost({ request, env }) {
    try {
        const { friendCode, lat, lng, battery = 100, ghostMode = 0 } = await request.json();
        const code = String(friendCode || '').trim().toUpperCase();

        if (!code) {
            return new Response(JSON.stringify({
                success: false,
                message: 'friendCode diperlukan!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (!env.DB) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database binding tidak tersedia'
            }), { status: 500, headers: corsHeaders() });
        }

        // Update location if valid coordinates provided
        if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
            await env.DB.prepare(`
                UPDATE users 
                SET lat = ?, lng = ?, battery = ?, ghost_mode = ?, updated_at = datetime('now')
                WHERE UPPER(friend_code) = ? OR LOWER(username) = ?
            `).bind(Number(lat), Number(lng), Number(battery), ghostMode ? 1 : 0, code, code.toLowerCase()).run();
        }

        // Fetch all friends' positions
        const { results } = await env.DB.prepare(`
            SELECT u.friend_code AS friendCode, u.name, u.avatar, u.color, u.lat, u.lng,
                   COALESCE(u.battery, 100) AS battery, COALESCE(u.ghost_mode, 0) AS ghostMode,
                   u.updated_at AS updatedAt
            FROM friendships f
            JOIN users u ON f.user_code_b = u.friend_code
            WHERE f.user_code_a = (
                SELECT friend_code FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1
            )
        `).bind(code, code.toLowerCase()).all();

        return new Response(JSON.stringify({
            success: true,
            friends: results || []
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), { status: 500, headers: corsHeaders() });
    }
}

export async function onRequestGet({ request, env }) {
    try {
        const url = new URL(request.url);
        const code = (url.searchParams.get('code') || '').trim().toUpperCase();

        if (!code || !env.DB) {
            return new Response(JSON.stringify({ success: false, friends: [] }), { headers: corsHeaders() });
        }

        const { results } = await env.DB.prepare(`
            SELECT u.friend_code AS friendCode, u.name, u.avatar, u.color, u.lat, u.lng,
                   COALESCE(u.battery, 100) AS battery, COALESCE(u.ghost_mode, 0) AS ghostMode,
                   u.updated_at AS updatedAt
            FROM friendships f
            JOIN users u ON f.user_code_b = u.friend_code
            WHERE f.user_code_a = (
                SELECT friend_code FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1
            )
        `).bind(code, code.toLowerCase()).all();

        return new Response(JSON.stringify({
            success: true,
            friends: results || []
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), { status: 500, headers: corsHeaders() });
    }
}

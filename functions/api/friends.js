// Cloudflare Pages Function: /api/friends
// Handles listing, adding, and removing friends in Cloudflare D1

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

export async function onRequestGet({ request, env }) {
    try {
        const url = new URL(request.url);
        const code = (url.searchParams.get('code') || '').trim().toUpperCase();

        if (!code) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Parameter kode pengguna tidak valid!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (!env.DB) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database binding tidak tersedia'
            }), { status: 500, headers: corsHeaders() });
        }

        // Fetch user's official friend_code
        const me = await env.DB.prepare(
            "SELECT friend_code FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(code, code.toLowerCase()).first();

        const myCode = me ? me.friend_code : code;

        // Query confirmed friends
        const { results } = await env.DB.prepare(`
            SELECT u.friend_code AS friendCode, u.name, u.avatar, u.color, u.lat, u.lng, 
                   COALESCE(u.battery, 100) AS battery, COALESCE(u.ghost_mode, 0) AS ghostMode,
                   u.updated_at AS updatedAt
            FROM friendships f
            JOIN users u ON f.user_code_b = u.friend_code
            WHERE f.user_code_a = ?
        `).bind(myCode).all();

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

export async function onRequestPost({ request, env }) {
    try {
        const { action = 'add', myCode, targetCode } = await request.json();
        const cleanMy = String(myCode || '').trim().toUpperCase();
        const cleanTarget = String(targetCode || '').trim().toUpperCase();

        if (!cleanMy || !cleanTarget) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Kode pengguna dan kode teman harus diisi!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (cleanMy === cleanTarget) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Tidak dapat menambahkan diri sendiri sebagai teman!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (!env.DB) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database binding tidak tersedia'
            }), { status: 500, headers: corsHeaders() });
        }

        const myUser = await env.DB.prepare(
            "SELECT friend_code, name FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(cleanMy, cleanMy.toLowerCase()).first();

        const targetUser = await env.DB.prepare(
            "SELECT friend_code, name, avatar, color, lat, lng, battery, ghost_mode FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(cleanTarget, cleanTarget.toLowerCase()).first();

        if (!targetUser) {
            return new Response(JSON.stringify({
                success: false,
                message: `Teman dengan kode [${cleanTarget}] tidak ditemukan!`
            }), { status: 404, headers: corsHeaders() });
        }

        const actualMyCode = myUser ? myUser.friend_code : cleanMy;
        const actualTargetCode = targetUser.friend_code;

        if (actualMyCode === actualTargetCode) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Tidak dapat menambahkan diri sendiri sebagai teman!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (action === 'remove') {
            await env.DB.prepare(
                "DELETE FROM friendships WHERE (user_code_a = ? AND user_code_b = ?) OR (user_code_a = ? AND user_code_b = ?)"
            ).bind(actualMyCode, actualTargetCode, actualTargetCode, actualMyCode).run();

            return new Response(JSON.stringify({
                success: true,
                message: `Teman ${targetUser.name} telah dihapus.`
            }), { headers: corsHeaders() });
        }

        // Add / accept friendship
        await env.DB.prepare(
            "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
        ).bind(actualMyCode, actualTargetCode).run();

        await env.DB.prepare(
            "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
        ).bind(actualTargetCode, actualMyCode).run();

        return new Response(JSON.stringify({
            success: true,
            message: `Berhasil menambahkan ${targetUser.name} sebagai teman!`,
            friend: {
                friendCode: targetUser.friend_code,
                name: targetUser.name,
                avatar: targetUser.avatar,
                color: targetUser.color,
                lat: targetUser.lat,
                lng: targetUser.lng,
                battery: targetUser.battery || 100,
                ghostMode: targetUser.ghost_mode || 0
            }
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), { status: 500, headers: corsHeaders() });
    }
}

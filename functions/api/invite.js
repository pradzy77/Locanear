// Cloudflare Pages Function: /api/invite
// Handles checking invite code and accepting mutual friendship in Cloudflare D1

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
                message: 'Parameter kode undangan tidak valid!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (!env.DB) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database binding tidak tersedia'
            }), { status: 500, headers: corsHeaders() });
        }

        const user = await env.DB.prepare(
            "SELECT friend_code, name, avatar, color, lat, lng FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(code, code.toLowerCase()).first();

        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Pengguna dengan kode tersebut tidak ditemukan!'
            }), { status: 404, headers: corsHeaders() });
        }

        return new Response(JSON.stringify({
            success: true,
            user: {
                friendCode: user.friend_code,
                name: user.name,
                avatar: user.avatar,
                color: user.color,
                lat: user.lat,
                lng: user.lng
            }
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
        const { myCode, targetCode } = await request.json();
        const cleanMy = String(myCode || '').trim().toUpperCase();
        const cleanTarget = String(targetCode || '').trim().toUpperCase();

        if (!cleanMy || !cleanTarget) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Kode pengguna dan kode tujuan harus diisi!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (cleanMy === cleanTarget) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Tidak dapat mengundang atau berteman dengan diri sendiri!'
            }), { status: 400, headers: corsHeaders() });
        }

        if (!env.DB) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Database binding tidak tersedia'
            }), { status: 500, headers: corsHeaders() });
        }

        // Find target user
        const targetUser = await env.DB.prepare(
            "SELECT friend_code, name, avatar, color, lat, lng, battery FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(cleanTarget, cleanTarget.toLowerCase()).first();

        if (!targetUser) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Teman dengan kode tersebut tidak ditemukan!'
            }), { status: 404, headers: corsHeaders() });
        }

        // Find current user
        const myUser = await env.DB.prepare(
            "SELECT friend_code, name FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
        ).bind(cleanMy, cleanMy.toLowerCase()).first();

        const actualMyCode = myUser ? myUser.friend_code : cleanMy;
        const actualTargetCode = targetUser.friend_code;

        if (actualMyCode === actualTargetCode) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Tidak dapat berteman dengan diri sendiri!'
            }), { status: 400, headers: corsHeaders() });
        }

        // Insert mutual friendships
        await env.DB.prepare(
            "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
        ).bind(actualMyCode, actualTargetCode).run();

        await env.DB.prepare(
            "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
        ).bind(actualTargetCode, actualMyCode).run();

        return new Response(JSON.stringify({
            success: true,
            message: `Berhasil terhubung dengan ${targetUser.name}!`,
            friend: {
                friendCode: targetUser.friend_code,
                name: targetUser.name,
                avatar: targetUser.avatar,
                color: targetUser.color,
                lat: targetUser.lat,
                lng: targetUser.lng,
                battery: targetUser.battery || 100
            }
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), { status: 500, headers: corsHeaders() });
    }
}

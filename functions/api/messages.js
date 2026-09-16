// Cloudflare Pages Function: /api/messages
// Real-time chat messages between friends and group chat

function corsHeaders() {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
}

async function ensureMessagesTable(db) {
    if (!db) return;
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_code TEXT NOT NULL,
                target_code TEXT,
                sender_name TEXT NOT NULL,
                sender_avatar TEXT,
                text TEXT NOT NULL,
                type TEXT DEFAULT 'text',
                location_lat REAL,
                location_lng REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
    } catch (e) {}
}

export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders() });
}

export async function onRequestGet({ request, env }) {
    try {
        if (!env.DB) {
            return new Response(JSON.stringify({ success: false, messages: [] }), { headers: corsHeaders() });
        }
        await ensureMessagesTable(env.DB);

        const url = new URL(request.url);
        const myCode = (url.searchParams.get('myCode') || '').trim().toUpperCase();
        const targetCode = (url.searchParams.get('targetCode') || '').trim().toUpperCase();
        const mode = url.searchParams.get('mode') || '';

        // Mode: recent (fetches latest message per conversation for the chat list)
        if (mode === 'recent' && myCode) {
            const { results } = await env.DB.prepare(`
                SELECT id, sender_code AS senderCode, target_code AS targetCode, 
                       sender_name AS senderName, sender_avatar AS senderAvatar, 
                       text, type, created_at AS createdAt
                FROM messages
                WHERE sender_code = ? OR target_code = ? OR target_code IS NULL OR target_code = '' OR target_code = 'GROUP'
                ORDER BY id DESC LIMIT 100
            `).bind(myCode, myCode).all();

            return new Response(JSON.stringify({
                success: true,
                messages: results || []
            }), { headers: corsHeaders() });
        }

        // Mode: direct conversation between myCode and targetCode
        if (targetCode && targetCode !== 'GROUP') {
            const { results } = await env.DB.prepare(`
                SELECT id, sender_code AS senderCode, target_code AS targetCode,
                       sender_name AS senderName, sender_avatar AS senderAvatar,
                       text, type, location_lat AS lat, location_lng AS lng,
                       created_at AS createdAt
                FROM messages
                WHERE (sender_code = ? AND target_code = ?) OR (sender_code = ? AND target_code = ?)
                ORDER BY id ASC LIMIT 100
            `).bind(myCode, targetCode, targetCode, myCode).all();

            return new Response(JSON.stringify({
                success: true,
                messages: results || []
            }), { headers: corsHeaders() });
        }

        // Mode: group chat
        const { results } = await env.DB.prepare(`
            SELECT id, sender_code AS senderCode, target_code AS targetCode,
                   sender_name AS senderName, sender_avatar AS senderAvatar,
                   text, type, location_lat AS lat, location_lng AS lng,
                   created_at AS createdAt
            FROM messages
            WHERE target_code IS NULL OR target_code = '' OR target_code = 'GROUP'
            ORDER BY id ASC LIMIT 100
        `).all();

        return new Response(JSON.stringify({
            success: true,
            messages: results || []
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message,
            messages: []
        }), { status: 500, headers: corsHeaders() });
    }
}

export async function onRequestPost({ request, env }) {
    try {
        if (!env.DB) {
            return new Response(JSON.stringify({ success: false, message: 'Database binding tidak tersedia' }), { status: 500, headers: corsHeaders() });
        }
        await ensureMessagesTable(env.DB);

        const body = await request.json();
        const senderCode = String(body.senderCode || '').trim().toUpperCase();
        const targetCode = body.targetCode ? String(body.targetCode).trim().toUpperCase() : null;
        const senderName = String(body.senderName || 'Pengguna').trim();
        const senderAvatar = String(body.senderAvatar || 'cool').trim();
        const text = String(body.text || '').trim();
        const type = String(body.type || 'text').trim();
        const lat = (body.location && body.location.lat != null) ? Number(body.location.lat) : (body.lat != null ? Number(body.lat) : null);
        const lng = (body.location && body.location.lng != null) ? Number(body.location.lng) : (body.lng != null ? Number(body.lng) : null);

        if (!senderCode || !text) {
            return new Response(JSON.stringify({ success: false, message: 'senderCode dan text harus diisi!' }), { status: 400, headers: corsHeaders() });
        }

        const res = await env.DB.prepare(`
            INSERT INTO messages (sender_code, target_code, sender_name, sender_avatar, text, type, location_lat, location_lng)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(senderCode, targetCode, senderName, senderAvatar, text, type, lat, lng).run();

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return new Response(JSON.stringify({
            success: true,
            message: {
                id: res.meta ? res.meta.last_row_id : Date.now(),
                senderCode,
                targetCode,
                senderName,
                senderAvatar,
                text,
                type,
                location: (lat != null && lng != null) ? { lat, lng } : null,
                createdAt: new Date().toISOString(),
                timestamp: timeStr
            }
        }), { headers: corsHeaders() });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500, headers: corsHeaders() });
    }
}

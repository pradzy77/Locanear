async function ensureTables(db) {
    if (!db) return;
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                avatar TEXT NOT NULL DEFAULT 'cool',
                color TEXT NOT NULL DEFAULT '#10b981',
                friend_code TEXT UNIQUE NOT NULL,
                security_question TEXT,
                security_answer TEXT,
                lat REAL DEFAULT -6.2088,
                lng REAL DEFAULT 106.8456,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS friendships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_code_a TEXT NOT NULL,
                user_code_b TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_code_a, user_code_b)
            )
        `).run();

    } catch (e) {}
}

export async function onRequestPost({ request, env }) {
    try {
        const { username, password } = await request.json();
        const uKey = String(username || '').trim().toLowerCase();
        const p = String(password || '').trim();

        if (!uKey || !p) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Harap isi username dan password!'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (env.DB) {
            await ensureTables(env.DB);
        }

        // Query Cloudflare D1
        let user = null;
        if (env.DB) {
            user = await env.DB.prepare(
                "SELECT * FROM users WHERE LOWER(username) = ? AND password = ?"
            ).bind(uKey, p).first();
        }

        // User must exist in D1

        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username atau password salah!'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            user: {
                username: user.username,
                name: user.name,
                avatar: user.avatar,
                color: user.color,
                friendCode: user.friend_code,
                lat: user.lat,
                lng: user.lng
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

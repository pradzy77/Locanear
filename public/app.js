// ZenLoc - Realtime Friend Map (Zenly Style)
// Client Script

let map;
let socket;
let myId = null;
// Modern Vector Avatars Registry (High-resolution, zero emoji-soup)
const MODERN_AVATARS = {
    'cool': {
        name: 'Cool Shades',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-cool" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-cool)"/><path d="M12 18c0-1.5 1-2.5 2.5-2.5h15c1.5 0 2.5 1 2.5 2.5v2c0 3.5-2.5 6-5.5 6h-1c-1.5 0-2.5-1-2.5-2.2 0 1.2-1 2.2-2.5 2.2h-1c-3 0-5.5-2.5-5.5-6v-2z" fill="#0f172a"/><path d="M14 19h5v2.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5v-2.5zm11 0h5v2.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5v-2.5z" fill="#7dd3fc"/><path d="M16 30c2.5 2 9.5 2 12 0" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    'sakura': {
        name: 'Sakura Rose',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-sakura" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f472b6"/><stop offset="100%" stop-color="#db2777"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-sakura)"/><circle cx="22" cy="22" r="12" fill="#fdf2f8" opacity="0.3"/><circle cx="22" cy="15" r="4.5" fill="#fff"/><circle cx="22" cy="29" r="4.5" fill="#fff"/><circle cx="15" cy="22" r="4.5" fill="#fff"/><circle cx="29" cy="22" r="4.5" fill="#fff"/><circle cx="22" cy="22" r="5" fill="#fb7185"/></svg>`
    },
    'cyber': {
        name: 'Cyber Bolt',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-cyber" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#BEE354"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-cyber)"/><path d="M24 10l-9 14h8l-3 10 11-15h-8l3-9z" fill="#0a1526"/><circle cx="22" cy="22" r="18" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/></svg>`
    },
    'fox': {
        name: 'Kitsune',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-fox" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-fox)"/><path d="M12 14l6 8-6 4 2-12zm20 0l-6 8 6 4-2-12z" fill="#fff" opacity="0.85"/><path d="M16 22l6 11 6-11c0-4-2.5-7-6-7s-6 3-6 7z" fill="#fff"/><circle cx="19" cy="22" r="1.5" fill="#0f172a"/><circle cx="25" cy="22" r="1.5" fill="#0f172a"/><path d="M20.5 27l1.5 1.5 1.5-1.5z" fill="#ea580c"/></svg>`
    },
    'cat': {
        name: 'Neko Cyber',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-cat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-cat)"/><path d="M13 15l4 7-5 2 1-9zm18 0l-4 7 5 2-1-9z" fill="#f3e8ff"/><circle cx="22" cy="25" r="9" fill="#f3e8ff"/><ellipse cx="19" cy="24" rx="1.5" ry="2.2" fill="#4338ca"/><ellipse cx="25" cy="24" rx="1.5" ry="2.2" fill="#4338ca"/><path d="M21 27l1 1 1-1" stroke="#4338ca" stroke-width="1.2" stroke-linecap="round"/></svg>`
    },
    'astro': {
        name: 'Astro',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-astro" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-astro)"/><circle cx="22" cy="22" r="11" fill="#fff"/><rect x="15" y="17" width="14" height="8" rx="4" fill="#f59e0b"/><rect x="17" y="19" width="10" height="2" rx="1" fill="#fff" opacity="0.6"/><circle cx="22" cy="30" r="1.5" fill="#38bdf8"/></svg>`
    },
    'panda': {
        name: 'Zen Panda',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-panda" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-panda)"/><circle cx="15" cy="16" r="3.5" fill="#0f172a"/><circle cx="29" cy="16" r="3.5" fill="#0f172a"/><circle cx="22" cy="24" r="9.5" fill="#fff"/><ellipse cx="18" cy="23" rx="2" ry="2.8" fill="#0f172a"/><ellipse cx="26" cy="23" rx="2" ry="2.8" fill="#0f172a"/><circle cx="18.5" cy="22.5" r="0.8" fill="#fff"/><circle cx="25.5" cy="22.5" r="0.8" fill="#fff"/><ellipse cx="22" cy="27" rx="1.5" ry="1" fill="#0f172a"/></svg>`
    },
    'crown': {
        name: 'Imperial Crown',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-crown" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-crown)"/><path d="M12 28l2-13 5 6 3-8 3 8 5-6 2 13h-20z" fill="#fff"/><circle cx="14" cy="15" r="1.8" fill="#fef3c7"/><circle cx="22" cy="13" r="2.2" fill="#fef3c7"/><circle cx="30" cy="15" r="1.8" fill="#fef3c7"/><rect x="13" y="27" width="18" height="3" rx="1.5" fill="#b45309"/></svg>`
    },
    'gamer': {
        name: 'Arcade Gamer',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-gamer" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-gamer)"/><rect x="12" y="16" width="20" height="13" rx="5" fill="#0f172a"/><path d="M16 20v5m-2.5-2.5h5" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/><circle cx="27" cy="21" r="1.4" fill="#f43f5e"/><circle cx="29" cy="24" r="1.4" fill="#10b981"/></svg>`
    },
    'zen': {
        name: 'Matcha Zen',
        svg: `<svg viewBox="0 0 44 44" fill="none"><defs><linearGradient id="g-zen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#84cc16"/><stop offset="100%" stop-color="#4d7c0f"/></linearGradient></defs><rect width="44" height="44" rx="22" fill="url(#g-zen)"/><path d="M14 20h14c0 6-3 9-7 9s-7-3-7-9z" fill="#f7fee7"/><path d="M28 22h3a2 2 0 0 1 0 4h-3v-4z" stroke="#f7fee7" stroke-width="1.5"/><path d="M19 14c1 1.5-1 2.5 0 4m4-4c1 1.5-1 2.5 0 4" stroke="#f7fee7" stroke-width="1.5" stroke-linecap="round"/></svg>`
    }
};

const LEGACY_EMOJI_TO_MODERN = {
    '😎': 'cool',
    '🌸': 'sakura',
    '⚡': 'cyber',
    '🦊': 'fox',
    '🐱': 'cat',
    '🚀': 'astro',
    '🐼': 'panda',
    '👑': 'crown',
    '🎮': 'gamer',
    '☕': 'zen',
    '👾': 'gamer'
};

function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

let savedAvatarRaw = localStorage.getItem('zenloc_avatar') || 'cool';
if (LEGACY_EMOJI_TO_MODERN[savedAvatarRaw]) {
    savedAvatarRaw = LEGACY_EMOJI_TO_MODERN[savedAvatarRaw];
    localStorage.setItem('zenloc_avatar', savedAvatarRaw);
}

const savedLat = parseFloat(localStorage.getItem('zenloc_last_lat'));
const savedLng = parseFloat(localStorage.getItem('zenloc_last_lng'));

let myProfile = {
    name: localStorage.getItem('zenloc_name') || 'Saya',
    avatar: savedAvatarRaw,
    color: localStorage.getItem('zenloc_color') || '#BEE354',
    friendCode: localStorage.getItem('zenloc_my_friend_code') || '',
    lat: (!isNaN(savedLat) && savedLat !== 0) ? savedLat : -6.2088,
    lng: (!isNaN(savedLng) && savedLng !== 0) ? savedLng : 106.8456,
    accuracy: 15,
    speed: 0,
    heading: 0,
    battery: 100,
    charging: false,
    ghostMode: false,
    stationarySince: Date.now()
};

// Map of userId -> { marker: L.marker, circle: L.circle, data: userData }
const friendMarkers = new Map();

// Friendship State: Confirmed Friends & Pending Requests
const confirmedFriends = new Map(); // friendCode -> userData
const incomingRequests = new Map(); // fromCode -> requestData

// Magic Invite Link Parameter Detection (?invite=CODE or #invite=CODE)
function detectMagicInviteParam() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let invite = urlParams.get('invite');
        if (!invite && window.location.hash.includes('invite=')) {
            const hashPart = window.location.hash.split('invite=')[1];
            if (hashPart) invite = hashPart.split('&')[0];
        }
        return invite ? invite.trim().toUpperCase() : null;
    } catch (e) {
        return null;
    }
}

let pendingMagicInviteCode = detectMagicInviteParam();

// Helper Render Avatar (Foto Profil Image atau Vector SVG)
function renderAvatarHtml(avatar, altName = '') {
    if (!avatar) return MODERN_AVATARS['cool'].svg;
    const isImage = typeof avatar === 'string' && (
        avatar.startsWith('data:image/') ||
        avatar.startsWith('http://') ||
        avatar.startsWith('https://') ||
        avatar.startsWith('/') ||
        avatar.startsWith('blob:')
    );
    if (isImage) {
        return `<img src="${avatar}" alt="${altName}" class="avatar-photo-img" />`;
    }
    if (typeof avatar === 'string' && avatar.trim().startsWith('<svg')) {
        return avatar;
    }
    if (typeof avatar === 'string') {
        const key = LEGACY_EMOJI_TO_MODERN[avatar] || avatar;
        if (MODERN_AVATARS[key]) {
            return MODERN_AVATARS[key].svg;
        }
    }
    return `<span>${avatar}</span>`;
}

// Helper Kompresi & Crop Foto Profil via Canvas (160x160 px JPEG/WebP)
function processProfilePhoto(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        showToast('Format file harus berupa gambar (JPG, PNG, WEBP).');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const size = 160;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;

            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            callback(dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
let myMarker = null;
let myAccuracyCircle = null;
let activeReactionTargetId = null;
let mockBots = [];

// OTW Navigation State (Real-time GPS driven, zero fake movements)
let activeOtwRoute = null; // { casing: L.polyline, inner: L.polyline, coords: [] }
let activeOtwData = null;

// Phase 2 State: Chat & Meetup
let chatMessages = [];
let activeChatTab = 'group'; // 'group' or 'private'
let activeChatTargetId = '';
let unreadChatCount = 0;
let activeMeetupTargetId = null;
let pendingIncomingInvite = null;

// Phase 3 State: 7-Day History, Breadcrumbs, Favorites & Replay
let favoriteFriendIds = new Set(JSON.parse(localStorage.getItem('zenloc_favorites') || '[]'));
let isTrailVisible = localStorage.getItem('zenloc_trail_visible') !== 'false';
let selectedHistoryDateKey = ''; // YYYY-MM-DD
let activeHistoryTab = 'self'; // 'self' or 'together'
let selfTrailLayer = null;
let togetherTrailLayer = null;
let replayMarker = null;
let replayInterval = null;
let replaySpeed = 1; // 1x, 2x, 5x
let replayCurrentIdx = 0;
let activeDayPoints = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initMap();
    initBattery();
    initModal();
    initChat();
    initMeetup();
    initHistorySystem();
    initFriendCodeSystem();
    initEditProfileModal();

    // If already logged in, start sync and handle magic invite link
    const savedUser = localStorage.getItem('zenloc_auth_user');
    const savedCode = localStorage.getItem('zenloc_my_friend_code');
    if (savedUser && savedCode) {
        myProfile.friendCode = savedCode;
        startCloudflareSync();
        if (pendingMagicInviteCode) {
            const targetInvite = pendingMagicInviteCode;
            pendingMagicInviteCode = null;
            setTimeout(() => {
                handleMagicInviteForActiveUser(targetInvite);
            }, 800);
            try {
                const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            } catch (e) {}
        }
    }
});

// Map Layers Configuration (Google Maps & Satelit)
let currentLayerName = 'google-roadmap';
let activeTileLayer = null;

const mapLayers = {
    'google-roadmap': L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
    }),
    'google-satellite': L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps (Satelit)'
    }),
    'osm': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    })
};

// Setup Map with Google Maps by default
function initMap() {
    map = L.map('map', {
        center: [myProfile.lat, myProfile.lng],
        zoom: 15,
        zoomControl: false
    });

    // Default to Google Maps Standard Roadmap
    activeTileLayer = mapLayers['google-roadmap'];
    activeTileLayer.addTo(map);

    // Immediately render self marker on map so it never starts empty
    updateMyMarker();
    renderAccuracyUI(myProfile.accuracy || 15);

    // Handle map click
    map.on('click', () => {
        closeReactionBar();
    });

    // Re-adjust marker clusters when zooming or panning
    map.on('zoomend moveend', () => {
        adjustMarkerClusters();
    });
}

function setMapLayer(layerName) {
    if (!map || !mapLayers[layerName]) return;
    if (currentLayerName === layerName && activeTileLayer) return;

    if (activeTileLayer) {
        map.removeLayer(activeTileLayer);
    }

    currentLayerName = layerName;
    activeTileLayer = mapLayers[layerName];
    activeTileLayer.addTo(map);

    const roadBtn = document.getElementById('btn-layer-roadmap');
    const satBtn = document.getElementById('btn-layer-satellite');
    if (roadBtn) roadBtn.classList.toggle('active', layerName === 'google-roadmap');
    if (satBtn) satBtn.classList.toggle('active', layerName === 'google-satellite');

    showToast(layerName === 'google-satellite' ? 'Tampilan berganti: Google Maps Satelit' : 'Tampilan berganti: Google Maps Standar');
}

function toggleMapLayer() {
    setMapLayer(currentLayerName === 'google-roadmap' ? 'google-satellite' : 'google-roadmap');
}

// Battery Status API
async function initBattery() {
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            updateBatteryState(battery);

            battery.addEventListener('levelchange', () => updateBatteryState(battery));
            battery.addEventListener('chargingchange', () => updateBatteryState(battery));
        } catch (e) {
            console.log('Battery API not available', e);
            fallbackBattery();
        }
    } else {
        fallbackBattery();
    }
}

function updateBatteryState(battery) {
    myProfile.battery = Math.round(battery.level * 100);
    myProfile.charging = battery.charging;
    renderMyBatteryUI();
    sendLocationUpdate();
}

function fallbackBattery() {
    myProfile.battery = 85;
    myProfile.charging = false;
    renderMyBatteryUI();
}

function renderMyBatteryUI() {
    const el = document.getElementById('my-battery');
    if (el) {
        const iconName = myProfile.charging ? 'battery-charging' : 'battery';
        el.innerHTML = `<i data-lucide="${iconName}" class="bat-icon"></i> <span id="my-battery-text">${myProfile.battery}%</span>`;
        refreshLucideIcons();
    }
}

// ========================================================
// Screen Wake Lock & Tab Visibility Auto-Refresh for Continuous Tracking
// ========================================================
let wakeLockSentinel = null;
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLockSentinel = await navigator.wakeLock.request('screen');
            wakeLockSentinel.addEventListener('release', () => {
                wakeLockSentinel = null;
            });
        }
    } catch (e) {}
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        requestWakeLock();
        if (myProfile.friendCode && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                myProfile.lat = pos.coords.latitude;
                myProfile.lng = pos.coords.longitude;
                myProfile.accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 15;
                myProfile.speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
                try {
                    localStorage.setItem('zenloc_last_lat', myProfile.lat);
                    localStorage.setItem('zenloc_last_lng', myProfile.lng);
                } catch (e) {}
                updateMyMarker();
                renderAccuracyUI(myProfile.accuracy);
                sendLocationUpdate();
            }, () => {}, { enableHighAccuracy: true, timeout: 6000 });
        }
        syncFriendsAndLocation();
    }
});

// Geolocation with Smart Dual-Strategy (Instant Render + Fast Fallback for PC/Laptop)
function startWatchingLocation() {
    requestWakeLock();
    // 1. Immediately render current/cached marker on map so user is never staring at empty map!
    updateMyMarker();
    renderAccuracyUI(myProfile.accuracy || 15);
    sendLocationUpdate();

    if ('geolocation' in navigator) {
        let hasResolved = false;

        // Fallback timer: if hardware GPS takes > 3 seconds (common on Windows PC/Laptop without GNSS chip)
        const fallbackTimer = setTimeout(() => {
            if (!hasResolved) {
                if (!myProfile.accuracy) {
                    myProfile.accuracy = 25;
                }
                renderAccuracyUI(myProfile.accuracy);
                updateMyMarker();
                sendLocationUpdate();
            }
        }, 3000);

        let hasAutoCentered = false;

        // First attempt: Fast position (Wi-Fi / IP / Browser Cache)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                hasResolved = true;
                clearTimeout(fallbackTimer);

                myProfile.lat = pos.coords.latitude;
                myProfile.lng = pos.coords.longitude;
                myProfile.speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
                myProfile.heading = pos.coords.heading || 0;
                myProfile.accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 15;

                try {
                    localStorage.setItem('zenloc_last_lat', myProfile.lat);
                    localStorage.setItem('zenloc_last_lng', myProfile.lng);
                } catch (e) {}

                renderAccuracyUI(myProfile.accuracy);
                updateMyMarker();
                sendLocationUpdate();

                // Selalu pusatkan peta ke lokasi pengguna saat ini
                if (map) {
                    map.flyTo([myProfile.lat, myProfile.lng], 16, { animate: true, duration: 1 });
                    hasAutoCentered = true;
                }
            },
            (err) => {
                // Silent catch, watchPosition below will continue
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 10000
            }
        );

        // Continuous watch position
        navigator.geolocation.watchPosition(
            (pos) => {
                hasResolved = true;
                clearTimeout(fallbackTimer);

                // Pure real-world GPS position
                myProfile.lat = pos.coords.latitude;
                myProfile.lng = pos.coords.longitude;
                myProfile.speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0; // km/h
                myProfile.heading = pos.coords.heading || 0;
                myProfile.accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 12;

                try {
                    localStorage.setItem('zenloc_last_lat', myProfile.lat);
                    localStorage.setItem('zenloc_last_lng', myProfile.lng);
                } catch (e) {}

                // Dynamic OTW real-time distance & ETA calculation based on real GPS
                if (activeOtwData && activeOtwData.targetId && map) {
                    const friend = friendMarkers.get(activeOtwData.targetId);
                    if (friend && friend.data && friend.data.lat && friend.data.lng) {
                        const distMeters = map.distance([myProfile.lat, myProfile.lng], [friend.data.lat, friend.data.lng]);
                        const distKm = (distMeters / 1000).toFixed(1);
                        const estSpeed = Math.max(myProfile.speed || 0, 20); // 20 km/h est city traffic
                        const etaMinutes = Math.max(1, Math.round((distMeters / 1000) / estSpeed * 60));

                        const etaText = document.getElementById('otw-eta-text');
                        const distText = document.getElementById('otw-dist-text');
                        if (etaText) etaText.innerText = `${etaMinutes} mnt`;
                        if (distText) distText.innerText = `(${distKm} km)`;

                        if (distMeters < 25) {
                            showToast(`Anda telah sampai di lokasi ${activeOtwData.targetName}!`);
                            if (socket && socket.connected) {
                                socket.emit('arrive-otw', {
                                    fromId: myId,
                                    fromName: myProfile.name,
                                    toId: activeOtwData.targetId,
                                    toName: activeOtwData.targetName
                                });
                            }
                            setTimeout(() => clearOtwRoute(), 3500);
                        }
                    }
                }

                renderAccuracyUI(myProfile.accuracy);
                updateMyMarker();
                sendLocationUpdate();

                // Pusatkan jika belum pernah dipusatkan ke GPS riil
                if (!hasAutoCentered && map) {
                    map.flyTo([myProfile.lat, myProfile.lng], 16, { animate: true, duration: 1 });
                    hasAutoCentered = true;
                }
            },
            (err) => {
                hasResolved = true;
                clearTimeout(fallbackTimer);
                console.warn('Geolocation unavailable/timeout on device, using estimated location', err);
                myProfile.accuracy = 25;
                renderAccuracyUI(myProfile.accuracy);
                updateMyMarker();
                sendLocationUpdate();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000
            }
        );
    } else {
        myProfile.accuracy = 25;
        renderAccuracyUI(myProfile.accuracy);
        updateMyMarker();
        sendLocationUpdate();
    }
}

function renderAccuracyUI(accuracy) {
    const textEl = document.getElementById('my-accuracy');
    const dotEl = document.getElementById('acc-dot');
    if (!textEl) return;

    if (dotEl) {
        dotEl.innerText = '';
        dotEl.className = 'radar-dot';
    }

    if (!accuracy) {
        textEl.innerText = 'Lokasi Siap';
        return;
    }

    if (accuracy <= 15) {
        textEl.innerText = `±${accuracy}m (Sangat Akurat)`;
    } else if (accuracy <= 40) {
        textEl.innerText = `±${accuracy}m (Akurat)`;
        if (dotEl) dotEl.classList.add('warn');
    } else {
        textEl.innerText = `±${accuracy}m (Perkiraan)`;
        if (dotEl) dotEl.classList.add('warn');
    }
}

// Helper Format Dwell Time (Berapa lama di lokasi) & Last Seen
function formatDwellTime(stationarySince, lastSeen = null, isOnline = true) {
    const now = Date.now();
    if (!isOnline && lastSeen) {
        const diffMs = Math.max(0, now - lastSeen);
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'Baru saja';
        if (mins < 60) return `${mins} mnt lalu`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} jam lalu`;
        const days = Math.floor(hours / 24);
        return `${days} hr lalu`;
    }

    if (!stationarySince) return 'Baru tiba';
    const diffMs = Math.max(0, now - stationarySince);
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Baru tiba';
    if (mins < 60) return `${mins} mnt`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours < 24) {
        return remMins > 0 ? `${hours}j ${remMins}m` : `${hours} jam`;
    }
    const days = Math.floor(hours / 24);
    return `${days} hari`;
}

// Custom Zenly Marker Generator
function createZenlyIcon(userData, isSelf = false, isCluster = false) {
    const isGhost = userData.ghostMode;
    const isLow = (userData.battery || 100) <= 20;
    const chargeIcon = userData.charging
        ? '<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style="vertical-align:-1px;margin-right:2px;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
        : '';
    const isOnline = userData.online !== false;
    const speed = userData.speed || 0;

    // Status Dwell Time atau Kecepatan (Vector SVG)
    let dwellText = '';
    if (!isOnline) {
        dwellText = `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 5h-2v6l5 3"/></svg>${formatDwellTime(userData.stationarySince, userData.lastSeen, false)}`;
    } else if (speed > 3) {
        dwellText = `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>${speed} km/h`;
    } else {
        dwellText = `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${formatDwellTime(userData.stationarySince, null, true)}`;
    }

    const haloColor = isSelf
        ? 'background: rgba(99, 102, 241, 0.4);'
        : (isOnline ? 'background: rgba(236, 72, 153, 0.3);' : 'background: rgba(148, 163, 184, 0.2);');

    const ghostTagHtml = isGhost
        ? `<div class="marker-ghost-tag"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg></div>`
        : '';

    const clusterClass = isCluster ? 'in-cluster' : '';
    const html = `
        <div class="zenly-marker-wrapper ${clusterClass} ${!isOnline ? 'offline' : ''}" id="marker-wrap-${userData.id || (isSelf ? 'self' : 'user')}">
            <div class="marker-halo" style="${haloColor}"></div>
            <div class="marker-name-tag">${userData.name}${isSelf ? ' (Saya)' : ''}</div>
            ${ghostTagHtml}
            <div class="marker-bubble" style="border-color: ${userData.color || '#BEE354'};">
                ${renderAvatarHtml(userData.avatar, userData.name)}
            </div>
            <div class="marker-bottom-status ${!isOnline ? 'offline' : ''}">
                <span class="marker-batt-pill ${isLow ? 'low' : ''}">${chargeIcon}${userData.battery ?? 100}%</span>
                <span class="marker-dwell-pill ${!isOnline ? 'offline' : ''}">${dwellText}</span>
            </div>
        </div>
    `;

    return L.divIcon({
        className: `custom-zenly-icon ${isCluster ? 'cluster-mini' : ''}`,
        html: html,
        iconSize: isCluster ? [44, 44] : [60, 60],
        iconAnchor: isCluster ? [22, 22] : [30, 30]
    });
}

// ==========================================
// Smart Meetup / Cluster Dispersal System
// When multiple people overlap in the same spot,
// shrink icons and arrange them side-by-side or in orbit
// ==========================================
let clusterDebounceTimer = null;

function adjustMarkerClusters() {
    if (!map) return;
    clearTimeout(clusterDebounceTimer);
    clusterDebounceTimer = setTimeout(runMarkerClustering, 50);
}

function runMarkerClustering() {
    if (!map) return;

    const entities = [];
    if (myProfile.lat != null && myProfile.lng != null && myMarker) {
        entities.push({
            id: 'self',
            isSelf: true,
            realLat: Number(myProfile.lat),
            realLng: Number(myProfile.lng),
            marker: myMarker,
            circle: myAccuracyCircle,
            data: myProfile
        });
    }

    const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();

    friendMarkers.forEach((item, id) => {
        if (!item.data || item.data.lat == null || item.data.lng == null || !item.marker) return;
        const fCodeUpper = (item.data.friendCode || item.data.id || '').trim().toUpperCase();
        if (myCodeUpper && fCodeUpper === myCodeUpper) return;
        if (myId && item.data.id === myId) return;

        entities.push({
            id: id,
            isSelf: false,
            realLat: Number(item.data.lat),
            realLng: Number(item.data.lng),
            marker: item.marker,
            circle: item.circle,
            data: item.data
        });
    });

    if (entities.length === 0) return;

    // Detect clusters: within 28 meters geographically OR within 46 pixels on screen
    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < entities.length; i++) {
        if (visited.has(i)) continue;
        visited.add(i);
        const cluster = [entities[i]];
        const ptI = map.latLngToLayerPoint([entities[i].realLat, entities[i].realLng]);

        for (let j = i + 1; j < entities.length; j++) {
            if (visited.has(j)) continue;
            const ptJ = map.latLngToLayerPoint([entities[j].realLat, entities[j].realLng]);
            const pxDist = ptI.distanceTo(ptJ);
            const geoDist = map.distance([entities[i].realLat, entities[i].realLng], [entities[j].realLat, entities[j].realLng]);

            if (geoDist <= 28 || pxDist <= 46) {
                visited.add(j);
                cluster.push(entities[j]);
            }
        }
        clusters.push(cluster);
    }

    clusters.forEach(cluster => {
        if (cluster.length === 1) {
            const ent = cluster[0];
            ent.marker.setLatLng([ent.realLat, ent.realLng]);
            ent.marker.setIcon(createZenlyIcon(ent.data, ent.isSelf, false));
            ent.marker.setZIndexOffset(ent.isSelf ? 1000 : 100);
        } else {
            // Cluster of 2 or more people in the exact same location!
            let sumX = 0, sumY = 0;
            cluster.forEach(ent => {
                const pt = map.latLngToLayerPoint([ent.realLat, ent.realLng]);
                sumX += pt.x;
                sumY += pt.y;
            });
            const centerX = sumX / cluster.length;
            const centerY = sumY / cluster.length;

            const N = cluster.length;
            cluster.forEach((ent, idx) => {
                let dx = 0, dy = 0;
                if (N === 2) {
                    // Side-by-side separation: -20px and +20px
                    dx = (idx === 0) ? -20 : 20;
                    dy = 0;
                } else {
                    // Circular orbit separation
                    const radius = 22 + (N - 2) * 3;
                    const angle = (idx * (2 * Math.PI / N)) - (Math.PI / 2);
                    dx = Math.round(radius * Math.cos(angle));
                    dy = Math.round(radius * Math.sin(angle));
                }

                const offsetPt = L.point(centerX + dx, centerY + dy);
                const offsetLatLng = map.layerPointToLatLng(offsetPt);
                ent.marker.setLatLng(offsetLatLng);
                ent.marker.setIcon(createZenlyIcon(ent.data, ent.isSelf, true));
                ent.marker.setZIndexOffset(500 + idx * 10);
            });
        }
    });
}

// Update or Create My Marker & Accuracy Radius Circle
function updateMyMarker() {
    if (!map || myProfile.lat == null) return;

    const latLng = [myProfile.lat, myProfile.lng];
    const accRadius = myProfile.accuracy || 20;

    if (!myMarker) {
        myMarker = L.marker(latLng, {
            icon: createZenlyIcon(myProfile, true, false),
            zIndexOffset: 1000,
            draggable: false
        }).addTo(map);

        // Accuracy Circle (Google Maps Blue Aura)
        myAccuracyCircle = L.circle(latLng, {
            radius: accRadius,
            color: myProfile.color || '#3b82f6',
            fillColor: myProfile.color || '#60a5fa',
            fillOpacity: 0.15,
            weight: 1.5
        }).addTo(map);

        map.setView(latLng, 16);
    } else {
        myMarker.setLatLng(latLng);
        myMarker.setIcon(createZenlyIcon(myProfile, true, false));

        if (myAccuracyCircle) {
            myAccuracyCircle.setLatLng(latLng);
            myAccuracyCircle.setRadius(accRadius);
        }
    }

    adjustMarkerClusters();
}

function setManualLocation(lat, lng, reason = '') {
    myProfile.lat = lat;
    myProfile.lng = lng;
    updateMyMarker();
    sendLocationUpdate();
    if (reason) showToast(reason);
}

// Socket Connection & Realtime Sync
function connectSocket() {
    socket = io({
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 10
    });

    socket.on('connect', () => {
        myId = socket.id;
        console.log('Terhubung ke server via socket:', myId);

        // Join room with my profile
        socket.emit('join', {
            name: myProfile.name,
            avatar: myProfile.avatar,
            color: myProfile.color,
            friendCode: myProfile.friendCode,
            lat: myProfile.lat,
            lng: myProfile.lng,
            accuracy: myProfile.accuracy,
            battery: myProfile.battery,
            charging: myProfile.charging,
            ghostMode: myProfile.ghostMode,
            invitedByCode: pendingMagicInviteCode || null
        });

        startWatchingLocation();

        // If an active session opened a Magic Invite Link, show greeting modal
        if (pendingMagicInviteCode) {
            handleMagicInviteForActiveUser(pendingMagicInviteCode);
            try {
                const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            } catch (e) {}
            pendingMagicInviteCode = null;
        }
    });

    // Server confirmed my profile & assigned friend code
    socket.on('join-confirmed', (data) => {
        if (data.friendCode) {
            myProfile.friendCode = data.friendCode;
            localStorage.setItem('zenloc_my_friend_code', data.friendCode);
            const codeValEl = document.getElementById('my-friend-code-val');
            if (codeValEl) codeValEl.innerText = data.friendCode;
        }
    });

    // Initial Confirmed Friends & Pending Requests from server
    socket.on('init-friends-data', ({ friends, requests }) => {
        confirmedFriends.clear();
        incomingRequests.clear();

        if (Array.isArray(friends)) {
            friends.forEach(f => {
                if (f.friendCode !== myProfile.friendCode) {
                    confirmedFriends.set(f.friendCode, f);
                    upsertFriend(f);
                }
            });
        }

        if (Array.isArray(requests)) {
            requests.forEach(r => {
                incomingRequests.set(r.fromCode, r);
            });
        }

        updateFriendUI();
        if (typeof renderRequestsList === 'function') renderRequestsList();
    });

    // Incoming friend request from another user
    socket.on('friend-request-received', (reqData) => {
        incomingRequests.set(reqData.fromCode, reqData);
        if (typeof renderRequestsList === 'function') renderRequestsList();
        updateFriendUI();
        showToast(`${reqData.fromName} [${reqData.fromCode}] mengirim permintaan pertemanan!`);
    });

    // Friend request accepted (mutual connection established)
    socket.on('friend-request-accepted', ({ friend }) => {
        if (!friend) return;
        confirmedFriends.set(friend.friendCode, friend);
        incomingRequests.delete(friend.friendCode);
        upsertFriend(friend);
        updateFriendUI();
        if (typeof renderRequestsList === 'function') renderRequestsList();
        showToast(`Sekarang Anda berteman dengan ${friend.name}!`);
    });

    // Friend removed
    socket.on('friend-removed', ({ friendCode, friendName }) => {
        confirmedFriends.delete(friendCode);
        for (const [id, item] of friendMarkers.entries()) {
            if (item.data && item.data.friendCode === friendCode) {
                map.removeLayer(item.marker);
                if (item.circle) map.removeLayer(item.circle);
                friendMarkers.delete(id);
                break;
            }
        }
        updateFriendUI();
        showToast(`Teman ${friendName || friendCode} telah dihapus.`);
    });

    // Existing users list (only show confirmed friends or mock bots on map)
    socket.on('init-users', (usersList) => {
        usersList.forEach(user => {
            if (user.id !== myId && (user.isMock || confirmedFriends.has(user.friendCode))) {
                upsertFriend(user);
            }
        });
        updateFriendUI();
    });

    // New friend joined
    socket.on('user-joined', (user) => {
        if (user.id !== myId) {
            if (user.isMock || confirmedFriends.has(user.friendCode)) {
                upsertFriend(user);
                updateFriendUI();
                showToast(`${user.name} online!`);
            }
        }
    });

    // Location updated
    socket.on('location-updated', (data) => {
        if (data.id === myId) return;

        const friend = friendMarkers.get(data.id);
        if (friend) {
            Object.assign(friend.data, data);
            friend.data.online = true;
            if (data.lat && data.lng) {
                friend.marker.setLatLng([data.lat, data.lng]);
                friend.marker.setIcon(createZenlyIcon(friend.data, false));
                if (friend.circle && data.accuracy) {
                    friend.circle.setLatLng([data.lat, data.lng]);
                    friend.circle.setRadius(data.accuracy);
                }
            }
            updateFriendUI();
        }
    });

    // Friend offline (Last Seen mode ala Zenly)
    socket.on('user-offline', (data) => {
        const friend = friendMarkers.get(data.id);
        if (friend) {
            friend.data.online = false;
            friend.data.lastSeen = data.lastSeen || Date.now();
            friend.marker.setIcon(createZenlyIcon(friend.data, false));
            updateFriendUI();
            showToast(`${friend.data.name} sedang offline.`);
        }
    });

    // Friend left
    socket.on('user-left', (userId) => {
        const friend = friendMarkers.get(userId);
        if (friend) {
            friend.data.online = false;
            friend.data.lastSeen = Date.now();
            friend.marker.setIcon(createZenlyIcon(friend.data, false));
            updateFriendUI();
        }
    });

    // Reaction received
    socket.on('reaction-received', (data) => {
        triggerReactionAnimation(data.targetId, data.emoji, data.senderName);
    });

    // Friend updated their profile (Custom Name / Avatar / Color / Code)
    socket.on('user-profile-updated', (data) => {
        if (data.id === myId) return;
        const friend = friendMarkers.get(data.id);
        if (friend) {
            Object.assign(friend.data, data);
            friend.marker.setIcon(createZenlyIcon(friend.data, false));
            updateFriendUI();
            showToast(`${data.name} memperbarui profil!`);
        }
    });

    // OTW Events
    socket.on('otw-started', (otwData) => {
        if (otwData.toId === myId) {
            showToast(`${otwData.fromName} sedang OTW ke lokasi Anda! (ETA: ${otwData.etaMinutes} mnt)`);
            renderRouteOnMap(otwData.routeCoords);
            const banner = document.getElementById('otw-banner');
            document.getElementById('otw-eta-text').innerText = `${otwData.etaMinutes} Menit`;
            document.getElementById('otw-dist-text').innerText = `(${otwData.distanceKm} km)`;
            document.getElementById('otw-desc-text').innerText = `${otwData.fromName} sedang OTW ke Anda`;
            const playBtn = document.getElementById('btn-start-drive');
            if (playBtn) playBtn.classList.add('hidden');
            banner.classList.remove('hidden');
        }
    });

    socket.on('otw-cancelled', (data) => {
        clearOtwRoute();
        showToast('Rute OTW telah diakhiri.');
    });

    socket.on('otw-arrived', (data) => {
        clearOtwRoute();
        showToast(`${data.fromName} telah sampai di tujuan!`);
    });

    // Meetup Invitation Received
    socket.on('meetup-invite-received', (inviteData) => {
        if (inviteData.toId === myId) {
            handleIncomingMeetupInvite(inviteData);
        }
    });

    // Meetup Response Received
    socket.on('meetup-response-received', (responseData) => {
        if (responseData.toId === myId) {
            handleMeetupResponse(responseData);
        }
    });

    // Chat Message Received
    socket.on('chat-received', (chatData) => {
        handleIncomingChatMessage(chatData);
    });
}

let locationSyncInterval = null;
let isSyncingLocation = false;

async function syncFriendsAndLocation() {
    if (isSyncingLocation) return;
    const myCode = myProfile.friendCode;
    if (!myCode) return;

    isSyncingLocation = true;
    try {
        const payload = {
            friendCode: myCode,
            lat: myProfile.lat,
            lng: myProfile.lng,
            battery: myProfile.battery !== undefined ? myProfile.battery : 100,
            ghostMode: myProfile.ghostMode ? 1 : 0
        };

        const res = await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.friends)) {
                const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();
                const activeFriendCodes = new Set();

                data.friends.forEach(f => {
                    const fCodeUpper = (f.friendCode || '').trim().toUpperCase();
                    if (!fCodeUpper || (myCodeUpper && fCodeUpper === myCodeUpper)) {
                        return; // Jangan masukkan akun diri sendiri sebagai teman
                    }
                    activeFriendCodes.add(f.friendCode);

                    const friendObj = {
                        id: f.friendCode,
                        friendCode: f.friendCode,
                        name: f.name,
                        avatar: f.avatar,
                        color: f.color,
                        lat: f.lat,
                        lng: f.lng,
                        battery: f.battery !== undefined ? f.battery : 100,
                        ghostMode: !!f.ghostMode,
                        online: true,
                        accuracy: 20
                    };
                    confirmedFriends.set(f.friendCode, friendObj);
                    upsertFriend(friendObj);
                });

                // Bersihkan teman di confirmedFriends yang sudah tidak ada di server
                for (const [code] of confirmedFriends.entries()) {
                    if (!activeFriendCodes.has(code)) {
                        confirmedFriends.delete(code);
                    }
                }

                // Bersihkan marker teman lama atau diri sendiri dari peta
                for (const [id, item] of friendMarkers.entries()) {
                    const fCode = item.data ? (item.data.friendCode || item.data.id) : id;
                    const fCodeUpper = (fCode || '').trim().toUpperCase();
                    if (!activeFriendCodes.has(fCode) || (myCodeUpper && fCodeUpper === myCodeUpper)) {
                        if (item.marker) map.removeLayer(item.marker);
                        if (item.circle) map.removeLayer(item.circle);
                        friendMarkers.delete(id);
                    }
                }

                updateFriendUI();
            }
        }
    } catch (e) {
    } finally {
        isSyncingLocation = false;
    }
}

function startCloudflareSync() {
    syncFriendsAndLocation();
    if (!locationSyncInterval) {
        locationSyncInterval = setInterval(syncFriendsAndLocation, 3500);
    }
}

function sendLocationUpdate() {
    if (myProfile.lat != null && myProfile.lng != null) {
        logLocationToHistory(myProfile.lat, myProfile.lng, myProfile.speed || 0);
    }

    checkProximityAlert();

    // Sync to Cloudflare D1
    syncFriendsAndLocation();

    // Also emit if socket is connected
    if (socket && socket.connected) {
        socket.emit('update-location', {
            lat: myProfile.lat,
            lng: myProfile.lng,
            accuracy: myProfile.accuracy,
            speed: myProfile.speed,
            heading: myProfile.heading,
            battery: myProfile.battery,
            charging: myProfile.charging,
            ghostMode: myProfile.ghostMode
        });
    }
}

// Add or Update Friend Marker
function upsertFriend(userData) {
    if (!userData || !userData.lat || !userData.lng) return;
    if (!userData.id) userData.id = userData.friendCode || userData.username;
    if (userData.battery === undefined) userData.battery = 100;

    // JANGAN PERNAH menambahkan diri sendiri ke friendMarkers
    const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();
    const userCodeUpper = (userData.friendCode || userData.id || '').trim().toUpperCase();
    if (myCodeUpper && userCodeUpper === myCodeUpper) return;
    if (myId && userData.id === myId) return;

    const latLng = [userData.lat, userData.lng];
    const accRadius = userData.accuracy || 20;

    if (friendMarkers.has(userData.id)) {
        const item = friendMarkers.get(userData.id);
        item.data = userData;
        item.marker.setLatLng(latLng);
        item.marker.setIcon(createZenlyIcon(userData, false));
        if (item.circle) {
            item.circle.setLatLng(latLng);
            item.circle.setRadius(accRadius);
        }
    } else {
        const marker = L.marker(latLng, {
            icon: createZenlyIcon(userData, false)
        }).addTo(map);

        const circle = L.circle(latLng, {
            radius: accRadius,
            color: userData.color || '#ec4899',
            fillColor: userData.color || '#ec4899',
            fillOpacity: 0.12,
            weight: 1.2
        }).addTo(map);

        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            openReactionBar(userData.id, userData.name);
        });

        friendMarkers.set(userData.id, {
            data: userData,
            marker: marker,
            circle: circle
        });
    }

    adjustMarkerClusters();
}

// Update Friends Drawer & Badge UI
// Toggle Favorite Friend (Pin to Top)
window.toggleFavoriteFriend = function(friendId) {
    if (favoriteFriendIds.has(friendId)) {
        favoriteFriendIds.delete(friendId);
    } else {
        favoriteFriendIds.add(friendId);
    }
    localStorage.setItem('zenloc_favorites', JSON.stringify(Array.from(favoriteFriendIds)));
    updateFriendUI();
};

// Update Friends Drawer & Badge UI
function updateFriendUI() {
    const listEl = document.getElementById('friends-list');
    const badgeEl = document.getElementById('friend-count-badge');
    const onlineEl = document.getElementById('online-count');
    const tabCountEl = document.getElementById('friends-tab-count');

    const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();

    // Hapus diri sendiri jika sempat masuk ke friendMarkers
    for (const [id, item] of friendMarkers.entries()) {
        if (!item.data) continue;
        const fCodeUpper = (item.data.friendCode || item.data.id || '').trim().toUpperCase();
        if ((myCodeUpper && fCodeUpper === myCodeUpper) || (myId && item.data.id === myId)) {
            if (item.marker) map.removeLayer(item.marker);
            if (item.circle) map.removeLayer(item.circle);
            friendMarkers.delete(id);
        }
    }

    let onlineCount = 0;
    const validFriends = [];
    friendMarkers.forEach(item => {
        if (!item.data) return;
        const fCodeUpper = (item.data.friendCode || item.data.id || '').trim().toUpperCase();
        if (myCodeUpper && fCodeUpper === myCodeUpper) return;
        if (myId && item.data.id === myId) return;

        validFriends.push(item);
        if (item.data.online !== false) onlineCount++;
    });

    if (badgeEl) badgeEl.remove();
    if (onlineEl) onlineEl.innerText = onlineCount;
    if (tabCountEl) tabCountEl.innerText = validFriends.length;

    if (validFriends.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><i data-lucide="user-plus" class="empty-icon"></i><p>Belum ada teman terhubung.<br>Bagikan tautan undangan 1-klik di atas untuk mulai terhubung!</p></div>`;
        refreshLucideIcons();
        return;
    }

    // Sort: 1. Favorite first, 2. Online first (by distance), 3. Offline
    const sortedFriends = validFriends.sort((a, b) => {
        const isFavA = favoriteFriendIds.has(a.data.id);
        const isFavB = favoriteFriendIds.has(b.data.id);
        if (isFavA && !isFavB) return -1;
        if (!isFavA && isFavB) return 1;

        const onlineA = a.data.online !== false;
        const onlineB = b.data.online !== false;
        if (onlineA && !onlineB) return -1;
        if (!onlineA && onlineB) return 1;

        if (myProfile.lat && myProfile.lng && a.data.lat && b.data.lat) {
            const distA = map.distance([myProfile.lat, myProfile.lng], [a.data.lat, a.data.lng]);
            const distB = map.distance([myProfile.lat, myProfile.lng], [b.data.lat, b.data.lng]);
            return distA - distB;
        }
        return 0;
    });

    let html = '';
    sortedFriends.forEach((item) => {
        const friend = item.data;
        const isFav = favoriteFriendIds.has(friend.id);
        const isOnline = friend.online !== false;

        let distStr = '';
        if (myProfile.lat && myProfile.lng && friend.lat && friend.lng) {
            const dist = map.distance([myProfile.lat, myProfile.lng], [friend.lat, friend.lng]);
            distStr = dist > 1000 ? `${(dist / 1000).toFixed(1)} km` : `${Math.round(dist)} m`;
        }

        const motionIcon = friend.speed > 3 ? '<i data-lucide="car"></i>' : '<i data-lucide="circle-dot"></i>';
        const motionStatus = friend.speed > 3 ? `${friend.speed} km/h` : 'Diam';
        const dwellIcon = isOnline ? '<i data-lucide="clock"></i>' : '<i data-lucide="moon"></i>';
        const dwellStr = isOnline
            ? `${formatDwellTime(friend.stationarySince, null, true)} di sini`
            : formatDwellTime(friend.stationarySince, friend.lastSeen, false);
        const battIcon = friend.charging ? '<i data-lucide="battery-charging"></i>' : '<i data-lucide="battery"></i>';

        const codeBadge = friend.friendCode
            ? `<span style="font-size: 10px; background: rgba(18, 36, 68, 0.85); border: 1px solid var(--accent-chartreuse); color: var(--accent-chartreuse); padding: 1px 6px; border-radius: 6px; margin-left: 4px; font-weight: 800;">${friend.friendCode}</span>`
            : '';

        const ghostBadge = friend.ghostMode
            ? `<span title="Ghost Mode Aktif" style="margin-left: 4px; opacity: 0.8;"><i data-lucide="shield" style="width:13px;height:13px;color:#a855f7;"></i></span>`
            : '';

        html += `
            <div class="friend-item ${!isOnline ? 'offline' : ''}" onclick="focusFriend('${friend.id}')">
                <div class="friend-left">
                    <div class="friend-avatar" style="border-color: ${isOnline ? (friend.color || '#BEE354') : '#64748b'}">
                        ${renderAvatarHtml(friend.avatar, friend.name)}
                    </div>
                    <div class="friend-details">
                        <div class="friend-info">
                            <div class="friend-name-row" style="display: flex; align-items: center; gap: 6px;">
                                <strong style="font-size: 14px; color: #fff;">${friend.name}</strong>
                                ${ghostBadge}
                                ${isOnline ? '<span class="status-indicator online"></span>' : '<span class="status-indicator offline"></span>'}
                            </div>
                            <div class="friend-status-row" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px; font-size: 12px; color: #94a3b8;">
                                <span class="friend-motion" style="display: inline-flex; align-items: center; gap: 4px;">
                                    ${motionIcon} ${motionStatus} • ${distStr || '0 m'}
                                </span>
                                ${dwellStr ? `
                                    <span class="friend-status-dot">•</span>
                                    <div class="friend-dwell-sub ${!isOnline ? 'offline' : ''}" style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; margin-top: 0;">
                                        ${dwellIcon} <span>${dwellStr}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        <div class="friend-actions-right" style="display: flex; align-items: center; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
                            <button class="btn-fav-star ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoriteFriend('${friend.id}')" title="${isFav ? 'Hapus dari Favorit' : 'Sematkan ke Atas (Favorit)'}">
                                <i data-lucide="star" style="${isFav ? 'color:#fbbf24;fill:#fbbf24;' : ''}"></i>
                            </button>
                            ${isOnline ? `
                                <button class="action-btn" onclick="event.stopPropagation(); startOtwToFriend('${friend.id}', '${friend.name}')" style="padding: 5px 12px; background: #2563eb; border-color: #60a5fa; color: #fff; font-size: 11px;">
                                    <i data-lucide="navigation"></i> OTW
                                </button>
                                <button class="action-btn" onclick="event.stopPropagation(); openPrivateChatWith('${friend.friendCode || friend.id}')" style="padding: 5px 10px; font-size: 11px;" title="Buka Chat">
                                    <i data-lucide="message-circle"></i> Chat
                                </button>
                            ` : `
                                <span style="font-size: 11px; color: #94a3b8; font-style: italic;">Offline</span>
                            `}
                            <button class="action-btn btn-remove-friend-action" onclick="event.stopPropagation(); confirmRemoveFriend('${friend.friendCode}', '${friend.name}')" title="Hapus Pertemanan">
                                <i data-lucide="user-minus"></i> Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
    refreshLucideIcons();

    // Check Proximity Alert (< 200m)
    checkProximityAlert();

    // Refresh Private Chat Target dropdown
    refreshChatTargetDropdown();
}

window.focusFriend = function(friendId) {
    const item = friendMarkers.get(friendId);
    if (item && item.data.lat && item.data.lng) {
        map.flyTo([item.data.lat, item.data.lng], 16, { animate: true, duration: 1 });
        openReactionBar(friendId, item.data.name);
    }
};

// Emoji Reaction Logic
function openReactionBar(targetId, targetName) {
    activeReactionTargetId = targetId;
    const bar = document.getElementById('reaction-bar');
    const label = document.getElementById('reaction-target-text');
    const dwellBadge = document.getElementById('reaction-dwell-text');

    // Tutup drawer lain agar tidak bertumpukan di layar
    const friendsDrawer = document.getElementById('friends-drawer');
    if (friendsDrawer) friendsDrawer.classList.add('collapsed');
    const histDrawer = document.getElementById('history-drawer');
    if (histDrawer) histDrawer.classList.add('collapsed');
    const chatDrawer = document.getElementById('chat-drawer');
    if (chatDrawer) chatDrawer.classList.add('collapsed');

    label.innerText = targetName;

    const target = friendMarkers.get(targetId);
    if (target && dwellBadge) {
        const isOnline = target.data.online !== false;
        dwellBadge.innerHTML = isOnline
            ? `<i data-lucide="clock" style="width: 12px; height: 12px; vertical-align: middle; margin-right: 3px;"></i> ${formatDwellTime(target.data.stationarySince, null, true)} di lokasi ini`
            : `<i data-lucide="moon" style="width: 12px; height: 12px; vertical-align: middle; margin-right: 3px;"></i> ${formatDwellTime(target.data.stationarySince, target.data.lastSeen, false)}`;
        refreshLucideIcons();
    }
    bar.classList.remove('hidden');
}

function closeReactionBar() {
    activeReactionTargetId = null;
    document.getElementById('reaction-bar').classList.add('hidden');
}

const FLUENT_3D_EMOJIS = {
    '❤️': 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Red%20heart/3D/red_heart_3d.png',
    '🔥': 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Fire/3D/fire_3d.png',
    '⚡': 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/High%20voltage/3D/high_voltage_3d.png',
    '🎉': 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Party%20popper/3D/party_popper_3d.png',
    '👋': 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Waving%20hand/Default/3D/waving_hand_3d_default.png'
};

function triggerReactionAnimation(targetId, emoji, senderName) {
    let latLng;
    if (targetId === myId) {
        latLng = [myProfile.lat, myProfile.lng];
        showToast(`${senderName} mengirim reaksi ${emoji} ke kamu!`);
    } else {
        const target = friendMarkers.get(targetId);
        if (target) {
            latLng = [target.data.lat, target.data.lng];
        }
    }

    if (!latLng || !map) return;

    // Convert latLng to screen coordinates
    const point = map.latLngToContainerPoint(latLng);

    // Spawn burst particles
    const container = document.getElementById('reaction-particles-container');
    const emojiImg = FLUENT_3D_EMOJIS[emoji];

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'reaction-particle';
        if (emojiImg) {
            particle.innerHTML = `<img src="${emojiImg}" alt="${emoji}" />`;
        } else {
            particle.innerText = emoji;
        }
        particle.style.left = `${point.x - 22 + (Math.random() - 0.5) * 50}px`;
        particle.style.top = `${point.y - 22}px`;
        particle.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 90}px`);

        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1800);
    }
}

// Bot Simulation Logic (Modern Avatars)
const BOT_PROFILES = [
    { name: 'Rian Explorer', avatar: 'astro', color: '#10b981', speed: 12 },
    { name: 'Nadia Cyber', avatar: 'cyber', color: '#f59e0b', speed: 45 },
    { name: 'Fajar Zen', avatar: 'zen', color: '#ec4899', speed: 0 },
    { name: 'Siti Kitsune', avatar: 'fox', color: '#06b6d4', speed: 28 },
    { name: 'Dimas Gamer', avatar: 'gamer', color: '#8b5cf6', speed: 0 }
];

function addMockFriend() {
    const template = BOT_PROFILES[mockBots.length % BOT_PROFILES.length];
    const offsetAngle = Math.random() * 2 * Math.PI;
    const distance = 0.005 + Math.random() * 0.008; // ~500m to 1.2km away

    const mockLat = (myProfile.lat || -6.2088) + Math.sin(offsetAngle) * distance;
    const mockLng = (myProfile.lng || 106.8456) + Math.cos(offsetAngle) * distance;

    const bot = {
        name: template.name,
        avatar: template.avatar,
        color: template.color,
        lat: mockLat,
        lng: mockLng,
        speed: template.speed,
        heading: Math.floor(Math.random() * 360),
        battery: Math.floor(40 + Math.random() * 55),
        angle: offsetAngle,
        radius: distance
    };

    mockBots.push(bot);
    socket.emit('add-mock-friend', bot);
    showToast(`${bot.name} ditambahkan ke peta!`);

    // Start bot motion loop if not already running
    if (!window.botMotionInterval) {
        startBotMotion();
    }
}

function startBotMotion() {
    window.botMotionInterval = setInterval(() => {
        // Move bots in slight orbits
        mockBots.forEach(bot => {
            if (bot.speed > 0) {
                bot.angle += (bot.speed / 1000);
                const newLat = (myProfile.lat || -6.2088) + Math.sin(bot.angle) * bot.radius;
                const newLng = (myProfile.lng || 106.8456) + Math.cos(bot.angle) * bot.radius;

                // Find corresponding user id in friendMarkers
                friendMarkers.forEach((item, id) => {
                    if (item.data.name === bot.name) {
                        socket.emit('mock-location-update', {
                            id: id,
                            lat: newLat,
                            lng: newLng,
                            speed: bot.speed,
                            heading: Math.floor((bot.angle * 180 / Math.PI) % 360),
                            battery: Math.max(10, bot.battery - 1)
                        });
                    }
                });
            }
        });
    }, 2500);
}

// Populate Modern Avatar Selectors in Join & Settings Modals
function populateAvatarSelectors() {
    const selectors = [
        document.getElementById('join-avatar-selector'),
        document.getElementById('settings-avatar-selector')
    ];
    selectors.forEach(container => {
        if (!container) return;
        let html = '';
        for (const [key, item] of Object.entries(MODERN_AVATARS)) {
            const isActive = (myProfile.avatar === key);
            html += `
                <button type="button" class="avatar-opt ${isActive ? 'active' : ''}" data-avatar="${key}" title="${item.name}">
                    ${item.svg}
                </button>
            `;
        }
        container.innerHTML = html;
    });

    const amelBadge = document.getElementById('join-preset-amel-badge');
    if (amelBadge && MODERN_AVATARS['sakura']) {
        amelBadge.innerHTML = MODERN_AVATARS['sakura'].svg;
    }
    const ilpradBadge = document.getElementById('join-preset-ilprad-badge');
    if (ilpradBadge && MODERN_AVATARS['cyber']) {
        ilpradBadge.innerHTML = MODERN_AVATARS['cyber'].svg;
    }
}

// UI Event Handlers
function initUI() {
    populateAvatarSelectors();
    refreshLucideIcons();

    // Inisialisasi tampilan profil di topbar
    const myNameEl = document.getElementById('my-name');
    const myAvatarEl = document.getElementById('my-avatar');
    const myCodeEl = document.getElementById('my-friend-code-val');
    if (myNameEl && myProfile.name) myNameEl.innerText = myProfile.name;
    if (myAvatarEl && myProfile.avatar) {
        myAvatarEl.innerHTML = renderAvatarHtml(myProfile.avatar, myProfile.name);
        myAvatarEl.style.background = myProfile.color || '#BEE354';
        myAvatarEl.style.boxShadow = `0 0 14px ${myProfile.color || '#BEE354'}`;
    }
    if (myCodeEl && myProfile.friendCode) myCodeEl.innerText = myProfile.friendCode;

    // Tombol Bulat Pengaturan & Profil (Membuka Settings & Profile Hub)
    const btnOpenSettings = document.getElementById('btn-open-settings');
    if (btnOpenSettings) {
        btnOpenSettings.addEventListener('click', () => {
            if (typeof openSettingsModal === 'function') {
                openSettingsModal();
            } else {
                const modal = document.getElementById('settings-modal');
                if (modal) modal.classList.remove('hidden');
            }
        });
    }

    // Ghost Mode Toggle (Legacy topbar support with guard)
    const btnGhost = document.getElementById('btn-ghost');
    if (btnGhost) {
        btnGhost.addEventListener('click', () => {
            myProfile.ghostMode = !myProfile.ghostMode;
            btnGhost.classList.toggle('active', myProfile.ghostMode);
            btnGhost.querySelector('.btn-text').innerText = myProfile.ghostMode ? 'Ghost: ON' : 'Ghost: OFF';

            updateMyMarker();
            sendLocationUpdate();
            showToast(myProfile.ghostMode ? 'Ghost Mode aktif! Lokasi disamarkan ±500m.' : 'Ghost Mode non-aktif. Lokasi akurat.');
        });
    }

    // Toggle Map Layer (Roadmap / Satellite) with guard
    const btnLayer = document.getElementById('btn-toggle-layer');
    if (btnLayer) {
        btnLayer.addEventListener('click', toggleMapLayer);
    }

    // Toggle Breadcrumb Trail Visibility with guard
    const btnTrail = document.getElementById('btn-toggle-trail');
    if (btnTrail) {
        btnTrail.classList.toggle('active', isTrailVisible);
        btnTrail.addEventListener('click', () => {
            isTrailVisible = !isTrailVisible;
            localStorage.setItem('zenloc_trail_visible', isTrailVisible);
            btnTrail.classList.toggle('active', isTrailVisible);
            renderCurrentDayTrails();
            showToast(isTrailVisible ? 'Jejak riwayat ditampilkan di peta.' : 'Jejak riwayat disembunyikan.');
        });
    }

    // 7-Day History Drawer Toggle with guard
    const histDrawer = document.getElementById('history-drawer');
    const btnOpenHist = document.getElementById('btn-open-history');
    if (btnOpenHist && histDrawer) {
        btnOpenHist.addEventListener('click', () => {
            const willOpen = histDrawer.classList.contains('collapsed');
            if (willOpen) {
                if (typeof closeReactionBar === 'function') closeReactionBar();
                const friendsDrawer = document.getElementById('friends-drawer');
                if (friendsDrawer) friendsDrawer.classList.add('collapsed');
                const chatDrawer = document.getElementById('chat-drawer');
                if (chatDrawer) chatDrawer.classList.add('collapsed');
                loadHistoryForDate(selectedHistoryDateKey || getTodayDateKey());
            }
            histDrawer.classList.toggle('collapsed');
        });
    }

    const btnCloseHist = document.getElementById('btn-close-history');
    if (btnCloseHist && histDrawer) {
        btnCloseHist.addEventListener('click', () => {
            histDrawer.classList.add('collapsed');
        });
    }

    const handleHist = document.getElementById('history-drawer-handle');
    if (handleHist && histDrawer) {
        handleHist.addEventListener('click', () => {
            histDrawer.classList.toggle('collapsed');
        });
    }

    // Locate Me
    const btnLocate = document.getElementById('btn-locate');
    if (btnLocate) {
        btnLocate.addEventListener('click', () => {
            if (myProfile.lat && myProfile.lng) {
                map.flyTo([myProfile.lat, myProfile.lng], 16, { animate: true });
            }
        });
    }

    // Accuracy Pill Click: re-center map to my location
    const accPill = document.getElementById('accuracy-pill');
    if (accPill) {
        accPill.style.cursor = 'pointer';
        accPill.addEventListener('click', () => {
            if (map && myProfile.lat && myProfile.lng) {
                map.flyTo([myProfile.lat, myProfile.lng], 16, { animate: true, duration: 0.8 });
                showToast(`Lokasi Anda: ${myProfile.lat.toFixed(4)}, ${myProfile.lng.toFixed(4)}`);
            }
        });
    }

    // Add Bot with guard
    const btnAddBot = document.getElementById('btn-add-bot');
    if (btnAddBot) {
        btnAddBot.addEventListener('click', () => {
            addMockFriend();
        });
    }

    // Friends Drawer Toggle
    const drawer = document.getElementById('friends-drawer');
    const btnToggleFriends = document.getElementById('btn-toggle-friends');
    if (btnToggleFriends && drawer) {
        btnToggleFriends.addEventListener('click', () => {
            const willOpen = drawer.classList.contains('collapsed');
            if (willOpen) {
                if (typeof closeReactionBar === 'function') closeReactionBar();
                if (histDrawer) histDrawer.classList.add('collapsed');
                const chatDrawer = document.getElementById('chat-drawer');
                if (chatDrawer) chatDrawer.classList.add('collapsed');
            }
            drawer.classList.toggle('collapsed');
        });
    }

    const drawerHandle = document.getElementById('drawer-handle');
    if (drawerHandle && drawer) {
        drawerHandle.addEventListener('click', () => {
            drawer.classList.toggle('collapsed');
        });
    }

    const btnMinDrawer = document.getElementById('btn-minimize-drawer');
    if (btnMinDrawer && drawer) {
        btnMinDrawer.addEventListener('click', () => {
            drawer.classList.add('collapsed');
        });
    }

    // Reaction Emoji Buttons
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.getAttribute('data-emoji');
            if (activeReactionTargetId && socket) {
                socket.emit('send-reaction', {
                    targetId: activeReactionTargetId,
                    emoji: emoji
                });
                triggerReactionAnimation(activeReactionTargetId, emoji, myProfile.name);
            }
        });
    });

    document.getElementById('btn-close-reaction').addEventListener('click', closeReactionBar);

    // OTW Button in Reaction Bar
    const btnTriggerOtw = document.getElementById('btn-trigger-otw');
    if (btnTriggerOtw) {
        btnTriggerOtw.addEventListener('click', () => {
            if (activeReactionTargetId) {
                const target = friendMarkers.get(activeReactionTargetId);
                const targetName = target ? target.data.name : 'Teman';
                startOtwToFriend(activeReactionTargetId, targetName);
            }
        });
    }

    // OTW Banner Actions (Recenter Route & Cancel OTW)
    const btnRecenterOtw = document.getElementById('btn-recenter-otw');
    if (btnRecenterOtw) {
        btnRecenterOtw.addEventListener('click', () => {
            if (activeOtwRoute && activeOtwRoute.casing && map) {
                map.fitBounds(activeOtwRoute.casing.getBounds(), { padding: [60, 60], maxZoom: 16 });
                showToast('Tampilan peta dipusatkan ke rute OTW');
            } else if (map && myProfile.lat && myProfile.lng) {
                map.flyTo([myProfile.lat, myProfile.lng], 16);
            }
        });
    }

    const btnCancelOtw = document.getElementById('btn-cancel-otw');
    if (btnCancelOtw) {
        btnCancelOtw.addEventListener('click', () => {
            if (socket && socket.connected && activeOtwData) {
                socket.emit('cancel-otw', { fromId: myId, toId: activeOtwData.targetId });
            }
            clearOtwRoute();
            showToast('Rute OTW diakhiri.');
        });
    }

    // Meetup Trigger from Reaction Bar
    const btnTriggerMeetup = document.getElementById('btn-trigger-meetup');
    if (btnTriggerMeetup) {
        btnTriggerMeetup.addEventListener('click', () => {
            if (activeReactionTargetId) {
                const target = friendMarkers.get(activeReactionTargetId);
                const targetName = target ? target.data.name : 'Teman';
                openMeetupModal(activeReactionTargetId, targetName);
            }
        });
    }

    // Proximity Banner Close Button
    const btnCloseProx = document.getElementById('btn-close-prox');
    if (btnCloseProx) {
        btnCloseProx.addEventListener('click', () => {
            document.getElementById('proximity-banner').classList.add('hidden');
            proxBannerDismissed = true;
        });
    }
}

// ==========================================
// OTW & Google Maps Routing Logic
// ==========================================

// Smooth curved road coordinates generator
function generateFallbackRoute(startLat, startLng, endLat, endLng) {
    const coords = [];
    const numPoints = 16;
    const dLat = endLat - startLat;
    const dLng = endLng - startLng;
    const perpLat = -dLng * 0.18;
    const perpLng = dLat * 0.18;

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const curve = 4 * t * (1 - t);
        const lat = startLat + dLat * t + perpLat * curve;
        const lng = startLng + dLng * t + perpLng * curve;
        coords.push([lat, lng]);
    }
    return coords;
}

// Fetch Road Route from OSRM or Fallback
async function fetchRoadRoute(startLat, startLng, endLat, endLng) {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
            const data = await res.json();
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coords = route.geometry.coordinates.map(pt => [pt[1], pt[0]]);
                const distanceKm = (route.distance / 1000).toFixed(1);
                const etaMinutes = Math.max(1, Math.round(route.duration / 60));
                return { coords, distanceKm, etaMinutes };
            }
        }
    } catch (e) {
        console.warn('Fallback routing used', e);
    }

    const coords = generateFallbackRoute(startLat, startLng, endLat, endLng);
    const distMeters = map.distance([startLat, startLng], [endLat, endLng]) * 1.32;
    const distanceKm = (distMeters / 1000).toFixed(1);
    const etaMinutes = Math.max(1, Math.round((distMeters / 1000) / 35 * 60));
    return { coords, distanceKm, etaMinutes };
}

// Render Google Maps Style Blue Route Polyline
function renderRouteOnMap(coords) {
    if (activeOtwRoute) {
        map.removeLayer(activeOtwRoute.casing);
        map.removeLayer(activeOtwRoute.inner);
        activeOtwRoute = null;
    }

    const casing = L.polyline(coords, {
        color: '#1e3a8a',
        weight: 9,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);

    const inner = L.polyline(coords, {
        color: '#3b82f6',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);

    activeOtwRoute = { casing, inner, coords };
    map.fitBounds(casing.getBounds(), { padding: [60, 60], maxZoom: 16 });
}

function clearOtwRoute() {
    if (activeOtwRoute) {
        map.removeLayer(activeOtwRoute.casing);
        map.removeLayer(activeOtwRoute.inner);
        activeOtwRoute = null;
    }
    activeOtwData = null;

    const banner = document.getElementById('otw-banner');
    if (banner) banner.classList.add('hidden');
}

// Start OTW to Friend (Real-world GPS navigation, 0 fake movements)
async function startOtwToFriend(targetId, targetName) {
    if (!myProfile.lat || !myProfile.lng) {
        showToast('Lokasi GPS Anda belum siap.');
        return;
    }

    const friend = friendMarkers.get(targetId);
    if (!friend || !friend.data.lat || !friend.data.lng) {
        showToast('Lokasi teman tidak ditemukan.');
        return;
    }

    closeReactionBar();
    showToast(`Menghitung rute ke ${targetName}...`);

    const routeData = await fetchRoadRoute(myProfile.lat, myProfile.lng, friend.data.lat, friend.data.lng);
    renderRouteOnMap(routeData.coords);

    activeOtwData = {
        targetId: targetId,
        targetName: targetName,
        coords: routeData.coords,
        distanceKm: routeData.distanceKm,
        etaMinutes: routeData.durationMinutes
    };

    const otwBanner = document.getElementById('otw-banner');
    const etaText = document.getElementById('otw-eta-text');
    const distText = document.getElementById('otw-dist-text');
    const descText = document.getElementById('otw-desc-text');

    if (etaText) etaText.innerText = `${routeData.durationMinutes} mnt`;
    if (distText) distText.innerText = `(${routeData.distanceKm} km)`;
    if (descText) descText.innerText = `Navigasi aktif ke ${targetName}`;
    if (otwBanner) otwBanner.classList.remove('hidden');
    refreshLucideIcons();

    // Broadcast OTW event via socket
    if (socket && socket.connected) {
        socket.emit('start-otw', {
            fromId: myId,
            fromName: myProfile.name,
            fromAvatar: myProfile.avatar,
            toId: targetId,
            toName: targetName,
            distanceKm: routeData.distanceKm,
            etaMinutes: routeData.durationMinutes,
            routeCoords: routeData.coords
        });
    }
}

window.startOtwToFriend = startOtwToFriend;

// Pre-registered accounts database (ilprad & carrjies)
const REGISTERED_ACCOUNTS = {
    'ilprad': {
        username: 'ilprad',
        password: 'map123',
        name: 'Ilprad',
        avatar: 'cyber',
        color: '#06b6d4',
        friendCode: 'ILPRAD-99',
        lat: -6.2088,
        lng: 106.8456
    },
    'carrjies': {
        username: 'carrjies',
        password: 'map123',
        name: 'Carrjies',
        avatar: 'fox',
        color: '#f59e0b',
        friendCode: 'CARRJIES-88',
        lat: -6.2146,
        lng: 106.8451
    }
};

// Load custom registered accounts from localStorage
try {
    const savedCustom = JSON.parse(localStorage.getItem('zenloc_custom_users') || '{}');
    Object.assign(REGISTERED_ACCOUNTS, savedCustom);
} catch (e) {}

// ========================================================
// WebAuthn Helper Utility for Face ID / Biometric Authentication
// ========================================================
const WEBAUTHN_STORAGE_KEY = 'zenloc_faceid_user';

function bufferFromBase64(base64) {
    const binaryString = window.atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function isFaceIdSupported() {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
        return false;
    }
    try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        return available ?? true;
    } catch (err) {
        console.warn('PublicKeyCredential check warning:', err);
        return true;
    }
}

function getSavedFaceIdUser() {
    try {
        const raw = localStorage.getItem(WEBAUTHN_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function registerFaceId(username) {
    try {
        if (typeof window === 'undefined' || !navigator.credentials || !window.PublicKeyCredential) {
            return { ok: false, error: 'Browser ini tidak mendukung API Biometrik / WebAuthn. Pastikan menggunakan Safari / Chrome terbaru dan bukan di tab Private / Incognito.' };
        }
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userIdBytes = new TextEncoder().encode(username);
        const hostname = window.location.hostname;

        const createOptions = {
            challenge: challenge.buffer,
            rp: {
                name: 'Locanear Friend Map',
                id: (hostname === 'localhost' || hostname === '127.0.0.1') ? undefined : hostname
            },
            user: {
                id: userIdBytes.buffer,
                name: username,
                displayName: `${username} (Locanear)`
            },
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 },   // ES256
                { type: 'public-key', alg: -257 }  // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'preferred',
                residentKey: 'preferred'
            },
            timeout: 60000,
            attestation: 'none'
        };

        const credential = await navigator.credentials.create({ publicKey: createOptions });
        if (!credential) {
            return { ok: false, error: 'Pendaftaran Face ID dibatalkan atau tidak terdeteksi.' };
        }

        const credentialId = bufferToBase64(credential.rawId);
        const data = {
            username,
            credentialId,
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem(WEBAUTHN_STORAGE_KEY, JSON.stringify(data));
        return { ok: true };
    } catch (err) {
        console.error('Face ID registration error:', err);
        if (err.name === 'NotAllowedError') {
            return { ok: false, error: 'Pemindaian Face ID dibatalkan atau tidak diizinkan oleh sistem.' };
        }
        if (err.name === 'SecurityError') {
            return { ok: false, error: 'Keamanan browser memblokir Face ID. Pastikan tidak membuka di tab Private / Incognito.' };
        }
        return { ok: false, error: err.message || 'Gagal mendaftarkan Face ID.' };
    }
}

async function authenticateWithFaceId() {
    try {
        const saved = getSavedFaceIdUser();
        if (!saved || !saved.credentialId) {
            return { ok: false, error: 'Belum ada Face ID yang didaftarkan pada perangkat ini.' };
        }
        if (typeof window === 'undefined' || !navigator.credentials) {
            return { ok: false, error: 'Browser ini tidak mendukung autentikasi biometrik.' };
        }
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const hostname = window.location.hostname;

        const getOptions = {
            challenge: challenge.buffer,
            rpId: (hostname === 'localhost' || hostname === '127.0.0.1') ? undefined : hostname,
            allowCredentials: [{
                id: bufferFromBase64(saved.credentialId),
                type: 'public-key',
                transports: ['internal']
            }],
            userVerification: 'preferred',
            timeout: 60000
        };

        const assertion = await navigator.credentials.get({ publicKey: getOptions });
        if (!assertion) {
            return { ok: false, error: 'Pemindaian Face ID gagal diverifikasi.' };
        }
        return {
            ok: true,
            username: saved.username
        };
    } catch (err) {
        console.error('Face ID authentication error:', err);
        if (err.name === 'NotAllowedError') {
            return { ok: false, error: 'Pemindaian Face ID dibatalkan atau wajah tidak cocok.' };
        }
        return { ok: false, error: err.message || 'Gagal memverifikasi Face ID.' };
    }
}

function removeFaceId() {
    localStorage.removeItem(WEBAUTHN_STORAGE_KEY);
}

// Global update hook for login modal Face ID button
let updateFaceIdLoginUI = () => {};

// Login & Authentication Modal
function initModal() {
    const modal = document.getElementById('join-modal');
    const authHeaderSubtitle = document.getElementById('auth-header-subtitle');

    // Login Form Elements
    const formLogin = document.getElementById('form-login');
    const inputUsername = document.getElementById('login-username');
    const inputPassword = document.getElementById('login-password');
    const btnTogglePwd = document.getElementById('btn-toggle-pwd');
    const pwdEyeIcon = document.getElementById('pwd-eye-icon');
    const btnLoginSubmit = document.getElementById('btn-login-submit');
    const btnFaceIdLogin = document.getElementById('btn-faceid-login');
    const faceIdDivider = document.getElementById('faceid-divider');
    const btnFaceIdText = document.getElementById('btn-faceid-text');
    const loginErrorAlert = document.getElementById('login-error-alert');
    const loginErrorText = document.getElementById('login-error-text');
    const btnOpenRegisterModal = document.getElementById('btn-open-register-modal');

    // Register Popup Modal Elements (Sesuai Gambar 2)
    const registerModal = document.getElementById('register-modal');
    const btnCloseRegisterModal = document.getElementById('btn-close-register-modal');
    const btnCancelRegister = document.getElementById('btn-cancel-register');
    const regUsername = document.getElementById('reg-username');
    const regPassword = document.getElementById('reg-password');
    const btnToggleRegPwd = document.getElementById('btn-toggle-reg-pwd');
    const regPwdEyeIcon = document.getElementById('reg-pwd-eye-icon');
    const regConfirmPassword = document.getElementById('reg-confirm-password');
    const btnToggleRegConfirmPwd = document.getElementById('btn-toggle-reg-confirm-pwd');
    const regConfirmPwdEyeIcon = document.getElementById('reg-confirm-pwd-eye-icon');
    const regSecurityQuestion = document.getElementById('reg-security-question');
    const regSecurityAnswer = document.getElementById('reg-security-answer');
    const regErrorAlert = document.getElementById('reg-error-alert');
    const regErrorText = document.getElementById('reg-error-text');
    const regSuccessAlert = document.getElementById('reg-success-alert');
    const regSuccessText = document.getElementById('reg-success-text');
    const btnRegisterSubmit = document.getElementById('btn-register-submit');

    // Rules indicators
    const ruleMinLen = document.getElementById('rule-min-len');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNum = document.getElementById('rule-num');

    // Toggle Login password visibility
    if (btnTogglePwd && inputPassword) {
        btnTogglePwd.addEventListener('click', () => {
            const isPassword = inputPassword.type === 'password';
            inputPassword.type = isPassword ? 'text' : 'password';
            if (pwdEyeIcon) {
                pwdEyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                refreshLucideIcons();
            }
        });
    }

    // Toggle Register password visibility
    if (btnToggleRegPwd && regPassword) {
        btnToggleRegPwd.addEventListener('click', () => {
            const isPassword = regPassword.type === 'password';
            regPassword.type = isPassword ? 'text' : 'password';
            if (regPwdEyeIcon) {
                regPwdEyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                refreshLucideIcons();
            }
        });
    }

    if (btnToggleRegConfirmPwd && regConfirmPassword) {
        btnToggleRegConfirmPwd.addEventListener('click', () => {
            const isPassword = regConfirmPassword.type === 'password';
            regConfirmPassword.type = isPassword ? 'text' : 'password';
            if (regConfirmPwdEyeIcon) {
                regConfirmPwdEyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                refreshLucideIcons();
            }
        });
    }

    // Live validation for password rules (Sesuai Gambar 2)
    if (regPassword) {
        regPassword.addEventListener('input', () => {
            const val = regPassword.value || '';
            const hasMinLen = val.length >= 6;
            const hasUpper = /[A-Z]/.test(val);
            const hasNum = /[0-9]/.test(val);

            if (ruleMinLen) ruleMinLen.classList.toggle('valid', hasMinLen);
            if (ruleUpper) ruleUpper.classList.toggle('valid', hasUpper);
            if (ruleNum) ruleNum.classList.toggle('valid', hasNum);
        });
    }

    // Open and Close Register Popup Modal
    if (btnOpenRegisterModal && registerModal) {
        btnOpenRegisterModal.addEventListener('click', () => {
            registerModal.classList.remove('hidden');
            if (regErrorAlert) regErrorAlert.classList.add('hidden');
            if (regSuccessAlert) regSuccessAlert.classList.add('hidden');
            if (regUsername) regUsername.focus();
            refreshLucideIcons();
        });
    }

    function closeRegisterPopup() {
        if (registerModal) registerModal.classList.add('hidden');
        if (inputUsername) inputUsername.focus();
    }

    if (btnCloseRegisterModal) {
        btnCloseRegisterModal.addEventListener('click', closeRegisterPopup);
    }
    if (btnCancelRegister) {
        btnCancelRegister.addEventListener('click', closeRegisterPopup);
    }

    function applyProfileAndJoin(name, avatar, color, friendCode = null, lat = null, lng = null, isAutoLogin = false) {
        // Reset marker teman lama jika berpindah akun
        friendMarkers.forEach(item => {
            if (item.marker) map.removeLayer(item.marker);
            if (item.circle) map.removeLayer(item.circle);
        });
        friendMarkers.clear();
        confirmedFriends.clear();
        incomingRequests.clear();

        myProfile.name = name;
        myProfile.avatar = avatar;
        myProfile.color = color || '#6366f1';

        const savedRealLat = parseFloat(localStorage.getItem('zenloc_last_lat') || '');
        const savedRealLng = parseFloat(localStorage.getItem('zenloc_last_lng') || '');
        if (!isNaN(savedRealLat) && !isNaN(savedRealLng)) {
            myProfile.lat = savedRealLat;
            myProfile.lng = savedRealLng;
        } else if (lat && lng) {
            myProfile.lat = lat;
            myProfile.lng = lng;
        }

        localStorage.setItem('zenloc_name', name);
        localStorage.setItem('zenloc_avatar', avatar);
        localStorage.setItem('zenloc_color', myProfile.color);

        if (friendCode) {
            myProfile.friendCode = friendCode;
            localStorage.setItem('zenloc_my_friend_code', friendCode);
        } else {
            const cleanName = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'USER';
            const codePattern = new RegExp(`^${cleanName}-\\d{2}$`);
            if (!myProfile.friendCode || !codePattern.test(myProfile.friendCode)) {
                const randNum = Math.floor(10 + Math.random() * 90);
                myProfile.friendCode = `${cleanName}-${randNum}`;
                localStorage.setItem('zenloc_my_friend_code', myProfile.friendCode);
            }
        }

        const codeValEl = document.getElementById('my-friend-code-val');
        if (codeValEl) codeValEl.innerText = myProfile.friendCode;

        const myNameEl = document.getElementById('my-name');
        const myAvatarEl = document.getElementById('my-avatar');
        if (myNameEl) myNameEl.innerText = name;
        if (myAvatarEl) {
            myAvatarEl.innerHTML = renderAvatarHtml(avatar, name);
            myAvatarEl.style.background = myProfile.color;
            myAvatarEl.style.boxShadow = `0 0 14px ${myProfile.color}`;
        }
        
        // Prime audio context on user gesture
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioCtx();
        }

        modal.classList.add('hidden');
        updateMyMarker();
        renderAccuracyUI(myProfile.accuracy || 15);
        if (map && myProfile.lat && myProfile.lng) {
            map.panTo([myProfile.lat, myProfile.lng]);
        }
        connectSocket();
        startWatchingLocation();
        startCloudflareSync();

        // If Magic Invite Link was opened, trigger greeting modal
        if (pendingMagicInviteCode) {
            const targetInvite = pendingMagicInviteCode;
            pendingMagicInviteCode = null;
            setTimeout(() => {
                handleMagicInviteForActiveUser(targetInvite);
            }, 500);
            try {
                const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
            } catch (e) {}
        }

        // Segera cari lokasi GPS riil pengguna saat ini dan pusatkan peta ke titik tersebut
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                myProfile.lat = pos.coords.latitude;
                myProfile.lng = pos.coords.longitude;
                myProfile.accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 15;
                try {
                    localStorage.setItem('zenloc_last_lat', myProfile.lat);
                    localStorage.setItem('zenloc_last_lng', myProfile.lng);
                } catch (e) {}
                updateMyMarker();
                renderAccuracyUI(myProfile.accuracy);
                sendLocationUpdate();
                if (map) {
                    map.flyTo([myProfile.lat, myProfile.lng], 16, { animate: true, duration: 1.2 });
                }
            }, () => {}, { enableHighAccuracy: true, timeout: 8000 });
        }

        if (isAutoLogin) {
            showToast(`📍 Selamat datang kembali, ${name}! GPS aktif.`);
        } else {
            showToast(`Halo ${name}! Selamat datang di Locanear.`);
        }
    }

    async function executeLogin(username, password) {
        const u = String(username || '').trim().toLowerCase();
        const p = String(password || '').trim();

        if (loginErrorAlert) loginErrorAlert.classList.add('hidden');

        if (!u || !p) {
            if (loginErrorAlert && loginErrorText) {
                loginErrorText.innerText = 'Harap isi username dan password!';
                loginErrorAlert.classList.remove('hidden');
                refreshLucideIcons();
            }
            return;
        }

        // Try backend Cloudflare D1 login first
        try {
            const resp = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });
            const data = await resp.json();
            if (data && data.success && data.user) {
                const uData = data.user;
                REGISTERED_ACCOUNTS[u] = {
                    username: uData.username,
                    password: p,
                    name: uData.name,
                    avatar: uData.avatar,
                    color: uData.color,
                    friendCode: uData.friendCode || uData.friend_code,
                    lat: uData.lat,
                    lng: uData.lng
                };
                try {
                    const savedCustom = JSON.parse(localStorage.getItem('zenloc_custom_users') || '{}');
                    savedCustom[u] = REGISTERED_ACCOUNTS[u];
                    localStorage.setItem('zenloc_custom_users', JSON.stringify(savedCustom));
                } catch (e) {}

                localStorage.setItem('zenloc_auth_user', u);
                applyProfileAndJoin(uData.name, uData.avatar, uData.color, uData.friendCode || uData.friend_code, uData.lat, uData.lng);
                return;
            } else if (data && !data.success) {
                if (loginErrorAlert && loginErrorText) {
                    loginErrorText.innerText = data.message || 'Username atau password salah!';
                    loginErrorAlert.classList.remove('hidden');
                    refreshLucideIcons();
                }
                return;
            }
        } catch (err) {
            console.warn('Login backend unreachable, checking local cache:', err);
        }

        // Fallback for local cache / offline
        const acc = REGISTERED_ACCOUNTS[u];
        if (acc && acc.password === p) {
            localStorage.setItem('zenloc_auth_user', u);
            applyProfileAndJoin(acc.name, acc.avatar, acc.color, acc.friendCode, acc.lat, acc.lng);
        } else {
            if (loginErrorAlert && loginErrorText) {
                loginErrorText.innerText = 'Username atau password salah!';
                loginErrorAlert.classList.remove('hidden');
                refreshLucideIcons();
            }
        }
    }

    // Face ID Quick Login UI and Click Handler
    updateFaceIdLoginUI = function() {
        const saved = getSavedFaceIdUser();
        if (btnFaceIdLogin && faceIdDivider) {
            btnFaceIdLogin.classList.remove('hidden');
            faceIdDivider.classList.remove('hidden');
            if (btnFaceIdText) {
                if (saved && saved.username) {
                    btnFaceIdText.innerText = `Masuk Cepat via Face ID (${saved.username})`;
                } else {
                    btnFaceIdText.innerText = 'Masuk dengan Face ID';
                }
            }
            refreshLucideIcons();
        }
    };
    updateFaceIdLoginUI();

    if (btnFaceIdLogin) {
        btnFaceIdLogin.addEventListener('click', async () => {
            if (loginErrorAlert) loginErrorAlert.classList.add('hidden');
            const saved = getSavedFaceIdUser();

            // Jika belum ada akun yang mengaktifkan Face ID di perangkat ini
            if (!saved || !saved.username) {
                if (loginErrorAlert && loginErrorText) {
                    loginErrorText.innerText = 'Face ID belum didaftarkan di perangkat ini. Silakan masuk menggunakan Username & Password terlebih dahulu, lalu aktifkan Face ID di menu Pengaturan Profil (⚙️).';
                    loginErrorAlert.classList.remove('hidden');
                    refreshLucideIcons();
                } else {
                    showToast('⚠️ Silakan login dengan password dulu, lalu aktifkan Face ID di menu Pengaturan.');
                }
                return;
            }

            const originalText = btnFaceIdText ? btnFaceIdText.innerText : 'Masuk Cepat via Face ID';
            if (btnFaceIdText) btnFaceIdText.innerText = 'Memindai Wajah...';
            btnFaceIdLogin.disabled = true;

            const res = await authenticateWithFaceId();
            btnFaceIdLogin.disabled = false;
            if (btnFaceIdText) btnFaceIdText.innerText = originalText;

            if (res.ok && res.username) {
                const u = res.username.toLowerCase();
                const acc = REGISTERED_ACCOUNTS[u] || {
                    name: res.username,
                    avatar: 'cool',
                    color: '#0284c7',
                    friendCode: `${res.username.toUpperCase().slice(0, 6)}-24`
                };
                localStorage.setItem('zenloc_auth_user', u);
                applyProfileAndJoin(acc.name, acc.avatar, acc.color, acc.friendCode, acc.lat, acc.lng);
                showToast(`👤 Wajah terverifikasi! Selamat datang kembali, ${acc.name}!`);
            } else {
                if (loginErrorAlert && loginErrorText) {
                    loginErrorText.innerText = res.error || 'Verifikasi Face ID gagal.';
                    loginErrorAlert.classList.remove('hidden');
                    refreshLucideIcons();
                }
            }
        });
    }

    // Submit button click
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', () => {
            const u = inputUsername ? inputUsername.value : '';
            const p = inputPassword ? inputPassword.value : '';
            executeLogin(u, p);
        });
    }

    // Enter key support on login inputs
    if (inputUsername) {
        inputUsername.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (inputPassword && !inputPassword.value) {
                    inputPassword.focus();
                } else if (btnLoginSubmit) {
                    btnLoginSubmit.click();
                }
            }
        });
    }

    if (inputPassword) {
        inputPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (btnLoginSubmit) btnLoginSubmit.click();
            }
        });
    }

    // Registration Submit (Sesuai Gambar 2)
    async function executeRegister() {
        const u = String(regUsername ? regUsername.value : '').trim().toLowerCase();
        const p = String(regPassword ? regPassword.value : '').trim();
        const cp = String(regConfirmPassword ? regConfirmPassword.value : '').trim();
        const q = String(regSecurityQuestion ? regSecurityQuestion.value : '').trim();
        const a = String(regSecurityAnswer ? regSecurityAnswer.value : '').trim();

        if (regErrorAlert) regErrorAlert.classList.add('hidden');
        if (regSuccessAlert) regSuccessAlert.classList.add('hidden');

        function showRegError(msg) {
            if (regErrorAlert && regErrorText) {
                regErrorText.innerText = msg;
                regErrorAlert.classList.remove('hidden');
                refreshLucideIcons();
            }
        }

        if (!u || u.length < 3) {
            return showRegError('Username baru minimal 3 karakter!');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(u)) {
            return showRegError('Username hanya boleh huruf, angka, underscore (_) atau strip (-)!');
        }
        if (REGISTERED_ACCOUNTS[u]) {
            return showRegError('Username sudah digunakan! Silakan pilih username lain.');
        }
        if (p.length < 6) {
            return showRegError('Password minimal 6 karakter!');
        }
        if (!/[A-Z]/.test(p)) {
            return showRegError('Password harus memiliki minimal 1 huruf kapital (A–Z)!');
        }
        if (!/[0-9]/.test(p)) {
            return showRegError('Password harus memiliki minimal 1 angka (0–9)!');
        }
        if (p !== cp) {
            return showRegError('Konfirmasi password tidak cocok! Pastikan sama.');
        }
        if (!a) {
            return showRegError('Harap isi jawaban pertanyaan keamanan pemulihan!');
        }

        const cleanName = u.charAt(0).toUpperCase() + u.slice(1);
        const randNum = Math.floor(10 + Math.random() * 90);
        const friendCode = `${u.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${randNum}`;

        const avatars = ['cool', 'sakura', 'cyber', 'fox', 'cat', 'astro', 'panda', 'crown', 'gamer', 'zen'];
        const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6'];
        const assignedAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        const assignedColor = colors[Math.floor(Math.random() * colors.length)];

        const newUser = {
            username: u,
            password: p,
            name: cleanName,
            avatar: assignedAvatar,
            color: assignedColor,
            friendCode: friendCode,
            securityQuestion: q,
            securityAnswer: a,
            lat: myProfile.lat || -6.2088,
            lng: myProfile.lng || 106.8456
        };

        // Register via Cloudflare D1
        let regCode = friendCode;
        try {
            const resp = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: u,
                    password: p,
                    confirmPassword: cp,
                    securityQuestion: q,
                    securityAnswer: a,
                    invitedByCode: pendingMagicInviteCode || null
                })
            });
            const regRes = await resp.json();
            if (!regRes.success) {
                return showRegError(regRes.message || 'Gagal membuat akun.');
            }
            if (regRes.user && regRes.user.friendCode) {
                regCode = regRes.user.friendCode;
                newUser.friendCode = regCode;
            }
        } catch (err) {
            console.warn('Backend register request failed, falling back to local mode:', err);
        }

        // Save into local memory & localStorage
        REGISTERED_ACCOUNTS[u] = newUser;
        try {
            const savedCustom = JSON.parse(localStorage.getItem('zenloc_custom_users') || '{}');
            savedCustom[u] = newUser;
            localStorage.setItem('zenloc_custom_users', JSON.stringify(savedCustom));
        } catch (e) {}

        // Show success message
        if (regSuccessAlert && regSuccessText) {
            regSuccessText.innerText = `Akun ${cleanName} berhasil dibuat! Masuk ke peta...`;
            regSuccessAlert.classList.remove('hidden');
            refreshLucideIcons();
        }

        setTimeout(() => {
            if (registerModal) registerModal.classList.add('hidden');
            localStorage.setItem('zenloc_auth_user', u);
            applyProfileAndJoin(newUser.name, newUser.avatar, newUser.color, newUser.friendCode, newUser.lat, newUser.lng);
        }, 600);
    }

    if (btnRegisterSubmit) {
        btnRegisterSubmit.addEventListener('click', executeRegister);
    }

    if (regSecurityAnswer) {
        regSecurityAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeRegister();
        });
    }

    // Auto-Login: Jika sesi sebelumnya sudah ada, langsung masuk tanpa meminta login ulang
    const savedAuthUser = localStorage.getItem('zenloc_auth_user');
    if (savedAuthUser) {
        const u = savedAuthUser.toLowerCase();
        const acc = REGISTERED_ACCOUNTS[u];
        const savedName = localStorage.getItem('zenloc_name') || (acc ? acc.name : savedAuthUser);
        const savedAvatar = localStorage.getItem('zenloc_avatar') || (acc ? acc.avatar : 'cool');
        const savedColor = localStorage.getItem('zenloc_color') || (acc ? acc.color : '#0284c7');
        const savedCode = localStorage.getItem('zenloc_my_friend_code') || (acc ? acc.friendCode : null);
        const savedLat = parseFloat(localStorage.getItem('zenloc_last_lat') || (acc ? acc.lat : ''));
        const savedLng = parseFloat(localStorage.getItem('zenloc_last_lng') || (acc ? acc.lng : ''));

        applyProfileAndJoin(
            savedName,
            savedAvatar,
            savedColor,
            savedCode,
            isNaN(savedLat) ? null : savedLat,
            isNaN(savedLng) ? null : savedLng,
            true // isAutoLogin
        );
        console.log(`[Locanear] Auto-login berhasil untuk: ${savedName} (${savedAuthUser})`);
    } else {
        if (modal) modal.classList.remove('hidden');
    }
}

// Global helpers for Settings & Profile Hub
let openSettingsModal, closeSettingsModal, syncSettingsModal;

// Settings & Profile Hub Modal (Satu Bulet untuk Profil & Seluruh Fitur)
function initSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    const userPill = document.getElementById('user-pill');
    const btnOpenFab = document.getElementById('btn-open-settings');
    const btnClose = document.getElementById('btn-close-settings');

    const inputName = document.getElementById('settings-input-name');
    const codeValEl = document.getElementById('settings-friend-code-val');
    const btnCopyCode = document.getElementById('btn-settings-copy-code');
    const btnSaveProfile = document.getElementById('btn-settings-save-profile');

    // Photo Upload Elements
    const avatarDisplay = document.getElementById('settings-avatar-display');
    const inputPhoto = document.getElementById('input-profile-photo');
    const btnChoosePhoto = document.getElementById('btn-choose-photo');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');

    const btnLayerRoad = document.getElementById('btn-layer-roadmap');
    const btnLayerSat = document.getElementById('btn-layer-satellite');
    const trailSwitch = document.getElementById('settings-trail-switch');

    const ghostSwitch = document.getElementById('settings-ghost-switch');
    const ghostStatusLabel = document.getElementById('settings-ghost-status-label');

    const btnOpenHist = document.getElementById('btn-settings-open-history');
    const btnAddBot = document.getElementById('btn-settings-add-bot');
    const btnOpenDev = document.getElementById('btn-settings-open-dev');

    let tempAvatar = myProfile.avatar || 'cool';
    let tempColor = myProfile.color || '#BEE354';

    // Delegate avatar selection in settings modal
    const settingsSelector = document.getElementById('settings-avatar-selector');
    if (settingsSelector) {
        settingsSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.avatar-opt');
            if (!btn) return;
            settingsSelector.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
            btn.classList.add('active');
            tempAvatar = btn.getAttribute('data-avatar');
            updateAvatarDisplay();
        });
    }

    function updatePreviewCode(name) {
        const clean = (name || 'USER').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'USER';
        let num = '24';
        if (myProfile.friendCode && myProfile.friendCode.includes('-')) {
            num = myProfile.friendCode.split('-')[1] || '24';
        } else {
            num = String(Math.floor(10 + Math.random() * 90));
        }
        if (codeValEl) codeValEl.innerText = `${clean}-${num}`;
    }

    function updateAvatarDisplay() {
        if (avatarDisplay) {
            avatarDisplay.innerHTML = renderAvatarHtml(tempAvatar, 'Preview Avatar');
        }
        const isImage = typeof tempAvatar === 'string' && (
            tempAvatar.startsWith('data:image/') ||
            tempAvatar.startsWith('http') ||
            tempAvatar.startsWith('/') ||
            tempAvatar.startsWith('blob:')
        );
        if (btnRemovePhoto) {
            btnRemovePhoto.classList.toggle('hidden', !isImage);
        }
        document.querySelectorAll('#settings-avatar-selector .avatar-opt').forEach(btn => {
            btn.classList.toggle('active', !isImage && btn.getAttribute('data-avatar') === tempAvatar);
        });
    }

    syncSettingsModal = function() {
        if (!settingsModal) return;
        tempAvatar = myProfile.avatar || 'cool';
        tempColor = myProfile.color || '#BEE354';

        // 1. Profile inputs
        if (inputName) {
            inputName.value = (myProfile.name === 'Saya' || myProfile.name === 'Teman Zenly') ? '' : myProfile.name;
        }
        if (codeValEl) {
            codeValEl.innerText = myProfile.friendCode || 'AMEL-24';
        }

        // Highlight avatar & photo preview
        updateAvatarDisplay();

        // Highlight color
        document.querySelectorAll('#settings-color-selector .color-opt').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-color') === tempColor);
        });

        // 2. Layer buttons
        if (btnLayerRoad && btnLayerSat) {
            btnLayerRoad.classList.toggle('active', currentLayerName === 'google-roadmap');
            btnLayerSat.classList.toggle('active', currentLayerName === 'google-satellite');
        }

        // 3. Trail switch
        if (trailSwitch) {
            trailSwitch.checked = isTrailVisible;
        }

        // 4. Ghost switch
        if (ghostSwitch) {
            ghostSwitch.checked = !!myProfile.ghostMode;
        }
        if (ghostStatusLabel) {
            ghostStatusLabel.innerText = myProfile.ghostMode ? 'Mode Hantu: Aktif' : 'Mode Hantu: Nonaktif';
        }

        // 5. Face ID / Biometric Status
        const faceIdTitle = document.getElementById('faceid-status-title');
        const faceIdDesc = document.getElementById('faceid-status-desc');
        const btnToggleFaceId = document.getElementById('btn-toggle-faceid');
        const faceIdBtnLabel = document.getElementById('faceid-btn-label');

        const savedFaceUser = getSavedFaceIdUser();
        const currentActiveUsername = (localStorage.getItem('zenloc_auth_user') || myProfile.name || '').toLowerCase();
        const isCurrentEnrolled = savedFaceUser && (savedFaceUser.username.toLowerCase() === currentActiveUsername);

        if (faceIdTitle && faceIdDesc && btnToggleFaceId && faceIdBtnLabel) {
            if (isCurrentEnrolled) {
                faceIdTitle.innerText = 'Face ID Aktif';
                faceIdDesc.innerText = `Terdaftar untuk akun: ${savedFaceUser.username}`;
                faceIdBtnLabel.innerText = 'Hapus Face ID';
                btnToggleFaceId.classList.add('enrolled');
            } else {
                faceIdTitle.innerText = 'Login Face ID / Biometrik';
                faceIdDesc.innerText = 'Aktifkan login instan dengan Face ID atau sidik jari di perangkat ini';
                faceIdBtnLabel.innerText = 'Aktifkan Face ID';
                btnToggleFaceId.classList.remove('enrolled');
            }
            refreshLucideIcons();
        }
    };

    openSettingsModal = function() {
        syncSettingsModal();
        if (settingsModal) settingsModal.classList.remove('hidden');
    };

    closeSettingsModal = function() {
        if (settingsModal) settingsModal.classList.add('hidden');
    };

    // Trigger open
    if (userPill) userPill.addEventListener('click', openSettingsModal);
    if (btnOpenFab) btnOpenFab.addEventListener('click', openSettingsModal);

    // Trigger close
    if (btnClose) btnClose.addEventListener('click', closeSettingsModal);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });
    }

    // Photo file selection & compression
    if (btnChoosePhoto && inputPhoto) {
        btnChoosePhoto.addEventListener('click', () => {
            inputPhoto.click();
        });
    }

    if (inputPhoto) {
        inputPhoto.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
                processProfilePhoto(file, (dataUrl) => {
                    tempAvatar = dataUrl;
                    updateAvatarDisplay();
                    showToast('Foto profil siap! Klik "Simpan Perubahan Profil" di bawah.');
                });
            }
        });
    }

    if (btnRemovePhoto) {
        btnRemovePhoto.addEventListener('click', () => {
            tempAvatar = 'cool';
            updateAvatarDisplay();
            showToast('Beralih kembali ke avatar modern.');
        });
    }

    // Avatar selector clicks
    document.querySelectorAll('#settings-avatar-selector .avatar-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            tempAvatar = btn.getAttribute('data-avatar');
            updateAvatarDisplay();
        });
    });

    // Color selector clicks
    document.querySelectorAll('#settings-color-selector .color-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#settings-color-selector .color-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tempColor = btn.getAttribute('data-color');
        });
    });

    if (inputName) {
        inputName.addEventListener('input', (e) => {
            updatePreviewCode(e.target.value);
        });
        inputName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (btnSaveProfile) btnSaveProfile.click();
            }
        });
    }

    // Copy friend code button
    if (btnCopyCode) {
        btnCopyCode.addEventListener('click', () => {
            const code = codeValEl ? codeValEl.innerText : (myProfile.friendCode || '');
            if (!code) return;
            navigator.clipboard.writeText(code).then(() => {
                const copyIcon = document.getElementById('settings-copy-icon');
                const copyText = document.getElementById('settings-copy-text');
                if (copyIcon && copyText) {
                    copyIcon.setAttribute('data-lucide', 'check');
                    copyText.innerText = 'Tersalin!';
                    refreshLucideIcons();
                    setTimeout(() => {
                        copyIcon.setAttribute('data-lucide', 'copy');
                        copyText.innerText = 'Salin';
                        refreshLucideIcons();
                    }, 2000);
                }
                showToast(`Kode teman ${code} berhasil disalin!`);
            }).catch(() => {
                showToast(`Kode Teman Anda: ${code}`);
            });
        });
    }

    // Magic Invite Share buttons in Settings
    const btnSettingsShare = document.getElementById('btn-settings-magic-share');
    const btnSettingsWa = document.getElementById('btn-settings-magic-wa');
    if (btnSettingsShare) btnSettingsShare.addEventListener('click', shareInviteLink);
    if (btnSettingsWa) btnSettingsWa.addEventListener('click', shareToWhatsApp);

    // Save profile changes
    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', () => {
            const newName = (inputName ? inputName.value.trim() : '') || myProfile.name || 'Teman';
            const clean = newName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'USER';
            let num = '24';
            if (myProfile.friendCode && myProfile.friendCode.includes('-')) {
                num = myProfile.friendCode.split('-')[1] || '24';
            } else {
                num = String(Math.floor(10 + Math.random() * 90));
            }
            const newFriendCode = `${clean}-${num}`;

            myProfile.name = newName;
            myProfile.avatar = tempAvatar;
            myProfile.color = tempColor;
            myProfile.friendCode = newFriendCode;

            localStorage.setItem('zenloc_name', newName);
            localStorage.setItem('zenloc_avatar', tempAvatar);
            localStorage.setItem('zenloc_color', tempColor);
            localStorage.setItem('zenloc_my_friend_code', newFriendCode);

            // Update topbar UI
            const myNameEl = document.getElementById('my-name');
            const myAvatarEl = document.getElementById('my-avatar');
            const mainCodeValEl = document.getElementById('my-friend-code-val');

            if (myNameEl) myNameEl.innerText = newName;
            if (myAvatarEl) {
                myAvatarEl.innerHTML = renderAvatarHtml(tempAvatar, newName);
                myAvatarEl.style.background = tempColor;
                myAvatarEl.style.boxShadow = `0 0 14px ${tempColor}`;
            }
            if (mainCodeValEl) mainCodeValEl.innerText = newFriendCode;
            if (codeValEl) codeValEl.innerText = newFriendCode;

            updateMyMarker();

            if (socket && socket.connected) {
                socket.emit('update-profile', {
                    name: newName,
                    avatar: tempAvatar,
                    color: tempColor,
                    friendCode: newFriendCode
                });
            }

            showToast(`Profil tersimpan! Halo, ${newName} [${newFriendCode}]!`);
        });
    }

    // Map layer segmented control
    if (btnLayerRoad) {
        btnLayerRoad.addEventListener('click', () => {
            setMapLayer('google-roadmap');
        });
    }
    if (btnLayerSat) {
        btnLayerSat.addEventListener('click', () => {
            setMapLayer('google-satellite');
        });
    }

    // Trail toggle switch
    if (trailSwitch) {
        trailSwitch.addEventListener('change', () => {
            isTrailVisible = trailSwitch.checked;
            localStorage.setItem('zenloc_trail_visible', isTrailVisible);
            renderCurrentDayTrails();
            showToast(isTrailVisible ? 'Jejak riwayat ditampilkan di peta.' : 'Jejak riwayat disembunyikan.');
        });
    }

    // Ghost mode switch
    if (ghostSwitch) {
        ghostSwitch.addEventListener('change', () => {
            myProfile.ghostMode = ghostSwitch.checked;
            if (ghostStatusLabel) {
                ghostStatusLabel.innerText = myProfile.ghostMode ? 'Mode Hantu: Aktif' : 'Mode Hantu: Nonaktif';
            }
            updateMyMarker();
            sendLocationUpdate();
            showToast(myProfile.ghostMode ? 'Ghost Mode aktif! Lokasi disamarkan ±500m.' : 'Ghost Mode non-aktif. Lokasi akurat.');
        });
    }

    // Biometric / Face ID Toggle Button in Settings
    const btnToggleFaceId = document.getElementById('btn-toggle-faceid');
    if (btnToggleFaceId) {
        btnToggleFaceId.addEventListener('click', async () => {
            const currentActiveUsername = localStorage.getItem('zenloc_auth_user') || myProfile.name || 'User';
            const savedFaceUser = getSavedFaceIdUser();
            const isCurrentEnrolled = savedFaceUser && (savedFaceUser.username.toLowerCase() === currentActiveUsername.toLowerCase());

            if (isCurrentEnrolled) {
                removeFaceId();
                showToast('Face ID berhasil dinonaktifkan.');
                syncSettingsModal();
                if (typeof updateFaceIdLoginUI === 'function') updateFaceIdLoginUI();
            } else {
                const originalLabel = document.getElementById('faceid-btn-label');
                const oldText = originalLabel ? originalLabel.innerText : 'Aktifkan Face ID';
                if (originalLabel) originalLabel.innerText = 'Mendaftarkan...';
                btnToggleFaceId.disabled = true;

                const regRes = await registerFaceId(currentActiveUsername);
                btnToggleFaceId.disabled = false;
                if (originalLabel) originalLabel.innerText = oldText;

                if (regRes.ok) {
                    showToast('🎉 Face ID berhasil didaftarkan! Anda sekarang dapat masuk tanpa password.');
                    syncSettingsModal();
                    if (typeof updateFaceIdLoginUI === 'function') updateFaceIdLoginUI();
                } else {
                    showToast(regRes.error || 'Gagal mendaftarkan Face ID.');
                }
            }
        });
    }

    // Tool: 7-Day History
    if (btnOpenHist) {
        btnOpenHist.addEventListener('click', () => {
            closeSettingsModal();
            const histDrawer = document.getElementById('history-drawer');
            if (histDrawer) {
                histDrawer.classList.remove('collapsed');
                loadHistoryForDate(selectedHistoryDateKey || getTodayDateKey());
            }
        });
    }

    // Tool: Logout / Switch Account
    const btnLogout = document.getElementById('btn-settings-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            closeSettingsModal();
            handleLogout();
        });
    }
}

function handleLogout() {
    localStorage.removeItem('zenloc_auth_user');
    showToast('Anda telah keluar dari akun.');
    if (socket) {
        socket.disconnect();
    }
    // Bersihkan marker teman dan data pertemanan lama
    friendMarkers.forEach(item => {
        if (item.marker) map.removeLayer(item.marker);
        if (item.circle) map.removeLayer(item.circle);
    });
    friendMarkers.clear();
    confirmedFriends.clear();
    incomingRequests.clear();
    updateFriendUI();

    const modal = document.getElementById('join-modal');
    if (modal) modal.classList.remove('hidden');
    const inputUsername = document.getElementById('login-username');
    const inputPassword = document.getElementById('login-password');
    if (inputUsername) {
        inputUsername.value = '';
        inputUsername.focus();
    }
    if (inputPassword) inputPassword.value = '';
    const errEl = document.getElementById('login-error-alert');
    if (errEl) errEl.classList.add('hidden');
    if (typeof updateFaceIdLoginUI === 'function') updateFaceIdLoginUI();
    refreshLucideIcons();
}

// Alias for initialization compatibility
const initEditProfileModal = initSettingsModal;

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ==========================================
// Phase 2: Real-time Chat Implementation
// ==========================================

// ==========================================
// WhatsApp-Style Dual-View Real-time Chat
// ==========================================

let activeChatFriendCode = null; // null = inbox view, or string friendCode = room view
let chatMessagesCache = new Map(); // targetCode -> Array of messages
let chatPollInterval = null;
let chatSearchTerm = '';

function formatChatTime(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return '';
    }
}

function initChat() {
    const chatDrawer = document.getElementById('chat-drawer');
    const btnOpenChat = document.getElementById('btn-open-chat');
    const btnCloseChat = document.getElementById('btn-close-chat');
    const btnCloseChatRoom = document.getElementById('btn-close-chat-room');
    const btnBackToInbox = document.getElementById('btn-back-to-inbox');
    const inboxView = document.getElementById('chat-inbox-view');
    const roomView = document.getElementById('chat-room-view');
    const searchInput = document.getElementById('wa-search-input');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const btnShareLoc = document.getElementById('btn-share-location');
    const unreadBadge = document.getElementById('chat-unread-badge');
    const btnFocusMap = document.getElementById('btn-wa-focus-map');
    const btnMeetup = document.getElementById('btn-wa-meetup');

    // Open Chat Drawer from FAB button -> Opens Inbox List View
    if (btnOpenChat) {
        btnOpenChat.addEventListener('click', () => {
            const willOpen = chatDrawer.classList.contains('collapsed');
            if (willOpen) {
                if (typeof closeReactionBar === 'function') closeReactionBar();
                const friendsDrawer = document.getElementById('friends-drawer');
                if (friendsDrawer) friendsDrawer.classList.add('collapsed');
                const histDrawer = document.getElementById('history-drawer');
                if (histDrawer) histDrawer.classList.add('collapsed');
            }
            chatDrawer.classList.toggle('collapsed');
            if (!chatDrawer.classList.contains('collapsed')) {
                if (activeChatFriendCode) {
                    markChatAsRead(activeChatFriendCode);
                    renderActiveRoomMessages();
                } else {
                    switchToChatInbox();
                }
                updateChatUnreadBadge();
            }
        });
    }

    if (btnCloseChat) {
        btnCloseChat.addEventListener('click', () => {
            chatDrawer.classList.add('collapsed');
        });
    }

    if (btnCloseChatRoom) {
        btnCloseChatRoom.addEventListener('click', () => {
            chatDrawer.classList.add('collapsed');
        });
    }

    // Back button inside room -> returns to WhatsApp chat list
    if (btnBackToInbox) {
        btnBackToInbox.addEventListener('click', () => {
            switchToChatInbox();
        });
    }

    // Search bar filtering
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            chatSearchTerm = searchInput.value.trim().toLowerCase();
            renderConversationsList();
        });
    }

    // Focus friend on map button in chat room
    if (btnFocusMap) {
        btnFocusMap.addEventListener('click', () => {
            if (!activeChatFriendCode) return;
            const friend = confirmedFriends.get(activeChatFriendCode);
            if (friend && friend.lat && friend.lng && map) {
                map.flyTo([friend.lat, friend.lng], 16, { animate: true, duration: 1.2 });
                showToast(`Peta diarahkan ke ${friend.name}`);
            } else {
                showToast('Lokasi teman belum tersedia.');
            }
        });
    }

    // Meetup invitation from chat room
    if (btnMeetup) {
        btnMeetup.addEventListener('click', () => {
            if (!activeChatFriendCode) return;
            if (typeof openMeetupModal === 'function') {
                openMeetupModal(activeChatFriendCode);
            }
        });
    }

    // Submit message
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = (chatInput ? chatInput.value : '').trim();
            if (!text) return;

            const target = activeChatFriendCode;
            chatInput.value = '';

            await postChatMessage({
                text: text,
                type: 'text',
                targetCode: target
            });
        });
    }

    // Share Location button
    if (btnShareLoc) {
        btnShareLoc.addEventListener('click', async () => {
            if (!myProfile.lat || !myProfile.lng) {
                showToast('Lokasi Anda belum tersedia.');
                return;
            }

            const target = activeChatFriendCode;
            const locText = `📍 Berbagi lokasi terkini (${myProfile.lat.toFixed(4)}, ${myProfile.lng.toFixed(4)})`;

            await postChatMessage({
                text: locText,
                type: 'location',
                location: { lat: myProfile.lat, lng: myProfile.lng },
                targetCode: target
            });
            showToast('Lokasi berhasil dibagikan di ruang obrolan!');
        });
    }

    // Quick chips buttons
    document.querySelectorAll('.wa-quick-bar .btn-quick-chat-emoji').forEach(btn => {
        btn.addEventListener('click', () => {
            const emojiText = btn.getAttribute('data-chat-emoji');
            if (chatInput) {
                chatInput.value = (chatInput.value ? chatInput.value + ' ' : '') + emojiText;
                chatInput.focus();
            }
        });
    });

    // Start background chat polling
    if (!chatPollInterval) {
        chatPollInterval = setInterval(fetchLatestMessagesForCurrentView, 3500);
    }
}

function switchToChatInbox() {
    activeChatFriendCode = null;
    const inboxView = document.getElementById('chat-inbox-view');
    const roomView = document.getElementById('chat-room-view');
    if (inboxView) inboxView.classList.remove('hidden');
    if (roomView) roomView.classList.add('hidden');
    renderConversationsList();
}

// ==========================================
// WhatsApp Chat Unread Tracking System
// ==========================================
function getReadChatMap() {
    try {
        return JSON.parse(localStorage.getItem('zenloc_last_read_chats') || '{}');
    } catch (e) {
        return {};
    }
}

function markChatAsRead(peerCode) {
    if (!peerCode) return;
    const readMap = getReadChatMap();
    const msgs = chatMessagesCache.get(peerCode) || [];
    let maxId = Number(readMap[peerCode] || 0);
    msgs.forEach(m => {
        const numericId = typeof m.id === 'number' ? m.id : (typeof m.id === 'string' && /^\d+$/.test(m.id) ? Number(m.id) : 0);
        if (numericId > maxId) maxId = numericId;
    });
    readMap[peerCode] = maxId;
    localStorage.setItem('zenloc_last_read_chats', JSON.stringify(readMap));
    updateChatUnreadBadge();
}

function getUnreadCountForPeer(peerCode) {
    if (!peerCode) return 0;
    const readMap = getReadChatMap();
    const lastReadId = Number(readMap[peerCode] || 0);
    const msgs = chatMessagesCache.get(peerCode) || [];
    const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();
    let count = 0;
    msgs.forEach(m => {
        const senderUpper = (m.senderCode || '').trim().toUpperCase();
        const numericId = typeof m.id === 'number' ? m.id : (typeof m.id === 'string' && /^\d+$/.test(m.id) ? Number(m.id) : 0);
        if (senderUpper && senderUpper !== myCodeUpper && numericId > lastReadId) {
            count++;
        }
    });
    return count;
}

function updateChatUnreadBadge() {
    const unreadBadge = document.getElementById('chat-unread-badge');
    if (!unreadBadge) return;

    let totalUnread = 0;
    for (const peerCode of chatMessagesCache.keys()) {
        totalUnread += getUnreadCountForPeer(peerCode);
    }

    if (totalUnread > 0) {
        unreadBadge.innerText = totalUnread > 99 ? '99+' : totalUnread;
        unreadBadge.classList.remove('hidden');
    } else {
        unreadBadge.innerText = '0';
        unreadBadge.classList.add('hidden');
    }
}

function renderConversationsList() {
    const listEl = document.getElementById('wa-conversations-list');
    const summaryEl = document.getElementById('wa-online-summary');
    if (!listEl) return;

    const myCodeUpper = (myProfile.friendCode || '').trim().toUpperCase();
    const friends = Array.from(confirmedFriends.values()).filter(f => {
        const codeUpper = (f.friendCode || f.id || '').trim().toUpperCase();
        return !myCodeUpper || codeUpper !== myCodeUpper;
    });
    if (summaryEl) {
        summaryEl.innerText = `${friends.length} teman terhubung`;
    }

    // Filter by search query
    const filtered = friends.filter(f => {
        if (!chatSearchTerm) return true;
        const nameMatch = (f.name || '').toLowerCase().includes(chatSearchTerm);
        const codeMatch = (f.friendCode || '').toLowerCase().includes(chatSearchTerm);
        return nameMatch || codeMatch;
    });

    if (filtered.length === 0) {
        if (friends.length === 0) {
            listEl.innerHTML = `
                <div class="chat-empty" style="padding: 40px 20px;">
                    <i data-lucide="users" class="empty-icon" style="width: 48px; height: 48px; opacity: 0.4;"></i>
                    <p style="margin-top: 12px; font-size: 13px; color: #8696a0;">Belum ada teman terhubung.<br>Undang teman via WhatsApp atau tautan untuk mulai mengobrol!</p>
                    <button class="action-btn" onclick="shareToWhatsApp()" style="margin: 16px auto 0; padding: 8px 16px; background: #00a884; color: #111b21; font-weight: 700; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px;">
                        <i data-lucide="share-2" style="width: 14px; height: 14px;"></i> Undang Teman
                    </button>
                </div>
            `;
        } else {
            listEl.innerHTML = `
                <div class="chat-empty" style="padding: 40px 20px;">
                    <p style="font-size: 13px; color: #8696a0;">Tidak ada teman yang cocok dengan "${chatSearchTerm}".</p>
                </div>
            `;
        }
        refreshLucideIcons();
        return;
    }

    let html = '';
    filtered.forEach(friend => {
        const cached = chatMessagesCache.get(friend.friendCode) || [];
        const lastMsg = cached.length > 0 ? cached[cached.length - 1] : null;
        const snippet = lastMsg ? lastMsg.text : 'Ketuk untuk membuka obrolan';
        const timeStr = lastMsg ? (lastMsg.timestamp || formatChatTime(lastMsg.createdAt)) : '';
        const isOnline = friend.online !== false;
        const unreadCount = getUnreadCountForPeer(friend.friendCode);
        const unreadBadgeHtml = unreadCount > 0 ? `<span class="wa-unread-count">${unreadCount > 99 ? '99+' : unreadCount}</span>` : '';

        html += `
            <div class="wa-chat-item" onclick="openChatWithFriend('${friend.friendCode}')">
                <div class="wa-item-avatar-wrap">
                    <div class="wa-item-avatar" style="border-color: ${friend.color || '#00a884'};">
                        ${renderAvatarHtml(friend.avatar, friend.name)}
                    </div>
                    ${isOnline ? '<span class="wa-item-online-badge"></span>' : ''}
                </div>
                <div class="wa-item-content">
                    <div class="wa-item-top">
                        <span class="wa-item-name">
                            ${friend.name}
                            <span class="wa-item-code-pill">${friend.friendCode}</span>
                        </span>
                        <span class="wa-item-time">${timeStr}</span>
                    </div>
                    <div class="wa-item-bottom">
                        <span class="wa-item-snippet">${snippet}</span>
                        ${unreadBadgeHtml || (isOnline ? '<span style="font-size: 10px; color: #00a884; font-weight: 600;">Aktif</span>' : '')}
                    </div>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
    refreshLucideIcons();
}

async function openChatWithFriend(targetParam) {
    if (!targetParam) return;
    const cleanParam = String(targetParam).trim().toUpperCase();

    // 1. Force close all other drawers so they never block or overlap the chat!
    const friendsDrawer = document.getElementById('friends-drawer');
    if (friendsDrawer) friendsDrawer.classList.add('collapsed');
    const histDrawer = document.getElementById('history-drawer');
    if (histDrawer) histDrawer.classList.add('collapsed');
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) settingsModal.classList.add('hidden');
    if (typeof closeReactionBar === 'function') closeReactionBar();

    // 2. Resolve friend data from confirmedFriends or friendMarkers
    let friend = confirmedFriends.get(cleanParam);
    if (!friend) {
        for (const [code, f] of confirmedFriends.entries()) {
            if (code.toUpperCase() === cleanParam || 
                (f.friendCode && f.friendCode.toUpperCase() === cleanParam) ||
                (f.id && String(f.id).toUpperCase() === cleanParam) ||
                (f.name && f.name.toUpperCase() === cleanParam)) {
                friend = f;
                break;
            }
        }
    }
    if (!friend) {
        for (const [id, item] of friendMarkers.entries()) {
            if (!item || !item.data) continue;
            const d = item.data;
            if (String(id).toUpperCase() === cleanParam ||
                (d.id && String(d.id).toUpperCase() === cleanParam) ||
                (d.friendCode && d.friendCode.toUpperCase() === cleanParam) ||
                (d.name && d.name.toUpperCase() === cleanParam)) {
                friend = d;
                break;
            }
        }
    }

    const cleanCode = (friend && friend.friendCode) ? friend.friendCode.toUpperCase() : cleanParam;
    if (!friend) {
        friend = {
            friendCode: cleanCode,
            name: cleanCode,
            avatar: 'cool',
            color: '#00a884',
            battery: 100
        };
    }

    activeChatFriendCode = cleanCode;
    markChatAsRead(cleanCode);

    const chatDrawer = document.getElementById('chat-drawer');
    const inboxView = document.getElementById('chat-inbox-view');
    const roomView = document.getElementById('chat-room-view');
    const avatarEl = document.getElementById('wa-room-avatar');
    const nameEl = document.getElementById('wa-room-name');
    const statusTextEl = document.getElementById('wa-room-status-text');
    const chatInput = document.getElementById('chat-input');

    if (inboxView) inboxView.classList.add('hidden');
    if (roomView) roomView.classList.remove('hidden');

    if (avatarEl) {
        avatarEl.innerHTML = renderAvatarHtml(friend.avatar, friend.name);
        avatarEl.style.borderColor = friend.color || '#00a884';
    }
    if (nameEl) {
        nameEl.innerText = friend.name;
    }
    if (statusTextEl) {
        const isOnline = friend.online !== false;
        const battText = friend.battery !== undefined ? ` • ${friend.battery}%` : '';
        statusTextEl.innerText = isOnline ? `Online${battText}` : `Terakhir aktif${battText}`;
    }

    if (chatDrawer) {
        chatDrawer.classList.remove('collapsed');
    }
    refreshLucideIcons();

    // Render cached messages first
    renderActiveRoomMessages();
    setTimeout(() => {
        if (chatInput) chatInput.focus();
    }, 150);

    // Fetch latest messages from Cloudflare D1
    await fetchMessagesForRoom(cleanCode);
}

window.openChatWithFriend = openChatWithFriend;
window.openPrivateChatWith = openChatWithFriend; // Seamless fallback for existing buttons

function renderActiveRoomMessages() {
    const box = document.getElementById('chat-messages-box');
    if (!box) return;

    const messages = chatMessagesCache.get(activeChatFriendCode) || [];

    if (messages.length === 0) {
        const friend = confirmedFriends.get(activeChatFriendCode);
        const name = friend ? friend.name : 'teman ini';
        box.innerHTML = `
            <div class="chat-empty">
                <i data-lucide="message-circle" class="empty-icon" style="width: 44px; height: 44px; opacity: 0.35;"></i>
                <p style="margin-top: 10px; font-size: 13px; color: #8696a0;">Belum ada obrolan dengan ${name}.<br>Sampaikan salam atau bagikan lokasi Anda di bawah!</p>
            </div>
        `;
        refreshLucideIcons();
        return;
    }

    let html = '<div class="wa-date-pill">Hari ini</div>';
    messages.forEach(msg => {
        const isSelf = msg.senderCode === myProfile.friendCode;
        const timeStr = msg.timestamp || formatChatTime(msg.createdAt);

        let locCard = '';
        if (msg.type === 'location' && (msg.lat != null || (msg.location && msg.location.lat != null))) {
            const lat = msg.lat != null ? msg.lat : msg.location.lat;
            const lng = msg.lng != null ? msg.lng : msg.location.lng;
            locCard = `
                <div class="msg-loc-card" style="margin-top: 6px; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span style="font-size: 11px; display: inline-flex; align-items: center; gap: 4px; color: #e9edef;">
                        <i data-lucide="map-pin" style="width: 13px; height: 13px; color: #53bdeb;"></i> Koordinat
                    </span>
                    <button class="action-btn" onclick="map.flyTo([${lat}, ${lng}], 16); showToast('Peta diarahkan ke lokasi!')" style="padding: 3px 8px; font-size: 10px; border-radius: 6px; background: #00a884; color: #111b21; font-weight: 700;">
                        Lihat
                    </button>
                </div>
            `;
        }

        html += `
            <div class="wa-msg-bubble-wrap ${isSelf ? 'self' : 'other'}">
                <div class="wa-msg-bubble">
                    ${msg.text}
                    ${locCard}
                    <div class="wa-msg-footer">
                        <span>${timeStr}</span>
                        ${isSelf ? '<span class="wa-msg-tick"><i data-lucide="check-check" style="width: 14px; height: 14px;"></i></span>' : ''}
                    </div>
                </div>
            </div>
        `;
    });

    box.innerHTML = html;
    refreshLucideIcons();
    box.scrollTop = box.scrollHeight;
}

async function fetchMessagesForRoom(targetCode) {
    if (!myProfile.friendCode || !targetCode) return;
    try {
        const resp = await fetch(`/api/messages?myCode=${encodeURIComponent(myProfile.friendCode)}&targetCode=${encodeURIComponent(targetCode)}`);
        const data = await resp.json();
        if (data && data.success && Array.isArray(data.messages)) {
            const mapped = data.messages.map(m => ({
                id: m.id,
                senderCode: m.senderCode,
                targetCode: m.targetCode,
                senderName: m.senderName,
                senderAvatar: m.senderAvatar,
                text: m.text,
                type: m.type,
                lat: m.lat,
                lng: m.lng,
                createdAt: m.createdAt,
                timestamp: formatChatTime(m.createdAt)
            }));
            chatMessagesCache.set(targetCode, mapped);
            if (activeChatFriendCode === targetCode) {
                renderActiveRoomMessages();
            }
        }
    } catch (e) {}
}

async function postChatMessage({ text, type = 'text', location = null, targetCode = null }) {
    if (!text || !myProfile.friendCode) return;
    const target = targetCode || activeChatFriendCode;
    if (!target) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localMsg = {
        id: 'msg-' + Date.now(),
        senderCode: myProfile.friendCode,
        targetCode: target,
        senderName: myProfile.name,
        senderAvatar: myProfile.avatar,
        text: text,
        type: type,
        lat: location ? location.lat : null,
        lng: location ? location.lng : null,
        createdAt: new Date().toISOString(),
        timestamp: timeStr
    };

    // Optimistically push to local cache and re-render
    const existing = chatMessagesCache.get(target) || [];
    existing.push(localMsg);
    chatMessagesCache.set(target, existing);
    if (activeChatFriendCode === target) {
        renderActiveRoomMessages();
    }

    // Send to Cloudflare D1
    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderCode: myProfile.friendCode,
                targetCode: target,
                senderName: myProfile.name,
                senderAvatar: myProfile.avatar,
                text: text,
                type: type,
                location: location
            })
        });
    } catch (e) {
        console.warn('Failed to post message to D1:', e);
    }
}

async function fetchLatestMessagesForCurrentView() {
    if (!myProfile.friendCode) return;
    const chatDrawer = document.getElementById('chat-drawer');
    const isDrawerOpen = chatDrawer && !chatDrawer.classList.contains('collapsed');

    // 1. Selalu ambil pesan recent di latar belakang untuk menghitung notifikasi chat belum dibaca
    try {
        const resp = await fetch(`/api/messages?mode=recent&myCode=${encodeURIComponent(myProfile.friendCode)}`);
        const data = await resp.json();
        if (data && data.success && Array.isArray(data.messages)) {
            data.messages.forEach(m => {
                const peerCode = (m.senderCode === myProfile.friendCode) ? (m.targetCode || 'GROUP') : m.senderCode;
                if (peerCode) {
                    const existing = chatMessagesCache.get(peerCode) || [];
                    if (!existing.some(x => x.id === m.id)) {
                        existing.push({
                            id: m.id,
                            senderCode: m.senderCode,
                            targetCode: m.targetCode,
                            senderName: m.senderName,
                            senderAvatar: m.senderAvatar,
                            text: m.text,
                            type: m.type,
                            createdAt: m.createdAt,
                            timestamp: formatChatTime(m.createdAt)
                        });
                        existing.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
                        chatMessagesCache.set(peerCode, existing);
                    }
                }
            });

            // Jika sedang membuka room teman dan drawer terbuka, tandai sebagai sudah dibaca
            if (activeChatFriendCode && isDrawerOpen) {
                markChatAsRead(activeChatFriendCode);
            }

            // Perbarui tombol badge jumlah chat yang belum terbaca
            updateChatUnreadBadge();

            // Perbarui daftar percakapan jika sedang membuka inbox
            if (isDrawerOpen && !activeChatFriendCode) {
                renderConversationsList();
            }
        }
    } catch (e) {}

    // 2. Jika sedang berada di dalam ruang obrolan teman tertentu, perbarui percakapan ruang tersebut
    if (activeChatFriendCode) {
        await fetchMessagesForRoom(activeChatFriendCode);
        if (isDrawerOpen) {
            markChatAsRead(activeChatFriendCode);
        }
    }
}

// ==========================================
// Phase 2: Meetup Invitation Implementation
// ==========================================

function initMeetup() {
    const meetupModal = document.getElementById('meetup-modal');
    const btnCloseMeetup = document.getElementById('btn-close-meetup');
    const btnSubmitMeetup = document.getElementById('btn-submit-meetup');
    const noteInput = document.getElementById('meetup-note-input');
    const incomingModal = document.getElementById('incoming-meetup-modal');
    const btnAccept = document.getElementById('btn-accept-meetup');
    const btnReject = document.getElementById('btn-reject-meetup');

    // Place selection buttons
    document.querySelectorAll('.btn-place-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-place-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    if (btnCloseMeetup) {
        btnCloseMeetup.addEventListener('click', () => {
            meetupModal.classList.add('hidden');
        });
    }

    if (btnSubmitMeetup) {
        btnSubmitMeetup.addEventListener('click', () => {
            if (!activeMeetupTargetId) return;

            const targetFriend = friendMarkers.get(activeMeetupTargetId);
            if (!targetFriend) {
                showToast('Teman tidak online.');
                return;
            }

            const activePlaceBtn = document.querySelector('.btn-place-opt.active');
            let meetupLat, meetupLng, placeName;

            const type = activePlaceBtn.getAttribute('data-type');
            if (type === 'friend_loc') {
                meetupLat = targetFriend.data.lat;
                meetupLng = targetFriend.data.lng;
                placeName = `Lokasi ${targetFriend.data.name}`;
            } else if (type === 'my_loc') {
                meetupLat = myProfile.lat;
                meetupLng = myProfile.lng;
                placeName = `Lokasi ${myProfile.name}`;
            } else {
                meetupLat = parseFloat(activePlaceBtn.getAttribute('data-lat'));
                meetupLng = parseFloat(activePlaceBtn.getAttribute('data-lng'));
                placeName = activePlaceBtn.getAttribute('data-name');
            }

            const note = noteInput.value.trim() || 'Ayo ketemu!';

            const inviteData = {
                id: 'meetup-' + Date.now(),
                fromId: myId,
                fromName: myProfile.name,
                fromAvatar: myProfile.avatar,
                toId: activeMeetupTargetId,
                toName: targetFriend.data.name,
                placeName: placeName,
                lat: meetupLat,
                lng: meetupLng,
                note: note
            };

            if (socket && socket.connected) {
                socket.emit('send-meetup-invite', inviteData);
            }

            meetupModal.classList.add('hidden');
            showToast(`Ajakan ketemu di "${placeName}" terkirim ke ${targetFriend.data.name}!`);
        });
    }

    // Incoming Meetup Responses
    if (btnAccept) {
        btnAccept.addEventListener('click', async () => {
            if (!pendingIncomingInvite) return;

            incomingModal.classList.add('hidden');

            if (socket && socket.connected) {
                socket.emit('respond-meetup-invite', {
                    inviteId: pendingIncomingInvite.id,
                    fromId: myId,
                    fromName: myProfile.name,
                    toId: pendingIncomingInvite.fromId,
                    toName: pendingIncomingInvite.fromName,
                    accepted: true,
                    lat: pendingIncomingInvite.lat,
                    lng: pendingIncomingInvite.lng,
                    placeName: pendingIncomingInvite.placeName
                });
            }

            // Draw route towards the meetup place!
            showToast(`Ajakan diterima! Membuka rute ke ${pendingIncomingInvite.placeName}...`);
            const routeData = await fetchRoadRoute(myProfile.lat, myProfile.lng, pendingIncomingInvite.lat, pendingIncomingInvite.lng);
            renderRouteOnMap(routeData.coords);

            activeOtwData = {
                isSelfOtw: true,
                targetId: pendingIncomingInvite.fromId,
                targetName: pendingIncomingInvite.placeName,
                coords: routeData.coords,
                currentStep: 0,
                distanceKm: routeData.distanceKm,
                etaMinutes: routeData.etaMinutes
            };

            const banner = document.getElementById('otw-banner');
            document.getElementById('otw-eta-text').innerText = `${routeData.etaMinutes} Menit`;
            document.getElementById('otw-dist-text').innerText = `(${routeData.distanceKm} km)`;
            document.getElementById('otw-desc-text').innerText = `Rute Ketemu di ${pendingIncomingInvite.placeName}`;
            banner.classList.remove('hidden');

            pendingIncomingInvite = null;
        });
    }

    if (btnReject) {
        btnReject.addEventListener('click', () => {
            if (!pendingIncomingInvite) return;

            incomingModal.classList.add('hidden');

            if (socket && socket.connected) {
                socket.emit('respond-meetup-invite', {
                    inviteId: pendingIncomingInvite.id,
                    fromId: myId,
                    fromName: myProfile.name,
                    toId: pendingIncomingInvite.fromId,
                    toName: pendingIncomingInvite.fromName,
                    accepted: false
                });
            }

            showToast('Ajakan ditolak.');
            pendingIncomingInvite = null;
        });
    }
}

function openMeetupModal(targetId, targetName) {
    activeMeetupTargetId = targetId;
    closeReactionBar();

    const modal = document.getElementById('meetup-modal');
    const title = document.getElementById('meetup-modal-title');
    title.innerText = `Ajak Ketemu ${targetName}`;
    modal.classList.remove('hidden');
}

window.openMeetupModal = openMeetupModal;

function handleIncomingMeetupInvite(inviteData) {
    pendingIncomingInvite = inviteData;

    const modal = document.getElementById('incoming-meetup-modal');
    const title = document.getElementById('incoming-title');
    const desc = document.getElementById('incoming-desc');
    const note = document.getElementById('incoming-note-box');

    title.innerText = `${inviteData.fromName} Mengajak Ketemu!`;
    desc.innerText = `Tempat: ${inviteData.placeName}`;
    note.innerText = `"${inviteData.note}"`;

    modal.classList.remove('hidden');
    showToast(`Ajakan ketemu masuk dari ${inviteData.fromName}!`);
}

async function handleMeetupResponse(responseData) {
    if (responseData.accepted) {
        showToast(`${responseData.fromName} menerima ajakan ketemu di "${responseData.placeName}"!`);

        // Draw route to agreed meetup spot
        if (responseData.lat && responseData.lng) {
            const routeData = await fetchRoadRoute(myProfile.lat, myProfile.lng, responseData.lat, responseData.lng);
            renderRouteOnMap(routeData.coords);

            activeOtwData = {
                isSelfOtw: true,
                targetId: responseData.fromId,
                targetName: responseData.placeName,
                coords: routeData.coords,
                currentStep: 0,
                distanceKm: routeData.distanceKm,
                etaMinutes: routeData.etaMinutes
            };

            const banner = document.getElementById('otw-banner');
            document.getElementById('otw-eta-text').innerText = `${routeData.etaMinutes} Menit`;
            document.getElementById('otw-dist-text').innerText = `(${routeData.distanceKm} km)`;
            document.getElementById('otw-desc-text').innerText = `Menuju Titik Temu: ${responseData.placeName}`;
            banner.classList.remove('hidden');
        }
    } else {
        showToast(`${responseData.fromName} belum bisa bertemu saat ini.`);
    }
}

// ==========================================
// Phase 2: Proximity Alert (<= 500m) with Sound Chime
// ==========================================

let audioCtx = null;
let proxAlertedFriends = new Set();
let proxBannerDismissed = false;

function playProximityChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtx) {
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // Tone 1: Warm pleasant chime note (D5 - 587.33 Hz)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Tone 2: Bright uplifting chime note (A5 - 880 Hz)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.14);
        gain2.gain.setValueAtTime(0.22, now + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.14);
        osc2.stop(now + 0.65);
    } catch (e) {
        console.warn('Audio chime notice:', e);
    }
}

function checkProximityAlert() {
    const banner = document.getElementById('proximity-banner');
    if (!banner || !myProfile.lat || !myProfile.lng) return;

    let nearest = null;
    let minD = Infinity;

    friendMarkers.forEach((item) => {
        const friend = item.data;
        if (friend.lat && friend.lng) {
            const d = map.distance([myProfile.lat, myProfile.lng], [friend.lat, friend.lng]);
            if (d < minD) {
                minD = d;
                nearest = { friend, d };
            }

            // If friend moved far away (> 550m), reset alert flag so it can alert again if they re-enter
            if (d > 550 && proxAlertedFriends.has(friend.id)) {
                proxAlertedFriends.delete(friend.id);
            }
        }
    });

    // 500m proximity threshold
    if (nearest && nearest.d <= 500) {
        const distM = Math.round(nearest.d);
        const distText = distM < 1000 ? `${distM} meter` : `${(distM / 1000).toFixed(1)} km`;

        document.getElementById('prox-title').innerText = `${nearest.friend.name} Sudah Dekat!`;
        document.getElementById('prox-sub').innerText = `Jarak kalian tinggal ${distText} dari lokasimu!`;

        // First time entering 500m: play pleasant chime and show alert toast
        if (!proxAlertedFriends.has(nearest.friend.id)) {
            proxAlertedFriends.add(nearest.friend.id);
            proxBannerDismissed = false; // Reset dismiss when entering zone
            playProximityChime();
            showToast(`${nearest.friend.name} sudah dekat! (Jarak tinggal ${distText})`);

            // Optional browser notification if user gave permission
            if (window.Notification && Notification.permission === 'granted') {
                try {
                    new Notification(`${nearest.friend.name} Sudah Dekat!`, {
                        body: `Jarak kalian sekarang tinggal ${distText}!`,
                        icon: '/favicon.ico'
                    });
                } catch (e) {}
            }
        }

        if (!proxBannerDismissed) {
            banner.classList.remove('hidden');
        }
    } else {
        banner.classList.add('hidden');
        proxBannerDismissed = false;
    }
}

// ==========================================
// MAGIC INVITE LINK 1-CLICK SYSTEM
// ==========================================

function getMyInviteLink() {
    const code = myProfile.friendCode || 'AMEL-24';
    const base = window.location.protocol + '//' + window.location.host + window.location.pathname;
    return `${base}?invite=${encodeURIComponent(code)}`;
}

function shareInviteLink() {
    const link = getMyInviteLink();
    const title = 'Locanear - Peta Teman Real-time';
    const text = `Yuk pantau lokasi & ketemuan di Locanear bareng aku (${myProfile.name || 'Teman'})! Klik link ini untuk langsung terhubung:`;

    if (navigator.share) {
        navigator.share({
            title: title,
            text: `${text}\n${link}`,
            url: link
        }).catch(() => {});
    } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
                showToast('Tautan undangan berhasil disalin ke clipboard!');
            }).catch(() => {
                fallbackCopyText(link);
            });
        } else {
            fallbackCopyText(link);
        }
    }
}

function shareToWhatsApp() {
    const link = getMyInviteLink();
    const text = `Halo! Yuk saling pantau lokasi & ketemuan di Locanear bareng aku (${myProfile.name || 'Teman'}). Klik tautan ini untuk langsung terhubung:\n${link}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
}

async function handleMagicInviteForActiveUser(targetCode) {
    if (!targetCode) return;
    const cleanTarget = targetCode.trim().toUpperCase();
    if (cleanTarget === myProfile.friendCode) {
        showToast('Ini adalah tautan undangan Anda sendiri.');
        return;
    }
    if (confirmedFriends.has(cleanTarget)) {
        showToast(`Anda sudah berteman dengan [${cleanTarget}]!`);
        return;
    }

    const modal = document.getElementById('magic-invite-modal');
    const avatarEl = document.getElementById('magic-inviter-avatar');
    const nameEl = document.getElementById('magic-inviter-name');
    const btnAccept = document.getElementById('btn-accept-magic-invite');
    const btnDecline = document.getElementById('btn-decline-magic-invite');

    if (!modal) return;

    let inviterData = null;
    try {
        const resp = await fetch(`/api/invite?code=${encodeURIComponent(cleanTarget)}`);
        const data = await resp.json();
        if (data && data.success && data.user) {
            inviterData = data.user;
        }
    } catch (e) {}

    const inviterName = inviterData ? inviterData.name : cleanTarget;
    const inviterAvatar = inviterData ? inviterData.avatar : 'cool';

    if (avatarEl) {
        avatarEl.innerHTML = renderAvatarHtml(inviterAvatar, inviterName);
    }
    if (nameEl) {
        nameEl.innerText = `${inviterName} Mengajak Berteman!`;
    }

    modal.classList.remove('hidden');
    refreshLucideIcons();

    if (btnDecline) {
        btnDecline.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    if (btnAccept) {
        btnAccept.onclick = async () => {
            btnAccept.disabled = true;
            btnAccept.innerHTML = '<i data-lucide="loader-2" class="spin-icon" style="width: 16px; height: 16px; margin-right: 6px;"></i> <span>Menghubungkan...</span>';
            refreshLucideIcons();

            try {
                const postResp = await fetch('/api/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        myCode: myProfile.friendCode,
                        targetCode: cleanTarget
                    })
                });
                const postData = await postResp.json();

                modal.classList.add('hidden');
                btnAccept.disabled = false;
                btnAccept.innerHTML = '<i data-lucide="user-plus" style="width: 16px; height: 16px; margin-right: 6px;"></i> <span>Terima & Bagikan Lokasi</span>';

                if (postData && postData.success) {
                    showToast(`Sekarang Anda berteman dengan ${postData.friend ? postData.friend.name : inviterName}!`);
                    const friend = postData.friend || {
                        id: cleanTarget,
                        friendCode: cleanTarget,
                        name: inviterName,
                        avatar: inviterAvatar,
                        color: inviterData ? inviterData.color : '#06b6d4',
                        lat: inviterData ? inviterData.lat : null,
                        lng: inviterData ? inviterData.lng : null
                    };
                    if (!friend.id) friend.id = friend.friendCode;
                    confirmedFriends.set(friend.friendCode, friend);
                    upsertFriend(friend);
                    updateFriendUI();
                    if (map && friend.lat && friend.lng) {
                        map.flyTo([friend.lat, friend.lng], 16, { animate: true });
                    }
                    syncFriendsAndLocation();
                } else {
                    showToast(postData ? postData.message : 'Gagal menghubungkan pertemanan.');
                }
            } catch (err) {
                modal.classList.add('hidden');
                btnAccept.disabled = false;
                btnAccept.innerHTML = '<i data-lucide="user-plus" style="width: 16px; height: 16px; margin-right: 6px;"></i> <span>Terima & Bagikan Lokasi</span>';
                showToast('Gagal menghubungi server: ' + err.message);
            }
        };
    }
}

// ==========================================
// FASE 3: SISTEM KODE TEMAN & KELOLA TEMAN
// ==========================================

let pendingRemoveFriendCode = null;

function initFriendCodeSystem() {
    const codeValEl = document.getElementById('my-friend-code-val');
    if (codeValEl) {
        codeValEl.innerText = myProfile.friendCode || 'Membuat...';
    }

    // Magic Invite Link Drawer Buttons
    const btnDrawerShare = document.getElementById('btn-drawer-magic-share');
    const btnDrawerWa = document.getElementById('btn-drawer-magic-wa');
    if (btnDrawerShare) btnDrawerShare.addEventListener('click', shareInviteLink);
    if (btnDrawerWa) btnDrawerWa.addEventListener('click', shareToWhatsApp);

    // Sub-Tabs Switching in Friends Drawer
    const tabBtnFriends = document.getElementById('tab-btn-my-friends');
    const tabBtnRequests = document.getElementById('tab-btn-requests');
    const paneFriends = document.getElementById('friends-tab-pane');
    const paneRequests = document.getElementById('requests-tab-pane');

    if (tabBtnFriends && tabBtnRequests && paneFriends && paneRequests) {
        tabBtnFriends.addEventListener('click', () => {
            tabBtnFriends.classList.add('active');
            tabBtnRequests.classList.remove('active');
            paneFriends.classList.remove('hidden');
            paneRequests.classList.add('hidden');
        });

        tabBtnRequests.addEventListener('click', () => {
            tabBtnRequests.classList.add('active');
            tabBtnFriends.classList.remove('active');
            paneRequests.classList.remove('hidden');
            paneFriends.classList.add('hidden');
            renderRequestsList();
        });
    }

    // Salin Kode Teman ke Clipboard
    const btnCopy = document.getElementById('btn-copy-code');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const codeToCopy = myProfile.friendCode || (codeValEl ? codeValEl.innerText : '');
            if (!codeToCopy || codeToCopy === 'Membuat...') {
                showToast('Kode teman sedang dibuat...');
                return;
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(codeToCopy).then(() => {
                    const copyIcon = document.getElementById('copy-code-icon');
                    const copyText = document.getElementById('copy-code-text');
                    if (copyIcon && copyText) {
                        copyIcon.setAttribute('data-lucide', 'check');
                        copyText.innerText = 'Tersalin!';
                        refreshLucideIcons();
                        setTimeout(() => {
                            copyIcon.setAttribute('data-lucide', 'copy');
                            copyText.innerText = 'Salin';
                            refreshLucideIcons();
                        }, 2000);
                    }
                    showToast(`Kode teman ${codeToCopy} disalin ke clipboard!`);
                }).catch(() => {
                    fallbackCopyText(codeToCopy);
                });
            } else {
                fallbackCopyText(codeToCopy);
            }
        });
    }

    // Cari Teman & Kirim Friend Request via Kode
    const btnAdd = document.getElementById('btn-add-by-code');
    const inputCode = document.getElementById('input-friend-code');
    const searchResultBox = document.getElementById('friend-search-result-box');

    async function handleSearchFriendByCode() {
        if (!inputCode) return;
        const rawCode = inputCode.value.trim().toUpperCase();
        if (!rawCode) {
            showToast('Masukkan kode teman terlebih dahulu.');
            return;
        }

        const validFormat = /^[A-Z0-9]{2,10}-\d{2}$/;
        if (!validFormat.test(rawCode)) {
            showToast('Format kode harus [NAMA]-[2 ANGKA] (contoh: ILPRAD-07).');
            return;
        }

        if (rawCode === myProfile.friendCode) {
            showToast('Ini adalah kode teman Anda sendiri.');
            return;
        }

        try {
            const resp = await fetch(`/api/invite?code=${encodeURIComponent(rawCode)}`);
            const data = await resp.json();
            if (data && data.success && data.user) {
                const foundUser = data.user;
                if (searchResultBox) {
                    searchResultBox.classList.remove('hidden');

                    const isFriend = confirmedFriends.has(foundUser.friendCode);
                    let actionBtnHtml = '';
                    if (isFriend) {
                        actionBtnHtml = `<span style="font-size: 11px; color: var(--accent-chartreuse); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check" style="width: 14px; height: 14px;"></i> Sudah Berteman</span>`;
                    } else {
                        actionBtnHtml = `<button class="btn-send-req" id="btn-do-send-req" style="display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="user-plus" style="width: 14px; height: 14px;"></i> Tambah Teman</button>`;
                    }

                    searchResultBox.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div class="friend-avatar" style="width: 38px; height: 38px; border-color: ${foundUser.color || '#BEE354'}">
                                    ${renderAvatarHtml(foundUser.avatar, foundUser.name)}
                                </div>
                                <div>
                                    <div style="font-weight: 700; color: #fff; font-size: 13px;">${foundUser.name}</div>
                                    <div style="font-size: 11px; color: var(--accent-chartreuse); font-weight: 800;">${foundUser.friendCode}</div>
                                </div>
                            </div>
                            <div>
                                ${actionBtnHtml}
                            </div>
                        </div>
                    `;
                    refreshLucideIcons();

                    const btnSend = document.getElementById('btn-do-send-req');
                    if (btnSend) {
                        btnSend.addEventListener('click', () => {
                            sendFriendRequest(foundUser.friendCode, foundUser.name, btnSend);
                        });
                    }
                }
                return;
            } else {
                if (searchResultBox) searchResultBox.classList.add('hidden');
                showToast(data ? data.message : `Kode "${rawCode}" tidak ditemukan.`);
            }
        } catch (err) {
            if (searchResultBox) searchResultBox.classList.add('hidden');
            showToast(`Gagal mencari kode teman: ${err.message}`);
        }
    }

    if (btnAdd) {
        btnAdd.addEventListener('click', handleSearchFriendByCode);
    }
    if (inputCode) {
        inputCode.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchFriendByCode();
            }
        });
    }

    initRemoveFriendModal();
    renderRequestsList();
}

// Send Friend Request / Add Friend
async function sendFriendRequest(targetCode, targetName, btnEl) {
    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '<i data-lucide="loader-2" class="spin-icon" style="width: 14px; height: 14px; margin-right: 4px;"></i> Menghubungkan...';
        refreshLucideIcons();
    }

    try {
        const resp = await fetch('/api/friends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'add',
                myCode: myProfile.friendCode,
                targetCode: targetCode
            })
        });
        const res = await resp.json();

        if (res && res.success) {
            showToast(`Berhasil berteman dengan ${targetName} [${targetCode}]!`);
            if (res.friend) {
                const friendObj = {
                    id: res.friend.friendCode,
                    friendCode: res.friend.friendCode,
                    name: res.friend.name,
                    avatar: res.friend.avatar,
                    color: res.friend.color,
                    lat: res.friend.lat,
                    lng: res.friend.lng,
                    battery: res.friend.battery !== undefined ? res.friend.battery : 100,
                    ghostMode: !!res.friend.ghostMode,
                    online: true,
                    accuracy: 20
                };
                confirmedFriends.set(res.friend.friendCode, friendObj);
                upsertFriend(friendObj);
                updateFriendUI();
                if (map && friendObj.lat && friendObj.lng) {
                    map.flyTo([friendObj.lat, friendObj.lng], 16, { animate: true });
                }
            }
            syncFriendsAndLocation();

            if (btnEl) {
                btnEl.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px; margin-right: 4px;"></i> Terhubung!';
                refreshLucideIcons();
            }
            setTimeout(() => {
                const box = document.getElementById('friend-search-result-box');
                if (box) box.classList.add('hidden');
            }, 2500);
        } else {
            showToast(res ? res.message : 'Gagal menambahkan teman.');
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.innerHTML = '<i data-lucide="user-plus" style="width: 14px; height: 14px; margin-right: 4px;"></i> Tambah Teman';
                refreshLucideIcons();
            }
        }
    } catch (err) {
        showToast('Koneksi gagal: ' + err.message);
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = '<i data-lucide="user-plus" style="width: 14px; height: 14px; margin-right: 4px;"></i> Tambah Teman';
            refreshLucideIcons();
        }
    }
}

// Render Incoming Friend Requests List
function renderRequestsList() {
    const listEl = document.getElementById('requests-list');
    const reqCountBadge = document.getElementById('requests-tab-count');
    if (reqCountBadge) reqCountBadge.innerText = incomingRequests.size;

    if (!listEl) return;

    if (incomingRequests.size === 0) {
        listEl.innerHTML = `<div class="empty-state">Tidak ada permintaan pertemanan tertunda.<br>Saat ada teman yang menambahkan Anda via kode teman, permintaan akan muncul di sini.</div>`;
        return;
    }

    let html = '';
    incomingRequests.forEach((req) => {
        html += `
            <div class="request-item">
                <div class="request-left">
                    <div class="friend-avatar" style="width: 40px; height: 40px; border-color: ${req.fromColor || '#BEE354'}">
                        ${renderAvatarHtml(req.fromAvatar, req.fromName)}
                    </div>
                    <div class="request-info">
                        <div class="request-name">${req.fromName}</div>
                        <span class="request-code">${req.fromCode}</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn-accept-req" onclick="acceptFriendRequest('${req.fromCode}')" title="Terima Pertemanan">
                        <i data-lucide="check" style="width: 14px; height: 14px; margin-right: 4px;"></i> Terima
                    </button>
                    <button class="btn-reject-req" onclick="rejectFriendRequest('${req.fromCode}')" title="Tolak Permintaan">
                        <i data-lucide="x" style="width: 14px; height: 14px; margin-right: 4px;"></i> Tolak
                    </button>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
    refreshLucideIcons();
}

// Accept Friend Request
window.acceptFriendRequest = function(fromCode) {
    if (!socket || !socket.connected) {
        showToast('Tidak terhubung ke server.');
        return;
    }

    socket.emit('accept-friend-request', { fromCode }, (res) => {
        if (res && res.success) {
            incomingRequests.delete(fromCode);
            renderRequestsList();
            if (res.friend) {
                confirmedFriends.set(res.friend.friendCode, res.friend);
                upsertFriend(res.friend);
                updateFriendUI();
                showToast(`Sekarang Anda berteman dengan ${res.friend.name}!`);
            }
        } else {
            showToast('Gagal menerima pertemanan.');
        }
    });
};

// Reject Friend Request
window.rejectFriendRequest = function(fromCode) {
    if (!socket || !socket.connected) {
        showToast('Tidak terhubung ke server.');
        return;
    }

    socket.emit('reject-friend-request', { fromCode }, (res) => {
        incomingRequests.delete(fromCode);
        renderRequestsList();
        showToast('Permintaan pertemanan ditolak.');
    });
};

// Remove Friend Confirmation Dialog
window.confirmRemoveFriend = function(friendCode, friendName) {
    pendingRemoveFriendCode = friendCode;
    const modal = document.getElementById('confirm-remove-modal');
    const targetNameEl = document.getElementById('remove-target-name');
    if (targetNameEl) targetNameEl.innerText = friendName || friendCode;
    if (modal) modal.classList.remove('hidden');
};

function initRemoveFriendModal() {
    const modal = document.getElementById('confirm-remove-modal');
    const btnYes = document.getElementById('btn-confirm-remove-yes');
    const btnCancel = document.getElementById('btn-confirm-remove-cancel');

    if (btnCancel && modal) {
        btnCancel.addEventListener('click', () => {
            modal.classList.add('hidden');
            pendingRemoveFriendCode = null;
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                pendingRemoveFriendCode = null;
            }
        });
    }

    if (btnYes && modal) {
        btnYes.addEventListener('click', () => {
            if (!pendingRemoveFriendCode) return;
            const targetCode = pendingRemoveFriendCode;

            // Remove from Cloudflare D1
            fetch('/api/friends', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'remove',
                    myCode: myProfile.friendCode,
                    targetCode: targetCode
                })
            }).catch(() => {});

            if (socket && socket.connected) {
                socket.emit('remove-friend', { friendCode: targetCode }, (res) => {
                    // Also confirmed via socket event
                });
            }

            confirmedFriends.delete(targetCode);
            for (const [id, item] of friendMarkers.entries()) {
                if (item.data && item.data.friendCode === targetCode) {
                    map.removeLayer(item.marker);
                    if (item.circle) map.removeLayer(item.circle);
                    friendMarkers.delete(id);
                    break;
                }
            }

            updateFriendUI();
            modal.classList.add('hidden');
            showToast(`Teman ${targetCode} telah dihapus.`);
            pendingRemoveFriendCode = null;
        });
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(`Kode ${text} berhasil disalin!`);
    } catch (err) {
        showToast(`Kode Anda: ${text}`);
    }
    document.body.removeChild(textArea);
}

// ==========================================
// FASE 3: RIWAYAT 7 HARI & BREADCRUMB TRAILS
// ==========================================

function getTodayDateKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getPast7Days() {
    const days = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dateNum = String(d.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${dateNum}`;

        let label = `${d.getDate()} ${monthNames[d.getMonth()]}`;
        if (i === 0) label = 'Hari Ini';
        else if (i === 1) label = 'Kemarin';

        days.push({
            key: key,
            label: label,
            sub: `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`
        });
    }
    return days;
}

function cleanOldHistory() {
    // Hapus data riwayat yang lebih dari 7 hari
    const validKeys = new Set(getPast7Days().map(d => `zenloc_hist_${d.key}`));
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('zenloc_hist_') && !validKeys.has(k)) {
                localStorage.removeItem(k);
            }
        }
    } catch (e) {}
}

function logLocationToHistory(lat, lng, speed = 0) {
    if (lat == null || lng == null) return;
    const todayKey = getTodayDateKey();
    const storageKey = 'zenloc_hist_' + todayKey;

    let points = [];
    try {
        points = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (e) {
        points = [];
    }

    // Cek jarak dengan titik terakhir untuk efisiensi penyimpanan (minimal berpindah 10 meter)
    if (points.length > 0 && map) {
        const lastPt = points[points.length - 1];
        const dist = map.distance([lastPt.lat, lastPt.lng], [lat, lng]);
        if (dist < 10) return;
    }

    // Cek apakah ada teman terdekat (radius <= 200m) untuk menandai momen riwayat bersama
    const togetherWith = [];
    friendMarkers.forEach(item => {
        if (item.data.online !== false && item.data.lat && item.data.lng && map) {
            const d = map.distance([lat, lng], [item.data.lat, item.data.lng]);
            if (d <= 200) {
                togetherWith.push(item.data.name);
            }
        }
    });

    const newPt = {
        t: Date.now(),
        lat: lat,
        lng: lng,
        speed: speed,
        together: togetherWith
    };

    points.push(newPt);
    try {
        localStorage.setItem(storageKey, JSON.stringify(points));
    } catch (e) {}

    // Jika sedang melihat hari ini, perbarui polylines di peta
    if (selectedHistoryDateKey === todayKey) {
        activeDayPoints = points;
        renderCurrentDayTrails();
        updateDayStatsUI(points);
    }
}

function initHistorySystem() {
    cleanOldHistory();
    selectedHistoryDateKey = getTodayDateKey();

    // Inisialisasi Layer Polylines di Leaflet
    if (map) {
        selfTrailLayer = L.polyline([], {
            color: '#8b5cf6',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8',
            lineJoin: 'round'
        });

        togetherTrailLayer = L.polyline([], {
            color: '#f59e0b',
            weight: 5,
            opacity: 0.95,
            lineJoin: 'round'
        });

        if (isTrailVisible) {
            selfTrailLayer.addTo(map);
            togetherTrailLayer.addTo(map);
        }
    }

    // Render 7-Day Date Pills
    renderDatePills();

    // Tab Jejak Sendiri vs Bersama
    const tabSelf = document.getElementById('tab-hist-self');
    const tabTogether = document.getElementById('tab-hist-together');

    if (tabSelf && tabTogether) {
        tabSelf.addEventListener('click', () => {
            activeHistoryTab = 'self';
            tabSelf.classList.add('active');
            tabTogether.classList.remove('active');
            renderCurrentDayTrails();
            renderTimelineList(activeDayPoints);
        });

        tabTogether.addEventListener('click', () => {
            activeHistoryTab = 'together';
            tabTogether.classList.add('active');
            tabSelf.classList.remove('active');
            renderCurrentDayTrails();
            renderTimelineList(activeDayPoints);
        });
    }

    // Tombol Bersihkan Riwayat Tanggal Ini
    const btnClear = document.getElementById('btn-clear-history');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm(`Hapus riwayat perjalanan untuk tanggal ${selectedHistoryDateKey}?`)) {
                localStorage.removeItem('zenloc_hist_' + selectedHistoryDateKey);
                loadHistoryForDate(selectedHistoryDateKey);
                showToast('Riwayat perjalanan tanggal ini telah dibersihkan.');
            }
        });
    }

    // Replay Speed Buttons
    document.querySelectorAll('.speed-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            replaySpeed = parseInt(btn.getAttribute('data-speed')) || 1;
            if (replayInterval) {
                stopReplay();
                startReplay();
            }
        });
    });

    // Replay Play / Pause
    const btnReplay = document.getElementById('btn-replay-play');
    if (btnReplay) {
        btnReplay.addEventListener('click', () => {
            if (replayInterval) {
                stopReplay();
            } else {
                startReplay();
            }
        });
    }

    // Progress slider
    const slider = document.getElementById('replay-progress-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (activeDayPoints.length > 0) {
                replayCurrentIdx = Math.floor((val / 100) * (activeDayPoints.length - 1));
                updateReplayMarkerPosition(replayCurrentIdx);
            }
        });
    }

    // Muat riwayat awal hari ini
    loadHistoryForDate(selectedHistoryDateKey);
}

function renderDatePills() {
    const container = document.getElementById('history-date-pills');
    if (!container) return;

    const days = getPast7Days();
    let html = '';
    days.forEach(day => {
        const isActive = day.key === selectedHistoryDateKey;
        html += `
            <button class="date-pill ${isActive ? 'active' : ''}" data-date="${day.key}">
                <span>${day.label}</span>
                <span class="pill-sub">${day.sub}</span>
            </button>
        `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.date-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.date-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const dateKey = btn.getAttribute('data-date');
            loadHistoryForDate(dateKey);
        });
    });
}

function loadHistoryForDate(dateKey) {
    selectedHistoryDateKey = dateKey;
    stopReplay();

    let points = [];
    try {
        points = JSON.parse(localStorage.getItem('zenloc_hist_' + dateKey) || '[]');
    } catch (e) {
        points = [];
    }

    activeDayPoints = points;
    renderCurrentDayTrails();
    updateDayStatsUI(points);
    renderTimelineList(points);

    // Reset Replay Slider
    const slider = document.getElementById('replay-progress-slider');
    if (slider) {
        slider.value = 0;
        slider.disabled = points.length < 2;
    }
}

function renderCurrentDayTrails() {
    if (!map || !selfTrailLayer || !togetherTrailLayer) return;

    if (!isTrailVisible) {
        selfTrailLayer.setLatLngs([]);
        togetherTrailLayer.setLatLngs([]);
        return;
    }

    const selfCoords = [];
    const togetherCoords = [];

    activeDayPoints.forEach(pt => {
        const latLng = [pt.lat, pt.lng];
        selfCoords.push(latLng);
        if (pt.together && pt.together.length > 0) {
            togetherCoords.push(latLng);
        }
    });

    if (activeHistoryTab === 'self') {
        selfTrailLayer.setLatLngs(selfCoords);
        togetherTrailLayer.setLatLngs([]);
    } else {
        selfTrailLayer.setLatLngs([]);
        togetherTrailLayer.setLatLngs(togetherCoords);
    }
}

function updateDayStatsUI(points) {
    let totalDistM = 0;
    let stopCount = 0;

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        if (map) {
            totalDistM += map.distance([prev.lat, prev.lng], [curr.lat, curr.lng]);
        }
        if (curr.speed != null && curr.speed <= 2) {
            stopCount++;
        }
    }

    const totalKm = (totalDistM / 1000).toFixed(1);
    let movingMinutes = 0;
    if (points.length >= 2) {
        const firstTime = points[0].t;
        const lastTime = points[points.length - 1].t;
        movingMinutes = Math.round(Math.max(0, lastTime - firstTime) / 60000);
    }

    const distEl = document.getElementById('hist-stat-dist');
    const durEl = document.getElementById('hist-stat-dur');
    const stopsEl = document.getElementById('hist-stat-stops');

    if (distEl) distEl.innerText = `${totalKm} km`;
    if (durEl) durEl.innerText = `${movingMinutes} mnt`;
    if (stopsEl) stopsEl.innerText = `${stopCount} Titik`;
}

function renderTimelineList(points) {
    const listEl = document.getElementById('history-timeline-list');
    if (!listEl) return;

    if (!points || points.length === 0) {
        listEl.innerHTML = `<div class="empty-state">Belum ada jejak riwayat untuk tanggal ini.<br>Gunakan joystick atau pilih lokasi untuk mencatat perjalanan!</div>`;
        return;
    }

    let filtered = points;
    if (activeHistoryTab === 'together') {
        filtered = points.filter(pt => pt.together && pt.together.length > 0);
        if (filtered.length === 0) {
            listEl.innerHTML = `<div class="empty-state">Tidak ada catatan riwayat bersama teman pada tanggal ini.<br>Momen kebersamaan tercatat saat berada dekat teman (&le; 200m).</div>`;
            return;
        }
    }

    let html = '';
    const reversed = [...filtered].reverse().slice(0, 25);
    reversed.forEach(pt => {
        const timeStr = new Date(pt.t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const hasTogether = pt.together && pt.together.length > 0;
        const togetherNames = hasTogether ? pt.together.join(', ') : '';

        const badgeIcon = hasTogether 
            ? '<i data-lucide="users" style="width: 16px; height: 16px;"></i>' 
            : (pt.speed > 5 ? '<i data-lucide="navigation-2" style="width: 16px; height: 16px;"></i>' : '<i data-lucide="map-pin" style="width: 16px; height: 16px;"></i>');

        html += `
            <div class="timeline-item">
                <div class="timeline-left">
                    <span class="timeline-badge">${badgeIcon}</span>
                    <div>
                        <div class="timeline-title">${hasTogether ? `Bersama ${togetherNames}` : (pt.speed > 5 ? `Bergerak (${pt.speed} km/h)` : 'Titik Singgah')}</div>
                        <div class="timeline-time">${timeStr} • [${pt.lat.toFixed(4)}, ${pt.lng.toFixed(4)}]</div>
                    </div>
                </div>
                ${hasTogether ? `<span class="timeline-together-badge"><i data-lucide="heart-handshake" style="width: 12px; height: 12px; margin-right: 4px;"></i> Bersama</span>` : ''}
            </div>
        `;
    });

    listEl.innerHTML = html;
    refreshLucideIcons();
}

// Replay History Engine
function startReplay() {
    if (!activeDayPoints || activeDayPoints.length < 2) {
        showToast('Butuh minimal 2 titik riwayat untuk memutar jejak.');
        return;
    }

    const btnPlay = document.getElementById('btn-replay-play');
    const statusText = document.getElementById('replay-status-text');
    const statusDot = document.getElementById('replay-status-dot');

    if (btnPlay) {
        btnPlay.innerHTML = '<i data-lucide="pause" style="width: 16px; height: 16px;"></i> <span id="replay-btn-label">Jeda</span>';
        btnPlay.classList.add('playing');
        refreshLucideIcons();
    }
    if (statusText) statusText.innerText = `Memutar Jejak (${replaySpeed}x)`;
    if (statusDot) statusDot.classList.add('active');

    if (replayCurrentIdx >= activeDayPoints.length - 1) {
        replayCurrentIdx = 0;
    }

    const stepDelay = Math.max(80, Math.floor(600 / replaySpeed));

    replayInterval = setInterval(() => {
        if (replayCurrentIdx >= activeDayPoints.length - 1) {
            stopReplay();
            showToast('Pemutaran jejak perjalanan selesai!');
            return;
        }

        replayCurrentIdx++;
        updateReplayMarkerPosition(replayCurrentIdx);

        const slider = document.getElementById('replay-progress-slider');
        if (slider) {
            slider.value = Math.round((replayCurrentIdx / (activeDayPoints.length - 1)) * 100);
        }
    }, stepDelay);
}

function stopReplay() {
    if (replayInterval) {
        clearInterval(replayInterval);
        replayInterval = null;
    }

    const btnPlay = document.getElementById('btn-replay-play');
    const statusText = document.getElementById('replay-status-text');
    const statusDot = document.getElementById('replay-status-dot');

    if (btnPlay) {
        btnPlay.innerHTML = '<i data-lucide="play" style="width: 16px; height: 16px;"></i> <span id="replay-btn-label">Putar Jejak</span>';
        btnPlay.classList.remove('playing');
        refreshLucideIcons();
    }
    if (statusText) statusText.innerText = 'Putar Ulang Jejak';
    if (statusDot) statusDot.classList.remove('active');
}

function updateReplayMarkerPosition(idx) {
    if (!activeDayPoints || !activeDayPoints[idx] || !map) return;
    const pt = activeDayPoints[idx];
    const latLng = [pt.lat, pt.lng];

    if (!replayMarker) {
        const replayIcon = L.divIcon({
            className: 'replay-anim-icon',
            html: `
                <div style="background: linear-gradient(135deg, #10b981, #059669); border: 2px solid #fff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(16, 185, 129, 0.8);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });
        replayMarker = L.marker(latLng, { icon: replayIcon, zIndexOffset: 2000 }).addTo(map);
    } else {
        replayMarker.setLatLng(latLng);
    }

    map.panTo(latLng, { animate: true, duration: 0.2 });
}


// ==== Init ====
new WOW().init();

// تاریخ آخرین آپدیت
const lastUpdateEl = document.getElementById('lastUpdate');
if (lastUpdateEl) lastUpdateEl.textContent = new Date().toLocaleString('fa-IR');

// ست کردن عرض XP بر اساس data-attribute
document.querySelectorAll('[data-xp-percent]').forEach(el => {
    const val = Number(el.getAttribute('data-xp-percent')) || 0;
    el.style.width = Math.max(0, Math.min(val, 100)) + '%';
});

// ==== SPA Router ساده با hash ====
const viewsMap = {
    'home': 'view-home',
    'competitions': 'view-competitions',
    'rules': 'view-rules',
    'stats': 'view-stats',
    'achievements-section': 'view-achievements-section',
    'community': 'view-community',
    'shop': 'view-shop',
    'account': 'view-account',
};

function showView(key) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const id = viewsMap[key] || viewsMap['home'];
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.side-nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-view') === key);
    });

    // اگر وارد حساب شدیم، UI را همگام کن
    if (key === 'account') bindAccountUI();
}
function handleHashChange() {
    const key = (location.hash || '#home').replace('#', '');
    showView(key);
}
// جلوگیری از اسکرول و کار با hash
document.querySelectorAll('.side-nav a[data-view]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const key = a.getAttribute('data-view');
        if (location.hash.replace('#', '') !== key) {
            location.hash = key;
        } else {
            showView(key);
        }
    });
});
window.addEventListener('hashchange', handleHashChange);
handleHashChange();

// ==== لیدربورد نمونه ====
const leaders = [
    { pos: 1, name: 'MinaFX', rank: 'Master I', avatar: 'https://i.pravatar.cc/100?img=5', pnl: '+12.4%' },
    { pos: 2, name: 'Ali_Rez', rank: 'Diamond II', avatar: 'https://i.pravatar.cc/100?img=14', pnl: '+9.8%' },
    { pos: 3, name: 'SaeedPro', rank: 'Platinum III', avatar: 'https://i.pravatar.cc/100?img=9', pnl: '+7.2%' },
    { pos: 4, name: 'Nika', rank: 'Gold I', avatar: 'https://i.pravatar.cc/100?img=32', pnl: '+6.1%' },
    { pos: 5, name: 'Armin', rank: 'Silver II', avatar: 'https://i.pravatar.cc/100?img=25', pnl: '+5.0%' }
];

const lbBody = document.getElementById('lbBody');
if (lbBody) {
    leaders.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td class="ps-3" style="width:60px"><span class="rank-badge">#${l.pos}</span></td>
      <td>
        <img class="leader-avatar me-2" src="${l.avatar}" alt="${l.name}"/>
        <span class="text-white">${l.name}</span>
        <div class="small text-muted-2">${l.rank}</div>
      </td>
      <td class="text-end pe-3"><span class="text-white">${l.pnl}</span></td>`;
        lbBody.appendChild(tr);
    });
}

// ==== مسابقات ====
const comps = [
    {
        id: 4,
        tag: 'classic',
        title: 'مسابقه شنبه ۲۳ آگوست',
        prize: 'تقسیم سود از استخر',
        entry: '10$',
        start: 'شنبه 23 آگوست، 09:00–22:00',
        startDate: '2025-08-23T09:00:00',
        endDate: '2025-08-23T22:00:00',
        registered: false,
        rules: [
            'دراودان کلی 10%',
            'ریسک شناور 3%',
            'تعداد کندل: حدود 1000 تا 3000 (~3 روز)',
            'نماد: از بین نمادهای پرحجم فارکس/کریپتو — جزئیات در قوانین'
        ]
    },
    { id: 1, tag: 'free', title: 'مسابقه آزمایشی', prize: 100, entry: 'رایگان', start: 'امروز 20:00', startDate: null, endDate: null, registered: true, rules: ['حد ضرر روزانه 3%', 'تارگت 8%'] },
    { id: 2, tag: 'classic', title: 'کلاسیک 10K', prize: 500, entry: '20$', start: 'فردا 20:00', startDate: null, endDate: null, registered: false, rules: ['حد ضرر روزانه 4%', 'تارگت 10%'] },
    { id: 3, tag: 'vip', title: 'ویژه Elite', prize: 2000, entry: 'Ticket', start: 'جمعه 20:00', startDate: null, endDate: null, registered: false, rules: ['قوانین سفت‌تر', 'KYC لازم'] },
];

const compWrap = document.getElementById('compCards');
function renderComps(filter = 'all') {
    if (!compWrap) return;
    compWrap.innerHTML = '';
    comps
        .filter(c => filter === 'all' || c.tag === filter)
        .forEach(c => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            const prizeHtml = (typeof c.prize === 'number') ? `$${c.prize}` : c.prize;
            const rulesHtml = c.rules.map(r => `<span class='chip'>${r}</span>`).join('');
            const status = c.registered ? '<span class="chip">Registered</span>' : '';
            col.innerHTML = `
        <div class="p-3 border rounded-3 h-100 border-soft">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h6 class="text-white m-0">${c.title}</h6>
            <div class="d-flex align-items-center gap-2">
              <span class="chip">${c.tag.toUpperCase()}</span>${status}
            </div>
          </div>
          <div class="text-muted-2 small mb-2">شروع: ${c.start}</div>
          <div class="d-flex flex-wrap gap-2 mb-3">${rulesHtml}</div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-white">جایزه: <b>${prizeHtml}</b></div>
            <a href="#rules" class="cmn--btn ${c.registered ? 'btn--transparent' : 'btn--white'}">
              ${c.registered ? 'ثبت‌نام شده' : 'ورود: ' + c.entry}
            </a>
          </div>
        </div>`;
            compWrap.appendChild(col);
        });
}
renderComps();
document.getElementById('compFilter')?.addEventListener('change', e => renderComps(e.target.value));

// ==== شمارش‌معکوس (نزدیک‌ترین مسابقه آینده یا fallback ساعت 20:00) ====
(function () {
    const cd = document.getElementById('countdown');
    if (!cd) return;

    function nextEightPM() {
        const now = new Date();
        const t = new Date();
        t.setHours(20, 0, 0, 0);
        if (t <= now) t.setDate(t.getDate() + 1);
        return t;
    }
    function nextEventStart() {
        const now = new Date();
        const times = comps
            .map(c => c.startDate ? new Date(c.startDate) : null)
            .filter(d => d && d > now)
            .sort((a, b) => a - b);
        return times[0] || null;
    }
    const target = nextEventStart() || nextEightPM();

    function tick() {
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) { cd.textContent = '00:00:00'; return; }
        const h = String(Math.floor(diff / 3.6e6)).padStart(2, '0');
        const m = String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, '0');
        const s = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
        cd.textContent = `${h}:${m}:${s}`;
    }
    tick(); setInterval(tick, 1000);
})();

// ==== دکمه شرکت (نمونه) ====
document.getElementById('joinBtn')?.addEventListener('click', function (e) {
    e.preventDefault();
    alert('ورود به مسابقه انجام شد! (نمونه)');
    const n = document.getElementById('notifDot');
    if (n) n.style.display = 'none';
});

// ==== حساب کاربری (localStorage نمونه) ====
const defaultAcc = {
    name: 'علی رضایی',
    username: 'Ali_Rez',
    email: 'ali@example.com',
    phone: '09xxxxxxxxx',
    avatar: 'https://i.pravatar.cc/100?img=12'
};
const ACC_KEY = 'btt_account';

function loadAccount() {
    try {
        return { ...defaultAcc, ...(JSON.parse(localStorage.getItem(ACC_KEY)) || {}) };
    } catch {
        return { ...defaultAcc };
    }
}
function saveAccount(data) {
    localStorage.setItem(ACC_KEY, JSON.stringify(data));
}

function bindAccountUI() {
    const data = loadAccount();
    const $ = (id) => document.getElementById(id);

    // فیلدها
    $('#accName')?.setAttribute('value', data.name || '');
    $('#accUsername')?.setAttribute('value', data.username || '');
    $('#accEmail')?.setAttribute('value', data.email || '');
    $('#accPhone')?.setAttribute('value', data.phone || '');
    $('#accAvatar')?.setAttribute('value', data.avatar || '');

    // هدر کوچک
    if ($('#headerName')) $('#headerName').textContent = data.name || '—';
    if ($('#headerAvatar')) $('#headerAvatar').src = data.avatar || defaultAcc.avatar;

    // پیش‌نمایش‌ها
    const avatarURL = data.avatar || defaultAcc.avatar;
    $('#accAvatarPreview') && ($('#accAvatarPreview').src = avatarURL);
    $('#accSidebarAvatar') && ($('#accSidebarAvatar').src = avatarURL);
    $('#accSidebarName') && ($('#accSidebarName').textContent = data.name || '—');
    $('#accSidebarUsername') && ($('#accSidebarUsername').textContent = data.username ? `@${data.username}` : '—');

    // وضعیت
    $('#accountStatus') && ($('#accountStatus').textContent = 'پروفایل بارگذاری شد');
}
// تغییر زنده آواتار
document.getElementById('accAvatar')?.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    const img = document.getElementById('accAvatarPreview');
    if (img) img.src = v || defaultAcc.avatar;
});

// ذخیره فرم
document.getElementById('accountForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('accName').value.trim();
    const username = document.getElementById('accUsername').value.trim();
    const email = document.getElementById('accEmail').value.trim();
    const phone = document.getElementById('accPhone').value.trim();
    const avatar = document.getElementById('accAvatar').value.trim();
    const pass = document.getElementById('accPass').value;
    const pass2 = document.getElementById('accPass2').value;

    if (pass || pass2) {
        if (pass !== pass2) {
            alert('رمز عبور و تکرار آن یکسان نیست.');
            return;
        }
        // در نسخه واقعی، رمز به سرور ارسال/هش می‌شود.
    }

    const data = { name, username, email, phone, avatar };
    saveAccount(data);
    bindAccountUI();
    const st = document.getElementById('accountStatus');
    if (st) st.textContent = 'ذخیره شد';
});

// بازنشانی
document.getElementById('resetAccount')?.addEventListener('click', () => {
    if (confirm('بازنشانی پروفایل به حالت اولیه؟')) {
        saveAccount(defaultAcc);
        bindAccountUI();
        const st = document.getElementById('accountStatus');
        if (st) st.textContent = 'بازنشانی شد';
    }
});

// بار اول اگر روی حساب هستیم
function maybeBindOnAccountEnter() {
    if (location.hash.replace('#', '') === 'account') bindAccountUI();
}
window.addEventListener('hashchange', maybeBindOnAccountEnter);
document.addEventListener('DOMContentLoaded', () => {
    bindAccountUI(); // هم هدر آپدیت می‌شود هم اگر ویو حساب باز باشد
});

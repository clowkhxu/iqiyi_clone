// ==========================================
// 1. CẤU HÌNH API (ĐÃ CẬP NHẬT MỚI)
// ==========================================
const API_BASE_URL = "https://iqiyi.clowkhuux2707.workers.dev";

// Hàm gọi API chung
async function apiRequest(endpoint, method, body = null) {
    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        // Kiểm tra nếu API trả về 404 (sai đường dẫn)
        if (response.status === 404) {
            return { status: "error", message: "Lỗi: Đường dẫn API không tồn tại (404)" };
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
        // Trả về null để không làm crash code phía sau
        return null;
    }
}

// ==========================================
// 2. QUẢN LÝ PHIÊN ĐĂNG NHẬP (Session)
// ==========================================

function saveUser(user) {
    // Lưu vào LocalStorage (Lưu vĩnh viễn trên trình duyệt)
    localStorage.setItem('iq_user', JSON.stringify(user));
    updateUI(user);
}

function clearUser() {
    localStorage.removeItem('iq_user');
    updateUI(null);
}

function getUser() {
    const u = localStorage.getItem('iq_user');
    return u ? JSON.parse(u) : null;
}

// Cập nhật giao diện Header
function updateUI(user) {
    // --- PC ELEMENTS ---
    const defaultIcon = document.getElementById('defaultUserIcon');
    const avatar = document.getElementById('loggedInUserAvatar');
    const nameText = document.getElementById('headerUserName');
    
    // Tooltips PC
    const guestTooltip = document.getElementById('guestTooltip');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserAvatar = document.getElementById('menuUserAvatar');
    const btnLogoutMenu = document.getElementById('btnLogoutMenu');

    // --- MOBILE ELEMENTS ---
    const mobileName = document.getElementById('mobileUserName');
    const mobileLogout = document.getElementById('mobileLogoutBtn');

    if (user) {
        // --- ĐÃ ĐĂNG NHẬP ---
        
        // 1. Header chính
        if (defaultIcon) defaultIcon.style.display = 'none';
        if (avatar) {
            avatar.style.display = 'block'; // Hiện avatar
            // Ở dự án thật bạn có thể set avatar.src = user.avatar_url
        }
        if (nameText) nameText.style.display = 'none'; // ẨN TÊN Ở HEADER (Yêu cầu mới)

        // 2. Dropdown / Tooltip
        if (guestTooltip) guestTooltip.style.display = 'none'; // Ẩn tooltip đăng nhập
        if (userMenuDropdown) {
             // Để CSS hover xử lý việc display block
             userMenuDropdown.removeAttribute('style'); 
        }

        // Cập nhật thông tin trong menu
        if (menuUserName) menuUserName.textContent = user.name;
        // if (menuUserAvatar) menuUserAvatar.src = user.avatar_url;

        // Xử lý nút đăng xuất trong menu
        if (btnLogoutMenu) {
            btnLogoutMenu.onclick = (e) => { 
                e.preventDefault(); 
                clearUser(); // Chỉ đăng xuất khi bấm nút này
                window.location.reload(); // Load lại trang cho sạch
            };
        }

        // 3. Mobile
        if (mobileName) mobileName.textContent = user.name;
        if (mobileLogout) {
            mobileLogout.style.display = 'block';
            mobileLogout.onclick = () => { clearUser(); closeMobileMenu(); };
        }

    } else {
        // --- CHƯA ĐĂNG NHẬP ---
        
        // 1. Header chính
        if (defaultIcon) defaultIcon.style.display = 'block';
        if (avatar) avatar.style.display = 'none';
        if (nameText) {
            nameText.style.display = 'inline'; // Hiện chữ "Của tôi"
            nameText.textContent = "Của tôi";
        }

        // 2. Dropdown / Tooltip
        if (userMenuDropdown) userMenuDropdown.style.display = 'none'; // Ẩn menu user
        if (guestTooltip) guestTooltip.removeAttribute('style'); // Cho phép hiện tooltip guest khi hover

        // 3. Mobile
        if (mobileName) mobileName.textContent = "Đăng nhập / Đăng ký";
        if (mobileLogout) mobileLogout.style.display = 'none';
    }
}

// Kiểm tra Session khi tải trang (ĐÃ SỬA ĐỂ KHÔNG BỊ DISCONNECT)
async function checkSession() {
    const user = getUser();
    
    if (user) {
        // 1. Nếu có user trong LocalStorage, hiện đăng nhập NGAY LẬP TỨC
        // Không chờ server trả lời -> Giúp trải nghiệm mượt mà, không bị nháy
        updateUI(user);

        // 2. Gọi API kiểm tra ngầm (Optional)
        // Mục đích: Chỉ để cập nhật thông tin mới nếu có (ví dụ đổi tên)
        // QUAN TRỌNG: Nếu lỗi mạng hoặc server chết, KHÔNG gọi clearUser()
        if (user.email) {
            const res = await apiRequest('/check', 'POST', { email: user.email });
            
            // Chỉ cập nhật nếu server trả về thành công và có dữ liệu user mới
            if (res && res.logged_in && res.user) {
                saveUser(res.user); 
            }
            // Nếu res lỗi hoặc logged_in = false -> TA BỎ QUA, VẪN GIỮ ĐĂNG NHẬP CŨ
            // Trừ khi bạn muốn bắt buộc đá user ra thì mới thêm else { clearUser() }
        }
    } else {
        updateUI(null);
    }
}
// Chạy ngay khi load file
checkSession();

// ==========================================
// 3. XỬ LÝ LOGIC UI (Popup, Menu Mobile)
// ==========================================

// Scroll Effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header-wrapper');
    if (header) {
        if (window.scrollY > 0) {
            header.style.backgroundColor = 'rgb(17, 19, 25)';
            header.style.backgroundImage = 'none';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)';
            header.style.boxShadow = 'none';
        }
    }
});

// Mobile Menu
const menuIcon = document.getElementById('openMobileMenu');
const mobileSidebar = document.getElementById('mobileSidebar');
const overlay = document.getElementById('sidebarOverlay');

function closeMobileMenu() {
    if (mobileSidebar) mobileSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        mobileSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}
if (overlay) overlay.addEventListener('click', closeMobileMenu);

// Modal Logic
const loginOverlay = document.getElementById('loginOverlayWrapper');
const closeBtn = document.getElementById('closeLoginModal');

// Các nút mở modal
// Thêm userActionBtn vào list để click vào avatar (khi chưa login) thì mở form
const triggers = ['userActionBtn', 'btnLoginTooltip', 'btnLoginHistory', 'mobileLoginBtn'];
triggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', (e) => {
            // Nếu click vào userActionBtn mà ĐÃ login thì không làm gì (để hover menu hoạt động)
            if (id === 'userActionBtn' && getUser()) return;
            
            e.stopPropagation();
            if (id === 'mobileLoginBtn') closeMobileMenu();
            
            // Reset về form login mặc định
            hideAllForms();
            if (document.getElementById('loginForm')) 
                document.getElementById('loginForm').style.display = 'flex';
            
            if (loginOverlay) loginOverlay.classList.add('active');
        });
    }
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (loginOverlay) loginOverlay.classList.remove('active');
    });
}

// ==========================================
// 4. CHUYỂN ĐỔI GIỮA CÁC FORM
// ==========================================
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const emailRegForm = document.getElementById('emailRegisterForm');
const emailLoginForm = document.getElementById('emailLoginForm');

function hideAllForms() {
    [loginForm, registerForm, emailRegForm, emailLoginForm].forEach(f => {
        if (f) f.style.display = 'none';
    });
}

// Định nghĩa các nút chuyển form
const navMap = {
    'switchToRegister': registerForm,
    'switchToLogin': loginForm,
    'btnUseEmailRegister': emailRegForm,
    'btnOpenEmailLogin': emailLoginForm,
    'btnEmailRegisterBack': registerForm,
    'btnEmailLoginBack': loginForm,
    'backToLoginFromEmail': loginForm,
    'backToRegisterFromLogin': registerForm,
    'backToRegisterMain': registerForm
};

Object.keys(navMap).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllForms();
            if (navMap[btnId]) navMap[btnId].style.display = 'flex';
        });
    }
});

// ==========================================
// 5. XỬ LÝ ĐĂNG KÝ (QUAN TRỌNG)
// ==========================================
const btnRegSubmit = document.getElementById('btnSubmitRegister');

if (btnRegSubmit) {
    btnRegSubmit.addEventListener('click', async () => {
        const nameEl = document.getElementById('regName');
        const emailEl = document.getElementById('regEmail');
        const passEl = document.getElementById('regPassword');
        const confirmEl = document.getElementById('regConfirmPassword');

        if (!nameEl || !emailEl || !passEl || !confirmEl) return alert("Lỗi HTML: Thiếu ID input");

        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const password = passEl.value;

        if (!name || !email || !password) return alert("Vui lòng nhập đủ thông tin!");
        if (password !== confirmEl.value) return alert("Mật khẩu không khớp!");

        btnRegSubmit.innerText = "Đang xử lý...";
        
        // Gọi API Mới
        const res = await apiRequest('/register', 'POST', { name, email, password });
        
        btnRegSubmit.innerText = "Đăng ký";

        if (res && res.status === 'success') {
            alert("Đăng ký thành công! Hãy đăng nhập.");
            hideAllForms();
            const loginEmailIn = document.getElementById('loginEmail');
            if(loginEmailIn) loginEmailIn.value = email;
            if (emailLoginForm) emailLoginForm.style.display = 'flex';
        } else {
            alert("Lỗi: " + (res ? res.message : "Không thể kết nối Server"));
        }
    });
}

// ==========================================
// 6. XỬ LÝ ĐĂNG NHẬP (QUAN TRỌNG)
// ==========================================
const btnLoginSubmit = document.getElementById('btnSubmitLogin');

if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', async () => {
        const emailEl = document.getElementById('loginEmail');
        const passEl = document.getElementById('loginPassword');

        const email = emailEl.value.trim();
        const password = passEl.value;

        if (!email || !password) return alert("Nhập thiếu Email hoặc Password!");

        btnLoginSubmit.innerText = "Đang đăng nhập...";

        // Gọi API Mới
        const res = await apiRequest('/login', 'POST', { email, password });

        btnLoginSubmit.innerText = "Đăng nhập";

        if (res && res.status === 'success') {
            saveUser(res.user);
            if (loginOverlay) loginOverlay.classList.remove('active');
            alert(`Chào mừng ${res.user.name}!`);
        } else {
            alert("Lỗi: " + (res ? res.message : "Sai tài khoản hoặc mật khẩu"));
        }
    });
}

// ==========================================
// 7. TIỆN ÍCH (Ẩn hiện Pass, Date select)
// ==========================================
function setupToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const inp = document.getElementById(inputId);
    if (btn && inp) {
        btn.addEventListener('click', () => {
            const isPass = inp.type === 'password';
            inp.type = isPass ? 'text' : 'password';
            const open = btn.querySelector('.icon-eye-open');
            const close = btn.querySelector('.icon-eye-close');
            if (open) open.style.display = isPass ? 'none' : 'block';
            if (close) close.style.display = isPass ? 'block' : 'none';
        });
    }
}
setupToggle('togglePassword', 'regPassword');
setupToggle('toggleConfirmPassword', 'regConfirmPassword');
setupToggle('toggleLoginPassword', 'loginPassword');

// Tạo ngày sinh (UI only)
const d = document.getElementById('dobDay'), m = document.getElementById('dobMonth'), y = document.getElementById('dobYear');
if(d && m && y) {
    for(let i=1; i<=31; i++) d.add(new Option(i, i));
    for(let i=1; i<=12; i++) m.add(new Option(i, i));
    const yr = new Date().getFullYear();
    for(let i=yr; i>=1900; i--) y.add(new Option(i, i));
}
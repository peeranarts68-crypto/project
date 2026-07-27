// assets/js/auth.js
// Client-side authentication logic for PSRU Community

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to index.html automatically (don't force login on refresh)
    if (localStorage.getItem('psru_current_user')) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Get all users from localStorage
    const getUsers = () => {
        const users = localStorage.getItem('psru_users');
        return users ? JSON.parse(users) : [];
    };

    // Save users to localStorage
    const saveUsers = (users) => {
        localStorage.setItem('psru_users', JSON.stringify(users));
    };

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value;
            const faculty = document.getElementById('regFaculty').value;

            // Simple validation
            if (!/^\d{10}$/.test(username)) {
                alert('กรุณากรอกรหัสนักศึกษาให้ถูกต้อง (ตัวเลข 10 หลัก)');
                return;
            }

            const users = getUsers();
            const userExists = users.some(u => u.username === username);

            if (userExists) {
                alert('รหัสนักศึกษานี้เคยลงทะเบียนไว้แล้ว');
                return;
            }

            // Add user with default profile details for the web platform
            users.push({ 
                username, 
                password, 
                faculty,
                name: 'นักศึกษา รหัส ' + username.substring(0, 3),
                phone: '091-234-5678',
                line: 'psru.' + username.substring(5)
            });
            saveUsers(users);

            alert('สมัครสมาชิกสำเร็จเรียบร้อยแล้ว! กำลังนำทางไปหน้าเข้าสู่ระบบ...');
            window.location.href = 'login.html';
        });
    }

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            const users = getUsers();
            
            // Check credentials (allows matching student@psru.ac.th or 10-digit ID)
            const user = users.find(u => u.username === username && u.password === password);

            if (!user) {
                alert('รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง');
                return;
            }

            // Set dynamic session object matching app.js expectations
            localStorage.setItem('psru_current_user', JSON.stringify({
                username: user.username,
                name: user.name || 'นักศึกษา รหัส ' + user.username.substring(0, 3),
                faculty: user.faculty,
                email: user.username.includes('@') ? user.username : user.username + '@psru.ac.th',
                phone: user.phone || '091-234-5678',
                line: user.line || 'psru.' + user.username.substring(5)
            }));

            alert('เข้าสู่ระบบสำเร็จ!');
            window.location.href = 'index.html';
        });
    }
});

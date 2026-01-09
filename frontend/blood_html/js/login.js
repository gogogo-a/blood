console.log('login.js loaded');

// 发送验证码的函数
async function sendVerifyCode() {
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    
    // 清除之前的错误提示
    if (emailError) {
        emailError.style.display = 'none';
    } else {
        console.error('找不到email-error元素');
        return;
    }
    
    if (!email) {                        
        showError("邮箱是必填项")
        return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('请输入正确的邮箱格式')
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/app/user/send_email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "role": 3
            })
        });

        // 检查响应状态
        if (!response.ok) {
            if (response.status === 500) {
                showError('服务器内部错误，请稍后重试');
            } else if (response.status === 404) {
                showError('服务器接口不存在');
            } else {
                showError(`请求失败 (${response.status})`);
            }
            return;
        }

        const data = await response.json();
        console.log('发送验证码返回值：', data);
        
        if (!data.status) {
            showError(data.data || '发送验证码失败');
            return;
        }

        // 发送成功提示
        showSuccess('验证码已发送，请查收邮件');

        // 发送成功后禁用按钮并开始倒计时
        const btn = document.querySelector('.verify-code-btn');
        btn.disabled = true;
        let countdown = 60;
        
        const timer = setInterval(() => {
            btn.textContent = `${countdown}秒后重试`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.textContent = '获取验证码';
            }
        }, 1000);

    } catch (error) {
        console.error('发送验证码错误：', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showError('网络连接失败，请检查网络设置');
        } else {
            showError('发送验证码失败，请稍后重试');
        }
    }
}

// 密码登录函数
async function passwordLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/user/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "username": username,
                "password": password,
                "role": "3"
            })
        });

        // 检查响应状态
        if (!response.ok) {
            const data = await response.json();
            showError(data.data || '登录失败');
            return;
        }

        // 登录成功
        const data = await response.json();
        console.log('密码登录返回值：', data);

        // 检查token是否存在
        if (!data.token) {
            showError(data.data || '登录失败');
            return;
        }

        // 存储token到localStorage
        localStorage.setItem('token', data.token);
        console.log('存储到localStorage的token:', localStorage.getItem('token'));

        showSuccess('登录成功！');
        // 延迟跳转到主页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.error('登录错误：', error);
        showError('登录失败，请稍后重试');
    }
}

// 邮箱验证码登录函数
async function emailLogin(email, captcha) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/user/email_login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "email": email,
                "captcha": captcha,
                "role": "3"
            })
        });

        if (!response.ok) {
            const data = await response.json();
            showError(data.data || '登录失败');
            return;
        }

        // 登录成功
        const data = await response.json();
        console.log('邮箱登录返回值：', data);

        // 检查token是否存在
        if (!data.token) {
            showError('登录失败，账号未注册');
            return;
        }

        // 存储token到localStorage
        localStorage.setItem('token', data.token);
        console.log('存储到localStorage的token:', localStorage.getItem('token'));

        showSuccess('登录成功！');
        // 延迟跳转到主页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.error('登录错误：', error);
        showError('登录失败，请稍后重试');
    }
}

// 管理员登录函数
async function adminLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/back/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // 假设管理员登录需要的字段
                "username": "admin",
                "password": "admin_password",
                "role": "admin"
            })
        });

        // 检查响应状态
        if (!response.ok) {
            if (response.status === 500) {
                showError('服务器内部错误，请稍后重试');
            } else if (response.status === 404) {
                showError('服务器接口不存在');
            } else {
                showError(`管理员登录请求失败 (${response.status})`);
            }
            return;
        }

        const data = await response.json();
        console.log('管理员登录返回值：', data);

        if (data.status === false) {
            showError(data.data || '管理员登录失败');
            return;
        }

        // 登录成功
        showSuccess('管理员登录成功！');
        // 延迟跳转到管理员主页
        setTimeout(() => {
            window.location.href = 'admin_dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('管理员登录错误：', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showError('网络连接失败，请检查网络设置');
        } else {
            showError('管理员登录失败，请稍后重试');
        }
    }
}


// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // 绑定账号密码登录表单提交事件
    const passwordForm = document.getElementById('login-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showError('请填写完整的登录信息');
                return;
            }
            
            passwordLogin(username, password);
        });
    } else {
        console.error('找不到账号密码登录表单');
    }

    // 绑定邮箱验证码登录表单提交事件
    const emailForm = document.getElementById('email-login-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const captcha = document.getElementById('verify-code').value.trim();
            
            if (!email || !captcha) {
                showError('请填写完整的登录信息');
                return;
            }
            
            emailLogin(email, captcha);
        });
    } else {
        console.error('找不到邮箱验证码登录表单');
    }
    
    // 绑定发送验证码按钮点击事件
    const verifyCodeBtn = document.querySelector('.verify-code-btn');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', sendVerifyCode);
    } else {
        console.error('找不到验证码按钮');
    }
});

// 切换标签的函数
function switchTab(type) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.form-content').forEach(form => {
        form.classList.remove('active');
    });

    document.querySelector(`.tab[onclick="switchTab('${type}')"]`).classList.add('active');
    document.getElementById(`${type}-login`).classList.add('active');
}

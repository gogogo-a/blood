console.log('register.js loaded');

// 发送验证码的函数
async function sendVerifyCode() {
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    
    // 清除之前的错误提示
    emailError.style.display = 'none';
    
    if (!email) {
        showError("邮箱是必填项")
        return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       showError("请输入正确的邮箱格式")
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
            // 处理验证码错误等业务逻辑错误
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

// 注册函数
async function register(event) {
    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const captcha = document.getElementById('verify-code').value.trim();

    // 获取错误提示元素
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const captchaError = document.getElementById('verify-code-error');

    // 清除所有错误提示
    [usernameError, emailError, passwordError, confirmPasswordError, captchaError].forEach(error => {
        error.style.display = 'none';
    });

    let hasError = false;

    // 表单验证
    if (!username) {
        showError('用户名是必填项');
        usernameError.style.display = 'block';
        hasError = true;
    } else if (username.length < 4 || username.length > 16) {
        showError('用户名长度必须在4-16个字符之间');
        usernameError.style.display = 'block';
        hasError = true;
    }

    if (!email) {
        showError ('邮箱是必填项');
        emailError.style.display = 'block';
        hasError = true;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('请输入正确的邮箱格式');
            emailError.style.display = 'block';
            hasError = true;
        }
    }

    if (!password) {
        showError ('密码是必填项');
        passwordError.style.display = 'block';
        hasError = true;
    } else if (password.length < 8 || password.length > 20) {
        showError ('密码长度必须在8-20位之间');
        passwordError.style.display = 'block';
        hasError = true;
    } else {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!passwordRegex.test(password)) {
            showError('密码必须包含字母和数字');
            passwordError.style.display = 'block';
            hasError = true;
        }
    }

    if (!confirmPassword) {
        showError('请确认密码');
        confirmPasswordError.style.display = 'block';
        hasError = true;
    } else if (password !== confirmPassword) {
        showError('两次输入的密码不一致');
        confirmPasswordError.style.display = 'block';
        hasError = true;
    }

    if (!captcha) {
        showError ('验证码是必填项');
        captchaError.style.display = 'block';
        hasError = true;
    } else if (captcha.length !== 6) {
        showError ('验证码必须是6位');
        captchaError.style.display = 'block';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        console.log(123)

        const response = await fetch(`${API_BASE_URL}/app/user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
                "confirm_password": confirmPassword,
                "captcha": captcha,
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
                showError(`注册请求失败 (${response.status})`);
            }
            return;
        }

        const data = await response.json();
        console.log('注册返回值：', data);

        if (data.id) {
            // 注册成功
            showSuccess('注册成功！');
            // 延迟跳转到登录页
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            // 处理错误信息
            const errorFields = {
                'username': usernameError,
                'email': emailError,
                'password': passwordError,
                'confirm_password': confirmPasswordError,
                'verify_code': captchaError
            };

            // 检查是否有字段错误
            let hasFieldError = false;
            
            // 遍历返回的错误信息
            for (const field in data) {
                if (errorFields[field]) {
                    hasFieldError = true;
                    // 显示错误信息在对应字段下方
                    errorFields[field].textContent = Array.isArray(data[field]) ? 
                        data[field][0] : data[field];
                    errorFields[field].style.display = 'block';
                }
            }

            // 如果没有具体字段的错误信息，但有status为false的情况
            if (!hasFieldError && data.status === false && data.data) {
                showError(data.data);
            }
        }

    } catch (error) {
        console.error('注册错误：', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            showError('网络连接失败，请检查网络设置');
        } else {
            showError('注册失败，请稍后重试');
        }
    }
}


// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // 绑定表单提交事件
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // 阻止表单默认提交
            register(event);
        });
    } else {
        console.error('找不到表单元素');
    }
    
    // 绑定发送验证码按钮点击事件
    const verifyCodeBtn = document.querySelector('.verify-code-btn');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', sendVerifyCode);
    } else {
        console.error('找不到验证码按钮');
    }
});

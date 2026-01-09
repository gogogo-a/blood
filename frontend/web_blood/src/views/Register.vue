<template>
  <div class="register-container">
    <div class="register-header">
      <h1>血糖管理系统</h1>
      <p>创建新账户</p>
    </div>

    <form @submit.prevent="register">
      <div class="form-group">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="请输入用户名（4-16个字符）" required>
        <div class="error-message">{{ usernameError }}</div>
      </div>

      <div class="form-group">
        <label>邮箱</label>
        <input v-model="email" type="email" placeholder="请输入邮箱地址" required>
        <div class="error-message">{{ emailError }}</div>
      </div>

      <div class="form-group">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" required>
        <div class="password-requirements">
          密码长度8-20位，必须包含字母和数字
        </div>
        <div class="error-message">{{ passwordError }}</div>
      </div>

      <div class="form-group">
        <label>确认密码</label>
        <input v-model="confirmPassword" type="password" placeholder="请再次输入密码" required>
        <div class="error-message">{{ confirmPasswordError }}</div>
      </div>

      <div class="form-group">
        <label>验证码</label>
        <div class="verify-code-group">
          <input v-model="captcha" type="text" placeholder="请输入验证码" required>
          <button type="button" class="verify-code-btn" :disabled="isVerifyBtnDisabled" @click="sendVerifyCode">
            {{ verifyBtnText }}
          </button>
        </div>
        <div class="error-message">{{ captchaError }}</div>
      </div>

      <button type="submit" class="register-btn">注册</button>
    </form>

    <div class="login-link">
      已有账户？<a href="/login">立即登录</a>
    </div>
     <div
      v-if="message"
      :class="['message-box', message.type]"
      :style="{ opacity: messageOpacity }"
    >
      <span>{{ message.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import host from "../settings.js"
const API_BASE_URL = host.host

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const captcha = ref('');
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const captchaError = ref('');
const isVerifyBtnDisabled = ref(false);
const verifyBtnText = ref('获取验证码');

// 显示成功提示
// 提示框状态
const message = ref(null);
const messageOpacity = ref(0);
const showMessage = (text, type = 'success') => {
  message.value = { text, type };
  messageOpacity.value = 1;

  setTimeout(() => {
    messageOpacity.value = 0;
    setTimeout(() => {
      message.value = null;
    }, 300);
  }, 2000);
};

// 显示成功提示
const showSuccess = (message) => {
  showMessage(message, 'success');
};

// 显示错误提示
const showError = (message) => {
  showMessage(message, 'error');
};

// 发送验证码
const sendVerifyCode = async () => {
  const emailValue = email.value.trim();
  emailError.value = '';

  if (!emailValue) {
    showError("邮箱是必填项");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailValue)) {
    showError("请输入正确的邮箱格式");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}app/user/send_email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailValue,
        role: 3
      })
    });

    if (!response.ok) {
      throw new Error(`请求失败 (${response.status})`);
    }

    const data = await response.json();
    if (!data.status) {
      showError(data.data || '发送验证码失败');
      return;
    }

    showSuccess('验证码已发送，请查收邮件');
    isVerifyBtnDisabled.value = true;
    let countdown = 60;

    const timer = setInterval(() => {
      verifyBtnText.value = `${countdown}秒后重试`;
      countdown--;

      if (countdown < 0) {
        clearInterval(timer);
        isVerifyBtnDisabled.value = false;
        verifyBtnText.value = '获取验证码';
      }
    }, 1000);
  } catch (error) {
    console.error('发送验证码错误：', error);
    showError('发送验证码失败，请稍后重试');
  }
};

// 注册函数
const register = async () => {
  usernameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  captchaError.value = '';

  if (!username.value) {
    showError('用户名是必填项');
    usernameError.value = '用户名是必填项';
    return;
  }

  if (!email.value) {
    showError('邮箱是必填项');
    emailError.value = '邮箱是必填项';
    return;
  }

  if (!password.value) {
    showError('密码是必填项');
    passwordError.value = '密码是必填项';
    return;
  }

  if (password.value !== confirmPassword.value) {
    showError('两次输入的密码不一致');
    confirmPasswordError.value = '两次输入的密码不一致';
    return;
  }

  if (!captcha.value) {
    showError('验证码是必填项');
    captchaError.value = '验证码是必填项';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}app/user/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        captcha: captcha.value,
        role: 3
      })
    });

    if (!response.ok) {
      throw new Error(`注册失败 (${response.status})`);
    }

    const data = await response.json();
    if (data.status) {
      showSuccess('注册成功！');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      showError(data.data || '注册失败');
    }
  } catch (error) {
    console.error('注册错误：', error);
    showError('注册失败，请稍后重试');
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  background: #f0f8ff;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  overflow: hidden; /* 防止滚动 */
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
  margin: auto; /* 确保在父容器中居中 */
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h1 {
  color: #4a90e2;
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
}

.verify-code-group {
  display: flex;
  gap: 10px;
}

.verify-code-group input {
  flex: 1;
}

.verify-code-btn {
  padding: 14px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.3s ease;
  font-weight: 500;
}

.verify-code-btn:hover {
  background: #3c7cd6;
}

.verify-code-btn:disabled {
  background: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

.register-btn {
  width: 100%;
  padding: 14px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 15px;
  transition: background 0.3s ease;
  font-weight: 500;
}

.register-btn:hover {
  background: #3c7cd6;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

.password-requirements {
  font-size: 12px;
  color: #636e72;
  margin-top: 5px;
}

.error-message {
  color: #ff7675;
  font-size: 12px;
  margin-top: 5px;
}

/* 提示框样式 */
.message-box {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.3s ease;
}

.message-box.success {
  background-color: #5cb85c;
  color: white;
}

.message-box.error {
  background-color: #d9534f;
  color: white;
}
</style>
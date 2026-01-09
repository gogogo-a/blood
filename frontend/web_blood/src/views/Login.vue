<template>
  <div class="login-container">
    <div class="login-header">
      <h1>血糖管理系统</h1>
      <p>欢迎回来</p>
    </div>

    <div class="login-tabs">
      <div
        class="tab"
        :class="{ active: activeTab === 'password' }"
        @click="switchTab('password')"
      >
        账号密码登录
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'email' }"
        @click="switchTab('email')"
      >
        邮箱验证码登录
      </div>
    </div>

    <!-- 账号密码登录表单 -->
    <div
      class="form-content"
      :class="{ active: activeTab === 'password' }"
      id="password-login"
    >
      <form @submit.prevent="performPasswordLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="passwordForm.username" placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input
            type="password"
            v-model="passwordForm.password"
            placeholder="请输入密码"
          />
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
    </div>

    <!-- 邮箱验证码登录表单 -->
    <div
      class="form-content"
      :class="{ active: activeTab === 'email' }"
      id="email-login"
    >
      <form @submit.prevent="performEmailLogin">
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="emailForm.email" placeholder="请输入邮箱" />
          <div class="error-message" id="email-error">{{ emailError }}</div>
        </div>
        <div class="form-group">
          <label>验证码</label>
          <div class="verify-code-group">
            <input v-model="emailForm.captcha" placeholder="请输入验证码" />
            <button
              type="button"
              class="verify-code-btn"
              :disabled="isVerifyBtnDisabled"
              @click="sendVerifyCode"
            >
              {{ verifyBtnText }}
            </button>
          </div>
        </div>
        <button type="submit" class="login-btn">登录</button>
      </form>
    </div>

    <div class="register-link">
      还没有账号？<a href="/register">立即注册</a>
      <span class="divider">|</span>
      <a
        href="/"
        class="admin-link"
        target="_blank"
        >返回首页</a
      >
    </div>

    <!-- 提示框 -->
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
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import host from "../settings.js"
const API_BASE_URL = host.host

const activeTab = ref('password');
const emailError = ref('');
const passwordForm = ref({
  username: '',
  password: '',
});
const emailForm = ref({
  email: '',
  captcha: '',
});
const verifyBtnText = ref('获取验证码');
const isVerifyBtnDisabled = ref(false);
const countdown = ref(60);
const store = useStore();
const router = useRouter();

// 提示框状态
const message = ref(null);
const messageOpacity = ref(0);

// 显示提示框
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
  const email = emailForm.value.email.trim();
  emailError.value = '';

  if (!email) {
    showError('邮箱是必填项');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('请输入正确的邮箱格式');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}app/user/send_email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        role: 3,
      }),
    });

    if (!response.ok) {
      throw new Error(`请求失败 (${response.status})`);
    }

    const data = await response.json();
    if (data.status) {
      showSuccess('验证码已发送，请查收邮件');
      isVerifyBtnDisabled.value = true;

      const timer = setInterval(() => {
        verifyBtnText.value = `${countdown.value}秒后重试`;
        countdown.value--;

        if (countdown.value < 0) {
          clearInterval(timer);
          isVerifyBtnDisabled.value = false;
          verifyBtnText.value = '获取验证码';
          countdown.value = 60;
        }
      }, 1000);
    } else {
      showError(data.data || '发送验证码失败');
    }
  } catch (error) {
    showError('发送验证码失败，请稍后重试');
  }
};

// 账号密码登录
const performPasswordLogin = async () => {
  const { username, password } = passwordForm.value;

  if (!username || !password) {
    showError('请填写完整的登录信息');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}app/user/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password,
        role: '3',
      }),
    });

   const data = await response.json();
    if (!data.token) {
      // 处理业务逻辑错误
      showError(data.data || '登录失败，请稍后重试');
      return;
    }
    store.commit('setToken', data.token);
    store.commit('setUserData', data.user_data);
     console.log('Token stored in Vuex:', store.state.token);
    console.log('User Data stored in Vuex:', store.state.userData);
    showSuccess('登录成功！');

    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (error) {
    showError('登录失败，请稍后重试');
  }
};

// 邮箱验证码登录
const performEmailLogin = async () => {
  const { email, captcha } = emailForm.value;

  if (!email || !captcha) {
    showError('请填写完整的登录信息');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}app/user/email_login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        captcha,
        role: '3',
      }),
    });
    const data = await response.json();
      if (!data.token) {
      // 处理业务逻辑错误
      showError(data.data || '登录失败，请稍后重试');
      return;
    }
    store.commit('setToken', data.token);
    store.commit('setUserData', data.user_data);
    showSuccess('登录成功！');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (error) {
    showError('登录失败，请稍后重试');
  }
};

// 切换标签
const switchTab = (type) => {
  activeTab.value = type;
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif; /* 使用现代字体 */
  background: #f0f8ff; /* 浅蓝色背景 */
  color: #333;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 100vh; /* 全屏高度 */

}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* 更柔和的阴影 */
  width: 100%;
  max-width: 400px; /* 最大宽度限制 */
  transition: all 0.3s ease;
  margin: auto; /* 确保在父容器中居中 */
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #4a90e2;
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #eaeaea;
}

.tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab.active {
  color: #4a90e2;
  border-bottom: 2px solid #4a90e2;
  margin-bottom: -2px;
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

.login-btn {
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

.login-btn:hover {
  background: #3c7cd6;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #4a90e2;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.form-content {
  display: none;
}

.form-content.active {
  display: block;
}

.register-link .divider {
  margin: 0 10px;
  color: #ddd;
}

.admin-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.admin-link:hover {
  color: #4a90e2;
  text-decoration: underline;
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
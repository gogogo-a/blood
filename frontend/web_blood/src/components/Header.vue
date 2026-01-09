<template>
   <!-- 顶部栏 -->
    <div class="top-bar">
        <div class="logo">
            <img :src=logo alt="LOGO"> <!-- 替换为实际的LOGO图片路径 -->
            <div class="title">
                <div class="cn-name">胰路护航</div>
                <div class="en-name">Pancreatic Pathway Glucose Care</div>
            </div>
        </div>
        <div class="motto">智护血糖</div>
    </div>

  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <!-- 左侧菜单项 -->
<!--    <el-menu-item index="none">-->
<!--      <img-->
<!--        style="width: 55px"-->
<!--        src="E:\web_blood\src\assets\logo.png"-->
<!--        alt="Element logo"-->
<!--      />-->
<!--    </el-menu-item>-->
    <router-link to="/home">
      <el-menu-item index="/home" class="custom-font-size">首页</el-menu-item>
    </router-link>
    <router-link to="/medical_help">
      <el-menu-item index="/medical_help" class="custom-font-size">医疗帮助</el-menu-item>
    </router-link>
    <router-link to="/diet_advice">
      <el-menu-item index="/diet_advice" class="custom-font-size">饮食建议</el-menu-item>
    </router-link>
    <router-link to="/corridor">
      <el-menu-item index="/corridor" class="custom-font-size">回复走廊</el-menu-item>
    </router-link>
    <router-link to="/recommendations">
      <el-menu-item index="/recommendations" class="custom-font-size">推荐产品</el-menu-item>
    </router-link>

    <!-- 右侧内容 -->
    <div class="right-content">
<!--      <el-input-->
<!--        placeholder="请输入搜索内容"-->
<!--        prefix-icon="el-icon-search"-->
<!--        class="search-input"-->
<!--      ></el-input>-->
<!--      <div class="search-input">-->
<!--        <el-icon><Search /></el-icon>-->
<!--      </div>-->

      <div v-if="store.state.token">
    <el-dropdown @command="handleCommand">
      <el-avatar :src="store.state.userData.image" class="user-avatar" :size="54" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile" class="custom-font-size ">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout" class="custom-font-size ">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
<div v-else class="login-buttons">
    <el-button type="text" class="login-button" @click="goToLogin">登录</el-button>
    <el-button type="text" class="register-button" @click="goToRegister">注册</el-button>
</div>
</div>

  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@element-plus/icons-vue';

const store = useStore();
const route = useRoute();
const router = useRouter();
const activeIndex = ref(route.path); // 直接绑定当前路由路径
const logo = ref(
  "src/assets/logo.webp", // 替换为你的图片路径
);
const handleSelect = (key: string) => {
  // 已通过 router 属性自动处理路由跳转
};

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login');
};

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register');
};

// 跳转到用户个人页面
const goToProfile = () => {
  router.push('/profile');
};

// 下拉菜单点击事件
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      goToProfile();
      break;
    case 'logout':
      logout();
      break;
  }
};

// 退出登录
const logout = () => {
  // 清除 Vuex 中的用户数据
  store.commit('setToken', null);
  store.commit('setUserData', null);

  // 跳转到登录页面
  // router.push('/login');
};
</script>

<style scoped>
.el-menu--horizontal {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center;
}

.right-content {
  display: flex;
  align-items: center;
  margin-right: 30px; /* 增加右侧内容与右边界的间距 */
}

.search-input {
  margin-right: 16px; /* 搜索框与按钮之间的间距 */
}

.user-avatar {
  cursor: pointer;
  margin-right: 16px; /* 与右侧内容的间距 */
}

.right-content {
  display: flex;
  align-items: center;
  margin-right: 30px; /* 增加右侧内容与右边界的间距 */
}
.login-buttons {
  display: flex;
  align-items: center;
}
.login-button,
.register-button {
   display: inline-block; /* 让按钮左右排列 */
  margin-left: 8px; /* 按钮之间的间距 */
  font-size: 20px; /* 或者根据需要调整字体大小 */
}
/* 顶部栏样式 */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    color: #333;
}

/* LOGO 和标题部分样式 */
.logo {
    display: flex;
    align-items: center;
}

.logo img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
}

.title {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
}

.cn-name {
    font-size: 60px;
    font-family: '华文行楷', '华文新魏', '楷体', cursive;
}

.en-name {
    font-size: 30px;
    font-family: '华文新魏', 'Times New Roman', serif;
    color: #555;
}

.motto {
    font-size: 90px;
    font-family: '华文行楷', '华文新魏', '楷体', cursive;
    color: rgb(205, 154, 103);
    align-self: flex-start;
}
.custom-font-size {
  font-family: 'Roboto', sans-serif; /* 使用 Google Fonts */
 font-size: 24px; /* 增大字体大小 */
  line-height: 1.6; /* 调整行高，让文字更舒适 */
  font-weight: 400; /* 调整字体粗细 */
  letter-spacing: 0.5px; /* 调整字间距 */
  color: #333; /* 调整字体颜色 */
  margin: 40px; /* 保持外边距 */
}
</style>
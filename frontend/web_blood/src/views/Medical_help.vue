<script setup>
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import Columns from "../components/Columns.vue";
</script>

<template>
  <Header></Header>
<el-row>
    <el-col :span="4">
      <columns></columns>
    </el-col>
    <el-col :span="20" class="content">
      <router-view></router-view>
    </el-col>
  </el-row>

  <Footer></Footer>
</template>

<style scoped>
.el-row {
  height: 100vh;
  display: flex;
  //flex-direction: column;
}

.content {
  overflow: auto;
  background-color: #ffffff; /* 主内容区背景色，根据需要调整 */
}
</style>
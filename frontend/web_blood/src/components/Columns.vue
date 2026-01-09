<template>
   <el-row class="tac">
    <el-col :span="12">
<!--      <h5 class="mb-2">Default colors</h5>-->
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        style="width: 200px; height: 100%"
      >
        <router-link to="/medical_help">
        <el-menu-item index="1">
          <el-icon><Reading /></el-icon>
          <span class="font_size">推荐</span>
        </el-menu-item>
          </router-link>
        <router-link to="/medical_help/hospitals">
        <el-menu-item index="2">
          <el-icon><School /></el-icon>
          <span class="font_size">医院</span>
        </el-menu-item>
              </router-link>
        <router-link to="/medical_help/drugs">
        <el-menu-item index="3">
          <el-icon><CollectionTag /></el-icon>
          <span class="font_size">药品</span>
        </el-menu-item>
                </router-link>
        <router-link to="/medical_help/picture">
        <el-menu-item index="4">
         <el-icon><PictureFilled /></el-icon>
          <span class="font_size">图谱</span>
        </el-menu-item>
                </router-link>
        <router-link to="/medical_help/Document">
        <el-menu-item index="5">
          <el-icon><Document /></el-icon>
          <span class="font_size">数据</span>
        </el-menu-item>
           </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting, Reading, School, CollectionTag, PictureFilled,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
<style scoped>
.font_size{
  font-size: 20px;
  margin: 20px;
}
</style>
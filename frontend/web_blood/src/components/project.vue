<template>
<div class="custom-carousel" :style="{ height: '500px' }">
    <div
      v-for="(item, index) in carouselItems"
      :key="index"
      class="slide-item"
      :style="{
        backgroundColor: item.bgColor,
        transform: `translateX(${100 * (index - activeIndex)}%)`
      }"
    >
      <div class="content-wrapper">
        <img
          :src=item.image
          alt="app"
          class="medical-image"
        />
        <div class="download-section">
          <h3 class="hospital-name">{{ item.title }}</h3>
          <a
            href="http://8.140.245.242:8002"
            class="download-button"
            @click.prevent="handleDownload(item)"
          >
            立即下载
          </a>
        </div>
      </div>
    </div>
  </div>
<!--问题-->
<h1 class="title">你是否有以下问题?</h1>
<!-- 问题列表 -->
    <el-row :gutter="20" class="question-list">

      <el-col :span="6" v-for="(question, index) in questions" :key="index">
        <div class="question-item">
          <img :src="question.icon" alt="icon" class="question-icon" />
          <p>{{ question.text }}</p>
          <p>{{ question.number }}</p>
        </div>
      </el-col>
    </el-row>
<!--  优势-->
   <div class="strengths">
    <h1>我们的优势</h1>
    <h2>OUR STRENGTHS</h2>
    <el-row :gutter="20" class="strengths-content">
      <el-col :span="4" v-for="(item, index) in strengths" :key="index" class="strengths-col">
        <img :src="item.icon" alt="icon" class="strengths-icon" />
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </el-col>
    </el-row>
  </div>
<div class="ai-service-container">
    <!-- 顶部标题 -->
    <div class="header">
      <div class="title-group">
        <h1 class="main-title">服务内容</h1>
        <div class="sub-title">SERVICE CONTENT</div>
      </div>
      <div class="decorative-line"></div>
    </div>

    <!-- 主要功能展示 -->
    <el-row :gutter="40" class="main-feature">
      <el-col :span="12">
        <div class="device-image">
          <img src="../assets/project/img.webp" alt="血糖仪">
        </div>
      </el-col>
      <el-col :span="12">

        <div class="app-interface">
          <div class="data-section">
            <div class="data-item">

              <el-icon class="data-icon"><Calendar /></el-icon>
              <span class="data-time">星期二 时间:3:34</span>
            </div>
            <div class="data-item">
              <el-icon class="data-icon"><Moon /></el-icon>
              <span class="data-time">星期五时至:皓月</span>
            </div>
          </div>
          <div class="branding">
            <span class="brand-name">SIAMETICS</span>
            <span class="brand-tag">lce-to-METER</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 服务模块 -->
    <el-row :gutter="30" class="service-modules">
      <el-col
        v-for="(item, index) in services"
        :key="index"
        :xs="24" :sm="12" :md="6"
      >
        <div class="service-card">
          <el-icon class="service-icon">
            <component :is="item.icon" />
          </el-icon>
          <h3 class="service-title">{{ item.title }}</h3>
          <p class="service-desc">{{ item.description }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
   <div class="case-container">
    <!-- 标题部分 -->
    <div class="header-section">
      <h1 class="main-title">成功案例</h1>
      <div class="sub-title">SUCCESS CASES</div>
      <div class="divider"></div>
    </div>

    <!-- 内容区域 -->
    <el-row :gutter="40" class="content-wrapper">
      <!-- 文字内容 -->
      <el-col :xs="24" :sm="24" :md="14" class="text-section">
        <div class="description">
          <p>成立以来，我们已经为糖友提供个性化糖尿病控糖管理和糖尿病逆转服务，守护糖友的健康。这些糖友在我们的团队管理下，实现了停药停针，血糖保持稳定，各项指标都恢复正常，包括体重、糖化血红蛋白、C肽水平等。</p>
          <p>糖尿病早发现早治疗早逆转早受益，远离并发症，远离健康威胁的首选方法就是糖尿病逆转。</p>
        </div>
        <el-button
          type="primary"
          class="more-button"
          @click="loadMoreCases">
          更多案例
        </el-button>
      </el-col>

      <!-- 图片展示 -->
      <el-col :xs="24" :sm="24" :md="20" class="image-section">
        <el-row :gutter="20">
          <el-col
            v-for="(img, index) in caseImages"
            :key="index"
            :span="12"
            class="image-col"
          >
            <div class="image-wrapper">
              <img
                :src=img
                :alt="'案例图片' + (index+1)"
                class="case-image1"
              >
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const activeIndex = ref(0);
const API_BASE_URL =  host.host; // 根据你的后端地址修改
import axios from 'axios';
import host from "../settings.js"


// 定义方法：从后端获取轮播图图片数据
const carouselItems = ref([]); // 存储轮播图数据
const fetchCarouselImages = async () => {
  try {
    const homePic1 = await axios.get(`${API_BASE_URL}consultation/imageurlname/home-pic/`).then(response => response.data.url);
    const homePic2 = await axios.get(`${API_BASE_URL}consultation/imageurlname/home-pic2/`).then(response => response.data.url);


    carouselItems.value = [
      {
        image: homePic1,
        bgColor: 'hsl(210, 60%, 95%)',
        title: '血糖小助手',
        downloadLink: 'http://8.140.245.242:8002/'
      },
      {
        image: homePic2,
        bgColor: 'hsl(152, 60%, 97%)',
        title: '个性化推荐',
        downloadLink: 'http://8.140.245.242:8002/'
      }
    ];
  } catch (error) {
    console.error('获取轮播图图片失败:', error);
    // 如果获取失败，可以设置默认图片
    carouselItems.value = [
      {
        image: "src/assets/project/home-pic1.webp",
        bgColor: 'hsl(210, 60%, 95%)',
        title: '血糖小助手',
        downloadLink: 'http://8.140.245.242:8002/'
      },
      {
        image: "src/assets/project/home-pic2.webp",
        bgColor: 'hsl(152, 60%, 97%)',
        title: '个性化推荐',
        downloadLink: 'http://8.140.245.242:8002/'
      }
    ];
  }
};

// 在组件加载时调用方法
onMounted(fetchCarouselImages);
// 其他可选医疗主题配色（可直接替换）：
const medicalColors = [
  {
    bg: 'hsl(230, 25%, 95%)', // 医疗云端蓝
    btn: 'hsl(212, 96%, 56%)' // 权威蓝
  },
  {
    bg: 'hsl(152, 60%, 97%)', // 健康生态绿
    btn: 'hsl(164, 100%, 36%)' // 生命绿
  },
  {
    bg: 'hsl(344, 100%, 97%)', // 急救警示红
    btn: 'hsl(355, 85%, 58%)'
  },
  {
    bg: 'hsl(276, 30%, 96%)', // 医学科技紫
    btn: 'hsl(262, 52%, 47%)'
  }
];
const handleDownload = (item) => {
  // 这里添加下载逻辑
  window.location.href = item.downloadLink;
};




setInterval(() => {
  activeIndex.value = (activeIndex.value + 1) % carouselItems.value.length;
}, 5000);

const questions = ref([
  { text: "血糖总是居高不下", number: "01", icon: "" },
  { text: "不知道如何调整饮食", number: "02", icon: "" },
  { text: "运动后血糖反而上升", number: "03", icon: "" },
  { text: "频繁测血糖，但看不到改善", number: "04", icon: "" },
  { text: "降糖药效果不明显", number: "05", icon: "" },
  { text: "缺乏专业指导，不知所措", number: "06", icon: "" },
  { text: "血糖波动大，难以控制", number: "07", icon: "" },
  { text: "担心并发症，压力很大", number: "08", icon: "" }
]);
const type_name = 'question'; // 图片类型名称
const fetchImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/imageurl/${type_name}`);
    const images = response.data;

    // 更新每个问题的 icon 字段
    questions.value.forEach((question, index) => {
      if (index < images.length) {
        question.icon = images[index].url; // 假设后端返回的图片数据包含 url 字段
      }
    });

  } catch (error) {
    console.error('获取图片失败:', error);
  }
};

// 在组件加载时调用方法
onMounted(fetchImages);
const strengths = ref([
  { title: '整合优秀医疗资源', description: '提供糖尿病院外管理健康服务', icon: '' },
  { title: '四位一体的健康管理', description: '检测评估-专家团队会诊评估-干预方案-个性化健康档案管理', icon: '' },
  { title: '权威知名医疗、技术团队', description: '业界优秀的糖尿病逆转专家及团队', icon: '' },
  { title: '多对1全流程服务', description: '专科医生、营养师、健康顾问及运动教练组成团队进行服务', icon: '' },
  { title: '个性化量身定制', description: '针对不同糖友几情况，进行特别定制，并在过程中不断调整', icon: '' }
]);
// 定义方法：从后端获取图片数据
const fetchStrengthsImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/imageurl/starengths/`);
    const images = response.data;

    // 更新每个优势的 icon 字段
    strengths.value.forEach((strength, index) => {
      if (index < images.length) {
        strength.icon = images[index].url; // 假设后端返回的图片数据包含 url 字段
      }
    });

  } catch (error) {
    console.error('获取图片失败:', error);
  }
};

// 在组件加载时调用方法
onMounted(fetchStrengthsImages);
import { Calendar, Moon, KnifeFork, Basketball, Sunny, ScaleToOriginal } from '@element-plus/icons-vue'

const services = [
  {
    title: '营养治疗',
    icon: KnifeFork,
    description: '定制个性化膳食方案，智能分析营养摄入'
  },
  {
    title: '运动疗法',
    icon: Basketball,
    description: '生成科学运动计划，实时监测运动效果'
  },
  {
    title: '心理疗法',
    icon: Sunny,
    description: '心理健康评估，压力管理与睡眠指导'
  },
  {
    title: '生活方式干预',
    icon: ScaleToOriginal,
    description: '建立健康生活习惯，形成长期健康机制'
  }
]

// 图片路径（请替换为实际路径）
const caseImages = ref([]); // 存储从后端获取的图片路径
// 定义方法：从后端获取图片数据
const fetchCaseImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/imageurl/SUCCESSCASES/`);
    caseImages.value = response.data.map(item => item.url); // 假设后端返回的图片数据包含 url 字段
  } catch (error) {
    console.error('获取图片失败:', error);
  }
};

// 在组件加载时调用方法
onMounted(fetchCaseImages);
const loadMoreCases = () => {
  // 处理查看更多逻辑
  console.log('加载更多案例...')
}
</script>

<style scoped>
/* 若使用scoped需要加深度选择器 */
::v-deep .el-carousel__item {
  background-color: #ffa500; /* 橙色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 保持图片比例 */
}
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
.title {
  text-align: center; /* 文本居中 */
  margin-top: 50px; /* 顶部间距 */
  font-size: 24px; /* 标题字体大小 */
}
.question-list {
  margin-top: 20px;
  background-color:#f9f9f9;
}

.question-item {
  text-align: center;
  padding: 20px;
  background-color:#ffffff;
  border-radius: 8px;
   margin: 15px;
}

.question-icon {
  width: 100px;
  height: 73px;
  margin-bottom: 10px;
}
.strengths {
  text-align: center;
  padding: 20px;
}
.strengths h1 {
  font-size: 2em;
  margin-bottom: 10px;
}
.strengths h2 {
  font-size: 1.5em;
  color: #666;
  margin-bottom: 20px;
}
.strengths-icon {
  width: 72px;
  height: 65px;
  margin-bottom: 10px;
}
.strengths-content {
  margin: 20px;
  display: flex;
  justify-content: center;
}
.strengths-col{
  margin: 20px;

}
.strengths-content .el-col {
  text-align: center;
}
.ai-service-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.title-group {
  margin-bottom: 20px;
}

.main-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.sub-title {
  font-size: 1.2rem;
  color: #666;
  letter-spacing: 2px;
}

.decorative-line {
  width: 100px;
  height: 3px;
  background: #e74c3c;
  margin: 20px auto;
}

/* 主要功能区域 */
.main-feature {
  margin-bottom: 60px;
  align-items: center;
}

.device-image img {
  max-width: 100%;
  height: auto;
}

.app-interface {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.data-section {
  margin-bottom: 30px;
}

.data-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.data-icon {
  font-size: 1.5rem;
  color: #e74c3c;
  margin-right: 10px;
}

.data-time {
  color: #666;
}

.branding {
  text-align: center;
  margin-top: 30px;
}

.brand-name {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-right: 15px;
}

.brand-tag {
  font-size: 1.2rem;
  color: #e74c3c;
}

/* 服务模块 */
.service-modules {
  margin-top: 40px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  font-size: 2.5rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.service-title {
  color: #2c3e50;
  margin-bottom: 15px;
}

.service-desc {
  color: #7f8c8d;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }

  .sub-title {
    font-size: 1rem;
  }

  .service-card {
    margin-bottom: 20px;
  }
}
.case-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* 标题样式 */
.header-section {
  text-align: center;
  margin-bottom: 50px;
}

.main-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.sub-title {
  font-size: 1.2rem;
  color: #666;
  letter-spacing: 4px;
  margin-bottom: 20px;
}

.divider {
  width: 80px;
  height: 3px;
  background-color: #e74c3c;
  margin: 0 auto;
}

/* 内容布局 */
.content-wrapper {
  align-items: center;
}

/* 文字区域样式 */
.text-section {
  margin-bottom: 40px;
}

.description {
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
}

.description p {
  margin-bottom: 20px;
}

/* 按钮样式 */
.more-button {
  padding: 12px 40px;
  font-size: 1.1rem;
  border-radius: 25px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: none;
  transition: all 0.3s ease;
}

.more-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
}

/* 图片区域样式 */
.image-section {
  position: relative;
}

.image-col {
  margin-bottom: 20px;
}

.image-wrapper {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-wrapper:hover {
  transform: translateY(-5px);
}

.case-image1 {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .sub-title {
    font-size: 1rem;
    letter-spacing: 2px;
  }




  .more-button {
    width: 100%;
  }
}
.custom-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.slide-item {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  padding: 40px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.medical-image {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  transition: transform 0.3s;
}

.medical-image:hover {
  transform: scale(1.02);
}

.download-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.hospital-name {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.download-button {
  font-size: 2rem;
  padding: 15px 40px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(52,152,219,0.3);
  transition: all 0.3s ease;
}

.download-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(52,152,219,0.4);
}
</style>
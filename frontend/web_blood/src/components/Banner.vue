<template>
<!--  轮播图-->
  <el-carousel :interval="4000" type="card" height="450px">
    <el-carousel-item v-for="(item, index) in images" :key="index">
      <img :src="item.url" alt="carousel image" class="carousel-image" />
    </el-carousel-item>
  </el-carousel>
<!--数据-->
    <el-row :gutter="16">
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="140900000">
          <template #title>
            <div style="display: inline-flex; align-items: center" class="font_size">
              全国糖尿病人数
              <el-tooltip
                effect="dark"
                content="统计自2021年"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>每年增长</span>
            <span class="red">
              24%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="10000000">
          <template #title>
            <div style="display: inline-flex; align-items: center" class="font_size">
              一型糖尿病人数
              <el-tooltip
                effect="dark"
                content="统计自2021年"
                placement="top"
              >
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>每月增长</span>
            <span class="red">
              12%
              <el-icon>
                 <CaretTop />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="130900000" title="New transactions today">
          <template #title>
            <div style="display: inline-flex; align-items: center" class="font_size">
              二型糖尿病人数
            </div>
          </template>
        </el-statistic>
        <div class="statistic-footer">
          <div class="footer-item">
            <span>超过全球平均</span>
            <span class="red">
              16%
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
          </div>
          <div class="footer-item">
            <el-icon :size="14">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

    <!-- 主体内容 -->
    <div class="content">
        <h1>欢迎来到高血糖科普指南</h1>
        <p>我们致力于提供专业的高血糖知识，帮助您更好地管理健康。</p>
    </div>

    <!-- 信息区块 -->
    <div class="container info-sections">
    <!-- 科研进展 -->
    <div class="section institute-research">
        <h2>科研进展</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><a href="/research/epidemiology" target="_blank">中国糖尿病流行病学最新调查报告（2023）</a><span class="date">2024-03-15</span></li>
            <li><a href="/research/mechanism" target="_blank">胰岛β细胞功能障碍分子机制新发现</a><span class="date">2024-02-28</span></li>
            <li><a href="/research/technology" target="_blank">人工智能在血糖预测中的应用研究</a><span class="date">2024-04-10</span></li>
        </ul>
    </div>

    <!-- 诊疗技术 -->
    <div class="section new-medicine">
        <h2>诊疗技术</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><span>持续葡萄糖监测（CGM）准确性国际新标准发布</span><span class="date">2024-05-20</span></li>
            <li><span>新型GLP-1受体激动剂周制剂临床Ⅲ期结果公布</span><span class="date">2024-06-12</span></li>
            <li><span>闭环胰岛素泵系统获批上市</span><span class="date">2024-07-01</span></li>
        </ul>
    </div>

    <!-- 并发症防治 -->
    <div class="section academic-essay">
        <h2>并发症防治</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><span>糖尿病视网膜病变早期筛查专家共识</span><span class="date">2024-08-15</span></li>
            <li><span>糖尿病肾病蛋白尿管理新策略</span><span class="date">2024-09-02</span></li>
            <li><span>糖尿病足溃疡负压治疗多中心研究</span><span class="date">2024-10-18</span></li>
        </ul>
    </div>

    <!-- 学术会议 -->
    <div class="section academic-activities">
        <h2>学术会议</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><span>[直播] 国际糖尿病联盟亚洲峰会</span><span class="date">2024-11-08</span></li>
            <li><span>中华医学会糖尿病学分会年会</span><span class="date">2024-12-12</span></li>
            <li><span>糖尿病数字疗法创新论坛</span><span class="date">2025-01-20</span></li>
        </ul>
    </div>

    <!-- 饮食管理 -->
    <div class="section diet-management">
        <h2>饮食管理</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><span>低GI食品认证体系更新</span><span class="date">2024-07-15</span></li>
            <li><span>糖尿病医学营养治疗指南（2024版）</span><span class="date">2024-08-30</span></li>
            <li><span>个性化膳食方案AI生成系统发布</span><span class="date">2024-09-25</span></li>
        </ul>
    </div>

    <!-- 患者教育 -->
    <div class="section patient-education">
        <h2>患者教育</h2>
        <a href="#" class="more-link">更多>></a>
        <ul>
            <li><span>糖尿病自我管理移动应用评测报告</span><span class="date">2024-10-05</span></li>
            <li><span>胰岛素注射技术标准化教学视频</span><span class="date">2024-11-18</span></li>
            <li><span>糖尿病心理健康指导手册发布</span><span class="date">2024-12-01</span></li>
        </ul>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import host from "../settings.js"
const images = ref([]); // 存储从后端获取的图片数据
const API_BASE_URL =  host.host; // 根据你的后端地址修改
const type_name = 'Home'; // 图片类型名称

// 定义方法：从后端获取图片数据
const fetchImagesByType = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/imageurl/${type_name}/`);
    images.value = response.data; // 更新图片列表
    console.log(images.value)
  } catch (error) {
    console.error('获取图片失败:', error);
  }
};

// 在组件加载时调用方法
onMounted(fetchImagesByType);

</script>

<style scoped>
.el-carousel__item {
  display: flex;          /* 启用弹性布局 */
  align-items: center;    /* 垂直居中 */
  justify-content: center;/* 水平居中 */
}

.carousel-image {
  width: 100%;           /* 宽度撑满容器 */
  height: 100%;          /* 高度撑满容器 */
  object-fit: cover;     /* 保持比例覆盖容器（可能裁剪） */

  /* 可选：设置最大尺寸限制 */
  max-width: 1200px;
  max-height: 500px;

  /* 可选：禁用图片拖动 */
  pointer-events: none;
}
+
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}


.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
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
/* 主体内容 */
.content {
  text-align: center;
  padding: 60px 20px;
  margin: 40px 0;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

.content h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.content p {
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

/* 信息区块 */
.info-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 40px 20px;
  margin: 0 auto;
  max-width: 1200px;
}

.section {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  position: relative;
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.section h2 {
  font-size: 1.5rem;
  color: #D87D4B;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #eee;
}

.more-link {
  position: absolute;
  right: 25px;
  top: 25px;
  color: #95a5a6;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.more-link:hover {
  color: #D87D4B;
}

.section ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.section li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.section li:last-child {
  border-bottom: none;
}

.section li a {
  color: #34495e;
  flex: 1;
  margin-right: 15px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.section li a:hover {
  color: #D87D4B;
}

.date {
  color: #95a5a6;
  font-size: 0.85rem;
  white-space: nowrap;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content {
    padding: 40px 15px;
  }

  .content h1 {
    font-size: 2rem;
  }

  .content p {
    font-size: 1rem;
  }

  .info-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section {
    padding: 20px;
  }
}
.el-statistic__value {
  font-size: 24px !important;
}

/* 调整标题字体大小 */
.el-statistic__title {
  font-size: 18px !important;
}

/* 调整footer字体大小 */
.statistic-footer span {
  font-size: 16px !important;
}
.font_size{

  font-size: 20px; /* 或者根据需要调整字体大小 */


}
</style>
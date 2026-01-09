<template>
  <el-container class="main-container">
    <!-- 主体内容 -->
    <el-main class="content">
       <!-- 小号导航栏 -->
  <el-card class="info-card">
    <h1 class="info-title">糖尿病</h1>
    <p class="info-subtitle">就诊科室: 内分泌科</p>
    <el-divider></el-divider>
    <div class="info-list">
      <div v-for="(item, index) in infoItems" :key="index">
        <el-icon><div></div></el-icon>
         <p class="info-subtitle1">{{ item }}</p>

      </div>
    </div>
  </el-card>

<!-- 常见问题 - 直接展示版本 -->
<el-card class="faq-card">
  <h3 class="faq-title">常见问题</h3>
  <div class="faq-list">
    <div
      v-for="(item, index) in faqItems"
      :key="index"
      class="faq-item"
    >
      <div class="faq-question">
        <el-icon class="el-icon-question" />
        <p class="info-subtitle1">{{ item.question }}</p>

      </div>
      <div class="faq-answer">
        <el-icon class="el-icon-info" />

         <p class="info-subtitle1">{{ item.answer }}</p>

      </div>
    </div>
  </div>
</el-card>

      <!-- 相关文章 -->
      <el-card class="article-card">
        <h3 class="article-title">相关文章</h3>
        <div ref="container" class="scroll-container">
        <el-row class="article-row" gutter="20">
          <el-col :span="12" v-for="(article, index) in articles.articles_list" :key="index">
            <router-link :to="{ name: 'article_detail', params: { id: article.id } }">
            <el-card class="article-item">
              <img :src="article.image" class="article-image" alt="缩略图">
              <div class="article-content">
                <a  target="_blank" class="article-title">{{ article.title }}</a>
<!--                <p class="article-preview">{{ article.preview }}</p>-->
                <div id="load-more-placeholder"></div>
              </div>
            </el-card>
            </router-link>
          </el-col>

        </el-row>
          </div>
      </el-card>
    </el-main>
  </el-container>

</template>

<script setup>
import { onMounted, ref } from "vue";
import articles from "../../api/recommend.js";

// 医疗建议（新增并发症预防和数字健康管理）
const infoItems = ref([
  '定期复查，持续治疗',
  '药物+饮食运动结合',
  '控体重，健康生活',
  '🌱每周足部检查预防糖尿病足',  // 特色护理建议
  '🌱使用动态血糖监测技术（CGM）',  // 新型监测技术
  '🌱个性化碳水化合物计算饮食法',  // 精准营养管理
  '🌱结合冥想缓解糖尿病焦虑'  // 心理健康维度
]);

// 常见问题（新增前沿治疗和特殊类型）
const faqItems = ref([

  // 新增特色问题
  {
    question: '妊娠糖尿病会影响胎儿吗？',
    answer: '可能造成巨大儿，但通过胰岛素治疗和医学营养管理可有效控制'
  },
  {
    question: '糖尿病与阿尔茨海默病有关联吗？',
    answer: '最新研究显示高血糖会加速β淀粉样蛋白沉积，称为3型糖尿病'
  },
  {
    question: '人工胰腺是什么？',
    answer: '闭环胰岛素泵系统，2023年国内已上市，可自动调节胰岛素输注'
  },
  {
    question: '糖尿病会遗传吗？',
    answer: '2型糖尿病遗传度约60%，直系亲属患病风险增加2-4倍'
  },
  {
    question: '糖尿病急性并发症有哪些？',
    answer: '酮症酸中毒（烂苹果味呼气）、高渗性昏迷、严重低血糖'
  },
  {
    question: '什么是糖尿病蜜月期？',
    answer: '1型糖尿病确诊初期经治疗可能出现的暂时性胰岛素需求减少阶段'
  }
]);

// 默认展开项
const activeNames = ref(['0']);

// 滚动容器
const container = ref(null);

// 加载更多逻辑
const loadMore = () => {
  if (!articles.loading) {
    articles.loading = true; // 设置加载中状态
    articles.current_page += 1;
    articles.get_articles_list(articles.current_page)
      .then(response => {
        articles.articles_list = articles.articles_list.concat(response.data.results);
      })
      .catch(error => {
        articles.error = error;
      })
      .finally(() => {
        articles.loading = false;
      });
  }
};

// 滚动监听
onMounted(() => {
  // 默认加载第一页
  articles.get_articles_list(articles.current_page)
    .then(response => {
      articles.articles_list = response.data.results;
      articles.count = response.data.count; // 获取总数
      articles.size = response.data.size;   // 获取每页条数
    })
    .catch(error => {
      articles.error = error;
    })
    .finally(() => {
      articles.loading = false;
    });

  // 观察占位元素
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMore(); // 触发加载更多
      }
    });
  });

  // 创建占位元素
  const loadMoreElement = document.createElement('div');
  loadMoreElement.id = 'load-more-placeholder';
  container.value?.appendChild(loadMoreElement); // 将占位元素添加到滚动容器
  observer.observe(loadMoreElement);
});
</script>

<style scoped>

.main-container {
  background-color: #f5f5f5;
  padding: 20px;
}

.content {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.info-card {
  margin-bottom: 20px;
}
.info-title{
  font-size: 30px;
}
.info-subtitle{
  font-size: 20px;
}
.info-subtitle1{
  font-size: 18px;
}
.info-list {
  margin-top: 10px;
}

.info-list .el-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-list .el-icon {
  color: #409eff;
  margin-right: 10px;
}

/* 容器样式 */

/* 标题样式 */
.faq-title {
  color: #333;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

/* 问题项容器 */
.faq-item {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: .3s;
}

/* 悬停效果 */
.faq-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 问题样式 */
.faq-question {
  padding: 15px;
  background-color: #f8f8f8;
  font-weight: bold;
  color: #666;
  display: flex;
  align-items: center;
}

/* 回答样式 */
.faq-answer {
  padding: 15px;
  background: white;
  color: #555;
  line-height: 1.6;
  display: flex;
}

/* 图标样式 */
.el-icon-question {
  color: #409EFF;
  margin-right: 10px;
  font-size: 18px;
}

.el-icon-info {
  color: #67C23A;
  margin-right: 10px;
  font-size: 18px;
  flex-shrink: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .faq-item {
    margin-bottom: 15px;
  }

  .faq-question,
  .faq-answer {
    padding: 12px;
    font-size: 14px;
  }
}
.article-card {
  margin-bottom: 20px;
}

.article-title {
  color: #333;
  font-size: 20px;
  margin-bottom: 10px;
}

.article-row {
  display: flex;
  flex-wrap: wrap;
}

.article-item {
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.article-item:hover {
  transform: translateY(-5px);
}

.article-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.article-content {
  padding: 10px;
}

.article-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-decoration: none;
}

.article-preview {
  font-size: 14px;
  color: #666;
}
</style>
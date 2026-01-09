<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import axios from "axios";
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

// API基础URL
import host from "../settings.js"
const API_BASE_URL = host.host
const router = useRouter();
// 定义一个响应状态的变量
const items = ref([]);
const loading = ref(false);
const error = ref(null);
const foodList = ref([]);

// 获取 Vuex Store 中的 token
const store = useStore();
const token = store.state.token;
if (!token) {
  router.push('/login');
}

// 请求 URL
const url = `${API_BASE_URL}app/recommend/get_today_recommendation`;

// 发送 GET 请求并处理响应
const fetchRecommendations = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 假设后端返回的数据格式为 { status: true, data: { food: [...] } }
    const backendData = response.data.data;

    // 将数据赋值给 foodList
    foodList.value = backendData.food;

    console.log(foodList.value);
  } catch (err) {
    error.value = err.message || "An error occurred";
  } finally {
    loading.value = false;
  }
};

// 在组件挂载时调用请求方法
onMounted(() => {
  fetchRecommendations();
});
</script>

<template>
  <Header></Header>
 <div class="page-container">
    <!-- 新增的糖尿病饮食指南 -->
    <div class="diet-guidelines">
      <h2>糖尿病饮食指南</h2>
      <div class="guideline-grid">
        <div class="guideline-card">
          <div class="icon-box bg-blue">
            <span class="icon">🍚</span>
          </div>
          <h3>控制碳水化合物</h3>
          <p>选择全谷物和低GI食物，每餐主食不超过100g</p>
        </div>
        <div class="guideline-card">
          <div class="icon-box bg-green">
            <span class="icon">🥦</span>
          </div>
          <h3>增加膳食纤维</h3>
          <p>每日蔬菜摄入不少于500g，以绿叶菜为主</p>
        </div>
        <div class="guideline-card">
          <div class="icon-box bg-orange">
            <span class="icon">⏰</span>
          </div>
          <h3>定时定量</h3>
          <p>每日5-6餐，保持血糖平稳</p>
        </div>
      </div>
    </div>
  <div class="food-container">
    <div v-for="(item, index) in foodList" :key="index" class="food-card">
      <img
        :src="item.food1_image || 'https://via.placeholder.com/300x200?text=No+Image'"
        alt="Food Image"
        class="food-image"
      />
      <div class="food-info">
        <h3 class="food-name">{{ item.food1_name }}</h3>
        <p class="meal-type">餐别: {{ item.meal }}</p>
      </div>
    </div>
  </div>
  <!-- 新增的饮食注意事项 -->
    <div class="health-tips">
      <h2>饮食注意事项</h2>
      <div class="tips-grid">
        <div class="tip-card warning">
          <h3>🚫 避免食物</h3>
          <ul>
            <li>精制糖及甜食</li>
            <li>高脂油炸食品</li>
            <li>加工肉制品</li>
          </ul>
        </div>
        <div class="tip-card recommendation">
          <h3>✅ 推荐习惯</h3>
          <ul>
            <li>餐后适度运动</li>
            <li>每日饮水2000ml</li>
            <li>定期监测血糖</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<style scoped>
.food-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.food-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.food-card:hover {
  transform: translateY(-5px);
}

.food-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.food-info {
  padding: 15px;
  text-align: center;
}

.food-name {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0 0 10px;
  color: #333;
}

.meal-type {
  font-size: 0.9em;
  color: #666;
  margin: 0;
}
/* 新增样式 */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  color: #2c3e50;
  border-left: 4px solid #42b983;
  padding-left: 15px;
  margin: 40px 0;
}

.diet-guidelines {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  margin: 20px 0;
}

.guideline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.guideline-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.bg-blue { background: #e3f2fd; }
.bg-green { background: #e8f5e9; }
.bg-orange { background: #fff3e0; }

.nutrition-facts {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.nutrient {
  text-align: center;
}

.label {
  display: block;
  font-size: 0.9em;
  color: #666;
}

.value {
  font-weight: bold;
  color: #2c3e50;
}

.low-gi {
  color: #4CAF50;
}

.meal-recommend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.cooking-method {
  font-size: 0.9em;
  color: #42b983;
}

.health-tips {
  margin: 40px 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.tip-card {
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
}

.tip-card.warning {
  background: #ffebee;
  border: 1px solid #ffcdd2;
}

.tip-card.recommendation {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
}

.tip-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

/* 优化原有样式 */
.food-card {
  position: relative;
  overflow: hidden;
}

.food-card:hover {
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.food-image {
  transition: transform 0.3s ease;
}

.food-card:hover .food-image {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .guideline-grid {
    grid-template-columns: 1fr;
  }
}
</style>
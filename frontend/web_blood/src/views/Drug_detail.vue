<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import drug_detail from "../api/drug_details.js";

const route = useRoute();
const drug = ref(null); // 使用 ref 创建响应式变量
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id; // 获取传递的 id
  drug_detail.get_drug_detail(id)
    .then(response => {
      drug.value = response.data.drug_detail[0]; // 使用 .value 更新数据
      console.log(drug.value)
      const drugDetail = drug.value;
      document.getElementById("medicine_name").textContent = drugDetail.medicine_name || "";
      document.getElementById("indications").textContent = drugDetail.indications || "";
      document.getElementById("specifications").textContent = drugDetail.specifications || "";
      document.getElementById("dosage").textContent = drugDetail.dosage || "";
      document.getElementById("contraindications").textContent = drugDetail.contraindications || "";
      document.getElementById("precautions").textContent = drugDetail.precautions || "";
      document.getElementById("composition").textContent = drugDetail.composition || "";
    })
    .catch(error => {
      console.error('Error fetching drug details:', error);
    });
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>药品详情</h1>
    </div>
    <div class="content">
      <div class="drug-card">
                 <img
   :src="drug?.image || 'https://img1.dxycdn.com/2021/0611/705/5729817956214126843-22.png'"
   alt="药品照片"
    class="drug-image"
    />
<!--        <img src="https://img1.dxycdn.com/2021/0611/705/5729817956214126843-22.png" alt="药品图片" class="drug-image">-->
        <div class="drug-info">
          <h2 id="medicine_name" class="medicine-name">{{ drug?.medicine_name }}</h2>
          <span class="drug-tag">处方药</span>
          <p id="manufacturer" class="manufacturer">生产厂家: {{ drug?.manufacturer }}</p>
        </div>
      </div>

      <div class="details">
        <div class="section">
          <h2 id="symptom">适应症</h2>
          <p id="indications">{{ drug?.indications }}</p>
        </div>
        <div class="section">
          <h2 id="package">包装规格</h2>
          <p id="specifications">{{ drug?.specifications }}</p>
        </div>
        <div class="section">
          <h2 id="usage">用法用量</h2>
          <p id="dosage">{{ drug?.dosage }}</p>
        </div>
        <div class="section">
          <h2 id="note">注意事项</h2>
          <p id="contraindications" class="warning">{{ drug?.contraindications }}</p>
          <p id="precautions">{{ drug?.precautions }}</p>
        </div>
        <div class="section">
          <h2 id="ingredient">成分信息</h2>
          <p id="composition">{{ drug?.composition }}</p>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <ul>
        <li><a href="#symptom">1. 适应症</a></li>
        <li><a href="#package">2. 包装规格</a></li>
        <li><a href="#usage">3. 用法用量</a></li>
        <li><a href="#note">4. 注意事项</a></li>
        <li><a href="#ingredient">5. 成分信息</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drug-card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drug-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.drug-info {
  flex: 1;
}

.medicine-name {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 10px;
}

.drug-tag {
  background-color: #f39c12;
  color: #fff;
  padding: 1px 2px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 100px;
}

.manufacturer {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.details {
  margin-top: 20px;
}

.section {
  margin-bottom: 30px;
}

.section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.section p {
  color: #34495e;
  line-height: 1.6;
}

.warning {
  color: #e74c3c;
  font-weight: bold;
}

.sidebar {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  color: #3498db;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.sidebar a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .drug-card {
    flex-direction: column;
    text-align: center;
  }

  .drug-image {
    max-width: 100%;
    height: auto;
  }

  .sidebar {
    margin-top: 20px;
  }
}
</style>
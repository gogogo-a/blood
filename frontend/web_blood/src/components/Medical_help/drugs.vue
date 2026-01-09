<template>
 <div ref="container" class="scroll-container">
  <div class="card drug-container" id="drug">

  <div class="drug-card" v-for="(drug, index) in drugs.drugs_list" :key="index">
      <router-link :to="{ name: 'drug_detail', params: { id: drug.id } }">
         <img
   :src="drug.image || 'https://img1.dxycdn.com/2021/0611/705/5729817956214126843-22.png'"
   alt="药品照片"
    class="drug-photo"
    />
<!--    <img-->
<!--      src="https://img1.dxycdn.com/2021/0611/705/5729817956214126843-22.png"-->
<!--      alt="药品照片"-->
<!--      class="drug-photo"-->
<!--    />-->
    <div class="drug-card-content">
      <a
        target="_blank"
        class="drug-name"
      >
        {{ drug.medicine_name }}
      </a>
      <div id="load-more-placeholder"></div>
      <p class="drug-manufacturer">{{ drug.manufacturer }}</p>

    </div>
        </router-link>
  </div>
      </div>
</div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import drugs from "../../api/drugs.js";

// 医院数据
// 滚动容器
const container = ref(null);

// 加载更多逻辑
const loadMore = () => {
  if (!drugs.loading) {
    drugs.loading = true; // 设置加载中状态
    drugs.current_page += 1;
    drugs.get_drugs_list(drugs.current_page)
      .then(response => {
        drugs.drugs_list = drugs.drugs_list.concat(response.data.results);
      })
      .catch(error => {
        drugs.error = error;
      })
      .finally(() => {
        drugs.loading = false;
      });
  }
};

// 滚动监听
onMounted(() => {
  // 默认加载第一页
  drugs.get_drugs_list(drugs.current_page)
    .then(response => {
      drugs.drugs_list = response.data.results;
      drugs.count = response.data.count; // 获取总数
      drugs.size = response.data.size;   // 获取每页条数
    })
    .catch(error => {
      drugs.error = error;
    })
    .finally(() => {
      drugs.loading = false;
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


// 药品数据







</script>


<style scoped>
/* 移除.card的flex布局，避免影响内部容器 */
.card {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.drug-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片间距20px */
  width: 80%; /* 确保容器占满父元素 */
}

.drug-card {
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  /* 关键修改：计算50%宽度时考虑gap的间距 */
  width: calc(50% - 10px); /* 20px间隙中每个卡片承担10px */

  /* 添加最小宽度防止内容挤压 */
  min-width: 200px;
}

/* 保持其他样式不变 */
.drug-photo {
  width: 65%;
  height: 150px;
  object-fit: cover;
}

.drug-card-content {
  padding: 10px;
  text-align: center;
}

.drug-name {
  color: #337ab7;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1em;
}

.drug-name:hover {
  text-decoration: underline;
}

.drug-manufacturer {
  color: #666;
  margin-top: 5px;
}
</style>
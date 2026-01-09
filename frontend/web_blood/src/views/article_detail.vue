<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import article_details from "../api/article_detail.js";


const route = useRoute();
const article = ref(null); // 使用 ref 创建响应式变量
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id; // 获取传递的 id
  article_details.get_article_detail(id)
    .then(response => {
      article.value = response.data.article_detail[0]; // 使用 .value 更新数据
    })
    .catch(error => {
      console.error('Error fetching article details:', error);
    });
});
</script>
<template>

  <div class="container">
    <div class="content2">
      <div class="card" v-if="article">
        <h1 id="medicine_name">{{ article.title }}</h1>
        <div class="thumbnail">
          <img id="img" :src="article.image" alt="图片">
        </div>
        <div id="content" v-html="article.content"></div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content2 {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #D87D4B;
  padding-bottom: 10px;
}

.thumbnail img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

#content {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

#content p {
  margin-bottom: 20px;
  text-indent: 2em;
}

.card::before {
  content: " ";
  display: block;
  width: 50px;
  height: 4px;
  background-color: #D87D4B;
  margin-bottom: 20px;
}


</style>
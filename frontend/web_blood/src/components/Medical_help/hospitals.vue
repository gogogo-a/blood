<template>
  <div class="card" id="hospital">
    <h3 class="myHead">相关医院</h3>
    <div ref="container" class="scroll-container">
    <div class="hospitalCard" v-for="(hospital, index) in hospitals.hospitals_list" :key="index">
      <img
   :src="hospital.image || 'https://img1.dxycdn.com/2020/0821/576/5341793254857661343-22.png'"
   alt="医院图片"
    class="hospitalPhoto"
    />
      <div class="hospitalDetails">
        <div class="hospitalHeader">
          <a
            href="#"
            class="hospitalName"
            @click.prevent="redirectToBaiduMap(hospital.address, hospital.hospital_name) "
          >
            {{ hospital.hospital_name }}
          </a>
          <span class="hospitalTag">三甲医院</span>
        </div>
        <div class="hospitalAddress">{{ hospital.address }}</div>
        <div id="load-more-placeholder"></div>
      </div>
    </div>
      </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import hospitals from "../../api/hospitals.js";

// 医院数据
// 滚动容器
const container = ref(null);

// 加载更多逻辑
const loadMore = () => {
  if (!hospitals.loading) {
    hospitals.loading = true; // 设置加载中状态
    hospitals.current_page += 1;
    hospitals.get_hospitals_list(hospitals.current_page)
      .then(response => {
        hospitals.hospitals_list = hospitals.hospitals_list.concat(response.data.results);

      })
      .catch(error => {
        hospitals.error = error;
      })
      .finally(() => {
        hospitals.loading = false;
      });
  }
};

// 滚动监听
onMounted(() => {
  // 默认加载第一页
  hospitals.get_hospitals_list(hospitals.current_page)
    .then(response => {
      hospitals.hospitals_list = response.data.results;
      hospitals.count = response.data.count; // 获取总数
      hospitals.size = response.data.size;   // 获取每页条数
    })
    .catch(error => {
      hospitals.error = error;
    })
    .finally(() => {
      hospitals.loading = false;
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



// 跳转到百度地图
function redirectToBaiduMap(address, hospitalName) {
  if (address && hospitalName) {
    const encodedAddress = encodeURIComponent(address);
    const encodedHospitalName = encodeURIComponent(hospitalName);
    window.open(`https://map.baidu.com/?newmap=1&ie=UTF-8&biz=1&s=${encodedHospitalName}&addr=${encodedAddress}`, '_blank');
  }
}
</script>

<style scoped>
.card {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.myHead {
  margin: 0 0 10px;
  font-size: 1.2em;
  color: #333;
}

.hospitalCard {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.hospitalPhoto {
  width: 150px;
  height: 120px;
  object-fit: cover;
  border-right: 1px solid #f0f0f0;
}

.hospitalDetails {
  flex: 1;
  padding: 10px;
}

.hospitalHeader {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.hospitalName {
  margin-right: 10px;
  color: #337ab7;
  text-decoration: none;
  font-size: 23px;
}

.hospitalName:hover {
  text-decoration: underline;
}

.hospitalTag {
  padding: 2px 6px;
  background-color: #f8f9fa;
  color: #6c757d;
  border-radius: 4px;
  font-size: 15px;
}

.hospitalAddress {
  color: #666;
  font-size: 20px;
}
.font_size{
  font-size: 20px;
}
</style>
import {createRouter, createWebHistory} from 'vue-router'
import {useStore} from "vuex";

// 路由列表
const routes = [
    {
    meta:{
        title: "欢迎-AI血糖",
        keepAlive: false
    },
    path: '/',         // 欢迎页作为入口
    name: "Welcome",
    component: ()=> import("../views/Welcome.vue")
  },
    {
    meta:{
        title: "首页-AI血糖",
        keepAlive: true
    },
    path: '/home',         // 首页改为 /home
    name: "Home",
    component: ()=> import("../views/Home.vue")
  },
        {
    meta:{
        title: "登录-AI血糖",
        keepAlive: true
    },
    path: '/login',         // uri访问地址
    name: "Login",
    component: ()=> import("../views/Login.vue")
  },
      {
    meta:{
        title: "注册-AI血糖",
        keepAlive: true
    },
    path: '/register',         // uri访问地址
    name: "Register",
    component: ()=> import("../views/Register.vue")
  },
    {
    meta:{
        title: "医疗帮助-AI血糖",
        keepAlive: true
    },
    path: '/medical_help',         // uri访问地址
    name: "Medical_help",
    component: ()=> import("../views/Medical_help.vue"),
            children: [
        {
          meta:{
            title: "医疗帮助-AI血糖",
            keepAlive: true,
            authorization: true,
          },
          path: '',
          name: "recommend",
          component: ()=> import("../components/Medical_help/recommend.vue"),
        },
                    {
          meta:{
            title: "医疗帮助-AI血糖",
            keepAlive: true,
            authorization: true,
          },
          path: 'hospitals',
          name: "hospitals",
          component: ()=> import("../components/Medical_help/hospitals.vue"),
        },
                    {
          meta:{
            title: "医疗帮助-AI血糖",
            keepAlive: true,
            authorization: true,
          },
          path: 'drugs',
          name: "drugs",
          component: ()=> import("../components/Medical_help/drugs.vue"),
        },
                    {
          meta:{
            title: "医疗帮助-AI血糖",
            keepAlive: true,
            authorization: true,
          },
          path: 'picture',
          name: "picture",
          component: ()=> import("../components/Medical_help/picture.vue"),
        },
                    {
          meta:{
            title: "医疗帮助-AI血糖",
            keepAlive: true,
            authorization: true,
          },
          path: 'document',
          name: "document",
          component: ()=> import("../components/Medical_help/document.vue"),
        },
            ]

  },

 {
    meta:{
        title: "文章详情-AI血糖",
        keepAlive: true
    },
    path: '/article_detail/:id',         // uri访问地址
    name: "article_detail",
    component: ()=> import("../views/article_detail.vue")
  },
    {
    meta:{
        title: "药品详情-AI血糖",
        keepAlive: true
    },
    path: '/drug_detail/:id',         // uri访问地址
    name: "drug_detail",
    component: ()=> import("../views/Drug_detail.vue")
  },
     {
    meta:{
        title: "饮食推荐-AI血糖",
        keepAlive: true,
        authorization: true,
    },
    path: '/diet_advice',         // uri访问地址
    name: "diet_advice",
    component: ()=> import("../views/Food_recommend.vue")
  },
         {
    meta:{
        title: "社区-AI血糖",
        keepAlive: true
    },
    path: '/corridor',         // uri访问地址
    name: "corridor",
    component: ()=> import("../views/Community.vue")
  },
           {
    meta:{
        title: "推荐产品-AI血糖",
        keepAlive: true
    },
    path: '/recommendations',         // uri访问地址
    name: "recommendations",
    component: ()=> import("../views/recommendations.vue")
  },
]

// 路由对象实例化
const router = createRouter({
  // history, 指定路由的模式
  history: createWebHistory(),
  // 路由列表
  routes,
});

// 暴露路由对象
export default router
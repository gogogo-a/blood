# 智护血糖 - AI 个性化控糖系统

<div align="center">

**面向糖尿病患者的慢病管理平台**

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-3.2-0C4B33.svg)](https://www.djangoproject.com/)
[![Vue](https://img.shields.io/badge/Vue-3-42B883.svg)](https://vuejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![Neo4j](https://img.shields.io/badge/Neo4j-Knowledge_Graph-4581C3.svg)](https://neo4j.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-D82C20.svg)](https://redis.io/)

</div>

## 项目简介

智护血糖是一套面向糖尿病患者的慢病管理平台。

系统包含 Web 端、移动端、后台管理端以及 AI 问答模块，支持血糖记录、饮食管理、运动管理、用药记录、知识问答和个性化推荐。

[演示视频](https://blood-sugar.oss-cn-beijing.aliyuncs.com/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4)

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 后端 | Django、Django REST Framework、Celery |
| 前端 | Vue 3、Vite、Element Plus、Axios |
| 移动端 | HTML5、CSS3、JavaScript |
| 数据库 | MySQL、Redis、Neo4j |
| AI | DeepSeek、知识图谱、个性化推荐 |
| 可视化 | ECharts、Three.js |

## 系统架构

![系统架构图](.assets/readme/system-architecture.png)

- Web 端：科普内容、医疗资源、药品信息、知识图谱
- 移动端：健康记录、饮食推荐、AI 问答、社区互动
- 后台端：用户数据、内容数据、交易记录、推荐资源
- 数据层：MySQL、Redis、Neo4j
- AI 能力：DeepSeek 问答、知识检索、个性化推荐

## 核心功能

### Web 端

![Web 首页](.assets/readme/web-home.png)

功能：

- 疾病科普
- 医疗帮助
- 饮食建议
- 推荐产品
- 知识图谱

![医疗定位](.assets/readme/medical-location.png)

![医院列表](.assets/readme/hospital-list.png)

功能：

- 医院查询
- 医生信息
- 药品信息
- 医疗资源推荐
- 关键词检索

### 移动端

![移动端登录](.assets/readme/mobile-login.png)

功能：

- 账号密码登录
- 邮箱验证码登录
- 用户注册
- 管理员入口

![饮食推荐](.assets/readme/mobile-diet.png)

![三餐推荐](.assets/readme/meal-recommendation.png)

功能：

- 三餐推荐
- 食物识别
- 饮食问答
- 控糖建议
- 健康数据记录

![社区交流](.assets/readme/community-chat.png)

功能：

- 发帖
- 评论
- 点赞
- 用户交流

### 后台管理

![后台首页](.assets/readme/admin-dashboard.png)

功能：

- 用户信息管理
- 血糖信息管理
- 运动记录管理
- 用药记录管理
- 医院、药品、文章、每日推荐食物维护

![交易记录](.assets/readme/admin-transaction.png)

功能：

- 充值记录
- 扣费记录
- 用户等级
- 价格策略
- 订单信息

### AI 问答

![知识图谱](.assets/readme/knowledge-graph.png)

![知识图谱构建流程](.assets/readme/kg-build-flow.png)

![Neo4j 知识存储](.assets/readme/neo4j-storage.png)

功能：

- 糖尿病实体关系管理
- 疾病、症状、药品、检查项目关联
- Neo4j 图数据库存储
- DeepSeek 结合检索结果生成回答

### 个性化推荐

![NIPA 个性化推荐模型](.assets/readme/nipa-model.png)

能力：

- 用户健康状态建模
- 饮食方案适配
- 运动方案适配
- 多层感知机预测方案适配度

输入：

- 血糖记录
- 饮食习惯
- 运动情况
- 健康目标

输出：

- 饮食建议
- 运动建议
- 控糖方案
- 健康提醒

## 项目亮点

- Neo4j 存储糖尿病领域实体关系
- DeepSeek 提供糖尿病知识问答
- NIPA 推荐模型用于饮食和运动方案适配
- Web 端、移动端、后台管理端数据联动

## 项目成果

- 传智杯全国 IT 技能大赛 Web 网页开发挑战赛 B 组国赛一等奖
- “知糖助手平台 V1.0”计算机软件著作权
- Web 端、移动端、后台管理端和 AI 问答模块完整实现

![知糖助手平台 V1.0 软件著作权](.assets/readme/software-copyright.png)

## 快速启动

### 后端

```bash
cd backed/Blood_Sugar
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Web 端

```bash
cd frontend/web_blood
npm install
npm run dev
```

### 移动端

```bash
cd frontend/blood_html
```

移动端为静态页面，可部署到 Web 服务器后访问。

## 项目结构

```text
blood_sugar/
├── backed/Blood_Sugar/       # Django 后端
├── frontend/web_blood/       # Vue Web 端
├── frontend/blood_html/      # 移动端页面
├── .assets/readme/           # README 图片
└── README.md
```

## 项目信息

- 项目负责人：耿浩、李悦欣、陈千山
- 指导老师：刁丽娟
- 学校：北华航天工业学院
- 仓库地址：[https://github.com/gogogo-a/blood.git](https://github.com/gogogo-a/blood.git)
- 许可证：[MIT](LICENSE)

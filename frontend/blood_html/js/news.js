// ========================================
// 健康资讯系统
// ========================================

// 健康资讯数据库
const healthNewsData = [
    {
        id: 1,
        title: "研究发现：每天步行6000步可显著降低糖尿病风险",
        summary: "最新研究表明，每天坚持步行6000步以上，可以将2型糖尿病的发病风险降低44%。专家建议将步行融入日常生活...",
        category: "research",
        categoryName: "最新研究",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
        source: "健康时报",
        date: "2024-12-28",
        readTime: "3分钟",
        views: 12580,
        featured: true
    },
    {
        id: 2,
        title: "糖尿病患者的早餐指南：这5种搭配最稳血糖",
        summary: "早餐是一天中最重要的一餐，对于糖尿病患者来说更是如此。本文推荐5种低GI早餐搭配方案...",
        category: "diet",
        categoryName: "饮食指南",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=250&fit=crop",
        source: "营养学报",
        date: "2024-12-27",
        readTime: "5分钟",
        views: 8920
    },
    {
        id: 3,
        title: "二甲双胍服用的最佳时间，90%的人都搞错了",
        summary: "二甲双胍是最常用的降糖药之一，但很多患者对服药时间存在误解。本文详细解析正确的服药方法...",
        category: "medicine",
        categoryName: "用药知识",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
        source: "医学科普",
        date: "2024-12-26",
        readTime: "4分钟",
        views: 15670
    },
    {
        id: 4,
        title: "餐后血糖总是高？试试这个「进食顺序法」",
        summary: "日本研究发现，改变进食顺序可以有效控制餐后血糖。先吃蔬菜，再吃蛋白质，最后吃主食...",
        category: "diet",
        categoryName: "饮食指南",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop",
        source: "糖尿病之友",
        date: "2024-12-25",
        readTime: "3分钟",
        views: 9840
    },
    {
        id: 5,
        title: "适合糖友的5种有氧运动，在家就能做",
        summary: "运动是控糖的重要手段，但不是所有运动都适合糖尿病患者。本文推荐5种安全有效的居家有氧运动...",
        category: "exercise",
        categoryName: "运动建议",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop",
        source: "运动医学",
        date: "2024-12-24",
        readTime: "4分钟",
        views: 7650
    },
    {
        id: 6,
        title: "睡眠不足会升高血糖？这不是危言耸听",
        summary: "研究证实，长期睡眠不足会导致胰岛素抵抗增加，血糖控制变差。建议糖友每天保证7-8小时睡眠...",
        category: "life",
        categoryName: "生活方式",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
        source: "健康生活",
        date: "2024-12-23",
        readTime: "3分钟",
        views: 6230
    },
    {
        id: 7,
        title: "新型降糖药GLP-1受体激动剂，你了解多少？",
        summary: "GLP-1受体激动剂是近年来备受关注的新型降糖药，不仅能降糖还能减重。本文全面解析其作用机制...",
        category: "medicine",
        categoryName: "用药知识",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=250&fit=crop",
        source: "医药前沿",
        date: "2024-12-22",
        readTime: "6分钟",
        views: 11200
    },
    {
        id: 8,
        title: "糖尿病患者可以吃水果吗？这份清单请收好",
        summary: "很多糖友不敢吃水果，其实选对种类和时机，水果也能放心吃。本文列出适合糖友的低糖水果清单...",
        category: "diet",
        categoryName: "饮食指南",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=250&fit=crop",
        source: "营养师说",
        date: "2024-12-21",
        readTime: "4分钟",
        views: 13450
    },
    {
        id: 9,
        title: "压力大血糖就飙升？教你3招有效减压",
        summary: "心理压力会刺激肾上腺素分泌，导致血糖升高。学会这3个减压技巧，让血糖更平稳...",
        category: "life",
        categoryName: "生活方式",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop",
        source: "心理健康",
        date: "2024-12-20",
        readTime: "3分钟",
        views: 5890
    },
    {
        id: 10,
        title: "突破性研究：干细胞治疗糖尿病取得新进展",
        summary: "国际顶级期刊发表最新研究，干细胞疗法在1型糖尿病治疗中展现出令人振奋的效果...",
        category: "research",
        categoryName: "最新研究",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
        source: "科学日报",
        date: "2024-12-19",
        readTime: "5分钟",
        views: 18900
    }
];

let currentCategory = 'all';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedNews();
    renderNewsList();
    initAIParticles();
});

// 渲染头条新闻
function renderFeaturedNews() {
    const container = document.getElementById('featured-news');
    const featured = healthNewsData.find(n => n.featured) || healthNewsData[0];
    
    container.innerHTML = `
        <div class="featured-card" onclick="openNews(${featured.id})">
            <div class="featured-image">
                <img src="${featured.image}" alt="${featured.title}">
                <div class="featured-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.56 21c-.43 0-.86-.17-1.18-.49l-4.38-4.38-4.38 4.38c-.65.65-1.71.65-2.36 0-.65-.65-.65-1.71 0-2.36l4.38-4.38-4.38-4.38c-.65-.65-.65-1.71 0-2.36.65-.65 1.71-.65 2.36 0l4.38 4.38 4.38-4.38c.65-.65 1.71-.65 2.36 0 .65.65.65 1.71 0 2.36l-4.38 4.38 4.38 4.38c.65.65.65 1.71 0 2.36-.32.32-.75.49-1.18.49z"/>
                    </svg>
                    热门
                </div>
            </div>
            <div class="featured-content">
                <span class="news-category ${featured.category}">${featured.categoryName}</span>
                <h3 class="featured-title">${featured.title}</h3>
                <p class="featured-summary">${featured.summary}</p>
                <div class="featured-meta">
                    <span class="meta-source">${featured.source}</span>
                    <span class="meta-dot">·</span>
                    <span class="meta-time">${featured.readTime}阅读</span>
                    <span class="meta-dot">·</span>
                    <span class="meta-views">${formatViews(featured.views)}阅读</span>
                </div>
            </div>
        </div>
    `;
}

// 渲染新闻列表
function renderNewsList(category = 'all') {
    const container = document.getElementById('news-list');
    let news = healthNewsData.filter(n => !n.featured);
    
    if (category !== 'all') {
        news = news.filter(n => n.category === category);
    }
    
    // 随机打乱顺序
    news = news.sort(() => Math.random() - 0.5).slice(0, 4);
    
    container.innerHTML = news.map(item => `
        <div class="news-item" onclick="openNews(${item.id})">
            <div class="news-item-content">
                <span class="news-category ${item.category}">${item.categoryName}</span>
                <h4 class="news-item-title">${item.title}</h4>
                <div class="news-item-meta">
                    <span>${item.source}</span>
                    <span class="meta-dot">·</span>
                    <span>${item.readTime}</span>
                </div>
            </div>
            <div class="news-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
        </div>
    `).join('');
}

// 筛选新闻
function filterNews(category) {
    currentCategory = category;
    
    // 更新标签状态
    document.querySelectorAll('.tag-item').forEach(tag => {
        tag.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderNewsList(category);
}

// 打开新闻详情
function openNews(id) {
    const news = healthNewsData.find(n => n.id === id);
    if (news) {
        // 显示新闻详情弹窗
        showNewsModal(news);
    }
}

// 显示新闻详情弹窗
function showNewsModal(news) {
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'news-modal';
    modal.innerHTML = `
        <div class="news-modal-content">
            <div class="news-modal-header">
                <button class="modal-close" onclick="closeNewsModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#86868B">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="news-modal-image">
                <img src="${news.image}" alt="${news.title}">
            </div>
            <div class="news-modal-body">
                <span class="news-category ${news.category}">${news.categoryName}</span>
                <h2>${news.title}</h2>
                <div class="news-modal-meta">
                    <span>${news.source}</span>
                    <span class="meta-dot">·</span>
                    <span>${news.date}</span>
                    <span class="meta-dot">·</span>
                    <span>${formatViews(news.views)}阅读</span>
                </div>
                <div class="news-modal-text">
                    <p>${news.summary}</p>
                    <p>${generateNewsContent(news)}</p>
                </div>
                <div class="news-modal-actions">
                    <button class="action-btn like-btn" onclick="likeNews(${news.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        有用
                    </button>
                    <button class="action-btn share-btn" onclick="shareNews(${news.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                        分享
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 动画显示
    setTimeout(() => modal.classList.add('show'), 10);
}

// 关闭新闻弹窗
function closeNewsModal() {
    const modal = document.querySelector('.news-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// 生成新闻详细内容
function generateNewsContent(news) {
    const contents = {
        diet: `
            <p>对于糖尿病患者来说，合理的饮食管理是控制血糖的关键。以下是一些实用的饮食建议：</p>
            <p><strong>1. 选择低GI食物</strong><br>低升糖指数（GI）的食物能够缓慢释放葡萄糖，避免血糖急剧波动。推荐选择全谷物、豆类、大部分蔬菜和部分水果。</p>
            <p><strong>2. 控制碳水化合物摄入</strong><br>每餐碳水化合物的摄入量应该相对固定，建议每餐主食控制在1-2两（50-100克）。</p>
            <p><strong>3. 增加膳食纤维</strong><br>膳食纤维可以延缓糖分吸收，建议每天摄入25-30克膳食纤维。</p>
            <p>记住，饮食控制不是一朝一夕的事，需要长期坚持。建议在营养师的指导下制定个性化的饮食方案。</p>
        `,
        exercise: `
            <p>运动是糖尿病管理的重要组成部分，适当的运动可以提高胰岛素敏感性，帮助控制血糖。</p>
            <p><strong>运动建议：</strong></p>
            <p>• 每周至少进行150分钟中等强度有氧运动<br>
            • 运动前后监测血糖，避免低血糖<br>
            • 选择适合自己的运动方式，如快走、游泳、骑车等<br>
            • 运动时随身携带糖果，以备低血糖时使用</p>
            <p><strong>注意事项：</strong></p>
            <p>血糖过高（>14mmol/L）或过低（<5mmol/L）时不宜运动。运动前最好咨询医生，制定适合自己的运动计划。</p>
        `,
        medicine: `
            <p>正确使用降糖药物是血糖管理的重要环节。以下是一些用药注意事项：</p>
            <p><strong>1. 按时服药</strong><br>严格按照医嘱服药，不要随意增减剂量或停药。</p>
            <p><strong>2. 了解药物特性</strong><br>不同降糖药的作用机制和服用时间不同，需要了解自己所用药物的特点。</p>
            <p><strong>3. 监测血糖</strong><br>定期监测血糖，了解药物效果，及时与医生沟通调整方案。</p>
            <p><strong>4. 注意低血糖</strong><br>某些降糖药可能引起低血糖，需要学会识别和处理低血糖症状。</p>
            <p>如有任何用药疑问，请及时咨询医生或药师。</p>
        `,
        research: `
            <p>糖尿病研究领域不断取得新进展，为患者带来更多治疗希望。</p>
            <p>近年来，科学家们在以下领域取得了重要突破：</p>
            <p><strong>• 新型降糖药物</strong><br>GLP-1受体激动剂、SGLT2抑制剂等新型药物不仅能有效降糖，还具有心血管保护作用。</p>
            <p><strong>• 人工胰腺技术</strong><br>闭环胰岛素输注系统可以自动调节胰岛素剂量，大大改善血糖控制。</p>
            <p><strong>• 干细胞治疗</strong><br>干细胞疗法有望从根本上恢复胰岛功能，目前已进入临床试验阶段。</p>
            <p>虽然这些研究令人振奋，但目前最重要的仍是做好日常血糖管理。</p>
        `,
        life: `
            <p>健康的生活方式是糖尿病管理的基础。除了饮食和运动，以下几点同样重要：</p>
            <p><strong>1. 保证充足睡眠</strong><br>睡眠不足会影响胰岛素敏感性，建议每天保证7-8小时睡眠。</p>
            <p><strong>2. 管理压力</strong><br>长期压力会导致血糖升高，学会放松和减压很重要。</p>
            <p><strong>3. 戒烟限酒</strong><br>吸烟会加重糖尿病并发症风险，饮酒会影响血糖控制。</p>
            <p><strong>4. 定期体检</strong><br>定期检查糖化血红蛋白、肾功能、眼底等，早期发现并发症。</p>
            <p>记住，糖尿病是可以控制的，保持积极乐观的心态，与疾病和平共处。</p>
        `
    };
    
    return contents[news.category] || contents.life;
}

// 点赞
function likeNews(id) {
    const btn = document.querySelector('.like-btn');
    btn.classList.toggle('liked');
    if (btn.classList.contains('liked')) {
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            已收藏
        `;
    }
}

// 分享
function shareNews(id) {
    const news = healthNewsData.find(n => n.id === id);
    if (navigator.share) {
        navigator.share({
            title: news.title,
            text: news.summary,
            url: window.location.href
        });
    } else {
        alert('已复制链接到剪贴板');
    }
}

// 显示全部新闻
function showAllNews() {
    renderNewsList('all');
}

// 格式化阅读量
function formatViews(views) {
    if (views >= 10000) {
        return (views / 10000).toFixed(1) + 'w';
    }
    return views;
}


// ========================================
// AI 助手粒子动画
// ========================================
function initAIParticles() {
    const container = document.getElementById('ai-particles');
    if (!container) return;

    // 创建粒子
    for (let i = 0; i < 15; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = Math.random() * 30 + '%';
    
    // 随机大小
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 随机动画延迟和持续时间
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // 动画结束后重新创建
    particle.addEventListener('animationiteration', () => {
        particle.style.left = Math.random() * 100 + '%';
    });
}

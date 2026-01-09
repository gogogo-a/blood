// ========================================
// 社区页面 - 增强版
// ========================================

let allTopics = [];
let currentTag = 'all';
let currentCarouselIndex = 0;
let carouselInterval = null;
let checkinData = null;
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth() + 1;
let checkinDates = [];

// 每日话题库
const dailyTopics = [
    "分享一下你今天的血糖控制心得吧～",
    "今天吃了什么低GI的美食？",
    "运动打卡！今天你运动了吗？",
    "分享一个控糖小技巧给大家",
    "今天的血糖波动大吗？聊聊原因",
    "推荐一道适合糖友的家常菜",
    "你是怎么克服嘴馋的？",
    "分享你的控糖早餐搭配",
    "今天心情怎么样？",
    "有什么想问大家的问题吗？"
];

// 模拟热门话题数据
const hotTopicsData = [
    {
        id: 1,
        title: "确诊糖尿病3年，我是如何把糖化从9.2降到5.8的",
        content: "分享一下我的控糖经历，希望能帮助到刚确诊的糖友们。首先是饮食调整，我把主食换成了糙米和燕麦...",
        tag: "tips",
        tagName: "控糖心得",
        author: "控糖达人",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        views: 2856,
        likes: 328,
        comments: 89
    },
    {
        id: 2,
        title: "低GI食谱分享：一周不重样的糖友早餐",
        content: "很多糖友问我早餐吃什么，今天整理了7天的早餐食谱，都是我亲测血糖友好的搭配...",
        tag: "recipe",
        tagName: "食谱推荐",
        author: "营养师小王",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        views: 1923,
        likes: 256,
        comments: 67
    },
    {
        id: 3,
        title: "餐后散步真的有用！我的30天实验数据",
        content: "坚持餐后散步30天，记录了每天的餐后血糖变化，数据证明真的有效果...",
        tag: "exercise",
        tagName: "运动打卡",
        author: "爱运动的老张",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
        views: 1567,
        likes: 198,
        comments: 45
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initCheckinCard();
    initHotTopicsCarousel();
    initTagsFilter();
    initSearch();
    fetchAndDisplayTopics();
});

// ========================================
// 每日打卡功能（后端API版本）
// ========================================
async function initCheckinCard() {
    // 设置日期
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`;
    
    // 从后端获取打卡状态
    await fetchCheckinStatus();
    
    // 渲染本周打卡日历
    renderWeekCalendar();
    
    // 加载当月打卡记录
    loadCalendarData(calendarYear, calendarMonth);
}

// 获取打卡状态
async function fetchCheckinStatus() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_BASE_URL}/checkin/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.status) {
            checkinData = data.data;
            updateCheckinUI();
        }
    } catch (error) {
        console.error('获取打卡状态失败:', error);
    }
}

// 更新打卡UI
function updateCheckinUI() {
    if (!checkinData) return;
    
    // 更新连续打卡天数（大数字）
    document.getElementById('streak-days').textContent = checkinData.current_streak;
    
    // 更新预计奖励
    document.getElementById('expected-reward').textContent = `+${checkinData.expected_reward}`;
    
    // 更新统计数据
    document.getElementById('total-days').textContent = checkinData.total_days;
    document.getElementById('total-reward').textContent = checkinData.total_reward || 0;
    document.getElementById('checkin-count').textContent = checkinData.today_count;
    
    // 更新里程碑进度
    updateMilestones(checkinData.current_streak);
    
    // 更新按钮状态
    if (checkinData.today_checked) {
        setCheckinDone();
    }
}

// 更新里程碑进度
function updateMilestones(streak) {
    // 7天里程碑
    const progress7 = Math.min(streak / 7 * 100, 100);
    document.getElementById('milestone-bar-7').style.width = `${progress7}%`;
    if (streak >= 7) {
        document.getElementById('milestone-7').classList.add('achieved');
    }
    
    // 30天里程碑
    const progress30 = Math.min(streak / 30 * 100, 100);
    document.getElementById('milestone-bar-30').style.width = `${progress30}%`;
    if (streak >= 30) {
        document.getElementById('milestone-30').classList.add('achieved');
    }
}

// 执行打卡
async function doCheckin() {
    if (checkinData && checkinData.today_checked) {
        return;
    }
    
    const btn = document.getElementById('checkin-btn');
    btn.disabled = true;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/checkin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.status) {
            // 更新本地数据
            checkinData.today_checked = true;
            checkinData.current_streak = data.data.streak_days;
            checkinData.total_days = data.data.total_days;
            
            // 显示成功弹窗
            document.getElementById('modal-streak-days').textContent = data.data.streak_days;
            document.getElementById('modal-reward').textContent = data.data.reward;
            
            // 显示额外奖励提示
            const bonusEl = document.getElementById('modal-bonus');
            if (data.data.is_streak_7) {
                bonusEl.textContent = '🎁 连续7天额外奖励！';
                bonusEl.style.display = 'block';
            } else if (data.data.is_streak_30) {
                bonusEl.textContent = '🏆 连续30天超级奖励！';
                bonusEl.style.display = 'block';
            } else {
                bonusEl.style.display = 'none';
            }
            
            document.getElementById('checkin-modal').classList.add('show');
            
            // 更新UI
            setCheckinDone();
            updateCheckinUI();
            
            // 更新打卡人数
            const countEl = document.getElementById('checkin-count');
            if (countEl) {
                countEl.textContent = parseInt(countEl.textContent) + 1;
            }
            
            // 刷新本周日历
            renderWeekCalendar();
            loadCalendarData(calendarYear, calendarMonth);
            
        } else {
            showError(data.data || '打卡失败');
        }
    } catch (error) {
        console.error('打卡失败:', error);
        showError('打卡失败，请重试');
    } finally {
        btn.disabled = false;
    }
}

function setCheckinDone() {
    const btn = document.getElementById('checkin-btn');
    if (btn) {
        btn.classList.add('done');
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-done').style.display = 'inline';
    }
}

function closeCheckinModal() {
    document.getElementById('checkin-modal').classList.remove('show');
}

// ========================================
// 打卡日历功能
// ========================================
function renderWeekCalendar() {
    const container = document.getElementById('calendar-week');
    if (!container) return;
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6, 0是周日
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    let checkedCount = 0;
    let html = '';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === today.toDateString();
        const isChecked = checkinDates.includes(dateStr) || 
                         (isToday && checkinData && checkinData.today_checked);
        const isPast = date < today && !isToday;
        
        if (isChecked) checkedCount++;
        
        html += `
            <div class="week-day ${isToday ? 'today' : ''} ${isChecked ? 'checked' : ''} ${isPast && !isChecked ? 'missed' : ''}">
                <span class="week-day-name">${weekDays[i]}</span>
                <span class="week-day-date">${date.getDate()}</span>
            </div>
        `;
    }
    container.innerHTML = html;
    
    // 更新本周打卡数
    const weekCheckedEl = document.getElementById('week-checked');
    if (weekCheckedEl) {
        weekCheckedEl.textContent = checkedCount;
    }
}

// 切换日历弹窗
function toggleCalendar() {
    const modal = document.getElementById('calendar-modal');
    modal.classList.toggle('show');
    
    if (modal.classList.contains('show')) {
        renderFullCalendar();
    }
}

// 切换月份
function changeMonth(delta) {
    calendarMonth += delta;
    if (calendarMonth > 12) {
        calendarMonth = 1;
        calendarYear++;
    } else if (calendarMonth < 1) {
        calendarMonth = 12;
        calendarYear--;
    }
    loadCalendarData(calendarYear, calendarMonth);
}

// 加载日历数据
async function loadCalendarData(year, month) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/checkin/calendar/?year=${year}&month=${month}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.status) {
            checkinDates = data.data.checkin_dates;
            renderFullCalendar();
            renderWeekCalendar();
        }
    } catch (error) {
        console.error('获取日历数据失败:', error);
    }
}

// 渲染完整日历
function renderFullCalendar() {
    const container = document.getElementById('calendar-days');
    const titleEl = document.getElementById('calendar-title');
    
    if (!container) return;
    
    titleEl.textContent = `${calendarYear}年${calendarMonth}月`;
    
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
    const lastDay = new Date(calendarYear, calendarMonth, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // 更新日历统计
    const monthCheckedCount = checkinDates.length;
    document.getElementById('cal-month-days').textContent = monthCheckedCount;
    document.getElementById('cal-streak').textContent = checkinData ? checkinData.current_streak : 0;
    document.getElementById('cal-total-reward').textContent = checkinData ? (checkinData.total_reward || 0) : 0;
    
    let html = '';
    
    // 填充前面的空白
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // 填充日期
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const isChecked = checkinDates.includes(dateStr);
        const isFuture = new Date(dateStr) > today;
        
        // 判断是否是奖励日（第7天、第30天等）
        const isBonus = day === 7 || day === 14 || day === 21 || day === 28 || day === 30;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isChecked ? 'checked' : ''} ${isFuture ? 'future' : ''} ${isBonus && !isChecked && !isFuture ? 'bonus' : ''}">
                <span class="day-num">${day}</span>
                ${isChecked ? '<span class="day-check">✓</span>' : ''}
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// ========================================
// 热门话题轮播
// ========================================
function initHotTopicsCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !dotsContainer) return;

    // 生成轮播卡片
    let cardsHtml = '';
    hotTopicsData.forEach((topic, index) => {
        const rankClass = index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : '');
        cardsHtml += `
            <div class="hot-topic-card" onclick="location.href='topic.html?id=${topic.id}'">
                <div class="hot-topic-header">
                    <div class="hot-rank ${rankClass}">${index + 1}</div>
                    <div class="hot-topic-title">${topic.title}</div>
                    <span class="hot-topic-tag">${topic.tagName}</span>
                </div>
                <div class="hot-topic-content">${topic.content}</div>
                <div class="hot-topic-footer">
                    <div class="hot-topic-author">
                        <img src="${topic.avatar}" alt="">
                        <span>${topic.author}</span>
                    </div>
                    <div class="hot-topic-stats">
                        <span>👁 ${topic.views}</span>
                        <span>❤️ ${topic.likes}</span>
                        <span>💬 ${topic.comments}</span>
                    </div>
                </div>
            </div>
        `;
    });
    track.innerHTML = cardsHtml;

    // 生成指示点
    let dotsHtml = '';
    hotTopicsData.forEach((_, index) => {
        dotsHtml += `<div class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`;
    });
    dotsContainer.innerHTML = dotsHtml;

    // 点击指示点切换
    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
        });
    });

    // 自动轮播
    startCarouselAutoPlay();

    // 触摸滑动支持
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopCarouselAutoPlay();
    });

    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startCarouselAutoPlay();
    });
}

function goToSlide(index) {
    currentCarouselIndex = index;
    const track = document.getElementById('carousel-track');
    const cards = track.querySelectorAll('.hot-topic-card');
    const cardWidth = cards[0].offsetWidth + 12; // 包含 gap
    
    track.style.transform = `translateX(-${index * cardWidth}px)`;

    // 更新指示点
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    const total = hotTopicsData.length;
    goToSlide((currentCarouselIndex + 1) % total);
}

function prevSlide() {
    const total = hotTopicsData.length;
    goToSlide((currentCarouselIndex - 1 + total) % total);
}

function startCarouselAutoPlay() {
    stopCarouselAutoPlay();
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// ========================================
// 话题标签筛选
// ========================================
function initTagsFilter() {
    const tagBtns = document.querySelectorAll('.tag-btn');
    
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tagBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTag = btn.dataset.tag;
            filterTopics();
        });
    });
}

function filterTopics() {
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = '';

    let filtered = allTopics;
    if (currentTag !== 'all') {
        // 前端模拟标签筛选（实际应该由后端返回带标签的数据）
        filtered = allTopics.filter((_, index) => {
            // 模拟：根据索引分配标签
            const tags = ['diet', 'exercise', 'tips', 'question', 'mood', 'recipe'];
            const topicTag = tags[index % tags.length];
            return topicTag === currentTag;
        });
    }

    filtered.forEach((topic, index) => {
        appendTopicToContainer(postsContainer, topic, index);
    });

    if (filtered.length === 0) {
        postsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#86868B;">暂无相关话题</div>';
    }
}

// ========================================
// 搜索功能
// ========================================
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

async function performSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const searchQuery = searchInput.value.trim();

    if (!searchQuery) {
        fetchAndDisplayTopics();
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/app/topic/?search=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = '';

        const topics = Array.isArray(data) ? data : (data.results || []);
        topics.forEach((topic, index) => {
            appendTopicToContainer(postsContainer, topic, index);
        });

        if (topics.length === 0) {
            postsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#86868B;">未找到相关话题</div>';
        }

    } catch (error) {
        console.error('Error searching topics:', error);
    }
}

// ========================================
// 获取并显示话题
// ========================================
async function fetchAndDisplayTopics() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/app/topic/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.innerHTML = '';

        allTopics = Array.isArray(data) ? data : (data.results || []);
        
        allTopics.forEach((topic, index) => {
            appendTopicToContainer(postsContainer, topic, index);
        });

    } catch (error) {
        console.error('Error fetching topics:', error);
    }
}

// 将话题数据添加到容器中
function appendTopicToContainer(postsContainer, topic, index = 0) {
    const postItem = document.createElement('div');
    postItem.className = 'post-item';
    postItem.style.animationDelay = `${index * 0.05}s`;

    const user = topic.user || {};
    
    // 模拟标签
    const tags = [
        { key: 'diet', name: '🥗 饮食分享' },
        { key: 'exercise', name: '🏃 运动打卡' },
        { key: 'tips', name: '💡 控糖心得' },
        { key: 'question', name: '❓ 求助问答' },
        { key: 'mood', name: '💭 心情日记' },
        { key: 'recipe', name: '🍳 食谱推荐' }
    ];
    const tag = tags[index % tags.length];

    postItem.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + index}" alt="用户头像" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">${user.username || '匿名用户'}</span>
                    <span class="post-time">${formatTime(topic.create_date)}</span>
                </div>
            </div>
            <span class="post-tag ${tag.key}">${tag.name}</span>
        </div>
        <div class="post-title">${topic.title}</div>
        <div class="post-content">${truncateText(topic.content, 80)}</div>
        <div class="post-stats">
            <span class="stat-item">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                ${topic.page_view || 0}
            </span>
            <span class="stat-item">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                ${topic.lover || 0}
            </span>
            <span class="stat-item">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                ${topic.comment_count || 0}
            </span>
        </div>
    `;

    postItem.addEventListener('click', () => {
        location.href = `topic.html?id=${topic.id}`;
    });

    postsContainer.appendChild(postItem);
}

// 加载更多
function loadMorePosts() {
    // 前端模拟加载更多
    const btn = document.querySelector('.load-more-btn');
    btn.textContent = '加载中...';
    
    setTimeout(() => {
        btn.textContent = '没有更多了';
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }, 1000);
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minuteDiff = Math.floor(diff / 60000);
    const hourDiff = Math.floor(diff / 3600000);
    const dayDiff = Math.floor(diff / 86400000);

    if (dayDiff > 0) {
        return `${dayDiff}天前`;
    } else if (hourDiff > 0) {
        return `${hourDiff}小时前`;
    } else if (minuteDiff > 0) {
        return `${minuteDiff}分钟前`;
    } else {
        return '刚刚';
    }
}

// 截断文本
function truncateText(text, length) {
    if (text && text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text || '';
}

// ========================================
// 功能模块弹窗
// ========================================

// 模拟数据
const emotionMessages = [
    { tag: '焦虑', content: '刚确诊的时候真的很害怕，不知道以后的生活会变成什么样...', time: '2小时前', hugs: 23, replies: 8 },
    { tag: '迷茫', content: '血糖总是控制不好，感觉自己很失败，不知道该怎么办了', time: '5小时前', hugs: 45, replies: 12 },
    { tag: '感恩', content: '感谢这个社区，让我知道自己不是一个人在战斗', time: '1天前', hugs: 89, replies: 24 }
];

const heroList = [
    { rank: 1, name: '控糖达人小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero1', streak: 365, badge: '🏆' },
    { rank: 2, name: '健康生活家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero2', streak: 280, badge: '🥈' },
    { rank: 3, name: '运动爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero3', streak: 210, badge: '🥉' },
    { rank: 4, name: '饮食管理师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero4', streak: 180, badge: '⭐' },
    { rank: 5, name: '坚持就是胜利', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero5', streak: 150, badge: '⭐' }
];

const rumorList = [
    { status: 'fake', title: '糖尿病人不能吃水果？', content: '这是谣言！糖尿病人可以适量吃低GI水果，如苹果、柚子、草莓等。关键是控制总量和选择时机。', expert: '李医生', expertTitle: '内分泌科主任医师' },
    { status: 'partial', title: '苦瓜能降血糖？', content: '部分正确。苦瓜中的苦瓜素有一定的降糖作用，但效果有限，不能替代药物治疗。', expert: '王营养师', expertTitle: '注册营养师' },
    { status: 'true', title: '餐后散步有助于控糖？', content: '正确！餐后15-30分钟进行轻度运动，可以有效降低餐后血糖峰值。', expert: '张医生', expertTitle: '糖尿病专科医生' }
];

const redFoods = [
    { emoji: '🍰', name: '奶油蛋糕', gi: 'GI: 85', rating: 1 },
    { emoji: '🍟', name: '炸薯条', gi: 'GI: 75', rating: 1 },
    { emoji: '🥤', name: '含糖饮料', gi: 'GI: 90+', rating: 1 },
    { emoji: '🍩', name: '甜甜圈', gi: 'GI: 76', rating: 1 }
];

const greenFoods = [
    { emoji: '🥦', name: '西兰花', gi: 'GI: 15', rating: 5 },
    { emoji: '🥬', name: '菠菜', gi: 'GI: 15', rating: 5 },
    { emoji: '🍄', name: '蘑菇', gi: 'GI: 10', rating: 5 },
    { emoji: '🥜', name: '坚果', gi: 'GI: 20', rating: 5 }
];

const groupsData = {
    type1: { icon: '💉', name: '1型糖友会', desc: '1型糖尿病患者互助交流，分享胰岛素使用经验', members: 1200, posts: 3500 },
    type2: { icon: '💊', name: '2型互助组', desc: '2型糖尿病患者交流控糖心得，分享用药经验', members: 3800, posts: 12000 },
    pregnancy: { icon: '🤰', name: '妊娠糖妈妈', desc: '妊娠期糖尿病准妈妈互助，分享孕期控糖经验', members: 856, posts: 2100 },
    'exercise-group': { icon: '🏃', name: '运动打卡组', desc: '每日运动打卡，互相监督，一起动起来', members: 2100, posts: 8500 },
    weight: { icon: '⚖️', name: '减重控糖营', desc: '减重与控糖双管齐下，分享减重成功经验', members: 1500, posts: 4200 },
    region: { icon: '📍', name: '北京糖友会', desc: '北京地区糖友交流，分享本地就医、购药信息', members: 689, posts: 1800 },
    senior: { icon: '👴', name: '银发控糖组', desc: '中老年糖友互助，分享适合老年人的控糖方法', members: 1300, posts: 3200 },
    groups: { icon: '👥', name: '全部小组', desc: '浏览所有互助小组，找到适合你的社群', members: 0, posts: 0 }
};

// 显示功能弹窗
function showFeatureModal(type) {
    const modal = document.getElementById('feature-modal');
    const body = document.getElementById('feature-modal-body');
    
    let content = '';
    
    switch(type) {
        case 'emotion':
            content = renderEmotionContent();
            break;
        case 'hero':
            content = renderHeroContent();
            break;
        case 'rumor':
            content = renderRumorContent();
            break;
        case 'food':
            content = renderFoodContent();
            break;
        default:
            // 小组详情
            if (groupsData[type]) {
                content = renderGroupContent(type);
            }
            break;
    }
    
    body.innerHTML = content;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 初始化食物红黑榜切换
    if (type === 'food') {
        initFoodTabs();
    }
}

// 关闭功能弹窗
function closeFeatureModal() {
    const modal = document.getElementById('feature-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 渲染情感树洞内容
function renderEmotionContent() {
    const messagesHtml = emotionMessages.map(msg => `
        <div class="emotion-message">
            <div class="emotion-message-header">
                <span class="emotion-message-tag">${msg.tag}</span>
                <span class="emotion-message-time">${msg.time}</span>
            </div>
            <div class="emotion-message-content">${msg.content}</div>
            <div class="emotion-message-actions">
                <button class="emotion-action-btn">🤗 抱抱 ${msg.hugs}</button>
                <button class="emotion-action-btn">💬 回复 ${msg.replies}</button>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="modal-header-icon">💭</div>
        <h2 class="modal-title">情感树洞</h2>
        <p class="modal-subtitle">匿名倾诉，温暖陪伴，你不是一个人</p>
        
        <div class="emotion-input-area">
            <textarea placeholder="说出你的心里话，这里没有人会评判你..."></textarea>
        </div>
        
        <div class="emotion-options">
            <button class="emotion-tag active">😔 焦虑</button>
            <button class="emotion-tag">😢 难过</button>
            <button class="emotion-tag">😤 沮丧</button>
            <button class="emotion-tag">🤔 迷茫</button>
            <button class="emotion-tag">😊 感恩</button>
        </div>
        
        <button class="emotion-submit" onclick="submitEmotion()">匿名发布</button>
        
        <div class="emotion-messages">
            <h3 style="font-size:16px;margin-bottom:12px;color:var(--community-text);">最近的心声</h3>
            ${messagesHtml}
        </div>
    `;
}

// 渲染英雄榜内容
function renderHeroContent() {
    const heroHtml = heroList.map((hero, index) => {
        let rankClass = 'normal';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';
        
        return `
            <div class="hero-item">
                <div class="hero-rank ${rankClass}">${hero.rank}</div>
                <img class="hero-avatar" src="${hero.avatar}" alt="">
                <div class="hero-info">
                    <div class="hero-name">${hero.name}</div>
                    <div class="hero-stats">连续打卡 ${hero.streak} 天</div>
                </div>
                <div class="hero-badge">${hero.badge}</div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="modal-header-icon">🏆</div>
        <h2 class="modal-title">抗糖英雄榜</h2>
        <p class="modal-subtitle">坚持就是胜利，向控糖达人学习</p>
        
        <div class="hero-list">
            ${heroHtml}
        </div>
        
        <div style="text-align:center;margin-top:20px;padding:16px;background:var(--community-hover);border-radius:14px;">
            <p style="font-size:14px;color:var(--community-text-secondary);margin:0;">
                💪 坚持打卡，下一个上榜的就是你！
            </p>
        </div>
    `;
}

// 渲染辟谣站内容
function renderRumorContent() {
    const rumorHtml = rumorList.map(rumor => {
        let statusText = '谣言';
        if (rumor.status === 'true') statusText = '正确';
        else if (rumor.status === 'partial') statusText = '部分正确';
        
        return `
            <div class="rumor-item">
                <div class="rumor-header">
                    <span class="rumor-status ${rumor.status}">${statusText}</span>
                    <div class="rumor-title">${rumor.title}</div>
                </div>
                <div class="rumor-content">${rumor.content}</div>
                <div class="rumor-expert">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${rumor.expert}" alt="">
                    <div class="rumor-expert-info">
                        <div class="rumor-expert-name">${rumor.expert}</div>
                        <div class="rumor-expert-title">${rumor.expertTitle}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="modal-header-icon">🔬</div>
        <h2 class="modal-title">专家辟谣站</h2>
        <p class="modal-subtitle">科学破除谣言，专家在线解答</p>
        
        <div class="rumor-list">
            ${rumorHtml}
        </div>
    `;
}

// 渲染红黑榜内容
function renderFoodContent() {
    return `
        <div class="modal-header-icon">🍽️</div>
        <h2 class="modal-title">红黑榜图鉴</h2>
        <p class="modal-subtitle">糖友饮食实测，科学选择食物</p>
        
        <div class="food-tabs">
            <button class="food-tab active red" data-type="red" onclick="switchFoodTab('red')">🚫 红榜（慎吃）</button>
            <button class="food-tab green" data-type="green" onclick="switchFoodTab('green')">✅ 绿榜（推荐）</button>
        </div>
        
        <div class="food-list" id="food-list">
            ${renderFoodList(redFoods, 'red')}
        </div>
    `;
}

// 渲染食物列表
function renderFoodList(foods, type) {
    return foods.map(food => {
        const stars = type === 'red' 
            ? '⚠️'.repeat(food.rating) 
            : '⭐'.repeat(food.rating);
        
        return `
            <div class="food-item">
                <div class="food-emoji">${food.emoji}</div>
                <div class="food-name">${food.name}</div>
                <div class="food-gi">${food.gi}</div>
                <div class="food-rating">${stars}</div>
            </div>
        `;
    }).join('');
}

// 切换食物红黑榜
function switchFoodTab(type) {
    const tabs = document.querySelectorAll('.food-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.type === type) {
            tab.classList.add('active');
        }
    });
    
    const foodList = document.getElementById('food-list');
    if (type === 'red') {
        foodList.innerHTML = renderFoodList(redFoods, 'red');
    } else {
        foodList.innerHTML = renderFoodList(greenFoods, 'green');
    }
}

// 初始化食物标签切换
function initFoodTabs() {
    // 已通过onclick处理
}

// 渲染小组详情内容
function renderGroupContent(type) {
    const group = groupsData[type];
    if (!group) return '';
    
    return `
        <div class="group-detail-header">
            <div class="group-detail-icon">${group.icon}</div>
            <h2 class="group-detail-name">${group.name}</h2>
            <p class="group-detail-desc">${group.desc}</p>
            <div class="group-detail-stats">
                <div class="group-stat">
                    <span class="group-stat-num">${group.members}</span>
                    <span class="group-stat-label">成员</span>
                </div>
                <div class="group-stat">
                    <span class="group-stat-num">${group.posts}</span>
                    <span class="group-stat-label">帖子</span>
                </div>
            </div>
        </div>
        
        <button class="group-join-btn" onclick="joinGroup('${type}')">加入小组</button>
        
        <div class="group-recent-posts">
            <h3 class="group-recent-title">最新动态</h3>
            <div style="text-align:center;padding:40px 20px;color:var(--community-text-secondary);">
                <p>加入小组后可查看更多内容</p>
            </div>
        </div>
    `;
}

// 提交情感树洞
function submitEmotion() {
    const textarea = document.querySelector('.emotion-input-area textarea');
    const content = textarea.value.trim();
    
    if (!content) {
        alert('请输入内容');
        return;
    }
    
    // 模拟提交
    alert('发布成功！感谢你的分享，愿你被温柔以待 💕');
    textarea.value = '';
}

// 加入小组
function joinGroup(type) {
    const group = groupsData[type];
    if (group) {
        alert(`已申请加入「${group.name}」，请等待审核`);
    }
}

// 点击弹窗外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('feature-modal');
    if (e.target === modal) {
        closeFeatureModal();
    }
});

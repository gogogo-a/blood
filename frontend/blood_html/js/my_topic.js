document.addEventListener('DOMContentLoaded', () => {
    // 初始化加载用户发布的话题
    fetchMyTopics();

    // 为顶部导航按钮绑定点击事件
    const myTopicsButton = document.getElementById('my-topics');
    const likedTopicsButton = document.getElementById('liked-topics');

    if (myTopicsButton && likedTopicsButton) {
        myTopicsButton.addEventListener('click', () => {
            myTopicsButton.classList.add('active');
            likedTopicsButton.classList.remove('active');
            // 保存当前筛选类型到本地存储
            localStorage.setItem('filterType', 'my_topics');
            fetchMyTopics();
        });

        likedTopicsButton.addEventListener('click', () => {
            likedTopicsButton.classList.add('active');
            myTopicsButton.classList.remove('active');
            // 保存当前筛选类型到本地存储
            localStorage.setItem('filterType', 'liked_topics');
            fetchLikedTopics();
        });
    } else {
        console.error('导航按钮未找到');
    }

    // 为搜索按钮绑定点击事件
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // 为搜索输入框绑定回车键事件
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// 执行搜索功能
async function performSearch() {
    // 获取搜索输入框
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    const searchQuery = searchInput.value.trim();

    if (!searchQuery) {
        alert('请输入搜索内容');
        return;
    }

    try {
        // 从 localStorage 获取 token 和筛选类型
        const token = localStorage.getItem('token');
        const filterType = localStorage.getItem('filterType') || 'my_topics';
        const user_id = getUserID();

        // 构建请求 URL
        let url = `${API_BASE_URL}/app/topic/?search=${encodeURIComponent(searchQuery)}`;
        if (filterType === 'my_topics') {
            url += '&my_topic=1';
        } else if (filterType === 'liked_topics') {
            url += '&lover=1';
        }

        // 发送 GET 请求获取话题列表
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析 JSON 响应
        const data = await response.json();

        // 获取话题列表容器
        const postsContainer = document.querySelector('.posts-container');

        // 清空容器
        postsContainer.innerHTML = '';

        // 检查 data 是否是一个数组
        if (Array.isArray(data)) {
            // 如果是数组，直接遍历
            data.forEach(topic => {
                appendTopicToContainer(postsContainer, topic);
            });
        } else if (typeof data === 'object' && data !== null) {
            // 如果是对象，检查是否有 results 字段（分页情况）
            if (Array.isArray(data.results)) {
                data.results.forEach(topic => {
                    appendTopicToContainer(postsContainer, topic);
                });
            } else {
                // 如果是其他对象格式，尝试直接处理
                appendTopicToContainer(postsContainer, data);
            }
        } else {
            console.error('Unexpected data format:', data);
        }

    } catch (error) {
        console.error('Error fetching topics:', error);
        // 处理错误，例如显示错误消息给用户
        alert('搜索失败，请重试');
    }
}

// 获取并显示用户发布的话题
async function fetchMyTopics() {
    try {
        console.log('Fetching my topics...');
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');

        // 获取用户 ID
        const user_id = getUserID();

        // 发送 GET 请求获取话题列表
        const response = await fetch(`${API_BASE_URL}/app/topic/?my_topic=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析 JSON 响应
        const data = await response.json();

        // 获取话题列表容器
        const postsContainer = document.querySelector('.posts-container');

        // 清空容器
        postsContainer.innerHTML = '';

        // 检查 data 是否是一个数组
        if (Array.isArray(data)) {
            // 如果是数组，直接遍历
            data.forEach(topic => {
                appendTopicToContainer(postsContainer, topic);
            });
        } else if (typeof data === 'object' && data !== null) {
            // 如果是对象，检查是否有 results 字段（分页情况）
            if (Array.isArray(data.results)) {
                data.results.forEach(topic => {
                    appendTopicToContainer(postsContainer, topic);
                });
            } else {
                // 如果是其他对象格式，尝试直接处理
                appendTopicToContainer(postsContainer, data);
            }
        } else {
            console.error('Unexpected data format:', data);
        }

    } catch (error) {
        console.error('Error fetching my topics:', error);
        // 处理错误，例如显示错误消息给用户
    }
}

// 获取并显示用户喜欢的话题
async function fetchLikedTopics() {
    try {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');

        // 获取用户 ID
        const user_id = getUserID();

        // 发送 GET 请求获取话题列表
        const response = await fetch(`${API_BASE_URL}/app/topic/?lover=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析 JSON 响应
        const data = await response.json();

        // 获取话题列表容器
        const postsContainer = document.querySelector('.posts-container');

        // 清空容器
        postsContainer.innerHTML = '';

        // 检查 data 是否是一个数组
        if (Array.isArray(data)) {
            // 如果是数组，直接遍历
            data.forEach(topic => {
                appendTopicToContainer(postsContainer, topic);
            });
        } else if (typeof data === 'object' && data !== null) {
            // 如果是对象，检查是否有 results 字段（分页情况）
            if (Array.isArray(data.results)) {
                data.results.forEach(topic => {
                    appendTopicToContainer(postsContainer, topic);
                });
            } else {
                // 如果是其他对象格式，尝试直接处理
                appendTopicToContainer(postsContainer, data);
            }
        } else {
            console.error('Unexpected data format:', data);
        }

    } catch (error) {
        console.error('Error fetching liked topics:', error);
        // 处理错误，例如显示错误消息给用户
    }
}

// 获取用户 ID
function getUserID() {
    return localStorage.getItem('user_id');
}

// 将话题数据添加到容器中
function appendTopicToContainer(postsContainer, topic) {
    const postItem = document.createElement('div');
    postItem.className = 'post-item';

    // 获取用户信息
    const user = topic.user || {};

    // 生成话题 HTML
    postItem.innerHTML = `
        <div class="post-header">
        <a href="topic.html?id=${topic.id}" class="post-header-link">
            <div class="post-author">
                <img src="${user.image || 'https://via.placeholder.com/40'}" alt="用户头像" class="author-avatar">
                <span class="author-name">${user.username || '匿名用户'}</span>
            </div>
            <div class="post-time">${formatTime(topic.create_date)}</div>
        </div>
        <div class="post-title">${topic.title}</div>
        <div class="post-content">${truncateText(topic.content, 50)}</div>
        <div class="post-stats">
            <span class="post-views">
                <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="#86868B">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                ${topic.page_view || 0}
            </span>
            <span class="post-likes">
                <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="#86868B">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                ${topic.lover || 0}
            </span>
            <span class="post-comments">
                <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="#86868B">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6l-2 2V4h14v10z"/>
                </svg>
                ${topic.comment_count || 0}
            </span>
        </div>
    `;

    // 将生成的话题项添加到容器中
    postsContainer.appendChild(postItem);
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 计算时间差
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
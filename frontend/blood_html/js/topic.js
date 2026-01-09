document.addEventListener('DOMContentLoaded', () => {
    // 获取 URL 中的 topicId 参数
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('id');

    if (!topicId) {
        showError('未找到话题ID');
        return;
    }

    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (!token) {
        showError('未登录，请先登录');
        return;
    }

    // 显示加载状态
    showLoading();

    // 获取话题详情
    fetchTopicDetails(topicId, token);
});

// 获取话题详情
async function fetchTopicDetails(topicId, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/topic/${topicId}/view/`, {
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

        // 填充话题详情
        fillTopicDetails(data);

        // 获取评论列表
        fetchComments(topicId, token);

        // 隐藏加载状态
        hideLoading();

        // 显示话题内容
        showTopicContent();

    } catch (error) {
        console.error('Error fetching topic details:', error);
        showError('加载话题失败，请刷新页面重试');
    }
}

// 填充话题详情
function fillTopicDetails(topic) {
    // 填充作者信息
    document.getElementById('author-avatar').src = topic.user.image || 'https://via.placeholder.com/40';
    document.getElementById('author-name').textContent = topic.user.username || '匿名用户';
    document.getElementById('create-date').textContent = formatTime(topic.create_date);
    console.log(topic);
    // 填充话题数据
    document.getElementById('topic-title').textContent = topic.title;
    document.getElementById('topic-content-body').innerHTML = topic.content;
    document.getElementById('page-view').textContent = topic.page_view || 0;
    document.getElementById('comment-count').textContent = topic.comment_count || 0;

    // 填充话题点赞按钮状态
    const topicLikeButton = document.getElementById('topic-like-button');
    const topicLikeCount = document.getElementById('topic-like-count');
    topicLikeCount.textContent = topic.lover || 0;

    if (topic.user_liked) {
        topicLikeButton.querySelector('.icon').setAttribute('fill', 'red');
    } else {
        topicLikeButton.querySelector('.icon').setAttribute('fill', 'gray');
    }
}

// 获取评论列表
async function fetchComments(topicId, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/app/topic/${topicId}/comments/`, {
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

        // 检查 data 是否是一个数组
        if (Array.isArray(data)) {
            // 如果是数组，直接遍历
            fillComments(data);
        } else if (typeof data === 'object' && data !== null) {
            // 如果是对象，检查是否有 results 字段（分页情况）
            if (Array.isArray(data.results)) {
                fillComments(data.results);
            } else {
                // 如果是其他对象格式，尝试直接处理
                fillComments([data]);
            }
        } else {
            console.error('Unexpected data format:', data);
        }

        // 显示评论区域
        showCommentsSection();

    } catch (error) {
        console.error('Error fetching comments:', error);
        showError('加载评论失败，请刷新页面重试');
    }
}

// 填充评论列表
function fillComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        const user = comment.user || {};
        const likeFill = comment.user_liked ? 'red' : 'gray';
        commentItem.innerHTML = `
            <div class="comment-header">
                <img src="${user.image || 'https://via.placeholder.com/40'}" alt="用户头像" class="comment-avatar">
                <div class="comment-author-info">
                    <div class="comment-author">${user.username || '匿名用户'}</div>
                    <div class="comment-time">${formatTime(comment.create_date)}</div>
                </div>
                <div class="comment-content">${comment.content}</div>
                <button class="comment-like-button" data-comment-id="${comment.id}">
                    <svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="${likeFill}">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span class="comment-like-count">${comment.lover || 0}</span>
                </button>
            </div>
        `;

        commentsList.appendChild(commentItem);

        // 为评论点赞按钮绑定点击事件
        const commentLikeButton = commentItem.querySelector('.comment-like-button');
        commentLikeButton.addEventListener('click', async () => {
            const commentId = comment.id
            console.log(commentId)
            const token = localStorage.getItem('token');
            const topicId = new URLSearchParams(window.location.search).get('id');

            try {
                const params = new URLSearchParams();
                params.append('comment_id', commentId);
                const response = await fetch(`${API_BASE_URL}/app/LoverView/?${params}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const likeCount = data.lover || 0;
                const likeButton = commentLikeButton.querySelector('.icon');
                likeButton.setAttribute('fill', data.user_liked ? 'red' : 'gray');
                commentLikeButton.querySelector('.comment-like-count').textContent = likeCount;

            } catch (error) {
                console.error('Error liking comment:', error);
                alert('点赞失败，请重试');
            }
        });
    });
}

// 提交评论
document.getElementById('submit-comment').addEventListener('click', async () => {
    const topicId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    const commentInput = document.getElementById('comment-input');
    const content = commentInput.value.trim();

    if (!content) {
        alert('评论内容不能为空');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/app/topic/${topicId}/comments/submit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: content })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        commentInput.value = '';
        fetchComments(topicId, token);
        const currentCommentCount = parseInt(document.getElementById('comment-count').textContent) || 0;
        document.getElementById('comment-count').textContent = currentCommentCount + 1;
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('发表评论失败，请重试');
    }
});

// 话题点赞功能
document.getElementById('topic-like-button').addEventListener('click', async () => {
    const topicId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');

    try {
        const params = new URLSearchParams();
        params.append('topic_id', topicId);
        const response = await fetch(`${API_BASE_URL}/app/LoverView/?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const topicLikeCount = document.getElementById('topic-like-count');
        topicLikeCount.textContent = data.lover || 0;

        const likeButton = document.getElementById('topic-like-button').querySelector('.icon');
        likeButton.setAttribute('fill', data.user_liked ? 'red' : 'gray');

    } catch (error) {
        console.error('Error liking topic:', error);
        alert('点赞失败，请重试');
    }
});

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

// 显示加载状态
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('topic-content').style.display = 'none';
    document.getElementById('comments-section').style.display = 'none';
}

// 隐藏加载状态
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 显示错误信息
function showError(message) {
    document.getElementById('error').style.display = 'block';
    document.getElementById('error').textContent = message;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('topic-content').style.display = 'none';
    document.getElementById('comments-section').style.display = 'none';
}

// 显示话题内容
function showTopicContent() {
    document.getElementById('topic-content').style.display = 'block';
}

// 显示评论区域
function showCommentsSection() {
    document.getElementById('comments-section').style.display = 'block';
}
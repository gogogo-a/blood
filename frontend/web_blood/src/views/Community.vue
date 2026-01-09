<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import host from "../settings.js"
const API_BASE_URL = host.host
const store = useStore()
const token = store.state.token
const userData = store.state.userData

// 响应式数据
const chatUsers = ref([])
const comments = ref({})
const expandedUsers = ref({}) // 使用对象管理展开状态
const expandedComments = ref({})
const comment_love=ref("comment")
const chat_love=ref("chat")
// 获取聊天记录
const fetchChatRecords = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/ChatRecordsView`, {
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.status === 'success') {
      chatUsers.value = Object.entries(response.data.chat_records).map(([username, records]) => ({
        username,
        authorId: records[0]?.author_id,
        uImg: records[0]?.img,
        records,
        visibleRecords: records.slice(0, 2),
        collapsedRecords: records.slice(2)
      }))

      // 初始化展开状态
      chatUsers.value.forEach(user => {
        expandedUsers.value[user.authorId] = false
      })

      // 并行获取评论
      await Promise.all(chatUsers.value.map(async user => {
        await fetchComments(user.authorId)
      }))
    }
  } catch (error) {
    console.error('获取聊天记录失败:', error)
    alert('数据加载失败，请稍后重试')
  }
}

// 获取评论
const fetchComments = async (beuserId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}consultation/ChatRecordDetailView`, {
      params: { be_user_id: beuserId, user_id: userData.id },
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.status === 'success') {
      comments.value[beuserId] = {
        visible: response.data.chat_record.slice(0, 2),
        collapsed: response.data.chat_record.slice(2)
      }

      // 初始化评论展开状态
      expandedComments.value[beuserId] = false
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    alert('评论加载失败')
  }
}

// 提交评论
const submitComment = async (authorId) => {
  try {
    if (!token) {
      alert('请先登录后再评论')
      return
    }

    const commentInput = document.querySelector(`#comment-${authorId}`)
    const content = commentInput?.value.trim()
    if (!content) return alert('评论内容不能为空')

    const response = await axios.post(
      `${API_BASE_URL}consultation/ChatRecordDetailView`,
      { content, be_author: authorId },
      {
        params: { user_id: userData.id },
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (response.data.status === 'success') {
      commentInput.value = ''
      await fetchComments(authorId)
      alert('评论成功')
    }
  } catch (error) {
    console.error('评论提交失败:', error)
    alert('评论失败，请检查网络连接')
  }
}

// 切换展开状态
const toggleRecords = (userId) => {
  expandedUsers.value[userId] = !expandedUsers.value[userId]
}

const toggleComments = (userId) => {
  expandedComments.value[userId] = !expandedComments.value[userId]
}

// 时间格式化
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// 点赞功能
const toggleLike = async (type, id) => {
  try {
    if (!token) {
      alert('请先登录后再点赞')
      return
    }

    const user_id = userData.id
    let endpoint = ''
    let params = { user_id }
    console.log(type)
    if (type === 'comment') {
      endpoint = `${API_BASE_URL}consultation/LoverView`
      params.comment_id = id
    } else if (type === 'chat') {
      endpoint = `${API_BASE_URL}consultation/LoverView`
      params.chat_id = id
    }

    const response = await axios.post(endpoint, {}, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.status === 'success') {
      // 更新本地状态
      if (type === 'comment') {
        // 更新评论的点赞状态
        const comment = findCommentById(id)
        if (comment) {
          comment.user_liked = !comment.user_liked
          comment.lover += comment.user_liked ? 1 : -1
        }
      } else if (type === 'chat') {
        // 更新聊天记录的点赞状态
        const chat = findChatById(id)
        if (chat) {
          chat.user_liked = !chat.user_liked
          chat.lover += chat.user_liked ? 1 : -1
        }
      }
    } else {
      alert(response.data.message || '操作失败')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    alert('点赞失败，请检查网络连接')
  }
}

// 查找评论
const findCommentById = (commentId) => {
  for (const authorId in comments.value) {
    const visibleComments = comments.value[authorId].visible
    const collapsedComments = comments.value[authorId].collapsed

    const visibleComment = visibleComments.find(c => c.id === commentId)
    if (visibleComment) return visibleComment

    const collapsedComment = collapsedComments.find(c => c.id === commentId)
    if (collapsedComment) return collapsedComment
  }
  return null
}

// 查找聊天记录
const findChatById = (chatId) => {
  for (const user of chatUsers.value) {
    const visibleChats = user.visibleRecords
    const collapsedChats = user.collapsedRecords

    const visibleChat = visibleChats.find(c => c.id === chatId)
    if (visibleChat) return visibleChat

    const collapsedChat = collapsedChats.find(c => c.id === chatId)
    if (collapsedChat) return collapsedChat
  }
  return null
}

onMounted(() => {
  fetchChatRecords(userData.id)
})
</script>

<template>
  <Header />
  <div class="container">
    <div class="chat-container">
      <!-- 用户聊天记录卡片 -->
      <div
        v-for="user in chatUsers"
        :key="user.authorId"
        class="user-card"
      >
        <!-- 用户头部 -->
        <div class="user-header">
          <img :src="user.uImg" class="user-avatar" />
          <h3>{{ user.username }} 的咨询记录</h3>
        </div>

        <!-- 聊天记录区域 -->
        <div class="chat-records">
          <!-- 可见记录 -->
          <div
            v-for="record in user.visibleRecords"
            :key="record.id"
            class="record"
          >
            <!-- 用户消息 -->
            <div v-if="record.message" class="message user-message">
              <div class="message-header">
                <img :src="user.uImg" class="avatar" />
                <div class="user-info">
                  <span class="username">{{ record.author }}</span>
                  <span class="time">{{ formatTime(record.timestamp) }}</span>
                </div>
              </div>
              <div class="message-content">{{ record.message }}</div>

              <!-- 点赞区域 -->
              <div class="like-section">
                <span class="like-count">{{ record.lover }}</span>
                <button
                  class="like-button"
                  @click="toggleLike(chat_love,record.id)"
                  :style="{ color: record.user_liked ? 'red' : 'gray' }"
                >
                  <i class="heart-icon" :class="{ 'liked': record.user_liked }">❤</i>
                </button>
              </div>
            </div>

            <!-- AI回复 -->
            <div v-if="record.ai_message" class="message ai-message">
              <div class="message-header">
                <img src="../assets/AI.webp" class="avatar" />
                <div class="user-info">
                  <span class="username">知糖小助手</span>
                  <span class="time">{{ formatTime(record.timestamp) }}</span>
                </div>
              </div>
              <div class="message-content">{{ record.ai_message }}</div>
            </div>
          </div>

          <!-- 折叠的记录 -->
          <div
            v-if="user.collapsedRecords.length > 0"
            v-show="expandedUsers[user.authorId]"
            class="collapsed-records"
          >
            <div
              v-for="record in user.collapsedRecords"
              :key="record.id"
              class="record"
            >
              <!-- 消息结构同上 -->
              <div v-if="record.message" class="message user-message">
              <div class="message-header">
                <img :src="user.uImg" class="avatar" />
                <div class="user-info">
                  <span class="username">{{ record.author }}</span>
                  <span class="time">{{ formatTime(record.timestamp) }}</span>
                </div>
              </div>
              <div class="message-content">{{ record.message }}</div>

              <!-- 点赞区域 -->
              <div class="like-section">
                <span class="like-count">{{ record.lover }}</span>
                <button
                  class="like-button"
                  @click="toggleLike(chat_love,record.id)"
                  :style="{ color: record.user_liked ? 'red' : 'gray' }"
                >
                  <i class="heart-icon" :class="{ 'liked': record.user_liked }">❤</i>
                </button>
              </div>
            </div>

              <div v-if="record.ai_message" class="message ai-message">
                <div class="message-header">
                  <img src="../assets/AI.webp" class="avatar" />
                  <div class="user-info">
                    <span class="username">知糖小助手</span>
                    <span class="time">{{ formatTime(record.timestamp) }}</span>
                  </div>
                </div>
                <div class="message-content">{{ record.ai_message }}</div>
              </div>
            </div>
          </div>

          <!-- 展开/收起按钮 -->
          <button
            v-if="user.collapsedRecords.length > 0"
            @click="toggleRecords(user.authorId)"
            class="toggle-btn"
          >
            {{ expandedUsers[user.authorId] ?
              '收起记录' :
              `展开更多记录（${user.collapsedRecords.length}条）` }}
          </button>
        </div>

        <!-- 评论区域 -->
        <div class="comment-section">
          <!-- 评论输入框 -->
          <div class="comment-input">
            <textarea
              :id="`comment-${user.authorId}`"
              placeholder="请输入您的评论..."
              rows="3"
            ></textarea>
            <button
              @click="submitComment(user.authorId)"
              class="submit-btn"
            >
              发表评论
            </button>
          </div>

         <!-- 评论列表 -->
          <div class="comments-list">
      <!-- 可见评论 -->
      <div
        v-for="comment in comments[user.authorId]?.visible"
        :key="comment.id"
        class="comment"
      >
        <div class="comment-header">
          <img :src="comment.img" class="comment-avatar" />
          <div class="comment-info">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
          </div>
        </div>
        <div class="comment-content">{{ comment.content }}</div>

        <!-- 点赞区域 -->
        <div class="like-section">
          <span class="like-count">{{ comment.lover }}</span>
          <button
            class="like-button"
            @click="toggleLike(comment_love,comment.id)"
            :style="{ color: comment.user_liked ? 'red' : 'gray' }"
          >
            <i class="heart-icon" :class="{ 'liked': comment.user_liked }">❤</i>
          </button>
        </div>
      </div>

      <!-- 折叠的评论 -->
      <div
        v-if="comments[user.authorId]?.collapsed.length > 0"
        v-show="expandedComments[user.authorId]"
        class="collapsed-comments"
      >
        <div
          v-for="comment in comments[user.authorId].collapsed"
          :key="comment.id"
          class="comment"
        >
          <div class="comment-header">
            <img :src="comment.img" class="comment-avatar" />
            <div class="comment-info">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
            </div>
          </div>
          <div class="comment-content">{{ comment.content }}</div>

          <!-- 点赞区域 -->
          <div class="like-section">
            <span class="like-count">{{ comment.lover }}</span>
            <button
              class="like-button"
              @click="toggleLike(comment_love,comment.id)"
              :style="{ color: comment.user_liked ? 'red' : 'gray' }"
            >
              <i class="heart-icon" :class="{ 'liked': comment.user_liked }">❤</i>
            </button>
      </div>
    </div>
  </div>

  <!-- 展开评论按钮 -->
  <button
    v-if="comments[user.authorId]?.collapsed.length > 0"
    @click="toggleComments(user.authorId)"
    class="toggle-btn"
  >
    {{ expandedComments[user.authorId] ?
      '收起评论' :
      `展开更多评论（${comments[user.authorId].collapsed.length}条）` }}
  </button>
</div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.chat-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
  border: 2px solid #e0e0e0;
}

.chat-records {
  margin: 20px 0;
  border-left: 3px solid #f0f0f0;
  padding-left: 20px;
}

.message {
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
  max-width: 85%;
  position: relative;
}

.message::after {
  content: '';
  position: absolute;
  top: 20px;
  width: 12px;
  height: 12px;
  border-style: solid;
}

.user-message {
  background: #e3f2fd;
  margin-left: auto;
}

.user-message::after {
  right: -12px;
  border-width: 6px 0 6px 12px;
  border-color: transparent transparent transparent #e3f2fd;
}

.ai-message {
  background: #f0f4f8;
  margin-right: auto;
}

.ai-message::after {
  left: -12px;
  border-width: 6px 12px 6px 0;
  border-color: transparent #f0f4f8 transparent transparent;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95em;
}

.time {
  font-size: 0.85em;
  color: #7f8c8d;
}

.message-content {
  color: #34495e;
  line-height: 1.6;
  font-size: 0.95em;
}

.comment-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.comment-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.comment-input textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  font-size: 14px;
}

.submit-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  align-self: flex-start;
}

.submit-btn:hover {
  background: #096dd9;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

.comments-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.comment {
  background: white;
  border-radius: 6px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 500;
  font-size: 0.9em;
  color: #2c3e50;
}

.comment-time {
  font-size: 0.8em;
  color: #7f8c8d;
}

.comment-content {
  color: #34495e;
  font-size: 0.9em;
  line-height: 1.5;
}

.toggle-btn {
  width: 100%;
  background: none;
  border: none;
  color: #1890ff;
  padding: 12px;
  margin: 16px 0;
  cursor: pointer;
  transition: color 0.2s;
  font-weight: 500;
}

.toggle-btn:hover {
  color: #096dd9;
  background: rgba(24, 144, 255, 0.05);
  border-radius: 6px;
}

.collapsed-records,
.collapsed-comments {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.like-section {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.like-count {
  margin-right: 8px;
  font-size: 14px;
  color: #666;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
}

.heart-icon {
  transition: transform 0.2s;
}

.heart-icon.liked {
  transform: scale(1.2);
}
.like-section {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.like-count {
  margin-right: 8px;
  font-size: 14px;
  color: #666;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
}

.heart-icon {
  transition: transform 0.2s;
}

.heart-icon.liked {
  transform: scale(1.2);
}
</style>
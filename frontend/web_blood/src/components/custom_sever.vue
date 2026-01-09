<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import host from "../settings.js";
const API_BASE_URL = host.host;

// 生成或获取会话ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('chat_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('chat_session_id', sessionId)
  }
  return sessionId
}

const sessionId = ref(getSessionId())

// 组件状态
const isExpanded = ref(false)
const isLoading = ref(false)
const messages = ref([])
const userInput = ref('')
const componentPos = ref({ x: 0, y: 0 })
const dragState = ref({
  isDragging: false,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0
})
const dragEndTime = ref(-99999999)
let clickCooldownTimer = null

// 初始化位置和欢迎消息
onMounted(() => {
  componentPos.value = {
    x: window.innerWidth - 320,
    y: window.innerHeight / 2 - 30
  }

  // 检查是否有历史消息
  const savedMessages = localStorage.getItem(`chat_messages_${sessionId.value}`)
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages).map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  } else {
    messages.value.push({
      text: '您好！我是智护血糖官网小助手，请问有什么可以帮您？',
      isUser: false,
      timestamp: new Date()
    })
    saveMessages()
  }
})

// 保存消息到本地存储
const saveMessages = () => {
  localStorage.setItem(
    `chat_messages_${sessionId.value}`,
    JSON.stringify(messages.value.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.getTime()
    })))
  )
}

// Markdown 解析
const renderMarkdown = (text) => {
  return marked(text || '')
}

// 智能边界检测
const checkBoundary = () => {
  const { x, y } = componentPos.value
  const width = isExpanded.value ? 300 : 60
  const height = isExpanded.value ? 500 : 60

  componentPos.value.x = Math.max(10, Math.min(
    x,
    window.innerWidth - width - 10
  ))
  componentPos.value.y = Math.max(10, Math.min(
    y,
    window.innerHeight - height - 10
  ))
}

// 拖动处理（新增防误触逻辑）
const startDrag = (e) => {
  dragState.value = {
    isDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    originX: componentPos.value.x,
    originY: componentPos.value.y
  }

  const onMouseMove = (e) => {
    if (!dragState.value.isDragging) return
    const dx = e.clientX - dragState.value.startX
    const dy = e.clientY - dragState.value.startY
    componentPos.value = {
      x: dragState.value.originX + dx,
      y: dragState.value.originY + dy
    }
    checkBoundary()
  }

  const onMouseUp = () => {
    dragState.value.isDragging = false
    dragEndTime.value = Date.now()

    clearTimeout(clickCooldownTimer)
    clickCooldownTimer = setTimeout(() => {
      dragEndTime.value = -99999999
    }, 500)

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 切换展开状态
const toggleChat = async () => {
  if (dragState.value.isDragging) return
  isExpanded.value = !isExpanded.value
  await nextTick()
  checkBoundary()
  if (isExpanded.value) scrollToBottom()
}

// 消息发送 - 修改后的版本
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // 1. 先添加用户消息
  messages.value.push({
    text: userInput.value,
    isUser: true,
    timestamp: new Date()
  })
  saveMessages()
   scrollToBottom()
  const query = userInput.value
  userInput.value = ''
  isLoading.value = true

  try {
    // 2. 发送请求并等待响应
    const response = await axios.get(
      `${API_BASE_URL}consultation/custome_sever/query/?query=${encodeURIComponent(query)}&session_id=${sessionId.value}`
    )

    // 3. 添加AI回复消息
    messages.value.push({
      text: response.data.final_answer || '我已收到您的消息，正在处理中...',
      isUser: false,
      timestamp: new Date()
    })
    saveMessages()
  } catch (error) {
    console.error('API请求失败:', error)
    messages.value.push({
      text: '抱歉，暂时无法处理您的请求，请稍后再试。',
      isUser: false,
      timestamp: new Date()
    })
    saveMessages()
  } finally {
    isLoading.value = false
    // 4. 所有消息添加完成后，滚动到底部
       scrollToBottom()
  }
}

// 滚动控制
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.chat-container')
    if (container) {
      container.scrollTop = container.scrollHeight + 100
    }
  })
}
</script>


<template>
  <div
    class="ai-chatbot"
    :class="{ expanded: isExpanded, dragging: dragState.isDragging }"
    :style="{
      transform: `translate(${componentPos.x}px, ${componentPos.y}px)`,
      transition: dragState.isDragging ? 'none' : 'all 0.3s ease'
    }"
  >
    <div
      class="chat-header"
      @mousedown="startDrag"
      @click="toggleChat"
    >
      <span>智护血糖官网小助手</span>
      <div class="toggle-icon">
        <svg v-if="!isExpanded" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 12l-7 7-7-7h14z"/>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 12H5m7 7l-7-7 7-7"/>
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="chat-content">
      <div class="chat-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{ 'user-message': message.isUser, 'ai-message': !message.isUser }"
        >
          <div
            class="message-text"
            v-html="message.isUser ? message.text : renderMarkdown(message.text)"
          ></div>
          <div class="message-time">
            {{ message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </div>
        </div>
        <div v-if="isLoading" class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="输入您的问题..."
          type="text"
        />
        <button @click="sendMessage" :disabled="isLoading">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ai-chatbot {
  position: fixed;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  background: #4a6bff;
  border-radius: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.3s ease;
  z-index: 9999;
  overflow: hidden;
}

.ai-chatbot.expanded {
  width: 300px;
  height: 500px;
  border-radius: 12px;
}

.chat-header {
  height: 60px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.1);
  cursor: grab;
  user-select: none;
}

.ai-chatbot:not(.expanded) .chat-header {
  justify-content: center;
  padding: 0;
}

.ai-chatbot:not(.expanded) span {
  display: none;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.expanded .toggle-icon {
  transform: rotate(180deg);
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  background: #fff;
}

.chat-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
  min-height: 0; /* 修复flex溢出问题 */
}

.message {
  margin: 12px 0;
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  animation: fadeIn 0.25s ease;
}

.user-message {
  background: #4a6bff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.ai-message {
  background: #f0f2f5;
  color: #1a1a1a;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message-text {
  line-height: 1.6;
  word-break: break-word;
}

.message-text :deep(pre) {
  background: rgba(0,0,0,0.05);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(code) {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.9em;
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(0,0,0,0.08);
}

.message-time {
  font-size: 11px;
  color: rgba(0,0,0,0.5);
  text-align: right;
  margin-top: 6px;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid rgba(0,0,0,0.1);
  background: #fff;
}

input {
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4a6bff;
  outline: none;
}

button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: #4a6bff;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #3a5bef;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-dots {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #4a6bff;
  border-radius: 50%;
  animation: bounce 1.4s infinite both;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* 优化滚动条 */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}
</style>
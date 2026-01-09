document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const uploadModal = document.getElementById('upload-modal');
    const uploadTrigger = document.getElementById('upload-trigger');
    const imageInput = document.getElementById('image-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const chatMessages = document.getElementById('chat-messages');
    const welcomeCard = document.getElementById('welcome-card');
    const textarea = document.querySelector('.chat-input textarea');
    
    // 状态变量
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    let currentFile = null;
    let currentPage = 1;
    let isLoading = false;
    let hasMorePages = true;
    let hasMessages = false;

    // ========================================
    // 智能推荐问题数据（根据时间段）
    // ========================================
    const smartSuggestions = {
        morning: [
            { icon: '🌅', text: '早餐吃什么对血糖影响小？' },
            { icon: '💊', text: '空腹血糖偏高怎么办？' },
            { icon: '🥛', text: '早餐能喝牛奶吗？' }
        ],
        noon: [
            { icon: '🍱', text: '午餐怎么搭配更健康？' },
            { icon: '📊', text: '餐后血糖多少正常？' },
            { icon: '😴', text: '饭后犯困是血糖高吗？' }
        ],
        afternoon: [
            { icon: '🍎', text: '下午加餐吃什么好？' },
            { icon: '🏃', text: '适合做什么运动？' },
            { icon: '🍵', text: '喝茶对血糖有影响吗？' }
        ],
        evening: [
            { icon: '🥗', text: '晚餐怎么吃不升糖？' },
            { icon: '🌙', text: '睡前血糖多少安全？' },
            { icon: '💤', text: '夜间低血糖怎么预防？' }
        ]
    };

    // ========================================
    // 初始化输入框上方的快捷问题
    // ========================================
    function initQuickSuggestBar() {
        const suggestScroll = document.getElementById('quick-suggest-scroll');
        if (!suggestScroll) return;

        const hour = new Date().getHours();
        let timeKey = 'morning';
        
        if (hour >= 6 && hour < 11) {
            timeKey = 'morning';
        } else if (hour >= 11 && hour < 14) {
            timeKey = 'noon';
        } else if (hour >= 14 && hour < 18) {
            timeKey = 'afternoon';
        } else {
            timeKey = 'evening';
        }

        // 合并当前时段和通用问题
        const currentSuggestions = smartSuggestions[timeKey];
        const commonQuestions = [
            { icon: '📷', text: '拍照识别食物' },
            { icon: '📊', text: '查看血糖报告' }
        ];
        
        const allSuggestions = [...currentSuggestions, ...commonQuestions];
        
        suggestScroll.innerHTML = allSuggestions.map(item => {
            if (item.text === '拍照识别食物') {
                return `<div class="quick-suggest-chip" onclick="document.getElementById('upload-trigger').click()">
                    <span class="chip-icon">${item.icon}</span>
                    <span class="chip-text">${item.text}</span>
                </div>`;
            } else if (item.text === '查看血糖报告') {
                return `<div class="quick-suggest-chip" onclick="window.location.href='report.html'">
                    <span class="chip-icon">${item.icon}</span>
                    <span class="chip-text">${item.text}</span>
                </div>`;
            }
            return `<div class="quick-suggest-chip" onclick="sendQuickMessage('${item.text}')">
                <span class="chip-icon">${item.icon}</span>
                <span class="chip-text">${item.text}</span>
            </div>`;
        }).join('');
    }

    // 初始化
    initQuickSuggestBar();

    // 配置 marked 选项
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    // Markdown 渲染函数
    function renderMarkdown(text) {
        if (typeof marked !== 'undefined' && text) {
            try {
                return marked.parse(text);
            } catch (e) {
                console.error('Markdown 解析错误:', e);
                return text.replace(/\n/g, '<br>');
            }
        }
        return text.replace(/\n/g, '<br>');
    }

    // 隐藏欢迎卡片
    function hideWelcomeCard() {
        if (welcomeCard && !hasMessages) {
            welcomeCard.style.display = 'none';
            hasMessages = true;
        }
    }

    // ========================================
    // 追问建议数据
    // ========================================
    const followUpSuggestions = {
        diet: ['还有其他推荐吗？', '热量大概多少？', '怎么烹饪更健康？'],
        sugar: ['如何改善？', '需要就医吗？', '多久复查一次？'],
        medicine: ['有副作用吗？', '能和其他药一起吃吗？', '漏服怎么办？'],
        general: ['能详细说说吗？', '有什么注意事项？', '谢谢，我明白了']
    };

    // 根据消息内容生成追问建议
    function getFollowUpQuestions(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('食') || lowerText.includes('吃') || lowerText.includes('餐')) {
            return followUpSuggestions.diet;
        } else if (lowerText.includes('血糖') || lowerText.includes('糖化')) {
            return followUpSuggestions.sugar;
        } else if (lowerText.includes('药') || lowerText.includes('胰岛素')) {
            return followUpSuggestions.medicine;
        }
        return followUpSuggestions.general;
    }

    // 消息添加函数
    function addMessage(text, type, prepend = false, showActions = false) {
        hideWelcomeCard();
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const avatarHtml = type === 'received' ? 
            `<img src="image/ai.jpg" class="chat-avatar" alt="助手头像">` : 
            '';
        
        const contentHtml = type === 'received' 
            ? `<div class="markdown-body">${renderMarkdown(text)}</div>`
            : `<p>${text}</p>`;

        // AI 消息的操作按钮
        const actionsHtml = (type === 'received' && showActions) ? `
            <div class="message-actions">
                <button class="action-btn-small copy-btn" onclick="copyMessage(this)">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    复制
                </button>
                <button class="action-btn-small like-btn" onclick="likeMessage(this)">
                    <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                    有用
                </button>
            </div>
        ` : '';

        // 追问建议
        const followUpHtml = (type === 'received' && showActions && !prepend) ? `
            <div class="follow-up-questions">
                ${getFollowUpQuestions(text).map(q => 
                    `<button class="follow-up-btn" onclick="sendQuickMessage('${q}')">${q}</button>`
                ).join('')}
            </div>
        ` : '';
            
        messageDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-content">
                ${contentHtml}
                ${actionsHtml}
                ${followUpHtml}
            </div>
        `;

        if (prepend) {
            chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
        } else {
            chatMessages.appendChild(messageDiv);
        }

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 图片消息处理函数
    function addImageMessage(imageUrl, type, prepend = false) {
        hideWelcomeCard();
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        messageDiv.innerHTML = `
            <div class="image-message">
                <img src="${imageUrl}" 
                     alt="用户上传图片" 
                     onerror="this.style.display='none'">
            </div>
        `;

        if (prepend) {
            chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
        } else {
            chatMessages.appendChild(messageDiv);
        }

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 加载聊天历史
   // 加载聊天历史
async function loadChatHistory() {
    if (isLoading || !hasMorePages) return;

    isLoading = true;
    const prevScrollHeight = chatMessages.scrollHeight;

    try {
        const response = await axios.get(
            `${API_BASE_URL}/app/recommend/all_chat/?page=${currentPage}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.status) {
            const chatData = response.data.data.all_chat;

            // 反向遍历，确保旧消息在上方
            for (let i = chatData.length - 1; i >= 0; i--) {
                const chat = chatData[i];
                if (chat.ai_message) {
                    addMessage(chat.ai_message, 'received', true);
                }
                if (chat.image) {
                    addImageMessage(chat.image, 'sent', true);
                } else if (chat.message) {
                    addMessage(chat.message, 'sent', true);
                }

               
            }

            // 更新分页状态
            hasMorePages = !!response.data.data.links.next;
            currentPage++;
            
            // 保持滚动位置
            const newScrollHeight = chatMessages.scrollHeight;
            chatMessages.scrollTop = newScrollHeight - prevScrollHeight;
        }
    } catch (error) {
        console.error('加载失败:', error);
        showError('加载历史记录失败');
    } finally {
        isLoading = false;
    }
}

// 滚动加载
chatMessages.addEventListener('scroll', () => {
    if (isLoading || !hasMorePages) return;

    // 滚动到顶部时加载更多
    if (chatMessages.scrollTop < 100) {
        loadChatHistory();
    }
});

// 初始加载（加载最新消息）
loadChatHistory();
    // 发送消息
    sendBtn.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'sent');
            chatInput.value = '';
            textarea.style.height = 'auto';
            
            // 创建 AI 回复的消息容器
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.classList.add('message', 'received');
            aiMessageDiv.innerHTML = `
                <img src="image/ai.jpg" class="chat-avatar" alt="助手头像">
                <div class="message-content">
                    <div class="markdown-body"></div>
                </div>
            `;
            chatMessages.appendChild(aiMessageDiv);
            setTimeout(() => aiMessageDiv.classList.add('show'), 10);
            
            const aiContentElement = aiMessageDiv.querySelector('.markdown-body');
            let fullResponse = '';
            
            try {
                // 使用 fetch 进行流式请求
                const response = await fetch(`${API_BASE_URL}/app/recommend/chat/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: message })
                });
                
                // 检查响应状态
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.data || '请求失败');
                }
                
                // 检查 content-type 判断是否为流式响应
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/event-stream')) {
                    // 流式处理
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        
                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');
                        
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                try {
                                    const data = JSON.parse(line.slice(6));
                                    if (data.content) {
                                        fullResponse += data.content;
                                        // 流式输出时先显示纯文本，避免频繁渲染
                                        aiContentElement.textContent = fullResponse;
                                        chatMessages.scrollTop = chatMessages.scrollHeight;
                                    } else if (data.done) {
                                        // 流结束后渲染 Markdown 并添加操作按钮
                                        renderFinalResponse(aiMessageDiv, fullResponse);
                                    } else if (data.error) {
                                        aiContentElement.textContent = `错误：${data.error}`;
                                    }
                                } catch (e) {
                                    // 忽略解析错误
                                }
                            }
                        }
                    }
                    // 确保最终渲染（以防没收到 done 信号）
                    if (fullResponse && aiContentElement.textContent === fullResponse) {
                        renderFinalResponse(aiMessageDiv, fullResponse);
                    }
                } else {
                    // 非流式响应（错误情况）
                    const data = await response.json();
                    if (data.status) {
                        renderFinalResponse(aiMessageDiv, data.data.ai_message);
                    } else {
                        aiContentElement.textContent = `请求失败：${data.data}`;
                        showError("请求失败：" + data.data);
                    }
                }
            } catch (error) {
                console.error('发送失败:', error);
                aiContentElement.textContent = `错误：${error.message || '服务器连接失败'}`;
                showError("请求失败：" + error.message);
            }
        }
    });

    // 渲染最终回复（带操作按钮和追问建议）
    function renderFinalResponse(messageDiv, text) {
        const contentDiv = messageDiv.querySelector('.message-content');
        const followUps = getFollowUpQuestions(text);
        
        contentDiv.innerHTML = `
            <div class="markdown-body">${renderMarkdown(text)}</div>
            <div class="message-actions">
                <button class="action-btn-small copy-btn" onclick="copyMessage(this)">
                    <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    复制
                </button>
                <button class="action-btn-small like-btn" onclick="likeMessage(this)">
                    <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                    有用
                </button>
            </div>
            <div class="follow-up-questions">
                ${followUps.map(q => `<button class="follow-up-btn" onclick="sendQuickMessage('${q}')">${q}</button>`).join('')}
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 图片上传
    uploadTrigger.addEventListener('click', () => {
        uploadModal.style.display = 'flex';
        setTimeout(() => {
            uploadModal.classList.add('show');
        }, 10);
    });

    // 拖拽上传
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                currentFile = file;
                previewImage(file);
                analyzeBtn.disabled = false;
            }
        });
    }

    imageInput.addEventListener('change', (e) => {
        currentFile = e.target.files[0];
        previewImage(currentFile);
        analyzeBtn.disabled = false;
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;
        
        if (!confirm("需要消耗3点点数")) return;
        
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `
            <div class="spinner"></div>
            分析中...
        `;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const base64Image = e.target.result.split(',')[1];
                const fileName = currentFile.name;

                addImageMessage(`data:image/png;base64,${base64Image}`, 'sent');

                const response = await axios.post(
                    `${API_BASE_URL}/app/recommend/image_calorie/`,
                    {
                        image: base64Image,
                        file_name: fileName,
                        mime_type: currentFile.type
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.status) {
                    addMessage(`分析结果：${response.data.data.content}`, 'received');
                } else {
                    addMessage(`分析失败：${response.data.data}`, 'received');
                }
            } catch (error) {
                addMessage(`分析错误：${error.response?.data?.data || '服务器连接失败'}`, 'received');
            } finally {
                imageInput.value = '';
                currentFile = null;
                document.getElementById('image-preview').innerHTML = '';
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = '开始分析';
                uploadModal.classList.remove('show');
                setTimeout(() => {
                    uploadModal.style.display = 'none';
                }, 300);
            }
        };

        reader.onerror = (error) => {
            addMessage('图片读取失败', 'received');
            console.error('FileReader error:', error);
        };

        reader.readAsDataURL(currentFile);
    });

    // 图片预览
    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('image-preview').innerHTML = `
                <img src="${e.target.result}" 
                     alt="预览" 
                     class="preview-image"
                     style="max-width: 300px; max-height: 300px;">
            `;
        };
        reader.readAsDataURL(file);
    }

    // 文本框自动高度调整
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // 回车发送，Shift+回车换行
    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
});

// 通用提示函数
function showSuccess(message) {
    console.log(message);
}

function showError(message) {
    console.error(message);
}

// 快捷消息
function sendQuickMessage(message) {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    if (chatInput && sendBtn) {
        chatInput.value = message;
        sendBtn.click();
    }
}

// 复制消息
function copyMessage(btn) {
    const messageContent = btn.closest('.message-content');
    const markdownBody = messageContent.querySelector('.markdown-body');
    if (markdownBody) {
        const text = markdownBody.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                已复制
            `;
            btn.style.color = '#34C759';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.color = '';
            }, 2000);
        });
    }
}

// 点赞消息
function likeMessage(btn) {
    btn.classList.toggle('liked');
    if (btn.classList.contains('liked')) {
        btn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
            已点赞
        `;
    } else {
        btn.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
            有用
        `;
    }
}

// 关闭上传弹窗
function closeUploadModal() {
    const modal = document.getElementById('upload-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 菜单切换
function toggleMenu() {
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
        menuOverlay.classList.toggle('show');
    }
}

// 清空对话
function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    const welcomeCard = document.getElementById('welcome-card');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    if (welcomeCard) {
        welcomeCard.style.display = 'block';
    }
    toggleMenu();
}

// 导出对话
function exportChat() {
    alert('导出功能开发中');
    toggleMenu();
}
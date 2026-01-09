// ========================================
// 健康知识闯关系统（后端API版本）
// ========================================

let levels = [];
let currentLevel = null;
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let userAnswers = {};
let answered = false;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
    loadLevels();
});

// 加载糖豆余额
async function loadBalance() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/app/user/profile/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('current-balance').textContent = data.user_data.balance || 0;
        }
    } catch (error) {
        console.log('获取糖豆余额失败');
    }
}

// 加载关卡列表
async function loadLevels() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/quiz/levels/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.status) {
                levels = result.data;
                renderLevels();
                return;
            }
        }
    } catch (error) {
        console.log('获取关卡失败，使用本地数据');
    }
    
    // 后端失败时使用本地备用数据
    levels = getLocalLevels();
    renderLevels();
}

// 本地备用关卡数据
function getLocalLevels() {
    return [
        { id: 1, level_num: 1, name: '血糖基础', difficulty: 1, difficulty_text: '简单', reward: 5, pass_score: 60, question_count: 5, is_unlocked: true, is_passed: false, best_score: 0 },
        { id: 2, level_num: 2, name: '饮食管理', difficulty: 1, difficulty_text: '简单', reward: 5, pass_score: 60, question_count: 5, is_unlocked: false, is_passed: false, best_score: 0 },
        { id: 3, level_num: 3, name: '运动健康', difficulty: 2, difficulty_text: '中等', reward: 10, pass_score: 70, question_count: 5, is_unlocked: false, is_passed: false, best_score: 0 },
        { id: 4, level_num: 4, name: '用药知识', difficulty: 2, difficulty_text: '中等', reward: 10, pass_score: 70, question_count: 5, is_unlocked: false, is_passed: false, best_score: 0 },
        { id: 5, level_num: 5, name: '并发症预防', difficulty: 3, difficulty_text: '困难', reward: 20, pass_score: 80, question_count: 5, is_unlocked: false, is_passed: false, best_score: 0 },
    ];
}

// 渲染关卡列表
function renderLevels() {
    const grid = document.getElementById('level-grid');
    const passedCount = levels.filter(l => l.is_passed).length;
    
    document.getElementById('passed-count').textContent = passedCount;
    document.getElementById('total-levels').textContent = levels.length;
    
    const levelIcons = ['📚', '🥗', '🏃', '💊', '🛡️', '🎯', '🧠', '💪'];
    
    grid.innerHTML = levels.map((level, index) => `
        <div class="level-card ${level.is_unlocked ? '' : 'locked'} ${level.is_passed ? 'passed' : ''}" 
             onclick="${level.is_unlocked ? `startLevel(${level.id})` : ''}">
            ${level.is_passed ? `
                <div class="level-check">
                    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
            ` : ''}
            ${!level.is_unlocked ? `
                <div class="level-lock">
                    <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </div>
            ` : ''}
            <div class="level-icon">${levelIcons[index] || '📖'}</div>
            <div class="level-number">第 ${level.level_num} 关</div>
            <div class="level-name">${level.name}</div>
            <div class="level-desc">${level.question_count}道题 · ${level.difficulty_text}难度</div>
            <div class="level-footer">
                <div class="level-reward">
                    <span class="sugar-bean-icon">🍬</span>
                    <span>${level.reward}</span>
                </div>
                <div class="level-status ${level.is_passed ? 'passed' : (level.is_unlocked ? 'available' : 'locked')}">
                    ${level.is_passed ? `✓ ${level.best_score}分` : (level.is_unlocked ? '开始挑战' : '未解锁')}
                </div>
            </div>
        </div>
    `).join('');
}

// 开始关卡
async function startLevel(levelId) {
    currentLevel = levels.find(l => l.id === levelId);
    if (!currentLevel) return;
    
    // 获取题目
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/quiz/questions/${levelId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.status) {
                questions = result.data.questions;
            }
        }
    } catch (error) {
        console.log('获取题目失败，使用本地数据');
        questions = getLocalQuestions(currentLevel.level_num);
    }
    
    if (questions.length === 0) {
        questions = getLocalQuestions(currentLevel.level_num);
    }
    
    // 初始化答题状态
    currentQuestionIndex = 0;
    correctCount = 0;
    userAnswers = {};
    answered = false;
    
    // 切换界面
    document.getElementById('level-select').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('completion-card').style.display = 'none';
    
    // 更新关卡信息
    document.getElementById('level-badge').textContent = `第${currentLevel.level_num}关`;
    document.getElementById('level-name').textContent = currentLevel.name;
    document.getElementById('level-reward').textContent = currentLevel.reward;
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('pass-score').textContent = currentLevel.pass_score;
    
    loadQuestion();
}

// 本地备用题目
function getLocalQuestions(levelNum) {
    const localQuestions = {
        1: [
            { id: 1, question: "正常人空腹血糖的正常范围是多少？", options: ["2.8-4.4 mmol/L", "3.9-6.1 mmol/L", "6.1-7.8 mmol/L", "7.8-11.1 mmol/L"], category: "基础知识" },
            { id: 2, question: "餐后2小时血糖正常值应低于多少？", options: ["6.1 mmol/L", "7.8 mmol/L", "11.1 mmol/L", "13.9 mmol/L"], category: "基础知识" },
            { id: 3, question: "糖化血红蛋白反映多长时间的平均血糖？", options: ["1周", "1个月", "2-3个月", "6个月"], category: "检查指标" },
            { id: 4, question: "以下哪个不是糖尿病的典型症状？", options: ["多饮", "多尿", "多食", "多汗"], category: "症状识别" },
            { id: 5, question: "2型糖尿病的主要危险因素是？", options: ["身材瘦弱", "肥胖超重", "年龄太小", "运动过多"], category: "基础知识" },
        ],
        2: [
            { id: 6, question: "以下哪种食物的GI值最低？", options: ["白米饭", "燕麦", "白面包", "土豆"], category: "饮食管理" },
            { id: 7, question: "糖尿病患者可以适量食用哪种水果？", options: ["荔枝", "西瓜", "柚子", "葡萄"], category: "饮食管理" },
            { id: 8, question: "糖尿病患者可以使用哪种甜味剂？", options: ["白砂糖", "红糖", "木糖醇", "蜂蜜"], category: "饮食管理" },
            { id: 9, question: "最适合糖尿病患者的烹饪方式是？", options: ["油炸", "红烧", "清蒸", "糖醋"], category: "饮食管理" },
            { id: 10, question: "糖尿病患者每天盐摄入应控制在？", options: ["10克", "6克", "3克", "不限制"], category: "饮食管理" },
        ],
    };
    return localQuestions[levelNum] || localQuestions[1];
}

// 加载题目
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        submitQuiz();
        return;
    }

    const q = questions[currentQuestionIndex];
    answered = false;

    // 更新进度
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('progress-fill').style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
    document.getElementById('accuracy').textContent = currentQuestionIndex > 0 ? Math.round((correctCount / currentQuestionIndex) * 100) : 0;

    // 更新题目
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('category').textContent = q.category;

    // 生成选项
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option}</span>
        `;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    // 隐藏结果
    document.getElementById('result-feedback').classList.remove('show');
    document.getElementById('btn-next').style.display = 'none';

    // 动画
    document.getElementById('question-card').style.animation = 'none';
    setTimeout(() => {
        document.getElementById('question-card').style.animation = 'cardSlideIn 0.4s ease';
    }, 10);
}

// 选择选项
function selectOption(index) {
    const q = questions[currentQuestionIndex];
    userAnswers[q.id] = index;
    
    // 更新选中状态（允许重新选择）
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === index) {
            opt.classList.add('selected');
        }
    });

    // 显示下一题按钮
    document.getElementById('btn-next').style.display = 'flex';
}

// 下一题
document.getElementById('btn-next').addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// 提交答题结果
async function submitQuiz() {
    document.getElementById('quiz-area').style.display = 'none';
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/quiz/submit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                level_id: currentLevel.id,
                answers: userAnswers
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.status) {
                showCompletion(result.data);
                // 更新余额
                if (result.data.reward_earned > 0) {
                    loadBalance();
                }
                // 刷新关卡列表
                loadLevels();
                return;
            }
        }
    } catch (error) {
        console.log('提交失败');
    }
    
    // 本地计算结果
    const score = Math.round((correctCount / questions.length) * 100);
    showCompletion({
        score: score,
        correct_count: correctCount,
        total: questions.length,
        is_passed: score >= currentLevel.pass_score,
        pass_score: currentLevel.pass_score,
        reward_earned: 0,
        first_pass: false
    });
}

// 显示完成界面
function showCompletion(data) {
    const completionCard = document.getElementById('completion-card');
    completionCard.style.display = 'block';
    
    document.getElementById('final-correct').textContent = data.correct_count;
    document.getElementById('final-accuracy').textContent = data.score + '%';
    document.getElementById('final-earned').textContent = data.reward_earned;
    document.getElementById('progress-fill').style.width = '100%';
    
    if (data.is_passed) {
        document.getElementById('completion-icon').textContent = '🎉';
        document.getElementById('completion-title').textContent = '恭喜通关！';
        if (data.first_pass && data.reward_earned > 0) {
            document.getElementById('completion-message').textContent = `首次通关，获得 ${data.reward_earned} 糖豆奖励！`;
        } else if (data.is_passed && data.reward_earned === 0) {
            document.getElementById('completion-message').textContent = '已通关过此关卡，继续挑战下一关吧！';
        } else {
            document.getElementById('completion-message').textContent = '表现不错，继续加油！';
        }
        document.getElementById('btn-next-level').style.display = 'inline-flex';
    } else {
        document.getElementById('completion-icon').textContent = '😅';
        document.getElementById('completion-title').textContent = '未能通关';
        document.getElementById('completion-message').textContent = `需要达到 ${data.pass_score}% 才能通关，再试一次吧！`;
        document.getElementById('btn-next-level').style.display = 'none';
    }
}

// 返回关卡选择
function backToLevels() {
    document.getElementById('completion-card').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('level-select').style.display = 'block';
    loadLevels();
}

// 下一关
function nextLevel() {
    const nextLevelNum = currentLevel.level_num + 1;
    const next = levels.find(l => l.level_num === nextLevelNum);
    if (next && next.is_unlocked) {
        startLevel(next.id);
    } else {
        backToLevels();
    }
}

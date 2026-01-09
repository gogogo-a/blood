/**
 * 健康日历 - JavaScript
 */

// 状态变量
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

// 健康数据存储
let healthData = {
    bloodSugar: [],
    medication: [],
    exercise: []
};

// 餐次映射
const mealTypes = {
    1: '早餐',
    2: '午餐',
    3: '晚餐',
    4: '下午茶',
    5: '夜宵'
};

// 运动强度映射
const intensityTypes = {
    1: '轻度',
    2: '中度',
    3: '重度',
    4: '不明'
};

// 用药类型映射
const medicationTypes = {
    1: '注射',
    2: '口服',
    3: '其他'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    loadHealthData();
});

// 加载健康数据
async function loadHealthData() {
    const token = localStorage.getItem('token');
    
    try {
        // 并行加载所有数据
        const [sugarRes, medicationRes, exerciseRes] = await Promise.all([
            fetch(`${API_BASE_URL}/app/user_detail/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/app/medication/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`${API_BASE_URL}/app/exercise/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        const sugarData = await sugarRes.json();
        const medicationData = await medicationRes.json();
        const exerciseData = await exerciseRes.json();

        if (sugarData.status) {
            healthData.bloodSugar = sugarData.data || [];
        }
        if (medicationData.status) {
            healthData.medication = medicationData.data || [];
        }
        if (exerciseData.status) {
            healthData.exercise = exerciseData.data || [];
        }

        renderCalendar();
        updateStats();
    } catch (error) {
        console.error('加载数据失败:', error);
        // 使用模拟数据
        generateMockData();
        renderCalendar();
        updateStats();
    }
}

// 生成模拟数据（用于演示）
function generateMockData() {
    const today = new Date();
    const mockSugar = [];
    const mockMedication = [];
    const mockExercise = [];
    
    // 生成过去30天的模拟数据
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        
        // 随机生成血糖记录（70%概率有记录）
        if (Math.random() > 0.3) {
            const fasting = (4 + Math.random() * 6).toFixed(1);
            const postprandial = (5 + Math.random() * 8).toFixed(1);
            mockSugar.push({
                id: i + 1,
                meal_time: Math.floor(Math.random() * 3) + 1,
                fasting_glucose: parseFloat(fasting),
                postprandial_glucose: parseFloat(postprandial),
                carbohydrates: Math.floor(Math.random() * 100) + 20,
                created_at: dateStr + 'T08:00:00'
            });
        }
        
        // 随机生成用药记录（50%概率）
        if (Math.random() > 0.5) {
            mockMedication.push({
                id: i + 1,
                medication_type: Math.floor(Math.random() * 2) + 1,
                medication_name: ['二甲双胍', '格列美脲', '胰岛素'][Math.floor(Math.random() * 3)],
                dosage: [500, 1000, 250][Math.floor(Math.random() * 3)],
                medication_time: dateStr + 'T08:30:00'
            });
        }
        
        // 随机生成运动记录（40%概率）
        if (Math.random() > 0.6) {
            mockExercise.push({
                id: i + 1,
                exercise_program: ['散步', '慢跑', '游泳', '骑车', '瑜伽'][Math.floor(Math.random() * 5)],
                intensity: Math.floor(Math.random() * 3) + 1,
                duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
                exercise_time: dateStr + 'T18:00:00'
            });
        }
    }
    
    healthData.bloodSugar = mockSugar;
    healthData.medication = mockMedication;
    healthData.exercise = mockExercise;
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 渲染日历
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const yearEl = document.getElementById('current-year');
    const monthEl = document.getElementById('current-month');
    
    yearEl.textContent = currentYear;
    monthEl.textContent = `${currentMonth + 1}月`;
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // 获取上月天数
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    
    let html = '';
    const today = new Date();
    const todayStr = formatDate(today);
    
    // 上月日期
    for (let i = startWeekday - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        html += `<div class="calendar-day other-month empty">
            <span class="day-number">${day}</span>
        </div>`;
    }
    
    // 当月日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const dayData = getDayData(dateStr);
        
        let classes = ['calendar-day'];
        if (isToday) classes.push('today');
        if (dayData.hasRecord) classes.push('has-record');
        if (selectedDate === dateStr) classes.push('selected');
        
        // 状态指示器
        let statusHtml = '';
        if (dayData.status) {
            statusHtml = `<div class="day-status ${dayData.status}"></div>`;
        }
        
        // 活动图标
        let iconsHtml = '';
        if (dayData.hasMedication || dayData.hasExercise) {
            iconsHtml = '<div class="day-icons">';
            if (dayData.hasMedication) iconsHtml += '💊';
            if (dayData.hasExercise) iconsHtml += '🏃';
            iconsHtml += '</div>';
        }
        
        html += `<div class="${classes.join(' ')}" onclick="selectDate('${dateStr}')">
            <span class="day-number">${day}</span>
            ${statusHtml}
            ${iconsHtml}
        </div>`;
    }
    
    // 下月日期
    const totalCells = startWeekday + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        html += `<div class="calendar-day other-month empty">
            <span class="day-number">${i}</span>
        </div>`;
    }
    
    grid.innerHTML = html;
}

// 获取某天的数据
function getDayData(dateStr) {
    const result = {
        hasRecord: false,
        status: null,
        hasMedication: false,
        hasExercise: false,
        sugarRecords: [],
        medicationRecords: [],
        exerciseRecords: []
    };
    
    // 血糖记录
    const sugarRecords = healthData.bloodSugar.filter(r => {
        const recordDate = r.created_at ? r.created_at.split('T')[0] : '';
        return recordDate === dateStr;
    });
    
    if (sugarRecords.length > 0) {
        result.hasRecord = true;
        result.sugarRecords = sugarRecords;
        
        // 判断血糖状态
        let hasHigh = false;
        let hasLow = false;
        let hasNormal = false;
        
        sugarRecords.forEach(r => {
            const fasting = r.fasting_glucose;
            const postprandial = r.postprandial_glucose;
            
            // 空腹血糖判断：3.9-6.1 正常
            if (fasting < 3.9) hasLow = true;
            else if (fasting > 6.1) hasHigh = true;
            else hasNormal = true;
            
            // 餐后血糖判断：< 7.8 正常
            if (postprandial > 11.1) hasHigh = true;
            else if (postprandial > 7.8) hasHigh = true;
            else hasNormal = true;
        });
        
        if (hasHigh && hasNormal) result.status = 'mixed';
        else if (hasHigh) result.status = 'high';
        else if (hasLow) result.status = 'low';
        else result.status = 'normal';
    }
    
    // 用药记录
    const medicationRecords = healthData.medication.filter(r => {
        const recordDate = r.medication_time ? r.medication_time.split('T')[0] : '';
        return recordDate === dateStr;
    });
    
    if (medicationRecords.length > 0) {
        result.hasMedication = true;
        result.medicationRecords = medicationRecords;
    }
    
    // 运动记录
    const exerciseRecords = healthData.exercise.filter(r => {
        const recordDate = r.exercise_time ? r.exercise_time.split('T')[0] : '';
        return recordDate === dateStr;
    });
    
    if (exerciseRecords.length > 0) {
        result.hasExercise = true;
        result.exerciseRecords = exerciseRecords;
    }
    
    return result;
}

// 更新统计数据
function updateStats() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    let normalDays = 0;
    let highDays = 0;
    let lowDays = 0;
    let recordDays = 0;
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayData = getDayData(dateStr);
        
        if (dayData.hasRecord) {
            recordDays++;
            if (dayData.status === 'normal') normalDays++;
            else if (dayData.status === 'high' || dayData.status === 'mixed') highDays++;
            else if (dayData.status === 'low') lowDays++;
        }
    }
    
    document.getElementById('stat-normal').textContent = normalDays;
    document.getElementById('stat-high').textContent = highDays;
    document.getElementById('stat-low').textContent = lowDays;
    document.getElementById('stat-records').textContent = recordDays;
}

// 切换月份
function changeMonth(delta) {
    currentMonth += delta;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    renderCalendar();
    updateStats();
}

// 跳转到今天
function goToToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    selectedDate = formatDate(today);
    
    renderCalendar();
    updateStats();
    selectDate(selectedDate);
}

// 选择日期
function selectDate(dateStr) {
    selectedDate = dateStr;
    renderCalendar();
    showDayDetail(dateStr);
}

// 显示日期详情
function showDayDetail(dateStr) {
    const modal = document.getElementById('detail-modal');
    const dateEl = document.getElementById('detail-date');
    const bodyEl = document.getElementById('detail-body');
    
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    dateEl.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
    
    const dayData = getDayData(dateStr);
    
    if (!dayData.hasRecord && !dayData.hasMedication && !dayData.hasExercise) {
        bodyEl.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📅</div>
                <div class="no-data-text">这一天暂无健康记录</div>
            </div>
        `;
    } else {
        let html = '';
        
        // 血糖记录
        if (dayData.sugarRecords.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="section-title">
                        <span class="icon">🩸</span>
                        血糖记录
                    </div>
            `;
            
            dayData.sugarRecords.forEach(r => {
                const fastingClass = getSugarClass(r.fasting_glucose, 'fasting');
                const postClass = getSugarClass(r.postprandial_glucose, 'postprandial');
                
                html += `
                    <div class="sugar-record">
                        <div class="sugar-info">
                            <span class="sugar-meal">${mealTypes[r.meal_time] || '未知'}</span>
                            <span class="sugar-time">${formatTime(r.created_at)}</span>
                        </div>
                        <div class="sugar-values">
                            <div class="sugar-value">
                                <span class="label">餐前</span>
                                <span class="value ${fastingClass}">${r.fasting_glucose}</span>
                            </div>
                            <div class="sugar-value">
                                <span class="label">餐后</span>
                                <span class="value ${postClass}">${r.postprandial_glucose}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        // 用药记录
        if (dayData.medicationRecords.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="section-title">
                        <span class="icon">💊</span>
                        用药记录
                    </div>
            `;
            
            dayData.medicationRecords.forEach(r => {
                html += `
                    <div class="activity-record">
                        <div class="activity-icon medication">💊</div>
                        <div class="activity-info">
                            <div class="activity-name">${r.medication_name}</div>
                            <div class="activity-detail">${medicationTypes[r.medication_type] || ''} · ${r.dosage}mg · ${formatTime(r.medication_time)}</div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        // 运动记录
        if (dayData.exerciseRecords.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="section-title">
                        <span class="icon">🏃</span>
                        运动记录
                    </div>
            `;
            
            dayData.exerciseRecords.forEach(r => {
                html += `
                    <div class="activity-record">
                        <div class="activity-icon exercise">🏃</div>
                        <div class="activity-info">
                            <div class="activity-name">${r.exercise_program}</div>
                            <div class="activity-detail">${intensityTypes[r.intensity] || ''} · ${r.duration}分钟 · ${formatTime(r.exercise_time)}</div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        bodyEl.innerHTML = html;
    }
    
    modal.classList.add('show');
}

// 获取血糖状态类名
function getSugarClass(value, type) {
    if (type === 'fasting') {
        if (value < 3.9) return 'low';
        if (value > 6.1) return 'high';
        return 'normal';
    } else {
        if (value > 11.1) return 'high';
        if (value > 7.8) return 'high';
        return 'normal';
    }
}

// 格式化时间
function formatTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 关闭详情弹窗
function closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    modal.classList.remove('show');
}

// 点击弹窗外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('detail-modal');
    if (e.target === modal) {
        closeDetailModal();
    }
});

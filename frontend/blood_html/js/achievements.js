// 成就徽章系统

// 所有徽章定义
const allBadges = [
    {
        id: 'first_record',
        name: '初次记录',
        icon: '🎯',
        desc: '完成第一次血糖记录',
        requirement: 1,
        type: 'records'
    },
    {
        id: 'week_warrior',
        name: '周记录达人',
        icon: '📅',
        desc: '累计记录血糖7次',
        requirement: 7,
        type: 'records'
    },
    {
        id: 'month_master',
        name: '月度坚持者',
        icon: '🗓️',
        desc: '累计记录血糖30次',
        requirement: 30,
        type: 'records'
    },
    {
        id: 'stable_sugar',
        name: '血糖稳定',
        icon: '💪',
        desc: '连续5次血糖在正常范围',
        requirement: 5,
        type: 'stable'
    },
    {
        id: 'perfect_week',
        name: '完美一周',
        icon: '⭐',
        desc: '连续7次血糖达标',
        requirement: 7,
        type: 'stable'
    },
    {
        id: 'health_master',
        name: '健康达人',
        icon: '🏆',
        desc: '记录20次且平均血糖正常',
        requirement: 20,
        type: 'master'
    },
    {
        id: 'data_scientist',
        name: '数据科学家',
        icon: '📊',
        desc: '累计记录血糖50次',
        requirement: 50,
        type: 'records'
    },
    {
        id: 'legend',
        name: '控糖传奇',
        icon: '👑',
        desc: '累计记录100次且平均达标',
        requirement: 100,
        type: 'legend'
    }
];

// 进度目标
const progressGoals = [
    { id: 'records_10', name: '记录10次血糖', icon: '📝', target: 10, type: 'records' },
    { id: 'records_30', name: '记录30次血糖', icon: '📋', target: 30, type: 'records' },
    { id: 'stable_10', name: '10次血糖达标', icon: '✅', target: 10, type: 'stable_count' },
    { id: 'avg_normal', name: '平均血糖正常', icon: '💚', target: 1, type: 'avg_normal' }
];

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await fetchAndCalculateAchievements();
});

// 获取数据并计算成就
async function fetchAndCalculateAchievements() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('获取数据失败');
        }

        const data = await response.json();
        calculateAchievements(data);
    } catch (error) {
        console.error('获取成就数据失败:', error);
        // 尝试从localStorage读取缓存数据
        const cached = localStorage.getItem('achievementData');
        if (cached) {
            const cachedData = JSON.parse(cached);
            calculateAchievements(cachedData.bloodSugarData || []);
        }
    }
}

// 计算成就
function calculateAchievements(bloodSugarData) {
    const totalRecords = bloodSugarData.length;
    
    // 计算达标次数（血糖在4-7之间）
    const normalCount = bloodSugarData.filter(d => d.blood_suger >= 4 && d.blood_suger <= 7).length;
    
    // 计算平均血糖
    const avgSugar = totalRecords > 0 
        ? (bloodSugarData.reduce((sum, d) => sum + d.blood_suger, 0) / totalRecords).toFixed(1)
        : '--';
    
    // 计算连续达标次数
    let consecutiveNormal = 0;
    let maxConsecutive = 0;
    for (const d of bloodSugarData) {
        if (d.blood_suger >= 4 && d.blood_suger <= 7) {
            consecutiveNormal++;
            maxConsecutive = Math.max(maxConsecutive, consecutiveNormal);
        } else {
            consecutiveNormal = 0;
        }
    }

    // 判断徽章解锁状态
    const unlockedBadges = allBadges.map(badge => {
        let unlocked = false;
        switch (badge.type) {
            case 'records':
                unlocked = totalRecords >= badge.requirement;
                break;
            case 'stable':
                unlocked = maxConsecutive >= badge.requirement;
                break;
            case 'master':
                unlocked = totalRecords >= badge.requirement && avgSugar >= 4 && avgSugar <= 7;
                break;
            case 'legend':
                unlocked = totalRecords >= badge.requirement && avgSugar >= 4 && avgSugar <= 7;
                break;
        }
        return { ...badge, unlocked };
    });

    const unlockedCount = unlockedBadges.filter(b => b.unlocked).length;

    // 更新统计
    document.getElementById('total-records').textContent = totalRecords;
    document.getElementById('unlocked-badges').textContent = `${unlockedCount}/${allBadges.length}`;
    document.getElementById('avg-sugar').textContent = avgSugar !== '--' ? avgSugar : '--';

    // 渲染徽章
    renderBadges(unlockedBadges);

    // 渲染进度
    renderProgress(totalRecords, normalCount, avgSugar);
}

// 渲染徽章
function renderBadges(badges) {
    const grid = document.getElementById('badges-grid');
    grid.innerHTML = badges.map(badge => `
        <div class="badge-card ${badge.unlocked ? 'unlocked' : 'locked'}">
            <span class="badge-emoji">${badge.icon}</span>
            <h3 class="badge-title">${badge.name}</h3>
            <p class="badge-desc">${badge.desc}</p>
            <span class="badge-status">${badge.unlocked ? '已解锁 ✓' : '未解锁'}</span>
        </div>
    `).join('');
}

// 渲染进度
function renderProgress(totalRecords, normalCount, avgSugar) {
    const list = document.getElementById('progress-list');
    
    const progressItems = [
        {
            icon: '📝',
            title: '累计记录次数',
            current: totalRecords,
            target: 100,
            text: `${totalRecords} / 100 次`
        },
        {
            icon: '✅',
            title: '血糖达标次数',
            current: normalCount,
            target: Math.max(totalRecords, 50),
            text: `${normalCount} 次达标`
        },
        {
            icon: '📊',
            title: '平均血糖水平',
            current: avgSugar >= 4 && avgSugar <= 7 ? 100 : (avgSugar < 4 ? 50 : 70),
            target: 100,
            text: avgSugar !== '--' ? `${avgSugar} mmol/L ${avgSugar >= 4 && avgSugar <= 7 ? '(正常)' : '(需关注)'}` : '暂无数据'
        }
    ];

    list.innerHTML = progressItems.map(item => `
        <div class="progress-item">
            <div class="progress-icon">${item.icon}</div>
            <div class="progress-info">
                <h4 class="progress-title">${item.title}</h4>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" style="width: ${Math.min(100, (item.current / item.target) * 100)}%"></div>
                </div>
                <span class="progress-text">${item.text}</span>
            </div>
        </div>
    `).join('');
}

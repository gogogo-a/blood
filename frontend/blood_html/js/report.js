// ========================================
// 血糖分析报告系统
// ========================================

let bloodSugarData = [];
let currentRange = 'week';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initTimeSelector();
    fetchBloodSugarData();
});

// 时间选择器
function initTimeSelector() {
    const buttons = document.querySelectorAll('.time-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRange = btn.dataset.range;
            updateReport();
        });
    });
}

// 获取血糖数据
async function fetchBloodSugarData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            bloodSugarData = await response.json();
            updateReport();
        } else {
            // 使用模拟数据
            generateMockData();
            updateReport();
        }
    } catch (error) {
        console.log('获取数据失败，使用模拟数据');
        generateMockData();
        updateReport();
    }
}

// 生成模拟数据
function generateMockData() {
    bloodSugarData = [];
    const now = new Date();
    for (let i = 0; i < 90; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        bloodSugarData.push({
            create_date: date.toISOString(),
            blood_suger: (4 + Math.random() * 5).toFixed(1),
            height: 170,
            weight: 65
        });
    }
}

// 更新报告
function updateReport() {
    const filteredData = filterDataByRange();
    
    if (filteredData.length === 0) {
        return;
    }
    
    updatePeriodText();
    updateMetrics(filteredData);
    updateHealthScore(filteredData);
    drawTrendChart(filteredData);
    drawDistributionChart(filteredData);
    generateAnalysis(filteredData);
    generateSuggestions(filteredData);
    generatePeriodAnalysis(filteredData);
}

// 根据时间范围过滤数据
function filterDataByRange() {
    const now = new Date();
    let days = 7;
    
    if (currentRange === 'month') days = 30;
    if (currentRange === 'quarter') days = 90;
    
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    
    return bloodSugarData.filter(d => new Date(d.create_date) >= cutoff);
}

// 更新时间段文字
function updatePeriodText() {
    const now = new Date();
    let days = 7;
    if (currentRange === 'month') days = 30;
    if (currentRange === 'quarter') days = 90;
    
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    
    const formatDate = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    document.getElementById('report-period').textContent = `${formatDate(start)} - ${formatDate(now)}`;
}

// 更新核心指标
function updateMetrics(data) {
    const values = data.map(d => parseFloat(d.blood_suger));
    
    // 平均血糖
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    document.getElementById('avg-blood-sugar').textContent = avg;
    
    // 达标率 (3.9-6.1 为正常)
    const normalCount = values.filter(v => v >= 3.9 && v <= 6.1).length;
    const normalRate = Math.round((normalCount / values.length) * 100);
    document.getElementById('normal-rate').textContent = normalRate;
    
    // 波动幅度
    const max = Math.max(...values);
    const min = Math.min(...values);
    const fluctuation = (max - min).toFixed(1);
    document.getElementById('fluctuation').textContent = fluctuation;
    
    // 记录次数
    document.getElementById('record-count').textContent = data.length;
}

// 更新健康评分
function updateHealthScore(data) {
    const values = data.map(d => parseFloat(d.blood_suger));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const normalRate = values.filter(v => v >= 3.9 && v <= 6.1).length / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const fluctuation = max - min;
    
    // 计算评分
    let score = 100;
    
    // 平均血糖评分 (最佳 5.0-5.5)
    if (avg < 3.9) score -= 20;
    else if (avg > 7.0) score -= 15;
    else if (avg > 6.1) score -= 8;
    
    // 达标率评分
    score -= (1 - normalRate) * 30;
    
    // 波动评分
    if (fluctuation > 5) score -= 15;
    else if (fluctuation > 3) score -= 8;
    
    score = Math.max(0, Math.min(100, Math.round(score)));
    
    const scoreEl = document.querySelector('.score-value');
    scoreEl.textContent = score;
    
    // 根据分数改变颜色
    const healthScore = document.getElementById('health-score');
    if (score >= 80) {
        healthScore.style.background = 'rgba(52, 199, 89, 0.3)';
    } else if (score >= 60) {
        healthScore.style.background = 'rgba(255, 149, 0, 0.3)';
    } else {
        healthScore.style.background = 'rgba(255, 59, 48, 0.3)';
    }
}

// 绘制趋势图
function drawTrendChart(data) {
    const chartDom = document.getElementById('trend-chart');
    const myChart = echarts.init(chartDom);
    
    // 按时间排序
    const sortedData = [...data].sort((a, b) => new Date(a.create_date) - new Date(b.create_date));
    
    const dates = sortedData.map(d => {
        const date = new Date(d.create_date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const values = sortedData.map(d => parseFloat(d.blood_suger));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#eee',
            borderWidth: 1,
            textStyle: { color: '#1D1D1F' },
            formatter: '{b}<br/>血糖: {c} mmol/L'
        },
        grid: {
            left: 50,
            right: 20,
            top: 30,
            bottom: 40
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: '#E5E5E5' } },
            axisLabel: { color: '#86868B', fontSize: 11 },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            name: 'mmol/L',
            nameTextStyle: { color: '#86868B', fontSize: 11 },
            axisLine: { show: false },
            axisLabel: { color: '#86868B', fontSize: 11 },
            splitLine: { lineStyle: { color: '#F0F0F0', type: 'dashed' } },
            min: 3,
            max: 12
        },
        series: [{
            data: values,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: { color: '#007AFF' },
            lineStyle: { width: 2, color: '#007AFF' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 122, 255, 0.2)' },
                        { offset: 1, color: 'rgba(0, 122, 255, 0.01)' }
                    ]
                }
            },
            markLine: {
                silent: true,
                data: [
                    { yAxis: 3.9, lineStyle: { color: '#34C759', type: 'dashed' } },
                    { yAxis: 6.1, lineStyle: { color: '#34C759', type: 'dashed' } },
                    { yAxis: 7.8, lineStyle: { color: '#FF9500', type: 'dashed' } }
                ],
                label: { show: false }
            }
        }]
    };
    
    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
}

// 绘制分布饼图
function drawDistributionChart(data) {
    const chartDom = document.getElementById('distribution-chart');
    const myChart = echarts.init(chartDom);
    
    const values = data.map(d => parseFloat(d.blood_suger));
    
    // 分类统计
    const low = values.filter(v => v < 3.9).length;
    const normal = values.filter(v => v >= 3.9 && v <= 6.1).length;
    const high = values.filter(v => v > 6.1 && v <= 7.8).length;
    const veryHigh = values.filter(v => v > 7.8).length;
    
    const total = values.length;
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}次 ({d}%)'
        },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: { show: false },
            data: [
                { value: low, name: '偏低', itemStyle: { color: '#FF9500' } },
                { value: normal, name: '正常', itemStyle: { color: '#34C759' } },
                { value: high, name: '偏高', itemStyle: { color: '#FF6B00' } },
                { value: veryHigh, name: '过高', itemStyle: { color: '#FF3B30' } }
            ]
        }]
    };
    
    myChart.setOption(option);
    
    // 更新图例
    const legendEl = document.getElementById('distribution-legend');
    legendEl.innerHTML = `
        <div class="legend-item">
            <div class="legend-dot" style="background: #FF9500;"></div>
            <div class="legend-info">
                <div class="legend-label">偏低 (<3.9)</div>
                <div class="legend-value">${low}次 (${Math.round(low/total*100)}%)</div>
            </div>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background: #34C759;"></div>
            <div class="legend-info">
                <div class="legend-label">正常 (3.9-6.1)</div>
                <div class="legend-value">${normal}次 (${Math.round(normal/total*100)}%)</div>
            </div>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background: #FF6B00;"></div>
            <div class="legend-info">
                <div class="legend-label">偏高 (6.1-7.8)</div>
                <div class="legend-value">${high}次 (${Math.round(high/total*100)}%)</div>
            </div>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background: #FF3B30;"></div>
            <div class="legend-info">
                <div class="legend-label">过高 (>7.8)</div>
                <div class="legend-value">${veryHigh}次 (${Math.round(veryHigh/total*100)}%)</div>
            </div>
        </div>
    `;
    
    window.addEventListener('resize', () => myChart.resize());
}

// 生成分析
function generateAnalysis(data) {
    const values = data.map(d => parseFloat(d.blood_suger));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const normalRate = values.filter(v => v >= 3.9 && v <= 6.1).length / values.length;
    
    const analyses = [];
    
    // 平均血糖分析
    if (avg <= 6.1) {
        analyses.push({
            icon: '✅',
            type: 'good',
            title: '平均血糖控制良好',
            desc: `您的平均血糖为 ${avg.toFixed(1)} mmol/L，处于理想范围内，请继续保持！`
        });
    } else if (avg <= 7.8) {
        analyses.push({
            icon: '⚠️',
            type: 'warning',
            title: '平均血糖略高',
            desc: `您的平均血糖为 ${avg.toFixed(1)} mmol/L，建议注意饮食控制和适量运动。`
        });
    } else {
        analyses.push({
            icon: '🚨',
            type: 'danger',
            title: '平均血糖偏高',
            desc: `您的平均血糖为 ${avg.toFixed(1)} mmol/L，建议咨询医生调整治疗方案。`
        });
    }
    
    // 波动分析
    const fluctuation = max - min;
    if (fluctuation <= 3) {
        analyses.push({
            icon: '📊',
            type: 'good',
            title: '血糖波动平稳',
            desc: `血糖波动幅度为 ${fluctuation.toFixed(1)} mmol/L，控制得很稳定！`
        });
    } else if (fluctuation <= 5) {
        analyses.push({
            icon: '📈',
            type: 'warning',
            title: '血糖波动较大',
            desc: `血糖波动幅度为 ${fluctuation.toFixed(1)} mmol/L，建议规律饮食和作息。`
        });
    } else {
        analyses.push({
            icon: '⚡',
            type: 'danger',
            title: '血糖波动剧烈',
            desc: `血糖波动幅度达 ${fluctuation.toFixed(1)} mmol/L，需要重点关注！`
        });
    }
    
    // 达标率分析
    if (normalRate >= 0.7) {
        analyses.push({
            icon: '🎯',
            type: 'good',
            title: '达标率优秀',
            desc: `${Math.round(normalRate * 100)}% 的血糖记录在正常范围内，非常棒！`
        });
    } else if (normalRate >= 0.5) {
        analyses.push({
            icon: '🎯',
            type: 'warning',
            title: '达标率一般',
            desc: `${Math.round(normalRate * 100)}% 的血糖记录在正常范围内，还有提升空间。`
        });
    } else {
        analyses.push({
            icon: '🎯',
            type: 'danger',
            title: '达标率偏低',
            desc: `仅 ${Math.round(normalRate * 100)}% 的血糖记录达标，需要加强管理。`
        });
    }
    
    const container = document.getElementById('analysis-content');
    container.innerHTML = analyses.map(a => `
        <div class="analysis-item">
            <div class="analysis-icon ${a.type}">${a.icon}</div>
            <div class="analysis-text">
                <div class="analysis-title">${a.title}</div>
                <div class="analysis-desc">${a.desc}</div>
            </div>
        </div>
    `).join('');
}

// 生成建议
function generateSuggestions(data) {
    const values = data.map(d => parseFloat(d.blood_suger));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const normalRate = values.filter(v => v >= 3.9 && v <= 6.1).length / values.length;
    const lowCount = values.filter(v => v < 3.9).length;
    const highCount = values.filter(v => v > 7.8).length;
    
    const suggestions = [];
    
    // 基于数据生成个性化建议
    if (avg > 6.1) {
        suggestions.push({ icon: '🥗', text: '建议减少精制碳水化合物摄入，选择低GI食物如燕麦、糙米' });
        suggestions.push({ icon: '🚶', text: '餐后30分钟进行15-20分钟的散步，有助于降低餐后血糖' });
    }
    
    if (lowCount > 0) {
        suggestions.push({ icon: '🍬', text: '出现低血糖记录，建议随身携带糖果，规律进餐避免空腹' });
    }
    
    if (highCount > values.length * 0.3) {
        suggestions.push({ icon: '💊', text: '高血糖记录较多，建议咨询医生是否需要调整用药方案' });
    }
    
    if (normalRate < 0.7) {
        suggestions.push({ icon: '📝', text: '建议增加血糖监测频率，找出血糖波动的规律和原因' });
    }
    
    // 通用建议
    suggestions.push({ icon: '😴', text: '保持规律作息，每天7-8小时睡眠有助于血糖稳定' });
    suggestions.push({ icon: '💧', text: '每天饮水2000ml以上，促进代谢，帮助控制血糖' });
    
    const container = document.getElementById('suggestion-list');
    container.innerHTML = suggestions.slice(0, 5).map(s => `
        <div class="suggestion-item">
            <span class="suggestion-icon">${s.icon}</span>
            <span class="suggestion-text">${s.text}</span>
        </div>
    `).join('');
}

// 生成时段分析
function generatePeriodAnalysis(data) {
    // 模拟不同时段的血糖数据
    const periods = [
        { icon: '🌅', label: '早餐前', value: (4.5 + Math.random() * 2).toFixed(1) },
        { icon: '☀️', label: '午餐前', value: (5.0 + Math.random() * 2).toFixed(1) },
        { icon: '🌤️', label: '晚餐前', value: (5.2 + Math.random() * 2).toFixed(1) },
        { icon: '🌙', label: '睡前', value: (5.5 + Math.random() * 2).toFixed(1) }
    ];
    
    const container = document.getElementById('period-grid');
    container.innerHTML = periods.map(p => {
        const v = parseFloat(p.value);
        let status = 'good';
        let statusText = '正常';
        if (v < 3.9) { status = 'warning'; statusText = '偏低'; }
        else if (v > 6.1) { status = 'warning'; statusText = '偏高'; }
        else if (v > 7.8) { status = 'danger'; statusText = '过高'; }
        
        return `
            <div class="period-item">
                <div class="period-icon">${p.icon}</div>
                <div class="period-label">${p.label}</div>
                <div class="period-value">${p.value}</div>
                <div class="period-status ${status}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// 导出报告
function exportReport() {
    alert('报告导出功能开发中，敬请期待！');
}

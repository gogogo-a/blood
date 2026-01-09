document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素获取
   
    const avatarPreview = document.getElementById('avatar-preview');
    const imageInput = document.getElementById('image-input');
    const balanceElement = document.getElementById('balance');
        // 获取订单信息
        async function fetchUserorder() {
            try {
                const token = localStorage.getItem('token'); // 从 localStorage 获取 token
                console.log(token);
                const response = await fetch(`${API_BASE_URL}/payments/list/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
               showError("获取用户信息失败，请重试")
            }
        }
        fetchUserorder();

    // 头像上传预览
    function uploadAvatar(inputId, previewId, url) {
        url=`${API_BASE_URL}/app/user/renew/`
        
        // 获取文件选择器
        const inputElement = document.getElementById(inputId);
        const file = inputElement.files[0];
        if (!file) return;
    
        // 获取上传提示区域
        const spinner = document.getElementById('uploadSpinner');
        const successMessage = document.getElementById('uploadSuccessMessage');
        const avatarPreview = document.getElementById(previewId);
    
        // 显示加载中的提示
        spinner.style.display = 'block';
        successMessage.style.display = 'none'; // 隐藏成功消息
    
        const reader = new FileReader();
        
        // 设置FileReader的onload事件，当文件读取完成后触发
    reader.onload = function(event) {
    // 读取的结果在event.target.result中
    const fileData = event.target.result;
    avatarPreview.src=fileData; // 设置预览图像
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 设置API地址
    const url = `${API_BASE_URL}/app/user/image/`;
  
    // 使用fetch API发送请求
    fetch(url, {
      method: 'POST', // 或者 'PUT'，取决于你的API设计
      headers: {
        'Authorization': `Bearer ${token}`, // 设置认证头
        'Content-Type': 'application/json' // 根据后端需要，设置正确的Content-Type
      },
      body: JSON.stringify({
        // 发送文件数据，这里假设后端期望一个名为'image'的字段
        image: fileData
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      spinner.style.display = 'none';
      successMessage.style.display = 'block';
      showSuccess("图片上传成功")
    })
    .catch((error) => {
      console.error('Error:', error);
      showError("图片上传失败，请重试")
    });
  };
     
        reader.readAsDataURL(file);
    }
    
   

    // 获取用户信息
    async function fetchUserProfile() {
        try {
            const token = localStorage.getItem('token'); // 从 localStorage 获取 token
            console.log(token);
            const response = await fetch(`${API_BASE_URL}/app/user/profile/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                window.location.href = 'login.html';
                showError("获取用户信息失败，请重试")
                
               
              
            }

            const data = await response.json();
            console.log(data);
            // 更新页面内容
            avatarPreview.src = data.user_data.image || '';
            balanceElement.textContent = data.user_data.balance || '未设置';
            
            // 获取血糖数据并计算成就
            fetchBloodSugarForBadges();
        } catch (error) {
            window.location.href = 'login.html';
           showError("获取用户信息失败，请重试")
        }
    }

    // 获取血糖数据计算成就徽章
    async function fetchBloodSugarForBadges() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                calculateAndDisplayBadges(data);
            }
        } catch (error) {
            console.error('获取血糖数据失败:', error);
        }
    }

    // 计算并显示成就徽章
    function calculateAndDisplayBadges(bloodSugarData) {
        const badges = [
            { id: 'first_record', name: '初次记录', icon: '🎯', condition: () => bloodSugarData.length >= 1 },
            { id: 'week_warrior', name: '周记录达人', icon: '📅', condition: () => bloodSugarData.length >= 7 },
            { id: 'stable_sugar', name: '血糖稳定', icon: '💪', condition: () => checkStableSugar(bloodSugarData) },
            { id: 'health_master', name: '健康达人', icon: '🏆', condition: () => checkHealthMaster(bloodSugarData) }
        ];

        const showcase = document.getElementById('badges-showcase');
        if (!showcase) return;

        showcase.innerHTML = badges.map(badge => {
            const unlocked = badge.condition();
            return `
                <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="${badge.name}">
                    <span class="badge-icon">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `;
        }).join('');

        // 保存成就数据到localStorage供成就页面使用
        const achievementData = {
            totalRecords: bloodSugarData.length,
            badges: badges.map(b => ({ ...b, unlocked: b.condition(), condition: undefined })),
            bloodSugarData: bloodSugarData.slice(0, 30) // 保存最近30条
        };
        localStorage.setItem('achievementData', JSON.stringify(achievementData));
    }

    // 检查血糖是否稳定（最近5次都在正常范围）
    function checkStableSugar(data) {
        if (data.length < 5) return false;
        const recent5 = data.slice(0, 5);
        return recent5.every(d => d.blood_suger >= 4 && d.blood_suger <= 7);
    }

    // 检查是否为健康达人（记录超过20次且平均血糖正常）
    function checkHealthMaster(data) {
        if (data.length < 20) return false;
        const avg = data.reduce((sum, d) => sum + d.blood_suger, 0) / data.length;
        return avg >= 4 && avg <= 7;
    }


    // 事件绑定
    imageInput.addEventListener('change', () => uploadAvatar('image-input', 'avatar-preview'));

    // 初始化用户信息
    fetchUserProfile();
});
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // 退出登录功能
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token'); // 清除 token
        window.location.href = 'login.html'; // 重定向到登录页面
    });

    // ... existing code ...
});
   // 跳转函数
   function redirectToPay(event) {
    event.stopPropagation(); // 阻止事件冒泡
    window.location.href = 'Pay.html';
}
function redirectTopersonal_information(event) {
    event.stopPropagation(); // 阻止事件冒泡
    window.location.href = 'personal_information.html';
}
function redirectTotopic(event) {
    event.stopPropagation(); // 阻止事件冒泡
    window.location.href = 'my_topic.html';
}
function redirectToorder(event) {
    event.stopPropagation(); // 阻止事件冒泡
    window.location.href = 'order.html';
}


// ========================================
// 数据导出功能
// ========================================
let selectedFormat = 'excel';

function openExportModal() {
    document.getElementById('export-modal').classList.add('show');
}

function closeExportModal() {
    document.getElementById('export-modal').classList.remove('show');
}

function selectFormat(format) {
    selectedFormat = format;
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.format === format) {
            btn.classList.add('active');
        }
    });
}

async function exportData() {
    const exportSugar = document.getElementById('export-sugar').checked;
    const exportMedication = document.getElementById('export-medication').checked;
    const exportExercise = document.getElementById('export-exercise').checked;
    const exportRange = document.getElementById('export-range').value;
    
    if (!exportSugar && !exportMedication && !exportExercise) {
        showError('请至少选择一项数据导出');
        return;
    }
    
    const token = localStorage.getItem('token');
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.innerHTML = '<span class="spinner"></span> 导出中...';
    exportBtn.disabled = true;
    
    try {
        // 收集数据
        const data = {
            exportDate: new Date().toLocaleDateString('zh-CN'),
            range: exportRange,
            bloodSugar: [],
            medication: [],
            exercise: []
        };
        
        // 获取血糖数据
        if (exportSugar) {
            const sugarRes = await fetch(`${API_BASE_URL}/app/BloodSugarLog/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (sugarRes.ok) {
                data.bloodSugar = await sugarRes.json();
            }
        }
        
        // 获取用药数据
        if (exportMedication) {
            const medRes = await fetch(`${API_BASE_URL}/app/MedicationLog/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (medRes.ok) {
                data.medication = await medRes.json();
            }
        }
        
        // 获取运动数据
        if (exportExercise) {
            const exRes = await fetch(`${API_BASE_URL}/app/ExerciseLog/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (exRes.ok) {
                data.exercise = await exRes.json();
            }
        }
        
        // 根据时间范围过滤
        const now = new Date();
        const filterDate = (records, dateField) => {
            if (exportRange === 'all') return records;
            const days = parseInt(exportRange);
            const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            return records.filter(r => new Date(r[dateField]) >= cutoff);
        };
        
        data.bloodSugar = filterDate(data.bloodSugar, 'created_at');
        data.medication = filterDate(data.medication, 'medication_time');
        data.exercise = filterDate(data.exercise, 'exercise_time');
        
        // 生成文件
        if (selectedFormat === 'excel') {
            generateExcel(data);
        } else {
            generatePDF(data);
        }
        
        showSuccess('数据导出成功！');
        closeExportModal();
    } catch (error) {
        console.error('导出失败:', error);
        showError('导出失败，请重试');
    } finally {
        exportBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            开始导出
        `;
        exportBtn.disabled = false;
    }
}

// 生成 Excel (CSV格式)
function generateExcel(data) {
    let csv = '\uFEFF'; // BOM for UTF-8
    
    // 血糖记录
    if (data.bloodSugar.length > 0) {
        csv += '血糖记录\n';
        csv += '日期,餐次,餐前血糖(mmol/L),餐后血糖(mmol/L),碳水化合物(g)\n';
        data.bloodSugar.forEach(r => {
            const date = new Date(r.created_at).toLocaleDateString('zh-CN');
            csv += `${date},${r.meal_time},${r.fasting_glucose},${r.postprandial_glucose},${r.carbohydrates}\n`;
        });
        csv += '\n';
    }
    
    // 用药记录
    if (data.medication.length > 0) {
        csv += '用药记录\n';
        csv += '日期,药品名称,用药类型,剂量(mg)\n';
        data.medication.forEach(r => {
            const date = new Date(r.medication_time).toLocaleDateString('zh-CN');
            csv += `${date},${r.medication_name},${r.medication_type},${r.dosage}\n`;
        });
        csv += '\n';
    }
    
    // 运动记录
    if (data.exercise.length > 0) {
        csv += '运动记录\n';
        csv += '日期,运动项目,强度,时长(分钟)\n';
        data.exercise.forEach(r => {
            const date = new Date(r.exercise_time).toLocaleDateString('zh-CN');
            csv += `${date},${r.exercise_program},${r.intensity},${r.duration}\n`;
        });
    }
    
    // 下载文件
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `健康数据_${data.exportDate}.csv`;
    link.click();
}

// 生成 PDF (简化版，生成HTML打印)
function generatePDF(data) {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>健康数据报告</title>
            <style>
                body { font-family: -apple-system, sans-serif; padding: 40px; color: #1D1D1F; }
                h1 { color: #007AFF; border-bottom: 2px solid #007AFF; padding-bottom: 10px; }
                h2 { color: #1D1D1F; margin-top: 30px; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { border: 1px solid #E5E5EA; padding: 10px; text-align: left; }
                th { background: #F5F5F7; font-weight: 600; }
                .footer { margin-top: 40px; color: #86868B; font-size: 12px; text-align: center; }
            </style>
        </head>
        <body>
            <h1>📊 健康数据报告</h1>
            <p>导出日期：${data.exportDate}</p>
    `;
    
    // 血糖记录
    if (data.bloodSugar.length > 0) {
        html += '<h2>🩸 血糖记录</h2><table><tr><th>日期</th><th>餐次</th><th>餐前血糖</th><th>餐后血糖</th><th>碳水</th></tr>';
        data.bloodSugar.forEach(r => {
            const date = new Date(r.created_at).toLocaleDateString('zh-CN');
            html += `<tr><td>${date}</td><td>${r.meal_time}</td><td>${r.fasting_glucose}</td><td>${r.postprandial_glucose}</td><td>${r.carbohydrates}g</td></tr>`;
        });
        html += '</table>';
    }
    
    // 用药记录
    if (data.medication.length > 0) {
        html += '<h2>💊 用药记录</h2><table><tr><th>日期</th><th>药品名称</th><th>类型</th><th>剂量</th></tr>';
        data.medication.forEach(r => {
            const date = new Date(r.medication_time).toLocaleDateString('zh-CN');
            html += `<tr><td>${date}</td><td>${r.medication_name}</td><td>${r.medication_type}</td><td>${r.dosage}mg</td></tr>`;
        });
        html += '</table>';
    }
    
    // 运动记录
    if (data.exercise.length > 0) {
        html += '<h2>🏃 运动记录</h2><table><tr><th>日期</th><th>运动项目</th><th>强度</th><th>时长</th></tr>';
        data.exercise.forEach(r => {
            const date = new Date(r.exercise_time).toLocaleDateString('zh-CN');
            html += `<tr><td>${date}</td><td>${r.exercise_program}</td><td>${r.intensity}</td><td>${r.duration}分钟</td></tr>`;
        });
        html += '</table>';
    }
    
    html += '<div class="footer">由血糖管理系统生成</div></body></html>';
    
    // 打开新窗口打印
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// 点击弹窗外部关闭
document.addEventListener('click', (e) => {
    const modal = document.getElementById('export-modal');
    if (e.target === modal) {
        closeExportModal();
    }
    const contactModal = document.getElementById('contact-modal');
    if (e.target === contactModal) {
        closeContactModal();
    }
});

// ========================================
// 深色模式功能
// ========================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const autoDarkToggle = document.getElementById('auto-dark-toggle');
    
    if (!darkModeToggle || !autoDarkToggle) return;
    
    // 读取保存的设置
    const savedTheme = localStorage.getItem('theme');
    const autoMode = localStorage.getItem('autoDarkMode') === 'true';
    
    autoDarkToggle.checked = autoMode;
    
    if (autoMode) {
        // 自动模式：根据系统设置
        applySystemTheme();
        darkModeToggle.disabled = true;
    } else if (savedTheme) {
        // 手动模式：使用保存的主题
        document.documentElement.setAttribute('data-theme', savedTheme);
        darkModeToggle.checked = savedTheme === 'dark';
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('autoDarkMode') === 'true') {
            applySystemTheme();
        }
    });
}

function toggleDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const theme = darkModeToggle.checked ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 同步到其他页面
    broadcastThemeChange(theme);
    
    showSuccess(theme === 'dark' ? '已切换到深色模式 🌙' : '已切换到浅色模式 ☀️');
}

function toggleAutoDark() {
    const autoDarkToggle = document.getElementById('auto-dark-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const autoMode = autoDarkToggle.checked;
    
    localStorage.setItem('autoDarkMode', autoMode);
    
    if (autoMode) {
        darkModeToggle.disabled = true;
        applySystemTheme();
        showSuccess('已开启自动切换，将跟随系统设置');
    } else {
        darkModeToggle.disabled = false;
        showSuccess('已关闭自动切换');
    }
}

function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.checked = prefersDark;
    }
    
    broadcastThemeChange(theme);
}

function broadcastThemeChange(theme) {
    // 使用 localStorage 事件通知其他页面
    localStorage.setItem('themeChanged', Date.now());
}

// 全局主题初始化（所有页面都需要）
function initGlobalTheme() {
    const savedTheme = localStorage.getItem('theme');
    const autoMode = localStorage.getItem('autoDarkMode') === 'true';
    
    if (autoMode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// 页面加载时初始化主题
initGlobalTheme();

// ========================================
// 紧急联系人功能（从后端API获取）
// ========================================
async function initEmergencyContacts() {
    await fetchEmergencyContacts();
}

async function fetchEmergencyContacts() {
    const token = localStorage.getItem('token');
    if (!token) {
        renderEmergencyContacts([]);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/goals/emergency-contact/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const result = await response.json();
            if (result.status && result.data) {
                renderEmergencyContacts(result.data);
                return;
            }
        }
    } catch (error) {
        console.log('获取紧急联系人失败');
    }
    
    // 后端获取失败，使用localStorage备用
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    renderEmergencyContacts(contacts);
}

function renderEmergencyContacts(contacts) {
    const listEl = document.getElementById('emergency-list');
    const emptyEl = document.getElementById('emergency-empty');
    
    if (!listEl || !emptyEl) return;
    
    if (contacts.length === 0) {
        listEl.style.display = 'none';
        emptyEl.classList.add('show');
        return;
    }
    
    listEl.style.display = 'flex';
    emptyEl.classList.remove('show');
    
    const avatarClass = {
        '家人': 'family',
        '配偶': 'spouse',
        '子女': 'child',
        '朋友': 'friend',
        '医生': 'doctor',
        '其他': 'family'
    };
    
    const avatarEmoji = {
        '家人': '👨‍👩‍👧',
        '配偶': '💑',
        '子女': '👶',
        '朋友': '🤝',
        '医生': '👨‍⚕️',
        '其他': '👤'
    };
    
    listEl.innerHTML = contacts.map((contact) => `
        <div class="contact-item">
            <div class="contact-avatar ${avatarClass[contact.relation] || 'family'}">
                ${avatarEmoji[contact.relation] || '👤'}
            </div>
            <div class="contact-info">
                <div class="contact-name">
                    ${contact.name}
                    <span class="contact-relation">${contact.relation}</span>
                </div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            <div class="contact-actions">
                <button class="contact-call-btn" onclick="callContact('${contact.phone}')" title="拨打电话">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                </button>
                <button class="contact-delete-btn" onclick="deleteContact(${contact.id})" title="删除">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function openContactModal() {
    document.getElementById('contact-modal').classList.add('show');
    document.getElementById('contact-form').reset();
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('show');
}

async function saveContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const relation = document.getElementById('contact-relation').value;
    
    if (!name || !phone) {
        showError('请填写完整信息');
        return;
    }
    
    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        showError('请输入正确的手机号码');
        return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/goals/emergency-contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone, relation })
            });
            
            const result = await response.json();
            if (result.status) {
                await fetchEmergencyContacts();
                closeContactModal();
                showSuccess('紧急联系人添加成功！');
                return;
            } else {
                showError(result.data || '添加失败');
                return;
            }
        } catch (error) {
            console.log('添加联系人失败');
        }
    }
    
    // 后端失败，保存到localStorage
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    if (contacts.length >= 5) {
        showError('最多添加5个紧急联系人');
        return;
    }
    if (contacts.some(c => c.phone === phone)) {
        showError('该联系人已存在');
        return;
    }
    
    contacts.push({ id: Date.now(), name, phone, relation });
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    
    renderEmergencyContacts(contacts);
    closeContactModal();
    showSuccess('紧急联系人添加成功！');
}

async function deleteContact(contactId) {
    if (!confirm('确定要删除这个联系人吗？')) return;
    
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/goals/emergency-contact/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: contactId })
            });
            
            const result = await response.json();
            if (result.status) {
                await fetchEmergencyContacts();
                showSuccess('联系人已删除');
                return;
            }
        } catch (error) {
            console.log('删除联系人失败');
        }
    }
    
    // 后端失败，从localStorage删除
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    const index = contacts.findIndex(c => c.id === contactId);
    if (index > -1) {
        contacts.splice(index, 1);
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
        renderEmergencyContacts(contacts);
        showSuccess('联系人已删除');
    }
}

function callContact(phone) {
    window.location.href = `tel:${phone}`;
}

// 紧急呼叫功能
async function emergencyCall() {
    const token = localStorage.getItem('token');
    let contacts = [];
    
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/goals/emergency-contact/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.status && result.data) {
                    contacts = result.data;
                }
            }
        } catch (error) {
            contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
        }
    } else {
        contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    }
    
    if (contacts.length === 0) {
        showError('请先添加紧急联系人');
        return;
    }
    
    const firstContact = contacts[0];
    if (confirm(`是否拨打紧急联系人 ${firstContact.name} 的电话？`)) {
        window.location.href = `tel:${firstContact.phone}`;
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initEmergencyContacts();
});

document.addEventListener('DOMContentLoaded', () => {
    const bloodSugarLogContainer = document.getElementById('medication-log-container');

    const fetchAllMedicationLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/MedicationLog/`, { // 使用公共变量
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('获取药物记录失败');
            }

            const logs = await response.json();
            displayBloodSugarLogs(logs);
        } catch (error) {
            console.error('获取药物记录失败:', error);
            bloodSugarLogContainer.innerHTML = '<p>无法加载用药记录，请稍后重试。</p>';
        }
    };

    const displayBloodSugarLogs = (logs) => {
        bloodSugarLogContainer.innerHTML = ''; // 清空之前的记录

        logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
               <h4>${new Date(log.medication_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</h4>


                <p>药品: <span class="fasting-glucose">${log.medication_name}</span></p>
                <p>用药方式: <span class="postprandial-glucose">${log.medication_type}</span></p>
                <p>用药计量: <span class="carbohydrates">${log.dosage}</span> mg</p>
            `;
            bloodSugarLogContainer.appendChild(logElement);
        });
    };

    fetchAllMedicationLogs(); // 初始化时获取所有血糖记录
}); 
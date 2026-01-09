document.addEventListener('DOMContentLoaded', () => {
    const bloodSugarLogContainer = document.getElementById('blood-sugar-log-container');

    const fetchAllBloodSugarLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/BloodSugarLog/`, { // 使用公共变量
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 将token添加到请求头
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('获取血糖记录失败');
            }

            const logs = await response.json();
            displayBloodSugarLogs(logs);
        } catch (error) {
            console.error('获取血糖记录失败:', error);
            bloodSugarLogContainer.innerHTML = '<p>无法加载血糖记录，请稍后重试。</p>';
        }
    };

    const displayBloodSugarLogs = (logs) => {
        bloodSugarLogContainer.innerHTML = ''; // 清空之前的记录

        logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
               <h4>${log.meal_time}--${new Date(log.create_date).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</h4>


                <p>餐前: <span class="fasting-glucose">${log.fasting_glucose}</span> mmol/L</p>
                <p>餐后: <span class="postprandial-glucose">${log.postprandial_glucose}</span> mmol/L</p>
                <p>碳水: <span class="carbohydrates">${log.carbohydrates}</span> g</p>
            `;
            bloodSugarLogContainer.appendChild(logElement);
        });
    };

    fetchAllBloodSugarLogs(); // 初始化时获取所有血糖记录
}); 
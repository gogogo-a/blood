document.addEventListener('DOMContentLoaded', () => {
    const bloodSugarLogContainer = document.getElementById('exercise-list');

    const fetchAllExerciseLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/ExerciseLog/`, { // 使用公共变量
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('获取运动记录失败');
            }

            const logs = await response.json();
            displayBloodSugarLogs(logs);
        } catch (error) {
            console.error('获取运动记录失败:', error);
            bloodSugarLogContainer.innerHTML = '<p>无法加载运动记录，请稍后重试。</p>';
        }
    };

    const displayBloodSugarLogs = (logs) => {
        bloodSugarLogContainer.innerHTML = ''; // 清空之前的记录

        logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
               <h4>${new Date(log.exercise_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</h4>


                <p>运动项目: <span class="fasting-glucose">${log.exercise_program}</span></p>
                <p>运动程度: <span class="postprandial-glucose">${log.intensity}</span></p>
                <p>运动时间: <span class="carbohydrates">${log.duration}</span> 分钟</p>
            `;
            bloodSugarLogContainer.appendChild(logElement);
        });
    };

    fetchAllExerciseLogs(); // 初始化时获取所有血糖记录
}); 
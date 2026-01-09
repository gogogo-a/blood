document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // DOM元素
    const foodCard = document.getElementById('food-recommend');
    const sportCard = document.getElementById('sport-recommend');
    // 初始化API调用
    Promise.all([
        fetchRecommendation('food').catch(handleAPIError),
        fetchRecommendation('sport').catch(error => {
            // 运动推荐单独处理错误
            if (error.response?.data?.status === false) {
                showGetButton('sport');
            } else {
                handleAPIError(error);
            }
        })
    ]);

    // 获取推荐数据
    async function fetchRecommendation(type) {
        const endpoint = type === 'food' 
            ? `${API_BASE_URL}/app/recommend/get_today_recommendation`
            : `${API_BASE_URL}/app/recommend/get_plan_detail`;

        try {
            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 统一处理响应状态
            if (response.data.status) {
                updateRecommendationCard(type, 
                    type === 'food' ? response.data.data : {
                        sport_plan: response.data.data.sport_plan,
                        food_plan:response.data.data.food_plan,
                        balance: response.data.data.balance
                    }
                );
            } else {
                // 仅运动类型显示按钮
                if (type === 'sport') {
                    showGetButton(type);
                }
                if(type === 'food') {
                    showError(response.data.data);
                }
            }
        } catch (error) {
            // 特殊处理运动计划未生成的情况
            if (type === 'sport' && error.response?.status === 404) {
                showGetButton(type);
            } else {
                showError(error);
                throw error; // 保证Promise.all能捕获异常
            }
        }
    }
    //解析内容为食物列表
    function parseContentToFoodList(content) {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const foodList = [];
        let tip = ''; // 存储提示信息
    
        // 过滤表头行和分隔行，提取有效数据
        const validLines = lines.filter(line => {
            if (line.startsWith('**')) { // 捕获提示信息
                tip = line.replace(/\*\*/g, '');
                return false;
            }
            return line.startsWith('|') && !line.includes('---'); // 排除分隔行
        });
    
        validLines.forEach(line => {
            const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
            if (columns.length >= 2) {
                const foodName = columns[0];
                const foodAmount = columns[1];
                foodList.push({ foodName, foodAmount });
            }
        });
    
        return { foodList, tip }; // 返回食物列表和提示信息
    }
      // 生成食物列表
      function generateFoodPlanList(parsedData) {
        const foodItems = parsedData.foodList.map(item => 
            `<li>${item.foodName} - ${item.foodAmount}</li>`
        ).join('');
        
        const tipHtml = parsedData.tip ? 
            `<div class="food-tip">${parsedData.tip}</div>` : '';
    
        return `
            <ul class="food-list">${foodItems}</ul>
            ${tipHtml}
        `;
    }
    // 更新推荐卡片
    function updateRecommendationCard(type, data) {
        console.log(data);
        const card = type === 'food' ? foodCard : sportCard;
        const statusDiv = card.querySelector('.recommend-status');
        
        if (type === 'food') {
            // 原有食物推荐代码保持不变
            statusDiv.innerHTML = `
            <div class="recommend-list">
                ${data.food.map(item => `
                    <div class="food-card">
                        <div class="meal-header">
                            <span class="meal-time">${item.meal || '未指定餐时'}</span>
                        </div>
                        <div class="food-gallery">
                            ${[1,2,3,4].map(n => `
                                ${item[`food${n}_name`] ? `
                                    <div class="food-image-container">
                                        ${item[`food${n}_image`] ? `
                                            <img src="${item[`food${n}_image`]}" 
                                                 alt="${item[`food${n}_name`]}" 
                                                 class="food-image"
                                                 loading="lazy"
                                                 onerror="this.parentElement.remove()"> 
                                        ` : ''}
                                        
                                    </div>
                                    <p class="food-name">${item[`food${n}_name`]}</p>
                                ` : ''}
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>`;
        } else {
            // 新增运动推荐样式
            console.log(data);
            const sport_plan = data.sport_plan.replace(/\n/g, '<br>');
            const food_plan = parseContentToFoodList(data.food_plan)
            const foodPlanListHTML = generateFoodPlanList(food_plan);
            statusDiv.innerHTML = `
                <div class="sport-plan">
                    <div class="plan-header">
                        <i class="fas fa-running"></i>
                        <h3>定制运动推荐</h3>
                    </div>
                    <div class="plan-content">${sport_plan}</div>
                   
                </div>
                 <div class="sport-plan">
                    <div class="plan-header">
                        <i class="fas fa-running"></i>
                        <h3>定制食物推荐</h3>
                    </div>
                    <div class="plan-content">
                    ${foodPlanListHTML}
                    </div>
                   
                </div>
            `;
        }
        card.querySelector('.get-recommend-btn').style.display = 'none';
    }
// 显示加载状态
function showLoadingStatus(type) {
    const card = type === 'food' ? foodCard : sportCard;
    const statusDiv = card.querySelector('.recommend-status');
    statusDiv.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在努力为您定制（1分钟左右），可以先看看别的呢</p>
        </div>
    `;
}
    // 显示获取按钮
    function showGetButton(type) {
        const btn = document.querySelector(`[data-type="${type}"]`);
        btn.style.display = 'block';
        btn.addEventListener('click', () => handleGetRecommendation(type));
    }

    // 处理获取推荐
    async function handleGetRecommendation(type) {
        
        const userConfirmed = confirm("需要消耗1点点数");
        if (!userConfirmed) {
            return;
          }
        
        try {
            const btn = document.querySelector(`[data-type="${type}"]`);
            btn.style.display = 'none';
            showLoadingStatus(type); // 新增加载状态显示

            console.log(type);
            const response = await axios.get(
                `${API_BASE_URL}/app/recommend/${type === 'food' ? 'get_today_recommendation/' : 'get_plan/'}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
              );
            // console.log(response);
            if (response.data.status) {
                // btn.style.display = 'none';
                showSuccess("今日运动计划已生成！")
                updateRecommendationCard(type, response.data.data);
                btn.style.display = 'none';
            }
        } catch (error) {
            
            showGetButton("sport")
            showError(response.data.data)
        }
    }

    // 工具函数
    function handleAPIError(error) {
        console.error('API Error:', error);
        showError('初始化数据获取失败，请刷新页面重试');
    }
});

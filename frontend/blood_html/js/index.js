

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-btn');
    const userForm = document.getElementById('user-detail-form');

    const userHeight = document.getElementById('user-height');
    const userWeight = document.getElementById('user-weight');
    const userBloodSugar = document.getElementById('user-blood-sugar');
    const bloodSugarStatus = document.getElementById('blood-sugar-status');
    const bloodSugarTip = document.getElementById('blood-sugar-tip');
    const userBmi = document.getElementById('user-bmi');
    const bmiStatus = document.getElementById('bmi-status');
    const bmiTip = document.getElementById('bmi-tip');

    // ========================================
    // 智能问候系统
    // ========================================
    function generateSmartGreeting(userData) {
        const hour = new Date().getHours();
        let timeGreeting = '';
        let emoji = '';
        
        if (hour >= 5 && hour < 9) {
            timeGreeting = '早上好';
            emoji = '🌅';
        } else if (hour >= 9 && hour < 12) {
            timeGreeting = '上午好';
            emoji = '☀️';
        } else if (hour >= 12 && hour < 14) {
            timeGreeting = '中午好';
            emoji = '🌞';
        } else if (hour >= 14 && hour < 18) {
            timeGreeting = '下午好';
            emoji = '🌤️';
        } else if (hour >= 18 && hour < 22) {
            timeGreeting = '晚上好';
            emoji = '🌙';
        } else {
            timeGreeting = '夜深了';
            emoji = '🌟';
        }

        let statusText = '';
        let subText = '';

        // 随机提醒语库
        const reminders = [
            '别忘记记录今天的血糖哦 📝',
            '今天的用药记录更新了吗？💊',
            '记得按时测量血糖 🩸',
            '运动记录也要坚持哦 🏃',
            '保持记录习惯，控糖更轻松 ✅',
            '定时记录，健康看得见 📊',
            '今天喝够水了吗？💧',
            '坚持记录是控糖第一步 👍',
            '数据越完整，分析越准确 📈',
            '记录饮食，了解升糖规律 🍽️'
        ];
        const randomReminder = reminders[Math.floor(Math.random() * reminders.length)];

        if (userData && userData.blood_suger) {
            const bs = userData.blood_suger;
            if (bs < 4) {
                statusText = `${emoji} ${timeGreeting}！当前血糖 ${bs} mmol/L，偏低`;
                subText = '建议适当补充糖分，注意身体状况';
            } else if (bs <= 6.1) {
                statusText = `${emoji} ${timeGreeting}！血糖 ${bs} mmol/L，状态良好 ✨`;
                subText = randomReminder;
            } else if (bs <= 7.8) {
                statusText = `${emoji} ${timeGreeting}！血糖 ${bs} mmol/L，略高`;
                subText = randomReminder;
            } else {
                statusText = `${emoji} ${timeGreeting}！血糖 ${bs} mmol/L，需要关注`;
                subText = '建议咨询医生，调整饮食和用药';
            }
        } else {
            statusText = `${emoji} ${timeGreeting}！欢迎使用血糖管理系统`;
            subText = '记录您的健康数据，开启智能管理';
        }

        return { statusText, subText };
    }

    // 打字机效果
    function typeWriter(element, text, speed = 30) {
        element.textContent = '';
        element.classList.add('typing-cursor');
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing-cursor');
            }
        }
        type();
    }

    // 生成 AI 洞察
    function generateAIInsight(userData, allData) {
        if (!userData || !allData || allData.length < 2) return null;

        const insights = [];
        const bs = userData.blood_suger;
        const bmi = (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1);
        const hour = new Date().getHours();

        // 血糖趋势分析 - 多种表达方式
        if (allData.length >= 3) {
            const recent = allData.slice(0, 3).map(d => d.blood_suger);
            const avg = (recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(1);
            const diff = recent[0] - recent[recent.length - 1];
            const trend = diff > 0 ? '上升' : '下降';
            
            if (Math.abs(diff) > 1) {
                const trendPhrases = [
                    `近期血糖呈<span class="warning">${trend}趋势</span>，平均值 ${avg} mmol/L`,
                    `检测到血糖波动，近3次平均 <span class="highlight">${avg}</span> mmol/L`,
                    `血糖数据分析：整体呈<span class="warning">${trend}</span>走势`
                ];
                insights.push(trendPhrases[Math.floor(Math.random() * trendPhrases.length)]);
            }
        }

        // BMI 建议 - 多种表达
        if (bmi > 24) {
            const bmiHighPhrases = [
                `BMI ${bmi} 略高，<span class="highlight">适量运动</span>有助于改善血糖控制`,
                `体重管理建议：BMI ${bmi}，<span class="highlight">每日步行6000步</span>效果显著`,
                `当前 BMI ${bmi}，<span class="success">控制饮食+运动</span>双管齐下更有效`
            ];
            insights.push(bmiHighPhrases[Math.floor(Math.random() * bmiHighPhrases.length)]);
        } else if (bmi < 18.5) {
            const bmiLowPhrases = [
                `BMI ${bmi} 偏低，建议<span class="highlight">均衡营养</span>摄入`,
                `体重偏轻，建议增加<span class="highlight">优质蛋白</span>摄入`,
                `BMI ${bmi}，适当增加<span class="success">健康脂肪</span>和碳水`
            ];
            insights.push(bmiLowPhrases[Math.floor(Math.random() * bmiLowPhrases.length)]);
        }

        // 血糖状态相关建议
        if (bs < 4) {
            const lowBsPhrases = [
                '血糖偏低，建议随身携带<span class="warning">糖果或葡萄糖片</span>',
                '低血糖风险提示：<span class="highlight">少食多餐</span>更稳定',
                '当前血糖较低，<span class="warning">避免空腹运动</span>'
            ];
            insights.push(lowBsPhrases[Math.floor(Math.random() * lowBsPhrases.length)]);
        } else if (bs > 7.8) {
            const highBsPhrases = [
                '血糖偏高，建议<span class="highlight">减少精制碳水</span>摄入',
                '高血糖提醒：<span class="warning">餐后散步</span>可有效降糖',
                '血糖控制建议：<span class="highlight">增加膳食纤维</span>摄入'
            ];
            insights.push(highBsPhrases[Math.floor(Math.random() * highBsPhrases.length)]);
        }

        // 时间相关建议 - 更丰富
        if (hour >= 6 && hour < 9) {
            const morningTips = [
                '早餐建议：<span class="success">全麦+蛋白质</span>组合更稳糖',
                '晨起空腹血糖最准确，<span class="highlight">记得测量</span>',
                '早餐避免<span class="warning">纯碳水</span>，搭配蛋白质更好'
            ];
            insights.push(morningTips[Math.floor(Math.random() * morningTips.length)]);
        } else if (hour >= 9 && hour < 12) {
            const lateMorningTips = [
                '上午工作间隙，<span class="highlight">起身活动5分钟</span>',
                '久坐不利于血糖控制，<span class="success">每小时站立一次</span>',
                '上午适合<span class="highlight">喝杯绿茶</span>，有助代谢'
            ];
            insights.push(lateMorningTips[Math.floor(Math.random() * lateMorningTips.length)]);
        } else if (hour >= 12 && hour < 14) {
            const noonTips = [
                '午餐后<span class="highlight">站立或散步10分钟</span>有助消化',
                '中午是血糖高峰期，<span class="success">细嚼慢咽</span>很重要',
                '午餐建议：<span class="highlight">先吃菜再吃饭</span>降低升糖速度'
            ];
            insights.push(noonTips[Math.floor(Math.random() * noonTips.length)]);
        } else if (hour >= 14 && hour < 18) {
            const afternoonTips = [
                '下午是运动的好时机，<span class="success">30分钟散步</span>可有效降糖',
                '下午茶选择：<span class="highlight">坚果或酸奶</span>比甜点更健康',
                '此时运动效果最佳，<span class="success">快走或骑车</span>都不错'
            ];
            insights.push(afternoonTips[Math.floor(Math.random() * afternoonTips.length)]);
        } else if (hour >= 18 && hour < 22) {
            const eveningTips = [
                '晚餐建议<span class="highlight">7分饱</span>，避免夜间血糖过高',
                '晚餐后<span class="success">散步20分钟</span>有助于睡眠和控糖',
                '晚餐碳水减半，<span class="highlight">增加蔬菜</span>比例'
            ];
            insights.push(eveningTips[Math.floor(Math.random() * eveningTips.length)]);
        } else {
            const nightTips = [
                '良好睡眠是控糖关键，<span class="highlight">11点前入睡</span>最佳',
                '睡前避免进食，<span class="warning">空腹8小时</span>有助代谢',
                '充足睡眠可改善<span class="success">胰岛素敏感性</span>'
            ];
            insights.push(nightTips[Math.floor(Math.random() * nightTips.length)]);
        }

        // 通用健康小贴士 - 大幅扩充
        const generalTips = [
            '每天保持<span class="highlight">7-8小时</span>睡眠有助于血糖稳定',
            '餐后<span class="highlight">15分钟散步</span>可降低血糖峰值',
            '选择<span class="success">低GI食物</span>有助于平稳血糖',
            '保持<span class="highlight">规律作息</span>是控糖的关键',
            '每天饮水<span class="highlight">2000ml</span>促进代谢',
            '压力会升高血糖，<span class="success">深呼吸放松</span>很有效',
            '多吃<span class="highlight">绿叶蔬菜</span>，膳食纤维延缓糖吸收',
            '用餐顺序：<span class="success">菜→肉→饭</span>更利于控糖',
            '每周<span class="highlight">150分钟中等强度运动</span>效果显著',
            '细嚼慢咽，每口咀嚼<span class="highlight">20次以上</span>',
            '选择<span class="success">糙米替代白米</span>，升糖更平缓',
            '适量食用<span class="highlight">肉桂</span>有助于改善胰岛素敏感性',
            '保持<span class="success">积极心态</span>，情绪稳定血糖也稳定',
            '定期监测血糖，<span class="highlight">发现规律</span>更好控糖',
            '避免<span class="warning">含糖饮料</span>，选择白水或茶',
            '坚果是优质零食，<span class="highlight">每天一小把</span>即可',
            '苹果、柚子是<span class="success">低糖水果</span>的好选择',
            '减少<span class="warning">加工食品</span>摄入，选择天然食材'
        ];

        // 随机打乱并选择
        if (insights.length === 0 || Math.random() > 0.6) {
            const randomTip = generalTips[Math.floor(Math.random() * generalTips.length)];
            if (insights.length === 0) {
                insights.push(randomTip);
            } else {
                // 40% 概率用通用贴士替换
                if (Math.random() > 0.5) {
                    insights[0] = randomTip;
                }
            }
        }

        // 随机选择一条返回
        return insights[Math.floor(Math.random() * insights.length)];
    }

    // 更新智能卡片
    function updateSmartCards(userData, allData) {
        const greetingText = document.getElementById('greeting-text');
        const greetingSub = document.getElementById('greeting-sub');
        const insightCard = document.getElementById('ai-insight');
        const insightContent = document.getElementById('insight-content');
        const insightTime = document.getElementById('insight-time');

        // 生成问候语
        const greeting = generateSmartGreeting(userData);
        typeWriter(greetingText, greeting.statusText, 25);
        setTimeout(() => {
            greetingSub.textContent = greeting.subText;
        }, greeting.statusText.length * 25 + 200);

        // 生成 AI 洞察
        const insight = generateAIInsight(userData, allData);
        if (insight) {
            setTimeout(() => {
                insightCard.style.display = 'block';
                insightContent.innerHTML = insight;
                insightTime.textContent = '刚刚更新';
            }, 1500);
        }
    }

    // 获取用户数据
    const fetchUserData = async () => {
        console.log('userHeight:', userHeight); // 应为 HTMLElement 或 null
console.log('userWeight:', userWeight);
console.log('userBloodSugar:', userBloodSugar);
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                console.log('获取用户数据失败，请稍后重试')
                showError('获取用户数据失败，请稍后重试');
                // window.location.href = 'login.html'; // 重定向到登录页面
                return; // 确保在错误时返回
            }

            const data = await response.json();
            const user = data[0]; // 假设只使用第一个用户数据
            console.log(user)
            const firstSevenData = data.slice(0, 7);

            // 更新智能卡片
            updateSmartCards(user, data);

            userHeight.textContent = `${user.height} cm`;
            userWeight.textContent = `${user.weight} kg`;
            userBloodSugar.textContent = `${user.blood_suger} mmol/L`;
            
            // 预填充表单中的身高体重（血糖留空让用户填写新值）
            document.getElementById('form-height').value = user.height || '';
            document.getElementById('form-weight').value = user.weight || '';
            document.getElementById('form-blood-sugar').value = ''; // 血糖留空
            
            // 判断血糖状态
            if (user.blood_suger < 4) {
                bloodSugarStatus.textContent = '低血糖';
                bloodSugarStatus.className = 'status-badge status-warning';
                bloodSugarTip.textContent = '血糖偏低，请注意补充糖分。';
            } else if (user.blood_suger <= 6.1) {
                bloodSugarStatus.textContent = '健康';
                bloodSugarStatus.className = 'status-badge status-normal';
                bloodSugarTip.textContent = '空腹血糖在正常范围内';
            } else {
                bloodSugarStatus.textContent = '高血糖';
                bloodSugarStatus.className = 'status-badge status-danger';
                bloodSugarTip.textContent = '血糖偏高，请注意饮食。';
            }

            const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1);
            userBmi.textContent = bmi;
            if (bmi < 18.5) {
                bmiStatus.textContent = '偏瘦';
                bmiStatus.className = 'status-badge status-warning';
                bmiTip.textContent = '体重偏低，建议增重。';
            } else if (bmi < 24.9) {
                bmiStatus.textContent = '标准体重';
                bmiStatus.className = 'status-badge status-normal';
                bmiTip.textContent = '身体质量指数正常';
            } else {
                bmiStatus.textContent = '超重';
                bmiStatus.className = 'status-badge status-danger';
                bmiTip.textContent = '体重偏高，建议减重。';
            }
            drawBloodSugarTrend(firstSevenData); // 绘制血糖趋势图
        } catch (error) {
            console.log(`${API_BASE_URL}/app/user_detail/`)
            // showError('获取用户数据失败，请稍后重试');
            
            // window.location.href = 'login.html'; // 重定向到登录页面
        }
    };

    // 获取血糖记录
    const fetchBloodSugarLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/BloodSugarLog/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                showError('获取血糖记录失败，请稍后重试');
                // window.location.href = 'login.html'; // 重定向到登录页面
                return; // 确保在错误时返回
            }

            const logs = await response.json();
            displayBloodSugarLogs(logs);
            
            // 每天只显示一次欢迎提示
            const today = new Date().toDateString();
            const lastWelcomeDate = localStorage.getItem('lastWelcomeDate');
            if (lastWelcomeDate !== today) {
                showSuccess('欢迎进入,新用户登录送10点数');
                localStorage.setItem('lastWelcomeDate', today);
            }
        } catch (error) {
            // showError('获取血糖记录失败，请稍后重试');
            // window.location.href = 'login.html'; // 重定向到登录页面
        }
    };

    // 绘制血糖趋势图
    const drawBloodSugarTrend = (logs) => {
        
        // 取最近7条记录并按时间排序
        const recentLogs = logs.sort((a, b) => new Date(a.create_date) - new Date(b.create_date)).slice(0, 7);

        
        const times = recentLogs.map(log => new Date(log.create_date).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
        const glucoseLevels = recentLogs.map(log => log.blood_suger); // 假设使用餐前血糖
    
        const chartDom = document.getElementById('blood-sugar-trend-chart');
        const myChart = echarts.init(chartDom);
    
        const option = {
            title: {
                text: '近7次血糖变化趋势',
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#1D1D1F'
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#eee',
                borderWidth: 1,
                textStyle: {
                    color: '#1D1D1F'
                }
            },
            grid: {
                left: 50,
                right: 20,
                top: 60,
                bottom: 40,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: times,
                name: '时间',
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                    color: '#86868B',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5'
                    }
                },
                axisLabel: {
                    color: '#86868B',
                    fontSize: 11,
                    rotate: 0
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: '血糖 (mmol/L)',
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#86868B',
                    fontSize: 12
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#86868B',
                    fontSize: 11
                },
                splitLine: {
                    lineStyle: {
                        color: '#F0F0F0',
                        type: 'dashed'
                    }
                }
            },
            series: [{
                data: glucoseLevels,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#007AFF'
                },
                lineStyle: {
                    width: 2,
                    color: '#007AFF'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(0, 122, 255, 0.15)'
                        }, {
                            offset: 1,
                            color: 'rgba(0, 122, 255, 0.01)'
                        }]
                    }
                }
            }]
        };
    
        // 设置图表
        myChart.setOption(option);
    
        // 监听窗口大小变化，动态调整图表大小
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    };

    // 添加血糖记录
    const addBloodSugarLog = async (logData) => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/BloodSugarLog/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(logData)
            });

            if (!response.ok) {
                showError('添加血糖记录失败，请稍后重试');
                return; // 确保在错误时返回
            }

            const result = await response.json();
            showSuccess('血糖记录添加成功！');
            fetchBloodSugarLogs(); // 重新获取记录
        } catch (error) {
            showError('添加血糖记录失败，请稍后重试');
        }
    };

    // 显示血糖记录的函数
    const displayBloodSugarLogs = (logs) => {
        const logContainer = document.getElementById('blood-sugar-log-container'); // 假设有一个容器来显示记录
        logContainer.innerHTML = ''; // 清空之前的记录

        // 只显示前3条记录
        const limitedLogs = logs.slice(0, 3);

        limitedLogs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
                <h4>${log.meal_time}</h4>
                <p>餐前: <span class="fasting-glucose">${log.fasting_glucose}</span></p>
                <p>餐后: <span class="postprandial-glucose">${log.postprandial_glucose}</span></p>
                <p>碳水: <span class="carbohydrates">${log.carbohydrates}</span> g</p>
            `;
            logContainer.appendChild(logElement);
        });
    };

    // 获取用药记录
    const fetchMedicationLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/MedicationLog/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                // showError('获取用药记录失败，请稍后重试');
                // window.location.href = 'login.html'; // 重定向到登录页面
                return; // 确保在错误时返回
            }

            const logs = await response.json();
            displayMedicationLogs(logs);
            
        } catch (error) {
            // showError('获取用药记录失败，请稍后重试');
            // window.location.href = 'login.html'; // 重定向到登录页面
        }
    };

    // 显示用药记录的函数
    const displayMedicationLogs = (logs) => {
        const logContainer = document.getElementById('medication-log-container'); // 假设有一个容器来显示记录
        if (!logContainer) {
            console.error('找不到用药记录容器');
            return; // 如果容器不存在，直接返回
        }
        
        logContainer.innerHTML = ''; // 清空之前的记录

        // 只显示前3条记录
        const limitedLogs = logs.slice(0, 3);

        limitedLogs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-entry';
            logElement.innerHTML = `
                <h4>${log.medication_name}--${log.medication_type}--${log.dosage}mg</h4>
                
                <p>${new Date(log.medication_time).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
            `;
            logContainer.appendChild(logElement);
        });
    };

    // 获取运动记录
    const fetchExerciseLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/ExerciseLog/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                showError('获取运动记录失败，请稍后重试');
                // window.location.href = 'login.html'; // 重定向到登录页面
                return; // 确保在错误时返回
            }

            const logs = await response.json();
            displayExerciseLogs(logs); // 显示运动记录
        } catch (error) {
            showError('获取运动记录失败，请稍后重试');
            // window.location.href = 'login.html'; // 重定向到登录页面
        }
    };

    // 显示运动记录的函数
    const displayExerciseLogs = (logs) => {
        const logContainer = document.querySelector('.exercise-list'); // 假设有一个容器来显示记录
        logContainer.innerHTML = ''; // 清空之前的记录

        // 只显示前5条记录
        const limitedLogs = logs.slice(0, 5);

        limitedLogs.forEach(log => {
            const logElement = document.createElement('li');
            logElement.innerHTML = `
                <span>${log.exercise_program}--${log.intensity}</span>
                <span>${log.duration}分钟</span>
            `;
            logContainer.appendChild(logElement);
        });
    };

    // 初始化数据
    fetchUserData();

    // 初始化时获取血糖记录
    fetchBloodSugarLogs();

    // 初始化时获取用药记录
    fetchMedicationLogs();

    // 初始化时获取运动记录
    fetchExerciseLogs();

    // 初始化用药提醒
    initMedicationReminder();

    // 初始化血糖目标
    initBloodSugarGoal();

    // 点击 header 显示模态框
    header.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // 点击遮罩层隐藏模态框
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 提交用户数据
    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedData = {
            height: parseFloat(document.getElementById('form-height').value),
            weight: parseFloat(document.getElementById('form-weight').value),
            blood_suger: parseFloat(document.getElementById('form-blood-sugar').value),
        };

        try {
            const token = localStorage.getItem('token'); // 获取存储的token
            const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                showSuccess('用户数据提交成功！');
                fetchUserData();
                modal.style.display = 'none';
            } else {
                showError('用户数据提交失败，请稍后重试');
            }
        } catch (error) {
            showError('用户数据提交失败，请稍后重试');
        }
    });

    // 添加血糖记录的事件处理
    document.getElementById('add-blood-sugar-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const mealTime = document.getElementById('meal-time').value;
        const fastingGlucose = parseFloat(document.getElementById('fasting-glucose').value);
        const postprandialGlucose = parseFloat(document.getElementById('postprandial-glucose').value);
        const carbohydrates = parseFloat(document.getElementById('carbohydrates').value);

        const logData = {
            meal_time: mealTime,
            fasting_glucose: fastingGlucose,
            postprandial_glucose: postprandialGlucose,
            carbohydrates: carbohydrates
        };

        await addBloodSugarLog(logData); // 调用添加记录的函数
        document.getElementById('add-blood-sugar-modal').style.display = 'none'; // 关闭模态框
    });

    // 点击添加血糖记录按钮显示模态框
    document.querySelector('.add-btn1').addEventListener('click', () => {
        document.getElementById('add-blood-sugar-modal').style.display = 'flex';
    });

    // 点击关闭按钮隐藏血糖记录模态框
    document.getElementById('close-add-btn').addEventListener('click', () => {
        document.getElementById('add-blood-sugar-modal').style.display = 'none';
    });

    // 添加用药记录的函数
    const addMedicationLog = async (logData) => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/MedicationLog/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(logData)
            });

            if (!response.ok) {
                showError('添加用药记录失败，请稍后重试');
                return;
            }

            const result = await response.json();
            console.log('添加用药记录返回值:', result);
            showSuccess('用药记录添加成功！');
            fetchMedicationLogs(); // 重新获取记录
        } catch (error) {
            console.error('添加用药记录失败:', error);
            showError('添加用药记录失败，请稍后重试');
        }
    };

    // 添加用药记录的事件处理
    document.getElementById('add-medication-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const medicationType = document.getElementById('medication-type').value;
        const medicationName = document.getElementById('medication-name').value;
        const medicationTime = document.getElementById('medication-time').value;
        const dosage = parseFloat(document.getElementById('dosage').value);

        const medicationData = {
            medication_type: medicationType,
            medication_name: medicationName,
            medication_time: medicationTime,
            dosage: dosage
        };

        await addMedicationLog(medicationData); // 调用添加记录的函数
        document.getElementById('add-medication-modal').style.display = 'none'; // 关闭模态框
    });

    // 点击添加用药记录按钮显示模态框
    document.querySelector('.add-medication-btn').addEventListener('click', () => {
        document.getElementById('add-medication-modal').style.display = 'flex';
    });

    // 点击关闭按钮隐藏用药记录模态框
    document.getElementById('close-medication-btn').addEventListener('click', () => {
        document.getElementById('add-medication-modal').style.display = 'none';
    });

    // 添加运动记录的函数
    const addExerciseLog = async (logData) => {
        try {
            const token = localStorage.getItem('token'); // 从localStorage获取token
            const response = await fetch(`${API_BASE_URL}/app/ExerciseLog/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(logData)
            });

            if (!response.ok) {
                showError('添加运动记录失败，请稍后重试');
                return; // 确保在错误时返回
            }

            const result = await response.json();
            showSuccess('运动记录添加成功！');
            fetchExerciseLogs(); // 重新获取记录
        } catch (error) {
            showError('添加运动记录失败，请稍后重试');
        }
    };

    // 添加运动记录的事件处理
    document.getElementById('add-exercise-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const exerciseProgram = document.getElementById('exercise-program').value;
        const intensity = document.getElementById('intensity').value;
        const exerciseTime = document.getElementById('exercise-time').value;
        const duration = parseFloat(document.getElementById('duration').value);

        const exerciseData = {
            exercise_program: exerciseProgram,
            intensity: intensity,
            exercise_time: exerciseTime,
            duration: duration
        };

        await addExerciseLog(exerciseData); // 调用添加记录的函数
        document.getElementById('add-exercise-modal').style.display = 'none'; // 关闭模态框
    });

    // 点击添加运动按钮显示模态框
    document.querySelector('.add-btn3').addEventListener('click', () => {
        document.getElementById('add-exercise-modal').style.display = 'flex';
    });

    // 点击关闭按钮隐藏运动记录模态框
    document.getElementById('close-exercise-btn').addEventListener('click', () => {
        document.getElementById('add-exercise-modal').style.display = 'none';
    });

    // 点击记录容器跳转详情页
    document.getElementById('blood-sugar-log-container').addEventListener('click', (e) => {
        if (!e.target.closest('.add-btn1')) {
            window.open('BloodSugarLog_detail.html', '_blank');
        }
    });
    document.getElementById('medication-log-container').addEventListener('click', (e) => {
        if (!e.target.closest('.add-medication-btn')) {
            window.open('MedicationLog_detail.html', '_blank');
        }
    });
    document.getElementById('exercise-list').addEventListener('click', (e) => {
        if (!e.target.closest('.add-btn3')) {
            window.open('ExerciseLog_detail.html', '_blank');
        }
    });
});


// ========================================
// 用药提醒功能
// ========================================
function initMedicationReminder() {
    const reminderList = document.getElementById('reminder-list');
    const reminderEmpty = document.getElementById('reminder-empty');
    const reminderDate = document.getElementById('reminder-date');
    
    if (!reminderList) return;
    
    // 显示今日日期
    const today = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    reminderDate.textContent = `${today.getMonth() + 1}月${today.getDate()}日 ${weekdays[today.getDay()]}`;
    
    // 从 localStorage 获取用药计划
    let medicationPlan = JSON.parse(localStorage.getItem('medicationPlan')) || [];
    
    // 如果没有计划，使用默认示例
    if (medicationPlan.length === 0) {
        medicationPlan = [
            { id: 1, name: '二甲双胍', dosage: '500mg', time: '08:00', period: '早餐后', completed: false },
            { id: 2, name: '格列美脲', dosage: '2mg', time: '12:00', period: '午餐前', completed: false },
            { id: 3, name: '二甲双胍', dosage: '500mg', time: '18:00', period: '晚餐后', completed: false }
        ];
        localStorage.setItem('medicationPlan', JSON.stringify(medicationPlan));
    }
    
    // 获取今日完成状态
    const todayKey = `medication_${today.toDateString()}`;
    const todayStatus = JSON.parse(localStorage.getItem(todayKey)) || {};
    
    // 渲染用药列表
    renderMedicationReminder(medicationPlan, todayStatus);
}

function renderMedicationReminder(plan, todayStatus) {
    const reminderList = document.getElementById('reminder-list');
    const reminderEmpty = document.getElementById('reminder-empty');
    
    if (plan.length === 0) {
        reminderList.style.display = 'none';
        reminderEmpty.style.display = 'block';
        return;
    }
    
    reminderList.style.display = 'flex';
    reminderEmpty.style.display = 'none';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    reminderList.innerHTML = plan.map(item => {
        const [hours, minutes] = item.time.split(':').map(Number);
        const itemTime = hours * 60 + minutes;
        const isCompleted = todayStatus[item.id] || false;
        const isUpcoming = !isCompleted && Math.abs(itemTime - currentTime) <= 30;
        
        return `
            <div class="reminder-item ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}">
                <div class="reminder-time-badge">
                    <span class="time">${item.time}</span>
                    <span class="period">${item.period}</span>
                </div>
                <div class="reminder-info">
                    <div class="reminder-name">${item.name}</div>
                    <div class="reminder-dosage">${item.dosage}</div>
                </div>
                <div class="reminder-status ${isCompleted ? 'done' : 'pending'}" onclick="toggleMedicationStatus(${item.id})">
                    ${isCompleted ? `
                        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        已服用
                    ` : '标记完成'}
                </div>
            </div>
        `;
    }).join('');
}

function toggleMedicationStatus(id) {
    const today = new Date();
    const todayKey = `medication_${today.toDateString()}`;
    const todayStatus = JSON.parse(localStorage.getItem(todayKey)) || {};
    
    todayStatus[id] = !todayStatus[id];
    localStorage.setItem(todayKey, JSON.stringify(todayStatus));
    
    const medicationPlan = JSON.parse(localStorage.getItem('medicationPlan')) || [];
    renderMedicationReminder(medicationPlan, todayStatus);
    
    if (todayStatus[id]) {
        showSuccess('已标记为已服用 ✓');
    }
}

// ========================================
// 血糖目标功能
// ========================================
async function initBloodSugarGoal() {
    const token = localStorage.getItem('token');
    let goalSettings = {
        min: 3.9,
        max: 6.1,
        postprandial: 7.8,
        targetDays: 6,
        achievedDays: 0
    };

    // 从后端API获取目标
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/goals/blood-sugar-goal/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.status && result.data) {
                    goalSettings = {
                        min: result.data.fasting_min || 3.9,
                        max: result.data.fasting_max || 6.1,
                        postprandial: result.data.postprandial_max || 7.8,
                        targetDays: result.data.target_days || 6,
                        achievedDays: result.data.achieved_days || 0
                    };
                }
            }
        } catch (error) {
            console.log('获取血糖目标失败，使用默认值');
        }
    }

    // 同步到localStorage
    localStorage.setItem('bloodSugarGoal', JSON.stringify(goalSettings));
    
    // 更新目标范围显示
    document.getElementById('goal-range').textContent = `${goalSettings.min}-${goalSettings.max}`;
    document.getElementById('goal-total').textContent = goalSettings.targetDays;
    
    // 计算本周达标情况
    calculateWeeklyGoal(goalSettings);
    
    // 初始化目标设置表单
    initGoalForm(goalSettings);
}

function calculateWeeklyGoal(settings) {
    // 获取本周的周一日期作为key
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const weekKey = `weekGoalData_${monday.toDateString()}`;
    
    // 从 localStorage 获取本周达标数据
    let weekGoalData = JSON.parse(localStorage.getItem(weekKey));
    
    // 如果没有本周数据，初始化
    if (!weekGoalData) {
        weekGoalData = {
            weekStart: monday.toDateString(),
            dailyStatus: {}, // { '日期字符串': { achieved: true/false, fasting: 5.2 } }
            achievedDays: 0
        };
        localStorage.setItem(weekKey, JSON.stringify(weekGoalData));
    }
    
    // 计算达标天数
    const achievedDays = Object.values(weekGoalData.dailyStatus).filter(d => d.achieved).length;
    
    // 更新显示
    const percent = settings.targetDays > 0 ? Math.round((achievedDays / settings.targetDays) * 100) : 0;
    document.getElementById('goal-achieved').textContent = achievedDays;
    document.getElementById('goal-percent').textContent = `${Math.min(percent, 100)}%`;
    
    // 更新进度环
    const progressRing = document.getElementById('goal-progress-ring');
    if (progressRing) {
        const circumference = 2 * Math.PI * 42; // r=42
        const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
        
        // 根据达标率改变颜色
        if (percent >= 100) {
            progressRing.style.stroke = '#34C759';
            document.getElementById('goal-percent').style.color = '#34C759';
        } else if (percent >= 70) {
            progressRing.style.stroke = '#007AFF';
            document.getElementById('goal-percent').style.color = '#007AFF';
        } else {
            progressRing.style.stroke = '#FF9500';
            document.getElementById('goal-percent').style.color = '#FF9500';
        }
    }
    
    // 尝试从API获取血糖数据并更新本周达标情况
    updateWeeklyGoalFromAPI(settings, weekKey);
}

// 从API获取数据更新本周达标情况
async function updateWeeklyGoalFromAPI(settings, weekKey) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/app/user_detail/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (!data || data.length === 0) return;
        
        // 获取本周数据
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        
        let weekGoalData = JSON.parse(localStorage.getItem(weekKey)) || {
            weekStart: monday.toDateString(),
            dailyStatus: {},
            achievedDays: 0
        };
        
        // 分析每天的血糖数据
        data.forEach(record => {
            const recordDate = new Date(record.create_date || record.created_at);
            if (recordDate >= monday) {
                const dateKey = recordDate.toDateString();
                const fasting = record.blood_suger || record.fasting_glucose;
                
                if (fasting) {
                    const achieved = fasting >= settings.min && fasting <= settings.max;
                    // 只更新如果这天还没有记录，或者新记录更好
                    if (!weekGoalData.dailyStatus[dateKey] || achieved) {
                        weekGoalData.dailyStatus[dateKey] = {
                            achieved: achieved,
                            fasting: fasting
                        };
                    }
                }
            }
        });
        
        // 重新计算达标天数
        weekGoalData.achievedDays = Object.values(weekGoalData.dailyStatus).filter(d => d.achieved).length;
        
        // 保存更新后的数据
        localStorage.setItem(weekKey, JSON.stringify(weekGoalData));
        
        // 更新显示
        const percent = settings.targetDays > 0 ? Math.round((weekGoalData.achievedDays / settings.targetDays) * 100) : 0;
        document.getElementById('goal-achieved').textContent = weekGoalData.achievedDays;
        document.getElementById('goal-percent').textContent = `${Math.min(percent, 100)}%`;
        
        // 更新进度环
        const progressRing = document.getElementById('goal-progress-ring');
        if (progressRing) {
            const circumference = 2 * Math.PI * 42;
            const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
            
            if (percent >= 100) {
                progressRing.style.stroke = '#34C759';
                document.getElementById('goal-percent').style.color = '#34C759';
            } else if (percent >= 70) {
                progressRing.style.stroke = '#007AFF';
                document.getElementById('goal-percent').style.color = '#007AFF';
            } else {
                progressRing.style.stroke = '#FF9500';
                document.getElementById('goal-percent').style.color = '#FF9500';
            }
        }
    } catch (error) {
        console.log('获取血糖数据失败，使用本地缓存');
    }
}

function initGoalForm(settings) {
    document.getElementById('goal-min').value = settings.min;
    document.getElementById('goal-max').value = settings.max;
    document.getElementById('goal-postprandial').value = settings.postprandial;
    
    // 天数选择器
    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.days) === settings.targetDays) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 表单提交
    document.getElementById('goal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newSettings = {
            min: parseFloat(document.getElementById('goal-min').value),
            max: parseFloat(document.getElementById('goal-max').value),
            postprandial: parseFloat(document.getElementById('goal-postprandial').value),
            targetDays: parseInt(document.querySelector('.day-btn.active').dataset.days)
        };
        
        // 保存到后端
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/goals/blood-sugar-goal/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fasting_min: newSettings.min,
                        fasting_max: newSettings.max,
                        postprandial_max: newSettings.postprandial,
                        target_days: newSettings.targetDays
                    })
                });
            } catch (error) {
                console.log('保存血糖目标失败');
            }
        }
        
        localStorage.setItem('bloodSugarGoal', JSON.stringify(newSettings));
        
        // 更新显示
        document.getElementById('goal-range').textContent = `${newSettings.min}-${newSettings.max}`;
        document.getElementById('goal-total').textContent = newSettings.targetDays;
        calculateWeeklyGoal(newSettings);
        
        closeGoalModal();
        showSuccess('血糖目标已更新！');
    });
}

function openGoalModal() {
    document.getElementById('goal-modal').style.display = 'flex';
}

function closeGoalModal() {
    document.getElementById('goal-modal').style.display = 'none';
}


// ========================================
// 每日健康知识功能（从后端API获取）
// ========================================
let currentHealthTip = null;

async function initHealthTip() {
    const today = new Date().toDateString();
    const savedTip = localStorage.getItem('dailyHealthTip');
    const savedDate = localStorage.getItem('dailyHealthTipDate');
    
    // 如果是今天已经显示过的，使用保存的
    if (savedDate === today && savedTip) {
        currentHealthTip = JSON.parse(savedTip);
        displayHealthTip(currentHealthTip);
    } else {
        // 新的一天，从后端获取
        await fetchHealthTipFromAPI();
    }
}

async function fetchHealthTipFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/tools/health-tip/`);
        if (response.ok) {
            const result = await response.json();
            if (result.status && result.data) {
                currentHealthTip = {
                    id: result.data.id,
                    text: result.data.content,
                    likes: result.data.likes || 0
                };
                localStorage.setItem('dailyHealthTip', JSON.stringify(currentHealthTip));
                localStorage.setItem('dailyHealthTipDate', new Date().toDateString());
                displayHealthTip(currentHealthTip);
                return;
            }
        }
    } catch (error) {
        console.log('获取健康知识失败，使用本地数据');
    }
    
    // 后端获取失败，使用本地备用数据
    const fallbackTips = [
        { id: 1, text: '餐后散步15-30分钟可以有效降低血糖峰值。', likes: 128 },
        { id: 2, text: '选择低GI食物可以让血糖上升更平缓。', likes: 256 },
        { id: 3, text: '每天保持7-8小时睡眠有助于改善胰岛素敏感性。', likes: 189 }
    ];
    currentHealthTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    displayHealthTip(currentHealthTip);
}

function displayHealthTip(tip) {
    const tipText = document.getElementById('tip-text');
    const likeCount = document.getElementById('tip-like-count');
    
    if (tipText) tipText.textContent = tip.text;
    if (likeCount) likeCount.textContent = tip.likes;
    
    // 检查是否已点赞
    const likedTips = JSON.parse(localStorage.getItem('likedHealthTips')) || [];
    const likeBtn = document.querySelector('.tip-action-btn');
    if (likeBtn) {
        likeBtn.classList.toggle('liked', likedTips.includes(tip.id));
    }
}

async function refreshHealthTip() {
    // 刷新动画
    const tipCard = document.getElementById('health-tip-card');
    tipCard.style.animation = 'none';
    tipCard.offsetHeight;
    tipCard.style.animation = 'tipRefresh 0.5s ease';
    
    // 从后端获取新的健康知识
    await fetchHealthTipFromAPI();
}

async function likeHealthTip() {
    if (!currentHealthTip) return;
    
    const likedTips = JSON.parse(localStorage.getItem('likedHealthTips')) || [];
    const likeBtn = document.querySelector('.tip-action-btn');
    const likeCount = document.getElementById('tip-like-count');
    
    if (likedTips.includes(currentHealthTip.id)) {
        // 取消点赞
        const index = likedTips.indexOf(currentHealthTip.id);
        likedTips.splice(index, 1);
        currentHealthTip.likes--;
        likeBtn.classList.remove('liked');
    } else {
        // 点赞 - 同步到后端
        likedTips.push(currentHealthTip.id);
        currentHealthTip.likes++;
        likeBtn.classList.add('liked');
        
        try {
            await fetch(`${API_BASE_URL}/tools/health-tip/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentHealthTip.id })
            });
        } catch (error) {
            console.log('点赞同步失败');
        }
    }
    
    localStorage.setItem('likedHealthTips', JSON.stringify(likedTips));
    localStorage.setItem('dailyHealthTip', JSON.stringify(currentHealthTip));
    likeCount.textContent = currentHealthTip.likes;
}

function shareHealthTip() {
    if (!currentHealthTip) return;
    
    const shareText = `【健康小知识】${currentHealthTip.text} —— 来自血糖管理助手`;
    
    if (navigator.share) {
        navigator.share({ title: '健康小知识', text: shareText });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccess('已复制到剪贴板，快去分享吧！');
        });
    }
}

// ========================================
// 快捷记录浮动按钮功能
// ========================================
function toggleFabMenu() {
    const fabContainer = document.getElementById('fab-container');
    fabContainer.classList.toggle('open');
}

function openAddModal(type) {
    // 关闭浮动菜单
    document.getElementById('fab-container').classList.remove('open');
    
    // 打开对应的模态框
    switch(type) {
        case 'blood-sugar':
            document.getElementById('add-blood-sugar-modal').style.display = 'flex';
            break;
        case 'medication':
            document.getElementById('add-medication-modal').style.display = 'flex';
            break;
        case 'exercise':
            document.getElementById('add-exercise-modal').style.display = 'flex';
            break;
    }
}

// 点击页面其他地方关闭浮动菜单
document.addEventListener('click', (e) => {
    const fabContainer = document.getElementById('fab-container');
    if (fabContainer && !fabContainer.contains(e.target)) {
        fabContainer.classList.remove('open');
    }
});

// 初始化健康知识卡片
document.addEventListener('DOMContentLoaded', () => {
    initHealthTip();
    initGlobalTheme();
});

// 全局主题初始化
function initGlobalTheme() {
    const savedTheme = localStorage.getItem('theme');
    const autoMode = localStorage.getItem('autoDarkMode') === 'true';
    
    if (autoMode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('autoDarkMode') === 'true') {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
    });
    
    // 监听其他页面的主题变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
}


// ========================================
// 每日打卡提醒功能
// ========================================
let checkinReminderData = null;
const MAX_DAILY_REMINDERS = 3; // 每天最多提醒3次

// 获取今日提醒次数
function getTodayReminderCount() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('checkinReminderCount') || '{}');
    if (data.date !== today) {
        return 0;
    }
    return data.count || 0;
}

// 增加今日提醒次数
function incrementReminderCount() {
    const today = new Date().toDateString();
    const count = getTodayReminderCount() + 1;
    localStorage.setItem('checkinReminderCount', JSON.stringify({ date: today, count: count }));
}

// 检查今日是否已打卡
async function checkTodayCheckin() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // 检查今天提醒次数是否已达上限
    if (getTodayReminderCount() >= MAX_DAILY_REMINDERS) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/checkin/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.status && data.data) {
            checkinReminderData = data.data;
            
            // 如果今天还没打卡，立即显示提醒
            if (!data.data.today_checked) {
                showCheckinReminder();
                incrementReminderCount();
            }
        }
    } catch (error) {
        console.log('获取打卡状态失败:', error);
    }
}

// 显示打卡提醒弹窗
function showCheckinReminder() {
    const modal = document.getElementById('checkin-reminder-modal');
    if (!modal) return;
    
    // 更新弹窗内容
    if (checkinReminderData) {
        const rewardNum = document.getElementById('reminder-reward-num');
        const streakDays = document.getElementById('reminder-streak-days');
        
        if (rewardNum) rewardNum.textContent = checkinReminderData.expected_reward || 2;
        if (streakDays) streakDays.textContent = checkinReminderData.current_streak || 0;
    }
    
    modal.classList.add('show');
}

// 关闭打卡提醒弹窗
function closeCheckinReminder() {
    const modal = document.getElementById('checkin-reminder-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 从提醒弹窗执行打卡
async function doCheckinFromReminder() {
    const btn = document.getElementById('reminder-checkin-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>打卡中...</span>';
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/checkin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.status) {
            // 关闭提醒弹窗
            closeCheckinReminder();
            
            // 显示成功弹窗
            const successModal = document.getElementById('checkin-success-modal');
            const streakDays = document.getElementById('success-streak-days');
            const rewardNum = document.getElementById('success-reward-num');
            const bonusEl = document.getElementById('success-bonus');
            
            if (streakDays) streakDays.textContent = data.data.streak_days;
            if (rewardNum) rewardNum.textContent = data.data.reward;
            
            // 显示额外奖励提示
            if (bonusEl) {
                if (data.data.is_streak_7) {
                    bonusEl.textContent = '🎁 连续7天额外奖励 +5 糖豆！';
                    bonusEl.style.display = 'inline-block';
                } else if (data.data.is_streak_30) {
                    bonusEl.textContent = '🏆 连续30天超级奖励 +20 糖豆！';
                    bonusEl.style.display = 'inline-block';
                } else {
                    bonusEl.style.display = 'none';
                }
            }
            
            if (successModal) {
                successModal.classList.add('show');
            }
            
        } else {
            showError(data.data || '打卡失败，请重试');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span class="btn-icon">👆</span><span>立即打卡</span>';
            }
        }
    } catch (error) {
        console.error('打卡失败:', error);
        showError('打卡失败，请重试');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span class="btn-icon">👆</span><span>立即打卡</span>';
        }
    }
}

// 关闭打卡成功弹窗
function closeCheckinSuccess() {
    const modal = document.getElementById('checkin-success-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 页面加载后立即检查打卡状态
document.addEventListener('DOMContentLoaded', () => {
    checkTodayCheckin();
});

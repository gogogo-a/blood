let currentPage = 1;
let isLoading = false;
let hasMorePages = true;
let currentFilter = 'all';

// 订单统计
let orderStats = {
    total: 0,
    pending: 0,
    completed: 0
};

async function fetchUserOrders(page) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/payments/list/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        showError("获取订单信息失败，请重试");
    }
}

async function loadOrders() {
    if (isLoading || !hasMorePages) return;

    isLoading = true;
    const data = await fetchUserOrders(currentPage);

    if (data) {
        displayOrders(data.results);
        currentPage++;
        isLoading = false;

        hasMorePages = !!data.next;
        document.getElementById('load-more-btn').style.display = hasMorePages ? 'inline-flex' : 'none';
        
        // 更新统计
        updateStats(data.results);
        
        // 检查是否为空
        checkEmptyState();
    }
}

function updateStats(orders) {
    orders.forEach(order => {
        orderStats.total++;
        if (order.order_status === 0) {
            orderStats.pending++;
        } else if (order.order_status === 1) {
            orderStats.completed++;
        }
    });
    
    document.getElementById('totalOrders').textContent = orderStats.total;
    document.getElementById('pendingOrders').textContent = orderStats.pending;
    document.getElementById('completedOrders').textContent = orderStats.completed;
}

function checkEmptyState() {
    const ordersContainer = document.getElementById('order-container');
    const emptyState = document.getElementById('empty-state');
    const loadingMore = document.getElementById('loading-more');
    
    if (ordersContainer.children.length === 0) {
        emptyState.style.display = 'block';
        loadingMore.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
    }
}

function getStatusText(status) {
    switch(status) {
        case 0: return '待支付';
        case 1: return '已完成';
        case 2: return '已取消';
        case 3: return '已超时';
        default: return '未知';
    }
}

function getStatusClass(status) {
    switch(status) {
        case 0: return 'pending';
        case 1: return 'completed';
        case 2: 
        case 3: return 'cancelled';
        default: return '';
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('order-container');
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.id = `order-${order.id}`;
        orderElement.dataset.status = order.order_status;
        
        // 格式化时间
        let timeStr = '';
        if (order.created_at) {
            const date = new Date(order.created_at);
            timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        
        // 订单类型
        const typeText = order.charge_type === 1 ? '充值' : '消费';
        const payTypeText = order.pay_type === 0 ? '支付宝' : '微信';
        
        orderElement.innerHTML = `
            <div class="order-info">
                <div class="order-header">
                    <span class="order-id">${typeText} · ${order.charge_type === 1 ? payTypeText : (order.memo || '服务消费')}</span>
                    <span class="order-status ${getStatusClass(order.order_status)}">${getStatusText(order.order_status)}</span>
                </div>
                <div class="order-details">
                    <span class="order-amount">${order.charge_type === 1 ? '+' : ''}¥${Math.abs(parseFloat(order.amount)).toFixed(2)}</span>
                    <span class="order-time">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${timeStr}
                    </span>
                    <span class="order-oid" style="display:none;">${order.order_oid}</span>
                </div>
            </div>
            <div class="order-actions">
                ${order.order_status === 0 && order.charge_type === 1 ? `
                    <button class="action-btn pay-button" onclick="handlePay(${order.id})">立即支付</button>
                    <button class="action-btn cancel-button" onclick="handleCancel(${order.id})">取消</button>
                ` : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderElement);
    });
    
    // 应用当前筛选
    applyFilter(currentFilter);
}

// 筛选功能
function applyFilter(filter) {
    currentFilter = filter;
    const orders = document.querySelectorAll('.order-item');
    
    orders.forEach(order => {
        const status = parseInt(order.dataset.status);
        let show = false;
        
        switch(filter) {
            case 'all':
                show = true;
                break;
            case 'pending':
                show = status === 0;
                break;
            case 'completed':
                show = status === 1;
                break;
            case 'cancelled':
                show = status === 2 || status === 3;
                break;
        }
        
        order.style.display = show ? 'flex' : 'none';
    });
}

// 初始化筛选标签
document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyFilter(tab.dataset.filter);
    });
});

// 初始化加载
loadOrders();

// 加载更多按钮
document.getElementById('load-more-btn').addEventListener('click', loadOrders);

// 滚动加载
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading && hasMorePages) {
        loadOrders();
    }
});

// 处理支付
async function handlePay(orderId) {
    try {
        const token = localStorage.getItem('token');
        const orderElement = document.getElementById(`order-${orderId}`);
        if (!orderElement) {
            throw new Error('订单未找到');
        }

        const orderOid = orderElement.querySelector('.order-oid').textContent;

        const payResponse = await fetch(`${API_BASE_URL}/payments/alipay/${orderOid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!payResponse.ok) {
            throw new Error('获取支付链接失败');
        }

        const payData = await payResponse.json();

        if (payData.link) {
            window.location.href = payData.link;
        } else {
            throw new Error('支付链接获取失败');
        }
    } catch (error) {
        console.error('Error:', error);
        showError("支付失败，订单可能已超时");
    }
}

// 处理取消
async function handleCancel(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/payments/${orderId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        showSuccess("取消订单成功");
        updateOrderStatus(orderId, 2);
        
        // 更新统计
        orderStats.pending--;
        document.getElementById('pendingOrders').textContent = orderStats.pending;

    } catch (error) {
        console.error('Error:', error);
        showError("取消订单失败，请重试");
    }
}

function updateOrderStatus(orderId, status) {
    const orderElement = document.getElementById(`order-${orderId}`);
    if (orderElement) {
        orderElement.dataset.status = status;
        
        const statusElement = orderElement.querySelector('.order-status');
        if (statusElement) {
            statusElement.textContent = getStatusText(status);
            statusElement.className = `order-status ${getStatusClass(status)}`;
        }

        const orderActions = orderElement.querySelector('.order-actions');
        if (orderActions) {
            orderActions.innerHTML = '';
        }
        
        // 重新应用筛选
        applyFilter(currentFilter);
    }
}
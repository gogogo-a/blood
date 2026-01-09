// 健康商城 - 动态数据版本

let products = [];
let allProducts = []; // 保存原始商品列表
let balance = 0;
let userId = null;
let currentProduct = null;
let currentSort = 'price-asc'; // 默认按价格从低到高
let searchKeyword = '';

// 从后端获取商品列表
async function fetchProducts(category = 'all') {
    try {
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/shop/products/`;
        if (category && category !== 'all') {
            url += `?category=${category}`;
        }
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status) {
            allProducts = data.data;
            filterAndSortProducts();
        }
    } catch (error) {
        console.error('获取商品失败:', error);
    }
}

// 过滤和排序商品
function filterAndSortProducts() {
    // 先过滤
    let filtered = allProducts;
    if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.brand.toLowerCase().includes(keyword) ||
            p.description.toLowerCase().includes(keyword)
        );
    }
    
    // 再排序
    switch (currentSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'sales':
            filtered.sort((a, b) => b.sold - a.sold);
            break;
    }
    
    products = filtered;
    renderProducts();
}

// 搜索处理
function handleSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    searchKeyword = input.value.trim();
    
    // 显示/隐藏清除按钮
    clearBtn.style.display = searchKeyword ? 'flex' : 'none';
    
    filterAndSortProducts();
}

// 清除搜索
function clearSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    input.value = '';
    searchKeyword = '';
    clearBtn.style.display = 'none';
    filterAndSortProducts();
}

// 切换排序菜单
function toggleSortMenu() {
    const menu = document.getElementById('sort-menu');
    menu.classList.toggle('show');
}

// 选择排序方式
function selectSort(sortType) {
    currentSort = sortType;
    
    // 更新UI
    const sortLabel = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');
    
    options.forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.sort === sortType) {
            opt.classList.add('active');
            sortLabel.textContent = opt.querySelector('span').textContent;
        }
    });
    
    // 关闭菜单
    document.getElementById('sort-menu').classList.remove('show');
    
    // 重新排序
    filterAndSortProducts();
}

// 点击其他地方关闭排序菜单
document.addEventListener('click', (e) => {
    const sortDropdown = document.querySelector('.sort-dropdown');
    if (sortDropdown && !sortDropdown.contains(e.target)) {
        document.getElementById('sort-menu').classList.remove('show');
    }
});

// 从后端获取余额
async function fetchBalance() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/app/user/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('获取余额失败, status:', response.status);
            throw new Error('获取余额失败');
        }

        const data = await response.json();
        console.log('profile响应:', data);
        
        if (data.user_data && data.user_data.balance !== undefined) {
            balance = parseFloat(data.user_data.balance) || 0;
            userId = data.user_data.id;
        } else {
            console.error('响应格式异常:', data);
            balance = 0;
        }
        updateBalanceDisplay();
    } catch (error) {
        console.error('获取余额失败:', error);
        balance = 0;
        updateBalanceDisplay();
    }
}

// 渲染商品
function renderProducts() {
    const grid = document.getElementById('products-grid');
    
    // 无搜索结果提示
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>未找到商品</h3>
                <p>${searchKeyword ? `没有找到"${searchKeyword}"相关商品` : '暂无商品'}</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => {
        const canBuy = balance >= product.price && product.stock > 0;
        let btnText = '购买';
        if (product.stock <= 0) {
            btnText = '已售罄';
        } else if (balance < product.price) {
            btnText = '糖豆不足';
        }
        
        return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.tag ? `<span class="product-tag ${product.tag_type}">${product.tag}</span>` : ''}
                ${product.emoji}
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-stats">
                    <span class="stock">库存 <em class="${product.stock <= 5 ? 'low-stock' : ''}">${product.stock}</em></span>
                    <span class="sold">已售 <em>${product.sold}</em></span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="buy-btn" onclick="openAddressModal(${product.id})" ${!canBuy ? 'disabled' : ''}>
                        ${btnText}
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// 更新糖豆显示
function updateBalanceDisplay() {
    document.getElementById('shop-balance').textContent = balance.toFixed(0);
}

// 打开地址填写弹窗
function openAddressModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock <= 0) {
        showError('商品已售罄');
        return;
    }
    
    if (balance < product.price) {
        showError('糖豆不足，请先充值');
        return;
    }
    
    currentProduct = product;
    
    document.getElementById('order-product').innerHTML = `
        <div class="product-emoji">${product.emoji}</div>
        <div class="product-detail">
            <h4>${product.brand} ${product.name}</h4>
            <p>${product.description}</p>
        </div>
    `;
    document.getElementById('order-price').innerHTML = `<span class="sugar-bean-icon">🍬</span>${product.price}`;
    
    document.getElementById('address-modal').classList.add('show');
}

// 关闭地址弹窗
function closeAddressModal() {
    document.getElementById('address-modal').classList.remove('show');
    currentProduct = null;
    document.getElementById('address-form').reset();
}

// 提交订单
async function submitOrder(e) {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    const name = document.getElementById('receiver-name').value.trim();
    const phone = document.getElementById('receiver-phone').value.trim();
    const address = document.getElementById('receiver-address').value.trim();
    
    if (!name) {
        showError('请输入收货人姓名');
        return;
    }
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        showError('请输入正确的手机号码');
        return;
    }
    if (!address) {
        showError('请输入收货地址');
        return;
    }
    
    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '处理中...';
    
    // 保存当前商品信息（因为closeAddressModal会清空currentProduct）
    const productInfo = { ...currentProduct };
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/shop/purchase/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: currentProduct.id,
                receiver_name: name,
                receiver_phone: phone,
                receiver_address: address
            })
        });
        
        const data = await response.json();
        console.log('购买响应:', data);
        
        if (data.status) {
            balance = data.data.balance;
            updateBalanceDisplay();
            
            closeAddressModal();
            
            document.getElementById('purchase-message').innerHTML = 
                `成功购买「${productInfo.brand} ${productInfo.name}」<br>收货人：${name}<br>地址：${address}`;
            document.getElementById('purchase-modal').classList.add('show');
            
            // 重新获取商品列表
            const activeTab = document.querySelector('.tab-btn.active');
            fetchProducts(activeTab ? activeTab.dataset.category : 'all');
            
            showSuccess('购买成功！');
        } else {
            showError(data.data || '购买失败');
        }
    } catch (error) {
        console.error('购买失败:', error);
        showError('购买失败，请重试');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '确认购买';
    }
}

// 关闭成功弹窗
function closePurchaseModal() {
    document.getElementById('purchase-modal').classList.remove('show');
}

// 分类切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fetchProducts(btn.dataset.category);
    });
});

// 表单提交
document.getElementById('address-form').addEventListener('submit', submitOrder);

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await fetchBalance();  // 先获取余额
    fetchProducts();       // 再获取商品列表
});


// ========================================
// 订单列表功能
// ========================================

let orders = [];

// 切换订单面板
function toggleOrdersPanel() {
    const panel = document.getElementById('orders-panel');
    const overlay = document.getElementById('orders-overlay');
    
    if (panel.classList.contains('show')) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        panel.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        fetchOrders();
    }
}

// 获取订单列表
async function fetchOrders() {
    const ordersList = document.getElementById('orders-list');
    
    // 显示加载状态
    ordersList.innerHTML = `
        <div class="orders-loading">
            <div class="orders-loading-spinner"></div>
            <span>加载中...</span>
        </div>
    `;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/shop/orders/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.status) {
            orders = data.data;
            renderOrders();
        } else {
            ordersList.innerHTML = `
                <div class="orders-empty">
                    <div class="orders-empty-icon">📦</div>
                    <h3>获取订单失败</h3>
                    <p>${data.data || '请稍后重试'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('获取订单失败:', error);
        ordersList.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon">😅</div>
                <h3>网络错误</h3>
                <p>请检查网络连接后重试</p>
            </div>
        `;
    }
}

// 渲染订单列表
function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon">🛒</div>
                <h3>暂无订单</h3>
                <p>快去商城选购健康好物吧</p>
            </div>
        `;
        return;
    }
    
    const statusMap = {
        'pending': { text: '待发货', class: 'pending' },
        'shipped': { text: '已发货', class: 'shipped' },
        'completed': { text: '已完成', class: 'completed' },
        'cancelled': { text: '已取消', class: 'cancelled' }
    };
    
    ordersList.innerHTML = orders.map(order => {
        const status = statusMap[order.status] || { text: '处理中', class: 'pending' };
        const orderTime = formatOrderTime(order.create_date);
        
        return `
            <div class="order-card">
                <div class="order-card-header">
                    <span class="order-no">订单号: ${order.order_no.slice(-12)}</span>
                    <span class="order-status ${status.class}">${status.text}</span>
                </div>
                <div class="order-card-body">
                    <div class="order-product-info">
                        <div class="order-product-emoji">${order.product_emoji || '📦'}</div>
                        <div class="order-product-detail">
                            <p class="order-product-brand">${order.product_brand || ''}</p>
                            <h4 class="order-product-name">${order.product_name}</h4>
                            <div class="order-product-price">
                                <span class="sugar-bean-icon">🍬</span>
                                ${order.price}
                            </div>
                        </div>
                    </div>
                    <div class="order-shipping">
                        <div class="order-shipping-row">
                            <span class="order-shipping-label">收货人</span>
                            <span class="order-shipping-value">${order.receiver_name}</span>
                        </div>
                        <div class="order-shipping-row">
                            <span class="order-shipping-label">电话</span>
                            <span class="order-shipping-value">${order.receiver_phone}</span>
                        </div>
                        <div class="order-shipping-row">
                            <span class="order-shipping-label">地址</span>
                            <span class="order-shipping-value">${order.receiver_address}</span>
                        </div>
                    </div>
                    <div class="order-card-footer">
                        <span class="order-time">${orderTime}</span>
                        <span class="order-total">实付 <em>${order.price}</em> 糖豆</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 格式化订单时间
function formatOrderTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) return '刚刚';
    // 小于1小时
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    // 小于24小时
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    // 小于7天
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
    
    // 超过7天显示具体日期
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

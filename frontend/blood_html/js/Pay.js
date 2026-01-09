let selectedAmount = null;
let selectedMethod = null;

// 赠送规则
const bonusRules = {
    50: 2,
    100: 5,
    300: 20,
    500: 40
};

// 页面加载时获取余额
document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
});

// 加载用户余额
async function loadBalance() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/app/user/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            const balance = parseFloat(data.user_data?.balance) || 0;
            document.getElementById('currentBalance').textContent = `¥${balance.toFixed(2)}`;
        }
    } catch (error) {
        console.error('获取余额失败:', error);
    }
}

// 计算赠送金额
function calculateBonus(amount) {
    if (amount >= 500) return 40;
    if (amount >= 300) return 20;
    if (amount >= 100) return 5;
    if (amount >= 50) return 2;
    return 0;
}

// 更新支付预览
function updatePayPreview() {
    const amount = selectedAmount || 0;
    const bonus = calculateBonus(amount);
    const total = amount + bonus;

    document.getElementById('previewAmount').textContent = `¥${amount}`;
    document.getElementById('previewBonus').textContent = `+¥${bonus}`;
    document.getElementById('previewTotal').textContent = `¥${total}`;
    
    const bonusRow = document.getElementById('bonusRow');
    bonusRow.style.display = bonus > 0 ? 'flex' : 'none';

    const btnAmount = document.getElementById('btnAmount');
    btnAmount.textContent = amount > 0 ? `¥${amount}` : '';
}

// 金额选择逻辑
document.querySelectorAll('.amount-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.amount-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        selectedAmount = parseFloat(item.dataset.amount);
        document.getElementById('customAmount').value = '';
        updatePayPreview();
        checkPaymentReady();
    });
});

// 自定义金额输入
document.getElementById('customAmount').addEventListener('input', (e) => {
    const value = e.target.value;
    if (value) {
        document.querySelectorAll('.amount-item').forEach(i => i.classList.remove('active'));
        selectedAmount = Math.min(Math.max(parseFloat(value) || 0, 0), 10000);
    } else {
        selectedAmount = null;
    }
    updatePayPreview();
    checkPaymentReady();
});

// 支付方式选择
document.querySelectorAll('.method-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.method-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        selectedMethod = item.dataset.type;
        checkPaymentReady();
    });
});

// 检查支付条件
function checkPaymentReady() {
    const button = document.getElementById('payButton');
    button.disabled = !(selectedAmount > 0 && selectedMethod !== null);
}

// 支付处理
document.getElementById('payButton').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const button = document.getElementById('payButton');
    const btnText = button.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    button.disabled = true;
    btnText.textContent = '处理中...';

    try {
        // 创建订单
        const orderResponse = await fetch(`${API_BASE_URL}/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: selectedAmount,
                pay_type: selectedMethod
            })
        });

        if (!orderResponse.ok) {
            throw new Error('订单创建失败');
        }

        const orderData = await orderResponse.json();

        // 获取支付链接
        const payResponse = await fetch(
            `${API_BASE_URL}/payments/alipay/${orderData.order_oid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const payData = await payResponse.json();

        // 跳转支付
        if (payData.link) {
            window.location.href = payData.link;
        } else {
            throw new Error('支付链接获取失败');
        }

    } catch (error) {
        showError(error.message || '支付处理失败，请稍后重试');
        button.disabled = false;
        btnText.textContent = originalText;
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}

// 初始化预览
updatePayPreview();

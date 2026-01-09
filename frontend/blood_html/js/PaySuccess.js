
        
async function verifyPayment() {
    const token = localStorage.getItem('token');
    const queryString = location.search;
    
    try {
        const response = await fetch(`${API_BASE_URL}/payments/alipay/result/${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            showSuccessState(data);
        } else {
            showErrorState();
        }
    } catch (error) {
        showErrorState();
    } finally {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('returnBtn').style.display = 'inline-block';
    }
}

function showSuccessState(data) {
    document.getElementById('checkmark').style.display = 'block';
    document.getElementById('statusTitle').textContent = '充值成功';
    document.getElementById('amountText').textContent = `¥ ${data.amount.toFixed(2)}`;
    document.getElementById('descriptionText').textContent = `支付时间：${data.pay_time}`;
    document.getElementById('errorInfo').style.display = 'none';
}

function showErrorState() {
    document.getElementById('checkmark').style.display = 'none';
    document.getElementById('statusTitle').textContent = '充值失败';
    document.getElementById('amountText').textContent = '';
    document.getElementById('descriptionText').textContent = '支付验证未通过，可能遇到以下问题：';
    document.getElementById('errorInfo').style.display = 'block';
    document.querySelector('.success-container').classList.add('error-mode');
    document.getElementById('returnBtn').style.backgroundColor = 'var(--error-color)';
}

// 页面加载时执行验证
window.addEventListener('DOMContentLoaded', verifyPayment);
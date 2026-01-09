// const API_BASE_URL = 'https://9p47q51245.goho.co'; // 定义公共变量 
// const API_BASE_URL = 'http://8.140.245.242:8000'; // 定义公共变量 
const API_BASE_URL = 'http://127.0.0.1:9000';
  // 加载导航栏
   // 显示成功提示
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    // 触发重排以启动动画
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 10);

    // 3秒后移除提示
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 2000);
}

// 显示错误提示
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // 触发重排以启动动画
    setTimeout(() => {
        errorDiv.classList.add('show');
    }, 10);

    // 3秒后移除提示
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 2000);
}

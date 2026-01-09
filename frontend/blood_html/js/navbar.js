document.addEventListener('DOMContentLoaded', () => {
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            // 如果没有 token 则跳转到登录页面
            window.location.href = 'login.html';
        }
    }
    
    // 使用示例
    checkAuth();
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
        <ul>
            <li><a href="index.html" data-page="index.html"><span class="icon">🏠</span><span>首页</span></a></li>
            <li><a href="recommend.html" data-page="recommend.html"><span class="icon">💬</span><span>推荐</span></a></li>
            <li><a href="tools.html" data-page="tools.html"><span class="icon">🛠️</span><span>工具</span></a></li>
            <li><a href="community.html" data-page="community.html"><span class="icon">👥</span><span>社区</span></a></li>
            <li><a href="profile.html" data-page="profile.html"><span class="icon">👤</span><span>我的</span></a></li>
        </ul>
    `;
    document.body.appendChild(navbar);

    // 获取当前文件名
    const currentPage = window.location.pathname.split('/').pop();

    // 移除所有链接的 active 类，然后为匹配当前页面的链接添加 active 类
    const links = navbar.querySelectorAll('a');
    links.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
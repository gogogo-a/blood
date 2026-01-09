// ========================================
// 全局深色模式管理
// ========================================

(function() {
    // 立即执行主题初始化，避免闪烁
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const autoMode = localStorage.getItem('autoDarkMode') === 'true';
        
        if (autoMode) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
    
    // 立即初始化
    initTheme();
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('autoDarkMode') === 'true') {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    });
    
    // 监听其他页面的主题变化（通过 localStorage）
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme' && e.newValue) {
            document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
})();

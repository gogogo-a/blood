document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素获取
    const editModal = document.getElementById('edit-modal');
    const closeEditBtn = document.getElementById('close-edit-btn');
    const editForm = document.getElementById('edit-form');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const birthdayElement = document.getElementById('birthday');
    const levelTitleElement = document.getElementById('level-title');
    const levelPercentElement = document.getElementById('level-percent');

    // 显示模态框
    window.toggleEditModal = function() {
        editModal.classList.add('show');
        document.getElementById('edit-username').value = usernameElement.textContent !== '-' ? usernameElement.textContent : '';
        document.getElementById('edit-email').value = emailElement.textContent !== '-' ? emailElement.textContent : '';
        document.getElementById('edit-birthday').value = birthdayElement.textContent !== '-' ? birthdayElement.textContent : '';
    };

    // 关闭模态框
    function closeModal() {
        editModal.classList.remove('show');
    }

    // 获取用户信息
    async function fetchUserProfile() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/app/user/profile/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                window.location.href = 'login.html';
                showError("获取用户信息失败，请重试");
                return;
            }

            const data = await response.json();
            
            // 更新页面内容
            const username = data.user_data.username || '未设置';
            usernameElement.textContent = username;
            
            emailElement.textContent = data.user_data.email || '未设置';
            
            if (data.user_data.birthday) {
                const birthdayDate = new Date(data.user_data.birthday);
                birthdayElement.textContent = `${birthdayDate.getFullYear()}-${(birthdayDate.getMonth() + 1).toString().padStart(2, '0')}-${birthdayDate.getDate().toString().padStart(2, '0')}`;
            } else {
                birthdayElement.textContent = '未设置';
            }
            
            const levelTitle = data.user_data.level_title || '普通会员';
            levelTitleElement.textContent = levelTitle;
            
            levelPercentElement.textContent = `${data.user_data.level_percent || 100}%`;
        } catch (error) {
            showError("获取用户信息失败，请重试");
            console.log(error);
        }
    }

    // 提交修改用户信息
    async function updateUserProfile(event) {
        event.preventDefault();

        const updatedData = {
            username: document.getElementById('edit-username').value,
            email: document.getElementById('edit-email').value,
            birthday: document.getElementById('edit-birthday').value
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/app/user/renew/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                showError("更新用户信息失败，请稍后重试");
                return;
            }

            showSuccess("更新用户信息成功");
            fetchUserProfile();
            closeModal();
        } catch (error) {
            showError("更新用户信息失败，请稍后重试");
        }
    }

    // 事件绑定
    closeEditBtn.addEventListener('click', closeModal);
    editForm.addEventListener('submit', updateUserProfile);
    
    // 点击模态框外部关闭
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });

    // 初始化用户信息
    fetchUserProfile();
});
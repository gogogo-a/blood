// 食物 GI 值查询 - 动态数据版本

let foodGIData = [];
let currentCategory = 'all';

// 从后端获取食物GI数据
async function fetchFoodGIData() {
    try {
        const response = await fetch(`${API_BASE_URL}/tools/food-gi/`);
        const data = await response.json();
        if (data.status) {
            foodGIData = data.data;
            filterFoods();
        }
    } catch (error) {
        console.error('获取食物GI数据失败:', error);
        // 使用本地备用数据
        foodGIData = getLocalFoodData();
        filterFoods();
    }
}

// 本地备用数据
function getLocalFoodData() {
    return [
        { name: '白米饭', gi: 83, category: 'grain', carb: 28 },
        { name: '糙米饭', gi: 56, category: 'grain', carb: 23 },
        { name: '苹果', gi: 36, category: 'fruit', carb: 14 },
        { name: '西兰花', gi: 10, category: 'vegetable', carb: 7 },
        { name: '鸡胸肉', gi: 0, category: 'protein', carb: 0 },
        { name: '牛奶', gi: 27, category: 'dairy', carb: 5 },
    ];
}

// 获取 GI 等级
function getGILevel(gi) {
    if (gi <= 55) return 'low';
    if (gi <= 69) return 'medium';
    return 'high';
}

// 获取 GI 等级文字
function getGILevelText(gi) {
    if (gi <= 55) return '低GI';
    if (gi <= 69) return '中GI';
    return '高GI';
}

// 渲染食物列表
function renderFoodList(foods) {
    const container = document.getElementById('food-list');
    
    if (foods.length === 0) {
        container.innerHTML = '<div class="empty-state">未找到相关食物</div>';
        return;
    }
    
    container.innerHTML = foods.map(food => `
        <div class="food-item">
            <div class="food-main">
                <span class="food-name">${food.name}</span>
                <span class="gi-badge ${getGILevel(food.gi)}">${food.gi}</span>
            </div>
            <div class="food-meta">
                <span class="gi-level">${getGILevelText(food.gi)}</span>
                <span class="carb-info">碳水: ${food.carb}g/100g</span>
            </div>
        </div>
    `).join('');
}

// 过滤食物
function filterFoods() {
    const searchText = document.getElementById('gi-search').value.toLowerCase();
    
    let filtered = foodGIData;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filtered = filtered.filter(f => f.category === currentCategory);
    }
    
    // 按搜索词过滤
    if (searchText) {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchText));
    }
    
    // 按 GI 值排序
    filtered.sort((a, b) => a.gi - b.gi);
    
    renderFoodList(filtered);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从后端获取数据
    fetchFoodGIData();
    
    // 搜索框事件
    document.getElementById('gi-search').addEventListener('input', filterFoods);
    
    // 分类标签事件
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            filterFoods();
        });
    });
});

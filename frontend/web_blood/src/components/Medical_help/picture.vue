<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 更柔和的渐变配色
const categories = [
  { name: "疾病简介", itemStyle: { color: '#667eea' }},      // 柔和紫蓝
  { name: "疾病治疗", itemStyle: { color: '#48bb78' }},      // 柔和绿
  { name: "疾病诊断", itemStyle: { color: '#9f7aea' }},      // 淡紫
  { name: "生活方式", itemStyle: { color: '#4fd1c5' }},      // 青绿
  { name: "疾病预防", itemStyle: { color: '#f687b3' }},      // 粉红
  { name: "疾病症状", itemStyle: { color: '#fc8181' }},      // 珊瑚红
  { name: "患病原因", itemStyle: { color: '#f6ad55' }},      // 暖橙
  { name: "关联疾病", itemStyle: { color: '#68d391' }},      // 翠绿
  { name: "医院推荐", itemStyle: { color: '#63b3ed' }},      // 天蓝
  { name: "药物治疗", itemStyle: { color: '#b794f4' }},      // 薰衣草紫
  { name: "饮食建议", itemStyle: { color: '#fbb6ce' }}       // 浅粉
]

const nodes = [
  // 核心节点 - 糖尿病
  { id: "1", name: "糖尿病", symbolSize: 90, itemStyle: { color: '#667eea' }},
  
  // 糖尿病类型
  { id: "2", name: "1型糖尿病", symbolSize: 70, itemStyle: { color: '#9f7aea' }},
  { id: "3", name: "2型糖尿病", symbolSize: 70, itemStyle: { color: '#805ad5' }},
  { id: "4", name: "妊娠糖尿病", symbolSize: 60, itemStyle: { color: '#b794f4' }},
  
  // 并发症
  { id: "5", name: "糖尿病足", symbolSize: 65, itemStyle: { color: '#fc8181' }},
  { id: "6", name: "糖尿病肾病", symbolSize: 60, itemStyle: { color: '#f687b3' }},
  { id: "7", name: "糖尿病视网膜病变", symbolSize: 55, itemStyle: { color: '#ed64a6' }},
  { id: "8", name: "糖尿病神经病变", symbolSize: 55, itemStyle: { color: '#d53f8c' }},
  { id: "9", name: "心血管疾病", symbolSize: 55, itemStyle: { color: '#e53e3e' }},
  
  // 症状节点
  { id: "10", name: "多饮", category: '疾病症状', des: "患者经常感到口渴，饮水量明显增加", itemStyle: { color: '#fc8181' }},
  { id: "11", name: "多尿", category: '疾病症状', des: "排尿次数和尿量明显增多", itemStyle: { color: '#fc8181' }},
  { id: "12", name: "多食", category: '疾病症状', des: "食欲增加但体重可能下降", itemStyle: { color: '#fc8181' }},
  { id: "13", name: "体重下降", category: '疾病症状', des: "尽管食量增加，体重仍然减轻", itemStyle: { color: '#fc8181' }},
  { id: "14", name: "疲劳乏力", category: '疾病症状', des: "经常感到疲倦，精力不足", itemStyle: { color: '#fc8181' }},
  { id: "15", name: "视力模糊", category: '疾病症状', des: "血糖波动可能导致视力暂时模糊", itemStyle: { color: '#fc8181' }},
  
  // 治疗方法
  { id: "20", name: "胰岛素治疗", category: '疾病治疗', des: "通过注射胰岛素来控制血糖水平", itemStyle: { color: '#48bb78' }},
  { id: "21", name: "口服降糖药", category: '疾病治疗', des: "包括二甲双胍、磺脲类等多种药物", itemStyle: { color: '#48bb78' }},
  { id: "22", name: "GLP-1受体激动剂", category: '疾病治疗', des: "新型降糖药物，可同时减重", itemStyle: { color: '#48bb78' }},
  { id: "23", name: "SGLT2抑制剂", category: '疾病治疗', des: "通过尿液排出多余糖分", itemStyle: { color: '#48bb78' }},
  
  // 生活方式
  { id: "30", name: "饮食控制", category: '生活方式', des: "控制碳水化合物摄入，均衡营养", itemStyle: { color: '#4fd1c5' }},
  { id: "31", name: "规律运动", category: '生活方式', des: "每周至少150分钟中等强度运动", itemStyle: { color: '#4fd1c5' }},
  { id: "32", name: "血糖监测", category: '生活方式', des: "定期监测空腹和餐后血糖", itemStyle: { color: '#4fd1c5' }},
  { id: "33", name: "戒烟限酒", category: '生活方式', des: "戒烟并限制酒精摄入", itemStyle: { color: '#4fd1c5' }},
  { id: "34", name: "体重管理", category: '生活方式', des: "保持健康体重，BMI控制在正常范围", itemStyle: { color: '#4fd1c5' }},
  
  // 诊断指标
  { id: "40", name: "空腹血糖", category: '疾病诊断', des: "正常值：3.9-6.1mmol/L", itemStyle: { color: '#9f7aea' }},
  { id: "41", name: "餐后血糖", category: '疾病诊断', des: "餐后2小时血糖应<7.8mmol/L", itemStyle: { color: '#9f7aea' }},
  { id: "42", name: "糖化血红蛋白", category: '疾病诊断', des: "HbA1c反映近2-3个月平均血糖", itemStyle: { color: '#9f7aea' }},
  { id: "43", name: "口服葡萄糖耐量试验", category: '疾病诊断', des: "OGTT用于诊断糖尿病前期", itemStyle: { color: '#9f7aea' }},
  
  // 预防措施
  { id: "50", name: "健康饮食", category: '疾病预防', des: "多吃蔬菜、全谷物，少吃精制糖", itemStyle: { color: '#f687b3' }},
  { id: "51", name: "定期体检", category: '疾病预防', des: "每年检查血糖，早发现早干预", itemStyle: { color: '#f687b3' }},
  { id: "52", name: "保持运动", category: '疾病预防', des: "规律运动可提高胰岛素敏感性", itemStyle: { color: '#f687b3' }},
  { id: "53", name: "控制体重", category: '疾病预防', des: "肥胖是2型糖尿病的重要风险因素", itemStyle: { color: '#f687b3' }},
  
  // 患病原因
  { id: "60", name: "遗传因素", category: '患病原因', des: "家族史是重要的风险因素", itemStyle: { color: '#f6ad55' }},
  { id: "61", name: "肥胖", category: '患病原因', des: "超重和肥胖增加患病风险", itemStyle: { color: '#f6ad55' }},
  { id: "62", name: "不良生活习惯", category: '患病原因', des: "久坐、高糖饮食等不良习惯", itemStyle: { color: '#f6ad55' }},
  { id: "63", name: "年龄增长", category: '患病原因', des: "45岁以上人群风险增加", itemStyle: { color: '#f6ad55' }},
  { id: "64", name: "胰岛素抵抗", category: '患病原因', des: "细胞对胰岛素反应降低", itemStyle: { color: '#f6ad55' }},
  
  // 医院推荐
  { id: "70", name: "北京协和医院", category: '医院推荐', des: "内分泌科全国领先", itemStyle: { color: '#63b3ed' }},
  { id: "71", name: "上海瑞金医院", category: '医院推荐', des: "糖尿病研究中心", itemStyle: { color: '#63b3ed' }},
  { id: "72", name: "中日友好医院", category: '医院推荐', des: "糖尿病专科特色", itemStyle: { color: '#63b3ed' }},
  { id: "73", name: "广东省人民医院", category: '医院推荐', des: "华南地区糖尿病诊疗中心", itemStyle: { color: '#63b3ed' }},
  
  // 科室
  { id: "80", name: "内分泌科", symbolSize: 60, itemStyle: { color: '#68d391' }},
  { id: "81", name: "营养科", symbolSize: 50, itemStyle: { color: '#68d391' }},
  { id: "82", name: "眼科", symbolSize: 45, itemStyle: { color: '#68d391' }},
  { id: "83", name: "肾内科", symbolSize: 45, itemStyle: { color: '#68d391' }},
  
  // 饮食建议
  { id: "90", name: "低GI食物", category: '饮食建议', des: "选择升糖指数低的食物", itemStyle: { color: '#fbb6ce' }},
  { id: "91", name: "膳食纤维", category: '饮食建议', des: "增加蔬菜和全谷物摄入", itemStyle: { color: '#fbb6ce' }},
  { id: "92", name: "优质蛋白", category: '饮食建议', des: "适量摄入鱼、禽、蛋、豆类", itemStyle: { color: '#fbb6ce' }},
  { id: "93", name: "控制碳水", category: '饮食建议', des: "合理分配每餐碳水化合物", itemStyle: { color: '#fbb6ce' }}
]

const links = [
  // 糖尿病类型关系
  { source: "1", target: "2", name: '类型' },
  { source: "1", target: "3", name: '类型' },
  { source: "1", target: "4", name: '类型' },
  
  // 并发症关系
  { source: "1", target: "5", name: '并发症' },
  { source: "1", target: "6", name: '并发症' },
  { source: "1", target: "7", name: '并发症' },
  { source: "1", target: "8", name: '并发症' },
  { source: "1", target: "9", name: '并发症' },
  
  // 症状关系
  { source: "1", target: "10", name: '症状' },
  { source: "1", target: "11", name: '症状' },
  { source: "1", target: "12", name: '症状' },
  { source: "1", target: "13", name: '症状' },
  { source: "1", target: "14", name: '症状' },
  { source: "1", target: "15", name: '症状' },
  
  // 治疗关系
  { source: "1", target: "20", name: '治疗' },
  { source: "1", target: "21", name: '治疗' },
  { source: "2", target: "20", name: '必需' },
  { source: "3", target: "21", name: '首选' },
  { source: "3", target: "22", name: '治疗' },
  { source: "3", target: "23", name: '治疗' },
  
  // 生活方式关系
  { source: "1", target: "30", name: '管理' },
  { source: "1", target: "31", name: '管理' },
  { source: "1", target: "32", name: '管理' },
  { source: "1", target: "33", name: '管理' },
  { source: "1", target: "34", name: '管理' },
  
  // 诊断关系
  { source: "1", target: "40", name: '诊断' },
  { source: "1", target: "41", name: '诊断' },
  { source: "1", target: "42", name: '诊断' },
  { source: "1", target: "43", name: '诊断' },
  
  // 预防关系
  { source: "1", target: "50", name: '预防' },
  { source: "1", target: "51", name: '预防' },
  { source: "1", target: "52", name: '预防' },
  { source: "1", target: "53", name: '预防' },
  
  // 病因关系
  { source: "60", target: "1", name: '病因' },
  { source: "61", target: "1", name: '病因' },
  { source: "62", target: "1", name: '病因' },
  { source: "63", target: "1", name: '病因' },
  { source: "64", target: "3", name: '病因' },
  
  // 医院科室关系
  { source: "80", target: "1", name: '诊治' },
  { source: "80", target: "70", name: '科室' },
  { source: "80", target: "71", name: '科室' },
  { source: "80", target: "72", name: '科室' },
  { source: "80", target: "73", name: '科室' },
  { source: "81", target: "30", name: '指导' },
  { source: "82", target: "7", name: '诊治' },
  { source: "83", target: "6", name: '诊治' },
  
  // 饮食关系
  { source: "30", target: "90", name: '建议' },
  { source: "30", target: "91", name: '建议' },
  { source: "30", target: "92", name: '建议' },
  { source: "30", target: "93", name: '建议' },
  
  // 并发症与科室
  { source: "5", target: "80", name: '就诊' },
  { source: "6", target: "83", name: '就诊' },
  { source: "7", target: "82", name: '就诊' }
]

const customTooltip = ref(null)
const chartContainer = ref(null)
let myChart = null

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})

const handleResize = () => {
  myChart?.resize()
}

const initChart = () => {
  myChart = echarts.init(document.getElementById('main'))

  const option = {
    backgroundColor: 'transparent',
    tooltip: { show: false },
    legend: {
      data: categories.map(item => item.name),
      orient: 'horizontal',
      top: 20,
      left: 'center',
      textStyle: {
        color: '#4a5568',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      icon: 'circle',
      selectedMode: true,
      inactiveColor: '#cbd5e0'
    },
    series: [{
      type: 'graph',
      layout: 'force',
      progressive: 100, // 渐进式渲染
      progressiveThreshold: 50,
      data: nodes.map(node => ({
        ...node,
        symbolSize: node.symbolSize || 42,
        label: {
          show: true,
          position: 'inside',
          fontSize: node.symbolSize ? 11 : 9,
          color: '#fff',
          fontWeight: 400,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", sans-serif',
          formatter: ({ name }) => {
            if (name.length <= 4) return name
            return name.slice(0, 4) + '\n' + name.slice(4, 8) + (name.length > 8 ? '...' : '')
          }
        },
        itemStyle: {
          ...node.itemStyle,
          shadowBlur: 15,
          shadowColor: node.itemStyle?.color ? `${node.itemStyle.color}50` : 'rgba(0,0,0,0.1)',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.9)'
        }
      })),
      links: links.map(link => ({
        ...link,
        lineStyle: {
          width: 1.5,
          color: '#e2e8f0',
          curveness: 0.2,
          opacity: 0.7
        },
        emphasis: {
          lineStyle: { width: 2, color: '#667eea', opacity: 1 }
        }
      })),
      categories: categories,
      roam: true,
      draggable: true,
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 5],
      force: {
        repulsion: 300,
        gravity: 0.12,
        edgeLength: [50, 100],
        friction: 0.7,
        layoutAnimation: true
      },
      edgeLabel: {
        show: false // 关闭边标签提升性能
      },
      emphasis: {
        focus: 'adjacency',
        blurScope: 'global',
        label: { show: true, fontSize: 11, fontWeight: 500 },
        itemStyle: { shadowBlur: 15, shadowColor: 'rgba(102,126,234,0.4)' }
      },
      blur: {
        itemStyle: { opacity: 0.25 },
        lineStyle: { opacity: 0.08 }
      }
    }],
    animationDuration: 800,
    animationEasingUpdate: 'cubicOut',
    animationDelayUpdate: 0
  }

  myChart.setOption(option)

  myChart.on('mouseover', (params) => {
    if (params.data?.des) {
      const tooltip = customTooltip.value
      tooltip.innerHTML = `
        <div class="apple-tooltip">
          <div class="tooltip-header">
            <span class="tooltip-icon" style="background: ${params.data.itemStyle?.color || '#667eea'}"></span>
            <h3>${params.data.name}</h3>
          </div>
          <p>${params.data.des}</p>
          ${params.data.category ? `<span class="tooltip-tag">${params.data.category}</span>` : ''}
        </div>
      `
      tooltip.style.display = 'block'
      const containerRect = chartContainer.value.getBoundingClientRect()
      let left = params.event.offsetX + 20
      let top = params.event.offsetY - 20
      if (left + 300 > containerRect.width) left = params.event.offsetX - 320
      if (top < 20) top = 20
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    }
  })

  myChart.on('mouseout', () => {
    customTooltip.value.style.display = 'none'
  })
}
</script>

<template>
  <div class="apple-chart-container" ref="chartContainer">
    <div class="chart-header">
      <h1 class="chart-title">糖尿病知识图谱</h1>
      <p class="chart-subtitle">探索疾病关联，了解健康知识</p>
    </div>
    <div class="chart-wrapper">
      <div id="main"></div>
      <div id="custom-tooltip" ref="customTooltip"></div>
    </div>
    <div class="chart-tips">
      <span class="tip-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        拖拽节点调整位置
      </span>
      <span class="tip-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        滚轮缩放视图
      </span>
      <span class="tip-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
        </svg>
        悬停查看详情
      </span>
    </div>
  </div>
</template>

<style scoped>
.apple-chart-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%);
  padding: 40px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
}

.chart-header {
  text-align: center;
  margin-bottom: 32px;
}

.chart-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f687b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-subtitle {
  font-size: 20px;
  font-weight: 400;
  color: #718096;
  margin: 0;
}

.chart-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 12px 24px rgba(0, 0, 0, 0.04), 0 24px 48px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.chart-wrapper:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

#main {
  width: 100%;
  height: calc(100vh - 280px);
  min-height: 500px;
}

#custom-tooltip {
  position: absolute;
  display: none;
  z-index: 1000;
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease;
}

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.apple-tooltip) {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 18px;
  min-width: 260px;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.08);
}

:deep(.tooltip-header) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

:deep(.tooltip-icon) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

:deep(.tooltip-header h3) {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

:deep(.apple-tooltip p) {
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #4a5568;
}

:deep(.tooltip-tag) {
  display: inline-block;
  padding: 3px 8px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #667eea;
}

.chart-tips {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 20px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #a0aec0;
  transition: color 0.2s ease;
}

.tip-item:hover { color: #4a5568; }
.tip-item svg { opacity: 0.5; }

@media (max-width: 768px) {
  .apple-chart-container { padding: 16px; }
  .chart-title { font-size: 28px; }
  .chart-subtitle { font-size: 16px; }
  .chart-wrapper { border-radius: 16px; }
  #main { height: calc(100vh - 220px); min-height: 400px; }
  .chart-tips { flex-direction: column; align-items: center; gap: 10px; }
}
</style>

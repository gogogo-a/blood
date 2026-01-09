<template>
  <div class="container">
    <header>
      <h1>全球糖尿病数据分析</h1>
      <p>糖尿病已成为全球范围内的重要健康问题，影响着数亿人。</p>
    </header>

    <section class="content-section">
      <h2>糖尿病的全球影响</h2>
      <p>糖尿病不仅仅是个体健康的挑战，它还影响着全球数亿人口，尤其是在亚洲地区。根据世界卫生组织（WHO）的数据显示，全球约有4.6亿人患有糖尿病，其中亚洲地区的患者占比最大。</p>
      <ul>
        <li>全球糖尿病患者数：约4.6亿人。</li>
        <li>预计到2030年，全球糖尿病患者将超过5.5亿人。</li>
        <li>亚洲地区是糖尿病高发地区，尤其是中国和印度。</li>
      </ul>
      <div class="chart-container" id="chart1"></div>
    </section>

    <section class="content-section">
      <h2>亚洲糖尿病患病率</h2>
      <p>亚洲作为糖尿病的高发地区，尤其是中国和印度，糖尿病的患病率逐年上升，已经成为公共卫生的重大问题。</p>
      <div class="chart-container" id="chart2"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病并发症</h2>
      <p>糖尿病的危害不仅局限于血糖控制不当，还会引发各种并发症，包括心脏病、肾脏病、失明等。控制血糖水平对于避免这些并发症至关重要。</p>
      <ul>
        <li>心血管疾病：糖尿病患者患心脏病的风险是非糖尿病患者的两倍。</li>
        <li>肾脏病：糖尿病是引发肾功能衰竭的主要原因之一。</li>
        <li>视力丧失：糖尿病性视网膜病变是导致失明的主要原因之一。</li>
      </ul>
      <div class="chart-container" id="chart3"></div>
    </section>

    <section class="content-section">
      <h2>如何应对糖尿病？</h2>
      <p>尽管糖尿病的危害深远，但早期预防和有效的健康管理可以大大降低患病风险。以下是应对糖尿病的有效措施：</p>
      <ul>
        <li>规律的体检：定期监测血糖水平，及时发现异常。</li>
        <li>均衡饮食：增加蔬菜、全谷物、低糖水果的摄入，减少精加工食品。</li>
        <li>增加运动：每周至少150分钟的中等强度运动，保持健康体重。</li>
      </ul>
      <div class="chart-container" id="chart4"></div>
    </section>

    <section class="content-section">
      <h2>全球糖尿病治疗趋势</h2>
      <p>随着全球糖尿病患者数量的增加，糖尿病治疗方法和投入不断提高。从早期的胰岛素治疗，到现在的个性化医疗、智能监测设备的使用，糖尿病治疗领域取得了显著进展。</p>
      <div class="chart-container" id="chart5"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病在不同年龄段的分布</h2>
      <p>糖尿病的发病率与年龄关系密切。研究显示，糖尿病的患病率随着年龄的增长而逐步上升。特别是在中老年人群体中，糖尿病的发生率较高，早期筛查显得尤为重要。</p>
      <div class="chart-container" id="chart6"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病患者的生活质量</h2>
      <p>糖尿病不仅影响患者的身体健康，还会对其生活质量产生深远的影响。长期的糖尿病管理、饮食控制和药物依赖使患者面临着巨大的心理和生理压力。生活质量评分可以帮助评估患者的整体健康状态和心理状况。</p>
      <div class="chart-container" id="chart7"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病预防研究的进展</h2>
      <p>近年来，关于糖尿病预防的研究取得了重要进展。研究集中在生活方式干预、药物预防、基因预测等多个方面，成果不断推动糖尿病防控工作的深入。</p>
      <div class="chart-container" id="chart8"></div>
    </section>

    <section class="content-section">
      <h2>中国各省份糖尿病患病率</h2>
      <p>展示中国不同省份的糖尿病患病率差异。</p>
      <div class="chart-container" id="chart9"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病并发症分布</h2>
      <p>糖尿病患者中不同并发症的发生比例。</p>
      <div class="chart-container" id="chart10"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病控制措施效果评估</h2>
      <p>展示不同糖尿病控制措施（如饮食、运动、药物等）的效果评估。</p>
      <div class="chart-container" id="chart11"></div>
    </section>

    <section class="content-section">
      <h2>糖尿病治疗方法普及率</h2>
      <p>展示中国各省糖尿病患者接受不同治疗方法的比例。</p>
      <div class="chart-container" id="chart12"></div>
    </section>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';

onMounted(() => {
  // 图表1：全球糖尿病患者分布
  const chart1 = echarts.init(document.getElementById('chart1'));
  const option1 = {
    color: ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 44, name: '亚洲' },
        { value: 20, name: '欧洲' },
        { value: 10, name: '北美' },
        { value: 7, name: '非洲' },
        { value: 17, name: '其他' }
      ],
      label: {
        fontSize: 14
      }
    }]
  };
  chart1.setOption(option1);

  // 图表2：亚洲糖尿病患病率变化
  const chart2 = echarts.init(document.getElementById('chart2'));
  const option2 = {
    color: ['#FF5722', '#2196F3'],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = params[0].name + '<br>';
        params.forEach(function (item) {
          result += item.seriesName + ': ' + item.value + '<br>';
        });
        return result;
      }
    },
    legend: {
      data: ['亚洲患病率', '中国患病率'],
      textStyle: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    xAxis: {
      type: 'category',
      data: ['2010', '2012', '2014', '2016', '2018', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    series: [
      {
        name: '亚洲患病率',
        data: [8.2, 8.4, 8.7, 9.0, 9.3, 9.5, 9.7, 9.9, 10.2, 10.4, 10.6, 10.8],
        type: 'line',
        smooth: true,
        symbolSize: 10,
        itemStyle: {
          borderWidth: 3,
          borderColor: '#FF6F00'
        },
        lineStyle: {
          color: '#FF5722'
        }
      },
      {
        name: '中国患病率',
        data: [10.5, 10.8, 11.2, 11.5, 11.8, 12.1, 12.4, 12.7, 13.0, 13.3, 13.5, 13.7],
        type: 'line',
        smooth: true,
        symbolSize: 10,
        itemStyle: {
          borderWidth: 3,
          borderColor: '#2196F3'
        },
        lineStyle: {
          color: '#2196F3'
        }
      }
    ],
    markArea: {
      silent: true,
      itemStyle: {
        color: 'rgba(255, 0, 0, 0.3)'
      },
      data: [
        [
          { name: '预测数据', xAxis: '2024' },
          { xAxis: '2026' }
        ]
      ]
    },
    markPoint: {
      data: [
        {
          name: '预测2024',
          coord: ['2024', 10.9],
          itemStyle: { color: '#FFCCCB' },
          symbol: 'circle',
          symbolSize: 15
        },
        {
          name: '预测2025',
          coord: ['2025', 11.0],
          itemStyle: { color: '#FF66B2' },
          symbol: 'circle',
          symbolSize: 15
        },
        {
          name: '预测2026',
          coord: ['2026', 11.1],
          itemStyle: { color: '#FF66B2' },
          symbol: 'circle',
          symbolSize: 15
        }
      ]
    }
  };
  chart2.setOption(option2);

  // 图表3：糖尿病引发的并发症分布
  const chart3 = echarts.init(document.getElementById('chart3'));
  const option3 = {
    color: ['#FF9800'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      data: ['心血管病', '肾脏病', '视网膜病变', '神经损伤', '其他'],
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    series: [{
      data: [40, 30, 20, 10, 25],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: function(params) {
          const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'];
          return colors[params.dataIndex];
        }
      }
    }]
  };
  chart3.setOption(option3);

  // 图表4：糖尿病预防措施的重要性
  const chart4 = echarts.init(document.getElementById('chart4'));
  const option4 = {
    color: ['#8BC34A', '#FFEB3B', '#FFC107'],
    radar: {
      indicator: [
        { name: '饮食控制', max: 100 },
        { name: '规律运动', max: 100 },
        { name: '体重管理', max: 100 },
        { name: '定期体检', max: 100 }
      ],
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      splitLine: {
        lineStyle: {
          color: '#FF6F00'
        }
      }
    },
    series: [{
      name: '预防措施',
      type: 'radar',
      data: [{
        value: [85, 90, 80, 75],
        name: '重要性'
      }],
      areaStyle: {
        color: 'rgba(255, 87, 34, 0.3)'
      }
    }]
  };
  chart4.setOption(option4);

  // 图表5：全球糖尿病治疗趋势
  const chart5 = echarts.init(document.getElementById('chart5'));
  const option5 = {
    color: ['#3F51B5', '#FF9800'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    xAxis: {
      type: 'category',
      data: ['2010', '2012', '2014', '2016', '2018', '2020']
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    series: [{
      name: '治疗投入',
      data: [20, 30, 40, 60, 70, 80],
      type: 'line',
      smooth: true
    }, {
      name: '治疗效果',
      data: [15, 25, 35, 50, 60, 75],
      type: 'line',
      smooth: true
    }]
  };
  chart5.setOption(option5);

  // 图表6：糖尿病在不同年龄段的分布
  const chart6 = echarts.init(document.getElementById('chart6'));
  const option6 = {
    color: ['#FF4081'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      data: ['20-30岁', '30-40岁', '40-50岁', '50-60岁', '60-70岁', '70岁以上']
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    series: [{
      data: [10, 15, 30, 50, 70, 90],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: function(params) {
          const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A', '#4CAF50'];
          return colors[params.dataIndex];
        }
      }
    }]
  };
  chart6.setOption(option6);

  // 图表7：糖尿病患者生活质量评分
  const chart7 = echarts.init(document.getElementById('chart7'));
  const option7 = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    radar: {
      indicator: [
        { name: '健康状况', max: 100 },
        { name: '心理状态', max: 100 },
        { name: '社会支持', max: 100 },
        { name: '疾病控制', max: 100 }
      ],
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      splitLine: {
        lineStyle: {
          color: '#FF6F00'
        }
      }
    },
    series: [{
      name: '生活质量评分',
      type: 'radar',
      data: [{
        value: [75, 80, 70, 65],
        name: '评分'
      }]
    }]
  };
  chart7.setOption(option7);

  // 图表8：糖尿病预防研究的进展
  const chart8 = echarts.init(document.getElementById('chart8'));
  const option8 = {
    color: ['#607D8B'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      data: ['生活方式干预', '药物预防', '基因预测', '公共健康教育']
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#FF6F00',
          width: 3
        }
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: 'KaiTi'
      }
    },
    series: [{
      data: [80, 70, 60, 90],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: function(params) {
          const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'];
          return colors[params.dataIndex];
        }
      }
    }]
  };
  chart8.setOption(option8);

  // 图表9：中国各省份糖尿病患病率
  const chart9 = echarts.init(document.getElementById('chart9'));
  const option9 = {
    color: ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'],
      data: [
        { value: 30, name: '北京' },
        { value: 25, name: '上海' },
        { value: 20, name: '广东' },
        { value: 15, name: '江苏' },
        { value: 10, name: '其他' }
      ],
      roseType: 'area',
      label: {
        fontSize: 14
      }
    }]
  };
  chart9.setOption(option9);

  // 图表10：糖尿病并发症分布
  const chart10 = echarts.init(document.getElementById('chart10'));
  const option10 = {
    color: ['#FF6F00'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    xAxis: {
      type: 'category',
      data: ['心脏病', '肾脏病', '失明', '神经损伤', '其他'],
      axisLine: { lineStyle: { width: 3 } },
      axisLabel: { fontSize: 14 }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { width: 3 } },
      axisLabel: { fontSize: 14 }
    },
    series: [{
      data: [35, 30, 25, 15, 10],
      type: 'bar',
      itemStyle: {
        color: function(params) {
          const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'];
          return colors[params.dataIndex];
        }
      }
    }]
  };
  chart10.setOption(option10);

  // 图表11：糖尿病控制措施效果评估
  const chart11 = echarts.init(document.getElementById('chart11'));
  const option11 = {
    color: ['#FF6F00'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    radar: {
      indicator: [
        { name: '健康饮食', max: 10 },
        { name: '定期体检', max: 10 },
        { name: '运动', max: 10 },
        { name: '药物管理', max: 10 },
        { name: '减重', max: 10 }
      ]
    },
    series: [{
      name: '控制措施效果',
      type: 'radar',
      data: [{
        value: [9, 8, 7, 6, 8],
        name: '效果评估'
      }]
    }]
  };
  chart11.setOption(option11);

  // 图表12：糖尿病治疗方法普及率
  const chart12 = echarts.init(document.getElementById('chart12'));
  const option12 = {
    color: ['#FF6F00'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { width: 3 } },
      axisLabel: { fontSize: 14 }
    },
    yAxis: {
      type: 'category',
      data: ['口服药物', '胰岛素注射', '胰腺移植', '饮食管理', '运动治疗'],
      axisLine: { lineStyle: { width: 3 } },
      axisLabel: { fontSize: 14 }
    },
    series: [{
      data: [60, 50, 10, 70, 65],
      type: 'bar',
      itemStyle: {
        color: function(params) {
          const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A'];
          return colors[params.dataIndex];
        }
      }
    }]
  };
  chart12.setOption(option12);
});
</script>

<style>
/* 通用样式 */
:root {
  --text-color: #333;
  --highlight-color: #FF6F00;
  --card-background: #f5f5f5;
  --card-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

body {
  //font-family: "KaiTi", sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #ffffff, #f7f7f7);
}

.container {
  width: 1024px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  color: var(--highlight-color);
  font-size: 36px;
  margin-bottom: 20px;
}

header p {
  color: var(--text-color);
  font-size: 18px;
}

.content-section {
  border-radius: 10px;
  padding: 20px;
  background-color: var(--card-background);
  margin-bottom: 40px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.content-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.content-section h2 {
  color: var(--highlight-color);
  font-size: 24px;
  margin-bottom: 20px;
}

.content-section ul {
  list-style-type: none;
  padding: 0;
}

.content-section li {
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 10px;
}

.chart-container {
  margin-top: 20px;
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 10px;
  border: 2px solid var(--highlight-color);
}

.cta-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--highlight-color);
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #FF5722;
}
</style>
<template>
    <div class="chart-container">
      <!-- 玫瑰图的容器 -->
      <div ref="roseChart" class="chart"></div>
    </div>
  </template>
  
  <script lang="ts" setup name='RoseChart'>
  import { defineComponent, onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
      // 使用ref来访问DOM
      const roseChart = ref<HTMLDivElement | null>(null);
  
      // 图表初始化
      const initChart = () => {
        if (roseChart.value) {
          const myChart = echarts.init(roseChart.value);
  
          // 随机生成五个数据的玫瑰图配置
          const option = {
            title: {
              left: 'center',
              textStyle: {
                fontSize: 24,
              },
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              top: '90%',
              left: 'center',
              orient: 'horizontal', // 水平布局
              itemWidth: 14, // 标注图标的宽度
              itemHeight: 14, // 标注图标的高度
              itemGap: 20,  // 每个标注之间的间距
              width: '27%',
              formatter: function (name: string) {
                return name; // 保持标注文本格式
              },
            },
            series: [
              {
                name: '平均票房(每部)',
                type: 'pie',
                radius: [20, 100], // 内外半径
                center: ['50%', '50%'],
                roseType: 'radius', // 玫瑰图模式
                itemStyle: {
                  borderRadius: 8, // 柱形圆角
                },
                data: [
                  { value: 91.35, name: '名侦探柯南系列' },
                  { value: 161.7, name: '新海诚三部曲系列' },
                  { value: 211.33, name: '鬼灭之刃' },
                  { value: 148.22, name: '灌篮高手系列' },
                  { value: 108.76, name: '海贼王' },
                  { value: 74.2, name: '哆啦A梦系列' },
                  { value: 150.33, name: '宫崎骏系列' },
                ],
              },
            ],
          };
  
          // 使用刚指定的配置项和数据渲染图表
          myChart.setOption(option);
  
          // 监听窗口大小变化，自动适配图表大小
          window.addEventListener('resize', () => {
            myChart.resize();
          });
        }
      };
  
      // 在组件挂载时初始化图表
      onMounted(() => {
        initChart();
      });
    
  </script>
  
  <style scoped>
  .chart-container {
    position: absolute;
    top:26.4cm;
    left: 15.4cm;
    width: 100%;
    height: 500px; /* 图表高度 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .chart {
    padding-right: 2cm;
    width: 80%;
    height: 100%;
  }
  </style>
  
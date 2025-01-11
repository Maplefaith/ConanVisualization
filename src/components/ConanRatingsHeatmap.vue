<template>
  <div class="w-full max-w-4xl bg-white rounded-lg border shadow-sm" style="width: 80%;height: auto;margin-left: 150px;margin-top: -5.6cm;">
    <div class="p-6">
      <h3 class="text-3xl font-semibold leading-none tracking-tight" style="font-size: xx-large;">Conan TV Ratings Heatmap (1996-2024)</h3>
      <p class="text-sm text-muted-foreground" style="font-size: x-large;">Viewership data by year and month</p>
    </div>
    <div class="p-2">
      <div class="h-[400px] w-full">
        <svg width="100%" height="100%" viewBox="0 0 1000 450">
          <!-- Y-axis labels (Months) -->
          <text
            v-for="(month, index) in months"
            :key="`month-${month}`"
            :x="70"
            :y="65 + (index * 300) / 12"
            text-anchor="end"
            alignment-baseline="middle"
            class="text-xs fill-current"
            font-size="small"
          >
            {{ month }}
          </text>

          <!-- X-axis labels (Years) -->
          <text
            v-for="(year, i) in years"
            :key="`year-${year}`"
            :x="80 + (i * 850) / years.length"
            y="30"
            text-anchor="middle"
            class="text-xs fill-current"
            :transform="`rotate(45 ${80 + (i * 850) / years.length},30)`"
            font-size="small"
          >
            {{ year }}
          </text>

          <!-- Heatmap cells -->
          <g v-for="(row, i) in data" :key="`row-${i}`">
            <rect
              v-for="(value, j) in row"
              :key="`cell-${i}-${j}`"
              :x="80 + (j * 850) / years.length"
              :y="50 + (i * 300) / 12"
              :width="850 / years.length"
              :height="300 / 12"
              :fill="value === 0 ? '#f0f0f0' : getColor(value)"
              class="stroke-[0.5] stroke-gray-200"
            >
              <title>{{ `${years[j]}年${months[i]}: ${(value * 100).toFixed(2)}%` }}</title>
            </rect>
          </g>

          <!-- Legend -->
          <defs>
            <linearGradient id="legend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" :style="`stop-color:${getColor(0.04)};stop-opacity:1`" />
              <stop offset="50%" :style="`stop-color:${getColor(0.132)};stop-opacity:1`" />
              <stop offset="100%" :style="`stop-color:${getColor(0.224)};stop-opacity:1`" />
            </linearGradient>
          </defs>

          <!-- Legend rectangle (shorter width) -->
          <rect x="425" y="370" width="150" height="10" fill="url(#legend-gradient)" />

          <!-- Legend labels (gray and smaller font) -->
          <text x="425" y="390" text-anchor="start" class="text-xs fill-gray-500" font-size="10" fill="grey" >4%</text>
          <text x="500" y="390" text-anchor="middle" class="text-xs fill-gray-500" font-size="10" fill="grey">13.2%</text>
          <text x="575" y="390" text-anchor="end" class="text-xs fill-gray-500" font-size="10" fill="grey">22.4%</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RatingData {
  data: number[][];
  years: number[];
  months: string[];
}

// 生成年份和月份数组
const years = Array.from({ length: 2024 - 1996 + 1 }, (_, i) => 1996 + i)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 收视率数据
const data = [
  [0.11, 0.178, 0.214333333, 0.21825, 0.1858, 0.1865, 0.1975, 0.16275, 0.1435, 0.121333333, 0.111, 0.095, 0.093666667, 0.1045, 0.09, 0.09, 0.088, 0.10425, 0.08675, 0.10525, 0.09, 0.077, 0.08475, 0.0915, 0.07125, 0.0835, 0.07375, 0.06725, 0.06725],
  [0.128, 0.1795, 0.21, 0.224, 0.20325, 0.205, 0.199666667, 0.1545, 0.13325, 0.12825, 0.10275, 0.09875, 0.0915, 0.086, 0.081, 0.10125, 0.0995, 0.0975, 0.096, 0.106333333, 0.09, 0.071333333, 0.08, 0.08625, 0.0745, 0.072666667, 0.071, 0.0675, 0.061],
  [0.1335, 0.166666667, 0.20075, 0.219333333, 0.198, 0.198666667, 0.200666667, 0.149, 0.136333333, 0.115, 0.1, 0.0915, 0.093333333, 0.08, 0.08925, 0.092, 0.1065, 0.0882, 0.088, 0.09725, 0.0855, 0.07225, 0.08, 0.089666667, 0.07875, 0.077, 0.063, 0.0635, 0.0595],
  [0.13175, 0.181, 0.194, 0.188333333, 0.189, 0.1885, 0.18, 0.149, 0.1305, 0.114, 0.096666667, 0.109, 0.0885, 0.0745, 0, 0.08375, 0.084, 0.087, 0.0845, 0.0725, 0.085333333, 0.064, 0.081, 0.073666667, 0, 0.07, 0.057333333, 0.0626, 0.057333333],
  [0.139666667, 0.178, 0.191666667, 0.1902, 0.2014, 0.179, 0.17675, 0.1425, 0.1248, 0.1202, 0.11275, 0.105, 0.086, 0.07, 0.077, 0.07875, 0.0865, 0.081, 0.08925, 0.08025, 0.0685, 0.070333333, 0.07525, 0.07, 0, 0.068333333, 0.062666667, 0.055, 0.056333333],
  [0.14475, 0.1858, 0.1846, 0.187333333, 0.1925, 0.165, 0.1585, 0.1546, 0.128666667, 0.11125, 0.095666667, 0.093, 0.074, 0.0695, 0.071666667, 0.09, 0.0942, 0.073, 0.09825, 0.0815, 0.06375, 0.0575, 0.07, 0.08, 0, 0.06775, 0.06025, 0.05425, 0.0524],
  [0.1408, 0.1825, 0.185333333, 0.18675, 0.1804, 0.1824, 0.1688, 0.154333333, 0.129666667, 0.117333333, 0.086, 0.0928, 0.083, 0.06025, 0.077, 0.0762, 0.0925, 0.081333333, 0.089333333, 0.067666667, 0.06325, 0.0575, 0.074, 0.071666667, 0.0735, 0.06, 0.0575, 0.0495, 0.058],
  [0.1315, 0.16875, 0.1904, 0.16175, 0.172, 0.17675, 0.16175, 0.14075, 0.12525, 0.0944, 0.097333333, 0.077, 0.0775, 0.062, 0.071333333, 0.07, 0, 0.069, 0.097, 0.074333333, 0.06, 0.049, 0.076, 0.072, 0.073, 0.071, 0.063, 0.047, 0.050333333],
  [0.1375, 0.198333333, 0.194333333, 0.19225, 0.2, 0.197, 0.172333333, 0.134666667, 0.126, 0.1135, 0.0895, 0.07, 0.086, 0.09, 0.0805, 0.097333333, 0.09825, 0.0825, 0.102333333, 0.069, 0.06375, 0.066, 0.0786, 0.065333333, 0.077, 0.07375, 0.061333333, 0.0594, 0.058666667],
  [0.170666667, 0.1945, 0.190333333, 0.178666667, 0.19375, 0.1865, 0.163666667, 0.134333333, 0.135, 0.11, 0.086, 0.1015, 0.096, 0.091, 0.095, 0.091666667, 0.08475, 0.09625, 0.112, 0.08775, 0.0695, 0.076, 0.081, 0.08, 0.079, 0.06925, 0.0615, 0.0565, 0.06],
  [0.17675, 0.19825, 0.1962, 0.1788, 0.188, 0.18925, 0.156666667, 0.127, 0.1352, 0.10125, 0.092, 0.101, 0.094, 0.0935, 0.093, 0.0995, 0.100666667, 0.0972, 0.11125, 0.0875, 0.066, 0.08075, 0.08325, 0.072, 0.076, 0.06775, 0.0655, 0.063, 0.0615],
  [0.174, 0.213333333, 0.211, 0.170333333, 0.184666667, 0.185333333, 0.1635, 0.145, 0.129333333, 0.101, 0.109, 0.088, 0.087, 0.0875, 0.0975, 0.098, 0.107, 0.098, 0.1015, 0.086, 0.070333333, 0.085, 0.0745, 0.074, 0.081, 0.07, 0.0705, 0.0655, 0]
]

// 计算颜色
const getColor = (value: number): string => {
  const minValue = 0.04
  const maxValue = 0.224
  const normalizedValue = (value - minValue) / (maxValue - minValue)

  // 定义颜色范围
  const startColor = { r: 254, g: 232, b: 200 } // #fee8c8
  const middleColor = { r: 253, g: 187, b: 132 } // #fdbb84
  const endColor = { r: 227, g: 74, b: 51 } // #e34a33

  // 根据 normalizedValue 插值计算颜色
  let r, g, b
  if (normalizedValue <= 0.2) {
    // 在 startColor 和 middleColor 之间插值
    const t = normalizedValue * 2
    r = Math.round(startColor.r + (middleColor.r - startColor.r) * t)
    g = Math.round(startColor.g + (middleColor.g - startColor.g) * t)
    b = Math.round(startColor.b + (middleColor.b - startColor.b) * t)
  } else {
    // 在 middleColor 和 endColor 之间插值
    const t = (normalizedValue - 0.2) * 2
    r = Math.round(middleColor.r + (endColor.r - middleColor.r) * t)
    g = Math.round(middleColor.g + (endColor.g - middleColor.g) * t)
    b = Math.round(middleColor.b + (endColor.b - middleColor.b) * t)
  }

  // 返回 RGB 颜色字符串
  return `rgb(${r}, ${g}, ${b})`
}
</script>
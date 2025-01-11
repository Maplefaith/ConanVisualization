<template>
  <div class="relative bg-white p-6 rounded-xl shadow-lg" style="margin-bottom: 10cm; margin-top: -1.4cm; ">
    <svg ref="chart" class="w-full h-full"></svg>
    <div ref="tooltip"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as d3 from 'd3';
import { conanCases } from '../data/cases1';


interface CaseData {
  episodeNumber: number;
  complexity: number;
  victims: number;
  location: string;
  caseTitle: string;
  mainDetective: string;
  solved: boolean;
  blackOrganizationInvolved: boolean;
  deductionShow: boolean;
}

interface Dimensions {
  width: number;
  height: number;
}

export default {
  name: 'BubbleChart',
  setup() {
    const chart = ref<SVGSVGElement | null>(null);
    const tooltip = ref<HTMLDivElement | null>(null);
    const dimensions = ref<Dimensions>({ width: 1200, height: 800 });

    const drawChart = () => {
      if (!chart.value) return;

      const margin = { top: 220, right: 120, bottom: 60, left: 60 };
      const width = dimensions.value.width - margin.left - margin.right;
      const height = dimensions.value.height - 1.7 * margin.top - margin.bottom;

      // Clear previous chart
      d3.select(chart.value).selectAll('*').remove();

      const svg = d3.select(chart.value)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Add grid background
      const grid = svg.append('g')
        .attr('class', 'grid')
        .style('stroke', '#e5e7eb')
        .style('stroke-opacity', 0.3);

      // Scales
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(conanCases, (d: CaseData) => d.episodeNumber) || 0])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([3, 10])
        .range([height, 0]);

      const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(conanCases, (d: CaseData) => d.victims) || 0])
        .range([8, 35]);

      const colorScale = d3.scaleOrdinal<string, string>()
        .domain(['Tokyo', 'Osaka', 'Other'])
        .range(['#ff9999', '#66c2a5', '#8da0cb']);

      // Add horizontal grid lines
      grid.selectAll('line.horizontal')
        .data(yScale.ticks(10))
        .enter()
        .append('line')
        .attr('class', 'horizontal')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));

      // Add vertical grid lines
      grid.selectAll('line.vertical')
        .data(xScale.ticks(10))
        .enter()
        .append('line')
        .attr('class', 'vertical')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d));

      // Add axes with styled appearance
      const xAxis = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `Ep ${d}`))
        .style('font-size', '12px');

      xAxis.selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-20)');

      xAxis.selectAll('line')
        .style('stroke', '#666');

      xAxis.selectAll('path')
        .style('stroke', '#666');

      const yAxis = svg.append('g')
        .call(d3.axisLeft(yScale))
        .style('font-size', '12px');

      yAxis.selectAll('line')
        .style('stroke', '#666');

      yAxis.selectAll('path')
        .style('stroke', '#666');

      // Add title with styled appearance
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2 - 25)
        .attr('text-anchor', 'middle')
        .style('font-size', 'xx-large')
        .style('font-weight', 'bold')
        .text('Detective Conan Case Analysis');

      // Add labels with styled appearance
      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Case Complexity');

      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Episode Number');

      // Create styled tooltip
      const tooltipDiv = d3.select(tooltip.value)
        .style('opacity', 0)
        .attr('class', 'absolute hidden bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200 text-sm');

      // Add bubbles with enhanced styling and animations
      svg.selectAll('circle')
        .data(conanCases)
        .join('circle')
        .attr('cx', (d: CaseData) => xScale(d.episodeNumber))
        .attr('cy', (d: CaseData) => yScale(d.complexity))
        .attr('r', (d: CaseData) => radiusScale(d.victims))
        .style('fill', (d: CaseData) => colorScale(d.location))
        .style('opacity', 0.7)
        .style('stroke', (d: CaseData) => d.blackOrganizationInvolved ? '#000' : 'none')
        .style('stroke-width', 2)
        .style('filter', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))')
        .style('transition', 'all 0.3s ease')
        .on('mouseover', (event: MouseEvent, d: CaseData) => {
          d3.select(event.currentTarget as SVGCircleElement)
            .style('opacity', 1)
            .style('stroke-width', 3)
            .attr('r', radiusScale(d.victims) * 1.1);

          tooltipDiv
            .style('opacity', 1)
            .style('display', 'block')
            .html(`
              <div class="space-y-2" style="width: 300px; height: 200px; background-color: #f0f0f0; border-radius: 15px; margin-left: 580px; padding-top: 30px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <div class="font-bold text-lg" style = "font-weight: bold;">${d.caseTitle}</div>
                  <div class="grid grid-cols-2 gap-2 text-gray-600">
                  <div>Episode: ${d.episodeNumber}</div>
                  <div>Complexity: ${d.complexity}/10</div>
                  <div>Location: ${d.location}</div>
                  <div>Victims: ${d.victims}</div>
                  <div>Main Detective: ${d.mainDetective}</div>
                  <div>Solved: ${d.solved ? 'Yes' : 'No'}</div>
                  </div>
                  ${d.blackOrganizationInvolved ?
              '<div class="mt-2 text-red-600 font-semibold" style = "color: red;">Black Organization Involved</div>' : ''}
                  ${d.deductionShow ?
              '<div class="mt-2 text-blue-600">Deduction Show Included</div>' : ''}
              </div>
              `);
        })
        .on('mousemove', (event: MouseEvent) => {
          const [mouseX, mouseY] = d3.pointer(event, chart.value); // 基于 SVG 的位置
          tooltipDiv
            .style('left', `${mouseX + 20}px`)
            .style('top', `${mouseY + 20}px`);
        })
        .on('mouseout', (event: MouseEvent, d:unknown) => {
          const data = d as CaseData;
          d3.select(event.currentTarget as SVGCircleElement)
            .style('opacity', 0.7)
            .style('stroke-width', 2)
            // .attr('r', (d: CaseData) => radiusScale(d.victims));
            .attr('r', radiusScale(data.victims) * 1.1);

          tooltipDiv
            .style('opacity', 0)
            .style('display', 'none');
        });

      // Add styled legend
      const legend = svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(['Tokyo', 'Osaka', 'Other'])
        .join('g')
        .attr('transform', (d, i) => `translate(${width + 40},${i * 25})`);

      legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 10)
        .attr('r', 7)
        .style('fill', colorScale)
        .style('opacity', 0.7);

      legend.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .attr('dy', '0.35em')
        .text(d => d);

      // Add legend title
      svg.append('text')
        .attr('x', width + 40)
        .attr('y', -5)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text('Location');
    };

    const handleResize = () => {
      dimensions.value = {
        width: Math.min(1200, window.innerWidth - 40),
        height: Math.min(800, window.innerHeight - 40)
      };
      drawChart();
    };

    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    watch(conanCases, drawChart, { deep: true });

    return {
      chart,
      tooltip
    };
  }
};
</script>

<style scoped>
/* 如果需要任何特定的样式，可以在这里添加 */
</style>
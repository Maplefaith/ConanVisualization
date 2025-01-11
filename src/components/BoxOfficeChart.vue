<template>
  <div class="box-office-chart">
    <div class="tableauPlaceholder" id="viz1734431371257" style="position: relative;">
      <noscript>
        <a href="#">
          <img alt="Data Visualization of 柯南の Movies Over the Years(1997-2024)" 
               src="https://public.tableau.com/static/images/to/total_17344278610380/total/1_rss.png" 
               style="border: none"/>
        </a>
      </noscript>
      <object class="tableauViz" style="display:none;">
        <param name="host_url" value="https://public.tableau.com/" />
        <param name="embed_code_version" value="3" />
        <param name="site_root" value="" />
        <param name="name" value="total_17344278610380/total" />
        <param name="tabs" value="no" />
        <param name="toolbar" value="yes" />
        <param name="static_image" value="https://public.tableau.com/static/images/to/total_17344278610380/total/1.png" />
        <param name="animate_transition" value="yes" />
        <param name="display_static_image" value="yes" />
        <param name="display_spinner" value="yes" />
        <param name="display_overlay" value="yes" />
        <param name="display_count" value="yes" />
        <param name="language" value="zh-CN" />
        <param name="filter" value="publish=yes" />
      </object>
    </div>
  </div>
</template>

<script lang='ts' setup name="BoxOfficeChart">
import { onMounted } from 'vue';

const initializeTableau = () => {
      const divElement = document.getElementById('viz1734431371257') as HTMLElement;
      const vizElement = divElement.getElementsByTagName('object')[0] as HTMLElement;

      if (divElement.offsetWidth > 800) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = '100%';
        vizElement.style.height = (divElement.offsetWidth * 0.75) + 'px';
      } else {
        vizElement.style.width = '100%';
        vizElement.style.height = '3127px';
      }

      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      vizElement.parentNode?.insertBefore(scriptElement, vizElement);
    };

    onMounted(() => {
      initializeTableau();
    });
</script>

<style scoped>
.box-office-chart {
  width: 95%;
  height: 90%;
  margin: 0 auto;
}
</style>

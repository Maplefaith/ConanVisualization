<template>
    <div class="tvseries">
        <h1>TV Series Visualization</h1>
        <div>
            <MapChart />
        </div>
        <div class="heatingmap">
            <ConanRatingsHeatmap />
        </div>
        <div>
            <BubbleChart />
        </div>
    </div>
</template>

<script setup name="TVseries", lang="ts">
import ConanRatingsHeatmap from '@/components/ConanRatingsHeatmap.vue';
import BubbleChart from '../components/BubbleChart.vue';
import MapChart from '../components/MapChart.vue';

</script>

<style scoped>
.tvseries{
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 10cm;
  border-radius: 10px;
  width: 90%;
  height: 120%;
}
.heatingmap{
    margin-top: 150px;
}
</style>
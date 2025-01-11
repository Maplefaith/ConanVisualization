<template>
    <div class="home">
        <h1 >Main Plot Timeline</h1>
        <Timeline/>
    </div>
</template>

<script setup lang="ts" name="Home">
import Timeline from '@/components/Timeline.vue'
</script>

<style scoped>
.home {
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('@/assets/home.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100%;
    position: relative;
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 40%, rgba(255, 255, 255, 1) 100%);
    -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 40%, rgba(255, 255, 255, 1) 100%);
    z-index: 1;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 1) 80%);
  z-index: -1;
  pointer-events: none;
}

</style>
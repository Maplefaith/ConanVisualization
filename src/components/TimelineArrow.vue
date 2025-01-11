<template>
  <defs>
    <!-- Define the arrow marker for the line -->
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
    >
      <polygon points="0,0 10,5 0,10" fill="#420217" />
    </marker>
  </defs>

  <!-- Main line representing the timeline segment -->
  <line
    :x1="(event.startPoint as Point).x"
    :y1="(event.startPoint as Point).y"
    :x2="currentPoint.x"
    :y2="currentPoint.y"
    stroke="#420217"
    stroke-width="2"
    :marker-end="'url(#arrow)'"
  />

  <!-- Vertical line displayed when the midpoint is reached -->
  <line
    v-if="isHorizontal && midPointReached"
    :x1="midPoint.x"
    :y1="midPoint.y - ((event.progress as number - 0.5) * (2 * 0.5 * padding))"
    :x2="midPoint.x"
    :y2="midPoint.y"
    stroke="#420217"
    stroke-width="2"
  />
</template>

<script setup lang="ts" name="timelineArrow">
import { computed, ref, onMounted, watch, onBeforeMount } from 'vue';
import type { Point } from '../types/TimelineType';
import { useTimelineArrowStore } from '@/store/Timeline';
import { storeToRefs } from 'pinia';

// Define component props
interface TimelineArrowProps {
  index: number;
  isHorizontal: boolean;
}

const props = defineProps<TimelineArrowProps>();

// Access the Pinia store and its reactive properties
const TimelineArrowStore = useTimelineArrowStore();
const { width, padding, isStop, speed } = storeToRefs(TimelineArrowStore);

// Compute the event data based on whether it's horizontal or vertical
const event = computed(() =>
  props.isHorizontal
    ? TimelineArrowStore.timelineData[props.index]
    : TimelineArrowStore.transitionPointData[props.index]
);

// Track whether the midpoint has been reached
const midPointReached = ref(false);

// Compute the midpoint of the line
const midPoint = computed(() => ({
  x: ((event.value.startPoint as Point).x + (event.value.endPoint as Point).x) / 2,
  y: (event.value.startPoint as Point).y,
}));

// Initialize the current point to the start point
const currentPoint = ref<Point>({
  x: (event.value.startPoint as Point).x,
  y: (event.value.startPoint as Point).y,
});

// Calculate the total distance between the start and end points
const totalDistance = Math.sqrt(
  Math.pow((event.value.endPoint as Point).x - (event.value.startPoint as Point).x, 2) +
  Math.pow((event.value.endPoint as Point).y - (event.value.startPoint as Point).y, 2)
);

// Track the remaining distance to animate
let leftDistance = totalDistance;

/**
 * Animates the line from the start point to the end point.
 */
const animateLine = (start: Point, end: Point) => {
  const animate = () => {
    if (isStop.value) return; // Stop animation if isStop is true

    if (leftDistance > 0) {
      leftDistance -= speed.value; // Update the remaining distance
      if (leftDistance < 0) {
        leftDistance = 0;
        event.value.progress = 1; // Ensure progress is exactly 1 at the end
      }

      // Update the progress and current point
      event.value.progress = (totalDistance - leftDistance) / totalDistance;
      currentPoint.value.x = start.x + (end.x - start.x) * event.value.progress;
      currentPoint.value.y = start.y + (end.y - start.y) * event.value.progress;

      // Check if the midpoint has been reached
      if (event.value.progress >= 0.5 && !midPointReached.value) {
        midPointReached.value = true;
      }

      requestAnimationFrame(animate); // Continue the animation
    }
  };

  animate();
};

// Start the animation when the component is mounted
onBeforeMount(() => {
  animateLine(event.value.startPoint as Point, event.value.endPoint as Point);
});

// Restart the animation if isStop changes to false
watch(isStop, () => {
  if (!isStop.value && (event.value.progress as number) < 1) {
    animateLine(event.value.startPoint as Point, event.value.endPoint as Point);
  }
});

// Restart the animation if speed changes
watch(speed, () => {
  if (!isStop.value && (event.value.progress as number) > 0 && (event.value.progress as number) < 1) {
    animateLine(event.value.startPoint as Point, event.value.endPoint as Point);
  }
});
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
}

.timeline-segment {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
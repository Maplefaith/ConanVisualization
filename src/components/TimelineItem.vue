<template>
  <!-- Define gradient -->
  <defs>
    <linearGradient
      :id="'gradient-' + index"
      :x1="event.direction === 1 ? '1' : '0'"
      :x2="event.direction === 1 ? '0' : '1'"
      :y1="event.direction === 1 ? '0' : '0'"
      :y2="event.direction === 1 ? '0' : '0'"
    >
      <stop offset="0%" :stop-color="event.startcolor" />
      <stop offset="100%" :stop-color="event.endcolor" />
    </linearGradient>
  </defs>
  
  <!-- Group for graphical elements -->
  <g>
    <!-- Rectangle representing event progress -->
    <rect
      :x="(event.direction === 1) ? anchorPoint.x + (event.width as number) - ((event.width as number) * (event.progress as number)) : anchorPoint.x"
      :y="anchorPoint.y"
      :width="(event.width as number) * (event.progress as number)"
      :height="(event.height as number)"
      :fill="'url(#gradient-' + index + ')'"
      class="rect-box"
    ></rect>

    <!-- Rectangle for date background -->
    <rect
      :x="(event.direction === 1) ?((midPoint.x + padding )-90* (event.progress as number)):((midPoint.x - padding - 10))"
      :y="midPoint.y +5"
      :width="90*(event.progress as number)"
      height="20"
      fill="rgba(254, 255, 165, 1)"
      rx="5" ry="5"
    />

    <!-- Event date text -->
    <text
      :x="midPoint.x - padding"
      :y="midPoint.y + 20"
      class="event-date"
      :opacity="(event.progress as number)"
    >
      {{ event.date}}
    </text>

    <!-- Event title text -->
    <text
      :x="anchorPoint.x + 10 "
      :y="anchorPoint.y + 30"
      class="event-title"
      :opacity="(event.progress as number)"
    >
      {{ event.title }}
    </text>

    <!-- Event description text -->
    <text
      :x="anchorPoint.x + 10"
      :y="anchorPoint.y + 65"
      :width="(event.width as number) - 20"
      text-anchor="start"
      class="event-description"
      :opacity="event.progress"
    >
      <template v-for="(line, index) in lines" :key="index">
        <tspan
          :x="anchorPoint.x + 10"
          :y="anchorPoint.y + 60 + index * lineHeight"
        >
          {{ line }}
        </tspan>
      </template>
    </text>
  </g>
</template>

<script setup lang="ts">
// Import necessary libraries and types
import { storeToRefs } from 'pinia';
import type { Point } from '../types/TimelineType';
import { useTimelineArrowStore } from '@/store/Timeline';
import { reactive, computed } from 'vue';

// Define component props
interface TimelineItemProps {
  index: number;
}

// Access props
const props = defineProps<TimelineItemProps>();

// Use Pinia store
const TimelineArrowStore = useTimelineArrowStore();
const { padding } = storeToRefs(TimelineArrowStore);

// Computed property to get the current event
const event = computed(() => TimelineArrowStore.timelineData[props.index]);

// Reactive object for anchor point coordinates
const anchorPoint = reactive(event.value.anchorPoint as Point);

// Computed property to calculate midpoint coordinates
const midPoint = computed(() => {
  return {
    x: ((event.value.startPoint as Point).x + (event.value.endPoint as Point).x) / 2,
    y: (event.value.startPoint as Point).y,
  };
});

// Line height for text
const lineHeight = 16;

// Maximum width for text wrapping
const maxWidth = (event.value.width as number) / 7.5;

// Function to calculate character length (full-width vs. half-width)
const getCharLength = (char: any) => {
  return /[^\x00-\xff]/.test(char) ? 2 : 1; // Full-width characters count as 2, others as 1
};

// Computed property to split event description into multiple lines
const lines = computed(() => {
  let description = event.value.description;
  let currentLine = '';
  let result: string[] = [];
  let currentLineLength = 0;
  let lastSpaceIndex = -1; // Track the last space index for wrapping

  // Check if a character is an English letter
  const isEnglishLetter = (char: string) => {
    return /[a-zA-Z]/.test(char);
  };

  // Iterate through each character to wrap text
  for (let i = 0; i < description.length; i++) {
    const char = description.charAt(i);
    const charLength = getCharLength(char);

    // Record the position of the last space
    if (char === ' ') {
      lastSpaceIndex = i;
    }

    // Check if the current line exceeds the maximum width
    if (currentLineLength + charLength > maxWidth) {
      if (lastSpaceIndex !== -1 && lastSpaceIndex > currentLine.length - 10) {
        // Wrap at the last space if possible
        const line = description.substring(0, lastSpaceIndex);
        result.push(line);
        description = description.substring(lastSpaceIndex + 1); // Remove processed part
        i = -1; // Reset index
        currentLine = '';
        currentLineLength = 0;
        lastSpaceIndex = -1;
      } else {
        // Force wrap if no space is found
        if (isEnglishLetter(currentLine[currentLine.length - 1]) && isEnglishLetter(char)) {
          // Add a hyphen if wrapping between English letters
          result.push(currentLine + '-');
        } else {
          // Otherwise, wrap directly
          result.push(currentLine);
        }
        currentLine = char;
        currentLineLength = charLength;
      }
    } else {
      currentLine += char;
      currentLineLength += charLength;
    }
  }

  // Add the remaining line to the result
  if (currentLine) {
    result.push(currentLine);
  }

  return result;
});
</script>

<style scoped>
/* Hover effect for popup images */
.popup-image:hover {
  transform: scale(1.1);
  opacity: 1;
}

/* Style for the rectangle box */
.rect-box {
  stroke: black;
  stroke-width: 2;
  rx: 8;
  filter: url(#dropShadow);
}

/* Style for the event date text */
.event-date {
  font-size: 14px;
  font-weight: bold;
  fill: #523244;
  font-family: Arial, sans-serif;
}

/* Style for the event title text */
.event-title {
  font-size: 16px;
  font-weight: bold;
  fill: #8B0000; /* Dark red */
  font-family: Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Style for the event description text */
.event-description {
  font-size: 13px;
  fill: #333333;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

/* Hover effect for popup images */
.popup-image {
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 1;
}

.popup-image:hover {
  transform: scale(1.1);
  opacity: 1;
}
</style>
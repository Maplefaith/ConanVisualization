<template>
  <div class="main">
  <!-- Button to refresh timeline -->
  <button class='button' @click="refreshTimeline">Refresh </button>
  <!-- Button to control process of rendering timeline -->
  <button class="button" @click="toggleStop">{{ isStop ?  'Continue':'Pause' }} </button>
  <!-- display state of rendering -->
  <div class="diaplay">Timeline is 
    <span class="dynamic-text" :class="isStop ? 'stuck-text' : 'moving-text'">
    {{ isStop ? 'stuck' : 'moving' }}
  </span>
  </div>
  <br>
  <!-- control the speed of rendering timeline -->
  <button class="button-speed" @click="increaseSpeed">Speed up timeline</button>
  <button class="button-speed" @click="decreaseSpeed">Slow down timeline</button>
  <!-- display speed of rendering timeline -->
  <div class="diaplay">Rendering speed:
    <span class="speed-text">
    {{ speed }}
  </span>
  </div>
  <!-- screen region -->
  <div class="option-container">
    <!-- Unselected Options Section -->
    <div class="unselected-options options-section">
      <h3>可选择的选项</h3>
      <ul class="options-list">
        <li v-for="(option, index) in unselectedOptions" :key="index">
          <button @click="addToFilters(option)" class="option-button">
            {{ option }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Selected Options Section -->
    <div class="selected-options options-section">
      <h3>已选择</h3>
      <ul class="options-list">
        <li v-for="(option, index) in typefilters" :key="index">
          <button @click="removeFromFilters(option)" class="option-button selected">
            {{ option }}
          </button>
        </li>
      </ul>
    </div>
  </div>
  <!-- timeline rendering -->
  <svg :width="canvaswidth" :height="canvasheight" class="timeline-container" :key="svgKey">
  <g v-for="(event,index) in timelineData" :key="index">  
    <TimelineArrow v-if="currentIndex>= index" :isHorizontal="true" :index="index" />
  </g>
  <g v-for="(event,index) in transitionPointData" :key="index">
    <TimelineArrow v-if="currentTransitionIndex>= index" :isHorizontal="false" :index="index"  />
  </g>
  <g v-for="(event,index) in timelineData" :key="index">
    <TimelineItem v-if="currentIndex>= index" :index="index"/>
  </g>
  </svg>
</div>
</template>

<script setup lang="ts" name="Timeline">
import TimelineArrow from './TimelineArrow.vue';
import TimelineItem from './TimelineItem.vue';
import { storeToRefs } from 'pinia';
import { watch, onBeforeMount, ref } from 'vue'
import useTimeline from '@/hooks/useTimeline';
import useEquipTimeline from '@/hooks/useEquipTimeline';

// initialization function
const {
  initializeData,
  cleanProgress,
} = useEquipTimeline()

// access data and method from useTimeline
const {
  svgKey,
  currentIndex,
  currentTransitionIndex,
  TimelineArrowStore,
  increaseSpeed,
  decreaseSpeed,
  toggleStop,
} = useTimeline();

// access data from TimelineArrowStore
const {timelineData, transitionPointData, NumberItemperline, canvasheight, canvaswidth, speed,typefilters,isStop} = storeToRefs(TimelineArrowStore)

// Options to be selected
const unselectedOptions = ref<string[]>([
  'begin',
  'Shelly',
  'Boss',
  'Rye whiskey',
  'Bourbon',
]);

// initialize options that has been selected
// typefilters.value.push('begin');

// add an option to filters
const addToFilters = (option: string) => {
  unselectedOptions.value = unselectedOptions.value.filter(
    (item) => item !== option
  );
  typefilters.value.push(option)
  // restart timeline
  refreshTimeline();
};

// remove an option to filters
const removeFromFilters = (option: string) => {
  unselectedOptions.value.push(option);
  typefilters.value = typefilters.value.filter((item) => item !== option);
  // restart timeline
  refreshTimeline();
};

/**
 * Refreshes the timeline by resetting progress, indices, and forcing a re-render.
 */
const refreshTimeline = () => {
    initializeData();
    cleanProgress();
    svgKey.value += 1; // Increment key to force re-render
    if (svgKey.value / 3 === 0) svgKey.value = 0; // Reset key if it exceeds a threshold
    currentIndex.value = -1; // Reset current index
    currentTransitionIndex.value = 0; // Reset transition index

};

// watch for timelineData
watch(
  () => {
    if (currentIndex.value !== -1) return timelineData.value[currentIndex.value]
    return undefined;
  }, 
  (newIndex) => {
    // If progress reaches 1
    if (currentIndex.value<timelineData.value.length && typeof newIndex !== 'undefined' && newIndex.progress === 1) {
      if(currentIndex.value%NumberItemperline.value ===NumberItemperline.value-1){
        currentTransitionIndex.value +=1; // next is TransitionPointData
      }else {
        currentIndex.value += 1; // next is timelineData
      }
    }
  },
  { deep: true } 
);

// watch for TransitionPointData
watch(
  () =>{
    if (transitionPointData.value.length>0) return transitionPointData.value[currentTransitionIndex.value]
    return undefined;
  }, 
  (newIndex) => {
    // If progress reaches 1
    if (typeof newIndex !== 'undefined' && newIndex.progress === 1) {
        currentIndex.value += 1;  // next is timelineData
    }
  },
  { deep: true }  
);

// before mounted
onBeforeMount(()=>{
  initializeData();
    })
</script>

<style scoped>
/* Timeline container with left margin */
.timeline-container {
  margin-left: 2cm;
}

/* General button styling */
.button {
  font-size: 20px;
  border-radius: 2ch;
  position: relative;
  width: 120px;
  padding: 10px 20px;
}

/* General button styling */
.button-speed {
  font-size: 20px;
  border-radius: 2ch;
  position: relative;
  width: 160px;
  padding: 10px 20px;
}

/* Display text styling */
.diaplay {
  font-size: 20px;
}
/* Container for both sections */
.option-container {
  display: flex; /* Use Flexbox for layout */
  gap: 20px; /* Space between the two sections */
  justify-content: center; /* Center horizontally */
  margin: 0 auto; /* Additional centering for older browsers */
  max-width: 1200px; /* Optional: Limit the maximum width */
  padding: 20px; /* Optional: Add padding */
}

/* Common styling for both sections */
.options-section {
  border: 2px solid #ccc; /* Border for the container */
  border-radius: 8px; /* Rounded corners */
  padding: 15px; /* Padding inside the container */
  flex: 1; /* Equal width for both sections */

}

/* Horizontal list layout */
.options-list {
  display: flex; /* Use Flexbox for horizontal layout */
  flex-wrap: wrap; /* Allow wrapping of items */
  gap: 10px; /* Space between list items */
  list-style: none; /* Remove default list bullets */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
  /* width: 50%; */
}

/* Styling for the buttons */
.option-button {
  padding: 8px 12px; /* Padding inside the button */
  font-size: 14px; /* Font size */
  color: #333; /* Text color */
  background-color: #fff; /* Background color */
  border: 1px solid #ddd; /* Border for the button */
  border-radius: 4px; /* Rounded corners for the button */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition */
}

/* Hover effect for the buttons */
.option-button:hover {
  background-color: #f0f0f0; /* Light gray background on hover */
  border-color: #ccc; /* Darker border on hover */
}

/* Styling for selected buttons */
.option-button.selected {
  background-color: #007bff; /* Blue background for selected buttons */
  color: #fff; /* White text for selected buttons */
  border-color: #007bff; /* Blue border for selected buttons */
}

/* Hover effect for selected buttons */
.option-button.selected:hover {
  background-color: #0056b3; /* Darker blue background on hover */
  border-color: #004080; /* Darker blue border on hover */
}

/* Remove default list styling */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Spacing for list items */
li {
  margin-bottom: 5px;
}

.dynamic-text {
  display: inline-block; /* Ensure the span behaves like a block */
  width: 60px; /* Fixed width to accommodate both "stuck" and "moving" */
  text-align: center; /* Center the text inside the span */
}

.stuck-text {
  color: red; /* Style for "stuck" */
  font-weight: bold;
}

.moving-text {
  color: green; /* Style for "moving" */
  font-style: italic;
}

.speed-text {
  display: inline-block; /* Ensure the span behaves like a block */
  width: 50px; /* Fixed width to accommodate different speed values */
  text-align: center; /* Center the text inside the span */
  font-weight: bold; /* Example style for dynamic text */
  color: blue;/* Example color for dynamic text */
}
</style>
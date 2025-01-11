import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTimelineArrowStore } from "@/store/Timeline";

export default function () {
    // Refs for tracking current rendering and transition indices
    const currentIndex = ref(-1); // Tracks the currently rendering timeline event
    const currentTransitionIndex = ref(0); // Tracks the currently rendering transition

    // Access the Pinia store and its reactive properties
    const TimelineArrowStore = useTimelineArrowStore();
    const { isStop, speed, timelineData, transitionPointData } = storeToRefs(TimelineArrowStore);

    // Key to force re-render the SVG component
    const svgKey = ref(0);

    /**
     * Increases the rendering speed by 1.
     */
    function increaseSpeed() {
        speed.value += 1;
    }

    /**
     * Decreases the rendering speed by 1, ensuring it doesn't go below 1.
     */
    function decreaseSpeed() {
        if (speed.value > 1) {
            speed.value -= 1;
        }
    }

    /**
     * Toggles the timeline between stopped and running states.
     */
    function toggleStop() {
        isStop.value = !isStop.value;
    }

    return {
        svgKey,
        currentIndex,
        currentTransitionIndex,
        TimelineArrowStore,
        increaseSpeed,
        decreaseSpeed,
        toggleStop,
    };
}
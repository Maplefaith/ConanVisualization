import { storeToRefs } from 'pinia';
import type { TimelineEvent, Point } from '../types/TimelineType';
import { useTimelineArrowStore } from '@/store/Timeline';

// Constants
const MAX_TEXT_LENGTH = 20;
const FIXED_HEIGHT = 120;

export default function () {
    const TimelineArrowStore = useTimelineArrowStore();
    // Destructure store refs for better readability
    const {
        timelineData, transitionPointData, padding, height, width, NumberItemperline,
        canvasheight, canvaswidth, BeforefilteredTimelineData, typefilters, ColorData
    } = storeToRefs(TimelineArrowStore);

    // Calculate the length of the description considering full-width and half-width characters
    const calculateDescriptionLength = (text: string): number => {
        return [...text].reduce((length, char) => length + (/^[\x00-\x7F]$/.test(char) ? 1 : 2), 0);
    };

    // Calculate dimensions (width and height) for each timeline event
    const calculateDimensions = (timelineData: TimelineEvent[]) => {
        timelineData.forEach(event => {
            const descriptionLength = calculateDescriptionLength(event.description);
            event.width = 9 * Math.min(descriptionLength, MAX_TEXT_LENGTH); // Dynamic width
            event.height = FIXED_HEIGHT; // Fixed height
        });
    };

    // Filter timeline data based on selected filters
    const createTimelineData = () => {
        timelineData.value = BeforefilteredTimelineData.value.filter(item =>
            typefilters.value.every(filter => item.type.includes(filter))
        );
    };

    function initializeCanvas(){
        canvaswidth.value = window.outerWidth;
        // Calculate the number of items per line based on canvas width
        NumberItemperline.value = Math.floor(canvaswidth.value / (width.value + 3 * padding.value));
        canvasheight.value = (Math.ceil(timelineData.value.length/NumberItemperline.value)+1.5)*(2*padding.value+height.value);
    }

    let currentPoint: Point = { x: padding.value, y: 0 };

    // Define gradient start and end colors
    const startColorWhole = { r: 242, g: 211, b: 152 };
    const endColorWhole = { r: 215, g: 133, b: 33 };

    // Interpolate between two colors
    const interpolateColor = (color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }, t: number) => ({
        r: Math.round(color1.r + (color2.r - color1.r) * t),
        g: Math.round(color1.g + (color2.g - color1.g) * t),
        b: Math.round(color1.b + (color2.b - color1.b) * t),
    });

    // Initialize points and directions for each timeline event
    const AttributePointData = () => {
        initializeCanvas();
        currentPoint = { x: padding.value, y: 0 };
        transitionPointData.value = [];

        timelineData.value.forEach((item, index) => {
            const isNewLine = index % (NumberItemperline.value * 2) === 0;
            const isFirstHalf = index % (NumberItemperline.value * 2) < NumberItemperline.value;
            const isSecondHalfStart = index % (NumberItemperline.value * 2) === NumberItemperline.value;

            if (isNewLine || isSecondHalfStart) {
                const transtart = currentPoint.y;
                currentPoint.y += 2 * padding.value + height.value;
                transitionPointData.value.push({
                    startPoint: { x: currentPoint.x, y: transtart },
                    endPoint: { x: currentPoint.x, y: currentPoint.y },
                    progress: 0
                });
            }

            item.direction = isFirstHalf ? 0 : 1;
            item.startPoint = { ...currentPoint };

            if (isNewLine || isFirstHalf) {
                currentPoint.x += width.value + 2 * padding.value;
            } else {
                currentPoint.x -= width.value + 2 * padding.value;
            }

            item.endPoint = { ...currentPoint };
            item.anchorPoint = {
                x: (item.startPoint.x + item.endPoint.x) / 2 - width.value / 2,
                y: item.startPoint.y - 0.5 * padding.value - height.value
            };
        });
    };

    // Assign gradient colors to each timeline event
    const AttributeColor = () => {
        const n = timelineData.value.length;
        const startColor = typefilters.value.length > 0 ? ColorData.value[typefilters.value[0]][0] : startColorWhole;
        const endColor = typefilters.value.length > 0 ? ColorData.value[typefilters.value[0]][1] : endColorWhole;

        timelineData.value.forEach((item, index) => {
            const t = index / (n - 1 || 1);
            const start = interpolateColor(startColor, endColor, t);
            const end = interpolateColor(startColor, endColor, (index + 1) / (n - 1 || 1));
            item.startcolor = `rgb(${start.r}, ${start.g}, ${start.b})`;
            item.endcolor = `rgb(${end.r}, ${end.g}, ${end.b})`;
        });
    };

    function cleanProgress(){
        timelineData.value.forEach((item, index) => {
            item.progress=0
        })
        transitionPointData.value.forEach((item, index) => {
            item.progress=0
        })
    }

    // Initialize all data
    const initializeData = () => {
        createTimelineData();
        calculateDimensions(timelineData.value);
        AttributePointData();
        AttributeColor();
    };

    return {
        calculateDimensions,
        AttributePointData,
        AttributeColor,
        createTimelineData,
        initializeData,
        cleanProgress,
    };
}
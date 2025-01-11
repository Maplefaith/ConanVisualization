<template>
  <img alt="1" src="../assets/title.png" style="width: 30%; height: auto; margin-top: 30px;">
  <h3 style="margin-left: 450px; margin-right: 450px; line-height: 1cm; padding-bottom: 1cm;">We selected the four most popular Conan theatrical movies, crawled their reviews (2,000 reviews)
     from Douban, and conducted word cloud analysis through word segmentation and stop words to obtain
      the key information of each movie.</h3>
    <div class="carousel-container">
      <div class="carousel">
        <div 
          class="image-container" 
          :style="getImageStyle(index)" 
          v-for="(image, index) in images" 
          :key="index"
        >
          <img :src="image.src" alt="WordCloud" class="wordcloud-image"/>
          <p v-if="index === currentIndex" class="image-caption">{{ image.caption }}</p>
        </div>
      </div>
      <div class="arrow left" v-on:click="moveLeft">←</div>
      <div class="arrow right" @click="moveRight">→</div>
    </div>
</template>
  
<script lang="ts" setup name='WordCloudCarousel'>
  import {ref}from 'vue'
  import feihongdezidan from '@/assets/feihongdezidan.jpg';
  import beikejie from '@/assets/beikejie.jpg';
  import lingdezhixingren from '@/assets/lingdezhixingren.jpg';
  import tongwangtianguodedaojishi from '@/assets/tongwangtianguodedaojishi.jpg';
        let currentIndex= ref(0)

        const images = ref([
  { src: feihongdezidan, caption: "绯红的子弹" },
  { src: beikejie, caption: "贝克街的亡灵" },
  { src: lingdezhixingren, caption: "零的执行人" },
  { src: tongwangtianguodedaojishi, caption: "通往天国的倒计时" },
]);
        
      function moveLeft() {
        currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
      }

      function moveRight() {
        currentIndex.value = (currentIndex.value + 1) % images.value.length;
      }
      
      const getImageStyle = (index: number)=> {
        return index === currentIndex.value
          ? { transform: 'scale(1.5)', transition: 'transform 0.3s' }
          : { transform: 'scale(0.8)', transition: 'transform 0.3s' };
      }
    
  
</script>
  
<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  margin-top: 100px; /* 调整上方间距 */
}

.carousel {
  display: flex;
  overflow: visible;
}

.image-container {
  margin: 0 30px;  /* 调整图片之间的间距 */
  text-align: center;
}

.wordcloud-image {
  width: 230px;  /* 调整图片大小 */
  height: auto; /* 调整图片大小 */
  object-fit: cover;
  transition: transform 0.3s, filter 0.3s; /* 添加对比度变化的过渡效果 */
  filter: contrast(1.05) brightness(1); /* 默认对比度和亮度 */
  border-radius: 10px; /* 圆角边框，增加柔和效果 */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* 给图片加上模糊阴影 */
}

.image-caption {
  margin-top: 15px; /* 增加图片与文字的间距 */
  margin-bottom: 50px;
  font-size: 18px;  /* 调整文字大小 */
  color: #333;
  font-weight: bold;
}

.arrow {
  position: absolute;
  top: 50%;
  font-size: 30px;
  color: black;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  cursor: pointer;
  user-select: none;
  transform: translateY(-50%);
}

.left {
  left: 10px;
}

.right {
  right: 10px;
}
</style>

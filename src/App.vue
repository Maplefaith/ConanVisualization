<template>
  <div class="app">
    <!-- Home Page Image -->
    <div class="home">
      <img alt="Vue logo" src="./assets/header.png" class="home-logo">
    </div>

    <!-- Navigation Bar -->
    <nav class="navigate">
      <RouterLink to="/" active-class="active">Home</RouterLink>
      <RouterLink to="/palgantong" active-class="active">Palgantong</RouterLink>
      <RouterLink to="/relationship" active-class="active">Relationship</RouterLink>
      <RouterLink to="/tvseries" active-class="active">TVseries</RouterLink>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<script lang="ts" setup name="App">
  import { RouterView, RouterLink } from 'vue-router';
</script>

<style scoped>
/* Global Styles */
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  min-height: 100vh; /* Ensure the page takes up the full viewport height */
}

/* Home Page Image Styles */
.home-logo {
  width: 40%;
  height: auto; /* Maintain image aspect ratio */
}

/* Navigation Bar Styles */
.navigate {
  display: flex;
  justify-content: space-around;
  background-image: linear-gradient(to right, #ff0000, #000000); /* Red to black gradient */
  margin: 5% 5%; 
  /* Left and right margins */
}

.navigate a {
  display: block;
  text-align: center;
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-decoration: none;
  color: #ffc268; /* Text color */
  font-weight: 500;
  font-size: 100%;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 0 3px black; /* Text shadow */
  flex: 1;
  transition: transform 0.3s ease; /* Smooth transition effect */
}

.navigate a:hover {
  transform: scale(1.1); /* Scale up on hover */
}

.navigate a.active {
  color: #ffc268;
  font-weight: 800;
  text-shadow: 0 0 10px black; /* Active state text shadow */
}

/* Main Content Area Styles */
.main-content {
  border-radius: 10px;
  width: 100%;
}
</style>
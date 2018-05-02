<template>
  <div id="loading">
    <img :src="src" />
  </div>
</template>

<script>
import ImgSrc from '../../static/loading.gif';

export default {
  data() {
    return {
      src: ImgSrc
    }
  }
}
</script>

<style scoped>
#loading {
  position: fixed;
  top: 1.5rem;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 999;
}
#loading > img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

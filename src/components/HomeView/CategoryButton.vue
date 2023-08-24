<template>
  <div class="category-button flex justify-center align-center">
    <slot />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.category-button {
  width: calc(100% / 2 - 30px);
  height: 100px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 18px;
  text-align: center;
  color: #475fff;
  cursor: pointer;
}
</style>
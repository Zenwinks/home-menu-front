<template>
  <div class="drink-button flex align-center">
    <slot />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.drink-button {
  height: 100px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  color: #475fff;
  cursor: pointer;
  padding: 0 10px;
  margin: 0 10px;
}
</style>
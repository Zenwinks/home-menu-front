<template>
  <div
    class="back-button row align-center justify-center"
    @click="router.push(route)"
  >
    <i
      v-if="homeButton"
      class="fa-solid fa-house row align-center justify-center"
    />
    <i
      v-else-if="adminButton"
      class="fa-solid fa-gears row align-center justify-center"
    />
    <i
      v-else
      class="fa-solid fa-arrow-left row align-center justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps({
  route: {
    type: String,
    required: true
  },
  homeButton: {
    type: Boolean,
    default: false,
  },
  adminButton: {
    type: Boolean,
    default: false,
  }
});

const router = useRouter();
</script>

<style lang="scss" scoped>
.back-button {
  font-size: 24px;
}
</style>
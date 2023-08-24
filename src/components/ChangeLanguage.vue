<template>
  <div class="change-language">
    <img
      :src="flagToDisplay"
      alt="Flag for lang"
      @click="changeLanguage"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const flagToDisplay = computed(() => {
  return locale.value === 'fr' ? '/icons/en.png' : '/icons/fr.png';
});

function changeLanguage() {
  if (locale.value === 'fr') { 
    locale.value = 'en';
  } else {
    locale.value = 'fr';
  }
}
</script>

<style lang="scss" scoped>
.change-language {
  img {
    width: 35px;
    height: 35px;
  }
}
</style>
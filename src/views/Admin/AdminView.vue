<template>
  <div class="admin-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/"
        home-button
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('ADMIN.TITLE') }}
    </div>
    <div class="actions mt-6 mx-2 col justify-center">
      <button @click="goTo('categoriesAdmin')">
        {{ t('ADMIN.MANAGE_CATEGORIES') }}
      </button>
      <button @click="goTo('drinksAdmin')">
        {{ t('ADMIN.MANAGE_DRINKS') }}
      </button>
      <button @click="goTo('ingredientsAdmin')">
        {{ t('ADMIN.MANAGE_INGREDIENTS') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import ChangeLanguage from '__/components/ChangeLanguage.vue';
import BackButton from '__/components/BackButton.vue';

import axios from '__/plugins/axios';
import authHeader from '__/services/auth-header';

const router = useRouter();
const { t } = useI18n();

onMounted(async () => {
  await axios.get('/me', { headers: authHeader() }); // try to know if browser is authenticated
});

function goTo(routeName: string) {
  router.push({ name: routeName });
}
</script>

<style lang="scss" scoped>
.admin-wrapper {
  .header {
    width: calc(100% - (4 * 0.25rem))
  }

  .title {
    font-size: 32px;
    font-weight: 600;
    text-align: center;
  }
}

.actions {
  width: calc(100% - (4 * 0.25rem));
  max-width: 500px;
  gap: 20px;

  button {
    height: 100px;
    border: none;
    background-color: #fff;
    color: #475fff;
    padding: 10px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 26px;
  }
}
</style>
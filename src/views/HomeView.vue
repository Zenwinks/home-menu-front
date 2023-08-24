<template>
  <div class="home-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/admin"
        admin-button
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('HOME.TITLE') }}
    </div>
    <div class="subtitle mt-3 mb-2 mx-2 col align-center">
      <span>{{ t('HOME.SUBTITLE_1') }}</span>
      <span>{{ t('HOME.SUBTITLE_2') }}</span>
    </div>
    <div
      class="loading full-width mt-6"
      v-if="loading"
    >
      <i class=" loading-icon fa-solid fa-spinner fa-spin" />
    </div>
    <div
      class="no-categories full-width mt-6"
      v-else-if="categories.length <= 0"
    >
      {{ t('HOME.NO_CATEGORIES') }}
    </div>
    <div
      class="categories full-width mt-6 row justify-evenly"
      v-else
    >
      <CategoryButton
        v-for="category in categories"
        :key="category._id"
        class="category"
        @click="goTo(category._id)"
      >
        {{ category.name }}
      </CategoryButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import axios from '__/plugins/axios';

import CategoryButton from '__/components/HomeView/CategoryButton.vue';
import ChangeLanguage from '__/components/ChangeLanguage.vue';
import BackButton from '__/components/BackButton.vue';

const { t } = useI18n();
const router = useRouter();

onMounted(async () => {
  await getCategories();
});

let categories = reactive<Category[]>([]);
const loading = ref(false);

async function getCategories() {
  loading.value = true;
  const { data } = await axios.get('/categories');
  categories = data;
  loading.value = false;
}

function goTo(categoryId: string) {
  router.push(`/${categoryId}`);
}
</script>

<style lang="scss" scoped>
.home-wrapper {
  .header {
    width: calc(100% - (4 * 0.25rem))
  }

  .title {
    font-size: 32px;
    font-weight: 600;
  }

  .subtitle {
    font-size: 14px;
    text-align: center;

    span:last-child {
      font-weight: 600;
    }
  }
}

.loading {
  flex: 1;
  text-align: center;

  .loading-icon {
    font-size: 60px;
  }
}

.categories {
  gap: 20px;
  flex-wrap: wrap;
}

.no-categories {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.admin {
  position: absolute;
  top: 15px;
  left: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>
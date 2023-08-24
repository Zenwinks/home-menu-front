<template>
  <div class="category-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/"
        home-button
      />
      <ChangeLanguage />
    </div>
    <div
      class="title"
      v-if="category"
    >
      {{ category.name }}
    </div>
    <div
      class="loading full-width"
      v-if="loading"
    >
      <i class=" loading-icon fa-solid fa-spinner fa-spin" />
    </div>
    <div
      class="no-drink full-width"
      v-else-if="drinks.length <= 0"
    >
      {{ t('HOME.NO_DRINKS') }}
    </div>
    <div
      class="drinks full-width col"
      v-else
    >
      <DrinkButton
        v-for="drink in drinks"
        :key="drink._id"
        class="drink col justify-center align-start"
      >
        <span class="drink__name">{{ drink.name }}</span>
        <span
          class="drink__description"
          v-if="drink.description"
        >{{ drink.description }}</span>
        <span
          class="drink__ingredients"
          v-if="drink.ingredients && drink.ingredients.length > 0"
        >
          <span class="drink__ingredients__title">{{ t('TYPES.INGREDIENTS') }}:</span> {{ displayIngredients(drink.ingredients) }}
        </span>
      </DrinkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import BackButton from '__/components/BackButton.vue';
import ChangeLanguage from '__/components/ChangeLanguage.vue';
import DrinkButton from '__/components/CategoryView/DrinkButton.vue';

import axios from '__/plugins/axios';

onMounted(async () => {
  await setUpCategoryAndDrinks();
});

const { t } = useI18n();
const route = useRoute();

const category = ref<Category|null>(null);
let drinks = reactive<Drink[]>([]);
const loading = ref(false);

async function setUpCategoryAndDrinks() {
  loading.value = true;
  const categoryId = route.params.categoryId;
  const { data: dataCategory } = await axios.get(`category/${categoryId}`);
  category.value = dataCategory;
  const { data: dataDrinks } = await axios.get(`drinks/${categoryId}`);
  drinks = dataDrinks;
  loading.value = false;
}

function displayIngredients(ingredients: Ingredient[]) {
  return ingredients.map((ingredient: Ingredient) => ingredient.name).join(', ');
}
</script>

<style lang="scss" scoped>
.category-wrapper {
  .header {
    width: calc(100% - (4 * 0.25rem))
  }

  .title {
    font-size: 32px;
    font-weight: 600;
  }
}

.loading {
  flex: 1;
  text-align: center;

  .loading-icon {
    font-size: 60px;
  }
}

.drinks, .no-drink, .loading {
  margin-top: 30px;
}

.drinks {
  gap: 20px;
}

.no-drink {
  text-align: center;
  font-size: 24px;
}

.drink {
  &__name {
    font-size: 24px;
    font-weight: 600;
  }

  &__description {
    margin-top: 5px;
    font-size: 12px;
  }

  &__ingredients {
    margin-top: 15px;
    font-size: 12px;

    &__title {
      font-weight: 600;
      text-decoration: underline;
    }
  }
}
</style>
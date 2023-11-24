<template>
  <div class="drinks-admin-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/admin"
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('ADMIN.DRINKS') }}
    </div>
    <input
      type="text"
      v-model="search"
      class="search mt-6"
      :placeholder="t('ADMIN.MANAGE_DRINKS.SEARCH')"
    >
    <div
      class="loading mt-6 full-width"
      v-if="loading"
    >
      <i class=" loading-icon fa-solid fa-spinner fa-spin" />
    </div>
    <div
      class="no-drink mt-6 full-width"
      v-else-if="drinks.length <= 0"
    >
      {{ t('HOME.NO_DRINKS') }}
    </div>
    <div
      class="drinks col mt-6"
      v-else
    >
      <div
        class="drink row align-center px-2"
        v-for="drink in filteredDrinks"
        :key="drink._id"
      >
        <div class="infos col my-2 mr-2">
          <span class="drink__name">{{ drink.name }}</span>
          <span
            class="drink__description mt-1"
            v-if="drink.description"
          >
            {{ drink.description }}
          </span>
          <span
            class="drink__ingredients mt-2"
            v-if="drink.ingredients && drink.ingredients.length > 0"
          >
            <span class="drink__ingredients__title">{{ t('TYPES.INGREDIENTS') }}:</span> {{ displayIngredients(drink.ingredients) }}
          </span>
          <template
            v-if="drink.ingredients && drink.ingredients.length > 0"
          >
            <span
              class="drink__count mt-2"
              v-if="canMakeDrink(drink.ingredients)"
            >{{ t('ADMIN.TYPES.MAKEABLE') }}</span>
            <span
              class="drink__count mt-2"
              v-else
            >{{ t('ADMIN.TYPES.NOT_MAKEABLE') }}</span>
          </template>
          <span
            class="drink__count mt-2"
            v-else
          ><span class="drink__count__title">{{ t('ADMIN.TYPES.REMAINING') }}:</span> {{ drink.count }}</span>
          <span
            class="drink__private mt-2"
            v-if="drink.private"
          >{{ t('ADMIN.TYPES.PRIVATE_TEXT_1') }} <b>{{ t('ADMIN.TYPES.PRIVATE_TEXT_2') }}</b>. {{ t('ADMIN.TYPES.PRIVATE_TEXT_3') }}</span>
        </div>
        <div class="actions row">
          <i
            class="edit fa-solid fa-pen"
            @click="openUpsertModal(drink)"
          />
          <i
            class="delete fa-solid fa-trash"
            @click="openDeleteModal(drink)"
          />
        </div>
      </div>
    </div>
    <button
      class="addButton flex justify-center align-center pa-2 my-4"
      @click="openUpsertModal()"
    >
      <i class="fa-solid fa-plus" />
      <span>Ajouter une boisson</span>
    </button>
    <UpsertModal
      v-if="showUpsertModal"
      :title="selectedDrink._id ? t('ADMIN.UPSERT_MODAL.TITLE_EDIT_DRINK') : t('ADMIN.UPSERT_MODAL.TITLE_ADD_DRINK')"
      class="modal"
      @save="upsertDrink"
      @close="closeModal"
    >
      <template v-if="loading">
        <div
          class="loading full-width"
          v-if="loading"
        >
          <i class=" loading-icon fa-solid fa-spinner fa-spin" />
        </div>
      </template>
      <template v-else>
        <div class="name">
          <label
            for="name"
            class="name__label"
          >
            {{ t('ADMIN.MANAGE_DRINKS.NAME') }}*
          </label>
          <input
            type="text"
            class="name__input"
            v-model="selectedDrink.name"
          >
        </div>
        <div class="description mt-4">
          <label
            for="description"
            class="description__label"
          >
            {{ t('ADMIN.MANAGE_DRINKS.DESC') }}
          </label>
          <textarea
            class="description__input"
            v-model="selectedDrink.description"
          />
        </div>
        <div class="ingredients mt-4">
          <label
            for="ingredients"
            class="ingredients__label"
          >
            {{ t('ADMIN.MANAGE_DRINKS.INGREDIENTS') }}*
          </label>
          <div class="ingredients__list mb-4">
            <div
              class="item"
              v-for="(drinkIngredient, index) in selectedDrink.ingredients"
              :key="drinkIngredient._id"
            >
              <span class="item__name mr-3">{{ drinkIngredient.name }}</span>
              <i
                class="item__delete fa-solid fa-xmark"
                @click="deleteIngredient(index)"
              />
            </div>
          </div>
          <div
            class="add-ingredient"
            v-if="ingredientToBeAdded"
          >
            <label
              for="add-ingredient"
              class="add-ingredient__label"
            >
              Rechercher un ingrédient
            </label>
            <input
              type="text"
              v-model="searchIngredients"
            >
            <div
              class="ingredients-not-added col mt-2"
              v-if="searchIngredients.length >= 3"
            >
              <div
                class="ingredient pa-2"
                v-for="ingredient in filteredIngredients"
                :key="ingredient._id"
                @click="addIngredient(ingredient)"
              >
                {{ ingredient.name }}
              </div>
            </div>
          </div>
          <button
            class="ingredient__add"
            v-else
            @click="ingredientToBeAdded = true"
          >
            {{ t('ADMIN.TYPES.ADD_INGREDIENT') }}
          </button>
        </div>
        <div class="category mt-4">
          <label
            for="category"
            class="category__label"
          >
            {{ t('ADMIN.MANAGE_DRINKS.CATEGORY') }}*
          </label>
          <select
            class="category__select py-2"
            v-model="selectedDrink.category"
          >
            <option
              v-for="category in categories"
              :key="category._id"
              :value="category"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div
          class="count mt-4"
          v-if="!selectedDrink.ingredients || selectedDrink.ingredients.length === 0"
        >
          <label
            for="count"
            class="count__label"
          >
            {{ t('ADMIN.MANAGE_DRINKS.COUNT') }}*
          </label>
          <input
            type="number"
            class="count__input"
            v-model="selectedDrink.count"
          >
        </div>
        <div class="private mt-4 row align-center">
          <input
            type="checkbox"
            class="mr-2"
            v-model="selectedDrink.private"
          >
          <label for="private">{{ t('ADMIN.TYPES.PRIVATE') }}</label>
        </div>
      </template>
    </UpsertModal>
    <DeleteModal
      v-if="showDeleteModal"
      :element="selectedDrink"
      :type="t('TYPES.DRINK')"
      @delete="deleteDrink"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ChangeLanguage from '__/components/ChangeLanguage.vue';
import BackButton from '__/components/BackButton.vue';
import UpsertModal from '__/components/UpsertModal.vue';
import DeleteModal from '__/components/DeleteModal.vue';

import axios from '__/plugins/axios';
import authHeader from '__/services/auth-header';
import { deepCopy } from '__/utils';

const { t } = useI18n();

const drinkSkeleton = {
  name: '',
  ingredients: [],
  count: 0,
  private: false
};

const search = ref('');
const loading = ref(false);
const showUpsertModal = ref(false);
const showDeleteModal = ref(false);
const selectedDrink = ref<Drink>(deepCopy(drinkSkeleton) as Drink);
const drinks = ref<Drink[]>([]);
const categories = ref<Category[]>([]);
const ingredients = ref<Ingredient[]>([]);
const ingredientToBeAdded = ref(false);
const searchIngredients = ref('');

onMounted(async () => {
  await getDrinks();
});

const filteredDrinks = computed(() => {
  return drinks.value.filter((drink) =>
    drink.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const ingredientsWithoutAlreadyAdded = computed(() => {
  if(selectedDrink.value!.ingredients && selectedDrink.value.ingredients.length > 0) {
    return ingredients.value.filter(x => !selectedDrink.value.ingredients!.includes(x));
  } else {
    return ingredients.value;
  }
});

const filteredIngredients = computed(() => {
  return ingredientsWithoutAlreadyAdded.value.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchIngredients.value.toLowerCase())
  );
});

function displayIngredients(ingredients: Ingredient[]) {
  return ingredients.map((ingredient: Ingredient) => ingredient.name).join(', ');
}

function canMakeDrink(ingredients: Ingredient[]) {
  return ingredients.every((ingredient: Ingredient) => ingredient.count > 0);
}

/**
 * DRINK CRUD
 */

async function getDrinks() {
  loading.value = true;
  const { data } = await axios.get('/drinks');
  drinks.value = data;
  loading.value = false;
}

async function getAdditionalInfos() {
  loading.value = true;
  const { data: dataCategories } = await axios.get('/categories');
  categories.value = dataCategories;
  const { data: dataIngredients } = await axios.get('/ingredients');
  ingredients.value = dataIngredients;
  loading.value = false;
}

async function upsertDrink() {
  if (selectedDrink.value._id) {
    const { data } = await axios.patch(`/drink/${selectedDrink.value._id}`, selectedDrink.value, { headers: authHeader() });
    const updatedDrink: Drink = data;
    updatedDrink.ingredients = selectedDrink.value.ingredients;
    updatedDrink.category = selectedDrink.value.category;
    const drinkIndex = drinks.value.findIndex((c) => c._id === updatedDrink._id);
    drinks.value.splice(drinkIndex, 1, updatedDrink);
  } else {
    const { data } = await axios.post('/drink', selectedDrink.value, { headers: authHeader() });
    const addedDrink: Drink = data;
    addedDrink.ingredients = selectedDrink.value.ingredients;
    addedDrink.category = selectedDrink.value.category;
    drinks.value.push(addedDrink);
  }
  closeModal();
}

function addIngredient(ingredient: Ingredient) {
  selectedDrink.value.count = 0;
  selectedDrink.value!.ingredients!.push(ingredient);
  ingredientToBeAdded.value = false;
  searchIngredients.value = '';
}

async function deleteDrink() {
  await axios.delete(`/drink/${selectedDrink.value._id}`, { headers: authHeader() });
  const drinkIndex = drinks.value.findIndex((c) => c._id === selectedDrink.value._id);
  drinks.value.splice(drinkIndex, 1);
  closeModal();
}

function deleteIngredient(ingredientIndex: number) {
  selectedDrink.value!.ingredients!.splice(ingredientIndex, 1);
}

/**
 * MODALS MANAGEMENT
 */

function openUpsertModal(drink?: Drink) {
  if(categories.value.length === 0 || ingredients.value.length === 0) getAdditionalInfos();
  if(drink) selectedDrink.value = deepCopy(drink) as Drink;
  showUpsertModal.value = true;
}

function openDeleteModal(drink: Drink) {
  selectedDrink.value = drink;
  showDeleteModal.value = true;
}

function closeModal() {
  showUpsertModal.value = false;
  showDeleteModal.value = false;
  selectedDrink.value = deepCopy(drinkSkeleton) as Drink;
}
</script>

<style lang="scss" scoped>
.drinks-admin-wrapper {
  .header {
    width: calc(100% - (4 * 0.25rem))
  }

  .title {
    font-size: 32px;
    font-weight: 600;
    text-align: center;
  }
}

.search {
  width: 90%;
  height: 2rem;
  padding: 10px;
  appearance: none;
  border: none;
  outline: none;
  border-bottom: .2em solid #1232fd;
  background: #fff;
  border-radius: .2em .2em 0 0;
  padding: .4em;
  color: #475fff;
}

.loading, .no-drink, .drinks {
  width: 90%;
}

.loading {
  flex: 1;
  text-align: center;

  .loading-icon {
    font-size: 60px;
  }
}

.no-drink {
  text-align: center;
  font-size: 24px;
}

.drinks {
  gap: 15px;
  overflow-y: auto;

  .drink {
    background-color: #fff;
    color: #475fff;
    border-radius: 5px;

    .infos {
      flex: 1;
    }

    &__name {
      font-size: 24px;
      font-weight: 600;
    }

    &__description {
      font-size: 12px;
    }

    &__ingredients {
      font-size: 12px;

      &__title {
        font-weight: 600;
        text-decoration: underline;
      }
    }

    &__count {
      font-size: 12px;

      &__title {
        font-weight: 600;
        text-decoration: underline;
      }
    }

    &__private {
      font-size: 12px;
    }

    .actions {
      gap: 20px;

      .delete {
        color: red;
      }
    }
  }
}

.modal {
  label {
    font-size: 14px;
    font-weight: 600;
  }
  
  input[type="text"], input[type="number"] {
    width: 100%;
    height: 25px;
    appearance: none;
    border: none;
    outline: none;
    border-bottom: .2em solid #475fff;
    background: #fff;
    border-radius: .2em .2em 0 0;
    padding: .4em 0;
  }

  textarea {
    width: calc(100% - 2px); // - 2px for the border
    height: 50px;
    appearance: none;
    border: 1px solid #475fff;
    outline: none;
    background: #fff;
    border-radius: .2em .2em 0 0;
    padding: .4em 0;
  }

  select {
    width: 100%;
    outline: none;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 15px;
    height: 15px;
  }
}

.add-ingredient .add-ingredient__label {
  font-size: 12px;
}

.ingredients-not-added {
  gap: 5px;

  .ingredient {
    background-color: #475fff;
    color: #fff;
    border-radius: 5px;
  }
}

.addButton {
  border-radius: 10px;
  border: none;
  color: #475fff;
  font-size: 20px;
  font-weight: 600;
  gap: 5px;

  i {
    font-size: 30px;
  }
}
</style>
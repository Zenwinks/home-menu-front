<template>
  <div class="ingredients-admin-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/admin"
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('ADMIN.INGREDIENTS') }}
    </div>
    <input
      type="text"
      v-model="search"
      class="search mt-6"
      :placeholder="t('ADMIN.MANAGE_INGREDIENTS.SEARCH')"
    >
    <div
      class="loading mt-6 full-width"
      v-if="loading"
    >
      <i class=" loading-icon fa-solid fa-spinner fa-spin" />
    </div>
    <div
      class="no-ingredient mt-6 full-width"
      v-else-if="ingredients.length <= 0"
    >
      {{ t('HOME.NO_INGREDIENTS') }}
    </div>
    <div
      class="ingredients col mt-6"
      v-else
    >
      <div
        class="ingredient row align-center px-2"
        v-for="ingredient in filteredIngredients"
        :key="ingredient._id"
      >
        <div class="infos col my-2 mr-2">
          <span class="ingredient__name">{{ ingredient.name }}</span>
          <span
            class="ingredient__count mt-2"
          ><span class="ingredient__count__title">{{ t('ADMIN.TYPES.REMAINING') }}:</span> {{ ingredient.count }}</span>
        </div>
        <div class="actions row">
          <i
            class="edit fa-solid fa-pen"
            @click="openUpsertModal(ingredient)"
          />
          <i
            class="delete fa-solid fa-trash"
            @click="openDeleteModal(ingredient)"
          />
        </div>
      </div>
    </div>
    <button
      class="addButton flex justify-center align-center"
      @click="openUpsertModal()"
    >
      <i class="fa-solid fa-plus" />
    </button>
    <UpsertModal
      v-if="showUpsertModal"
      :title="selectedIngredient._id ? t('ADMIN.UPSERT_MODAL.TITLE_EDIT_INGREDIENT') : t('ADMIN.UPSERT_MODAL.TITLE_ADD_INGREDIENT')"
      class="modal"
      @save="upsertIngredient"
      @close="closeModal"
    >
      <div class="name">
        <label
          for="name"
          class="name__label"
        >
          {{ t('ADMIN.MANAGE_INGREDIENTS.NAME') }}*
        </label>
        <input
          type="text"
          class="name__input"
          v-model="selectedIngredient.name"
        >
      </div>
      <div class="count mt-6">
        <label
          for="count"
          class="count__label"
        >
          {{ t('ADMIN.MANAGE_INGREDIENTS.COUNT') }}*
        </label>
        <input
          type="number"
          class="count__input"
          v-model="selectedIngredient.count"
        >
      </div>
    </UpsertModal>
    <DeleteModal
      v-if="showDeleteModal"
      :element="selectedIngredient"
      :type="t('TYPES.INGREDIENT')"
      @delete="deleteIngredient"
      @close="closeModal"
    >
      <span class="delete-subtext">{{ t('ADMIN.DELETE_MODAL.INGREDIENT_SUBTEXT') }}</span>
    </DeleteModal>
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

const ingredientSkeleton = {
  name: '',
  count: 0
};

const search = ref('');
const loading = ref(false);
const showUpsertModal = ref(false);
const showDeleteModal = ref(false);
const selectedIngredient = ref<Ingredient>(deepCopy(ingredientSkeleton) as Ingredient);
const ingredients = ref<Ingredient[]>([]);

onMounted(async () => {
  await getIngredients();
});

const filteredIngredients = computed(() => {
  return ingredients.value.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

/**
 * INGREDIENT CRUD
 */

async function getIngredients() {
  loading.value = true;
  const { data } = await axios.get('/ingredients');
  ingredients.value = data;
  loading.value = false;
}

async function upsertIngredient() {
  if (selectedIngredient.value._id) {
    const { data } = await axios.patch(`/ingredient/${selectedIngredient.value._id}`, selectedIngredient.value, { headers: authHeader() });
    const updatedIngredient: Ingredient = data;
    const ingredientIndex = ingredients.value.findIndex((c) => c._id === updatedIngredient._id);
    ingredients.value.splice(ingredientIndex, 1, updatedIngredient);
  } else {
    const { data } = await axios.post('/ingredient', selectedIngredient.value, { headers: authHeader() });
    const addedIngredient: Ingredient = data;
    ingredients.value.push(addedIngredient);
  }
  closeModal();
}

async function deleteIngredient() {
  await axios.delete(`/ingredient/${selectedIngredient.value._id}`, { headers: authHeader() });
  const ingredientIndex = ingredients.value.findIndex((c) => c._id === selectedIngredient.value._id);
  ingredients.value.splice(ingredientIndex, 1);
  closeModal();
}

/**
 * MODALS MANAGEMENT
 */

function openUpsertModal(ingredient?: Ingredient) {
  if(ingredient) selectedIngredient.value = deepCopy(ingredient) as Ingredient;
  showUpsertModal.value = true;
}

function openDeleteModal(ingredient: Ingredient) {
  selectedIngredient.value = ingredient;
  showDeleteModal.value = true;
}

function closeModal() {
  showUpsertModal.value = false;
  showDeleteModal.value = false;
  selectedIngredient.value = deepCopy(ingredientSkeleton) as Ingredient;
}
</script>

<style lang="scss" scoped>
.ingredients-admin-wrapper {
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

.loading, .no-ingredient, .ingredients {
  width: 90%;
}

.loading {
  flex: 1;
  text-align: center;

  .loading-icon {
    font-size: 60px;
  }
}

.no-ingredient {
  text-align: center;
  font-size: 24px;
}

.ingredients {
  gap: 15px;

  .ingredient {
    height: 60px;
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

    &__count {
      font-size: 12px;

      &__title {
        font-weight: 600;
        text-decoration: underline;
      }
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
  
  input {
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
}

.delete-subtext {
  font-weight: 600;
}

.addButton {
  position: fixed;
  bottom: 15px;
  right: 15px;
  border-radius: 180px;
  border: none;
  width: 60px;
  height: 60px;
  font-size: 30px;
  color: #475fff;
}
</style>
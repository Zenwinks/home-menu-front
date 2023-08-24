<template>
  <div class="categories-admin-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/admin"
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('ADMIN.CATEGORIES') }}
    </div>
    <input
      type="text"
      v-model="search"
      class="search mt-6"
      :placeholder="t('ADMIN.MANAGE_CATEGORIES.SEARCH')"
    >
    <div
      class="loading mt-6 full-width"
      v-if="loading"
    >
      <i class=" loading-icon fa-solid fa-spinner fa-spin" />
    </div>
    <div
      class="no-category mt-6 full-width"
      v-else-if="categories.length <= 0"
    >
      {{ t('HOME.NO_CATEGORIES') }}
    </div>
    <div
      class="categories col mt-6"
      v-else
    >
      <div
        class="category row align-center px-2"
        v-for="category in filteredCategories"
        :key="category._id"
      >
        <span class="name mr-2">{{ category.name }}</span>
        <div class="actions row">
          <i
            class="edit fa-solid fa-pen"
            @click="openUpsertModal(category)"
          />
          <i
            class="delete fa-solid fa-trash"
            @click="openDeleteModal(category)"
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
      :title="selectedCategory._id ? t('ADMIN.UPSERT_MODAL.TITLE_EDIT_CATEGORY') : t('ADMIN.UPSERT_MODAL.TITLE_ADD_CATEGORY')"
      @save="upsertCategory"
      @close="closeModal"
    >
      <div class="name">
        <label
          for="name"
          class="name__label"
        >
          {{ t('ADMIN.MANAGE_CATEGORIES.NAME') }}*
        </label>
        <input
          type="text"
          class="name__input"
          v-model="selectedCategory.name"
        >
      </div>
    </UpsertModal>
    <DeleteModal
      v-if="showDeleteModal"
      :element="selectedCategory"
      :type="t('TYPES.CATEGORY')"
      @delete="deleteCategory"
      @close="closeModal"
    >
      <span class="delete-subtext">{{ t('ADMIN.DELETE_MODAL.CATEGORY_SUBTEXT') }}</span>
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

const categorySkeleton = {
  name: '',
};

const search = ref('');
const loading = ref(false);
const showUpsertModal = ref(false);
const showDeleteModal = ref(false);
const selectedCategory = ref<Category>(deepCopy(categorySkeleton) as Category);
const categories = ref<Category[]>([]);

onMounted(async () => {
  await getCategories();
});

const filteredCategories = computed(() => {
  return categories.value.filter((category) =>
    category.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

/**
 * CATEGORY CRUD
 */

async function getCategories() {
  loading.value = true;
  const { data } = await axios.get('/categories');
  categories.value = data;
  loading.value = false;
}

async function upsertCategory() {
  if (selectedCategory.value._id) {
    const { data } = await axios.patch(`/category/${selectedCategory.value._id}`, selectedCategory.value, { headers: authHeader() });
    const updatedCategory: Category = data;
    const categoryIndex = categories.value.findIndex((c) => c._id === updatedCategory._id);
    categories.value.splice(categoryIndex, 1, updatedCategory);
  } else {
    const { data } = await axios.post('/category', selectedCategory.value, { headers: authHeader() });
    const addedCategory: Category = data;
    categories.value.push(addedCategory);
  }
  closeModal();
}

async function deleteCategory() {
  await axios.delete(`/category/${selectedCategory.value._id}`, { headers: authHeader() });
  const categoryIndex = categories.value.findIndex((c) => c._id === selectedCategory.value._id);
  categories.value.splice(categoryIndex, 1);
  closeModal();
}

/**
 * MODALS MANAGEMENT
 */

function openUpsertModal(category?: Category) {
  if(category) selectedCategory.value = deepCopy(category) as Category;
  showUpsertModal.value = true;
}

function openDeleteModal(category: Category) {
  selectedCategory.value = category;
  showDeleteModal.value = true;
}

function closeModal() {
  showUpsertModal.value = false;
  showDeleteModal.value = false;
  selectedCategory.value = deepCopy(categorySkeleton) as Category;
}
</script>

<style lang="scss" scoped>
.categories-admin-wrapper {
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

.loading, .no-category, .categories {
  width: 90%;
}

.loading {
  flex: 1;
  text-align: center;

  .loading-icon {
    font-size: 60px;
  }
}

.no-category {
  text-align: center;
  font-size: 24px;
}

.categories {
  gap: 15px;

  .category {
    height: 60px;
    background-color: #fff;
    color: #475fff;
    border-radius: 5px;

    .name {
      flex: 1;
    }

    .actions {
      gap: 20px;

      .delete {
        color: red;
      }
    }
  }
}

.name {
  &__label {
    font-size: 14px;
    font-weight: 600;
  }
  
  &__input {
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
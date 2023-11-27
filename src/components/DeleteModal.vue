<template>
  <div class="delete-modal-wrapper col">
    <div class="header ma-2 row align-center">
      <div class="title">
        {{ t('ADMIN.DELETE_MODAL.TITLE') }}
      </div>
      <div
        class="close"
        @click="emits('close')"
      >
        <i class="fa-solid fa-xmark" />
      </div>
    </div>
    <div class="content my-4 mx-2">
      <span>{{ t('ADMIN.DELETE_MODAL.TEXT') }}</span>
      <div class="type mt-4">
        <span class="type__title">{{ t('ADMIN.DELETE_MODAL.TYPE') }}:</span> {{ type }}
      </div>
      <div class="name mt-2">
        <span class="name__title">{{ t('ADMIN.DELETE_MODAL.NAME') }}:</span> {{ element.name }}
      </div>
      <div class="additional-infos mt-6">
        <slot />
      </div>
    </div>
    <div class="footer ma-2 row justify-end">
      <button
        type="button"
        class="cancel"
        @click="emits('close')"
      >
        {{ t('UI.CANCEL') }}
      </button>
      <button
        type="button"
        class="delete"
        @click="submitDelete"
      >
        {{ t('UI.DELETE') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  element: {
    type: Object as PropType<Category|Drink|Ingredient>,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['close', 'delete']);

const { t } = useI18n();

function submitDelete() {
  emits('delete');
}
</script>

<style lang="scss" scoped>
.delete-modal-wrapper {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  color: #475fff;
}

.header {
  font-size: 28px;
  
  .title {
    flex: 1;
  }

  .close {
    color: lightgray;
  }
}

.content {
  .type__title, .name__title {
    font-weight: 600;
    text-decoration: underline;
  }
}

.footer {
  gap: 25px;

  button {
    z-index: 200;
    width: 100px;
    height: 50px;
    border: none;
    background-color: #475fff;
    color: #fff;
    border-radius: 5px;

    &.cancel {
      background-color: lightgray;
      color: black;
    }

    &.delete {
      background-color: #475fff;
      color: #fff;
    }
  }
}
</style>
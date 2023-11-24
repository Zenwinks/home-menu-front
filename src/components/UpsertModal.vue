<template>
  <div class="category-modal-wrapper col">
    <div class="header ma-2 row align-center">
      <div class="title">
        {{ title }}
      </div>
      <div
        class="close"
        @click="emits('close')"
      >
        <i class="fa-solid fa-xmark" />
      </div>
    </div>
    <div class="content my-4 mx-2">
      <slot />
    </div>
    <div class="footer ma-2 row justify-end">
      <button
        class="cancel"
        @click="emits('close')"
      >
        {{ t('UI.CANCEL') }}
      </button>
      <button
        class="valid"
        @click="submitUpsertElement"
      >
        {{ t('UI.CONFIRM') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps({
  title: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['save', 'close']);

const { t } = useI18n();

function submitUpsertElement() {
  emits('save');
}
</script>

<style lang="scss" scoped>
.category-modal-wrapper {
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
  overflow-y: auto;
}

.footer {
  gap: 25px;

  button {
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

    &.valid {
      background-color: #475fff;
      color: #fff;
    }
  }
}
</style>
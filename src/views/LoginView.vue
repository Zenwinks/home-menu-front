<template>
  <div class="login-wrapper full-size col align-center">
    <div class="header mt-2 mx-2 row justify-between">
      <BackButton
        route="/"
        home-button
      />
      <ChangeLanguage />
    </div>
    <div class="title">
      {{ t('LOGIN.TITLE') }}
    </div>
    <div class="login-form mt-4 col align-center">
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        v-model="username"
        @keyup.enter="signIn"
      >
      <input
        type="password"
        placeholder="Mot de passe"
        v-model="password"
        @keyup.enter="signIn"
      >
      <button
        class="mt-3"
        @click="signIn"
      >
        Se connecter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import ChangeLanguage from '__/components/ChangeLanguage.vue';
import BackButton from '__/components/BackButton.vue';

import axios from '__/plugins/axios';

const router = useRouter();
const { t } = useI18n();

const username = ref('');
const password = ref('');

async function signIn() {
  if(username.value && password.value) {
    const { data } = await axios.post('/signin', {
      username: username.value,
      password: password.value
    });
    const { accessToken } = data;
    if (accessToken) {
      localStorage.setItem('user', JSON.stringify({ accessToken}));
      router.push('/admin');
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  .header {
    width: calc(100% - (4 * 0.25rem))
  }

  .title {
    font-size: 32px;
    font-weight: 600;
    text-align: center;
  }
}

.login-form {
  width: 90%;
  gap: 10px;

  input {
    width: 100%;
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

  button {
    align-self: flex-end;
    border: none;
    background-color: #fff;
    color: #475fff;
    padding: 10px;
    border-radius: 5px;
    font-weight: 600;
  }
}
</style>
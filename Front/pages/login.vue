<script setup lang="ts">
definePageMeta({
  _layout: 'login',
  get layout() {
    return this._layout
  },
  set layout(value) {
    this._layout = value
  },
})

import { ref } from 'vue'
import { navigateTo } from '#app'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin(event: Event) {
  event.preventDefault()
  isLoading.value = true

  setTimeout(async () => {
    if (email.value === 'testealtime@gmail.com' && password.value === '1234') {
      localStorage.setItem('authToken', 'token-valido')
      await navigateTo('/')
    } else {
      errorMessage.value = 'Email ou senha inválidos'
    }
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1 class="title">Login</h1>
      <form @submit="handleLogin" class="form">
        <div class="form-group">
          <label for="email" class="label">Email:</label>
          <input v-model="email" id="email" type="email" required class="input" />
        </div>
        <div class="form-group">
          <label for="password" class="label">Senha:</label>
          <input v-model="password" id="password" type="password" required class="input" />
        </div>
        <button :disabled="isLoading" type="submit" class="button">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: fixed; /* <-- Agora trava no centro da tela */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.button {
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #2563eb;
}

.button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 15px;
  font-weight: 600;
}
</style>

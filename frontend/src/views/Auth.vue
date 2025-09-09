<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 flex items-center justify-center">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Brand / header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2">
          <span
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">A</span>
          <h1 class="text-2xl font-semibold tracking-tight">Task manager</h1>
        </div>
        <p class="text-sm text-gray-500 mt-2">Secure access to your tasks</p>
      </div>

      <!-- Card -->
      <div
        class="mx-auto grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        <!-- Left: illustration / message -->
        <div
          class="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white">
          <div>
            <h2 class="text-xl font-semibold">Welcome 👋</h2>
            <p class="mt-2 text-indigo-100">Log in to continue or create a new account in seconds.</p>
          </div>
        </div>

        <!-- Right: forms -->
        <div class="p-8">
          <!-- tabs -->
          <div class="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-medium dark:bg-slate-800">
            <button class="rounded-md px-3 py-2 transition
                     data-[active=true]:bg-white data-[active=true]:shadow
                     dark:data-[active=true]:bg-slate-900" :data-active="mode === 'login'"
              @click="mode = 'login'">Login</button>
            <button class="rounded-md px-3 py-2 transition
                     data-[active=true]:bg-white data-[active=true]:shadow
                     dark:data-[active=true]:bg-slate-900" :data-active="mode === 'register'"
              @click="mode = 'register'">Register</button>
          </div>

          <!-- alerts -->
          <p v-if="serverError" class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-100">
            {{ serverError }}
          </p>
          <p v-if="successMsg"
            class="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 border border-emerald-100">
            {{ successMsg }}
          </p>

          <!-- LOGIN -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
            <label class="block">
              <span class="mb-1 block text-sm font-medium">Email</span>
              <input v-model="email" type="email" required class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com" />
              <small v-if="email && !email.match(emailRegex)" class="text-xs text-red-600">Enter a valid email.</small>
            </label>

            <label class="block">
              <span class="mb-1 block text-sm font-medium">Password</span>
              <div class="flex">
                <input v-model="password" :type="showPwd ? 'text' : 'password'" required minlength="8" class="w-full rounded-l-lg border border-gray-300 px-3 py-2 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••" />
                <button type="button" @click="showPwd = !showPwd"
                  class="rounded-r-lg border border-l-0 border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50">
                  {{ showPwd ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div class="mt-2 h-1 rounded bg-gray-100">
                <div class="h-1 rounded transition-all" :class="[
                  strength <= 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : strength === 3 ? 'bg-emerald-500' : 'bg-indigo-600'
                ]" :style="{ width: (strength * 25) + '%' }" />
              </div>
              <small class="text-xs text-gray-500">Strength: {{ strengthLabel }}</small>
            </label>

            <button :disabled="!loginValid || loading" class="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow
                     transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              <span v-if="!loading">Sign in</span>
              <span v-else class="inline-flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Please wait…
              </span>
            </button>
          </form>

          <!-- REGISTER -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <label class="block">
              <span class="mb-1 block text-sm font-medium">Name</span>
              <input v-model="rName" required minlength="2" class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jane Doe" />
              <small v-if="rName && rName.trim().length < 2" class="text-xs text-red-600">At least 2 characters.</small>
            </label>

            <label class="block">
              <span class="mb-1 block text-sm font-medium">Email</span>
              <input v-model="rEmail" type="email" required class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com" />
              <small v-if="rEmail && !rEmail.match(emailRegex)" class="text-xs text-red-600">Enter a valid
                email.</small>
            </label>

            <label class="block">
              <span class="mb-1 block text-sm font-medium">Password</span>
              <div class="flex">
                <input v-model="rPassword" :type="rShowPwd ? 'text' : 'password'" required minlength="8" class="w-full rounded-l-lg border border-gray-300 px-3 py-2 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••" />
                <button type="button" @click="rShowPwd = !rShowPwd"
                  class="rounded-r-lg border border-l-0 border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50">
                  {{ rShowPwd ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div class="mt-2 h-1 rounded bg-gray-100">
                <div class="h-1 rounded transition-all" :class="[
                  strength <= 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : strength === 3 ? 'bg-emerald-500' : 'bg-indigo-600'
                ]" :style="{ width: (strength * 25) + '%' }" />
              </div>
              <small class="text-xs text-gray-500">Strength: {{ strengthLabel }}</small>
            </label>

            <button :disabled="!registerValid || loading" class="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow
                     transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              <span v-if="!loading">Create account</span>
              <span v-else class="inline-flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Please wait…
              </span>
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our
            <a href="#" class="text-indigo-600 hover:underline">Terms</a> &amp;
            <a href="#" class="text-indigo-600 hover:underline">Privacy</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api/auth.js';

const router = useRouter();
const mode = ref('login'); // 'login' | 'register'
const loading = ref(false);
const serverError = ref('');
const successMsg = ref('');

// login form
const email = ref('');
const password = ref('');
const showPwd = ref(false);

// register form
const rName = ref('');
const rEmail = ref('');
const rPassword = ref('');
const rShowPwd = ref(false);

// simple validations
const emailRegex = /^\S+@\S+\.\S+$/;
const loginValid = computed(() => emailRegex.test(email.value) && password.value.length >= 8);
const registerValid = computed(() =>
  rName.value.trim().length >= 2 && emailRegex.test(rEmail.value) && rPassword.value.length >= 8
);

// password strength (very simple hint)
const strength = computed(() => {
  const p = mode.value === 'login' ? password.value : rPassword.value;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0-4
});
const strengthLabel = computed(() => ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'][strength.value]);

function setToken(token) {
  localStorage.setItem('accessToken', token);
}

async function handleLogin() {
  serverError.value = '';
  successMsg.value = '';
  if (!loginValid.value) return;
  loading.value = true;
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value });
    setToken(data.accessToken);
    await api.get('/auth/me');
    successMsg.value = 'Welcome back!';
    router.push('/');
  } catch (e) {
    serverError.value = e?.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  serverError.value = '';
  successMsg.value = '';
  if (!registerValid.value) return;
  loading.value = true;
  try {
    await api.post('/auth/register', {
      name: rName.value.trim(),
      email: rEmail.value.trim(),
      password: rPassword.value,
    });
    const { data } = await api.post('/auth/login', { email: rEmail.value, password: rPassword.value });
    setToken(data.accessToken);
    await api.get('/auth/me');
    successMsg.value = 'Account created!';
    router.push('/');
  } catch (e) {
    serverError.value = e?.response?.data?.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-xl shadow-2 rounded-borders" style="width: 100%; max-width: 400px; border-radius: 24px;">
      <!-- Logotipo via URL -->
      <div class="q-mb-lg flex flex-center">
        <q-img
          src="https://miziosistemas.com.br/wp-content/uploads/elementor/thumbs/mizio-original_PNG-qgdupvfwc1ga0zp3eiygpkpi7ib1fgbksefjg6xg7w.png"
          alt="Logo da Mizio Sistemas"
          style="max-height: 80px; max-width: 200px"
          contain
        />
      </div>

      <!-- Formulário -->
      <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
        <p class="text-h5 text-center full-width">Acesso</p>

        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          filled
          :rules="[(val) => (val && val.length > 0) || 'Informe o email']"
          class="bg-grey-1"
        />

        <q-input
          label="Senha de Acesso"
          v-model="form.password"
          lazy-rules
          filled
          type="password"
          :rules="[(val) => (val && val.length > 0) || 'Informe a senha']"
          class="bg-grey-1"
        />

        <!-- Botão Login -->
        <q-btn
          label="Login"
          color="primary"
          class="full-width"
          rounded
          unelevated
          type="submit"
        />

        <!-- Ações secundárias -->
        <div class="q-mt-sm">
          <div class="row items-center justify-between no-wrap">
            <q-btn
              label="Criar nova conta"
              flat
              rounded
              size="sm"
              class="text-primary text-weight-medium"
              to="/register"
            />
            <q-btn
              label="Recuperar senha?"
              flat
              rounded
              size="sm"
              class="text-primary text-weight-medium"
              :to="{ name: 'forgot-password' }"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageLogin',

  setup() {
    const router = useRouter()
    const { login, isLoggedIn } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const form = ref({
      email: '',
      password: '',
    })

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: 'me' })
      }
    })

    const handleLogin = async () => {
      try {
        await login(form.value)
        notifySuccess('Login realizado com sucesso!')
        router.push({ name: 'me' })
      } catch (error) {
        notifyError(error.message || 'Erro ao realizar login')
      }
    }

    return {
      form,
      handleLogin,
    }
  },
})
</script>

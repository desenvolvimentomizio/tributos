<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center">Cadastro de Conta</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Nome"
          v-model="form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Informe o Nome']"
        />

        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Informe o email']"
          type="email"
        />

        <q-input
          label="Senha de Acesso"
          v-model="form.password"
          lazy-rules
          :rules="[
            (val) => (val && val.length >= 6) || 'Para senhe é necessário no minino 6 caracters',
          ]"
        />

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Cadastro de Conta"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />

          <q-btn
            label="Voltar"
            color="dark"
            class="full-width"
            rounded
            flat
            :to="{ name: 'login' }"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageRegister',

  setup() {
    const router = useRouter()
    const { register } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const form = ref({
      name: '',
      email: '',
      password: '',
    })



    const handleRegister = async () => {
  try {
    const { email, name, password } = form.value

    await register({ email, password, name }) // `name` vai como parte do `meta`

    // Armazena o name (já que o Supabase não retorna o metadata antes da confirmação de e-mail)
    localStorage.setItem('userName', name)

    notifySuccess()
    router.push({
      name: 'email-confirmation',
      query: { email },
    })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    notifyError(error.message || 'Erro desconhecido ao registrar')
  }
}

    return {
      form,
      handleRegister,
    }
  },
})
</script>

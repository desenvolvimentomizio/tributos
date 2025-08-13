
<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center">Redefinir Senha</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Nova Senha"
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[(val) => (val && val.length >= 6) || 'Informe a senha']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Enviar Nova Senha"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
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
  name: 'PageResetPassword',
  setup () {
    const { updatePassword } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()

    const password = ref('')
    const isPwd = ref(true)

    const handlePasswordReset = async () => {
      try {
        await updatePassword(password.value)
        notifySuccess('Senha atualizada com sucesso')
        router.push({ name: 'login' })
      } catch (error) {
        notifyError(error?.message || 'Falha ao atualizar a senha')
      }
    }

    return {
      password,
      isPwd,
      handlePasswordReset
    }
  }
})
</script>

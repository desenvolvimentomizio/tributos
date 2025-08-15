<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center">Redefinir Senha</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          v-model="password"
          label="Nova Senha"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[(val) => (val && val.length >= 6) || 'Informe a senha (mín. 6)']"
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
            :loading="loading"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import useSupabase from 'boot/supabase'          // ✅ pega o client pelo composable
import useNotify from 'src/composables/UseNotify' // seu composable de toasts

export default defineComponent({
  name: 'ResetPassword',
  setup () {
    const router = useRouter()
    const { supabase } = useSupabase()          // ✅ importante: desestruturar o client
    const { notifyError, notifySuccess } = useNotify()

    const password = ref('')
    const isPwd = ref(true)
    const loading = ref(false)

    const handlePasswordReset = async () => {
      if (!password.value || password.value.length < 6) {
        notifyError('Informe uma senha com pelo menos 6 caracteres.')
        return
      }
      loading.value = true
      try {
        // ✅ chamada correta ao client:
        const { error } = await supabase.auth.updateUser({ password: password.value })
        if (error) throw error

        notifySuccess('Senha atualizada com sucesso.')
        router.push({ name: 'login' }) // ajuste para a rota de login do seu app
      } catch (err) {
        notifyError(err?.message || 'Falha ao atualizar a senha.')
      } finally {
        loading.value = false
      }
    }

    return { password, isPwd, loading, handlePasswordReset }
  }
})
</script>



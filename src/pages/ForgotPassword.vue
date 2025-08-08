<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassowrd">


      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <p class="col-12 text-h5 text-center text-white text-center text-bold q-mb-lg q-pa-sm "
            style="background-color: var(--q-primary); border-radius: 8px;">
          Recuperar Senha
        </p>


        <q-input outlined label="Email" v-model="email" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email is required']" type="email" />


        <div class="q-my-md"></div>
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-btn label="Recuperar Senha" color="primary" class="full-width" rounded type="submit" />
          </div>
          <div class="col">
            <q-btn label="Voltar" color="primary" class="full-width" rounded flat :to="{ name: 'login' }" />
          </div>
        </div>




      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  setup() {
    const { sendPasswordRestEmail } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const email = ref('')

    const handleForgotPassowrd = async () => {
      try {
        await sendPasswordRestEmail(email.value)
        notifySuccess(`Password reset email sent to: ${email.value}`)
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      email,
      handleForgotPassowrd,
    }
  },
})
</script>

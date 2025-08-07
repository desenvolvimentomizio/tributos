
<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card
        class="col-md-6 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white"
        style="border-radius: 16px;"
      >
        <!-- Título destacado com fundo padrão do sistema -->
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
             style="background-color: var(--q-primary); border-radius: 8px;">
          Contabilidade
        </div>
        <div class="q-pa-sm"></div>

        <q-form class="q-gutter-y-md" @submit.prevent="handleSubmit">
        <div class="q-gutter-y-md">
          <q-input outlined
            label="Identificação"
            v-model="form.identificacao"
            :rules="[
              val => !!val || 'Identificação é obrigatória',
              val => val.length >= 3 || 'Mínimo de 3 caracteres',
              val => val.length <= 100 || 'Máximo de 100 caracteres'
            ]"
          />

          <q-input outlined
            label="Telefone"
            v-model="form.telefone"
            :mask="getTelefoneMask"
            :rules="[
              val => !!val || 'Telefone é obrigatório',
              val => val.length >= 10 || 'Telefone deve ter pelo menos 10 caracteres'
            ]"
            unmasked-value
          />

          <q-input outlined
            label="Email"
            v-model="form.email"
            :rules="[
              val => !!val || 'Email é obrigatório',
              val => /.+@.+\..+/.test(val) || 'Email inválido'
            ]"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-btn
                :label="isUpdate ? 'Atualiza' : 'Salva'"
                color="primary"
                class="full-width"
                rounded
                type="submit"
              />
            </div>

            <div class="col-6">
              <q-btn
                label="Cancela"
                color="primary"
                class="full-width"
                rounded
                flat
                :to="{ name: 'contabilidade' }"
              />
            </div>
          </div>
        </div>
        </q-form>

      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageFormContabilidade',
  setup() {
    const userName = ref('')
    const table = 'contabilidade'
    const router = useRouter()
    const route = useRoute()
    const { post, getById, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)
    let contabilidade = {}

    const getTelefoneMask = computed(() => {
      const len = form.value.telefone.replace(/\D/g, '').length
      return len > 10 ? '(##) #####-####' : '(##) ####-####'
    })


    const form = ref({
      email: '',
      identificacao: '',
      telefone: '',
      nome_usuario: '',
    })

    onMounted(() => {
      userName.value = localStorage.getItem('userName') || ''
      if (isUpdate.value) {
        handleGetContabilidade(isUpdate.value)
      }
    })

    const handleSubmit = async () => {
      try {
        form.value.nome_usuario = userName.value
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')
        } else {
          await post(table, form.value)
          notifySuccess('Registro incluído com sucesso')
        }
        router.push({ name: 'contabilidade' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetContabilidade = async (id) => {
      try {
        contabilidade = await getById(table, id)
        Object.assign(form.value, contabilidade)
        form.value.nome_usuario = userName.value
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      getTelefoneMask,
      handleSubmit,
      form,
      isUpdate
    }
  },
})
</script>

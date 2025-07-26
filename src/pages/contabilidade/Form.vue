<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Contabilidades</p>
      </div>



      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Identificação"
          v-model="form.identificacao"
          :rules="[(val) => (val && val.length > 0) || 'Identificação é obrigatória']"
        />

        <q-input
          label="Telefone"
          v-model="form.telefone"
          :rules="[(val) => (val && val.length > 0) || 'Telefone é obrigatório']"
          unmasked-value
        />

        <q-btn
          :label="isUpdate ? 'Atualiza' : 'Salva'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        />

        <q-btn
          label="Cancela"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'contabilidade' }"
        />
      </q-form>
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
  setup()
   {
    const userName = ref('')

    const table = 'contabilidade'
    const router = useRouter()
    const route = useRoute()
    const { post, getById, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)

    let contabilidade = {}
    const form = ref({
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
      handleSubmit,
      form,
      isUpdate

    }
  },
})
</script>

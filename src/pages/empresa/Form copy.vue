<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Empresa</p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Identificação"
          v-model="form.identificacao"
          :rules="[(val) => (val && val.length > 0) || 'Identificação é obrigatória']"
        />

        <q-input
          label="CNPJ"
          v-model="form.cnpj"
          :rules="[(val) => (val && val.length > 0) || 'CNPJ é obrigatório']"
          unmasked-value
        />

        <q-input
          label="Inscrição Estaudual"
          v-model="form.inscricao_estadual"
          :rules="[(val) => (val && val.length > 0) || 'CNPJ é obrigatório']"
          unmasked-value
        />

        <q-input
          label="CONTABILIDAE_ID"
          v-model="form.contabilidade_id"
          unmasked-value
        />

       <q-input
          label="CNAE"
          v-model="form.cnae"
          :rules="[(val) => (val && val.length > 0) || 'CNAE é obrigatório']"
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
import useAuthUser from 'src/composables/UseAuthUser'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageFormEmpresa',
  setup() {
    const table = 'empresa'
    const router = useRouter()
    const route = useRoute()
    const { user } = useAuthUser()
    const { post, getById,getByUserId, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)

    let empresa = { }
    let contabilidade = {
       contabilidade_id: '',
    }

    const form = ref({
      identificacao: '',
      contabilidade_id: '',
      cnpj: '',
      inscricao_estadual:'',
      cnae: '',
      user_id: '',

    })

    onMounted(() => {

      if (isUpdate.value) {
        handleGetEmpresa(isUpdate.value)
      }
      else {
        handleGetContabilidade()
      }

    })

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')
        } else {
          await post(table, form.value)
          notifySuccess('Registro incluído com sucesso')
        }
        router.push({ name: 'empresa' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetEmpresa = async (id) => {
      try {
        empresa = await getById(table, id)
        Object.assign(form.value, empresa)
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetContabilidade = async () => {
      try {
        contabilidade = await getByUserId('contabilidade','user_id', user.value.id)
        console.log(contabilidade[0]?.id)
        form.value.contabilidade_id =contabilidade[0]?.id
        form.value.user_id = user.value.id
      } catch (error) {
        notifyError(error.message)
      }
    }



    return {
      handleSubmit,
      form,
      isUpdate,
      handleGetContabilidade,


    }
  },
})
</script>

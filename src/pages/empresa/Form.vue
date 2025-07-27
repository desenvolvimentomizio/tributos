<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card
        class="col-md-6 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white"
        style="border-radius: 16px;"
      >
        <!-- Título destacado -->
        <div class="text-h5 text-primary text-center text-bold q-mb-lg">
          Empresa
        </div>

        <q-form class="q-gutter-y-md" @submit.prevent="handleSubmit">
          <q-input
            label="Razão Social"
            v-model="form.identificacao"
            :rules="[(val) => (val && val.length > 0) || 'Identificação é obrigatória']"
          />

          <!-- Linha com CNPJ e Inscrição Estadual -->
          <div class="row q-col-gutter-md">
            <div class="col-md-6 col-sm-12">
              <q-input
                label="CNPJ"
                v-model="form.cnpj"
                :rules="[(val) => (val && val.length > 0) || 'CNPJ é obrigatório']"
                unmasked-value
              />
            </div>
            <div class="col-md-6 col-sm-12">
              <q-input
                label="Inscrição Estadual"
                v-model="form.inscricao_estadual"
                :rules="[(val) => (val && val.length > 0) || 'Inscrição é obrigatória']"
                unmasked-value
              />
            </div>
          </div>

          <!-- Linha CNAE + descrição -->
          <div class="row q-col-gutter-md">
            <div class="col-md-3 col-sm-12">
              <q-input
                label="CNAE"
                v-model="form.cnae"
                :rules="[(val) => (val && val.length > 0) || 'CNAE é obrigatório']"
                unmasked-value
                @blur="buscarDescricaoCnae"
              />
            </div>
            <div class="col-md-9 col-sm-12 flex items-center">
              <div class="text-caption text-grey q-mt-sm">
                <span class="text-weight-bold">Descrição:</span>
                {{ descricaoCnae || 'Digite o CNAE para ver a descrição' }}
              </div>
            </div>
          </div>


          <div class="q-my-md"></div>

          <!-- Botões lado a lado -->
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-btn
                :label="isUpdate ? 'Atualiza' : 'Salva'"
                color="primary"
                class="full-width"
                rounded
                type="submit"
              />
            </div>
            <div class="col">
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
        </q-form>
      </q-card>
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
    const { post, getById, getByUserId, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)

    const form = ref({
      identificacao: '',
      contabilidade_id: '',
      cnpj: '',
      inscricao_estadual: '',
      cnae: '',
      user_id: '',
    })

    const descricaoCnae = ref('')

    const buscarDescricaoCnae = () => {
      const mapaCnae = {
        '6201-5/01': 'Desenvolvimento de programas de computador sob encomenda',
        '6201-5/02': 'Desenvolvimento de software customizável',
        '5611-2/01': 'Restaurantes e similares',
        '4711-3/02': 'Comércio varejista de mercadorias em geral',
        // Adicione outros conforme necessário
      }

      descricaoCnae.value = mapaCnae[form.value.cnae] || ''
    }

    onMounted(() => {
      if (isUpdate.value) {
        handleGetEmpresa(isUpdate.value)
      } else {
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
        const empresa = await getById(table, id)
        Object.assign(form.value, empresa)
        buscarDescricaoCnae() // para exibir descrição ao carregar
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetContabilidade = async () => {
      try {
        const contabilidade = await getByUserId('contabilidade', 'user_id', user.value.id)
        form.value.contabilidade_id = contabilidade[0]?.id
        form.value.user_id = user.value.id
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      handleSubmit,
      form,
      isUpdate,
      descricaoCnae,
      buscarDescricaoCnae,
    }
  },
})
</script>

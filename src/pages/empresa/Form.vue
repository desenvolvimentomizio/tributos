<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-md-4 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">

        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
          style="background-color: var(--q-primary); border-radius: 8px;">
          Empresa
        </div>

        <div class="q-pa-sm"></div>
        <q-form ref="formRef" class="q-gutter-y-md" @submit.prevent="handleSubmit">

          <q-input outlined label="Razão Social" v-model="form.identificacao"
            :rules="[(val) => (val && val.length > 5) || 'Identificação é obrigatória e maior que 5 caracteres']" />

          <q-input outlined label="CNPJ" v-model="form.cnpj" :rules="[
            (val) => (val && val.length > 0) || 'CNPJ é obrigatória',
            validaCnpjRule
          ]" />

          <q-input outlined label="Inscrição Estadual" v-model="form.inscricao_estadual"
            :rules="[(val) => (val && val.length > 0) || 'Inscrição é obrigatória']" />

          <q-input outlined label="Email" v-model="form.email" :rules="[
            val => !!val || 'Email é obrigatório',
            val => /.+@.+\..+/.test(val) || 'Email inválido'
          ]" />

          <q-select outlined v-model="form.regime_id" label="Regime Tributário" :options="regimeOptions" emit-value
            map-options option-label="label" option-value="value" filled
            :rules="[(val) => !!val || 'Regime é obrigatório']" />

          <div class="row q-col-gutter-md">
            <div class="col-md-3 col-sm-12">
              <q-input outlined label="CNAE" v-model="form.cnae"
                :rules="[(val) => (val && val.length > 0) || 'CNAE é obrigatório']" unmasked-value
                @blur="buscarDescricaoCnae" />
            </div>
            <div class="col-md-9 col-sm-12 flex items-center">
              <div class="text-caption text-grey q-mt-sm">
                <span class="text-weight-bold">Descrição:</span>
                {{ descricaoCnae || 'Digite o CNAE para ver a descrição' }}
              </div>
            </div>
          </div>

          <div class="q-my-md"></div>

          <div class="row q-col-gutter-md">
            <div class="col">
              <q-btn :label="isUpdate ? 'Atualiza' : 'Salva'" color="primary" class="full-width" rounded
                type="submit" />
            </div>
            <div class="col">
              <q-btn label="Cancela" color="primary" class="full-width" rounded flat :to="{ name: 'contabilidade' }" />
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
import { v4 as uuidv4 } from 'uuid'


export default defineComponent({
  name: 'PageFormEmpresa',

  setup() {

    const formRef = ref(null)
    const table = 'empresa'
    const router = useRouter()
    const route = useRoute()
    const { user } = useAuthUser()
    const { post, getById, getByUserId, update, upsertRegimeTributario } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)
    const cnpjRef = ref(null)

    const form = ref({
      id: isUpdate.value || uuidv4(),
      identificacao: '',
      contabilidade_id: '',
      regime_id: '',
      cnpj: '',
      inscricao_estadual: '',
      cnae: '',
      user_id: '',
      email: '',

    })



    const regimeOptions = [
      { label: 'Simples Nacional', value: 1 },
      { label: 'Simples Nacional - excesso de sublimite da receita bruta', value: 2 },
      { label: 'Regime Normal', value: 3 }
    ]


    const descricaoCnae = ref('')
    const buscarDescricaoCnae = () => {
      const mapaCnae = {
        '6201-5/01': 'Desenvolvimento de programas de computador sob encomenda',
        '6201-5/02': 'Desenvolvimento de software customizável',
        '5611-2/01': 'Restaurantes e similares',
        '4711-3/02': 'Comércio varejista de mercadorias em geral',
      }
      descricaoCnae.value = mapaCnae[form.value.cnae] || ''
    }

    const handleSubmit = async () => {

      const formValid = await formRef.value?.validate()

      if (!formValid) {
        notifyError('Verifique os campos obrigatórios')
        return
      }

      try {
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')

        } else {
          await post(table, form.value)
          notifySuccess('Registro incluído com sucesso')
        }

        try {
          await upsertRegimeTributario(
            form.value.id,
            form.value.contabilidade_id,
            form.value.regime_id,
          )
        } catch (error) {
          notifyError({
            type: 'negative',
            message: 'Falha ao salvar regime tributário ' + error.message
          })
        }

        router.push({ name: 'contabilidade' })

      } catch (error) {
        notifyError(error, error.message)
      }
    }


    const handleGetEmpresa = async (id) => {
      try {
        const empresa = await getById(table, id)
        Object.assign(form.value, empresa)
        buscarDescricaoCnae()
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

    // Função para validar CNPJ (apenas números)
    function isValidCNPJ(cnpj) {
      cnpj = (cnpj || '').replace(/[^\d]+/g, '');
      if (cnpj.length !== 14) return false;
      // Elimina CNPJs inválidos conhecidos
      if (/^(\d)\1+$/.test(cnpj)) return false;
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(0)) return false;
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(1)) return false;
      return true;
    }

    // Regra para o campo CNPJ
    const validaCnpjRule = val => isValidCNPJ((val || '').replace(/[^\d]+/g, '')) || 'CNPJ inválido';

    onMounted(() => {
      if (isUpdate.value) handleGetEmpresa(isUpdate.value)
      else handleGetContabilidade()
    })

    return {
      handleSubmit,
      form,
      isUpdate,
      descricaoCnae,
      buscarDescricaoCnae,
      cnpjRef,
      formRef,
      validaCnpjRule,
      regimeOptions,
      upsertRegimeTributario
    }
  }
})
</script>

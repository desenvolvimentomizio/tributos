<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-md-10 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">
        <!-- Título com fundo na cor primária -->
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
          style="background-color: var(--q-primary); border-radius: 8px;">
          Regra Tributária - Regime: {{ regime_identificacao }} - Empresa: {{ empresa_identificacao }}
        </div>

        <!-- Formulário -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

          <div class="row q-col-gutter-md">

            <!-- Coluna ICMS / PIS / COFINS -->
            <div class="col-md-8">
              <q-card class="q-pa-md">
                <div class="text-h6">ICMS - PIS / COFINS</div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input label="CST ICM" v-model="form.cst_icm"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do ICM é obrigatório', buscarDescricaoCSTICM ]"  />

                  </div>
                  <div class="col-md-10 col-12">
                    <q-input  v-model="form.descricaocst_Icm" readonly />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CFOP Interno" v-model="form.cfop_interno"
                      :rules="[(val) => (val && val.length >= 2) || 'CFOP para vendas no estado é obrigatório']"
                      unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input label=":" v-model="form.descricaocfop_interno" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% ICM Interno" v-model="form.icm_interno" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CFOP Externo" v-model="form.cfop_externo"
                      :rules="[(val) => (val && val.length >= 2) || 'CFOP para vendas para fora do estado é obrigatório']"
                      unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input label=":" v-model="form.descricaocfop_externo" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% ICM Externo" v-model="form.icm_externo" />
                  </div>
                </div>



                <div class="row q-col-gutter-md">
                  <div class="col-md-6 col-12">
                    <q-input label="Redução Alíquota ICM" v-model="form.reducao_aliquota" />
                  </div>

                  <div class="col-md-6 col-12">
                    <q-input label="Aliq.Combate Pobreza Alíquota" v-model="form.combate_pobreza_aliquota" />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CST PIS" v-model="form.cst_pis"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do PIS é obrigatório']" unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input label=":" v-model="form.descricaocst_pis" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% PIS" v-model="form.pis_aliquota" />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CST COFINS" v-model="form.cst_cofins"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do COFINS é obrigatório']" unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input label=":" v-model="form.descricaocst_cofins" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% COFINS" v-model="form.cofins_aliquota" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CST IPI" v-model="form.cst_ipi"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do IPI é obrigatório']" unmasked-value />
                  </div>
                  <div class="col-md-9 col-12">
                    <q-input label=":" v-model="form.descricaocst_ipi" readonly />
                  </div>
                </div>

              </q-card>
            </div>

            <!-- Coluna ICS / IBS -->
            <div class="col-md-4">
              <q-card class="q-pa-md">
                <div class="text-h6">ICS / IBS</div>

                <q-input label="Classificação IS" v-model="form.classificacao_is" />
                <q-input label="Classificação IBS-CBS" v-model="form.classificacao_ibscbs" />
                <q-input label="Classificação Cpresumido" v-model="form.classificacao_cpresumido" />
                <q-input label="Alíquota CBS" v-model="form.aliquota_cbs" />
                <q-input label="Redução CBS" v-model="form.reducao_cbs" />
                <q-input label="IBS Alíquota Estadual" v-model="form.ibs_aliquota_estadual" />
                <q-input label="IBS Alíquota Municipal" v-model="form.ibs_aliquota_municipal" />
                <q-input label="Redução IBS" v-model="form.reducao_ibs" />
              </q-card>
            </div>
          </div>

          <div class="row justify-end">
            <q-btn label="Salvar" color="primary" type="submit" />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>



<script>
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useRoute } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'
import { defineComponent, ref, onMounted, computed } from 'vue'


// const { getById, computed } = useApi()

export default defineComponent({
  name: 'PageFormRegra',
  setup() {
    const mapaCSTIcm = ref({})

    const route = useRoute()
    const { notifyError } = useNotify()
    const { listPublic } = useApi()
    const { user } = useAuthUser()
    const isUpdate = computed(() => route.params.id)
    const table = 'regra_tributaria'


    const descricaocst_Icm = ref('')
    const descricaocfop_interno = ref('')
    const descricaocfop_externo = ref('')
    const descricaocst_pis = ref('')
    const descricaocst_cofins = ref('')
    const tableEmpresa = 'empresa'
    const regime_identificacao = ref('')
    const empresa_identificacao = ref('')
    const empresas = ref([])

    const regimeMap = {
      1: 'Simples Nacional',
      2: 'Simples Nacional - sublimite',
      3: 'Lucro Presumido'
    }

    const form = ref({
      id: '',
      regime_id: '',
      cst_icm: '',
      icm_interno: '',
      cfop_interno: '',
      icm_externo: '',
      cfop_externo: '',
      reducao_aliquota: '',
      combate_pobreza_aliquota: '',
      cst_pis: '',
      pis_aliquota: '',
      cst_cofins: '',
      cofins_aliquota: '',
      cst_ipi: '',
      observacoes: '',
      classificacao_is: '',
      classificacao_ibscbs: '',
      classificacao_cpresumido: '',
      aliquota_cbs: '',
      reducao_cbs: '',
      ibs_aliquota_estadual: '',
      ibs_aliquota_municipal: '',
      reducao_ibs: ''

    })

     const mapCSTICM = {
      "00": "Tributada integralmente",
      "10": "Tributada e com cobrança do ICMS por substituição tributária",
      "20": "Com redução de base de cálculo",
      "30": "Isenta ou não tributada e com cobrança do ICMS por substituição tributária",
      "40": "Isenta",
      "41": "Não tributada",
      "50": "Suspensão",
      "51": "Diferimento",
      "60": "ICMS cobrado anteriormente por substituição tributária",
      "70": "Com redução de base de cálculo e cobrança do ICMS por substituição tributária",
      "90": "Outras"
    }



    const buscarDescricaoCSTICM = () => {
      form.value.descricaocst_Icm = mapCSTICM[form.value.cst_icm] || 'NÃO ACHOU'
    }

    const handleSubmit = () => {
      console.log('Formulário enviado:', form.value)
      // aqui você pode chamar a API ou emitir evento
    }


    const handleEmpresaIdentificacaoRegime = async (empresa_id) => {
      empresas.value = await listPublic(tableEmpresa, user.value.id, 'id', empresa_id)
      empresa_identificacao.value = empresas.value[0]?.identificacao || 'Desconhecida'
      form.value.regime_id = empresas.value[0]?.regime_id

      regime_identificacao.value = regimeMap[empresas.value[0]?.regime_id] || 'Desconhecido'
      descricaocst_Icm.value = mapCSTICM.value[form.value.cst_icm] || ''

    }
    empresa_identificacao.value = empresas.value[0]?.identificacao || 'Desconhecida'


    onMounted(async () => {
      handleEmpresaIdentificacaoRegime(route.params.empresa_id)
      if (isUpdate.value) {
        try {
          const response = await useApi().getById(table, route.params.id)
          Object.assign(form.value, response.data)
          descricaocst_Icm.value = mapaCSTIcm.value[form.value.cst_icm] || ''
          // descricaocfop_interno.value = mapaCSTIcm.value[form.value.cfop_interno] || ''
          // descricaocfop_externo.value = mapaCSTIcm.value[form.value.cfop_externo] || ''
          // descricaocst_pis.value = mapaCSTIcm.value[form.value.cst_pis] || ''
          // descricaocst_cofins.value = mapaCSTIcm.value[form.value.cst_cofins] || ''
        } catch (error) {
          notifyError('Erro ao carregar os dados da regra tributária.' + error.message)
        }
      }
    })




      return {
        form,
        handleSubmit,
        notifyError,
        descricaocst_Icm,
        descricaocfop_interno,
        descricaocfop_externo,
        descricaocst_pis,
        descricaocst_cofins,
        regime_identificacao,
        empresa_identificacao,
        buscarDescricaoCSTICM,


      }
    }
  })
</script>

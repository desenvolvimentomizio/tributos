<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <q-card class="col-md-10 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">
        <!-- Título -->
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
          style="background-color: var(--q-primary); border-radius: 8px;">
          Regra Tributária - Empresa: {{ empresa_identificacao }}
        </div>

        <!-- Formulário -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Coluna ICMS / PIS / COFINS -->
            <div class="col-md-8 col-12">
              <q-select v-model="form.regime_id" :options="regimeOptions" label="Selecione o regime" emit-value
                map-options outlined readonly />

              <q-card class="q-pa-md q-mt-md">
                <div class="text-h6 q-mb-md">ICMS - PIS / COFINS</div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-10 col-12">
                    <q-input outlined label="Identificação da Regra" v-model="form.identificacao"
                      :input-class="'text-bold text-h6'" class="label-strong"
                      :rules="[(val) => (val && val.length >= 2) || 'A Identificação é obrigatória']" />
                  </div>
                  <div class="col-md-2 col-12">
                    <q-input outlined label="Data Início" v-model="form.data_inicio" readonly />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CST ICMS / CSOSN" v-model="form.cst_icm_csosn" :rules="[
                      (val) => (val && val.length >= 2) || 'CST do ICMS/CSOSN é obrigatório',
                      ruleBuscarDescricaoCSTICMCSOSN
                    ]" />
                  </div>
                  <div class="col-md-10 col-12">
                    <q-input outlined v-model="descricaocst_icm_csosn" readonly />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CFOP Interno" v-model="form.cfop_interno" mask="#.###" :rules="[
                      (val) => (val && val.length >= 2) || 'CFOP para vendas no estado é obrigatório',
                      ruleBuscarDescricaoCFOPInterno
                    ]" />
                  </div>
                  <div class="col-md-7 col-12">

                    <q-input outlined v-model="descricaocfop_interno" readonly type="textarea" autogrow :rows="2" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-select v-model="form.icm_interno" :options="aliquotaICMOptions" label="% ICMS Interno" emit-value
                      map-options outlined />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CFOP Externo" v-model="form.cfop_externo" mask="#.###" :rules="[
                      (val) => (val && val.length >= 2) || 'CFOP para vendas fora do estado é obrigatório',
                      ruleBuscarDescricaoCFOPExterno
                    ]" />
                  </div>
                  <div class="col-md-7 col-12">

                    <q-input outlined v-model="descricaocfop_externo" readonly type="textarea" autogrow :rows="2" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-select v-model="form.icm_externo" :options="aliquotaICMOptions" label="% ICMS Externo" emit-value
                      map-options outlined />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-6 col-12">
                    <q-select v-model="form.reducao_base_aliquota" :options="aliquotaREDUCAOOptions"
                      label="Redução Base/Alíquota ICMS" emit-value map-options outlined :rules="[
                        val => val !== null && val !== '' || 'Obrigatório',
                      ]" />
                  </div>

                  <div class="col-md-6 col-12">
                    <q-select v-model="form.combate_pobreza_aliquota" :options="aliquotaFCPOptions"
                      label="Aliq. Combate à Pobreza (FCP)" emit-value map-options outlined :rules="[
                        val => val !== null && val !== '' || 'Obrigatório',
                      ]" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input outlined label="CST PIS" v-model="form.cst_pis" :rules="[
                      (val) => (val && val.length >= 1) || 'CST do PIS é obrigatório',
                      ruleBuscarDescricaoPIS
                    ]" unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input outlined v-model="descricaocst_pis" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-select v-model="form.pis_aliquota" :options="aliquotaPISOptions" label="% PIS" emit-value
                      map-options outlined />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input outlined label="CST COFINS" v-model="form.cst_cofins" :rules="[
                      (val) => (val && val.length >= 1) || 'CST do COFINS é obrigatório',
                      ruleBuscarDescricaoCOFINS
                    ]" unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input outlined v-model="descricaocst_cofins" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-select v-model="form.cofins_aliquota" :options="aliquotaCOFINSOptions" label="% COFINS"
                      emit-value map-options outlined />
                  </div>
                </div>
              </q-card>
            </div>


            <!-- Coluna IBS / CBS -->
            <div class="col-md-4 col-12">
              <q-card class="q-pa-md">
                <div class="text-h6 q-mb-md">IBS / CBS</div>


         <q-input outlined label="Classificação IBS-CBS" v-model="form.classificacao_ibscbs" :rules="[
                  val => val !== null && val !== '' || 'Obrigatório',
                  ruleBuscarnomecClassTrib,
                  val => (val !== 0 && val !== '0') || 'Não pode ser 0'
                ]" @blur="preencherZeros" />

                <q-input dense hide-bottom-space outlined v-model="formcClassTrib.nomecclasstrib" readonly
                  type="textarea" autogrow :rows="2"
                  :input-class="formcClassTrib.nomecclasstrib === 'Código INVÁLIDO!' ? 'text-red' : ''" />


                <q-input readonly outlined label="CST - IBS/CBS" v-model="form.cst_ibscbs" mask="###" fill-mask="0"
                  reverse-fill-mask :rules="[
                    val => val !== null && val !== '' || 'Obrigatório',
                  ]" class="q-mt-md" />

                <q-input readonly outlined label="% CBS" v-model="form.cbs_aliquota" type="number" :rules="[
                  val => val !== null && val !== '' || 'Obrigatório',
                  val => val >= 0 || 'O valor mínimo é 0',
                  val => val <= 100 || 'O valor máximo é 100'
                ]" step="1" min="0" max="100" />

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input readonly outlined label="% IBS Estadual" v-model="form.ibs_aliquota_estadual" type="number"
                      :rules="[
                        val => val !== null && val !== '' || 'Obrigatório',
                        val => val >= 0 || 'O valor mínimo é 0',
                        val => val <= 100 || 'O valor máximo é 100'
                      ]" step="1" min="0" max="100" />
                  </div>

                  <div class="col">
                    <q-input readonly outlined label="% IBS Municipal" v-model="form.ibs_aliquota_municipal"
                      type="number" :rules="[
                        val => val !== null && val !== '' || 'Obrigatório',
                        val => val >= 0 || 'O valor mínimo é 0',
                        val => val <= 100 || 'O valor máximo é 100'
                      ]" step="1" min="0" max="100" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input readonly outlined label="% Redução CBS" v-model="form.reducao_cbs" type="number" :rules="[
                      val => val !== null && val !== '' || 'Obrigatório',
                      val => val >= 0 || 'O valor mínimo é 0',
                      val => val <= 100 || 'O valor máximo é 100'
                    ]" step="1" min="0" max="100" />
                  </div>

                  <div class="col">
                    <q-input readonly outlined label="% Redução IBS" v-model="form.reducao_ibs" type="number" :rules="[
                      val => val !== null && val !== '' || 'Obrigatório',
                      val => val >= 0 || 'O valor mínimo é 0',
                      val => val <= 100 || 'O valor máximo é 100'
                    ]" step="1" min="0" max="100" />
                  </div>
                </div>

                <q-input readonly outlined label="Classificação IS" v-model="form.classificacao_is" :rules="[
                  val => val !== null && val !== '' || 'Obrigatório',
                  val => val >= 0 || 'O valor mínimo é 0',
                  val => val <= 100 || 'O valor máximo é 100'
                ]" step="1" min="0" max="100" />

                <q-input readonly outlined label="Classificação Crédito Presumido"
                  v-model="form.classificacao_cpresumido" :rules="[
                    val => val !== null && val !== '' || 'Obrigatório',
                    val => val >= 0 || 'O valor mínimo é 0',
                    val => val <= 100 || 'O valor máximo é 100'
                  ]" step="1" min="0" max="100" />
              </q-card>
            </div>

          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-btn :label="isUpdate ? 'Atualiza' : 'Salva'" color="primary" class="full-width" rounded
                type="submit" />
            </div>

            <div class="col-6">
              <q-btn label="Cancela" color="primary" class="full-width" rounded flat @click="handleRegra" />
            </div>




          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  name: 'PageFormRegra',
  setup() {

    let cClassTrib = {}

    const route = useRoute()
    const router = useRouter()


    const { notifyError, notifySuccess } = useNotify()
    const { post, listPublic, update, getById } = useApi()
    const { user } = useAuthUser()

    const isUpdate = computed(() => !!route.params.id)
    const idParam = route.params.id ? String(route.params.id) : null
    let empresa_id = ''

    const table = 'regra_tributaria'
    const tableEmpresa = 'empresa'
    const tablecClassTrib = 'cclasstrib'
    const tablenomeCfop = 'cfop'
    const tableEmpresaRegras = 'empresa_regra_tributaria'

    const descricaocst_icm_csosn = ref('')
    const descricaocfop_interno = ref('')
    const descricaocfop_externo = ref('')
    const descricaocst_pis = ref('')
    const descricaocst_cofins = ref('')
    const nomecclasstrib = ref('')

    const regime_identificacao = ref('')
    const empresa_identificacao = ref('')
    const empresas = ref([])


    const form = ref({
      id: idParam || uuidv4(),
      regime_id: '',
      identificacao: '',
      cst_icm_csosn: '',
      icm_interno: '',
      cfop_interno: '',
      icm_externo: '',
      cfop_externo: '',
      reducao_base_aliquota: '',
      combate_pobreza_aliquota: '',
      cst_pis: '',
      pis_aliquota: '',
      cst_cofins: '',
      cofins_aliquota: '',
      classificacao_is: '',
      classificacao_ibscbs: '',
      cst_ibscbs: '',
      classificacao_cpresumido: '',
      cbs_aliquota: '',
      reducao_cbs: '',
      ibs_aliquota_estadual: '',
      ibs_aliquota_municipal: '',
      reducao_ibs: '',
      data_inicio: new Date().toISOString().substring(0, 10)
    })


    const formcClassTrib = ref({
      id: idParam || uuidv4(),
      cstibscbs: '',
      nomecclasstrib: '',
      predibs: '',
      predcbs: 0,
      ibsestadual: 0,
      ibsmunicipal: 0,
      pcbs: 0,
      redutorbs: 0,
    })


    const formEmpresaRegra = ref({
      id: uuidv4(),
      empresa_id: '',
      contabilidade_id: '',
      regra_tributaria_id: '',
      user_id: '',
      data_inicio: new Date().toISOString().substring(0, 10)
    })

    // -------- Options --------
    const aliquotaICMOptions = [
      { label: '0 %', value: 0 },
      { label: '7 %', value: 7 },
      { label: '12 %', value: 12 },
      { label: '17 %', value: 17 },
      { label: '18 %', value: 18 },
      { label: '19 %', value: 19 },
      { label: '19,5 %', value: 19.5 },
      { label: '20 %', value: 20 },
      { label: '20,5 %', value: 20.5 },
      { label: '21 %', value: 21 },
      { label: '22 %', value: 22 },
      { label: '22,5 %', value: 22.5 },
      { label: '23 %', value: 23 },
      { label: '25 %', value: 25 }
    ]


    const aliquotaPISOptions = [
      { label: '0 %', value: 0 },
      { label: '0,65 %', value: 0.65 }
    ]

    const aliquotaCOFINSOptions = [
      { label: '0 %', value: 0 },
      { label: '3 %', value: 3.0 },
    ]

    const aliquotaFCPOptions = [
      { label: '0 %', value: 0 },
      { label: '1,00 %', value: 1.0 },
      { label: '1,60 %', value: 1.60 },
      { label: '1,90 %', value: 1.90 },
      { label: '2,00 %', value: 2.0 },
      { label: '3,00 %', value: 3.0 },
      { label: '4,00 %', value: 4.0 }
    ]

    const aliquotaREDUCAOOptions = [
      { label: '0 %', value: 0 },
      { label: '1 %', value: 1 },
      { label: '2,1 %', value: 2.1 },
      { label: '2,2 %', value: 2.2 },
      { label: '3,1 %', value: 3.1 },
      { label: '3,6 %', value: 3.6 },
      { label: '4 %', value: 4 },
      { label: '4,6 %', value: 4.6 },
      { label: '5 %', value: 5 },
      { label: '7 %', value: 7 },
      { label: '12 %', value: 12 },
      { label: '60 % (redução base)', value: 60 },
      { label: '70 % (redução base)', value: 70 },
      { label: '75 % (redução base)', value: 75 }
    ]

    const regimeOptions = [
      { label: 'Simples Nacional', value: 1 },
      { label: 'Simples Nacional - excesso de sublimite', value: 2 },
      { label: 'Regime Normal', value: 3 }
    ]
    // -------- Maps --------
    const mapRegime = {
      1: 'Simples Nacional',
      2: 'Simples Nacional - sublimite',
      3: 'Lucro Presumido'
    }

    const mapCSTICM = {
      '000': 'Tributada integralmente',
      '010': 'Tributada e com cobrança do ICMS por substituição tributária',
      '020': 'Com redução de base de cálculo',
      '030': 'Isenta ou não tributada e com cobrança do ICMS por substituição tributária',
      '040': 'Isenta',
      '041': 'Não tributada',
      '050': 'Suspensão',
      '051': 'Diferimento',
      '060': 'ICMS cobrado anteriormente por substituição tributária',
      '070': 'Com redução de base de cálculo e cobrança do ICMS por substituição tributária',
      '090': 'Outras'
    }



    const mapCSTCSOSN = {
      '101': 'Tributada pelo Simples Nacional com permissão de crédito',
      '102': 'Tributada pelo Simples Nacional sem permissão de crédito',
      '103': 'Isenção do ICMS no Simples Nacional para faixa de receita bruta',
      '201': 'Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por ST',
      '202': 'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST',
      '203': 'Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por ST',
      '300': 'Imune',
      '400': 'Não tributada pelo Simples Nacional',
      '500': 'ICMS cobrado anteriormente por ST (substituição tributária ou antecipação)',
      '900': 'Outros'
    }

    const mapPISCOFINS = {
      '01': 'Operação Tributável com Alíquota Básica',
      '02': 'Operação Tributável com Alíquota Diferenciada',
      '03': 'Operação Tributável com Alíquota por Unidade de Medida de Produto',
      '04': 'Operação Tributável Monofásica – Revenda a Alíquota Zero',
      '05': 'Operação Tributável por Substituição Tributária',
      '06': 'Operação Tributável a Alíquota Zero',
      '07': 'Operação Isenta da Contribuição',
      '08': 'Operação sem Incidência da Contribuição',
      '09': 'Operação com Suspensão da Contribuição',
      '49': 'Outras Operações de Saída',
      '50': 'Operação com Direito a Crédito – Receita Tributada no Mercado Interno',
      '51': 'Operação com Direito a Crédito – Receita Não-Tributada no Mercado Interno',
      '52': 'Operação com Direito a Crédito – Receita de Exportação',
      '53': 'Crédito – Receitas Tributadas e Não-Tributadas no Mercado Interno',
      '54': 'Crédito – Receitas Tributadas no Mercado Interno e de Exportação',
      '55': 'Crédito – Receitas Não-Tributadas no Mercado Interno e de Exportação',
      '56': 'Crédito – Receitas Tributadas e Não-Tributadas no Mercado Interno e de Exportação',
      '60': 'Crédito Presumido – Vinculada exclusivamente a receita tributada no mercado interno',
      '61': 'Crédito Presumido – Vinculada exclusivamente a receita não-tributada no mercado interno',
      '62': 'Crédito Presumido – Vinculada exclusivamente a receita de exportação',
      '63': 'Crédito Presumido – Vinculada a receitas tributadas e não-tributadas no mercado interno',
      '64': 'Crédito Presumido – Vinculada a receitas tributadas no mercado interno e de exportação',
      '65': 'Crédito Presumido – Vinculada a receitas não-tributadas no mercado interno e de exportação',
      '66': 'Crédito Presumido – Vinculada a receitas tributadas e não-tributadas no mercado interno e de exportação',
      '67': 'Crédito Presumido – Outras Operações',
      '70': 'Aquisição sem direito a crédito',
      '71': 'Aquisição com isenção',
      '72': 'Aquisição com suspensão',
      '73': 'Aquisição a alíquota zero',
      '74': 'Aquisição sem incidência da contribuição',
      '75': 'Aquisição por substituição tributária',
      '98': 'Outras Operações de Entrada',
      '99': 'Outras Operações'
    }

    // -------- Rules helpers --------

    const handleRegra = () => {
      empresa_id = route.params.empresa_id

      router.push({ name: 'regra_empresa', params: { id: empresa_id } })
    }


    const ruleBuscarDescricaoCSTICMCSOSN = (val) => {
      descricaocst_icm_csosn.value = val ? (mapCSTICM[val] || mapCSTCSOSN[val] || 'NÃO ACHOU') : ''
      return true
    }



    const ruleBuscarDescricaoCFOPInterno = async (val) => {
      if (val) {
        // aguarda o retorno da Promise
        const tablecfop = await getById(tablenomeCfop, val)
        descricaocfop_interno.value = tablecfop?.descricao ?? ''
        // opcional para depuração:
      } else {
        descricaocfop_interno.value = ''
      }
      return true // Quasar aceita rule async que resolve para true/string
    }


    const ruleBuscarDescricaoCFOPExterno = async (val) => {
      if (val) {
        // aguarda o retorno da Promise
        const tablecfop = await getById(tablenomeCfop, val)
        descricaocfop_externo.value = tablecfop?.descricao ?? ''
        // opcional para depuração:
      } else {
        descricaocfop_externo.value = ''
      }
      return true // Quasar aceita rule async que resolve para true/string
    }

    const ruleBuscarDescricaoPIS = (val) => {
      descricaocst_pis.value = val ? (mapPISCOFINS[val] || 'NÃO ACHOU') : ''
      return true
    }
    const ruleBuscarDescricaoCOFINS = (val) => {
      descricaocst_cofins.value = val ? (mapPISCOFINS[val] || 'NÃO ACHOU') : ''
      return true
    }


    // -------- Ações --------
    const handlePostEmpresaRegras = async () => {
      try {
        if (!isUpdate.value) {
          formEmpresaRegra.value.empresa_id = route.params.empresa_id
          formEmpresaRegra.value.contabilidade_id = empresas.value[0]?.contabilidade_id || ''
          formEmpresaRegra.value.regra_tributaria_id = form.value.id
          formEmpresaRegra.value.user_id = user.value.id
          await post(tableEmpresaRegras, formEmpresaRegra.value)
        }
      } catch (error) {
        notifyError('Erro ao salvar regra para a empresa: ' + (error?.message || error))
      }
    }

    const handleEmpresaIdentificacaoRegime = async (empresa_id) => {
      try {
        empresas.value = await listPublic(tableEmpresa, user.value.id, 'id', empresa_id)
        const emp = empresas.value?.[0]
        empresa_identificacao.value = emp?.identificacao || 'Desconhecida'
        form.value.regime_id = emp?.regime_id ?? ''
        regime_identificacao.value = mapRegime[emp?.regime_id] || 'Desconhecido'
        // Atualiza descrição inicial do CST, se houver
        descricaocst_icm_csosn.value = mapCSTICM[form.value.cst_icm_csosn] || mapCSTCSOSN[form.value.cst_icm_csosn] || ''
      } catch (error) {
        notifyError('Erro ao buscar empresa: ' + (error?.message || error))
      }
    }

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')
        } else {
          await post(table, form.value)
          await handlePostEmpresaRegras()
          notifySuccess('Registro incluído com sucesso')
        }

        empresa_id = route.params.empresa_id
        router.push({ name: 'regra_empresa', params: { id: empresa_id } })

      } catch {
        notifyError('Erro ao salvar registro, verifique todos os campos !')
      }
    }

    const ruleBuscarnomecClassTrib = (val) => {
      handleGetcClassTriba(val)
      nomecclasstrib.value = formcClassTrib.value.nomecclasstrib
      return true
    }

    const handleGetcClassTriba = async (id) => {
      try {
        cClassTrib = await getById(tablecClassTrib, id)
        Object.assign(formcClassTrib.value, cClassTrib)
        form.value.cst_ibscbs = String(formcClassTrib.value.cstibscbs).padStart(3, "0");


        form.value.reducao_cbs = formcClassTrib.value.predcbs
        form.value.reducao_ibs = formcClassTrib.value.predibs
        form.value.ibs_aliquota_estadual = formcClassTrib.value.ibsestadual
        form.value.ibs_aliquota_municipal = formcClassTrib.value.ibsmunicipal
        form.value.cbs_aliquota = formcClassTrib.value.pcbs
        form.value.classificacao_cpresumido = 0
        form.value.classificacao_is = 0


      } catch {
        formcClassTrib.value.nomecclasstrib = 'Código INVÁLIDO!'
        form.value.cst_ibscbs = 0
        form.value.reducao_cbs = 0
        form.value.reducao_ibs = 0
        form.value.ibs_aliquota_estadual = 0
        form.value.ibs_aliquota_municipal = 0
        form.value.cbs_aliquota = 0
        form.value.classificacao_cpresumido = 0
        form.value.classificacao_is = 0

      }
    }




    onMounted(async () => {
      await handleEmpresaIdentificacaoRegime(route.params.empresa_id)
      if (idParam) {
        try {
          const response = await getById(table, idParam)
          Object.assign(form.value, response)
          descricaocst_icm_csosn.value =
            mapCSTICM[form.value.cst_icm_csosn] || mapCSTCSOSN[form.value.cst_icm_csosn] || ''
        } catch (error) {
          notifyError('Erro ao carregar a regra tributária: ' + (error?.message || error))
        }
      }
    })

    function preencherZeros() {
      if (form.value.classificacao_ibscbs) {
        form.value.classificacao_ibscbs = form.value.classificacao_ibscbs
          .toString()
          .padStart(6, '0')
      }
    }


    return {
      // dados
      form,
      formcClassTrib,
      regime_identificacao,
      empresa_identificacao,

      // descrições
      descricaocst_icm_csosn,
      descricaocfop_interno,
      descricaocfop_externo,
      descricaocst_pis,
      descricaocst_cofins,
      nomecclasstrib,
      regimeOptions,

      // options
      aliquotaICMOptions,
      aliquotaPISOptions,
      aliquotaCOFINSOptions,
      aliquotaFCPOptions,
      aliquotaREDUCAOOptions,

      // flags/rotas
      isUpdate,
      preencherZeros,
      // ações
      handleSubmit,
      handlePostEmpresaRegras,
      handleRegra,

      // rules
      ruleBuscarDescricaoCSTICMCSOSN,
      ruleBuscarDescricaoCFOPInterno,
      ruleBuscarDescricaoCFOPExterno,
      ruleBuscarDescricaoPIS,
      ruleBuscarDescricaoCOFINS,
      ruleBuscarnomecClassTrib
    }
  }
})
</script>

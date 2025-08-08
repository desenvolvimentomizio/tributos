<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-md-10 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">
        <!-- Título com fundo na cor primária -->
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
          style="background-color: var(--q-primary); border-radius: 8px;">
          Regra Tributária - Regime: {{ regime_identificacao }} - Empresa= {{ empresa_identificacao }}
        </div>

        <!-- Formulário -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

          <div class="row q-col-gutter-md">

            <!-- Coluna ICMS / PIS / COFINS -->

            <div class="col-md-8">
              <q-card class="q-pa-md">
                <div class="text-h6">ICMS - PIS / COFINS</div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-10 col-12">
                    <q-input outlined label="Identificação da Regra" v-model="form.identificacao"
                      :rules="[(val) => (val && val.length >= 2) || 'A Identificação é obrigatória']" />

                  </div>
                  <div class="col-md-2 col-12">
                    <q-input outlined label="Data Início" v-model="form.data_inicio" readonly />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CST ICM" v-model="form.cst_icm_csosn"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do ICM é obrigatório', buscarDescricaoCSTICMCSOSN]" />

                  </div>
                  <div class="col-md-10 col-12">
                    <q-input outlined v-model="descricaocst_icm_csosn" readonly />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CFOP Interno" v-model="form.cfop_interno" mask="#.###"
                      :rules="[(val) => (val && val.length >= 2) || 'CFOP para vendas no estado é obrigatório', buscarDescricaoCFOPInterno]" />
                  </div>
                  <div class="col-md-7 col-12">
                    <q-input outlined v-model="descricaocfop_interno" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% ICM Interno" v-model="form.icm_interno" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-2 col-12">
                    <q-input outlined label="CFOP Externo" v-model="form.cfop_externo" mask="#.###"
                      :rules="[(val) => (val && val.length >= 2) || 'CFOP para vendas para fora do estado é obrigatório', buscarDescricaoCFOPExterno]" />
                  </div>
                  <div class="col-md-7 col-12">
                    <q-input outlined v-model="descricaocfop_externo" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="% ICM Externo" v-model="form.icm_externo" />
                  </div>
                </div>



                <div class="row q-col-gutter-md">
                  <div class="col-md-6 col-12">
                    <q-input outlined label="Redução Alíquota ICM" v-model="form.reducao_base_aliquota" />
                  </div>

                  <div class="col-md-6 col-12">
                    <q-input outlined label="Aliq.Combate Pobreza Alíquota" v-model="form.combate_pobreza_aliquota" />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input outlined label="CST PIS" v-model="form.cst_pis"
                      :rules="[(val) => (val && val.length >= 1) || 'CST do PIS é obrigatório', buscarDescricaoPIS]"
                      unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input v-model="descricaocst_pis" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input outlined label="% PIS" v-model="form.pis_aliquota" />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input outlined label="CST COFINS" v-model="form.cst_cofins"
                      :rules="[(val) => (val && val.length >= 1) || 'CST do COFINS é obrigatório', buscarDescricaoCOFINS]"
                      unmasked-value />
                  </div>
                  <div class="col-md-6 col-12">
                    <q-input v-model="descricaocst_cofins" readonly />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input outlined label="% COFINS" v-model="form.cofins_aliquota" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input outlined label="CST IPI" v-model="form.cst_ipi"
                      :rules="[(val) => (val && val.length >= 1) || 'CST do IPI é obrigatório', buscarDescricaoIPI]"
                      unmasked-value />
                  </div>
                  <div class="col-md-9 col-12">
                    <q-input outlined v-model="descricaocst_ipi" readonly />
                  </div>
                </div>

              </q-card>
            </div>

            <!-- Coluna ICS / IBS -->
            <div class="col-md-4">
              <q-card class="q-pa-md">
                <div class="text-h6">ICS / IBS</div>

                <q-input outlined label="Classificação IS" v-model="form.classificacao_is" />
                <q-input outlined label="Classificação IBS-CBS" v-model="form.classificacao_ibscbs" />
                <q-input outlined label="Classificação Cpresumido" v-model="form.classificacao_cpresumido" />
                <q-input outlined label="Alíquota CBS" v-model="form.cbs_aliquota" />
                <q-input outlined label="Redução CBS" v-model="form.reducao_cbs" />
                <q-input outlined label="IBS Alíquota Estadual" v-model="form.ibs_aliquota_estadual" />
                <q-input outlined label="IBS Alíquota Municipal" v-model="form.ibs_aliquota_municipal" />
                <q-input outlined label="Redução IBS" v-model="form.reducao_ibs" />
              </q-card>
            </div>
          </div>



          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-btn :label="isUpdate ? 'Atualiza' : 'Salva'" color="primary" class="full-width" rounded
                type="submit" />
            </div>

            <div class="col-6">
              <q-btn label="Cancela" color="primary" class="full-width" rounded flat :to="{ name: 'contabilidade' }" />
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
import { useRoute, useRouter } from 'vue-router'

import useAuthUser from 'src/composables/UseAuthUser'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'


// const { getById, computed } = useApi()

export default defineComponent({
  name: 'PageFormRegra',
  setup() {

    const route = useRoute()
    const router = useRouter()
    const { notifyError, notifySuccess } = useNotify()
    const { post, listPublic, update } = useApi()
    const { user } = useAuthUser()
    const isUpdate = computed(() => route.params.id)
    const table = 'regra_tributaria'


    let descricaocst_icm_csosn = ref('')
    let descricaocfop_interno = ref('')
    let descricaocfop_externo = ref('')
    let descricaocst_pis = ref('')
    let descricaocst_cofins = ref('')
    let descricaocst_ipi = ref('')
    const tableEmpresa = 'empresa'
    const tableEmpresaRegras = 'empresa_regra_tributaria'
    const regime_identificacao = ref('')
    const empresa_identificacao = ref('')
    const empresas = ref([])


    const form = ref({
      id: isUpdate.value || uuidv4(),
      regime_id: '',
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
      cst_ipi: '',
      classificacao_is: '',
      classificacao_ibscbs: '',
      classificacao_cpresumido: '',
      cbs_aliquota: '',
      reducao_cbs: '',
      ibs_aliquota_estadual: '',
      ibs_aliquota_municipal: '',
      reducao_ibs: '',
      data_inicio: ref(new Date().toISOString().substring(0, 10)),

    })

    const formEmpresaRegra = ref({
      id: isUpdate.value || uuidv4(),
      empresa_id: '',
      contabilidade_id: '',
      regra_tributaria_id: '',
      data_inicio: ref(new Date().toISOString().substring(0, 10)),

    })

    const buscarDescricaoCSTICMCSOSN = () => {
      descricaocst_icm_csosn.value = mapCSTICM[form.value.cst_icm_csosn] || 'NÃO ACHOU'
    }

    const buscarDescricaoCSTCSOSN = () => {
      descricaocst_icm_csosn.value = mapCSTCSOSN[form.value.cst_icm_csosn] || 'NÃO ACHOU'
    }

    const buscarDescricaoCFOPExterno = () => {
      descricaocfop_externo.value = mapCFOP[form.value.cfop_externo] || 'NÃO ACHOU'
    }

    const buscarDescricaoCFOPInterno = () => {
      descricaocfop_interno.value = mapCFOP[form.value.cfop_interno] || 'NÃO ACHOU'
    }

    const buscarDescricaoPIS = () => {
      descricaocst_pis.value = mapPISCOFINS[form.value.cst_pis] || 'NÃO ACHOU'
    }

    const buscarDescricaoCOFINS = () => {
      descricaocst_cofins.value = mapPISCOFINS[form.value.cst_cofins] || 'NÃO ACHOU'
    }

    const buscarDescricaoIPI = () => {
      descricaocst_ipi.value = mapIPI[form.value.cst_ipi] || 'NÃO ACHOU'
    }

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')
        } else {
          await post(table, form.value)
          handlePostEmpresaRegras()
          notifySuccess('Registro incluído com sucesso')
        }
        router.push({ name: 'contabilidade' })
      } catch (error) {
        notifyError('Erro ao salvar registro: ' + error.message)
      }
    }

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
        notifyError('Erro ao salvar registro de regra paraa empresa: ' + error.message)
      }
    }

    const handleEmpresaIdentificacaoRegime = async (empresa_id) => {
      empresas.value = await listPublic(tableEmpresa, user.value.id, 'id', empresa_id)
      empresa_identificacao.value = empresas.value[0]?.identificacao || 'Desconhecida'
      form.value.regime_id = empresas.value[0]?.regime_id
      regime_identificacao.value = mapRegime[empresas.value[0]?.regime_id] || 'Desconhecido'
      descricaocst_icm_csosn.value = mapCSTICM.value[form.value.cst_icm_csosn] || ''

    }

    onMounted(async () => {
      console.log('Rota atual:', mapCSTICM.value)
      handleEmpresaIdentificacaoRegime(route.params.empresa_id)
      if (isUpdate.value) {
        try {
          const response = await useApi().getById(table, route.params.id)
          Object.assign(form.value, response.data)
          descricaocst_icm_csosn.value = mapCSTICM.value[form.value.cst_icm_csosn] || ''
          // descricaocfop_interno.value = mapaCSTIcm.value[form.value.cfop_interno] || ''
          // descricaocfop_externo.value = mapaCSTIcm.value[form.value.cfop_externo] || ''
          // descricaocst_pis.value = mapaCSTIcm.value[form.value.cst_pis] || ''
          // descricaocst_cofins.value = mapaCSTIcm.value[form.value.cst_cofins] || ''
        } catch (error) {
          notifyError('Erro ao carregar os dados da regra tributária.' + error.message)
        }
      }
    })

    const mapRegime = {
      1: 'Simples Nacional',
      2: 'Simples Nacional - sublimite',
      3: 'Lucro Presumido',
      4: 'Lucro Real'
    }

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
    };

    const mapCFOP = {
      "1.101": "Compra para industrialização",
      "1.102": "Compra para comercialização",
      "1.106": "Compra para utilização na prestação de serviço",
      "1.108": "Compra de mercadoria para uso ou consumo",
      "1.109": "Aquisição de ativo imobilizado",
      "1.110": "Compra para utilização em processo de industrialização por encomenda",
      "1.115": "Compra de mercadoria adquirida em operação com mercadoria sujeita à ST",
      "1.201": "Devolução de venda de produção do estabelecimento",
      "1.202": "Devolução de venda de mercadoria adquirida ou recebida de terceiros",
      "2.101": "Compra para industrialização",
      "2.102": "Compra para comercialização",
      "2.108": "Compra para uso ou consumo",
      "2.109": "Aquisição de ativo imobilizado",
      "2.115": "Compra de mercadoria sujeita à substituição tributária",
      "2.201": "Devolução de venda de produção do estabelecimento",
      "2.202": "Devolução de venda de mercadoria adquirida de terceiros",
      "3.101": "Compra para industrialização",
      "3.102": "Compra para comercialização",
      "3.108": "Compra para uso ou consumo",
      "3.109": "Aquisição de ativo imobilizado",
      "5.101": "Venda de produção do estabelecimento",
      "5.102": "Venda de mercadoria adquirida ou recebida de terceiros",
      "5.103": "Venda de produção efetuada fora do estabelecimento",
      "5.104": "Venda de mercadoria adquirida efetuada fora do estabelecimento",
      "5.110": "Venda de produção para utilização na prestação de serviço",
      "6.101": "Venda de produção do estabelecimento",
      "6.102": "Venda de mercadoria adquirida ou recebida de terceiros",
      "6.108": "Venda de produção para Zona Franca de Manaus",
      "7.101": "Venda de produção do estabelecimento",
      "7.102": "Venda de mercadoria adquirida ou recebida de terceiros",
      "7.108": "Venda de produção do estabelecimento à Zona Franca de Manaus",
      "7.949": "Outra saída de mercadoria ou prestação de serviço não especificado"
    }

    const mapCSTCSOSN = {
      "101": "Tributada pelo Simples Nacional com permissão de crédito",
      "102": "Tributada pelo Simples Nacional sem permissão de crédito",
      "103": "Isenção do ICMS no Simples Nacional para faixa de receita bruta",
      "201": "Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por ST",
      "202": "Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST",
      "203": "Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por ST",
      "300": "Imune",
      "400": "Não tributada pelo Simples Nacional",
      "500": "ICMS cobrado anteriormente por ST (substituição tributária ou antecipação)",
      "900": "Outros"
    }


    const mapPISCOFINS = {
      "1": "cperação Tributável com Alíquota Básica",
      "2": "Operação Tributável com Alíquota Diferenciada",
      "3": "Operação Tributável com Alíquota por Unidade de Medida de Produto",
      "4": "Operação Tributável Monofásica  Revenda a Alíquota Zero",
      "5": "Operação Tributável por Substituição Tributária",
      "6": "Operação Tributável a Alíquota Zero",
      "7": "Operação Isenta da Contribuição",
      "8": "Operação sem Incidência da Contribuição",
      "9": "Operação com Suspensão da Contribuição",
      "49": "Outras Operações de Saída",
      "50": "Operação com Direito a Crédito  Vinculada Exclusivamente a Receita Tributada no Mercado Interno",
      "51": "Operação com Direito a Crédito  Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno",
      "52": "Operação com Direito a Crédito  Vinculada Exclusivamente a Receita de Exportação",
      "53": "Operação com Direito a Crédito  Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno",
      "54": "Operação com Direito a Crédito  Vinculada a Receitas Tributadas no Mercado Interno e de Exportação",
      "55": "Operação com Direito a Crédito  Vinculada a Receitas Não Tributadas no Mercado Interno e de Exportação",
      "56": "Operação com Direito a Crédito  Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno e de Exportação",
      "60": "Crédito Presumido  Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno",
      "61": "Crédito Presumido  Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno",
      "62": "Crédito Presumido  Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação",
      "63": "Crédito Presumido  Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno",
      "64": "Crédito Presumido  Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação",
      "65": "Crédito Presumido  Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação",
      "66": "Crédito Presumido  Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno e de Exportação",
      "67": "Crédito Presumido  Outras Operações",
      "70": "Operação de Aquisição sem Direito a Crédito",
      "71": "Operação de Aquisição com Isenção",
      "72": "Operação de Aquisição com Suspensão",
      "73": "Operação de Aquisição a Alíquota Zero",
      "74": "Operação de Aquisição sem Incidência da Contribuição",
      "75": "Operação de Aquisição por Substituição Tributária",
      "98": "Outras Operações de Entrada",
      "99": "Outras Operações"
    }

    const mapIPI = {
      "0": "Entrada com Recuperação de Crédito",
      "1": "Entrada Tributável com Alíquota Zero",
      "2": "Entrada Isenta",
      "3": "Entrada Não-Tributada",
      "4": "Entrada Imune",
      "5": "Entrada com Suspensão",
      "49": "Outras Entradas",
      "50": "Saída Tributada",
      "51": "Saída Tributável com Alíquota Zero",
      "52": "Saída Isenta",
      "53": "Saída Não-Tributada",
      "54": "Saída Imune",
      "55": "Saída com Suspensão",
      "99": "Outras Saídas"
    }





    return {
      form,
      handleSubmit,
      handlePostEmpresaRegras,
      notifyError,
      descricaocst_icm_csosn,
      descricaocfop_interno,
      descricaocfop_externo,
      descricaocst_pis,
      descricaocst_cofins,
      descricaocst_ipi,
      regime_identificacao,
      empresa_identificacao,
      buscarDescricaoCSTICMCSOSN,
      buscarDescricaoCSTCSOSN,
      buscarDescricaoCFOPExterno,
      buscarDescricaoCFOPInterno,
      buscarDescricaoPIS,
      buscarDescricaoCOFINS,
      buscarDescricaoIPI,
    }
  }
})


</script>

<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-md-8 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">
        <!-- Título com fundo na cor primária -->
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
          style="background-color: var(--q-primary); border-radius: 8px;">
          Regra Tributária
        </div>

        <!-- Formulário -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

          <div class="row q-col-gutter-md">

            <!-- Coluna ICMS / PIS / COFINS -->
            <div class="col-md-8">
              <q-card class="q-pa-md">
                <div class="text-h6">ICMS - PIS / COFINS</div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-3 col-12">
                    <q-input label="CST ICM" v-model="form.cst_icm"
                      :rules="[(val) => (val && val.length >= 2) || 'CST do ICM é obrigatório']" unmasked-value />
                  </div>
                  <div class="col-md-9 col-12">
                    <q-input label="Descrição" v-model="form.descricaocst_Icm" readonly />
                  </div>
                </div>


                <div class="row q-col-gutter-md">
                  <div class="col-md-9 col-12">
                    <q-input label="CFOP Interno" v-model="form.cfop_interno" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="ICM Interno" v-model="form.icm_interno" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-9 col-12">
                    <q-input label="CFOP Externo" v-model="form.cfop_externo" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="ICM Externo" v-model="form.icm_externo" />
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
                  <div class="col-md-9 col-12">
                    <q-input label="CST PIS" v-model="form.cst_pis" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="Alíquota PIS" v-model="form.pis_aliquota" />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-md-9 col-12">
                    <q-input label="CST COFINS" v-model="form.cst_cofins" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input label="Alíquota COFINS" v-model="form.cofins_aliquota" />
                  </div>
                </div>


                <q-input label="CST IPI" v-model="form.cst_ipi" />


                <q-input label="Observações" type="textarea" v-model="form.observacoes" />
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
import { defineComponent, ref, onMounted, watch } from 'vue'


const { getById, computed } = useApi()

export default defineComponent({
  name: 'PageFormRegra',
  setup() {
    const mapaCSTIcm = ref({})

    const route = useRoute()
    const { notifyError } = useNotify()
    const isUpdate = computed(() => route.params.id)
    const table = 'regra'

    const cstCsosnOptions = ref([])
    const descricaocst_Icm = ref('')
    const descricaocfop_interno = ref('')
    const descricaocfop_externo = ref('')
    const descricaocst_pis = ref('')
    const descricaocst_cofins = ref('')


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

    const handleSubmit = () => {
      console.log('Formulário enviado:', form.value)
      // aqui você pode chamar a API ou emitir evento
    }




    onMounted(async () => {
      if (form.value.regime_id === 'simples') {
        mapaCSTIcm.value = await import('src/assets/data/db_csosn_icm.json')
      } else {
        mapaCSTIcm.value = await import('src/assets/data/db_cst_icm.json')
      }
    })

    const carregarCSTouCSOSN = async () => {
      try {
        const data = await import(
          form.value.regime_id === '1'
            ? 'src/assets/data/db_csosn_icm.json'
            : 'src/assets/data/db_cst_icm.json'
        )
        cstCsosnOptions.value = data.default
      } catch (err) {
        console.error('Erro ao carregar tabela tributária:', err)
      }
    }


    // buscarDescricaoCSTIcm

    const handleGetRegra = async (id) => {
      try {
        const regra = await getById(table, id)
        Object.assign(form.value, regra)

      } catch (error) {
        notifyError(error.message)
      }
    }

    watch(() => form.value.cst_icm, (val) => {
      if (!val) {
        form.value.descricaocst_Icm = ''
        return
      }

      const encontrado = cstCsosnOptions.value.find(item => item.codigo === val)
      form.value.descricaocst_Icm = encontrado?.descricao || 'Código não encontrado'
    })


    onMounted(() => {
      if (isUpdate.value) handleGetRegra(isUpdate.value)
      else
        carregarCSTouCSOSN()
    })

    return {
      form,
      handleSubmit,
      notifyError,
      descricaocst_Icm,
      descricaocfop_interno,
      descricaocfop_externo,
      descricaocst_pis,
      descricaocst_cofins
    }
  }
})
</script>

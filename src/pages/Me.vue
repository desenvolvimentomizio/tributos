<template>
  <q-page padding>

    <div class="row q-col-gutter-md">


      <q-card class="col-12 col-md-4 q-pa-md">
        <div class="text-h6 text-primary">Empresas</div>
        <div class="text-h5 text-bold">{{ countEmpresas }}</div>
      </q-card>

      <q-card class="col-12 col-md-4 q-pa-md">
        <div class="text-h6 text-primary">Regras Tributárias</div>
        <div class="text-h5 text-bold">{{ CountRegras }}</div>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useNotify from 'src/composables/UseNotify'
import useApi from 'src/composables/UseApi'
import useAuthUser from 'src/composables/UseAuthUser'

const countEmpresas = ref(0)
const CountRegras = ref(0)
const ultimaAlteracao = ref(null)
const loading = ref(true)
const tableEmpresa = 'empresa'
const tableRegra = 'empresa_regra_tributaria'
const tableRegime = 'empresa_regime_tributario'
const fieldRegime = 'entrada_regime'

const { notifyError } = useNotify()
const { fetchCount, fetchLastDate } = useApi()
const { user } = useAuthUser()

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR')
}

export default defineComponent({
  name: 'PageMe',

  setup() {
    const userName = ref('')

    const handleCountEmpresas = async () => {
      try {
        loading.value = true
        countEmpresas.value = (await fetchCount(tableEmpresa, user.value.id)).count

      } catch (error) {
        notifyError(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleCountRegra = async () => {
      try {
        loading.value = true

        CountRegras.value = (await fetchCount(tableRegra, user.value.id)).count

      } catch (error) {
        notifyError(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleLastAlteracaoRegime = async () => {
      try {
        loading.value = true
        ultimaAlteracao.value = (await fetchLastDate(tableRegime, user.value.id, fieldRegime)).Data
      } catch  {
       // notifyError('Sem registros !')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {

      userName.value = localStorage.getItem('userName') || ''
      handleCountEmpresas()
      handleCountRegra()
      handleLastAlteracaoRegime()
    })

    return {
      userName,
      countEmpresas,
      CountRegras,
      ultimaAlteracao,
      formatarData

    }
  },
})
</script>

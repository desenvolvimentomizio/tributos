<template>
  <q-page padding>
    <!-- Card de Lista de regras -->
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between">
        <div class="text-h6"> Lista de REGRAS - Empresa:
          <span class="text-primary text-weight-bold">{{ empresa_identificacao }}</span>
          - Regime :
          <span class="text-primary text-weight-bold">{{ regime_identificacao }}</span>
        </div>
        <q-btn v-if="$q.platform.is.desktop" label="Incluir Regra" color="primary" icon="mdi-plus" dense
          @click="handleEditRegra({ id: '', regime_id: regime_id, empresa_id: empresa_id })" />
      </div>
    </q-card>

    <!-- Filtro -->
    <div class="row q-mb-sm">
      <div class="col-12 col-md-4">
        <q-input dense debounce="300" outlined v-model="filtro" placeholder="Buscar por identificação..." clearable
          prefix="🔍" />
      </div>
    </div>

    <!-- Tabela -->
    <q-table :rows="regras" :columns="columnsRegras" row-key="id" :loading="loading" :filter="filtro" flat bordered  class="q-mb-xl">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">

          <q-btn color="info" label="Editar" size="sm" @click="handleEdit(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>

          <q-btn color="negative" label="Desativar" size="sm" @click="handleRemove(props.row)">
            <q-tooltip> Destivar esta Regra para a Empresa </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>


    <!-- Espaço vertical entre as tabelas -->
    <div class="col-12 q-my-md">
      <q-separator spaced />
    </div>



    <!-- Abaixo lista de regras disponiveis empresas -->
    <q-table :rows="regrasDiferenteEmpresa" :columns="columnsRegrasEmpresa" row-key="id" :loading="loading"  flat bordered  class="q-mb-xl" >

      <template v-slot:top>

        <div class="q-pa-sm row items-center justify-between full-width">
          <!---- <div class="q-pa-sm row items-center"> -->
          <span class="text-h6">Regras disponíveis para este Regime</span>
          <q-space />
        </div>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn color="info" label="Selecionar" size="sm" @click="handlePostEmpresaRegras(props.row.id)">
            <q-tooltip> Selecionar Regra para a empresa a cima</q-tooltip>
          </q-btn>


        </q-td>
      </template>

    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { columnsRegras } from './table'
import { columnsRegrasEmpresa } from './tableRegrasEmpresa'

export default defineComponent({
  name: 'PageRegraEmpresaList',
  setup() {
    const empresa_id = ref('')
    const regime_id = ref('')
    const regime_identificacao = ref('')
    const empresa_identificacao = ref('')
    const regras = ref([])
    const regrasDiferenteEmpresa = ref([])
    const filtro = ref('')
    const route = useRoute()
    const router = useRouter()
    const empresas = ref([])
    const loading = ref(true)
    const isUpdate = computed(() => route.params.id)

    const { notifyError, notifySuccess } = useNotify()
    // const table = 'regra_tributaria'
    const tableEmpresa = 'empresa'
    const tableEmpresaRegras = 'empresa_regra_tributaria'
    const { user } = useAuthUser()
    const { listPublic, listRegrasPorEmpresa, listRegrasDiferenteEmpresa, post } = useApi()

    const regimeMap = {
      1: 'Simples Nacional',
      2: 'Simples Nacional - sublimite',
      3: 'Lucro Presumido'
    }

    const formEmpresaRegra = ref({
      id: isUpdate.value || uuidv4(),
      empresa_id: '',
      //    contabilidade_id: '',
      regra_tributaria_id: '',
      data_inicio: ref(new Date().toISOString().substring(0, 10)),

    })

    const handleListRegras = async () => {
      try {
        loading.value = true
        empresa_id.value = route.params.id || ''
        empresas.value = await listPublic(tableEmpresa, user.value.id, 'id', empresa_id.value)

        regime_id.value = empresas.value[0]?.regime_id
        regime_identificacao.value = regimeMap[regime_id.value] || 'Desconhecido'
        empresa_identificacao.value = empresas.value[0]?.identificacao || 'Desconhecida'

        regras.value = await listRegrasPorEmpresa(empresa_id.value)

        regrasDiferenteEmpresa.value = await listRegrasDiferenteEmpresa(empresa_id.value, regime_id.value)




      } catch (error) {
        notifyError('Erro ao lista ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const handleEditRegra = (regra) => {
      router.push({ name: 'form-regra', params: { id: regra.id, regime_id: regra.regime_id, empresa_id: regra.empresa_id } })
    }


    const handlePostEmpresaRegras = async (regraId) => {
      if (!empresas.value.length) {
        notifyError('Nenhuma empresa encontrada para associar a regra.')
        return
      }
      try {
        formEmpresaRegra.value.id = uuidv4()
        formEmpresaRegra.value.empresa_id = empresa_id.value
        //   formEmpresaRegra.value.contabilidade_id = empresas.value[0]?.contabilidade_id || ''
        formEmpresaRegra.value.regra_tributaria_id = regraId
        formEmpresaRegra.value.user_id = user.value.id

        console.log('empresa_regra', formEmpresaRegra.value)
        await post(tableEmpresaRegras, formEmpresaRegra.value)


        notifySuccess('Registro de regra para empresa salvo com sucesso!')
        handleListRegras()
      } catch (error) {
        notifyError('Erro ao salvar registro de regra para empresa: ' + error.message)
      }

    }



    onMounted(() => {
      handleListRegras()
    })

    return {
      columnsRegras,
      columnsRegrasEmpresa,
      regras,
      regrasDiferenteEmpresa,
      empresas,
      handlePostEmpresaRegras,
      filtro,
      loading,
      regime_id,
      empresa_id,
      regime_identificacao,
      empresa_identificacao,
      handleEditRegra
    }
  }
})
</script>

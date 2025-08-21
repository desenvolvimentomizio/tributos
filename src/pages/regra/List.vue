<template>
  <q-page padding>
    <!-- Card de Identificação da Contabilidade -->
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between">
        <div class="text-h6"> {{ identificacaoContabilidade }} </div>
        <q-btn v-if="$q.platform.is.desktop" label="Incluir Regra" color="primary" icon="mdi-plus" dense
          :to="{ name: 'form-regra' }" />
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
    <q-table :rows="regras" :columns="columnsRegras" row-key="id" :loading="loading" :filter="filtro" flat bordered
      class="q-mb-xl">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn color="info" label="Editar" size="sm" @click="handleEdit(props.row)">
            <q-tooltip> Editar</q-tooltip>
          </q-btn>

          <q-btn color="negative" label="Excluir" size="sm" @click="handleRemoveEmpresa(props.row)">
            <q-tooltip> Excluir </q-tooltip>
          </q-btn>



        </q-td>
      </template>
    </q-table>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { columnsRegras } from './table'

export default defineComponent({
  name: 'PageRegraList',
  setup() {
    const contabilidades = ref([])
    const regras = ref([])
    const identificacaoContabilidade = ref('')
    const idContabilidade = ref('')
    const filtro = ref('')
    const loading = ref(true)
    const tableContabilidade = 'contabilidade'
    const table = 'regra_tributaria'
    const { user } = useAuthUser()
    const router = useRouter()
    const { listPublic } = useApi()
    const { notifyError } = useNotify()

    const handleListContabilidades = async () => {
      try {
        loading.value = true
        contabilidades.value = await listPublic(tableContabilidade, user.value.id)
        identificacaoContabilidade.value = contabilidades.value[0]?.identificacao || ''
        idContabilidade.value = contabilidades.value[0]?.id || ''
      } catch (error) {
        notifyError(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleListRegras = async () => {
      try {
        loading.value = true
        regras.value = await listPublic(table, user.value.id, idContabilidade.value)

      } catch (error) {
        notifyError('Erro ao lista ' + error.message)
      } finally {
        loading.value = false
      }
    }



    const handleEdit = (row) => {
      router.push({ name: 'form-regra', params: { id: row.id } })
    }

    onMounted(() => {
      handleListContabilidades()
      handleListRegras()

    })

    return {
      columnsRegras,
      regras,
      filtro,
      loading,
      identificacaoContabilidade,
      idContabilidade,
      handleListRegras,
      handleEdit,
      //  handleRemoveEmpresa,
      //  handleRegime,
      //  handleRegra,
    }
  }
})
</script>

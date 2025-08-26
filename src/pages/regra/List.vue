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

          <q-btn color="negative" label="Desativar" size="sm" @click="handleDesativaRegra(props.row)">
            <q-tooltip> Desativar </q-tooltip>
          </q-btn>



        </q-td>
      </template>
    </q-table>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { columnsRegras } from './table'

export default defineComponent({
  name: 'PageRegraList',
  setup() {
    const $q = useQuasar()
    const regras = ref([])
    const filtro = ref('')
    const loading = ref(true)
    const table = 'regra_tributaria'
    const tableContabilidade = 'contabilidade'
    const { user } = useAuthUser()
    const router = useRouter()
    const { listPublic, updateFim } = useApi()
    const { notifyError,notifySuccess } = useNotify()
    const identificacaoContabilidade = ref('')
    const contabilidades = ref([])
    const idContabilidade = ref('')

    const handleListRegras = async () => {
      try {
        loading.value = true
        regras.value = await listPublic(table, user.value.id)

      } catch (error) {
        notifyError('Erro ao lista ' + error.message)
      } finally {
        loading.value = false
      }
    }


const handleDesativaRegra = async (regra_tributaria) => {
      $q.dialog({
        title: 'Confirmação',
        message: `Deseja desativar a empresa "${regra_tributaria.identificacao}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {

          await updateFim(table, regra_tributaria.id)
          notifySuccess('Destaivação realizada com sucesso')
          handleListRegras()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

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



    const handleEdit = (row) => {
      router.push({ name: 'form-regra', params: { id: row.id } })
      handleListRegras
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
      handleListRegras,
      handleEdit,
      handleDesativaRegra,
      identificacaoContabilidade,
    }
  }
})
</script>

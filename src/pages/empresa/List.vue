<template>
  <q-page padding>
    <!-- Card de Identificação da Contabilidade -->
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between">
        <div class="text-h6"> {{ identificacaoContabilidade }} </div>
        <q-btn
          v-if="$q.platform.is.desktop"
          label="Incluir Empresa"
          color="primary"
          icon="mdi-plus"
          dense
          :to="{ name: 'form-empresa' }"
        />
      </div>
    </q-card>

    <!-- Filtro -->
    <div class="row q-mb-sm">
      <div class="col-12 col-md-4">
        <q-input
          dense
          debounce="300"
          outlined
          v-model="filtro"
          placeholder="Buscar por identificação..."
          clearable
          prefix="🔍"
        />
      </div>
    </div>

    <!-- Tabela -->
    <q-table
      :rows="empresas"
      :columns="columnsEmpresas"
      row-key="id"
      :loading="loading"
      :filter="filtro"
      flat
      bordered
      class="q-mb-xl"
  :pagination="{ rowsPerPage: 10 }" :rows-per-page-options="[10, 20, 50]"

    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">


          <q-btn
            color="info"
            label="Editar"
            size="sm"
            @click="handleEdit(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>

            <q-btn color="primary" label="Regra" size="sm" @click="handleRegra(props.row)">
              <q-tooltip> Regra </q-tooltip>
            </q-btn>


          <q-btn
            color="negative"
            label="Desativar"
            size="sm"
            @click="handleDesativaEmpresa(props.row)">
            <q-tooltip> Desativar </q-tooltip>
          </q-btn>


        </q-td>
      </template>
    </q-table>

    <!-- Botão flutuante (mobile) -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-if="$q.platform.is.mobile"
        fab
        icon="mdi-plus"
        color="primary"
        :to="{ name: 'form-empresa' }"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsEmpresas } from './table'

export default defineComponent({
  name: 'PageEmpresaList',
  setup() {
    const contabilidades = ref([])
    const identificacaoContabilidade = ref('')
    const idContabilidade = ref('')
    const empresas = ref([])
    const filtro = ref('')
    const loading = ref(true)

    const router = useRouter()
    const $q = useQuasar()
    const table = 'empresa'
    const tableContabilidade = 'contabilidade'
    const { user } = useAuthUser()
    const { listPublic, updateFim } = useApi()
    const { notifyError, notifySuccess } = useNotify()

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

    const handleListEmpresas = async () => {
      try {
        loading.value = true
        empresas.value = await listPublic(table, user.value.id)
      } catch (error) {
        notifyError(error.message)
      } finally {
        loading.value = false
      }
   }


   const handleRegra = (empresa) => {
      router.push({ name: 'regra_empresa', params: { id: empresa.id } })
    }



    const handleEdit = (empresa) => {
      router.push({ name: 'form-empresa', params: { id: empresa.id } })
    }

    const handleDesativaEmpresa = async (empresa) => {
      $q.dialog({
        title: 'Confirmação',
        message: `Deseja desativar a empresa "${empresa.identificacao}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {

          await updateFim(table, empresa.id)
          notifySuccess('Destaivação realizada com sucesso')
          handleListEmpresas()
        } catch (error) {
          notifyError(error.message)
        }
      })
    }

    onMounted(() => {
      handleListContabilidades()
      handleListEmpresas()
    })

    return {
      columnsEmpresas,
      empresas,
      filtro,
      loading,
      identificacaoContabilidade,
      idContabilidade,
      handleEdit,
      handleDesativaEmpresa,
      handleRegra,

    }
  }
})
</script>

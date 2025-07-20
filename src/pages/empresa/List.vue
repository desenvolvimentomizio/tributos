<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="empresas"
        :columns="columnsEmpresas"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6"> {{ identificacaoContabilidade }} </span>

          <div class="row justify-center">
            <q-btn
              v-if="$q.platform.is.desktop"
              label="Incluir Empresa"
              color="primary"
              icon="mdi-plus"
              dense
              :to="{ name: 'form-empresa' }"
            />
          </div>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="info"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip> Editar </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-delete-outline"
              color="negative"
              dense
              size="sm"
              @click="handleRemoveEmpresa(props.row)"
            >
              <q-tooltip> Excluir </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
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
    const empresas = ref([])
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()
    const table = 'empresa'
    const tableContabilidade = 'contabilidade'
    const { user } = useAuthUser()
    const { listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const handleListContabilidades = async () => {
      try {
        loading.value = true
        contabilidades.value = await listPublic(tableContabilidade, user.value.id)
        identificacaoContabilidade.value = contabilidades.value[0]?.identificacao || ''
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleListEmpresas = async () => {
      try {
        loading.value = true
        empresas.value = await listPublic(table, user.value.id)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (empresa) => {
      router.push({ name: 'form-empresa', params: { id: empresa.id } })
    }

    const handleRemoveEmpresa = async (empresa) => {
      try {
        $q.dialog({
          title: 'Confirmação',
          message: `Realmente deseja excluir a ${empresa.identificacao} ?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, empresa.id)
          notifySuccess('Exclusão realizada com sucesso')
          handleListEmpresas()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListEmpresas()
      handleListContabilidades()
    })

    return {
      columnsEmpresas,
      empresas,
      loading,
      handleEdit,
      handleRemoveEmpresa,
      identificacaoContabilidade,
    }
  },
})
</script>

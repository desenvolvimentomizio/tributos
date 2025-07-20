<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="contabilidades"
        :columns="columnsContabilidade"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6"> Contabilidades </span>
          <q-space />

          <div class="row justify-center">
            <q-btn
              v-if="$q.platform.is.desktop"
              label="Incluir"
              color="primary"
              icon="mdi-plus"
              dense
              :to="{ name: 'form-contabilidade' }"
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
              @click="handleRemoveContabilidade(props.row)"
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
        :to="{ name: 'form-contabilidade' }"
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
import { columnsContabilidade } from './table'

export default defineComponent({
  name: 'PageContabilidadeList',
  setup() {
    const contabilidades = ref([])
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()
    const table = 'contabilidade'
    const { user } = useAuthUser()
    const { listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const handleListContabilidades = async () => {
      try {
        loading.value = true
        contabilidades.value = await listPublic(table, user.value.id)
        console.log('Usuario:', user.value.id)
        console.log('Contabilidade carregadas:', contabilidades.value)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (contabilidade) => {
      router.push({ name: 'form-contabilidade', params: { id: contabilidade.id } })
    }

    const handleRemoveContabilidade = async (contabilidade) => {
      try {
        $q.dialog({
          title: 'Confirmação',
          message: `Realmente deseja excluir a ${contabilidade.identificacao} ?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, contabilidade.id)
          notifySuccess('Exclusão realizada com sucesso')
          handleListContabilidades()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListContabilidades()
    })

    return {
      columnsContabilidade,
      contabilidades,
      loading,
      handleEdit,
      handleRemoveContabilidade,
    }
  },
})
</script>

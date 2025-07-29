<template>
  <q-page padding>
    <div class="row">
      <q-table :rows="contabilidades"
                :columns="columnsContabilidade"
                row-key="id"
                class="col-12"
                :loading="loading"
                @row-click="handleContabilidadeClick"
                >


        <template v-slot:top>
          <span class="text-h6"> Contabilidades - {{ nome_usuario }} </span>
          <q-space />

          <div class="row justify-center">
            <q-btn v-if="$q.platform.is.desktop && podeIncluirContabilidade" label="Incluir" color="primary"
              icon="mdi-plus" dense :to="{ name: 'form-contabilidade' }" />
          </div>
        </template>

        <template v-slot:body-cell-actions="props">

          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-pencil-outline" color="info" size="sm" @click="handleEdit(props.row)">
              <q-tooltip> Editar </q-tooltip>
            </q-btn>


            <q-btn icon="mdi-domain" color="primary" size="sm" @click="handleLisEmpresas(props.row)">
              <q-tooltip> Empresas </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>


      <!-- Abaixo lista de empresas -->
      <q-separator />
      <q-table :rows="empresas" :columns="columnsEmpresa" row-key="id" class="col-12" :loading="loading">

        <template v-slot:top>
          <!-- Conteúdo do slot top aqui, como botões ou título -->
          <div class="q-pa-sm">
            <span class="text-h6"> Empresas </span>
          </div>
        </template>

      </q-table>



    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn v-if="$q.platform.is.mobile" fab icon="mdi-plus" color="primary" :to="{ name: 'form-contabilidade' }" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { columnsContabilidade } from './table'
import { columnsEmpresa } from './tableEmpresas'

export default defineComponent({
  name: 'PageContabilidadeList',
  setup() {
    const nome_usuario = ref('')
    const contabilidades = ref([])
    const empresas = ref([])
    const loading = ref(true)
    const router = useRouter()
    const $q = useQuasar()
    const table = 'contabilidade'
    const tableempresa = 'empresa'
    const { user } = useAuthUser()
    const { list, listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const handleListContabilidades = async () => {
      try {
        loading.value = true
        if (user.value.email === 'tributos@miziosistemas.com.br') {
          contabilidades.value = await list(table)
          nome_usuario.value = 'Administrador'
        } else {
          contabilidades.value = await listPublic(table, user.value.id)
          nome_usuario.value = contabilidades.value[0]?.nome_usuario || ''
          console.log(nome_usuario)
        }

        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (contabilidade) => {
      router.push({ name: 'form-contabilidade', params: { id: contabilidade.id } })
    }

    const handleLisEmpresas = async () => {
      router.replace({ name: 'empresa' })
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

   function handleContabilidadeClick(evt, row) {
     console.log('ID da contabilidade selecionada:', row.id)
     handleListEmpresas(row.id)
    }

    const handleListEmpresas = async (id) => {
      try {
        if (!Number.isInteger(id)) {
            console.warn('ID inválido para listar empresas:', id)
            return
          }

        loading.value = true
        empresas.value = await listPublic(tableempresa, user.value.id, 'contabilidade_id',id)
        loading.value = false

      } catch (error) {
        notifyError(error.message)
      }
    }



    onMounted(() => {
      handleListContabilidades()
      handleListEmpresas()
    })

    const podeIncluirContabilidade = computed(() => {
      if (user.value.email === 'tributos@miziosistemas.com.br') {
        return true
      } else {
        return contabilidades.value.length === 0
      }
    })

    return {
      columnsContabilidade,
      columnsEmpresa,
      contabilidades,
      empresas,
      loading,
      handleEdit,
      handleRemoveContabilidade,
      handleLisEmpresas,
      handleContabilidadeClick,
      handleListEmpresas,
      podeIncluirContabilidade,
      nome_usuario

    }
  },
})
</script>

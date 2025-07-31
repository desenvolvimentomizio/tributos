<template>
  <q-page padding>
    <div class="row">
      <q-table :rows="contabilidades" :columns="columnsContabilidade" row-key="id" class="col-12" :loading="loading"
        @row-click="handleContabilidadeClick">


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
            <q-btn color="info" size="sm" @click="handleEdit(props.row)" label="Editar">
              <q-tooltip> Editar </q-tooltip>
            </q-btn>

          </q-td>
        </template>
      </q-table>

      <!-- Espaço vertical entre as tabelas -->
      <div class="col-12 q-my-md">
        <q-separator spaced />
      </div>



      <!-- Abaixo lista de empresas -->
      <q-table :rows="empresas" :columns="columnsEmpresa" row-key="id" class="col-12" :loading="loading">
        <template v-slot:top>

          <div class="q-pa-sm row items-center justify-between full-width">
            <!---- <div class="q-pa-sm row items-center"> -->
            <span class="text-h6">Empresas</span>
            <q-space />
            <q-btn v-if="$q.platform.is.desktop" label="Incluir Empresa" color="primary"
              :to="{ name: 'form-empresa' }" />
          </div>
        </template>




        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">


            <q-btn color="info" label="Editar" size="sm" @click="handleEditEmpresa(props.row)">
              <q-tooltip> Editar </q-tooltip>
            </q-btn>

            <q-btn color="negative" label="Excluir" size="sm" @click="handleRemoveEmpresa(props.row)">
              <q-tooltip> Excluir </q-tooltip>
            </q-btn>

            <q-btn color="primary" label="Regra" size="sm" @click="handleRegra(props.row)">
              <q-tooltip> Regra </q-tooltip>
            </q-btn>


          </q-td>
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




   const handleRegra = (empresa) => {
      router.push({ name: 'regra', params: { id: empresa.id } })
    }



    const handleListContabilidades = async () => {
      try {
        loading.value = true
        if (user.value.email === 'tributos@miziosistemas.com.br') {
          contabilidades.value = await list(table)
          nome_usuario.value = 'Administrador'
        } else {
          contabilidades.value = await listPublic(table, user.value.id)
          nome_usuario.value = contabilidades.value[0]?.nome_usuario || ''
        }

        loading.value = false
        // Simula clique se houver só um

        if (contabilidades.value.length === 1) {
          const unicaContabilidade = contabilidades.value[0]
         // const id = unicaContabilidade.id
          handleContabilidadeClick(null, unicaContabilidade)
        }




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

    const handleEditEmpresa = (empresa) => {
      router.push({ name: 'form-empresa', params: { id: empresa.id } })
    }



    const handleRemoveEmpresa = async (empresa) => {
      $q.dialog({
        title: 'Confirmação',
        message: `Deseja excluir a empresa "${empresa.identificacao}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await remove(tableempresa, empresa.id)
          notifySuccess('Exclusão realizada com sucesso')
          handleListContabilidades()
        } catch (error) {
          notifyError(error.message)
        }
      })
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
      handleListEmpresas(row.id)
    }

    const handleListEmpresas = async (id) => {
      try {
        if (!id) {
          return // ou return null, return [], etc. conforme o esperado
        }

        loading.value = true
        empresas.value = await listPublic(tableempresa, user.value.id, 'contabilidade_id', id)
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
      handleEditEmpresa,
      handleRemoveEmpresa,
      handleContabilidadeClick,
      handleListEmpresas,
      handleRegra,
      podeIncluirContabilidade,
      nome_usuario

    }
  },
})
</script>

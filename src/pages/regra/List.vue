<template>
  <q-page padding>
    <!-- Card de Lista de regras -->
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="row items-center justify-between">
        <div class="text-h6"> Lista de REGRAS - Regime: {{ regime_identificacao }} - Empresa: {{ empresa_identificacao
          }}
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
    <q-table :rows="regras" :columns="columnsRegras" row-key="id" :loading="loading" :filter="filtro" flat bordered
      class="q-mb-xl">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">


          <q-btn color="info" label="Editar" size="sm" @click="handleEdit(props.row)">
            <q-tooltip> Editar </q-tooltip>
          </q-btn>

          <q-btn color="negative" label="Excluir" size="sm" @click="handleRemove(props.row)">
            <q-tooltip> Excluir </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>


  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import {  useRouter } from 'vue-router'

import { columnsRegras } from './table'

export default defineComponent({
  name: 'PageRegraList',
  setup() {
    const empresa_id = ref('')
    const regime_id = ref('')
    const regime_identificacao = ref('')
    const empresa_identificacao = ref('')
    const regras = ref([])
    const filtro = ref('')

    const router = useRouter()
    const empresas = ref([])
    const loading = ref(true)

    const { notifyError } = useNotify()
    const table = 'regra_tributaria'

    const { user } = useAuthUser()
    const { listPublic } = useApi()

    const regimeMap = {
      1: 'Simples Nacional',
      2: 'Simples Nacional - sublimite',
      3: 'Lucro Presumido'
    }



    const handleListRegras = async () => {
      try {
        loading.value = true

        regime_id.value = empresas.value[0]?.regime_id
        regime_identificacao.value = regimeMap[regime_id.value] || 'Desconhecido'
        empresa_identificacao.value = empresas.value[0]?.identificacao || 'Desconhecida'

        regras.value = await listPublic(table, user.value.id)

      } catch (error) {
        notifyError(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleEditRegra = (regra) => {
      router.push({ name: 'form-regra', params: { id: regra.id, regime_id: regra.regime_id, empresa_id: regra.empresa_id } })
    }


    onMounted(() => {
      handleListRegras()
    })

    return {
      columnsRegras,
      regras,
      empresas,
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

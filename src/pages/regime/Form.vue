<template>
  <q-page padding>
    <div class="row justify-center">
      <q-card class="col-md-4 col-xs-12 col-sm-12 q-pa-lg shadow-2 bg-white" style="border-radius: 16px;">
        <div class="text-h5 text-white text-center text-bold q-mb-lg q-pa-sm"
             style="background-color: var(--q-primary); border-radius: 8px;">
          Regime Tributário -
        </div>

          <q-form ref="formRef" class="q-gutter-y-md" @submit.prevent="handleSubmit">

          <q-select
            v-model="form.regime_id"
            label="Regime Tributário"
            :options="regimeOptions"
            emit-value
            map-options
            option-label="label"
            option-value="value"
            filled
            :rules="[(val) => !!val || 'Regime é obrigatório']"
          />

          <div class="q-my-md"></div>
          <div class="row q-col-gutter-md">
            <div class="col">
              <q-btn :label="isUpdate ? 'Atualiza' : 'Salva'" color="primary" class="full-width" rounded type="submit" />
            </div>
            <div class="col">
              <q-btn label="Cancela" color="primary" class="full-width" rounded flat :to="{ name: 'contabilidade' }" />
            </div>
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'


export default defineComponent({
  name: 'PageFormRegine',

  setup() {

    const formRef = ref(null)
    const table = 'empresa_regime_tributario'
    const router = useRouter()
    const route = useRoute()
    const { user } = useAuthUser()
    const { post, getById, getByUserId, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)




    const form = ref({
      empresa_id: '',
      contabilidade_id: '',
      regime_id: '',
      entrada_regime: '',
      saida_regime: '',
      descricao: '',
    })

      const regimeOptions = [
        { label: 'Simples Nacional', value: 1 },
        { label: 'Simples Nacional - excesso de sublimite da receita bruta', value: 2 },
        { label: 'Regime Normal', value: 3 }
      ]


      const handleSubmit = async () => {
        const formValid = await formRef.value?.validate()

        if (!formValid ) {
          notifyError('Verifique os campos obrigatórios')
          return
        }

        try {
          if (isUpdate.value) {
            await update(table, form.value)
            notifySuccess('Registro atualizado com sucesso')
          } else {
            await post(table, form.value)
            notifySuccess('Registro incluído com sucesso')
          }
          router.push({ name: 'empresa_regime_tributario' })
        } catch (error) {
          notifyError(error.message)
        }
      }


    const handleGetRegime = async (id) => {
      try {
        const regime = await getById(table, id)
        Object.assign(form.value, regime)

      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetContabilidade = async () => {
      try {
        const contabilidade = await getByUserId('contabilidade', 'user_id', user.value.id)
        form.value.contabilidade_id = contabilidade[0]?.id
        form.value.user_id = user.value.id
      } catch (error) {
        notifyError(error.message)
      }
    }



    onMounted(() => {
      if (isUpdate.value) handleGetRegime(isUpdate.value)
      else handleGetContabilidade()
    })

    return {
      handleSubmit,
      form,
      isUpdate,
      formRef,
      regimeOptions

    }
  }
})
</script>

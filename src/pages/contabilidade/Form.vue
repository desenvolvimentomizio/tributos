<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Contabilidades</p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Identificação"
          v-model="form.identificacao"
          :rules="[(val) => (val && val.length > 0) || 'Identificação é obrigatória']"
        />

        <q-input
          label="Telefone"
          v-model="form.telefone"
          :rules="[(val) => (val && val.length > 0) || 'Telefone é obrigatório']"
          unmasked-value
        />

        <q-btn
          :label="isUpdate ? 'Atualiza' : 'Salva'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        />

        <q-btn
          label="Cancela"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'contabilidade' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageFormContabilidade',
  setup() {
    const table = 'contabilidade'
    const router = useRouter()
    const route = useRoute()
    const { post, getById, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()

    const isUpdate = computed(() => route.params.id)

    let contabilidade = {}
    const form = ref({
      identificacao: '',
      telefone: '',
    })

    onMounted(() => {
      if (isUpdate.value) {
        handleGetContabilidade(isUpdate.value)
      }
    })

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value)
          notifySuccess('Registro atualizado com sucesso')
        } else {
          await post(table, form.value)
          notifySuccess('Registro incluído com sucesso')
        }
        router.push({ name: 'contabilidade' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetContabilidade = async (id) => {
      try {
        contabilidade = await getById(table, id)
        Object.assign(form.value, contabilidade)
      } catch (error) {
        notifyError(error.message)
      }
    }

    const isValidPhone = (val) => {
      const phone = val.replace(/\D/g, '')
      const ddd = phone.substring(0, 2)
      const validDDD = [
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '21',
        '22',
        '24',
        '27',
        '28',
        '31',
        '32',
        '33',
        '34',
        '35',
        '37',
        '38',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '51',
        '53',
        '54',
        '55',
        '61',
        '62',
        '64',
        '63',
        '65',
        '66',
        '67',
        '68',
        '69',
        '71',
        '73',
        '74',
        '75',
        '77',
        '79',
        '81',
        '82',
        '83',
        '84',
        '85',
        '86',
        '87',
        '88',
        '89',
        '91',
        '92',
        '93',
        '94',
        '95',
        '96',
        '97',
        '98',
        '99',
      ]

      if (!validDDD.includes(ddd)) return false
      if (phone.length === 11 && phone[2] !== '9') return false // celular deve iniciar com 9
      if (phone.length < 10 || phone.length > 11) return false

      return true
    }

    return {
      handleSubmit,
      form,
      isUpdate,
      isValidPhone,
    }
  },
})
</script>

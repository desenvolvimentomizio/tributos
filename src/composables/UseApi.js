import useSupabase from 'src/boot/supabase'
import useAuthUser from './UseAuthUser'
import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'
import useBrand from 'src/composables/UseBrand'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const brand = ref({
  primary: '',
  secondary: '',
  name: '',
  phone: '',
  paralax_url: '',
})

export default function useApi() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()
  const route = useRoute()
  const { setBrand } = useBrand()
  const $q = useQuasar()

  const list = async (table) => {
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw error
    return data
  }

  const listPublic = async (table, userId, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq(columnFilter, filter)
    if (error) throw error
    return data
  }

  const fetchCount = async (table, userId) => {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
    if (error) throw error
    return {
      data,
      count,
    }
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single() // ⬅ isso garante que vem só 1 item
    if (error) throw error
    return data
  }

  const getByUserId = async (table, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(columnFilter, filter)
    if (error) throw error
    return data
  }


  const post = async (table, form) => {
    const { data, error } = await supabase.from(table).insert([
      {
        ...form,
        user_id: user.value.id,
      },
    ])
    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: form.id })
    if (error) throw error
    return data
  }

  const remove = async (table, id) => {
    const { data, error } = await supabase.from(table).delete().match({ id })
    if (error) throw error
    return data
  }

  const uploadImg = async (file, storage) => {
    const fileName = uuidv4()
    const { error } = supabase.storage.from(storage).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })
    const publicUrl = await getUrlPublic(fileName, storage)
    if (error) throw error
    return publicUrl
  }

  const getUrlPublic = async (fileName, storage) => {
    const { publicURL, error } = supabase.storage.from(storage).getPublicUrl(fileName)
    if (error) throw error
    return publicURL
  }

  const getBrand = async () => {
    const id = route.params.id || user?.value?.id
    if (!id) return

    $q.loading.show({ backgroundColor: 'dark' })

    try {
      const { data, error } = await supabase.from('config').select('*').eq('user_id', id).single()

      if (error) throw error

      brand.value = data
      setBrand(data.primary, data.secondary)
      return brand
    } finally {
      $q.loading.hide()
    }
  }

const upsertRegimeTributario = async (empresaId, contabilidadeId, novoRegimeId) => {
  const hoje = new Date().toISOString().split('T')[0]

  // Pega o último regime da empresa
const { data: regimes, error } = await supabase
  .from('empresa_regime_tributario')
  .select('*')
  .eq('empresa_id', empresaId)
  .is('saida_regime', null) // ⬅ somente onde não houve saída
  .order('entrada_regime', { ascending: false }) // mais recente primeiro
  .limit(1)

 if (error) throw error

  const ultimo = regimes[0]

  if (!ultimo) {
    // Nenhum regime anterior — cria o primeiro
    const { error: insertError } = await supabase.from('empresa_regime_tributario').insert({
      empresa_id: empresaId,
      contabilidade_id: contabilidadeId,
      regime_id: novoRegimeId,
      entrada_regime: hoje,
      user_id: user.value.id, // ← salva o usuário logado
    })
    if (insertError) throw insertError
  } else if (ultimo.regime_id !== novoRegimeId) {
    // Regime mudou — atualiza o último com saída e insere novo
    const { error: updateError } = await supabase
      .from('empresa_regime_tributario')
      .update({ saida_regime: hoje })
      .eq('id', ultimo.id)
    if (updateError) throw updateError

    const { error: insertError } = await supabase.from('empresa_regime_tributario').insert({
      empresa_id: empresaId,
      contabilidade_id: contabilidadeId,
      regime_id: novoRegimeId,
      entrada_regime: hoje,
      user_id: user.value.id, // ← novamente, registra o usuário
    })
    if (insertError) throw insertError
  }
}


  return {
    list,
    listPublic,
    fetchCount,
    getById,
    getByUserId,
    post,
    update,
    remove,
    uploadImg,
    getBrand,
    brand,
    upsertRegimeTributario,
  }
}

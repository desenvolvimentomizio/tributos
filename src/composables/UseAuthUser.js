// src/composables/UseAuthUser.js
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { supabase, onAuthStateChange } from 'boot/supabase' // ✅ sem ciclo
import useNotify from 'src/composables/UseNotify'
import { translateSupabaseError } from 'src/utils/translateSupabaseError' // sem .ts

// Estado compartilhado
const user = ref(null)

export default function useAuthUser () {
  const { notifyError } = useNotify()

  // Listener de auth (removido no unmount)
  let off = null

  onMounted(async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (!error) user.value = data.user || null
    } catch  {
      /* ignore */
    }

    // registra um callback (o boot garante apenas uma assinatura real no SDK)
    off = onAuthStateChange((_event, session) => {
      user.value = session?.user || null
    })
  })

  onBeforeUnmount(() => {
    if (typeof off === 'function') {
      off()
      off = null
    }
  })

  // --- login email/senha ---
  async function login ({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  // --- login social (OAuth) ---
  async function loginWithSocialProvider (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/me`
      }
    })
    if (error) throw error
    return data // contém a url de redirecionamento
  }

  // --- logout ---
  async function logout () {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // --- checar login rapidamente ---
  function isLoggedIn () {
    return !!user.value
  }

  // --- registrar ---
  async function register ({ email, password, ...meta }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`
      }
    })

    if (error) {
      const friendly = translateSupabaseError(error)
      notifyError(friendly)
      throw new Error('Erro ao registrar usuário')
    }

    return data.user
  }

  // --- atualizar dados do usuário (email/senha/metadata) ---
  async function update (payload) {
    const { data, error } = await supabase.auth.updateUser(payload)
    if (error) throw error
    return data.user
  }

  // --- enviar email de reset de senha (etapa 1) ---
  async function sendPasswordResetEmail (email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return true
  }

  // --- definir nova senha após clicar no link (etapa 2) ---
  // Requer que o boot auth-hash já tenha feito setSession() com os tokens do #...
  async function resetPassword (newPassword) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data.user
  }

  return {
    user,
    isLoggedIn,
    login,
    loginWithSocialProvider,
    logout,
    register,
    update,
    sendPasswordResetEmail,
    resetPassword
  }
}

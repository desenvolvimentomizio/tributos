// src/composables/UseAuthUser.js
import { ref } from 'vue'
import useSupabase from 'boot/supabase' // deve exportar { supabase }
import useNotify from 'src/composables/UseNotify'
import { translateSupabaseError } from 'src/utils/translateSupabaseError.ts'

const user = ref(null) // estado global

export default function useAuthUser () {
  const { supabase } = useSupabase()
  const { notifyError } = useNotify()

  // --- manter user sincronizado ---
  // pega sessão atual ao carregar
  supabase.auth.getSession().then(({ data }) => {
    user.value = data?.session?.user ?? null
  })
  // escuta mudanças de auth (login/logout/reset)
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })

  // --- login email/senha ---
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  // --- login social (Google/GitHub etc) ---
  const loginWithSocialProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/me` // ajuste sua rota pós-login
      }
    })
    if (error) throw error
    return data // contém url para redirecionamento
  }

  // --- logout ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // --- checar login (rápido, via estado local) ---
  const isLoggedIn = () => !!user.value

  // --- registrar ---
  const register = async ({ email, password, ...meta }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`
      }
    })

    if (error) {
      const friendlyMessage = translateSupabaseError(error)
      notifyError(friendlyMessage)
      throw new Error('Erro ao registrar usuário')
    }

    return data.user
  }

  // --- atualizar dados do usuário (email, senha, metadata) ---
  // Use updateUser do v2. Ex.: update({ password: 'nova' }) ou update({ data: { nome: '...' }})
  const update = async (payload) => {
    const { data, error } = await supabase.auth.updateUser(payload)
    if (error) throw error
    return data.user
  }

  // --- enviar email de reset de senha (etapa 1) ---
  const sendPasswordResetEmail = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return true
  }

  // --- definir nova senha após o link (etapa 2) ---
  // No v2 não precisa de token manual aqui: o usuário volta autenticado temporariamente
  const resetPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data.user
  }

  return {
    user,
    login,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordResetEmail, // (corrigido nome)
    resetPassword
  }
}

import { Notify } from 'quasar'
import { translateSupabaseError } from '../utils/translateSupabaseError'

export default function useNotify() {
  const notifySuccess = (message = 'Tudo certo!') => {
    Notify.create({
      type: 'positive',
      message,
    })
  }

  const notifyError = (err, defaultMessage = 'Algo deu errado!') => {
    let finalMessage = defaultMessage

    if (err) {
        if (err instanceof Error) {
          // Erro genérico (Error)
          finalMessage = err.message || defaultMessage
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
          // Erro que parece vir do Supabase
          finalMessage = translateSupabaseError(err)
        } else if (typeof err === 'string') {
          // Mensagem simples
          finalMessage = err
        }
      }

    Notify.create({
      type: 'negative',
       message: finalMessage,
    })
  }











  return {
    notifySuccess,
    notifyError,
  }
}

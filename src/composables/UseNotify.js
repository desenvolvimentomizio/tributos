import { Notify } from 'quasar'






 export default function useNotify() {


  const notifySuccess = (message = 'Tudo certo!') => {
     Notify.create({
       type: 'positive',
       message,
     })
   }

   const notifyError = (message = 'Algo deu errado!') => {
    Notify.create({
       type: 'negative',
       message,
     })
   }

   return {
     notifySuccess,
     notifyError,
   }
 }

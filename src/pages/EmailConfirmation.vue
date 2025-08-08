<template>
  <q-page class="flex flex-center q-pa-lg bg-grey-1">
    <div class="column items-center q-gutter-md" style="max-width: 500px; width: 100%">
      <!-- Logo -->
      <q-img
        src="https://miziosistemas.com.br/wp-content/uploads/elementor/thumbs/mizio-original_PNG-qgdupvfwc1ga0zp3eiygpkpi7ib1fgbksefjg6xg7w.png"
        alt="Mizio Sistemas"
        contain
        style="max-width: 180px"
      />

      <!-- Título amigável -->
      <div class="text-h5 text-primary text-center">Tudo certo, contador!</div>

      <!-- Mensagem explicativa -->
      <p class="text-body1 text-center text-grey-8">
        Cadastro realizado com sucesso:
        <strong>{{ $route.query.email }}</strong
        ><br />
        Só realizar o login no sistema Mizio Tributos.
      </p>

      <!-- Botão de voltar -->
      <q-btn
        label="Voltar para o Login"
        color="primary"
        rounded
        unelevated
        class="full-width"
        :to="{ name: 'login' }"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageEmailConfirmation',
})
</script>

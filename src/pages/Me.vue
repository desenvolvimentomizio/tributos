<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard table="category" label="Categories" icon="mdi-shape-outline" />
      </div>
      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard table="product" label="Products" icon="mdi-archive" />
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'PageMe',
  components: {
    CardDashboard: defineAsyncComponent(() => import('components/CardDashbaord.vue')),
  },
  setup() {
    const userName = ref('')

    onMounted(() => {
      userName.value = localStorage.getItem('userName') || ''
    })

    return {
      userName,
    }
  },
})
</script>

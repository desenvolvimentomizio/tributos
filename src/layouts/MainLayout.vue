<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar >
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Mizio Tributos </q-toolbar-title>
        <dark-mode-toogle />
        <div>
          <q-btn-dropdown flat color="white" icon="person">
            <q-list>
              <q-item clickable v-close-popup @click="handleContabilidade">
                <q-item-section>
                  <q-item-label>Contabilidade</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>
                  <q-item-label>Sair</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer :width="220" v-model="leftDrawerOpen" show-if-above bordered  class="bg-grey-2" >
      <q-list dense >


        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutDown"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import DarkModeToggle from 'components/DarkModeToggle.vue'

const linksList = [
  {
    title: 'Empresas',
    caption: '',
    icon: 'mdi-home',
    routeName: 'empresa',
  },

 {
    title: 'Regras Tributárias',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'regra',
  },
]

import { defineComponent, ref, onMounted } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useApi from 'src/composables/UseApi'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    DarkModeToggle,
  },

  setup() {
    const leftDrawerOpen = ref(false)

    const $q = useQuasar()
    const router = useRouter()
    const { logout } = useAuthUser()
    const { getBrand } = useApi()

    onMounted(() => {
      getBrand()
    })

    const handleContabilidade = async () => {
       router.push({ name: 'contabilidade' })
    }

    const handleLogout = async () => {
      $q.dialog({
        title: 'Sair',
        message: 'Deseja realmente sair do sistema ?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout()
        router.replace({ name: 'login' })
      })
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout,
      handleContabilidade,
    }
  },
})
</script>

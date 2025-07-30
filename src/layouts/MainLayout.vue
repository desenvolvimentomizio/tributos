<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Mizio Tributos </q-toolbar-title>
        <dark-mode-toogle />
        <div>
          <q-btn-dropdown flat color="white" icon="person">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Perfil</q-item-label>
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
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
    title: 'Início',
    caption: '',
    icon: 'mdi-home',
    routeName: 'me',
  },
  {
    title: 'Contabilidade',
    caption: '',
    icon: 'mdi-shape-outline',
    routeName: 'contabilidade',
  },
  {
    title: 'Empresa',
    caption: '',
    icon: 'mdi-archive',
    routeName: 'empresa',
  },
  {
    title: 'Regras Tributárias',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'form-config',
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
    }
  },
})
</script>

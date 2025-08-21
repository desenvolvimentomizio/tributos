const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/LoginPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue') },
      {
        path: 'email-confirmation',
        name: 'email-confirmation',
        component: () => import('pages/EmailConfirmation.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPassword.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'me', name: 'me', component: () => import('pages/Me.vue') },

      {
        path: 'contabilidade',
        name: 'contabilidade',
        component: () => import('pages/contabilidade/List.vue'),
      },
      {
        path: 'form-contabilidade/:id?',
        name: 'form-contabilidade',
        component: () => import('pages/contabilidade/Form.vue'),
      },

      {
        path: 'empresa',
        name: 'empresa',
        component: () => import('pages/empresa/List.vue'),
      },
      {
        path: 'form-empresa/:id?',
        name: 'form-empresa',
        component: () => import('pages/empresa/Form.vue'),
      },
      {
        path: 'regra_empresa/:id?',
        name: 'regra_empresa',
        component: () => import('src/pages/regra_empresa/List.vue'),
      },
      {
        path: 'regra/:id?',
        name: 'regra',
        component: () => import('src/pages/regra/List.vue'),
      },
      {
        path: 'form-regra/:id?',
        name: 'form-regra',
        component: () => import('src/pages/regra/Form.vue'),
      },
      {
        path: 'form-regra-empresa/:id?/:regime_id?/:empresa_id?',
        name: 'form-regra-empresa',
        component: () => import('src/pages/regra_empresa/Form.vue'),
      },
      {
        path: 'form-config/:id?',
        name: 'form-config',
        component: () => import('pages/config/Form.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/PageError404.vue'),
  },
]

export default routes

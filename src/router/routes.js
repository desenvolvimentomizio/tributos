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
      {
        path: 'product-public/:id',
        name: 'product-public',
        component: () => import('pages/product/Public.vue'),
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
        path: 'form-regra/:id?',
        name: 'form-regra',
        component: () => import('pages/regra/Form.vue'),
      },

      { path: 'product', name: 'product', component: () => import('pages/product/List.vue') },
      {
        path: 'form-product/:id?',
        name: 'form-product',
        component: () => import('pages/product/Form.vue'),
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

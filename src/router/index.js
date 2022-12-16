import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Главная',
    component: () => import('@/layouts/DefaultLayout'),
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'Профиль',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/profile/Main.vue'),
      },
      {
        path: '/test',
        name: 'Test',
        nameRu: 'Тест',
        component: () => import('@/views/test/test.vue'),
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Настройки',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Страница не найдена',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: 'login',
        name: 'Вход',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'registration',
        name: 'Регистрация',
        component: () => import('@/views/pages/Registration'),
      },
      {
        path: '500',
        name: 'Ошибка сервера',
        component: () => import('@/views/pages/Page500'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/pages/login', '/pages/registration']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/pages/login')
  } else {
    next()
  }
})

export default router

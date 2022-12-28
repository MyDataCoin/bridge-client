import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Главная',
    component: () => import('@/layouts/DefaultLayout'),
    children: [
      {
        path: '/profile',
        name: 'Профиль',
        permission: ['User'],
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/profile/Main.vue'),
      },
      {
        path: '/users',
        name: 'Пользователи',
        permission: ['Administrator'],
        component: () => import('@/views/users/UserList.vue'),
      },
      {
        path: '/statistics',
        name: 'Статистика',
        permission: ['Administrator'],
        component: () => import('@/views/statistics/Statistics.vue'),
      },
      {
        path: '/providers',
        name: 'Держатели данных',
        permission: ['Manager'],
        component: () => import('@/views/data_providers/DataProviderList.vue'),
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
      {
        path: 'registration',
        name: 'Регистрация',
        component: () => import('@/views/pages/Registration'),
      },
      {
        path: '403',
        name: 'Нет доступа',
        component: () => import('@/views/pages/Page403'),
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
  const publicPages = [
    '/pages/login',
    '/pages/registration',
    '/pages/404',
    '/pages/403',
    '/pages/500',
  ]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  const path = to.path
  let perm = null

  routes[0].children.forEach((item) => {
    if (item.path === path) {
      perm = item.permission
    } else {
      let tempPath = path.split('/')
      tempPath.pop()
      let edited = ''
      tempPath.forEach((item) => {
        edited += item + '/'
      })
      edited += ':id'

      if (item.path === edited) {
        perm = item.permission
      }
    }
  })

  if (authRequired && !loggedIn) {
    next('/pages/login')
  } else {
    if (loggedIn && store.state.auth.user.role !== null) {
      const role = JSON.parse(JSON.stringify(store.state.auth.user.role))
      if (perm != null) {
        if (String(role) === String(perm)) {
          next()
        } else {
          next({
            name: 'Нет доступа',
          })
        }
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router

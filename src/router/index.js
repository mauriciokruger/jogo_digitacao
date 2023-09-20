import Vue from 'vue'
import Router from 'vue-router'
import PainelInicial from '@/pages/TheHome'
import Login from '@/pages/TheLogin'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(NProgress)
NProgress.configure({
  showSpinner: false
})

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/',
      name: 'PainelInicial',
      component: PainelInicial,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  NProgress.set(0.1)
  // setTimeout(() => {
  //   NProgress.done()
  // }, 500)
  next()
})

router.afterEach(() => {
  NProgress.set(0.9)
  // NProgress.done()
  setTimeout(() => NProgress.done(), 500)
})

export default router

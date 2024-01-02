import Vue from 'vue'
import VueRouter from 'vue-router'
import loginForm from "@/components/auth/login-form.vue"

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'login-form',
    component: loginForm
  },

  {
    path: '/register-form',
    name: 'register-form',
    component: () => import(/* webpackChunkName: "register-form" */ '@/components/auth/register-form.vue')
  },
  {
    path: '/calendar/:email',
    name: 'calendar',
    component: () => import(/* webpackChunkName: "calendar" */ '@/components/calendario/calendar.vue'),
  },
  {
    path: '/notes-list/:email',
    name: 'notes-list',
    component: () => import(/* webpackChunkName: "notes-list" */ '@/components/notes-list/notas.vue'),
  },
  {
    //path para cuando se coloca una ruta que no existe
    path: "/:pathMatch(.*)*",
    redirect: { name: 'login-form' }
  },//recordar dejar los path encima de esto
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

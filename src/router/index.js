import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '@/views/Home.vue'
import MyShare from '@/views/MyShare.vue'
import MyFile from '@/views/MyFile.vue'
import PersonalInfo from '@/views/PersonalInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '',
          name: 'defaltMyFile',
          component: MyFile
        },
        {
          path: 'myFile',
          component: MyFile
        },
        {
          path: 'myShare',
          component: MyShare
        },
        {
          path: 'personalInfo',
          component: PersonalInfo
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router

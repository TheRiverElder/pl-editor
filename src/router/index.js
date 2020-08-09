import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import ResourceManager from '@/views/ResourceManager.vue'
import RoleManager from '@/views/RoleManager.vue'
import ChunkManager from '@/views/ChunkManager.vue'
import InjectPage from '@/views/InjectPage.vue'
import Demonstration from '@/views/Demonstration.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/resource-manager',
    name: 'ResourceManager',
    component: ResourceManager
  },
  {
    path: '/role-manager',
    name: 'RoleManager',
    component: RoleManager
  },
  {
    path: '/chunk-manager',
    name: 'ChunkManager',
    component: ChunkManager
  },
  {
    path: '/inject-page',
    name: 'InjectPage',
    component: InjectPage
  },
  {
    path: '/demonstration',
    name: 'Demonstration',
    component: Demonstration
  }
]

const router = new VueRouter({
  routes
})

export default router

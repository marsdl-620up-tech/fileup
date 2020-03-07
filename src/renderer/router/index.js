import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import HistoryPage from '@/components/HistoryPage/HistoryPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: LandingPage
    },
    {
      path: '/history',
      name: '历史记录',
      component: HistoryPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

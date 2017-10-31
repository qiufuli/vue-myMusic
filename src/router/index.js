import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		//重定向 要不页面进来的时候没有默认效果
  		path:'/',
  		redirect:'/Recommend'
  	},
    {
    	path:'/recommend',
    	component:Recommend
    },
    {
    	path:'/singer',
    	component:Singer
    },
    {
    	path:'/rank',
    	component:Rank
    },
    {
    	path:'/search',
    	component:Search
    }
  ]
})

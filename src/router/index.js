import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Singer from '@/components/singer/singer'
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'
import TopList from '@/components/top-list/top-list'
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
		component:Recommend,
		children:[
			{
				path:':id',
				component:Disc
			}
		]
    },
    {
    	path:'/singer',
    	component:Singer,
    	children:[
    		{
    			path:':id',
    			component:SingerDetail
    		}
    	]
    },
    {
    	path:'/rank',
			component:Rank,
			children:[
				{
					path:':id',
					component:TopList
				}
			]
    },
    {
    	path:'/search',
		component:Search,
		children:[
    		{
    			path:':id',
    			component:SingerDetail
    		}
    	]
    }
  ]
})

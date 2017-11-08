// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
/*因为在 build/webpack.base.conf.js里配置了别名alias 所以可以直接用common*/
import 'common/stylus/index.styl'
import vueLazyLoad from 'vue-lazyload'

fastclick.attach(document.body)

Vue.use(vueLazyLoad,{
	loading: require('@/common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

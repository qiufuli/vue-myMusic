<template>
  <div id="app">
	<m-header></m-header>
	<tab></tab>
	<keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--播放器不属于任何路由 随时都嫩播放-->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6"> 
import mHeader from '@/components/m-header/m-header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  components:{
  	mHeader,
  	Tab,
  	Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/variable'
	#app
		color:$color-theme;
		
</style>

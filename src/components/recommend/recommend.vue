<template>
  <div class="recommend" ref="recommend">
   <!-- 需要等歌单渲染完-->
    <scroll ref="scroll" class="recommend-content" :data="discList">
    	<div>
	    	<!-- recommends异步请求的数据 需要时间 所以等recommends渲染完了 再进行dom操作-->
	        <div  v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
	        	<slider>
	        		<div v-for="item in recommends">
	        			<a :href="item.linkUrl">
	        				<!-- needsclick 这个class 不是样式 是监听是否需要点击事件 有的话 不会拦截-->
	        				<!--是fastclick（移动端300延迟解决方案） 和 better-scroll 冲突了 needsclick是fastclick里面的-->
	        				<img @load="loadImage" class="needsclick" :src="item.picUrl" alt="" />
	        			</a>
	        		</div>
	        	</slider>
	        </div>
	        <div class="recommend-list">
	          <h1 class="list-title">热门歌单推荐</h1>
	          <ul>
	            <li @click="selectItem(item)" v-for="item in discList" class="item">
	            	<div class="icon">
	            		<!-- 懒加载  vue官网上有-->
	            		<img v-lazy="item.imgurl" width="60" height="60" alt="" />
	            	</div>
	            	 <div class="text">
	            	 	<h2 class="name" v-html="item.creator.name"></h2>
	            	 	<p class="desc" v-html="item.dissname"></p>
	            	 </div>
	            </li>
	            
	          </ul>
	        </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
        	<loading></loading>
        </div>
   </scroll>
	 <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	// slider 轮播
	import Slider from '@/base/slider/slider'
	import {getRecommend,getDiscList} from '@/api/recommend'
	import {ERR_OK} from '@/api/config'
	import Scroll from '@/base/scroll/scroll'
	import Loading from '@/base/loading/loading'
	import {playlistMixin} from '@/common/js/mixin'
	import {mapMutations} from 'vuex'
	export default{
		mixins:[playlistMixin],
		created(){
			this._getRecommend()
			this._getDiscList()
		},
		data(){
			return{
				recommends:[],
				discList:[]
			}
		},
		components:{
			Slider,
			Scroll,
			Loading
		},
		methods:{
			handlePlaylist(playlist){
	   		const bottom = playlist.length > 0 ? '60px' : '';
	   		this.$refs.recommend.style.bottom = bottom;
	   		this.$refs.scroll.refresh();
	   		},
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code === ERR_OK){
						this.recommends = res.data.slider;
					}
				})
			},
			_getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            
            this.discList = res.data.list
          }
        })
     },
     loadImage(){
     	if(!this.checkLoaded){
     		this.$refs.scroll.refresh();
     		this.checkLoaded = true;
     	}
     		
		 },
		 selectItem(item){
			 	this.$router.push({
					 path:`/recommend/${item.dissid}`
				 })
				 this.setDisc(item)
		 },
		 ...mapMutations({
			 setDisc:'SET_DISC'
		 })
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
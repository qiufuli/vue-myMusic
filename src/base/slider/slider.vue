<template>
<div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
    	<!--slot 是Vue内置的组件 在子组件中显示dom-->
    	<!--slot ：假如父组件需要在子组件内放一些DOM，那么这些DOM是显示、不显示、在哪个地方显示、如何显示，就是slot分发负责的活。-->
      <slot>
      </slot>
    </div>
    <div class="dots">

    </div>
</div>
</template>

<script>
	import {addClass} from '@/common/js/dom'
	import BScroll from 'better-scroll'
	export default{
		props:{
			loop:{
				type:Boolean,
				default:true
			},
			autoPlay:{
				type:Boolean,
				default:true
			},
			interval:{
				type:Number,
				default:4000
			}
		},
		mounted(){
			setTimeout(()=>{
				this._setSliderWidth();
				this._initSlide();
			},20)
		},
		methods:{
		      _setSliderWidth() {
		        this.children = this.$refs.sliderGroup.children
		        
		        let width = 0
		        //父元素的宽度
		        let sliderWidth = this.$refs.slider.clientWidth
		        
		        for (let i = 0; i < this.children.length; i++) {
		          let child = this.children[i]
		          //对列表加上样式 自己封装的addclass
		          addClass(child, 'slider-item')
				//给child设置好宽度
		          child.style.width = sliderWidth + 'px'
		        //获取全部的宽度 给子元素
		          width += sliderWidth
		        }
		        console.log(width)
		        // 循环切换的话 需要左右2个空白宽度来实现无缝轮播
		        if (this.loop) {
		          width += 2 * sliderWidth
		        }
		        
		        this.$refs.sliderGroup.style.width = width + 'px'
		      },
			_initSlide(){
		        this.slider = new BScroll(this.$refs.slider, {
		          scrollX: true,
		          scrollY: false,
		          momentum: false,
		          snap: true,
		          snapLoop: this.loop,
		          snapThreshold: 0.3,
		          snapSpeed: 400
		        })
			}
		}
	}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      	 @touchstart.prevent="progressTouchStart"
      	 @touchmove.prevent="progressTouchMove"
      	 @touchend="progressTouchEnd"
      	 
      	 >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
	import {prefixStyle} from '@/common/js/dom'
	const transform = prefixStyle('transform')
	const progressBtnWidth = 16
	export default{
		props:{
			percent:{
				type:Number,
				default:0
			}
		},
		watch:{
			percent(newPercent){
				// touchmove的时候 不要与这个冲突
				if(newPercent >= 0 &&  !this.touch.initiated){
					//给黄条加效果
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
					const offsetWidth = newPercent * barWidth;
					this._offset(offsetWidth);
					
				}
			}
		},
		created(){
			this.touch = {}
		},
		methods:{
			progressTouchStart(e){
				this.touch.initiated = true;
				this.touch.startX = e.touches[0].pageX;
				//记录下点击的时候 按钮已经偏移了多少
				this.touch.left = this.$refs.progress.clientWidth;
				
			},
			progressTouchMove(e){
				//如果没有经过start就直接move的话 就给return
				if(!this.touch.initiated){
					return
				}
				//滑动的X轴减去初始化的值
				const deltaX = e.touches[0].pageX - this.touch.startX;
				const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
				this._offset(offsetWidth)
			},
			progressTouchEnd(){
				this.touch.initiated = false;
				//滑动到多少 就让小球到多少 还需要一个事件
				this._triggerPercent()
			},
			_offset(offsetWidth){
				this.$refs.progress.style.width = `${offsetWidth}px`;
					//给小球加效果
				this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`;
			},
			_triggerPercent(){
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
				// 现在滑动完之后黄条的位置 /barWidth 就是占的百分比
				const percent = this.$refs.progress.clientWidth / barWidth;
				//派发给父组件 因为是在父组件中操作的
				this.$emit('percentChange',percent);
			},
			progressClick(e){
				//e 事件里有很多参数调用 offset是对当前的偏移了 client是对外边的偏偏移了
//				console.log('e.offsetX',e.offsetX)
				
				this._offset(e.offsetX);
				this._triggerPercent();
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
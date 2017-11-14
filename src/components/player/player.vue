<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image" alt="" />
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" 
					@touchstart.prevent="middleTouchStart"
					 @touchmove.prevent="middleTouchMove"
					  @touchend="middleTouchEnd"
					>
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdCls">
								<img class="image" :src="currentSong.image" alt="" />
							</div>	
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">
								{{playingLyric}}
							</div>
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
			              <div v-if="currentLyric">
			                <p ref="lyricLine"
			                   class="text" 
			                   :class="{'current':currentLineNum === index}"
			                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
			              </div>
			            </div>
					</scroll>
				</div>
				
				<div class="bottom">
					<div class="dot-wrapper">
			            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
			            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
		          	</div>
				  	<div class="progress-wrapper">
			            <span class="time time-l">{{format(currentTime)}}</span>
			            <div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
			            </div>
			            <span class="time time-r">{{format(currentSong.duration)}}</span>
		          	</div>
					<div class="operators">
						<div class="icon i-left">
							<!--播放模式-->
							<i :class="iconMode" @click="changeMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i @click="prev" class="icon-prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<!--上一曲 下一曲  主要是改变currentIndex的索引-->
						<div class="icon i-right" :class="disableCls">
							<i @click="next" class="icon-next"></i>
						</div>
			<div class="icon i-right">
							<i class="icon icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon" >
					<img :class="cdCls" width="40" height="40" :src="currentSong.image" alt="" />
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<progress-circle :radius="32" :percent="percent">
						<i @click.stop.prevent="togglePlaying" class="icon-mini" :class="miniIcon"></i>
					</progress-circle>

				</div>
				<div class="control">
					<i class="icon-playlist"></i>
				</div>
				
			</div>			
		</transition>
		<!--歌曲准备好的时候会有个canplay事件-->
		<audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
	</div>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex'
	import animations from 'create-keyframe-animation'
	import {prefixStyle} from '@/common/js/dom'
	import ProgressBar  from '@/base/progress-bar/progress-bar'
	import ProgressCircle from '@/base/progress-circle/progress-circle'
	import {playMode} from '@/common/js/config'
	import {shuffle} from '@/common/js/util'
	import Scroll from '@/base/scroll/scroll'
	//对歌词进行处理
	import Lyric from 'lyric-parser'
	
	const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')
	export default{
		components:{
			ProgressBar,
			ProgressCircle,
			Scroll
		},
		data(){
			return{
				songReady:false,
				currentTime:0,
				currentLyric:null,
				currentLineNum:0,
				currentShow:'cd',
				playingLyric:''
			}
		},
		computed:{
			playIcon(){
				return this.playing?'icon-pause' :'icon-play'
			},
			miniIcon(){
				return this.playing?'icon-pause-mini' :'icon-play-mini'
			},
			cdCls(){
				return this.playing?'play' :'play pause'
			},
			disableCls(){
				return this.songReady?'':'disable'
			},
			percent(){
				return this.currentTime / this.currentSong.duration
			},
			//模式样式
			iconMode(){
				return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
			},
			//...mapGetters可以对拿到数据 但不能对其进行更改 要更改的话 要在mapMutations里
			...mapGetters([
				'fullScreen',
				'playlist',
				'currentSong',
				'playing',
				'currentIndex',
				//播放模式	
				'mode',
				//获取原始列表
				'sequenceList'
			])
		},
		created(){
			this.touch = {}
		},
		methods:{
			...mapMutations({
        		setFullScreen: 'SET_FULL_SCREEN',
        		setPlayingState:'SET_PLAYING_STATE',
        		setCurrentIndex:'SET_CURRENT_INDEX',
        		setPlayMode:'SET_PLAY_MODE',
        		setPlayList:'SET_PLAYLIST'
      		}),
			// 播放器的窗口 打开 收回
			back(){
				//直接调用mapGetters里的不好使 要从mapMutations修改才行 映射一个方法
				this.setFullScreen(false);
			},
			//让小窗口显示
			open(){
				this.setFullScreen(true);
			},
			//vue transition有几个钩子函数 对动操作
		    enter(el, done) {
		        const {x, y, scale} = this._getPosAndScale()
		
		        let animation = {
		          0: {
		            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
		          },
		          60: {
		            transform: `translate3d(0,0,0) scale(1.1)`
		          },
		          100: {
		            transform: `translate3d(0,0,0) scale(1)`
		          }
		        }
		
		        animations.registerAnimation({
		          name: 'move',
		          animation,
		          presets: {
		            duration: 400,
		            easing: 'linear'
		          }
		        })
		
		        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
		      },
		    afterEnter() {
		        animations.unregisterAnimation('move')
		        this.$refs.cdWrapper.style.animation = ''
		      },
		    leave(el, done) {
		        this.$refs.cdWrapper.style.transition = 'all 0.4s'
		        const {x, y, scale} = this._getPosAndScale()
		        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
		        this.$refs.cdWrapper.addEventListener('transitionend', done)
		      },
		    afterLeave() {
		        this.$refs.cdWrapper.style.transition = ''
		        this.$refs.cdWrapper.style[transform] = ''
		      },
			//获取动画的位置 和缩放的尺寸
			_getPosAndScale(){
				const targetWidth = 40;
				const paddingLeft = 40;
				const paddingBottom = 30;
				const paddingTop = 80;
				const width = window.innerWidth * 0.8;
				const scale = targetWidth/width;
				const x = -(window.innerWidth/2 -paddingLeft);
				const y = window.innerHeight - paddingTop - width/2 - paddingBottom ;
				return{
					x,
					y,
					scale
				}
			},
			//暂停/播放
			togglePlaying(){
				if(!this.songReady){
					return
				}
				this.setPlayingState(!this.playing);
				if(this.currentLyric){
					this.currentLyric.togglePlay();
				}
			},
			//下一曲
			next(){
				if(!this.songReady){
					return
				}
				if(this.playlist.length === 1){
					this.loop();
				}else{
					let index = this.currentIndex + 1;
					if(index === this.playlist.length){
						index = 0;
					}
					this.setCurrentIndex(index);
					//解决切换时 的播放暂停
					if(!this.playing){
						this.togglePlaying()
					}
				}
				this.songReady = false;
			},
			//上一曲
			prev(){
				if(!this.songReady){
					return
				}
				if(this.playlist.length === 1){
					this.loop();
				}else{
					let index = this.currentIndex - 1;
					if(index === -1){
						index = this.playlist.length - 1;
					}
					this.setCurrentIndex(index)
					//解决切换时 的播放暂停
					if(!this.playing){
						this.togglePlaying()
					}
				}
				this.songReady = false;
			},
			//歌曲准备好后 会自动触发该事件
			ready(){
				this.songReady = true
			},
			// 如果歌曲发生错误的话 songready为false 那么点击下一曲就不会执行了 
			// error就是为了确保在发生错误的时候能保证功能正常运行
			error(){
				this.songReady = true;
			},
			//audio自带的 时间事件
			updateTime(e){
				//标识audio当前播放的时间 audio自带的currenttime的属性
				this.currentTime = e.target.currentTime;
			},
			//对时间进行处理
			format(interval){
				// 或0 代表对正数的向下取整 相当于 Floor
				interval = interval | 0;
				// 转化成分钟
				const minute = interval / 60 | 0 ;
				const second = this._pad(interval % 60);
				return `${minute}:${second}`
			},
		//分秒补零
			_pad(num,n=2){
				// 先把数字转成字符串
				let len = num.toString().length;
				while(len < n){
					num = '0' + num;
					len++
				}
				return num;
			},
			//父子组件的数据传递
			onProgressBarChange(percent){
				//设置
				 const currentTime = this.currentSong.duration * percent
				this.$refs.audio.currentTime = currentTime;
				if(!this.playing){
					this.togglePlaying();
				}
				console.log(this.$refs.audio.currentTime)
				if(this.currentLyric){
					this.currentLyric.seek(currentTime * 1000)
				}
			},
			//改变模式
			changeMode(){
				//用取余数的方式 来实现循环 点击 1 2 0 余数只能会是这些
				const mode = (this.mode + 1) % 3;
				this.setPlayMode(mode);
				//实现功能 
				let list = null;
				if(mode === playMode.random){
					//要一个被打乱的数组
					list = shuffle(this.sequenceList)
				}else{
					list = this.sequenceList;
				}
				this.resetCurrentIndex(list);
				this.setPlayList(list)
			},
			resetCurrentIndex(list){
				let index = list.findIndex((item)=>{
					return item.id === this.currentSong.id;
				})
				this.setCurrentIndex(index);
			},
			end(){
				if(this.mode === playMode.loop){
					this.loop()
				}else{
					this.next()	
				}
			},
			//单曲循环 就可以 把当前的播放时间切换成0就可以了 没必要改变播放列表
			loop(){
				this.$refs.audio.currentTime = 0;
				this.$refs.audio.play();
				if(this.currentLyric){
					this.currentLyric.seek(0);
				}
			},
			getLyric(){
				this.currentSong.getLyric().then((lyric)=>{
					this.currentLyric = new Lyric(lyric,this.handleLyric)
					if(this.playing){
						this.currentLyric.play();
					}
					console.log(this.currentLyric)
				}).catch(()=>{
					this.currentLyric = null;
					this.playingLyric = '';
					this.currentLineNum = 0;
				})
			},
			handleLyric({lineNum,txt}){
				this.currentLineNum = lineNum;
				if(lineNum > 5){
					//滚动到中间
					let lineEl = this.$refs.lyricLine[lineNum - 5]
					this.$refs.lyricList.scrollToElement(lineEl,1000)
				}else{
					this.$refs.lyricList.scrollTo(0, 0, 1000);
				}
				this.playingLyric = txt
			},
			middleTouchStart(e){
				this.touch.initiated = true;
				const touch = e.touches[0];
				this.touch.startX = touch.pageX;
				this.touch.startY = touch.pageY;
			},
			middleTouchMove(e){
		        if (!this.touch.initiated) {
		          return
		        }
		        const touch = e.touches[0]
		        const deltaX = touch.pageX - this.touch.startX
		        const deltaY = touch.pageY - this.touch.startY
		        if (Math.abs(deltaY) > Math.abs(deltaX)) {
		          return
		        }
		        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
		        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
		        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
		        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
				this.$refs.lyricList.$el.style[transitionDuration] = 0;
				this.$refs.middleL.style.opacity = 1 - this.touch.percent
        		this.$refs.middleL.style[transitionDuration] = 0
			},
			middleTouchEnd(){
				let offsetWidth
        		let opacity
				if(this.currentShow === 'cd'){
					 if (this.touch.percent > 0.1) {
					 	offsetWidth = -window.innerWidth;
					 	opacity = 0;
					 	this.currentShow = 'lyric';
					 }else{
					 	offsetWidth = 0;
					 	opacity = 1;
					 }
				}else{
					if (this.touch.percent < 0.9) {
			            offsetWidth = 0
			            this.currentShow = 'cd'
			            opacity = 1
			          } else {
			            offsetWidth = -window.innerWidth
			            opacity = 0
			        }
				}
		        const time = 300
		        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
		        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
		        this.$refs.middleL.style.opacity = opacity
		        this.$refs.middleL.style[transitionDuration] = `${time}ms`
		        this.touch.initiated = false
			}
		},
		watch:{
			// 监听currentsong的变化 是否播放
			currentSong(newSong,oldSong){
				//点击播放模式的时候 只是模式切换 原歌曲id不变
				if(newSong.id === oldSong.id){
					return
				}
				if(this.currentLyric){
					this.currentLyric.stop();
				}
				setTimeout(()=>{
					this.getLyric()
					this.$refs.audio.play();
				},1000)

			},
			playing(newPlaying){
				const audio = this.$refs.audio;
				this.$nextTick(()=>{
					newPlaying?audio.play():audio.pause()
				})
			}
		}
	}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
       	.middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
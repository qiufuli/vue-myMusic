<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import {createSong} from 'common/js/song'

export default{
    components:{
       MusicList 
    },
    data(){
        return{
            songs:[]
        }
    },
    computed:{
        title(){
            return this.disc.dissname;
        },
        bgImage(){
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ])
    },
    created(){
        this._getSongList()
    },
    methods:{
        _getSongList(){
            getSongList(this.disc.dissid).then((res)=>{
                if(res.code === ERR_OK){
                    console.log(res.cdlist[0].songlist)
                   this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                }else{
                    console.log(res)
                    this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                    console.log(this.songs)
                }
            }).catch((e)=>{
                // console.log(e)
            })
        },
        _normalizeSongs(list){
            let ret = [];
            list.forEach((musicData)=>{
                if(musicData.songid && musicData.albumid){
                    ret.push(createSong(musicData));
                }
            })
            return ret
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
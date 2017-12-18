// 定义修改的操作
//这是一种 关系形势的引用 直接用
import * as types from './mutation-types'

const matutaions = {
	//这是固定写法  [types.SET_SINGER] == SET_SINGER（state,参数）{}
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  //播放器参数操作
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state,disc){
    state.disc = disc
  },
  [types.SET_TOP_LIST](state,topList){
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHistory = history
  }
}
export default matutaions
// 定义修改的操作
import * as types from './mutation-types'

const matutaions = {
	//这是固定写法
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}
export default matutaions
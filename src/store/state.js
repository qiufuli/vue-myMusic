
import {playMode} from '@/common/js/config'
// 所有的状态都放在这里 单一状态树
const state = {
	singer:{},
	//播放器参数
	//暂停播放
	playing:false,
	//全屏
	fullScreen:false,
	//播放列表
	playlist:[],
	//原始列表
	sequenceList:[],
	//播放模式
	mode:playMode.sequence,
	//当前播放的索引
	currentIndex:-1,
	
}
export default state

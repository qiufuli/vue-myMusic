import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import {saveSearch,deleteSearch} from '@/common/js/cache'

function findIndex(list,song){
	return list.findIndex((item)=>{
		return item.id === song.id
	})
}
export const selectPlay = function({commit,state},{list,index}){
	commit(types.SET_SEQUENCE_LIST,list);
	if(state.mode === playMode.random){
		let randomList = shuffle(list);
		commit(types.SET_PLAYLIST,randomList);
		index = findIndex(randomList,list[index]);
	}else{
		commit(types.SET_PLAYLIST,list);
	}

	commit(types.SET_CURRENT_INDEX,index);
	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYING_STATE,true);
	
}
export const randomPlay = function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random);
	commit(types.SET_SEQUENCE_LIST,list);
	let randomList = shuffle(list);
	commit(types.SET_PLAYLIST,randomList);
	commit(types.SET_CURRENT_INDEX,0);
	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYING_STATE,true);
}
export const insertSong = function({commit,state},song){
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	// 记录下当前歌曲
	let currentSong = playlist[currentIndex]; // 当前歌曲
	// 查找当前列表中是否有要插入的歌曲 并返回其索引
	let fpIndex = findIndex(playlist,song);
	// 因为是插入歌曲，所以索引要+1 
	currentIndex++;
	// 插入这首歌
	playlist.splice(currentIndex,0,song);
// 	判断 fpIndex 如果是-1 就是没有 
	if(fpIndex > -1){
		// 如果当前插入的序号大于列表中的序号 
		//  比如 [1,2,3,4]  dao [1,2,3,4,2]
		if(currentIndex > fpIndex){
			playlist.splice(fpIndex,1);
			currentIndex--;
		}else{
			//  比如 [1,3,4,2]  dao [1,2,3,4,2]
			playlist.splice(fpIndex + 1,1);
		}
	}

	let currentSIndex = findIndex(sequenceList,currentSong) + 1;

	let fsIndex = findIndex(sequenceList,song);

	sequenceList.splice(currentSIndex,0,song);

	// 	判断 fpIndex 如果是-1 就是没有 
	if(fsIndex > -1){
		// 如果当前插入的序号大于列表中的序号 
		//  比如 [1,2,3,4]  dao [1,2,3,4,2]
		if(currentSIndex > fsIndex){
			playlist.splice(fsIndex,1);
			currentSIndex--;
		}else{
			//  比如 [1,3,4,2]  dao [1,2,3,4,2]
			playlist.splice(fsIndex + 1,1);
		}
	}
	commit(types.SET_PLAYLIST,playlist);
	commit(types.SET_SEQUENCE_LIST,sequenceList);
	commit(types.SET_CURRENT_INDEX,currentIndex);

	commit(types.SET_FULL_SCREEN,true);
	commit(types.SET_PLAYING_STATE,true);
}
//  历史记录
export const saveSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}
// 删除历史记录
export const deleteSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}
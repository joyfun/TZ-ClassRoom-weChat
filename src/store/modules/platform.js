import types from '../types';
import { transWxToPromise } from '@/utils';
import navigateTo from '@/utils/navigator';

let { setNetworkType } = types;

const info = wx.getSystemInfoSync();
let { windowWidth, system, pixelRatio } = info;
const state = {
	networkType: '',
	availWidth: windowWidth,
	ratio: pixelRatio,
	imgPostfix: `?x-oss-process=image/format,${~system.toLowerCase().indexOf('android') ? 'webp' : 'jpg'}/resize,w_`,
};

const mutations = {
	[setNetworkType]: (state, type) => {
		state.networkType = type;
	},
};

const actions = {
	WatchNetworkChange({ state, commit }) {
		wx.onNetworkStatusChange(res => {
			console.log('store里面的网络状态切换', res);
			let { networkType } = res;
			commit(setNetworkType, networkType);
			if (networkType === 'none') {
				navigateTo('network');
			}
		});
	},
	GetNetworkType({ commit }) {
		transWxToPromise('getNetworkType').then(res => {
			commit(setNetworkType, res.networkType);
		});
	},
};

export default {
	state,
	mutations,
	actions,
};

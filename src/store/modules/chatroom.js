import types from '../types';
import { Chatroom } from '@/vendors/NIM_Web_SDK_v5.0.0';
import { ChatRoom } from '@/lib/TZ-NIM-SDK';

let { setRoom } = types;

const state = {
	roomInstance: null,
};

const mutations = {
	[setRoom]: (state, roomInstance) => {
		state.roomInstance = roomInstance;
	},
};

const actions = {
	InitRoom({ state, commit, getters }, { config = {}, callbacks }) {
		let { roomInstance } = state;
		let { sdkConfig, userInfo = {} } = getters;
		if (roomInstance) return Promise.resolve();
		console.log('没有初始化，要初始化聊天室');
		roomInstance = new ChatRoom(Chatroom, callbacks);
		commit(setRoom, roomInstance);
		return roomInstance.init({
			...sdkConfig,
			...config,
			chatroomEnterCustom: JSON.stringify({
				headIcon: userInfo.headIcon,
			}),
		});
	},
	DisconnectRoom({ state, commit, getters }) {
		if (state.roomInstance) {
			state.roomInstance.disconnect();
			commit(setRoom, null);
		}
	},
};

export default {
	state,
	mutations,
	actions,
};

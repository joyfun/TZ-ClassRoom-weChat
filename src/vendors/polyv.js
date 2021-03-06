var polyvVodPlayer = {
	version: 20170930,
	jsonHost: 'https://router.polyv.net/secure/',
	isPreviewMode: false,
	videoId: '',
	getVideo: function(e, t, r, i) {
		this.loadJson(e, t, r, i);
	},
	getPreviewVideo: function(e, t, r, i) {
		this.isPreviewMode = true;
		this.loadJson(e, t, r, i);
	},
	loadJson: function(e, t, r, i) {
		var o = '20170807';
		var s = { version: o, timeoutflow: false, outflow: false };
		if (e == '') {
			s = { version: o, error: 'vid不能为空' };
			t(s);
			return;
		}
		var a = this;
		a.videoId = e;
		a.ts = r;
		a.sign = i;
		wx.request({
			url: a.jsonHost + e + '.js',
			method: 'GET',
			success: function(e) {
				if (e.data.timeoutflow == 'true') {
					s.timeoutflow = true;
				} else if (e.data.outflow == 'true') {
					s.outflow = true;
				} else {
					s.poster = e.data.first_image;
					s.title = e.data.title;
					s.teaser_url = e.data.teaser_url;
					s.catatree = e.data.catatree;
					s.adMatter = e.data.adMatter;
					s.ratio = e.data.ratio;
					s.poster = a.proxy(s.poster);
					s.teaser_url = a.proxy(s.teaser_url);
					s.adMatter = a.proxy(s.adMatter, 'matterurl');
					if (e.data.seed == 1) {
						s.src = a.proxy(e.data.hls);
					} else {
						s.src = a.proxy(e.data.mp4);
					}
				}
				t(s);
			},
			fail: function(e) {
				s = { error: '视频数据获取失败' };
				t(s);
			},
		});
	},
	proxy: function(e, t) {
		var r = this;
		if (typeof e == 'undefined' || e.length == 0) {
			return '';
		}
		if (typeof e == 'string') {
			e = this.resetUrl(e);
			return this.proxyUrl(e);
		} else {
			if (arguments[1]) {
				for (var i = 0, o = e.length; i < o; i++) {
					for (var s in e[i]) {
						if (s == t) {
							e[i][s] = this.proxyUrl(e[i][s]);
						}
					}
				}
			} else {
				for (var i = 0, o = e.length; i < o; i++) {
					if (this.isPreviewMode) {
						var a = this.videoId.substring(0, 32);
						e[i] = e[i].replace(a, 'p_' + a);
					}
					if (r.ts && r.sign) {
						if (e[i].indexOf('?') > -1) {
							e[i] = e[i] + '&ts=' + r.ts + '&sign=' + r.sign;
						} else {
							e[i] = e[i] + '?ts=' + r.ts + '&sign=' + r.sign;
						}
					}
					e[i] = this.proxyUrl(e[i]);
				}
			}
			return e;
		}
		return '';
	},
	proxyUrl: function(e) {
		if (e == '') {
			return e;
		}
		e = e.replace(/.*?:\/\//g, '');
		return 'https://router.polyv.net/proxy/' + e;
	},
	resetUrl: function(e) {
		var t = this;
		if (this.isPreviewMode) {
			var r = this.videoId.substring(0, 32);
			e = e.replace(r, 'p_' + r);
		}
		if (t.ts && t.sign) {
			if (e.indexOf('?') > -1) {
				e = e + '&ts=' + t.ts + '&sign=' + t.sign;
			} else {
				e = e + '?ts=' + t.ts + '&sign=' + t.sign;
			}
		}
		return e;
	},
};
function getVideo(e, t, r, i) {
	polyvVodPlayer.getVideo(e, t, r, i);
}
function getPreviewVideo(e, t, r, i) {
	polyvVodPlayer.getPreviewVideo(e, t, r, i);
}
module.exports = { getVideo: getVideo, getPreviewVideo: getPreviewVideo };

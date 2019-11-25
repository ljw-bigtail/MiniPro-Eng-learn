// pages/songs/index.js
const app = getApp()
let music = wx.createInnerAudioContext()

let lrc = {},
    lrc_data = [],
    update_timer_interval = 1000,
    // TODO  社区里说是安卓在250ms | 500ms ,ios 在1000ms ,如果ios测试后的确与安卓不一致，需要根据系统做区分，建议值大100ms
    can_play = false,
    screenClose = 0;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        music_title: '',
        music_desc: '',
        music_state: true,
        musicPercent: 0,

        lrc_near: 0,
        lrc_now: 0,

        show: false, // 翻译弹窗
        word_example: null,
        infoList_example: null,
        mp3List_example: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const _this = this
        lrc_data = []
        // 播放音乐
        _this.setData({
            musicPercent: 0,
            music_state: true,
            lrc_near: 0,
            lrc_now: 0,
        })
        app.tools.request({
            url: 'media/' + options.id,
            success: function(r5) {
                _this.setData({
                    music_title: r5.data.content.realName,
                    music_desc: r5.data.content.updateDate,
                    music_src: r5.data.content.filePath.replace("/opt/data/", app.globalData.baseUrl),
                })
                _this.setSong()
            }
        });
        // 歌词
        app.tools.request({
            url: 'song/lyric?id=' + options.fdid,
            method: "POST",
            success: function(r5) {
                if (r5.data.content && r5.data.content.length > 0) {
                    r5.data.content.map((e, index) => {
                        for (var i in e) {
                            lrc[i] = e[i]
                            lrc_data.push({
                                data: e[i].split(' '),
                                time: i - 0
                            })
                        }
                    })
                    _this.setData({
                        lrc_data: lrc_data
                    })
                } else {
                    _this.setData({
                        lrc_data: [{
                            data: [
                                ['暂无歌词···']
                            ],
                            time: 1000
                        }]
                    })
                }
            }
        });
    },
    setSong: function() {
        const _this = this
        if (wx.setInnerAudioOption) {
            wx.setInnerAudioOption({
                obeyMuteSwitch: false,
            })
        } else {
            music.obeyMuteSwitch = false;
        }
        // 音频源
        music.src = encodeURI(_this.data.music_src)
        // 循环播放
        music.loop = true
        music.onEnded(() => {
            _this.setData({
                musicPercent: 0,
            })
        })
        music.onTimeUpdate(() => {
            let lrc_now_time = Math.ceil(music.currentTime * 1000),
                lrc_now = 0,
                lrc_near = 0
            if (_this.data.lrc_data[0].data[0] != "暂无歌词···"){
                _this.data.lrc_data.map(function (item, index) {
                    if (lrc_now_time > item.time && lrc_now_time < lrc_data[index + 1].time) {
                        if (index > 3) {
                            lrc_near = _this.data.lrc_data[index - 3].time
                        }
                        lrc_now = item.time
                    }
                })
            }
            if (lrc_near != _this.data.lrc_near) {
                _this.setData({
                    lrc_near: lrc_near, // 歌词
                })
            }
            _this.setData({
                musicPercent: Math.ceil(music.currentTime / music.duration * 100), // 进度条
                lrc_now: lrc_now, // 歌词
            })
        })
        music.onCanplay((res) => {
            can_play = true
            // 自动播放
            // this.clickPlay()
        })
        music.onWaiting((res) => {
            // app.tools.toast('网络较慢，正在加载···')
        })
        music.onError((res) => {
            console.log(res)
        })
    },
    clickPlay: function() {
        // 播放与暂停
        if (!can_play) {
            app.tools.toast('正在加载···')
            return
        }
        var state = !this.data.music_state
        this.setData({
            music_state: state
        })
        if (state) {
            // 暂停
            music.pause();
        } else {
            // 播放
            music.play();
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (screenClose == 1) {
            // this.clickPlay()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        screenClose = 1
        this.setData({
            music_state: true,
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 初始化
        music.stop();
        music.destroy();
    },

    //点击例句中的单词，显示单词
    readExampleWord: function(e) {
        let that = this;
        let w = e.currentTarget.dataset.i.trim();
        if (w && w.indexOf(".") != -1) {
            w = w.substring(0, w.indexOf("."));
        }
        if (w && w.indexOf(",") != -1) {
            w = w.substring(0, w.indexOf(","));
        }
        if (w) {
            app.tools.request({
                url: 'word/iciba?word=' + w.toLowerCase(),
                method: "POST",
                success: function(r9) {
                    let r = r9.data.content.result;
                    let _infoList = r.ponses;
                    let _mp3List = r.prons;
                    if (_infoList.length == 0 && _mp3List.length == 0) {
                        app.tools.toast("当前单词可能是专用名字，无详解···")
                        return
                    }
                    that.setData({
                        word_example: w,
                        infoList_example: _infoList,
                        mp3List_example: _mp3List,
                        show: true // 打开弹窗
                    });
                }
            });
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
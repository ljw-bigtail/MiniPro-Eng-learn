// pages/songs/index.js
const app = getApp()
const music = wx.createInnerAudioContext()
let lrc = {},
    update_timer_interval = 500,
// TODO  社区里说是安卓在250ms | 500ms ,ios 在1000ms ,如果ios测试后的确与安卓不一致，需要根据系统做区分，建议值大100ms
  can_play = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    music_title: 'moon river',
    music_desc: '描述信息',
    music_lrc: '暂无歌词···',
    music_state: true,
    musicPercent: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    // 初始化
    this.setData({
      musicPercent: 0,
      music_lrc: '暂无歌词···',
      music_state: true,
    })
    // 播放音乐
    app.tools.request({
      url: 'media/' + options.id,
      success: function (r5) {
        let realName = r5.data.content.realName;
        _this.setData({
          music_title: r5.data.content.realName,
          music_desc: r5.data.content.updateDate,
        })
        _this.setSong(r5.data.content.filePath.replace("/opt/data/", app.globalData.baseUrl))
        // 自动播放
        // _this.clickPlay()
      }
    });
    // 歌词
    app.tools.request({
      url: 'song/lyric?id=' + options.fdid,
      method: "POST",
      success: function (r5) {
        if (r5.data.content){
          let index_1_time
          r5.data.content.map((e,index)=>{
            for(var i in e){
              if (index == 0) {
                index_1_time = i
              }
              lrc[i] = e[i]
            }
          })
          _this.setData({
            music_lrc: lrc[index_1_time],
          })
        }
      }
    });
  },
  setSong: function(src){
    const _this = this
    // 音频源
    music.src = src
    // 循环播放
    music.loop = true
    music.onEnded(()=>{
      console.log('end')
      _this.setData({
        musicPercent: 0,
      })
    })
    music.onTimeUpdate(()=>{
      // 进度条
      _this.setData({
        musicPercent: Math.floor(music.currentTime / music.duration * 100)
      })
      // 歌词
      let lrc_timer = Math.floor(music.currentTime * 1000)
      for (var i in lrc) {
        if (i - lrc_timer < update_timer_interval && i - lrc_timer > 0) {
          _this.setData({
            music_lrc: lrc[i],
          })
          break;
        }
      }
    })
    music.onCanplay((res) => {
      can_play = true
      this.clickPlay()
    })
    music.onWaiting((res) => {
      app.tools.toast('网络较慢，正在加载···')
    })
  },
  play: function () {
    music.play();
  },
  //点击 停止
  stop: function () {
    music.pause();
  },
  clickPlay: function(){
    // 播放与暂停
    if(!can_play){
      app.tools.toast('正在加载···')
      return
    }
    var state = !this.data.music_state
    this.setData({ music_state: state })
    if (state){
      this.stop()
    }else{
      this.play()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.clickPlay()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clickPlay()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
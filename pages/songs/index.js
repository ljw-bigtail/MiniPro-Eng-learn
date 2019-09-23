// pages/songs/index.js
const app = getApp()
const music = wx.createInnerAudioContext()
let timer = null,
    time_now = 0,
    lrc = {}

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
    // 播放音乐
    app.tools.request({
      url: 'media/' + options.id,
      success: function (r5) {
        let realName = r5.data.content.realName;
        _this.setData({
          music_title: r5.data.content.realName,
          music_desc: r5.data.content.updateDate,
        })
        music.src = r5.data.content.filePath.replace("/opt/data/", app.globalData.baseUrl)
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
                index_1_time = Math.floor(i / 100)
              }
              lrc[Math.floor(i/100)] = e[i]
            }
          })
          _this.setData({
            music_lrc: lrc[index_1_time],
          })
        }
      }
    });
  },
  play: function () {
    const _this = this
    // 监听播放进度
    timer = setInterval(function () {
      time_now += .1
      _this.setData({
        musicPercent: music.duration ? (time_now / music.duration * 100 + '').split('.')[0] : 0
      })
      if (music.duration && time_now > music.duration) {
        _this.clickPlay()
      }
      let lrc_str = lrc[Math.floor(time_now * 10)]
      if (lrc_str){
        _this.setData({
          music_lrc: lrc_str,
        })
      }
    }, 100)

    music.play();
  },
  //点击 停止
  stop: function () {
    // 计时器
    clearInterval(timer)
   // 音乐 
    music.pause();
  },
  clickPlay: function(){
    // 播放与暂停
    var state = !this.data.music_state
    this.data.music_state = state
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
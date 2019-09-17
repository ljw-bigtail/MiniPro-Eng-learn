const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: null,  //单词
    infoList: null,  //含义
    mp3List: null,  //朗读
    exampleList: null,  //例句
  
    show: false, // 翻译弹窗
    word_example: null,
    infoList_example: null,
    mp3List_example: null,
  },
  dialogClose: function(){
    this.setData({
      show: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initWord(options.word.trim())
  },
  initWord: function (word) {
    const _this = this
    app.tools.request({
      url: 'word/iciba?word=' + word.replace(/\\ /gm, '%20'),
      method: "POST",
      success: function (r) {
        let data = r.data.content.result
        let sent = []
        if (data.sent && data.sent.length > 0) {
          //整理例句部分
          data.sent.map((e)=>{
            let _d = {
              orig_a: [],
              trans: e.trans
            }
            e.orig.split(' ').map((_e)=>{
              _d.orig_a.push(_e + ' ')
            })
            sent.push(_d)
          })
        } else {
          sent = []
        }
        _this.setData({
          word: word,
          infoList: data.ponses,
          mp3List: data.prons,
          exampleList: sent
        })
        console.log(_this.data)
      }
    });
  },
  // 读音
  startRead: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.mp3url;
    wx.playBackgroundAudio({
      dataUrl: url,
    });
  },
  //点击例句中的单词，显示单词
  readExampleWord: function (e) {
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
        success: function (r9) {
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
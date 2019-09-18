// pages/study/book.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_active: 0,
    readList: [],
    wordList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.globalData.bookInfo = {
    //   'grade': _this.data.gradeRadio,
    //   'bid': _this.data.textbookRadio,
    //   'chapter': _this.data.unitRadio
    // }
    this.initWord()
    this.initRead()
  },

  initWord: function () {
    const _this = this
    app.tools.request({
      url: 'word/getWithGBC?grade=' + app.globalData.bookInfo.grade + '&bid=' + app.globalData.bookInfo.bid + '&chapter=' + app.globalData.bookInfo.chapter,
      method: "POST",
      success: function (r3) {
        _this.setData({
          wordList: r3.data.content.result
        });
      }
    });
  },
  initRead: function(){
    const _this = this
    app.tools.request({
      url: 'artical/getWithGBC?grade=' + app.globalData.bookInfo.grade + '&type=QUESTION_TYPE_2',
      method: "POST",
      success: function (r3) {
        _this.setData({
          readList: r3.data.content.result
        });
      }
    });
  },
  openWords: function (e) {
    const _this = this
    // 去单词
    wx.navigateTo({
      url: '/pages/book/words?word=' + e.currentTarget.dataset.word
    });
  },
  openReads: function(e){
    // 去阅读
    wx.navigateTo({
      url: '/pages/book/reads?id=' + e.currentTarget.dataset.id
    });
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
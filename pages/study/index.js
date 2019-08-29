// pages/study/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    tab_active: 0,
    book: {
      grade: '一年级', // 年级
      textbook: '人教版（上）', // 教材
      unit: '第一单元' // 单元
    }
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
  openBookSet: function(){
    wx.navigateTo({
      url: '/pages/study/book',
    })
  },
  openBook: function () {
    wx.navigateTo({
      url: '/pages/study/set',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
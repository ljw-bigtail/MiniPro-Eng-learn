// pages/news/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    // author: '',
    date: '',
    richText: '',
    htmlText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    app.tools.request({
      url: 'news/' + options.id,
      success: function (r) {
        let d = r.data.content;
        _this.setData({
          date: d.createDate,
          title: d.title,
          richText: d.content.replace(/<p/g, '<p style="line-height: 28px; font-size: 16px; padding-bottom: 20px;"').replace(/<img/g, '<img style="max-width: 100%;padding-bottom: 20px;"').replace(/<ul/g, '<ul style="list-style: none;padding-left:0"').replace(/<li/g, '<li style="line-height: 28px; font-size: 16px; padding-bottom: 20px;"'),
        })
      } 
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
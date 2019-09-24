// pages/user/family.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: '0',
    activeName: '0',
    tree: [],
    username: app.globalData.userInfo,
  },
  onChange(event) {
    console.log(event.detail)
    this.setData({
      activeName: event.detail
    });
  },
  onChange1(event) {
    console.log(event.detail)
    this.setData({
      activeName: event.detail
    });
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    const _this = this
    var uid = app.globalData.userInfo.userid;
    app.tools.request({
      url: 'user/getChildren?isTree=true&pid=' + uid,
      success: function (r5) {
        if (r5.data.content && r5.data.content.length > 0){
          console.log(r5.data.content)
          _this.setData({
            tree: r5.data.content
          })
        }
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
// pages/user/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    loginShow: true,

    user_img: 'http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg',
    user_name: '请登录',
    active: 2,
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
  openUrl: function (event){
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: event.currentTarget.dataset.url,
      })
    }else{
      wx.showToast({
        title: '请登陆！',
        icon: 'none'
      })
    }
  },
  bindGetUserInfo: function () {
    app.tools.isLogin(function () {
      console.log(1)
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo){
      this.setData({ 
        user_img: app.globalData.userInfo.avatarUrl,
        user_name: app.globalData.userInfo.nickName,
        loginShow: false
      })
    }
  },

  login: function(){
    const _this = this
    app.tools.isLogin({
      success: function (res) {
        app.globalData.userInfo = res.r1;
        _this.setData({ 
          user_img: app.globalData.userInfo.avatarUrl,
          user_name: app.globalData.userInfo.nickName,
          loginShow: false
        })
        app.globalData.sessionid = res.r3.content.sessionid;
        app.globalData.userInfo.userid = res.r3.content.result.id;
        app.globalData.userInfo.unionid = res.r3.content.result.unionid;
      },
      fail: function (res) {
        wx.showToast({
          title: '请点击登陆按钮后操作！',
          icon: 'none'
        })
      }
    })
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
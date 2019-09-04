// pages/user/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    user_img: 'http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg',
    user_name: '测试',
    active: 2,
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
  openUrl: function (event){
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })
  },
  login: function () {
    wx.login({
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  logout: function(){

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    
    app.globalData.userInfo = wx.getStorageSync('userInfo') || {}
    if (app.globalData.userInfo && app.globalData.userInfo.nickName && app.globalData.userInfo.avatarUrl){
      _this.setData({ user_img: app.globalData.userInfo.avatarUrl })
      _this.setData({ user_name: app.globalData.userInfo.nickName })
      _this.setData({ isLogin: true })
    }else{
      wx.getSetting({
        success: res => {
          let state = res.authSetting['scope.userInfo']
          if (state) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo
                wx.setStorageSync('userInfo', res.userInfo)
                _this.setData({ user_img: app.globalData.userInfo.avatarUrl })
                _this.setData({ user_name: app.globalData.userInfo.nickName })
              },
              complete: ()=>{
                _this.setData({ isLogin: state})
              }
            })
          }
        }
      })
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
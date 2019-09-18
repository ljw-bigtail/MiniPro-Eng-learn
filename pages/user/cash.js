// pages/user/cash.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMoney: 0, // 余额
    inComList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initWallet()
    this.initWalletRecords()
  },
  initWallet: function () {
    const _this = this
    app.tools.request({
      url: 'user/wallet',
      success: function (r1) {
        var cont = r1.data.content;
        if (cont.code == "S") {
          _this.setData({
            currentMoney: cont.result.balance
          })
        }
      }
    });
  },
  initWalletRecords: function() {
    const _this = this
    var uid = app.globalData.userInfo.userid;
    app.tools.request({
      url: 'user/walletRecords?id=' + uid,
      method: "POST",
      success: function (r1) {
        _this.setData({
          inComList: r1.data.content.result 
        })
      }
    });
  },
  cashIn: function(){
    
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
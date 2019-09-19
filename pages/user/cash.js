// pages/user/cash.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMoney: 0, // 余额
    inComList: [],

    show: false, // 翻译弹窗
  },
  dialogClose: function () {
    this.setData({
      show: false
    })
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
  openCashIn: function(){
    this.setData({
      show: true
    })
  },
  cashIn: function(e){
    var num = e.currentTarget.dataset.num
    var uid = app.globalData.userInfo.userid;
    app.tools.request({
      url: 'recharge/prepare?uid=' + uid + "&money=" + num,
      method: "POST",
      success: function (r1) {
        var r1_result = r1.data.content.result;
        if (r1.data.content.code == 'S') {
          app.tools.request({
            url: 'pay/createPayment?prepayId=' + r1_result.prepay_id,
            success: function (r2) {
              // 支付
              if (r2.data.content.code == 'S') {
                var result = r2.data.content.result;
                wx.requestPayment({
                  'timeStamp': result.timeStamp,
                  'nonceStr': result.nonceStr,
                  'package': result.package,
                  'signType': 'MD5',
                  'paySign': result.paySign,
                  'success': function (res) {
                    // 通知后台
                    app.tools.request({
                      url: 'recharge/complete?recordId=' + r1_result.recordId + "&beforeValue=" + r1_result.beforeValue,
                      success: function (r4) {
                        app.tools.toast('充值成功···')
                      },
                      'fail': function (res) {
                        app.tools.toast('支付失败，请联系客服···')
                      },
                    });
                  },
                  'fail': function (res) {
                    app.tools.toast('支付取消···')
                  },
                })
              }
            }
          });
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
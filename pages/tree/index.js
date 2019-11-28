// pages/tree/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeInputShow: true,
    code: "",
  },
  onChange: function (event){
    this.setData({
      code: event.detail,
    })
  },
  setCode: function(){
    let code = this.data.code.trim()
    const _this = this;
    if (!code || code == "" || code.length < 5) {
      app.tools.toast('邀请码必须填写，至少5位！')  
      return
    }
    app.tools.request({
      url: 'user/checkRefereeCode?referee=' + code,
      success: function (res) {
        if (res.data.content == true) {
          _this.setData({
            codeInputShow: false
          })
          app.tools.toast('设置成功···')
          _this.initTree()
        } else {
          app.tools.toast('邀请码不存在···')  
        }
      }
    });
  },
  initTree: function(){
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // TODO
    // 判断用户有没有填写验证码，然后去加载tree
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

    onShareAppMessage: function () {
        return {
            title: '英语邦',
            path: '/pages/index/index'
        }
    }
})
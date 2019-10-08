//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    erwm_img_src: ''
  },
  onLoad: function (e) {
    const _this = this
    app.tools.request({
      // 注意：下面的access_token值可以不可以直接复制使用，需要自己请求获取
      url: "user/myShare?id=" + app.globalData.userInfo.userid,
      method: "POST",
      success(res) {
        let imgPath = res.data.content.result;
        if (imgPath) {
          _this.setData({
            erwm_img_src: app.globalData.baseUrl + "user/" + imgPath
          });
        }
      }
    });

    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    const _this = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      imageUrl: _this.data.erwm_img_src,
      title: '分享我的英语邦',
      // path: '/pages/index/index?shareId=',
      path: '/pages/user/index?referee=' + app.globalData.userInfo.userid,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
})
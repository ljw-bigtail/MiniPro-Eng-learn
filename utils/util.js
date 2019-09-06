const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let tools = {
  baseUrl: "https://yyzzkt.com/",
  tabbarNavTo: function(index){
    switch(index){
      case 0: wx.reLaunch({ url: '/pages/index/index' }); break;
      case 1: wx.reLaunch({ url: '/pages/study/index' }); break;
      case 2: wx.reLaunch({ url: '/pages/user/index'}) ;break;
    }
  },
  toast: function(tit){
    wx.showToast({
      title: tit,
      icon: 'none',
      duration: 2000
    })
  },
  request: function(opt){
    const _this = this
    wx.request({
      url: _this.baseUrl + opt.url,
      data: opt.data,
      header: { 'Content-Type': 'application/json' },
      method: opt.method || 'GET',
      dataType: 'json',
      success: function(res){
        opt.success && opt.success(res)
      },
      fail: function (res) {
        _this.toast('系统发生异常')
        console.log(e)
      },
      complete: function (res){
        opt.complete && opt.complete(res)
      },
    })
  },
  isLogin: function(opt){
    const _this = this
    wx.getUserInfo({
      success: function (r1) {
        wx.login({
          success(r2) {
            // 服务端登录
            wx.showLoading({
              title: '正在登陆···'
            })
            _this.request({
              url: 'login',
              method: "POST",
              data: {
                "wxCode": r2.code,
                "loginType": "3",
                "referee": "1",
                "userName": r1.userInfo.nickName
              },
              success: function (r3) {
                if (r3 && r3.header && r3.header['Set-Cookie']) {
                  wx.setStorageSync('cookieKey', r3.header['Set-Cookie']);   //保存Cookie到Storage
                }
                opt.success && opt.success({
                  r1: r1.userInfo,
                  r3: r3.data,
                })
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          }
        });
      },
      fail: function(res){
        opt.fail && opt.fail(res)
      }
    });
  },
}

module.exports = {
  formatTime: formatTime,
  tools: tools
}

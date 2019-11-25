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
      header: {
        'Content-Type': 'application/json',
        'Cookie': wx.getStorageSync('cookieKey'),
        'ENG_WX_TOKEN': wx.getStorageSync('userId'),
      },
      method: opt.method || 'GET',
      dataType: 'json',
      success: function(res){
        opt.success && opt.success(res)
      },
      fail: function (res) {
        if (opt.fail){
          opt.fail(res)
        }else{
          _this.toast('系统发生异常，请联系客服')
        }
      },
      complete: function (res){
        opt.complete && opt.complete(res)
      },
    })
  },
  isLogin: function (opt, referee){
    const _this = this
    wx.getUserInfo({
      success: function (r1) {
        wx.login({
          success(r2) {
            // 服务端登录
            wx.showLoading({
              title: '正在登陆···'
            })
            // referee
            _this.request({
              url: 'login',
              method: "POST",
              data: {
                "wxCode": r2.code,
                "referee": referee || "10000",
              },
              success: function (r3) {
                if (r3 && r3.header && r3.header['Set-Cookie']) {
                  wx.setStorageSync('cookieKey', r3.header['Set-Cookie']);   //保存Cookie
                }
                wx.setStorageSync('userId', r3.data.content.result.id);   //保存userId
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
  goToLogin: function(){
    this.toast('请登陆！正在跳转···')
    setTimeout(function(){
      wx.redirectTo({
        url: '/pages/user/index',
      })
    }, 1500)
  },
  goToDeposit: function () {
    this.toast('学币不足，请先充值···')
    setTimeout(function () {
      // TODO 跳转到充值页
        wx.navigateTo({
          url: '/pages/user/cash',
        })
    }, 1000)
  },
}

// https://yyzzkt.com/tologin

let send = function(opt){
  wx.request({
    url: 'https://yyzzkt.com' + opt.url,
    data: opt.data,
    method: opt.method,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      opt.success && opt.success(res.data)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  tools: tools,
  send: send
}

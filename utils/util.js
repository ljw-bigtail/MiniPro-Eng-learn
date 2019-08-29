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
  tabbarNavTo: function(index){
    switch(index){
      case 0: wx.reLaunch({ url: '/pages/index/index' }); break;
      case 1: wx.reLaunch({ url: '/pages/study/index' }); break;
      case 2: wx.reLaunch({ url: '/pages/user/index'}) ;break;
    }
  },
}

module.exports = {
  formatTime: formatTime,
  tools: tools
}

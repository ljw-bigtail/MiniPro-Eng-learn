//app.js
import Tools from './utils/util.js'

App({
  onLaunch: function () {
    this.globalData.userInfo = wx.getStorageSync('userInfo')
  },
  tabbarNavTo: function(index){
    Tools.tools.tabbarNavTo(index)
  },
  globalData: {
    userInfo: null
  }
})
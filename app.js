//app.js
import Tools from './utils/util.js'

App({
  onLaunch: function () {
    
  },
  tabbarNavTo: function(index){
    Tools.tools.tabbarNavTo(index)
  },
  globalData: {
    userInfo: null
  }
})
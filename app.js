//app.js
import Tools from './utils/util.js'

App({
  tools: Tools.tools,
  onLaunch: function () {
    
  },
  tabbarNavTo: function(index){
    Tools.tools.tabbarNavTo(index)
  },
  globalData: {
    userInfo: null,
    baseUrl: Tools.tools.baseUrl,
    sessionid: null,
  }
})
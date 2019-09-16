//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    active: 0,
    bannerList: [],
    imgheights: 500,
    current: 0,
    imgwidth: 750,
    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: true,
    //选中点的颜色  
    indicatorColor: "rgba(255, 46, 99, .3)",
    indicatorColorActive: "rgb(255, 46, 99)",
    //是否竖直  
    vertical: false,
    //是否自动切换  
    autoplay: true,
    //自动切换的间隔
    interval: 2000,
    //滑动动画时长毫秒  
    duration: 300,
    tab_active: 0,
    songsList: [],
    newsList: [],
  },
  onLoad: function () {
    const _this = this
    app.tools.isLogin({
      success: function () {
        _this.initbanner()
        _this.initSongs()
        _this.initNews()
      }
    })
  },
  initSongs: function(){
    const _this = this
    app.tools.request({
      url: 'song/hot?page=1&paeSize=100',
      method: "POST",
      data: {},
      success: function (r2) {
        _this.setData({
          songsList: r2.data.content
        })
        // TODO 点击加载下一页
        // that.setData({
        //   songs_pageTotal: rst.length,
        //   songs_pageCurr: 0
        // });
      }
    });
  },
  openSong: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/songs/index?id=' + id
    });
  },
  initNews: function(){
    const _this = this
    app.tools.request({
      url: 'news/queryAll',
      success: function (r3) {
        _this.setData({
          newsList: r3.data.content
        });
        // that.setData({
        //   news_pageTotal: rst.length,
        //   news_pageCurr: 0
        // });
      }
    });
  },
  openNews: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news/index?id=' + id
    });
  },
  initbanner: function(){
    const _this = this
    app.tools.request({
      url: 'wximgs',
      success(res){
        let data = []
        res.data.content.map((e)=>{
          data.push({
            img: e.filePath.replace("/opt/app/source/imgs/", app.globalData.baseUrl),
            // img: app.globalData.baseUrl + 'download/' + e.mid + '.jpg',
            id: e.news_id
          })
        })
        _this.setData({
          bannerList: data
        })
        _this.imageLoad(data[0].img)
      }
    })
  },
  imageLoad: function(src){
    const _this = this
    wx.getImageInfo({
      src: src,
      success: function (res) {
        _this.setData({
          imgheights: res.height / res.width * wx.getSystemInfoSync().windowWidth * 2,
        })
      }
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  onChange: function(e){
    console.log(e.detail.index)
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
})

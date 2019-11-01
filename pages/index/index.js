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

    show: false,
    lrc_data: [],

    musicListOver: true,
    musicPage: 1,

    wordShow: false,
    word_example: null,
    infoList_example: null,
    mp3List_example: null,

    // newsListOver: true,
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
  startRead: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.mp3url;
    wx.playBackgroundAudio({
      dataUrl: url,
    });
  },
  //点击例句中的单词，显示单词
  readExampleWord: function (e) {
    let that = this;
    let w = e.currentTarget.dataset.i.trim();
    if (w && w.indexOf(".") != -1) {
      w = w.substring(0, w.indexOf("."));
    }
    if (w && w.indexOf(",") != -1) {
      w = w.substring(0, w.indexOf(","));
    }
    if (w) {
      app.tools.request({
        url: 'word/iciba?word=' + w.toLowerCase(),
        method: "POST",
        success: function (r9) {
          let r = r9.data.content.result;
          let _infoList = r.ponses;
          let _mp3List = r.prons;
          if (_infoList.length == 0 && _mp3List.length == 0) {
            app.tools.toast("当前单词可能是专用名字，无详解···")
            return
          }
          that.setData({
            word_example: w,
            infoList_example: _infoList,
            mp3List_example: _mp3List,
            wordShow: true // 打开弹窗
          });
        }
      });
    }
  },
  nextMusicPage: function(){
    const _this = this
    let page = _this.data.musicPage + 1
    _this.setData({
      musicPage: page
    })
    _this.initSongs()
  },
  initSongs: function(){
    const _this = this
    app.tools.request({
      url: 'song/hot?page=' + _this.data.musicPage + '&paeSize=10',
      method: "POST",
      data: {},
      success: function (r2) {
        let songs = _this.data.songsList.concat(r2.data.content)
        _this.setData({
          songsList: songs,
          musicListOver: r2.data.content.length == 10
        })
      }
    });
  },
  openSong: function(e){
    let id = e.currentTarget.dataset.id;
    let fdid = e.currentTarget.dataset.fdid;
    wx.navigateTo({
      url: '/pages/songs/index?id=' + id + '&fdid=' + fdid
    });
  },
  openSongWord: function(e){
    let fdid = e.currentTarget.dataset.fdid;
    const _this = this
    let lrc_data = []
    // 歌词
    app.tools.request({
      url: 'song/lyric?id=' + fdid,
      method: "POST",
      success: function (r5) {
        if (r5.data.content && r5.data.content.length > 0) {
          r5.data.content.map((e, index) => {
            for (var i in e) {
              lrc_data.push({
                data: e[i].split(' '),
                time: i - 0
              })
            }
          })
          _this.setData({
            show: true,
            lrc_data: lrc_data
          })
        } else {
          _this.setData({
            show:true,
            lrc_data: [{
              data: [['暂无歌词···']],
              time: 1000
            }]
          })
        }
      }
    });
    return false
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

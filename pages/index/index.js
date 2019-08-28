//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerList: [{
      detailId: '0',
      img: 'http://www.iyzjj.com/templates/jmw/images/banner.jpg'
    }, {
      detailId: '0',
      img: 'http://www.iyzjj.com/templates/jmw/images/banner.jpg'
    }, {
      detailId: '0',
      img: 'http://www.iyzjj.com/templates/jmw/images/banner.jpg'
    }],
    imgheights: [],
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
    active: 0,
    songsList: [
      {
        id: '1',
        name: 'moon river',
      }, {
        id: '2',
        name: 'moon river1',
      }, {
        id: '3',
        name: 'moon river3',
      }, {
        id: '1',
        name: 'moon river',
      }, {
        id: '2',
        name: 'moon river1',
      }, {
        id: '3',
        name: 'moon river3',
      }, {
        id: '3',
        name: 'moon river3',
      }, {
        id: '1',
        name: 'moon river',
      }, {
        id: '2',
        name: 'moon river1',
      }, {
        id: '3',
        name: 'moon river3',
      }
    ],
    newsList: [
      {
        id: '1',
        name: '测试内容',
        date: '2018-01-01',
      }, {
        id: '2',
        name: '测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }, {
        id: '3',
        name: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容',
        date: '2018-01-01',
      }
    ],
  },
  onLoad: function () {
    
  },
  imageLoad: function(e){
    var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  },
  onChange: function(e){
    console.log(e.detail.index)
  },
  onpenSong: function(e){
    console.log(e)
  },
})

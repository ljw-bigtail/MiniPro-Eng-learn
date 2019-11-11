// pages/study/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0, // 0\1\2 年级、教材、单元 Grade, textbook, unit
    gradeRadio: '',
    textbookRadio: '',
    unitRadio: '',
    grade: [], 
    textbook: [], 
    unit: [],
    popShow: false,
    active: 1,
    tab_active: 0,
    book: app.globalData.bookInfo ? (app.globalData.bookInfo.value) : null
  },
  onClose() {
    this.setData({ popShow: false });
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
  openBookSet: function(){
    if (app.globalData.userInfo) {
      this.setData({ popShow: true });
      this.setData({ state: 0 }); 
    } else {
      app.tools.goToLogin()
    }
  },
  openBook: function () {
    if (app.globalData.userInfo){
      if (this.data.book){
        // 去学习
        wx.navigateTo({
          url: '/pages/study/book',
        })
      }else{
        app.tools.toast('请先选择教材···')
      }
    }else{
      app.tools.goToLogin()
    }
  },
  // enoughBalance: function (_url) {
  //   const _this = this;
  //   app.tools.request({
  //     url: 'user/wallet',
  //     success: function (r1) {
  //       var cont = r1.data.content;
  //       if (cont.code == "S") {
  //         if (cont.result.balance < 1) {
  //           // 去充值
  //           app.tools.goToDeposit()
  //         } else {
  //           // 付款
  //           app.tools.request({
  //             url: 'word/payWithGBC' + _url,
  //             method: "POST",
  //             success: function (r1) {
  //               var cont = r1.data.content;
  //               if (cont) {
  //                 // 支付成功了
  //                 app.tools.toast('支付成功，正在打开课本···')
  //                 wx.navigateTo({
  //                   url: '/pages/study/book',
  //                 })
  //               } else {
  //                 // 支付异常
  //                 app.tools.toast('支付失败，请联系客服···')
  //               }
  //             }
  //           });
  //         }
  //       }
  //     }
  //   });
  // },
  gradeChange(event) {
    this.setData({
      gradeRadio: event.detail
    });
  },
  gradeClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      gradeRadio: name
    });
    this.inittextbook(name)
    this.setData({ state: 1});
  },
  textbookChange(event) {
    this.setData({
      textbookRadio: event.detail
    });
  },
  textbookClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      textbookRadio: name
    });
    this.initunit(name)
    this.setData({ state: 2});
  },
  unitChange(event) {
    this.setData({
      unitRadio: event.detail
    });
  },
  unitClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      unitRadio: name
    });
    this.setData({ popShow: false });
    // TODO 
    // 设置结果
    let data = {
      grade: '', // 年级
      textbook: '', // 教材
      unit: '' // 单元
    }
    let _this = this
    this.data.grade.map(function (e) {
      if (e.key == _this.data.gradeRadio) {data.grade = e.value}
    })
    this.data.textbook.map(function (e) {
      if (e.id == _this.data.textbookRadio) { data.textbook = e.name}
    })
    this.data.unit.map(function (e) {
      if (e.key == _this.data.unitRadio) { data.unit = e.value}
    })
    this.setBook(data)
    // console.log(this.data.book)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initBookCache()
    this.initgrade()
  },
  initBookCache: function(){
    const _this = this
    if (!app.globalData.userInfo || !app.globalData.userInfo.userid){
        app.tools.toast('请登录···')
        setTimeout(function () {
            wx.navigateTo({
                url: '/pages/user/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }, 1000)
        return
    }
    if (app.globalData.userInfo.is_real){
        app.tools.toast('请实名认证后再使用···')
        setTimeout(function(){
            wx.navigateTo({
                url: '/pages/user/index?toReal=1',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
        }, 1000)
        return
    }
    app.tools.request({
      url: 'user/learCfg?uid=' + app.globalData.userInfo.userid,
      method: "POST",
      success: function (r3) {
        console.log(r3)
        // TODO 接口需求：当前所选择的教材,回填到data里
        let data = {
          grade: r3.data.content.gradeName, // 年级
          textbook: r3.data.content.bookName, // 教材
          unit: r3.data.content.chapterName // 单元
        }
        _this.setData({
          book: data
        });
        app.globalData.bookInfo = {
          'grade': r3.data.content.grade,
          'bid': r3.data.content.bid,
          'chapter': r3.data.content.chapter,
          'value': data,
        }
      }
    });
  },
  setBook: function (data){
    const _this = this
    app.tools.request({
      url: 'user/setLearCfg',
      method: "POST",
      data: {
        'uid': app.globalData.userInfo.userid || '',
        'grade': _this.data.gradeRadio,
        'bid': _this.data.textbookRadio,
        'chapter': _this.data.unitRadio
      },
      success: function (r3) {
        if (r3.data.content == 1){
          _this.setData({
            book: data
          }); 
          app.globalData.bookInfo = {
            'grade': _this.data.gradeRadio,
            'bid': _this.data.textbookRadio,
            'chapter': _this.data.unitRadio,
            'value': data,
          }
          // app.tools.toast('设置成功，现在去学习···')
          // setTimeout(function(){
            _this.openBook()
            // wx.navigateTo({
            //   url: '/pages/study/book',
            // })
          // }, 1500)
        }else{
          app.tools.toast('设置失败，请联系客服···')
        }
      }
    });
  },

  // 加载年级
  initgrade: function(){
    const _this = this
    app.tools.request({
      url: 'enum/grade',
      method: "POST",
      success: function (r3) {
        _this.setData({
          grade: r3.data.content
        });
      }
    });
  },
  // 加载教材
  inittextbook: function (val) {
    const _this = this
    app.tools.request({
      url: 'book/getByGrade?page=1&paeSize=10&grade=' + val,
      method: "POST",
      success: function (r3) {
        _this.setData({
          textbook: r3.data.content
        });
      }
    });
  },
  // 加载单元
  initunit: function (val) {
    const _this = this
    app.tools.request({
      url: 'enum/chapter',
      method: "POST",
      success: function (r3) {
        _this.setData({
          unit: r3.data.content
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/study/book.js

const app = getApp()

let preReadMony = 0,
    preWordMony = 0,
    preReadingMony = 0; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_active: 0,
    readList: [],
    wordList: [],
    readTestList: [],
    show: false
  },
  dialogOpen: function (e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    
    this.setData({
      show: true,
      description_val: that.data.readTestList[i].description,
    })
    console.log(that.data)
    return false
  },
  dialogClose: function () {
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.globalData.bookInfo = {
    //   'grade': _this.data.gradeRadio,
    //   'bid': _this.data.textbookRadio,
    //   'chapter': _this.data.unitRadio
    // }
    this.initMoney()
    this.initWord()
    this.initRead()
    this.initReadTest()
  },
  initMoney: function(){
    const _this = this
    app.tools.request({
      url: 'artical/getPayMoney',
      method: "POST",
      success: function (r3) {
        preReadMony = r3.data.content
      }
    });
    app.tools.request({
      url: 'word/getPayMoney',
      method: "POST",
      success: function (r3) {
        preWordMony = r3.data.content
      }
    });
    app.tools.request({
      url: 'reading/getPayMoney',
      method: "POST",
      success: function (r3) {
        preReadingMony = r3.data.content
      }
    });
  },
  initReadTest: function(){
    const _this = this
    app.tools.request({
      url: 'reading/getWithGBC?grade=' + app.globalData.bookInfo.grade ,//+ '&bid=' + app.globalData.bookInfo.bid + '&chapter=' + app.globalData.bookInfo.chapter,
      method: "POST",
      success: function (r3) {
        _this.setData({
          readTestList: r3.data.content.result
        });
      }
    });
  },
  initWord: function () {
    const _this = this
    app.tools.request({
      url: 'word/getWithGBC?grade=' + app.globalData.bookInfo.grade + '&bid=' + app.globalData.bookInfo.bid + '&chapter=' + app.globalData.bookInfo.chapter,
      method: "POST",
      success: function (r3) {
        _this.setData({
          wordList: r3.data.content.result
        });
      }
    });
  },
  initRead: function(){
    const _this = this
    app.tools.request({
      url: 'artical/getWithGBC?grade=' + app.globalData.bookInfo.grade + '&type=QUESTION_TYPE_2',
      method: "POST",
      success: function (r3) {
        _this.setData({
          readList: r3.data.content.result
        });
      }
    });
  },
  openWords: function (e) {
    const _this = this
    let _url = "?grade=" + app.globalData.bookInfo.grade + "&bid=" + app.globalData.bookInfo.bid + "&chapter=" + app.globalData.bookInfo.chapter;
    app.tools.request({
      url: 'word/checkWithGBC' + _url,
      method: "POST",
      success: function (r1) {
        var cont = r1.data.content.result;
        console.log(cont)
        if (!cont) {
          // 是否支付
          wx.showModal({
            content: '每单元单词教材需要支付' + preWordMony + '学币，是否支付？',
            showCancel: true,
            confirmText: '确定',
            confirmColor: 'rgb(255, 46, 99)',
            success: function (res) {
              if (res.confirm) {
                // 去支付
                _this.enoughBalanceWord(_url, e.currentTarget.dataset.word);
              }
            }
          })
        } else {
          // 已经支付,去单词
          wx.navigateTo({
            url: '/pages/book/words?word=' + e.currentTarget.dataset.word,
          })
        }
      }
    })
  },
  enoughBalanceWord: function (_url, word) {
    const _this = this;
    app.tools.request({
      url: 'user/wallet',
      success: function (r1) {
        var cont = r1.data.content;
        if (cont.code == "S") {
          if (cont.result.balance < 1) {
            // 去充值
            app.tools.goToDeposit()
          } else {
            // 付款
            app.tools.request({
              url: 'word/payWithGBC' + _url,
              method: "POST",
              success: function (r1) {
                var cont = r1.data.content;
                if (cont) {
                  // 支付成功了
                  app.tools.toast('支付成功，正在打开课本···')
                  wx.navigateTo({
                    url: '/pages/book/words?word=' + word,
                  })
                } else {
                  // 支付异常
                  app.tools.toast('支付失败，请联系客服···')
                }
              }
            });
          }
        }
      }
    });
  },
  openReads: function(e){
    // 付费
    const _this = this
    let id = e.currentTarget.dataset.id;
    app.tools.request({
      url: 'artical/checPayed?aid=' + id,
      method: "POST",
      success: function (r1) {
        if (!r1.data.content.result) {
          // 是否支付
          wx.showModal({
            content: '每篇阅读需要支付' + preReadMony+'学币，是否支付？',
            showCancel: true,
            confirmText: '确定',
            confirmColor: 'rgb(255, 46, 99)',
            success: function (res) {
              if (res.confirm) {
                // 去支付
                _this.enoughBalance(function(){
                  app.tools.request({
                    url: 'artical/pay?aid=' + id,
                    method: "POST",
                    success: function (r2) {
                      if (r2.data.content) {
                        // 支付成功了
                        app.tools.toast('支付成功，正在打开课本···')
                        wx.navigateTo({
                          url: '/pages/book/reads?id=' + id
                        })
                      } else {
                        // 支付异常
                        app.tools.toast('支付失败，请联系客服···')
                      }
                    }
                  });
                });
              }
            }
          })
        } else {
          // 已经支付
          wx.navigateTo({
            url: '/pages/book/reads?id=' + id
          })
        }
      }
    })
  },
  openReadTest: function(e){
    // 付费
    const _this = this
    let index = e.currentTarget.dataset.index;
    let data = _this.data.readTestList[index];
    app.tools.request({
      url: 'reading/checPayed?readingId=' + data.id,
      method: "POST",
      success: function (r1) {
        if (!r1.data.content.result) {
          // 是否支付
          wx.showModal({
            content: '每篇阅读理解需要支付' + preReadingMony + '学币，是否支付？',
            showCancel: true,
            confirmText: '确定',
            confirmColor: 'rgb(255, 46, 99)',
            success: function (res) {
              if (res.confirm) {
                // 去支付
                _this.enoughBalance(function(){
                  app.tools.request({
                    url: 'reading/pay?readingId=' + data.id,
                    method: "POST",
                    success: function (r2) {
                      if (r2.data.content) {
                        // 支付成功了
                        _this.openReadTestUrl(data)
                      } else {
                        // 支付异常
                        app.tools.toast('支付失败，请联系客服···')
                      }
                    }
                  });
                });
              }
            }
          })
        } else {
          // 已经支付
          _this.openReadTestUrl(data)
        }
      }
    })
  },
  openReadTestUrl: function(data){
    wx.setStorage({
      key: 'readTestCache',
      data: data,
      success: () => {
        wx.navigateTo({
          url: '/pages/book/test?id=' + data.id
        })
      },
      fail: () => {
        app.tools.toast('跳转失败，请联系客服···')
      },
    })
  },
  enoughBalance: function (callback) {
    const _this = this;
    app.tools.request({
      url: 'user/wallet',
      success: function (r1) {
        var cont = r1.data.content;
        if (cont.code == "S") {
          if (cont.result.balance < 1) {
            // 去充值
            app.tools.goToDeposit()
          } else {
            // 付款
            callback && callback()
          }
        }
      }
    });
  },
  pay: function (id) {
    
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
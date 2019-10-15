// pages/book/test.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readTest: {},
    readQuestion: [],
    answer: [],
    radio: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initReadTest(options.id.trim())
    this.initReadTestQuestion(options.id.trim()) 
  },
  initReadTest: function(id){
    // 8A2E96A9B05AAB65D8034B396280B1B2
    const _this = this
    wx.getStorage({
      key: 'readTestCache',
      success: (res) => {
        _this.setData({
          readTest: res.data
        });
      },
      fail: () => {
        app.tools.toast('读取失败，请联系客服···')
      },
    })
  },
  initReadTestQuestion: function (id) {
    // 8A2E96A9B05AAB65D8034B396280B1B2
    const _this = this
    app.tools.request({
      url: 'reading/getQuestions?readingId=' + id,
      method: "POST",
      success: function (r) {
        let answer = []
        r.data.content.result.map(function(e){          
          answer.push({
            answer2: '',
            reqid: e.id,
          })
        })
        _this.setData({
          readQuestion: r.data.content.result,
          answer: answer
        });
        console.log(_this.data)
      }
    });
  },
  submit: function(){
    const _this = this
    // let answer = _this.data.answer
    // answer[e.currentTarget.dataset.index] = e.detail
    // _this.setData({
    //   answer: answer
    // });
    app.tools.request({
      url: 'reading/submit',
      method: "POST",
      data: _this.data.answer,
      success: function (r) {
        // let answer = []
        // r.data.content.result.map(function (e) {
        //   answer.push({
        //     answer2: '',
        //     reqid: e.id,
        //   })
        // })
        // _this.setData({
        //   readQuestion: r.data.content.result,
        //   answer: answer
        // });
        console.log(r)
        // console.log(_this.data)
      }
    });
  },
  onClick(event) {
    const _this = this
    let answer = _this.data.answer
    answer[event.currentTarget.dataset.index].answer2 = event.currentTarget.dataset.name
    this.setData({
      answer: answer
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
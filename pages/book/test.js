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
    radio: '',

    show: false, // 翻译弹窗
    numberTip: '',

    readingId: '',

    btnShow: false,

    dialogState: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      readingId: options.id.trim()
    });
    this.initReadTest(this.data.readingId)
    this.initReadTestQuestion(this.data.readingId) 
    this.initLast() 
  },

  initLast: function () {
    const _this = this
    app.tools.request({
      url: 'reading/submitRecords?readingId=' + _this.data.readingId,
      method: "POST",
      success: function (r) {
        if (r.data.content.result.length > 0){
          _this.setData({
            historyAnswer: r.data.content.result[0],
            btnShow: true
          });
        }
      }
    });
  },
  getLast: function(){
    const _this = this
    app.tools.request({
      url: 'reading/recordDetails?recordId=' + _this.data.historyAnswer.id,
      method: "POST",
      success: function (r) {
        let answerList = []
        r.data.content.result.map(function (e, i) {
          // if (e.ansresult != 'R') {
            answerList.push({
              i: i,
              q: e.readingCpsQuestion.description,
              a: e.readingCpsQuestion.explain + (e.ansresult != 'R' ? '（回答正确）' : '（回答错误）'),
              answer: e.readingCpsQuestion.answer,
            })
          // }
        })
        _this.setData({
          numberTip: '最近一次提交时间：' + r.data.content.result[0].createDate,
          show: true,
          answerList: answerList,
          dialogState: true
        });
      }
    });
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
      }
    });
  },
  submit: function(){
    const _this = this
    let state = 0
    _this.data.answer.map(function(e){
      if (e.answer2 == ''){
        state++
      }
    })
    if(state != 0){
      app.tools.toast('请填写完成后再提交···')
      return
    }
    app.tools.request({
      url: 'reading/submit',
      method: "POST",
      data: _this.data.answer,
      success: function (r) {
        let answerList = []
        r.data.content.result.details.map(function (e, i) {
          if (e.ansresult != 'R'){
            answerList.push({
              i: i,
              q: e.readingCpsQuestion.description,
              a: e.readingCpsQuestion.explain,
              answer: e.readingCpsQuestion.answer,
            })
          }
        })
        _this.setData({
          numberTip: '回答正确数：' + r.data.content.result.result1 + '，回答错误数：' + r.data.content.result.result2,
          show: true,
          answerList: answerList,
          dialogState: false
        });
        // console.log(_this.data)
      }
    });
  },
  dialogClose: function(){
    if (!this.data.dialogState){
      wx.navigateBack()
    }
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
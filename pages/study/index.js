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
    grade: [{
      val: '一年级',
      id: 0,
    }, {
      val: '二年级',
      id: 1,
    }, {
      val: '三年级',
      id: 2,
    }], 
    textbook: [{
      val: '人教版',
      id: 0,
    }, {
      val: '苏教版',
      id: 1,
    }], 
    unit: [{
      val: '第一单元',
      id: 0,
    }, {
      val: '第二单元',
      id: 1,
    }, {
      val: '第三单元',
      id: 2,
    }, {
      val: '第四单元',
      id: 3,
    }],
    popShow: false,
    active: 1,
    tab_active: 0,
    book: {
      grade: '一年级', // 年级
      textbook: '人教版（上）', // 教材
      unit: '第一单元' // 单元
    }
  },
  onClose() {
    this.setData({ popShow: false });
  },
  openTabbar: function (e) {
    app.tabbarNavTo(e.detail)
  },
  openBookSet: function(){
    this.setData({ popShow: true });
    this.setData({ state: 0 });
  },
  openBook: function () {
    wx.navigateTo({
      url: '/pages/study/book',
    })
  },
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
    this.setData({
      book: {
        grade: this.data.gradeRadio, // 年级
        textbook: this.data.textbookRadio, // 教材
        unit: this.data.unitRadio // 单元
      }
    });
    console.log(this.data.book)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
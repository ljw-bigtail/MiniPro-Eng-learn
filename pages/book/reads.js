const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, // 翻译弹窗
    word_example: null,
    infoList_example: null,
    mp3List_example: null,

    content: null,
    znContent: null,
    title: null,
    showCN: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRead(options.id)
  },
  initRead: function (id) {
    const _this = this
    app.tools.request({
      url: 'artical/' + id,
      method: "POST",
      success: function (r) {
        let rst = r.data.content.result;
        // 整理例句部分
        if (rst && rst.content) {
          let _words = rst.content;
          // rst.content.split(" ").map((e)=>{
          //   e != '' && _words.push(e + " ")
          // })
          rst.mainpointsList && rst.mainpointsList.map(function(e,i){
            var reg = new RegExp(e.reg, 'g')
            _words = _words.replace(reg, "@#" + e.reg + "@#")
          })
          let endWord = []
          // console.log(_words)
          _words.split("@#").map(function(e){
            // 短语
            var state = undefined
            rst.mainpointsList && rst.mainpointsList.map(function (_e, i) {
              if (_e.reg == e){
                state = i
              }
            })
            if (state != undefined){
              endWord.push({
                cls: 'bloder',
                text: e,
                zhExplain: rst.mainpointsList[state].zhExplain,
                phrase: rst.mainpointsList[state].phrase,
              })
            }else{
              e.split(" ").map((_e)=>{
                if (e.trim() != ''){
                  endWord.push({
                    cls: '',
                    text: _e + " ",
                    zhExplain: '',
                    phrase: '',
                  })  
                }
              })
            }
            // 单词
          })
          // rst.content = _words;
          // console.log(endWord);
          _this.setData({
            content: endWord,
            znContent: rst.description,
            title: rst.name
          });
        }
      }
    });
  },
  openCN: function () {
    this.setData({
      showCN: true
    });
  },
  closeCN: function(){
    this.setData({
      showCN: false
    });
  },
  // 读音
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
    let data = that.data.content[e.currentTarget.dataset.i];
    let w = data.text
    // if (data.cls != "bloder"){return}
    // console.log(e.currentTarget.dataset.i, data)
    if (w) {
      if (data.cls == "bloder"){
        // 短语查询
        that.setData({
          word_example: data.phrase,
          infoList_example: [data.zhExplain || '翻译内容未设置···'],
          mp3List_example: [],
          show: true // 打开弹窗
        });
      }else{
        if (w && w.indexOf(".") != -1) {
          w = w.substring(0, w.indexOf("."));
        }
        if (w && w.indexOf(",") != -1) {
          w = w.substring(0, w.indexOf(","));
        }
        // 单次查询
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
              show: true // 打开弹窗
            });
          }
        });
      }
    }
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
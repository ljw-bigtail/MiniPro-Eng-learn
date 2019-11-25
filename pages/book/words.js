const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        word: null, //单词
        infoList: null, //含义
        mp3List: null, //朗读
        exampleList: null, //例句

        show: false, // 翻译弹窗
        word_example: null,
        infoList_example: null,
        mp3List_example: null,
    },
    dialogClose: function() {
        this.setData({
            show: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const _this = this
        _this.judgingLogin()
        _this.isPay(function(){
            _this.initWord(options.word.trim())
        })
    },
    judgingLogin: function() {
        if (!app.globalData.userInfo || !app.globalData.userInfo.userid) {
            app.tools.toast('请登录···')
            setTimeout(function() {
                wx.navigateTo({
                    url: '/pages/user/index',
                })
            }, 600)
            return
        }
        if (app.globalData.userInfo.is_real) {
            app.tools.toast('请实名认证后再使用···')
            setTimeout(function() {
                wx.navigateTo({
                    url: '/pages/user/index?toReal=1',
                })
            }, 600)
            return
        }
    },
    initWord: function(word) {
        const _this = this
        app.tools.request({
            url: 'word/iciba?word=' + word.replace(/\\ /gm, '%20'),
            method: "POST",
            success: function(r) {
                let data = r.data.content.result
                let sent = []
                if (data.sent && data.sent.length > 0) {
                    //整理例句部分
                    data.sent.map((e) => {
                        let _d = {
                            orig_a: [],
                            trans: e.trans
                        }
                        e.orig.split(' ').map((_e) => {
                            _d.orig_a.push(_e + ' ')
                        })
                        sent.push(_d)
                    })
                } else {
                    sent = []
                }
                _this.setData({
                    word: word,
                    infoList: data.ponses,
                    mp3List: data.prons,
                    exampleList: sent
                })
                console.log(_this.data)
            }
        });
    },
    isPay: function (callback){
        const _this = this
        let _url = "?grade=" + app.globalData.bookInfo.grade + "&bid=" + app.globalData.bookInfo.bid + "&chapter=" + app.globalData.bookInfo.chapter;
        app.tools.request({
            url: 'word/checkWithGBC' + _url,
            method: "POST",
            success: function (r1) {
                var cont = r1.data.content.result;
                if (!cont) {
                    // 是否支付
                    wx.showModal({
                        content: '每单元单词教材需要支付' + preWordMony + '学币，是否支付？',
                        showCancel: true,
                        confirmText: '确定',
                        confirmColor: '#ff2e63',
                        success: function (res) {
                            if (res.confirm) {
                                // 去支付
                                _this.enoughBalanceWord(_url, callback);
                            }
                        }
                    })
                } else {
                    callback && callback()
                }
            }
        })
    },
    enoughBalanceWord: function (_url, callback) {
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
                                    callback && callback()
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
    // 读音
    startRead: function(e) {
        let that = this;
        let url = e.currentTarget.dataset.mp3url;
        wx.playBackgroundAudio({
            dataUrl: url,
        });
    },
    //点击例句中的单词，显示单词
    readExampleWord: function(e) {
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
                success: function(r9) {
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
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
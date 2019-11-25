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

        dialogState: true,

        e_show: false,
        content: null,
        content_no_phrase: null,
        znContent: null,
        title: null,
        word_example: null,
        infoList_example: null,
        mp3List_example: null,

        havPhrase: true,
        havDes: false,
        havzhContent: false,
    },
    togglezhContent: function() {
        let that = this;
        that.setData({
            havzhContent: !that.data.havzhContent
        })
    },
    toggleDes: function() {
        let that = this;
        that.setData({
            havDes: !that.data.havDes
        })
    },
    toggleHavPhrase: function() {
        let that = this;
        that.setData({
            havPhrase: !that.data.havPhrase
        })
    },
    readExampleWord: function(e) {
        let that = this;
        let data
        if (e.currentTarget.dataset.type == 0) {
            data = that.data.content[e.currentTarget.dataset.i];
        } else {
            data = that.data.content_no_phrase[e.currentTarget.dataset.i];
        }
        let w = data.text
        if (w) {
            if (data.cls == "bloder") {
                // 短语查询
                that.setData({
                    word_example: data.phrase,
                    infoList_example: [data.zhExplain || '翻译内容未设置···'],
                    mp3List_example: [],
                    e_show: true // 打开弹窗
                });
            } else {
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
                            e_show: true // 打开弹窗
                        });
                    }
                });
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            readingId: options.id.trim()
        });
        this.judgingLogin()
    },
    initLast: function() {
        const _this = this
        app.tools.request({
            url: 'reading/submitRecords?readingId=' + _this.data.readingId,
            method: "POST",
            success: function(r) {
                if (r.data.content.result.length > 0) {
                    _this.setData({
                        historyAnswer: r.data.content.result[0],
                        btnShow: true
                    });
                }
            }
        });
    },
    judgingLogin: function () {
        const _this = this
        if (!app.globalData.userInfo || !app.globalData.userInfo.userid) {
            app.tools.toast('请登录···')
            setTimeout(function () {
                wx.navigateTo({
                    url: '/pages/user/index?urlFrom=test&id=' + _this.data.readingId,
                })
            }, 600)
            return
        }
        if (app.globalData.userInfo.is_real) {
            app.tools.toast('请实名认证后再使用···')
            setTimeout(function () {
                wx.navigateTo({
                    url: '/pages/user/index?toReal=1&urlFrom=test&id=' + _this.data.readingId,
                })
            }, 600)
            return
        }
        // 付费
        app.tools.request({
            url: 'reading/getPayMoney',
            method: "POST",
            success: function (r3) {
                var preReadingMony = r3.data.content
                app.tools.request({
                    url: 'reading/checPayed?readingId=' + _this.data.readingId,
                    method: "POST",
                    success: function (r1) {
                        if (!r1.data.content.result) {
                            // 是否支付
                            wx.showModal({
                                content: '每篇阅读理解需要支付' + preReadingMony + '学币，是否支付？',
                                showCancel: true,
                                confirmText: '确定',
                                confirmColor: '#ff2e63',
                                success: function (res) {
                                    if (res.confirm) {
                                        // 去支付
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
                                                            url: 'reading/pay?readingId=' + _this.data.readingId,
                                                            method: "POST",
                                                            success: function (r2) {
                                                                if (r2.data.content) {
                                                                    // 支付成功了
                                                                    _this.initReadTest()
                                                                    _this.initReadTestQuestion()
                                                                    _this.initLast()
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
                                    } else if (res.cancel) {
                                        wx.reLaunch({
                                            url: '/pages/index/index',
                                        })
                                    }
                                }
                            })
                        } else {
                            // 已经支付
                            _this.initReadTest()
                            _this.initReadTestQuestion()
                            _this.initLast()
                        }
                    }
                })
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
    getLast: function() {
        const _this = this
        app.tools.request({
            url: 'reading/recordDetails?recordId=' + _this.data.historyAnswer.id,
            method: "POST",
            success: function(r) {
                let answerList = []
                r.data.content.result.map(function(e, i) {
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

    initReadTest: function() {
        // 8A2E96A9B05AAB65D8034B396280B1B2
        const _this = this
        var id = _this.data.readingId
        wx.getStorage({
            key: 'readTestCache',
            success: (res) => {
                _this.setData({
                    readTest: res.data
                });
                if (res.data) {
                    let _words = res.data.enContent;
                    res.data.mainpointsList && res.data.mainpointsList.map(function(e, i) {
                        var reg = new RegExp(e.reg, 'g')
                        _words = _words.replace(reg, "@#" + e.reg + "@#")
                    })
                    let endWord = []
                    _words.split("@#").map(function(e) {
                        // 短语
                        var state = undefined
                        res.data.mainpointsList && res.data.mainpointsList.map(function(_e, i) {
                            if (_e.reg == e) {
                                state = i
                            }
                        })
                        if (state != undefined) {
                            endWord.push({
                                cls: 'bloder',
                                text: e,
                                zhExplain: res.data.mainpointsList[state].zhExplain,
                                phrase: res.data.mainpointsList[state].phrase,
                            })
                        } else {
                            e.split(" ").map((_e) => {
                                if (e.trim() != '') {
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
                    // 没有短语的
                    let endWord_no = [];
                    res.data.enContent.split(" ").map((e) => {
                        e != '' && endWord_no.push({
                            cls: '',
                            text: e + " ",
                            zhExplain: '',
                            phrase: '',
                        })
                    })
                    _this.setData({
                        content_no_phrase: endWord_no,
                        content: endWord,
                        znContent: res.data.description,
                        title: res.data.name
                    });
                }
            },
            fail: () => {
                app.tools.toast('读取失败，请联系客服···')
            },
        })
    },
    initReadTestQuestion: function() {
        // 8A2E96A9B05AAB65D8034B396280B1B2
        const _this = this
        var id = _this.data.readingId
        app.tools.request({
            url: 'reading/getQuestions?readingId=' + id,
            method: "POST",
            success: function(r) {
                let answer = []
                r.data.content.result.map(function(e) {
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
    submit: function() {
        const _this = this
        let state = 0
        _this.data.answer.map(function(e) {
            if (e.answer2 == '') {
                state++
            }
        })
        if (state != 0) {
            app.tools.toast('请填写完成后再提交···')
            return
        }
        app.tools.request({
            url: 'reading/submit',
            method: "POST",
            data: _this.data.answer,
            success: function(r) {
                let answerList = []
                r.data.content.result.details.map(function(e, i) {
                    if (e.ansresult != 'R') {
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
            }
        });
    },
    dialogClose: function() {
        if (!this.data.dialogState) {
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
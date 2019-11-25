// pages/user/index.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        loginShow: true,

        user_img: 'http://i0.sinaimg.cn/dy/o/2009-09-29/1254240031_5ZY0oP.jpg',
        user_name: '请登录',
        active: 2,

        show: false,

        sex: '',
        address: '',
        email: '',
        tel: '',
        uname: '',

        referee: '10000'
    },
    // 实名认证
    sureToName: function() {
        let that = this;
        //信息校验
        if (!this.data.uname || this.data.uname.length < 2 || this.data.uname.length > 20) {
            app.tools.toast('姓名不能为空，2~20位汉字或字母···')
        } else if (new RegExp("[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]").test(that.data.uname)) {
            app.tools.toast('姓名不能有特殊字符···')
        } else if (!new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9]+$").test(that.data.uname)) {
            app.tools.toast('姓名校验失败···')
        } else if (!new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$').test(that.data.tel)) {
            app.tools.toast('电话格式错误···')
        } else if (!new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$').test(that.data.email)) {
            app.tools.toast('邮箱格式错误···')
        } else {
            wx.showModal({
                title: '警告',
                content: '确定提交，提交之后无法修改！',
                success: function(res) {
                    if (res.confirm) {
                        app.tools.request({
                            url: 'regist',
                            method: "POST",
                            data: {
                                'uid': app.globalData.userInfo.userid,
                                "realName": that.data.uname,
                                'address': that.data.address,
                                'email': that.data.email,
                                'sex': that.data.sex,
                                'phone': that.data.tel,
                            },
                            success: function(r3) {
                                app.tools.toast('保存成功···')
                                that.setData({
                                    show: false
                                })
                            },
                            fail: function(e) {
                                app.tools.toast('数据异常，请联系客服···')
                            }
                        })
                    }
                }
            });
        }
    },
    onChangeUname: function(event) {
        this.setData({
            uname: event.detail
        });
    },
    onChangetel: function(event) {
        this.setData({
            tel: event.detail
        });
    },
    onChangeemail: function(event) {
        this.setData({
            email: event.detail
        });
    },
    onChangeaddress: function(event) {
        this.setData({
            address: event.detail
        });
    },
    onChangeSex: function(event) {
        this.setData({
            sex: event.detail
        });
    },
    openShare: function() {
        wx.showShareMenu()
    },
    openTabbar: function(e) {
        app.tabbarNavTo(e.detail)
    },
    openUrlTrue: function(event) {
        wx.navigateTo({
            url: event.currentTarget.dataset.url,
        })
    },
    openUrl: function(event) {
        if (app.globalData.userInfo) {
            wx.navigateTo({
                url: event.currentTarget.dataset.url,
            })
        } else {
            wx.showToast({
                title: '请登陆！',
                icon: 'none'
            })
        }
    },
    bindGetUserInfo: function() {
        app.tools.isLogin(function() {
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            urlFrom: options.urlFrom,
            urlFromId: options.id
        })
        if (options.referee){
            this.setData({
                referee: options.referee
            })
        }
        if (options.toReal) {
            this.setData({
                show: options.toReal == 1
            })
        }
        if (app.globalData.userInfo) {
            this.setData({
                user_img: app.globalData.userInfo.avatarUrl,
                user_name: app.globalData.userInfo.nickName,
                loginShow: false
            })
            if (app.globalData.userInfo.is_real) {
                app.tools.toast('请实名认证后再使用···')
                this.setData({
                    show: true
                })
            }
        }
    },
    login: function() {
        const _this = this
        app.tools.isLogin({
            success: function(res) {
                app.globalData.userInfo = res.r1;
                _this.setData({
                    user_img: app.globalData.userInfo.avatarUrl,
                    user_name: app.globalData.userInfo.nickName,
                    loginShow: false,
                    // 完成实名制 0未实名制
                    show: res.r3.content.result.real == 0
                })
                app.globalData.sessionid = res.r3.content.sessionid;
                app.globalData.userInfo.userid = res.r3.content.result.id;
                app.globalData.userInfo.unionid = res.r3.content.result.unionid;
                app.globalData.userInfo.is_real = res.r3.content.result.real == 0;
                if (_this.data.urlFrom == 'reads' || _this.data.urlFrom == 'test'){
                    wx.reLaunch({
                        url: '/pages/book/' + _this.data.urlFrom + '?id=' + _this.data.urlFromId,
                    })
                }
                if (_this.data.urlFrom == 'words' || _this.data.urlFrom == 'test') {
                    wx.reLaunch({
                        url: '/pages/book/words?word=' + _this.data.urlFromId,
                    })
                }
            },
            fail: function(res) {
                wx.showToast({
                    title: '请点击登陆按钮后操作！',
                    icon: 'none'
                })
            }
        }, _this.data.referee)
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
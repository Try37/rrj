const App = getApp();
let scene;
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function(options) {
        scene = decodeURIComponent(options.scene);
        if (options.userid) {
            scene = options.userid;
        }
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            //从数据库获取用户信息
                            App.globalData.userInfo = res.userInfo
                            that.queryUsreInfo();
                            //用户已经授权过
                            // wx.switchTab({
                            //     url: '/pages/index/index'
                            // })
                        }
                    });
                }
            }
        });
    },
    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            //插入登录的用户的相关信息到数据库
            let jsondata = {
                openid: App.globalData.openid,
                nickName: e.detail.userInfo.nickName,
                avatarUrl: e.detail.userInfo.avatarUrl,
                province: e.detail.userInfo.province,
                city: e.detail.userInfo.city,
                gender: e.detail.userInfo.gender,
                country: e.detail.userInfo.country,
                language: e.detail.userInfo.language,
            }
            if (scene) {
                jsondata.strParent = scene;
            }
            wx.request({
                url: App.globalData.urlPath,
                data: {
                    datatype: "saveGuest",
                    jsondata: JSON.stringify(jsondata)
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    //从数据库获取用户信息
                    that.queryUsreInfo();
                    //授权成功后，跳转进入小程序首页
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                    wx.navigateBack({
                        delta: -1
                    })
                }
            })
        }
    },
    //获取用户信息接口
    queryUsreInfo: function() {
        let that = this;
        let jsondata = {
            openid: App.globalData.openid,
            nickName: App.globalData.userInfo.nickName,
            avatarUrl: App.globalData.userInfo.avatarUrl,
            province: App.globalData.userInfo.province,
            city: App.globalData.userInfo.city,
            gender: App.globalData.userInfo.gender,
            country: App.globalData.userInfo.country,
            language: App.globalData.userInfo.language,
        }
        if (scene) {
            jsondata.strParent = scene;
        }
        wx.request({
            url: App.globalData.urlPath,
            data: {
                datatype: "saveGuest",
                jsondata: JSON.stringify(jsondata)
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                //授权成功后，跳转进入小程序首页
                wx.switchTab({
                    url: '/pages/index/index'
                })
            }
        });
    },

})
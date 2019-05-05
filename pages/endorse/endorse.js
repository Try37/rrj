const App = getApp();
let userInfo = {};
let urlPath = App.globalData.urlPath;
Page({
    data: {},
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            userInfo = res.userInfo;
                            that.setData({
                                nickName: userInfo.nickName,
                                avatarUrl: userInfo.avatarUrl
                            })
                        }
                    })
                }
            }
        });

        wx.request({
            url: urlPath,
            data: {
                datatype: "createCodeFile",
                scene: App.globalData.openid,
                page: "pages/authorizate/authorizate",
                width: 300
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    that.setData({
                        imgUrl: result.retURL
                    });
                }
            }
        })
    },
    onShareAppMessage: function(e) {
        return {
            title: '人人家-为我代言',
            path: '/page/authorizate/authorizate?userid=' + App.globalData.openid
        }
    }
})
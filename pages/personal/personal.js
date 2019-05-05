const App = getApp();
let urlPath = App.globalData.urlPath;
let id, version;
Page({
    data: {},
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            let userInfo = res.userInfo;
                            that.setData({
                                avatarUrl: userInfo.avatarUrl,
                                nickName: userInfo.nickName
                            });
                        }
                    });
                }
            }
        });
        wx.request({
            url: urlPath,
            data: {
                datatype: 'getClientInfo',
                strClientCode: App.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == '0') {
                    let retJson = JSON.parse(result.retJson);
                    that.setData({
                        strClientName: retJson.strClientName,
                        strAge: retJson.strAge,
                        strTel: retJson.strTel,
                        strQQ: retJson.strQQ,
                        strMemo: retJson.strMemo
                    });
                    id = retJson.id;
                    version = retJson.version;
                }
            }
        });
    },
    formSubmit: function(e) {
        let that = this;
        let json = e.detail.value;
        if (json.strTel == "" || json.strTel.length == 0) {
            wx.showToast({
                title: "请输入手机号",
                duration: 1000
            })
            return false;
        }
        json.strClientCode = App.globalData.openid;
        json.id = id;
        json.version = version;
        json.strPYShort = that.data.nickName;
        wx.request({
            url: urlPath,
            data: {
                datatype: 'saveClientInfo',
                jsondata: JSON.stringify(json)
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == '0') {
                    wx.showToast({
                        title: "保存成功",
                        duration: 1000
                    })
                } else {
                    wx.showToast({
                        title: '保存失败',
                        duration: 1000
                    })
                }
            }
        });
    }
})
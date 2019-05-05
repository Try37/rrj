const app = getApp();
Page({
    data: {
        avatarUrl: "",
        nickName: ""
    },
    onLoad: function(options) {
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
    }
})
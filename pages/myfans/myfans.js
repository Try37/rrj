const APP = getApp();
let urlPath = APP.globalData.urlPath;
Page({
    data: {
        issselect: 1,
        scrollHeight: 0,
        fansList: [],
        start: 0
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                let windowHeight = (res.windowHeight - 107) * (750 / res.windowWidth);
                that.setData({
                    scrollHeight: windowHeight
                });
            }
        });
        wx.request({
            url: urlPath,
            data: {
                datatype: "getFansList",
                strBatchCode: APP.globalData.openid,
                strLevel: 1,
                start: 0,
                limit: 10
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    if (retJson.length > 0) {
                        that.setData({
                            fansList: retJson
                        });
                    }
                } else {
                    wx.showToast({
                        title: '查询失败',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            }
        });
    },
    selectType: function(e) {
        let issselect = e.target.dataset.type;
        this.setData({
            issselect: issselect,
            scrollTop: 0,
            start: 0
        });
        wx.request({
            url: urlPath,
            data: {
                datatype: "getFansList",
                strBatchCode: APP.globalData.openid,
                strLevel: issselect,
                start: 0,
                limit: 10
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    if (retJson.length > 0) {
                        that.setData({
                            fansList: retJson
                        });
                    }
                } else {
                    wx.showToast({
                        title: '查询失败',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            }
        });
    },
    loadmore: function() {
        let that = this;
        let issselect = this.data.issselect;
        let start = this.data.start + 10;
        wx.request({
            url: urlPath,
            data: {
                datatype: "getFansList",
                strBatchCode: APP.globalData.openid,
                strLevel: issselect,
                start: start,
                limit: 10
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    if (retJson.length > 0) {
                        let fansList = that.data.fansList;
                        let list = fansList.concat(retJson)
                        that.setData({
                            fansList: list
                        });
                    }
                } else {
                    wx.showToast({
                        title: '查询失败',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            }
        });
    },
    goToEndorse: function(e) {
        wx.navigateTo({
            url: "/pages/endorse/endorse"
        });
    }
})
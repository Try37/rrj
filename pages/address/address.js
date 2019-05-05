const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
    data: {
        currentPage: 0,
        addressList: [],
        region: [],
        isDefult: false
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.loadPage();
    },
    add: function(e) {
        this.setData({
            currentPage: 1
        })
    },
    swipeDeletets: function(e) {
        //滑动开始
        if (e.touches.length == 1) { //判断是否只有一个触点
            //记录起始位置
            this.startX = e.touches[0].clientX;
        }
    },
    swipeDeletetm: function(e) {
        // 滑动过程中
        let addressList = this.data.addressList;
        if (e.touches.length === 1) {
            let index = e.currentTarget.dataset.index;
            let style = addressList[index].style ? addressList[index].style : 0;
            // 手指起始点位置与移动期间的差值
            var distanceX = this.startX - e.touches[0].clientX;
            this.startX = e.touches[0].clientX;
            if (style - distanceX < -140) {
                style = -140;
            } else if (style - distanceX > 0) {
                style = 0;
            } else {
                style = style - distanceX;
            }
            addressList[index].style = style;
            this.setData({
                addressList: addressList
            });
        }
    },
    swipeDeletete: function(e) {
        // 滑动结束
        let addressList = this.data.addressList;
        if (e.changedTouches.length == 1) { //判断是否只有一个触点
            let index = e.currentTarget.dataset.index;
            let style = addressList[index].style ? addressList[index].style : 0;
            if (style <= -70) {
                style = -140;
            } else {
                style = 0;
            }
            addressList[index].style = style;
            this.setData({
                addressList: addressList
            });
        }
    },
    swipeDeletehandleRightBtnTap: function(e) {
        let that = this;
        //刪除地址
        wx.showModal({
            title: '提示',
            content: '是否删除该收货地址',
            success(res) {
                if (res.confirm) {
                    let index = e.target.dataset.index;
                    let addressList = that.data.addressList;
                    let id = addressList[index].id;
                    wx.request({
                        url: urlPath,
                        data: {
                            datatype: 'delAddress',
                            id: id
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success(res) {
                            let result = res.data;
                            if (result.errcode == '0') {
                                addressList.splice(index, 1);
                                that.setData({
                                    addressList: addressList
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    edit: function(e) { //编辑数据
        let index = e.currentTarget.dataset.index;
        let addressList = this.data.addressList;
        let detail = addressList[index];
        this.setData({
            detail: detail,
            currentPage: 2
        })
    },
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        })
    },
    changeCheckBoxState: function(e) {
        let isDefult = !this.data.isDefult;
        this.setData({
            isDefult: isDefult
        });
    },
    bindRegionChange4edit: function(e) {
        let detail = this.data.detail;
        let region = e.detail.value;
        detail.strProvince = region[0];
        detail.strCity = region[1];
        detail.strCounty = region[2];
        this.setData({
            detail: detail
        })
    },
    changeCheckBoxState4edit: function(e) {
        let detail = this.data.detail;
        if (detail.blDefaultAddr == 1) {
            detail.blDefaultAddr = 0;
        } else {
            detail.blDefaultAddr = 1;
        }
        this.setData({
            detail: detail
        })
    },
    formSubmit: function(e) { //新增保存
        let that = this;
        let params = e.detail.value;
        if (params.strAddr == '' || params.strAddr.length == 0) {
            wx.showToast({
                title: "请输入详细地址",
                duration: 1000
            });
            return false;
        }
        if (params.strName == '' || params.strName.length == 0) {
            wx.showToast({
                title: "请输入姓名",
                duration: 1000
            });
            return false;
        }
        if (params.strTel == '' || params.strTel.length == 0) {
            wx.showToast({
                title: "请输入手机号",
                duration: 1000
            });
            return false;
        }
        if (that.data.isDefult) {
            params.blDefaultAddr = 1;
        } else {
            params.blDefaultAddr = 0;
        }
        let region = that.data.region;
        if (region.length != 3) {
            wx.showToast({
                title: "请选择省市县",
                duration: 1000
            });
        } else {
            params.strProvince = region[0];
            params.strCity = region[1];
            params.strCounty = region[2];
        }
        params.strCustomID = App.globalData.openid;
        wx.request({
            url: urlPath,
            data: {
                datatype: 'saveAddress',
                jsondata: JSON.stringify(params)
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == '0') {
                    that.loadPage();
                    that.setData({
                        currentPage: 0,
                        region: []
                    });
                } else {
                    wx.showToast({
                        title: "服务异常，请稍后再试",
                        duration: 1000
                    })
                }
            }
        })

    },
    formSubmit4edit: function(e) {
        let that = this;
        let params = e.detail.value;
        if (params.strAddr == '' || params.strAddr.length == 0) {
            wx.showToast({
                title: "请输入详细地址",
                duration: 1000
            });
            return false;
        }
        if (params.strName == '' || params.strName.length == 0) {
            wx.showToast({
                title: "请输入姓名",
                duration: 1000
            });
            return false;
        }
        if (params.strTel == '' || params.strTel.length == 0) {
            wx.showToast({
                title: "请输入手机号",
                duration: 1000
            });
            return false;
        }
        params.blDefaultAddr = that.data.detail.blDefaultAddr;
        params.strProvince = that.data.detail.strProvince;
        params.strCity = that.data.detail.strCity;
        params.strCounty = that.data.detail.strCounty;
        params.strCustomID = App.globalData.openid;
        params.id = that.data.detail.id;
        params.version = that.data.detail.version;
        wx.request({
            url: urlPath,
            data: {
                datatype: 'saveAddress',
                jsondata: JSON.stringify(params)
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == '0') {
                    that.loadPage();
                    that.setData({
                        currentPage: 0
                    });
                } else {
                    wx.showToast({
                        title: "服务异常，请稍后再试",
                        duration: 1000
                    })
                }
            }
        });
    },
    loadPage: function() {
        let that = this;
        wx.request({
            url: urlPath,
            data: {
                datatype: 'getAddressList',
                strCustomID: App.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == '0') {
                    let retJson = JSON.parse(result.retJson);
                    that.setData({
                        addressList: retJson
                    });
                }
            }
        });
    }

})
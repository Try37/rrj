const App = getApp();
let urlPath = App.globalData.urlPath;
let isFirstShow = true;
Page({
    data: {
        shopCartList: [],
        allChecked: false,
        noSelect: false,
        totalPrice: "0.00",
        start: 0
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        let openid = App.globalData.openid;
        let params = {
            datatype: "getCarGoodsList",
            strCarCode: openid,
            start: 0,
            limit: 10
        }
        wx.request({
            url: urlPath,
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    that.setData({
                        shopCartList: retJson
                    })
                }
            }
        })
    },
    onShow: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        if (!isFirstShow) {
            let openid = App.globalData.openid;
            let params = {
                datatype: "getCarGoodsList",
                strCarCode: openid,
                start: 0,
                limit: 10
            }
            wx.request({
                url: urlPath,
                data: params,
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    let result = res.data;
                    if (result.errcode == 0) {
                        let retJson = JSON.parse(result.retJson);
                        that.setData({
                            shopCartList: retJson
                        })
                    }
                }
            })
        } else {
            isFirstShow = false;
        }
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading();
        var that = this;
        let openid = App.globalData.openid;
        let params = {
            datatype: "getCarGoodsList",
            strCarCode: openid,
            start: 0,
            limit: 10
        }
        wx.request({
            url: urlPath,
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    that.setData({
                        shopCartList: retJson,
                        start: 0,
                        totalPrice: "0.00",
                        allChecked: false
                    })
                }
                // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var that = this;
        let openid = App.globalData.openid;
        let start = that.data.start + 10;
        let params = {
            datatype: "getCarGoodsList",
            strCarCode: openid,
            start: start,
            limit: 10
        }
        wx.request({
            url: urlPath,
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    let retJson = JSON.parse(result.retJson);
                    let shopCartList = that.data.shopCartList;
                    let newArray = shopCartList.concat(retJson);
                    that.setData({
                        shopCartList: newArray
                    })
                }
            }
        });
    },
    goIndex: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    jianBtnTap: function(e) {
        let index = e.target.dataset.index;
        let id = e.target.dataset.id;
        let shopCartList = this.data.shopCartList;
        if (shopCartList[index].intCount > 1) {
            shopCartList[index].intCount = shopCartList[index].intCount - 1
            this.setData({
                shopCartList: shopCartList
            });
            //计算总金额
            this.calculateTotal();
            //调用接口更新数据库中数据
            let openid = App.globalData.openid;
            let params = {
                datatype: "setCarGoods",
                strCarCode: openid,
                jsondata: JSON.stringify(shopCartList[index])
            }
            let that = this;
            wx.request({
                url: urlPath,
                data: params,
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    let result = res.data;
                    if (result.errcode == 0) {
                        shopCartList[index].version = result.version;
                        that.setData({
                            shopCartList: shopCartList
                        });
                        that.calculateTotal();
                    }
                }
            });
        }
    },
    jiaBtnTap: function(e) {
        let index = e.target.dataset.index;
        let id = e.target.dataset.id;
        let shopCartList = this.data.shopCartList;
        shopCartList[index].intCount = shopCartList[index].intCount + 1
        this.setData({
            shopCartList: shopCartList
        });
        //计算总金额
        this.calculateTotal();
        //调用接口更新数据库中数据
        let openid = App.globalData.openid;
        let params = {
            datatype: "setCarGoods",
            strCarCode: openid,
            jsondata: JSON.stringify(shopCartList[index])
        }
        let that = this;
        wx.request({
            url: urlPath,
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    shopCartList[index].version = result.version;
                    that.setData({
                        shopCartList: shopCartList
                    });
                    that.calculateTotal();
                }
            }
        });
    },
    selectTap: function(e) {
        let index = e.target.dataset.index;
        let id = e.target.dataset.id;
        let shopCartList = this.data.shopCartList;
        shopCartList[index].ischecked = !shopCartList[index].ischecked;
        this.setData({
            shopCartList: shopCartList
        });
        //判断是否已经全部选中，如果全部选中则将全选选中，如果不是则去掉全选
        this.isSelectAll();
    },
    selectAll: function(e) {
        let shopCartList = this.data.shopCartList;
        let allChecked = !this.data.allChecked;
        shopCartList.forEach(function(element) {
            element.ischecked = allChecked;
        }, this);
        let noSelect = true;
        if (allChecked) {
            noSelect = false;
        }
        this.setData({
            shopCartList: shopCartList,
            allChecked: allChecked,
            noSelect: noSelect
        });
        //计算总金额
        this.calculateTotal();

    },
    isSelectAll: function() {
        let shopCartList = this.data.shopCartList;
        let flag4allselect = shopCartList.every(function(item) {
            return item.ischecked;
        });
        if (flag4allselect) {
            this.setData({
                allChecked: true
            })
        } else {
            this.setData({
                allChecked: false
            })
        }
        let flag4noselect = shopCartList.every(function(item) {
            return !item.ischecked;
        });
        if (flag4noselect) {
            this.setData({
                noSelect: true
            })
        } else {
            this.setData({
                noSelect: false
            })
        }
        //计算总价
        this.calculateTotal();
    },
    calculateTotal: function() {
        let total = 0;
        let shopCartList = this.data.shopCartList;
        shopCartList.forEach(function(item) {
            if (item.ischecked) {
                total += parseFloat(item.fMoney) * parseInt(item.intCount);
            }
        });
        total = total.toFixed(2);
        this.setData({
            totalPrice: total
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
        let shopCartList = this.data.shopCartList;
        if (e.touches.length === 1) {
            let index = e.currentTarget.dataset.index;
            let style = shopCartList[index].style ? shopCartList[index].style : 0;
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
            shopCartList[index].style = style;
            this.setData({
                shopCartList: shopCartList
            });
        }
    },
    swipeDeletete: function(e) {
        // 滑动结束
        let shopCartList = this.data.shopCartList;
        if (e.changedTouches.length == 1) { //判断是否只有一个触点
            let index = e.currentTarget.dataset.index;
            let style = shopCartList[index].style ? shopCartList[index].style : 0;
            if (style <= -70) {
                style = -140;
            } else {
                style = 0;
            }
            shopCartList[index].style = style;
            this.setData({
                shopCartList: shopCartList
            });
        }
    },
    swipeDeletehandleRightBtnTap: function(e) {
        //删除购物车单挑数据
        let index = e.target.dataset.index;
        let shopCartList = this.data.shopCartList;
        let that = this;
        let params = {
            datatype: "delGoodsCar",
            strCarCode: shopCartList[index].strCarCode,
            id: shopCartList[index].id
        }
        wx.request({
            url: urlPath,
            data: params,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let result = res.data;
                if (result.errcode == 0) {
                    shopCartList.splice(index, 1);
                    that.setData({
                        shopCartList: shopCartList
                    });
                    that.isSelectAll();
                }
            }
        })

    },
    toPayOrder: function(e) {
        //将数据保存到本地数据库中并跳转到确认订单页面
        let shopCartList = this.data.shopCartList;
        let newArray = [];
        shopCartList.forEach(function(element) {
            if (element.ischecked) {
                newArray.push(element)
            }
        }, this);
        if (newArray.length > 0) {
            wx.setStorage({
                key: "comfireinfo",
                data: JSON.stringify(newArray)
            });
            wx.navigateTo({
                url: '/pages/comfireorder/comfireorder'
            })
        } else {
            wx.showToast({
                title: "请选择一个商品",
                duration: 1000
            })
        }

    }

})
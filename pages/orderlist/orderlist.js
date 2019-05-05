const App = getApp();
const urlPath = App.globalData.urlPath;
Page({
  data: {
    orderState: 1,
    scrollHeight: 0,
    orderList: [],
    nodatashow: false,
    loadmoremessage: '加载更多',
    message: "没有相关订单",
    bottomLoadMore: false,
    start: 0,
    scrollTop: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let orderState = options.orderState;
    var that = this;
    that.setData({
      orderState: orderState
    });
    wx.getSystemInfo({
      success: function(res) {
        let windowHeight = (res.windowHeight - 45) * (750 / res.windowWidth)
        that.setData({
          scrollHeight: windowHeight
        });
      }
    });
    this.getBillMainList();
    this.getSumClientScore();
  },
  reload: function() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
    });
    that.setData({
      bottomLoadMore: false,
      start: 0
    });
    //调用接口获取得到最新的数据并将最新的数据放入到orderList中
    let params = {
      datatype: "getBillMainList",
      strClientCode: App.globalData.openid,
      start: 0,
      limit: 10
    }
    if (that.data.orderState != 0) {
      params.intStatus = that.data.orderState
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
          if (retJson.length > 0) {
            retJson.forEach(function(el) {
              el.count = 0;
              el.total = 0;
              el.billList.forEach(function(item) {
                el.count += item.intCount;
                el.total += item.fSumMoney;
              }, this);
            }, this);
            that.setData({
              orderList: retJson,
              nodatashow: false
            });
          } else {
            that.setData({
              nodatashow: true,
              orderList: [],
              nodatashow: true
            });
          }
          setTimeout(function() {
            wx.hideLoading();
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 1000
            });
          }, 200);
        } else {
          wx.hideLoading();
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
    let start = that.data.start + 10;
    that.setData({
      bottomLoadMore: true,
      start: start
    });
    //调用接口获取得到数据然后加载拼接数据并加载数据
    let params = {
      datatype: "getBillMainList",
      strClientCode: App.globalData.openid,
      start: start,
      limit: 10
    }
    if (that.data.orderState != 0) {
      params.intStatus = that.data.orderState
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
          retJson.forEach(function(el) {
            el.count = 0;
            el.total = 0;
            el.billList.forEach(function(item) {
              el.count += item.intCount;
              el.total += item.fSumMoney;
            }, this);
          }, this);
          let orderlist = that.data.orderList;
          var orderlist1 = orderlist.concat(retJson);
          setTimeout(function() {
            that.setData({
              bottomLoadMore: false,
              orderList: orderlist1
            });
          });
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
  getBillMainList: function() {
    let that = this;
    let params = {
      datatype: "getBillMainList",
      strClientCode: App.globalData.openid,
      start: 0,
      limit: 10
    }
    if (that.data.orderState != 0) {
      params.intStatus = that.data.orderState
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
          if (retJson.length > 0) {
            retJson.forEach(function(el) {
              el.count = 0;
              el.total = 0;
              el.billList.forEach(function(item) {
                el.count += item.intCount;
                el.total += item.fSumMoney;
              }, this);
            }, this);
            that.setData({
              orderList: retJson,
              nodatashow: false
            });
          } else {
            that.setData({
              nodatashow: true,
              orderList: [],
              nodatashow: true
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
    })
  },
  swichTap: function(e) {
    let orderState = e.target.dataset.state;
    this.setData({
      orderState: orderState
    });
    this.getBillMainList();
  },
  delOrder: function(e) {
    let id = e.target.dataset.id;
    let idx = e.target.dataset.idx;
    let that = this;
    let params = {
      datatype: "delBillMain",
      id: id
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
          let orderList = that.data.orderList;
          orderList.splice(idx, 1);
          that.setData({
            orderList: orderList
          });
          wx.showToast({
            title: "删除订单成功",
            duration: 1000
          })
        }
      }
    })
  },
  donePay: function(e) {
    let id = e.target.dataset.id;
    let idx = e.target.dataset.idx;
    let that = this;
    let orderinfo = that.data.orderList[idx].billMain;
    let sumscore = that.data.sumscore;
    if (sumscore < orderinfo.fScore) {
      wx.showToast({
        title: '积分不够',
      });
      return;
    }
    let name = orderinfo.strLinkName;
    let tel = orderinfo.strTel;
    let amount = orderinfo.fMoney;
    let orderno = orderinfo.strBill;
    let openid = App.globalData.openid;
    let orderScore = orderinfo.fScore;
    let payUrl = "/pages/pay/pay?name=" + name + "&tel=" + tel + "&orderno=" + orderno + "&amount=" + amount + "&openid=" + openid + "&score=" + orderScore;
    payUrl = encodeURI(payUrl);
    wx.navigateTo({
      url: payUrl,
    })
  },
  goToDetail: function(e) {
    let idx = e.currentTarget.dataset.idx;
    let orderdetail = this.data.orderList[idx];
    wx.setStorage({
      key: "orderdetail",
      data: JSON.stringify(orderdetail)
    });
    wx.navigateTo({
      url: "/pages/orderdetail/orderdetail"
    })
  },
  getSumClientScore: function() {
    let that = this;
    let params = {
      datatype: "getSumClientScore",
      strOpenid: App.globalData.openid
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
          let sumscore = result.sumscore; //总积分
          that.setData({
            sumscore: sumscore
          });
        }
      }
    })
  }
})
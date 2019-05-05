var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    score: 0,
    signed: false,
    conDays: 0,
    scrollTop: 0,
    start: 0,
    timeList: [{
        signed: false,
        signTime: "9日"
      },
      {
        signed: true,
        signTime: "10日"
      },
      {
        signed: false,
        signTime: "11日"
      },
      {
        signed: false,
        signTime: "12日"
      },
      {
        signed: true,
        signTime: "13日"
      },
      {
        signed: false,
        signTime: "14日"
      },
      {
        signed: true,
        signTime: "15日"
      }
    ],
    tabs: ["积分规则", "获得记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    pointsList: []
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let windowHeight = (res.windowHeight - 281) * (750 / res.windowWidth)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          scrollHeight: windowHeight
        });
      }
    });
    that.getClientScoreList();
    that.getSumClientScore();
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  sign: function(e) {
    if (this.data.signed) {
      return;
    }
    let that = this;
    let params = {
      intScore: 1,
      strOpenid: App.globalData.openid
    }
    wx.request({
      url: urlPath,
      data: {
        datatype: 'saveClientScore',
        jsondata: JSON.stringify(params)
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let result = res.data;
        if (result.errcode == '0') {
          that.getSumClientScore();
        }
      }
    });
  },
  reload: function() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
    });
    that.setData({
      start: 0
    });
    //调用接口获取得到最新的数据并将最新的数据放入到orderList中
    let params = {
      datatype: "getClientScoreList",
      strOpenid: App.globalData.openid,
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
          if (retJson.length > 0) {
            that.setData({
              pointsList: retJson
            });
          } else {
            that.setData({
              pointsList: []
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
      start: start
    });
    //调用接口获取得到数据然后加载拼接数据并加载数据
    let params = {
      datatype: "getClientScoreList",
      strOpenid: App.globalData.openid,
      start: start,
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
          let pointsList = that.data.pointsList;
          var pointsList1 = pointsList.concat(retJson);
          setTimeout(function() {
            that.setData({
              pointsList: pointsList1
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
  getClientScoreList: function() {
    let that = this;
    let params = {
      datatype: "getClientScoreList",
      strOpenid: App.globalData.openid,
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
          if (retJson.length > 0) {
            that.setData({
              pointsList: retJson
            });
          } else {
            that.setData({
              pointsList: []
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
          let blsign = result.blsign; //今日是否已签到
          let signCount = result.signCoun; //历史签到天数
          let signed = true;
          if (blsign == '0') {
            signed = false;
          }
          that.setData({
            signed: signed,
            score: sumscore,
            conDays: signCount
          });
        } else {

        }
      }
    })
  }
})
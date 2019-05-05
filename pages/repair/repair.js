const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    start: 0,
    cardList: [],
    section: [],
    currentId: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getMainBusinessType();
  },
  getMainBusinessType: function () {
    let that = this;
    wx.request({
      url: urlPath,
      data: {
        datatype: 'getMainBusinessType',
        strParentID: 'F003'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let result = res.data;
        if (result.errcode == 0) {
          let retJson = JSON.parse(result.retJson);
          that.setData({
            section: retJson,
            currentId: retJson[0].strID
          });
          that.getMainBusinessList();
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
  onPullDownRefresh: function () {
    let that = this;
    this.setData({
      start: 0
    });
    wx.showNavigationBarLoading()
    let strType = this.data.currentId;
    let params = {
      datatype: "getMainBusinessList",
      strSortRules: 2,
      strType: strType,
      strDirection: "up",
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
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        let result = res.data;
        if (result.errcode == '0') {
          let retJson = JSON.parse(result.retJson);
          if (retJson.length > 0) {
            that.setData({
              cardList: retJson
            });
          } else {
            that.setData({
              cardList: []
            })
          }
        }
      }
    });
  },
  onReachBottom: function () {
    let that = this;
    let start = that.data.start + 10;
    that.setData({
      start: start
    });
    let strType = this.data.currentId;
    let params = {
      datatype: "getMainBusinessList",
      strSortRules: 2,
      strType: strType,
      strDirection: "up",
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
        if (result.errcode == '0') {
          let retJson = JSON.parse(result.retJson);
          if (retJson.length > 0) {
            let cardList = that.data.cardList;
            var cardList1 = cardList.concat(retJson);
            that.setData({
              cardList: cardList1
            });
          }
        }
      }
    });
  },
  getMainBusinessList: function () {
    let that = this;
    let strType = this.data.currentId;
    let params = {
      datatype: "getMainBusinessList",
      strType: strType,
      strSortRules: 2,
      strDirection: "up",
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
        if (result.errcode == '0') {
          let retJson = JSON.parse(result.retJson);
          if (retJson.length > 0) {
            that.setData({
              cardList: retJson
            });
          } else {
            that.setData({
              cardList: []
            })
          }
        }
      }
    });
  },
  handleTap: function (e) {
    let currentId = e.currentTarget.id;
    this.setData({
      currentId: currentId,
      start: 0
    });
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.getMainBusinessList();
  },
  goDetail: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let info = this.data.cardList[idx];
    wx.setStorage({
      key: 'serverinfo',
      data: JSON.stringify(info),
    });
    wx.navigateTo({
      url: '/pages/serverdetail/serverdetail',
    })
  }
})
const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    start: 0,
    recruitList: []
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getRecruitsList();
  },
  getRecruitsList: function() {
    this.setData({
      start: 0
    })
    let that = this;
    let params = {
      datatype: "getRecruitsList",
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
            recruitList: retJson
          })
        } else {
          that.setData({
            recruitList: []
          })
          wx.showToast({
            title: '查询失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });
  },
  onPullDownRefresh: function() {
    let that = this;
    this.setData({
      start: 0
    });
    wx.showNavigationBarLoading()
    let params = {
      datatype: "getRecruitsList",
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
              recruitList: retJson
            })
          } else {
            that.setData({
              recruitList: []
            })
          }
        }
      }
    });
  },
  onReachBottom: function() {
    let that = this;
    let start = that.data.start + 10;
    that.setData({
      start: start
    });
    let params = {
      datatype: "getRecruitsList",
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
            let cardList = that.data.recruitList;
            var cardList1 = cardList.concat(retJson);
            that.setData({
              recruitList: cardList1
            });
          }
        }
      }
    });
  },
  goDetail: function(e) {
    console.log(e);
    let idx = e.currentTarget.dataset.idx;
    let detail = this.data.recruitList[idx];
    wx.setStorage({
      key: 'recruitdetail',
      data: JSON.stringify(detail),
    });
    wx.navigateTo({
      url: '/pages/recruitedetail/recruitedetail',
    })
  }
})
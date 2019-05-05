const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    list: [],
    start: 0,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getRestrictGoodsList();
  },
  onPullDownRefresh: function() {
    let that = this;
    this.setData({
      start: 0
    });
    wx.showNavigationBarLoading()
    let params = {
      datatype: "getRestrictGoodsList",
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
              list: retJson
            });
          } else {
            that.setData({
              list: []
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
      datatype: "getRestrictGoodsList",
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
            let list = that.data.list;
            var list1 = list.concat(retJson);
            that.setData({
              list: list1
            });
          }
        }
      }
    });
  },
  getRestrictGoodsList: function() {
    let that = this;
    let params = {
      datatype: "getRestrictGoodsList",
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
              list: retJson
            });
          } else {
            that.setData({
              list: []
            })
          }
        }
      }
    });
  },
  goToDetail: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goodslist = that.data.list;
    let detail = {};
    let goodsdetail = goodslist[index];
    let goodspics = goodsdetail.strProp1;
    let photoList = [];
    goodspics.forEach(function (element) {
      if (element.sType == "1") {
        detail.logo = element.sPath;
      } else {
        photoList.push(element.sPath);
      }
    });
    detail.strGoodsCode = goodsdetail.strGoodsCode;
    detail.photoList = photoList;
    detail.name = goodsdetail.strName;
    detail.price = goodsdetail.fSalePrice;
    detail.markPrice = goodsdetail.fMarketPrice;
    detail.stockNum = goodsdetail.intFitStoreCount;
    detail.saleNum = goodsdetail.intProp2;
    detail.freight = '免运费';
    detail.goodsdetial = goodsdetail.strProp4;
    detail.intUseScore = goodsdetail.intUseScore;
    wx.setStorage({
      key: 'goodsdetail',
      data: JSON.stringify(detail)
    });
    wx.navigateTo({
      url: "/pages/goodsdetail/goodsdetail"
    })

  }
})
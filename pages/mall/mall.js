const APP = getApp();
Page({
  data: {
    section: [],
    currentId: "",
    scrollHeight: 0,
    list: [],
    message: '暂未发现数据',
    nodatashow: true,
    loadmoremessage: '加载更多',
    bottomLoadMore: false,
    start: 0,
    scrollTop: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let windowHeight = (res.windowHeight - 47) * (750 / res.windowWidth)
        that.setData({
          scrollHeight: windowHeight
        });
      }
    });
    this.getGoodsType();
  },
  reload: function() {
    let self = this;
    wx.showLoading({
      title: '数据加载中',
    });
    self.setData({
      bottomLoadMore: false,
      start: 0
    });
    //调用接口获取得到最新的数据并将最新的数据放入到list中
    let params = {
      strGoodsClass: self.data.currentId,
      datatype: "getGoodsList",
      strSortRules: 3,
      start: 0,
      limit: 10
    }
    wx.request({
      url: APP.globalData.urlPath,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let result = res.data;
        if (result.errcode == 0) {
          let retJson = JSON.parse(result.retJson);
          self.setData({
            hideHeader: true,
            list: retJson
          });
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
    let self = this;
    let start = self.data.start + 10;
    self.setData({
      bottomLoadMore: true,
      start: start
    });
    //调用接口获取得到数据然后加载拼接数据并加载数据
    let params = {
      strGoodsClass: self.data.currentId,
      datatype: "getGoodsList",
      strSortRules: 3,
      start: start,
      limit: 10
    }
    wx.request({
      url: APP.globalData.urlPath,
      data: params,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let result = res.data;
        if (result.errcode == 0) {
          let retJson = JSON.parse(result.retJson);
          let goodslist = self.data.list;
          var goodslist1 = goodslist.concat(retJson);
          setTimeout(function() {
            self.setData({
              bottomLoadMore: false,
              list: goodslist1
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
  handleTap: function(e) {
    let currentId = e.currentTarget.id;
    this.setData({
      currentId: currentId,
      bottomLoadMore: false,
      start: 0,
      scrollTop: 0
    });
    var params = {
      strGoodsClass: currentId,
      datatype: "getGoodsList",
      strSortRules: 3,
      start: 0,
      limit: 10
    }
    this.getGoodsList(params);
  },
  getGoodsType: function() {
    let that = this;
    wx.request({
      url: APP.globalData.urlPath,
      data: {
        datatype: 'getGoodsType',
        strParentID: 0
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
          var params = {
            strGoodsClass: retJson[0].strID,
            datatype: "getGoodsList",
            strSortRules: 3,
            start: 0,
            limit: 10
          }
          that.getGoodsList(params);
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
  getGoodsList: function(params) {
    let that = this;
    wx.request({
      url: APP.globalData.urlPath,
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
              list: retJson,
              nodatashow: false
            });
          } else {
            that.setData({
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
    });
  },
  goToDetail: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goodslist = that.data.list;
    let detail = {};
    let goodsdetail = goodslist[index];
    let goodspics = goodsdetail.strProp1;
    let photoList = [];
    goodspics.forEach(function(element) {
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
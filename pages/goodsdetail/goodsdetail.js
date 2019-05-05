const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    detail: {},
    isFavorite: false,
    hidden: true,
    orderNum: 1,
    animationData: {},
    isjoincart: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //根据本地缓存加载数据
    let that = this;
    wx.getStorage({
      key: 'goodsdetail',
      success(res) {
        that.setData({
          detail: JSON.parse(res.data)
        });
      }
    })
  },
  onShow: function(options) {
    const animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
  },
  homePage: function(e) {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  takeFavorite: function(e) {
    var isFavorite = !this.data.isFavorite;
    this.setData({
      isFavorite: isFavorite
    });
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    var imageArry = [];
    var photoList = this.data.detail.photoList;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: photoList // 需要预览的图片http链接列表
    });
  },
  takeCart: function(e) {
    var hidden = !this.data.hidden;
    this.animation.height('783rpx').step();
    this.setData({
      animationData: this.animation.export(),
      isjoincart: true
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        hidden: hidden
      })
    }, 100);
  },
  takeOrder: function(e) {
    var hidden = !this.data.hidden;
    this.animation.height('783rpx').step();
    this.setData({
      animationData: this.animation.export(),
      isjoincart: false
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        hidden: hidden
      })
    }, 100);
  },
  closeModel: function(e) {
    var hidden = !this.data.hidden;
    this.animation.height(0).step();
    this.setData({
      animationData: this.animation.export()
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        hidden: hidden
      })
    }, 100);
  },
  jianBtnTap: function(e) {
    if (this.data.orderNum > 1) {
      var orderNum = this.data.orderNum - 1;
      this.setData({
        orderNum: orderNum
      });
    }
  },
  jiaBtnTap: function(e) {
    var orderNum = this.data.orderNum + 1;
    this.setData({
      orderNum: orderNum
    });
  },
  bindOrderNumInput: function(e) {
    this.setData({
      orderNum: parseInt(e.detail.value)
    });
  },
  confirmTake: function(e) {
    var that = this;
    if (this.data.isjoincart) {
      //调用接口还是保存到本地
      let detail = that.data.detail;
      let openid = App.globalData.openid;
      let orderNum = that.data.orderNum;
      let fSumMoney = parseFloat(detail.price) * parseInt(orderNum);
      let params = {
        version: 1,
        strCarCode: openid,
        strGoodsCode: detail.strGoodsCode,
        strGoodsName: detail.name,
        fMoney: detail.price,
        fPrice: detail.markPrice,
        strURL: detail.logo,
        intCount: orderNum,
        fSumMoney: fSumMoney.toFixed(2),
        intUseScore: detail.intUseScore
      }
      wx.request({
        url: urlPath,
        data: {
          datatype: "setCarGoods",
          strCarCode: openid,
          jsondata: JSON.stringify(params)
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          let result = res.data;
          if (result.errcode == 0) {
            wx.showToast({
              title: '加入购物车成功',
              icon: 'success',
              duration: 1000
            });
            let hidden = !that.data.hidden;
            that.animation.height('0').step();
            that.setData({
              animationData: that.animation.export(),
              isjoincart: false
            });

            setTimeout(function() {
              that.setData({
                hidden: hidden
              })
            }, 100);
          } else {
            wx.showToast({
              title: '加入购物车失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      });
    } else {
      //将数据放到本地，然后跳转到下单页面
      let detail = that.data.detail;
      let openid = App.globalData.openid;
      let orderNum = that.data.orderNum;
      let fSumMoney = parseFloat(detail.price) * parseInt(orderNum);
      let params = [{
        version: 1,
        strCarCode: openid,
        strGoodsCode: detail.strGoodsCode,
        strGoodsName: detail.name,
        fMoney: detail.price,
        fPrice: detail.markPrice,
        strURL: detail.logo,
        intCount: orderNum,
        fSumMoney: fSumMoney.toFixed(2),
        intUseScore: detail.intUseScore
      }];
      wx.setStorage({
        key: "comfireinfo",
        data: JSON.stringify(params)
      });
      wx.navigateTo({
        url: "/pages/comfireorder/comfireorder"
      })
    }
  }


})
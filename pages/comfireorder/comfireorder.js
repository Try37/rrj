const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    is_exit_address: false,
    address: {},
    list: [],
    actualPrice: '0.00',
    message: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let actualPrice = 0;
    let goodslist;
    let that = this;
    wx.getStorage({
      key: "comfireinfo",
      success: function(res) {
        goodslist = JSON.parse(res.data);
        let isfromshopcart = false;
        goodslist.forEach(function(item) {
          if (item.id) {
            isfromshopcart = true;
          }
          actualPrice += parseFloat(item.fSumMoney)
        });
        that.setData({
          list: goodslist,
          isfromshopcart: isfromshopcart,
          actualPrice: actualPrice.toFixed(2)
        });
      }
    });
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
          if (retJson.length > 0) {
            that.setData({
              is_exit_address: true,
              address: retJson[0]
            })
          }
        }
      }
    });
    this.getSumClientScore();
  },
  onShow: function(options) {
    let that = this;
    wx.getStorage({
      key: "addrinfo",
      success: function(res) {
        if (res.data) {
          that.setData({
            address: JSON.parse(res.data)
          });
        }
      }
    })
  },
  bindKeyInput(e) {
    this.setData({
      message: e.detail.value
    });
  },
  setAddress: function() {
    wx.navigateTo({
      url: "/pages/addrselect/addrselect"
    })
  },
  createOrder: function() {
    let that = this;
    let address = that.data.address;
    let openid = App.globalData.openid;
    let jsondata = {
      version: 1,
      intStatus: 10,
      strClientCode: App.globalData.openid,
      strLinkName: address.strName,
      strTel: address.strTel,
      strProvince: address.strProvince,
      strCity: address.strCity,
      strCounty: address.strCounty,
      strAddress: address.strAddress,
      fMoney: that.data.actualPrice,
      strMemo: that.data.message
    };
    let goodslist = that.data.list;
    let arrID = [];
    let fScore = 0;
    if (this.data.isfromshopcart) { //不需要执行保存购物车操作
      goodslist.forEach(function(item) {
        arrID.push(item.id);
        fScore += parseFloat(item.intUseScore);
      });
      jsondata.arrID = arrID;
      jsondata.fScore = fScore.toFixed(2);
      that.setBillMain(jsondata);
    } else { //需要先执行保存购物车操作
      let params = goodslist[0];
      fScore = params.intUseScore;
      jsondata.fScore = fScore.toFixed(2);
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
            arrID.push(result.id);
            jsondata.arrID = arrID;
            that.setBillMain(jsondata);
          } else {
            wx.showToast({
              title: '创建订单失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }
      });
    }
  },
  setBillMain: function(params) {
    let that = this;
    let score = that.data.score;
    if (score < params.fScore) {
      wx.showToast({
        title: '积分不够',
      });
      return;
    }
    wx.request({
      url: urlPath,
      data: {
        datatype: "setBillMain",
        jsondata: JSON.stringify(params)
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let result = res.data;
        if (result.errcode == 0) {
          let strBill = result.strBill;
          let fMoney = result.fMoney;
          that.setData({
            created: true
          });
          wx.showToast({
            title: "创建订单成功",
            duration: 1000
          });
          wx.removeStorage({
            key: 'comfireinfo',
            success(res) {
              console.log(res.data)
            }
          });
          wx.removeStorage({
            key: 'addrinfo',
            success(res) {
              console.log(res.data)
            }
          });
          let openid = App.globalData.openid;
          let orderScore = params.fScore;
          let payUrl = "/pages/pay/pay?name=" + params.strLinkName + "&tel=" + params.strTel + "&orderno=" + strBill + "&amount=" + fMoney + "&openid=" + openid + "&score=" + orderScore;
          payUrl = encodeURI(payUrl);
          wx.navigateTo({
            url: payUrl,
          })
        } else {
          wx.showToast({
            title: '创建订单失败',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });
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
            score: sumscore
          });
        }
      }
    })
  }
})
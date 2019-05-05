const App = getApp();
let urlPath = App.globalData.urlPath;
Page({
  data: {
    info: {}
  },
  onLoad: function() {
    let that = this;
    wx.getStorage({
      key: 'serverinfo',
      success: function(res) {
        let info = JSON.parse(res.data);
        that.setData({
          info: info
        })
      },
    })
  }
})
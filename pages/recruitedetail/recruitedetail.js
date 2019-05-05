Page({
  data: {
    detail: {}
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    wx.getStorage({
      key: 'recruitdetail',
      success: function(res) {
        console.log(res);
        let detail = JSON.parse(res.data);
        that.setData({
          detail
        })
      },
    })
  }
})
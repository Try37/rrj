Page({
    data: {
        orderDetail: {}
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        let that = this;
        wx.getStorage({
            key: "orderdetail",
            success: function(res) {
                let orderDetail = JSON.parse(res.data);
                that.setData({
                    orderDetail: orderDetail
                })
            }
        })
    }
})
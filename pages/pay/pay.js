const App = getApp();
Page({
  data: {},
  onLoad: function(e) {
    let url = "https://rrj.ldcc.cc/storeHT/pay_message/confirmpay.html?name=" + e.name + "&tel=" + e.tel + "&orderno=" + e.orderno + "&amount=" + e.amount + "&openid=" + e.openid + "&score=" + e.score;
    this.setData({
      weburl: url
    })
  }
})
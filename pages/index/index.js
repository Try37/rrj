const app = getApp()
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        indicatorActiveColor: "#fff",
        imgUrls: [
            "../../images/banner-1.png",
            "../../images/banner-3.png",
            "../../images/banner-2.png",
        ],
        pictureList: [
            '../../images/item-1.png'
        ]
    },
    onLoad: function(options) {},
})
// index.js
const appInstance = getApp();
const { globalData: { defaultCity, defaultCounty } } = appInstance

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: defaultCity,
    county: defaultCounty,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加定位
    // this.getLocation();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { globalData: { defaultCity, defaultCounty } } = appInstance
    this.setData({
      location: defaultCity,
      county: defaultCounty
    })
  },
})

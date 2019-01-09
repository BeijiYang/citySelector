const city = require('../../utils/city.js');
const cityObjs = require('../../utils/city.js');
const config = require('../../utils/config.js');
const utils = require('../../utils/utils.js');
const { isNotEmpty, isChinese } = utils;
const appInstance = getApp();

Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' },],
    commonCityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }],
    countyList: [{ cityCode: 110000, county: 'A区' }, { cityCode: 310000, county: 'B区' }, { cityCode: 440100, county: 'C区' }, { cityCode: 440300, county: 'D区' }, { cityCode: 330100, county: 'E县' }, { cityCode: 320100, county: 'F县' }, { cityCode: 420100, county: 'G县' }],
    inputName: '',
    completeList: [],
    county: '',
    condition: false,
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    searchLetter.map(
      (item, index) => {
        // console.log(item);
        // console.log(index);
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(tempArr);
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList
    });

    this.getLocation();

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  clickLetter: function (e) {
    // console.log(e);
    console.log(e.currentTarget.dataset.letter)
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    // const that = this;
    // wx.showToast({
    //   title: showLetter,
    //   disabled: true,
    //   duration: 500,
    //   complete: function() {
    //     that.setData({
    //       scrollTopId: showLetter,
    //     })
    //   }
    // })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },
  reGetLocation: function () {
    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = this.data.county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({
      url: '../index/index'
    })
  },
  //选择城市
  bindCity: function (e) {
    // console.log("bindCity");
    // console.log(e);
    this.setData({
      condition: true,
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })
    this.selectCounty()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
  },

  bindCounty: function (e) {
    console.log(e);
    this.setData({ county: e.currentTarget.dataset.city })
    appInstance.globalData.defaultCounty = this.data.county
    console.log(appInstance.globalData.defaultCounty);

    wx.switchTab({
      url: '../index/index'
    })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    console.log("hotCity");
    this.setData({
      scrollTop: 0,
    })
  },
  bindScroll: function (e) {
    //  console.log(e.detail)
  },
  selectCounty: function () {
    console.log("正在定位区县");
    let code = this.data.currentCityCode

    wx.request({
      url: `https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`,
      success: res => {
        this.setData({
          countyList: res.data.result[0],
        })
        console.log("请求区县成功" + `https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`);
      },
      fail: () => { console.log("请求区县失败，请重试") }
    })
  },
  getLocation: function () {
    console.log("正在定位城市");
    this.setData({
      county: ''
    })
    // const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
          success: res => {
            this.setData({
              city: res.data.result.ad_info.city,
              currentCityCode: res.data.result.ad_info.adcode,
              county: res.data.result.ad_info.district
            })
            this.selectCounty();
          }
        })
      }
    })
  },
  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({
      inputName: ''
    })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    // console.log("input: " + e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.associativeSearch()
  },
  // 输入框自动联想搜索
  associativeSearch: function () {
    let inputContent = this.data.inputName.trim()
    let content = inputContent.toLowerCase()
    if (!content) {
      this.setData({ completeList: [] })
      return
    }
    // search
    let resultList = this.searchList(content)
    // show
    this.showList(resultList)
  },
  searchList: function (str) {
    const cityList = cityObjs.cityObjs //todo: 导入导出优化
    let targetCity
    return cityList.filter(
      city => {
        targetCity = this.getTargetCity(str, city)
        return (targetCity && targetCity == str)
      }
    )
  },
  getTargetCity: function (str, cityObj) {
    if (isChinese(str)) {
      const slicedChineseName = cityObj.city.slice(0, str.length)
      return slicedChineseName
    } else {
      const slicedPinyinName = cityObj.short.slice(0, str.length).toLowerCase()
      return slicedPinyinName
    }
    // 在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    // cityObj.shorter.slice(0, len).toLowerCase()
  },
  showList: function (array) {
    if (isNotEmpty(array)) {
      let finalCityList = array.map(item => ({ city: item.city, code: item.code }))
      this.setData({
        completeList: finalCityList,
      })
    } else {
      this.setData({
        completeList: [{ city: '无匹配城市', code: "000" }]
      })
    }
  },
})

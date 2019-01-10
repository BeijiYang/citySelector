import { LETTERS, CITY_LIST, HOT_CITY_LIST } from '../../locale/citydata'
import utils from '../../utils/utils'

const {
  isNotEmpty,
  isChinese,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl
} = utils;
const appInstance = getApp();

Page({
  data: {
    sideBarLetterList: [],
    winHeight: 0,
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: true,
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      // itemH: itemH,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });
    // 定位
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

  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    // const chosenLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
  },
  //选择城市
  chooseCity: function (e) {
    const { city, code } = safeGet(['currentTarget', 'dataset'], e)
    // const { city, code } = e.currentTarget.dataset
    this.setData({
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
    })
    this.getCountyList()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
  },

  chooseCounty: function (e) {
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
    console.log(county)
    this.setData({ county })
    appInstance.globalData.defaultCounty = county
    // 返回首页
    wx.switchTab({ url: getIndexUrl() })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({ scrollTop: 0 })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  getCountyList: function () {
    console.log("正在获取区县");
    const code = this.data.currentCityCode

    wx.request({
      url: getCountyListUrl(code),
      success: res => {
        const resultArray = safeGet(['data', 'result'], res)
        const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
        console.log(countyList)
        this.setData({ countyList })
      },
      fail: () => { console.error("请求区县失败，请重试") }
    })
  },
  getLocation: function () {
    console.log("正在定位城市");
    this.setData({ county: '' })

    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const { latitude, longitude } = res
        wx.request({
          url: getLocationUrl(latitude, longitude),
          success: res => {
            const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], res)
            this.setData({
              city,
              currentCityCode: adcode,
              county: district
            })
            console.log(city)
            appInstance.globalData.defaultCity = city
            this.getCountyList();
          }
        })
      },
      fail: () => { console.error("定位失败，请重试") }
    })
  },
  reGetLocation: function () {
    const { city, county } = this.data
    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({ url: getIndexUrl() })
  },
  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({ inputName: '' })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    this.setData({ inputName: e.detail.value })
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
    let targetCity
    return CITY_LIST.filter(
      city => {
        targetCity = this.getTargetCity(str, city)
        return (targetCity && targetCity == str)
      }
    )
  },
  getTargetCity: function (str, cityObj) {
    if (isChinese(str)) {
      const slicedChineseName = cityObj.city && cityObj.city.slice(0, str.length)
      return slicedChineseName
    } else {
      const slicedPinyinName = cityObj.short && cityObj.short.slice(0, str.length).toLowerCase()
      return slicedPinyinName
    }
    // 在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    // cityObj.shorter.slice(0, len).toLowerCase()
  },
  showList: function (array) {
    if (isNotEmpty(array)) {
      let finalCityList = array.map(item => ({ city: item.city, code: item.code }))
      this.setData({ completeList: finalCityList })
    } else {
      this.setData({ completeList: [{ city: '无匹配城市', code: "000" }] })
    }
  },
})

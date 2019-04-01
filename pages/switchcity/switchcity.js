import { LETTERS, HOT_CITY_LIST } from '../../locale/citydata'
import { AutoPredictor } from '../../utils/autoPredictor'
import utils from '../../utils/utils'

const {
  isNotEmpty,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl,
  onFail,
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
    city: "定位中", //todo 换
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: false,
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      sideBarLetterList,
      cityList: cityListSortedByInitialLetter
    });
    // 定位
    this.getLocation();
  },

  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
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
    this.setData({
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      county: ''
    })
    this.getCountyList()

    appInstance.globalData.defaultCity = city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
  },

  chooseCounty: function (e) {
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
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
      success: res => this.setCountyList(res),
      fail: onFail("请求区县失败，请重试"),// TODO
    })
  },

  setCountyList: function (res) {
    const resultArray = safeGet(['data', 'result'], res)
    const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
    console.log(countyList)
    this.setData({ countyList })
  },

  getLocation: function () {
    console.log("正在定位城市");
    this.setData({ county: '' })
    wx.getLocation({
      type: 'wgs84',
      success: res => this.getLocationFromGeoCoord(res),
      fail: onFail("定位失败，请重试"),// TODO
    })
  },

  getLocationFromGeoCoord: function (geoCoord) {
    const { latitude, longitude } = geoCoord
    wx.request({
      url: getLocationUrl(latitude, longitude),
      success: location => this.setCityCounty(location)
    })
  },

  setCityCounty: function (location) {
    const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location)
    this.setData({
      city,
      currentCityCode: adcode,
      county: district
    })
    console.log(city)
    appInstance.globalData.defaultCity = city
    // this.getCountyList();
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
    this.setData({
      inputName: '',
      completeList: []
    })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    let inputName = e.detail.value.trim()
    this.setData({ inputName })
    if (!inputName) {
      this.setData({ completeList: [] })
    }
    this.useAutoPredictor(inputName)
  },
  // 输入框自动联想搜索
  useAutoPredictor: function (content) {
    let autoPredictor = new AutoPredictor(content)
    let completeList = autoPredictor.associativeSearch()
    this.setData({ completeList })
  },
})

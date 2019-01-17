import { CITY_LIST, CITY_NOT_FOUND } from '../locale/citydata'
import utils from 'utils'

const { isNotEmpty, isChinese } = utils;

// 接收输入框输入的值，返回最终匹配到的数组
export class AutoPredictor {
  constructor(inputContent) {
    this.content = inputContent.toLowerCase()
  }

  // 输入框自动联想搜索
  associativeSearch() {
    // search
    let tempList = this.searchList(this.content)
    // get final list to show
    let resultList = this.showList(tempList)
    return resultList
  }

  searchList(str) {
    let targetCity
    return CITY_LIST.filter(
      city => {
        targetCity = this.getTargetCity(str, city)
        return (targetCity && targetCity == str)
      }
    )
  }

  getTargetCity(str, cityObj) {
    if (isChinese(str)) {
      const slicedChineseName = cityObj.city && cityObj.city.slice(0, str.length) // todo: 相似逻辑 抽象之。数据与逻辑分离
      return slicedChineseName
    } else {
      const slicedPinyinName = cityObj.short && cityObj.short.slice(0, str.length).toLowerCase()
      return slicedPinyinName
    }
    // 在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    // cityObj.shorter.slice(0, len).toLowerCase()
  }

  showList(array) {
    return isNotEmpty(array) ? array.map(item => ({ city: item.city, code: item.code })) : CITY_NOT_FOUND
  }
}
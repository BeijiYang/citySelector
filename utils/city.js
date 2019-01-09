import {
  searchLetterArr as searchLetter,
  cityArrOne as cityObj,
  cityArrTwo as cityObjs,
} from 'locale/citydata'

// 对城市信息进行分组
const cityList = () => (
  searchLetter.map(
    initial => ({ //initialLetter
      initial,
      cityInfo: cityObj.filter(city => city.initial == initial)
    })
  )
)

module.exports = {
  searchLetter,
  cityList,
  cityObjs
}

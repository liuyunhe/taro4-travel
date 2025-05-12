import { View, Text } from '@tarojs/components'
import { useAirportModel } from '@/model/airport-model'
import Taro from '@tarojs/taro'

import './index.scss'

const CityItem = ({
  label,
  cityList
}) => {
  // hox 的 store 订阅 hook
  const {
    airportInfoState: {
      cityType
    },
    changeAirportInfo,
  } = useAirportModel()

  const clickHandlerChooseCityInfo = ({
    cityId,
    airportName,
    cityName
  }) => {
    const newPortInfo = {
      depart: {
        dptCityId: cityId,
        dptCityName: cityName,
        dptAirportName: airportName
      },
      arrive: {
        arrCityId: cityId,
        arrCityName: cityName,
        arrAirportName: airportName
      }
    }
    changeAirportInfo(newPortInfo[cityType])
    Taro.navigateBack();
  }

  return (
    <view className='list-item' id={label}>
      <Text className='label'>
        {label}
      </Text>
      {
        cityList.map(o => {
          return (
            <View className='name' key={o.id} onClick={() => clickHandlerChooseCityInfo(o)}>
              {
                `${o.cityName} ( ${o.airportName} )`
              }
            </View>
          )
        })
      }
    </view>
  )
}

export default CityItem

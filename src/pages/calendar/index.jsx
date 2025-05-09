import { View } from '@tarojs/components'
import { AtCalendar } from "taro-ui"
import Taro from '@tarojs/taro'
import { useAirportModel } from '@/model/airport-model'
import {
  MIN_DATE,
  MAX_DATE
} from '@/common/constant'

import './index.scss'


// import {request} from '../../common/utils'

const Calendar = () => {

  const {
    airportInfoState: {
      dptDate
    },
    changeAirportInfo,
  } = useAirportModel()

  return (
    <View className='calendar-page'>
      <AtCalendar
        currentDate={dptDate}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        onSelectDate={(d) => {
          const {
            value: { start }
          } = d
          // 修改出发时间
          changeAirportInfo({ dptDate: start })
          Taro.navigateBack()
        }}
      />
    </View>
  )
}


export default Calendar

import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import apis from '@/api'
import { ERR_NET_MESSAGE } from '@/common/constant'
import { useEffect, useState } from 'react'
import CityItem from './component/cityitem'
import './index.scss'

const mockData = {
  result: [
    // A 组
    { id: 1, cityName: '安庆', airportName: '天柱山机场', firstLetter: 'A' },
    { id: 2, cityName: '鞍山', airportName: '腾鳌机场', firstLetter: 'A' },
    { id: 3, cityName: '安顺', airportName: '黄果树机场', firstLetter: 'A' },

    // B 组
    {
      id: 4,
      cityName: '北京',
      airportName: '首都国际机场',
      firstLetter: 'B',
      isHot: true,
    },
    { id: 5, cityName: '包头', airportName: '东河机场', firstLetter: 'B' },
    { id: 6, cityName: '北海', airportName: '福成机场', firstLetter: 'B' },

    // C 组
    {
      id: 7,
      cityName: '成都',
      airportName: '双流国际机场',
      firstLetter: 'C',
      isHot: true,
    },
    { id: 8, cityName: '重庆', airportName: '江北国际机场', firstLetter: 'C' },
    { id: 9, cityName: '长春', airportName: '龙嘉国际机场', firstLetter: 'C' },

    // D 组
    {
      id: 10,
      cityName: '大连',
      airportName: '周水子国际机场',
      firstLetter: 'D',
    },
    { id: 11, cityName: '敦煌', airportName: '莫高国际机场', firstLetter: 'D' },
    { id: 12, cityName: '丹东', airportName: '浪头国际机场', firstLetter: 'D' },

    // E 组
    {
      id: 13,
      cityName: '鄂尔多斯',
      airportName: '伊金霍洛国际机场',
      firstLetter: 'E',
    },

    // F 组
    { id: 14, cityName: '福州', airportName: '长乐国际机场', firstLetter: 'F' },
    { id: 15, cityName: '阜阳', airportName: '西关机场', firstLetter: 'F' },

    // G 组
    {
      id: 16,
      cityName: '广州',
      airportName: '白云国际机场',
      firstLetter: 'G',
      isHot: true,
    },
    {
      id: 17,
      cityName: '贵阳',
      airportName: '龙洞堡国际机场',
      firstLetter: 'G',
    },
    { id: 18, cityName: '桂林', airportName: '两江国际机场', firstLetter: 'G' },

    // H 组
    {
      id: 19,
      cityName: '杭州',
      airportName: '萧山国际机场',
      firstLetter: 'H',
      isHot: true,
    },
    { id: 20, cityName: '海口', airportName: '美兰国际机场', firstLetter: 'H' },
    {
      id: 21,
      cityName: '哈尔滨',
      airportName: '太平国际机场',
      firstLetter: 'H',
    },

    // J 组
    { id: 22, cityName: '济南', airportName: '遥墙国际机场', firstLetter: 'J' },
    { id: 23, cityName: '景德镇', airportName: '罗家机场', firstLetter: 'J' },
    { id: 24, cityName: '九寨沟', airportName: '黄龙机场', firstLetter: 'J' },

    // K 组
    {
      id: 25,
      cityName: '昆明',
      airportName: '长水国际机场',
      firstLetter: 'K',
      isHot: true,
    },
    { id: 26, cityName: '喀什', airportName: '徕宁国际机场', firstLetter: 'K' },
    { id: 27, cityName: '库尔勒', airportName: '梨城机场', firstLetter: 'K' },

    // L 组
    { id: 28, cityName: '拉萨', airportName: '贡嘎国际机场', firstLetter: 'L' },
    { id: 29, cityName: '兰州', airportName: '中川国际机场', firstLetter: 'L' },
    { id: 30, cityName: '丽江', airportName: '三义国际机场', firstLetter: 'L' },

    // M 组
    { id: 31, cityName: '绵阳', airportName: '南郊机场', firstLetter: 'M' },
    {
      id: 32,
      cityName: '满洲里',
      airportName: '西郊国际机场',
      firstLetter: 'M',
    },

    // N 组
    {
      id: 33,
      cityName: '南京',
      airportName: '禄口国际机场',
      firstLetter: 'N',
      isHot: true,
    },
    { id: 34, cityName: '宁波', airportName: '栎社国际机场', firstLetter: 'N' },
    { id: 35, cityName: '南宁', airportName: '吴圩国际机场', firstLetter: 'N' },

    // Q 组
    { id: 36, cityName: '青岛', airportName: '胶东国际机场', firstLetter: 'Q' },
    { id: 37, cityName: '泉州', airportName: '晋江国际机场', firstLetter: 'Q' },

    // S 组
    {
      id: 38,
      cityName: '上海',
      airportName: '浦东国际机场',
      firstLetter: 'S',
      isHot: true,
    },
    {
      id: 39,
      cityName: '深圳',
      airportName: '宝安国际机场',
      firstLetter: 'S',
      isHot: true,
    },
    { id: 40, cityName: '三亚', airportName: '凤凰国际机场', firstLetter: 'S' },

    // T 组
    { id: 41, cityName: '天津', airportName: '滨海国际机场', firstLetter: 'T' },
    { id: 42, cityName: '太原', airportName: '武宿国际机场', firstLetter: 'T' },

    // W 组
    { id: 43, cityName: '武汉', airportName: '天河国际机场', firstLetter: 'W' },
    {
      id: 44,
      cityName: '乌鲁木齐',
      airportName: '地窝堡国际机场',
      firstLetter: 'W',
    },
    { id: 45, cityName: '温州', airportName: '龙湾国际机场', firstLetter: 'W' },

    // X 组
    {
      id: 46,
      cityName: '西安',
      airportName: '咸阳国际机场',
      firstLetter: 'X',
      isHot: true,
    },
    {
      id: 47,
      cityName: '西宁',
      airportName: '曹家堡国际机场',
      firstLetter: 'X',
    },
    { id: 48, cityName: '厦门', airportName: '高崎国际机场', firstLetter: 'X' },

    // Y 组
    { id: 49, cityName: '银川', airportName: '河东国际机场', firstLetter: 'Y' },

    // Z 组
    { id: 50, cityName: '珠海', airportName: '金湾国际机场', firstLetter: 'Z' },
  ],
};

const AirportList = () => {
  const [letterCityList, setLetterCityList] = useState([])
  const [cityList, setCityList] = useState([])
  const [scrollIntoId, setScrollIntoId] = useState(null)  //点击字母滚动的 ID

  // 请求城市
  const getAirPostList = () => {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    apis.airportCityListReq()
      .then(res => {
        const {
          result
        } = res

        if ( result ) {
          const cityObj =  handlerCityLetter(result)
          setLetterCityList([...cityObj.keys()])
          setCityList(cityObj)
        }
      }).catch(err => {
        console.log(err)
        Taro.showToast(ERR_NET_MESSAGE)
        const cityObj = handlerCityLetter(mockData.result);
        setLetterCityList([...cityObj.keys()]);
        setCityList(cityObj);
      }).finally(() => {
        Taro.hideLoading()
      })
  }

  // 截取城市字母ABCD 排序规则
  const handlerCityLetter = D => {
    if ( !D.length ) return
    const result = new Map()

    for ( let i = 0; i < D.length; i++ ) {
      const letter = D[i].firstLetter
      if ( !result.has(letter) ) {
        result.set(letter, [])
      }
      result.set(letter, result.get(letter).concat(D[i]))
    }
    return result
  }

  useEffect(() => {
    getAirPostList()
  }, [])

  return (
    <View className='airport-list-container'>
      <ScrollView
        scrollY
        scrollIntoView={scrollIntoId}
        scrollWithAnimation
        style={{ 'height': '100vh' }}
      >
        {
          Array.from(cityList, ([key, value]) => {
            return <CityItem
              key={key}
              label={key}
              cityList={value}
            />
          })
        }
      </ScrollView>
      <View className='letter-container'>
        {
          letterCityList?.map(_ => (
            <View onClick={() => setScrollIntoId(_)} key={_} className='letter-item'>
              <Text>{ _ }</Text>
            </View>
          ))
        }
      </View>
    </View>
  )
}


export default AirportList

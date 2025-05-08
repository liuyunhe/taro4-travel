import { View, SwiperItem, Swiper, Text, Image, Button } from "@tarojs/components";
import Taro, { useReady } from '@tarojs/taro'
import dayjs from 'dayjs'
import Tab from "../../../components/Tab";
import NoExploit from '../../../components/noExploit'
import { useState, useEffect } from "react";
import { useAirportModel } from '@/model/airport-model'
import { navigateTo, request } from '@/common/utils'

import apis from '../../../api'

import "./index.scss";

const FLIGHT_TABS = [
  {
    label: '单程',
    id: 0
  },
  {
    label: '多程',
    id: 1
  },
  {
    label: '往返',
    id: 2
  }
]

const FlightIndex = () => {
  // hox 的 store 订阅 hook
  const {
    airportInfoState: {
      dptCityName,   // 出发城市
      dptDate,      // 出发日期
      dptAirportName,
      arrCityId,
      arrCityName,   // 到达城市
      arrAirportName,
      cityType
    },
    changeAirportInfo,
  } = useAirportModel()

  const [isExchange, setIsExchange] = useState(false)
  const [adList, setAdList] = useState([])

  const onTaClickHanlder = () => {
    console.log(11)
  }

  // 改变当前选择的城市 出发类型
  const chooseFlightCity = (ct) => {
    changeAirportInfo({ cityType: ct })
    Taro.navigateTo({
      url: '/pages/airportlist/index'
    })
  }

  // 获取用户定位
  const getLocation = () => {
    Taro.getLocation({
      isHighAccuracy: true,
      type: 'gcj02'
    }).then(res => {
      // 经纬度
      const {
        latitude,
        longitude
      } = res

      // 微信小程序中实现定位以及逆地址解析
      //https://developers.weixin.qq.com/community/develop/article/doc/00040c93bc00b8298acb46e6456813 注册腾讯地址获取 KEY
      // 请求腾讯地图接口获取准确地址
      request({
        url: `https://apis.map.qq.com/ws/geocoder/v1/?key=JKLBZ-WN3K4-HFSU6-DB5UU-2FGCS-CLB4J&location=${latitude},${longitude}`
      })
        .then( addr => {
          const {
            result: {
              ad_info: {
                city_code,
                city
              }  // 准确地址
            }
          } = addr

          // 修改出发城市的城市 城市默认就是定位城市
          changeAirportInfo({
            dptCityName: city || '上海',
            dptCityId: city_code || 2
          })
        })
    })
      .catch( () => {
        Taro.showToast({
          title: '获取位置失败',
          icon: 'error'
        })
      })
  }

  useEffect(() => {
    apis.adsBannerImg()
      .then(res => {
        const {
          result
        } = res
        if (result) {
          setAdList(result)
        }
      }).catch(err => {
        console.log(err)
      })
    // getLocation()
  }, [])

  // 只执行一次的周期
  useReady(() => {
    getLocation()
  })

  return <View className='flight-container'>
    <View className='flight-top'>
      <Tab tabList={FLIGHT_TABS} initTab={0} onTaClick={onTaClickHanlder} className='flight-index-tab'>
        {/*  单程  */}
        <SwiperItem>
          <View className='item station'>
            <View
              className={`cell from ${isExchange ? "exchange" : ""}`}
              onClick={() => chooseFlightCity("depart")}
            >
              {dptCityName}
            </View>
            <Text
              onClick={() => {
                console.log(3333)
                setIsExchange((v) => !v)
              }}
              className={`icon-zhihuan iconfont ${
                isExchange ? "active" : ""
              }`}
            >
            </Text>
            <View
              className={`cell to ${isExchange ? "exchange" : ""}`}
              onClick={() => chooseFlightCity("arrive")}
            >
              {arrCityName}
            </View>
          </View>
          <View className='item date'onClick={
            () => {
              navigateTo('/pages/calendar/index')
            }
          }
          >
            { dayjs(dptDate).format('M月D日') }
          </View>
          <Button className='search-btn' onClick={() => {
            navigateTo(
              '/pages/flight/list/list',
              {
                dptCityName,   // 出发城市
                dptDate,      // 出发日期
                dptAirportName,
                arrCityId,
                arrCityName,   // 到达城市
                arrAirportName,
                cityType
              }
            )
          }}
          >
              机票查询
          </Button>
        </SwiperItem>
        {/*  往返  */}
        <SwiperItem>
          <NoExploit className='no-data' />
        </SwiperItem>
        {/*  多程  */}
        <SwiperItem>
          <NoExploit className='no-data' />
        </SwiperItem>
      </Tab>
    </View>
    <View className='alipay-swiper' style={{margin: '15px'}}>
      <Swiper className='advs-banner-bd' autoplay circular interval={3000}>
        {
          adList?.map(item => {
            return (
              <SwiperItem key={item?.id} className='item'>
                <Image className='img' src={item?.url}></Image>
              </SwiperItem>
            )
          })
        }
      </Swiper>
    </View>
  </View>;
};

export default FlightIndex;

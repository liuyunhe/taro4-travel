import { View, Text, ScrollView, Block, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import { weekDay, navigateTo } from '@/common/utils';
import { useAirportModel } from '@/model/airport-model';
import Skeleton from 'taro-skeleton';
// import VirtualList from '@/components/virtualList'
import apis from '@/api';
import { MIN_DATE, MAX_DATE, ERR_NET_MESSAGE } from '@/common/constant';
import { useEffect, useState, useMemo } from 'react';
// import {request} from '../../common/utils'

import './list.scss';
import 'taro-skeleton/dist/index.css';

const formatDateList = () => {
  console.log('🚀 ~ formatDateList ~ formatDateList:','do')
  let minStr = dayjs(MIN_DATE).valueOf();
  const maxStr = dayjs(MAX_DATE).valueOf();

  const dayStr = 1000 * 60 * 60 * 24; // 一天
  let res = [];
  for (; minStr <= maxStr; minStr += dayStr) {
    res.push({
      dateStr: dayjs(minStr).format('YYYY-MM-DD'),
      day: dayjs(minStr).format('M-DD'),
      week: weekDay(minStr),
    });
  }
  return res;
};

const FlightList = () => {
  console.log('🚀 ~ FlightList ~ FlightList:','do')
  // hox 的 store 订阅 hook
  const {
    airportInfoState: {
      dptCityId,
      dptCityName, // 出发城市
      dptDate, // 出发日期
      dptAirportName,
      arrCityId,
      arrCityName, // 到达城市
      arrAirportName,
      // cityType
    },
    changeAirportInfo,
  } = useAirportModel();

  const [flightList, setFlightList] = useState([]); // 航班列表
  // const [scrollTop, setScrollTop] = useState('')

  // eslint-disable-next-line
  const [flightInfo, setFlightInfo] = useState({
    dptCityId,
    dptCityName,
    arrCityId,
    arrCityName,
    dptDate,
    arrAirportName,
    dptAirportName,
  }); // 当前选择的航班信息

  // 日期列表
  const dateList = useMemo(() => {
    return formatDateList();
  }, []);

  const chooseDate = (dateStr) => {
    console.log('🚀 ~ chooseDate ~ dateStr:', dateStr);
    changeAirportInfo({
      dptDate: dateStr,
    })
  };

  // 请求航班信息列表
  const getAirFlightList = () => {
    Taro.showLoading({
      title: '加载中',
      mask: true,
    });
    apis
      .airFlightListReq({
        ...flightInfo,
      })
      .then((res) => {
        const { result } = res;

        if (result) {
          setFlightList(result);
        }
      })
      .catch(() => {
        Taro.showToast(ERR_NET_MESSAGE);
      })
      .finally(() => {
        Taro.hideLoading();
      });
  };

  useEffect(() => {
    getAirFlightList();
  }, [dptDate]);

  useEffect(() => {
    // 通过 Taro实例 获取 路由参数
    const { params } = Taro.getCurrentInstance().router;

    Taro.setNavigationBarTitle({
      title: `${decodeURIComponent(params?.dptCityName)} - ${decodeURIComponent(
        params?.arrCityName,
      )}`,
    });
  }, []);

  // // 提供给虚拟列表的 item 渲染函数
  // const onRenderItem = (flight, index) => {
  //   const {
  //     dptTimeStr,
  //     arrTimeStr,
  //     airIcon,
  //     airCompanyName,
  //     price,
  //   } = flight;
  //   return (
  //     <Block key={flight.id}>
  //       {
  //         index === 3 && (
  //           <View className='notice'>
  //             <Image className='notice-logo' src='https://i.postimg.cc/dhGPDTjq/2.png'></Image>
  //             <Text className='notice-text'>价格可能会上涨，建议尽快预定</Text>
  //           </View>
  //         )
  //       }
  //       <View
  //         className='list-item'
  //         onClick={() => {
  //           navigateTo('/pages/flight/detail/detail', {
  //             ...flight
  //           })
  //         }}
  //       >
  //         <View className='item-price'>
  //           <View className='flight-row'>
  //             <View className='depart'>
  //               <Text className='flight-time'>{dptTimeStr}</Text>
  //               <Text className='airport-name'>
  //                 {dptAirportName}
  //               </Text>
  //             </View>
  //             <View className='separator'>
  //               <View className='spt-arr'></View>
  //             </View>
  //             <View className='arrival'>
  //               <Text className='flight-time'>{arrTimeStr}</Text>
  //               <Text className='airport-name'>
  //                 {arrAirportName}
  //               </Text>
  //             </View>
  //           </View>
  //           <Text className='flight-price color-red'>
  //             ¥ {price}
  //           </Text>
  //         </View>
  //         <View className='air-info'>
  //           <Image className='logo' src={airIcon} />
  //           <Text className='company-name'>{airCompanyName}</Text>
  //         </View>
  //       </View>
  //     </Block>
  //   )
  // }

  return (
    <View className='list-container'>
      <View className='calendar-list'>
        <ScrollView
          className='calendar-scroll-list'
          scrollX
          scrollWithAnimation
          scrollIntoView={`date-${dptDate}`}
        >
          {dateList.map((date) => {
            return (
              <View
                key={date.dateStr}
                className={`item ${date.dateStr === dptDate ? 'cur' : ''}`}
                id={`date-${date.dateStr}`}
                onClick={() => chooseDate(date.dateStr)}
              >
                <View className='date'>{date.day}</View>
                <View className='week'>{date.week}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {flightList.length ? (
        <View id='flight-list'>
          {/* 性能优化篇：虚拟列表 */}
          {/* <VirtualList
            className='flight-scroll-list'
            list={flightList}
            onRender={onRenderItem}
          /> */}
          <ScrollView
            className='flight-scroll-list'
            scrollY
            // scrollTop={scrollTop}
          >
            {flightList?.map((flight, index) => {
              const {
                // dptAirportName,
                dptTimeStr,
                arrTimeStr,
                // arrAirportName,
                airIcon,
                airCompanyName,
                price,
              } = flight;
              return (
                <Block key={flight.id}>
                  {index === 3 && (
                    <View className='notice'>
                      <Image
                        className='notice-logo'
                        src='https://i.postimg.cc/dhGPDTjq/2.png'
                      ></Image>
                      <Text className='notice-text'>
                        价格可能会上涨，建议尽快预定
                      </Text>
                    </View>
                  )}
                  <View
                    className='list-item'
                    onClick={() => {
                      navigateTo('/pages/flight/detail/detail', {
                        ...flight,
                      });
                    }}
                  >
                    <View className='item-price'>
                      <View className='flight-row'>
                        <View className='depart'>
                          <Text className='flight-time'>{dptTimeStr}</Text>
                          <Text className='airport-name'>{dptAirportName}</Text>
                        </View>
                        <View className='separator'>
                          <View className='spt-arr'></View>
                        </View>
                        <View className='arrival'>
                          <Text className='flight-time'>{arrTimeStr}</Text>
                          <Text className='airport-name'>{arrAirportName}</Text>
                        </View>
                      </View>
                      <Text className='flight-price color-red'>¥ {price}</Text>
                    </View>
                    <View className='air-info'>
                      <Image className='logo' src={airIcon} />
                      <Text className='company-name'>{airCompanyName}</Text>
                    </View>
                  </View>
                </Block>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View className='skeleton-box'>
          {Array(7)
            .fill(0)
            .map((item, index) => {
              return <Skeleton key={index} row={3} action rowHeight={34} />;
            })}
        </View>
      )}
      {/* <View className={`flilter-btn ${flightList?.length ? "" : "hidden"}`}>
        <Picker
          range={flightCompanyList}
          value={curAirCompanyIndex}
          onChange={this.onAirCompanyChange}
        >
        筛选
        </Picker>
      </View> */}
    </View>
  );
};

export default FlightList;

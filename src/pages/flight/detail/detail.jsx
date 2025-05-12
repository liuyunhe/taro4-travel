
import { View,Text, Image, Button, Input } from "@tarojs/components";
// eslint-disable-next-line
import Taro, { getCurrentInstance, useShareAppMessage, showToast, showLoading, hideLoading, switchTab } from '@tarojs/taro'
import dayjs from 'dayjs'
import { useState, useEffect } from "react";
import { useUserInfoModel } from '@/model/userInfo-model'
import apis from '@/api'


import "./index.scss";


// 航班详情页
const FlightDetail = (props) => {
  // eslint-disable-next-line
  const [nowSelectedFlight, setNowSelectedFlight] = useState(getCurrentInstance()?.router?.params)

  const {
    airCompanyName,
    airIcon,
    arrAirportName,
    arrTimeStr,
    dptAirportName,
    dptTime,
    dptTimeStr,
    price,
  } = nowSelectedFlight

  // hox 的 store 订阅 hook
  const {
    // eslint-disable-next-line
      userInfoState: {
      isLogin,
      userPhone,
      nickName
    }
  } = useUserInfoModel()

  useEffect(() => {
    console.log(isLogin, userPhone, nickName)
  }, [])


  // 分享
  useShareAppMessage(()=> {
    return {
      title: '美好的行程，一起来玩吧',
      path: `/${props?.tid}`,
      imageUrl: 'http://www.picsum.photos/400/300',
    }
  })

  const createOrderHandler = () => {
    showLoading()
    apis.postCreateOrder({
      userPhone,
      orderInfo: nowSelectedFlight
    })
      .then(res => {
        const {
          message,
          code
        } = res

        //  成功
        if (code === 1) {
          showToast(
            {
              title: message,
              icon: 'success',
              duration: 1000,
              complete() {
                // switchTab({
                //   url: '/pages/order/order'
                // })
              }
            }
          )
          // 失败
        } else {
          showToast(
            {
              title: message,
              icon: 'error',
              duration: 1000
            }
          )
        }
      }).catch(() => {
        showToast(
          {
            title: '网络错误',
            icon: 'error',
            duration: 1000
          }
        )
      }).finally(() => {
        hideLoading()
      })
  }

  return (
    <View className='detail-container'>
      <View className='flight-segment'>
        <View className='info-head'>
          <View className='tag'>直飞</View>
          <View className='company-info'>
            <Image src={airIcon} className='logo'></Image>
            {`${airCompanyName} ${dayjs(dptTime).format("M月D日")}`}
          </View>
        </View>
        <View className='info-detail'>
          <View className='from'>
            <View className='time'>{dptTimeStr}</View>
            <View className='station'>{dptAirportName}</View>
          </View>
          <Image
            className='mid'
            src='https://i.postimg.cc/z3P1QNf1/1.png'
          ></Image>
          <View className='to'>
            <View className='time'>{arrTimeStr}</View>
            <View className='station'>{arrAirportName}</View>
          </View>
        </View>
      </View>
      <View className='passenger-box module-box'>
        <Text className='title'>乘机人</Text>
        {
          isLogin ? <View className='name'>{nickName}</View> : <Button className='add-btn name' >新增</Button>
        }
      </View>
      <View className='passenger-box module-box'>
        <Text className='title'>联系手机</Text>
        <View className='phone-box'>
          <Text className='num-pre'>+86 </Text>
          <Input disabled placeholder='请输入乘机人手机号' value={userPhone}></Input>
        </View>
      </View>
      {/* 测试Taro bug */}
      {/* <Switch
      onChange={this.onSwitchChange}
    ></Switch>
    <View>
      {
        isChecked ? (
          <View className="module-box">
            <Text className="title">保险</Text>
            <View className="insurance-name">
              <Text>人身意外险</Text>
              <Text>¥ 30/人</Text>
            </View>
          </View>
        ) : null
      }
    </View> */}
      <View className='price-item'>
        <View className='color-red'>
        ¥ <Text className='price color-red'>{price}</Text>
        </View>
        <View className='order-btn' onClick={createOrderHandler}>订</View>
      </View>
      <Button className='share-btn' openType='share'>快将行程分享给好友吧</Button>
      {/*  机票底部  */}
      <View className='flight-info'></View>
    </View>
  )
};

export default FlightDetail;

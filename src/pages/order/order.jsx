import { View, Text, SwiperItem, Button, ScrollView } from '@tarojs/components';
import { useUserInfoModel } from '@/model/userInfo-model';
import Tab from '@/components/Tab';
import apis from '@/api';
import {
  removeStorageSync,
  showToast,
  useDidShow,
  showLoading,
  hideLoading,
} from '@tarojs/taro';
import NoExploit from '@/components/noexploit';
import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import { isBaiDu, navigateTo } from '@/common/utils';
import './order.scss';

const Order = () => {
  // hox 的 store 订阅 hook
  const {
    // eslint-disable-next-line
    userInfoState: { isLogin, userPhone, nickName },
    changeUserInfoState,
  } = useUserInfoModel();

  const [isRefresh, setIsRefresh] = useState(false);
  const [orderList, setOrderList] = useState([]);

  const TAB_LIST = [
    {
      label: '机票',
      id: 0,
    },
    {
      label: '火车票',
      id: 1,
    },
    {
      label: '酒店',
      id: 2,
    },
    {
      label: '汽车票',
      id: 3,
    },
  ];

  const getListHandler = () => {
    showLoading();
    apis
      .postGetOrderList({
        userPhone,
      })
      .then((res) => {
        const { result, code } = res;
        //  成功
        if (code === 1) {
          setOrderList(result || []);
        }
      })
      .catch((err) => {
        showToast({
          title: err?.message || '网络错误',
          icon: 'error',
          duration: 1000,
        });
      })
      .finally(() => {
        hideLoading();
        setIsRefresh(false);
      });
  };

  useDidShow(() => {
    if (isLogin) {
      getListHandler();
    }
  });

  const handlePullDownRefresh = useCallback(() => {
    setIsRefresh(true);
    getListHandler();
  }, []);

  const renderListItem = () => {
    return orderList?.length ? (
      <ScrollView
        scrollY
        style={{ height: '100%' }}
        className='order-list-box'
        refresherEnabled
        refresherTriggered={isRefresh}
        onRefresherRefresh={handlePullDownRefresh}
      >
        {orderList.map((item) => {
          const { dptCityName, arrCityName, dptTime, dptTimeStr, price } = item;
          return (
            <View key={item.id} className='item'>
              <View className='left'>
                <View className='line'>
                  <Text className='city-name'>{dptCityName}</Text> -
                  <Text className='city-name'>{arrCityName}</Text>
                  <View className='time'>{`${dayjs(dptTime).format(
                    'YYYY-MM-DD',
                  )} ${dptTimeStr}`}</View>
                </View>
              </View>
              <View className='right'>¥ {price}</View>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <NoExploit content='暂无数据' />
    );
  };

  return isLogin ? (
    <View className={`home-container ${isBaiDu ? 'baidu-home-container' : ''}`}>
      <View className='user-box'>
        <Text className='user-name'>欢迎，{nickName || '--'}</Text>
        <Text
          className='login-out-btn'
          onClick={() => {
            removeStorageSync('userInfo');
            changeUserInfoState({
              isLogin: false,
              userPhone: '',
              nickName: '',
            });
            showToast({
              title: '操作成功～',
              icon: 'loading',
              duration: 1000,
            });
          }}
        >
          退出
        </Text>
      </View>
      <Tab tabList={TAB_LIST} className='tab'>
        {TAB_LIST.map((tab) => {
          return (
            <SwiperItem key={tab.id}>
              {tab.id === 0 ? (
                renderListItem()
              ) : (
                <NoExploit content='暂无数据' />
              )}
            </SwiperItem>
          );
        })}
      </Tab>
    </View>
  ) : (
    <View className='no-login-container'>
      <Text className='txt'>登录查看订单</Text>
      <Button
        className='login-btn'
        onClick={() => {
          navigateTo('/pages/login/login');
        }}
      >
        立即登录
      </Button>
    </View>
  );
};

export default Order;

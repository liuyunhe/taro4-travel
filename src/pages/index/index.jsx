import { useState } from 'react';
import { Button, View, Map } from '@tarojs/components';
import Taro, {
  useLoad,
  useReady,
  useShareAppMessage,
  canIUse,
} from '@tarojs/taro';
import FlightIndex from '../flight/index';
import NoExploit from '../../components/noExploit';
import { isH5 } from '../../common/utils';
import './index.scss';

const DEFAULT_TAB_LIST = [
  { title: '机票', tab: 'flight', index: 0 },
  { title: '火车票', tab: 'train', index: 1 },
  { title: '酒店', tab: 'hotel', index: 2 },
  { title: '汽车票', tab: 'bus', index: 3 },
];
console.log('canIUse', canIUse('createMapContext'));
const MapContext =
  canIUse('createMapContext') && !isH5 ? Taro.createMapContext('myMap') : null;

export default function Index() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showBtn] = useState(false);
  // const [showBtn, setShowBtn] = useState(false)
  const [location, setLocation] = useState({
    longitude: 116.397428,
    latitude: 39.90923,
  });

  const innerStyle = {
    width: `${100 / DEFAULT_TAB_LIST.length}%`,
    transform: `translateX(${tabIndex * 100}%)`,
  };

  const handleContainerClick = () => {
    Taro.eventCenter.trigger(
      'test',
      'from page/index/index handleContainerClick',
    );
  };

  useShareAppMessage(() => {
    return {
      title: '测试分享',
      path: '/pages/index/index',
    };
  });

  const getLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res);
        setLocation({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      },
    });
    MapContext &&
      MapContext.moveToLocation({
        longitude: location.longitude,
        latitude: location.latitude,
        success: (res) => {
          console.log(res);
        },
      });
  };
  useLoad(() => {
    console.log('Page loaded.');
  });
  useReady(() => {
    console.log('Page ready.');
    getLocation();
  });

  return (
    <View className='index-container'>
      <View className='top'>
        <View className='index-tab'>
          {DEFAULT_TAB_LIST.map((o) => (
            <View
              onClick={() => setTabIndex(o.index)}
              className={`index_tab_item ${o.tab} ${
                tabIndex === o.index ? ' current' : ''
              }`}
              key={o.tab}
            >
              {o.title}
            </View>
          ))}
        </View>
        <View className='scrollbar' style={innerStyle}></View>
      </View>
      {DEFAULT_TAB_LIST[tabIndex]['tab'] === 'flight' ? (
        <FlightIndex
          flightIndex={{ dptCityName: '上海', arrCityName: '北京' }}
        />
      ) : DEFAULT_TAB_LIST[tabIndex]['tab'] === 'train' ? (
        !isH5 && (
          <Map
            id='myMap'
            longitude={location.longitude}
            latitude={location.latitude}
            showLocation
          />
        )
      ) : (
        <NoExploit />
      )}
      {showBtn && <Button onClick={handleContainerClick}>test</Button>}
    </View>
  );
}

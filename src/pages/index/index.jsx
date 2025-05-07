import { useState } from 'react';
import { View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import FlightIndex from '../flight/index';
import NoExploit from '../../components/noExploit';
import './index.scss';

const DEFAULT_TAB_LIST = [
  { title: '机票', tab: 'flight', index: 0 },
  { title: '火车票', tab: 'train', index: 1 },
  { title: '酒店', tab: 'hotel', index: 2 },
  { title: '汽车票', tab: 'bus', index: 3 },
];

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  const [tabIndex, setTabIndex] = useState(0);

  const innerStyle = {
    width: `${100 / DEFAULT_TAB_LIST.length}%`,
    transform: `translateX(${tabIndex * 100}%)`,
  };

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
      ) : (
        <NoExploit />
      )}
    </View>
  );
}

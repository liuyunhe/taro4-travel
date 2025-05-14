
import Taro, { useLaunch, canIUse } from '@tarojs/taro';
import { HoxRoot } from 'hox'
import { isH5 } from './common/utils';
import './app.scss'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
    
    if (canIUse('getSystemInfoSync') && !isH5) {
      const systemInfo = Taro.getSystemInfoSync();
      console.log('🚀 ~ useLaunch ~ systemInfo:', systemInfo);
    }

    if (canIUse('getWindowInfo') && !isH5) {
      const windowInfo = Taro.getWindowInfo();
      console.log('🚀 ~ useLaunch ~ windowInfo:', windowInfo);
    }

    Taro.eventCenter.on('test', (data) => {
      console.log('🚀 ~ useLaunch ~ events.test.data:', data);
    });
  })
  
  // children 是将要会渲染的页面
  return HoxRoot({children})
}
  


export default App

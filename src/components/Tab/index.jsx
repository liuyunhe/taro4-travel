import { useState } from "react";
import { View, Swiper } from "@tarojs/components";
import "./index.scss";

const Tab = ({
  className,
  tabList,
  initTab = 0,
  onTaClick = () => {},
  children
}) => {

  const [currentId, setCurrentId] = useState(initTab || tabList[0].id)
  const innerStyle = {
    width: `${100 / tabList.length}%`,
    transform: `translateX(${currentId * 100 }%)`
  }

  return (
    <View className={`tab-container ${className}`}>
      {/* 选项卡 */}
      <View className='tab-bar'>
        {
          tabList?.map(o => {
            return (
              <View onClick={() => {
                setCurrentId(o.id)
                onTaClick(o.id)
              }} className={`tab-item ${ currentId === o.id ? 'active' : '' }`} key={o.id}
              >{
                  o.label
                }</View>
            )
          })
        }
        <View className='scroll-bar' style={innerStyle}>
        </View>
      </View>
      {/* 选项卡内容 */}
      <Swiper
        current={currentId}
        className='tab-content'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        onChange={(e) => {
          setCurrentId(e.detail.current)
          onTaClick(e.detail.current)
        }}
      >
        {
          children
        }
      </Swiper>
    </View>
  )
};

export default Tab;

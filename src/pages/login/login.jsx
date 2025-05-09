import apis from '@/api'
import { setStorageWithCache } from '@/common/utils'
import { showToast, navigateBack} from '@tarojs/taro'
import { useUserInfoModel } from '@/model/userInfo-model'
import { View, Input, Button, Form } from '@tarojs/components'
import './index.scss'


const LoginPage = () => {
  // hox 的 store 订阅 hook
  const {
  // eslint-disable-next-line
    userInfoState,
    changeUserInfoState
  } = useUserInfoModel()

  const formSubmit = (e) => {
    const {
      target: {
        value
      }
    } = e

    apis.postLogin({
      ...value
    })
      .then(res => {
        const {
          result: {
            nickName,
            userPhone
          },
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
                // 模拟缓存 20 秒
                setStorageWithCache('userInfo', {
                  nickName,
                  userPhone
                }, 300)
                changeUserInfoState({
                  isLogin: true,
                  userPhone,
                  nickName
                })
                navigateBack()
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
      })
  }
  const formReset = () => {
    console.log(222)
  }
  return (
    <View className='login-container'>
      <View className='login-top'>
        <View>你好，</View>
        <View>欢迎登录</View>
      </View>
      <View className='login-box'>
        <Form onSubmit={(e) => formSubmit(e)} onReset={formReset} >
          <Input type='text' name='nickName' className='nick-name input' placeholder='请输入昵称' placeholderClass='placeholer-class'></Input>
          <Input type='text' name='userPhone' className='phone input' placeholder='请输入手机号' placeholderClass='placeholer-class'></Input>
          <Input type='password' name='password' className='password input' placeholder='请输入密码' placeholderClass='placeholer-class'></Input>
          <Button formType='submit' className='login-btn'>登录</Button>
        </Form>
      </View>
    </View>
  )
}

export default LoginPage;

import {remindSubmit} from "../../../request/teamPort";
const App = getApp()
import { logout, scanLogin } from '../../../request/systemPort'

Page({
  data: {
    userInfo: null
  },
  onLoad: function (options) {
  },
  onShow() {
    this.setData({
      userInfo: App.user.userInfo
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '晓得Le教师助手 - 分享知识、分享快乐',
      imageUrl: 'https://sagacity-course-000019.tcb.qcloud.la/system/logon.jpg?sign=f042416f92c2f5c581b3594290af0ce2&t=1540657473',
      path: "/pages/tabBar/index/index",
      success: (ret) => {}
    }
  },
  /**
   * 退出登录
   * @param e
   */
  logout(e) {
    wx.showModal({
      title: '安全提示',
      content: '是否安全退出?',
      success(res) {
        if (res.confirm) {
          App.user._logout()
        }
      }
    })
  },
  /**
   * 链接
   */
  goMessage() {
    wx.showModal({
      title: '提示',
      content: `正在开发中，敬请期待!`,
      showCancel: false,
      success: res => {}
    })
  },
  goPassword() {
    wx.navigateTo({
      url: `/pages/mine/password/password`
    })
  },
  goHelp(e) {
    wx.navigateTo({
      url: `/pages/mine/my-set/my-set`
    })
  },
  /**
   * 扫码
   * @param e
   */
  getCodeEvent(e) {
    wx.scanCode({
      onlyFromCamera: false,
      success: res => {
        let data = res.result
        try {
          const obj = JSON.parse(data)
          if (obj.type === 'login') {
            this._scanLogin(obj.key)
          } else {
            wx.showToast({title: '错误的二维码！', icon: 'none'})
          }
        } catch (e) {
          wx.showToast({title: '错误的二维码！', icon: 'none'})
        }
      }
    })
  },

  _scanLogin(key) {
    wx.showModal({
      content: '是否登录网页版？',
      success: res => {
        if (res.confirm) {
          scanLogin({key: key}).then((res) => {
            if (res.code === 1) {
              wx.showToast({
                title: res.msg
              })
            }else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }

})

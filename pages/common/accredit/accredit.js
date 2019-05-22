const App = getApp()
import WxValidate from '../../../utils/WxValidate'
import { $wuxToast } from 'wux-weapp'

Page({
    data: {
      form: {
        username: '',
        password: ''
      },
      remember: true
    },

    onLoad: function (options) {
      /**
       * 字段验证
       **/
      this._initValidate()
      try {
        let account = wx.getStorageSync('account')
        if (account) {
          this.setData({'form.username': account.username, 'form.password': account.password})
        } else {
          throw false
        }
      } catch (e) {}
    },

    onShow: function () {
    },

    /**
     * 字段验证
     **/
    validators: {},
    validationMsgs: {},
    _initValidate() {
      Object.assign(this.validators, {
        'username': {
          required: true,
          tel: true,
        },
        'password': {
          required: true
        }
      })
      Object.assign(this.validationMsgs, {
        'username': {
          required: '请输入手机号',
          tel: '请输入正确的手机号'
        },
        'password': {
          required: '请输入密码'
        }
      })
      this.WxValidate = new WxValidate(this.validators, this.validationMsgs)
    },
    /**
     * 输入框赋值
     * @param e
     */
    setValueEvent(e) {
      let val = e.detail.value
      const type = e.currentTarget.dataset.name
      const positive = e.currentTarget.dataset.positive
      if(positive) {
        val = Number(val)
      }
      this.setData({ [type]: val })
    },
    /**
     * 提交表单
     * @param event
     */
    formSubmit(event) {
      const e = {
        detail: {
          value: this.data.form
        }
      }
      if (!this.WxValidate.checkForm(e)) {    //   验证字段
        const error = this.WxValidate.errorList[0]
        this._errorToast(error) // 错误提示
        return false
      }
      this._login()
    },
    _errorToast(error) {
      $wuxToast().show({
        type: 'text',
        duration: 1000,
        color: '#ffffff',
        text: error.msg
      })
    },
    /**
    * 请求调用事件
    **/
    _login() {
      App.user._goLogin(this.data.form.username, this.data.form.password).then(res => {
        if(this.data.remember) {
          wx.setStorageSync('account', this.data.form)
        }else {
          wx.removeStorageSync('account')
        }
        wx.navigateBack({
          delta: 1
        })
      })
    },
    /**
     * 记住账号密码事件
     */
    rememberMe() {
      this.setData({
        remember: !this.data.remember
      })
    }

})

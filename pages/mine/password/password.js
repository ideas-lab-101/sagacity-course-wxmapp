const App = getApp()
import WxValidate from '../../../utils/WxValidate'
import { changePassword } from '../../../request/systemPort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '修改密码',
      model: 'extrude',
      transparent: false
    },
    /**
     * data
     */
    form: {
      oldPwd: '',
      newPwd: '',
      rePwd: ''
    }
  },
  onLoad: function (options) {
    /**
     * 字段验证
     **/
    this._initValidate()
  },
  /**
   * 字段验证
   **/
  validators: {},
  validationMsgs: {},
  _initValidate() {
    Object.assign(this.validators, {
      'oldPwd': {
        required: true
      },
      'newPwd': {
        required: true,
        minlength: [6]
      },
      'rePwd': {
        required: true
      }
    })
    Object.assign(this.validationMsgs, {
      'oldPwd': {
        required: '请输入旧密码',
      },
      'newPwd': {
        required: '请输入新密码',
        minlength: '密码最少6位'
      },
      'rePwd': {
        required: '请确认密码'
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
    const { newPwd, rePwd } = this.data.form
    const e = {
      detail: {
        value: this.data.form
      }
    }
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this._errorToast(error)
      return false
    }else if(newPwd !== rePwd) {
      const error = { msg: '新密码不一致!' }
      this._errorToast(error)
      return false
    }
    this._changePassword()
  },
  _errorToast(error) {
    $wuToast().show({
      type: 'text',
      duration: 1000,
      color: '#ffffff',
      text: error.msg
    })
  },

  _changePassword() {
    const { oldPwd, newPwd } = this.data.form
    changePassword({
      oldPwd,
      newPwd
    }).then(res => {
      let account = wx.getStorageSync('account')
      if(account) {
        account.password = this.data.form.newPwd
        wx.setStorageSync('account', account)
      }
      this._errorToast(res)
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    }).catch(ret => {
      this._errorToast(ret)
    })
  }
})

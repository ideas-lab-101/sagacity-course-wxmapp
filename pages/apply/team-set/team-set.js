const App = getApp()
import { setTeamInfo, getTeamInfo } from '../../../request/teamPort'
const { $wuToast } = require('../../../components/wu/index')

Page({
  data: {
    nav: {
      title: '小组信息修改',
      model: 'extrude',
      transparent: false
    },
    /**
     * data
     */
    teamInfo: '',
    form: {
      TeamName: '',
      TeamDesc: ''
    }
  },
  onLoad: function (options) {
    this.optionsId = options.id
    /**
     * 初始化数据
     */
    this.init()
  },

  /**
   * 请求数据
   * @param e
   */
  init() {
    getTeamInfo({
      teamID: this.optionsId
    }).then(res => {
      this.setData({
        'form.TeamName': res.data.teamInfo.TeamName || '',
        'form.TeamDesc': res.data.teamInfo.TeamDesc || ''
      })
    })
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
   * @param e
   */
  formSubmit(e) {
    console.log(this.data.form)
    let errText = null
    if(errText === null && this.data.form.TeamName.trim() === '') {
      errText = '小组名称不能为空!'
    }
    if(errText === null && this.data.form.TeamDesc.trim() === '') {
      errText = '小组描述不能为空!'
    }
    if(errText === null && (/\s+/g.test(this.data.form.TeamName.trim()) || /\s+/g.test(this.data.form.TeamDesc.trim()))) {
      errText = '不能有空格!'
    }
    if(errText !== null) {
      $wuToast().show({ type: 'forbidden', duration: 1000, text: errText })
      return false
    }

    setTeamInfo({
      formData: JSON.stringify(this.data.form),
      teamID: this.optionsId
    }).then(res => {
      $wuToast().show({ type: 'forbidden', duration: 1000, text: '修改成功' })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 800)
    })
  }
})

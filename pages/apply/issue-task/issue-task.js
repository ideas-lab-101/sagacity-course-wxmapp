const App = getApp()
import WxValidate from '../../../utils/WxValidate'
import {  $wuToast } from '../../../components/wu/index'
import {  addTeamTask } from '../../../request/teamPort'
import {  $courseDisperse } from '../../../pageComponents/index'
const dateTimePicker = require('../../../utils/dateTimePicker')

Page({
    data: {
      deviceStatusBarHeight: App.globalData.equipment.deviceStatusBarHeight,
      nav: {
        title: '发布作业',
        model: 'extrude',
        transparent: false
      },
      /**
       * form
       */
      form: {
        content: '',
        validTime: ''
      },
      /**
       * 章节临时存储
       */
      lesson: [],
      /**
       * switch
       */
      switchVal: false,
      /**
       * date time
       */
      dateTime: null,
      dateTimeArray: null,
      startYear: 2019,
      endYear: 2030,
      day: '',
      /**
       * course
       */
      course: {
        list: [],
        lesson: {
          pageNumber: 0,
          lastPage: false,
          list: [],
          totalRow: 0
        }
      }
    },

    onLoad: function (options) {
      this.optionsId = options.id
      /**
       * 字段验证
       **/
      this._initValidate()
      /**
       * 初始化时间
       */
      this.initDate()
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
        'content': {
          required: true
        }
      })
      Object.assign(this.validationMsgs, {
        'content': {
          required: '请详细填写作业说明'
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

      wx.showModal({
        title: '提示',
        content: '确定发布作业?',
        success: res => {
          if (res.confirm) {
            const dataIDs = this.filterDataID(this.data.lesson)
            addTeamTask({
              teamID: this.optionsId,
              content: this.data.form.content,
              validTime: this.data.switchVal?this.data.form.validTime:'',
              dataIDs: dataIDs,
            }).then(res => {
              $wuToast().show({
                type: 'text',
                duration: 1000,
                color: '#ffffff',
                text: res.msg
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            })
          }
        }
      })
    },
    filterDataID(Arr) {
      let temp = ''
      Arr.map(item => {
        temp += item.DataID + ','
      })
      return temp.substring(0, temp.length-1)
    },
    _errorToast(error) {
      $wuToast().show({
        type: 'text',
        duration: 1000,
        color: '#ffffff',
        text: error.msg
      })
    },
    delLesson(e) {
      const index = e.currentTarget.dataset.index
      this.data.lesson.splice(index, 1)
      this.setData({lesson: this.data.lesson})
    },
  /**
   * 时间选择
   * @param e
   * @returns {boolean}
   */
    timeChange(e) {
      this.setData({
        switchVal: e.detail.value
      })
    },
  /**
   * date time
   * @param e
   */
  initDate() {
    const obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
    const time = dateTimePicker.getHourMinu()
    obj.dateTime[2] = parseInt((obj.defaultDay).substring(0, 2)) - 1 //day 字符串 'xx日' 转 'int'
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      day: obj.defaultDay,
      time: time
    })
    this.assembleDate()
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
    this.assembleDate()
  },
  changeDateTimeColumn(e) {
    const arr = this.data.dateTime, dateArr = this.data.dateTimeArray
    arr[e.detail.column] = e.detail.value
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      day: dateArr[2][arr[2]].substring(0, 3),
    })
    this.assembleDate()
  },

  assembleDate() {
    const { dateTimeArray, dateTime, day, time } = this.data
    const y = dateTimeArray[0][dateTime[0]]
    const m = dateTimeArray[1][dateTime[1]]
    const d = day
    this.data.form.validTime = `${y.substring(0, y.length-1)}-${m.substring(0, m.length-1)}-${d.substring(0, d.length-1)} ${time}`
  },


  /**
   * 课程管理
   */
  openCourseEvent() {
    $courseDisperse().show({ teamID: this.optionsId, storeData: this.data.lesson }).then(() => {
      this.setData({textareaReplace: true})
    })
  },
  closeCourseEvent(e) {
    if(e.detail.storeData) {
      this.setData({lesson: e.detail.storeData, textareaReplace: false})
      return false
    }
    this.setData({textareaReplace: false})
  }

})

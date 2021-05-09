const App = getApp()
import { getRecordSummary, setRecordMark } from '../../../request/teamPort'
const { $wuToast, $audioPlay } = require('../../../components/wu/index')
const wxCharts = require('../../../utils/wxcharts.js')

Page({
  data: {
    nav: {
      title: '作业详情',
      model: 'extrude',
      transparent: false
    },
    /**
     * data
     */
    noExistList: [],
    existList: [],
    /**
     * params
     */
    current: 0,
    /**
     * audio play
     */
    tryParams: {
      id: null,
      isPlay: false
    }
  },
  onLoad: function (options) {
    console.log(options)
    this.optionsId = options.id
    this.optionsTeamId = options.teamid
    this.setData({
      'nav.title': decodeURIComponent(options.name)
    })
    /**
     * 初始化数据
     */
    this.init()
  },
  onReady() {
    this.windowWidth = 320
    try {
      const res = wx.getSystemInfoSync();
      this.windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    /**
     * 初始化chart
     */
    this.createRing()
  },
  /**
   * tab event
   * @param e
   */
  tabChange(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({ current: index})
  },
  /**
   * 标星
   * @param e
   */
  markEvent(e) {
    const index = e.currentTarget.dataset.index
    const proIndex = e.currentTarget.dataset.pro
    const name = this.data.existList[index].profile_name
    const submitId = this.data.existList[index].rList[proIndex].submit_id
    const state = this.data.existList[index].rList[proIndex].bln_mark
    let content = `确定给${name}的作品星级评价?`
    if (state === 1) {
      content = `确定取消${name}的作品星级评价?`
    }
    wx.showModal({
      title: '标星提示',
      content: content,
      success: res => {
        if (res.confirm) {
          this._setRecordMark(submitId, state, index, proIndex)
        }
      }
    })
  },
  _setRecordMark(submitId, state, index, proIndex) {
    if(state === 0) {
      state = 1
    }else {
      state = 0
    }
    setRecordMark({
      submitId: submitId,
      state: state
    }).then(res => {
      const obj = `existList[${index}].rList[${proIndex}].bln_mark`
      this.setData({
        [obj]: state
      })
    })
  },
  /**
   * 圆环统计图
   * @param e
   */
  touchHandler: function (e) {
    console.log(this.ringChart.getCurrentDataIndex(e));
  },
  createRing() {
    this.ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 30,//圆环的宽度
        pie: {
          offsetAngle: 0//圆环的角度
        }
      },
      title: {
        name: this.getRingData(),
        color: '#733429',
        fontSize: 22
      },
      subtitle: {
        name: '作业上交率',
        color: '#733429',
        fontSize: 12
      },
      series: [{
        name: '已交作品的成员',
        data:  this.data.existList.length,
        stroke: false
      }, {
        name: '未交作品的成员',
        data: this.data.noExistList.length,
        stroke: false
      }],
      disablePieStroke: true,
      width: this.windowWidth,
      height: 240,
      dataLabel: true,
      legend: false
    });
    this.ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      this.ringChart.stopAnimation();
    }, 500);
  },
  getRingData() {
    const total = this.data.existList.length + this.data.noExistList.length
    return `${Math.ceil((this.data.existList.length/total)*100)}%`
  },
  /**
   * 请求数据
   * @param e
   */
  init() {
    getRecordSummary({
      teamId: this.optionsTeamId,
      dataId: this.optionsId
    }).then(res => {
      this.setData({
        noExistList: res.data.noExistList,
        existList: res.data.existList
      })
      /**
       * 更新数据
       */
      if(this.ringChart) {
        this.ringChart.updateData({
          title: {
            name: this.getRingData(),
            color: '#733429',
            fontSize: 22
          },
          series: [{
            name: '已交作业的学员',
            data:  this.data.existList.length,
            stroke: false
          }, {
            name: '未交作业的学员',
            data: this.data.noExistList.length,
            stroke: false
          }]
        })
      }
    })
  },


  /**
   * 播放初始化
   **/
  tryListen(e) {
    const id = e.currentTarget.dataset.id
    const url = e.currentTarget.dataset.url
    const name = e.currentTarget.dataset.name
    const index = e.currentTarget.dataset.index
    if(id === this.data.tryParams.id) {
      $audioPlay().resetPlayEvent()
    }else {
      $audioPlay().playInit(url, id, name, `作业${index+1}`)
    }
  },

  /**
   * audio播放回调方法
   **/
  audioEventPlay: function (params) {
    this.setData({ 'tryParams.isPlay': true, 'tryParams.id': params.detail.id, 'slider.disabled': false })
  },
  audioEventPause: function () {
    this.setData({'tryParams.isPlay': false})
  },
  audioEventStop: function () {
    this.setData({'tryParams.isPlay': false, 'tryParams.id': null})
  },
  audioEventEnd: function () {
    this.setData({'tryParams.isPlay': false, 'tryParams.id': null})
  },
  audioEventDestroy: function () {
    this.setData({'tryParams.isPlay': false, 'tryParams.id': null})
  },
  audioEventError: function () {
    this.setData({'tryParams.isPlay': false})
  },
})

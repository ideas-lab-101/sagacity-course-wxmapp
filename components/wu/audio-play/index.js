import baseBehavior from '../helpers/baseBehavior'
import mergeOptionsToData from '../helpers/mergeOptionsToData'
import AudioManager from '../../../controller/audioManager'
const App = getApp()


const defaults = {
  tryParams: {
    isPlay: false,
    id: ''
  },
  slider: {
    current: '00:00',
    duration: '00:00',
    disabled: true,
    value: 0
  },
  info: {
    userName: '',
    recordName: ''
  },
  show: false
}

Component({
    behaviors: [baseBehavior],
    externalClasses: ['wu-class'],
    data: mergeOptionsToData(defaults),
    properties: {
      audioBack: {
        type: Object,
        value: {}
      }
    },
    lifetimes: {
      created() {
        /**
         * * 停止背景音播放
         **/
        if ( App.globalData.audio) {
          App.globalData.audio.pause()
        }
        /**
         * * 初始换播放插件
         **/
        this.innerAudioContext = new AudioManager({
          canPlay: () => {this._audioManagerCanPlay()},
          play: (params) => {this._audioManagerPlay(params) },
          pause: () => {this._audioManagerPause() },
          timeUpdate: (params) => {this._audioManagerTimeUpdate(params) },
          stop: () => {this._audioManagerStop() },
          end: () => {this._audioManagerEnd() },
          destroy: () => {this._audioManagerDestroy() },
          error: () => {this._audioManagerError(err) }
        })
      },
      attached() {},
      detached() {
        if (this.innerAudioContext) {
          this.innerAudioContext.destroy()
        }
      },
    },
    pageLifetimes: {
      show() {},
      hide() {
        if (this.innerAudioContext) {
          this.innerAudioContext.pause()
        }
      },
      resize(size) {}
    },
    methods: {
      /**
       * 内部事件
       **/
      playInit: function (url, id, userName, recordName) {
        this.data.tryParams.id = id
        this.innerAudioContext.play(url)
        this.setData({
          show: true,
          'info.userName': userName,
          'info.recordName': recordName
        })
      },
      resetPlayEvent: function () {
        if (this.data.tryParams.isPlay) {
          this.innerAudioContext.pause()
          return false
        }
        this.innerAudioContext.play()
      },
      sliderChangeEvent: function (e) {
        this.innerAudioContext.seek(e.detail.value / 100)
      },

      /**
       * audio播放回调方法
       **/
      _audioManagerCanPlay: function () {
      },
      _audioManagerPlay: function (params) {
        this.data.tryParams.isPlay = true
        this.setData({'slider.disabled': false })
        this.triggerEvent('audioEventPlay', {id: this.data.tryParams.id})
      },
      _audioManagerPause: function () {
        this.data.tryParams.isPlay = false
        this.triggerEvent('audioEventPause', {})
      },
      _audioManagerTimeUpdate: function (params) {
        const sliderVal =  params.currentTime*100 / params.duration
        this.setData({
          'slider.current': params.currentTimeFormat,
          'slider.duration': params.durationFormat,
          'slider.value': sliderVal
        })
        this.triggerEvent('audioEventTimeUpdate', {params})
      },
      _audioManagerStop: function () {
        this.setData({
          show: false
        })
        this.data.tryParams.isPlay = false
        this.triggerEvent('audioEventStop', {})
      },
      _audioManagerEnd: function () {
        this.setData({
          show: false
        })
        this.data.tryParams.isPlay = false
        this.triggerEvent('audioEventEnd', {})
      },
      _audioManagerDestroy: function () {
        this.setData({
          show: false
        })
        this.data.tryParams.isPlay = false
        this.triggerEvent('audioEventDestroy', {})
      },
      _audioManagerError: function (err) {
        this.data.tryParams.isPlay = false
        this.triggerEvent('audioEventError', {err})
      }

    }
})

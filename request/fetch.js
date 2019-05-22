const { $wuLoading } = require('../components/wu/index')
const { host } = require('../sever.config')

/**
 * 基础方法
 * */

export const fetch = function (options, loading, complete) {
  if (loading) {
    $wuLoading().show({
      title: loading.title || '数据加载中'
    })
  }

  const promise = new Promise( (resolve, reject) => {
    getApp().request({
      url: options.url,
      data: Object.assign({
        token: getApp().user.ckLogin()
      }, options.data),
      method: options.method || 'GET',
      success: (res) => {
        if (loading) {
          $wuLoading().hide()
        }
        resolve(res)
      },
      fail: (ret) => {
        if (loading) {
          $wuLoading().hide()
        }
        reject(ret)
      },
      complete: () => {
        if (loading) {
          $wuLoading().hide()
        }
        complete && complete()
      }
    })
  })

  return promise
}

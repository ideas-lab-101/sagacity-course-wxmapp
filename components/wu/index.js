/**
 * 使用选择器选择组件实例节点，返回匹配到的第一个组件实例对象
 * @param {String} selector 节点选择器
 * @param {Object} ctx 页面栈或组件的实例，默认为当前页面栈实例
 */
const getCtx = (selector, ctx = getCurrentPages()[getCurrentPages().length - 1]) => {
    const componentCtx = ctx.selectComponent(selector)

    if (!componentCtx) {
        throw new Error('无法找到对应的组件，请按文档说明使用组件')
    }

    return componentCtx
}

const $wuBackdrop = (selector = '#wu-backdrop', ctx) => getCtx(selector, ctx)

const $wuActionSheet = (selector = '#wu-actionsheet', ctx) => getCtx(selector, ctx)
const $wuWidget = (selector = '#wu-widget', ctx) => getCtx(selector, ctx)
const $wuPlayWidget = (selector = '#wu-play-widget', ctx) => getCtx(selector, ctx)
const $wuLoading = (selector = '#wu-loading', ctx) => getCtx(selector, ctx)
const $wuNavigation = (selector = '#wu-navigation', ctx) => getCtx(selector, ctx)
const $wuScrollTop = (selector = '#wu-scrollTop', ctx) => getCtx(selector, ctx)
const $wuPendant = (selector = '#wu-pendant', ctx) => getCtx(selector, ctx)
const $wuToast = (selector = '#wu-toast', ctx) => getCtx(selector, ctx)
const $wuToptips = (selector = '#wu-toptips', ctx) => getCtx(selector, ctx)
const $wuMarkedwords = (selector = '#wu-marked-words', ctx) => getCtx(selector, ctx)
const $wuSlogon = (selector = '#wu-slogon', ctx) => getCtx(selector, ctx)
const $wuMarkedWords = (selector = '#wu-marked-words', ctx) => getCtx(selector, ctx)
const $audioPlay = (selector = '#audioPlay', ctx) => getCtx(selector, ctx)

export {
    $wuBackdrop,
    $wuActionSheet,
    $wuWidget,
    $wuPlayWidget,
    $wuLoading,
    $wuNavigation,
    $wuScrollTop,
    $wuPendant,
    $wuToast,
    $wuToptips,
    $wuMarkedwords,
    $wuSlogon,
    $wuMarkedWords,
    $audioPlay
}

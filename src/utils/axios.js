import axios from 'axios'
import qs from 'qs'
import { Base64 } from 'js-base64'
import md5 from 'blueimp-md5'
import Cookies from 'js-cookie'
import { message } from 'antd'
import { deleteCookies } from './index'

export const URL = '/mgr'
// export const site = 'http://www.huoxing24.com'
export const site = 'http://www.huoxing24.vip'

axios.defaults.withCredentials = true

// 发送时
axios.interceptors.request.use(config =>
    // 开始
     config,
 err => Promise.reject(err))

// 响应时
axios.interceptors.response.use(response => response, err => Promise.resolve(err.response))

const checkStatus = ({ err, formData }) => {
    if (err.response) {
        if (/^(5)\d{2}/.test(err.response.status)) {
            message.error(`服务器请求异常 ${err.response.status} ${formData ? '正在尝试重新上传~' : ''}`)
        }
        if (/^(4)\d{2}/.test(err.response.status)) {
            message.error(`请求地址或参数异常 ${err.response.status} ${formData ? '正在尝试重新上传~' : ''}`)
        }
    } else if (err.request) {
        message.error('网络出现异常, 请求失败!')
    } else {
        message.error('Error', err.message)
    }
}

/**
 * @desc ajax请求
 * @returns {data/error}
 * @Params {args} args = {type(get/post/complexpost), url, params, contentType, urlSearchParams, formData, noLoading, cookies}
 * @method axiosAjax({
        type: get/post/complexpost,
        url: ',
        contentType: 'application/x-www-form-urlencoded',
        formData: true,
        noLoading: true,
        userDefined: {
            'hx-cookie': Base64.encode(JSON.stringify({
                    'hx24_passportId': Cookies.get('hx24_passportId'),
                    'hx24_token': Cookies.get('hx24_token')
                }))
        }
        params: {
            dataone: 'one',
            datatwo: 'two'
        }
    })
 */
export const ajaxSignature = () => {
    const platform = 'pc'
    const appSecret = 'Fbz]OdjAyhpqOIKA'
    const nonceArr = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ1234567890'
    const timestamp = new Date().getTime()
    let nonce = ''
    for (let i = 0; i < 6; i++) {
        const j = Math.round(Math.random() * nonceArr.length)
        nonce += nonceArr[j]
    }
    const sig = md5(`platform=${platform}&timestamp=${timestamp}&nonce=${nonce}&${appSecret}`)
    const base64 = Base64.encode(JSON.stringify({
        platform,
        nonce,
        timestamp,
        sig,
    }))
    return base64
}

export const axiosAjax = args => new Promise((resolve, reject) => {
    try {
        const { type, url, params, contentType, urlSearchParams, formData, userDefined } = args
        let opt = {}
        const ajaxType = type.toLowerCase()
        const { CancelToken } = axios
        const source = CancelToken.source()
        // 对不同的接口进行处理
        URL = (url.split('/')[1] === 'passport' || url.split('/')[1] === 'market') ? '' : '/mgr'
        const _url = URL + url
        if (ajaxType === 'post') {
            opt = { method: type, url: _url, data: qs.stringify(params) }
        } else if (ajaxType === 'get') {
            opt = { method: type, url: _url, params }
        } else if (ajaxType === 'complexpost') {
            opt = { method: 'post', url: _url, params }
        }

        // 需要转换参数格式
        if (urlSearchParams) {
            const searchParams = new URLSearchParams()
            for (const key in params) {
                searchParams.append(key, params[key])
            }
            opt = { method: type, url, data: searchParams }
        }

        // 上传文件
        if (formData) {
            const fmData = new FormData()
            for (const key in params) {
                fmData.append(key, params[key])
            }
            opt = { method: type, url, data: fmData }
        }

        if (contentType) { opt.headers = { 'Content-Type': contentType } }

        opt.headers = Object.assign(opt.headers ? opt.headers : {}, { 'Sign-Param': ajaxSignature() }, userDefined || {})

        axios(Object.assign(
            opt, {
                timeout: 30000,
                onUploadProgress: progressEvent => {},
                cancelToken: source.token,
            })).then(res => {
            // 这里去除 loading 状态
            // clearLoading()
            if (res.data.code <= 0) {
                console.error({ url, msg: res.data.msg })
            }
            if (!res.data.code || res.data.code === -4) {
                deleteCookies('hx_')
                Cookies.set('loginStatus', false)
                message.error('登陆状态失效, 请重新登陆!')
                // store.dispatch(alertLogin(true))
                // hashHistory.push('/login')
                // return
            }
            if (formData) {
                res.data.source = source
                resolve(res.data, source)
            } else {
                resolve(res.data)
            }
        }).catch(err => {
            // 这里去除 loading 状态
            // clearLoading()
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message)
                return false
            }
            checkStatus({ err, formData })
            if (formData) {
                reject(err, source)
            } else {
                reject(err)
            }
        })
    } catch (err) {
        console.error('接口请求处理错误')
        reject(err)
    }
})

export default axiosAjax

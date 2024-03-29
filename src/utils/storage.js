/*
* 自定义的cookies/localStorage/sessionStorage 缓存的设置与获取
* */

const ls = window.localStorage
const ss = window.sessionStorage

export const Cookie = {
    get (key) {
        const arr = document.cookie.split('; ')
        for (let i = 0; i < arr.length; i++) {
            const arr2 = arr[i].trim().split('=')
            if (arr2[0] === key) {
                return arr2[1]
            }
        }
        return ''
    },
    set (key, value, day) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                const oDate = new Date()
                oDate.setDate(oDate.getDate() + day)
                document.cookie = `${i}=${setting[i]};expires=${oDate}`
            }
        } else {
            const oDate = new Date()
            oDate.setDate(oDate.getDate() + day)
            document.cookie = `${key}=${value};expires=${oDate}`
        }
    },
    remove (key) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Array') {
            setting.forEach(key => {
                this.set(key, 1, -1)
            })
        } else {
            this.set(key, 1, -1)
        }
    },
}

export const Local = {
    get (key) {
        if (key) return JSON.parse(ls.getItem(key))
        return null
    },
    set (key, val) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                ls.setItem(i, JSON.stringify(setting[i]))
            }
        } else {
            ls.setItem(key, JSON.stringify(val))
        }
    },
    remove (key) {
        ls.removeItem(key)
    },
    clear () {
        ls.clear()
    },
}

export const Session = {
    get (key) {
        if (key) return JSON.parse(ss.getItem(key))
        return null
    },
    set (key, val) {
        const setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (const i in setting) {
                ss.setItem(i, JSON.stringify(setting[i]))
            }
        } else {
            ss.setItem(key, JSON.stringify(val))
        }
    },
    remove (key) {
        ss.removeItem(key)
    },
    clear () {
        ss.clear()
    },
}

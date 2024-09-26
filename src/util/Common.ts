import lodash from "lodash"
import {SecurityService} from "./SecurityService"
// import { trans } from "@resources/localization"
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const formatDate = (d: string, format: string) => {
  return dayjs(d).format(format)
}

export const formatDateShort = (d: string) => {
    return formatDate(d, "DD/MM/YYYY")
}

export const formatDateMedium = (d: string) => {
    return formatDate(d, "DD/MM/YYYY HH:mm")
}

export const formatDateFull = (d: string) => {
    return formatDate(d, "DD/MM/YYYY HH:mm:ss")
}

export const setAllValueToUndefinedOfObject = (object?: { [key: string]: any }): { [key: string]: any } => {
    if (!object) return {}

    const objs = { ...object }
    Object.keys(objs).forEach((key) => (objs[key] = undefined))

    return objs
}

export const convertNumberToCurrency = (text: string | number) => {
    if (!text) return ""
    const newCurrency = text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return newCurrency
}

export const shortenText = (text: string, number: number, suffix?: string) => {
    if (text?.length > number) return `${text.slice(0, number)}...${suffix || ""}`
    return text
}

export const convertNonAccentVietnamese = (str: string) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A")
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E")
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I")
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O")
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U")
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y")
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    str = str.replace(/Đ/g, "D")
    str = str.replace(/đ/g, "d")
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "") // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, "") // Â, Ê, Ă, Ơ, Ư
    return str
}

export const capitalizeFirstLetter = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "")

export const parseSecondToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const second = Math.floor(seconds - minutes * 60)
    const time = `${minutes < 10 ? `0${minutes}` : minutes}:${second < 10 ? `0${second}` : second}`
    return time
}

export interface Variant {
    [key: string]: [value: string]
}

export const renderVariant = (variant: Variant) => {
    if (lodash.isObject(variant)) {
        const text: Array<string> = []
        lodash.forEach(variant, (value, key) => {
            text.push(`${key}: ${value}`)
        })

        return text.join(", ")
    }

    return ""
}

export const numberParser = (value: any) => {
    return value?.toString()?.replace(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:"'<>?\\]/g, "")
}

export const numberFormatter = (value: any) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const filterOption = (input: any, option: any) => {
    return (option?.children ?? "")?.toLowerCase().includes(input?.toLowerCase())
}

export const filterSort = (optionA: any, optionB: any) => {
    return (optionA?.children ?? "").toLowerCase().localeCompare((optionB?.children ?? "").toLowerCase())
}

export const parseFloatNumber = (value: any, toFixed?: number) => {
    if (value) {
        return parseFloat(value?.toString()?.replace(/[-&/\\#,+()$~%'":*?<>{}]/g, "")).toFixed(toFixed || 0)
    }
    return 0
}

export const getTimezone = () => {
    const userInfo = SecurityService.getUser() || {}
    return userInfo?.zoneinfo || "Asia/Ho_Chi_Minh"
}

export const calculateFromTo = (page: number, pageSize: number): { from: number, to: number } => {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    return { from, to };
}

export const replaceWithAsterisks = (input: string | number ) => {
    return input.toString().split('').map(() => '*').join('')
  }
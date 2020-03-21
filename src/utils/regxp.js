/**
 * 验证是否为合法time.Duration类型
 * @param {*} string 字符串
 */
export function validTimeDuration(string, callback) {
  return 'undefined' === typeof string || '' == string || /^\d+(ns|us|µs|ms|s|m|h)$/.test(string)
    ? callback()
    : callback(new Error('该字段必须以ns、us或µs、ms、s、m、h时间单位结尾，例如300ms'))
}
/**
 * 验证是否为数字类型
 * @param {*} number 数字
 */
export function validNumber(number, callback) {
  return 'undefined' === typeof number || '' == number || /^[0-9]*$/.test(number)
    ? callback()
    : callback(new Error('该字段不能包含除数字以外的其他字符'))
}

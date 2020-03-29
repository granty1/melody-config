/**
 * 验证是否为合法time.Duration类型
 * @param {*} string 字符串
 */
export function validTimeDuration(rule, value, callback) {
  return 'undefined' === typeof value || '' == value || /^\d+(ns|us|µs|ms|s|m|h)$/.test(value)
    ? callback()
    : callback(new Error('该字段必须以ns、us或µs、ms、s、m、h时间单位结尾，例如300ms'))
}
/**
 * 验证是否为数字类型
 * @param {*} number 数字
 */
export function validNumber(rule, value, callback) {
  return 'undefined' === typeof value || '' == value || /^[0-9]*$/.test(value)
    ? callback()
    : callback(new Error('该字段不能包含除数字以外的其他字符'))
}

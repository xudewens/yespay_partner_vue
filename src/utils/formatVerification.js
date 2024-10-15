// 密码校验规则
// 需要满足条件： 大小写字母，数字，特殊符号，10位以上

export function formatCheck(value) {
  let percentage = 0
  const digitNum = new RegExp('(?=.{10,}).*', 'g') // 10位以上
  const upLetter = /[A-Z]/ // 大写字母
  const lowLetter = /[a-z]/ // 小写字母
  const _Number = /[0-9]/ // 数字
  const specialChar = /[`~!@#$%^&*+=_\-|;:?]/ // 特殊字符

  if (digitNum.test(value) && upLetter.test(value) && lowLetter.test(value) && _Number.test(value) && specialChar.test(value)) { // 全部满足
    percentage = 100
  } else if ((digitNum.test(value) && upLetter.test(value) && lowLetter.test(value) && _Number.test(value)) ||
    (digitNum.test(value) && upLetter.test(value) && lowLetter.test(value) && specialChar.test(value)) ||
    (digitNum.test(value) && upLetter.test(value) && _Number.test(value) && specialChar.test(value)) ||
    (digitNum.test(value) && lowLetter.test(value) && _Number.test(value) && specialChar.test(value))
  ) { // 10位以上但只有三种
    percentage = 70
  } else if ((upLetter.test(value) && lowLetter.test(value) && _Number.test(value) && specialChar.test(value))) { // 四种都满足但不足10位
    if (value.length > 5) {
      percentage = 60
    } else {
      percentage = 40
    }
  } else if ((digitNum.test(value) && upLetter.test(value) && lowLetter.test(value)) ||
    (digitNum.test(value) && upLetter.test(value) && _Number.test(value)) ||
    (digitNum.test(value) && upLetter.test(value) && specialChar.test(value)) ||
    (upLetter.test(value) && lowLetter.test(value) && _Number.test(value)) ||
    (upLetter.test(value) && lowLetter.test(value) && specialChar.test(value)) ||
    (digitNum.test(value) && lowLetter.test(value) && _Number.test(value)) ||
    (lowLetter.test(value) && _Number.test(value) && specialChar.test(value)) ||
    (digitNum.test(value) && _Number.test(value) && specialChar.test(value)) ||
    (upLetter.test(value) && _Number.test(value) && specialChar.test(value))
  ) {
    if (value.length > 5) {
      percentage = 50
    } else {
      percentage = 40
    }
  } else if ((digitNum.test(value) && upLetter.test(value)) ||
    (digitNum.test(value) && lowLetter.test(value)) ||
    (digitNum.test(value) && _Number.test(value)) ||
    (digitNum.test(value) && specialChar.test(value)) ||
    (upLetter.test(value) && lowLetter.test(value)) ||
    (upLetter.test(value) && _Number.test(value)) ||
    (upLetter.test(value) && specialChar.test(value)) ||
    (lowLetter.test(value) && _Number.test(value)) ||
    (lowLetter.test(value) && specialChar.test(value)) ||
    (_Number.test(value) && specialChar.test(value))
  ) {
    if (value.length > 5) {
      percentage = 30
    } else {
      percentage = 20
    }
  } else if (digitNum.test(value) || upLetter.test(value) || lowLetter.test(value) || _Number.test(value) || specialChar.test(value)) {
    percentage = 15
  } else if (!value.length) {
    percentage = 0
  }
  return percentage
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

function padZero(num) {
  return num < 10 ? `0${num}` : num
}

export default function () {
  return {
    HOUR,
    MINUTE,
    SECOND,

    h(countdown) {
      return padZero(Math.floor((countdown % (HOUR * 24)) / HOUR))
    },

    m(countdown) {
      return padZero(Math.floor((countdown % HOUR) / MINUTE))
    },

    s(countdown) {
      return padZero(Math.floor((countdown % MINUTE) / SECOND))
    },
  }
}
// From KyberSwap source code

import BigNumber from 'bignumber.js'

export function filterInputNumber(event, value, preVal) {
    var strRemoveText = value.replace(/[^0-9.]/g, '')
    var str = strRemoveText.replace(/\./g, (val, i) => {
      if (strRemoveText.indexOf('.') !== i) val = ''
      return val
    })
    if(str === "."){
      str = "0."
    }
    event.target.value = str
  
    if (preVal === str) return false
    return true
  }

  export function caculateSourceAmount(destAmount, offeredRate, precision) {
    if (!destAmount || !offeredRate ) {
      return ""
    }
  
    var bigOfferedRate = new BigNumber(offeredRate)
  
    if (bigOfferedRate.comparedTo(0) === 0) {
      return ""
    }
  
    var bigDest = new BigNumber(destAmount)
    bigOfferedRate = bigOfferedRate.div(1000000000000000000)
    var result = bigDest.div(bigOfferedRate)
    if (precision) {
      return formatNumberByPrecision(result, precision);
    } else {
      return result.toString()
    }
  
  }
  
  export function formatNumberByPrecision(number, precision = 4) {
    if (number === undefined) return;
  
    const amountBigNumber = new BigNumber(number);
  
    if (amountBigNumber === 'NaN' || amountBigNumber === 'Infinity') {
      return "0";
    }
  
    const amountString = amountBigNumber.toFixed().toString();
    const indexOfDecimal = amountString.indexOf('.');
  
    return indexOfDecimal !== -1 ? amountString.slice(0, indexOfDecimal + (precision + 1)) :amountString;
  }


export function caculateDestAmount(sourceAmount, offeredRate, precision) {
  if (!sourceAmount || !offeredRate ) {
    return "";
  }


  var bigSource = new BigNumber(sourceAmount.toString())
  var bigOfferedRate = new BigNumber(offeredRate)

  bigOfferedRate = bigOfferedRate.div(1000000000000000000)
  var result = bigSource.times(bigOfferedRate)

  if (precision) {
    return formatNumberByPrecision(result, precision);
  } else {
    return result.toString()
  }
}


export function toTWei(number, decimal = 18) {
  //console.log({number, decimal})
  var bigNumber = new BigNumber(number.toString())
  if (bigNumber === 'NaN' || bigNumber === 'Infinity') {
    return number
  } else {

    return bigNumber.times(Math.pow(10, decimal)).toFixed(0)
  }
}


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//验证身份证
const checkMod = function checkMod(code) {
  var arr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],//从第18位到第2位的Wi  
    proof = code.charAt(17).toUpperCase() == "X" ? 10 : parseInt(code.charAt(17)),//得到输入身份证号的最后一位并将X转换为10  
    sum = 0;//前十七位的校验和  

  for (var i = 0; i < arr.length; i++) {
    sum += code.charAt(i) * arr[i];
  }
  return (proof + sum - 1) % 11 == 0;
}

module.exports = {
  formatTime: formatTime,
  checkMod:checkMod


}

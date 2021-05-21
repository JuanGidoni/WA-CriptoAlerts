const formatedDate = () => {

 function getFormattedDate(today) {

  var dd = today.getDate()
  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  var hour = today.getHours()
  var minu = today.getMinutes()

  if (dd < 10) {
   dd = '0' + dd
  }
  if (mm < 10) {
   mm = '0' + mm
  }
  if (minu < 10) {
   minu = '0' + minu
  }

  return dd + '/' + mm + '/' + yyyy + ' ' + hour + ':' + minu;
 }

 var date = new Date();
 return getFormattedDate(date);
}

module.exports = {
 formatedDate
}

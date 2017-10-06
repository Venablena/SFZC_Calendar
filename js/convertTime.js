//reformat time
 var temp = timeStart.slice(2,5)
 var newTime = timeStart.slice(0,2)
 var compTime = newTime.toInteger()

 if(newTime === "12"){
  newTime = timeStart + "PM"
 }else if(compTime < 12){
  newTime = timeStart +"AM"
 }else{
  newTime = (compTime-12).toString() + temp +"PM"
 }

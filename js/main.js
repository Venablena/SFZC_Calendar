console.log ("sanity check!")
//==============================
// Setting up the calendar
//==============================

//get current time parameters
var today = new Date()
var year = today.getFullYear()
var month = today.getMonth()
var weekday = today.getDay()
var date = today.getDate()
today = null //reinitialize the current date for next page load

//create an array with the names of months
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//create an array with the length of each month, leave February empty in case of a leap year
const monthDays = ["31", "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"]
// a function to deal with February in case of a leap year (I copied this from Tomer and Yehuda Shiran, Copyright 1996 - http://www.geocities.com/SiliconValley/9000/ <yshiran@iil.intel.com>)
function leapYear(year) {
if (year % 4 == 0){ return true } // is leap year
return false // is not leap year
}
//assign the correct value to February depending on year
monthDays[1] = (leapYear(year)) ? 29 : 28

//create an array with the names of weekdays
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

//find on which weekday the month starts
var firstDayOfMonth = new Date(year, month, 1)
var firstWeekday = firstDayOfMonth.getDay()

console.log(firstDayOfMonth);
console.log(firstWeekday);

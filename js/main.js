console.log ("sanity check!")
//==============================
// Setting up the calendar
//==============================

//get current time parameters
var today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const weekday = today.getDay()
const date = today.getDate()
today = null //reinitialize the current date for next page load

//create an array with the names of months
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// a function to deal with February in case of a leap year (I copied this from Tomer and Yehuda Shiran, Copyright 1996 - http://www.geocities.com/SiliconValley/9000/ <yshiran@iil.intel.com>)
function leapYear(year) {
if (year % 4 == 0){ return true } // is leap year
return false // is not leap year
}

//create an array with the length of each month, February having a leap year option
const monthDays = [31, (leapYear(year)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

//create an array with the names of weekdays
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

//find on which weekday the month starts
var firstDayOfMonth = new Date(year, month, 1)
var firstWeekday = firstDayOfMonth.getDay()
firstDayOfMonth = null //reinitialize the current month for next page load

//=====================================
// Drawing the calendar
//=====================================

//display the current month and year in the calendar header
document.getElementById("current-month").textContent = months[month] + year
//create first row of calendar with weekdays: first select the correct HTML component
const weekdayHeader = document.querySelector(".header-weekdays")
//and then populate it with the weekdays array
weekdays.forEach((day)=> {
   let cellWeek = document.createElement("div")
   cellWeek.className = "cell week"
   cellWeek.textContent = day.slice(0, 3)//abbreviate weekdays
   weekdayHeader.appendChild(cellWeek)
})
//create calendar rows with dates: first select the correct HTML component
const calendar = document.querySelector(".calendar-dates")
//create empty cells until the start of the current month
for (let i = 0; i < firstWeekday; i++) {
  let cellPast = document.createElement("div")
  cellPast.className = "cell inactive"
  calendar.appendChild(cellPast)
}//Do I need to reinitialize i or does firstDayOfMonth=null do the trick???

//create cells with a date, starting at the first weekday of the current month until the end of the month
let day = 0
while (day < monthDays[month]) {
  let cellCurrent = document.createElement("div")
  cellCurrent.className = "cell current"
  cellCurrent.textContent = day + 1
  calendar.appendChild(cellCurrent)
  day += 1
}

//create empty cells to fill the last calendar row until Sat, if necessary: first find out how many items are in the calendar
let calendarSize = calendar.children
//if it's not divisible by 7, add empty cells until it is
while (calendarSize.length % 7 !== 0){
  let cellFuture = document.createElement("div")
  cellFuture.className = "cell inactive"
  calendar.appendChild(cellFuture)
}

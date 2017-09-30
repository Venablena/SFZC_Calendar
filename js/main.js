console.log ("sanity check!")
//==============================
// Setting up the calendar
//==============================

//get current time parameters
var today = new Date()
const year = today.getFullYear()
// const month = today.getMonth()
const month = 9
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
   weekdayHeader.append(cellWeek)
})
//create calendar rows with dates: first select the correct HTML component
const calendar = document.querySelector(".calendar-dates")
//create empty cells until the start of the current month
for (let i = 0; i < firstWeekday; i++) {
  let cellPast = document.createElement("div")
  cellPast.className = "cell inactive"
  calendar.append(cellPast)
}//Do I need to reinitialize i or does firstDayOfMonth=null do the trick???

//create cells with a date, starting at the first weekday of the current month until the end of the month
let day = 1
while (day <= monthDays[month]) {
  let cellCurrent = document.createElement("div")
  cellCurrent.className = "cell active"
  cellCurrent.id = (month+1) + "-" + day + "-" + year//give each cell the id of the date they represent
  cellCurrent.textContent = day
  calendar.append(cellCurrent)
  day += 1
}

//create empty cells to fill the last calendar row, if necessary: first find out how many items are in the calendar
let calendarSize = calendar.children
//and if it's not divisible by 7, pad with empty cells until it is
while (calendarSize.length % 7 !== 0){
  let cellFuture = document.createElement("div")
  cellFuture.className = "cell inactive"
  calendar.append(cellFuture)
}

//========================================
// Populating calendar content
//========================================
//select the calendar cells that belong to the current month
let currentMonth = document.querySelectorAll(".cell.active")

//put events in cells with an id that matches the event date
currentMonth.forEach((calendarCell, index)=>{
  for (let i = 0; i < events.length; i++) {
    if(calendarCell.id === events[i].date){
      let event = document.createElement("p")
      event.className = events[i].center + " " + events[i].frequency
      event.textContent = events[i].name
      calendarCell.append(event)
      //create repeat instances for weekly events:
      if (events[i].frequency === "weekly") {
        for (let j = index + 7; j < currentMonth.length; j += 7) {
          let weeklyEvent = document.createElement("p")
          weeklyEvent.className = events[i].center + " " + events[i].frequency
          weeklyEvent.textContent = events[i].name
          currentMonth[j].append(weeklyEvent)
        }
      }
    }
  }
})

console.log ("sanity check!")
//==============================
// Setting up the calendar
//==============================

//get current time parameters
var today = new Date()
const year = today.getFullYear()
var month = today.getMonth()
//const month = 9
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
var dailyView = document.querySelector("#daily-view")
//select the hidden popup section
let popup = document.querySelector("#popup")
//this array is for the weekly view (later)
var descriptionsArray = []

currentMonth.forEach((calendarCell, index)=>{
  //find today
  let now = ((month+1) + "-" + date + "-" + year).toString()
  if(calendarCell.id === now){
    calendarCell.classList.add("today")
    now = null
  }
  //put events in cells with an id that matches the event date
  for (let i = 0; i < events.length; i++) {
    if(calendarCell.id === events[i].date){
      let event = document.createElement("p")
      event.className = events[i].center + " " + events[i].frequency
      event.id = events[i].id
      event.textContent = events[i].name
      calendarCell.append(event)

      //create an element with the event's description, time and center
      descriptionsArray.push(events[i].brief)//for the weekly view
      let startTime = document.createElement("p")
      startTime.textContent = events[i].timeStart
      let endTime = document.createElement("p")
      endTime.textContent = events[i].timeEnd
      let title = document.createElement("h3")
      title.textContent = events[i].name
      let center = document.createElement("p")
      center.textContent = events[i].center
      dailyView.append(startTime, endTime, title, center)
      // dailyview.append(endTime)
      // dailyview.append()
      //create repeat instances for weekly events:
      // if (events[i].frequency === "weekly") {
      //   for (let j = index + 7; j < currentMonth.length; j += 7) {
      //     let weeklyEvent = document.createElement("p")
      //     weeklyEvent.className = events[i].center + " " + events[i].frequency
      //     weeklyEvent.id = events[i].id
      //     weeklyEvent.textContent = events[i].name
      //     currentMonth[j].append(weeklyEvent)
      //     descriptionsArray.push(events[i].brief)
      //   }
      // }
    }
  }
  //interaction
  calendarCell.addEventListener('mouseenter', function(){
    dailyView.classList.remove("hidden")
    // daily.textContent = descriptionsArray[index]
  })

  calendarCell.addEventListener('mouseleave', function() {
    dailyView.classList.add("hidden")
  })
})

//===========================================
// Interactions with the calendar
//===========================================
//select appropriate HTML element
//let eventInstance = document.querySelectorAll("p")
//make the event description appear in the popup on mouseenter -THIS IS FOR THE WEEKLY VIEW
// eventInstance.forEach((paragraph, index)=>{
//   paragraph.addEventListener('mouseenter', function(){
//     popup.classList.remove("hidden")
//     popup.textContent = descriptionsArray[index]
//   })
  //and disappear on mouseleave
  //   paragraph.addEventListener('mouseleave', function(){
  //   popup.classList.add("hidden")
  //   popup.textContent = ""
  // })
//})

//==========================================
// Formatting the calendar
//==========================================
// now = document.querySelector(now)
// console.log(now);

//==========================================
// Next & Previous month
//==========================================
document.querySelector(".fa-chevron-right").addEventListener('click', function(){
  month = month + 1
  console.log(month);
})

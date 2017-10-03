console.log ("sanity check!")
var calendar = document.querySelector(".calendar-dates")
var dailyView = document.querySelector("#daily-view")
var currentMonth //this becomes the selector for the active month after it is drawn
var data

//==============================
// Setting up the calendar
//==============================
//get current time parameters
var now = new Date()
var year = now.getFullYear()
var month = now.getMonth()
//const weekday = now.getDay()
//const date = now.getDate()
now = null //reinitialize the current date for next page load (???)

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

//=====================================
// Drawing the calendar
//=====================================

document.addEventListener("DOMContentLoaded", function(){
  drawHeader()
  drawCalendar()
  // findToday()
})

function drawHeader(){
  const weekdayHeader = document.querySelector(".header-weekdays")
  //populate the weekdays from the array
  weekdays.forEach((day)=> {
     let cellWeek = document.createElement("div")
     cellWeek.className = "cell week"
     cellWeek.textContent = day.slice(0, 3)//abbreviate weekdays
     weekdayHeader.append(cellWeek)
  })
}//Does this need to return something?

//Where do I need to put this so it doesn't disappear with next/prev month navigation? Session memory?


function drawCalendar(){
  //display the current month and year in the calendar header
  document.getElementById("current-month").textContent = months[month] + year

  //find on which weekday the month starts
  var firstDayOfMonth = new Date(year, month, 1)
  var firstWeekday = firstDayOfMonth.getDay()

  //create empty cells until the start of the current month
  for (let i = 0; i < firstWeekday; i++) {
    let cellPast = document.createElement("div")
    cellPast.className = "cell inactive"
    calendar.append(cellPast)
  }

  //create cells with a date, starting at the first weekday of the current month until the end of the month
  let day = 1
  while (day <= monthDays[month]) {
    let cellCurrent = document.createElement("div")
    cellCurrent.className = "cell active"
    cellCurrent.id = day//year + "-" + (month+1) + "-" +  //give each cell the id of the date they represent
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
  //select the calendar cells that belong to the current month so thtat htey can be used by other functions
  currentMonth = document.querySelectorAll(".cell.active")
  //call the function to mark today's date
  findToday()
  //call the function to fill in the events
  populateCalendar()
}

function findToday(){
  //get today's date
  let today = new Date()
  //check that year and month match the current one
  if((today.getFullYear() === year) && (today.getMonth() === month)){
    //find the calendarCell that has today's date id
    currentMonth.forEach((calendarCell)=>{
      if(calendarCell.id === today.getDate().toString()){
        calendarCell.className += " today"
      }
    })
  }
}

//Populating calendar content :
function populateCalendar(){
  console.log("populating data")
  //retrieve data in the appropriate format from another function
  data = reformatData(events)
  eventsObject = data[year][month]
   //check if events for current year and month exist
   if(data[year][month]){
     currentMonth.forEach((calendarCell, index)=>{
       //find dates in data object that match with the calendar cell's date
       for (let dateHasEvent in eventsObject) {
         if (calendarCell.id === dateHasEvent) {
           //and populate the cells with them
           for (let i = 0; i < eventsObject[dateHasEvent].length; i++) {
             let event = document.createElement("p")
             event.textContent = eventsObject[dateHasEvent][i].name
             calendarCell.append(event)
             calendarCell.className += " has-events"
           }

         }
       }
     })
   }
   //show dailyview on mouseover
   currentMonth.forEach(calendarCell => {
     if(calendarCell.className.includes("has-events")){
       calendarCell.addEventListener('mouseenter', function(){
         dailyView.classList.remove("hidden")

         for (let i = 0; i < eventsObject[calendarCell.id].length; i++) {
           //create header with the date
           let dailyHeader = document.createElement("div")
           dailyHeader.className = "daily-header"
           let header = document.createElement("h2")
           header.textContent = months[month] + " " + calendarCell.id
           dailyHeader.append(header)
           //create event time information
           let eventTime = document.createElement("div")
           eventTime.className = "daily-time"
           let startTime = document.createElement("p")
           startTime.textContent = eventsObject[calendarCell.id][i].timeStart
           let endTime = document.createElement("p")
           endTime.textContent = eventsObject[calendarCell.id][i].timeEnd
           eventTime.append(startTime, endTime)
           //create event name and center information
           let eventRow = document.createElement("div")
           eventRow.className = "daily-event"
           let title = document.createElement("h3")
           title.textContent = eventsObject[calendarCell.id][i].name
           let center = document.createElement('p')
           center.textContent = eventsObject[calendarCell.id][i].center
           eventRow.append(title, center)
           dailyView.append(header, eventTime, eventRow)
           console.log("yo!");
         }
       })

       calendarCell.addEventListener('mouseleave', function() {
         dailyView.classList.add("hidden")
         dailyView.innerHTML = ""
       })
     }
   })
 }
  //   for (let i = 0; i < events.length; i++) {
  //     if(calendarCell.id === events[i].date){
  //
  //       event.className = events[i].center + " " + events[i].frequency
  //       event.id = events[i].id
  //
  //       calendarCell.append(event)


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
    //   }
    //===========================================
    // Interactions with the calendar
    //===========================================
    //select the hidden popup section

      //let popup = document.querySelector("#popup")

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


function reformatData(eventData){
  //reorganize the event data by month/year/date so that it can be used to populate the calendar
  let reformattedData = eventData.reduce(function(result, item){
    //format the event date into a JS Date Object so that it's easier to manipulate
    var eventFullDate = new Date (item.date + " " + item.timeStart)
    var eventYear = eventFullDate.getFullYear()
    var eventMonth = eventFullDate.getMonth()
    var eventDay = eventFullDate.getDate()
    //check if data categories already exist, if not, create them
    if(!result.hasOwnProperty(eventYear)){
      result[eventYear] = {}
    }
    if(!result[eventYear].hasOwnProperty(eventMonth)){
      result[eventYear][eventMonth] = {}
    }
    if(!result[eventYear][eventMonth].hasOwnProperty(eventDay)){
      result[eventYear][eventMonth][eventDay] = []
    }
    //sort the event objects into month/year/date categories
    result[eventYear][eventMonth][eventDay].push(item)
    return result
  },  {})
  return reformattedData
}

//==========================================
// Next & Previous month
//==========================================
document.querySelector(".fa-chevron-right").addEventListener('click', function(){
  calendar.innerHTML = "" //Find a better way!?
  if(month < 11){
    month += 1
  }else{
    month = 0
    year += 1
  }
  drawCalendar()
  //remove today
  // let cells = document.querySelectorAll(".cell.active")
  // cells.forEach((calendarCell)=>{
  //   calendarCell.classList.remove("today")
  // })
})

document.querySelector(".fa-chevron-left").addEventListener('click', function(){
  calendar.innerHTML = "" //Find a better way!?
  if(month > 0){
    month -= 1
  }else{
    month = 11
    year -= 1
  }
  drawCalendar()
  console.log(month);
  // let cells = document.querySelectorAll(".cell.active")
  // cells.forEach((calendarCell)=>{
  //   calendarCell.classList.remove("today")
  // })
})

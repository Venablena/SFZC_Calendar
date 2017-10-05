console.log ("sanity check!")
var calendar = document.querySelector(".calendar-dates")
var dailyView = document.querySelector("#daily-view")
var placeholder = document.querySelector("#placeholder")//this is used for my events
var currentMonth //this becomes the selector for the active month after it is drawn
var data //this is used to reformat the event data so that the calendar content can be gnerated from it
var eventArray //this will hold reformatted data so that it can be sorted by another function

//==============================
// Setting up the calendar
//==============================
//get current time parameters
var now = new Date()
var year = now.getFullYear()
var month = now.getMonth()
//const weekday = now.getDay()
var date = now.getDate()
// now = null //reinitialize the current date for next page load (???)

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
  populateDailyView(data[year][month][date], date) //generate today's daily view
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

function drawCalendar(){
  //display the current month and year in the calendar header
  document.getElementById("current-month").textContent = months[month] + " " + year

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
    cellCurrent.id = day //give each cell the id of the date they represent
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
  //select the calendar cells that belong to the current month so that they can be used by other functions
  currentMonth = document.querySelectorAll(".cell.active")
  //call the function to mark today's date
  findToday()
  //call the function to fill in the events
  populateCalendar()
  //call the function to load stored events in my events
  loadMyEvents()
}

function findToday(){
  //get today's date
  let today = new Date()
  //check that current year and month match the ones displayed in the calendar
  if((today.getFullYear() === year) && (today.getMonth() === month)){
    //find the calendarCell that has today's date id
    currentMonth.forEach((calendarCell)=>{
      if(calendarCell.id === today.getDate().toString()){
        calendarCell.className += " today"
      }
    })
  }
}

//populating calendar content
function populateCalendar(){
  //retrieve data in the appropriate format from another function
  data = reformatData(events)
  eventsObject = data[year][month]
   //check if there are events for current year and month
   if(eventsObject){
     currentMonth.forEach(calendarCell =>{
       //then check on which dates and match them with calendar cell id's
       for (let dateHasEvent in eventsObject) {
         if (calendarCell.id === dateHasEvent) {
           for (let i = 0; i < eventsObject[dateHasEvent].length; i++) {
             let event = document.createElement("p")
             event.textContent = eventsObject[dateHasEvent][i].name
             event.className = eventsObject[dateHasEvent][i].center
             calendarCell.append(event)
             calendarCell.className += " has-events"
           }
         }
       }
       //add a mouseover event on cells with events only to show the daily view
       if(calendarCell.className.includes("has-events")){
         calendarCell.addEventListener('mouseenter', function(){
            populateDailyView(eventsObject[calendarCell.id], calendarCell.id)
         })
       }
     })
   }
 }

//populating the daily view
function populateDailyView(item, day){
  // console.log("this is the item:" + item);
      dailyView.innerHTML = ""
      //create header with the date
      let dailyHeader = document.createElement("div")
      dailyHeader.className = "daily-header"
      let header = document.createElement("h2")
      header.textContent = months[month] + " " + day
      dailyHeader.append(header)
      dailyView.append(dailyHeader)
      //go through the day's events and fill the daily view with their info
      for (let i = 0; i < item.length; i++) {
        let eventRow = document.createElement("div")
        eventRow.className = "event-row"
        //create event time information
        let eventTime = document.createElement("div")
        eventTime.className = "daily-time"
        let startTime = document.createElement("h3")
        startTime.textContent = item[i].timeStart
        let endTime = document.createElement("h3")
        endTime.textContent = item[i].timeEnd
        eventTime.append(startTime, endTime)
        //create event name and center information
        let dailyEvent = document.createElement("div")
        dailyEvent.className = "daily-event"
        let title = document.createElement("h4")
        title.textContent = item[i].name
        let center = document.createElement('div')
        if(item[i].center == "CC"){
          center.textContent = "City Center"
        }else if (item[i].center == "GG") {
          center.textContent = "Green Gulch Farm"
        }
        let hidden = document.createElement("div")
        hidden.innerHTML = "<i class='fa fa-check-circle-o fa-2x' aria-hidden='true'></i><span>  Click here to save to My Events</span>"
        hidden.className = "event-over hidden"
        let briefRow = document.createElement("div")
        let dailyBrief = document.createElement("p")
        briefRow.className = "daily-brief"
        dailyBrief.textContent = item[i].brief
        dailyEvent.append(title, center)
        eventRow.append(eventTime, dailyEvent, hidden)
        briefRow.append(dailyBrief)
        eventRow.className += " " + item[i].center
        dailyView.append(eventRow, briefRow)
        //call a function to be able to add events to my events
        eventRow.addEventListener('mouseenter', function(){
          hidden.classList.remove("hidden")
        })
        eventRow.addEventListener('mouseleave', function(){
          hidden.classList.add("hidden")
        })
        eventRow.addEventListener('click', function(){
          hidden.classList.add("hidden")
          addToMyEvents(eventRow)
        })
      }
}

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

//1st try
// function sortDates(array, newItem){
//     //debugger
//     let i = array.length-1
//     while ((i >= 0) && (newItem.timeStart < array[i].timeStart)) {
//       i--
//     }
//     let newArray = array.slice(0, i+1)
//     let temp = array.slice(i+1, array.length)
//     newArray.push(newItem)
//     newArray = newArray.concat(temp)
// console.log(newArray);
//     return newArray
//  }

// function sortDates(array, newItem){
//   let newArray = []
//      for (let i = 0; i < array.length; i++) {      if(newItem.timeStart < array[i].timeStart){
//         newArray = array.slice(0, i)
//         let temp = array.slice(i+1, array.length)
//         newArray.push(newItem)
//         newArray = newArray.concat(temp)
//         console.log(newArray);
//       }
//     }
//     return newArray
//   }

//mess?
 // function sortDates(array, newItem){
 //   let newArray = []
 //   let i = 0
 //      while((newItem.timeStart < array[i].timeStart)&& i < array.length){
 //        i-- }
 //        // console.log(newItem.timeStart + newItem.name + newItem.date);
 //        // console.log(array[i].timeStart + array[i].name + array[i].date);
 //        newArray = array.slice(0, i+1)
 //        console.log(newArray);
 //        let temp = array.slice(i+1, array.length)
 //        newArray.push(newItem)
 //        // console.log(newArray);
 //        newArray = newArray.concat(temp)
 //        // console.log(newArray);
 //      //}
 //      // else{
 //      //   newArray = newArray.push(newItem)
 //      //   // console.log(newArray);
 //      // }
 //    //}
 //    return newArray
 // }



//==========================================
// Interactions
//==========================================
//next and previous month
document.querySelector(".fa-chevron-right").addEventListener('click', function(){
  calendar.innerHTML = "" //Find a better way!?
  if(month < 11){
    month += 1
  }else{
    month = 0
    year += 1
  }
  drawCalendar()
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
  console.log(year)
  console.log(month);
})

//my events
//add and fetch events from local storage
function addToMyEvents(element){
  //get the date in the header
  let time = document.createElement("div")
  time.innerHTML = element.parentNode.firstChild.innerHTML
  let content = document.createElement("div")
  content.className = "my-event-row"
  content.append(time)
  content.innerHTML += element.innerHTML
  //add a close button
  let close = document.createElement("div")
  close.className = "close"
  close.innerHTML = "<i class='fa fa-times fa-lg' aria-hidden='true'></i>"
  content.append(close)
  placeholder.append(content)
  saveMyEvents()
  //call the function to remove events
  removeMyEvents()
}

function saveMyEvents(){
  localStorage.setItem("myEvent", placeholder.innerHTML)
}

function removeMyEvents(){
  let item = document.querySelectorAll(".close")
  item.forEach(el =>{
    el.addEventListener('click', function(){
      el.parentNode.remove()
      saveMyEvents()
    })
  })
}

function loadMyEvents(){
  if(localStorage.getItem("myEvent")){
    let eventStored = localStorage.getItem("myEvent")
    placeholder.innerHTML = eventStored
    removeMyEvents()
  }
}

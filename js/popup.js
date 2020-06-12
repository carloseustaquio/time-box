'use strict';

function setAlarm(minutes, id) {
  chrome.alarms.create(`alarm.${id}`, { delayInMinutes: minutes })
}

function saveNewAlarm(event) {
  event.preventDefault()

  const newAlarm = {
    id: parseInt(Math.random() * 1000),
    label: event.target[0].value,
    time: parseFloat(event.target[1].value),
  }

  chrome.storage.sync.get("alarms", function({ alarms }) {
    console.log(alarms)
    if (alarms) {
      chrome.storage.sync.set({ 
        alarms: [...alarms, newAlarm]
      })
    } else {
      chrome.storage.sync.set({ 
        alarms: [ newAlarm ] 
      })
    }
  })
  
  setAlarm(newAlarm.time, newAlarm.id)
}

function changePage(event) {
  const pageNumber = parseInt(event.target.value)
  const container = document.querySelector(".container")
  container.style.left = `${(pageNumber - 1) * - 350}px`
}

function clearAlarms(event) {
  event.preventDefault()
  chrome.storage.sync.remove("alarms", function() {
    console.log("cleared!")
    chrome.storage.sync.get("alarms", function({ alarms }) {
      console.log("alarms: ", alarms)
    })
  })
}

function getAllAlarms(event) {
  event.preventDefault()
  chrome.storage.sync.get("alarms", function({ alarms }) {
    console.log("alarms: ", alarms)
  })
}

document.querySelector("#newTimeBox").addEventListener('submit', saveNewAlarm)
document.querySelector("#newBtn").addEventListener('click', changePage)
document.querySelector("#prevBtn").addEventListener('click', changePage)
document.querySelector("#clear").addEventListener('click', clearAlarms)
document.querySelector("#getAll").addEventListener('click', getAllAlarms)

"use strict";
import TimeBox from "./models/TimeBox.js";
import handlePage from "./helpers/handlePage.js";

/** Handle form submition for new TimeBox */
document.querySelector("#newTimeBox").addEventListener("submit", (event) => {
  event.preventDefault();
  const timeBox = new TimeBox(
    event.target[0].value,
    parseFloat(event.target[1].value)
  );
  timeBox.createTimeBox();
});

/** Handle List TimeBoxes on page load */
window.addEventListener("load", (event) => {
  TimeBox.listTimeBoxes();
});

/** Handle page transitions */
document.querySelector("#newBtn").addEventListener("click", handlePage);
document.querySelector("#prevBtn").addEventListener("click", handlePage);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "list_timeboxes") {
    TimeBox.listTimeBoxes();
  }
});

// document.querySelector("#getAll").addEventListener("click", async (event) => {
//   const timeBoxes = await TimeBox.getAllTimeBoxes();
//   console.log(timeBoxes);
// });

// document.querySelector("#clear").addEventListener("click", async (event) => {
//   await TimeBox.clearTimeBoxes();
// });

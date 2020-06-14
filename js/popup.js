"use strict";
import TimeBox from "./models/TimeBox.js";
import handlePage from "./helpers/handlePage.js";
import startTime from "./helpers/clock.js";

/** Handle form submition for new TimeBox */
document
  .querySelector("#newTimeBox")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const timeErrorMessage = document.querySelector("#timeErrorMessage");
    const formData = new FormData(event.target);
    const label = formData.get("label");
    const hour = parseInt(formData.get("hour") || 0);
    const minutes = parseInt(formData.get("minutes") || 0);

    if (hour === 0 && minutes === 0) {
      /** Check if time is selected */
      timeErrorMessage.appendChild(document.createTextNode("Select the time"));
    } else {
      const timeBox = new TimeBox(label, parseFloat(hour * 60 + minutes));
      await new Promise((resolve, reject) => timeBox.createTimeBox(resolve));
      handlePage(1);
      document.getElementById("newTimeBox").reset();

      if (timeErrorMessage.childNodes[0]) {
        timeErrorMessage.removeChild(timeErrorMessage.childNodes[0]);
      }
    }
  });

/** Handle List TimeBoxes on page load */
window.addEventListener("load", (event) => {
  TimeBox.listTimeBoxes();
  startTime();
});

/** Handle page transitions */
document
  .querySelector("#newBtn")
  .addEventListener("click", (event) =>
    handlePage(parseInt(event.target.value))
  );
document
  .querySelector("#backButton")
  .addEventListener("click", (event) =>
    handlePage(parseInt(event.target.value))
  );

/** Handle info button transition and onclick */
document.querySelector(".infoBox").addEventListener("click", (event) => {
  window.open("https://github.com/carloseustaquio/time-box", "_blank");
});

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

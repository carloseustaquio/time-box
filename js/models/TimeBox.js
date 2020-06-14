export default class TimeBox {
  constructor(label, time) {
    this.label = label;
    this.time = time;
  }

  /** Creates a new alarm and saves its data to the chrome storage */
  createTimeBox = (callback) => {
    const newAlarm = {
      id: parseInt(Math.random() * 1000),
      label: this.label,
      time: this.time,
    };

    chrome.storage.sync.get("alarms", function ({ alarms }) {
      console.log(alarms);
      let result = null;
      if (alarms) {
        chrome.storage.sync.set({
          alarms: [...alarms, newAlarm],
        });
        TimeBox.listTimeBoxes();
      } else {
        chrome.storage.sync.set({
          alarms: [newAlarm],
        });
        TimeBox.listTimeBoxes();
      }
      chrome.alarms.create(`alarm.${newAlarm.id}`, {
        delayInMinutes: newAlarm.time,
      });
    });

    callback();
  };

  /** Helper method to delete all TimeBoxes */
  static deleteTimeBox = async (id) => {
    const result = await new Promise(async (resolve, reject) => {
      const alarms = await this.getAllTimeBoxes();
      const filteredAlarms = alarms.filter((alarm) => alarm.id !== id);

      chrome.storage.sync.set({ alarms: filteredAlarms }, function () {
        chrome.alarms.clear(`alarm.${id}`, function (wasCleared) {
          resolve(`TimeBox deleted (id: ${id}): ` + wasCleared);
        });
      });
    });
    console.log(result);
    this.listTimeBoxes();
  };

  /** (Promise) Returns all the alarms in an array of objects */
  static getAllTimeBoxes = async () => {
    return await new Promise((resolve, reject) =>
      chrome.storage.sync.get("alarms", function ({ alarms }) {
        resolve(alarms);
      })
    );
  };

  /** Helper method to delete all TimeBoxes */
  static clearTimeBoxes = async () => {
    const result = await new Promise((resolve, reject) =>
      chrome.storage.sync.remove("alarms", function () {
        chrome.alarms.clearAll(function (wasCleared) {
          resolve("All TimeBoxes deleted: " + wasCleared);
        });
      })
    );
    console.log(result);
    this.listTimeBoxes();
  };

  /** List TimeBoxes in Home */
  static listTimeBoxes = async () => {
    const alarms = await this.getAllTimeBoxes();
    const list = document.querySelector("#timBoxUl");

    if (!alarms || !alarms.length) {
      list.innerHTML = "";
      list.insertAdjacentHTML(
        "afterbegin",
        `<span id="noTimeBoxesAlert">No TimeBoxes yet!</span>`
      );
    } else {
      list.innerHTML = "";
      alarms.forEach((alarm) => {
        /** Create item */
        const item = document.createElement("li");
        item.insertAdjacentHTML(
          "afterbegin",
          `
            <span class="material-icons alarmIcon">alarm</span>
            <div class="alarmData">
              <span class="label">${alarm.label}</span>
              <span class="time">${alarm.time} min</span>
            </div>
          `
        );
        /** Create delete button for item */
        const deleteButton = document.createElement("button");
        deleteButton.insertAdjacentHTML(
          "afterbegin",
          `<span class="material-icons">clear</span>`
        );
        deleteButton.classList = "deleteButton";
        deleteButton.onclick = (event) => this.deleteTimeBox(alarm.id);
        item.appendChild(deleteButton);
        /** Append item to list */
        list.appendChild(item);
      });
    }
  };
}

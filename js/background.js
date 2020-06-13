function deleteAlarm(allAlarms, currentAlarm) {
  const newAlarms = allAlarms.filter((al) => al.id !== currentAlarm.id);

  chrome.storage.sync.set({
    alarms: newAlarms,
  });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  const alarmId = parseInt(alarm.name.split(".")[1]);

  chrome.storage.sync.get("alarms", async function ({ alarms }) {
    const currentAlarm = alarms.find((al) => al.id === alarmId);
    console.log(currentAlarm);

    chrome.notifications.create(
      `${currentAlarm.id}`,
      {
        type: "basic",
        iconUrl: "timebox_logo128.png",
        title: `TimeBox end!`,
        message: `${currentAlarm.label}`,
        buttons: [{ title: "Thanks!" }],
        priority: 0,
      },
      function () {
        deleteAlarm(alarms, currentAlarm);
        chrome.runtime.sendMessage({
          msg: "list_timeboxes",
        });
      }
    );
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const userEntries = [
    {
      date: "2023-10-01",
      name: "John Doe",
      image: "image1.jpg",
      journalEntry: "Had a great day!",
      hoursOfSleep: 7,
      mood: ["Energetic", "Happy"],
    },
    {
      date: "2023-10-02",
      name: "John Doe",
      image: "image2.jpg",
      journalEntry: "Feeling a bit tired.",
      hoursOfSleep: 5,
      mood: ["Tired", "Anxious"],
    },
    {
      date: "2023-10-03",
      name: "John Doe",
      image: "image3.jpg",
      journalEntry: "Very productive day!",
      hoursOfSleep: 8,
      mood: ["Motivated", "Energetic"],
    },
  ];

  const sleepInput = document.querySelector('input[type="number"]');
  const sleepBar = document.getElementById("sleep-bar");
  const averageSleepDisplay = document.getElementById("average-sleep");
  const moodCheckboxes = document.querySelectorAll(
    '.mood-checkboxes input[type="checkbox"]'
  );
  const moodCountsDisplay = document.getElementById("mood-counts");
  const userEntriesContainer = document.getElementById("user-entries");
  const submitEntryButton = document.getElementById("submit-entry");

  sleepInput.addEventListener("input", updateSleepIndicator);
  moodCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateMoodCounts);
  });
  submitEntryButton.addEventListener("click", handleSubmitEntry);

  function updateSleepIndicator() {
    const hoursOfSleep = parseInt(sleepInput.value, 10) || 0;
    const maxSleep = 10; // Assuming 10 hours is the maximum for a full bar
    const barWidth = Math.min((hoursOfSleep / maxSleep) * 200, 200); // Calculate bar width

    sleepBar.setAttribute("width", barWidth);

    // Update the current day's entry
    const today = new Date().toISOString().split("T")[0];
    let todayEntry = userEntries.find((entry) => entry.date === today);
    if (!todayEntry) {
      todayEntry = {
        date: today,
        name: "",
        image: "",
        journalEntry: "",
        hoursOfSleep: 0,
        mood: [],
      };
      userEntries.push(todayEntry);
    }
    todayEntry.hoursOfSleep = hoursOfSleep;

    // Update average sleep display
    updateAverageSleep();
    renderUserEntries();
  }

  function updateMoodCounts() {
    const today = new Date().toISOString().split("T")[0];
    let todayEntry = userEntries.find((entry) => entry.date === today);
    if (!todayEntry) {
      todayEntry = {
        date: today,
        name: "",
        image: "",
        journalEntry: "",
        hoursOfSleep: 0,
        mood: [],
      };
      userEntries.push(todayEntry);
    }

    todayEntry.mood = Array.from(moodCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    // Update mood counts display
    updateMoodCountsDisplay();
    renderUserEntries();
  }

  function updateAverageSleep() {
    const totalSleep = userEntries.reduce(
      (sum, entry) => sum + entry.hoursOfSleep,
      0
    );
    const averageSleep = (totalSleep / userEntries.length).toFixed(2);
    averageSleepDisplay.textContent = `Average Hours Slept: ${averageSleep}`;
  }

  function updateMoodCountsDisplay() {
    const moodCounts = userEntries.reduce((counts, entry) => {
      entry.mood.forEach((mood) => {
        counts[mood] = (counts[mood] || 0) + 1;
      });
      return counts;
    }, {});

    moodCountsDisplay.textContent = `Mood Counts: ${Object.entries(moodCounts)
      .map(([mood, count]) => `${mood}: ${count}`)
      .join(", ")}`;
  }

  function renderUserEntries() {
    userEntriesContainer.innerHTML = "";
    userEntries.forEach((entry) => {
      const entryCard = document.createElement("div");
      entryCard.className = "entry-card";
      entryCard.innerHTML = `
        <p><strong>Date:</strong> ${entry.date}</p>
        <p><strong>Name:</strong> ${entry.name}</p>
        <p><strong>Journal Entry:</strong> ${entry.journalEntry}</p>
        <p><strong>Hours of Sleep:</strong> ${entry.hoursOfSleep}</p>
        <p><strong>Mood:</strong> ${entry.mood.join(", ")}</p>
      `;
      userEntriesContainer.appendChild(entryCard);
    });
  }

  function handleSubmitEntry() {
    const today = new Date().toISOString().split("T")[0];
    let todayEntry = userEntries.find((entry) => entry.date === today);
    if (!todayEntry) {
      todayEntry = {
        date: today,
        name: "User",
        image: "",
        journalEntry: "User's journal entry", 
        hoursOfSleep: parseInt(sleepInput.value, 10) || 0,
        mood: Array.from(moodCheckboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value),
      };
      userEntries.push(todayEntry);
    } else {
      todayEntry.hoursOfSleep = parseInt(sleepInput.value, 10) || 0;
      todayEntry.mood = Array.from(moodCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
    }

    updateAverageSleep();
    updateMoodCountsDisplay();
    renderUserEntries();
  }

  // Initial computation and display
  updateAverageSleep();
  updateMoodCountsDisplay();
  renderUserEntries();
});

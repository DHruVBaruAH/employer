document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      window.location.href = "index.html"
      return
    }
  
    // Set user email from localStorage
    const userEmail = localStorage.getItem("userEmail")
    document.getElementById("userEmail").textContent = userEmail
  
    // Initialize attendance calendar
    renderAttendanceCalendar()
  
    // Initialize attendance log
    renderAttendanceLog()
  
    // Event listeners for modals
    const modals = document.querySelectorAll(".modal")
    const closeButtons = document.querySelectorAll(".close-modal")
  
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal")
        modal.classList.remove("active")
      })
    })
  
    // Close modal when clicking outside
    modals.forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          this.classList.remove("active")
        }
      })
    })
  
    // Mark attendance button
    document.getElementById("markAttendanceBtn").addEventListener("click", openMarkAttendanceModal)
  
    // Cancel attendance button
    document.getElementById("cancelAttendanceBtn").addEventListener("click", () => {
      document.getElementById("markAttendanceModal").classList.remove("active")
    })
  
    // Mark attendance form submission
    document.getElementById("markAttendanceForm").addEventListener("submit", (e) => {
      e.preventDefault()
      markAttendance()
    })
  
    // Month and year change
    document.getElementById("attendanceMonth").addEventListener("change", () => {
      renderAttendanceCalendar()
      renderAttendanceLog()
    })
  
    document.getElementById("attendanceYear").addEventListener("change", () => {
      renderAttendanceCalendar()
      renderAttendanceLog()
    })
  
    // Update current time in the mark attendance modal
    updateCurrentDateTime()
    setInterval(updateCurrentDateTime, 1000)
  })
  
  // Sample attendance data
  const attendanceData = [
    { date: "2025-02-01", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-02", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-03", checkIn: "09:15 AM", checkOut: "05:45 PM", status: "late" },
    { date: "2025-02-04", checkIn: "08:55 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-05", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-06", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-07", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-08", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-09", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-10", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-11", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-12", checkIn: "", checkOut: "", status: "leave" },
    { date: "2025-02-13", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-14", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-15", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-16", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-17", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-18", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-19", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-20", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-21", checkIn: "09:30 AM", checkOut: "05:30 PM", status: "late" },
    { date: "2025-02-22", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-23", checkIn: "", checkOut: "", status: "weekend" },
    { date: "2025-02-24", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-25", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-26", checkIn: "09:45 AM", checkOut: "05:30 PM", status: "late" },
    { date: "2025-02-27", checkIn: "09:00 AM", checkOut: "05:30 PM", status: "present" },
    { date: "2025-02-28", checkIn: "", checkOut: "", status: "absent" },
  ]
  
  // Render attendance calendar
  function renderAttendanceCalendar() {
    const attendanceCalendar = document.getElementById("attendanceCalendar")
    attendanceCalendar.innerHTML = ""
  
    const month = Number.parseInt(document.getElementById("attendanceMonth").value) - 1 // JavaScript months are 0-indexed
    const year = Number.parseInt(document.getElementById("attendanceYear").value)
  
    const date = new Date(year, month, 1)
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayIndex = firstDay.getDay()
  
    // Get the last day of the previous month
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  
    // Get the total days in the current month
    const daysInMonth = lastDay.getDate()
  
    // Add days from the previous month
    for (let i = firstDayIndex; i > 0; i--) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("calendar-day", "other-month")
  
      const dayNumber = document.createElement("div")
      dayNumber.classList.add("day-number")
      dayNumber.textContent = prevLastDay - i + 1
  
      dayElement.appendChild(dayNumber)
      attendanceCalendar.appendChild(dayElement)
    }
  
    // Add days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("calendar-day")
  
      const dayNumber = document.createElement("div")
      dayNumber.classList.add("day-number")
      dayNumber.textContent = i
  
      const dayStatus = document.createElement("div")
      dayStatus.classList.add("day-status")
  
      // Format the date to match our attendance data format
      const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
  
      // Find attendance data for this date
      const attendance = attendanceData.find((a) => a.date === formattedDate)
  
      if (attendance) {
        dayStatus.classList.add(`status-${attendance.status}`)
  
        // Add attendance details
        const statusText = document.createElement("div")
        statusText.classList.add("status-text")
        statusText.textContent = attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)
  
        dayElement.appendChild(dayNumber)
        dayElement.appendChild(dayStatus)
        dayElement.appendChild(statusText)
  
        if (attendance.checkIn) {
          const checkInText = document.createElement("div")
          checkInText.classList.add("check-time")
          checkInText.textContent = attendance.checkIn
          dayElement.appendChild(checkInText)
        }
      } else {
        dayElement.appendChild(dayNumber)
      }
  
      attendanceCalendar.appendChild(dayElement)
    }
  
    // Add days from the next month
    const totalDaysDisplayed = attendanceCalendar.children.length
    const daysToAdd = 42 - totalDaysDisplayed // 6 rows of 7 days
  
    for (let i = 1; i <= daysToAdd; i++) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("calendar-day", "other-month")
  
      const dayNumber = document.createElement("div")
      dayNumber.classList.add("day-number")
      dayNumber.textContent = i
  
      dayElement.appendChild(dayNumber)
      attendanceCalendar.appendChild(dayElement)
    }
  }
  
  // Render attendance log
  function renderAttendanceLog() {
    const attendanceLogBody = document.getElementById("attendanceLogBody")
    attendanceLogBody.innerHTML = ""
  
    const month = Number.parseInt(document.getElementById("attendanceMonth").value) - 1 // JavaScript months are 0-indexed
    const year = Number.parseInt(document.getElementById("attendanceYear").value)
  
    // Filter attendance data for the selected month and year
    const filteredData = attendanceData.filter((a) => {
      const date = new Date(a.date)
      return date.getMonth() === month && date.getFullYear() === year
    })
  
    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))
  
    // Only show the first 10 entries
    const recentData = filteredData.slice(0, 10)
  
    recentData.forEach((attendance) => {
      const row = document.createElement("tr")
  
      // Format date
      const date = new Date(attendance.date)
      const formattedDate = `${date.getDate()}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`
  
      // Calculate working hours
      let workingHours = ""
      if (attendance.checkIn && attendance.checkOut) {
        const checkIn = new Date(`2025-01-01 ${attendance.checkIn}`)
        const checkOut = new Date(`2025-01-01 ${attendance.checkOut}`)
        const diff = (checkOut - checkIn) / (1000 * 60 * 60)
        workingHours = `${diff.toFixed(2)} hrs`
      }
  
      row.innerHTML = `
              <td>${formattedDate}</td>
              <td>${attendance.checkIn || "-"}</td>
              <td>${attendance.checkOut || "-"}</td>
              <td>${workingHours || "-"}</td>
              <td><span class="status-badge ${attendance.status}">${attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}</span></td>
          `
  
      attendanceLogBody.appendChild(row)
    })
  }
  
  // Open mark attendance modal
  function openMarkAttendanceModal() {
    // Show the modal
    document.getElementById("markAttendanceModal").classList.add("active")
  }
  
  // Mark attendance
  function markAttendance() {
      const attendanceType = document.getElementById('attendanceType').value;
      const note = document.getElementById('attendanceNote').value;
      
      // Get current date
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      // Find if there's an existing entry for today
      const todayIndex = attendanceData.findIndex(a => a.date === formattedDate);
      
      if (todayIndex !== -1) {
          // Update existing entry
          if (attendanceType === 'checkIn') {
              attendanceData[todayIndex].checkIn = formattedTime;
              attendanceData[todayIndex].status = 'present';
          } else {
              attendanceData[todayIndex].checkOut = formattedTime;
          }
      } else {
          // Create new entry
          const newEntry = {
              date: formattedDate,
              checkIn: attendanceType === 'checkIn' ? formattedTime : '',
              checkOut: attendanceType === 'checkOut' ? formattedTime : '',
              status: 'present'
          };
          
          attendanceData.push(newEntry);
      }
      
      // Update UI
      renderAttendanceCalendar();
      renderAttendanceLog();
      
      // Close the modal
      document.getElementById("markAttendanceModal").classList.remove("active");
  }
  
  // Update current date and time in the modal
  function updateCurrentDateTime() {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      document.getElementById("currentDateTime").textContent = `${formattedDate} ${formattedTime}`;
  }
  
  
// API Configuration
const API_BASE_URL = 'http://localhost:8086/api';
const API_CONFIG = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "../../index.html";
        return;
    }

    try {
        // Check server connection
        const response = await fetch(`${API_BASE_URL}/`, {
            ...API_CONFIG,
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Server connection failed');
        }

        // Load initial data
        await loadEmployeeData();
    } catch (error) {
        console.error('Failed to connect to server:', error);
        // Handle error (show message to user)
    }

    // Set user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("employeeEmail").textContent = userEmail;

    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize calendar
    renderCalendar();

    // Initialize holiday table
    renderHolidayTable();

    // Event listeners for edit profile
    document.getElementById("editProfileBtn").addEventListener("click", openEditProfileModal);

    // Event listeners for modals
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    closeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const modal = this.closest(".modal");
            modal.classList.remove("active");
        });
    });

    // Close modal when clicking outside
    modals.forEach((modal) => {
        modal.addEventListener("click", function (e) {
            if (e.target === this) {
                this.classList.remove("active");
            }
        });
    });

    // Edit profile form submission
    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        updateEmployeeData();
    });

    // Cancel edit button
    document.getElementById("cancelEditBtn").addEventListener("click", () => {
        document.getElementById("editProfileModal").classList.remove("active");
    });

    // Calendar navigation
    document.getElementById("prevMonth").addEventListener("click", () => {
        const currentMonth = document.getElementById("currentMonth").textContent;
        const [month, year] = currentMonth.split(" ");
        const date = new Date(`${month} 1, ${year}`);
        date.setMonth(date.getMonth() - 1);
        document.getElementById("currentMonth").textContent =
            `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
        renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        const currentMonth = document.getElementById("currentMonth").textContent;
        const [month, year] = currentMonth.split(" ");
        const date = new Date(`${month} 1, ${year}`);
        date.setMonth(date.getMonth() + 1);
        document.getElementById("currentMonth").textContent =
            `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
        renderCalendar();
    });

    // Holiday controls
    document.getElementById("holidayYear").addEventListener("change", renderHolidayTable);
    document.getElementById("holidayMonth").addEventListener("change", renderHolidayTable);

    // Load profile data
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    const leaveBalance = JSON.parse(localStorage.getItem('leaveBalance'));
    const recentActivity = JSON.parse(localStorage.getItem('recentActivity'));
    const attendance = JSON.parse(localStorage.getItem('attendance'));

    // Update profile section
    document.getElementById('profileAvatar').src = profile.avatar;
    document.getElementById('employeeName').textContent = profile.name;
    document.getElementById('employeeId').textContent = profile.id;
    document.getElementById('userEmail').textContent = profile.email;

    // Update quick stats
    const quickStats = document.querySelector('.quick-stats');
    quickStats.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span>Today's Status: ${attendance.status}</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-calendar-check"></i>
            <span>Attendance: ${attendance.percentage}%</span>
        </div>
    `;

    // Update leave balance
    const leaveCards = document.querySelector('.leave-cards');
    leaveCards.innerHTML = `
        <div class="leave-info-item">
            <h4>Casual Leave</h4>
            <p class="leave-count">${leaveBalance.casual}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Earned Leave</h4>
            <p class="leave-count">${leaveBalance.earned}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Sick Leave</h4>
            <p class="leave-count">${leaveBalance.sick}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Compensatory Leave</h4>
            <p class="leave-count">${leaveBalance.compensatory}</p>
            <span class="leave-label">Available</span>
        </div>
    `;

    // Update recent activity
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = recentActivity.map(activity => `
        <div class="activity-item">
            <i class="fas fa-${activity.icon}"></i>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                <p>${activity.description || activity.time}</p>
            </div>
        </div>
    `).join('');
});

// Load employee data
async function loadEmployeeData() {
    try {
        const employeeId = localStorage.getItem('employeeId');
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            ...API_CONFIG,
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to load employee data');
        }

        const data = await response.json();
        updateUIWithEmployeeData(data);
    } catch (error) {
        console.error('Error loading employee data:', error);
        // Handle error (show message to user)
    }
}

// Update employee data
async function updateEmployeeData() {
    try {
        const employeeId = localStorage.getItem('employeeId');
        const updatedData = {
            name: document.getElementById("editName").value,
            email: document.getElementById("editEmail").value,
            phone: document.getElementById("editPhone").value,
            gender: document.getElementById("editGender").value,
            joiningDate: document.getElementById("editJoiningDate").value,
            birthDate: document.getElementById("editBirthDate").value,
            degree: document.getElementById("editDegree").value
        };

        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            ...API_CONFIG,
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update employee data');
        }

        const data = await response.json();
        updateUIWithEmployeeData(data);
        document.getElementById("editProfileModal").classList.remove("active");
    } catch (error) {
        console.error('Error updating employee data:', error);
        // Handle error (show message to user)
    }
}

// Helper function to update UI with employee data
function updateUIWithEmployeeData(data) {
    // Update profile section
    document.getElementById('profileAvatar').src = data.avatarUrl || '../img/avatar.png';
    document.getElementById('employeeName').textContent = data.name;
    document.getElementById('employeeId').textContent = data.employeeId;
    document.getElementById('employeeEmail').textContent = data.email;
    document.getElementById('employeePhone').textContent = data.phone;
    document.getElementById('employeeGender').textContent = data.gender;
    document.getElementById('employeeJoiningDate').textContent = data.joiningDate;
    document.getElementById('employeeBirthDate').textContent = data.birthDate;
    document.getElementById('employeeDegree').textContent = data.degree;

    // Update quick stats
    const quickStats = document.querySelector('.quick-stats');
    quickStats.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span>Today's Status: ${data.currentStatus || 'Present'}</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-calendar-check"></i>
            <span>Attendance: ${data.attendancePercentage || 100}%</span>
        </div>
    `;

    // Update leave balance
    const leaveCards = document.querySelector('.leave-cards');
    leaveCards.innerHTML = `
        <div class="leave-info-item">
            <h4>Casual Leave</h4>
            <p class="leave-count">${data.casualLeave || 0}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Earned Leave</h4>
            <p class="leave-count">${data.earnedLeave || 0}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Sick Leave</h4>
            <p class="leave-count">${data.sickLeave || 0}</p>
            <span class="leave-label">Available</span>
        </div>
        <div class="leave-info-item">
            <h4>Compensatory Leave</h4>
            <p class="leave-count">${data.compensatoryLeave || 0}</p>
            <span class="leave-label">Available</span>
        </div>
    `;
}

// Open edit profile modal
function openEditProfileModal() {
    // Populate the form with current data
    document.getElementById("editName").value = employeeData.name;
    document.getElementById("editEmail").value = employeeData.email;
    document.getElementById("editPhone").value = employeeData.phone;
    document.getElementById("editGender").value = employeeData.gender;
    document.getElementById("editJoiningDate").value = employeeData.joiningDate;
    document.getElementById("editBirthDate").value = employeeData.birthDate;
    document.getElementById("editDegree").value = employeeData.highestDegree;

    // Show the modal
    document.getElementById("editProfileModal").classList.add("active");
}

// Clock functionality
function updateClock() {
    const now = new Date();
    const secondHand = document.querySelector('.second-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const hourHand = document.querySelector('.hour-hand');
    const digitalTime = document.querySelector('.digital-time');

    // Calculate rotations
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Calculate degrees (starting from 12 o'clock position)
    const secondsDegrees = ((seconds / 60) * 360) - 90;
    const minutesDegrees = ((minutes / 60) * 360 + (seconds / 60) * 6) - 90;
    const hoursDegrees = ((hours / 12) * 360 + (minutes / 60) * 30) - 90;

    // Apply rotations
    secondHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;

    // Update digital time with leading zeros
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    digitalTime.textContent = timeString;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Calendar functionality
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.events = this.loadEvents();
        
        this.initializeCalendar();
        this.attachEventListeners();
    }

    loadEvents() {
        // Sample events - in a real app, this would come from a backend
        return {
            '2024-02-14': [{ title: 'Team Meeting', type: 'meeting' }],
            '2024-02-20': [{ title: 'Project Deadline', type: 'deadline' }],
            '2024-02-25': [{ title: 'Training Session', type: 'training' }]
        };
    }

    initializeCalendar() {
        this.updateMonthDisplay();
        this.renderCalendar();
        this.updateTodayEvents();
    }

    attachEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateMonth(1);
        });
    }

    navigateMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateMonthDisplay();
        this.renderCalendar();
    }

    updateMonthDisplay() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${months[this.currentMonth]} ${this.currentYear}`;
    }

    renderCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if it's today
            const currentDate = new Date();
            if (day === currentDate.getDate() && 
                this.currentMonth === currentDate.getMonth() && 
                this.currentYear === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }

            // Check for events
            const dateString = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.events[dateString]) {
                dayElement.classList.add('has-event');
            }

            calendarDays.appendChild(dayElement);
        }
    }

    updateTodayEvents() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        const todayEvents = this.events[dateString] || [];
        
        if (todayEvents.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.className = 'event-item';
            noEvents.innerHTML = '<i class="fas fa-calendar-check"></i> No events today';
            eventsList.appendChild(noEvents);
            return;
        }

        todayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <i class="fas fa-${this.getEventIcon(event.type)}"></i>
                <span>${event.title}</span>
            `;
            eventsList.appendChild(eventElement);
        });
    }

    getEventIcon(type) {
        const icons = {
            meeting: 'users',
            deadline: 'clock',
            training: 'graduation-cap'
        };
        return icons[type] || 'calendar';
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});

// Render holiday table
function renderHolidayTable() {
    const holidayTableBody = document.getElementById("holidayTableBody")
    holidayTableBody.innerHTML = ""
  
    const year = document.getElementById("holidayYear").value
    const month = document.getElementById("holidayMonth").value - 1 // JavaScript months are 0-indexed
  
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
      dayElement.classList.add("holiday-date", "other-month")
      dayElement.textContent = prevLastDay - i + 1
      holidayTableBody.appendChild(dayElement)
    }
  
    // Add days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("holiday-date")
      dayElement.textContent = i
      holidayTableBody.appendChild(dayElement)
    }
  
    // Add days from the next month
    const totalDaysDisplayed = holidayTableBody.children.length
    const daysToAdd = 42 - totalDaysDisplayed // 6 rows of 7 days
  
    for (let i = 1; i <= daysToAdd; i++) {
      const dayElement = document.createElement("div")
      dayElement.classList.add("holiday-date", "other-month")
      dayElement.textContent = i
      holidayTableBody.appendChild(dayElement)
    }
  }
  
  
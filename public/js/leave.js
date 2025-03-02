// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '../../index.html';
}

// Get employee ID and profile data
const employeeId = localStorage.getItem('employeeId');
const userProfile = JSON.parse(localStorage.getItem('userProfile'));

// Display user email in header
document.getElementById('userEmail').textContent = userProfile.email;

// Get employee data
const employeeData = JSON.parse(localStorage.getItem(`employee_${employeeId}`));

// Update leave balance display
function updateLeaveBalance() {
    document.getElementById('casualLeaveBalance').textContent = employeeData.leaveBalance.casual;
    document.getElementById('earnedLeaveBalance').textContent = employeeData.leaveBalance.earned;
    document.getElementById('sickLeaveBalance').textContent = employeeData.leaveBalance.sick;
    document.getElementById('compensatoryLeaveBalance').textContent = employeeData.leaveBalance.compensatory;
}

// Initialize leave history
function initializeLeaveHistory() {
    if (!employeeData.leaveHistory) {
        employeeData.leaveHistory = [];
        localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
    }
}

// Display leave history
function displayLeaveHistory() {
    const historyTableBody = document.getElementById('leaveHistory');
    historyTableBody.innerHTML = '';

    if (employeeData.leaveHistory && employeeData.leaveHistory.length > 0) {
        employeeData.leaveHistory.forEach(leave => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave</td>
                <td>${leave.duration} days</td>
                <td>${new Date(leave.startDate).toLocaleDateString()}</td>
                <td>${new Date(leave.endDate).toLocaleDateString()}</td>
                <td class="status-${leave.status.toLowerCase()}">${leave.status}</td>
            `;
            historyTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">No leave history available</td>';
        historyTableBody.appendChild(row);
    }
}

// Calculate date difference in days
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Validate leave application
function validateLeaveApplication(leaveType, duration, balance) {
    if (duration > balance) {
        throw new Error(`Insufficient ${leaveType} leave balance`);
    }
}

// Handle form submission
document.getElementById('leaveForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        const leaveType = document.getElementById('leaveType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('reason').value;
        
        // Calculate duration
        const duration = calculateDays(startDate, endDate);
        
        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            throw new Error('End date cannot be before start date');
        }

        if (new Date(startDate) < new Date()) {
            throw new Error('Cannot apply leave for past dates');
        }
        
        // Validate leave balance
        validateLeaveApplication(leaveType, duration, employeeData.leaveBalance[leaveType]);
        
        // Create leave application
        const leaveApplication = {
            type: leaveType,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            reason: reason,
            status: 'Pending',
            appliedDate: new Date().toISOString()
        };
        
        // Initialize leave history if not exists
        initializeLeaveHistory();
        
        // Add to leave history
        employeeData.leaveHistory.unshift(leaveApplication);
        
        // Update leave balance (temporary deduction, will be restored if rejected)
        employeeData.leaveBalance[leaveType] -= duration;
        
        // Save updated employee data
        localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
        
        // Update UI
        updateLeaveBalance();
        displayLeaveHistory();
        
        // Show success message
        successMessage.textContent = 'Leave application submitted successfully';
        successMessage.style.display = 'block';
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});

// Handle date changes
document.getElementById('startDate').addEventListener('change', function() {
    document.getElementById('endDate').min = this.value;
});

document.getElementById('endDate').addEventListener('change', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = this.value;
    if (startDate) {
        const duration = calculateDays(startDate, endDate);
        document.getElementById('duration').value = duration;
    }
});

// Initialize page
updateLeaveBalance();
initializeLeaveHistory();
displayLeaveHistory(); 
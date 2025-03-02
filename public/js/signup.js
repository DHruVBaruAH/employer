// Handle avatar preview and compression
import {API_BASE_URL} from '../constant/constant.js'
function compressImage(base64String, maxWidth = 200) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64String;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (maxWidth * height) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
    });
}

document.getElementById('avatarInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const compressedImage = await compressImage(e.target.result);
            document.getElementById('avatarPreview').src = compressedImage;
        };
        reader.readAsDataURL(file);
    }
});

// Generate Employee ID
function generateEmployeeId(department) {
    const timestamp = Date.now().toString().slice(-4);
    const deptCode = department.substring(0, 2).toUpperCase();
    return `${deptCode}${timestamp}`;
}

// Show employee ID popup
function showEmployeeIdPopup(employeeId) {
    return new Promise((resolve) => {
        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        modalContent.style.textAlign = 'center';
        modalContent.style.maxWidth = '400px';
        modalContent.style.width = '90%';

        const modalHeader = document.createElement('h2');
        modalHeader.textContent = 'Your Employee ID';
        modalHeader.style.color = '#2c3e50';
        modalHeader.style.marginBottom = '1rem';

        const modalMessage = document.createElement('p');
        modalMessage.textContent = 'Please save your employee ID for future logins:';
        modalMessage.style.marginBottom = '1rem';

        const idDisplay = document.createElement('div');
        idDisplay.textContent = employeeId;
        idDisplay.style.fontSize = '1.5rem';
        idDisplay.style.fontWeight = 'bold';
        idDisplay.style.padding = '0.75rem';
        idDisplay.style.backgroundColor = '#f8f9fa';
        idDisplay.style.borderRadius = '4px';
        idDisplay.style.marginBottom = '1.5rem';
        idDisplay.style.color = '#3498db';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Continue';
        closeButton.style.padding = '0.75rem 1.5rem';
        closeButton.style.backgroundColor = '#3498db';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '1rem';
        closeButton.style.fontWeight = '500';

        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(idDisplay);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);

        // Add to document
        document.body.appendChild(modalOverlay);

        // Close modal and continue with form submission
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
            resolve(true);
        });
    });
}

// Validate password strength
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
           hasUpperCase &&
           hasLowerCase &&
           hasNumbers &&
           hasSpecialChar;
}

// API Configuration
const API_CONFIG = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    
    // Hide error message and show loading
    errorMessage.style.display = 'none';
    loading.style.display = 'block';
    
    try {
        // Check if server is running first
        try {
            const serverCheckResponse = await fetch(`${API_BASE_URL}/`, {
                ...API_CONFIG,
                method: 'GET'
            });
            
            if (!serverCheckResponse.ok) {
                throw new Error('Server connection failed');
            }
        } catch (serverError) {
            console.error('Server check failed:', serverError);
            throw new Error('Unable to connect to server. Please ensure the server is running on port 8086.');
        }

        // Get form data safely
        const formData = {};
        
        // Helper function to safely get value
        const safeGetValue = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`Element with ID '${id}' not found in the DOM`);
                return '';
            }
            return element.value;
        };
        
        // Get values using the exact IDs from the HTML
        const fullName = safeGetValue('fullName');
        formData.name = fullName; // For API
        formData.fullName = fullName; // For local storage
        formData.email = safeGetValue('email');
        formData.phone = safeGetValue('phone');
        formData.gender = safeGetValue('gender');
        formData.department = safeGetValue('department');
        formData.designation = safeGetValue('designation');
        formData.employmentType = safeGetValue('employeeType');
        formData.joiningDate = safeGetValue('joiningDate');
        formData.birthDate = safeGetValue('birthDate');
        formData.degree = safeGetValue('degree');
        formData.address = safeGetValue('address');
        formData.institution = safeGetValue('institution');
        formData.password = safeGetValue('password');
        
        // Generate employee ID based on department
        const employeeId = generateEmployeeId(formData.department || 'DEF');
        formData.employeeId = employeeId;

        // Validate password
        const confirmPassword = safeGetValue('confirmPassword');
        if (formData.password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (!validatePassword(formData.password)) {
            throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
        }

        // Hide loading while popup is shown
        loading.style.display = 'none';
        
        // Show employee ID popup and wait for user acknowledgment
        await showEmployeeIdPopup(employeeId);
        
        // Show loading again after popup is closed
        loading.style.display = 'block';
        
        try {
            console.log("Submitting form data:", formData);

            // Call the backend API
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                ...API_CONFIG,
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            
            if (data.success) {
                // Store authentication state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('employeeId', employeeId);
                
                // Store profile data
                const profileData = {
                    name: formData.fullName,
                    id: employeeId,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender,
                    department: formData.department,
                    designation: formData.designation,
                    employmentType: formData.employmentType,
                    joiningDate: formData.joiningDate,
                    birthDate: formData.birthDate,
                    degree: formData.degree,
                    avatar: '../img/avatar.png'
                };
                
                localStorage.setItem('userProfile', JSON.stringify(profileData));
                
                // Redirect to login page
                window.location.href = '../../index.html';
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (submitError) {
            console.error('Registration error:', submitError);
            errorMessage.textContent = submitError.message || 'An error occurred during registration';
            errorMessage.style.display = 'block';
            loading.style.display = 'none';
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = error.message || 'An error occurred during registration';
        errorMessage.style.display = 'block';
        loading.style.display = 'none';
    }
}); 
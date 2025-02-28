// Handle avatar preview and compression
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
const API_BASE_URL = 'http://localhost:8086/api';
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
        // Get form data
        const formData = {
            employeeId: document.getElementById('employeeId').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
            department: document.getElementById('department').value,
            designation: document.getElementById('designation').value,
            employmentType: document.getElementById('employmentType').value,
            joiningDate: document.getElementById('joiningDate').value,
            birthDate: document.getElementById('birthDate').value,
            degree: document.getElementById('degree').value
        };

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
            localStorage.setItem('employeeId', formData.employeeId);
            
            // Store profile data
            const profileData = {
                name: formData.name,
                id: formData.employeeId,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                department: formData.department,
                designation: formData.designation,
                employmentType: formData.employmentType,
                joiningDate: formData.joiningDate,
                birthDate: formData.birthDate,
                degree: formData.degree,
                avatar: 'img/avatar.png'
            };
            
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = error.message || 'An error occurred during registration';
        errorMessage.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}); 
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

// Handle form submission
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    
    // Hide error message and show loading
    errorMessage.style.display = 'none';
    loading.style.display = 'block';
    
    try {
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const gender = document.getElementById('gender').value;
        const birthDate = document.getElementById('birthDate').value;
        const address = document.getElementById('address').value;
        const department = document.getElementById('department').value;
        const designation = document.getElementById('designation').value;
        const joiningDate = document.getElementById('joiningDate').value;
        const employeeType = document.getElementById('employeeType').value;
        const degree = document.getElementById('degree').value;
        const institution = document.getElementById('institution').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let avatar = document.getElementById('avatarPreview').src;

        // Validate passwords
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (!validatePassword(password)) {
            throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
        }

        // Generate employee ID
        const employeeId = generateEmployeeId(department);

        // Compress avatar if it's not the default
        if (!avatar.includes('img/avatar.png')) {
            avatar = await compressImage(avatar, 150);
        }

        // Create employee data object
        const employeeData = {
            id: employeeId,
            password: password,
            name: fullName,
            email: email,
            phone: phone,
            gender: gender,
            birthDate: birthDate,
            address: address,
            department: department,
            designation: designation,
            joiningDate: joiningDate,
            employeeType: employeeType,
            degree: degree,
            institution: institution,
            avatar: avatar,
            leaveBalance: {
                casual: 12,
                earned: 15,
                sick: 7,
                compensatory: 3
            },
            recentActivity: [],
            attendance: {
                percentage: 100,
                status: 'Not Checked In'
            }
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Try to store the data
            localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
        } catch (storageError) {
            // If storage fails, try with default avatar
            console.warn('Storage quota exceeded, falling back to default avatar');
            employeeData.avatar = 'img/avatar.png';
            localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
        }

        // Create a custom success message dialog
        const successDialog = document.createElement('div');
        successDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            z-index: 1000;
        `;
        
        successDialog.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 1rem;">Account Created Successfully!</h2>
            <p style="color: #666; margin-bottom: 1.5rem;">Your Employee ID is: <strong style="color: #3498db; font-size: 1.2em;">${employeeId}</strong></p>
            <p style="color: #666; margin-bottom: 1.5rem;">Please save this ID for login.</p>
            <button id="continueBtn" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
            ">Continue to Login</button>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;

        // Add to document
        document.body.appendChild(overlay);
        document.body.appendChild(successDialog);

        // Handle continue button click
        document.getElementById('continueBtn').addEventListener('click', function() {
            window.location.href = '/employer/';
        });

    } catch (error) {
        errorMessage.textContent = error.message || 'An error occurred during signup. Please try again.';
        errorMessage.style.display = 'block';
        loading.style.display = 'none';
    }
}); 

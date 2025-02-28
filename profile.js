document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }
  
    // Get user profile data
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const employeeId = localStorage.getItem('employeeId');
  
    // Display user email in header
    document.getElementById('userEmail').textContent = userProfile.email;
  
    // Update profile information
    function updateProfileDisplay() {
        // Update profile image
        document.getElementById('profileImage').src = userProfile.avatar || 'img/avatar.png';
        
        // Update profile details
        document.getElementById('profileName').textContent = userProfile.name;
        document.getElementById('profileId').textContent = userProfile.id;
        document.getElementById('profileEmail').textContent = userProfile.email;
        document.getElementById('profilePhone').textContent = userProfile.phone;
        document.getElementById('profileGender').textContent = userProfile.gender;
        document.getElementById('profileBirthDate').textContent = new Date(userProfile.birthDate).toLocaleDateString();
        document.getElementById('profileJoiningDate').textContent = new Date(userProfile.joiningDate).toLocaleDateString();
        document.getElementById('profileDepartment').textContent = userProfile.department;
        document.getElementById('profileDesignation').textContent = userProfile.designation;
        document.getElementById('profileEmployeeType').textContent = userProfile.employeeType;
        document.getElementById('profileDegree').textContent = userProfile.degree;
        document.getElementById('profileInstitution').textContent = userProfile.institution;
        document.getElementById('profileAddress').textContent = userProfile.address;
    }
  
    // Handle profile edit
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        const modal = document.getElementById('editProfileModal');
        
        // Populate form with current values
        document.getElementById('editName').value = userProfile.name;
        document.getElementById('editEmail').value = userProfile.email;
        document.getElementById('editPhone').value = userProfile.phone;
        document.getElementById('editGender').value = userProfile.gender;
        document.getElementById('editBirthDate').value = userProfile.birthDate;
        document.getElementById('editDegree').value = userProfile.degree;
        document.getElementById('editInstitution').value = userProfile.institution;
        document.getElementById('editDepartment').value = userProfile.department;
        document.getElementById('editDesignation').value = userProfile.designation;
        document.getElementById('editEmployeeType').value = userProfile.employeeType;
        document.getElementById('editAddress').value = userProfile.address;
        
        modal.style.display = 'block';
    });
  
    // Handle modal close
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('editProfileModal').style.display = 'none';
    });
  
    // Handle profile update form submission
    document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        try {
            // Get updated values
            const updatedProfile = {
                ...userProfile,
                name: document.getElementById('editName').value,
                email: document.getElementById('editEmail').value,
                phone: document.getElementById('editPhone').value,
                gender: document.getElementById('editGender').value,
                birthDate: document.getElementById('editBirthDate').value,
                degree: document.getElementById('editDegree').value,
                institution: document.getElementById('editInstitution').value,
                department: document.getElementById('editDepartment').value,
                designation: document.getElementById('editDesignation').value,
                employeeType: document.getElementById('editEmployeeType').value,
                address: document.getElementById('editAddress').value
            };
  
            // Get employee data
            const employeeData = JSON.parse(localStorage.getItem(`employee_${employeeId}`));
            
            // Update employee data
            employeeData.name = updatedProfile.name;
            employeeData.email = updatedProfile.email;
            employeeData.phone = updatedProfile.phone;
            employeeData.gender = updatedProfile.gender;
            employeeData.birthDate = updatedProfile.birthDate;
            employeeData.degree = updatedProfile.degree;
            employeeData.institution = updatedProfile.institution;
            employeeData.department = updatedProfile.department;
            employeeData.designation = updatedProfile.designation;
            employeeData.employeeType = updatedProfile.employeeType;
            employeeData.address = updatedProfile.address;
  
            // Save updated data
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
  
            // Update display
            updateProfileDisplay();
  
            // Show success message
            successMessage.textContent = 'Profile updated successfully';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
  
            // Close modal after delay
            setTimeout(() => {
                document.getElementById('editProfileModal').style.display = 'none';
                successMessage.style.display = 'none';
            }, 2000);
  
        } catch (error) {
            errorMessage.textContent = error.message || 'Failed to update profile';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });
  
    // Handle profile image change
    document.getElementById('profileImageInput').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const image = e.target.result;
                
                // Update profile image
                document.getElementById('profileImage').src = image;
                
                // Update stored data
                userProfile.avatar = image;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                
                // Update employee data
                const employeeData = JSON.parse(localStorage.getItem(`employee_${employeeId}`));
                employeeData.avatar = image;
                localStorage.setItem(`employee_${employeeId}`, JSON.stringify(employeeData));
            };
            reader.readAsDataURL(file);
        }
    });
  
    // Initialize profile display
    updateProfileDisplay();
  })
  
  // Sample employee data
  const employeeData = {
    id: "CPCG020",
    name: "Binod Baruah",
    email: "bbaruah985@gmail.com",
    phone: "8800332429",
    gender: "MALE",
    joiningDate: "01-06-1997",
    birthDate: "01-10-1971",
    highestDegree: "Class 10 Pass",
  }
  
  // Load employee data
  function loadEmployeeData() {
    // In a real application, you would fetch this data from a server
    // For this demo, we'll use the sample data
  
    document.getElementById("profileName").textContent = employeeData.name
    document.getElementById("profileId").textContent = employeeData.id
    document.getElementById("fullName").textContent = employeeData.name
    document.getElementById("email").textContent = employeeData.email
    document.getElementById("phone").textContent = employeeData.phone
    document.getElementById("gender").textContent = employeeData.gender
    document.getElementById("birthDate").textContent = employeeData.birthDate
    document.getElementById("employeeId").textContent = employeeData.id
    document.getElementById("joiningDate").textContent = employeeData.joiningDate
    document.getElementById("degree").textContent = employeeData.highestDegree
  }
  
  // Update employee data
  function updateEmployeeData() {
    const name = document.getElementById("editName").value
    const email = document.getElementById("editEmail").value
    const phone = document.getElementById("editPhone").value
    const gender = document.getElementById("editGender").value
    const joiningDate = document.getElementById("editJoiningDate").value
    const birthDate = document.getElementById("editBirthDate").value
    const degree = document.getElementById("editDegree").value
  
    // Update the employee data object
    employeeData.name = name
    employeeData.email = email
    employeeData.phone = phone
    employeeData.gender = gender
    employeeData.joiningDate = joiningDate
    employeeData.birthDate = birthDate
    employeeData.highestDegree = degree
  
    // Update the UI
    loadEmployeeData()
  
    // Close the modal
    document.getElementById("editProfileModal").classList.remove("active")
  
    // In a real application, you would send this data to a server
    // For this demo, we'll just update the UI
  }
  
  // Open edit profile modal
  function openEditProfileModal() {
    // Populate the form with current data
    document.getElementById("editName").value = employeeData.name
    document.getElementById("editEmail").value = employeeData.email
    document.getElementById("editPhone").value = employeeData.phone
    document.getElementById("editGender").value = employeeData.gender
    document.getElementById("editJoiningDate").value = employeeData.joiningDate
    document.getElementById("editBirthDate").value = employeeData.birthDate
    document.getElementById("editDegree").value = employeeData.highestDegree
  
    // Show the modal
    document.getElementById("editProfileModal").classList.add("active")
  }
  
  
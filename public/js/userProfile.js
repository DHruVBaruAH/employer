// User Profile Management
const UserProfile = {
    // Default profile data
    defaultProfile: {
        name: 'Dhruv Baruah',
        id: 'CPCG020',
        email: 'dbaruah985@gmail.com',
        phone: '880XXXXXX',
        gender: 'MALE',
        joiningDate: '01-06-1997',
        birthDate: '01-10-1971',
        degree: 'Class 10 Pass',
        avatar: 'img/avatar.png'
    },

    // Get profile data
    getProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            return JSON.parse(savedProfile);
        }
        // If no profile exists, save and return default
        this.updateProfile(this.defaultProfile);
        return this.defaultProfile;
    },

    // Update profile data
    updateProfile(profileData) {
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        // Dispatch event to notify all pages
        window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: profileData
        }));
    },

    // Initialize profile listeners
    initializeProfileListeners() {
        // Listen for profile updates
        window.addEventListener('profileUpdated', (event) => {
            this.updateUIElements(event.detail);
        });

        // Initial UI update
        this.updateUIElements(this.getProfile());
    },

    // Update UI elements with profile data
    updateUIElements(profileData) {
        // Update common elements
        const elements = {
            userEmail: profileData.email,
            employeeName: profileData.name,
            employeeId: profileData.id,
            employeePhone: profileData.phone,
            employeeEmail: profileData.email,
            employeeGender: profileData.gender,
            employeeJoiningDate: profileData.joiningDate,
            employeeBirthDate: profileData.birthDate,
            employeeDegree: profileData.degree,
            profileName: profileData.name,
            profileId: profileData.id,
            fullName: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            gender: profileData.gender,
            birthDate: profileData.birthDate,
            joiningDate: profileData.joiningDate,
            degree: profileData.degree
        };

        // Update all elements if they exist
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Update avatar images if they exist
        const avatarImages = ['userAvatar', 'profileAvatar', 'profileViewAvatar'];
        avatarImages.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.src = profileData.avatar;
            }
        });
    }
};

// Initialize profile system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UserProfile.initializeProfileListeners();
}); 
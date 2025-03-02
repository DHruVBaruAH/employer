document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const remember = document.getElementById("remember").checked

    // In a real application, you would send this data to a server for authentication
    // For this demo, we'll just redirect to the dashboard

    // Save user info to localStorage for demo purposes
    localStorage.setItem("userEmail", email)
    localStorage.setItem("isLoggedIn", "true")

    // Redirect to dashboard
    window.location.href = "./pages/dashboard.html"
  })
})


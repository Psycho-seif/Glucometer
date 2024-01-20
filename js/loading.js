// Add this script in your HTML file or in a separate script file

// Function to redirect to home.html after 10 seconds
function redirectToHome() {
  setTimeout(function () {
    window.location.href = "login.html";
  }, 10000); // 10000 milliseconds = 10 seconds
}

// Call the function when the page loads
window.onload = redirectToHome;

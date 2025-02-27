document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form refresh

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObject),
            credentials: "include"  // ✅ Ensures cookies (token) are sent with requests
        });

        const result = await response.json();
        
        if (result.redirect) {
            window.location.href = result.redirect; // Redirect user
        } else if (result.error) {
            alert(result.error); // Show error message
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred while logging in.");
    }
});

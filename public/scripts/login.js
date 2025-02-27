document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form refresh

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!role) {
        alert("Please select a role.");
        return;
    }

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
            credentials: "include" // ✅ Ensures cookies are sent with requests
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

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok && result.redirect) {
            window.location.href = result.redirect; // Redirect user based on server response
        } else {
            alert(result.error || "Login failed. Please try again.");
        }
    } catch (error) {
        alert("Something went wrong. Please check your internet connection.");
    }
});

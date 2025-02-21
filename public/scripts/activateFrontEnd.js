document.addEventListener("DOMContentLoaded", function () {
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const userIDLabel = document.getElementById("userIDLabel");
    const userIDInput = document.getElementById("userID");

    function updateIDLabel(role) {
        switch (role) {
            case "Student":
                userIDLabel.textContent = "Enter Student ID";   
                break;
            case "Instructor":
                userIDLabel.textContent = "Enter Instructor ID";
                break;
            case "Admin":
                userIDLabel.textContent = "Enter Admin ID";
                break;
            default:
                userIDLabel.textContent = "Enter xID";
        }
    }

    // Attach event listener to all role radio buttons
    roleRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            updateIDLabel(this.value);
        });
    });
});

document.getElementById("activationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    // Disable form and show loading state
    const submitButton = this.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;

    try {
        const response = await fetch("/auth/activate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message with fade-in effect
            document.body.innerHTML = `<div class="container mt-5">
                <h2 class="text-center text-success">Success!</h2>
                <p class="text-center">${result.message}</p>
                <p class="text-center">Check your inbox for the activation link.</p>
                <a href="/" class="btn btn-primary d-block mx-auto" style="width:200px;">Return to Home</a>
            </div>`;
        } else {
            alert(result.message || "The form did not match our database. Please try again");
        }
    } catch (error) {
        alert("Something went wrong. Please check your internet connection.");
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.innerHTML = "Activate Account";
    }
});


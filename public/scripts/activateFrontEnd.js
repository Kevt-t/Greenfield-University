document.addEventListener("DOMContentLoaded", function () {
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const userIDLabel = document.getElementById("userIDLabel");

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

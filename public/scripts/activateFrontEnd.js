      // Update ID Label Based on Role Selection
      document.getElementById("role").addEventListener("change", function() {
        let role = this.value;
        let idLabel = document.getElementById("userIDLabel");
        idLabel.textContent = "Enter " + role + " ID";
    });
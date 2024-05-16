function togglePopup() {
    var popup = document.getElementById("popup");;
    popup.style.display = "block"; 
}

document.querySelectorAll('.name, .email, .number').forEach(function(input) {
    input.addEventListener('blur', function() {
        validateField(input);
      
    });
});

function validateField(input) {
    console.log("Validating field: ", input.id);
    var errorElement = document.getElementById(input.id + 'Error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = input.id + 'Error';
        errorElement.className = 'error';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    if (input.value.trim() === "") {
        console.log(input.name + " is required");
        errorElement.textContent = input.name + " is required";
    } else {
        if (input.type === 'email') { 
            if (!isValidEmail(input.value.trim())) {
                console.log("Invalid email format");
                errorElement.textContent = "Invalid (@gmail.com)email format";
            } else {
                errorElement.textContent = "";
            }
        } else if (input.type === 'tel') {
            if (!isValidMobile(input.value.trim())) {
                console.log("Invalid mobile number");
                errorElement.textContent = "Mobile number must be 10 digits";
            } else {
                errorElement.textContent = "";
            }
        } else {
            errorElement.textContent = "";
        }
    }
}

/*function validateForm() {
    var isValid = true;
    document.querySelectorAll('.name, .email, .number').forEach(function(input) {
        if (input.value.trim() === "") {
            validateField(input);
            isValid = false;
        }
    });
    return isValid;
}*/

function validateForm() {
    var isValid = true;
    document.querySelectorAll('.name, .email, .number').forEach(function(input) {
        validateField(input); // Validate each field
        
        // Check if the field is empty or if there is any error message
        if (input.value.trim() === "" || document.getElementById(input.id + 'Error').textContent.trim() !== "") {
            isValid = false;
        }
    });

    // Prevent form submission if any field is invalid
    if (!isValid) {
        return false;
    }
}


function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(number) {
    var mobileRegex = /^\d{10}$/;
    return mobileRegex.test(number);
}

function closePopup() {
    var popup = document.getElementById("popup");
    var form = document.getElementById("form");
    form.reset(); 
    popup.style.display = "none";
    document.querySelectorAll('.error').forEach(function(error) {
        error.textContent = "";
    });
}

document.querySelectorAll('.name, .email, .number').forEach(function(input) {
    input.addEventListener('focus', function() {
        var errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = "";
        }
    });
});





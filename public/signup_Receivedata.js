function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Retrieve query parameters
const userName = getQueryParam("name");
const userEmail = getQueryParam("email");
const userNumber = getQueryParam("Number");


// Display values in console
console.log("Name:", userName);
console.log("Email:", userEmail);
console.log("Number:", userNumber);

// Set retrieved values to HTML elements
document.getElementById("userName").textContent = userName;
document.getElementById("userEmail").textContent = userEmail;
document.getElementById("userNumber").textContent = userNumber;
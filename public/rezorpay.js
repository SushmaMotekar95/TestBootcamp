var options = {
    "key": "rzp_test_PkAroegJjfGLPj", // Enter the Key ID generated from the Dashboard
    "amount": "9900",
    "currency": "INR",
    "description": "Acme Corp",
    "image": "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg",
    "prefill":
    {
        "name": userName,
        "email": userEmail,
        "contact": userNumber,
    },
    config: {
      display: {
        blocks: {
          utib: { //name for Axis block
            name: "Pay using Axis Bank",
            instruments: [
              {
                method: "card",
                issuers: ["UTIB"]
              },
              {
                method: "netbanking",
                banks: ["UTIB"]
              },
            ]
          },
          other: { //  name for other block
            name: "Other Payment modes",
            instruments: [
              {
                method: "card",
                issuers: ["ICIC"]
              },
              {
                method: 'netbanking',
              }
            ]
          }
        },
        hide: [
          {
          method: "upi"
          }
        ],
        sequence: ["block.utib", "block.other"],
        preferences: {
          show_default_blocks: false // Should Checkout show its default blocks?
        }
      }
    },
   /* "handler": function (response) {
      alert(response.razorpay_payment_id);
    },*/
    "handler": function (response) {
    
    // Extract user data
    var name = getQueryParam("name");
    var email = getQueryParam("email");
    var Number = getQueryParam("Number");
    var payment_Id = getQueryParam("payment_Id");
   
    // Make AJAX POST request to server to save data
    $.ajax({
        type: "POST",
        url: "/payment_success",
        data: {
            name: name,
            email: email,
            Number: Number,
            paymentId: response.razorpay_payment_id
        },
        success: function (data) {
            console.log("Data saved successfully:", data);
        },
        error: function (error) {
            console.error("Error saving data:", error);
        }
    });
    alert("Payment successful!");
    // Redirect user to signup_successful.html
    window.location.href = "showdata.html";
},
    "modal": {
      "ondismiss": function () {
        if (confirm("Are you sure, you want to close the form?")) {
          txt = "You pressed OK!";
          console.log("Checkout form closed by the user");
        } else {
          txt = "You pressed Cancel!";
          console.log("Complete the Payment")
        }
      }
    }
  };
  var rzp1 = new Razorpay(options);
  document.getElementById('rzp-button1').onclick = function (e) {
    rzp1.open();
    e.preventDefault();
  }
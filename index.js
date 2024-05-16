var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Database')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sushamajun95@gmail.com',
        pass: 'zosm esxn nqcd djrk'
    }
});

app.post("/sign_up",(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var Number=req.body.Number
    var data={
        "name":name,
        "email":email,
        "Number":Number,
        "paymentId": "", 
        "paymentStatus": "fail" 
      
    }
    db.collection('users_register').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Register Record Inserted Succesfully")
    })
    return res.redirect(`/signup_successful.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&Number=${encodeURIComponent(Number)}`);
})

app.post("/payment_success",(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var Number=req.body.Number
    var paymentId = req.body.paymentId;
    var amountPaid = "99/- "; 
    var transactionDate = new Date().toLocaleString(); 

    // Fetch event details from your database or hardcoded values
    var eventName = "3-day CSS Session";
    var eventDate = "1/6/2024 TO 3/6/2024"; 
    var eventLocation = "Online"; 
    var zoomLink = "https://example.com/zoom"; 


    db.collection('users_register').findOneAndUpdate({ 
            name: name, email: email, Number: Number 
        },
        { 
            $set: { 
                paymentId: paymentId, paymentStatus: 'success'
            } 
        },
        { 
            returnOriginal: false 
        },
        (err, result) => {
            if (err) {
                console.error("Error updating payment status:", err); 
                return res.status(500).send("Error updating payment status"); 
            }
            console.log("Payment Record Updated Successfully");
        
         // Create a new PDF document
        const doc = new PDFDocument();

         // Pipe the PDF document to a buffer
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);

        // Send email
        const mailOptions = {
            from: 'sushamajun95@gmail.com',  
            to: email,
            subject: 'Payment Successful',
            text: `Dear ${name},
               \nWe are happy to confirm that your payment for our 3-day CSS session has been successfully processed.
               \nHere are the details of your enrollment:
               \nFull Name: ${name}
               \nEmail: ${email}
               \nMobile Number: ${Number}
               \nPayment ID: ${paymentId} 
               \nAs promised, here is the Zoom link for the 3-day CSS session: 
               \nZoom Link: https://meet.google.com/fwj-zwwx-hpk
               \nAdditionally, we had like to inform you about our other exciting courses. Please visit our website https://www.codemindtechnology.com/ for more details.
               \nThank you for choosing to enhance your skills with us. Should you have any questions or require further assistance, feel free to reach out to our team.
               \nBest regards,
               \nCodemind Technology, Pune.
               \nContact Us: 9665044698 `,
            attachments: [{
            filename: 'payment_receipt.pdf',
            content: pdfData
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    });

    // Add content to the PDF document
    doc.image('codemind-img/codemind-img.jpeg', 25, 10, { width: 100, height: 100 });
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(15).text('Payment Receipt', {align: 'center'});
    
   // Calculate the position for each row
    const row1Y = 130; 
    const row2Y = row1Y + 20; 
    const row3Y = row2Y + 20; 
    const row4Y = row3Y + 20; 
    const row5Y = row4Y + 20; 
    const row6Y = row5Y + 20; 
    const row7Y = row6Y + 20; 
    const row8Y = row7Y + 20; 
    const row9Y = row8Y + 20; 
    const row10Y = row9Y + 20;

    // Define the column positions
    const col1X = 50; 
    const col2X = 200; 
 
    doc.font('Helvetica').fontSize(12);
    doc.text(' Full Name : ', col1X, row1Y);
    doc.text(name, col2X, row1Y);

    doc.text(' Email : ', col1X, row2Y);
    doc.text(email, col2X, row2Y);

    doc.text(' Mobile No : ', col1X, row3Y);
    doc.text(Number, col2X, row3Y);

    doc.text(' Payment ID : ', col1X, row4Y);
    doc.text(paymentId, col2X, row4Y);

    doc.text(' Amount Paid : ', col1X, row5Y);
    doc.text(amountPaid, col2X, row5Y);

    doc.text(' Transaction Date : ', col1X, row6Y);
    doc.text(transactionDate, col2X, row6Y);   

    doc.text(' Event Name  : ', col1X, row7Y);
    doc.text(eventName, col2X, row7Y);

    doc.text(' Date : ', col1X, row8Y);
    doc.text(eventDate, col2X, row8Y);

    doc.text(' Location : ', col1X, row9Y);
    doc.text(eventLocation, col2X, row9Y);   

    doc.text(' Zoom Link : ', col1X, row10Y);
    doc.text(zoomLink, col2X, row10Y); 
     
    doc.font('Helvetica-Bold').fontSize(15);
    doc.text('Terms and Conditions:',50,row10Y+30);
    doc.font('Helvetica').fontSize(12);
    doc.text('1. No refund policy: We do not offer refunds for this course.');
    doc.text('2. Recording allowed for one month only: Recording of the sessions is permitted for a period of one month from the date of enrollment.');
    doc.text('3. Doubts cleared in live sessions only.');

    doc.moveDown();
    doc.text('Thank you for your payment. If you have any questions or concerns, feel free to contact us.');
    doc.moveDown();
    doc.moveDown();
    doc.text('Best regards,',{align: 'right'});
    doc.text('Codemind Technology, Pune',{align: 'right'});
    doc.end();

            return res.redirect('/showdata.html');
        }
    );
})


app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(3000);

console.log("Listening on port 3000") 

/*var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/Database');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sushamajun95@gmail.com',
        pass: 'zosm esxn nqcd djrk'
    }
});

// Generate a secret key (replace 'YOUR_SECRET_KEY' with your actual secret key)
const SECRET_KEY = 'nvnfggknkgjkngj888nnjknjrrgbrj90';

// Middleware function to authenticate the request
const authenticate = (req, res, next) => {
    const key = req.query.key; // Assuming the key is passed as a query parameter
    
    // Check if the key matches the expected secret key
    if (key === SECRET_KEY) {
        // If the key is valid, proceed to the next middleware or route handler
        next();
    } else {
        // If the key is invalid, send a 403 Forbidden response
        res.status(403).send('Access Forbidden');
    }
};

// Protected route
app.get('/showdata.html', authenticate, (req, res) => {
    // Serve the protected page
    res.sendFile(__dirname + '/public/showdata.html');
});

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;  
    var Number = req.body.Number;
    var data = {
        "name": name,
        "email": email,
        "Number": Number,
        "paymentId": "",
        "paymentStatus": "fail"
    };
    db.collection('users_register').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Register Record Inserted Successfully");
    });
    return res.redirect(`/signup_successful.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&Number=${encodeURIComponent(Number)}`);
});

app.post("/payment_success", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var Number = req.body.Number;
    var paymentId = req.body.paymentId;
    var amountPaid = "99/- ";
    var transactionDate = new Date().toLocaleString();

    // Fetch event details from your database or hardcoded values
    var eventName = "3-day CSS Session";
    var eventDate = "June 1-3, 2024";
    var eventLocation = "Online";
    var zoomLink = "https://example.com/zoom";

    db.collection('users_register').findOneAndUpdate({
            name: name,
            email: email,
            Number: Number
        }, {
            $set: {
                paymentId: paymentId,
                paymentStatus: 'success'
            }
        }, {
            returnOriginal: false
        },
        (err, result) => {
            if (err) {
                console.error("Error updating payment status:", err);
                return res.status(500).send("Error updating payment status");
            }
            console.log("Payment Record Updated Successfully");

            // Create a new PDF document
            const doc = new PDFDocument();

            // Pipe the PDF document to a buffer
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);

                // Send email
                const mailOptions = {
                    from: 'sushamajun95@gmail.com',
                    to: email,
                    subject: 'Payment Successful',
                    text: `Dear ${name},
               \n\nWe are happy to confirm that your payment for our 3-day CSS session has been successfully processed.
               \nHere are the details of your enrollment:
               \nFull Name: ${name}
               \nEmail: ${email}
               \nMobile Number: ${Number}
               \nPayment ID: ${paymentId}
               \nAs promised, here is the Zoom link for the 3-day CSS session: 
               \nZoom Link: https://meet.google.com/fwj-zwwx-hpk
               \nAdditionally, we had like to inform you about our other exciting courses. Please visit our website https://www.codemindtechnology.com/ for more details.
               \nThank you for choosing to enhance your skills with us. Should you have any questions or require further assistance, feel free to reach out to our team.
               \nBest regards,
               \nCodemind Technology, Pune.
               \nContact Us: 9665044698 `,
                    attachments: [{
                        filename: 'payment_receipt.pdf',
                        content: pdfData
                    }]
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            });

            // Add content to the PDF document
            doc.image('codemind-img/codemind-img.jpeg', 25, 10, { width: 100, height: 100 });
            doc.moveDown();
            doc.font('Helvetica-Bold').fontSize(15).text('Payment Receipt', { align: 'center' });

            // Calculate the position for each row
            const row1Y = 130;
            const row2Y = row1Y + 20;
            const row3Y = row2Y + 20;
            const row4Y = row3Y + 20;
            const row5Y = row4Y + 20;
            const row6Y = row5Y + 20;
            const row7Y = row6Y + 20;
            const row8Y = row7Y + 20;
            const row9Y = row8Y + 20;
            const row10Y = row9Y + 20;

            // Define the column positions
            const col1X = 50;
            const col2X = 200;

            doc.font('Helvetica').fontSize(12);
            doc.text(' Full Name : ', col1X, row1Y);
            doc.text(name, col2X, row1Y);

            doc.text(' Email : ', col1X, row2Y);
            doc.text(email, col2X, row2Y);

            doc.text(' Mobile No : ', col1X, row3Y);
            doc.text(Number, col2X, row3Y);

            doc.text(' Payment ID : ', col1X, row4Y);
            doc.text(paymentId, col2X, row4Y);

            doc.text(' Amount Paid : ', col1X, row5Y);
            doc.text(amountPaid, col2X, row5Y);

            doc.text(' Transaction Date : ', col1X, row6Y);
            doc.text(transactionDate, col2X, row6Y);

            doc.text(' Event Name  : ', col1X, row7Y);
            doc.text(eventName, col2X, row7Y);

            doc.text(' Date : ', col1X, row8Y);
            doc.text(eventDate, col2X, row8Y);

            doc.text(' Location : ', col1X, row9Y);
            doc.text(eventLocation, col2X, row9Y);

            doc.text(' Zoom Link : ', col1X, row10Y);
            doc.text(zoomLink, col2X, row10Y);

            doc.font('Helvetica-Bold').fontSize(15);
            doc.text('Terms and Conditions:', 50, row10Y + 30);
            doc.font('Helvetica').fontSize(12);
            doc.text('1. No refund policy: We do not offer refunds for this course.');
            doc.text('2. Recording allowed for one month only: Recording of the sessions is permitted for a period of one month from the date of enrollment.');
            doc.text('3. Doubts cleared in live sessions only.');

            doc.moveDown();
            doc.text('Thank you for your payment. If you have any questions or concerns, feel free to contact us.');
            doc.moveDown();
            doc.moveDown();
            doc.text('Best regards,', { align: 'right' });
            doc.text('Codemind Technology, Pune', { align: 'right' });
            doc.end();

            return res.redirect('/showdata.html');
        }
    );
});

app.get("/", (req, res) => {
    res.set({
        "Allow-acces-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});*/

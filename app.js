const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const signupMail = req.body.signupMail;

    const data = {
        members: [
            {
                email_address: signupMail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/";
    const audienceID = "aa8a0af117";
    
    const options = {
        method: "POST",
        auth: "alex1:8564ca0b790348e9c003542360fff1bb-us10"
    }

    const request = https.request(url + audienceID, options, function(response) {

        if (response.statusCode === 200) {
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        }  else {
            // res.send("There was an error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server for Newsletter Signup App running on port 3000.");
})

// Adjustments for deploying on Heroku server 
// Instead of port 3000:
// process.env.PORT || 3000
// Procfile (web: node app.js)
// Create git repository
// git init
// git add .
// git commit -m "first commit"
// heroku create
// git push heroku master

// Mailchimp API Key
// 8564ca0b790348e9c003542360fff1bb-us10

// Audience ID
// aa8a0af117
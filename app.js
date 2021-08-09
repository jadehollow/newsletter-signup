// Express
const express = require("express");
const app = express();
// Request
const request = require("request");
// Dotenv to hide API Key
require("dotenv").config();
const apiKey = process.env.API_KEY;
// Mailchimp
const client = require("@mailchimp/mailchimp_marketing");
const listId = "afd25d5d0f";
client.setConfig({
    apiKey: process.env.API_KEY,
    server: "us5",
});

// .use/.set
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.set("views", "./views");
app.set("view engine", "ejs");

// Signup page
app.get("/", (req, res) => {
    res.render("index");
});

// Success Page
app.get("/success", (req, res) => {
    res.render("success");
});

// Failure Page
app.get("/failure", (req, res) => {
    res.render("failure");
});

// After User Input
app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    async function run() {
        const response = await client.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        console.log(response.status);
        res.render("success", { iconImg: "img/success.png", head: "Successfully subscribed!", text: "Thanks for signing up! You'll get your first super cool email from me very soon!" });
      };
      
      run().catch(e => res.render("failure", { iconImg: "img/failure.png", head: "Oops!", text: "Looks like something went wrong, please try again." }));
});



//Listen on port
// app.listen(3000, () => {
//   console.log("Server is running on port 3000.");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
console.log("Server is running on port 8000.");
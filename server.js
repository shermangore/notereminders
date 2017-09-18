/* Note Taker (18.2.6)
 * backend
 * ==================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var app = express();
var schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Config = require("./config.js");

// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// Database configuration
//var databaseUrl = "week18day2";
var databaseUrl = "mongodb://heroku_1tsz6s22:f7gkrspjupiuthu6ki03dd7i6d@ds139124.mlab.com:39124/heroku_1tsz6s22";
var collections = ["notes"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

let transporter = nodemailer.createTransport({
  host: Config.host,
  port: Config.port,
  secure: false,
  auth: {
    user: Config.user,
    pass: Config.pw
  }, 
  tls: {
    rejectUnauthorized: false
  }
});

function sendEmail(subject, body) {
  let mailOptions = {
    from: '"Sherman Gore" <sherman@sherminator.com>',
    to: 'sherman@mortek.com',
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}

var j = schedule.scheduleJob('21 1 * * *', function() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = yy + '-' + mm + '-' + dd;

  console.log("Date: ", today);

  db.notes.find({reminder: today}).forEach(function(err, doc) {
    if (!doc) {
      return;
    } else {
      sendEmail(doc.title, doc.note);
    }
  });
});

// Routes
// ======
// Simple index route
app.get("/", function(req, res) {
  res.send(index.html);
});

// TODO: You will make six more routes. Each will use mongojs methods
// to interact with your mongoDB database, as instructed below.
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
// 1. Save a note to the database's collection
// ===========================================
app.post("/new", function(req, res) {
  console.log("Reminder: ", req.body.reminder);
  db.notes.insert({title: req.body.title, note: req.body.note, reminder: req.body.reminder}, function (err, data) {
    res.json(data);
  });
});

// 2. Retrieve all notes from the database's collection
// ====================================================
app.get("/all", function(req, res) {
  db.notes.find({}, function(err, data) {
    if (err) {
      console.log("Error Occurred: ", err);
    } else {
      res.json(data);
    }
  });
});

// 3. Retrieve one note in the database's collection by it's ObjectId
// TIP: when searching by an id, the id needs to be passed in
// as (mongojs.ObjectId(IDYOUWANTTOFIND))
// ==================================================================
app.get("/find/:id", function(req, res) {
  db.notes.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, data) {
    if (err) {
      console.log("Error Occurred: ", err);
    } else {
      res.json(data);
    }
  });
});

// 4. Update one note in the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ================================================================
app.post("/update/:id", function(req, res) {
  console.log("Param: ", req.params.id);
  db.notes.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {note: req.body.note, title: req.body.title, reminder: req.body.reminder}}, function(err, data) {
    if (err) {
      console.log("Error Occurred: ", err);
    } else {
      console.log("Data: ", data);
      res.json(data);
    }
  });
});

// 5. Delete one note from the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ==================================================================
app.get("/delete/:id", function(req, res) {
  console.log("Param: ", req.params.id);
  db.notes.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, data) {
    if (err) {
      console.log("Error Occurred: ", err);
    } else {
      console.log("Data: ", data);
      res.json(data);
    }
  });
});

// // 6. Clear the entire note collection
// // ===================================
// app.get("/clearall", function(req, res) {
//   db.notes.remove({}, function(err, data) {
//     if (err) {
//       console.log("Error Occurred: ", err);
//     } else {
//       console.log("Data: ", data);
//       res.json(data);
//     }
//   });
// });

// Listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port 3000!");
});

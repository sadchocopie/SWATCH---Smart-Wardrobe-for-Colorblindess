const http = require("http");
const path = require("path");
const fs = require("fs");


const express = require('express');
const app = express();
// Learn more: http://expressjs.com/en/starter/static-files.html
// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html
app.use(express.static('static_files'));


const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/tmp/"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


// simulates a database in memory, to make this example simple and
// self-contained (so that you don't need to set up a separate database).
// note that a real database will save its data to the hard drive so
// that they become persistent, but this fake database will be reset when
// this script restarts. however, as long as the script is running, this
// database can be modified at will.
const colorDatabase = {
  'black': { colors: ["#D6DFE0", "#07DAC0", "#CE2380"], pic: 'black.png' },
  'pink': { colors: ["#36EEE0", "#BCECE0", "#4C5270"], pic: 'pink.png' },
  'green': { colors: ["#005E38", "#C98D26", "#DEDCE4"], pic: 'green.png' }
};
// GET a list of all usernames
//
// To test, open this URL in your browser:
//   http://localhost:3000/users



app.get('/recommendColors', (req, res) => {
  console.log(req.query.sColors);

  let starterColors = [];
  if(typeof req.query.sColors === 'string') {
    let hex = req.query.sColors.match(/..?/g);
    console.log(hex);
    //split hex values into rgb FFFFFF => ['FF', 'FF', 'FF']
    let rgb = hex.map((val) => {return parseInt("0x"+ val)});
    console.log(rgb);
    starterColors.push(rgb);
    for (let i = 0; i < 4; i++) {
      starterColors.push("N");
    }

  } else {
    for (let i = 0; i < req.query.sColors.length; i++) {
      if (req.query.sColors[i]) { 
        let hexs = req.query.sColors[i].match(/..?/g);
        console.log(hexs);
        //split hex values into rgb FFFFFF => ['FF', 'FF', 'FF']
        let rgb = hexs.map((val) => {return parseInt("0x"+ val)});
        console.log(rgb);
        //parseInt("0xFF")
        starterColors.push(rgb);
      }
    }
    for (let i = 0; i < 5-req.query.sColors.length; i++) {
      starterColors.push("N");
    }
  }



  var url = "http://colormind.io/api/";
  var data = {
    model : "default",
    input : starterColors
  }

  console.log(data);


  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  var http = new XMLHttpRequest();

  http.open("POST", url, true);
  http.send(JSON.stringify(data));

  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      var palette = JSON.parse(http.responseText).result;
      console.log(palette);
      res.send(palette);


    }
  }
});


app.get('/nearestColor/:colorHex', (req, res) => {
  const colorToName = '#' + req.params.colorHex;
  const ntc = require("./ntc.js");
  const match = ntc.name(colorToName);
  const name = match[1];
  const hex = match[0];
  res.send(
    {
      'name': name,
      'hex': hex,
    }
  );

});


app.get('/colorCombo', (req, res) => {
  const allColorCombo = Object.keys(colorDatabase); // returns a list of object keys
  console.log('allColorCombo is:', allColorCombo);
  res.send(allColorCombo);
});


// GET profile data for a user
//
// To test, open these URLs in your browser:
//   http://localhost:3000/users/Philip
//   http://localhost:3000/users/Carol
//   http://localhost:3000/users/invalidusername
app.get('/colorCombo/:color', (req, res) => {
  const nameToLookup = req.params.color; // matches ':color' above
  const val = colorDatabase[nameToLookup];
  console.log(nameToLookup, '->', val); // for debugging
  if (val) {
    res.send(val);
  } else {
    res.send({}); // failed, so return an empty object instead of undefined
  }
});

app.post(
  "/uploadimg",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});

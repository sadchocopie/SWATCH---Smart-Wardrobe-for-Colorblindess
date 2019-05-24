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


app.get('/recommendColors', (req, res) => {
  console.log(req.query.sColors);

  let starterColors = [];
  if (typeof req.query.sColors === 'string') {
    let hex = req.query.sColors.match(/..?/g);
    console.log(hex);
    //split hex values into rgb FFFFFF => ['FF', 'FF', 'FF']
    let rgb = hex.map((val) => { return parseInt("0x" + val) });
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
        let rgb = hexs.map((val) => { return parseInt("0x" + val) });
        console.log(rgb);
        //parseInt("0xFF")
        starterColors.push(rgb);
      }
    }
    for (let i = 0; i < 5 - req.query.sColors.length; i++) {
      starterColors.push("N");
    }
  }



  var url = "http://colormind.io/api/";
  var data = {
    model: "default",
    input: starterColors
  }

  console.log(data);


  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  var http = new XMLHttpRequest();

  http.open("POST", url, true);
  http.send(JSON.stringify(data));

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
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

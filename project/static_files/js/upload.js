let selectedFile = "";
let rgbToHex = function (value) {
    let hex = Number(value).toString(16);
    if (hex.length < 2) {
        hex = '0' + hex;
    }
    return hex
}
const app = new Vue({
    el: '#app',
    data() {
        return {
            imageSrc: null,
            swatches: []
        }
    },
    methods: {
        gotPic(event) {
            this.imageSrc = URL.createObjectURL(event.target.files[0]);
            console.log("it works!");
            selectedFile = event.target.files[0];
        },
        getSwatches() {
            let count = 1;
            console.log("getPalettes")
            let colorThief = new ColorThief();
            let colorArr = colorThief.getPalette(this.$refs.theImage, 2);
            this.swatches = [];
            colorArr.forEach(c => {
                let style = {
                    backgroundColor: "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"
                }

                const requestURL = 'nearestColor/' + rgbToHex(c[0]) + rgbToHex(c[1]) + rgbToHex(c[2]);
                console.log('making ajax request to:', requestURL);
                $.ajax({
                    // all URLs are relative to http://localhost:3000/
                    url: requestURL,
                    type: 'GET',
                    dataType: 'json', // this URL returns data in JSON format
                    success: (data) => {
                        console.log('You received some data!', data);

                        if (data) {
                            if (count === 1) {
                                localStorage.setItem("mainColor", data.name);
                                localStorage.setItem("mainColorRGB", JSON.stringify(c));

                                //                                $('#status').html('Successfully fetched data at URL: ' + requestURL);
                                $('#jobDiv').html('Dominant color is ' + data.name);
                            }
                            $('#color' + count).css('background-color', data.hex);
                            $('#colorText' + count).html(data.name);
                            count = count + 1;
                        } else {
                            // clear the display
                            $('#jobDiv').html('');
                            $('#petImage').attr('src', '').attr('width', '0px');
                            $('#color' + count).html('');
                            $('#color' + count).css('background-color', '');
                        }
                    },
                });

                this.swatches.push({ style });
            });

        },
        getDominant() {
            console.log("get dominant color")
            let colorThief = new ColorThief();
            let color = colorThief.getColor(this.$refs.theImage);
            //reset
            this.swatches = [];

            let style = {
                backgroundColor: "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
            }
            this.swatches.push({ style });
            return color;
        }
    }
});

$("#readFileButton").click(function () {

    $("#uploadButton").html("Add to Wardrobe")

});
// Create a root reference
function uploadFile() {
    let storageRef = firebase.storage().ref();
    let fileName = selectedFile.name;
    console.log(fileName);

    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };
    // Upload file and metadata to the object 'images/mountains.jpg'
    let uploadTask = storageRef.child('clothes/' + fileName).put(selectedFile, metadata);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        let postKey = firebase.database().ref('/Posts/').push().key;
        let downloadURL = uploadTask.snapshot.downloadURL;
        let updates = {};
        let dominant = localStorage.getItem("mainColor");
        let dominantRGB = JSON.parse(localStorage.getItem("mainColorRGB"));
        console.log(dominant);
        console.log(dominantRGB);
        let dominantHex = "" + rgbToHex(dominantRGB[0]) + rgbToHex(dominantRGB[1]) + rgbToHex(dominantRGB[2]);
        console.log(dominantHex)
        let postData = {
            url: downloadURL,
            type: $('#userSelect').val(),
            caption: fileName,
            // user: user.uid
            color: dominant,
            colorHex: dominantHex,
            colorRGB: dominantRGB
            
        }

        console.log("the option rn is: " + $('#userSelect').val());
        let user = firebase.auth().currentUser;
        console.log("user before upload is:" + user.displayName);
        console.log("google user id: " + user.uid);
        console.log(postData);
        updates['/Posts/' + user.uid + '/' + $('#userSelect').val() + "/" + postKey] = postData;
        firebase.database().ref().update(updates);
        console.log("uploaded image");


        $("#uploadButton").html("Upload Complete ✓");

        // uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //     console.log('File available at', downloadURL);
        // });
    });
}
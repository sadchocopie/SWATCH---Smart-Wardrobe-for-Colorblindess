let selectedFile = "";
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
                let rgbToHex = function (value) {
                    let hex = Number(value).toString(16);
                    if (hex.length < 2) {
                        hex = '0' + hex;
                    }
                    return hex
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
                                $('#status').html('Successfully fetched data at URL: ' + requestURL);
                                $('#jobDiv').html('the Dominant color is ' + data.name);
                            }
                            $('#color' + count).css('background-color', data.hex);
                            $('#colorText' + count).html(data.name);
                            count = count + 1;
                        } else {
                            $('#status').html('Error: could not find color at URL: ' + requestURL);
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


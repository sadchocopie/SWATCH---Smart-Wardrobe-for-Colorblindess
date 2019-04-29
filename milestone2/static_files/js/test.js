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
        },
        getSwatches() {
            console.log("test")
            let colorThief = new ColorThief();
            let colorArr = colorThief.getPalette(this.$refs.theImage, 2);
            // let colorArr = colorThief.getColor(this.$refs.theImage);

            //reset
            this.swatches = [];
            colorArr.forEach(c => {
                let style = {
                    backgroundColor: "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"
                }
                this.swatches.push({ style });
            });

            // let style = {
            //     backgroundColor: "rgb(" + colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + ")"
            // }
            // this.swatches.push({ style });
        }
    }
});


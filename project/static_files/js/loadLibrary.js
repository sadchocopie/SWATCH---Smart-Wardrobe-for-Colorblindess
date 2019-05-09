Vue.component('obj', {
    props: {
        item: String,
        image: String
    },
    template: '<div class="itemBox"><p> {{ item }} </p><img class="imgBox" v-bind:src="image" style="width:90%; margin:auto;" />       </div>'
});


const app = new Vue({
    el: '#app',
    data: {
        message: 'Please select 2 items (do green shirt and gray pants for now):',
        objectTypes: [
            { type: 'Green shirt', selected: false, imgSrc: '../images/shirt.jpg' },
            { type: 'White shirt', selected: false, imgSrc: '../images/whiteTee.jpg' },
            { type: 'gray pants', selected: false, imgSrc: '../images/pants.jpg' },
            { type: 'Pink Hooide', selected: false, imgSrc: '../images/pinkHoodie.jpg' }
        ],
        
//        imageSources: [
//            { imgSrc: '../images/shirt.jpg'},
//            { imgSrc: '../images/pants.jpg'}
//        ]
    },
    methods: {
        selectObjectType: function (object) {
            object.selected = !object.selected;
            console.log('Selected:', object.type)

        }
    }

});




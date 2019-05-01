Vue.component('obj', {
    props: {
        item: String},
    template: '<div>{{ item }}</div>'
});


const app = new Vue({
    el: '#app',
    data: {
        message: 'Please select 2 items (do green shirt and gray pants for now):',
        objectTypes: [
            { type: 'green shirt', selected: false },
            { type: 'yellow shirt', selected: false },
            { type: 'gray pants', selected: false },
            { type: 'white shoes', selected: false }
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




Vue.component('obj', {
    props: {
        item: String,
        image: String
    },

    //    template: '<div class="itemBox"><p> {{ item }} </p><img class="imgBox" v-bind:src="image" style="width:90%; margin:auto;" />       </div>'

    template: '<div class="card"><img class="imgBox" v-bind:src="image" />'
});

const database = firebase.database();
let clothesList = [];
database.ref('Posts/').on('value', (snapshot) => {
    const allClothes = snapshot.val();
    console.log('Posts/ changed:', allClothes);
    clothesList.length = 0; // clears list just in case
    if (allClothes) {
        Object.keys(allClothes).forEach((key) => {
            clothesList.push(
                {
                    type: allClothes[key].type,
                    selected: false,
                    imgSrc: allClothes[key].url,
                    id: key
                }
            );
        });
    }

});

function deleteFile() {

    if (window.confirm("Delete this item from wardrobe?") == true ) {
        console.log('test', clothesList);
        let updates = {};
        clothesList.forEach((element) => {
            if (element.selected) {
                updates['/Posts/' + element.id] = null;
            }
        });
        database.ref().update(updates);
        console.log('end of delete file', clothesList);
    } else {

    }

}

const app = new Vue({
    el: '#app',
    data: {
        message: 'Please select 2 items (do green shirt and gray pants for now):',
        objectTypes: clothesList,
    },
    methods: {
        selectObjectType: function (object) {
            object.selected = !object.selected;
            console.log('Selected:', object.type + object.selected);
        }
    }

});




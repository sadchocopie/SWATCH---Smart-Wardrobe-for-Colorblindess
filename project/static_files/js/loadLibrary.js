Vue.component('obj', {
    props: {
        item: String,
        image: String
    },

    template: '<div class="card"><img class="imgBox" v-bind:src="image" />'
});

const database = firebase.database();

// UPDATE TOP LIST
let clothesList_TOP = [];
database.ref('Posts/Top/').on('value', (snapshot) => {
    const allTops = snapshot.val();
    console.log('Posts/ changed:', allTops);
    clothesList_TOP.length = 0; // clears list just in case
    if (allTops) {
        Object.keys(allTops).forEach((key) => {
            clothesList_TOP.push(
                {
                    type: allTops[key].type,
                    selected: false,
                    imgSrc: allTops[key].url,
                    id: key
                }
            );
        });
    }
});

// UPDATE BOTTOM LIST
let clothesList_BOTTOM = [];
database.ref('Posts/Bottom/').on('value', (snapshot) => {
    const allBottoms = snapshot.val();
    console.log('Posts/ changed:', allBottoms);
    clothesList_BOTTOM.length = 0; // clears list just in case
    if (allBottoms) {
        Object.keys(allBottoms).forEach((key) => {
            clothesList_BOTTOM.push(
                {
                    type: allBottoms[key].type,
                    selected: false,
                    imgSrc: allBottoms[key].url,
                    id: key
                }
            );
        });
    }
});

// UPDATE OUTERWEAR LIST
let clothesList_OUTERWEAR = [];
database.ref('Posts/Outerwear').on('value', (snapshot) => {
    const allOuterwears = snapshot.val();
    console.log('Posts/ changed:', allOuterwears);
    clothesList_OUTERWEAR.length = 0; // clears list just in case
    if (allOuterwears) {
        Object.keys(allOuterwears).forEach((key) => {
            clothesList_OUTERWEAR.push(
                {
                    type: allOuterwears[key].type,
                    selected: false,
                    imgSrc: allOuterwears[key].url,
                    id: key
                }
            );
        });
    }
});

function deleteFile() {

    if (window.confirm("Delete this item from wardrobe?") == true ) {
        console.log('delete files');
        let updates = {};
        clothesList_TOP.forEach((element) => {
            if (element.selected) {
                updates['/Posts/'+ element.type + '/' + element.id] = null;
            }
        });
        clothesList_OUTERWEAR.forEach((element) => {
            if (element.selected) {
                updates['/Posts/'+ element.type + '/' + element.id] = null;
            }
        });
        clothesList_BOTTOM.forEach((element) => {
            if (element.selected) {
                updates['/Posts/'+ element.type + '/' + element.id] = null;
            }
        });
        database.ref().update(updates);
        console.log('end of delete file');
    } else {
    }
}

const app = new Vue({
    el: '#app',
    data: {
        categoryTop: clothesList_TOP,
        categoryBottom: clothesList_BOTTOM,
        categoryOuterwear: clothesList_OUTERWEAR
    },
    methods: {
        selectObjectType: function (object) {
            object.selected = !object.selected;
            console.log('Selected:', object.type + object.selected);
        }
    }
});




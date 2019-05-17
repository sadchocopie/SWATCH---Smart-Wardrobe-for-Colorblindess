


Vue.component('obj', {
    props: {
        item: String,
        image: String
    },

    template: '<div class="card"><img class="imgBox" v-bind:src="image" />'
});
var googleUser = "";

let clothesList_TOP = [];

let clothesList_BOTTOM = [];

let clothesList_OUTERWEAR = [];
const database = firebase.database();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // UPDATE TOP LIST
        googleUser = firebase.auth().currentUser;
        database.ref('Posts/' + googleUser.uid + '/Top/').on('value', (snapshot) => {
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
        database.ref('Posts/' + googleUser.uid + '/Bottom/').on('value', (snapshot) => {
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
        database.ref('Posts/' + googleUser.uid + '/Outerwear/').on('value', (snapshot) => {
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
    } else {
        // No user is signed in.
    }
});

function deleteFile() {

    if (window.confirm("Delete this item from wardrobe?") == true) {
        console.log('delete files');
        let updates = {};
        clothesList_TOP.forEach((element) => {
            if (element.selected) {
                updates['/Posts/' + googleUser.uid + '/' + element.type + '/' + element.id] = null;
            }
        });
        clothesList_OUTERWEAR.forEach((element) => {
            if (element.selected) {
                updates['/Posts/' + googleUser.uid + '/' + element.type + '/' + element.id] = null;
            }
        });
        clothesList_BOTTOM.forEach((element) => {
            if (element.selected) {
                updates['/Posts/' + googleUser.uid + '/' + element.type + '/' + element.id] = null;
            }
        });
        database.ref().update(updates);
        console.log('end of delete file');
    } else {
    }
}

function checkMatch() {
    let matchlist = [];
    clothesList_TOP.forEach((element) => {
        if (element.selected) {
            matchlist.push(element.id);
        }
    });
    clothesList_OUTERWEAR.forEach((element) => {
        if (element.selected) {
            matchlist.push(element.id);
        }
    });
    clothesList_BOTTOM.forEach((element) => {
        if (element.selected) {
            matchlist.push(element.id);
        }
    });
    console.log('list of id', matchlist);
    location.href = './match.html?' + matchlist;
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




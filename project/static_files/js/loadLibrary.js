


Vue.component('obj', {
    props: {
        item: String,
        image: String,
        color: String
    },

    template: '<div class="card"><img class="imgBox" v-bind:src="image" />'
});

Vue.component('colorText', {
    props: {
        item: String,
        image: String,
        color: ['text']
    },

    template: '<div class="card">{{ color }}</div>'
});

var googleUser = "";

let clothesList_TOP = [];

let clothesList_BOTTOM = [];

let clothesList_OUTERWEAR = [];

let clothesList_Other = [];
const database = firebase.database();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        googleUser = firebase.auth().currentUser;
        datebase(googleUser);
    } else {
        // No user is signed in.
        console.log("no user logined");
        window.location.href = "./";
    }
});

function datebase(googleUser) {
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
                        id: key,
                        color: allTops[key].color
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
                        id: key,
                        color: allBottoms[key].color
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
                        id: key,
                        color: allOuterwears[key].color
                    }
                );
            });
        }
    });

    // UPDATE other LIST
    database.ref('Posts/' + googleUser.uid + '/Other/').on('value', (snapshot) => {
        const allOtherwears = snapshot.val();
        console.log('Posts/ changed:', allOtherwears);
        clothesList_Other.length = 0; // clears list just in case
        if (allOtherwears) {
            Object.keys(allOtherwears).forEach((key) => {
                clothesList_Other.push(
                    {
                        type: allOtherwears[key].type,
                        selected: false,
                        imgSrc: allOtherwears[key].url,
                        id: key,
                        color: allOtherwears[key].color
                    }
                );
            });
        }
    });
}


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
        clothesList_Other.forEach((element) => {
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
    clothesList_Other.forEach((element) => {
        if (element.selected) {
            matchlist.push(element.id);
        }
    });
    console.log('list of id', matchlist);
    location.href = './match.html?match=' + matchlist;
}

function checkRecommendation() {
    let recclist = [];
    clothesList_TOP.forEach((element) => {
        if (element.selected) {
            recclist.push(element.id);
        }
    });
    clothesList_OUTERWEAR.forEach((element) => {
        if (element.selected) {
            recclist.push(element.id);
        }
    });
    clothesList_BOTTOM.forEach((element) => {
        if (element.selected) {
            recclist.push(element.id);
        }
    });
    clothesList_Other.forEach((element) => {
        if (element.selected) {
            recclist.push(element.id);
        }
    });
    console.log('list of id', recclist);
    location.href = './recommend.html?image=' + recclist;
}


const app = new Vue({
    el: '#app',
    data: {
        categoryTop: clothesList_TOP,
        categoryBottom: clothesList_BOTTOM,
        categoryOuterwear: clothesList_OUTERWEAR,
        categoryOther: clothesList_Other
    },
    methods: {
        selectObjectType: function (object) {
            object.selected = !object.selected;
            console.log('Selected:', object.type + object.selected);
        }
    }
});



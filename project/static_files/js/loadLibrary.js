// this file is the js file that loads the entire frontend and supports the backend of the entire library.html
// autoloads stuff from database onto the frontend. 
// The algorithms for deleting items and filtering matching items are defined here.


// template for each clothes
Vue.component('obj', {
    props: {
        item: String,
        image: String,
        color: String
    },
    template: '<div class="outerCard"><div class="card"><img class="imgBox" v-bind:src="image" /></div> <div class="imgColorTag"><p>{{ color }}</p></div></div>'
});

var googleUser = "";
let clothesList_TOP = [];
let clothesList_BOTTOM = [];
let clothesList_OUTERWEAR = [];
let clothesList_Other = [];

const database = firebase.database();
// this is when the user is logged in or not logged in
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

// this gets the stored images for the user from the database for each of our 4 categories of clothes. 
function datebase(googleUser) {
    // UPDATE TOP LIST from database
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
                        grayed: false,
                        imgSrc: allTops[key].url,
                        id: key,
                        color: allTops[key].color,
                        colorHex: allTops[key].colorHex,
                        colorRGB: allTops[key].colorRGB


                    }
                );
            });
        }
    });

    // UPDATE BOTTOM LIST from database
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
                        grayed: false,
                        imgSrc: allBottoms[key].url,
                        id: key,
                        color: allBottoms[key].color,
                        colorHex: allBottoms[key].colorHex,
                        colorRGB: allBottoms[key].colorRGB

                    }
                );
            });
        }
    });

    // UPDATE OUTERWEAR LIST from database
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
                        grayed: false,
                        imgSrc: allOuterwears[key].url,
                        id: key,
                        color: allOuterwears[key].color,
                        colorHex: allOuterwears[key].colorHex,
                        colorRGB: allOuterwears[key].colorRGB

                    }
                );
            });
        }
    });

    // UPDATE other LIST from database
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
                        grayed: false,
                        imgSrc: allOtherwears[key].url,
                        id: key,
                        color: allOtherwears[key].color,
                        colorHex: allOtherwears[key].colorHex,
                        colorRGB: allOtherwears[key].colorRGB


                    }
                );
            });
        }
    });
}

/**
 * delete all files selected
 * Due to other functionality you can only delete only one item from each row
 */
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
    } else {
    }
}

/**
 * this allows the user to push the image id as parameters for the recommend page
 * called by the recommend button
 */
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
        msg: 'Select one item to get recommendations!',
        categoryTop: clothesList_TOP,
        categoryBottom: clothesList_BOTTOM,
        categoryOuterwear: clothesList_OUTERWEAR,
        categoryOther: clothesList_Other,
        selectedArticles: {}
    },
    methods: {
        // handles the selecting aspect of the library page and grays out the clothes that don't match color wise
        selectObjectType: function (object) {
            console.log("test object selected", object);
            switch (object.type) {
                case "Top":
                    console.log("top selected");
                    this.categoryTop.forEach(obj => {
                        if (obj.id != object.id) {
                            obj.selected = false;
                            obj.grayed = true;
                        }
                    });
                    break;
                case "Bottom":
                    console.log("Bottom selected");
                    this.categoryBottom.forEach(obj => {
                        if (obj.id != object.id) {
                            obj.selected = false;
                            obj.grayed = true;
                        }
                    });
                    break;
                case "Outerwear":
                    console.log("outerwear selected");
                    this.categoryOuterwear.forEach(obj => {
                        if (obj.id != object.id) {
                            obj.selected = false;
                            obj.grayed = true;
                        }
                    });
                    break;
                case "Others":
                    console.log("other selected");
                    this.categoryOther.forEach(obj => {
                        if (obj.id != object.id) {
                            obj.selected = false;
                            obj.grayed = true;
                        }
                    });
                    break;
                default:
                // code block
            }
            object.selected = !object.selected;
            if (!object.selected) {
                delete this.selectedArticles[object.type]
            } else {
                this.selectedArticles[object.type] = object.colorRGB
            }
            object.grayed = false;

            console.log('Selected:', object.type + object.selected);
            console.log('AllSelected', this.selectedArticles);
            let numSelected = Object.keys(this.selectedArticles).length;
            console.log('number of things selected', numSelected);
            let rgbArray = Object.values(this.selectedArticles);
            let arrStr = encodeURIComponent(JSON.stringify(rgbArray));
            // use a ajax request to get the one recommended color to then search for it
            $.ajax({
                type: 'GET',
                url: 'recommendOneColor/?sColors=' + arrStr,
                dataType: 'json',
                success: (data) => {
                    console.log(data);
                    if (!("Top" in this.selectedArticles)) {

                        this.categoryTop.forEach(obj => {
                            obj.grayed = false;

                            if (deltaE(obj.colorRGB, data[numSelected]) > 35) {
                                if (obj.selected) {
                                    obj.grayed = false;
                                } else {
                                    obj.grayed = true;
                                }
                            }

                        });
                    }
                    if (!("Bottom" in this.selectedArticles)) {

                        this.categoryBottom.forEach(obj => {

                            obj.grayed = false;
                            if (deltaE(obj.colorRGB, data[numSelected]) > 35) {
                                if (obj.selected) {
                                    obj.grayed = false;
                                } else {
                                    obj.grayed = true;
                                }
                            }
                        });
                    }
                    if (!("Outerwear" in this.selectedArticles)) {

                        this.categoryOuterwear.forEach(obj => {
                            obj.grayed = false;
                            if (deltaE(obj.colorRGB, data[numSelected]) > 35) {
                                if (obj.selected) {
                                    obj.grayed = false;
                                } else {
                                    obj.grayed = true;
                                }
                            }
                        });
                    }
                    if (!("Others" in this.selectedArticles)) {

                        this.categoryOther.forEach(obj => {
                            obj.grayed = false;
                            if (deltaE(obj.colorRGB, data[numSelected]) > 35) {
                                if (obj.selected) {
                                    obj.grayed = false;
                                } else {
                                    obj.grayed = true;
                                }
                            }
                        });
                    }
                }
            });

        }
    }
});

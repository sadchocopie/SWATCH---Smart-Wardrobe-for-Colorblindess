/**
 * this js file is meant for recommend.html page 
 */



/**
  * get the parameters you have sent to the reccomend page of the clothes
  */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
  * convert rgb to hex value helper method
  */
let rgbToHex = function (value) {
    let hex = Number(value).toString(16);
    if (hex.length < 2) {
        hex = '0' + hex;
    }
    return hex
}


/**
 * uses a ajax call into the backend with a urllist of images we need color recommendations
 * then load the recommended colors.
 * @param {String} textColorHex 
 * @param {Array} urlList 
 */
function callRecommend(textColorHex, urlList) {
    console.log("before ajax call, TextcolorHex:", textColorHex);
    $.ajax({
        type: 'GET',
        url: 'recommendColors/?' + textColorHex,
        dataType: 'json',
        success: (data) => {
            let count = 0;
            console.log('Recommended colors from ajax request:', data);
            var listSize;
            for (listSize = 0; listSize < urlList.length; listSize++) {
                $("#articleimg" + listSize).attr('src', urlList[listSize]);
                $("#articleimg" + listSize).css("display", "block");
            }
            $("#s0").css('background-color', 'rgb(' + data[0] + ')');
            $("#s1").css('background-color', 'rgb(' + data[1] + ')');
            $("#s2").css('background-color', 'rgb(' + data[2] + ')');
            $("#s3").css('background-color', 'rgb(' + data[3] + ')');
            $("#s4").css('background-color', 'rgb(' + data[4] + ')');
            $("#rectext").replaceWith("<h3>Recommendations</h3>");
            $("#loadtext").replaceWith("<h5>Recommended Colors</h5>");
            data.forEach(c => {
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
                            $('#t' + count).html(data.name);
                            count = count + 1;
                            console.log("the count is now " + count);
                        } else {
                        }
                    },
                });
            });

        }
    });
}


// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {

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

        let article = [];
        let articleName = getParameterByName('image');
        let articleList = articleName.split(',');
        let urlList = [];
        let textColorHex = "";
        console.log(articleList.length);

        // The next couple of loops allow us to get the list of clothes that the user wants recommendations for
        // we will then call a ajax function to then get the recommended colors.
        for (let i = 0; i < articleList.length; i++) {
            database.ref('Posts/' + googleUser.uid + '/Top/').once('value', (snapshot) => {
                const allTops = snapshot.val();
                let articleName = articleList[i];
                if (allTops) {
                    if (allTops[articleName]) {
                        article.push(allTops[articleName]);
                        console.log("test");
                        if (textColorHex.length == 0) {
                            textColorHex = 'sColors=' + allTops[articleName].colorHex;
                        }
                        else {
                            textColorHex = textColorHex + '&sColors=' + allTops[articleName].colorHex;
                        }

                        urlList.push(allTops[articleName].url);
                        console.log('article:', article);
                    }
                }
            });
            database.ref('Posts/' + googleUser.uid + '/Bottom/').once('value', (snapshot) => {
                const allTops = snapshot.val();
                let articleName = articleList[i];
                if (allTops) {
                    if (allTops[articleName]) {
                        article.push(allTops[articleName]);
                        console.log("test");
                        if (textColorHex.length == 0) {
                            textColorHex = 'sColors=' + allTops[articleName].colorHex;
                        }
                        else {
                            textColorHex = textColorHex + '&sColors=' + allTops[articleName].colorHex;
                        }

                        urlList.push(allTops[articleName].url);
                        console.log('article:', article);
                    }
                }
            });
            database.ref('Posts/' + googleUser.uid + '/Outerwear/').once('value', (snapshot) => {
                const allTops = snapshot.val();
                let articleName = articleList[i];
                if (allTops) {
                    if (allTops[articleName]) {
                        article.push(allTops[articleName]);
                        console.log("test");
                        if (textColorHex.length == 0) {
                            textColorHex = 'sColors=' + allTops[articleName].colorHex;
                        }
                        else {
                            textColorHex = textColorHex + '&sColors=' + allTops[articleName].colorHex;
                        }

                        urlList.push(allTops[articleName].url);
                        console.log('article:', article);
                    }
                }
            });
            database.ref('Posts/' + googleUser.uid + '/Other/').once('value', (snapshot) => {
                const allTops = snapshot.val();
                let articleName = articleList[i];
                if (allTops) {
                    if (allTops[articleName]) {
                        article.push(allTops[articleName]);
                        console.log("test");
                        if (textColorHex.length == 0) {
                            textColorHex = 'sColors=' + allTops[articleName].colorHex;
                        }
                        else {
                            textColorHex = textColorHex + '&sColors=' + allTops[articleName].colorHex;
                        }

                        urlList.push(allTops[articleName].url);
                        console.log('article:', article);
                    }
                }
            }).then(function () {
                if (i == articleList.length - 1) {
                    console.log("textColorhex", textColorHex)
                    callRecommend(textColorHex, urlList);
                }
            }
            );
        }
    });
    // define a generic Ajax error handler:
    // http://api.jquery.com/ajaxerror/
    $(document).ajaxError(() => {
        $('#status').html('Error: unknown ajaxError!');
    });
});
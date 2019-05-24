function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function callRecommend(textColorHex, urlList) {
    console.log("before adjax call", textColorHex);
    $.ajax({
        type: 'GET',
        url: 'recommendColors/?' + textColorHex,
        dataType: 'json',
        success: (data) => {
            console.log('Recommended colors:', data);
            $("#articleimg").attr('src', urlList[0]);
            $("#s0").css('background-color', 'rgb(' + data[0] + ')');
            $("#s1").css('background-color', 'rgb(' + data[1] + ')');
            $("#s2").css('background-color', 'rgb(' + data[2] + ')');
            $("#s3").css('background-color', 'rgb(' + data[3] + ')');
            $("#s4").css('background-color', 'rgb(' + data[4] + ')');
            $("#rectext").replaceWith("<h3>Recommendations</h3>");
            $("#loadtext").replaceWith("<h5>Recommended Colors</h5>");


        }
    });
    console.log("finished recommend");
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

        for (let i = 0; i < articleList.length; i++) {
            database.ref('Posts/' + googleUser.uid + '/Top/').once('value', (snapshot) => {
                const allTops = snapshot.val();
                let articleName = articleList[i];

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
            }).then(function () {
                if (i == articleList.length - 1) {
                    console.log("textColorhex", textColorHex)
                    callRecommend(textColorHex, urlList);
                }
            }

            );
        }
    });

    $('#s0').click(() => {
        let colorToSearch = $(this).attr('background-color');
        firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                        googleUser = firebase.auth().currentUser;
                        datebase(googleUser);
                } else {
                        // No user is signed in.
                        console.log("no user logined");
                        window.location.href = "./";
                }
                let allArticlesMatch = [];
                database.ref('Posts/' + googleUser.uid).once('value', (snapshot) => {
                        const allClothes = snapshot.val();
                        // console.log(allClothes);
                        const flattenedAll = [];
                        flattenedAll.push(allClothes['Top']);
                        flattenedAll.push(allClothes['Bottom']);
                        flattenedAll.push(allClothes['Outerwear']);

                        
                        console.log(flattenedAll);
                        
                });
        });
    });

    $('#readButton').click(() => {
        const requestURL = 'colorCombo/' + $('#nameBox').val();
        console.log('making ajax request to:', requestURL);

        // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
        // Using the core $.ajax() method since it's the most flexible.
        // ($.get() and $.getJSON() are nicer convenience functions)
        $.ajax({
            // all URLs are relative to http://localhost:3000/
            url: requestURL,
            type: 'GET',
            dataType: 'json', // this URL returns data in JSON format
            success: (data) => {
                console.log('You received some data!', data);

                if (data) {
                    $('#status').html('Successfully fetched data at URL: ' + requestURL);
                    $('#jobDiv').html('that color is ' + $('#nameBox').val());
                    $('#petImage').attr('src', "./images/" + data.pic).attr('width', '300px');
                    console.log('You received some data!', data.colors);
                    $('#color1').css('background-color', data.colors[0]);
                    $('#color1').html(data.colors[0]);
                    $('#color2').css('background-color', data.colors[1]);
                    $('#color2').html(data.colors[1]);
                    $('#color3').css('background-color', data.colors[2]);
                    $('#color3').html(data.colors[2]);
                } else {
                    $('#status').html('Error: could not find color at URL: ' + requestURL);
                    // clear the display
                    $('#jobDiv').html('');
                    $('#petImage').attr('src', '').attr('width', '0px');
                }
            },
        });
    });

    $('#allUsersButton').click(() => {
        $.ajax({
            url: 'colorCombo',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                console.log('You received some data!', data);
                $('#status').html('All colors: ' + data);
            },
        });
    });

    // define a generic Ajax error handler:
    // http://api.jquery.com/ajaxerror/
    $(document).ajaxError(() => {
        $('#status').html('Error: unknown ajaxError!');
    });
});
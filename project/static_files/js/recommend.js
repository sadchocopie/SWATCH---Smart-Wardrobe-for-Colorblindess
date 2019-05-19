function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

// how you can pick a value from the variable array.
var number = getUrlVars()["x"];
var mytext = getUrlVars()["text"];
// ex: reccommend.html?x=1&text=hello

// when the parameter is missing from the URL the value will be undefined. 
// Here’s how to set a default value to the variable:
function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
} // use like var mytext = getUrlParam('text','Empty');


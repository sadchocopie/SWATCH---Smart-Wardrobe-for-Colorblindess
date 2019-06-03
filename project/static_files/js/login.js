/**
 * code provided from Google firebase online documenation 
 * to allow user to login or out of google using firebase
 */
function googleSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        console.log("token", token);
        // The signed-in user info.
        let user = result.user;
        console.log("user", user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        // ...
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        //document.getElementById("user_div").style.display = "block";
        //document.getElementById("login_div").style.display = "none";

        let user = firebase.auth().currentUser;
        if (user != null) {
            let name = user.displayName;
            document.getElementById("googleUser").innerHTML = "" + name;
            let imgUrl = user.photoURL;
            $("#googleImg").attr("src", imgUrl);
        }

    } else {
        // No user is signed in.
        console.log("No user logged in");
        document.getElementById("googleUser").innerHTML = "" + name;
    }
});

function loginWithEmailAndPassword() {

    let userEmail = document.getElementById("email_field").value;
    let userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        window.alert("Error : " + errorMessage);
    });

}

function logout() {
    firebase.auth().signOut();
}
# Final.md
## Team Member Contribution
#### Andrew Li: 
* Full-stacker
* Contributed to setting up firebase database
* Implemented calls to the backend
* Implemented dynamic loading of front end components
* Set up the connect between users and the database

#### David Dinata: 
* Backend developer
* Contributed to setting up web APIs 
* Connected web APIs to our application
* Implemented color matching recommendation 
* Implemented automatic color naming
* Clothes sorting and filtering algorithm

#### Harriet Wang: 
* Frontend developer
* Implemented Front end dynamic loading
* Contributed to designing the layout
* Set color scheme
* Designed user interface components 
* Documented project progress with markdown files

#### Melody Xue : 
* Frontend designer
* Front end user interface design
* contributed to designing the layout
* Set color scheme
* Designed and made logo
* Design user interface components
* Documented project progress with markdown files

## List of Source Code Files and Brief Description 
##### Static files: 
##### CSS: 
**Custom.css** - code to set style, color, and position for front end user interface elements, and Vue.js components. 
##### HTML: 
**Index.html** - HTML page for setting up app’s login page with google sign in (for firebase) and click functions for sign in button on the page.
**Recommend.html** - HTML page for setting up dynamic loading of selected articles of clothing, and ajax call for posting and displaying matching colors extracted using external web API. 	
**Library.html** - HTML page for displaying user’s personal library or wardrobe. Page contains four buttons each with a click function for scanning items, deleting items in the library, finding matching colors and displaying the pop up box for help. The page loads uploaded items dynamically, set up by Vue.js. Selected item on the page displays in a whitebox so do items with colors that matches. Items that don’t match are greyed out.
**Upload.html** - HTML page for uploading images. Top of the page contains two buttons with click functions, to route to the homepage and library page. This page also sets up the layout for uploading images from user’s laptop or phone by clicking the upload button, and identifying the closest primary colors in the picture uploaded. The identified closest primary colors will be displayed on the right of the upload frame. After the picture is uploaded and colors are identified, users can select clothing category from the drop down menu, and click the button to add to their wardrobe.
##### JS:
**Color-thief.js** - code from online to detect the most dominant, second and third most dominant colors in the picture, and return RGB values of the detected colors.
**Upload.js** - code to upload images to the firebase database.
**Colors.js** - code used for library.html page to find items that match. Code from online that finds similar colors based on the color passed in. 
**firebaseInit.js** - code to connect application to firebase, it serves as our API key.	
**Login.js** - code from firebase online documentation, used to log into and out of user’s Google account. 
**Recommend.js** -code that allows us to get the IDs of the images from the url parameters, then searches from the google database for that IDs. This code then gets the hex value of the image in order to use the colormind API via an ajax request to the backend to get a list of recommended color palettes for the user. 
**Ntc.js** - code to get the names for the colors .
**server.js** - code to set up and help start the server. 

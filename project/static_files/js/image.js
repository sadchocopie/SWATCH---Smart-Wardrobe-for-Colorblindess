$(".imgAdd").click(function () {
    $(this).closest(".row").find('.imgAdd').before('<div class="col-sm-2 imgUp"><div class="imagePreview"></div><label class="btn btn-primary">Upload<input type="file" class="uploadFile img" value="Upload Photo" style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i></div>');
});

$(document).on("click", "i.del", function () {
    $(this).parent().remove();
});


$(function () {
    $(document).on("change", ".uploadFile", function () {
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        if (/^image/.test(files[0].type)) { // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function () { // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile.closest(".imgUpload").find('.imagePreview').css("background-image", "url(" + this.result + ")");
                console.log("test")
                handleFiles(this.result);
            }
        }

    });
});
const colorThief = new ColorThief();

// Run Color Thief functions and display results below image.
// We also log execution time of functions for display.
const showColorsForImage = function ($image, $imageSection) {
    let image = $image[0];
    let start = Date.now();
    let color = colorThief.getColor(image);
    let elapsedTimeForGetColor = Date.now() - start;
    let palette = colorThief.getPalette(image);
    let elapsedTimeForGetPalette = Date.now() - start + elapsedTimeForGetColor;

    let colorThiefOutput = {
        color: color,
        palette: palette,
        elapsedTimeForGetColor: elapsedTimeForGetColor,
        elapsedTimeForGetPalette: elapsedTimeForGetPalette
    };
    console.log(colorThiefOutput);

    let colorThiefOuputHTML = Mustache.to_html($('#color-thief-output-template').html(), colorThiefOutput);

    $imageSection.addClass('with-color-thief-output');
    $imageSection.find('.run-functions-button').addClass('hide');

    setTimeout(function () {
        $imageSection.find('.color-thief-output').append(colorThiefOuputHTML).slideDown();
        // If the color-thief-output div is not in the viewport or cut off, scroll down.
        var windowHeight = $(window).height();
        var currentScrollPosition = $('body').scrollTop()
        var outputOffsetTop = $imageSection.find('.color-thief-output').offset().top
        if ((currentScrollPosition < outputOffsetTop) && (currentScrollPosition + windowHeight - 250 < outputOffsetTop)) {
            $('body').animate({ scrollTop: outputOffsetTop - windowHeight + 200 + "px" });
        }
    }, 300);
};
function handleFiles(files) {
    var $draggedImages = $('#dragged-images');
    var imageType = /image.*/;
    var fileCount = files.length;

    for (var i = 0; i < fileCount; i++) {
        var file = files[i];

        if (file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = function (event) {
                imageInfo = {
                    images: [
                        { 'class': 'dropped-image', file: event.target.result }
                    ]
                };

                var imageSectionHTML = Mustache.to_html($('#image-section-template').html(), imageInfo);
                $draggedImages.prepend(imageSectionHTML);

                var $imageSection = $draggedImages.find('.image-section').first();
                var $image = $('.dropped-image .target-image');

                // Must wait for image to load in DOM, not just load from FileReader
                $image.on('load', function () {
                    showColorsForImage($image, $imageSection);
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('File must be a supported image type.');
        }
    }
}


$(document).ready(function () {
    // Event handlers
    $('.run-functions-button').on('click', function (event) {
        let $this = $(this);
        $this.text('...');
        let $imageSection = $this.closest('.image-section');
        let $colorThiefOutput = $imageSection.find('.color-thief-output');
        let $targetimage = $imageSection.find('.target-image');
        showColorsForImage($targetimage, $imageSection);
    });


});

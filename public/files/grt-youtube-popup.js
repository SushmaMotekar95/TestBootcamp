(function ($) {
    $.fn.grtyoutube = function (options) {
        return this.each(function () {
            var getvideoid = $(this).attr("youtubeid"); 
            var settings = $.extend({ videoID: getvideoid, autoPlay: !0, theme: "dark" }, options); 
            if (settings.autoPlay === !0) {
                settings.autoPlay = 1 
            }
            else if (settings.autoPlay === !1) { 
                settings.autoPlay = 0 }
            if (settings.theme === "dark") { 
                settings.theme = "grtyoutube-dark-theme" 
            } 
            else if (settings.theme === "light") { 
                settings.theme = "grtyoutube-light-theme" 
            }
            if (getvideoid) { 
                $(this).on("click", function () { $("body").append('<div class="grtyoutube-popup ' + settings.theme + '">' + '<div class="grtyoutube-popup-content">' + '<span class="grtyoutube-popup-close"></span>' + '<iframe class="grtyoutube-iframe" src="https://www.youtube.com/embed/' + settings.videoID + '?rel=0&wmode=transparent&autoplay=' + settings.autoPlay + '&iv_load_policy=3" allowfullscreen frameborder="0"></iframe>' + '</div>' + '</div>') }) 
            }
            $(this).on('click', function (event) { event.preventDefault(); $(".grtyoutube-popup-close, .grtyoutube-popup").click(function () { $(".grtyoutube-popup").remove() }) }); $(document).keyup(function (event) { if (event.keyCode == 27) { $(".grtyoutube-popup").remove() } })
        })
    }
}(jQuery))
(function($) {
    $.fn.unsplash = function(options) {
        //Default values
        var defaults = {
            client_id: '',
            limit: '',
            columns: '',
            width: ''
        };
        var settings = $.extend({}, defaults, options);
        
        //Set default parameters
        var page = $(".more").attr("href") ? undefined : 1;
        var filter = $(".dropdown a").attr("href") ? undefined : 'laltest';

        //Initialize Masonry
        var $container = $('#unsplash');
        $container.imagesLoaded(function() {
            $container.masonry({
                itemSelector: '.item'
            });
        });
        function unsplash(page, filter) {
            $.ajax({
                url: 'https://api.unsplash.com/photos',
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: settings.client_id,
                    page: page,
                    per_page: settings.limit,
                    order_by: filter
                },
                success: function(data) {
                    $.each(data, function(i, item) {
                        var containerWidth = $(".container").width();
                        //Aspect Ratio
                        var width = item.width;
                        var height = item.height;
                        var item_width = $(".item").width();
                        var new_height = Math.round((height / width) * containerWidth/settings.columns);
                        //Set custom width
                        var image_url = item.urls.small.replace("&w=400", "&w=" + settings.width);
                        var image = $("<img>").attr("src", image_url).hide();
                        image.fadeToggle("slow");
                        var link = $("<a class='link' target='_blank'>").attr("href", item.links.html).append(image).css({"height": new_height, "background-color":item.color});
                        var name = $("<p>").append("By ", item.user.name);
                        var item = $("<div class='item'>").append(link, name).css({"width": containerWidth/settings.columns});
                        var $container = $('#unsplash');
                        //Append item to Masonry
                        var $item = $(item);
                        $container.append( $item ).masonry().masonry( 'appended', $item );
                    });
                    //Set page number value in MORE button
                    var more = $("<a class='more'>").attr("href", page).html("<span>...</span>");
                    $("#more").html(more);
                }, 
                error: function(){
                    $(".more").html("ERROR");
                }
            });
        }

        //Click function to get the next page
        $(document).on('click', '.more', function() {
            page = $(".more").attr('href');
            page++;
            unsplash(page, filter);
            return false;
        });
        $(document).on('click', '.dropdown a', function(e) {
            e.preventDefault();
            $("#unsplash").masonry( 'destroy' );
            $("#unsplash,#more").empty();
            filter = $(this).attr("href");
            unsplash(1, filter);
        });
        //Initial Load
        unsplash(page, filter);
        
        $( document ).ajaxComplete(function( event, xhr, settings,XMLHttpRequest ) {
            setTimeout(function() {
                if(xhr.status == 200){
                     $(".more").html("MORE");
                } else {
                    $(".more").html("ERROR");
                }
            }, 1500);
        });
    };
}(jQuery));
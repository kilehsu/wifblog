var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/**
/**
 * OnLoad method for main home page only. This should instanciate the showModules
 * and wire up the STaF input handlers.
 */
jQuery(document).ready(function() {

    createModules(document);
    sendToAFriendInputFieldHandler();
    enableMore();
});


// To make sure that both the initial and subsequent calls to these activity items will be able
// to communicate with each other, we create each object just once and store it as part of the
// global dct object.

function createModules(element)
{
    var elementQuery = $(element);
    if (typeof dct.messageBus == "undefined")
    {
        dct.messageBus = appContext.getInstanceByType('PubSub');
    }
    if (typeof dct.activityManager == "undefined")
    {
        dct.activityManager = new dct.ActivityManager( appContext.getInstanceByType('PubSub') );
    }
    if (typeof dct.activityFactory == "undefined")
    {
        dct.activityFactory = new dct.ActivityFactory(dct.activityManager, dct.messageBus, jQuery);
    }
    if (typeof dct.shareModuleFactory == "undefined")
    {
        dct.shareModuleFactory = new dct.ShareModuleFactory(jQuery);
    }

    var showModules = elementQuery.find('.show-module');
    for(var i=0; i < showModules.length; i++)
    {
        var moduleElement = showModules[i];
        new ShowModule(moduleElement, dct.activityFactory, dct.shareModuleFactory);
    }

    // Initialize any poll modules
    var pollModules = elementQuery.find('.pollModule');
    if(pollModules.length > 0)
    {
        var pollModuleElement, pollView, pollModule, pollController;
            
        var pollService = appContext.getInstanceByType('dct.service.poll.IPollService');
        if (typeof pollService != 'undefined' && pollService != null && pollService.baseUrl) {

	        for(var i=0; i < pollModules.length; i++)
	        {
	            pollModuleElement = pollModules[i];
	            var pollId = jQuery(pollModuleElement).find('meta[name=pollId]')['attr']('content');
	            if(pollId)
	            {
	                pollView = new dct.modules.poll.PollModuleView(pollModuleElement, jQuery);
	                pollModule = new dct.modules.poll.PollModule(pollId);
	                pollController = new dct.modules.poll.PollModuleController(pollModule, pollView, pollService, jQuery);
	            }
	        }
        }
    }
}


/*
 Function used to inject additional content items into the home page.
 We wire it up to a button with an ID of "moreContentTrigger".

 */
function enableMore() {
	var page = 1;
    var spinner;
    $("#moreContentTrigger").click(function(e) {
        var offset = $(this).data('feednextoffset');
        var limit = 8;
        var minimumAnimationTime = 2000;
        var clickTime = new Date().getTime();

        var feedService = appContext.getInstanceByType('dct.service.feed.IFeedService');
        feedService.getMore( offset, "dogblog", limit)
            .handleSuccessWith(handleFeedSuccess)
            .handleErrorWith(handleFeedError)
            .send();

        var moreButton = $("#moreContentTrigger");
        var originalButtonText = $(this).html();
        $(this).html("Loading...");
        $(this).addClass("loading");


        var opts = {
            lines: 7, // The number of lines to draw
            length: 0, // The length of each line
            width: 7, // The line thickness
            radius: 6, // The radius of the inner circle
            rotate: 9, // The rotation offset
            color: '#000', // #rgb or #rrggbb
            speed: 1.2, // Rounds per second
            trail: 50, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 30, // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        $("#spinner").addClass("expanded");
        var target = document.getElementById('spinner');
        spinner = new Spinner(opts).spin(target);

        // call tracking for comscore
        if (typeof comscoreUrl != 'undefined') {
        	$.get(comscoreUrl + '?cachebust=' + clickTime);
        }

        function handleFeedSuccess(response) {
			page++;
			
            currentTime = new Date().getTime();
            if (currentTime > (clickTime + minimumAnimationTime)) {
                stopSpinner();
            } else {
                setTimeout(stopSpinner, minimumAnimationTime - (currentTime - clickTime));
            };

            function stopSpinner() {
                //Lets get rid of the spinner...
                spinner.stop();
                $("#spinner").removeClass("expanded");
            };

            // To facilitate correct parsing of the HTML data returned by the ajax call, we
            // wrap the returned data inside of a <div> element.

            var newContentHolder = $('<div class="additional"></div>');
            var response = $.parseJSON(response.request.responseText);
            $(newContentHolder).html(response.markup);
            moreButton.data('feednextoffset', response.nextOffset);

            // We now pass every feed-group block to the createModules() function, which will
            // wire them up with the correct module interactions (open, close, pause, continue, etc)
            // Once we do that, write out each new feed group node into the page DOM, right after the
            // last previous feed-group item.

            var newContentArray = $(newContentHolder).find(".feed-group");
            if (newContentArray.length > 0) {
                for (var i = 0; i < newContentArray.length; i++) {
                    createModules(newContentArray[i]);
                    var lastFeedGroupObject = $(".feed-group").last();
                    $(lastFeedGroupObject).after(newContentArray[i]);
                }
                $(moreButton).removeClass("loading");
                $(moreButton).html(originalButtonText);
				//Track page view
				if(cto){
					cto.track({"pageName":"page_"+page,"seriesCode":"dch"});
				}
            } else{
                $(moreButton).hide();
            }
            sendToAFriendInputFieldHandler();
            
        };



        function handleFeedError(response) {
            //Lets get rid of the spinner...
            spinner.stop();
            $("#spinner").removeClass("expanded");

            $(moreButton).html("Error loading additional content");
        };
        
        return false;
    });
};



}
/*
     FILE ARCHIVED ON 14:54:56 Dec 14, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:26:28 Sep 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.49
  exclusion.robots: 0.017
  exclusion.robots.policy: 0.008
  esindex: 0.009
  cdx.remote: 77.853
  LoadShardBlock: 47.09 (3)
  PetaboxLoader3.datanode: 67.306 (4)
  load_resource: 120.491
  PetaboxLoader3.resolve: 71.462
*/
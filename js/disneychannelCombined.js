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

var CharacterNavigationInit = function() {	
	jQuery(document).ready(function() {

        var mainCarouselDiv = jQuery(".carousel").first();

		function mycarousel_initCallback(carousel){
			// Set a background image for each carousel item
			jQuery('.jcarousel-item a').each(
				function(index) {
					// Set the background image of the link to the src of the img,
					// with a minor text swap in the src url. Et voila!
					var img = jQuery(this).children('img');
					var hoverSrc = img.attr('src').replace('_up', '_hover');
					jQuery(this).css('background-image', "url(" + hoverSrc + ")");
				}
			);
            // write out the Analytics data to the buttons by querying the arrow-data attribs from the DOM.
            $(".jcarousel-prev").attr('data-linkname', $('.arrow-data').attr('data-linkname'));
            $(".jcarousel-prev").attr('data-linkposition', $('.arrow-data').attr('data-linkposition'));
            $(".jcarousel-next").attr('data-linkname', $('.arrow-data').attr('data-linkname'));
            $(".jcarousel-next").attr('data-linkposition', $('.arrow-data').attr('data-linkposition'));
		};


		var swipeOptions= {
			swipe:swipe,
			threshold:20
		}
	
		function swipe(event, direction){
			if (direction == "left") {
				mainCarouselDiv.jcarousel('next');
			} else if (direction == "right") {
				mainCarouselDiv.jcarousel('prev');
			}
		}
	
		jQuery(function(){
			mainCarouselDiv.swipe(swipeOptions);
		});


		mainCarouselDiv.jcarousel({
			auto: 0.0000,
			wrap: 'circular',
			animation: 700,
			easing: 'swing',
			scroll: 8,
			initCallback: mycarousel_initCallback
		});
		jQuery('.jcarousel-next, .jcarousel-prev').css('opacity', 1);
        jQuery('.jcarousel-next, .jcarousel-prev').removeAttr("disabled");
        jQuery('.jcarousel-next, .jcarousel-prev').removeClass('jcarousel-next-disabled jcarousel-next-disabled-horizontal jcarousel-prev-disabled jcarousel-prev-disabled-horizontal');

		
		var characterNav = jQuery(".character-nav");
		var cds = characterNav.hasClass("cds");
		var interstitial = characterNav.attr("data-interstitial");
		
		if (!cds && location.href.indexOf('/cds/') > -1 ){
			cds = true; //forces CDS mode if page is within a folder named "cds";
			characterNav.addClass("cds");
		}
		
		if (cds) {
			var anchors = characterNav.find('a');
			anchors.each(function(){
				this.href = interstitial + this.href;
			});
		}
	});
};


if (!(typeof jQuery == 'undefined')) {
	CharacterNavigationInit();
}

var dct = dct || {}; // If dct already exists, just reuse that

dct.Activity = function(){};
dct.Activity.prototype.allowMultiple = true;
dct.Activity.prototype.pause = function(){};
dct.Activity.prototype.resume = function(){};
dct.Activity.prototype.isPaused = function(){};
dct.Activity.prototype.activate = function(){};
dct.Activity.prototype.dectivate = function(){};
dct.Activity.prototype.show = function(){};
dct.Activity.prototype.hide = function(){};
dct.Activity.prototype.isActive = function(){};
dct.Activity.prototype.play = function(){};
dct = dct || {};


dct.ActivityManager = function(messageBus)
{
    this._messageBus = messageBus;
};

dct.ActivityManager.constructor = dct.ActivityManager;
dct.ActivityManager.prototype._activity = null;


dct.ActivityManager.prototype._messageBus = null;

dct.ActivityManager.prototype.getActivity = function()
{
    return this._activity;
};


dct.ActivityManager.prototype.setActivity = function(activity)
{
    var currentActivity = this.getActivity();

    // Check preconditions
    if(currentActivity == activity)  return;


    if(currentActivity != null)
    {
        // If the current activity doesn't allow multiple activities, ask the user if
        // they would like to stop the current activity.
        if(!currentActivity.allowMultiple && activity)
        {
            var activityConfirm = $('.activity-confirm').first();
            var confirm = activityConfirm.find('.confirm')[0];
            var cancel = activityConfirm.find('.cancel')[0];
            
            var that = this;
            var acceptResponse = function()
            {
                that._messageBus.publish("resume");

                if(that.getActivity().isActive())
                {
                    that.getActivity().deactivate();
                }
                that._activity = activity;
                that._activity.activate();
                activityConfirm.removeClass('active');
            }
            
            var rejectResponse = function()
            {
                that._messageBus.publish("resume");

			    if (that.getActivity().div) {
					Utils.scrollToElement(that.getActivity().div, 160, 800);
				}
            	activityConfirm.removeClass('active');
            }


            confirm.onclick = acceptResponse;
            cancel.onclick = rejectResponse;

            currentActivity.hide();
            this._messageBus.publish("pause");

            activityConfirm.addClass('active');
            return;
        }
        else
        {
            if(currentActivity.isActive())
            {
                currentActivity.deactivate();
            }
        }
    }

    this._activity = activity;
    if(this._activity)
    {
        this._activity.activate();
    }
};


dct.ActivityManager.prototype.pauseActivity = function()
{
    if(this.getActivity())
    {
        this.getActivity().pause();
    }
};


dct.ActivityManager.prototype.stopActivity = function()
{
    if(this.getActivity())
    {
        this.getActivity().deactivate();
    }
};

dct = dct || {};


dct.NullActivityManager = function() {};
dct.NullActivityManager.constructor = new dct.NullActivityManager();
dct.NullActivityManager.prototype.getActivity = function()
{
    return null;
};

dct.NullActivityManager.prototype.setActivity = function(activity){};

dct.NullActivityManager.prototype.pauseActivity = function(){};

dct.NullActivityManager.prototype.stopActivity = function(){};
dct.GameHolder = function(gameId, div, activityManager, messageBus, jQuery, adSlot)
{
    // Override defaults
    this.allowMultiple = false;

    this.activityManager = activityManager;
    this.div = div;
    this.gameId = gameId;
    this.jQuery = jQuery;
    this.messageBus = messageBus;
    this.adSlot = adSlot;

    var teasers = jQuery(this.div).children('.teaser');
    if(teasers && teasers.length > 0)
    {
        this._teaser = teasers[0];

        var that = this;
        this._teaser.onclick = function()
        {
            that.start();
        }
    }
};


dct.GameHolder.prototype = new dct.Activity();
dct.GameHolder.prototype.constructor = dct.GameHolder;
dct.GameHolder.prototype.autoScroll = true;
dct.GameHolder.prototype._isActive = false;
dct.GameHolder.prototype._isPaused = false;
dct.GameHolder.prototype._pauseToken = null;
dct.GameHolder.prototype._resumeToken = null;
dct.GameHolder.prototype._OKtoTriggerHide = true;
dct.GameHolder.prototype._teaser = null;


dct.GameHolder.prototype.isPaused = function()
{
    return this._isPaused;
};


dct.GameHolder.prototype.pause = function()
{
    if(!this.isPaused())
    {
        this._isPaused = true;
        disneyGamesSendMessage("setPause", "true");
    }
};


dct.GameHolder.prototype.resume = function()
{
    if(this.isPaused())
    {
        this._isPaused = false;
        disneyGamesSendMessage("setPause", "false");
    }
};


dct.GameHolder.prototype.isActive = function()
{
    return this._isActive;
}


dct.GameHolder.prototype.activate = function()
{
    if(!$(this._teaser).hasClass("hidden"))
    {
        $(this._teaser).addClass("hidden");
    }

    this._pauseToken = this.messageBus.subscribe("pause", this.jQuery.proxy(this.hide, this));
    this._resumeToken = this.messageBus.subscribe("resume", this.jQuery.proxy(this.show, this));

    var div = this.jQuery(this.div);
    div.removeClass("inactive");
    div.addClass("active");
    disneyGames.addGame({elementId: "DisneyGame_" + this.gameId, contentId: this.gameId, shrinkToFit: "false", adSlot: this.adSlot});

    this._isActive = true;
};


dct.GameHolder.prototype.deactivate = function()
{
    this.messageBus.unsubscribe(this._pauseToken);
    this.messageBus.unsubscribe(this._resumeToken);

    disneyGamesSwfObject.removeSWF("DisneyGameObj");

    var div = this.jQuery(this.div);
    div.removeClass("active");
    div.addClass("inactive");

    var gameObj = document.getElementById("DisneyGame_" + this.gameId);
    if(gameObj && gameObj.hasChildNodes())
    {
        while(gameObj.childNodes.length > 0)
        {
            gameObj.removeChild( gameObj.firstChild );
        }
    }

    this._isActive = false;
    if (this.activityManager.getActivity() == this) {
        this.activityManager.setActivity(null);
    }

    if($(this._teaser).hasClass("hidden"))
    {
        $(this._teaser).removeClass("hidden");
    }
};


dct.GameHolder.prototype.show = function()
{
    disneyGamesShowGame();
    this._OKtoTriggerHide = true;
};


dct.GameHolder.prototype.hide = function()
{
    if(this._OKtoTriggerHide)
    {
        disneyGamesHideGame();
        this._OKtoTriggerHide = false;
    }
}


dct.GameHolder.prototype.start = function()
{
    if (this.div  && this.autoScroll) {
        // This was causing off effects for the scrolling.
        // Utils.scrollToElement(this.div, 160);
    }
    this.activityManager.setActivity(this);
};

dct.VideoHolder = function(contentId, div, activityManager, messageBus, jQuery)
{
    // Override defaults
    this.allowMultiple = true;
    this.messageBus = messageBus;

    this.activityManager = activityManager;
    this.div = div;
    this.contentId = contentId;
    this.jQuery = jQuery;

    var teasers = jQuery(this.div).children('.teaser');
    if(teasers && teasers.length > 0)
    {
        this._teaser = teasers[0];

        var that = this;
        this._teaser.onclick = function()
        {
            that.start();
        }
    }
};

dct.VideoHolder.prototype = new dct.Activity();
dct.VideoHolder.prototype.constructor = dct.VideoHolder;
dct.VideoHolder.prototype.autoScroll = true;
dct.VideoHolder.prototype._isActive = false;
dct.VideoHolder.prototype._isPaused = false;
dct.VideoHolder.prototype._pauseToken = null;
dct.VideoHolder.prototype._resumeToken = null;
dct.VideoHolder.prototype._teaser = null;


dct.VideoHolder.prototype.isPaused = function()
{
    return this._isPaused;
}


dct.VideoHolder.prototype.pause = function()
{
    if(!this.isPaused())
    {
        this._isPaused = true;
        this.player.controls.pause();
    }
};


dct.VideoHolder.prototype.resume = function()
{
    if(this.isPaused())
    {
        this._isPaused = false;
        this.player.controls.play();
    }
};


dct.VideoHolder.prototype.isActive = function()
{
    return this._isActive;
};

dct.VideoHolder.prototype.activate = function()
{
    if(!$(this._teaser).hasClass("hidden"))
    {
        $(this._teaser).addClass("hidden");
    }
    Utils.moveCompanionAd(this.div);

    this._pauseToken = this.messageBus.subscribe("pause", this.jQuery.proxy(this.hide, this));
    this._resumeToken = this.messageBus.subscribe("resume", this.jQuery.proxy(this.show, this));

    try {
        var div = this.jQuery(this.div);
        div.removeClass("inactive");
        div.addClass("active");
        this.player = new DisneyPlayer("DisneyVideo_" + this.contentId, {entryId:this.contentId, autoPlay:true, playerSize:"L"});
    }
    catch(e) {
        txt="Cannot create video player. Error description: ";
        txt+=e.message;
        throw new Error(txt);
    }

    this._isActive = true;
};


dct.VideoHolder.prototype.deactivate = function()
{
    this.messageBus.unsubscribe(this._pauseToken);
    this.messageBus.unsubscribe(this._resumeToken);

    $("#DisneyVideo_" + this.contentId).empty();
    $("#DisneyVideo_").addClass('video-player');

    var div = this.jQuery(this.div);
    div.removeClass("active");
    div.addClass("inactive");

    this._isActive = false;
    if (this.activityManager.getActivity() == this) {
        this.activityManager.setActivity(null);
    }

    if($(this._teaser).hasClass("hidden"))
    {
        $(this._teaser).removeClass("hidden");
    }
};


dct.VideoHolder.prototype.show = function()
{
    this.resume();
    $('#DisneyVideo_' + this.contentId).css('visibility', 'inherit');
};

dct.VideoHolder.prototype.hide = function()
{
    this.pause();
    $('#DisneyVideo_' + this.contentId).css('visibility', 'hidden');
};

dct.VideoHolder.prototype.start = function()
{
    if (this.div && this.autoScroll)
    {
        // This was causing off effects for the scrolling.
        // Utils.scrollToElement(this.div, 160);
    }
    this.activityManager.setActivity(this);
};

dct = dct || {};


dct.ActivityFactory = function(activityManager, messageBus, jQuery)
{
    this.activityManager = activityManager;
    this.messageBus = messageBus;
    this.jQuery = jQuery;
};

dct.ActivityFactory.constructor = dct.ActivityFactory;

dct.ActivityFactory.prototype.activityManager = null;
dct.ActivityFactory.prototype.jQuery = null;

/**
 * Array of class names to look for on elements. These names are also auto-interpreted as
 * factory methods in the form _[className] with any "-" characters removed from the class
 * name, as "-" is not a legal character in method names. For example, the class "game-container"
 * would map to the factory method "_gamecontainer".
 */
dct.ActivityFactory.prototype.mappings = ['game-container', 'video-container'];


dct.ActivityFactory.prototype.createActivity = function(element)
{
   // Check preconditions
   if(element == null)  return;
   if( !(element && element.nodeType == 1) )  return;


    //var classes = element.className;

    for(var i=0; i < this.mappings.length; i++)
    {
        if(this.jQuery(element).hasClass(this.mappings[i]))
        {
            // Remove dashes from class name, as they're not legal characters in method names
            var methodName = '_' + this.mappings[i].replace('-', '');
            var factoryMethod = this[methodName];

            if(factoryMethod)
            {
                return this[methodName](element);
            }
            else
            {
                if(console)
                {
                    console.log("dct.ActivityFactory.createActivity: No creation method found for " + this.mappings[i]);
                }
            }
        }
    }
}


dct.ActivityFactory.prototype._gamecontainer = function(element)
{
    var gameId = element.attributes.getNamedItem('data-gameId').value;
   	var adSlot = null;
   	if (dct.ads) {
   		adSlot = dct.ads["div-gpt-ad-gamesloader"];
   	}
    var holder = new dct.GameHolder(gameId, element, this.activityManager, this.messageBus, this.jQuery, adSlot);

    return holder;
}
dct.ActivityFactory.prototype._videocontainer = function(element)
{
    var contentId = element.attributes.getNamedItem('data-content-id').value;
    var holder = new dct.VideoHolder(contentId, element, this.activityManager, this.messageBus, this.jQuery);

    return holder;
}
function Utils() {};

// Modify the dispatch event to expand the comment box linked to Firebase
Utils.dispatchEvent = function(element, eventName) {
  if (element && eventName === 'commentClick') {
      // When comment button is clicked, show the related comment input form
      var commentSection = $(element).next('.comment-input-section'); // Assuming .comment-input-section is the class of the text box container

      if (commentSection.length > 0) {
          commentSection.slideDown(); // Expand the text box area (can change to other effects like fadeIn)
          commentSection.find('textarea').focus(); // Automatically focus on the textarea for better UX

          // Optionally, if you want to load Firebase comments directly into the box:
          var formId = commentSection.data('form-id'); // Assuming each comment section has a unique form ID to link with Firebase
          loadCommentsFromFirebase(formId, commentSection); // Function to dynamically load comments

      } else {
          console.warn('No comment section found for element', element);
      }
  }
};

// Helper function to load Firebase comments dynamically into the expanded box
function loadCommentsFromFirebase(formId, commentSection) {
  const q = query(collection(db, `comments_${formId}`), orderBy('timestamp', 'desc'));
  onSnapshot(q, (snapshot) => {
      const commentsSection = commentSection.find('.comments-list');
      commentsSection.empty(); // Clear any previous comments

      snapshot.forEach(doc => {
          const comment = doc.data();
          const commentElement = $('<div>').text(comment.text);
          commentsSection.append(commentElement);
      });
  });
}

Utils.scrollToElement = function(element, offset, duration, delay) {

    var position = $(element).offset();
    if (!offset) {
        offset = 0;
    }

    if(!duration) {
        duration = 400;
    }

    if (!delay) {
        $('html, body').animate({ scrollTop: position.top - offset }, {duration: duration});
    } else {
        $('html, body').delay(delay).animate({ scrollTop: position.top - offset }, {duration: duration});
    }
}

/**
 * Function that wires up the share with a friend input fields so that...
 * 1) Default text vanishes when the user clicks in the input area, but text the user adds should remains.
 * 2) input fields with optional "noNumbers" and "noSpaces" class names will block numerals and spaces from being entered.
 */

function sendToAFriendInputFieldHandler() {
    $('.sendFields input').each(function() {

        var originalValue = this.value;
        $(this).focus(function() {
            if (this.value == originalValue) {
                this.value = "";
            };
        });

        $(this).keyup(function(event) {
            var textHolder = $(this).val();

            if ($(this).hasClass("lettersOnly")) {
                textHolder = textHolder.replace(/[^a-zA-Z]/g,"");
                $(this).val(textHolder);
            }
            if ($(this).hasClass("noNumbers")) {
                textHolder = textHolder.replace(/\d/g,"");
                $(this).val(textHolder);
            }
            if ($(this).hasClass("noSpaces")) {
                textHolder = textHolder.replace(/\s/g,"");
                $(this).val(textHolder);
            }
            if ($(this).hasClass("max20")) {
                if (textHolder.length >= 20) {
                    textHolder = textHolder.substr(0, 20);
                    $(this).val(textHolder);
                }
            }
        });
    });
};


Utils.moveCompanionAd = function(theVideoDiv) {
    var companionAdDivs = $('#div-gpt-ad-companionAd-1');
    if ($(companionAdDivs).length > 0) {
        var theCompanionAdDiv = $(companionAdDivs[0]);
    } else {
        var theCompanionAdDiv = document.createElement('div');
        $(theCompanionAdDiv).attr('id', 'div-gpt-ad-companionAd-1').addClass("moduleCompanionAd");
    }
    $(theCompanionAdDiv).css("display", "none");
    $(theVideoDiv).parent().find('.recommendations').prepend(theCompanionAdDiv);
}

/**
 * Creates a new ShowModule. ShowModules are visible modules typically rendered as induvidual items in a collection of modules.
 *
 * @param element The root element containing all DOM elements assigned to a particular module.
 * @param activityFactory dct.ActivityFactory object that is used to construct any activities kept in a show module.
 * @constructor
 */
function ShowModule(element, activityFactory, shareFactory) {
	
    var elementQuery;
    var shareButtonQuery;
    var commentButtonQuery;
    var activityFactory;
    var titleQuery;
    var shareModuleFactory = shareFactory;
    var tabPanel = null;
    var that = this;
    
    if (activityFactory == null) {
    	this.activityFactory = new dct.NullActivityFactory();
    } else {
        this.activityFactory = activityFactory;
    }

    var activity;
    var propertyCode = "";
    var pageName = "";

    elementQuery = $(element);

    if(!elementQuery.hasClass("collapse"))
    {
        tabPanel = shareModuleFactory.createTabs(elementQuery);
    }

    /**
     * ShowModule initialization function. Assigns event handlers to elements enabling
     * behaviors tied to user interaction, or other parts of the system.
     */
    ShowModule.prototype.init = function() {
        shareButtonQuery = elementQuery.find('.share');
        commentButtonQuery = elementQuery.find('.comment');

        var activityQuery = elementQuery.find('.activity');
        activity = activityFactory.createActivity(activityQuery[0]);

        propertyCode = elementQuery.data('propertycode');
        pageName = elementQuery.find('h1').attr('title');

        // If title is not programmed in, just grab the actual title (enev though it could be truncated.
        if(pageName == undefined || pageName == '')
        {
            pageName = elementQuery.find('h1').text();
        }

        this.writeShoutOutAnalytics();

        elementQuery.bind("expand", $.proxy(this.expand, this));
        elementQuery.bind("collapse", $.proxy(this.collapse, this));
        elementQuery.bind("loadStaF", $.proxy(this.loadStaF, this));
    }

    ShowModule.prototype.writeShoutOutAnalytics = function()
    {

        var shoutOutParagraph = elementQuery.find(".shoutout-text");
        if(shoutOutParagraph.length > 0)
        {
            var shoutOutAnchor = shoutOutParagraph.find("a");
            if(shoutOutAnchor.length > 0)
            {
                // grab the module number for this ShoutOut
                var moduleName = elementQuery.find('meta[name=location]').attr("content");

                // trim the whitespace from the beginning and ending of the ShoutOut text
                var trimmedName = $.trim(shoutOutParagraph.text());
                // remove the special quote characters from the beginning and ending of the ShoutOut text.
                trimmedName = trimmedName.replace(/�?/g, '');
                trimmedName = trimmedName.replace(/“/g, '');

                // build the ShoutOut link name for Analytics
                var shoutOutLinkName = moduleName + "/shout/none/TextLink/" + trimmedName;

                // trim the character count of the linkname to 100 characters.
                shoutOutLinkName = shoutOutLinkName.slice(0, 100);

                shoutOutAnchor.attr('data-linkname', shoutOutLinkName);
                shoutOutAnchor.attr('data-linkposition', moduleName + "/shout");
            }
        }
    }

    /**
     * Event handler for any expand events specific to a ShowModule instance. Activates the activity assigned to the ShowModule instance, and
     * ensures the ShowModule DOM is not marked with the "collapse" class name.
     *
     * @param event Object describing the nature of the event that caused the expand event handler to execute.
     */
    ShowModule.prototype.expand = function(event)
    {
        if (cto && elementQuery.hasClass('collapse')) {
            cto.track( {"pageName":pageName, "seriesCode":propertyCode} );
        }

        var targetQuery = $(event.target);

        if (elementQuery.hasClass('collapse')) {
            if (activity && activity.div) {
                var headline = elementQuery.find('h1')[0];
                Utils.scrollToElement(headline, null, null, 300);

                activity.start();
            }
        }
        
		if (!shareButtonQuery.hasClass('hidden')) {
			shareButtonQuery.addClass('hidden');
		}
        if (!commentButtonQuery.hasClass('hidden')) {
            commentButtonQuery.addClass('hidden');
        }

        if(tabPanel == null)
        {
            tabPanel = shareModuleFactory.createTabs(elementQuery);
        }
        elementQuery.removeClass('collapse');

        // Set value of attr src to value of attr data-src in images in recs
        elementQuery.find('.recommendations img[data-src]').each(function (it, el) {
            $(el).attr('src', $(el).attr('data-src'));
        })


        if ($(event.currentTarget).hasClass('gallery-module')) {
            var gallery = $(event.currentTarget).find('.gallery-container');
            var galleryLocation = $(gallery).find('.gallery-box');
            var galleryID = $(galleryLocation).attr('id');
            if (typeof dct.modules.gallery[galleryID] == 'undefined') {
                dct.modules.gallery[galleryID] = new dct.modules.gallery.Gallery($(gallery), $(window), 750);
            }
        }

        // call tracking for comscore
        if (typeof comscoreUrl != 'undefined') {
        	$.get(comscoreUrl + '?cachebust=' + (new Date()).getTime());
        }

    }


    /**
     * Event handler for any collapse events specific to a ShowModule instance. Deactivates the activity assigned to the ShowModule instance, and
     * ensures the ShowModule DOM is marked with the "collapse" class name.
     *
     * @param event Object describing the nature of the event that caused the collapse event handler to execute.
     */
    ShowModule.prototype.collapse = function(event) {

        if (!elementQuery.hasClass("collapse")) {
            elementQuery.addClass("collapse");
        }

        if (activity && activity.isActive()) {
            activity.deactivate();
        }
        
        shareButtonQuery.removeClass('hidden');
        commentButtonQuery.removeClass('hidden');
    }

    /**
     * Prepares a ShowModule for destruction by unbinding all instance specific event handlers and setting all instance variables to null.
     */
    ShowModule.prototype.destroy = function() {
        elementQuery.unbind("expand", this.expand);
        elementQuery.unbind("collapse", this.collapse);

        activity = null;
        activityFactory = null;
        shareButtonQuery = null;
        commentButtonQuery = null;
        elementQuery = null;
    }


    ShowModule.prototype.loadStaF = function() {
        var sendWrapper = $(elementQuery).find(".sendWrapper ")[0];
        var comments = $(elementQuery).find(".comments.tab ")[0];
        var shareButton = $(elementQuery).find(".tabButton.share")[0];
        var commentsButton = $(elementQuery).find(".tabButton.comments")[0];
        $(sendWrapper).addClass("selected");
        $(comments).removeClass("selected");
        $(shareButton).addClass("selected");
        $(commentsButton).removeClass("selected");
    }


    this.init();
}

dct = dct || {};

dct.ShareModuleFactory = function(jQuery)
{
    this.jQuery = jQuery;
};

dct.ShareModuleFactory.constructor = dct.ShareModuleFactory;
dct.ShareModuleFactory.prototype.jQuery = null;

dct.ShareModuleFactory.prototype.createTabs = function(div)
{
    var element = this.jQuery(div);
    var commentsDiv = element.find(".comments");
    var sendWrapperDiv = element.find(".sendWrapper");
    var tabPanel = new dct.TabPanel(this.jQuery, element);

    if(commentsDiv.length > 0)
    {
        var comments = this.createComments(commentsDiv[0]);
        tabPanel.addTabContent(comments);
    }
    if(sendWrapperDiv.length > 0)
    {
        var staf = this.createSTaF(sendWrapperDiv[0]);
        tabPanel.addTabContent(staf);
    }
    return tabPanel;
};


dct.ShareModuleFactory.prototype.createComments = function(div)
{
    var element = this.jQuery(div);
    var commentModule = new dct.CommentModule(element, element.attr('data-eventId'), element.attr('data-width'), element.attr('data-height'), element.attr('data-colorScheme'));
    commentModule.setShowAsk(element.attr('data-showAsk'));
    commentModule.setShowChannels(element.attr('data-showChannels'));

    return commentModule;
}

dct.ShareModuleFactory.prototype.createSTaF = function(div)
{
    var element = this.jQuery(div);
    var stafModule = new dct.STaFModule(element);

    return stafModule;
}

dct = dct || {};

dct.ShareModule = function()
{
    this.setState(dct.ShareModule.COMMENTS);
};

dct.ShareModule.prototype.constructor = dct.ShareModule;
dct.ShareModule.prototype.jQuery = null;
dct.ShareModule.prototype._state = null;
dct.ShareModule.STAF = "sendToAFriend";
dct.ShareModule.COMMENTS = "comments";


dct.ShareModule.prototype.setState = function(state)
{
    this._state = state;
};

dct.ShareModule.prototype.getState = function()
{
    return this._state;
}
dct = dct || {};

/**
 * @constructor
 * @implements {ITabContent}
 */
dct.STaFModule = function(domContainer)
{
    this._domContainer = $(domContainer);
};

dct.STaFModule.constructor = dct.STaFModule;
dct.STaFModule.prototype._domContainer = null;
dct.STaFModule.prototype._name = "Share";
dct.STaFModule.prototype._className = "share";

dct.STaFModule.prototype.activate = function()
{
    if(!this._domContainer.hasClass('selected'))
    {
        this._domContainer.addClass('selected');
    }
};

dct.STaFModule.prototype.deactivate = function()
{
    if(this._domContainer.hasClass('selected'))
    {
        this._domContainer.removeClass('selected');
    }
};

dct.STaFModule.prototype.getName = function()
{
    return this._name;
};

dct.STaFModule.prototype.getClassName = function()
{
    return this._className;
}
dct = dct || {};

/**
 * @constructor
 * @implements {ITabContent}
 */
dct.CommentModule = function(domContainer, eventID, width, height, colorScheme)
{
    this._domContainer = $(domContainer);
    this._eventID = eventID;
    this._width = width;
    this._height = height;
    this._colorScheme = colorScheme;
};

dct.CommentModule.constructor = dct.CommentModule;
dct.CommentModule.prototype._domContainer = null;
dct.CommentModule.prototype._eventID = null;
dct.CommentModule.prototype._width = null;
dct.CommentModule.prototype._height = null;
dct.CommentModule.prototype._colorScheme = null;
dct.CommentModule.prototype._showAsk = 1;
dct.CommentModule.prototype._showChannels = 1;
dct.CommentModule.prototype._name = "Comments";
dct.CommentModule.prototype._className = "comments";
dct.CommentModule.prototype._wasCreated = false;

dct.CommentModule.prototype.activate = function()
{
    if(!this._domContainer.hasClass('selected'))
    {
        this._domContainer.addClass('selected');
    }

    if(this._wasCreated == false)
    {
        var id, type;
        var match = this._eventID.toString().match(/^(vhm|create):(.+)$/);
        if (match) {
            id = match[2];
            type = match[1];
        } else {
            id = this._eventID;
            type = 'vhm';
        }
        
        if(type == 'vhm') {
            this._createVHM(id);
        } else if(type == 'create') {
            this._createCreate(id);
        }
        
        this._wasCreated = true;
    }
};

dct.CommentModule.prototype._createVHM = function(id)
{
    vhm_widget_settings = {elementId: this._domContainer.attr('id'), eventId: id, width: this._width, height: this._height, colorScheme: this._colorScheme, showAsk:this._showAsk, showChannels:this._showChannels};
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = "https://web.archive.org/web/20121018133048/http://vhmengine.com/widgets/qawidget.js.jsp";
    this._domContainer.append( script );
};

dct.CommentModule.prototype._createCreate = function(id)
{
    var iframe = document.createElement('iframe');
    iframe.src = 'https://web.archive.org/web/20121018133048/http://disney.go.com/create/syndication/tv/shoutouts/' + id + '.html';
    iframe.width = this._width;
    iframe.height = this._height;
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('vspace', '0');
    iframe.setAttribute('hspace', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('marginwidth', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('allowtransparency', 'true');
    this._domContainer.append(iframe);
};

dct.CommentModule.prototype.deactivate = function()
{
    if(this._domContainer.hasClass('selected'))
    {
        this._domContainer.removeClass('selected');
    }
};

dct.CommentModule.prototype.getName = function()
{
    return this._name;
};

dct.CommentModule.prototype.getClassName = function()
{
    return this._className;
}

dct.CommentModule.prototype.setShowChannels = function(channels)
{
    this._showChannels = channels;
};

dct.CommentModule.prototype.setShowAsk = function(isShowing)
{
    this._showChannels = isShowing;
};
dct = dct || {};

/**
 * An ITabContent interface for the tabbed content to implement.
 * @interface
 */
dct.ITabContent = function(){};

dct.ITabContent.constructor = dct.ITabContent;

dct.ITabContent.prototype.activate = function(){};
dct.ITabContent.prototype.deactivate = function(){};
dct.ITabContent.prototype.getName = function(){};
dct.ITabContent.prototype.getClassName = function(){};




dct = dct || {};

dct.TabPanel = function(jQuery, dom)
{
    this.jQuery = jQuery;
    this._tabs = new Array();
    this._buttons = new Array();
    this._dom = jQuery(dom);
    this._tabDom = this._dom.find(".tabButtons");

    this._location = $(this._dom).find('meta[name=location]').attr('content');
    this._type = $(this._dom).find('meta[name=type]').attr('content');
    this._property = $(this._dom).find('meta[name=property]').attr('content');
    this._description = $(this._dom).find('meta[name=description]').attr('content');
};

dct.TabPanel.constructor = dct.TabPanel;
dct.TabPanel.prototype.jQuery = null;
dct.TabPanel.prototype._tabs = null;
dct.TabPanel.prototype._buttons = null;
dct.TabPanel.prototype._currentTab = null;
dct.TabPanel.prototype._dom = null;
dct.TabPanel.prototype._tabDom = null;
dct.TabPanel.prototype._currentButton = null;
dct.TabPanel.prototype._location = null;
dct.TabPanel.prototype._type = null;
dct.TabPanel.prototype._property = null;
dct.TabPanel.prototype._description = null;

dct.TabPanel.prototype.addTabContent = function(tab)
{
    this._tabs.push(tab);
    this.createButton(tab);

    if(this._tabs.length == 1)
    {
        this.setCurrentTab(tab);
    }
    else
    {
        tab.deactivate();
    }
};

dct.TabPanel.prototype.setCurrentTab = function(tab)
{

    for (var i = 0; i < this._tabs.length; i++){
        this._tabs[i].deactivate();
    }

    tab.activate();
    this._currentTab = tab;
};

dct.TabPanel.prototype.getCurrentTab = function()
{
    return this._currentTab;
};

dct.TabPanel.prototype.createButton = function(tab)
{
    var divTag = document.createElement( 'div' );
    divTag.className = "tabButton " + tab.getClassName();
    this._tabDom.append(divTag);
    var divElement = this.jQuery(divTag);

    $(divElement).attr('data-linkposition', this._location + "/" + this._type);
    $(divElement).attr('data-linkname', this._location + "/" + this._type + "/" + this._property + "/tab-" + tab.getClassName() + "/" + this._description);
    divElement.append("<span>" + tab.getName() + "</span>");

    this._buttons.push(divElement);

    divElement.addClass("last");

    var that = this;
    divTag.onclick = function()
    {
        that.onClickTab(tab);
        for (var i = 0; i < that._buttons.length; i++) {
            that._buttons[i].removeClass("selected");
        }
        that._currentButton = divElement;
        that._currentButton.addClass("selected");
    }

    if(this._buttons.length == 1)
    {
        divElement.addClass("first");
        divElement.addClass("selected");
        this._currentButton = divElement;
    }
    else
    {
        this.jQuery(this._buttons[this._buttons.length - 2]).removeClass("last");
    }
};

dct.TabPanel.prototype.onClickTab = function(tab)
{
    this.setCurrentTab(tab);
}



var dct = dct || {};
dct.service = dct.service || {};
dct.service.staf = dct.service.staf || {};
dct.service.staf.ISendToAFriendService = function() {
};
dct.service.staf.ISendToAFriendService.prototype.sendToAFriend = function() {
};
dct.service.staf.SendToAFriendType = {};
dct.service.staf.SendToAFriendType.GAME = "game";
dct.service.staf.SendToAFriendType.VIDEO = "video";
dct.service.staf.SendToAFriendError = {};
dct.service.staf.SendToAFriendError.BAD_WORD = "error.badword";
dct.service.staf.SendToAFriendError.NOT_AUTHENTICATED = "error.notAuthenticated";
dct.service.staf.SendToAFriendError.NOT_ACCEPTED = "error.notAccepted";
dct.service.staf.SendToAFriendError.INVALID_EMAIL = "error.invalidEmail";
dct.service.staf.SendToAFriendError.SEND_FAILURE = "error.emailSendingFailure";
dct.service.staf.SendToAFriendError.GUEST_NAME_MAX_SIZE_EXCEEDED = "error.maxSize.guestName";
dct.service.staf.SendToAFriendError.FRIEND_NAME_MAX_SIZE_EXCEEDED = "error.maxSize.friendName";
dct.service.staf.SendToAFriendError.GUEST_NAME_EMPTY = "error.required.guestName";
dct.service.staf.SendToAFriendError.FRIEND_NAME_EMPTY = "error.required.friendName";
dct.service.staf.SendToAFriendError.FRIEND_EMAIL_EMPTY = "error.required.friendEmail";
dct.service.staf.SendToAFriendRequest = function(a, b, d, e, c) {
  this.guestName = a;
  this.friendName = b;
  this.friendEmail = d;
  this.contentType = e;
  this.contentPath = c;
  this._validateArguments();
  this.request = this._createRequest();
  var f = this;
  this.request.onreadystatechange = function() {
    f._handleReadyStateChange()
  }
};
dct.service.staf.SendToAFriendRequest.constructor = dct.service.staf.SendToAFriendRequest;
dct.service.staf.SendToAFriendRequest.baseUrl = null;
dct.service.staf.SendToAFriendRequest.prototype.guestName = null;
dct.service.staf.SendToAFriendRequest.prototype.friendName = null;
dct.service.staf.SendToAFriendRequest.prototype.friendEmail = null;
dct.service.staf.SendToAFriendRequest.prototype.link = null;
dct.service.staf.SendToAFriendRequest.prototype.request = null;
dct.service.staf.SendToAFriendRequest.prototype._method = "POST";
dct.service.staf.SendToAFriendRequest.prototype._successCallback = null;
dct.service.staf.SendToAFriendRequest.prototype._errorCallback = null;
dct.service.staf.SendToAFriendRequest.prototype._validateArguments = function() {
  if(!this.contentPath) {
    throw Error("Invalid content path");
  }
  var a = !1, b;
  for(b in dct.service.staf.SendToAFriendType) {
    if(this.contentType == dct.service.staf.SendToAFriendType[b]) {
      a = !0;
      break
    }
  }
  if(!a) {
    throw Error("Invalid content type used - must be a valid dct.service.staf.SendToAFriendType type");
  }
};
dct.service.staf.SendToAFriendRequest.prototype._createUrl = function() {
  return!dct.service.staf.SendToAFriendRequest.baseUrl ? null : dct.service.staf.SendToAFriendRequest.baseUrl
};
dct.service.staf.SendToAFriendRequest.prototype._createData = function() {
  var a = [];
  a.push("guestName=" + this.guestName);
  a.push("friendName=" + this.friendName);
  a.push("friendEmail=" + this.friendEmail);
  a.push("contentType=" + this.contentType);
  a.push("contentId=" + this.contentPath);
  return a.join("&")
};
dct.service.staf.SendToAFriendRequest.prototype._createRequest = function() {
  return new XMLHttpRequest
};
dct.service.staf.SendToAFriendRequest.prototype._handleReadyStateChange = function() {
  this.request && !(4 > this.request.readyState) && (200 <= this.request.status && 400 >= this.request.status ? this.parseResponse(this.request.responseXML) : this._error("Request failed"))
};
dct.service.staf.SendToAFriendRequest.prototype.parseResponse = function(a) {
  a || this._error("Invalid response");
  var b = a.getElementsByTagName("error");
  if(b && 0 < b.length) {
    this._error(b[0].firstChild.data)
  }else {
    a = a.getElementsByTagName("status");
    b = null;
    if(a && 0 < a.length) {
      b = a[0].firstChild.data
    }
    "OK" == b ? this._success() : this._error("Invalid status")
  }
};
dct.service.staf.SendToAFriendRequest.prototype.handleSuccessWith = function(a) {
  this._successCallback = a;
  return this
};
dct.service.staf.SendToAFriendRequest.prototype.handleErrorWith = function(a) {
  this._errorCallback = a;
  return this
};
dct.service.staf.SendToAFriendRequest.prototype.send = function() {
  var a = this._createUrl();
  if(!a) {
    throw Error("Invalid URL");
  }
  this.request.open(this._method, a, !0);
  "GET" == this._method ? this.request.send() : (this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), this.request.send(this._createData()));
  return this
};
dct.service.staf.SendToAFriendRequest.prototype.abort = function() {
  this.request.abort()
};
dct.service.staf.SendToAFriendRequest.prototype._success = function() {
  this._successCallback && this._successCallback(this)
};
dct.service.staf.SendToAFriendRequest.prototype._error = function(a) {
  this._errorCallback && this._errorCallback(this, a)
};
dct.service.staf.SendToAFriendService = function() {
};
dct.service.staf.SendToAFriendService.constructor = dct.service.staf.SendToAFriendService;
dct.service.staf.SendToAFriendService.prototype.sendToAFriend = function(a, b, d, e, c) {
  "/" == c.substring(0, 1) && (c = c.replace("/", ""));
  return new dct.service.staf.SendToAFriendRequest(a, b, d, e, c)
};

var dct = dct || {};
dct.service = dct.service || {};
dct.service.poll = dct.service.poll || {};
dct.service.poll.IPollService = function() {
};
dct.service.poll.IPollService.prototype.vote = function() {
};
dct.service.AbstractRequest = function() {
};
dct.service.AbstractRequest.constructor = dct.service.AbstractRequest;
dct.service.AbstractRequest.prototype.method = "GET";
dct.service.AbstractRequest.prototype.successCallback = null;
dct.service.AbstractRequest.prototype.errorCallback = null;
dct.service.AbstractRequest.prototype.createRequest = function() {
  return new XMLHttpRequest
};
dct.service.AbstractRequest.prototype.handleReadyStateChange = function() {
  if(this.request && !(4 > this.request.readyState)) {
    200 <= this.request.status && 400 >= this.request.status ? (this.response = this.request.responseXML && null != this.request.responseXML && null != this.request.responseXML.firstChild ? this.parseResponse(this.request.responseXML) : this.parseResponse(this.request.responseText), this.success()) : this.error("Request failed")
  }
};
dct.service.AbstractRequest.prototype.createUrl = function() {
};
dct.service.AbstractRequest.prototype.parseResponse = function() {
};
dct.service.AbstractRequest.prototype.handleSuccessWith = function(a) {
  this.successCallback = a;
  return this
};
dct.service.AbstractRequest.prototype.handleErrorWith = function(a) {
  this.errorCallback = a;
  return this
};
dct.service.AbstractRequest.prototype.send = function() {
  var a = this.createUrl();
  if(!a) {
    throw Error("Invalid URL");
  }
  var b = this;
  this.request = this.createRequest();
  this.request.onreadystatechange = function() {
    b.handleReadyStateChange()
  };
  this.request.open(this.method, a, !0);
  "GET" == this.method ? this.request.send() : (this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), this.request.send(this.createData()));
  return this
};
dct.service.AbstractRequest.prototype.abort = function() {
  this.request.abort()
};
dct.service.AbstractRequest.prototype.success = function() {
  this.successCallback && this.successCallback(this)
};
dct.service.AbstractRequest.prototype.error = function(a) {
  this.errorCallback && this.errorCallback(this, a)
};
dct.service.poll.PollRequest = function(a, b, c, d) {
  this.url = a;
  this.siteCode = b;
  this.pollId = c;
  this.choiceId = d
};
dct.service.poll.PollRequest.constructor = dct.service.poll.PollRequest;
dct.service.poll.PollRequest.prototype = new dct.service.AbstractRequest;
$.extend(dct.service.poll.PollRequest, dct.service.AbstractRequest);
dct.service.poll.PollRequest.prototype.createUrl = function() {
  return this.url
};
dct.service.poll.PollRequest.prototype.setUrl = function(a) {
  this.url = a
};
dct.service.poll.PollRequest.prototype.createData = function() {
  var a = [];
  a.push("siteCode=" + this.siteCode);
  a.push("Q1=" + this.choiceId);
  a.push("def=" + this.pollId);
  a.push("ds=" + Math.round((new Date).getTime()));
  a.push("pass=1");
  return a.join("&")
};
dct.service.poll.PollRequest.prototype.parseResponse = function(a) {
  for(var b = {}, c = 0, a = a.getElementsByTagName("choice"), d = 0;d < a.length;d++) {
    var e = {};
    e.votes = parseInt(a[d].getAttribute("votes"), 10);
    e.percent = parseFloat(a[d].getAttribute("percent"));
    c += e.votes;
    b["choice" + d] = e
  }
  b.totalVotes = c;
  return b
};
dct.service.poll.PollService = function(a) {
  this.siteCode = a
};
dct.service.poll.PollService.constructor = dct.service.poll.PollService;
dct.service.poll.PollService.prototype.baseUrl = null;
dct.service.poll.PollService.prototype.vote = function(a, b) {
  var c = new dct.service.poll.PollRequest(this.baseUrl, "US%2EEN%2EDIS", a, b), d = c.createData();
  c.setUrl(c.createUrl() + "?" + d);
  c.method = "POST";
  return c.send()
};
dct = dct || {};
dct.modules = dct.modules || {};
dct.modules.poll = dct.modules.poll || {};
dct.modules.poll.IPollModule = function() {
};
dct.modules.poll.IPollModule.prototype.getPollId = function() {
};
dct.modules.poll.IPollModule.prototype.getState = function() {
};
dct.modules.poll.IPollModule.prototype.setState = function() {
};
dct.modules.poll.IPollModule.prototype.getSelectedChoice = function() {
};
dct.modules.poll.IPollModule.prototype.setSelectedChoice = function() {
};
dct.modules.poll.PollModule = function(a, b) {
  if(isNaN(parseInt(a, 10))) {
    throw Error("pollId must be a number");
  }
  this._pollId = parseInt(a, 10);
  b ? this.setState(b.toString()) : this.setState("vote")
};
dct.modules.poll.PollModule.constructor = dct.modules.poll.PollModule;
dct.modules.poll.PollModule.prototype.getPollId = function() {
  return this._pollId
};
dct.modules.poll.PollModule.prototype.getState = function() {
  return this._state
};
dct.modules.poll.PollModule.prototype.setState = function(a) {
  if(a) {
    this._state = a
  }
};
dct.modules.poll.PollModule.prototype.getSelectedChoice = function() {
  return this._selectedChoice
};
dct.modules.poll.PollModule.prototype.setSelectedChoice = function(a) {
  this._selectedChoice = a
};
dct.modules.poll.IChoiceView = function() {
};
dct.modules.poll.IChoiceView.prototype.getId = function() {
};
dct.modules.poll.IChoiceView.prototype.getTextElement = function() {
};
dct.modules.poll.IChoiceView.prototype.getSelectionElement = function() {
};
dct.modules.poll.IChoiceView.prototype.getImageElement = function() {
};
dct.modules.poll.IChoiceView.prototype.checked = function() {
};
dct.modules.poll.IChoiceView.prototype.getResultElement = function() {
};
dct.modules.poll.IChoiceView.prototype.getResultText = function() {
};
dct.modules.poll.ChoiceView = function(a, b) {
  this._dom = a;
  this._jq = b;
  this._imageElement = this._selectionElement = this._textElement = null;
  var c = this._jq(this._dom).find("meta[name=choiceId]").attr("content");
  if(isNaN(parseInt(c, 10))) {
    throw Error("Could not find a meta element with name 'choiceId'");
  }
  this._id = parseInt(c, 10);
  var d = this;
  this._jq(this.getSelectionElement()).click(function() {
    d._jq(d).trigger("select")
  });
  var e = "";
  this._jq(this._dom).find("label").click(function() {
    e = d._jq(this).attr("for");
    d._jq(d._dom).find("#" + e).click()
  })
};
dct.modules.poll.ChoiceView.prototype.getId = function() {
  return this._id
};
dct.modules.poll.ChoiceView.prototype.getTextElement = function() {
  if(!this._textElement) {
    var a = this._jq(this._dom).find(".text");
    if(0 < a.length) {
      this._textElement = a.get(0)
    }
  }
  return this._textElement
};
dct.modules.poll.ChoiceView.prototype.checked = function() {
  return this.getSelectionElement().checked ? !0 : !1
};
dct.modules.poll.ChoiceView.prototype.getSelectionElement = function() {
  if(!this._selectionElement) {
    var a = this._jq(this._dom).find("input");
    if(0 < a.length) {
      this._selectionElement = a.get(0)
    }
  }
  return this._selectionElement
};
dct.modules.poll.ChoiceView.prototype.getImageElement = function() {
  if(!this._imageElement) {
    var a = this._jq(this._dom).find("img.choiceImg");
    if(0 < a.length) {
      this._imageElement = a.get(0)
    }
  }
  return this._imageElement
};
dct.modules.poll.ChoiceView.prototype.getResultElement = function() {
  var a = this._jq(this._dom).find(".pollPercentageLine"), b = null;
  0 < a.length && (b = a.get(0));
  return b
};
dct.modules.poll.ChoiceView.prototype.getResultText = function() {
  var a = this._jq(this._dom).find(".pollResultDiv .text"), b = null;
  0 < a.length && (b = a.get(0));
  return b
};
dct.modules.poll.ChoiceView.prototype.setWidth = function() {
  this._jq(this._dom).find(".pollPercentageLine").addClass("visible")
};
dct.modules.poll.IPollModuleView = function() {
};
dct.modules.poll.IPollModuleView.prototype.getModuleDOM = function() {
};
dct.modules.poll.IPollModuleView.prototype.getTotalVotes = function() {
};
dct.modules.poll.IPollModuleView.prototype.getSubmitButton = function() {
};
dct.modules.poll.IPollModuleView.prototype.getWaitAnimation = function() {
};
dct.modules.poll.IPollModuleView.prototype.getChoices = function() {
};
dct.modules.poll.PollModuleView = function(a, b) {
  this.jq = b;
  this.dom = a
};
dct.modules.poll.PollModuleView.prototype.getModuleDOM = function() {
  return this.dom
};
dct.modules.poll.PollModuleView.prototype.getTotalVotes = function() {
  var a = this.jq(this.dom).find(".totalVotes"), b = null;
  a && 1 <= a.length && (b = a.get(0));
  return b
};
dct.modules.poll.PollModuleView.prototype.getSubmitButton = function() {
  var a = this.jq(this.dom).find(".submit"), b = null;
  a && 1 <= a.length && (b = a.get(0));
  return b
};
dct.modules.poll.PollModuleView.prototype.getWaitAnimation = function() {
  var a = this.jq(this.dom).find(".waiting"), b = null;
  a && 1 <= a.length && (b = a.get(0));
  return b
};
dct.modules.poll.PollModuleView.prototype.getChoices = function() {
  return this._choices ? this._choices : this._choices = this.createChoices()
};
dct.modules.poll.PollModuleView.prototype.createChoices = function() {
  var a = this.jq(this.dom).find(".choice"), b = [];
  if(a) {
    for(var c = 0;c < a.length;c++) {
      var d = a[c], e = null;
      try {
        e = new dct.modules.poll.ChoiceView(d, this.jq)
      }catch(f) {
      }
      e && b.push(e)
    }
  }
  return b
};
dct.modules.poll.IPollModuleController = function() {
};
dct.modules.poll.IPollModuleController.prototype.getView = function() {
};
dct.modules.poll.IPollModuleController.prototype.getPollModule = function() {
};
dct.modules.poll.PollModuleController = function(a, b, c, d) {
  this._module = a;
  this._view = b;
  this._pollService = c;
  this._jq = d;
  var e = this;
  if(this._view.getSubmitButton()) {
    this._view.getSubmitButton().onclick = function() {
      e.handleSubmit()
    }
  }
  if(a = this._view.getChoices()) {
    for(b = 0;b < a.length;b++) {
      this._jq(a[b]).bind("select", function(a) {
        e.handleChoiceChange(a)
      }), a[b].checked() && (this.getPollModule().setSelectedChoice(a[b]), this._jq(a[b]._dom).addClass("selected"), this._jq(this.getView().getSubmitButton()).removeClass("disabled"))
    }
  }
  null == this.getPollModule().getSelectedChoice() && (this.getView().getSubmitButton().setAttribute("disabled", "disabled"), this._jq(this.getView().getSubmitButton()).addClass("disabled"))
};
dct.modules.poll.PollModuleController.prototype.getView = function() {
  return this._view
};
dct.modules.poll.PollModuleController.prototype.getPollModule = function() {
  return this._module
};
dct.modules.poll.PollModuleController.prototype.handleChoiceChange = function(a) {
  var b = this.getPollModule().getSelectedChoice();
  b && this._jq(b._dom).removeClass("selected");
  this._jq(a.target._dom).addClass("selected");
  this.getPollModule().setSelectedChoice(a.target);
  this._jq(this.getView().getSubmitButton()).removeClass("disabled");
  this.getView().getSubmitButton().removeAttribute("disabled")
};
dct.modules.poll.PollModuleController.prototype.handleSubmit = function() {
  this.setState("submit");
  var a = this, b = function(b) {
    a.handleVoteResponse(b)
  }, c = this.getPollModule().getPollId(), d = this.getPollModule().getSelectedChoice().getId();
  this._pollService.vote(c, d).handleSuccessWith(b).handleErrorWith(b)
};
dct.modules.poll.PollModuleController.prototype.handleVoteResponse = function(a) {
  var b = this.getView().getTotalVotes();
  if(b) {
    b.innerHTML = a.response.totalVotes
  }
  if(b = this.getView().getChoices()) {
    for(var c = 0;c < b.length;c++) {
      var d = b[c].getResultElement();
      if(d) {
        var e = Math.round(Math.max(81 * (a.response["choice" + c].percent / 100), 14)) + 20;
        this._jq(d).animate({width:e}, 500)
      }
      if(d = b[c].getResultText()) {
        d.innerHTML = a.response["choice" + c].percent + "%"
      }
      this._jq(b[c]).unbind("select")
    }
  }
  this.setState("results")
};
dct.modules.poll.PollModuleController.prototype.setState = function(a) {
  switch(a) {
    case "submit":
      this._jq(this.getView().getModuleDOM()).removeClass("vote");
      this._jq(this.getView().getModuleDOM()).removeClass("results");
      this._jq(this.getView().getModuleDOM()).addClass("submit");
      break;
    case "vote":
      this._jq(this.getView().getModuleDOM()).removeClass("submit");
      this._jq(this.getView().getModuleDOM()).removeClass("results");
      this._jq(this.getView().getModuleDOM()).addClass("vote");
      break;
    case "results":
      this._jq(this.getView().getModuleDOM()).removeClass("submit"), this._jq(this.getView().getModuleDOM()).removeClass("vote"), this._jq(this.getView().getModuleDOM()).addClass("results")
  }
};

//fgnass.github.com/spin.js#v1.2.5
/**
 * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
 * Licensed under the MIT license
 */
(function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);
var dct = dct || {};
dct.service = dct.service || {};
dct.service.feed = dct.service.feed || {};

/**
 * @interface
 */
dct.service.feed.IFeedService = function() {};

/**
 * @param {number} offset The number (zero-based) of the first feed item to return
 * @return {null} Doesn't return anything directly, but triggers an appropriate callback based on whether the request was successful or not.
 */
dct.service.feed.IFeedService.prototype.getMore = function(offset, feedName) {};



/**
 * @implements {dct.service.feed.IFeedService}
 * @constructor
 */

dct.service.feed.FeedService = function()
{
};

dct.service.feed.FeedService.constructor = dct.service.feed.FeedService;
dct.service.feed.FeedService.baseUrl = null;


dct.service.feed.FeedService.prototype.getMore = function(offset, feedName, limit)
{
    var req = new dct.service.feed.FeedRequest(this.baseUrl);
    if (!(offset === undefined)) {
        req.setOffset(offset);
    }
    if (!(feedName === undefined)) {
        req.setFeedName(feedName);
    }
    if (!(limit === undefined)) {
        req.setFeedLimit(limit);
    }
    return req;
};


/**
 * @constructor
 */
dct.service.feed.FeedRequest = function(baseurl)
{
    this.baseurl = baseurl;
    this.offset = 0;
    this.template = "";
    this.feedName = "";
    this.feedLimit = "";
};


dct.service.feed.FeedRequest.constructor = dct.service.feed.FeedRequest;
dct.service.feed.FeedRequest.prototype = new dct.service.AbstractRequest();

$.extend(dct.service.feed.FeedRequest, dct.service.AbstractRequest);

dct.service.feed.FeedRequest.prototype.setFeedName = function(feedName)
{
    this.feedName = feedName;
}

dct.service.feed.FeedRequest.prototype.setOffset = function(offset)
{
    this.offset = offset;
}

dct.service.feed.FeedRequest.prototype.setFeedLimit = function(feedLimit)
{
    this.feedLimit = feedLimit;
}

dct.service.feed.FeedRequest.prototype.setTemplate = function(template)
{
    this.template = template;
}


dct.service.feed.FeedRequest.prototype.createQueryString = function()
{

    var fullUrl = "offset=" + this.offset + "&limit=" + this.feedLimit;
    if (this.template != "")
    {
        fullUrl = fullUrl + "&template=" + this.template;
    }
    return fullUrl;

};

dct.service.feed.FeedRequest.prototype.createUrl = function()
{
    var url = this.baseurl + this.feedName + "?" + this.createQueryString();
    return url;
}


dct.service.feed.FeedRequest.prototype.parseResponse = function(data)
{
     return data;
}




var dct = dct || {};

dct.ApplicationContext = function()
{
    this.pool = {};
    this.delayed = {};
    this.config = {};
};



/**
 * Adds an instance to the context of the specified type.
 * Typically, the type should be an interface implemented by the instance such that clients retrieving
 * instances from the app context need only be aware of the interface they're dealing with and not a
 * concrete implementation.
 *
 * If more than one instance of a given type is added, the last instance added will be used and the
 * previous reference will be overwritten.
 *
 * @param instance       The object you want to add to the context. Must extend or implement <code>type</code>.
 * @param type           The Class that you want to register the object against.
 */
dct.ApplicationContext.prototype.addInstanceByType = function(instance, type)
{
    if(instance == null)  throw new Error("instance cannot be null");
    if(type == null)  throw new Error("type cannot be null");


    this.pool[type] = instance;
};

dct.ApplicationContext.prototype.addDelayedInstanceByType = function(factory, type) {
    if(factory == null)  throw new Error("factory cannot be null");
    if(type == null)  throw new Error("type cannot be null");
    
    this.delayed[type] = factory;
};


/**
 * Retreives an object registered as the specified type.
 * If the context does not have an object of the type requested, it will return <code>null</code>.
 *
 * @param type The Class that was used to register an object
 * @returns An object of the type requested if available, <code>null</code> otherwise.
 */
dct.ApplicationContext.prototype.getInstanceByType = function(type)
{   
    var instance = this.pool[type];
    if(!instance && this.delayed[type]) {
        instance = this.pool[type] = this.delayed[type](this);
    }
    return instance || null;
};

dct.ApplicationContext.prototype.setConfig = function(key, value)
{
    this.config[key] = value;
};

dct.ApplicationContext.prototype.getConfig = function(key, value)
{
    return this.config[key] || null;
};

var appContext = new dct.ApplicationContext();

// Configure a Send To A Friend service
var sendToAFriendService = new dct.service.staf.SendToAFriendService();
dct.service.staf.SendToAFriendRequest.baseUrl = "/disneychannel/staf/sendStaf.php";

appContext.addInstanceByType(sendToAFriendService, 'dct.service.staf.ISendToAFriendService');
appContext.addInstanceByType(PubSub, 'PubSub');

// Configure feed service
var feedService = new dct.service.feed.FeedService();
feedService.baseUrl = "/disneychannel/api/feed/";
appContext.addInstanceByType(feedService, 'dct.service.feed.IFeedService');

// Configure poll service
var pollService = new dct.service.poll.PollService("US.EN.DCH");
pollService.baseUrl = '/disneychannel/polls/sendVote.php';
appContext.addInstanceByType(pollService, 'dct.service.poll.IPollService');

// Configure comscore tracking value
var comscoreUrl = "/disneychannel/comscore.xml";

// Configure Like button
var likeButtonAppId = "disneychannel.com";

$("body").delegate(".moreSubmitButton", "mouseover", function() {

            $(this).css("cursor", "pointer");
});


$("body").delegate(".moreSubmitButton", "click", function() {

    var sendFields = $(this).siblings('.sendFields');

    var successLayer = $(this).siblings('.successLayer');

    var sendFromName = sendFields.find('.stafGuestName');
    var sendToName = sendFields.find('.stafFriendName');
    var sendToEmail = sendFields.find('.stafFriendEmail');
    var contentType = sendFields.find('.contentType');
    var contentUrl = sendFields.find('.contentUrl');


    var stafService = appContext.getInstanceByType('dct.service.staf.ISendToAFriendService');
    stafService.sendToAFriend(sendFromName.val(), sendToName.val(), sendToEmail.val(), contentType.val(), contentUrl.val())
        .handleSuccessWith(handleStafSuccess)
        .handleErrorWith(handleStafError)
        .send();



    function handleStafSuccess(response)
    {
        successLayer.fadeIn("fast");
        sendFromName.val("Your first name (20 characters max)");
        sendToName.val("Your friend's first name (20 characters max)");
        sendToEmail.val("Your friend's email address");
    }


    var messageBus = appContext.getInstanceByType('PubSub');
    function handleStafError(response, errorText)
    {
        messageBus.publish("pause");
        $("#errorPopup").fadeIn("fast");
    }
});


$("body").delegate(".tryAgain", "click", function() {
    var messageBus = appContext.getInstanceByType('PubSub');
    messageBus.publish("resume");
	$("#errorPopup").fadeOut("fast");
});

$("body").delegate(".successLayer", "click", function() {
    var messageBus = appContext.getInstanceByType('PubSub');
    messageBus.publish("resume");

    $('.successLayer').fadeOut("fast");
});

/**
 * Creates a new dct.FeaturedModuleController object that handles changes in the featured module.
 *
 * @param featuredModuleView A FeaturedModuleView object.
 * @param timeDelay (optional) How long (in milliseconds) to pause before advancing to the next image
 * @constructor
 */

dct.FeaturedModuleController = function(featuredModuleView, theTimeDelay) {
    this.view = featuredModuleView;

    dct.FeaturedModuleController.DEFAULT_TIMEDELAY = 6000;

    if (theTimeDelay) {
        this.timeDelay = theTimeDelay;
    } else {
        this.timeDelay = dct.FeaturedModuleController.DEFAULT_TIMEDELAY;
    }
    this.currentThumbnail = 0;
    this.intervalTimerReference = null;
    var theDiv = featuredModuleView.theDiv;


    // add listeners
    this.thumbnailListItems = $(theDiv).find("li");
    this.thumbnails = $(this.thumbnailListItems).find("img");
    if(this.thumbnails && this.thumbnails.length > 0) {
        var that = this;
        for (var i = 0; i < this.thumbnails.length; i++) {
            this.thumbnails[i].onclick = function(e) {
                that.handleClick(this)};
        };
    };
    this.startTimer(this.timeDelay);
};

/*
*  Fired when the user clicks on a thumbnail
*/
dct.FeaturedModuleController.prototype.handleClick = function(theThumbnail) {
    this.stopTimer();
    this.updateMainImage(theThumbnail);
    this.view.setThumbnailBackgroundsAfterClick(theThumbnail);
};

/*
*  Starts the automatic flip of the main image at set intervals. Called in the constructor.
*  We store a reference to the setInterval() call in intervalTimerReference. That will
*  later be used when we want to stop the auto advancing.
*/
dct.FeaturedModuleController.prototype.startTimer = function(timeDelay) {
    this.intervalTimerReference = setInterval(this.advanceImage, timeDelay);
};


/*
* Function that stops the timer. Called by handleClick().
*/
dct.FeaturedModuleController.prototype.stopTimer = function() {
    clearInterval(this.intervalTimerReference);
};



/*
* Function that updates the main image, text, and link. It's called by
* handleClick() and by advanceImage().
* @param theThumbnail The thumbnail that the user clicked on.
*/
dct.FeaturedModuleController.prototype.updateMainImage = function(theThumbnail) {
    this.view.setMainTitleAndLink(theThumbnail.title, $(theThumbnail).attr("data-url"), $(theThumbnail).attr("data-linkposition"), $(theThumbnail).attr("data-linkname"));
    this.view.setMainDescription(theThumbnail.alt, $(theThumbnail).attr("data-url"), $(theThumbnail).attr("data-linkposition"), $(theThumbnail).attr("data-linkname"),$(theThumbnail).attr("data-cta"));
    this.view.setMainImageSource(theThumbnail.src.replace('115x65', '300x169').replace('width/115/height/65', 'width/300/height/169'));
    this.view.setMainImageAltText(theThumbnail.alt);
    this.view.setMainImageLink($(theThumbnail).attr("data-url"), $(theThumbnail).attr("data-linkposition"), $(theThumbnail).attr("data-linkname"));
    this.view.setThumbnailBackgrounds();
    this.view.setMainOverlay($(theThumbnail).attr("data-overlay"));
}

/*
* Function that automatically advances the main image. It's called by the
* setInterval() function inside of startTimer.
*/
dct.FeaturedModuleController.prototype.advanceImage = function() {
    var theCurrentThumbnail = dct.FeaturedModuleController.currentThumbnail;
    var arrayLength = dct.FeaturedModuleController.thumbnails.length;
    if (theCurrentThumbnail < arrayLength - 1) {
        theCurrentThumbnail++;
    } else {
        theCurrentThumbnail = 0;
    }
    dct.FeaturedModuleController.updateMainImage(dct.FeaturedModuleController.thumbnails[theCurrentThumbnail]);
    dct.FeaturedModuleController.currentThumbnail = theCurrentThumbnail;
};


/**
 * Creates a new FeaturedModuleView object to handle interactive changes to the featured module.
 *
 * @param theFeaturedModule A JQuery object holding the featured content div.
 * @constructor
 */

// View
dct.FeaturedModuleView = function(theFeaturedModule) {
    this.theDiv = theFeaturedModule;
};


// Getters
//TODO Chris sez: some of these getters need to be updated to stay in sync with changes to the setters.
dct.FeaturedModuleView.prototype.getMainTitle = function() {
    var theMainTitle  = $(this.theDiv).find("h2");
    return theMainTitle.text();
};

dct.FeaturedModuleView.prototype.getMainDescription = function() {
    var theDescriptionDiv = $(this.theDiv).find("p");
    return theDescriptionDiv.text();
};

dct.FeaturedModuleView.prototype.getMainImageSource = function() {
    var theMainImage = $(this.theDiv).find("#mainFeaturedImage");
    return $(theMainImage).attr("src");
};

dct.FeaturedModuleView.prototype.getMainImageAltText = function() {
    var theMainImage = $(this.theDiv).find("#mainFeaturedImage");
    return $(theMainImage).attr("alt");
};

dct.FeaturedModuleView.prototype.getMainImageLink = function() {
    var theMainImageLink = $(this.theDiv).find("#MainFeaturedImageLink");
    $(theMainImage).attr("href",theAltText);
};

dct.FeaturedModuleView.prototype.getMainOverlay = function() {
    var theMainOverlayDiv = $(this.theDiv).find("#featureOverlay");
    return $(theMainOverlayDiv).attr("class");
};


// Setters
dct.FeaturedModuleView.prototype.setMainTitleAndLink = function(theTitle, theURL, linkPos, linkId) {
    var theHeadlineTitleAndLink = $(this.theDiv).find("h2 a");
    $(theHeadlineTitleAndLink).text(theTitle);
    $(theHeadlineTitleAndLink).attr("href",theURL);
    $(theHeadlineTitleAndLink).attr("data-linkposition",linkPos);
    var linkIdParts = linkId.split("/");
    linkIdParts[3] = "title";
    $(theHeadlineTitleAndLink).attr("data-linkname", linkIdParts.join("/"));

};

dct.FeaturedModuleView.prototype.setMainDescription = function(theDescription, theURL, linkPos, linkId, ctamessage) {
    var theDescriptionSpan = $(this.theDiv).find("span.description");
    $(theDescriptionSpan).text(theDescription);
    var moreSpanLink = $(this.theDiv).find("span.now a");
    $(moreSpanLink).attr("href",theURL);
    $(moreSpanLink).attr("data-linkposition",linkPos);
    var linkIdParts = linkId.split("/");
    linkIdParts[3] = "cta";
    $(moreSpanLink).attr("data-linkname", linkIdParts.join("/"));
    //check if ctamessage was passes
    if(typeof(ctamessage) != 'undefined' && ctamessage != null)
    {
    	 $(moreSpanLink).text(ctamessage);
    }
   
};

dct.FeaturedModuleView.prototype.setMainImageSource = function(theImageURL) {
    var theMainImage = $(this.theDiv).find("#mainFeaturedImage");
    $(theMainImage).attr("src",theImageURL);
};

dct.FeaturedModuleView.prototype.setMainImageAltText = function(theAltText) {
    var theMainImage = $(this.theDiv).find("#mainFeaturedImage");
    $(theMainImage).attr("alt",theAltText);
};

dct.FeaturedModuleView.prototype.setMainImageLink = function(theImageLink, linkPos, linkId) {
    var theMainImageLink = $(this.theDiv).find("#MainFeaturedImageLink");
    $(theMainImageLink).attr("href",theImageLink);
    $(theMainImageLink).attr("data-linkposition",linkPos);
    var linkIdParts = linkId.split("/");
    linkIdParts[3] = "image";
    $(theMainImageLink).attr("data-linkname", linkIdParts.join("/"));
};

dct.FeaturedModuleView.prototype.setThumbnailBackgrounds = function() {
    var theCurrentThumbnail = dct.FeaturedModuleController.currentThumbnail;
    var thumbnailLength = dct.FeaturedModuleController.thumbnails.length;
    
    // Since this function is called before the current thumbnail counter is incremented,
    // advance the selected image here...
    theCurrentThumbnail++;
    if (theCurrentThumbnail == thumbnailLength) {
        theCurrentThumbnail = 0;
    }

    for (i = 0; i < thumbnailLength; i++) {
        var thisThumb = $(dct.FeaturedModuleController.thumbnails)[i];
        var thisThumbListItem = $(dct.FeaturedModuleController.thumbnailListItems)[i];
        if (i == theCurrentThumbnail) {
            $(thisThumb).addClass("current");
            $(thisThumbListItem).addClass("current");
        } else {
            $(thisThumb).removeClass("current");
            $(thisThumbListItem).removeClass("current");
        }
    }
};

dct.FeaturedModuleView.prototype.setMainOverlay = function(theOverlay) {
    var theMainOverlay = $(this.theDiv).find("#featureOverlay");
    $(theMainOverlay).removeClass().addClass(theOverlay);
};


/*
*  When the user clicks a thumbnail immediately turn all of them dark and then light
*  up the one they clicked on.
*/
dct.FeaturedModuleView.prototype.setThumbnailBackgroundsAfterClick = function(theThumbnail) {

    var thumbnailLength = dct.FeaturedModuleController.thumbnails.length;

    for (i = 0; i < thumbnailLength; i++) {
        var thisThumb = $(dct.FeaturedModuleController.thumbnails)[i];
        var thisThumbListItem = $(dct.FeaturedModuleController.thumbnailListItems)[i];
        $(thisThumb).removeClass("current");
        $(thisThumbListItem).removeClass("current");
    }
    $(theThumbnail).addClass("current");
    $(theThumbnail).parent().addClass("current");
};
/**
 * Creates the objects to control animation and click behavior of the featured module.
 *
 */



jQuery(document).ready(function() {
    theFeaturedModule = $("#featuredModule");
    if (theFeaturedModule.length > 0) {
        dct.featuredModule(theFeaturedModule[0]);
    }
});

dct.featuredModule = function(theFeaturedModule) {
    dct.FeaturedModuleView = new dct.FeaturedModuleView(theFeaturedModule);

    // To customize the amount of time between images, pass in an optional second parameter
    // specifying the delay time in milliseconds.
    dct.FeaturedModuleController = new dct.FeaturedModuleController(dct.FeaturedModuleView);
};



dct = dct || {};

// Create a null activity manager to pass into createModule for games play pages that do not require activities.
dct.NullActivityFactory = function(){};
dct.NullActivityFactory.constructor = new dct.NullActivityFactory();
dct.NullActivityFactory.prototype.createActivity = function(element)
{
    return null;
}
var dct = dct || {};
dct.modules = dct.modules || {};
dct.modules.gallery = dct.modules.gallery || {};
dct.modules.gallery.Gallery = function(a, b, c) {
  this._initializeModel(a);
  this._initializeCarousel(a, c, this._galleryModel.getMobile());
  this._initializeLightbox(a, b)
};
dct.modules.gallery.Gallery.prototype._initializeModel = function(a) {
  var b = [], c = !1;
  a.find("img").each(function(a, c) {
    var e = $(c), g = e.attr("alt"), h = e.attr("data-src"), k = parseInt(e.attr("width"), 10), l = parseInt(e.attr("height"), 10), i = e.data("alt-url"), m = parseInt(e.data("alt-width"), 10), n = parseInt(e.data("alt-height"), 10), j = e.attr("data-linkposition"), e = e.attr("data-linkname"), h = new dct.modules.gallery.Image(h, k, l, j, e), i = new dct.modules.gallery.Image(i, m, n, j, e), g = new dct.modules.gallery.GalleryItem(g, h, i);
    b.push(g)
  });
  a.hasClass("mobile") && (c = !0);
  this._galleryModel = new dct.modules.gallery.GalleryModel(b, c)
};
dct.modules.gallery.Gallery.prototype._initializeCarousel = function(a, b, c) {
  this._carouselStatusBarView = new dct.modules.gallery.StatusBarView(a.children(".caption-bar"));
  this._carouselStatusBarController = new dct.modules.gallery.StatusBarController(this._galleryModel, this._carouselStatusBarView);
  this._carouselView = new dct.modules.gallery.CarouselView(a.find(".gallery-box"), b, c);
  this._carouselController = new dct.modules.gallery.CarouselController(this._galleryModel, this._carouselView, this)
};
dct.modules.gallery.Gallery.prototype._initializeLightbox = function(a, b) {
  this._lightboxView = new dct.modules.gallery.LightboxView(a.find(".lightbox-container"), b);
  this._lightboxController = new dct.modules.gallery.LightboxController(this._galleryModel, this._lightboxView);
  this._lightboxStatusBarView = new dct.modules.gallery.StatusBarView(a.find(".lightbox .caption-bar"));
  this._lightboxStatusBarController = new dct.modules.gallery.StatusBarController(this._galleryModel, this._lightboxStatusBarView)
};
dct.modules.gallery.Gallery.prototype.showLightbox = function() {
  this._lightboxView.show()
};
dct.modules.gallery.GalleryItem = function(a, b, c) {
  this._caption = a;
  this._smallImage = b;
  this._largeImage = c
};
dct.modules.gallery.GalleryItem.prototype.getSmallImage = function() {
  return this._smallImage
};
dct.modules.gallery.GalleryItem.prototype.getLargeImage = function() {
  return this._largeImage
};
dct.modules.gallery.GalleryItem.prototype.getCaption = function() {
  return this._caption
};
dct.modules.gallery.GalleryModel = function(a, b) {
  this._galleryItems = a;
  this._listeners = [];
  this._count = a.length;
  this._index = 0;
  this._mobile = b
};
dct.modules.gallery.GalleryModel.prototype._getIndex = function(a) {
  return(this._count + this._index + a) % this._count
};
dct.modules.gallery.GalleryModel.prototype._dispatchChange = function() {
  for(var a = 0;a < this._listeners.length;a++) {
    this._listeners[a]()
  }
};
dct.modules.gallery.GalleryModel.prototype.moveNext = function() {
  this._index = this._getIndex(1);
  this._dispatchChange()
};
dct.modules.gallery.GalleryModel.prototype.movePrevious = function() {
  this._index = this._getIndex(-1);
  this._dispatchChange()
};
dct.modules.gallery.GalleryModel.prototype.getGalleryItemByIndex = function(a) {
  return this._galleryItems[this._getIndex(a)]
};
dct.modules.gallery.GalleryModel.prototype.getCurrent = function() {
  return this.getGalleryItemByIndex(0)
};
dct.modules.gallery.GalleryModel.prototype.getCount = function() {
  return this._count
};
dct.modules.gallery.GalleryModel.prototype.getIndex = function() {
  return this._index
};
dct.modules.gallery.GalleryModel.prototype.addChangeListener = function(a) {
  a && this._listeners.push(a)
};
dct.modules.gallery.GalleryModel.prototype.getItems = function() {
  return this._galleryItems.slice()
};
dct.modules.gallery.GalleryModel.prototype.getMobile = function() {
  return this._mobile
};
dct.modules.gallery.LightboxView = function(a, b) {
  this._$lightboxContainer = a;
  this._$lightbox = a.find(".lightbox");
  this._$lightboxPrev = a.find(".lightbox-prev");
  this._$lightboxNext = a.find(".lightbox-next");
  this._$window = b;
  this._leftListeners = [];
  this._rightListeners = [];
  this._closeListeners = [];
  this._initialized = this._visible = !1;
  this._currentImage = null
};
dct.modules.gallery.LightboxView.prototype._initialize = function() {
  function a() {
    var a = b._$window.height();
    b._$lightbox.css("top", (a - b._$lightbox.height()) / 2)
  }
  this._initialized = !0;
  this._$lightboxContainer.detach().appendTo("body");
  var b = this;
  this._$lightboxPrev.click(function() {
    b._dispatch(b._leftListeners)
  });
  this._$lightboxNext.click(function() {
    b._dispatch(b._rightListeners)
  });
  this._$lightboxContainer.click(function(a) {
    a.target === b._$lightboxContainer.get(0) && b._dispatch(b._closeListeners)
  });
  var c = this._$lightboxContainer.find(".lightbox-overlay");
  c.click(function(a) {
    a.target === c.get(0) && b._dispatch(b._closeListeners)
  });
  $(this._$window.get(0).document).keyup(function(a) {
    if(b._visible) {
      switch(a.which) {
        case 27:
          b._dispatch(b._closeListeners);
          break;
        case 37:
          b._dispatch(b._leftListeners);
          break;
        case 39:
          b._dispatch(b._rightListeners)
      }
    }
  });
  this._$window.resize(a);
  a()
};
dct.modules.gallery.LightboxView.prototype._dispatch = function(a) {
  for(var b = 0;b < a.length;b++) {
    a[b]()
  }
};
dct.modules.gallery.LightboxView.prototype.show = function() {
  if(!this._visible) {
    this._initialized || this._initialize(), this._visible = !0, this._$lightboxContainer.show(), this._currentImage && this.setImage(this._currentImage)
  }
};
dct.modules.gallery.LightboxView.prototype.hide = function() {
  if(this._visible) {
    this._visible = !1, this._$lightboxContainer.hide()
  }
};
dct.modules.gallery.LightboxView.prototype.setImage = function(a) {
  this._currentImage = a;
  if(this._visible) {
    var b = this._$lightbox.find(".lightbox-image-container");
    b.fadeOut(100, function() {
      b.empty();
      var c = $("<img/>");
      c.attr("width", a.getWidth());
      c.attr("height", a.getHeight());
      c.css("width", a.getWidth() + "px");
      c.css("height", a.getHeight() + "px");
      c.attr("src", a.getUrl());
      c.css("margin-top", (b.height() - a.getHeight()) / 2);
      b.append(c);
      b.fadeIn(100)
    })
  }
};
dct.modules.gallery.LightboxView.prototype.addNavigateLeftListener = function(a) {
  a && this._leftListeners.push(a)
};
dct.modules.gallery.LightboxView.prototype.addNavigateRightListener = function(a) {
  a && this._rightListeners.push(a)
};
dct.modules.gallery.LightboxView.prototype.addCloseListener = function(a) {
  a && this._closeListeners.push(a)
};
dct.modules.gallery.LightboxController = function(a, b) {
  function c() {
    var c = a.getCurrent().getLargeImage();
    c && b.setImage(c)
  }
  a.addChangeListener(c);
  b.addNavigateLeftListener(function() {
    a.movePrevious()
  });
  b.addNavigateRightListener(function() {
    a.moveNext()
  });
  b.addCloseListener(function() {
    b.hide()
  });
  c()
};
dct.modules.gallery.CarouselView = function(a, b, c) {
  this._$carouselList = a.find("ul");
  this._leftListeners = [];
  this._rightListeners = [];
  this._imageClickListeners = [];
  this._currentImageIndex = 0;
  this._images = [];
  this._viewportWidth = b;
  this._mobile = c;
  var d = this;
  a.delegate("img", "click", function() {
    d._dispatch(d._imageClickListeners, d._currentImageIndex)
  });
  a.find(".prevArrow").click(function() {
    d._dispatch(d._leftListeners)
  });
  a.find(".nextArrow").click(function() {
    d._dispatch(d._rightListeners)
  })
};
dct.modules.gallery.CarouselView.prototype._dispatch = function(a) {
  for(var b = [].slice.apply(arguments, [1]), c = 0;c < a.length;c++) {
    a[c].apply(null, b)
  }
};
dct.modules.gallery.CarouselView.prototype.setImages = function(a) {
  this._images = a;
  this._$carouselList.empty();
  for(a = 0;a < this._images.length;a++) {
    var b = this._images[a], c = $("<img/>"), c = c.attr("src", b.getUrl()), c = c.attr("width", b.getWidth()), c = c.attr("height", b.getHeight()), c = c.attr("data-linkposition", b.getDataLinkPosition()), c = c.attr("data-linkname", b.getDataLinkName()), c = c.css("marginTop", Math.round(-1 * (b.getHeight() / 2))), d = $("<li/>");
    d.css("width", b.getWidth());
    d.append(c);
    c = $("<span />");
    c.addClass("screen");
    c.css("height", b.getHeight() + 1);
    c.css("width", b.getWidth());
    c.css("marginTop", Math.round(-1 * (b.getHeight() / 2)));
    d.append(c);
    this._$carouselList.append(d)
  }
  this.centerImage(0)
};
dct.modules.gallery.CarouselView.prototype.centerImage = function(a) {
  this._currentImageIndex = a;
  for(var b = this._$carouselList.find("li"), c = $(b[a]), d = 0, f = 0, e = 0;e < b.length;e++) {
    var g = $(b[e]), f = f + g.outerWidth();
    e < a && (d = f)
  }
  f = f || 1500;
  a = c.outerWidth() || this._images[a].getWidth();
  this._$carouselList.css("width", f + "px");
  d = (this._viewportWidth - a) / 2 - d;
  b.find("img").css("cursor", "default");
  !1 == this._mobile && c.find("img").css("cursor", "pointer");
  this._$carouselList.animate({marginLeft:d + "px"}, function() {
    $(this).css("visibility", "visible")
  });
  b.find("span").css("display", "inline");
  c.find("span").css("display", "none")
};
dct.modules.gallery.CarouselView.prototype.addNavigateLeftListener = function(a) {
  a && this._leftListeners.push(a)
};
dct.modules.gallery.CarouselView.prototype.addNavigateRightListener = function(a) {
  a && this._rightListeners.push(a)
};
dct.modules.gallery.CarouselView.prototype.addImageClickListener = function(a) {
  a && this._imageClickListeners.push(a)
};
dct.modules.gallery.CarouselController = function(a, b, c) {
  for(var d = a.getItems(), f = [], e = 0;e < d.length;e++) {
    var g = d[e].getSmallImage();
    f.push(g)
  }
  b.setImages(f);
  b.addImageClickListener(function() {
    c.showLightbox()
  });
  b.addNavigateLeftListener(function() {
    a.movePrevious()
  });
  b.addNavigateRightListener(function() {
    a.moveNext()
  });
  a.addChangeListener(function() {
    b.centerImage(a.getIndex())
  })
};
dct.modules.gallery.StatusBarView = function(a) {
  this._$statusBar = a;
  this._itemCount = this._currentItemNum = this._caption = null
};
dct.modules.gallery.StatusBarView.prototype._redraw = function() {
  this._$statusBar.find(".caption").text(this._caption || "");
  var a = "";
  this._currentItemNum && this._itemCount && (a = this._currentItemNum + " of " + this._itemCount);
  this._$statusBar.find(".counter").text(a)
};
dct.modules.gallery.StatusBarView.prototype.setCaption = function(a) {
  this._caption = a;
  this._redraw()
};
dct.modules.gallery.StatusBarView.prototype.setCurrentItemNumber = function(a) {
  this._currentItemNum = a;
  this._redraw()
};
dct.modules.gallery.StatusBarView.prototype.setItemCount = function(a) {
  this._itemCount = a;
  this._redraw()
};
dct.modules.gallery.StatusBarController = function(a, b) {
  var c = function() {
    b.setItemCount(a.getCount());
    b.setCurrentItemNumber(a.getIndex() + 1);
    b.setCaption(a.getCurrent().getCaption())
  };
  a.addChangeListener(c);
  c()
};
dct.modules.gallery.Image = function(a, b, c, d, f) {
  this._url = a;
  this._width = b;
  this._height = c;
  this._datalinkposition = d;
  this._datalinkname = f
};
dct.modules.gallery.Image.prototype.getUrl = function() {
  return this._url
};
dct.modules.gallery.Image.prototype.getWidth = function() {
  return this._width
};
dct.modules.gallery.Image.prototype.getHeight = function() {
  return this._height
};
dct.modules.gallery.Image.prototype.getDataLinkPosition = function() {
  return this._datalinkposition
};
dct.modules.gallery.Image.prototype.getDataLinkName = function() {
  return this._datalinkname
};



}
/*
     FILE ARCHIVED ON 13:30:48 Oct 18, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:26:27 Sep 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.587
  exclusion.robots: 0.021
  exclusion.robots.policy: 0.01
  esindex: 0.009
  cdx.remote: 30.815
  LoadShardBlock: 109.929 (3)
  PetaboxLoader3.datanode: 123.551 (4)
  load_resource: 85.49
  PetaboxLoader3.resolve: 56.852
*/
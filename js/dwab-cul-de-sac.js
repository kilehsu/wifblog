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

jQuery(document).ready(function(){
    var cdsOpen = false;
    var menuOpen = false;
    try {
        GOC.on('open:cds', function() { cdsOpen = true; });
        GOC.on('close:cds', function() { cdsOpen = false; });
        GOC.on('open:menu', function() { menuOpen = true; });
        GOC.on('close:menu', function() { menuOpen = false; });
    } catch (e) {
    }
    
    var clickHandler = function (e) {
        if(cdsOpen || menuOpen) {
            return;
        }
        e.preventDefault();
        try {
            GOC.openCds(this.href);
        } catch(e) {
            window.location = interstitial + encodeURIComponent(this.href);
        }
    }
    
    $('body .breadcrumbs').delegate('a', 'click', clickHandler);
    $('body .character-nav').delegate('a', 'click', clickHandler);
});

}
/*
     FILE ARCHIVED ON 17:13:57 Mar 16, 2013 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:26:27 Sep 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.671
  exclusion.robots: 0.023
  exclusion.robots.policy: 0.011
  esindex: 0.013
  cdx.remote: 5.799
  LoadShardBlock: 202.93 (3)
  PetaboxLoader3.datanode: 230.88 (4)
  load_resource: 94.766
  PetaboxLoader3.resolve: 43.983
*/
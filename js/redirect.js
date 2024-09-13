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

if (typeof baseDomain == "undefined") {
    var baseDomain = ".go.com";  // This is used to set the correct domain for the international redirect over-ride cookie. In the US, this is set to ".go.com".
}
if (typeof COUNTRYLIST == "undefined") {
    var COUNTRYLIST = ["united states", "canada", "puerto rico", "guam", "us virgin islands", "american samoa", "northern mariana islands"]; // list of acceptable country designations.
}

if (typeof INTERNATIONALSITE == "undefined") {
    INTERNATIONALSITE = "https://web.archive.org/web/20121018133712/http://home.disney.go.com/guestservices/international";
}

if (typeof REDIRECTCOUNTRY == "undefined") {
    var REDIRECTCOUNTRY = [
        "australia||http://www.disney.com.au/",
        "japan||http://www.disney.co.jp/",
        "united kingdom||http://www.disney.co.uk/",
        "new zealand||http://www.disney.com.au/",
        "italy,holy see (vatican city state),malta||http://www.disney.it/",
        "spain||http://www.disney.es/",
        "singapore||http://home.disney.com.sg",
        "malaysia||http://home.disney.com.my",
        "argentina,antigua and barbuda,bolivia,chile,colombia,costa rica,cuba,dominica,dominican republic,ecuador,el salvador,guatemala,haiti,honduras,mexico,nicaragua,panama,paraguay,peru,uruguay,venezuela,Guayana,Guyana,Antigua y Barbuda,Barbados,Bermudas,Belice,United States Virgin Islands,British Virgin Islands,Reino Unido,Dominica,Republica Dominicana,Guayana Francesa,Guadalupe,Guatemala,guyana,Guayana,Honduras,Jamaica,Martinica,Montserrat,Aruba,Nicaragua,Panama,Saint Kitts y Nevis,Anguilla,Surinam,Trinidad and Tobago,Turks and Caicos Islands,Bahamas,Granada,Santa Lucia,San Vicente and Granadinas||http://www.disneylatino.com/"
    ];
}

var OK2LOAD = false;
// Check for allowed user country
try {
    for (var i = 0; i < COUNTRYLIST.length; i++) { // Make sure we're in an allowed country
        if (country == COUNTRYLIST[i]) {
            OK2LOAD = true;
            break;
        }
    }

    if (OK2LOAD == false) {

        var OKToSetDefaultRedirect = true;
        //Check for specific foreign countries.
        for (var i = 0; i < REDIRECTCOUNTRY.length; i++) {
            var countryparts = REDIRECTCOUNTRY[i].split("||");
            var countrynames = countryparts[0].split(",");
            for (var j = 0; j < countrynames.length; j++) {
                if (country.toLowerCase() == countrynames[j].toLowerCase()) {
                    document.location.replace(countryparts[1]);
                    OKToSetDefaultRedirect = false;
                }
            }
        }
        if (OKToSetDefaultRedirect) {
            document.location.replace(INTERNATIONALSITE);
        }
    }
} catch(e) {}


}
/*
     FILE ARCHIVED ON 13:37:12 Oct 18, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:26:27 Sep 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 1.218
  exclusion.robots: 0.024
  exclusion.robots.policy: 0.011
  esindex: 0.012
  cdx.remote: 103.983
  LoadShardBlock: 42.809 (3)
  PetaboxLoader3.datanode: 57.226 (4)
  load_resource: 21.251
*/
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

/*
Copyright (c) 2010 Morgan Roderick http://roderick.dk

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*jslint evil: false, strict: false, undef: true, white: false, onevar:false, plusplus:false */
/*global setTimeout:true */
/** section: PubSub
 *  PubSubJS is a dependency free library for doing ['publish/subscribe'](http://en.wikipedia.org/wiki/Publish/subscribe)
 *  messaging in JavaScript.
 *  
 *  In order to not have surprising behaviour where the execution chain generates more than one message, 
 *  publication of messages with PubSub are done asyncronously (this also helps keep your code responsive, by 
 *  dividing work into smaller chunkcs, allowing the event loop to do it's business).
 *
 *  If you're feeling adventurous, you can also use syncronous message publication, which can lead to some very
 *  confusing conditions, when one message triggers publication of another message in the same execution chain.
 *  Don't say I didn't warn you.
 * 
 *  ##### Examples
 *  
 *      // create a function to receive the message
 *      var mySubscriber = function( msg, data ){
 *          console.log( msg, data );
 *      };
 * 
 *      // add the function to the list of subscribers to a particular message
 *      // we're keeping the returned token, in order to be able to unsubscribe from the message later on
 *      var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );
 *
 *      // publish a message asyncronously
 *      PubSub.publish( 'MY MESSAGE', 'hello world!' );
 *      
 *      // publish a message syncronously, which is faster by orders of magnitude, but will get confusing
 *      // when one message triggers new messages in the same execution chain
 *      // USE WITH CATTION, HERE BE DRAGONS!!!
 *      PubSub.publishSync( 'MY MESSAGE', 'hello world!' );
 *      
 *      // unsubscribe from further messages, using setTimeout to allow for easy pasting of this code into an example :-)
 *      setTimeout(function(){
 *          PubSub.unsubscribe( token );
 *      }, 0)
**/ 
var PubSub = {};
(function(p){
    "use strict";
    
    p.version = "1.0.1";
    
    var messages = {};
    var lastUid = -1;
    
    var publish = function( message, data, sync ){
        // if there are no subscribers to this message, just return here
        if ( !messages.hasOwnProperty( message ) ){
            return false;
        }
        
        var deliverMessage = function(){
            var subscribers = messages[message];
            var throwException = function(e){
                return function(){
                    throw e;
                };
            }; 
            for ( var i = 0, j = subscribers.length; i < j; i++ ){
                try {
                    subscribers[i].func( message, data );
                } catch( e ){
                    setTimeout( throwException(e), 0);
                }
            }
        };
        
        if ( sync === true ){
            deliverMessage();
        } else {
            setTimeout( deliverMessage, 0 );
        }
        return true;
    };

    /**
     *  PubSub.publish( message[, data] ) -> Boolean
     *  - message (String): The message to publish
     *  - data: The data to pass to subscribers
     *  - sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
     *  Publishes the the message, passing the data to it's subscribers
    **/
    p.publish = function( message, data ){
        return publish( message, data, false );
    };
    
    /**
     *  PubSub.publishSync( message[, data] ) -> Boolean
     *  - message (String): The message to publish
     *  - data: The data to pass to subscribers
     *  - sync (Boolean): Forces publication to be syncronous, which is more confusing, but faster
     *  Publishes the the message synchronously, passing the data to it's subscribers
    **/
    p.publishSync = function( message, data ){
        return publish( message, data, true );
    };

    /**
     *  PubSub.subscribe( message, func ) -> String
     *  - message (String): The message to subscribe to
     *  - func (Function): The function to call when a new message is published
     *  Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
    **/
    p.subscribe = function( message, func ){
        // message is not registered yet
        if ( !messages.hasOwnProperty( message ) ){
            messages[message] = [];
        }
        
        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = (++lastUid).toString();
        messages[message].push( { token : token, func : func } );
        
        // return token for unsubscribing
        return token;
    };

    /**
     *  PubSub.unsubscribe( token ) -> String | Boolean
     *  - token (String): The token of the function to unsubscribe
     *  Unsubscribes a specific subscriber from a specific message using the unique token
    **/
    p.unsubscribe = function( token ){
        for ( var m in messages ){
            if ( messages.hasOwnProperty( m ) ){
                for ( var i = 0, j = messages[m].length; i < j; i++ ){
                    if ( messages[m][i].token === token ){
                        messages[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return false;
    };
}(PubSub));


}
/*
     FILE ARCHIVED ON 13:29:43 Oct 18, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 22:26:27 Sep 13, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.672
  exclusion.robots: 0.021
  exclusion.robots.policy: 0.01
  esindex: 0.011
  cdx.remote: 7.855
  LoadShardBlock: 40.483 (3)
  PetaboxLoader3.datanode: 58.015 (4)
  load_resource: 74.917
  PetaboxLoader3.resolve: 43.105
*/
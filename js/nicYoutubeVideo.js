/**
 * nicYoutubeVideo
 * @description: Adds youtube videos
 * @requires: nicCore, nicPane, nicAdvancedButton
 * @author: Gabriel Ricci (gabrielricci@gmail.com)
 * @version: 0.1.0
 */

/* START CONFIG */
var nicYoutubeVideoOptions = {
    buttons : {
        'youtubevideo' : {name : 'Add Youtube Video', type : 'nicYoutubeVideoButton'}
    },
    iconFiles : {
        'youtubevideo' : '/static/img/flashembed.png'
    }
};
/* END CONFIG */

var nicYoutubeVideoButton = nicEditorAdvancedButton.extend({    
    addPane : function() {
        this.addForm({
            '' : {type : 'title', txt : 'Add a Youtube, Vimeo or SWF url'},
            'url' : {type : 'text', txt : 'File url', value : '', style : {width: '190px'}},
            'width' : {type : 'text', txt : 'Width', value : '480', style : {width: '40px'}},
            'height' : {type : 'text', txt : 'Height', value : '385', style : {width: '40px'}}
        },this.video);
    },
    
    submit : function(e) {
        // get the information
        var url     = this.inputs['url'].value;
        var width    = this.inputs['width'].value;
        var height    = this.inputs['height'].value;
        
        // remove the panel
        this.removePane();
        
        if(url == "http://" || url == "") {
            alert("You must enter a valid file url");
            return false;
        }
        
        if( url.indexOf('.youtube.com') > -1 || url.indexOf('//youtube.com') > -1 ) {
            // search the video id 
            var videoID = url.match(/[.]*v\=([0-9a-z_-]*)/i)[1];
            
            // validate the video id
            if(videoID == undefined || typeof videoID == 'undefined' || !videoID){
                alert("Invalid youtube video");
                return false;
            }
            
            // create the video url
            var url = "http://www.youtube.com/v/"+videoID+"&color1=0xb1b1b1&color2=0xd0d0d0&hl=pt_BR&feature=player_embedded&fs=1";
        } else if( url.indexOf('.vimeo.com') > -1 || url.indexOf('//vimeo.com') > -1 ) {
            // search the video id 
            var videoID = url.match(/[.]*.com\/([0-9a-z_]*)/i)[1];
            
            // validate the video id
            if(videoID == undefined || typeof videoID == 'undefined' || !videoID){
                alert("Invalid vimeo video");
                return false;
            }
            
            // create the video url
	    var url = "http://vimeo.com/moogaloop.swf?clip_id="+videoID+"&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=1&amp;color=ffffff&amp;fullscreen=1&amp;autoplay=0&amp;loop=0"
        }

        // tmp identification
        var tmp = "javascript:nicYoutubeTmp()";
        
        // create a image for position reference in the editor
        this.ne.nicCommand("insertImage", tmp);
        
        // get the link
        var tmpImg = this.findElm('IMG','src',tmp);
        
        // check if the image has been created
        if(!tmpImg){
            alert("Internal error");
            return false;
        }
        
        // create an object element 
        this.video = new bkElement("object");
        
        // insert the object before the image
        this.video.appendBefore(tmpImg);
        
        // remove the tmp image
        tmpImg.remove();
        
        // set the parameters
        this.video.setAttributes({
            width : width,
            height : height
        });
        
        // create the parameters
        var movieParam = new bkElement("param");
        movieParam.setAttributes({
            name: "movie", 
            value: url
        });
        
        var fullScreenParam = new bkElement("param");
        fullScreenParam.setAttributes({
            name: "allowFullScreen", 
            value: "true"
        });
        
        var scritpAccessParam = new bkElement("param");
        scritpAccessParam.setAttributes({
            name: "allowScriptAccess", 
            value: "always"
        });
        
        // create the embed tag
        var embed = new bkElement("embed");
        embed.setAttributes({
            src : url,
	    data : url,
            type : "application/x-shockwave-flash", 
            allowfullscreen : "true", 
            allowscriptaccess : "always",
            width : width,
            height : height
        });	
        
        // add the parameters and the embed tags in the video
        this.video.appendChild(movieParam);
        this.video.appendChild(fullScreenParam);
        this.video.appendChild(scritpAccessParam);
        this.video.appendChild(embed);
	return true;
    }
});

// register the plugin
nicEditors.registerPlugin(nicPlugin, nicYoutubeVideoOptions);
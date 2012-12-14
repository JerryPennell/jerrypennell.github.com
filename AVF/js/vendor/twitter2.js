  $(document).ready(function() {
            if(navigator.platform == "iPad") {
                $("a").each(function() { // have to use an `each` here - either a jQuery `each` or a `for(...)` loop
                    var onClick; // this will be a function
                    var firstClick = function() {
                        onClick = secondClick;
                        return false;
                    };
                    var secondClick = function() {
                        onClick = firstClick;
                        return true;
                    };
                    onClick = firstClick;
                    $(this).click(function() {
                        return onClick();
                    });
                });
            }
        });


function goBack()
{
  window.history.back();
}
// polygon options for mouseover event
// see http://code.google.com/apis/maps/documentation/v3/reference.html#PolygonOptions
var pt_over = {
	strokeColor: "#FF0000",
	strokeOpacity: 0,
	strokeWeight: 0,
	fillColor: "#FF0000",
	fillOpacity: 0.2
};

// polygon options for mouseout event
// see http://code.google.com/apis/maps/documentation/v3/reference.html#PolygonOptions
var pt_out = {
	strokeColor: "#FF0000",
	strokeOpacity: 0,
	strokeWeight: 0,
	fillColor: "#FF0000",
	fillOpacity: 0
};

var map;

function initialize() {
	// setup SoMa map
	var myOptions = {
		zoom: 11,
		center: new google.maps.LatLng(37.760668, -122.438008),
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	// start with some @raffi because he's does the geo thing
	google.maps.event.addListenerOnce(map, "bounds_changed", function() {
		getFeed('http://api.twitter.com/1/statuses/user_timeline/raffi.json');
	});

	// this adds a hovercard to the @hitching title
	twttr.anywhere(function(twitter) {
		twitter('#hovercard_me').hovercards();
	})
}

// get some Twitter API data
function getFeed(url) {
	url += '?callback=addPolyTweets';

	var script = document.createElement("script");
	script.setAttribute("src", url);
	script.setAttribute("type", "text/javascript");                
	document.body.appendChild(script);
}

// add polytweets to the map
function addPolyTweets(data) {
	if (data && data.length) {
		for (var i = 0; i < data.length; i++) {
			var tweet = data[i];

			// add a polytweet to the map
			var polytweet = new google.maps.Polytweet(tweet, map, pt_over, pt_out);

			// that's it!

			// for this demo, extend map bounds to include polytweet
			if (polytweet.getPosition()) {
				if (!map.getBounds().contains(polytweet.getPosition())) {
					map.fitBounds(map.getBounds().extend(polytweet.getPosition()));
				}
			}		
		}
	}

	// add some @anywhere hovercards
	twttr.anywhere(function(twitter) {
		twitter(".hovercardable").hovercards({
			username: function(node) {
				// title is 'screen_name in Place'
				return node.title.split(' ').shift();	
			}
		});
	})
	
	function goBack()
    {
     window.history.back();
    }
}

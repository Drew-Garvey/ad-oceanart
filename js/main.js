jQuery.noConflict();

function showMap () {
	var directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true
		}),
		directionsService = new google.maps.DirectionsService(),
		geocoder = new google.maps.Geocoder(),
		oA = {
			title : "Ocean Art",
			street : "1628 Laskin Road, Suite 716 Hiltop North Shopping Center",
			city : "Virginia Beach",
			state : "Viginia",
			zip : "23451",
			phone : "(757) 425-1670",
			marker : "/img/pin-oa.png"
		},
		marker,
		map = new google.maps.Map(document.getElementById('map-canvas'), {
			zoom: 16,
			center: new google.maps.LatLng(36.85195, -76.01913),
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}),
		$mapSearch = jQuery('#map_search'),
		infowindow = new google.maps.InfoWindow(),
		oAmarker = new google.maps.Marker({
			position : new google.maps.LatLng(36.85195, -76.01913),
			map : map,
			icon: new google.maps.MarkerImage(
				oA.marker,
				new google.maps.Size(32, 32),
				new google.maps.Point(0, 0)
			)
		}),
		userPostion = null;
	
	jQuery('#map-container').after('<div id="map-direction-panel" class="direction-panel pullDown hidden"></div>');

	// Sets up the method that draws a path two locations
	directionsDisplay.setMap(map);

	directionsDisplay.setPanel(document.getElementById('map-direction-panel'));


	var markerListener = function(marker, i) {
		return function() {
			infowindow.open(map, marker);
		};
	};

	// Set markers setMap to null to remove it from map
	var removeUserMarker = function(marker) {
		marker.setMap(null);
	};

	// Finds the nearest pin and pushest
	var findOA = function(address, remove) {
		var bounds = new google.maps.LatLngBounds();

		// Converts the value from meters to miles
		// nearest = nearest *= 0.000621371192;

		// Sets the viewport for the map
		bounds.extend(oAmarker.getPosition());
		bounds.extend(userPostion.getPosition());
		map.fitBounds(bounds);
		
		// Zooms out a level to ensure both the user pin and the hospital pin show when the infobox is open
		var zoomLvl = map.getZoom();
		map.setZoom(zoomLvl);
	};

	function calcRoute(address) {
		var start = address,
			end = oA.street + ' ' + oA.city + ' ' + oA.state + ' ' + oA.zip,
			request = {
				origin: start,
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING
			};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
	}

	// Sets up the search function
	var search = function(id, marker) {

		// Finds the entered value
		var searchVal = jQuery(id).val();

		geocoder.geocode({
			'address': searchVal + ', USA'
		}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {

				address = results[0].geometry;

				// Set the center point to the value that was entered
				map.setCenter(address.location);

				if (userPostion !== null) {
					removeUserMarker(userPostion);
				}

				userPostion = new google.maps.Marker({
					position: address.location,
					map: map,
					id: 'user_position',
					icon: new google.maps.MarkerImage(
						'/img/pin-user.png',
						new google.maps.Size(32, 32),
						new google.maps.Point(0, 0)
					)
				});

				findOA(address);
				calcRoute(searchVal);

			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	};

	// On form submit, run the search function
	$mapSearch.on('submit', function(e) {
		e.preventDefault();

		location.hash = "#map-container";

		search('#map_search-field');

		infowindow.close();

		jQuery('#map-direction-panel').removeClass('hidden');
	});

	google.maps.event.addListener(map, 'click', (function() {
		infowindow.close();
	}));
}

jQuery(document).ready(function($) {
	var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
	console.log(size);

	if (size === 'desktop') {
		showMap();
	} else {
		jQuery('#map-canvas').css('height', 'auto');
		jQuery('#map-canvas .loading').addClass('hidden');
		jQuery('#map-canvas h3').removeClass('hidden');
		jQuery('#map_search').addClass('hidden');
	}

	jQuery('.flexslider').flexslider();
});
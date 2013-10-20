jQuery.noConflict();

function showMap () {
	var geocoder = new google.maps.Geocoder(),
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
		entryIDReverseLookup = {},
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

	var markerListener = function(marker, i) {
		return function() {

			infowindow.open(map, marker);
		};
	};

	// Finds the nearest pin and pushest
	var findOA = function(address, remove) {
		var bounds = new google.maps.LatLngBounds();

		// Converts the value from meters to miles
		// nearest = nearest *= 0.000621371192;

		// nearestVal = nearest;

		// nearest = Math.ceil(nearest);

		// // Converts the value to a string
		// nearest = nearest.toString();

		// console.log('The closest marker\'s index is ' + nearestIndex + ' and the distance to the closest pin is ' + nearest + ' miles away');

		// if (nearest !== null && $closestSection.hasClass('inactive') === false) {
		// 	$closestSection.find('.miles').text(nearest);
		// 	$closestSection.find('.city').html(locationCare[nearestIndex].title + '<br/>' + locationCare[nearestIndex].map_city + ', ' + locationCare[nearestIndex].map_state_abbreviation);
		// }

		// markerDistance = nearest;

		// setInfoWindow(allMarkers[nearestIndex], nearestIndex);

		// Sets the viewport for the map
		bounds.extend(oAmarker.getPosition());
		bounds.extend(userPostion.getPosition());
		map.fitBounds(bounds);
		
		// Zooms out a level to ensure both the user pin and the hospital pin show when the infobox is open
		var zoomLvl = map.getZoom();
		zoomLvl--;
		map.setZoom(zoomLvl);
	};

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

		// $closestSection.removeClass('hidden');
	});

	google.maps.event.addListener(map, 'click', (function() {
		infowindow.close();
	}));
}

jQuery(document).ready(function($) {
	showMap();
});
jQuery.noConflict();

function showMap () {
	var oA = {
			title : "Ocean Art",
			street : "1628 Laskin Road, Suite 716 Hiltop North Shopping Center",
			city : "Virginia Beach",
			state : "Viginia",
			zip : "23451",
			phone : "(757) 425-1670",
			marker : "/img/oa-pin.png"
		}, 
		map = new google.maps.Map(document.getElementById('map-canvas'), {
			zoom: 16,
			center: new google.maps.LatLng(36.85195, -76.01913),
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}),
		infowindow = new google.maps.InfoWindow(),
		entryIDReverseLookup = {},
		marker,
		oAmarker = new google.maps.Marker({
			position : new google.maps.LatLng(36.85195, -76.01913),
			map : map,
			icon : oA.marker
		});

	var markerListener = function(marker, i) {
		return function() {

			infowindow.open(map, marker);
		};
	};

	google.maps.event.addListener(map, 'click', (function() {
		infowindow.close();
	}));
}

jQuery(document).ready(function($) {
	showMap();
});
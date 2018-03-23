var allMarkers = [JSON.parse(localStorage.rArr)][0];

var Marker = function(marker){

	this.position = ko.observable(marker.position);
	this.name = ko.observable(marker.name);

};
var ViewModel = function(){

	var self = this;

	this.rList = ko.observableArray([]);

	insMarkers(self.rList);

	this.filterCats = function(name){
		var inputBox = document.getElementById("finput").value;
		if (inputBox.length < 1){
			insMarkers(self.rList);
		}
		else{
			var delMarkers = [];
			insMarkers(self.rList);
			self.rList().forEach(function(marker){
				if (marker.name().indexOf(inputBox) == -1){
					delMarkers.push(marker);
				}
			})
			removeMarkers(delMarkers, self.rList);
			loadMarkers(self.rList);
		}
		
	}

};
var namesList = function(list){
		var namesList = [];
		list().forEach(function(el){
			namesList.push(el.name());
		})
		return namesList;
	}
var loadMarkers = function(list){
	var bounds = new google.maps.LatLngBounds();
	var ca = {lat: 34.052235, lng: -118.243683};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: ca
	});
	JSON.parse(localStorage.rArr).forEach(function(el){
		if (namesList(list).indexOf(el.name) != -1){
			var marker = new google.maps.Marker({
				position: el.position,
				map: map
			});
			bounds.extend(marker.getPosition());
		}
	});
	// Adjust the map zoom level so that all the markers are showing
	map.fitBounds(bounds);
};

var insMarkers = function(list){
	list.removeAll();
	allMarkers.forEach(function(marker){
		list.push(new Marker(marker));
	})
};

var removeMarkers = function(mList, rList){
	mList.forEach(function(marker){
		rList.remove(marker);
	})
};

ko.applyBindings(new ViewModel());
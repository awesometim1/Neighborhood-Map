var allMarkers = [JSON.parse(localStorage.rArr)][0];

var ListItem = function(marker){

	var self = this;

	this.position = ko.observable(marker.position);
	this.name = ko.observable(marker.name);

	//Google's animation function
			function toggleBounce() {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
				infowindow.open(map, marker);
			}
	// this.animate = function(marker) {
	// 	console.log(typeof(marker))
	// 	console.log(this)
	// 	if (marker.getAnimation() !== null) {
	// 		marker.setAnimation(null);
	// 	} else {
	// 		marker.setAnimation(google.maps.Animation.BOUNCE);
	// 	}
	// }
};
var ViewModel = function(){

	var self = this;

	this.rList = ko.observableArray([]);

	insMarkers(self.rList);

	// Function to filter cats. Makes use of external functions loadMarkers, insMarkers, and removeMarkers
	this.filterCats = function(name){
		var inputBox = document.getElementById("finput").value;
		if (inputBox.length < 1){
			insMarkers(self.rList);
			loadMarkers(self.rList);
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

// Function to make a list of names from ko.observablearray
var namesList = function(list){
	var namesList = [];
	list().forEach(function(el){
		namesList.push(el.name());
	})
	return namesList;
}

// Function to load the filtered markers into the map and adjust bounds accordingly
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
			var infowindow = new google.maps.InfoWindow({
				content: el.name			
			});
			marker.addListener('click', function(){
				infowindow.open(map, marker);
			});

		
		bounds.extend(marker.getPosition());
	}
});
	// Adjust the map zoom level so that all the markers are showing
	if (!bounds.isEmpty()){
		map.fitBounds(bounds);
	}

};

// Function to insert markers into the ko.observablearray
var insMarkers = function(list){
	list.removeAll();
	allMarkers.forEach(function(marker){
		list.push(new ListItem(marker));
	})
};

// Function to remove markers from the ko.observablearray
var removeMarkers = function(mList, rList){
	mList.forEach(function(marker){
		rList.remove(marker);
	})
};

ko.applyBindings(new ViewModel());
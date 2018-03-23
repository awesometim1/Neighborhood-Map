var allMarkers = [JSON.parse(localStorage.rArr)][0];

var Marker = function(marker){

	this.position = ko.observable(marker.position);
	this.name = ko.observable(marker.name);

};
var ViewModel = function(){

	var self = this;

	this.rList = ko.observableArray([]);

	loadMarkers(self.rList);

	this.filterCats = function(name){
		var inputBox = document.getElementById("finput").value;
		if (inputBox.length < 1){
			loadMarkers(self.rList);
		}
		else{
			var delMarkers = [];
			loadMarkers(self.rList);
			self.rList().forEach(function(marker){
				console.log(marker.name());
				if (marker.name().indexOf(inputBox) == -1){
					delMarkers.push(marker);
				}
			})
			removeMarkers(delMarkers, self.rList);
		}
		
	}
};

var loadMarkers = function(list){
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
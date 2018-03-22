var initialMarkers = [
	{
		name:"Chickfila",
		position: {lat:34.016716,lng:-118.282515},
		map:map,
	},
	{
		name:"Wendy's",
		position: {lat:34.098219,lng:-118.345304},
		map:map,
	},
	{
		name:"Chickfila",
		position: {lat:34.097752,lng:-118.338227},
		map:map,
	},
	{
		name:"Wendy's",
		position: {lat:34.095880,lng:-118.292150},
		map:map,
	},
	{
		name:"Chickfila",
		position: {lat:34.063535,lng:-118.445158},
		map:map,
	},
	{
		name:"Wendy's",
		position: {lat:33.971157,lng:-118.378403},
		map:map,
	},
	{
		name:"McDonald's",
		position: {lat:34.070610,lng:-118.268148},
		map:map,
	},
	{
		name:"Burger King",
		position: {lat:34.116447,lng:-118.184719},
		map:map,
	},
	{
		name:"McDonald's",
		position: {lat:34.083109,lng:-118.222829},
		map:map,
	},
	{
		name:"Taco Bell",
		position: {lat:34.062735,lng:-118.446710},
		map:map,
	},
	{
		name:"KFC",
		position: {lat:34.030178,lng:-118.199137},
		map:map,
	},
	{
		name:"Jack In The Box",
		position: {lat:34.114704,lng:-118.182959},
		map:map,
	},
]


var marker = function(data){

	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.nicknames = ko.observableArray(data.nicknames);
	this.imgSrc = ko.observable(data.imgSrc);
	this.growthStage = ko.observable(data.growthStage);

	this.checkGrowth = function(){
		if (this.clickCount() <10){
			this.growthStage('Infant')
		}
		else if (this.clickCount() < 50){
			this.growthStage('Child')
		}
		else if (this.clickCount() < 75){
			this.growthStage('Teen');
		}
		else if (this.clickCount() < 100){
			this.growthStage('Adult');
		}

	}
}
var ViewModel = function(){

	var self = this;

	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem){
		self.catList.push( new Cat(catItem));
	})
	this.currentCat = ko.observable(this.catList()[0]);

	this.setCat = function(clickedCat){
		console.log("HI");
		self.currentCat(clickedCat);
	}
	this.incrementCounter = function(){
		this.clickCount(this.clickCount() + 1);
		this.checkGrowth();
	}
	
}

ko.applyBindings(new ViewModel());
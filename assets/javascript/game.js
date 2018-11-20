$(document).ready(function () {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyB78xCitWwBgrOkIPDv_nw7xFefgU2vX70",
		authDomain: "train-schedule-db280.firebaseapp.com",
		databaseURL: "https://train-schedule-db280.firebaseio.com",
		projectId: "train-schedule-db280",
		storageBucket: "train-schedule-db280.appspot.com",
		messagingSenderId: "98817978962"
	};
	firebase.initializeApp(config);

	var trainData = firebase.database().ref();

	// Button for adding trains
	$("#submitBtn").on("click", function () {
		event.preventDefault();
		// Grabs user input
		var trainName = $("#tName").val().trim();
		var destination = $("#dest").val().trim();
		var firstTrain = moment($("#fTtime").val().trim(), "HH:mm").subtract(10, "years").format("X");
		var frequency = $("#freq").val().trim();

		// Creates local "temporary" object for holding train data
		var newTrain = {
			name: trainName,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency
		}

		// Uploads train data to the database
		trainData.push(newTrain);

		// Alert
		alert(newTrain.name + " has been successfully added");

		// Clears all of the text-boxes
		$("#tName").val("");
		$("#dest").val("");
		$("#fTtime").val("");
		$("#freq").val("");

		return false;
	});


	// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
	trainData.on("child_added", function (childSnapshot) {

		let data = childSnapshot.val();
		let trainNames = data.name;
		let trainDestin = data.destination;
		let trainFrequency = data.frequency;
		let theFirstTrain = data.firstTrain;
		console.log(theFirstTrain);

		// Calculate the minutes until arrival using hardcore math
		// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
		let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
		let tMinutes = trainFrequency - tRemainder;

		// To calculate the arrival time, add the tMinutes to the currrent time
		let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

		// Add each train's data into the table 
		$("tbody").append(
			"<tr><td>" + trainNames +
			"</td><td>" + trainDestin +
			"</td><td class='min'>" + trainFrequency +
			"</td><td class='min'>" + tArrival +
			"</td><td class='min'>" + tMinutes + "</td></tr>");
	});
});

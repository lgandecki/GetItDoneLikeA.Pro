Template.timer.rendered = function() {
	$(".knob").knob();
}

Template.timer.events({
 	"click .btn-stop": function() {
 		console.log("clicked");
 		console.log("Do I see timerFunction ? ", timerFunction);
 		timerFunction = "stopped";
 		setFutureDate(0);
 		
 	}
})
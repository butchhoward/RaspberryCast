function stopNote() {
	chrome.notifications.clear('notif', function(id) { console.log("Last error:", chrome.runtime.lastError); });
}

function notif(msg) {
	var opt = {
		type: "basic",
		title: "Raspberry Pi",
		message: msg,
		iconUrl: "48.png"
	};

	chrome.notifications.create('notif', opt, function(id) { console.log("Last error:", chrome.runtime.lastError); });

	setTimeout(stopNote, 4000);		
}


function mkrequest(url, response) {
	try {
		var newURL = "http://"+localStorage.getItem('raspip')+":2020"+url;
		if (response == 1) {
			notif("Trying to get video stream URL. Please wait ~ 10-30 seconds.");
		}
		var req = new XMLHttpRequest();
		req.open('GET', newURL, true);
		req.onreadystatechange = function (aEvt) {
			if (req.readyState == 4) {
				if (req.status == 200) {
					if (req.responseText == "1") {
						if (response == 1) {
							notif("Success ! Video should now be playing.");	
						}
					} else {
						notif("An error occured during the treatment of the link. Please make sure the link is compatible");
					}
				} else {
					chrome.notifications.clear('notif', function(id) { console.log("Last error:", chrome.runtime.lastError); });
					alert("Error during requesting from server ! Make sure the ip/port are corrects, and the server is running.");
				}
			}
		};
		req.send(null);
	} 
	catch(err) {
		alert("Error ! Make sure the ip/port are corrects, and the server is running.")
		return "wrong";
	}
}


chrome.contextMenus.onClicked.addListener(function(info) {
	var url_encoded_url = encodeURIComponent(info.linkUrl);	
	var url = "/"+localStorage.cmFunction+"?url="+url_encoded_url;
	mkrequest(url, 1);
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.tabs.create({url: "../options.html"});
});

chrome.contextMenus.create({
	id: "Castnow",
	title: "Send to Rpi",
	contexts: ["link"]
});


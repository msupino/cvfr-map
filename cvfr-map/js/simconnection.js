var userAircraft = L.marker([], {
	icon: new L.DivIcon({
		iconSize: [100, 100],
		iconAnchor: [50, 50],
		className: "userAircraft-marker",
		html: '<img src="map_pins/cessna.png" class="userAircraft">'
	})
});
var intervalAircraftData;
var simURL;
var mapControl;
var focusOnAircraft = false;
var simURL;

document.getElementById("user-aircraft").addEventListener("click", function() {
	let ipAddress = document.getElementById("ipAddress").value;
	if (this.checked) {
		console.log(!ipAddress);
		if (ipAddress) {
			simURL = "http://" + ipAddress + ":2020";
		} else {
			simURL = "http://localhost:2020"
		}
		mapControl = L.easyButton('fas fa-location-arrow', function() {
			if (focusOnAircraft) {
				focusOnAircraft = false;
				document.querySelector(".fa-location-arrow").style.color = "black";
			} else {
				focusOnAircraft = true;
				document.querySelector(".fa-location-arrow").style.color = "mediumspringgreen";
			}
		}).addTo(map);
		getAirplaneFromSim();
		intervalAircraftData = setInterval(getAirplaneFromSim, 1000);
	} else {
		clearInterval(intervalAircraftData);
		userAircraft.remove();
		mapControl.remove();
		small_altitude.value = 0;
		speed_gauge.value = 0;
		big_altitude.value = 0;
		bearing_gauge.value = 0;
		if (typeof vsi_gauge !== "undefined")        vsi_gauge.value = 0;
		if (typeof turn_coordinator !== "undefined") turn_coordinator.value = 0;
		if (typeof attitude_indicator !== "undefined") attitude_indicator.value = { pitch: 0, roll: 0 };
		var led = document.getElementById("sim_status");
		if (led) { led.classList.remove("sim-status-on"); led.classList.add("sim-status-off"); }
	}
});

function getAirplaneFromSim() {
	var con = new XMLHttpRequest();
	con.onreadystatechange = function() {
		if (con.readyState !== XMLHttpRequest.DONE) return;
		// Network errors (ERR_CONNECTION_REFUSED, host unreachable, CORS,
		// etc) reach DONE with status === 0; HTTP errors arrive as
		// status >= 400. Either case means we have no live sim data and
		// the SIM LED should go grey.
		if (con.status !== 200) { markSimDown(); return; }
		try {
			let data = JSON.parse(con.responseText);
			setAircraftData(data);
		} catch (e) {
			console.log(e);
			markSimDown();
		}
	};
	con.onerror = markSimDown;
	con.ontimeout = markSimDown;
	con.timeout = 2000;
	con.open('GET', simURL, true);
	con.send();
}

// Single source of truth for "sim is down" UI state. Called from the XHR
// failure paths above and from the user-aircraft toggle when it's turned
// off. Intentionally only touches the LED + tooltip - we leave the gauges
// frozen on their last value rather than zeroing them, so a momentary
// blip doesn't make the whole panel flap.
function markSimDown() {
	var led = document.getElementById("sim_status");
	if (!led) return;
	led.classList.remove("sim-status-on");
	led.classList.add("sim-status-off");
	led.title = "Sim disconnected";
}

function setAircraftData(data) {
	// Map marker pose (always present; LLBG fallback if sim isn't ready)
	userAircraft.setLatLng([data.latitude, data.longitude]);
	if (!map.hasLayer(userAircraft)) {
		userAircraft.addTo(map);
	}
	document.querySelector(".userAircraft").style.transform = `rotate(${data.heading - 45}deg)`;
	if (focusOnAircraft) {
		map.setView([data.latitude, data.longitude], map.getZoom());
	}

	// Existing six-pack gauges
	small_altitude.value = data.altitude / 10;
	speed_gauge.value = data.ias;
	big_altitude.value = data.altitude;
	bearing_gauge.value = data.heading;

	// New six-pack gauges - all driven by fields added in the
	// schema-driven cvfr-bridge backend (see github.com/msupino/cvfr-bridge).
	// Each setter is guarded against missing fields so the page degrades
	// gracefully if it's pointed at an old-schema bridge.
	if (typeof data.vsi === "number" && typeof vsi_gauge !== "undefined") {
		// VSI gauge is now calibrated in raw fpm (ticks 0..2000 with
		// labels showing thousands), so just pass through and clamp.
		vsi_gauge.value = Math.max(-2000, Math.min(2000, data.vsi));
	}
	if (typeof data.roll === "number" && typeof turn_coordinator !== "undefined") {
		// New custom-canvas TC takes raw bank degrees (positive = right wing
		// down, mirroring the iPad-app convention). The aircraft silhouette
		// inside the TC rotates by this value; Rate-1 turn is at ±15 deg.
		turn_coordinator.value = data.roll;
	}
	if (typeof attitude_indicator !== "undefined" &&
	    (typeof data.pitch === "number" || typeof data.roll === "number")) {
		attitude_indicator.value = { pitch: data.pitch || 0, roll: data.roll || 0 };
	}

	// Overlay readouts - small text on existing instruments.
	if (typeof data.qnh === "number") {
		var k = document.getElementById("qnh_kollsman");
		if (k) k.textContent = data.qnh.toFixed(2);
	}
	if (typeof data.variation === "number") {
		var v = document.getElementById("variation_text");
		if (v) {
			var sign = data.variation >= 0 ? "E" : "W";
			v.textContent = "VAR " + Math.abs(data.variation).toFixed(1) + "\u00B0" + sign;
		}
	}
	// Sim connection LED. Field is `sim_ready`; old bridges without
	// the field default to "on" (treat as connected since data flows).
	var led = document.getElementById("sim_status");
	if (led) {
		var ok = (data.sim_ready === undefined) ? true : !!data.sim_ready;
		led.classList.toggle("sim-status-on",  ok);
		led.classList.toggle("sim-status-off", !ok);
		led.title = ok ? "Sim connected" : "Sim not ready (showing fallback position)";
	}
}

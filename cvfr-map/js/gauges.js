document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("gauges-window").addEventListener("click", openCloseGaugesWindow);
});

function openCloseGaugesWindow(button){
	window_isOpen = button.srcElement.checked;
	let gaugesDiv = document.querySelector(".gauges-div");
	if (window_isOpen) {
		 gaugesDiv.classList.add("gauges-div-show");
	} else {
		 gaugesDiv.classList.remove("gauges-div-show");
	}

}

L.Control.Gauges = L.Control.extend({
	onAdd: function(map) {
		var div = L.DomUtil.create('div');
		div.classList.add("gauges-div", "leaflet-control");
		div.innerHTML = document.querySelector(".gauges-div").innerHTML;
		document.querySelector(".gauges-div").remove();
		return div;
	},

	onRemove: function(map) {
		// Nothing to do here
	}
});

L.control.gauges = function(opts) {
	return new L.Control.Gauges(opts);
}

L.control.gauges({
	position: 'bottomleft'
}).addTo(map);

var bearing_gauge = new RadialGauge({
	renderTo: "bearing",
	height: 170,
	width: 200,
	minValue: 0,
	maxValue: 360,
	majorTicks: [
		"N",
		"3",
		"6",
		"E",
		"12",
		"15",
		"S",
		"21",
		"24",
		"W",
		"30",
		"33",
		"N"
],
	minorTicks: 4,
	ticksAngle: 360,
	startAngle: 180,
	strokeTicks: false,
	highlights: false,
	colorPlate: "#1a1a1a",
	colorMajorTicks: "#f5f5f5",
	colorMinorTicks: "#ddd",
	colorNumbers: "#ccc",
	colorNeedle: "white",
	colorNeedleEnd: "white",
	valueBox: false,
	valueTextShadow: false,
	colorCircleInner: "#fff",
	colorNeedleCircleOuter: "#ccc",
	needleCircleSize: 15,
	needleCircleOuter: false,
	animationRule: "linear",
	needleType: "line",
	needleStart: 75,
	needleEnd: 99,
	needleWidth: 3,
	borders: false,
	borderInnerWidth: 0,
	borderMiddleWidth: 0,
	borderOuterWidth: 5,
	colorBorderOuter: "#ccc",
	colorBorderOuterEnd: "#ccc",
	colorNeedleShadowDown: "#222",
	borderShadowWidth: 0,
	animationTarget: "plate",
	animationDuration: 1500,
	title: "HEADING",
	fontTitleSize: 19,
	colorTitle: "white",
}).draw();

var big_altitude = new RadialGauge({
	renderTo: "big_altitude",
	height: 170,
	width: 200,
	minValue: 0,
	maxValue: 1000,
	majorTicks: [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
],
	minorTicks: 4,
	ticksAngle: 360,
	startAngle: 180,
	strokeTicks: false,
	highlights: false,
	colorPlate: "#1a1a1a",
	colorMajorTicks: "#f5f5f5",
	colorMinorTicks: "#ddd",
	colorNumbers: "#ccc",
	colorNeedle: "white",
	colorNeedleEnd: "white",
	valueBox: false,
	valueTextShadow: false,
	colorCircleInner: "#fff",
	colorNeedleCircleOuter: "#ccc",
	needleCircleSize: 15,
	needleCircleOuter: false,
	animationRule: "linear",
	needleType: "arrow",
	needleStart: 0,
	needleEnd: 85,
	needleWidth: 5,
	borders: false,
	borderInnerWidth: 0,
	borderMiddleWidth: 0,
	borderOuterWidth: 5,
	colorBorderOuter: "#ccc",
	colorBorderOuterEnd: "#ccc",
	colorNeedleShadowDown: "#222",
	borderShadowWidth: 0,
	animationDuration: 1500,
	title: "ALTITUDE",
	fontTitleSize: 19,
	colorTitle: "white",
	units: "Feet"
}).draw();

var small_altitude = new RadialGauge({
	renderTo: "small_altitude",
	height: 170,
	width: 200,
	valueBox: false,
	minValue: 0,
	maxValue: 1000,
	majorTicks: [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
],
	minorTicks: 4,
	ticksAngle: 360,
	startAngle: 180,
	strokeTicks: false,
	highlights: false,
	colorPlate: "transparent",
	colorMajorTicks: "transparent",
	colorMinorTicks: "transparent",
	colorNumbers: "transparent",
	colorNeedle: "white",
	colorNeedleEnd: "white",
	valueTextShadow: false,
	colorCircleInner: "transparent",
	colorNeedleCircleOuter: "transparent",
	needleCircleSize: 15,
	needleCircleOuter: false,
	animationRule: "linear",
	needleType: "arrow",
	needleStart: 0,
	needleEnd: 55,
	needleWidth: 5,
	borders: false,
	borderInnerWidth: 0,
	borderMiddleWidth: 0,
	borderOuterWidth: 5,
	colorBorderOuter: "transparent",
	colorBorderOuterEnd: "transparent",
	colorNeedleShadowDown: "transparent",
	borderShadowWidth: 0,
	animationDuration: 1500,
}).draw();

var speed_gauge = new RadialGauge({
    renderTo: 'speedometer',
		height: 170,
    width: 200,
    units: "Knots",
    minValue: 0,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    /* Cessna 172 V-speed arcs (POH section 2):
     *   white arc  Vs0..Vfe        33..85   full-flap stall to max-flap-extend
     *   green arc  Vs1..Vno        47..129  clean stall to max struct cruise
     *   yellow arc Vno..Vne       129..163  caution range, smooth air only
     *   red line   Vne                 163  never exceed
     * canvas-gauges renders highlights as outer arcs in their own ring,
     * so the white/green/yellow arcs visually layer like the markings
     * painted onto a real ASI bezel even though they overlap on value. */
    highlights: [
        { from:  33, to:  85, color: "rgba(255, 255, 255, 0.85)" },
        { from:  47, to: 129, color: "rgba(50,  200,  50, 0.55)" },
        { from: 129, to: 163, color: "rgba(220, 200,  50, 0.65)" },
        { from: 163, to: 165, color: "rgba(220,  40,  40, 0.95)" },
        { from: 163, to: 220, color: "rgba(220,  40,  40, 0.5)"  }
    ],
    colorPlate: "#1a1a1a",
    needleType: "arrow",
		colorNeedle: "white",
		colorNeedleEnd: "white",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 1500,
    animationRule: "linear",
		colorMajorTicks: "#f5f5f5",
		colorMinorTicks: "#ddd",
		colorNumbers: "#ccc",
		borders: false,
		borderInnerWidth: 0,
		borderMiddleWidth: 0,
		borderOuterWidth: 5,
		colorBorderOuter: "#ccc",
		colorBorderOuterEnd: "#ccc",
		colorNeedleShadowDown: "#222",
		borderShadowWidth: 0,
		animationDuration: 1500,
		title: "SPEED",
		fontTitleSize: 19,
		colorTitle: "white",
		valueBox: false
}).draw();

// =============================================================================
// New six-pack instruments: VSI, Turn Coordinator, Attitude Indicator
// Driven by the new fields in github.com/msupino/cvfr-bridge schema.json:
//   vsi, pitch, roll
// Plus overlay readouts for qnh, variation, sim_ready (handled in
// simconnection.js setAircraftData).
// =============================================================================

// --- Vertical Speed Indicator ----------------------------------------------
// Real-Cessna VSI layout: 0 fpm sits at the 9 o'clock position (horizontal
// needle pointing LEFT at level flight), climb numbers wrap upward through
// 12 o'clock, descent numbers wrap downward through 6 o'clock. Range is
// ±2000 fpm displayed as ±20 (units of 100 fpm). The right half of the
// dial is unmarked (matches a real pneumatic VSI face).
//
// canvas-gauges geometry: angles are clockwise from 12 o'clock. To put
// -20 at 6 o'clock and sweep clockwise (6 -> 9 -> 12) up to +20:
//   startAngle = 180   (6 o'clock = where min value sits)
//   ticksAngle = 180   (180-degree arc, ending at 12 o'clock)
// The 9-tick array places "0" at the midpoint = 9 o'clock = horizontal.
var vsi_gauge = new RadialGauge({
    renderTo: 'vsi_gauge',
    height: 170,
    width: 200,
    units: "x100 fpm",
    minValue: -20,
    maxValue: 20,
    majorTicks: ["-20","-15","-10","-5","0","5","10","15","20"],
    minorTicks: 5,
    strokeTicks: true,
    ticksAngle: 180,
    startAngle: 180,
    highlights: [
        { from: -20, to: -15, color: "rgba(200, 50, 50, .75)" },
        { from:  15, to:  20, color: "rgba(200, 50, 50, .75)" }
    ],
    colorPlate: "#1a1a1a",
    needleType: "arrow",
    colorNeedle: "white",
    colorNeedleEnd: "white",
    needleWidth: 3,
    needleCircleSize: 8,
    animationDuration: 800,
    animationRule: "linear",
    colorMajorTicks: "#f5f5f5",
    colorMinorTicks: "#ddd",
    colorNumbers: "#ccc",
    borders: false,
    borderInnerWidth: 0,
    borderMiddleWidth: 0,
    borderOuterWidth: 5,
    colorBorderOuter: "#666",
    colorBorderOuterEnd: "#444",
    title: "VERT SPEED",
    fontTitleSize: 16,
    colorTitle: "white",
    valueBox: false
}).draw();

// --- Turn Coordinator ------------------------------------------------------
// Real Cessna TC: a small airplane silhouette in the upper half of the
// dial that BANKS LEFT/RIGHT, plus an inclinometer ball ("step on the
// ball" trainer's mantra) in the lower half. White marks at L and R bank
// angles where the wing tip aligns = a Rate-1 turn (3 deg/s, ~15 deg
// bank at 100 KTAS in a Cessna 172).
//
// Implementation note: cvfr-bridge schema doesn't include yaw_rate yet,
// so the airplane banks with the actual roll angle. This is fine for a
// VFR moving-map use case (visual cue that you're turning) but not a
// faithful TC simulation - a real TC reads yaw_rate, not roll. Inclino-
// meter ball is centered (ideal coordinated turn) since we don't have
// lateral acceleration data either.
var turn_coordinator = (function() {
    var canvas = document.getElementById('turn_coordinator');
    if (!canvas) return { value: function(){} };
    canvas.width = 200; canvas.height = 170;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cx = W / 2, cy = H / 2;
    var R = Math.min(W, H) / 2 - 8;
    var bank = 0;   // degrees of bank, set via .value setter

    function draw() {
        // Clear first so resize/redraw doesn't ghost, then paint an
        // opaque matte-black CIRCULAR dial face (real-Cessna look) so
        // tick marks and the airplane silhouette stay legible against
        // the satellite map. Outside the circle stays clear so the map
        // shows through and remains pannable in the gaps. Clip to the
        // face so subsequent draws can't bleed onto the map.
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
        ctx.clip();

        // Title text
        ctx.fillStyle = "white";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TURN COORDINATOR", cx, cy - R + 18);

        // Center "L" "R" labels for the bank-rate marks
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#aaa";
        ctx.fillText("L", cx - 50, cy - 8);
        ctx.fillText("R", cx + 50, cy - 8);

        // Rate-1 bank marks - small white tick at -15 deg and +15 deg from
        // vertical, where a 15-deg bank (Rate-1 turn) puts the wing tip
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        for (var sign of [-1, 1]) {
            var a = sign * 15 * Math.PI / 180;   // 15 deg from vertical
            var x1 = cx + (R - 4)  * Math.sin(a);
            var y1 = cy - (R - 4)  * Math.cos(a);
            var x2 = cx + (R - 16) * Math.sin(a);
            var y2 = cy - (R - 16) * Math.cos(a);
            ctx.beginPath();
            ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        // Center top mark (zero-bank reference)
        ctx.beginPath();
        ctx.moveTo(cx, cy - R + 4); ctx.lineTo(cx, cy - R + 14);
        ctx.stroke();

        // Banking airplane silhouette - rotates around (cx, cy) by `bank`
        ctx.save();
        ctx.translate(cx, cy - 12);
        ctx.rotate(bank * Math.PI / 180);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        // Wings
        ctx.beginPath();
        ctx.moveTo(-50, 0); ctx.lineTo(50, 0);
        ctx.stroke();
        // Fuselage center dot
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2 * Math.PI); ctx.fill();
        // Tail (vertical stabilizer hint)
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -8);
        ctx.stroke();
        ctx.restore();

        // Inclinometer ball at bottom - shown centered (no lateral accel data)
        ctx.save();
        ctx.translate(cx, cy + R - 24);
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.roundRect(-30, -6, 60, 12, 6);
        ctx.fill();
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Ball
        ctx.fillStyle = "#000";
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, 2 * Math.PI); ctx.fill();
        // Inclinometer reference lines
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        for (var x of [-7, 7]) {
            ctx.beginPath();
            ctx.moveTo(x, -6); ctx.lineTo(x, 6);
            ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
    }

    draw();
    return {
        set value(v) { bank = (typeof v === "number") ? v : 0; draw(); }
    };
})();

// --- Attitude Indicator (artificial horizon) -------------------------------
// canvas-gauges has no AI primitive, so this is hand-rolled on a 200x170
// canvas. Sky-blue + ground-brown wedges that translate vertically with
// pitch and rotate together with roll. Standard tape markers at ±10/20/30°
// of bank along the top, pitch ladder at ±5/10/15/20° around the centre.
//
// All scaling/colors mirror the typical light-aircraft instrument look so
// it visually matches the other RadialGauge instruments.
var attitude_indicator = (function() {
    var canvas = document.getElementById('attitude_indicator');
    if (!canvas) return { value: function(){} };
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cx = W / 2, cy = H / 2;
    var R = Math.min(W, H) / 2 - 8;
    var pitch = 0, roll = 0;
    var PIX_PER_DEG = R / 35;   // 35° of pitch fills the half-instrument

    function draw() {
        // Clear first so resize/redraw doesn't ghost, then paint an
        // opaque matte-black CIRCULAR dial face under the sky/ground
        // wedges. The wedges fully cover the face during normal
        // operation, but the explicit fill is defensive (e.g. if the
        // pitch translate ever leaves a sliver uncovered) and keeps
        // this canvas visually identical to the RadialGauge plates.
        // Everything outside the circle stays clear so the map shows
        // through and remains pannable in the gaps between gauges.
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
        ctx.clip();

        // Rotate the world for roll, then translate for pitch
        ctx.translate(cx, cy);
        ctx.rotate(-roll * Math.PI / 180);
        ctx.translate(0, pitch * PIX_PER_DEG);

        // Sky (top half) and ground (bottom half)
        ctx.fillStyle = "#3a78c2";
        ctx.fillRect(-W, -H * 2, W * 2, H * 2);
        ctx.fillStyle = "#7a4a1a";
        ctx.fillRect(-W, 0, W * 2, H * 2);

        // Horizon line
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-W, 0); ctx.lineTo(W, 0);
        ctx.stroke();

        // Pitch ladder: tick every 5° from -25° to +25°
        ctx.fillStyle = "white";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.lineWidth = 1.5;
        for (var p = -25; p <= 25; p += 5) {
            if (p === 0) continue;
            var y = -p * PIX_PER_DEG;
            var len = (p % 10 === 0) ? 30 : 15;
            ctx.beginPath();
            ctx.moveTo(-len, y); ctx.lineTo(len, y);
            ctx.stroke();
            if (p % 10 === 0) {
                ctx.fillText(Math.abs(p), -len - 12, y + 3);
                ctx.fillText(Math.abs(p), len + 12, y + 3);
            }
        }

        ctx.restore();   // stop pitch translate + roll rotate

        // Bank angle scale + roll pointer (fixed, doesn't roll with sky)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        var bankTicks = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];
        for (var b of bankTicks) {
            var a = (b - 90) * Math.PI / 180;
            var len = (Math.abs(b) === 30 || Math.abs(b) === 60) ? 12 : 6;
            var rOuter = R - 2;
            var rInner = R - 2 - len;
            ctx.beginPath();
            ctx.moveTo(rOuter * Math.cos(a), rOuter * Math.sin(a));
            ctx.lineTo(rInner * Math.cos(a), rInner * Math.sin(a));
            ctx.stroke();
        }
        // Sky pointer at top - rotates with roll
        ctx.rotate(-roll * Math.PI / 180);
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, -R + 4);
        ctx.lineTo(-6, -R + 14);
        ctx.lineTo( 6, -R + 14);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Aircraft symbol (yellow wings + dot, fixed in centre, never rotates)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = "#ffcc00";
        ctx.fillStyle = "#ffcc00";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-50, 0); ctx.lineTo(-20, 0);
        ctx.moveTo( 20, 0); ctx.lineTo( 50, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, 2 * Math.PI); ctx.fill();
        ctx.restore();

        // Outer bezel
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, R + 1, 0, 2 * Math.PI);
        ctx.stroke();
    }

    draw();
    return {
        // value setter mirrors RadialGauge's API (gauge.value = N) but takes
        // a {pitch, roll} object so the simconnection.js update site can
        // do attitude_indicator.value({pitch: data.pitch, roll: data.roll})
        set value(v) {
            pitch = v.pitch || 0;
            roll  = v.roll  || 0;
            draw();
        }
    };
})();

window.addEventListener("load", function() {
  var i, start;

  function test_RafFps() {
    var data = new Array(200);
    var avg = 0;

    i = 0;
    start = null;

    function RafFps(timestamp) {
      var now = performance.now();
      if (!start) {
        start = now;
      } else {
        var d = now - start;

        // Store
        data[i++] = d;

        // Roll over
        start = now;

        // Calc avg frame time
        avg += d;

        // Display avg frame time
        document.body.firstChild.textContent = "FPS: " + (1000 / (avg / i)).toFixed(1);
      }

      // Continue
      if (i < data.length) {
        window.requestAnimationFrame(RafFps);
      }
    }

    window.requestAnimationFrame(RafFps);
  }

  function test_DeviceMotionFps() {
    var data = new Array(100);
    var avg = 0;

    i = 0;
    start = null;

    motionCB = function() {
      var now = performance.now();
      if (!start) return (start = now);

      if (i < data.length) {
        var d = now - start;

        // Store
        data[i++] = d;

        // Roll over
        start = now;

        // Calc avg frame time
        avg += d;

        // Display avg frame time
        //document.body.textContent = "FPS: " + (avg / i).toFixed(2);
        document.body.firstChild.textContent = "FPS: " + (1000 / (avg / i)).toFixed(1);

      } else {
        window.removeEventListener("devicemotion", motionCB );
      }
    }

    window.addEventListener("devicemotion", motionCB, true);
  }

  function test_DeviceOrientationFps() {
    var data = new Array(100);
    var avg = 0;

    i = 0;
    start = null;

    CB = function() {
      var now = performance.now();
      if (!start) return (start = now);

      if (i < data.length) {
        var d = now - start;

        // Store
        data[i++] = d;

        // Roll over
        start = now;

        // Calc avg frame time
        avg += d;

        // Display avg frame time
        //document.body.textContent = "FPS: " + (avg / i).toFixed(2);
        document.body.firstChild.textContent = "FPS: " + (1000 / (avg / i)).toFixed(1);

      } else {
        window.removeEventListener("deviceorientation", CB );
      }
    }

    window.addEventListener("deviceorientation", CB, true);
  }

  function test_VRPositionSensorFps() {
    var data = new Array(500);
    var avg = 0;
    var c = 0;
    var prev = null;

    i = 0;
    start = null;

    // Find VR Position sensor
    var vrHMD, vrPositionSensor;

    if (!("getVRDevices" in navigator)) return alert("WebVR API not supported!");
    
    navigator.getVRDevices().then(function(devices) {
      for (var dev = 0; dev < devices.length; ++dev) {
        if (devices[dev] instanceof HMDVRDevice) {
          vrHMD = devices[dev];
          break;
        }
      }

      if (vrHMD) {
        for (var dev = 0; dev < devices.length; ++dev) {
          if (devices[dev] instanceof PositionSensorVRDevice && devices[dev].hardwareUnitId === vrHMD.hardwareUnitId) {
            vrPositionSensor = devices[dev];
            break;
          }
        }
      }

      if (vrPositionSensor) {
        window.requestAnimationFrame(pollVRSensor);
      } else {
        return alert("No VR positioning device found!");
      }

    });

    // Poll VR sensor
    function pollVRSensor() {
      var now = performance.now();

      var s = vrPositionSensor.getState();
      //console.log(s.orientation, now);

      if (!prev) {
        prev = s.orientation;
      }

      // State changed
      if (
        prev.x !== s.orientation.x ||
        prev.y !== s.orientation.y ||
        prev.z !== s.orientation.z ||
        prev.w !== s.orientation.w
      ) {
        if (!start) {
          start = now;
        } else {
          var d = now - start;
          data[i++] = d;
          avg += d;

          start = now;

          // Display avg frame time
          //document.body.firstChild.textContent = "Rate: " + (avg / i).toFixed(2);
          document.body.firstChild.textContent = "FPS: " + (1000 / (avg / i)).toFixed(1);
        }
      }

      // Store current state
      prev = s.orientation;

      // Continue
      if (i < data.length) {
        window.requestAnimationFrame(pollVRSensor);
      }
    }
  }
  
  document.getElementById("raf").onclick = test_RafFps;
  document.getElementById("devicemotion").onclick = test_DeviceMotionFps;
  document.getElementById("deviceorientation").onclick = test_DeviceOrientationFps;
  document.getElementById("vrsensor").onclick = test_VRPositionSensorFps;
});

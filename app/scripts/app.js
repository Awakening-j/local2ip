
var _ip;

getLocalIPs( ips => {
  _ip = ips[0]
})

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}

function requestFilter(request) {
  if(AppUtils.isLocalhost(request.url)) {
    return {
        redirectUrl : request.url.replace(AppUtils.LOCALHOST, _ip)
    };
  }
}

let listener = (details)=> {
  return requestFilter(details)
}

let addListener = ()=> {
  chrome.webRequest.onBeforeRequest.addListener(listener,
      {
          urls : ["<all_urls>"]
      },
      ["blocking"]
  );
}

let removeListener = ()=> {
  chrome.webRequest.onBeforeRequest.removeListener(listener,
      {
          urls : ["<all_urls>"]
      },
      ["blocking"]
  );
}

let setIcon = (path)=> {
  chrome.browserAction.setIcon({
      path: path
  }, function(){});
}

let App = {
  turnOff: ()=> {
    removeListener();
    setIcon('/images/icon-19-inactive.png')
    AppService.set('local2ip', false);
  },
  turnOn: ()=> {
    addListener()
    setIcon('/images/icon-19.png')
    AppService.set('local2ip', true);
  }
}

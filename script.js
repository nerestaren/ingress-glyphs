var canvas, canvasbg, canvasg;
var ctx, ctbg, ctg;
var callibrationGrid, background;
var grid = [
    [253, 256],         //
    [324, 217],         //
    [324, 296],         //          10
    [184, 296],         //  5               9
    [184, 217],         //      4       1
    [114, 175],         //          0
    [114, 336],         //      3       2
    [253, 417],         //  6               8
    [394, 336],         //          7
    [394, 175],         //
    [253, 94]           //
];

var bgcolor = [];
var currentGlyph = undefined;

var map, currentInfowindow;

function glyphName(a) {
    /*var s = a.split('_');
    var r = s[0].substr(0, 1).toUpperCase() + s[0].substr(1);;
    for (var i = 1; i < s.length; i++) {
        r += ' - ' + s[i].substr(0, 1).toUpperCase() + s[i].substr(1);
    }
    return r;*/
    var r = a.charAt(0).toUpperCase();
    var i = 1;
    while (i < a.length) {
        var c = a.charAt(i);
        if (c === '_') {
            i++;
            r += ' / ' + a.charAt(i).toUpperCase();
        } else if (c == c.toUpperCase()) {
            r += ' ' + c.toLowerCase();
        } else {
            r += c;
        }
        i++;
    }
    return r;
}

function splitColor(c) {
    return [
        parseInt(c.substr(1, 2), 16),
        parseInt(c.substr(3, 2), 16),
        parseInt(c.substr(5, 2), 16)
    ];
}

$(document).ready(function() {
    
    // Init canvas'es
    // Main canvas
    canvas = $('#canvas')[0];
    ctx = canvas.getContext('2d');
    
    // Background canvas (not visible)
    canvasbg = document.createElement('canvas');
    ctbg = canvasbg.getContext('2d');
    //$('form')[0].appendChild(canvasbg);
    canvasbg.width = '512';
    canvasbg.height = '512';
    
    // Glyph canvas (not visible)
    canvasg = document.createElement('canvas');
    ctg = canvasg.getContext('2d');
    //$('form')[0].appendChild(canvasg);
    canvasg.width = '512';
    canvasg.height = '512';
    
    // Background image
    background = new Image();
    background.src = backgroundsrc;
    
    // Callibration grid
    callibrationGrid = new Image();
    callibrationGrid.src = callibrationsrc;
    
    // Populate glyph dropdown
    $.each(glyphs, function(a) {
        $('#glyph').append($('<option>').val(a).text(glyphName(a)));
    });
    
    // Current glyph value
    currentGlyph = $('#glyph').val();
    
    // Background color value
    bgcolor = splitColor($('#colorpicker').val());
    
    // Get last used values
    var zoom = null, lat = null, lng = null;
    if (typeof(Storage) !== 'undefined') {
        lat = localStorage.getItem('lat');
        lng = localStorage.getItem('lng');
        zoom = localStorage.getItem('zoom');
        if (localStorage.getItem('currentGlyph') !== null) {
            currentGlyph = localStorage.getItem('currentGlyph');
            $('#glyph').val(currentGlyph);
        }
        if (localStorage.getItem('bgcolor') !== null) {
            var t = localStorage.getItem('bgcolor');
            bgcolor = splitColor(t);
            $('#colorpicker').val(t);
        }
    }
    
    // Draw elements
    drawBackground(canvasbg, bgcolor);
    drawGlyph(canvasg, currentGlyph);
    mix();
        
    // Init map
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: zoom !== null ? parseInt(zoom) : 9,
        center: new google.maps.LatLng(lat !== null ? lat : 39.569411, lng !== null ? lng : 2.650168),
        styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#a4b0b0"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"weight":"1.5"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#9a9a9a"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"color":"#223030"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#38a6a6"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#52c2c2"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#38a6a6"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#38a6a6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#080b0b"},{"weight":"0.80"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#3f3f3f"},{"weight":"0.50"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#080b0b"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#2c3434"},{"weight":"0.41"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c6d4ec"}]}]
    });
    
    var iitc = [];
    
    for (var i = 0; i < missions.length; i++) {
        var regex = /&pls=(\d*\.\d*,\d*\.\d*,\d*\.\d*,\d*\.\d*(?:_\d*\.\d*,\d*\.\d*,\d*\.\d*,\d*\.\d*)+)/;
        var matches = regex.exec(missions[i].portals);
        var linksRaw = matches[1].split('_');
        
        //var path = [];
        var coords = linksRaw[0].split(',');
        /*path.push(new google.maps.LatLng(coords[0], coords[1]));
        path.push(new google.maps.LatLng(coords[2], coords[3]));*/
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coords[0], coords[1]),
            map: map,
            title: glyphName(missions[i].glyph)
        });
        
        (function (marker, mission) {
            google.maps.event.addListener(marker, 'click', function() {
                if (currentInfowindow !== undefined) {
                    currentInfowindow.close();
                }
                currentInfowindow = new google.maps.InfoWindow({
                    content: '\
                        <div class="in-infowindow">\
                            <h3><b>' + glyphName(mission.glyph) + '</b></h3>\
                            <canvas id="mission-canvas" width="128" height="128"></canvas><br>\
                            <a href="' + mission.portals + '" target="_blank">Intel link (portals)</a><br>\
                            <a href="' + mission.link + '" target="_blank">Intel link (mission)</a>\
                        </div>'
                });;
                google.maps.event.addListener(currentInfowindow, 'domready', function () {
                    drawMissionCanvas(mission);
                });
                currentInfowindow.open(map, marker);
            });
        })(marker, missions[i]);
        
        
        iitc.push({
            type: 'marker',
            latLng: {
                lat: coords[0],
                lng: coords[1]
            },
            color: missions[i].color
        });
        
        iitc.push({
            type: 'polyline',
            latLngs: [
                {
                    lat: coords[0],
                    lng: coords[1]
                },
                {
                    lat: coords[2],
                    lng: coords[3]
                }
            ],
            color: missions[i].color
        });
        
        for (var l = 0; l < linksRaw.length; l++) {
            var coords = linksRaw[l].split(',');
            var path = [
                new google.maps.LatLng(coords[0], coords[1]),
                new google.maps.LatLng(coords[2], coords[3])
            ];
        
            var polyLine = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: missions[i].color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
        
            iitc.push({
                type: 'polyline',
                latLngs: [
                    {
                        lat: coords[0],
                        lng: coords[1]
                    },
                    {
                        lat: coords[2],
                        lng: coords[3]
                    }
                ],
                color: missions[i].color
            });
        }
    }
    
    $('#iitc').val(JSON.stringify(iitc));
    
    google.maps.event.addListener(map, 'click', function() {
        if (currentInfowindow !== undefined) {
            currentInfowindow.close();  
        }
    });
    
    if (typeof(Storage) !== 'undefined') {
        google.maps.event.addListener(map, 'center_changed', function() {
            var center = map.getCenter();
            localStorage.setItem('lat', center.lat());
            localStorage.setItem('lng', center.lng());
        });
        google.maps.event.addListener(map, 'zoom_changed', function() {
            localStorage.setItem('zoom', map.getZoom());
        });
    }
});

function drawBackground(canvas, color) {
    var ct = canvas.getContext('2d');
    ct.clearRect(0, 0, canvas.width, canvas.height);
    ct.drawImage(background, 0, 0, canvas.width, canvas.height);
    var imgdata = ct.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imgdata.data;
    
    var r, g, b, br, bg, bb;
    for (var i = 0, il = pixels.length; i < il; i += 4) {
        pixels[i] = hardLight(pixels[i], color[0]);
        pixels[i + 1] = hardLight(pixels[i + 1], color[1]);
        pixels[i + 2] = hardLight(pixels[i + 2], color[2]);
    }
    
    
    ct.putImageData(imgdata, 0, 0);
    ct.drawImage(callibrationGrid, 0, 0, canvas.width, canvas.height);
}

function drawGlyph(canvas, glyph) {
    if (glyph !== undefined) {
        var ct = canvas.getContext('2d');
        var path = glyphs[glyph];
        for (var i = 1; i < path.length; i++) {
            var a = grid[path[i - 1]];
            var x1 = a[0]; var y1 = a[1];
            var b = grid[path[i]];
            var x2 = b[0]; var y2 = b[1];

            var dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

            for (var j = 0; j < dist / 2; j++) {
                var t = j / (dist / 2);
                var t1 = 1 - t;
                var x = t1 * x1 + t * x2 + Math.random() * 10 - 5;
                var y = t1 * y1 + t * y2 + Math.random() * 10 - 5;
                drawPoint(ct, x, y);
            }
        }
    }
}

function drawMissionCanvas(mission) {
    var c = document.getElementById('mission-canvas');
    var color = splitColor(mission.color)
    drawBackground(c, color);
    
    var aux = document.createElement('canvas');
    aux.width = '512';
    aux.height = '512';
    drawGlyph(aux, mission.glyph);
    var tmp = new Image();
    tmp.src = aux.toDataURL("image/png");
    c.getContext('2d').drawImage(tmp, 0, 0, 512, 512, 0, 0, 128, 128);
}

function mix() {
    ctx.putImageData(ctbg.getImageData(0, 0, 512, 512), 0, 0);
    var tmp = new Image();
    tmp.src = canvasg.toDataURL("image/png");
    ctx.drawImage(tmp, 0, 0);
}

function hardLight(b, a) {
    return b < 128
        ? (2 * a * b / 255)
        : (255 - 2 * (255 - a) * (255 - b) / 255);
}

function drawPoint(ct, x, y) {
    ct.beginPath();
    ct.arc(x, y, 2.5, 0, Math.PI * 2, true);
    ct.closePath();
    ct.fillStyle = '#FFFFFF';
    ct.shadowColor = 'rgb(221, 163, 121)';
    ct.shadowBlur = 16;
    ct.shadowOffsetX = 0;
    ct.shadowOffsetY = 0;
    ct.strokeStyle = 'rgb(255, 209, 176)';
    ct.stroke();
    ct.fill();
}

function refresh() {
    ctg.clearRect(0, 0, 512, 512);
    drawGlyph(canvasg, currentGlyph);
    mix();
}
    
function changeBgColor() {
    var t = $('#colorpicker').val();
    
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('bgcolor', t);
    }
    
    bgcolor[0] = parseInt(t.substr(1, 2), 16);
    bgcolor[1] = parseInt(t.substr(3, 2), 16);
    bgcolor[2] = parseInt(t.substr(5, 2), 16);
    
    drawBackground(canvasbg, bgcolor);
    mix();
}

function changeGlyph() {
    currentGlyph = $('#glyph').val();
    
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('currentGlyph', currentGlyph);
    }
    
    ctg.clearRect(0, 0, 512, 512);
    drawGlyph(canvasg, currentGlyph);
    mix();
}

function doDownload() {
    var dataURL = canvas.toDataURL('image/png');
    $('#download')[0].href = dataURL;
    $('#download')[0].download = currentGlyph + '.png';
}
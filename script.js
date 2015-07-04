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
    var s = a.split('_');
    var r = s[0].substr(0, 1).toUpperCase() + s[0].substr(1);;
    for (var i = 1; i < s.length; i++) {
        r += ' - ' + s[i].substr(0, 1).toUpperCase() + s[i].substr(1);
    }
    return r;
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
    var t = $('#colorpicker').val();
    bgcolor[0] = parseInt(t.substr(1, 2), 16);
    bgcolor[1] = parseInt(t.substr(3, 2), 16);
    bgcolor[2] = parseInt(t.substr(5, 2), 16);
    
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
            bgcolor[0] = parseInt(t.substr(1, 2), 16);
            bgcolor[1] = parseInt(t.substr(3, 2), 16);
            bgcolor[2] = parseInt(t.substr(5, 2), 16);
            $('#colorpicker').val(t);
        }
    }
    
    // Draw elements
    drawBackground();
    drawGlyph();
    mix();
        
    // Init map
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: zoom !== null ? parseInt(zoom) : 9,
        center: new google.maps.LatLng(lat !== null ? lat : 39.569411, lng !== null ? lng : 2.650168),
        styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#a4b0b0"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"weight":"1.5"}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#9a9a9a"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#191f1f"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#0c0e0e"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"color":"#223030"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#38a6a6"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#52c2c2"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#38a6a6"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#38a6a6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#080b0b"},{"weight":"0.80"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#3f3f3f"},{"weight":"0.50"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#080b0b"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#2c3434"},{"weight":"0.41"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c6d4ec"}]}]
    });
    
    for (var i = 0; i < missions.length; i++) {
        var regex = /&pls=(\d*\.\d*,\d*\.\d*,\d*\.\d*,\d*\.\d*(?:_\d*\.\d*,\d*\.\d*,\d*\.\d*,\d*\.\d*)+)/;
        var matches = regex.exec(missions[i].portals);
        var linksRaw = matches[1].split('_');
        
        var path = [];
        var coords = linksRaw[0].split(',');
        path.push(new google.maps.LatLng(coords[0], coords[1]));
        path.push(new google.maps.LatLng(coords[2], coords[3]));
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coords[0], coords[1]),
            map: map,
            title: glyphName(missions[i].glyph)
        });
        
        var infowindow = new google.maps.InfoWindow({
            content: '<h3><b>' + glyphName(missions[i].glyph) + '</b></h3>\
                <a href="' + missions[i].portals + '" target="_blank">Intel link (portals)</a><br>\
                <a href="' + missions[i].link + '" target="_blank">Intel link (mission)</a>'
        });
        
        (function (marker, infowindow) {
            google.maps.event.addListener(marker, 'click', function() {
                if (currentInfowindow !== undefined) {
                    currentInfowindow.close();
                    currentInfowindow = undefined;
                }
                currentInfowindow = infowindow;
                infowindow.open(map, marker);
                drawMissionCanvas(glyph, color)
            });
        })(marker, infowindow);
        
        
        for (var l = 1; l < linksRaw.length; l++) {
            coords = linksRaw[l].split(',');
            path.push(new google.maps.LatLng(coords[2], coords[3]));
        }
        
        var polyLine = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: missions[i].color,
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
    }
    
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

function drawBackground() {
    ctbg.clearRect(0, 0, 512, 512);
    ctbg.drawImage(background, 0, 0);
    var imgdata = ctbg.getImageData(0, 0, 512, 512);
    var pixels = imgdata.data;
    
    var r, g, b, br, bg, bb;
    for (var i = 0, il = pixels.length; i < il; i += 4) {
        pixels[i] = hardLight(pixels[i], bgcolor[0]);
        pixels[i + 1] = hardLight(pixels[i + 1], bgcolor[1]);
        pixels[i + 2] = hardLight(pixels[i + 2], bgcolor[2]);
    }
    
    
    ctbg.putImageData(imgdata, 0, 0);
    ctbg.drawImage(callibrationGrid, 0, 0);
}

function drawGlyph() {
    if (currentGlyph !== undefined) {
        ctg.clearRect(0, 0, 512, 512);
        var path = glyphs[currentGlyph];
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
                drawPoint(x, y);
            }
        }
    }
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

function drawPoint(x, y) {
    ctg.beginPath();
    ctg.arc(x, y, 2.5, 0, Math.PI * 2, true);
    ctg.closePath();
    ctg.fillStyle = '#FFFFFF';
    ctg.shadowColor = 'rgb(221, 163, 121)';
    ctg.shadowBlur = 16;
    ctg.shadowOffsetX = 0;
    ctg.shadowOffsetY = 0;
    ctg.strokeStyle = 'rgb(255, 209, 176)';
    ctg.stroke();
    ctg.fill();
}

function refresh() {
    drawGlyph();
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
    
    drawBackground();
    mix();
}

function changeGlyph() {
    currentGlyph = $('#glyph').val();
    
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('currentGlyph', currentGlyph);
    }
    
    drawGlyph();
    mix();
}

function doDownload() {
    var dataURL = canvas.toDataURL('image/png');
    $('#download')[0].href = dataURL;
    $('#download')[0].download = currentGlyph + '.png';
}
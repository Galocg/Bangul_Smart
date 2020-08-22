var position = new naver.maps.LatLng(37.3595704, 127.105399); // 지도 중심 경위도
var markers = [],
    places = [],
    infoWindows = [],
    polypaths = [],
    polylines = [],
    category = ['카페', '식당', '공원'];

places.push({category: 0, name: '적당',Lat:37.5664910, Lng:126.9810422});
places.push({category: 0, name: '리에제',Lat:37.5648132, Lng:126.9764594});
places.push({category: 0, name: '커피엔시가렛',Lat:37.5627337, Lng:126.9740244});
places.push({category: 0, name: '블루보틀',Lat:37.5694936, Lng:126.9788681});

places.push({category: 1, name: '라카티나',Lat:37.5663080, Lng:126.9799748});
places.push({category: 1, name: '주옥',Lat:37.5647520, Lng:126.9780465});
places.push({category: 1, name: '이나니와요스케',Lat:37.5653757, Lng:126.9792023});

polypaths.push([ // 적당
    new naver.maps.LatLng(37.5667932, 126.9775137),
    new naver.maps.LatLng(37.5670398, 126.9775137),
    new naver.maps.LatLng(37.5670568, 126.978136),
    new naver.maps.LatLng(37.5669845, 126.9792035),
    new naver.maps.LatLng(37.5668995, 126.9798526),
    new naver.maps.LatLng(37.5668527, 126.9807592),
    new naver.maps.LatLng(37.5668272, 126.9810489),
    new naver.maps.LatLng(37.5666401, 126.9810381)
]); 

polypaths.push([ // 리에제
    new naver.maps.LatLng(37.5644332, 126.9767145),
    new naver.maps.LatLng(37.564446, 126.9766662),
    new naver.maps.LatLng(37.5648159, 126.9767977),
    new naver.maps.LatLng(37.5648478, 126.9764972)
]);

polypaths.push([ // 커피엔시가렛
    new naver.maps.LatLng(37.5628652, 126.9742053),
    new naver.maps.LatLng(37.5627514, 126.9740444)
]);

polypaths.push([ // 블루보틀
    new naver.maps.LatLng(37.5667804, 126.9772188),
    new naver.maps.LatLng(37.5694676, 126.9771758),
    new naver.maps.LatLng(37.5693316, 126.978871),
    new naver.maps.LatLng(37.5694761, 126.9788495)
]);

polypaths.push([ // 라카티나
    new naver.maps.LatLng(37.5663080, 126.9799748)
]);

polypaths.push([ // 주옥
    new naver.maps.LatLng(37.5647520, 126.9780465)
]);

polypaths.push([ // 이나니와요스케
    new naver.maps.LatLng(37.5653757, 126.9792023)
]);


var targetMap = document.getElementById('map');

var map = new naver.maps.Map(targetMap, {
    zoom: 15
});

var cafeHtml = '<a href="#" class="control"><span class="cafe inner">애견카페</span></a>';
var resHtml = '<a href="#" class="control"><span class="restaurant inner">식당</span></a>';
var parkHtml = '<a href="#" class="control"><span class="park inner">공원</span></a>';

naver.maps.Event.once(map, 'init_stylemap', function() {

    var cafeControl = new naver.maps.CustomControl(cafeHtml, {
        position: naver.maps.Position.TOP_LEFT
    });

    var resControl = new naver.maps.CustomControl(resHtml, {
        position: naver.maps.Position.TOP_LEFT
    });

    var parkControl = new naver.maps.CustomControl(parkHtml, {
        position: naver.maps.Position.TOP_LEFT
    });

    cafeControl.setMap(map);
    resControl.setMap(map);
    parkControl.setMap(map);

    naver.maps.Event.addDOMListener(cafeControl.getElement(), 'click', function() {

        infoWindows.forEach(function(infoWindow){
            if(infoWindow.getMap())
                infoWindow.close();
        });

        polylines.forEach(function(polyline){
            if(polyline.getVisible())
                polyline.setVisible(false);
        });

        markers.forEach(function(marker,idx){
            var infoWindow = infoWindows[idx];
            if(marker.category==0){
                if(infoWindow.getMap()){
                    infoWindow.close();
                    polylines[idx].setVisible(false);
                }

                marker.setVisible(true);
            }
            else{
                marker.setVisible(false);
            }
        });
    });

    naver.maps.Event.addDOMListener(resControl.getElement(), 'click', function() {

        infoWindows.forEach(function(infoWindow){
            if(infoWindow.getMap())
                infoWindow.close();
        });

        polylines.forEach(function(polyline){
            if(polyline.getVisible())
                polyline.setVisible(false);
        });

        markers.forEach(function(marker,idx){
            var infoWindow = infoWindows[idx];
            if(marker.category==1){
                if(infoWindow.getMap()){
                    infoWindow.close();
                    polylines[idx].setVisible(false);
                }

                marker.setVisible(true);
            }
            else{
                marker.setVisible(false);
            }
        });
    });

    naver.maps.Event.addDOMListener(parkControl.getElement(), 'click', function() {

        infoWindows.forEach(function(infoWindow){
            if(infoWindow.getMap())
                infoWindow.close();
        });

        polylines.forEach(function(polyline){
            if(polyline.getVisible())
                polyline.setVisible(false);
        });

        markers.forEach(function(marker,idx){
            var infoWindow = infoWindows[idx];
            if(marker.category==2){
                if(infoWindow.getMap()){
                    infoWindow.close();
                    polylines[idx].setVisible(false);
                }
                marker.setVisible(true);
            }
            else{
                marker.setVisible(false);
            }
        });
    });
});


places.forEach(function(place, idx){

    var LatLng = new naver.maps.LatLng(place.Lat, place.Lng),
        marker = new naver.maps.Marker({
                category : place.category,
                position: LatLng,
                map : map,
                visible : false,
        }),
        polyline = new naver.maps.Polyline({
            path : polypaths[idx],
            strokeColor: '#046DDD', 
            strokeOpacity: 0.8, 
            strokeWeight: 6,   
            map: map,
            visible : false
        });
        

    var contentHtml = '<div style="width:160px;text-align:center;padding:10px;">['+category[place.category]+'] <b>'+ place.name +'</b><br /><img src="./star.jpg" width="20px" height="20px" alt="rating"><span> 4.5</span></div>'
    
    var infoWindow = new naver.maps.InfoWindow({
        content: contentHtml
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
    polylines.push(polyline);

});

function clickHandler(idx){
    return function(e){
        var marker = markers[idx],
            infoWindow = infoWindows[idx],
            polyline = polylines[idx];

        if(infoWindow.getMap()){
            infoWindow.close();
        }  else{
            infoWindow.open(map, marker);
        }

        polylines.forEach(function(pl,i){ // polyline은 close, open 함수가 없어서 비슷하게 구현
            if(i!=idx)
                pl.setVisible(false);
            else
                pl.setVisible(!pl.getVisible());
        });

    }
}

markers.forEach(function(marker,idx){
    naver.maps.Event.addListener(marker, 'click', clickHandler(idx));
});
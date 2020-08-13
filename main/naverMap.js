window.onload = function(){
    var mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 14
    };
    
    var targetMap = document.getElementById('map');
    
    var map = new naver.maps.Map(targetMap, mapOptions);
};
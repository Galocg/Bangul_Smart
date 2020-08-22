# 메인서버
메인 서버는 카디바이스, 홈디바이스, 머신러닝 서버 간 데이터 교환이 가능하도록 합니다.

## 카디바이스
 - /home/check : 카디바이스에서 홈디바이스 상태를 체크하기 위한 URI
 - /kennel/check : 카디바이스에서 켄넬상태를 체크하기 위한 URI
 - /location/naverMap.js : 카디바이스에게 네이버지도 전송
 - /location/naverMap : 카디바이스에게 네이버지도 전송

## 홈디바이스
 - /home/state : 홈디바이스 상태 체크 및 데이터 가져오는 URI
 - /home/device : 홈디바이스  카메라 각도 제어를 위한 URI
 - /home/url : 홈디바이스 주소 전송용

## 켄넬
 - /kennel/url : 켄넬 주소 전달용

## 머신러닝 서버

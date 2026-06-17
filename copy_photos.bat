@echo off
set SRC=C:\Users\user-pc\OneDrive\문서\카카오톡 받은 파일
set DST=C:\Users\user-pc\Claude\Projects\cowork\images\cases
copy "%SRC%\KakaoTalk_20260616_153941_277_03.jpg" "%DST%\seongsu-01.jpg"
copy "%SRC%\KakaoTalk_20260616_153941_277_16.jpg" "%DST%\seongsu-02.jpg"
copy "%SRC%\KakaoTalk_20260616_153941_277_19.jpg" "%DST%\seongsu-03.jpg"
copy "%SRC%\KakaoTalk_20260616_153941_277_22.jpg" "%DST%\seongsu-04.jpg"
echo Done! >> "%DST%\copy_done.txt"

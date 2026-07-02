# 로컬 정적 페이지 미리보기

**언제 사용**: HTML 파일 수정 후 브라우저로 실제 렌더링/애니메이션을 확인해야 할 때
**마지막 개선**: 2026-07-02
**성공 횟수**: 1

## 절차

1. `file://` 직접 열기는 Claude in Chrome 자동화에서 차단됨 — 반드시 로컬 서버로 서빙해야 함
2. 이 머신엔 python이 없음 (Microsoft Store 스텁만 있고 실제 설치 안 됨) — `python -m http.server`는 실패함
3. 대신 Node.js가 있으므로 아래처럼 간단한 정적 서버를 인라인으로 띄운다:
   ```bash
   node -e "
   const http=require('http');const fs=require('fs');const path=require('path');
   const mime={'.html':'text/html','.jpg':'image/jpeg','.png':'image/png','.jpeg':'image/jpeg','.webp':'image/webp','.css':'text/css','.js':'text/javascript'};
   http.createServer((req,res)=>{
     let p = path.join(process.cwd(), decodeURIComponent(req.url.split('?')[0]));
     fs.readFile(p,(err,data)=>{
       if(err){res.writeHead(404);res.end('not found');return;}
       res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream'});
       res.end(data);
     });
   }).listen(8730,()=>console.log('listening on 8730'));
   " &
   ```
4. `run_in_background:true`인 Bash 호출 안에서 백그라운드로 띄우면, 그 호출이 끝나도 프로세스는 살아있음 (별도 curl로 검증됨)
5. Claude in Chrome으로 `http://localhost:8730/<파일명>` 접속해서 확인
6. 확인 끝나면 PowerShell로 정리: `Get-NetTCPConnection -LocalPort 8730 | Select -Expand OwningProcess -Unique | % { Stop-Process -Id $_ -Force }`

## 주의사항

- 포트 충돌 가능성 있으니 매번 다른 포트 쓰거나 사용 전 정리
- CSS 애니메이션(크로스페이드, 켄번즈 등) 타이밍 확인은 `computer` 툴의 `wait` + `screenshot`을 여러 번 반복해서 프레임을 비교

## 결과 예시

히어로 슬라이드쇼(크로스페이드+켄번즈+도트 인디케이터) 작업 시 이 방법으로 실제 전환 애니메이션을 스크린샷으로 확인함.

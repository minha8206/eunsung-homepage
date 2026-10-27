# esstone.co.kr 스토어 (/store)

**목표**: 은성이 현장에서 쓰는 장비·자재를 홈페이지에서 소량 판매. 1호 상품은 미국 직수입 Monument Toolworks Gorilla Grip 2.1 진공 심세터(3대, 3,500,000원 부가세 포함).
**현재 상태**: store.html · store-gorilla-grip.html 배포 (2026-10-26). 온라인 결제 없음 — 구매 문의 폼(기존 contact Function 재사용) → 견적서 → 계좌이체 → 쇼룸 수령/화물.
**다음 할 일**: 보호 파일(showroom.html · product-detail.html) 헤더에 "스토어" 추가 여부 kevin 확인 · 상품이 늘면 store.html 의 대표 블록 아래 카드 그리드 추가 · 재고 0 이 되면 st-stock 문구와 JSON-LD availability(OutOfStock) 함께 수정.
**관련 스킬**: skills/web-dev/local-preview.md
**마지막 업데이트**: 2026-10-26

## 맥락

- 상품 사진은 kevin 이 쇼룸에서 찍은 원본(아이폰 세로 사진 3장 + 가로 1장)을 크롭·WebP 변환. `images/store/gorilla-grip-*.webp`, OG 는 `gorilla-grip-og.jpg`.
- 장비는 110V(미국 내수용) — 페이지 곳곳에 강압 변압기(1kVA급 권장) 안내. 모델 판별: 포드마다 레벨링 노브 4개 + S자 캠 없음 = 2.1 캠리스(GG2-20000-13).
- 가격 표기는 부가세 포함(소비자 표시가격 원칙). 스펙·구성·교체부품 정보 출처: taitsales.com(TSC, 실제 구매처) · granquartz.com.
- 스토어 페이지는 x-dc(React) 없이 contact.html 템플릿을 따른다(폼·갤러리 JS 가 DOM 을 직접 잡기 위해). JSON-LD 에 Product/Offer 가 있어 build-seo.js PAGES 에 넣지 않았다.

## 완료된 마일스톤

- [x] 스토어 목록 + 상품 상세 페이지, 공통 헤더/푸터/검색/사이트맵 반영 (2026-10-26)

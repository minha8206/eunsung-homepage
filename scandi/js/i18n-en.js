/* ===== 영문 번역 사전 =====
   키는 화면에 나오는 한국어 원문(공백 정규화 후), 값은 영문.
   값이 '__HIDE__' 이면 EN 모드에서 그 요소를 숨긴다 —
   한/영이 이미 병기된 자리에서 영문이 두 번 나오지 않게 하기 위한 장치.

   제품 개별 데이터(컬러별 설명 등)는 이번 단계 범위에서 제외했다. */
window.I18N_EN = {

  /* ───────── 공통 · 헤더 / 내비게이션 ───────── */
  /* 로고의 한글 첨자 — EN 에서는 옆의 EUNSUNG 과 겹치므로 숨긴다 */
  '은성': '__HIDE__',
  '회사소개': 'About',
  '시공 과정': 'Process',
  '포세린': 'Porcelain',
  /* LX 공식 표기를 따른다 — VIATERA / HIMACS 는 대문자 */
  '비아테라': 'VIATERA',
  '하이막스': 'HIMACS',
  /* 카테고리 라벨로 쓰이는 소재 일반명 */
  '인조대리석': 'Solid Surface',
  '시공사례': 'Projects',
  '문의': 'Contact',
  '메뉴 열기': 'Open menu',
  '홈': 'Home',
  '쇼룸': 'Showroom',
  '홈으로 돌아가기': 'Back to home',
  '쇼룸으로 돌아가기': 'Back to showroom',

  /* ───────── 공통 · 푸터 / 회사 정보 ───────── */
  '(주)은성': 'EUNSUNG Co., Ltd.',
  '상호 (주)은성': 'Company EUNSUNG Co., Ltd.',
  '대표자 이언기': 'CEO Lee Eon-gi',
  '사업자등록번호 328-88-00420': 'Business Reg. No. 328-88-00420',
  '주소 경기도 포천시 가산면 정금로 356-39':
    'Address 356-39 Jeonggeum-ro, Gasan-myeon, Pocheon-si, Gyeonggi-do, Korea',
  '경기도 포천시 가산면 정금로 356-39':
    '356-39 Jeonggeum-ro, Gasan-myeon, Pocheon-si, Gyeonggi-do, Korea',
  '전화 031-544-7272 · 010-5430-2580': 'Tel 031-544-7272 · 010-5430-2580',
  '팩스 031-544-6868': 'Fax 031-544-6868',
  '이메일 eunsung8585@naver.com': 'Email eunsung8585@naver.com',
  '인조대리석 및 상판 가공 전문': 'Solid surface and countertop fabrication',
  '© 2026 (주)은성 EUNSUNG Co., Ltd.': '© 2026 EUNSUNG Co., Ltd.',
  '© 2026 (주)은성 EUNSUNG Co., Ltd. · 인조대리석 및 상판 가공':
    '© 2026 EUNSUNG Co., Ltd. · Solid surface and countertop fabrication',
  '포세린·엔지니어드 스톤·인조대리석·BMC': 'Porcelain · Engineered Stone · Solid Surface · BMC',
  '소재 선별부터 가공, 시공까지. 은성이 처음부터 끝까지 책임집니다.':
    'Sourcing, fabrication, installation — EUNSUNG sees it through from first to last.',

  /* ───────── index · 히어로 / 소재 ───────── */
  '표면은 공간의 인상을 결정합니다.': 'Surface defines the space.',
  '은성은 그 기준을 만듭니다.': 'EUNSUNG defines the surface.',
  'LX하우시스 공식 파트너 — 원자재 선별부터 재단·시공까지 직영 설비에서 완성합니다.':
    'Official partner of LX Hausys — from raw material selection to cutting and installation, completed in our own facility.',
  /* 모바일 전용 <br class="br-m"> 로 세 노드로 나뉜다 — 노드 단위 키 */
  'LX하우시스 공식 파트너 —': 'Official partner of LX Hausys —',
  '원자재 선별부터 재단·시공까지': 'from raw material selection to cutting and installation,',
  '직영 설비에서 완성합니다.': 'completed in our own facility.',
  'MATERIALS · 소재': 'MATERIALS',
  'CONSULTATION · 상담': 'CONSULTATION',
  '2009년 BMC 인조대리석 가공 전문으로 출발해, 세라믹·E-Stone·MMA·BMC 전 라인업을 다루는 종합 표면재 기업으로 성장했습니다.':
    'Founded in 2009 as a BMC solid-surface fabricator, EUNSUNG now covers the full line — Porcelain, Engineered Stone, Solid Surface and BMC.',
  '네 가지 소재, 하나의 기준': 'Four surfaces. One standard.',

  '엔지니어드 스톤': 'Engineered Stone',

  '뜨거운 냄비를 그대로 올려도, 10년을 써도 처음 그대로입니다. 1200℃ 고온이 만든 가장 강한 표면입니다.':
    'Set a hot pan straight down from the stove. Ten years on it still looks like day one — the strongest surface 1,200°C can make.',
  '천연 석영 90%가 주는 깊이 있는 질감. 칼자국·흠집 걱정 없이, 매일 쓰는 주방이 오래 아름답습니다.':
    'The depth that only 90% natural quartz gives. Knife marks and scratches stop being a worry, so a kitchen in daily use stays beautiful for years.',
  '100% 아크릴계 솔리드 서페이스로, 이음새 없이 매끄럽게 이어지고 열로 곡면을 만들 수 있습니다. 생활 흠집이 생겨도 샌딩 한 번이면 새것처럼 복원됩니다.':
    '100% acrylic solid surface — joins disappear seamlessly, and heat forms it into curves. Everyday scratches sand right out, back to new.',
  '은성이 직접 생산하는 열경화성 성형 컴파운드입니다. 싱크볼까지 하나로 성형돼 물샐 틈 없이 위생적이고, 자체 생산이라 가격과 납기 모두 합리적입니다.':
    'A thermoset molding compound we produce ourselves. The sink bowl is moulded in one piece — watertight and hygienic — and in-house production keeps both price and lead time reasonable.',

  '실내외 모두 시공 가능': 'Interior and exterior',
  '열에 가장 강한 소재': 'Most heat-resistant of the four',
  '3200×1600 대형 슬랩': '3200×1600 large slab',
  '석영 90% 이상': 'Over 90% quartz',
  '흠집에 가장 강한 경도': 'Hardest against scratches',
  '천연석의 깊이감': 'The depth of real stone',
  '이음새 없는 일체형 마감': 'Seamless single-piece finish',
  '곡선 디자인 자유': 'Free-form curves',
  '샌딩으로 복원 가능': 'Restorable by sanding',
  '싱크볼 일체 성형': 'Sink bowl moulded in one piece',
  '은성 자체 생산': 'Produced in-house by EUNSUNG',
  '합리적인 가격': 'Sensible pricing',

  /* 카드마다 붙는 용도 추천 한 줄 */
  '아일랜드 상판 · 벽면 · 외장 등 열이 닿는 넓은 공간에 추천':
    'For islands, walls and facades — wide surfaces that take heat',
  '매일 쓰는 주방 상판, 고급스러운 질감이 필요한 공간에 추천':
    'For everyday kitchen worktops, and spaces that need a refined texture',
  '곡선 카운터 · 세면대 등 디자인 자유도가 필요한 공간에 추천':
    'For curved counters, vanities — anywhere design freedom matters',
  '실속 있게 마감하고 싶은 주방 · 다용도실에 추천':
    'For kitchens and utility rooms finished on a sensible budget',

  /* <br> 로 나뉘어 렌더되므로 노드(줄) 단위 키가 필요하다. 통짜 키도 안전망으로 유지. */
  '기계의 정확함 위에, 사람의 손끝을 더합니다': 'Machine precision, finished by hand.',
  '기계의 정확함 위에, 사람의 손끝을 더합니다.': 'Machine precision, finished by hand.',
  '기계의 정확함 위에,': 'Machine precision,',
  '사람의 손끝을 더합니다': 'finished by hand.',
  '사람의 손끝을 더합니다.': 'finished by hand.',

  /* ───────── index · 문의 폼 ───────── */
  'INQUIRY · 문의': 'INQUIRY',
  'CONTACT · 문의': 'CONTACT',
  'LOCATION · 위치': 'LOCATION',
  'SPECIALTY · 전문 분야': 'SPECIALTY',
  '공간에 대해 알려주세요. 저희 팀이 영업일 기준 하루 안에 샘플과 견적으로 답변드립니다.':
    'Tell us about your space. Our team replies within one business day with samples and a quotation.',
  'Name · 성함': 'Name',
  'Phone / Email · 연락처': 'Phone / Email',
  'Project type · 프로젝트 유형': 'Project type',
  'Tell us about your space · 내용': 'Tell us about your space',
  'Residential kitchen · 주거 주방': 'Residential kitchen',
  'Bathroom / vanity · 욕실': 'Bathroom / vanity',
  'Commercial / hospitality · 상업공간': 'Commercial / hospitality',
  'Facade / feature wall · 외장·벽면': 'Facade / feature wall',
  '문의 보내기 · SEND INQUIRY': 'SEND INQUIRY',
  '문의가 정상적으로 접수되었습니다. 저희 팀이 영업일 기준 하루 안에 연락드립니다.':
    'Your inquiry has been received. Our team will be in touch within one business day.',
  '접기': 'Show less',

  /* ───────── about ───────── */
  'ABOUT EUNSUNG · 회사소개': 'ABOUT EUNSUNG',
  '대한민국 표면재의 기준을 다시 씁니다': 'Redefining the standard of surface in Korea.',
  'Redefining the standard of surface in Korea.': '__HIDE__',
  '2009년 설립 이래 BMC부터 포세린까지, 은성은 표면재의 모든 것을 다룹니다.':
    'Since 2009, from BMC to porcelain — EUNSUNG covers every surface.',
  'Since our founding in 2009, EUNSUNG has covered every surface — from BMC to porcelain.': '__HIDE__',

  'OUR STORY · 연혁': 'OUR STORY',
  '하나의 소재에서, 모든 표면의 기준으로': 'From one material, to every surface.',
  'From one material, to every surface.': '__HIDE__',
  '2009 · 창립': '2009 · FOUNDED',
  '2026 · 현재': '2026 · TODAY',
  'BMC 인조대리석 가공 전문으로 시작': 'Beginning as a BMC solid-surface specialist',
  '경기도 포천에서 BMC 인조대리석 가공을 전문으로 창립한 이래, 싱크대와 상판 가공의 정밀도로 신뢰를 쌓아왔습니다.':
    'Founded in Pocheon, Gyeonggi-do as a BMC solid-surface specialist, earning trust through precision sink and countertop work.',
  'Founded in Pocheon in 2009 specializing in BMC solid-surface fabrication, building trust through precision sink and countertop work.': '__HIDE__',
  '포세린·비아테라·하이막스·BMC, 표면재의 전 과정을 다루는 회사로':
    'Porcelain, Viatera, HIMACS and BMC — the full surface process, in one house',
  'A full-line surface company across porcelain, Viatera, HIMACS and BMC — supplying premium materials directly as an official partner of LX Hausys, Korea\'s No.1 surface brand.': '__HIDE__',

  'ONE-STOP SYSTEM · 원스톱 체계': 'ONE-STOP SYSTEM',
  '수급부터 시공까지, 은성 안에서 완결됩니다': 'From sourcing to installation — complete under one roof.',
  'One house. Every step.': '__HIDE__',
  '은성은 자재 수급부터 정밀 가공, 현장 시공까지 표면재의 전 과정을 직접 수행하는 원스톱 기업입니다. 중간 유통 단계를 거치지 않는 만큼, 품질과 일정을 스스로 통제합니다.':
    'EUNSUNG handles sourcing, precision fabrication and on-site installation directly. With no intermediaries, we control both quality and schedule ourselves.',
  'EUNSUNG handles sourcing, precision fabrication and on-site installation directly — no intermediaries, full control over quality and schedule.': '__HIDE__',
  '01 · 유통 SOURCING': '01 · SOURCING',
  '02 · 가공 FABRICATION': '02 · FABRICATION',
  '03 · 시공 INSTALLATION': '03 · INSTALLATION',
  '좋은 표면은 좋은 슬랩에서 시작됩니다': 'A great surface begins with a great slab',
  '밀리미터의 오차도 허용하지 않습니다': 'Not a millimetre of tolerance',
  '만든 사람이 끝까지 책임집니다': 'The hands that make it see it through',
  '국내 1위 소재기업 LX하우시스를 비롯한 신뢰도 높은 원자재를 직접 수급합니다.':
    'We source directly from trusted suppliers, led by LX Hausys, Korea’s No.1 surface brand.',
  '경기도 포천 대형 가공 설비에서 재단부터 마감까지 직접 처리합니다.':
    'Cutting through finishing is handled in-house at our large-scale Pocheon facility.',
  '현장 실측부터 마감 시공까지 자체 시공팀이 책임지고 완성합니다.':
    'Our own installation team carries the work from on-site measurement to final finish.',

  'FACILITY · 생산 시설': 'FACILITY',
  '규모가 만드는 정밀함': 'Precision at scale.',
  'Precision at scale.': '__HIDE__',
  '경기도 포천의 대형 가공 설비에서 직접 정밀 가공해 품질을 맞춥니다. 재고를 체계적으로 관리하고 설비를 자동화해 자재도 빠르게 공급합니다.':
    'Our large-scale facility in Pocheon delivers top-tier quality through precision fabrication, backed by systematic inventory management and automated supply.',
  'Our large-scale fabrication facility in Pocheon, Gyeonggi-do, delivers top-tier quality through precision processing — backed by systematic inventory management and automated supply.': '__HIDE__',
  'MATERIAL SCALE · 자재 규모': 'MATERIAL SCALE',
  '수백 가지 컬러, 단 하나의 기준': 'Hundreds of colors. One standard.',
  'Hundreds of colors. One standard.': '__HIDE__',
  '수백 가지 인조대리석 컬러 라인업': 'Hundreds of solid-surface colors in stock',
  '다양한 공간과 프로젝트에 맞춰 폭넓은 컬러·패턴을 즉시 대응합니다.':
    'A broad range of colors and patterns, ready for any space or project.',
  'BMC 자체 생산 라인 보유': 'Our own BMC production line',
  'BMC 인조대리석을 자체 생산해 외주 없이 품질과 납기를 직접 관리합니다.':
    'We produce BMC solid surface ourselves — quality and lead time managed directly, with no outsourcing.',

  'EUNSUNG IN NUMBERS · 숫자로 보는 은성': 'EUNSUNG IN NUMBERS',
  '설립연도 · FOUNDED': 'FOUNDED',
  '업력 · YEARS OF EXPERTISE': 'YEARS OF EXPERTISE',
  '취급 소재 · MATERIAL LINES': 'MATERIAL LINES',
  '국내 1위 소재기업 · 공식 파트너': 'KOREA’S NO.1 SURFACE BRAND · OFFICIAL PARTNER',
  'WHY EUNSUNG · 경쟁력': 'WHY EUNSUNG',
  '품질과 속도, 그리고 장인의 손': 'Quality. Speed. Craftsmanship.',
  'Quality. Speed. Craftsmanship.': '__HIDE__',
  '품질 · QUALITY': 'QUALITY',
  '납기 · SPEED': 'SPEED',
  '가공 실력 · CRAFTSMANSHIP': 'CRAFTSMANSHIP',
  '기준 이하의 슬랩은 라인에 올리지 않습니다.': 'A slab below standard never reaches the line.',
  '직영이기에 가능한 속도로 약속을 지킵니다.': 'Owning every step is how we keep our dates.',
  '기계가 재단하고, 사람이 완성합니다.': 'The machine cuts. The craftsman finishes.',

  'WHO WE SERVE · 공급 대상': 'WHO WE SERVE',
  '집 한 채의 정성으로, 프로젝트 전체를': 'From a single home, to the whole project.',
  'From a single home, to the whole project.': '__HIDE__',
  '개인 고객 · INDIVIDUAL': 'INDIVIDUAL',
  'B2B 파트너 · PROJECT': 'PROJECT',
  '1:1 맞춤 제작': 'Made to measure',
  '인테리어 · 건설사 · 호텔': 'Interiors · Developers · Hotels',
  '가정용 싱크대와 상판부터 인테리어 표면재까지, 쓰시는 공간 치수에 맞춰 하나씩 제작해 드립니다.':
    'From kitchen sinks and worktops to interior surfaces — made to measure for your space.',
  '인테리어 업체, 건설사, 호텔 등 다양한 프로젝트 현장에 대량 공급과 시공을 지원합니다.':
    'Volume supply and installation for interior firms, developers, hotels and other project sites.',

  'CERTIFICATION · 인증 및 파트너십': 'CERTIFICATION & PARTNERSHIP',
  '이름 있는 소재만 다룹니다': 'Only proven materials.',
  'Only proven materials.': '__HIDE__',
  'EUNSUNG is an official partner of LX Hausys, Korea\'s No.1 surface brand — across porcelain, Viatera and HIMACS.': '__HIDE__',
  'COMPANY INFO · 회사 정보': 'COMPANY INFO',
  /* <b> 강조 때문에 텍스트 노드가 쪼개진 문장들 — 조각 단위로 매칭한다 */
  '포세린, 비아테라, 하이막스, BMC 전 라인업을 다루며,':
    'Covering the full line — Porcelain, Viatera, HIMACS and BMC — as the',
  '국내 1위 소재기업 LX하우시스의 공식 파트너': 'official partner of LX Hausys, Korea’s No.1 surface brand',
  '로서 프리미엄 소재를 직접 공급하는 종합 표면재 기업으로 성장했습니다.':
    ', supplying premium materials directly.',
  '은성은': 'EUNSUNG is the',
  '대한민국 1위 소재기업 LX하우시스 공식 파트너': 'official partner of LX Hausys, Korea’s No.1 surface brand',
  '입니다. 포세린 · 비아테라 · 하이막스 세 라인 모두 이미 검증된 소재로, 안심하고 사용하실 수 있습니다.':
    '. Porcelain, Viatera and HIMACS — three lines whose reliability is already proven.',
  '· LX하우시스 파트너 소재': '· LX Hausys partner material',
  '년': ' yrs',
  '종': ' lines',

  /* COMPANY INFO 표 */
  '상호 · COMPANY': 'COMPANY',
  '대표자 · CEO': 'CEO',
  '이언기': 'Lee Eon-gi',
  '사업자등록번호 · BIZ. NO': 'BIZ. NO',
  '전화 · TEL': 'TEL',
  '팩스 · FAX': 'FAX',
  '주소 · ADDRESS': 'ADDRESS',
  '이메일 · EMAIL': 'EMAIL',

  /* ───────── facility (시공 과정) ───────── */
  'PROCESS · 시공 과정': 'PROCESS',
  '은성은 유통하지 않고 직접 가공합니다. 실측부터 현장 시공까지, 한 팀이 관리하는 10단계 공정입니다.':
    'EUNSUNG does not distribute — we fabricate. Ten stages, from measurement to installation, managed by one team.',
  '자재 입고 및 검수': 'Material intake and inspection',
  '들여오는 자재부터 다시 확인합니다.': 'It starts with checking what comes in.',
  '은성은 LX Hausys 정식 대리점으로서, 입고되는 모든 자재를 전수 검수합니다. 규격과 색상 로트, 표면 상태까지 하나씩 확인한 자재만 가공 라인에 투입됩니다.':
    'As an authorised LX Hausys dealer, we inspect every incoming slab. Only material verified for dimension, colour lot and surface condition enters the line.',
  '실측': 'On-site measurement',
  '모든 완성은, 정확한 실측에서 시작됩니다.': 'Every finish begins with an exact measurement.',
  '레이저 실측 장비로 현장의 각도와 단차까지 빠짐없이 기록합니다. 기록된 수치는 그대로 다음 단계인 도면 작업으로 이어져, 현장과 도면 사이의 오차를 처음부터 차단합니다.':
    'Laser measurement records every angle and level change on site. Those figures carry straight into drafting, eliminating any gap between site and drawing.',
  '도면 작업': 'Drafting',
  '도면은 곧 가공 데이터입니다.': 'The drawing is the machine data.',
  '실측 수치로 정리된 CAD 도면은 가공 장비와 직접 연동됩니다. 사람이 수치를 옮겨 적는 과정이 없기 때문에, 도면에서 가공으로 전달되는 과정에서 생기는 오차가 존재하지 않습니다.':
    'CAD drawings built from measured figures feed the machines directly. Nothing is transcribed by hand, so nothing is lost between drawing and cut.',
  '자재 배치': 'Slab layout',
  '결의 방향까지 미리 정합니다.': 'Even the direction of the veining is decided first.',
  '도면에 맞춰 슬랩을 배치하며 무늬결과 이음선의 위치를 재단 전에 확정합니다. 잘라내기 전에 완성된 모습을 먼저 확인하는 단계입니다.':
    'Slabs are laid out against the drawing, fixing veining and seam positions before any cut. The finished look is confirmed first.',
  '재단': 'Cutting',
  '도면 그대로, 오차 없이 잘라냅니다.': 'Cut exactly to the drawing.',
  '대형 가공 설비가 도면 데이터를 그대로 읽어 슬랩을 재단합니다. 직선과 곡선이 만나는 지점까지 동일한 정밀도로 처리합니다.':
    'Large-format machinery reads the drawing data and cuts accordingly — the same precision where straight meets curve.',
  '타공 및 씽크볼 가공': 'Cutouts and sink openings',
  '취성이 강한 소재일수록, 장비는 더 정밀해야 합니다.': 'The more brittle the material, the finer the machine must be.',
  '포세린은 강도는 높지만 충격에는 예민한 소재입니다. 씽크볼과 콘센트 홀 하나까지 크랙 없이 정밀하게 타공하는 것이 이 공정의 기준입니다.':
    'Porcelain is hard but impact-sensitive. Every sink opening and socket hole is cut without a crack — that is the standard here.',
  '엣지 가공 및 연마 폴리싱': 'Edge profiling and polishing',
  '만졌을 때 느껴지는 마감이 다릅니다.': 'The finish you feel is the difference.',
  '형태에 맞춰 엣지의 각을 잡고, 표면은 단계별 연마로 광택을 끌어올립니다. 눈으로 보는 것을 넘어 손으로 확인해도 이음이 느껴지지 않도록 마무리합니다.':
    'Edges are profiled to form and surfaces polished in stages. Finished so the join cannot be felt, let alone seen.',
  '최종 검수': 'Final inspection',
  '출고 전, 마지막으로 한 번 더 봅니다.': 'One last look before it leaves.',
  '치수와 표면, 컬러 매칭까지 처음 도면과 비교해 다시 확인합니다. 이 기준을 통과한 제품만 다음 단계로 넘어갑니다.':
    'Dimensions, surface and colour matching are checked again against the original drawing. Only what passes moves on.',
  '운반': 'Transport',
  '여기서부터는 파손 방지가 곧 품질입니다.': 'From here, protection is quality.',
  '슬랩 전용 거치대와 완충재로 고정해 운송 중 흔들림과 파손을 방지합니다. 현장에 도착하는 순간까지 검수된 상태 그대로 유지합니다.':
    'Secured on dedicated slab frames with cushioning against movement and damage — arriving exactly as inspected.',
  '현장 시공': 'Installation',
  '각 공정의 전문가들이, 하나의 공간을 완성합니다.': 'Specialists at every step, one finished space.',
  '실측부터 시공까지 전 과정을 은성의 시공팀이 직접 책임집니다. 담당이 바뀌며 생기는 공백 없이, 처음 약속한 완성도를 한 팀이 끝까지 지킵니다.':
    'Our own team owns every stage from measurement to installation. No handovers, no gaps — one team holds the standard promised at the start.',
  '이 공정 그대로, 당신의 공간에': 'This same process, in your space',
  '실측부터 시공까지, 은성의 10단계 공정으로 견적을 받아보세요.':
    'From measurement to installation — request a quotation built on our ten-stage process.',
  '견적 문의하기': 'Request a quote',
  '시공사례 보기': 'View projects',

  /* ───────── portfolio (시공사례) ───────── */
  'PORTFOLIO · 시공 사례': 'PORTFOLIO',
  '공간이 증명합니다': 'Spaces that speak for themselves.',
  '말보다 결과로 — 은성이 시공한 실제 현장입니다.':
    'Results over words — actual sites completed by EUNSUNG.',
  '← 목록으로': '← Back to list',
  '← 이전 사례': '← Previous project',
  '다음 사례 →': 'Next project →',
  '이전 사진': 'Previous photo',
  '다음 사진': 'Next photo',
  '닫기': 'Close',
  '비슷한 시공 문의하기': 'Enquire about similar work',

  /* ───────── showroom ───────── */
  'SHOWROOM · 쇼룸': 'SHOWROOM',
  '소재 컬렉션': 'Surface Collection',
  '포세린부터 BMC까지, 은성이 직접 보유하고 가공하는 전 소재를 한자리에 모았습니다.':
    'From porcelain to BMC — every surface EUNSUNG stocks and fabricates, in one place.',
  /* 카테고리 · 스타일 분류 (개별 컬러명은 이번 범위 제외) */
  'BMC 인조대리석': 'BMC Solid Surface',
  '마블 · Marble': 'Marble',
  '솔리드 · Solid': 'Solid',
  '스톤 · Stone': 'Stone',
  '콘크리트 · Concrete': 'Concrete',
  '테라조 · Terrazzo': 'Terrazzo',

  '필터': 'Filter',
  '필터 초기화': 'Reset filters',
  '전체 초기화': 'Reset all',
  '제품명 검색': 'Search by name',
  '색상': 'Colour',
  '색상 · COLOR': 'COLOUR',
  '스타일': 'Style',
  '스타일 · STYLE': 'STYLE',
  '추천순': 'Recommended',
  '이름순': 'By name',
  '자세히 보기': 'View details',
  '이전 페이지': 'Previous page',
  '다음 페이지': 'Next page',
  '총': 'Total',
  '개의 상품': ' products',
  '조건에 맞는 상품이 없습니다': 'No products match your filters',
  '필터를 조정해 다시 시도해 보세요.': 'Try adjusting the filters.',

  /* ───────── product detail ───────── */
  '가격은 문의해 주세요.': 'Price on request.',
  '시공 면적·가공 사양 기준으로 정확한 견적을 안내드립니다.':
    'We quote precisely, based on area and fabrication specification.',
  '견적 요청': 'Request a quote',
  '카카오톡 상담': 'KakaoTalk',
  '전화하기': 'Call Us',
  '1:1 맞춤 제작 가능': 'Made to measure',
  '공식 파트너 · 정품 슬라브 취급': 'Official partner · genuine slabs only',
  '소재의 성질': 'Material qualities',
  '상세정보 더 보기': 'More details',
  '상세정보 접기': 'Fewer details',

  /* 소재 라벨 */
  '아크릴 솔리드 서페이스': 'Acrylic solid surface',
  '포세린 슬랩 (TERACANTO)': 'Porcelain slab (TERACANTO)',
  '엔지니어드 스톤 (쿼츠 최대 93%)': 'Engineered stone (up to 93% quartz)',

  /* 소재의 성질 카드 — 4개 소재 공통 UI */
  '고온 내열': 'Heat resistant',
  '1200℃ 소성 세라믹 — 뜨거운 냄비가 직접 닿아도 변색과 변형이 없습니다.':
    'Ceramic fired at 1200℃ — no discolouration or deformation, even from a hot pan set directly on it.',
  '긁힘에 강한 표면': 'Scratch-resistant surface',
  '유리보다 단단한 표면 — 칼자국이나 마모 없이 오래 사용합니다.':
    'Harder than glass — no knife marks, no wear, year after year.',
  '자외선 안정': 'UV stable',
  '직사광선에도 색이 바래지 않아 창가와 외부 공간에도 안심입니다.':
    'Colour holds under direct sunlight — safe by windows and outdoors.',
  '대형 슬랩': 'Large format',
  '3200×1600 대판 — 이음매를 최소화한 웅장한 면 연출이 가능합니다.':
    '3200×1600 slabs — expansive surfaces with minimal seams.',
  '석영의 단단함': 'Quartz hardness',
  '천연 석영 90% 이상을 단단하게 압축한 표면 — 일상의 칼날과 마찰이 흔적을 남기지 못합니다.':
    'Over 90% natural quartz, densely compacted — everyday knives and friction leave no trace.',
  '오염에 강한 표면': 'Stain resistant',
  '스며들지 않는 비다공성 표면 — 커피도 와인도 얼룩이 되기 전에 닦여 나갑니다.':
    'A non-porous surface nothing soaks into — coffee and wine wipe away before they become stains.',
  '주방 상판 최적': 'Made for kitchens',
  '뜨거운 조리와 잦은 물 사용, 매일의 설거지까지 — 주방의 하루를 위해 설계된 소재입니다.':
    'Hot cookware, constant water, the daily dishes — engineered for the life of a kitchen.',
  '균일한 패턴': 'Consistent pattern',
  '슬랩마다 결이 다른 천연석과 달리, 도면에서 본 그대로의 패턴이 공간에 옮겨집니다.':
    'Unlike natural stone, the pattern you approve on the drawing is the pattern in your space.',
  '이음새 없는 마감': 'Seamless finish',
  '조인트 없이 하나의 면으로 이어지는 심리스 마감 — 싱크볼까지 한 몸처럼 연결됩니다.':
    'One continuous surface with no joints — even the sink bowl joins as if it were a single piece.',
  '곡면 성형의 자유': 'Freedom of curves',
  '열을 가하면 곡선이 됩니다 — 소재가 디자인을 제한하지 않습니다.':
    'Apply heat and it curves — the material never limits the design.',
  '샌딩 복원': 'Sanding renewal',
  '생활 흠집은 샌딩 한 번으로 처음 표면 그대로 — 오래 쓸수록 진가가 드러납니다.':
    'Everyday scratches sand back to the original surface — its value shows over the years.',
  '부드러운 촉감': 'Soft, warm touch',
  '도자기처럼 매끄럽고 따뜻한 촉감 — 매일 손이 닿는 자리일수록 차이가 느껴집니다.':
    'Smooth and warm to the touch, like porcelain — you feel the difference where hands rest every day.',
  '맞춤 성형': 'Made to order',
  '포천 공장에서 주문 치수 그대로 성형 — 현장 맞춤이 자유롭습니다.':
    'Moulded to your dimensions at our Pocheon facility — freely adapted on site.',
  '합리적 선택': 'Sensible choice',
  '천연석의 질감을 합리적인 비용으로 — 가성비가 가장 좋은 소재입니다.':
    'The character of natural stone at a sensible cost — the best value in the range.',
  '보수 용이': 'Easily repaired',
  '부분 파손도 현장에서 간단히 보수 — 유지관리 부담이 적습니다.':
    'Local damage is repaired on site — minimal maintenance burden.',
  '균일 품질': 'Consistent quality',
  '자체 생산 라인의 품질 관리로 로트 간 편차를 최소화합니다.':
    'In-house production control keeps lot-to-lot variation minimal.',

  /* 레퍼런스 캡션 */
  '주방 상판 및 씽크 시공': 'Kitchen worktop and sink',
  '카페 카운터 상판 시공': 'Café counter top',
  '벽체 및 상판 마감 시공': 'Wall and worktop finish',
  '은성이 시공한 공간': 'Spaces completed by EUNSUNG',
  '클릭하면 크게 볼 수 있습니다 ⊕': 'Click to enlarge ⊕',
  '제품을 찾을 수 없습니다': 'Product not found',
  '주소가 잘못되었거나 삭제된 제품입니다.': 'The address is incorrect, or this product has been removed.',
  '정품 슬라브의 가치를 아는 곳': 'Those who know what a genuine slab is worth',
  '재단부터 시공까지 직접 합니다': 'Cut and installed by us, start to finish',
  '공식 파트너로서 정품 슬라브를 상시 보유하고, 자체 공장에서 재단부터 시공까지 중간 유통 없이 직접 책임집니다.':
    'As an official partner we hold genuine slabs in stock, and take direct responsibility from cutting to installation in our own facility — with no intermediaries.',
  '공식 파트너': 'Official partner',
  '비아테라 · 하이막스 정품 인증 취급점': 'Certified for genuine Viatera and HIMACS',
  '자체 공장': 'Own facility',
  'CNC 재단·엣지·싱크홀 가공을 직접': 'CNC cutting, edging and sink cutouts in-house',
  '책임 시공': 'Direct installation',
  '숙련 시공팀이 실측부터 마무리까지': 'A skilled team, from measurement to final finish',
  '정품 보증': 'Genuine warranty',
  '제조사 보증이 그대로 적용됩니다': 'The manufacturer’s warranty applies in full',

  /* ───────── contact (문의하기) ───────── */
  '문의하기': 'Contact',
  '문의하기 — EUNSUNG 은성': 'Contact — EUNSUNG',
  '공간에 대한 고민, 은성이 함께 답을 찾습니다.': 'Whatever the space, EUNSUNG will help you find the answer.',
  '도면 한 장이든 막연한 구상이든 편하게 남겨주세요.': 'A drawing or just an idea — send it over.',
  '상담 안내': 'How to reach us',
  '급하신 건은 전화나 카카오톡이 가장 빠릅니다. 도면·현장 사진이 있으시면 함께 보내주시면 상담이 훨씬 정확해집니다.':
    'For anything urgent, a call or KakaoTalk is fastest. Drawings or site photos make the consultation far more precise.',
  '상담·견적 문의': 'Consultation and quotes',
  '카카오톡 채널 상담': 'KakaoTalk channel',
  '사진·도면 전송이 편리합니다': 'Convenient for sending photos and drawings',
  '쇼룸과 가공 공장이 함께 있어, 실제 슬랩과 설비를 한자리에서 보실 수 있습니다. 방문은 예약을 권해드립니다.':
    'Showroom and fabrication facility share one site, so you can see real slabs and machinery together. Appointments are recommended.',
  '평일': 'Weekdays',
  '점심시간': 'Lunch break',
  '12:00 — 13:00 (휴게)': '12:00 — 13:00 (closed)',
  '토요일 · 일요일 · 공휴일': 'Sat · Sun · Public holidays',
  '휴무': 'Closed',
  '문의 남기기': 'Send an inquiry',
  '필수 항목 · 영업일 기준 1일 내 연락드립니다': 'Required · we reply within one business day',
  '이름': 'Name',
  '홍길동': 'Your name',
  '연락처': 'Phone',
  '문의 유형': 'Inquiry type',
  '선택해 주세요': 'Please select',
  '견적 문의': 'Quotation',
  '시공 문의': 'Installation',
  '자재 문의': 'Materials',
  '쇼룸 방문 예약': 'Showroom visit',
  '기타': 'Other',
  '문의 내용': 'Message',
  '공간 종류(주방·욕실·상업공간 등), 대략적인 규모, 희망 일정을 적어주세요. 관심 소재나 시공 지역이 있으시면 함께 적어주세요.':
    'Tell us the type of space (kitchen, bathroom, commercial), approximate size and your preferred timeline. Do mention any material or location in mind.',
  '상담 회신을 위한 개인정보 수집·이용에 동의합니다': 'I agree to the collection and use of my personal data for this inquiry',
  '수집 항목 이름·연락처·문의 내용 · 상담 목적에만 사용하고 3년 후 파기합니다.':
    'Collected: name, contact, message · used only for this inquiry and deleted after three years.',
  '문의 보내기': 'Send inquiry',
  '전송 중…': 'Sending…',
  '전송에 실패했습니다. 잠시 후 다시 시도하시거나 031-544-7272로 연락해 주세요.':
    'That didn’t go through. Please try again shortly, or call 031-544-7272.',
  '이름을 입력해 주세요.': 'Please enter your name.',
  '연락처를 입력해 주세요.': 'Please enter your phone number.',
  '연락처를 다시 확인해 주세요.': 'Please check your phone number.',
  '문의 유형을 선택해 주세요.': 'Please select an inquiry type.',
  '문의 내용을 입력해 주세요.': 'Please enter your message.',
  '개인정보 수집·이용에 동의해 주세요.': 'Please agree to the collection and use of your personal data.',
  '문의가 접수되었습니다': 'Your inquiry has been received',
  '영업일 기준 1일 내 연락드리겠습니다.': 'We will be in touch within one business day.',
  '급하신 경우 031-544-7272로 전화 주세요.': 'In a hurry? Call 031-544-7272.',
  '이 항목은 비워두세요': 'Leave this field empty',

  /* ───────── 로그인 / 회원가입 모달 ───────── */
  '로그인': 'Sign in',
  '회원가입': 'Create account',
  '은성 회원 서비스를 이용하시려면 로그인해 주세요.': 'Sign in to use EUNSUNG member services.',
  '은성 회원으로 가입하고 서비스를 이용해 보세요.': 'Create an EUNSUNG account to get started.',
  '이메일': 'Email',
  '비밀번호': 'Password',
  '비밀번호 확인': 'Confirm password',
  '비밀번호를 잊으셨나요?': 'Forgot your password?',
  '또는 간편 로그인': 'Or sign in with',
  '또는 간편 가입': 'Or sign up with',
  '이미 계정이 있으신가요?': 'Already have an account?',
  '가입 유형': 'Account type',
  '일반 고객': 'Individual',
  '인테리어·시공 업체': 'Interior / trade',
  '상세주소 (동/호수 등)': 'Address line 2 (unit, floor)',
  '주소': 'Address',
  '주소 검색': 'Find address',
  '주소 검색 닫기': 'Close address search',
  '로그아웃': 'Sign out',
  '회원': 'Member',
  '카카오 계정': 'Kakao account',
  '로그인 중…': 'Signing in…',
  '가입 처리 중…': 'Creating account…',
  '구글로 로그인': 'Sign in with Google',
  '카카오톡으로 로그인': 'Sign in with KakaoTalk',
  '구글로 가입': 'Sign up with Google',
  '카카오톡으로 가입': 'Sign up with KakaoTalk',
  '구글 로그인 페이지로 이동합니다…': 'Redirecting to Google…',
  '카카오톡 로그인 페이지로 이동합니다…': 'Redirecting to KakaoTalk…',
  '이메일과 비밀번호를 모두 입력해 주세요.': 'Please enter both your email and password.',
  '올바른 이메일 주소를 입력해 주세요.': 'Please enter a valid email address.',
  '이메일 또는 비밀번호가 올바르지 않습니다.': 'Incorrect email or password.',
  '이미 가입된 이메일입니다. 로그인해 주세요.': 'This email is already registered. Please sign in.',
  '비밀번호는 6자 이상이어야 합니다.': 'Password must be at least 6 characters.',
  '비밀번호가 일치합니다.': 'Passwords match.',
  '비밀번호가 일치하지 않습니다.': 'Passwords do not match.',
  '상세주소를 제외한 모든 항목을 입력해 주세요.': 'Please complete every field except address line 2.',
  '연락처를 010-0000-0000 형식으로 입력해 주세요.': 'Please enter your phone as 010-0000-0000.',
  '사용할 수 없는 이메일 주소입니다. 실제 사용 중인 주소를 입력해 주세요.':
    'This email address cannot be used. Please enter one you actively use.',
  '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.': 'Too many requests. Please try again shortly.',
  '네트워크 오류로 처리하지 못했습니다. 연결 상태를 확인해 주세요.':
    'A network error prevented this. Please check your connection.',
  '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.': 'Something went wrong. Please try again shortly.',
  '이메일 인증이 완료되지 않았습니다. 받은 메일함에서 인증 링크를 확인해 주세요.':
    'Your email is not verified yet. Please check your inbox for the verification link.',
  '로그인 서비스가 아직 설정되지 않았습니다. 잠시 후 다시 시도해 주세요.':
    'Sign-in is not available yet. Please try again shortly.',
  '로그인 서비스를 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.':
    'Could not load the sign-in service. Please check your connection.',
  '비밀번호 찾기는 준비 중입니다. 031-544-7272로 문의해 주세요.':
    'Password recovery is coming soon. Please call 031-544-7272.',
  '주소 검색을 불러오는 중입니다…': 'Loading address search…',
  '주소 검색 서비스를 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.':
    'Could not load the address search. Please check your connection and try again.',

  /* ───────── 검색 오버레이 ───────── */
  '검색': 'Search',
  '검색어': 'Search term',
  '검색 닫기': 'Close search',
  '제품명 · 컬러명 · 코드 또는 페이지를 검색하세요': 'Search products, colours, codes or pages',
  '제품 데이터를 불러오는 중입니다…': 'Loading product data…',
  '제품명이나 컬러 코드를 입력해 보세요.': 'Try a product name or colour code.',
  '예) 칼라카타, 오로라 블랑, M617, 비아테라': 'e.g. Calacatta, Aurora Blanc, M617, Viatera',
  '제품 · ': 'Products · ',
  '나머지 ': 'View the remaining ',
  '건은 쇼룸에서 보기 →': ' in the showroom →',
  '건': ' results',
  '검색 결과가 없습니다.': 'No results found.',
  '찾으시는 소재나 컬러가 있으시면 문의해 주세요.': 'Tell us the material or colour you are looking for.',
  '재고와 대체 컬러를 안내드립니다.': 'We will advise on stock and alternatives.',
  '페이지': 'Pages',
  '2009년 설립부터 지금까지, 은성이 걸어온 길': 'The road EUNSUNG has travelled since 2009',
  '실측부터 현장 시공까지, 은성이 직접 관리하는 10단계': 'Ten stages from measurement to installation, all managed by EUNSUNG',
  '1200°C 고온에서 구워낸 대형 세라믹 슬랩': 'Large-format ceramic slabs fired at 1200°C',
  '비아테라 — 석영 90% 이상의 프리미엄 스톤': 'VIATERA — premium stone with over 90% quartz',
  '하이막스 — 이음새 없는 100% 아크릴 솔리드 서페이스': 'HIMACS — seamless 100% acrylic solid surface',
  '자체 생산하는 열경화성 성형 컴파운드': 'Thermoset molding compound, produced in-house',
  '주방·욕실·상업공간 시공 레퍼런스': 'Kitchen, bathroom and commercial references',
  '견적·시공·자재 문의와 쇼룸 방문 예약': 'Quotes, installation, materials and showroom visits',

  /* ───────── 카탈로그 · 톤 라벨 ───────── */
  "화이트": "White",
  "베이지": "Beige",
  "그레이": "Grey",
  "다크": "Dark",

  "다양한 규격 — 용도에 따라 맞춤 생산": "Made to order — sizes to suit the application",
  "(주)은성 BMC": "EUNSUNG BMC",
  /* ───────── 제품 상세 · 스펙 행 ───────── */
  "컬러명": "Colour name",
  "제품코드": "Product code",
  "* 실제 슬라브의 결과 색감은 로트에 따라 차이가 있을 수 있습니다. 포천 쇼룸에서 실물 확인을 권장합니다.": "* Colour can shift slightly from lot to lot. We recommend seeing the material in person at our showroom.",

  /* ───────── 소재별 톤 설명 (인조대리석) ───────── */
  "인조대리석 화이트 계열 특유의 깨끗하고 안정된 인상 — 이음매 없는 시공으로 어떤 공간에도 무난하게 어울립니다.": "The clean, settled look that only a white solid surface gives — seamless to install, and at home in any space.",
  "따뜻한 웜톤의 인조대리석 베이지 계열 — 우드 소재와 배색했을 때 특히 잘 어울리는 컬러입니다.": "A warm beige solid surface that sits especially well alongside wood.",
  "차분한 뉴트럴 톤의 인조대리석 그레이 계열 — 모던하고 도시적인 공간 연출에 적합합니다.": "A calm, neutral grey solid surface — suited to modern, urban interiors.",
  "깊이감 있는 인조대리석 다크 톤 — 공간에 무게감과 고급스러운 존재감을 더합니다.": "A deep, dark solid surface that lends a room weight and quiet presence.",

  /* ───────── 소재별 톤 설명 (포세린) ───────── */
  "포세린 화이트 계열 특유의 맑고 정제된 인상 — 대형 슬랩으로 이음매를 최소화한 웅장한 면 연출이 가능합니다.": "The clear, refined look of white porcelain — large formats keep joins to a minimum across a sweeping surface.",
  "따뜻한 웜톤의 포세린 베이지 계열 — 내추럴한 우드 소재와 배색했을 때 특히 잘 어울립니다.": "A warm beige porcelain that pairs beautifully with natural wood.",
  "차분한 뉴트럴 톤의 포세린 그레이 계열 — 모던하고 도시적인 공간 연출에 적합합니다.": "A calm, neutral grey porcelain — suited to modern, urban interiors.",
  "깊이감 있는 포세린 다크 톤 — 공간에 무게감과 고급스러운 존재감을 더합니다.": "A deep, dark porcelain that lends a room weight and quiet presence.",

  /* ───────── 소재별 톤 설명 (엔지니어드 스톤) ───────── */
  "엔지니어드 스톤 화이트 계열 특유의 맑고 정제된 인상 — 쿼츠 함량 최대 93%의 뛰어난 내구성으로 어떤 공간에도 무난하게 어울립니다.": "The clear, refined look of white engineered stone — up to 93% quartz for durability that suits any space.",
  "따뜻한 웜톤의 엔지니어드 스톤 베이지 계열 — 골드·카퍼 톤 베인이 우드 소재와 배색했을 때 특히 잘 어울립니다.": "A warm beige engineered stone, its gold and copper veining especially at home beside wood.",
  "차분한 뉴트럴 톤의 엔지니어드 스톤 그레이 계열 — 모던하고 도시적인 공간 연출에 적합합니다.": "A calm, neutral grey engineered stone — suited to modern, urban interiors.",
  "깊이감 있는 엔지니어드 스톤 다크 톤 — 공간에 무게감과 고급스러운 존재감을 더합니다.": "A deep, dark engineered stone that lends a room weight and quiet presence.",

  /* ───────── 소재별 톤 설명 (BMC · 자체 생산) ───────── */
  "포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 화이트 톤 — 세면대·상판 일체형 제작이 가능합니다.": "A white EUNSUNG BMC, moulded to order in our own plant — basin and countertop can be formed as one.",
  "포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 베이지 톤 — 세면대·상판 일체형 제작이 가능합니다.": "A beige EUNSUNG BMC, moulded to order in our own plant — basin and countertop can be formed as one.",
  "포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 그레이 톤 — 세면대·상판 일체형 제작이 가능합니다.": "A grey EUNSUNG BMC, moulded to order in our own plant — basin and countertop can be formed as one.",
  "포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 다크 톤 — 세면대·상판 일체형 제작이 가능합니다.": "A dark EUNSUNG BMC, moulded to order in our own plant — basin and countertop can be formed as one.",

  /* ───────── 플로팅 상담 버튼 ───────── */
  "궁금한 점은 편하게 물어보세요": "Questions? We're happy to help.",
  "전화 문의": "Call Us",
  "견적 문의": "Request a Quote",
  "카카오톡 상담": "Chat on KakaoTalk",
  "안내 닫기": "Dismiss",
  "문의하기": "Contact us",

  /* ───────── 지도 · 이미지 대체 텍스트 ───────── */
  "상세주소": "Address detail",
  "EUNSUNG 위치 지도": "Map to EUNSUNG",
  "LX Hausys 공식 파트너": "Official partner of LX Hausys",
  "LX하우시스": "LX Hausys",
  "포천 물류센터 자동화 설비": "Automated handling at our logistics centre",
  "포천 가공 공장 내부 · 적재된 슬랩과 가공 라인": "Inside the fabrication plant — stocked material and the cutting line",

  /* ───────── index · 문의 안내 (줄바꿈으로 나뉜 두 줄) ───────── */
  "공간에 대해 알려주세요.": "Tell us about your space.",
  "저희 팀이 영업일 기준 하루 안에 샘플과 견적으로 답변드립니다.": "We reply within one business day with samples and pricing.",

  /* ───────── about · 줄바꿈으로 나뉜 문장들 ───────── */
  "BMC 인조대리석 가공으로 시작해,": "We started out fabricating BMC solid surface,",
  "싱크대와 상판 하나하나의 정밀도로 신뢰를 쌓아왔습니다.": "earning trust one sink and one countertop at a time.",
  "포세린·비아테라·하이막스·BMC,": "Porcelain, VIATERA, HIMACS and BMC —",
  "표면재의 전 과정을 다루는 회사로": "a company that covers the full surface line",
  "자재 수급부터 정밀 가공, 현장 시공까지 은성이 직접 수행합니다.": "Sourcing, precision fabrication and on-site installation are all done in house.",
  "중간 유통이 없어 품질과 일정을 끝까지 책임질 수 있습니다.": "With no middlemen in between, quality and schedule stay ours to answer for.",
  "대형 가공 설비에서 재단부터 마감까지 직접 처리합니다.": "Cutting through finishing runs on our own large-format lines.",
  "재고를 체계적으로 관리하고 공정을 자동화해,": "Disciplined stock control and automated processes mean",
  "필요한 자재를 필요한 때에 공급합니다.": "the material you need arrives exactly when you need it.",
  "모든 슬랩을 검수한 뒤 라인에 올립니다.": "Every slab is inspected before it reaches the line.",
  "가정용 싱크대와 상판부터 인테리어 표면재까지,": "From kitchen sinks and countertops to interior surfaces,",
  "쓰시는 공간 치수에 맞춰 하나씩 제작해 드립니다.": "each piece is made to the dimensions of your space.",
  "인테리어 업체, 건설사, 호텔 등 다양한 프로젝트 현장에": "For interior firms, builders and hotels,",
  "대량 공급과 시공을 지원합니다.": "we supply and install at project scale.",

  /* ───────── facility · 줄바꿈·문구 변경분 ───────── */
  "은성은 유통하지 않고 직접 가공합니다.": "EUNSUNG does not distribute — we fabricate.",
  "실측부터 현장 시공까지, 한 팀이 관리하는 10단계 공정입니다.": "Ten stages from measurement to installation, managed by one team.",
  "도면에 맞춰 자재를 배치하며 무늬결과 이음선의 위치를 재단 전에 확정합니다. 잘라내기 전에 완성된 모습을 먼저 확인하는 단계입니다.": "Material is laid out against the drawing so veining and seam positions are settled before any cut. The finished look is agreed first.",
  "대형 가공 설비가 도면 데이터를 그대로 읽어 자재를 재단합니다. 직선과 곡선이 만나는 지점까지 동일한 정밀도로 처리합니다.": "Large-format machinery reads the drawing data directly and cuts to it — holding the same precision where straight lines meet curves.",
  "치수와 표면, 컬러 매칭까지 처음 도면과 비교해 다시 확인합니다.": "Dimensions, surface and colour matching are checked once more against the original drawing.",
  "이 기준을 통과한 제품만 다음 단계로 넘어갑니다.": "Only what clears that bar moves on.",
  "전용 거치대와 완충재로 고정해 운송 중 흔들림과 파손을 방지합니다. 현장에 도착하는 순간까지 검수된 상태 그대로 유지합니다.": "Dedicated racks and padding hold everything still in transit, so it reaches site exactly as inspected.",

  /* ───────── portfolio · 시공사례 제목 ───────── */
  "한남 — 아이보리 라운지 카운터": "Hannam — Ivory Lounge Counter",
  "동대문 — 라이트 마블 주방": "Dongdaemun — Light Marble Kitchen",
  "성수 — 크림 베이지 아일랜드": "Seongsu — Cream Beige Island",
  "여주 — 다크 그레이 아일랜드": "Yeoju — Dark Gray Island",
  "도곡 — 화이트 마블 카운터": "Dogok — White Marble Counter",
  "마포 — 화이트 마블 상판": "Mapo — White Marble Countertop",
  "남양주 — 크림 화이트 주방": "Namyangju — Cream White Kitchen",
  "홍대 — 화이트 마블 주방": "Hongdae — White Marble Kitchen",
  "분당 — 크림 마블 주방": "Bundang — Cream Marble Kitchen",
  "춘천 — 월넛과 칼라카타": "Chuncheon — Walnut and Calacatta",
  "판교 — 그라파이트 아일랜드": "Pangyo — Graphite Island",
  "광교 — 북매칭 마블 주방": "Gwanggyo — Bookmatched Marble Kitchen",
  "하남 — 골드 베인 마블 주방": "Hanam — Gold-Veined Marble Kitchen",
  "김포 — 퓨어 화이트 주방": "Gimpo — Pure White Kitchen",
  "별내 — 세이지 그린 주방": "Byeollae — Sage Green Kitchen",
  "일산 — 블랙 마블 세면대": "Ilsan — Black Marble Vanity",
  "과천 — 그레이 콘크리트 세면대": "Gwacheon — Gray Concrete Vanity",
  "다산 — 화이트 트윈 세면대": "Dasan — White Double Vanity",
  "삼송 — 칼라카타 비올라 욕실": "Samsong — Calacatta Viola Bath",
  "운정 — 화이트 마블 아트월": "Unjeong — White Marble Feature Wall",
  "위례 — 라이트 콘크리트 아트월": "Wirye — Light Concrete Feature Wall",
  "청라 — 트래버틴 카운터": "Cheongna — Travertine Counter",
  "동탄 — 칼라카타 테이블": "Dongtan — Calacatta Boardroom Table",
  /* ───────── 플로팅 문의 위젯 ─────────
     (버튼 aria-label '문의하기' 는 위 contact 항목을 그대로 쓴다) */
  '카카오톡 문의': 'Ask on KakaoTalk',
  '전화 문의 010-5430-2580': 'Call 010-5430-2580'
};

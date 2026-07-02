(function () {
  'use strict';

  const state = { mat: 'CERAMIC', sel: null, cart: 0, story: null };
  let ROOMS = null;
  let scene, cam, renderer, fog, amb, key, warmLight, coolLight, floor, wallL, wallR, island, slabs = [];
  let ray, mouse;
  let targetAz = 0, targetPo = 0, curAz = -0.95, curPo = 0;
  let curRad = 15.0, targetRad = 7.0, curCamY = 3.8, targetCamY = 0.5;
  let hotspots = [];
  let texLoader = null;
  let raf = null;

  const STORIES = [
    { tag: 'APPLIED · THE KITCHEN', title: 'The island, reimagined in stone.', img: 'assets/marble-gold.png', paras: [
      'At the heart of the atrium stands a full-height kitchen island — a single book-matched slab folded into a waterfall edge with no visible seam.',
      'Our E-Stone engineered quartz carries the depth of natural stone with the consistency of industry: non-porous, scratch- and stain-resistant, and warm to the touch.',
      'Every island is profiled on a 5-axis CNC in our Pocheon facility, then hand-finished — the same craft we have delivered to contract clients for decades, now open to your home.' ] },
    { tag: 'SURFACE · THE FEATURE WALL', title: 'Book-matched, floor to ceiling.', img: 'assets/marble-white.png', paras: [
      'Two mirrored ceramic slabs open like the pages of a book, their veins meeting at the centre line in perfect symmetry.',
      'Large-format sintered ceramic reaches 3200×1600mm at just 12mm thick — UV-stable, heatproof, and equally at home on façades, floors and walls.',
      'The result is a continuous field of marble movement across an entire wall, with none of the upkeep of the natural stone it reproduces.' ] },
    { tag: 'TECHNOLOGY · PHYGITAL', title: 'Where the slab meets the screen.', img: 'assets/marble-dark.png', paras: [
      'Configure, visualise and reserve any finish online, then receive fabricated pieces cut to the millimetre.',
      'Our Phygital platform bridges decades of B2B craft with B2C convenience — a virtual showroom you can walk through, and a quote you can request without leaving the room.',
      'Explore each surface here, add it to your project, and our team follows up with physical samples and pricing.' ] },
  ];

  function layoutFor(n) {
    const spread = Math.min(2.7, 0.5 + 0.185 * n);
    const arcR = 3.4 + Math.min(1.6, n * 0.06);
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5;
      const angle = -spread / 2 + t * spread;
      out.push([Math.sin(angle) * arcR, 0, -Math.cos(angle) * arcR - 0.6, -angle]);
    }
    return out;
  }
  function withLayout(items) { const L = layoutFor(items.length); items.forEach((it, i) => it.at = L[i]); return items; }

  function buildRooms() {
    return {
      CERAMIC: { tag: 'CERAMIC · 세라믹 슬랩', title: 'The Grand Hall', ink: '#eef3f8', hint: 'rgba(255,255,255,.5)', acc: '#e3c789',
        bg: 0x0b0e13, fog: [6, 26], amb: 0.3, key: 0.55, warm: 1.05, cool: 0.35, rad: 8.2, camY: 0.45, floorC: 0x1c2129, wall: true, island: false,
        items: withLayout([
          { name: 'Calacatta Bianco', nameKo: '칼라카타 비앙코', code: 'CERAMIC', pcode: 'WM101', origin: 'Pocheon, KR', sizes: '3200×1600mm', finish: 'Natural', img: 'https://minha8206.github.io/eunsung-homepage/images/WM101_%EC%B9%BC%EB%9D%BC%EC%B9%B4%ED%83%80%20%EB%B9%84%EC%95%99%EC%BD%94.jpg', tint: 0xf2f1ee, swatch: '#f2f1ee', blurb: '대형 세라믹 슬랩 — 벽면, 바닥, 파사드에 이상적인 초정밀 소재.' },
          { name: 'Tramonto', nameKo: '트라몬토', code: 'CERAMIC', pcode: 'ST107', origin: 'Pocheon, KR', sizes: '3200×1600mm', finish: 'Natural', img: 'https://minha8206.github.io/eunsung-homepage/images/ST107_%ED%8A%B8%EB%9D%BC%EB%AA%AC%ED%86%A0.jpg', tint: 0xc9a074, swatch: '#c9a074', blurb: '대형 세라믹 슬랩 — 벽면, 바닥, 파사드에 이상적인 초정밀 소재.' },
          { name: 'Ivory Concrete', nameKo: '아이보리 콘크리트', code: 'CERAMIC', pcode: 'CC101', origin: 'Pocheon, KR', sizes: '3200×1600mm', finish: 'Natural', img: 'https://minha8206.github.io/eunsung-homepage/images/CC101_%EC%95%84%EC%9D%B4%EB%B3%B4%EB%A6%AC%EC%BD%98%ED%81%AC%EB%A6%AC%ED%8A%B8.jpg', tint: 0xe4ded2, swatch: '#e4ded2', blurb: '대형 세라믹 슬랩 — 벽면, 바닥, 파사드에 이상적인 초정밀 소재.' },
          { name: 'Beige Basalt', nameKo: '베이지 바살트', code: 'CERAMIC', pcode: 'ST104', origin: 'Pocheon, KR', sizes: '3200×1600mm', finish: 'Natural', img: 'https://minha8206.github.io/eunsung-homepage/images/ST104_%EB%B2%A0%EC%9D%B4%EC%A7%80%20%EB%B0%94%EC%82%B4%ED%8A%B8.jpg', tint: 0xb7ab97, swatch: '#b7ab97', blurb: '대형 세라믹 슬랩 — 벽면, 바닥, 파사드에 이상적인 초정밀 소재.' },
          { name: 'Travertino Setoso', nameKo: '트레버티노 세토소', code: 'CERAMIC', pcode: 'ST105', origin: 'Pocheon, KR', sizes: '3200×1600mm', finish: 'Natural', img: 'https://minha8206.github.io/eunsung-homepage/images/ST105_%ED%8A%B8%EB%A0%88%EB%B2%84%ED%8B%B0%EB%85%B8%20%EC%84%B8%ED%86%A0%EC%86%8C.jpg', tint: 0xd8c6a4, swatch: '#d8c6a4', blurb: '대형 세라믹 슬랩 — 벽면, 바닥, 파사드에 이상적인 초정밀 소재.' },
        ]) },
      ESTONE: { tag: 'E-STONE · 엔지니어드 스톤', title: 'The Bright Gallery', ink: '#16222e', hint: 'rgba(20,32,44,.55)', acc: '#a8763f',
        bg: 0xdde4ea, fog: [10, 32], amb: 0.95, key: 1.35, warm: 0.35, cool: 0.6, rad: 10.2, camY: 0.5, floorC: 0x9aa6b0, wall: false, island: true,
        items: withLayout([
          { name: 'Concrete Cream', nameKo: '콘크리트 크림', code: 'E-STONE', pcode: 'CC102', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/CC102_Concrete%20Cream.png', tint: 0xe0d7c4, swatch: '#e0d7c4', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Diamond Black', nameKo: '다이아몬드 블랙', code: 'E-STONE', pcode: 'CM104', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/CM104_Diamond%20Black.png', tint: 0x232323, swatch: '#232323', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Himalaya White', nameKo: '히말라야 화이트', code: 'E-STONE', pcode: 'ST108', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST108%20Himalaya%20White.jpg', tint: 0xf1f1ee, swatch: '#f1f1ee', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Element Cream', nameKo: '엘리먼트 크림', code: 'E-STONE', pcode: 'ST109', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST109_Element%20Cream.png', tint: 0xe6dcc7, swatch: '#e6dcc7', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Limestone White', nameKo: '라임스톤 화이트', code: 'E-STONE', pcode: 'ST110', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST110_Limestone%20White.png', tint: 0xefeee9, swatch: '#efeee9', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Limestone Grigio', nameKo: '라임스톤 그리지오', code: 'E-STONE', pcode: 'ST111', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST111_Limestone%20Grigio.png', tint: 0xaaa9a3, swatch: '#aaa9a3', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Premium Travertino', nameKo: '프리미엄 트래버티노', code: 'E-STONE', pcode: 'ST112', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST112_Premium%20Travertino.png', tint: 0xd3bd97, swatch: '#d3bd97', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Camouflage', nameKo: '카무플라지', code: 'E-STONE', pcode: 'WM105', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/WM105_%20Camouflage_Revised_0511%20-.jpg', tint: 0x8b9077, swatch: '#8b9077', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Calacatta Bianco', nameKo: '칼라카타 비앙코', code: 'E-STONE', pcode: 'WM101', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/WM101_%EC%B9%BC%EB%9D%BC%EC%B9%B4%ED%83%80%20%EB%B9%84%EC%95%99%EC%BD%94.jpg', tint: 0xf2f1ee, swatch: '#f2f1ee', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Tramonto', nameKo: '트라몬토', code: 'E-STONE', pcode: 'ST107', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST107_%ED%8A%B8%EB%9D%BC%EB%AA%AC%ED%86%A0.jpg', tint: 0xc9a074, swatch: '#c9a074', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Ivory Concrete', nameKo: '아이보리 콘크리트', code: 'E-STONE', pcode: 'CC101', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/CC101_%EC%95%84%EC%9D%B4%EB%B3%B4%EB%A6%AC%EC%BD%98%ED%81%AC%EB%A6%AC%ED%8A%B8.jpg', tint: 0xe4ded2, swatch: '#e4ded2', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Beige Basalt', nameKo: '베이지 바살트', code: 'E-STONE', pcode: 'ST104', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST104_%EB%B2%A0%EC%9D%B4%EC%A7%80%20%EB%B0%94%EC%82%B4%ED%8A%B8.jpg', tint: 0xb7ab97, swatch: '#b7ab97', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
          { name: 'Travertino Setoso', nameKo: '트레버티노 세토소', code: 'E-STONE', pcode: 'ST105', origin: 'Pocheon, KR', sizes: '3200×1600×20T', finish: 'Polished', img: 'https://minha8206.github.io/eunsung-homepage/images/ST105_%ED%8A%B8%EB%A0%88%EB%B2%84%ED%8B%B0%EB%85%B8%20%EC%84%B8%ED%86%A0%EC%86%8C.jpg', tint: 0xd8c6a4, swatch: '#d8c6a4', blurb: '천연석의 깊이와 산업적 일관성을 겸비한 엔지니어드 스톤.' },
        ]) },
      MMA: { tag: 'MMA · 아크릴 솔리드', title: 'The Living Room', ink: '#f3ead9', hint: 'rgba(255,255,255,.5)', acc: '#e3c789',
        bg: 0x241b12, fog: [5.5, 18], amb: 0.34, key: 0.5, warm: 1.5, cool: 0.12, rad: 9.4, camY: 0.3, floorC: 0x2e261c, wall: false, island: true,
        items: withLayout([
          { name: 'Crystal Beige', nameKo: '크리스탈 베이지', code: 'MMA', pcode: 'G101', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xdccdb2, swatch: '#dccdb2', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Swanee', nameKo: '스와니', code: 'MMA', pcode: 'G193', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xece6da, swatch: '#ece6da', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Candy White', nameKo: '캔디 화이트', code: 'MMA', pcode: 'G235', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xf5f3ee, swatch: '#f5f3ee', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Gravila Cream', nameKo: '그라빌라 크림', code: 'MMA', pcode: 'GM02', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xe6dcc4, swatch: '#e6dcc4', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Aurora Blanc', nameKo: '오로라 블랑', code: 'MMA', pcode: 'M617', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xf4f4f1, swatch: '#f4f4f1', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Aurora Bisque', nameKo: '오로라 비스크', code: 'MMA', pcode: 'M612', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xe9ddc9, swatch: '#e9ddc9', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Beige Island', nameKo: '베이지 아일랜드', code: 'MMA', pcode: 'G109', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xd7c7a9, swatch: '#d7c7a9', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Aurora Frost', nameKo: '오로라 프로스트', code: 'MMA', pcode: 'M702', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xeef1f2, swatch: '#eef1f2', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'White Stellar', nameKo: '화이트 스텔라', code: 'MMA', pcode: 'G501', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xf6f6f4, swatch: '#f6f6f4', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Aurora Warm Blanc', nameKo: '오로라 웜블랑', code: 'MMA', pcode: 'M622', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xf1e9d8, swatch: '#f1e9d8', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Aurora Linen Cream', nameKo: '오로라 리넨크림', code: 'MMA', pcode: 'M623', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xe8dcc0, swatch: '#e8dcc0', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Gray Onyx', nameKo: '그레이 오닉스', code: 'MMA', pcode: 'G103', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0x8d9096, swatch: '#8d9096', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
          { name: 'Winter Stellar', nameKo: '윈터 스텔라', code: 'MMA', pcode: 'G502', origin: 'Pocheon, KR', sizes: '2440×1220 sheet', finish: 'Satin', img: '', tint: 0xf0f2f3, swatch: '#f0f2f3', blurb: '이음새 없는 따뜻한 질감의 아크릴 인조대리석.' },
        ]) },
      BMC: { tag: 'BMC · 몰딩 컴파운드', title: 'The Showcase', ink: '#e8edf2', hint: 'rgba(255,255,255,.5)', acc: '#e3c789',
        bg: 0x161a20, fog: [8, 24], amb: 0.7, key: 1.0, warm: 0.35, cool: 0.85, rad: 6.0, camY: 0.35, floorC: 0x232932, wall: false, island: false,
        items: withLayout([
          { name: 'Baikal White', nameKo: '바이컬 화이트', code: 'BMC', pcode: 'ES-001', origin: 'Pocheon, KR', sizes: 'Molded to spec', finish: 'Gel-coat', img: 'https://minha8206.github.io/eunsung-homepage/images/bmc/bmc-es001.jpg', tint: 0xf2f2f0, swatch: '#f2f2f0', blurb: '위생적이고 성형이 자유로운 몰딩 컴파운드.' },
          { name: 'Baikal Brown', nameKo: '바이컬 브라운', code: 'BMC', pcode: 'ES-003', origin: 'Pocheon, KR', sizes: 'Molded to spec', finish: 'Gel-coat', img: 'https://minha8206.github.io/eunsung-homepage/images/bmc/bmc-es003.jpg', tint: 0x6b4a34, swatch: '#6b4a34', blurb: '위생적이고 성형이 자유로운 몰딩 컴파운드.' },
          { name: 'Baikal Gray', nameKo: '바이컬 그레이', code: 'BMC', pcode: 'ES-002', origin: 'Pocheon, KR', sizes: 'Molded to spec', finish: 'Gel-coat', img: 'https://minha8206.github.io/eunsung-homepage/images/bmc/bmc-es008.jpg', tint: 0x8b9096, swatch: '#8b9096', blurb: '위생적이고 성형이 자유로운 몰딩 컴파운드.' },
          { name: 'Baikal Milky', nameKo: '바이컬 밀키', code: 'BMC', pcode: 'ES-004', origin: 'Pocheon, KR', sizes: 'Molded to spec', finish: 'Gel-coat', img: 'https://minha8206.github.io/eunsung-homepage/images/bmc/bmc-es007.jpg', tint: 0xede6da, swatch: '#ede6da', blurb: '위생적이고 성형이 자유로운 몰딩 컴파운드.' },
        ]) },
    };
  }

  function matFor(item) {
    const THREE = window.THREE;
    if (!item._m) {
      let map = null;
      if (item.img) {
        if (!texLoader) { texLoader = new THREE.TextureLoader(); texLoader.setCrossOrigin('anonymous'); }
        map = texLoader.load(item.img, (t) => { if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; t.needsUpdate = true; });
      }
      const face = new THREE.MeshStandardMaterial({ map, color: map ? 0xffffff : (item.tint || 0xffffff), roughness: map ? 0.26 : 0.42, metalness: 0.06 });
      const edge = new THREE.MeshStandardMaterial({ color: item.tint || 0xd8d4cc, roughness: 0.4, metalness: 0.12 });
      item._m = [edge, edge, edge, edge, face, face];
    }
    return item._m;
  }

  function updateZoneUI(matKey) {
    const room = ROOMS[matKey];
    const tagEl = document.getElementById('zone-tag');
    const titleEl = document.getElementById('zone-title');
    const hintEl = document.getElementById('zone-hint');
    const lxEl = document.getElementById('zone-lx');
    tagEl.textContent = room.tag; tagEl.style.color = room.acc;
    titleEl.textContent = room.title; titleEl.style.color = room.ink;
    hintEl.style.color = room.hint;
    if (matKey !== 'BMC') {
      lxEl.style.display = 'inline-flex';
      lxEl.style.border = '1px solid ' + room.acc;
      lxEl.querySelector('svg').setAttribute('stroke', room.acc);
      lxEl.querySelector('span').style.color = room.acc;
    } else {
      lxEl.style.display = 'none';
    }
    document.querySelectorAll('[data-mat]').forEach((b) => {
      const on = b.dataset.mat === matKey;
      b.style.opacity = on ? '1' : '0.5';
      b.style.borderColor = on ? '#c9a24b' : 'rgba(255,255,255,.25)';
    });
  }

  function applyMat(matKey) {
    const THREE = window.THREE;
    const cfg = ROOMS[matKey];
    if (cfg && fog) {
      const c = new THREE.Color(cfg.bg);
      if (scene) scene.background = c;
      if (renderer) renderer.setClearColor(c, 1);
      fog.color.set(c); fog.near = cfg.fog[0]; fog.far = cfg.fog[1];
      amb.intensity = cfg.amb; key.intensity = cfg.key; warmLight.intensity = cfg.warm; coolLight.intensity = cfg.cool;
      targetRad = cfg.rad; targetCamY = cfg.camY;
      if (floor) floor.material.color.set(cfg.floorC);
      if (wallL) { wallL.visible = !!cfg.wall; wallR.visible = !!cfg.wall; }
      if (island) island.visible = !!cfg.island;
      slabs.forEach((s, i) => {
        const it = cfg.items[i];
        if (it) { s.visible = true; s.material = matFor(it); } else { s.visible = false; }
      });
    }
    state.mat = matKey;
    updateZoneUI(matKey);
  }

  function pick(e, canvas) {
    if (!ray) return;
    const b = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - b.left) / b.width) * 2 - 1;
    mouse.y = -((e.clientY - b.top) / b.height) * 2 + 1;
    ray.setFromCamera(mouse, cam);
    const cfg = ROOMS[state.mat];
    const hits = ray.intersectObjects(slabs.filter((s) => s.visible), false);
    if (hits.length) {
      const it = cfg.items[hits[0].object.userData.idx];
      if (it) openLightbox(it);
    }
  }

  let lb = null;
  function openLightbox(it) {
    lb = { s: 1, x: 0, y: 0, ptrs: new Map(), dist: 0 };
    state.sel = it;
    const panel = document.getElementById('sel-panel');
    panel.style.display = 'flex';
    document.getElementById('lb-img').style.background = it.img ? (it.swatch + " url('" + it.img + "') center/cover") : it.swatch;
    document.getElementById('lb-img').style.transform = 'translate(-50%,-50%)';
    document.getElementById('sel-pcode-top').textContent = it.pcode;
    document.getElementById('sel-name').textContent = it.name;
    document.getElementById('sel-nameko').textContent = it.nameKo;
    document.getElementById('sel-blurb').textContent = it.blurb;
    document.getElementById('sel-pcode').textContent = it.pcode;
    document.getElementById('sel-origin').textContent = it.origin;
    document.getElementById('sel-sizes').textContent = it.sizes;
    document.getElementById('sel-finish').textContent = it.finish;
    document.getElementById('sel-code').textContent = it.code;
    setTimeout(bindLightbox, 60);
  }
  function closeSel() {
    state.sel = null;
    document.getElementById('sel-panel').style.display = 'none';
  }
  function bindLightbox() {
    const st = document.getElementById('lb-stage'), img = document.getElementById('lb-img');
    if (!st || !img || st._zoomBound) return;
    st._zoomBound = true;
    const clamp = (v) => Math.min(6, Math.max(0.5, v));
    const apply = () => { img.style.transform = 'translate(-50%,-50%) translate(' + lb.x.toFixed(1) + 'px,' + lb.y.toFixed(1) + 'px) scale(' + lb.s.toFixed(3) + ')'; };
    st.addEventListener('wheel', (e) => { e.preventDefault(); lb.s = clamp(lb.s * Math.exp(-e.deltaY * 0.0016)); apply(); }, { passive: false });
    st.addEventListener('pointerdown', (e) => { st.setPointerCapture(e.pointerId); lb.ptrs.set(e.pointerId, [e.clientX, e.clientY]); lb.dist = 0; st.style.cursor = 'grabbing'; });
    st.addEventListener('pointermove', (e) => {
      if (!lb.ptrs.has(e.pointerId)) return;
      const prev = lb.ptrs.get(e.pointerId);
      lb.ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (lb.ptrs.size === 1) { lb.x += e.clientX - prev[0]; lb.y += e.clientY - prev[1]; apply(); }
      else if (lb.ptrs.size === 2) {
        const p = Array.from(lb.ptrs.values());
        const d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        if (lb.dist) lb.s = clamp(lb.s * d / lb.dist);
        lb.dist = d; apply();
      }
    });
    const up = (e) => { lb.ptrs.delete(e.pointerId); lb.dist = 0; st.style.cursor = 'grab'; };
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  }

  function openStory(i) {
    const s = STORIES[i];
    state.story = s;
    document.getElementById('story-panel').style.display = 'block';
    document.getElementById('story-img').style.backgroundImage = "url('" + s.img + "')";
    document.getElementById('story-tag').textContent = s.tag;
    document.getElementById('story-title').textContent = s.title;
    const parasEl = document.getElementById('story-paras');
    parasEl.innerHTML = '';
    s.paras.forEach((p) => {
      const pEl = document.createElement('p');
      pEl.style.cssText = "font:400 14.5px/1.85 'Manrope';color:rgba(28,34,42,.72);margin:0 0 17px";
      pEl.textContent = p;
      parasEl.appendChild(pEl);
    });
  }
  function closeStory() {
    state.story = null;
    document.getElementById('story-panel').style.display = 'none';
  }

  function initShowroom() {
    const mount = () => {
      const THREE = window.THREE;
      const canvas = document.getElementById('sr-canvas');
      if (!THREE || !canvas || !canvas.clientWidth) { setTimeout(mount, 90); return; }
      if (renderer) return;

      scene = new THREE.Scene();
      fog = new THREE.Fog(0xe7eef3, 9, 30); scene.fog = fog;
      cam = new THREE.PerspectiveCamera(48, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      const r = new THREE.WebGLRenderer({ canvas, antialias: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      r.setSize(canvas.clientWidth, canvas.clientHeight, false);
      if (THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
      renderer = r;

      amb = new THREE.AmbientLight(0xc2d2e2, 0.65); scene.add(amb);
      key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 7, 6); scene.add(key);
      warmLight = new THREE.PointLight(0xffcf8a, 0.65, 40); warmLight.position.set(-5, 2.5, 4); scene.add(warmLight);
      coolLight = new THREE.PointLight(0x9fd0ff, 0.7, 40); coolLight.position.set(5, 3.5, -2); scene.add(coolLight);

      const tl = new THREE.TextureLoader();
      const texW = tl.load('assets/marble-white.png'), texG = tl.load('assets/marble-gold.png'), texD = tl.load('assets/marble-dark.png');
      [texW, texG, texD].forEach((t) => { if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; });

      floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x252b33, roughness: 0.16, metalness: 0.62 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -2.5; scene.add(floor);

      ROOMS = buildRooms();

      const grp = new THREE.Group(); scene.add(grp); slabs = [];
      for (let i = 0; i < 13; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.6, 0.14), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        mesh.userData = { idx: i, baseY: 0, phase: i * 1.4 };
        grp.add(mesh); slabs.push(mesh);
      }

      const texWm = tl.load('assets/marble-white.png', (t) => { if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; t.wrapS = THREE.RepeatWrapping; t.repeat.x = -1; t.needsUpdate = true; });
      const wallGeo = new THREE.PlaneGeometry(3.4, 5.2);
      wallL = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ map: texW, roughness: 0.34, metalness: 0.05 }));
      wallL.position.set(-1.72, 0, -5.2); scene.add(wallL);
      wallR = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({ map: texWm, roughness: 0.34, metalness: 0.05 }));
      wallR.position.set(1.72, 0, -5.2); scene.add(wallR);

      island = new THREE.Group();
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1b2028, roughness: 0.5, metalness: 0.2 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 1.1), baseMat); base.position.y = -2.0; island.add(base);
      const topMat = new THREE.MeshStandardMaterial({ map: texG, roughness: 0.2, metalness: 0.08 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.13, 1.28), topMat); top.position.y = -1.44; island.add(top);
      const fall = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.12, 1.28), topMat); fall.position.set(-1.06, -1.99, 0); island.add(fall);
      island.position.set(0, 0, 0.5); scene.add(island);

      ray = new THREE.Raycaster(); mouse = new THREE.Vector2();

      canvas.addEventListener('pointermove', (e) => {
        const b = canvas.getBoundingClientRect();
        if (e.buttons & 1) { targetAz += -e.movementX * 0.004; }
        else { targetAz = ((e.clientX - b.left) / b.width - 0.5) * 0.9; }
        targetPo = ((e.clientY - b.top) / b.height - 0.5) * 0.45;
        targetPo = Math.max(-0.4, Math.min(0.5, targetPo));
      });
      let dx = 0, dy = 0;
      canvas.addEventListener('pointerdown', (e) => { dx = e.clientX; dy = e.clientY; canvas.style.cursor = 'grabbing'; });
      canvas.addEventListener('pointerup', (e) => { canvas.style.cursor = 'grab'; if (Math.abs(e.clientX - dx) < 6 && Math.abs(e.clientY - dy) < 6) pick(e, canvas); });

      document.querySelectorAll('[data-mat]').forEach((b) => b.addEventListener('click', () => applyMat(b.dataset.mat)));

      window.addEventListener('resize', () => {
        const w = canvas.clientWidth, h = canvas.clientHeight; if (!w) return;
        cam.aspect = w / h; cam.updateProjectionMatrix(); r.setSize(w, h, false);
      });

      const params = new URLSearchParams(window.location.search);
      const req = (params.get('mat') || '').toUpperCase();
      const initialMat = ['CERAMIC', 'ESTONE', 'MMA', 'BMC'].includes(req) ? req : 'CERAMIC';
      applyMat(initialMat);
      const ld = document.getElementById('sr-load'); if (ld) ld.style.display = 'none';

      hotspots = [
        { pos: new THREE.Vector3(0, -1.15, 1.0), story: 0, need: 'island' },
        { pos: new THREE.Vector3(0, 1.0, -4.95), story: 1, need: 'wall' },
        { pos: new THREE.Vector3(3.25, 0.5, -2.2), story: 2 },
      ];
      const cont = canvas.parentElement;
      hotspots.forEach((hs) => {
        const el = document.createElement('button');
        el.className = 'eye'; el.style.zIndex = '16'; el.style.padding = '0';
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6" fill="#fff"/></svg>';
        el.addEventListener('click', (e) => { e.stopPropagation(); openStory(hs.story); });
        cont.appendChild(el); hs.el = el;
      });

      const clock = new THREE.Clock();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        const t = clock.getElapsedTime();
        const cfg = ROOMS[state.mat] || ROOMS.CERAMIC;
        slabs.forEach((s, i) => {
          const it = cfg.items[i];
          if (!it) return;
          const tg = it.at;
          s.userData.baseY += (tg[1] - s.userData.baseY) * 0.06;
          s.position.x += (tg[0] - s.position.x) * 0.06;
          s.position.z += (tg[2] - s.position.z) * 0.06;
          s.position.y = s.userData.baseY + Math.sin(t * 0.8 + s.userData.phase) * 0.12;
          s.rotation.y += (tg[3] - s.rotation.y) * 0.06;
          s.rotation.z = Math.sin(t * 0.4 + i) * 0.012;
        });
        curRad += (targetRad - curRad) * 0.05;
        curCamY += (targetCamY - curCamY) * 0.05;
        curAz += (targetAz - curAz) * 0.07;
        curPo += (targetPo - curPo) * 0.07;
        cam.position.x = Math.sin(curAz) * curRad;
        cam.position.z = Math.cos(curAz) * curRad;
        cam.position.y = curCamY + curPo * 2.6;
        cam.lookAt(0, 0, 0);
        if (hotspots) {
          const cw = canvas.clientWidth, ch = canvas.clientHeight;
          hotspots.forEach((hs) => {
            const ok = !hs.need || (hs.need === 'island' ? island.visible : wallL.visible);
            const v = hs.pos.clone().project(cam);
            if (ok && v.z < 1) { hs.el.style.display = 'grid'; hs.el.style.left = ((v.x * 0.5 + 0.5) * cw) + 'px'; hs.el.style.top = ((-v.y * 0.5 + 0.5) * ch) + 'px'; hs.el.style.transform = 'translate(-50%,-50%)'; }
            else hs.el.style.display = 'none';
          });
        }
        r.render(scene, cam);
      };
      loop();
    };
    mount();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initShowroom();
    document.getElementById('sel-panel').addEventListener('click', closeSel);
    document.getElementById('sel-side').addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('lb-stage').addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('sel-close').addEventListener('click', closeSel);
    document.getElementById('sel-cart').addEventListener('click', () => { state.cart += 1; closeSel(); });

    document.getElementById('story-panel').addEventListener('click', closeStory);
    document.getElementById('story-card').addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('story-close').addEventListener('click', closeStory);
  });
})();

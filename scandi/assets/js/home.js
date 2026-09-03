/* ===== index.html 전용 스크립트 — 히어로 영상 · 스토리 몽타주 =====

   index.html 의 인라인 <script> 세 덩어리를 이 파일로 옮겼다(캐시 가능, HTML 가벼워짐).
   히어로는 1023px 을 경계로 데스크톱/모바일 로직을 완전히 나눈다:

   ┌ 데스크톱(≥1024) ─ 스크롤 확장 연출. 래퍼(200vh) 안에서 sticky 로 붙어 있는 동안
   │                   굴러간 양을 0~1 진행도로 환산해 영상 프레임 크기에 매핑한다.
   │                   자동재생 보험(RETRY_EVENTS)·pause 시 재개도 그대로다. (예전 코드 그대로)
   └ 모바일(≤1023)   ─ 100svh 풀스크린 + autoplay muted loop playsinline 무한 재생.
                       스크롤 진행도·rAF·currentTime 조작 없음. 재생이 거부되면(iOS 저전력 등)
                       poster 를 그대로 두고 첫 터치 때 딱 한 번만 다시 시도한다.
   두 로직은 뷰포트가 경계를 넘을 때(태블릿 회전 등)만 서로 넘겨받는다. */
(function () {
  var MQ_MOBILE = '(max-width: 1023px)';

  /* ─────────────────────────── 모바일 히어로 ─────────────────────────── */
  function initMobileHero(videoEl) {
    if (!videoEl) return;
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    /* 동작 줄이기 — 재생하지 않고 poster 정지 이미지로 대체한다 */
    if (mqReduce.matches) {
      videoEl.removeAttribute('autoplay');
      try { videoEl.pause(); } catch (e) { /* 무시 */ }
      return;
    }
    /* Chrome 은 play() 시점에 muted 여야 자동재생을 허용한다 */
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.loop = true;

    var retried = false;
    function play() {
      var pr = videoEl.play();
      if (pr && typeof pr['catch'] === 'function') {
        pr['catch'](function () {
          /* 거부됨(저전력 모드·데이터 절약 등). poster 가 그대로 보인다.
             사용자 제스처가 생기면 한 번만 더 시도하고, 그래도 안 되면 poster 로 둔다. */
          if (retried) return;
          retried = true;
          window.addEventListener('touchend', function () {
            if (videoEl.readyState === 0) { try { videoEl.load(); } catch (e) { /* 무시 */ } }
            videoEl.play()['catch'](function () { /* poster 유지 */ });
          }, { once: true, passive: true });
        });
      }
    }
    play();
    /* 탭 전환·앱 복귀 후 멈춰 있으면 재개 */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && videoEl.paused && !retried) play();
    });
  }

  /* ─────────────────────────── 데스크톱 히어로 ───────────────────────── */
  /* 예전 구현은 wheel/touchmove 를 preventDefault 로 잡고 window.scrollTo(0,0) 으로
     페이지를 붙잡아 뒀다. 그래서 애니메이션이 끝나기 전에 빠르게 굴리면 입력이 먹히지
     않고 페이지가 멈춘 것처럼 보였다.

     지금은 스크롤을 전혀 막지 않는다. 래퍼(200vh) 안에서 sticky 로 붙어 있는 동안
     굴러간 양을 0~1 진행도로 환산해 크기에 그대로 매핑할 뿐이다. 빨리 내리면
     애니메이션도 그만큼 빨리 끝나고, 래퍼를 지나면 다음 섹션으로 그냥 넘어간다. */
  function initDesktopHero(els) {
    var wrap = els.wrap;
    var mediaEl = els.mediaEl;
    var bgEl = els.bgEl;
    var word = els.word;
    var hintEl = els.hintEl;
    var contentEl = els.contentEl;
    var videoEl = els.videoEl;

    /* 1024px 미만은 모바일 — 확대 인터랙션을 아예 실행하지 않는다.
       CSS 가 같은 기준으로 영상을 처음부터 전체화면으로 고정하므로
       여기서 인라인 width/height 를 쓰면 그 규칙과 싸운다. 크기 매핑 전체를 건너뛴다. */
    var mqMobile = window.matchMedia(MQ_MOBILE);
    var isMobile = mqMobile.matches;

    /* 동작 줄이기 사용자에게는 영상 대신 poster 정지 이미지를 보여준다.
       재생을 시작하지 않으면 브라우저가 poster 를 그대로 유지한다. */
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    var ticking = false;
    var lastP = -1;

    /* ── 자동재생 보험 ──
       Chrome 은 play() 호출 시점에 muted 여야 자동재생을 허용한다. 막히면 첫 사용자
       조작 때 한 번 더 시도한다. 스크럽을 하지 않으므로 영상은 그냥 계속 재생한다. */
    var retryBound = false;
    var RETRY_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];

    function tryPlay() {
      if (!videoEl) return;
      /* 동작 줄이기 — 재생하지 않고 poster 정지 이미지로 대체한다 */
      if (mqReduce.matches) { videoEl.pause(); return; }
      videoEl.muted = true;
      videoEl.playsInline = true;
      var pr = videoEl.play();
      if (pr && typeof pr['catch'] === 'function') pr['catch'](bindRetryOnce);
    }

    function bindRetryOnce() {
      if (retryBound) return;
      retryBound = true;
      function retry() {
        RETRY_EVENTS.forEach(function (t) { window.removeEventListener(t, retry); });
        retryBound = false;
        /* 데이터 절약 모드 등으로 로드 자체가 안 된 상태(HAVE_NOTHING)면
           사용자 제스처가 생긴 지금 load 부터 다시 건다 */
        if (videoEl.readyState === 0) { try { videoEl.load(); } catch (e) { /* 무시 */ } }
        tryPlay();
      }
      RETRY_EVENTS.forEach(function (t) {
        window.addEventListener(t, retry, { once: true, passive: true });
      });
    }

    if (videoEl) {
      ['ended', 'stalled', 'pause'].forEach(function (t) {
        videoEl.addEventListener(t, function () { if (videoEl.paused) tryPlay(); });
      });
      /* 탭 전환·앱 복귀 후 브라우저가 영상을 멈춰둔 채 두는 경우 재개한다 */
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && videoEl.paused) tryPlay();
      });
    }

    /* 래퍼가 화면 위로 밀려 올라간 양 / 애니메이션 구간(래퍼높이 - 뷰포트높이) */
    function progress() {
      var total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return 1;
      var y = -wrap.getBoundingClientRect().top;
      return Math.min(Math.max(y / total, 0), 1);
    }

    function render(p) {
      /* 모바일로 넘어간 상태면 아무것도 건드리지 않는다(CSS 가 전부 처리) */
      if (isMobile) return;
      /* 아래 텍스트 블록은 확장이 거의 끝났을 때 드러낸다 */
      if (contentEl) contentEl.classList.toggle('on', p > 0.85);

      mediaEl.style.width = (300 + p * 1250) + 'px';
      mediaEl.style.height = (400 + p * 400) + 'px';
      mediaEl.style.maxWidth = '95vw';
      mediaEl.style.maxHeight = '85vh';
      if (bgEl) bgEl.style.opacity = String(1 - p);
      if (hintEl) hintEl.style.opacity = String(Math.max(0, 1 - p * 4));

      /* 단어가 하나뿐이라 좌우로 벌릴 수 없다. 자간을 열어 펼쳐지는 인상을 유지하되
         중앙 정렬이 흐트러지지 않게 같은 값의 음수 margin 으로 상쇄한다. */
      if (word) {
        var track = 0.16 + p * 0.16;
        word.style.letterSpacing = track + 'em';
        word.style.marginRight = -track + 'em';
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var p = progress();
        if (Math.abs(p - lastP) < 0.0015) return;   /* 미세한 떨림은 건너뛴다 */
        lastP = p;
        render(p);
      });
    }

    function onResize() {
      isMobile = mqMobile.matches;
      if (isMobile) {
        /* 데스크톱에서 걸어둔 인라인 스타일을 전부 지워 CSS 전체화면 규칙에 넘긴다 */
        mediaEl.style.width = mediaEl.style.height = '';
        mediaEl.style.maxWidth = mediaEl.style.maxHeight = '';
        if (word) { word.style.letterSpacing = ''; word.style.marginRight = ''; }
        if (bgEl) bgEl.style.opacity = '';
        if (hintEl) hintEl.style.opacity = '';
        if (contentEl) contentEl.classList.remove('on');
      }
      lastP = -1;
      onScroll();
    }

    /* passive: true — 스크롤을 막지 않는다는 것을 브라우저에 명시한다 */
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    /* 회전·분할화면처럼 resize 이벤트가 불안정한 전환도 미디어쿼리 변화로 잡는다 */
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onResize);
    else if (mqMobile.addListener) mqMobile.addListener(onResize);

    tryPlay();
    render(progress());
  }

  function activateSources(videoEl) {
    if (!videoEl) return;
    var srcs = videoEl.querySelectorAll('source[data-src]');
    if (!srcs.length) return;
    for (var i = 0; i < srcs.length; i++) {
      srcs[i].setAttribute('src', srcs[i].getAttribute('data-src'));
      srcs[i].removeAttribute('data-src');
    }
    try { videoEl.load(); } catch (e) { /* 무시 */ }
  }

  /* ─────────────────────────── 진입점 ─────────────────────────── */
  function initHero() {
    var els = {
      wrap: document.getElementById('videoHero'),
      mediaEl: document.getElementById('vheroMedia'),
      bgEl: document.getElementById('vheroBg'),
      word: document.getElementById('vheroWord'),
      hintEl: document.getElementById('vheroHint'),
      contentEl: document.getElementById('vheroContent'),
      videoEl: document.getElementById('vheroVideo')
    };
    if (!els.wrap || !els.mediaEl) return;

    /* 영상 소스는 마크업에 data-src 로만 있다. 첫 프레임이 그려진 직후(rAF 두 번) src 로 올려
       로드를 시작한다 — poster·CSS·폰트가 먼저 화면에 오르고, 1MB 안팎의 스트림은 그 뒤에 붙는다.
       <source media> 는 브라우저가 load() 시점에 평가하므로 뷰포트별 파일 선택은 그대로 동작한다.
       (poster 가 먼저 칠해져야 LCP 후보로도 잡힌다.) */
    var mqMobile = window.matchMedia(MQ_MOBILE);
    var desktopReady = false;
    function start() {
      activateSources(els.videoEl);
      if (mqMobile.matches) initMobileHero(els.videoEl);
      else ensureDesktop();
    }
    /* 첫 콘텐츠 페인트(FCP) 뒤에 시작한다. rAF 는 첫 페인트보다 먼저 돌 수 있어서(빈 프레임)
       PerformanceObserver 로 실제 paint 를 기다리고, 못 잡는 브라우저는 짧은 타임아웃으로 넘어간다. */
    var started = false;
    function startOnce() { if (started) return; started = true; start(); }
    try {
      var po = new PerformanceObserver(function (list) {
        if (list.getEntries().some(function (e) { return e.name === 'first-contentful-paint'; })) { po.disconnect(); startOnce(); }
      });
      po.observe({ type: 'paint', buffered: true });
    } catch (e) { /* 미지원 — 아래 타임아웃이 처리 */ }
    setTimeout(startOnce, 1200);
    function ensureDesktop() {
      if (desktopReady) return;
      desktopReady = true;
      initDesktopHero(els);
    }

    /* 모바일로 열었다가 데스크톱 폭이 되면(태블릿 가로 회전) 그때 데스크톱 로직을 붙인다.
       반대 방향은 데스크톱 로직의 onResize 가 인라인 스타일을 지우고 CSS 에 넘긴다. */
    function onChange() { if (!mqMobile.matches) ensureDesktop(); }
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onChange);
    else if (mqMobile.addListener) mqMobile.addListener(onChange);
  }

  /* ─────────────────────────── 스토리 몽타주 영상 ───────────────────── */
  function initStoryVideo() {
    // The template renderer strips the bare `muted`/`loop` attributes whenever it re-renders this
    // (x-dc-managed) node, which also blocks autoplay (Chrome requires muted=true at play() time).
    // Enforce both as live DOM properties and keep re-enforcing, since the stripping can happen
    // repeatedly. The section/video nodes also don't exist yet at DOMContentLoaded time — the
    // runtime mounts this subtree asynchronously and can replace the node on re-render — so poll
    // and rebind whenever the live node changes instead of grabbing the elements once.
    //
    // Loading policy (preload="none", no autoplay attribute in the markup):
    //   - one viewport before the section enters (rootMargin 100%) → load() once
    //   - ≥20% visible → play(); left the viewport → pause()
    var boundVideo = null;
    var boundSection = null;
    var mo = null;
    var ioNear = null;
    var ioPlay = null;
    var armed = false;      /* load() 를 이미 걸었는가 */
    var wantPlay = false;   /* 현재 뷰포트 안에 있는가 */

    function enforcePlaybackAttrs(video) {
      if (!video.muted) video.muted = true;
      if (!video.loop) video.loop = true;
      if (!video.playsInline) video.playsInline = true;
      if (armed && wantPlay && video.paused) video.play()['catch'](function () {});
    }

    function arm(video) {
      if (armed) return;
      armed = true;
      /* poster 도 이때 붙인다(마크업엔 data-poster) — 첫 화면 로드와 대역폭을 나누지 않게 */
      var dp = video.getAttribute('data-poster');
      if (dp && !video.poster) video.poster = dp;
      try { video.preload = 'auto'; video.load(); } catch (e) { /* 무시 */ }
      if (wantPlay) video.play()['catch'](function () {});
    }

    function bindVideo(video) {
      if (video === boundVideo) return;
      if (mo) mo.disconnect();
      boundVideo = video;
      enforcePlaybackAttrs(video);
      if (armed) { try { video.preload = 'auto'; } catch (e) { /* 무시 */ } }
      if ('MutationObserver' in window) {
        mo = new MutationObserver(function () { enforcePlaybackAttrs(video); });
        mo.observe(video, { attributes: true, attributeFilter: ['muted', 'loop', 'playsinline'] });
      }
    }

    function bindSection(section) {
      if (section === boundSection) return;
      if (ioNear) ioNear.disconnect();
      if (ioPlay) ioPlay.disconnect();
      boundSection = section;
      if (!('IntersectionObserver' in window)) {
        /* 구형 브라우저 — 그냥 바로 로드하고 재생한다 */
        var v0 = document.getElementById('storyVideo');
        if (v0) { wantPlay = true; arm(v0); v0.play()['catch'](function () {}); }
        return;
      }
      ioNear = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var video = document.getElementById('storyVideo');
          if (video) arm(video);
          ioNear.disconnect();
        });
      }, { rootMargin: '100% 0px' });
      ioNear.observe(section);
      ioPlay = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var video = document.getElementById('storyVideo');
          wantPlay = entry.isIntersecting;
          if (!video) return;
          if (wantPlay) { arm(video); video.play()['catch'](function () {}); }
          else video.pause();
        });
      }, { threshold: 0.2 });
      ioPlay.observe(section);
    }

    function poll() {
      var video = document.getElementById('storyVideo');
      var section = document.getElementById('top');
      if (video) {
        bindVideo(video);
        enforcePlaybackAttrs(video);
      }
      if (section) bindSection(section);
    }

    poll();
    setInterval(poll, 1000);
  }

  /* ─────────────────────────── 스토리 텍스트 리빌 ───────────────────── */
  function initStoryText() {
    // same rationale as the video script above: this node lives inside the x-dc-managed
    // subtree and can be replaced wholesale on re-render, which would orphan an observer
    // attached once at load. Poll and rebind instead of grabbing the element a single time.
    var boundEl = null;
    var observer = null;

    function bindText(el) {
      if (el === boundEl) return;
      boundEl = el;
      if (observer) observer.disconnect();
      if (el.classList.contains('is-visible')) return;
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(el);
    }

    function poll() {
      var el = document.getElementById('storyMontageText');
      if (el) bindText(el);
    }

    poll();
    setInterval(poll, 1000);
  }

  function init() {
    initHero();
    initStoryVideo();
    initStoryText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

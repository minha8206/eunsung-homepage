/* ===== index.html 전용 스크립트 — 히어로 영상 · 헤더 · 스토리 몽타주 · 견적 문의 =====

   2026-11 밝은 톤 리디자인:
   · 히어로 — 예전 스크롤 확장 연출(200vh 래퍼 + sticky, 스크롤 진행도 → 영상 크기)을 없앴다.
     첫 화면을 꽉 채운 영상이 autoplay muted loop playsinline 으로 그냥 반복 재생된다.
     데스크톱·모바일 로직 구분 없이 하나이고, 파일만 <source media> 로 갈린다.
     띠 오른쪽 버튼(#heroPause)으로 멈추고 다시 틀 수 있다. 사용자가 멈춘 상태는 존중한다
     (탭 복귀·자동재생 재시도가 다시 틀지 않는다). 화면 밖으로 나가면 쉬고, 돌아오면 이어 재생한다.
   · 헤더 — 히어로 위에 있는 동안 <html> 에 hd-over 를 켜서 투명 + 흰 글씨로 그린다(CSS 는 index.html).
   · 견적 문의 — #hqForm 을 contact.html 과 같은 Netlify Function 으로 보낸다. */
(function () {
  var MQ_MOBILE = '(max-width: 1023px)';

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

  /* ─────────────────────────── 히어로 영상 ─────────────────────────── */
  function initHeroVideo(videoEl, hero, btn) {
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var userPaused = false;     /* 버튼으로 멈췄는가 — 그러면 어떤 자동 재개도 하지 않는다 */
    var inView = true;          /* 히어로가 화면에 보이는가 */
    var retryBound = false;
    var RETRY_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll'];

    function paint() {
      if (!btn) return;
      var paused = userPaused || videoEl.paused;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }

    function tryPlay() {
      if (userPaused || !inView || document.hidden) return;
      /* Chrome 은 play() 시점에 muted 여야 자동재생을 허용한다 */
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.loop = true;
      var pr = videoEl.play();
      if (pr && typeof pr['catch'] === 'function') pr['catch'](function () { bindRetryOnce(); paint(); });
    }

    /* 저전력 모드·데이터 절약 등으로 거부되면 poster 가 그대로 보인다. 첫 사용자 조작 때 한 번 더 시도한다 */
    function bindRetryOnce() {
      if (retryBound) return;
      retryBound = true;
      function retry() {
        RETRY_EVENTS.forEach(function (t) { window.removeEventListener(t, retry); });
        retryBound = false;
        if (videoEl.readyState === 0) { try { videoEl.load(); } catch (e) { /* 무시 */ } }
        tryPlay();
      }
      RETRY_EVENTS.forEach(function (t) { window.addEventListener(t, retry, { once: true, passive: true }); });
    }

    videoEl.addEventListener('play', paint);
    videoEl.addEventListener('pause', paint);
    videoEl.addEventListener('stalled', function () { if (videoEl.paused) tryPlay(); });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && videoEl.paused) tryPlay();
    });

    if (btn) {
      btn.addEventListener('click', function () {
        if (userPaused || videoEl.paused) {
          userPaused = false;
          if (videoEl.readyState === 0) activateSources(videoEl);
          tryPlay();
        } else {
          userPaused = true;
          videoEl.pause();
        }
        paint();
      });
    }

    /* 화면 밖에서는 디코딩을 쉰다 — 스크롤해 내려가면 멈추고, 올라오면 이어 재생 */
    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          inView = en.isIntersecting;
          if (inView) tryPlay(); else if (!videoEl.paused) videoEl.pause();
        });
      }, { threshold: 0.05 }).observe(hero);
    }

    /* 태블릿 회전 등으로 1023px 경계를 넘으면 그 폭에 맞는 파일로 다시 고른다 */
    var mq = window.matchMedia(MQ_MOBILE);
    function onMq() {
      videoEl.poster = mq.matches ? 'assets/video/hero-bright-poster-mobile.jpg' : 'assets/video/hero-bright-poster.jpg';
      try { videoEl.load(); } catch (e) { /* 무시 */ }
      tryPlay();
    }
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);

    /* 동작 줄이기 — 처음부터 멈춘 상태(poster 정지 화면)로 두고, 버튼으로만 재생한다 */
    if (mqReduce.matches) {
      userPaused = true;
      videoEl.removeAttribute('autoplay');
      try { videoEl.pause(); } catch (e) { /* 무시 */ }
    }
    paint();
    tryPlay();
  }

  /* ─────────────────────────── 진입점 ─────────────────────────── */
  function initHero() {
    var hero = document.getElementById('videoHero');
    var videoEl = document.getElementById('vheroVideo');
    var btn = document.getElementById('heroPause');
    if (!hero || !videoEl) return;

    /* 영상 소스는 마크업에 data-src 로만 있다. 첫 콘텐츠 페인트(FCP) 뒤에 src 로 올려 로드를 시작한다 —
       poster·CSS·폰트가 먼저 화면에 오르고 영상 스트림은 그 뒤에 붙는다(poster 가 LCP 후보로 잡힌다).
       rAF 는 첫 페인트보다 먼저 돌 수 있어서 PerformanceObserver 로 실제 paint 를 기다리고,
       못 잡는 브라우저는 짧은 타임아웃으로 넘어간다. */
    var started = false;
    function startOnce() {
      if (started) return;
      started = true;
      activateSources(videoEl);
      initHeroVideo(videoEl, hero, btn);
    }
    try {
      var po = new PerformanceObserver(function (list) {
        if (list.getEntries().some(function (e) { return e.name === 'first-contentful-paint'; })) { po.disconnect(); startOnce(); }
      });
      po.observe({ type: 'paint', buffered: true });
    } catch (e) { /* 미지원 — 아래 타임아웃이 처리 */ }
    setTimeout(startOnce, 1200);
  }

  /* ─────────────────────────── 헤더 투명 ↔ 흰색 ─────────────────────── */
  function initHeaderOver() {
    var hero = document.getElementById('videoHero');
    var root = document.documentElement;
    if (!hero) { root.classList.remove('hd-over'); return; }
    var ticking = false;
    function update() {
      ticking = false;
      /* 헤더(약 72px) 아래에 히어로가 아직 남아 있으면 투명 */
      root.classList.toggle('hd-over', hero.getBoundingClientRect().bottom > 76);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ─────────────────────────── 견적 문의 폼 ─────────────────────────── */
  function initInquiry() {
    var form = document.getElementById('hqForm');
    if (!form) return;
    var wrap = document.getElementById('hqWrap');
    var msg = document.getElementById('hqMsg');
    var submit = document.getElementById('hqSubmit');
    var thanks = document.getElementById('hqThanks');
    var CONTACT_URL = '/.netlify/functions/contact';
    var LABEL = submit ? submit.textContent : '문의 보내기';

    function $(id) { return document.getElementById(id); }
    function fieldOf(key) { return form.querySelector('[data-field="' + key + '"]'); }
    function clearErrors() {
      var els = form.querySelectorAll('.has-error');
      for (var i = 0; i < els.length; i++) els[i].classList.remove('has-error');
      msg.textContent = '';
    }
    function fail(key, text, el) {
      var f = fieldOf(key);
      if (f) f.classList.add('has-error');
      msg.textContent = text;
      if (el && el.focus) el.focus();
      return false;
    }
    function validate() {
      clearErrors();
      var name = $('hqName'), phone = $('hqPhone'), type = $('hqType'), message = $('hqMessage'), agree = $('hqAgree');
      if (!name.value.trim()) return fail('name', '이름을 입력해 주세요.', name);
      if (!phone.value.trim()) return fail('phone', '연락처를 입력해 주세요.', phone);
      if (phone.value.replace(/\D/g, '').length < 9) return fail('phone', '연락처를 다시 확인해 주세요.', phone);
      if (!type.value) return fail('type', '문의 유형을 선택해 주세요.', type);
      if (!message.value.trim()) return fail('message', '문의 내용을 입력해 주세요.', message);
      if (!agree.checked) return fail('agree', '개인정보 수집·이용에 동의해 주세요.', agree);
      return true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      /* 서버는 숫자와 하이픈만 받는다 — 공백·점으로 적은 번호도 하이픈으로 맞춰 보낸다 */
      var phone = $('hqPhone').value.trim().replace(/[\s.]+/g, '-').replace(/[^0-9-]/g, '');
      var payload = {
        name: $('hqName').value.trim(),
        phone: phone,
        inquiry_type: $('hqType').value,
        message: $('hqMessage').value.trim(),
        consent: !!$('hqAgree').checked,
        website: $('hqWebsite') ? $('hqWebsite').value : ''
      };
      submit.disabled = true;
      submit.textContent = '전송 중…';
      msg.textContent = '';
      fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data || data.ok !== true) {
              var err = new Error('failed');
              err.serverMessage = data && data.error;
              throw err;
            }
            return data;
          });
        })
        .then(function () {
          form.reset();
          submit.disabled = false;
          submit.textContent = LABEL;
          wrap.classList.add('is-sent');
          thanks.hidden = false;
          thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function (err) {
          submit.disabled = false;
          submit.textContent = LABEL;
          msg.textContent = (err && err.serverMessage) || '전송에 실패했습니다. 031-544-7272 또는 카카오톡 채널로 연락 주세요.';
        });
    });

    /* 입력을 고치기 시작하면 해당 항목의 경고 표시를 바로 지운다 */
    function onEdit(e) {
      var f = e.target.closest ? e.target.closest('.hq-field, .hq-agree') : null;
      if (f && f.classList.contains('has-error')) { f.classList.remove('has-error'); msg.textContent = ''; }
    }
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
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
    initHeaderOver();
    initHero();
    initInquiry();
    initStoryVideo();
    initStoryText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

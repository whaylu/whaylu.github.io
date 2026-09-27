const pet = document.getElementById('pet');
const petImg = document.getElementById('petImg');
const bubble = document.getElementById('petBubble');

let hideTimer = null;

// 桌寵點擊台詞庫
const petQuotes = [
  "你好呀，我是 DeepSeek～",
  "今天也在努力写代码吗？加油！",
  "遇到 Bug 别慌，喝杯水休息一下吧～",
  "“撇捺人生皆作游戏，橫竖框外天生鬼才！”",
  "“命环无情，轮转不息；运流不死，逆天改命！”",
  "“愿此行，终抵群星！”",
  '“‘Omnia vanitas’，于是过程即是意义...”',
  "要不要去看看作者的精选作品？",
  "想不想去仝娘之家看一场惊心动魄的八角笼决斗？",
  "要来原子序塔防冲冲排行榜吗？",
  "摸摸頭～ 灵感 +100！",
  "摸摸頭～ 运气 +100！",
  "摸摸頭～ 好感度 +100！",
];

// 顯示氣泡函數
function showBubble(text, duration = 0) {
  if (!bubble) return;
  clearTimeout(hideTimer);
  bubble.textContent = text;
  bubble.classList.add('show');
  if (duration > 0) {
    hideTimer = setTimeout(() => {
      bubble.classList.remove('show');
    }, duration);
  }
}

function hideBubble() {
  if (!bubble) return;
  clearTimeout(hideTimer);
  bubble.classList.remove('show');
}

// ==================== 1. 桌寵點擊與本體 Hover ====================
if (pet) {
  pet.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * petQuotes.length);
    showBubble(petQuotes[randomIndex], 2000);
  });

  if (petImg) {
    pet.addEventListener('mouseenter', () => {
      petImg.src = 'images/ds-hover.png';
    });
    pet.addEventListener('mouseleave', () => {
      petImg.src = 'images/ds.png';
    });
  }
}

// ==================== 2. 全局事件委託（data-ds-*） ====================
let currentHoverTarget = null;

document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('[data-ds-say], [data-ds-img]');
  if (target && target !== currentHoverTarget) {
    currentHoverTarget = target;
    const speechText = target.getAttribute('data-ds-say');
    const customImg = target.getAttribute('data-ds-img');
    if (speechText) showBubble(speechText);
    if (petImg) petImg.src = customImg || 'images/ds.png';
  }
});

document.addEventListener('mouseout', (e) => {
  if (!currentHoverTarget) return;
  const related = e.relatedTarget;
  if (related && currentHoverTarget.contains(related)) return;

  const nextTarget = related ? related.closest('[data-ds-say], [data-ds-img]') : null;
  if (!nextTarget) {
    currentHoverTarget = null;
    hideBubble();
    if (petImg) petImg.src = 'images/ds.png';
  }
});

// ==================== 3. 漢堡菜單 ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function closeNav() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // 點擊頁面其他地方 → 關閉
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
    closeNav();
  });
}

// 窗口尺寸变化时，暂时禁用过渡，防止 nav 在断点切换瞬间"闪一下"
let navResizeTimer;
window.addEventListener('resize', () => {
  if (!navMenu) return;

  navMenu.classList.add('no-transition');

  // 拖回桌面端时，把移动端残留的打开状态清掉
  if (!window.matchMedia('(max-width: 768px)').matches) {
    closeNav();
  }

  clearTimeout(navResizeTimer);
  navResizeTimer = setTimeout(() => {
    navMenu.classList.remove('no-transition');
  }, 150);
});

// ==================== 4. 平滑滾動 ====================
const logoBtn = document.getElementById('logoBtn');
if (logoBtn) {
  logoBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    // 手機端點完自動收起菜單
    closeNav();
  });
});

// ==================== 5. 複製郵箱 ====================
function copyEmail() {
  const emailText = document.getElementById('emailText')?.textContent || "whaylu@gmail.com";
  navigator.clipboard.writeText(emailText).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "已複製";
      showBubble("郵箱地址已經複製到剪貼板啦！", 2500);
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }
  }).catch(() => {
    alert("複製失敗，請手動複製：" + emailText);
  });
}

// ==================== 7. 滾動：進度條 + 回頂 + 導航高亮 ====================
const progressBar = document.getElementById('progressBar');
const backTop = document.getElementById('backTop');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) {
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  if (backTop) {
    backTop.classList.toggle('show', scrollTop > 400);
  }

  const line = scrollTop + window.innerHeight * 0.35;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= line) current = sec.id;
  });
  navItems.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== 8. 主題切換 ====================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ==================== 9. 打字機副標題 ====================
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    '撇捺人生皆作游戏，横竖框外天生鬼才',
    '命环无情，轮转不息；运流不死，逆天改命',
    '“Omnia vanitas”，于是过程即是意义',
    '在代码与哲学之间游弋的造物主',
    '第一性原理，解构一切，然后重构',
  ];

  const TYPE_SPEED   = 110;
  const DELETE_SPEED = 55;
  const HOLD_TIME    = 1800;
  const BETWEEN_TIME = 420;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  el.textContent = '';

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex >= phrase.length) {
        isDeleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, BETWEEN_TIME);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 1200);
})();

// ==================== 10. 滾動入場動畫 ====================
const revealElements = document.querySelectorAll('.reveal');

document.querySelectorAll('.hero .reveal').forEach((el, i) => {
  el.style.animationDelay = `${0.15 + i * 0.15}s`;
});

document.querySelectorAll('.cards .card').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.15}s`;
});

if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      el.addEventListener('animationend', () => {
        el.classList.remove('reveal', 'is-visible');
        el.style.animationDelay = '';
      }, { once: true });
      revealObserver.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -80px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('is-visible'));
}
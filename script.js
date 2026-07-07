// ====== SCREEN NAVIGATION ======
function goToScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  target.classList.add('active');

  // Trigger screen-specific animations
  if (screenId === 'screen-roast2') startCrackAnimation();
  if (screenId === 'screen-real') startFinalScreen();
}

// ====== FLOATING EMOJIS (Welcome Screen) ======
const emojiList = ['🎂', '🎉', '🎈', '🥳', '🎁', '✨', '💖', '🎊', '🌟', '💕', '🎀', '🤍'];
const emojiContainer = document.getElementById('floating-emojis');

function spawnEmoji() {
  const emoji = document.createElement('span');
  emoji.classList.add('floating-emoji');
  emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
  emoji.style.left = Math.random() * 100 + '%';
  emoji.style.animationDuration = (4 + Math.random() * 6) + 's';
  emoji.style.fontSize = (16 + Math.random() * 20) + 'px';
  emojiContainer.appendChild(emoji);
  setTimeout(() => emoji.remove(), 10000);
}

setInterval(spawnEmoji, 400);

// ====== GIFT BOX ======
let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const lid = document.getElementById('gift-lid');
  const tapText = document.getElementById('tap-text');
  const loadingContainer = document.getElementById('loading-container');

  lid.classList.add('opened');
  tapText.style.display = 'none';

  setTimeout(() => {
    loadingContainer.style.display = 'block';
    startFakeLoading();
  }, 700);
}

function startFakeLoading() {
  const fill = document.getElementById('loading-fill');
  const percent = document.getElementById('loading-percent');
  const loadingText = document.getElementById('loading-text');

  const messages = [
    { at: 0, text: "Loading your surprise..." },
    { at: 20, text: "Gathering all the love... 💕" },
    { at: 45, text: "Adding extra sweetness... 🍯" },
    { at: 65, text: "Almost there, Pumpkin... 🎁" },
    { at: 80, text: "Wrapping it with care... 🎀" },
    { at: 92, text: "Wait... something's wrong... 🤔" },
    { at: 97, text: "Uh oh... 😈" },
  ];

  let progress = 0;
  const interval = setInterval(() => {
    let increment;
    if (progress < 60) increment = Math.random() * 3 + 1;
    else if (progress < 90) increment = Math.random() * 2 + 0.5;
    else if (progress < 97) increment = Math.random() * 0.8 + 0.2;
    else increment = Math.random() * 0.5 + 0.1;

    progress = Math.min(progress + increment, 100);
    fill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';

    for (let i = messages.length - 1; i >= 0; i--) {
      if (progress >= messages[i].at) {
        loadingText.textContent = messages[i].text;
        break;
      }
    }

    if (progress >= 100) {
      clearInterval(interval);
      percent.textContent = "100%";
      loadingText.textContent = "💥 SURPRISE! 💥";
      setTimeout(() => goToScreen('screen-fooled'), 800);
    }
  }, 80);
}

// ====== CRACK ANIMATION (Roast 2) ======
function startCrackAnimation() {
  const crackEl = document.getElementById('crack-text');
  const cracks = ['*crack*', '*pop*', '*CRACK*', '*snap*', '*crunch*', '*POP*'];
  crackEl.textContent = '';
  let i = 0;

  const interval = setInterval(() => {
    if (i >= cracks.length) {
      clearInterval(interval);
      return;
    }
    crackEl.textContent += (i > 0 ? ' ' : '') + cracks[i];
    i++;
  }, 400);
}

// ====== ERROR SCREEN ======
function showError() {
  goToScreen('screen-error');
}

let denialCount = 0;
const denialMessages = [
  "Nice try, but you're still old Pumpkin 😂",
  "Denial won't fix your back pain, Darsini",
  "ERROR: Youth.exe has been permanently deleted",
  "You can click all you want... it's over 💀",
  "Okay fine, you're 'young at heart' 🙄 (but old everywhere else)",
  "STOP CLICKING. Accept your fate. 😭",
  "Okay okay... let me show you the real thing 🤍"
];

function denial() {
  const msg = document.getElementById('denial-msg');
  msg.textContent = denialMessages[Math.min(denialCount, denialMessages.length - 1)];
  msg.style.animation = 'none';
  msg.offsetHeight;
  msg.style.animation = 'fadeIn 0.3s ease';
  denialCount++;

  if (denialCount > denialMessages.length) {
    setTimeout(() => goToScreen('screen-real'), 1500);
  }
}

// ====== FINAL SCREEN ======
function startFinalScreen() {
  startConfetti();
  startHeartShower();
}

// Confetti
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ['#ff6b9d', '#c44dff', '#ffdd57', '#ff4444', '#4dff88', '#4dc9ff', '#ff9d4d', '#fff'];

  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      drift: (Math.random() - 0.5) * 1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
      c.y += c.speed;
      c.x += c.drift;
      c.angle += c.spin;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();

      if (c.y > canvas.height + 20) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Heart shower
function startHeartShower() {
  const container = document.getElementById('heart-shower');
  const hearts = ['💖', '💕', '💗', '❤️', '💝', '🩷', '🤍'];

  setInterval(() => {
    const heart = document.createElement('span');
    heart.classList.add('heart-float');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }, 300);
}

// ====== REPLAY ======
function replayAll() {
  giftOpened = false;
  denialCount = 0;
  document.getElementById('gift-lid').classList.remove('opened');
  document.getElementById('tap-text').style.display = 'block';
  document.getElementById('loading-container').style.display = 'none';
  document.getElementById('loading-fill').style.width = '0%';
  document.getElementById('denial-msg').textContent = '';
  goToScreen('screen-welcome');
}

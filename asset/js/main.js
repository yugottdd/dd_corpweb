document.addEventListener('DOMContentLoaded', function() {
  // ハンバーガーメニュー処理
  const hamburger = document.querySelector('.header-hamburger');
  const nav = document.querySelector('.header-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // ここからネットワークアニメーションの処理
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  let NODE_COUNT;
  let CONNECT_DISTANCE;

  const LINE_COLOR = '#f0f0f0';
  const NODE_COLOR = '#f0f0f0';
  const NODE_SIZE = 3;
  const PULSE_SPEED = 0.1;
  const PULSE_SPAWN_INTERVAL = 1000;
  let lastPulseSpawn = Date.now();

  const MAX_SPEED = 0.3;
  let nodes = [];
  let edges = [];
  let pulses = [];

  function calculateParameters() {
    const area = width * height;
    // 面積の平方根でスケーリングし、上限下限を設定
    NODE_COUNT = Math.round(Math.sqrt(area)/20);
    NODE_COUNT = Math.min(Math.max(NODE_COUNT,30),150);

    CONNECT_DISTANCE = Math.min(Math.max(Math.sqrt(area)/5,100),250);
  }

  function initNetwork() {
    nodes = [];
    edges = [];
    pulses = [];

    for(let i=0; i<NODE_COUNT; i++){
      nodes.push({
        x: Math.random()*width,
        y: Math.random()*height,
        dx: (Math.random()-0.5)*MAX_SPEED,
        dy: (Math.random()-0.5)*MAX_SPEED
      });
    }

    calculateEdges();

    // 初期に複数パルス発生で開始直後から動きを把握しやすく
    for(let i=0; i<5; i++){
      spawnPulse();
    }
  }

  function calculateEdges() {
    edges.length = 0;
    for(let i=0; i<nodes.length; i++){
      for(let j=i+1; j<nodes.length; j++){
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < CONNECT_DISTANCE) {
          edges.push({a:i,b:j,length:dist});
        }
      }
    }
  }

  function spawnPulse() {
    if(edges.length > 0) {
      const e = edges[Math.floor(Math.random()*edges.length)];
      pulses.push({ edge: e, progress: 0 });
    }
  }

  function updateNodes() {
    for(let n of nodes) {
      n.x += n.dx;
      n.y += n.dy;
      // 画面境界でバウンス
      if(n.x < 0 || n.x > width) n.dx = -n.dx;
      if(n.y < 0 || n.y > height) n.dy = -n.dy;
    }
  }

  function drawNetwork() {
    calculateEdges();

    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;

    // エッジ描画
    for(let e of edges) {
      const nA = nodes[e.a];
      const nB = nodes[e.b];
      ctx.beginPath();
      ctx.moveTo(nA.x,nA.y);
      ctx.lineTo(nB.x,nB.y);
      ctx.stroke();
    }

    // パルス描画
    for(let p of pulses) {
      const e = p.edge;
      const nA = nodes[e.a];
      const nB = nodes[e.b];
      const px = nA.x + (nB.x - nA.x)*p.progress;
      const py = nA.y + (nB.y - nA.y)*p.progress;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI*2);
      ctx.fill();
    }

    // ノード描画
    for(let i=0; i<nodes.length; i++){
      ctx.fillStyle = NODE_COLOR;
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, NODE_SIZE, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function updatePulses() {
    for(let i=pulses.length-1; i>=0; i--){
      pulses[i].progress += PULSE_SPEED;
      if(pulses[i].progress > 1) {
        pulses.splice(i,1);
      }
    }
  }

  function animate() {
    ctx.clearRect(0,0,width,height);

    updateNodes();
    drawNetwork();
    updatePulses();

    if(Date.now() - lastPulseSpawn > PULSE_SPAWN_INTERVAL) {
      spawnPulse();
      lastPulseSpawn = Date.now();
    }

    requestAnimationFrame(animate);
  }

  function onResize(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    calculateParameters();
    initNetwork(); 
  }

  window.addEventListener('resize', onResize);

  calculateParameters();
  initNetwork();
  animate();

});

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.header-hamburger');
  const nav = document.querySelector('.header-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
});

  // モバイル時サブメニュー開閉（任意）
  const hasSubItems = document.querySelectorAll('.has-sub');

  hasSubItems.forEach(item => {
    // PCではhoverで表示するためJS不要だが
    // モバイルではクリックで展開するとよい
    item.addEventListener('click', (e) => {
      // モバイル時のみ発火したいなら条件判定可
      if (window.innerWidth <= 768) {
        const subNav = item.querySelector('.sub-nav-list');
        if (subNav) {
          e.stopPropagation(); // 親liへのイベント伝播防止
          subNav.style.display = (subNav.style.display === 'block') ? 'none' : 'block';
        }
      }
    });
  });
});

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const syncPreference = () => root.classList.toggle('paused', reduced.matches);
  syncPreference();
  reduced.addEventListener('change', syncPreference);
  document.querySelector('#year').textContent = new Date().getFullYear();

  // Animate entry without ever hiding content behind JavaScript-dependent CSS.
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches && entry.target.animate) entry.target.animate([
        { opacity: .35, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 550, easing: 'ease-out' });
      reveal.unobserve(entry.target);
    }), { threshold: .06 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
  }

  const progress = document.querySelector('.progress');
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0;
    const height = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  addEventListener('resize', updateProgress);
  document.querySelectorAll('details').forEach(el => el.addEventListener('toggle', updateProgress));
  updateProgress();

  const wave = document.querySelector('.wave');
  if (wave) for (let i = 0; i < 36; i++) {
    const bar = document.createElement('i');
    bar.style.setProperty('--bar-index', String(i));
    bar.style.setProperty('--h', `${10 + Math.sin(i * 1.7) ** 2 * 24}px`);
    wave.append(bar);
  }

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.spotlight').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (reduced.matches) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      });
    });
  }

  const syncPageMotion = () => root.classList.toggle('page-hidden', document.hidden);
  document.addEventListener('visibilitychange', syncPageMotion);
  syncPageMotion();
  document.querySelectorAll('.video-pipeline li').forEach((step, index) => step.style.setProperty('--stage-index', String(index)));
  if ('IntersectionObserver' in window) {
    const activity = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-in-view', entry.isIntersecting);
    }), { threshold: .15 });
    document.querySelectorAll('.project').forEach(card => activity.observe(card));
  }

  const canvas = document.querySelector('#network');
  if (!canvas) return;
  let ctx;
  try { ctx = canvas.getContext('2d'); } catch { return; }
  if (!ctx) return;
  const mobile = matchMedia('(max-width: 700px)').matches;
  const count = mobile ? 75 : 120;
  const nodes = Array.from({ length: count }, (_, i) => {
    const y = 1 - i / (count - 1) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
  });
  // Connections are fixed; calculate them once instead of on every frame.
  const edges = [];
  for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
    const a = nodes[i], b = nodes[j];
    if ((a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2 < (mobile ? .25 : .16)) edges.push([i,j]);
  }
  let width = 0, height = 0, angle = 0, frame = 0, previous = 0, visible = false, pointer = 0;
  function render() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width,height)*.35, cx = width*.5, cy = height*.44;
    const a = angle + (reduced.matches ? 0 : pointer*.1);
    const cos = Math.cos(a), sin = Math.sin(a);
    const projected = nodes.map(n => {
      const x = n.x*cos-n.z*sin, z = n.x*sin+n.z*cos;
      return { x:cx+x*radius, y:cy+(n.y*.98-z*.2)*radius, z };
    });
    ctx.lineWidth = .7;
    for (const [i,j] of edges) {
      ctx.strokeStyle = `rgba(183,227,113,${.05+(projected[i].z+1)*.12})`;
      ctx.beginPath();ctx.moveTo(projected[i].x,projected[i].y);ctx.lineTo(projected[j].x,projected[j].y);ctx.stroke();
    }
    for (const point of projected) {
      ctx.fillStyle = `rgba(213,250,156,${.2+(point.z+1)*.35})`;
      ctx.beginPath();ctx.arc(point.x,point.y,1+(point.z+1)*.55,0,Math.PI*2);ctx.fill();
    }
  }
  function tick(time) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    if (time - previous >= (mobile ? 50 : 33)) {
      angle += Math.min(time-previous,60)*.000065;
      previous = time;
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden && !reduced.matches) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (visible && !document.hidden) render();
  }
  function resize() {
    const box = canvas.getBoundingClientRect();width=box.width;height=box.height;
    const ratio = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
    canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);render();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else addEventListener('resize',resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible=entries[0].isIntersecting;syncAnimation();
  }).observe(canvas);
  else visible=true;
  if (!mobile) {
    canvas.addEventListener('pointermove',event=>{const b=canvas.getBoundingClientRect();pointer=(event.clientX-b.left-width/2)/width;});
    canvas.addEventListener('pointerleave',()=>{pointer=0;});
  }
  document.addEventListener('visibilitychange',syncAnimation);
  reduced.addEventListener('change',syncAnimation);
  resize();syncAnimation();
})();

(() => {
  const viewport = document.querySelector('.category-carousel');
  const track = viewport?.querySelector('.category-grid');

  if (!viewport || !track) return;

  const autoSpeed = 14;
  const originals = [...track.children];
  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let animation;
  let loopWidth = 0;
  let dragging = false;
  let moved = false;
  let dragDistance = 0;
  let lastX = 0;
  let lastMoveTime = 0;
  let velocity = 0;
  let momentumFrame = 0;

  const buildAnimation = () => {
    const firstClone = track.children[originals.length];
    const nextWidth = firstClone.offsetLeft - track.children[0].offsetLeft;
    if (!nextWidth || nextWidth === loopWidth) return;

    const progress = animation
      ? (animation.currentTime % animation.effect.getTiming().duration) /
        animation.effect.getTiming().duration
      : 0;

    animation?.cancel();
    loopWidth = nextWidth;
    const duration = (loopWidth / autoSpeed) * 1000;
    animation = track.animate(
      [
        { transform: 'translate3d(0, 0, 0)' },
        { transform: `translate3d(${-loopWidth}px, 0, 0)` }
      ],
      { duration, iterations: Infinity, easing: 'linear' }
    );
    animation.currentTime = progress * duration;
  };

  const stopMomentum = () => {
    cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !animation) return;
    stopMomentum();
    dragging = true;
    moved = false;
    dragDistance = 0;
    velocity = 0;
    lastX = event.clientX;
    lastMoveTime = performance.now();
    animation.pause();
    animation.playbackRate = 1;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!dragging || !animation) return;
    const now = performance.now();
    const distance = event.clientX - lastX;
    const elapsed = Math.max(now - lastMoveTime, 1);
    const duration = animation.effect.getTiming().duration;
    const nextTime = animation.currentTime - (distance / autoSpeed) * 1000;
    animation.currentTime = ((nextTime % duration) + duration) % duration;
    velocity = velocity * 0.35 + (distance / elapsed) * 0.65;
    dragDistance += Math.abs(distance);
    moved = dragDistance > 4;
    lastX = event.clientX;
    lastMoveTime = now;
  });

  const settleMomentum = () => {
    if (!animation) return;
    const nextRate = animation.playbackRate + (1 - animation.playbackRate) * 0.09;
    animation.playbackRate = nextRate;
    if (Math.abs(nextRate - 1) < 0.02) {
      animation.playbackRate = 1;
      momentumFrame = 0;
      return;
    }
    momentumFrame = requestAnimationFrame(settleMomentum);
  };

  const release = (event) => {
    if (!dragging || !animation) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    const swipeRate = Math.max(-8, Math.min(8, (-velocity * 1000) / autoSpeed));
    animation.playbackRate = moved ? swipeRate : 1;
    animation.play();
    if (moved) momentumFrame = requestAnimationFrame(settleMomentum);
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('dragstart', (event) => event.preventDefault());
  viewport.addEventListener('click', (event) => {
    if (moved) event.preventDefault();
  }, true);

  new ResizeObserver(buildAnimation).observe(track);
  buildAnimation();
})();

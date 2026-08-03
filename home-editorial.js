(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const heroFrame = document.getElementById('heroImageFrame');

  if (!reducedMotion) {
    const heroSequence = [
      document.querySelector('.hero-greeting'),
      document.querySelector('.hero-name'),
      document.querySelector('.hero-roles'),
      document.querySelector('.hero-desc'),
      document.querySelector('.hero-links'),
    ].filter(Boolean);

    heroSequence.forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: 'translateY(26px)', filter: 'blur(7px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
        ],
        {
          duration: 760,
          delay: 100 + index * 105,
          easing: 'cubic-bezier(.22,1,.36,1)',
          fill: 'both',
        },
      );
    });
  }

  if (heroFrame && !reducedMotion) {
    heroFrame.animate(
      [
        { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(28px)' },
        { clipPath: 'inset(0 0 0% 0)', transform: 'translateY(0)' },
      ],
      { duration: 1050, delay: 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
    );

    const heroImage = heroFrame.querySelector('img');
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = 0;
    let raf = 0;

    const render = () => {
      raf = 0;
      heroImage.style.setProperty('--photo-x', `${pointerX.toFixed(2)}px`);
      heroImage.style.setProperty('--photo-y', `${(pointerY + scrollY).toFixed(2)}px`);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

    if (finePointer) {
      heroFrame.addEventListener('pointermove', (event) => {
        const bounds = heroFrame.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * -16;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
        schedule();
      }, { passive: true });
      heroFrame.addEventListener('pointerleave', () => {
        pointerX = 0;
        pointerY = 0;
        schedule();
      });
    }

    window.addEventListener('scroll', () => {
      const bounds = heroFrame.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      scrollY = Math.max(-20, Math.min(20, bounds.top * -0.025));
      schedule();
    }, { passive: true });
  }

  if (!reducedMotion) {
    const revealTargets = document.querySelectorAll(
      '.section-title, .about-portrait, .about-manifesto, .timeline-item, .project-card, .photo-card, .contact-item',
    );
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        const isPhoto = entry.target.classList.contains('photo-card') || entry.target.classList.contains('about-portrait');
        entry.target.animate(
          isPhoto
            ? [
              { opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translateY(34px)' },
              { opacity: 1, clipPath: 'inset(0 0 0% 0)', transform: 'translateY(0)' },
            ]
            : [
              { opacity: 0, transform: 'translateY(42px)', filter: 'blur(5px)' },
              { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
            ],
          {
            duration: isPhoto ? 920 : 720,
            delay: Math.min(180, Number(entry.target.dataset.revealDelay || 0)),
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'both',
          },
        );
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((target, index) => {
      target.dataset.revealDelay = String((index % 3) * 70);
      revealObserver.observe(target);
    });
  }

  const progress = document.createElement('div');
  progress.className = 'editorial-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let progressRaf = 0;
  const updateProgress = () => {
    progressRaf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };
  window.addEventListener('scroll', () => {
    if (!progressRaf) progressRaf = requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.photo-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  const dialog = document.getElementById('photoDialog');
  const dialogImage = document.getElementById('photoDialogImage');
  const dialogCaption = document.getElementById('photoDialogCaption');
  const closeButton = dialog?.querySelector('.photo-dialog-close');
  let lastTrigger = null;

  const openDialog = () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else {
      dialog.setAttribute('open', '');
      dialog.classList.add('fallback-open');
      document.body.classList.add('dialog-open');
      closeButton?.focus();
    }
  };
  const closeDialog = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      dialog.classList.remove('fallback-open');
      document.body.classList.remove('dialog-open');
      dialogImage.removeAttribute('src');
      lastTrigger?.focus();
    }
  };

  document.querySelectorAll('.photo-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (!dialog || !dialogImage || !dialogCaption) return;
      lastTrigger = card;
      const preview = card.querySelector('img');
      dialogImage.src = card.dataset.photo || preview.currentSrc || preview.src;
      dialogImage.alt = preview.alt;
      dialogCaption.textContent = card.dataset.caption || '';
      openDialog();
    });
  });

  closeButton?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog();
      return;
    }
    const bounds = dialog.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!inside) closeDialog();
  });
  dialog?.addEventListener('close', () => {
    dialogImage.removeAttribute('src');
    lastTrigger?.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog?.hasAttribute('open') && typeof dialog.close !== 'function') closeDialog();
  });
})();

function initApp() {
      // -------- Loader --------
      const loader = document.getElementById('loader');
      if (loader) {
        const hide = () => {
          setTimeout(() => {
            loader.style.opacity = 0;
            setTimeout(() => loader.remove(), 500);
          }, 1200);
        };
        if (document.readyState === 'complete') hide();
        else window.addEventListener('load', hide);
      }

      // -------- Lucide icons --------
      lucide.createIcons();

      // -------- Lenis smooth scroll --------
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // -------- GSAP setup --------
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // Anchor smooth scroll via Lenis
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          if (id.length > 1) {
            const t = document.querySelector(id);
            if (t) {
              e.preventDefault();
              lenis.scrollTo(t, { offset: -80, duration: 1.4 });
              const mm = document.getElementById('mobileMenu');
              if (mm) mm.classList.remove('open');
            }
          }
        });
      });

      // -------- Hero entrance --------
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('#home .reveal', {
          y: 40,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          delay: 0.4,
        });

      // -------- Hero rotating banner --------
      const slides = document.querySelectorAll('.hero-slide');
      const dots = document.querySelectorAll('#slideDots .dot');
      let curSlide = 0;
      function setSlide(i) {
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        dots.forEach((d, idx) => {
          d.classList.toggle('bg-white', idx === i);
          d.classList.toggle('bg-white/30', idx !== i);
        });
        curSlide = i;
      }
      if (slides.length) {
        setInterval(() => setSlide((curSlide + 1) % slides.length), 5000);
        dots.forEach((d) =>
          d.addEventListener('click', () => setSlide(+d.dataset.slide))
        );
      }

      // -------- Reveal on scroll (general) --------
      gsap.utils.toArray('.reveal').forEach((el) => {
        // Skip hero ones — already animated
        if (el.closest('#home')) return;
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // -------- Counters --------
      gsap.utils.toArray('[data-counter]').forEach((el) => {
        const end = +el.dataset.counter;
        const suffix = el.dataset.suffix || '+';
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: end,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () =>
                (el.textContent = Math.floor(obj.v) + suffix),
            });
          },
        });
      });

      // -------- Sticky nav shadow --------
      const nav = document.getElementById('mainNav');
      if (nav) {
        ScrollTrigger.create({
          start: 'top -50',
          end: 99999,
          onUpdate: (self) => {
            if (self.scroll() > 50) {
              nav.classList.add('shadow-soft');
            } else {
              nav.classList.remove('shadow-soft');
            }
          },
        });
      }

      // -------- Active nav link --------
      const sections = ['home', 'about', 'services', 'industries', 'process', 'insights', 'contact'];
      sections.forEach((id) => {
        const sec = document.getElementById(id);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) {
              document.querySelectorAll('.nav-link').forEach((l) => {
                const href = l.getAttribute('href');
                l.classList.toggle(
                  'active',
                  href === '#' + id || (id === 'about' && href === 'about.html')
                );
              });
            }
          },
        });
      });

      // -------- Scroll progress bar --------
      const sp = document.getElementById('scrollProgress');
      if (sp) {
        window.addEventListener('scroll', () => {
          const scroll =
            (document.documentElement.scrollTop /
              (document.documentElement.scrollHeight -
                document.documentElement.clientHeight)) *
            100;
          sp.style.width = scroll + '%';
        });
      }

      // -------- Mobile menu --------
      const menuBtn = document.getElementById('menuBtn');
      const closeMenu = document.getElementById('closeMenu');
      const mobileMenu = document.getElementById('mobileMenu');
      if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
      }
      if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
      }

      // -------- Magnetic / radial glow on cards --------
      document.querySelectorAll('.feat-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', e.clientX - rect.left + 'px');
          card.style.setProperty('--my', e.clientY - rect.top + 'px');
        });
      });

      // -------- Subtle parallax on hero blobs --------
      gsap.to('#home .blob:nth-of-type(1)', {
        yPercent: -20,
        scrollTrigger: { trigger: '#home', scrub: true },
      });
      gsap.to('#home .blob:nth-of-type(2)', {
        yPercent: 20,
        scrollTrigger: { trigger: '#home', scrub: true },
      });

      // -------- Process step pop on enter --------
      gsap.utils.toArray('#process .reveal').forEach((el, i) => {
        const node = el.querySelector('.shadow-glow');
        if (!node) return;
        gsap.from(node, {
          scale: 0.4,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // -------- CTA parallax background --------
      const ctaBg = document.getElementById('ctaBg');
      if (ctaBg) {
        gsap.to(ctaBg, {
          yPercent: 20,
          scrollTrigger: {
            trigger: ctaBg.parentElement,
            scrub: true,
          },
          ease: 'none',
        });
      }

      // -------- Gallery items scrub --------
      gsap.utils.toArray('section .reveal[class*="aspect-[3/4]"]').forEach((el, i) => {
        gsap.fromTo(el, {
          y: 60,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: (i % 4) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });

      // -------- Industry tile staggered entrance --------
      gsap.utils.toArray('.ind-tile').forEach((el, i) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: (i % 4) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
}

// Wait for header/footer partials before binding handlers to elements
// that live inside them (#mainNav, #menuBtn, #mobileMenu, #loader, #scrollProgress).
if (window.__partialsReady && typeof window.__partialsReady.then === 'function') {
  window.__partialsReady.then(initApp);
} else {
  initApp();
}

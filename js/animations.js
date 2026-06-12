'use strict';

(function () {
  let animationPluginsRegistered = false;

  function ensureAnimationPluginsReady() {
    if (animationPluginsRegistered) {
      return true;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return false;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    animationPluginsRegistered = true;
    return true;
  }

  function initHeroParallax() {
    if (!ensureAnimationPluginsReady()) {
      return;
    }

    const scrollDistance = document.querySelector('.scroll-dist');
    const bgDots = document.querySelector('.hero-bg-dots');
    const redGlow = document.querySelector('.hero-red-glow');
    const logo = document.querySelector('.hero-logo-wrap');
    const copy = document.querySelector('.hero-copy-wrap');

    if (!scrollDistance || !bgDots || !redGlow || !logo || !copy) {
      return;
    }

    window.gsap.timeline({
      defaults: {
        ease: 'none'
      },
      scrollTrigger: {
        trigger: '.scroll-dist',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })
      .to(bgDots, { y: -60 }, 0)
      .to(redGlow, { y: -100 }, 0)
      .to(logo, { y: -200 }, 0)
      .to(copy, { y: -320 }, 0);
  }

  function initScrollAnimations() {
    if (!ensureAnimationPluginsReady()) {
      return;
    }

    const animatedElements = window.gsap.utils.toArray('.gsap-hidden');

    if (!animatedElements.length) {
      return;
    }

    animatedElements.forEach(function (element, index) {
      window.gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 32
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: Math.min(index * 0.05, 0.2),
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          onComplete: function () {
            element.classList.add('is-visible');
          }
        }
      );
    });
  }

  function initHeroParticles() {
    var container = document.querySelector('.hero-particles-wrap');

    if (!container || !window.THREE) {
      return;
    }

    var SEPARATION = 150;
    var AMOUNTX = 40;
    var AMOUNTY = 60;
    var count = 0;

    var scene = new window.THREE.Scene();

    var camera = new window.THREE.PerspectiveCamera(
      60,
      container.offsetWidth / container.offsetHeight,
      1,
      10000
    );
    camera.position.set(0, 355, 1220);

    var renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var numParticles = AMOUNTX * AMOUNTY;
    var positions = new Float32Array(numParticles * 3);
    var scales = new Float32Array(numParticles);

    var ix, iy, index;
    for (ix = 0, index = 0; ix < AMOUNTX; ix++) {
      for (iy = 0; iy < AMOUNTY; iy++) {
        positions[index * 3]     = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        scales[index] = 1;
        index++;
      }
    }

    var geometry = new window.THREE.BufferGeometry();
    geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new window.THREE.BufferAttribute(scales, 1));

    var material = new window.THREE.PointsMaterial({
      color: new window.THREE.Color(0.83, 0.69, 0.22),
      size: 4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    });

    var particles = new window.THREE.Points(geometry, material);
    scene.add(particles);

    function onResize() {
      if (!container.offsetWidth) { return; }
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    window.addEventListener('resize', onResize);

    function animate() {
      requestAnimationFrame(animate);

      var posAttr = particles.geometry.attributes.position;
      var scaleAttr = particles.geometry.attributes.scale;

      for (ix = 0, index = 0; ix < AMOUNTX; ix++) {
        for (iy = 0; iy < AMOUNTY; iy++) {
          posAttr.array[index * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          scaleAttr.array[index] =
            (Math.sin((ix + count) * 0.3) + 1) * 4 +
            (Math.sin((iy + count) * 0.5) + 1) * 4;
          index++;
        }
      }

      posAttr.needsUpdate = true;
      scaleAttr.needsUpdate = true;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      count += 0.07;
    }

    animate();
  }

  window.initHeroParallax = initHeroParallax;
  window.initScrollAnimations = initScrollAnimations;
  window.initHeroParticles = initHeroParticles;
}());

'use strict';

(function () {
  let scrollToRegistered = false;

  function registerScrollToPluginOnce() {
    if (scrollToRegistered) {
      return true;
    }

    if (!window.gsap || !window.ScrollToPlugin) {
      return false;
    }

    window.gsap.registerPlugin(window.ScrollToPlugin);
    scrollToRegistered = true;
    return true;
  }

  function smoothScrollToTarget(targetSelector) {
    if (!targetSelector) {
      return;
    }

    const target = document.querySelector(targetSelector);

    if (!target) {
      return;
    }

    if (registerScrollToPluginOnce()) {
      window.gsap.to(window, {
        duration: 1,
        ease: 'power2.out',
        scrollTo: {
          y: target,
          offsetY: 80
        }
      });
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  function handleNavScroll() {
    const header = document.querySelector('.site-header');
    const scrollDistance = document.querySelector('.scroll-dist');

    if (!header) {
      return;
    }

    const threshold = scrollDistance
      ? (scrollDistance.getBoundingClientRect().bottom + window.scrollY) - window.innerHeight
      : window.innerHeight;

    if (window.scrollY >= Math.max(0, threshold)) {
      header.classList.add('scrolled');
      return;
    }

    header.classList.remove('scrolled');
  }

  function bindScrollTargets() {
    const triggers = document.querySelectorAll('[data-scroll-target]');

    if (!triggers.length) {
      return;
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        const targetSelector = trigger.getAttribute('data-scroll-target');

        if (!targetSelector) {
          return;
        }

        event.preventDefault();
        smoothScrollToTarget(targetSelector);
      });
    });
  }

  function initMobileNav() {
    const btn = document.querySelector('.nav-hamburger');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      });
    });
  }

  function initApp() {
    handleNavScroll();
    bindScrollTargets();
    initMobileNav();

    if (typeof window.initHeroParticles === 'function') {
      window.initHeroParticles();
    }

    if (typeof window.initHeroParallax === 'function') {
      window.initHeroParallax();
    }

    if (typeof window.initScrollAnimations === 'function') {
      window.initScrollAnimations();
    }

    if (typeof window.initContactForm === 'function') {
      window.initContactForm();
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    window.addEventListener('resize', handleNavScroll);
  }

  document.addEventListener('DOMContentLoaded', initApp);
}());

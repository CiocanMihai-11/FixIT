const contactDetails = {
  phone: "0741 074 081",
  whatsapp: "+40741074081",
  address: "Brașov, Strada Ștefan Baciu"
};

const isFilled = (value) => value && !/^\[.*\]$/.test(value.trim());
const phoneLink = document.querySelector('[data-contact="phone"]');
const addressLink = document.querySelector('[data-contact="address"]');
const whatsappLinks = document.querySelectorAll('[data-contact-cta="whatsapp"]');

if (phoneLink && isFilled(contactDetails.phone)) {
  phoneLink.textContent = contactDetails.phone;
  phoneLink.href = `tel:${contactDetails.phone.replace(/[^+\d]/g, "")}`;
}

if (addressLink && isFilled(contactDetails.address)) {
  addressLink.textContent = contactDetails.address;
  addressLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.address)}`;
  addressLink.target = "_blank";
  addressLink.rel = "noopener noreferrer";
}

if (isFilled(contactDetails.whatsapp)) {
  const whatsappNumber = contactDetails.whatsapp.replace(/\D/g, "");
  for (const link of whatsappLinks) {
    link.href = `https://wa.me/${whatsappNumber}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Deschide meniul' : 'Închide meniul');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Deschide meniul');
      mainNav.classList.remove('is-open');
    }
  });
}

document.querySelector('#current-year').textContent = new Date().getFullYear();

const galleryTrack = document.querySelector('[data-gallery-track]');

if (galleryTrack && !galleryTrack.closest('[hidden]')) {
  const gallerySlides = [...galleryTrack.querySelectorAll('[data-gallery-slide]')];
  const galleryControls = document.querySelector('[data-gallery-controls]');
  const galleryViewport = galleryTrack.closest('.gallery-viewport');

  if (gallerySlides.length > 1 && galleryControls && galleryViewport) {
    let activeGallerySlide = 0;
    let galleryTimer;
    galleryViewport.classList.add('is-carousel');
    galleryTrack.classList.add('is-carousel');
    galleryTrack.style.width = `${gallerySlides.length * 100}%`;
    gallerySlides.forEach((slide) => {
      slide.style.flexBasis = `${100 / gallerySlides.length}%`;
    });

    galleryControls.hidden = false;
    gallerySlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot';
      dot.setAttribute('aria-label', `Setul de imagini ${index + 1} din ${gallerySlides.length}`);
      dot.setAttribute('aria-current', String(index === 0));
      dot.addEventListener('click', () => {
        showGallerySlide(index);
        startGalleryTimer();
      });
      galleryControls.append(dot);
    });

    const showGallerySlide = (index) => {
      activeGallerySlide = (index + gallerySlides.length) % gallerySlides.length;
      galleryTrack.style.transform = `translateX(-${activeGallerySlide * (100 / gallerySlides.length)}%)`;
      gallerySlides.forEach((slide, slideIndex) => {
        slide.setAttribute('aria-hidden', String(slideIndex !== activeGallerySlide));
      });
      [...galleryControls.children].forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', String(dotIndex === activeGallerySlide));
      });
    };

    const stopGalleryTimer = () => window.clearInterval(galleryTimer);
    const startGalleryTimer = () => {
      stopGalleryTimer();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        galleryTimer = window.setInterval(() => showGallerySlide(activeGallerySlide + 1), 4800);
      }
    };

    galleryTrack.addEventListener('mouseenter', stopGalleryTimer);
    galleryTrack.addEventListener('mouseleave', startGalleryTimer);
    galleryTrack.addEventListener('focusin', stopGalleryTimer);
    galleryTrack.addEventListener('focusout', startGalleryTimer);
    showGallerySlide(0);
    startGalleryTimer();
  }
}


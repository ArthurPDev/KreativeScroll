class SmoothScroll {
  constructor(smoothness) {
    const isMobileOrIpad = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || /MacIntel/.test(window.navigator.platform) && navigator.maxTouchPoints > 1;

    if (isMobileOrIpad) return;


    this.smoothness = smoothness || 0.08;
    this.currentScrollPosition = window.pageYOffset;
    this.targetScrollPosition = this.currentScrollPosition;
    this.enableScroll = true;

    // Ajouter une nouvelle propriété pour suivre si l'utilisateur est en train de faire défiler la barre
    this.isScrollingScrollbar = false;

    this.onWheel = this.onWheel.bind(this);
    this.animateScroll = this.animateScroll.bind(this);

    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    requestAnimationFrame(this.animateScroll);

    window.addEventListener('click', this.onAnchorClick.bind(this));

    // Remplacer l'écouteur d'événements ici
    const selectElements = document.querySelectorAll('.selectScroll');
    selectElements.forEach(selectElement => {
        selectElement.addEventListener('change', this.onSelectChange.bind(this));
    });
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  onAnchorClick(e) {
    const target = e.target;
    if (target.tagName.toLowerCase() === 'a') {
      const href = target.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          this.targetScrollPosition = this.getOffsetTop(targetElement);
        }
      }
    }
  }

  onSelectChange(e) {
    const target = e.target;
    if (target.tagName.toLowerCase() === 'select') {
      const selectedOptionValue = target.value;
      const targetElement = document.getElementById(selectedOptionValue);
      if (targetElement) {
        this.targetScrollPosition = this.getOffsetTop(targetElement);
        window.location.hash = selectedOptionValue;  // Update the hash
      }
    }
  }

  getOffsetTop(element) {
    let offsetTop = element.offsetTop;
    let currentElement = element;
    while (currentElement.offsetParent) {
      currentElement = currentElement.offsetParent;
      offsetTop += currentElement.offsetTop;
    }
    return offsetTop;
  }

  onWheel(e) {
    if (!this.enableScroll || this.isScrollingScrollbar) return;

    e.preventDefault();
    const deltaY = e.deltaY * 1.5;
    const potentialTargetScrollPosition = this.targetScrollPosition + deltaY;
    const clampedTargetScrollPosition = this.clampScrollPosition(potentialTargetScrollPosition);

    const decelerationFactor = this.getDecelerationFactor(deltaY);
    this.targetScrollPosition += deltaY * decelerationFactor;
  }

  clampScrollPosition(position) {
    const maxScrollPosition = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(position, maxScrollPosition));
  }

  animateScroll() {
    if (!this.isScrollingScrollbar) {
      this.currentScrollPosition = this.lerp(this.currentScrollPosition, this.targetScrollPosition, this.smoothness);
      window.scrollTo(0, this.clampScrollPosition(this.currentScrollPosition));
    }
    requestAnimationFrame(this.animateScroll);
  }

  getDecelerationFactor(deltaY) {
    const isAtTop = this.targetScrollPosition <= 0 && deltaY < 0;
    const isAtBottom = this.targetScrollPosition >= document.documentElement.scrollHeight - window.innerHeight && deltaY > 0;
    const distanceToTop = this.targetScrollPosition;
    const distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - this.targetScrollPosition;

    if (isAtTop) {
      return Math.min(1, Math.exp(distanceToTop / 100 - 1));
    } else if (isAtBottom) {
      return Math.min(1, Math.exp(distanceToBottom / 100 - 1));
    } else {
      return 1;
    }
  }

  onMouseDown(e) {
    // Vérifier si l'utilisateur clique sur la barre de défilement
    this.isScrollingScrollbar = (e.clientX > document.documentElement.clientWidth - 20);
    if (e.button === 1) {
      this.enableScroll = false;
    }
  }

  onMouseUp(e) {
    if (this.isScrollingScrollbar) {
      // Mettre à jour la position cible du scroll à la position actuelle de la page
      this.targetScrollPosition = window.pageYOffset;
      this.currentScrollPosition = window.pageYOffset;
    }
    // L'utilisateur n'est plus en train de faire défiler la barre
    this.isScrollingScrollbar = false;
    if (e.button === 1) {
      this.enableScroll = true;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const smoothScroll = new SmoothScroll(0.0195);
});

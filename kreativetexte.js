class TextAnimation {
  constructor(config) {
    this.config = {
      onLoad: true,
      invisibleOutsideTrigger: false, // Nouveau paramètre pour rendre invisible hors du trigger
      ...config
    };
    this.elements = document.querySelectorAll(this.config.selector);
    this.lastScrollPosition = window.scrollY;
    this.applyBorderRadius = this.config.applyBorderRadius === true;
    this.init();
  }

  init() {
    this.elements.forEach((element) => {
      if (this.config.onLoad) {
        this.applyEffect(element);
      }

      if (this.config.invisibleOutsideTrigger) {
        element.style.visibility = 'hidden';
      }

      if (this.config.hover) {
        element.addEventListener("mouseenter", () => {
          this.applyEffect(element);
        });

        element.addEventListener("mouseleave", () => {
          element.animationCompleted = false;
        });
      }
    });

    window.addEventListener("scroll", () => {
      this.tick();
    });
  }

  tick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateAnimations();
        this.ticking = false;
      });

      this.ticking = true;
    }
  }

  updateAnimations() {
    const scrollDirection = window.scrollY > this.lastScrollPosition ? "down" : "up";
    this.lastScrollPosition = window.scrollY;

    this.elements.forEach((element) => {
        const positionElement = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const triggerPosition = windowHeight * (1 - this.config.trigger);

        if (positionElement >= 0 && positionElement <= windowHeight) {
            if (positionElement < triggerPosition) {
                if (!element.classList.contains("animated")) {
                    element.classList.add("animated");
                    this.applyEffect(element);
                    element.animationTriggered = true; // Ajouter cette ligne
                }
                // Si l'élément est à l'intérieur du trigger, le rendre visible
                if (this.config.invisibleOutsideTrigger) {
                    element.style.visibility = 'visible';
                }
            } else if (!this.config.onLoad && !element.animationTriggered) { // Modifier la condition ici
                element.classList.remove("animated");
                element.isAnimating = false;
                // Si l'élément est hors du trigger, le rendre invisible
                if (this.config.invisibleOutsideTrigger) {
                    element.style.visibility = 'hidden';
                }
            }
        }
    });
}






  applyEffect(element) {
    if (element.isAnimating) {
      return;
    }

    element.isAnimating = true;

    switch (this.config.effect) {
      case 'typing':
        this.typingEffect(element);
        break;
      case 'shuffle':
        this.shuffleEffect(element);
        break;
      case 'bounce':
        this.bounceEffect(element);
        break;
      case 'slide':
        this.slideEffect(element);
        break;
      case 'valley':
        this.valleyEffect(element);
        break;
      case 'wave':
        this.waveSlideEffect(element);
        break;
      case 'bouncing':
        this.bounceInEffect(element);
        break;
      case 'flip':
        this.flipInEffect(element);
        break;
      case 'scaleIn':
        this.scaleInEffect(element);
        break;
      case 'bubble':
        this.bubbleUpEffect(element);
        break;
      case 'centerbubble':
        this.centerBubbleUpEffect(element);
        break;
      case 'flipRotate':
        this.flipRotateEffect(element);
        break;
      case 'slideAndRotate': // Ajouter le nouvel effet ici
        this.slideAndRotateEffect(element);
        break;
      case 'diagonalFadeIn': // Ajouter le nouvel effet ici
        this.diagonalFadeInEffect(element);
        break;
      case 'lineEffet': 
        this.fadeInUpEffect(element);
        break;
      default:
        console.error('Effet inconnu');
    }
  }

  diagonalFadeInEffect(element) {
    const text = element.textContent;
    const duration = (this.config.duration || 2) * 1000;
  
    element.innerHTML = '';
  
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    element.appendChild(wrapper);
  
    const innerWrapper = document.createElement('span');
    innerWrapper.textContent = text;
    innerWrapper.style.display = 'inline-block';
    innerWrapper.style.transformStyle = 'preserve-3d';
    wrapper.appendChild(innerWrapper);
  
    const keyframes = [
      { transform: 'translate(-50%, 50%)', opacity: 0, offset: 0 },
      { transform: 'translate(0, 0)', opacity: 1, offset: 1 },
    ];
  
    innerWrapper.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'forwards',
    });
  }
  

  slideAndRotateEffect(element) {
    const text = element.textContent;
    const duration = (this.config.duration || 2) * 1000;
    const rotation = this.config.rotation || 10;

    element.innerHTML = '';

    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    element.appendChild(wrapper);

    const innerWrapper = document.createElement('span');
    innerWrapper.textContent = text;
    innerWrapper.style.display = 'inline-block';
    innerWrapper.style.transformOrigin = 'bottom';
    innerWrapper.style.transformStyle = 'preserve-3d';
    wrapper.appendChild(innerWrapper);

    const keyframes = [
      {
        transform: `translateY(100%) rotate(${rotation}deg)`,
        opacity: 0,
        offset: 0,
      },
      {
        transform: `translateY(0) rotate(0)`,
        opacity: 1,
        offset: 1,
      },
    ];

    innerWrapper.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'forwards',
    });
  }


  flipRotateEffect(element) {
    const text = element.textContent;
    const duration = (this.config.duration || 2) * 1000;
    const rotation = -(this.config.rotation || 10); // Inverser la direction de la rotation

    element.innerHTML = '';

    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    wrapper.style.perspective = '1000px';
    element.appendChild(wrapper);

    const innerWrapper = document.createElement('span');
    innerWrapper.textContent = text;
    innerWrapper.style.display = 'inline-block';
    innerWrapper.style.transformOrigin = 'bottom'; // Modifier l'origine de la transformation
    innerWrapper.style.transformStyle = 'preserve-3d';
    wrapper.appendChild(innerWrapper);

    const keyframes = [
      { transform: `rotateX(-90deg) rotateZ(${rotation}deg)`, opacity: 0, offset: 0 }, // Inverser la rotation sur l'axe X
      { transform: `rotateX(0) rotateZ(0)`, opacity: 1, offset: 1 }
    ];

    innerWrapper.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'forwards'
    });
  }


  slideInColorShiftEffect(element) {
    const text = element.textContent;
    const letters = text.split('');
    const duration = (this.config.duration || 2) * 1000;
    const distanceX = this.config.distanceX || 50;
    const distanceY = this.config.distanceY || 50;
    const colors = this.config.colors || ['#e74c3c', '#3498db', '#9b59b6'];

    element.innerHTML = '';

    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.display = 'inline-block';
      element.appendChild(span);

      if (letter !== ' ') {
        span.style.opacity = '0';
        span.style.transform = `translate(${distanceX}px, ${distanceY}px)`;

        const positionKeyframes = [
          { transform: `translate(${distanceX}px, ${distanceY}px)`, opacity: 0, offset: 0 },
          { transform: 'translate(0, 0)', opacity: 1, offset: 1 }
        ];

        const colorKeyframes = [
          { color: colors[0], offset: 0 },
          { color: colors[1], offset: 0.5 },
          { color: colors[2], offset: 1 }
        ];

        setTimeout(() => {
          span.animate(positionKeyframes, {
            duration: duration,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            fill: 'forwards'
          });

          span.animate(colorKeyframes, {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
          });
        }, index * (duration / letters.length));
      } else {
        span.style.width = '0.25em';
      }
    });
  }




  centerBubbleUpEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distanceY = this.config.distanceY || 100;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      const centerIndex = Math.floor(letters.length / 2);
  
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        wordContainer.appendChild(span);
  
        if (letter !== ' ') {
          const distanceFactor = Math.abs((letterIndex - centerIndex) / centerIndex);
          const translateY = distanceY * distanceFactor;
  
          span.style.opacity = '0';
          span.style.transform = `translateY(${translateY}px)`;
  
          const keyframes = [
            { transform: `translateY(${translateY}px)`, opacity: 0, offset: 0 },
            { transform: 'translateY(0)', opacity: 1, offset: 1 }
          ];
  
          const randomDelay = Math.random() * (duration / 2);
          const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length) + randomDelay;
  
          span.animate(keyframes, {
            duration: duration,
            delay: animationDelay,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            fill: 'forwards'
          });
        }
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }

  
  fadeInUpEffect(element) {
    const lines = element.textContent.split('\n');
    const duration = (this.config.duration || 2) * 1000;
    const distanceY = this.config.distanceY || 50;
  
    element.innerHTML = '';
  
    lines.forEach((line, index) => {
      const lineContainer = document.createElement('div');
      lineContainer.textContent = line;
      lineContainer.style.opacity = '0';
      lineContainer.style.transform = `translateY(${distanceY}px)`;
      element.appendChild(lineContainer);
  
      const keyframes = [
        { transform: `translateY(${distanceY}px)`, opacity: 0, offset: 0 },
        { transform: 'translateY(0)', opacity: 1, offset: 1 }
      ];
  
      setTimeout(() => {
        lineContainer.animate(keyframes, {
          duration: duration,
          easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
          fill: 'forwards'
        });
      }, index * (duration / lines.length));
    });
  }
  
  



  bubbleUpEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distanceY = this.config.distanceY || 100;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        wordContainer.appendChild(span);
  
        span.style.opacity = '0';
        span.style.transform = `translateY(${distanceY}px)`;
  
        const keyframes = [
          { transform: `translateY(${distanceY}px)`, opacity: 0, offset: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ];
  
        const randomDelay = Math.random() * (duration / 2);
  
        setTimeout(() => {
          span.animate(keyframes, {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            fill: 'forwards'
          });
        }, wordIndex * (duration / words.length) + letterIndex * (duration / words.length / letters.length) + randomDelay);
      });
  
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.textContent = ' ';
        element.appendChild(spaceSpan);
      }
    });
  }
  
  
  





  scaleInEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distanceY = this.config.distanceY || 10;
    const rotationZ = this.config.rotationZ || 15;
    const colors = this.config.colors || ['#f44336', '#2196f3', '#4caf50'];
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        wordContainer.appendChild(span);
  
        if (letter !== ' ') {
          span.style.opacity = '0';
          span.style.transform = `translateY(${distanceY}px) scale(0) rotateZ(${rotationZ}deg)`;
  
          const keyframes = [
            { transform: `translateY(${distanceY}px) scale(0) rotateZ(${rotationZ}deg)`, opacity: 0, offset: 0 },
            { transform: `translateY(-${distanceY / 2}px) scale(1.2) rotateZ(-${rotationZ / 2}deg)`, opacity: 1, offset: 0.6 },
            { transform: 'translateY(0) scale(1) rotateZ(0)', opacity: 1, offset: 1 }
          ];
  
          const colorKeyframes = [
            { color: colors[0], offset: 0 },
            { color: colors[1], offset: 0.4 },
            { color: colors[2], offset: 0.8 },
            { color: colors[0], offset: 1 }
          ];
  
          const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length);
          setTimeout(() => {
            span.animate(keyframes, {
              duration: duration,
              easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              fill: 'forwards'
            });
  
            span.animate(colorKeyframes, {
              duration: duration,
              easing: 'linear',
              fill: 'forwards'
            });
          }, animationDelay);
        }
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }
  







  flipInEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.transformOrigin = '50% 100%';
        wordContainer.appendChild(span);
  
        if (letter !== ' ') {
          span.style.opacity = '0';
  
          const keyframes = [
            { transform: 'rotateX(90deg)', opacity: 0, offset: 0 },
            { transform: 'rotateX(-10deg)', opacity: 1, offset: 0.8 },
            { transform: 'rotateX(0deg)', opacity: 1, offset: 1 }
          ];
  
          const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length);
          setTimeout(() => {
            span.animate(keyframes, {
              duration: duration,
              easing: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
              fill: 'forwards'
            });
          }, animationDelay);
        }
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }
  



  valleyEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distance = this.config.distance || 50;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      element.appendChild(wordSpan);
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.style.opacity = '0'; 
        wordSpan.appendChild(span);
  
        if (letter !== ' ') {
          const animationDistance = distance * (letters.length - letterIndex);
          span.style.transform = `translateY(${animationDistance}px)`;
  
          const keyframes = [
            { transform: `translateY(${animationDistance}px)`, opacity: 1, offset: 0 },
            { transform: 'translateY(0)', opacity: 1, offset: 1 }
          ];
  
          setTimeout(() => {
            span.animate(keyframes, {
              duration: duration,
              easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              fill: 'forwards'
            });
          }, wordIndex * (duration / words.length) + letterIndex * (duration / words.length / letters.length));
        }
      });
    });
  }
  
  


  waveSlideEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distanceX = this.config.distanceX || 50;
    const distanceY = this.config.distanceY || 50;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      element.appendChild(wordSpan);
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.style.display = 'inline-block';
        wordSpan.appendChild(letterSpan);
  
        letterSpan.style.opacity = '0';
  
        const keyframes = [
          { transform: `translateX(-${distanceX}px) translateY(${distanceY}px)`, opacity: 0, offset: 0 },
          { transform: `translateX(${distanceX / 2}px) translateY(-${distanceY / 2}px)`, opacity: 0.5, offset: 0.5 },
          { transform: 'translateX(0) translateY(0)', opacity: 1, offset: 1 }
        ];
  
        setTimeout(() => {
          letterSpan.animate(keyframes, {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            fill: 'forwards'
          });
        }, wordIndex * (duration / words.length) + letterIndex * (duration / words.length / letters.length));
      });
    });
  }
  

  bounceInEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const distanceY = this.config.distanceY || 50;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        wordContainer.appendChild(span);
  
        span.style.opacity = '0';
  
        const keyframes = [
          { transform: `translateY(${distanceY}px)`, opacity: 0, offset: 0 },
          { transform: 'translateY(-20px)', opacity: 1, offset: 0.6 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ];
  
        const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length);
        setTimeout(() => {
          span.animate(keyframes, {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            fill: 'forwards'
          });
        }, animationDelay);
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }
  
  
  




  typingEffect(element) {
    const text = element.textContent;
    const speed = this.config.speed || 100;
    element.textContent = '';
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }

      if (i === text.length) {
        element.isAnimating = false;
      }

    };

    typeWriter();
  }

  shuffleEffect(element) {
    const text = element.textContent;
    const speed = this.config.speed || 50;
    const duration = (this.config.duration || 2) * 1000; // Conversion en millisecondes
    const originalLength = text.replace(/\s+/g, '').length; // Longueur du mot sans les espaces
    let shuffledText = '';
    let i = 0;
  
    const generateShuffledText = () => {
      shuffledText = '';
      for (let j = 0; j < text.length; j++) {
        if (text.charAt(j) === ' ') {
          shuffledText += ' ';
        } else {
          const nonSpaceChars = text.replace(/\s+/g, '');
          const randomIndex = Math.floor(Math.random() * nonSpaceChars.length);
          shuffledText += nonSpaceChars.charAt(randomIndex);
        }
      }
  
      // Vérification et ajustement de la longueur du mot mélangé
      if (shuffledText.length > originalLength) {
        shuffledText = shuffledText.slice(0, originalLength);
      }
  
      element.textContent = shuffledText;
    };
  
    const shuffle = () => {
      if (i < duration / speed) {
        generateShuffledText();
        i++;
        setTimeout(shuffle, speed);
      } else {
        // Ajout d'un setTimeout pour rétablir le texte initial après la durée de l'animation
        setTimeout(() => {
          element.textContent = text;
          element.isAnimating = false;
        }, speed);
      }
    };
  
    shuffle();
  }
  

  slideEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
    const direction = this.config.direction || 'down';
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        span.style.opacity = '0';  // set initial opacity to 0
        wordContainer.appendChild(span);
  
        const initialPosition = direction === 'up' ? '100%' : '-100%';
  
        if (letter !== ' ') {
          const keyframes = [
            { transform: `translateY(${initialPosition})`, opacity: 0, offset: 0 },
            { transform: 'translateY(0)', opacity: 1, offset: 1 }
          ];
  
          const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length);
          setTimeout(() => {
            span.animate(keyframes, {
              duration: duration,
              easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              fill: 'forwards',
            });
          }, animationDelay);
        }
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }
  
  



  bounceEffect(element) {
    const text = element.textContent;
    const words = text.split(' ');
    const duration = (this.config.duration || 2) * 1000;
  
    element.innerHTML = '';
  
    words.forEach((word, wordIndex) => {
      const wordContainer = document.createElement('span');
      wordContainer.style.display = 'inline-block';
      element.appendChild(wordContainer);
  
      const letters = word.split('');
      letters.forEach((letter, letterIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        wordContainer.appendChild(span);
  
        if (letter !== ' ') {
          const keyframes = [
            { transform: 'translateY(0)', offset: 0 },
            { transform: 'translateY(-20px)', offset: 0.6 },
            { transform: 'translateY(0)', offset: 1 }
          ];
  
          const animationDelay = wordIndex * (duration / (words.length + 1)) + letterIndex * (duration / words.length / letters.length);
          setTimeout(() => {
            span.animate(keyframes, {
              duration: duration,
              easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
              fill: 'forwards',
            });
          }, animationDelay);
        }
      });
  
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        element.appendChild(space);
      }
    });
  }
  
}



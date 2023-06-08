class AnimationScroll {
  constructor(config) {
    this.config = config;
    this.elements = document.querySelectorAll(this.config.selector);
    this.lastScrollPosition = window.scrollY;
    this.applyBorderRadius = this.config.applyBorderRadius === true;
    this.colorEffect = this.config.colorEffect === true;
    this.hover = this.config.hover === true; // Ajout du paramètre hover
    this.init();
  }



  init() {
    if (this.config.onLoad) {
      window.addEventListener("load", () => {
        this.elements.forEach((element, index) => {
          const delay = this.config.pauseOnScroll ? 0 : (this.config.delay || 0) * index * 1000;
          setTimeout(() => {
            this.animateOnLoad(element);
          }, delay);
        });
      });
    }
  
    if (this.config.draggable) {
      this.initDraggable();
    }
  
    if (this.config.gravity) {
      this.initGravity();
    }
  
    this.elements.forEach((element) => {
      const initialRotation = this.getInitialRotation(element);
      element.dataset.initialRotation = initialRotation;
      this.applyInitialArcBorderRadius(element);
    });
  
    window.addEventListener("resize", () => {
      this.updateAnimations();
    });
  
    const animateOnScroll = () => {
      const scrollDirection = window.scrollY > this.lastScrollPosition ? "down" : "up";
      this.lastScrollPosition = window.scrollY;
    
      this.elements.forEach((element, index) => {
        const positionElement = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const triggerPosition = windowHeight * (1 - this.config.trigger);
    
        if (positionElement < triggerPosition) {
          const scrollProgress = Math.min(1, 1 - (positionElement / triggerPosition));
          const delay = (this.config.delay || 0) * index;
    
          if (element.getAttribute("data-initialized") === "false") {
            element.setAttribute("data-initialized", "true");
          }
    
          if (this.config.pauseOnScroll) {
            this.applyAnimation(element, scrollProgress, scrollDirection);
          } else {
            if (!element.classList.contains("animated")) {
              element.classList.add("animated");
              setTimeout(() => {
                this.applyAnimation(element, 1, scrollDirection);
              }, delay * 1000);
            }
          }
        } else {
          if (!this.config.pauseOnScroll && this.config.onLoad && element.getAttribute("data-initialized") === "true") {
            element.classList.remove("animated");
            this.applyReverseAnimation(element, scrollDirection === "down" ? 0 : 1, scrollDirection);
          } else {
            this.removeAnimation(element);
          }
        }
      });
    
      requestAnimationFrame(animateOnScroll);
    };
    
    
  
    if (this.hover) { // Ajout de la condition pour gérer le hover
      this.elements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
          this.animateElement(element, 1, 'down');
        });
  
        element.addEventListener('mouseleave', () => {
          this.applyReverseAnimation(element, 1, 'up');
        });
      });
    } else {
      requestAnimationFrame(animateOnScroll);
    }
  }
  









  animateOnLoad(element) {
    this.applyAnimation(element, 1, "down");
    if (this.config.pauseOnScroll) {
      element.classList.add("animated");
    }
  }


  applyInitialArcBorderRadius(element) {
    if (this.config.arcBorderRadiusEffect) {
      const arcSize = this.config.arcSize || 20;
      const arcPosition = this.config.arcPosition || 'top';
      const arcDirection = this.config.arcDirection || 'inward';

      if (arcPosition === 'top') {
        if (arcDirection === 'inward') {
          element.style.borderTopLeftRadius = `100% ${arcSize}%`;
          element.style.borderTopRightRadius = `100% ${arcSize}%`;
        } else {
          element.style.borderTopLeftRadius = `100% ${100 - arcSize}%`;
          element.style.borderTopRightRadius = `100% ${100 - arcSize}%`;
        }
      } else if (arcPosition === 'bottom') {
        if (arcDirection === 'inward') {
          element.style.borderBottomLeftRadius = `100% ${arcSize}%`;
          element.style.borderBottomRightRadius = `100% ${arcSize}%`;
        } else {
          element.style.borderBottomLeftRadius = `100% ${100 - arcSize}%`;
          element.style.borderBottomRightRadius = `100% ${100 - arcSize}%`;
        }
      }
    }
  }






  applyColorEffect(element, progress) {
    const startColor = this.config.startColor || '#000000';
    const endColor = this.config.endColor || '#ffffff';
    const startTextColor = this.config.startTextColor || '#ffffff';
    const endTextColor = this.config.endTextColor || '#000000';

    const blend = (start, end, progress) => {
      const startInt = parseInt(start, 16);
      const endInt = parseInt(end, 16);
      const resultInt = Math.floor(startInt + (endInt - startInt) * progress);
      return resultInt.toString(16).padStart(2, '0');
    };

    const blendColor = (startColor, endColor, progress) => {
      const r = blend(startColor.slice(1, 3), endColor.slice(1, 3), progress);
      const g = blend(startColor.slice(3, 5), endColor.slice(3, 5), progress);
      const b = blend(startColor.slice(5, 7), endColor.slice(5, 7), progress);
      return `#${r}${g}${b}`;
    };

    element.style.backgroundColor = blendColor(startColor, endColor, progress);
    element.style.color = blendColor(startTextColor, endTextColor, progress);
  }




  interpolateColor(color1, color2, factor) {
    const getColorValues = (color) => {
      const rgba = color.match(/(\d+\.?\d*|\.\d+)/g);
      return rgba ? rgba.map(Number) : [0, 0, 0, 0];
    };

    const c1 = getColorValues(color1);
    const c2 = getColorValues(color2);

    const r = c1[0] + factor * (c2[0] - c1[0]);
    const g = c1[1] + factor * (c2[1] - c1[1]);
    const b = c1[2] + factor * (c2[2] - c1[2]);
    const a = c1[3] + factor * (c2[3] - c1[3]);

    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`;
  }




  applyBorderRadiusEffect(element, progress) {
    const startBorderRadius = parseFloat(this.config.startBorderRadius) || 0;
    const endBorderRadius = parseFloat(this.config.endBorderRadius) || 0;
    const currentBorderRadius = startBorderRadius + progress * (endBorderRadius - startBorderRadius);

    const borderRadiusControl = this.config.borderRadiusControl || 'both';

    if (borderRadiusControl === 'top') {
      element.style.borderTopLeftRadius = `${currentBorderRadius}%`;
      element.style.borderTopRightRadius = `${currentBorderRadius}%`;
    } else if (borderRadiusControl === 'bottom') {
      element.style.borderBottomLeftRadius = `${currentBorderRadius}%`;
      element.style.borderBottomRightRadius = `${currentBorderRadius}%`;
    } else {
      element.style.borderRadius = `${currentBorderRadius}%`;
    }
  }


  applyArcBorderRadius(element, progress) {
    const startArcSize = this.config.startArcSize || 50;
    const endArcSize = this.config.endArcSize || 0;
    const arcPosition = this.config.arcPosition || 'top';
    const arcDirection = this.config.arcDirection || 'inward';

    let currentArcSize;

    if (arcDirection === 'inward') {
      currentArcSize = startArcSize * (1 - progress) + endArcSize * progress;
    } else {
      currentArcSize = startArcSize + (endArcSize - startArcSize) * progress;
    }

    const pixelSize = Math.round((currentArcSize / 100) * element.offsetHeight);

    if (arcPosition === 'top') {
      element.style.borderTopLeftRadius = `${pixelSize}px ${pixelSize}px`;
      element.style.borderTopRightRadius = `${pixelSize}px ${pixelSize}px`;
    } else if (arcPosition === 'bottom') {
      element.style.borderBottomLeftRadius = `${pixelSize}px ${pixelSize}px`;
      element.style.borderBottomRightRadius = `${pixelSize}px ${pixelSize}px`;
    }
  }




  getInitialRotation(element) {
    const style = getComputedStyle(element);
    const transform = style.transform;
    if (transform === "none") {
      return 0;
    }

    const matrix = transform.match(/-?\d+(\.\d+)?/g);
    const a = parseFloat(matrix[0]);
    const b = parseFloat(matrix[1]);
    const rotation = Math.atan2(b, a) * (180 / Math.PI);
    return rotation;
  }






  applyAnimation(element, progress, scrollDirection) {
    const scrollSpeed = this.config.scrollSpeed || 1;
    const adjustedProgress = Math.min(1, progress * scrollSpeed);
    const easedProgress = this.getEasedProgress(adjustedProgress);

    const x = this.config.transform.includes('x') ? this.getTransformValue("x", easedProgress) : 0;
    const y = this.config.transform.includes('y') ? this.getTransformValue("y", easedProgress) : 0;
    const r = this.config.transform.includes('r') ? this.getTransformValue("r", easedProgress) + parseFloat(element.dataset.initialRotation) : parseFloat(element.dataset.initialRotation);
    const s = this.config.transform.includes('s') ? this.getTransformValue("s", easedProgress) : 1;
    const k = this.config.transform.includes('k') ? this.getTransformValue("k", easedProgress) : 0;

    // element.style.willChange = 'transform, opacity, filter'; // Ajouté
    element.style.transformStyle = 'preserve-3d'; // Ajouté
    element.style.outline = "none"; // Ajouté
    element.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0)"; // Ajouté

    element.style.transform = `
  translate3d(${x}px, ${y}px, 0)
  rotate(${r}deg)
  scale(${s})
  skew(${k}deg)
  ` + 'translateZ(0)';

    element.style.opacity = this.getTransformValue("o", easedProgress);
    element.style.filter = `blur(${this.getTransformValue("b", easedProgress)}px)`;
    element.style.transitionDuration = this.config.pauseOnScroll ? "0s" : `${this.config.duration || 2}s`;
    if (this.applyBorderRadius) {
      this.applyBorderRadiusEffect(element, easedProgress);
    }

    if (this.config.innerScroll && element.tagName.toLowerCase() === 'img') {
      const innerScrollSpeed = this.config.innerScrollSpeed || 1;
      const innerScrollProgress = Math.min(1, progress * innerScrollSpeed);
      element.style.objectPosition = `0% ${innerScrollProgress * 100}%`;

      // Ajouter ces lignes pour appliquer les styles nécessaires sans utiliser de CSS
      element.style.height = '100%';
      element.style.width = '100%';
      element.style.objectFit = 'cover';
      element.style.overflow = 'hidden';
    }



    if (this.colorEffect) { // Ajout de la condition pour appliquer l'effet de couleur
      this.applyColorEffect(element, progress);
    }

    if (this.config.arcBorderRadiusEffect) {
      this.applyArcBorderRadius(element, progress);
    }




  }







  applyReverseAnimation(element, scrollProgress, scrollDirection) {
    const scrollSpeed = this.config.scrollSpeed || 1;
    const adjustedProgress = Math.min(1, scrollProgress * scrollSpeed);
    const easedProgress = this.getEasedProgress(adjustedProgress);
    const progress = scrollDirection === "down" ? easedProgress : 1 - easedProgress;


    element.style.willChange = 'auto';
    element.style.transformStyle = '';
    element.style.imageRendering = '';
    element.style.outline = "none";
    element.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0)";





    element.style.transform = `
translate(${this.getTransformValue("x", progress)}px, ${this.getTransformValue("y", progress)}px)
rotate(${this.getTransformValue("r", progress)}deg)
scale(${this.getTransformValue("s", progress)})
skew(${this.getTransformValue("k", progress)}deg)
` + 'translateZ(0)';

    element.style.opacity = this.getTransformValue("o", progress);
    element.style.filter = `blur(${this.getTransformValue("b", progress)}px)`;
    if (this.applyBorderRadius) {
      this.applyBorderRadiusEffect(element, progress);
    }

    if (this.config.arcBorderRadiusEffect) {
      this.applyArcBorderRadius(element, progress);
    }

    element.style.transitionDuration = `${this.config.duration || 2}s`;
  }

  removeAnimation(element) {
    element.style.transform = "translateZ(0)";
    element.style.opacity = "";
    element.style.transitionDuration = "";
    element.style.outline = "";
    element.style.boxShadow = "";


  }


  initGravity() {
    if (!this.config.gravity) return;

    const checkCollision = (element1, element2) => {
      const rect1 = element1.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();

      const isCircle1 = element1.classList.contains('circle');
      const isCircle2 = element2.classList.contains('circle');

      if (isCircle1 && isCircle2) {
        const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2);
        const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (rect1.width / 2) + (rect2.width / 2);

        return distance < minDistance;
      } else {
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
      }
    };



    const { selector, containerSelector, speed, duration } = this.config.gravity;
    const elements = document.querySelectorAll(selector);
    const container = document.querySelector(containerSelector);

    const isOverlapping = (rect1, rect2) => {
      return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    };


    const isNearGround = (element, rect) => {
      return Math.abs(element._physics.positionY + rect.height / 2 - window.innerHeight) < 5;
    };


    const handleCollision = (element1, element2) => {
      const rect1 = element1.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();

      const isCircle1 = element1.classList.contains('circle');
      const isCircle2 = element2.classList.contains('circle');

      const isRectangle1 = element1.classList.contains('rectangle');
      const isRectangle2 = element2.classList.contains('rectangle');

      const velocityThreshold = 0.5;


      if (isCircle1 && isCircle2) {
        const dx = (rect2.left + rect2.width / 2) - (rect1.left + rect1.width / 2);
        const dy = (rect2.top + rect2.height / 2) - (rect1.top + rect1.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (rect1.width / 2) + (rect2.width / 2);

        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const velocity1 = {
          x: element1._physics.velocityX * cos + element1._physics.velocityY * sin,
          y: element1._physics.velocityY * cos - element1._physics.velocityX * sin
        };

        const velocity2 = {
          x: element2._physics.velocityX * cos + element2._physics.velocityY * sin,
          y: element2._physics.velocityY * cos - element2._physics.velocityX * sin
        };

        const distanceThreshold = 0.5 * (1 - (distance / minDistance));
        const velocityThreshold = 0.5;
        const totalVelocity = Math.abs(velocity1.x) + Math.abs(velocity1.y) + Math.abs(velocity2.x) + Math.abs(velocity2.y);

        if (distance < minDistance) {
          if (totalVelocity > distanceThreshold && (Math.abs(velocity1.x) > velocityThreshold || Math.abs(velocity1.y) > velocityThreshold || Math.abs(velocity2.x) > velocityThreshold || Math.abs(velocity2.y) > velocityThreshold)) {

            const tempVelocityX1 = velocity1.x;
            const tempVelocityX2 = velocity2.x;

            velocity1.x = ((element1.clientWidth - element2.clientWidth) * tempVelocityX1 + 2 * element2.clientWidth * tempVelocityX2) / (element1.clientWidth + element2.clientWidth);
            velocity2.x = ((element2.clientWidth - element1.clientWidth) * tempVelocityX2 + 2 * element1.clientWidth * tempVelocityX1) / (element1.clientWidth + element2.clientWidth);

            element1._physics.velocityX = velocity1.x * cos - velocity1.y * sin;
            element1._physics.velocityY = velocity1.y * cos + velocity1.x * sin;
            element2._physics.velocityX = velocity2.x * cos - velocity2.y * sin;
            element2._physics.velocityY = velocity2.y * cos + velocity2.x * sin;

            const overlap = (minDistance - distance) * 1.1;
            const overlapX = overlap * dx / distance;
            const overlapY = overlap * dy / distance;

            element1._physics.positionY -= overlapY / 2 + 1;
            element2._physics.positionY += overlapY / 2 + 1;
            element1._physics.positionX -= overlapX / 2 + 1;
            element2._physics.positionX += overlapX / 2 + 1;
          } else {

            const overlap = (minDistance - distance) * 1.01;
            const overlapX = overlap * dx / distance;
            const overlapY = overlap * dy / distance;

            element1._physics.positionY -= overlapY / 2;
            element2._physics.positionY += overlapY / 2;
            element1._physics.positionX -= overlapX / 2;
            element2._physics.positionX += overlapX / 2;

            if (Math.abs(velocity1.x) < velocityThreshold && Math.abs(velocity1.y) < velocityThreshold) {
              element1._physics.velocityX = 0;
              element1._physics.velocityY = 0;
            }

            if (Math.abs(velocity2.x) < velocityThreshold && Math.abs(velocity2.y) < velocityThreshold) {
              element2._physics.velocityX = 0;
              element2._physics.velocityY = 0;
            }
          }
        }
      }











      let simulationStarted = false;

      if (isRectangle1 && isRectangle2) {
        if (!simulationStarted) {
          simulationStarted = true;
        }

        const deltaY = rect1.top - rect2.top;
        const deltaX = rect1.left - rect2.left;
        const overlapY = rect1.height / 2 + rect2.height / 2 - Math.abs(deltaY);
        const overlapX = rect1.width / 2 + rect2.width / 2 - Math.abs(deltaX);

        const isVerticalBounce = overlapY < overlapX;

        if (isVerticalBounce) {
          if (deltaY > 0) {
            element1._physics.positionY += overlapY;
            element2._physics.positionY -= overlapY;
          } else {
            element1._physics.positionY -= overlapY;
            element2._physics.positionY += overlapY;
          }
        } else {
          if (deltaX > 0) {
            element1._physics.positionX += overlapX;
            element2._physics.positionX -= overlapX;
          } else {
            element1._physics.positionX -= overlapX;
            element2._physics.positionX += overlapX;
          }
        }

        element1.style.transform = `translate(${element1._physics.positionX}px, ${element1._physics.positionY}px)`;
        element2.style.transform = `translate(${element2._physics.positionX}px, ${element2._physics.positionY}px)`;

        const mass1 = element1.offsetWidth * element1.offsetHeight;
        const mass2 = element2.offsetWidth * element2.offsetHeight;
        const totalMass = mass1 + mass2;

        const oldVelocityX1 = element1._physics.velocityX;
        const oldVelocityY1 = element1._physics.velocityY;
        const oldVelocityX2 = element2._physics.velocityX;
        const oldVelocityY2 = element2._physics.velocityY;

        if (isVerticalBounce) {
          const newVelocityY1 = ((mass1 - mass2) * oldVelocityY1 + 2 * mass2 * oldVelocityY2) / totalMass;
          const newVelocityY2 = ((mass2 - mass1) * oldVelocityY2 + 2 * mass1 * oldVelocityY1) / totalMass;

          element1._physics.velocityY = newVelocityY1;
          element2._physics.velocityY = newVelocityY2;
        } else {
          const newVelocityX1 = ((mass1 - mass2) * oldVelocityX1 + 2 * mass2 * oldVelocityX2) / totalMass;
          const newVelocityX2 = ((mass2 - mass1) * oldVelocityX2 + 2 * mass1 * oldVelocityX1) / totalMass;

          element1._physics.velocityX = newVelocityX1;
          element2._physics.velocityX = newVelocityX2;
        }
      }


    };

    elements.forEach((element) => {
      element.ondragstart = function () {
        return false;
      };
    });



    elements.forEach((element) => {
      element._physics = {
        velocityY: 0,
        velocityX: 0,
        positionY: 0,
        positionX: 0,
        bounceCounter: 0,
        isDragging: false,
        gravityActivated: false,
        initialX: element.getBoundingClientRect().left,
        initialY: element.getBoundingClientRect().top,
        topElements: [],
      };



      let velocityY = 0;
      let velocityX = 0;
      let positionY = 0;
      let positionX = 0;
      let bounceCounter = 0;
      const maxBounces = 15;
      let isDragging = false;
      let lastMouseX, lastMouseY;

      const isElementInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      };


      const animate = () => {
        if (!element._physics.isDragging) {

          if (isElementInViewport(element)) {
            element._physics.gravityActivated = true;
          }

          if (element._physics.gravityActivated) {
            element._physics.velocityY += speed;

            element._physics.positionY += element._physics.velocityY;
            element._physics.positionX += element._physics.velocityX;
            element.style.transform = `translate(${element._physics.positionX}px, ${element._physics.positionY}px)`;

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (containerRect.bottom - elementRect.bottom < 0) {
              element._physics.positionY -= elementRect.bottom - containerRect.bottom;
              element._physics.velocityY *= -duration;

              const dampingFactor = (element._physics.bounceCounter === maxBounces - 1) ? 0.99 : 0.6;

              element._physics.velocityY *= dampingFactor;
              element._physics.bounceCounter++;

              if (Math.abs(element._physics.velocityY) < 0.1 || element._physics.bounceCounter >= maxBounces) {
                element._physics.velocityY = 0;
              }
            }

            if (containerRect.left - elementRect.left > 0) {
              element._physics.positionX += containerRect.left - elementRect.left;
              element._physics.velocityX *= -duration;
              if (Math.abs(element._physics.velocityX) < 0.1) {
                element._physics.velocityX = 0;
              }
            }

            if (containerRect.right - elementRect.right < 0) {
              element._physics.positionX -= elementRect.right - containerRect.right;
              element._physics.velocityX *= -duration;
              if (Math.abs(element._physics.velocityX) < 0.1) {
                element._physics.velocityX = 0;
              }
            }

            element._physics.velocityX *= 0.995;

            elements.forEach((otherElement) => {
              if (element !== otherElement && checkCollision(element, otherElement)) {
                handleCollision(element, otherElement);
              }
            });

          }
        }

        requestAnimationFrame(animate);
      };



      const moveElementAndTopElements = (element, deltaX, deltaY, movedElements = new Set()) => {
        if (movedElements.has(element)) {
          return;
        }

        movedElements.add(element);

        element._physics.positionX += deltaX;
        element._physics.positionY += deltaY;
        element.style.transform = `translate(${element._physics.positionX}px, ${element._physics.positionY}px)`;




        element._physics.topElements.forEach(topElement => {
          moveElementAndTopElements(topElement, deltaX, deltaY, movedElements);
        });
      };



      const moveElement = (element, deltaX, deltaY) => {
        element._physics.positionX += deltaX;
        element._physics.positionY += deltaY;
        element.style.transform = `translate(${element._physics.positionX}px, ${element._physics.positionY}px)`;
      };

      const onMouseMove = (event) => {
        if (element._physics.isDragging) {
          const deltaX = event.clientX - element._physics.lastMouseX;
          const deltaY = event.clientY - element._physics.lastMouseY;
          moveElement(element, deltaX, deltaY);
          element._physics.lastMouseX = event.clientX;
          element._physics.lastMouseY = event.clientY;

          element._physics.velocityY = deltaY * 1.0;
          element._physics.velocityX = deltaX * 1.0;
        }
      };



      const onMouseDown = (event) => {
        element._physics.isDragging = true;
        element._physics.lastMouseX = event.clientX;
        element._physics.lastMouseY = event.clientY;
        element._physics.initialX = element.getBoundingClientRect().left;
        element._physics.initialY = element.getBoundingClientRect().top;
      };

      const onMouseUp = () => {
        if (Math.abs(element._physics.velocityX) > 2 || Math.abs(element._physics.velocityY) > 2) {
          element._physics.isDragging = false;
          element._physics.bounceCounter = 0;
        } else {
          element._physics.velocityX = 0;
          element._physics.velocityY = 0;
          element._physics.isDragging = false;
        }

        elements.forEach((otherElement) => {
          if (element !== otherElement && checkCollision(element, otherElement)) {
            handleCollision(element, otherElement);
          }
        });
      };

      element.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      element.addEventListener('touchstart', (event) => {
        event.preventDefault();
        onMouseDown(event.touches[0]);
      });

      element.addEventListener('touchmove', (event) => {
        event.preventDefault();
        onMouseMove(event.touches[0]);
      });

      element.addEventListener('touchend', (event) => {
        event.preventDefault();
        onMouseUp();
      });

      requestAnimationFrame(animate);
    });
  }







  initDraggable() {
    this.elements.forEach((element) => {
        let dragStartX, dragStartY, elemStartX, elemStartY;

        const onPointerDown = (e) => {
            if (e.target.tagName.toLowerCase() === "input") {
                return;
            }

            e.preventDefault();
            dragStartX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
            dragStartY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
            elemStartX = parseInt(element.style.left, 10) || 0;
            elemStartY = parseInt(element.style.top, 10) || 0;

            if(e instanceof PointerEvent){
                element.setPointerCapture(e.pointerId);
            }
            element.dataset.dragging = "true";

            this.isMagneticDisabled = true;

            element.addEventListener('pointermove', onPointerMove);
            element.addEventListener('touchmove', onPointerMove);
            element.addEventListener('pointerup', onPointerUp);
            element.addEventListener('touchend', onPointerUp);
        };

        const onPointerMove = (e) => {
            e.preventDefault();
            if(e instanceof PointerEvent && !element.hasPointerCapture(e.pointerId)) return;

            const x = elemStartX + (e instanceof TouchEvent ? e.touches[0].clientX : e.clientX) - dragStartX;
            const y = elemStartY + (e instanceof TouchEvent ? e.touches[0].clientY : e.clientY) - dragStartY;

            const updatePosition = () => {
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            };

            requestAnimationFrame(updatePosition);
        };

        function onPointerUp(event) {
            const element = event.target;
            element._physics.pointerDown = false;

            const throwStrength = 25;
            const maxVelocity = 50;
            const velocityX = Math.min(Math.max(element._physics.pointerDeltaX * throwStrength, -maxVelocity), maxVelocity);
            const velocityY = Math.min(Math.max(element._physics.pointerDeltaY * throwStrength, -maxVelocity), maxVelocity);

            const impulseFactor = 15;

            if (element._physics.colliding) {
                element._physics.velocityX += element._physics.pointerDeltaX * throwStrength * impulseFactor;
                element._physics.velocityY += element._physics.pointerDeltaY * throwStrength * impulseFactor;
            } else {
                element._physics.velocityX = velocityX;
                element._physics.velocityY = velocityY;
            }

            element._physics.pointerDeltaX = 0;
            element._physics.pointerDeltaY = 0;

            const zIndex = parseInt(element.style.zIndex, 10);
            elements.forEach((el) => {
                if (parseInt(el.style.zIndex, 10) > zIndex) {
                    el.style.zIndex = (parseInt(el.style.zIndex, 10) - 1).toString();
                }
            });
            element.style.zIndex = elements.length.toString();

            element.removeEventListener('pointermove', onPointerMove);
            element.removeEventListener('touchmove', onPointerMove);
            element.removeEventListener('pointerup', onPointerUp);
            element.removeEventListener('touchend', onPointerUp);
        }

        element.style.position = 'relative';
        element.style.cursor = 'move';

        const computedStyle = window.getComputedStyle(element);
        const left = computedStyle.getPropertyValue('left');
        const top = computedStyle.getPropertyValue('top');

        if (left !== 'auto') {
            element.style.left = left;
        }

        if (top !== 'auto') {
            element.style.top = top;
        }

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('touchstart', onPointerDown);

        element.dataset.dragging = false;
    });
}

  animateElement(element, progress, scrollDirection) {
    this.applyAnimation(element, progress, scrollDirection);

    if (!element.classList.contains("animated")) {
      element.classList.add("animated");
      window.requestAnimationFrame(() => {
        this.animateElement(element, 1, scrollDirection);
      });
    }
  }



  updateAnimations() {
    const scrollDirection = window.scrollY > this.lastScrollPosition ? "down" : "up";
    this.lastScrollPosition = window.scrollY;

    this.elements.forEach((element, index) => {
      if (element.dataset.dragging === "true") return;


      const positionElement = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const triggerPosition = windowHeight * (1 - this.config.trigger);

      if (positionElement < triggerPosition) {
        const scrollProgress = Math.min(1, 1 - (positionElement / triggerPosition));
        const delay = (this.config.delay || 0) * index;

        setTimeout(() => {
          this.applyAnimation(element, scrollProgress, scrollDirection);
        }, delay * 1000);
      } else {
        if (!this.config.pauseOnScroll) {
          element.classList.remove("animated");
          this.applyReverseAnimation(element, scrollDirection === "down" ? 0 : 1, scrollDirection);
        } else {
          this.removeAnimation(element);
        }
      }
    });
  }


  parseTransform(transform, type) {
    if (!transform) {
      return [];
    }

    const regex = new RegExp(`(-?\\d+(?:\\.\\d+)?${type}(?:px|vw|vh|%)?)`, "g");
    const matches = transform.match(regex);
    if (matches) {
      return matches.map((match) => {
        const value = parseFloat(match);
        const unit = match.replace(value.toString(), "").replace(type, "");
        return { value, unit };
      });
    } else {
      return [];
    }
  }



  convertRelativeToPixel(value, type) {
    const numValue = parseFloat(value);
    switch (type) {
      case "vw":
        return (numValue / 100) * window.innerWidth;
      case "vh":
        return (numValue / 100) * window.innerHeight;
      default:
        return numValue;
    }
  }


  getTransformValue(type, progress) {
    const transformDataList = this.parseTransform(this.config.transform, type);
    if (transformDataList.length === 0) return type === "s" ? "1" : type === "o" ? "1" : "0";

    let result = 0;
    transformDataList.forEach(({ value, unit }) => {
      let startValue = 0;
      let endValue = value;

      switch (type) {
        case "x":
        case "y":
          let multiplier;
          if (unit === "vw") {
            multiplier = window.innerWidth * 0.01;
          } else if (unit === "vh") {
            multiplier = window.innerHeight * 0.01;
          } else if (unit === "%") {
            const windowHeight = window.innerHeight;
            const triggerPosition = windowHeight * (1 - this.config.trigger);
            multiplier = triggerPosition * 0.01;
          } else {
            multiplier = 1;
          }
          result += startValue + progress * (endValue - startValue) * multiplier;
          break;
        case "r":
        case "b":
        case "k":
          result += startValue + progress * (endValue - startValue);
          break;
        case "s":
        case "o":
          startValue = 1;
          endValue = value - 1;
          result += startValue + progress * endValue;
          break;
        default:
          break;
      }
    });

    return result;
  }



  getEasedProgress(scrollProgress) {
    const easing = this.config.easing || "linear";
    let easedProgress;

    switch (easing) {
      case "linear":
        easedProgress = scrollProgress;
        break;
      case "ease-in":
        easedProgress = Math.pow(scrollProgress, 2);
        break;
      case "ease-out":
        easedProgress = 1 - Math.pow(1 - scrollProgress, 2);
        break;
      case "ease-in-out":
        easedProgress = scrollProgress < 0.5 ? 2 * Math.pow(scrollProgress, 2) : 1 - Math.pow(-2 * scrollProgress + 2, 2) / 2;
        break;
      default:
        easedProgress = scrollProgress;
    }
    return easedProgress;
  }
} 
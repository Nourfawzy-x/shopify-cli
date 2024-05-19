const l = [
    'ken-burns-bottom-right',
    'ken-burns-top-left',
    'ken-burns-bottom-left',
    'ken-burns-top-right',
    'ken-burns-middle-left',
    'ken-burns-middle-right',
    'ken-burns-top-middle',
    'ken-burns-bottom-middle',
    'ken-burns-center',
  ],
  o = document.createElement('template');
o.innerHTML = `
<style>
    :host {
        overflow: hidden;
        position: relative;
    }

    div, img {
        height: 100%;
        width: 100%;
    }

    div {
        position: absolute;
        will-change: transform;
    }

    img {
        filter: var(--img-filter);
        object-fit: cover;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes ken-burns-bottom-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, -7%, 0);
        }
    }
    @keyframes ken-burns-top-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, 7%, 0);
        }
    }
    @keyframes ken-burns-top-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, 7%, 0);
        }
    }
    @keyframes ken-burns-bottom-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, -7%, 0);
        }
    }
    @keyframes ken-burns-middle-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, 0, 0);
        }
    }
    @keyframes ken-burns-middle-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, 0, 0);
        }
    }
    @keyframes ken-burns-top-middle {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(0, 10%, 0);
        }
    }
    @keyframes ken-burns-bottom-middle {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(0, -10%, 0);
        }
    }
    @keyframes ken-burns-center {
        to {
            transform: scale3d(1.5, 1.5, 1.5);
        }
    }
</style>
`;
typeof window.ShadyCSS == 'object' &&
  window.ShadyCSS.prepareTemplate(o, 'ken-burns-carousel');
class b extends HTMLElement {
  constructor() {
    super(),
      (this.animationNames = l),
      (this.animationDirection = 'random'),
      (this._fadeDuration = 2500),
      (this._imgList = []),
      (this._slideDuration = 2e4),
      (this._timeout = 0),
      (this._zCounter = 0),
      this.attachShadow({ mode: 'open' }),
      this.shadowRoot.appendChild(o.content.cloneNode(!0));
  }
  static get observedAttributes() {
    return [
      'animation-direction',
      'animation-names',
      'fade-duration',
      'images',
      'slide-duration',
    ];
  }
  get fadeDuration() {
    return this._fadeDuration;
  }
  set fadeDuration(t) {
    if (t > this.slideDuration)
      throw new RangeError('Fade duration must be smaller than slide duration');
    this._fadeDuration = t;
  }
  get images() {
    return this._imgList;
  }
  set images(t) {
    u(this._imgList, t) ||
      ((this._imgList = t), t.length > 0 ? this.animateImages(t) : this.stop());
  }
  get slideDuration() {
    return this._slideDuration;
  }
  set slideDuration(t) {
    if (t < this.fadeDuration)
      throw new RangeError('Slide duration must be greater than fade duration');
    this._slideDuration = t;
  }
  attributeChangedCallback(t, i, e) {
    switch (t) {
      case 'animation-direction':
        this.animationDirection = e;
        break;
      case 'animation-names':
        this.animationNames = e ? e.split(' ').filter((a) => a) : l;
        break;
      case 'fade-duration':
        this.fadeDuration = Number(e);
        break;
      case 'images':
        this.images = e ? e.split(' ').filter((a) => a) : [];
        break;
      case 'slide-duration':
        this.slideDuration = Number(e);
        break;
    }
  }
  connectedCallback() {
    typeof window.ShadyCSS == 'object' && window.ShadyCSS.styleElement(this);
  }
  animateImages(t) {
    const i = (a, h) => {
        const r = Math.random(),
          c = Math.floor(r * this.animationNames.length),
          f =
            this.animationDirection === 'random'
              ? r > 0.5
                ? 'normal'
                : 'reverse'
              : this.animationDirection,
          n = document.createElement('div');
        n.appendChild(h),
          (n.style.animationName = `${this.animationNames[c]}, fade-in`),
          (n.style.animationDuration = `${this.slideDuration}ms, ${this.fadeDuration}ms`),
          (n.style.animationDirection = `${f}, normal`),
          (n.style.animationTimingFunction = 'linear, ease'),
          (n.style.zIndex = String(this._zCounter++)),
          this.shadowRoot.appendChild(n),
          setTimeout(() => n.remove(), this.slideDuration);
        const d = (a + 1) % t.length,
          m = document.createElement('img');
        (m.src = t[d]),
          (this._timeout = setTimeout(
            () => i(d, m),
            this.slideDuration - this.fadeDuration,
          ));
      },
      e = document.createElement('img');
    (e.src = t[0]),
      (e.onload = () => {
        u(this._imgList, t) && (this.stop(), i(0, e));
      });
  }
  stop() {
    clearTimeout(this._timeout), (this._timeout = 0);
  }
}
function u(s, t) {
  if (s === t || (!s && !t)) return !0;
  if (!s || !t || s.length !== t.length) return !1;
  for (let i = 0; i < s.length; i++) if (s[i] !== t[i]) return !1;
  return !0;
}
customElements.define('ken-burns-carousel', b);

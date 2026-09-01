class GlassSurface {
  constructor(element, options = {}) {
    this.element = element;
    const computedStyle = window.getComputedStyle(element);
    const computedRadius = parseInt(computedStyle.borderRadius) || 20;

    this.options = {
      borderRadius: options.borderRadius || computedRadius,
      borderWidth: options.borderWidth || 0.07,
      brightness: options.brightness || 50,
      opacity: options.opacity || 0.93,
      blur: options.blur || 11,
      displace: options.displace || 0,
      backgroundOpacity: options.backgroundOpacity || 0,
      saturation: options.saturation || 1,
      distortionScale: options.distortionScale || -180,
      redOffset: options.redOffset || 0,
      greenOffset: options.greenOffset || 10,
      blueOffset: options.blueOffset || 20,
      xChannel: options.xChannel || 'R',
      yChannel: options.yChannel || 'G',
      mixBlendMode: options.mixBlendMode || 'difference',
    };

    // Make unique IDs for the SVG definitions
    this.uniqueId = 'glass-' + Math.random().toString(36).substr(2, 9);
    this.filterId = `glass-filter-${this.uniqueId}`;
    this.redGradId = `red-grad-${this.uniqueId}`;
    this.blueGradId = `blue-grad-${this.uniqueId}`;

    this.svgSupported = this.supportsSVGFilters();
    this.init();
  }

  supportsSVGFilters() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) return false;
    
    const div = document.createElement('div');
    div.style.backdropFilter = `url(#test)`;
    return div.style.backdropFilter !== '';
  }

  generateDisplacementMap() {
    const rect = this.element.getBoundingClientRect();
    const actualWidth = rect.width || 400;
    const actualHeight = rect.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (this.options.borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${this.redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${this.blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.options.borderRadius}" fill="url(#${this.redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.options.borderRadius}" fill="url(#${this.blueGradId})" style="mix-blend-mode: ${this.options.mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${this.options.borderRadius}" fill="hsl(0 0% ${this.options.brightness}% / ${this.options.opacity})" style="filter:blur(${this.options.blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }

  updateDisplacementMap() {
    if (this.feImage) {
      this.feImage.setAttribute('href', this.generateDisplacementMap());
    }
  }

  init() {
    this.element.classList.add('glass-surface');
    this.element.classList.add(this.svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback');
    
    // Set CSS variables for the element
    this.element.style.setProperty('--glass-frost', this.options.backgroundOpacity);
    this.element.style.setProperty('--glass-saturation', this.options.saturation);
    this.element.style.setProperty('--filter-id', `url(#${this.filterId})`);

    // Create SVG holding the filter definitions
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('glass-surface__filter');
    svg.setAttribute('xmlns', svgNS);
    
    svg.innerHTML = `
        <defs>
          <filter id="${this.filterId}" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage class="gs-fe-image" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            
            <feDisplacementMap class="gs-red-channel" in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            
            <feDisplacementMap class="gs-green-channel" in="SourceGraphic" in2="map" id="greenchannel" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            
            <feDisplacementMap class="gs-blue-channel" in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur class="gs-gaussian-blur" in="output" stdDeviation="0.7" />
          </filter>
        </defs>
    `;
    
    this.element.appendChild(svg);
    
    this.feImage = svg.querySelector('.gs-fe-image');
    this.redChannel = svg.querySelector('.gs-red-channel');
    this.greenChannel = svg.querySelector('.gs-green-channel');
    this.blueChannel = svg.querySelector('.gs-blue-channel');
    this.gaussianBlur = svg.querySelector('.gs-gaussian-blur');
    
    [
      { el: this.redChannel, offset: this.options.redOffset },
      { el: this.greenChannel, offset: this.options.greenOffset },
      { el: this.blueChannel, offset: this.options.blueOffset }
    ].forEach(({ el, offset }) => {
      el.setAttribute('scale', (this.options.distortionScale + offset).toString());
      el.setAttribute('xChannelSelector', this.options.xChannel);
      el.setAttribute('yChannelSelector', this.options.yChannel);
    });
    
    this.gaussianBlur.setAttribute('stdDeviation', this.options.displace.toString());
    
    this.resizeObserver = new ResizeObserver(() => {
      setTimeout(() => this.updateDisplacementMap(), 0);
    });
    this.resizeObserver.observe(this.element);
    
    setTimeout(() => this.updateDisplacementMap(), 0);
  }
}

// Auto-initialize elements with class 'glass-surface-auto' if you prefer
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.glass-surface-auto');
  elements.forEach(el => new GlassSurface(el, {
    // You can pull options from data-attributes here if needed
  }));
});

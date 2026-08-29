/* =========================================================================
   CHARME COLOR — "Weave": eine lebende Fläche hinter dem Hero
   -------------------------------------------------------------------------
   Ein einziger Fragment-Shader auf einem bildschirmfüllenden Viereck.
   Bewusst ohne Three.js: für eine Fläche braucht es keine 150-KB-Bibliothek,
   der rohe WebGL-Aufruf kostet ein paar Zeilen und lädt in Millisekunden.

   Was es zeigt: langsam strömende Bahnen in Papierton, mit einem Hauch
   Karmin — wie Haarsträhnen, die im Licht liegen. Es ist Hintergrund und
   soll auch einer bleiben: die Deckkraft ist so gewählt, dass Text darauf
   ohne Mühe lesbar bleibt.

   Es schaltet sich selbst ab, wenn es nicht willkommen ist:
   - bei prefers-reduced-motion
   - im Sparmodus (html.lite) und bei aktiviertem Datensparmodus
   - auf Geräten mit wenig Kernen oder Speicher
   - wenn der Hero aus dem Bild ist oder der Tab im Hintergrund läuft
   - wenn WebGL fehlt (dann bleibt der CSS-Verlauf stehen)
   ========================================================================= */
(function () {
  'use strict';

  var flaeche = document.querySelector('.hero__weave');
  if (!flaeche) return;

  var reduziert = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sparsam = navigator.connection && navigator.connection.saveData;
  // Schwelle bewusst niedrig: Chrome meldet auch bei ordentlichen Handys
  // oft nur 4 GB, ein Ausschluss dort träfe die halbe Zielgruppe grundlos.
  // Den Rest erledigt die Bildraten-Überwachung weiter unten.
  var schwach = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
                (navigator.deviceMemory && navigator.deviceMemory < 4);
  if (reduziert || sparsam || schwach || document.documentElement.classList.contains('lite')) return;

  var gl = flaeche.getContext('webgl', { alpha: true, antialias: false, depth: false,
                                         powerPreference: 'low-power' });
  if (!gl) return;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  var FRAG = [
    'precision mediump float;',
    'uniform vec2 res;',
    'uniform float zeit;',
    'uniform vec2 maus;',
    'uniform float staerke;',

    // Wertrauschen — billiger als Simplex und für weiche Bahnen genug
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float noise(vec2 p){',
    '  vec2 i=floor(p),f=fract(p);',
    '  vec2 u=f*f*(3.-2.*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),',
    '             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float s=0.,a=.5;',
    '  for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.03; a*=.5; }',
    '  return s;',
    '}',

    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/res.xy;',
    '  vec2 p=uv*vec2(res.x/res.y,1.);',
    '  float t=zeit*.075;',                      // sehr langsam: es ist Papier, kein Bildschirmschoner
    // Domain Warping: das Rauschen verzerrt sich selbst — daraus entstehen
    // die langen, gebogenen Bahnen statt gleichförmiger Wolken.
    '  vec2 q=vec2(fbm(p*1.6+vec2(t,0.)), fbm(p*1.6+vec2(5.2,1.3)-t*.6));',
    '  vec2 zug=(maus-uv)*.18;',
    '  vec2 r=vec2(fbm(p*1.9+4.*q+vec2(1.7,9.2)+zug+t*.4),',
    '              fbm(p*1.9+4.*q+vec2(8.3,2.8)-zug-t*.3));',
    '  float f=fbm(p*2.2+4.*r);',

    // Feine Strähnen: der Sinus über dem verzerrten Feld zeichnet Linien
    '  float straehnen=sin((p.y*7.5+f*5.5+t*1.6)*3.14159);',
    '  straehnen=smoothstep(.38,1.,abs(straehnen));',

    // Werte offline nachgerechnet: Helligkeitsspanne 71 von 255 — sichtbar
    // als Marmorierung, und der Text steht darauf noch mit Kontrast 6,7.
    '  vec3 papier=vec3(.985,.980,.974);',
    '  vec3 sand  =vec3(.795,.742,.700);',
    '  vec3 karmin=vec3(.720,.130,.290);',
    '  vec3 c=mix(papier,sand,clamp(f*1.45,0.,1.));',
    '  c=mix(c,karmin,clamp((f-.44)*.85,0.,1.)*.75);',
    '  c=mix(c,papier,straehnen*.34);',
    // Zum Rand hin auslaufen, damit die Fläche keine Kante bekommt
    '  float rand=smoothstep(1.05,.2,length((uv-vec2(.5))*vec2(1.05,1.2))*1.25);',
    '  gl_FragColor=vec4(c,rand*staerke);',
    '}'
  ].join('\n');

  function shader(typ, quelle) {
    var s = gl.createShader(typ);
    gl.shaderSource(s, quelle); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }
  var vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var puffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var uRes = gl.getUniformLocation(prog, 'res');
  var uZeit = gl.getUniformLocation(prog, 'zeit');
  var uMaus = gl.getUniformLocation(prog, 'maus');
  var uStaerke = gl.getUniformLocation(prog, 'staerke');

  var mx = .5, my = .5, zx = .5, zy = .5, staerke = 0, laeuft = false, start = 0, raf = null;

  function messen() {
    // Auflösung gedeckelt: mehr als 1,5-fach bringt bei einer weichen
    // Fläche nichts Sichtbares, kostet aber quadratisch Rechenzeit.
    var dpr = Math.min(devicePixelRatio || 1, 1.5);
    var b = flaeche.getBoundingClientRect();
    var w = Math.max(1, Math.round(b.width * dpr));
    var h = Math.max(1, Math.round(b.height * dpr));
    if (flaeche.width !== w || flaeche.height !== h) {
      flaeche.width = w; flaeche.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  var langsam = 0, vorher = 0;

  function bild(t) {
    if (!laeuft) return;
    // Wenn die Seite in den Sparmodus schaltet oder die Bildrate über
    // längere Zeit einbricht, verschwindet die Fläche von selbst.
    if (document.documentElement.classList.contains('lite')) { abschalten(); return; }
    if (vorher && t - vorher > 34) langsam++; else if (langsam) langsam--;
    vorher = t;
    if (langsam > 90) { abschalten(); return; }
    if (!start) start = t;
    messen();
    zx += (mx - zx) * .045;                    // der Fläche folgt träge
    zy += (my - zy) * .045;
    staerke += (.95 - staerke) * .02;          // beim Start sanft aufblenden
    gl.uniform1f(uZeit, (t - start) / 1000);
    gl.uniform2f(uMaus, zx, zy);
    gl.uniform1f(uStaerke, staerke);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(bild);
  }

  function abschalten() {
    aus();
    flaeche.classList.remove('is-live');
    setTimeout(function () { if (flaeche.parentNode) flaeche.remove(); }, 1500);
  }

  function an() { if (!laeuft) { laeuft = true; raf = requestAnimationFrame(bild); } }
  function aus() { laeuft = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  // Nur rechnen, wenn der Hero im Bild ist
  var hero = document.querySelector('.hero');
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? an() : aus(); },
      { rootMargin: '120px' }).observe(hero);
  } else { an(); }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? aus() : an();
  });

  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX / innerWidth;
      my = 1 - e.clientY / innerHeight;
    }, { passive: true });
  }

  window.addEventListener('resize', messen);
  flaeche.classList.add('is-live');
})();

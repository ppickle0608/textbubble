let gap = 10;
let bitSize = 5;
let minSize = 0;
let wid = 1000;
let hei = 400;

let bits = [];
let img;
let imagelayer;
let imgLoaded = false;
let canvas;

function setup() {
  canvas = createCanvas(1, 1); // draw 루프 보장용 더미
  noLoop();

  document.getElementById('imgUploader').addEventListener('change', handleFileUpload);

  setupSlider('gapInput', 'gapVal', (val) => {
    gap = val / 2;
    document.getElementById('gapVal').textContent = gap.toFixed(1); // 소수점 표시
    makeBitGrid();
    if (imgLoaded) loop();
  });

  setupSlider('bitSizeInput', 'bitSizeVal', (val) => {
    bitSize = val;
    if (imgLoaded) loop();
  });

  setupSlider('minSizeInput', 'minSizeVal', (val) => {
    minSize = val;
    if (imgLoaded) loop();
  });
}

function setupSlider(inputId, labelId, onChange) {
  const slider = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    label.textContent = val;
    onChange(val);
  });
}

function makeBitGrid() {
  bits = [];
  let w = wid / gap;
  let h = hei / gap;
  for (let i = 0; i < w; i++) {
    for (let k = 0; k < h; k++) {
      let x = i * gap + gap / 2;
      let y = k * gap + gap / 2;
      bits.push(createVector(x, y));
    }
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      loadImage(e.target.result, (loadedImg) => {
        img = loadedImg;

        wid = 1000;
        let ratio = img.height / img.width;
        hei = int(wid * ratio);

        resizeCanvas(wid, hei);

        img.resize(wid, hei);
        imagelayer = createGraphics(wid, hei);
        imagelayer.image(img, 0, 0);

        makeBitGrid();
        imgLoaded = true;
        loop();
      });
    };
    reader.readAsDataURL(file);
  }
}

function draw() {
  if (!imgLoaded) return;

  background(255);
  imagelayer.loadPixels();
  noStroke();
  fill(0);

  for (let p of bits) {
    let ix = int(p.x);
    let iy = int(p.y);
    if (ix >= 0 && ix < wid && iy >= 0 && iy < hei) {
      let c = imagelayer.get(ix, iy);
      let b = brightness(c);

      let size;
      if (b <= 50) {
        size = bitSize;
      } else if (b >= 200) {
        size = minSize;
      } else {
        size = map(b, 200, 50, minSize, bitSize);
      }

      // ✅ 최소 사이즈가 0일 경우, 실질적으로 완전히 안 보이게
      if (size < 0.5) continue;

      ellipse(p.x, p.y, size, size);
    }
  }

  noLoop();
}

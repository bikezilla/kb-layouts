const { ipcRenderer } = require('electron');

let layouts = {};
let currentKeyboard = 'elora';
let currentLayer = 0;

const KEY_SIZE = 50;
const KEY_GAP = 4;

async function init() {
  try {
    layouts = await ipcRenderer.invoke('load-layouts');
    console.log('Layouts loaded:', Object.keys(layouts));
  } catch (e) {
    console.error('Failed to load layouts:', e);
    document.getElementById('keyboard').innerHTML = '<div class="error">Failed to load layouts: ' + e.message + '</div>';
    return;
  }

  if (!layouts.elora && !layouts.corne) {
    document.getElementById('keyboard').innerHTML = '<div class="error">No layouts found</div>';
    return;
  }

  document.getElementById('btn-elora').onclick = () => {
    currentKeyboard = 'elora';
    currentLayer = 0;
    document.getElementById('btn-elora').classList.add('active');
    document.getElementById('btn-corne').classList.remove('active');
    updateLayerSelect();
    render();
  };

  document.getElementById('btn-corne').onclick = () => {
    currentKeyboard = 'corne';
    currentLayer = 0;
    document.getElementById('btn-corne').classList.add('active');
    document.getElementById('btn-elora').classList.remove('active');
    updateLayerSelect();
    render();
  };

  document.getElementById('layer-select').onchange = (e) => {
    currentLayer = parseInt(e.target.value);
    render();
  };

  updateLayerSelect();
  render();
}

function updateLayerSelect() {
  const select = document.getElementById('layer-select');
  const data = currentKeyboard === 'elora' ? layouts.elora : layouts.corne;
  if (!data) return;

  const names = ['Base', 'Symbols', 'Numbers', 'Fn/Nav', 'Nums Alt', 'Fn Alt', 'RGB', 'Extra'];
  select.innerHTML = '';
  for (let i = 0; i < data.layout.length; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = names[i] || `Layer ${i}`;
    select.appendChild(opt);
  }
  select.value = currentLayer;
}

function render() {
  const container = document.getElementById('keyboard');
  container.innerHTML = '';

  const data = currentKeyboard === 'elora' ? layouts.elora : layouts.corne;
  const physical = currentKeyboard === 'elora' ? ELORA_LAYOUT : CORNE_LAYOUT;

  if (!data) {
    container.innerHTML = '<div class="error">No layout data for ' + currentKeyboard + '</div>';
    return;
  }

  if (!physical) {
    container.innerHTML = '<div class="error">No physical layout (ELORA_LAYOUT=' + (typeof ELORA_LAYOUT) + ', CORNE_LAYOUT=' + (typeof CORNE_LAYOUT) + ')</div>';
    return;
  }

  const layer = data.layout[currentLayer];
  if (!layer) {
    container.innerHTML = '<div class="error">No layer ' + currentLayer + '</div>';
    return;
  }

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:flex; gap:100px; padding:60px; justify-content:center; align-items:flex-start;';

  // Left half
  const leftDiv = document.createElement('div');
  const leftBounds = getBounds(physical.keys.left);
  const leftW = (leftBounds.maxX - leftBounds.minX) * KEY_SIZE + KEY_SIZE;
  const leftH = (leftBounds.maxY - leftBounds.minY) * KEY_SIZE + KEY_SIZE;
  leftDiv.style.cssText = `position:relative; width:${leftW}px; height:${leftH}px; transform:rotate(-10deg);`;

  physical.keys.left.forEach(k => {
    const code = layer[k.row] && layer[k.row][k.col];
    if (code === undefined || code === null) return;
    const el = makeKey(k, code, leftBounds);
    if (el) leftDiv.appendChild(el);
  });

  // Right half
  const rightDiv = document.createElement('div');
  const rightBounds = getBounds(physical.keys.right);
  const rightW = (rightBounds.maxX - rightBounds.minX) * KEY_SIZE + KEY_SIZE;
  const rightH = (rightBounds.maxY - rightBounds.minY) * KEY_SIZE + KEY_SIZE;
  rightDiv.style.cssText = `position:relative; width:${rightW}px; height:${rightH}px; transform:rotate(10deg);`;

  physical.keys.right.forEach(k => {
    const code = layer[k.row] && layer[k.row][k.col];
    if (code === undefined || code === null) return;
    const el = makeKey(k, code, rightBounds);
    if (el) rightDiv.appendChild(el);
  });

  wrapper.appendChild(leftDiv);
  wrapper.appendChild(rightDiv);
  container.appendChild(wrapper);
}

function getBounds(keys) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  keys.forEach(k => {
    if (k.x < minX) minX = k.x;
    if (k.x + (k.w || 1) > maxX) maxX = k.x + (k.w || 1);
    if (k.y < minY) minY = k.y;
    if (k.y + (k.h || 1) > maxY) maxY = k.y + (k.h || 1);
  });
  return { minX, maxX, minY, maxY };
}

function makeKey(def, code, bounds) {
  const info = parseKeycode(code);
  if (info.type === 'hidden') return null;

  const el = document.createElement('div');
  el.className = getKeyTypeClass(info);
  if (def.homeRow) el.classList.add('home-row');
  if (def.encoder) el.classList.add('encoder');

  const x = (def.x - bounds.minX) * KEY_SIZE;
  const y = (def.y - bounds.minY) * KEY_SIZE;
  const w = (def.w || 1) * KEY_SIZE - KEY_GAP;
  const h = (def.h || 1) * KEY_SIZE - KEY_GAP;

  el.style.position = 'absolute';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.width = w + 'px';
  el.style.height = h + 'px';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'key-label-container';

  const label = document.createElement('div');
  label.className = 'key-label';
  if (info.label.length > 6) label.classList.add('small');
  if (info.label.length > 10) label.classList.add('tiny');
  label.textContent = info.label;
  labelDiv.appendChild(label);

  if (info.hold) {
    const hold = document.createElement('div');
    hold.className = 'key-mod';
    hold.textContent = info.hold;
    labelDiv.appendChild(hold);
  }

  el.appendChild(labelDiv);

  el.onmouseenter = () => {
    document.getElementById('key-details').innerHTML =
      '<div class="detail-row"><span class="detail-label">Key:</span><span class="detail-value">' + (info.label || '(none)') + '</span></div>' +
      (info.hold ? '<div class="detail-row"><span class="detail-label">Hold:</span><span class="detail-value">' + info.hold + '</span></div>' : '') +
      '<div class="detail-row"><span class="detail-label">Raw:</span><span class="detail-value" style="font-family:monospace;font-size:0.8em">' + info.raw + '</span></div>';
  };

  el.onmouseleave = () => {
    document.getElementById('key-details').textContent = 'Hover over a key to see details';
  };

  return el;
}

init();

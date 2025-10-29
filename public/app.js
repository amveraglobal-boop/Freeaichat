// --- Access Key Gate ---
const keyGate = document.getElementById('key-gate');
const chatUI = document.getElementById('chat-ui');
const keyForm = document.getElementById('key-form');
const keyInput = document.getElementById('access-key');
const keyError = document.getElementById('key-error');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send');

const ACCESS_KEY = '#123456#';

keyForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (keyInput.value === ACCESS_KEY) {
    keyGate.style.display = 'none';
    chatUI.style.display = '';
    keyInput.value = '';
    keyError.style.display = 'none';
    promptInput.disabled = false;
    sendBtn.disabled = false;
    promptInput.focus();
  } else {
    keyError.style.display = '';
    keyInput.value = '';
    keyInput.focus();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  keyInput.focus();
});

const modelsContainer = document.getElementById('models');
const responsesEl = document.getElementById('responses');

// Click card to toggle checkbox and styling
modelsContainer.querySelectorAll('.model').forEach(card => {
  const cb = card.querySelector('input[type="checkbox"]');
  card.addEventListener('click', (e) => {
    // Prevent toggling when clicking the checkbox itself double-handled
    if (e.target.tagName === 'INPUT') return;
    cb.checked = !cb.checked;
    card.classList.toggle('selected', cb.checked);
  });
  cb.addEventListener('change', () => {
    card.classList.toggle('selected', cb.checked);
  });
});

async function callModel(model, prompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt })
  });
  if (!res.ok) throw new Error('Server error');
  return res.json();
}

function makeResponseCard(model, content) {
  const wrap = document.createElement('div');
  wrap.className = 'resp';

  const meta = document.createElement('div');
  meta.className = 'meta';
  const title = document.createElement('div');
  title.innerHTML = `<strong>${model}</strong>`;
  const actions = document.createElement('div');
  actions.className = 'actions';

  const downloadBtn = document.createElement('a');
  downloadBtn.href = '#';
  downloadBtn.className = 'action';
  downloadBtn.textContent = 'Download TXT';
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.replace(/[^a-z0-9-]/gi,'_')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  const emailBtn = document.createElement('a');
  emailBtn.className = 'action';
  emailBtn.textContent = 'Share via Email';
  emailBtn.href = `mailto:?subject=${encodeURIComponent('AI response from ' + model)}&body=${encodeURIComponent(content)}`;

  actions.appendChild(downloadBtn);
  actions.appendChild(emailBtn);

  meta.appendChild(title);
  meta.appendChild(actions);

  const pre = document.createElement('pre');
  pre.style.whiteSpace = 'pre-wrap';
  pre.textContent = content;

  wrap.appendChild(meta);
  wrap.appendChild(pre);
  return wrap;
}

sendBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert('Please enter a prompt.');

  const checked = Array.from(document.querySelectorAll('input[name="model"]:checked')).map(i => i.value);
  if (checked.length === 0) return alert('Please select at least one model.');

  // Clear previous
  responsesEl.innerHTML = '';

  for (const model of checked) {
    // optimistic placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'resp';
    placeholder.innerHTML = `<div class="meta"><strong>${model}</strong><div class="small">Loading...</div></div>`;
    responsesEl.appendChild(placeholder);

    try {
      const r = await callModel(model, prompt);
      const content = typeof r.content === 'string' ? r.content : JSON.stringify(r.content, null, 2);
      const card = makeResponseCard(model, content);
      responsesEl.replaceChild(card, placeholder);
    } catch (err) {
      placeholder.innerHTML = `<div class="meta"><strong>${model}</strong><div class="small">Error: ${err.message}</div></div>`;
    }
  }
});

// Optional: send on Ctrl+Enter
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    sendBtn.click();
  }
});

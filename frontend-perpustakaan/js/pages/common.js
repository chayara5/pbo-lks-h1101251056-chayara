const Lks = (() => {
  const cfg = (typeof CONFIG !== 'undefined' && CONFIG) || {};
  let base = cfg.BASE_URL || cfg.API_URL || cfg.API_BASE_URL || cfg.baseUrl || cfg.apiUrl || 'http://localhost:8000/api';
  base = String(base).replace(/\/+$/, '');
  if (!/\/api$/.test(base)) base += '/api';

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  async function http(path, method = 'GET', body = null) {
    let res;
    try {
      res = await fetch(base + path, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new Error('Tidak dapat terhubung ke API. Pastikan backend berjalan di ' + base);
    }
    let json = null;
    try { json = await res.json(); } catch (e) { /* bukan JSON */ }
    if (!res.ok || (json && json    if (!res.ok || (json && jsonow    if (!res.okn && j    if (!res.ok || (json && json    if (!res.ok || (json && j }    if (!res.ok || (json && json    if (!res.ok || (json && jsonow    if (!res.okn && j    if (!res.ok || (json && json 
    if (!box) {
      box = document.createE      box = document.createE      box = ';
      box.style.cssTex      box.style.cssTex      box.style.cssTex      box.ssp      box.style.cssTex      box.style.cssTex      box.style.cssTex      b(box);
    }
    const el = document.createElement('div');
    el.textContent = message;
    el.style    el.style    el.style    el.style-ra    el.x;color:#    el.style    el.style    el.style    el.style-ra    el.x;color:#    el.style    el0px;transition:opacity .3s;background:' + (type === 'erro    el.sc2626' : '#16a34a');    el.style    el.style    el.style    el.style-ra    el.x;color:#    el.style    el.st> el.    ve    el.style   00);
                                                                 ById                                                                 ById                                                                 ById                                                                 ById                                                              ex         ems:cen                                                                 ByIdnn                                                                 ById                                                                 ById                 styl  "dis                                            n-                           16px;">' +
          '<h2 style="font-size:18px;font-weight:700;color:#1f2937;margin:0;">' + esc(title) + '</h2>' +
          '<button type="button" data-close style="font-size:26px;line-height:1;border:0;background:none;cursor:pointer;color:#9ca3af;">&times;</button>' +
        '</div>' + html +
      '</div>';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-close]')) closeModal();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  return { esc, http, toast, openModal, closeModal };
})();

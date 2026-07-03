/* ───────────────────────────────────────────────────────────
   Proteção anti-clonagem / cópia (camada de dissuasão)
   IMPORTANTE: é um DETERRENTE, não uma blindagem absoluta.
   Todo site estático pode ser copiado por quem souber salvar
   o HTML. Isto apenas dificulta o usuário comum, scrapers e
   "clonadores de 1 clique" (Ctrl+S / botão direito / view-source).
   ─────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // 1) Bloqueia o menu do botão direito
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, { capture: true });

  // 2) Bloqueia atalhos de DevTools / ver-código-fonte / salvar página
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    // F12
    if (k === 'f12') { e.preventDefault(); return false; }
    // Ctrl+U (ver fonte) | Ctrl+S (salvar) | Ctrl+P (imprimir)
    if (e.ctrlKey && !e.shiftKey && (k === 'u' || k === 's' || k === 'p')) {
      e.preventDefault(); return false;
    }
    // Ctrl+Shift+I / J / C (DevTools, console, inspetor)
    if (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) {
      e.preventDefault(); return false;
    }
    // Cmd no Mac
    if (e.metaKey && e.altKey && (k === 'i' || k === 'j' || k === 'c')) {
      e.preventDefault(); return false;
    }
  }, { capture: true });

  // 3) Impede arrastar imagens para fora (download fácil)
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  }, { capture: true });

})();

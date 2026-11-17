/**
 * Recebe os orçamentos dos sites Layer72 e VIA72, guarda os arquivos no Google Drive
 * e envia um e-mail com os dados do pedido e os arquivos anexados.
 *
 * Implantar: Implantar → Nova implantação → Tipo "App da Web"
 *   Executar como: Eu  ·  Quem pode acessar: Qualquer pessoa
 * Copie a URL que termina em /exec e cole na constante ENDPOINT do index.html de cada site.
 */
const DESTINO = "contato@zirconiumlabs.com";   // quem recebe os orçamentos
const PASTA = "Orçamentos dos sites";           // pasta criada no Drive de quem implanta
const MAX_ANEXO = 20 * 1024 * 1024;             // acima disso, o e-mail leva só os links do Drive

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const f = d.fields || {};
    const nome = String(f.Nome || "cliente").slice(0, 60);
    const quando = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd HH'h'mm");
    const blobs = (d.files || []).map(x => Utilities.newBlob(Utilities.base64Decode(x.data), x.type || "application/octet-stream", x.name));

    let links = [];
    if (blobs.length) {
      const pasta = raiz_().createFolder(quando + " · " + (f._origem || "site") + " · " + nome);
      links = blobs.map(b => ({ nome: b.getName(), url: pasta.createFile(b).getUrl(), kb: Math.ceil(b.getBytes().length / 1024) }));
    }
    const total = blobs.reduce((s, b) => s + b.getBytes().length, 0);

    const linhas = Object.keys(f).filter(k => k.charAt(0) !== "_").map(k =>
      '<tr><td style="padding:5px 12px;color:#56655F;border-bottom:1px solid #E3EAE7">' + esc_(k.replace(/_/g, " ")) +
      '</td><td style="padding:5px 12px;border-bottom:1px solid #E3EAE7"><b>' + esc_(f[k]) + "</b></td></tr>").join("");
    const arquivos = links.map(l => '<li><a href="' + l.url + '">' + esc_(l.nome) + "</a> (" + l.kb + " KB)</li>").join("");
    const html =
      '<div style="font-family:Arial,sans-serif;font-size:14px;color:#10201C">' +
      '<h2 style="margin:0 0 12px">' + esc_(f._subject || "Orçamento do site") + "</h2>" +
      '<table style="border-collapse:collapse">' + linhas + "</table>" +
      (arquivos ? "<p><b>Arquivos</b> (anexados" + (total > MAX_ANEXO ? " apenas como link, por passarem de 20 MB" : "") + " e salvos no Google Drive):</p><ul>" + arquivos + "</ul>" : "<p>Sem arquivos.</p>") +
      "</div>";

    const opts = { to: DESTINO, subject: f._subject || "Orçamento do site", htmlBody: html, name: f._origem || "Site" };
    if (f._replyto) opts.replyTo = f._replyto;
    if (blobs.length && total <= MAX_ANEXO) opts.attachments = blobs;
    MailApp.sendEmail(opts);
    return json_({ ok: true, arquivos: links.length, anexados: blobs.length && total <= MAX_ANEXO });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  }
}

// Rode esta função uma vez pelo editor para autorizar o acesso ao Gmail e ao Drive.
function testeEnvio() {
  const conteudo = Utilities.base64Encode("teste de anexo");
  const r = doPost({ postData: { contents: JSON.stringify({
    fields: { _subject: "Teste do formulário dos sites", _origem: "Teste", Nome: "Teste", Email: DESTINO },
    files: [{ name: "teste.txt", type: "text/plain", data: conteudo }]
  }) } });
  Logger.log(r.getContent());
}

function doGet() { return json_({ ok: true, servico: "orcamentos" }); }
function raiz_() { const it = DriveApp.getFoldersByName(PASTA); return it.hasNext() ? it.next() : DriveApp.createFolder(PASTA); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

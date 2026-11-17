# Site VIA72

Site de uma página da VIA72 Circuitos Impressos (PCB de 1 a 4 camadas), uma operação Zirconium.

## Conteúdo

- `index.html`: o site completo num arquivo só: estilos, leitor de arquivos de PCB, visualizador, cálculo de preço e frete.
- `.nojekyll`: faz o GitHub Pages publicar os arquivos como estão.

O site não depende de bibliotecas externas além das fontes do Google (JetBrains Mono e Inter). O leitor de .zip usa o descompactador nativo do navegador.

## O que a cotação faz

**Formatos lidos no navegador, em ordem de prioridade** (se o envio tiver projeto e Gerbers juntos, vale o projeto):
1. KiCad `.kicad_pcb`, versão 5 ou mais nova.
2. Eagle `.brd` em XML, versão 6 ou mais nova.
3. Gerber RS-274X, com furação Excellon, em `.zip` ou arquivos soltos. A função de cada arquivo é reconhecida pelos atributos X2 ou pelo nome (padrões KiCad, Altium/Protel, Eagle). Também é usado quando o projeto KiCad ou Eagle não pode ser lido.

**O que aparece para o cliente:**
- A placa nas vistas Topo, Base (espelhada) e Camadas, com zoom e arraste.
- A tabela de camadas, onde ele define a função de cada arquivo (cobre topo, base, interno, máscara, legenda, contorno, furação) e liga ou desliga cada uma na vista.

**O que é lido do arquivo:**
- Dimensões (pelo contorno ou, sem ele, pelo cobre).
- Número de camadas de cobre.
- Quantidade de furos e quantos são sem metalização.
- Trilha mínima e furo mínimo.

**Preço** (plano operacional da Linha B):
- Setup + painéis de 200 × 100 mm. O aproveitamento é calculado pelas dimensões da placa.
- Lote compartilhado: sem setup, fração de painel com mínimo de 0,25.
- Adicionais: furos acima de 300 por painel (R$ 0,05 cada), urgência (+50%), laudo em placa de 1 camada (R$ 40) e máscara azul ultrarrápida (−1 dia útil).

**Avisos de DFM:**
- Placa maior que o painel.
- Mais de 4 camadas.
- Trilha abaixo de 0,2 mm ou furo abaixo de 0,4 mm.
- Ausência de contorno ou de furação.

**Prazo e capacidade:**
- A fábrica produz 5 placas por dia (`CAP_DIA`). Cada grupo de 5 placas acima das primeiras 5 soma 1 dia útil ao prazo.
- A urgência de 24–48 h só fica disponível para lotes dedicados de até 5 placas.

**Frete:**
- Correios SEDEX e SEDEX 10, a partir do CEP 80010-020 (Curitiba/PR).
- Retirada só para CEPs de Curitiba.

## Ajustes no script do `index.html`

- `CAP_DIA`: placas fabricadas por dia útil (5).
- `TIPOS`, `FUROS_POR_PAINEL`, `FURO_EXTRA`, `LAUDO_1F`, `URG`, `SHARED_MIN`, `SHARED_DIAS`: preços e prazos.
- `DFM`: trilha e furo mínimos usados nos avisos. Confirme com o processo de fabricação.
- `ORIGEM`, `CURITIBA`, `REAJ`: frete.
- `EMAIL`: destino dos orçamentos (contato@zirconiumlabs.com).

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `via72-site`) e envie `index.html` e `.nojekyll` para a raiz da branch `main`.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site fica em `https://<usuario>.github.io/via72-site/`. Para o domínio `via72.com.br`, siga os mesmos passos de domínio próprio do site do Layer72.

## Envio dos orçamentos por e-mail (com os arquivos)

O FormSubmit entrega o texto dos orçamentos, mas descarta os arquivos anexados. Para os arquivos chegarem, o site usa um Google Apps Script gratuito, criado na conta Google de vocês. A cada orçamento ele:

- envia o e-mail para contato@zirconiumlabs.com com os dados do pedido e os arquivos anexados (até 20 MB; acima disso, vão só os links);
- guarda os arquivos na pasta "Orçamentos dos sites" do Google Drive;
- deixa o "Responder" do e-mail apontando para o cliente.

### Configuração (uma vez, cerca de 5 minutos; o mesmo script atende os dois sites)

1. Acesse https://script.google.com com a conta Google que vai enviar os e-mails e clique em **Novo projeto**.
2. Apague o conteúdo do editor e cole o arquivo `apps-script/Code.gs` deste zip. Salve.
3. Selecione a função `testeEnvio` e clique em **Executar**. Autorize o acesso ao Gmail e ao Drive quando o Google pedir. Deve chegar um e-mail de teste com o arquivo `teste.txt` anexado.
4. Clique em **Implantar → Nova implantação**, escolha o tipo **App da Web** e configure:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa

   Clique em **Implantar** e copie a URL que termina em `/exec`.
5. No `index.html` de cada site, troque `const ENDPOINT = "";` por `const ENDPOINT = "https://script.google.com/macros/s/…/exec";`, colando a URL copiada. Publique de novo no GitHub.
6. Faça um orçamento de teste com arquivo em cada site.

Enquanto a URL não estiver configurada, o site continua usando o FormSubmit, e os e-mails podem chegar sem os arquivos. Se o envio falhar, o site oferece abrir o e-mail do cliente já preenchido.

Limite do cliente: 25 MB somando os arquivos. Acima disso, o orçamento é enviado sem anexo, e o site pede ao cliente que mande os arquivos por e-mail.

## Antes de divulgar

- Troque o WhatsApp provisório `(00) 00000-0000`.
- Confirme as regras de DFM, os prazos e o acabamento informado (FR-4 1,6 mm, cobre 35 µm, HASL).

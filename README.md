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

## Envio dos orçamentos por e-mail

O envio usa o FormSubmit (formsubmit.co), como no site do Layer72:

1. Envie um orçamento de teste com o site já publicado.
2. Clique no link de ativação que chega em contato@zirconiumlabs.com.
3. Confira se os arquivos chegam anexados.

Se o envio falhar, o site abre o e-mail do visitante já preenchido, para ele enviar manualmente.

## Antes de divulgar

- Troque o WhatsApp provisório `(00) 00000-0000`.
- Confirme as regras de DFM, os prazos e o acabamento informado (FR-4 1,6 mm, cobre 35 µm, HASL).

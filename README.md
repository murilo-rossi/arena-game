# Arena dos Círculos

Um jogo de luta simples.
Inspirado nos vídeos do canal [Earclacks](https://www.youtube.com/@Earclacks).

<p align="center">
  <img src="https://image2url.com/r2/default/gifs/1768272854197-c2fc5bf6-9c5c-4642-99fc-10fe0adc2edd.gif" alt="Exemplo de batalha entre os personagens">
</p>

---

## Funcionalidades

- **Sistema de combate** baseado em colisão
- **Classes de personagens** com stats únicos, on-hit effects e skills ativas
- **Armas variadas** com hitboxes customizadas e habilidades especiais
- **Sistema de modificadores** dinâmico para buffs/debuffs
- **Dados no Firebase** para fácil gestão de conteúdo

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| [Excalibur.js](https://excaliburjs.com/) v0.31 | Engine de jogos 2D |
| [TypeScript](https://www.typescriptlang.org/) | Linguagem principal |
| [Firebase/Firestore](https://firebase.google.com/) | Banco de dados |
| [Vite](https://vitejs.dev/) | Build tool |

---

## Começando

### Pré-requisitos

- Node.js 18+
- Conta no Firebase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/murilo-rossi/arena-game.git
cd arena-game

# Instale as dependências
npm install
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Crie um arquivo `.env` na raiz:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

4. Importe os dados de classes e armas no Firestore (use os arquivos em `docs/data/` como referência)

### Executando

```bash
npm run dev
```

Acesse `http://localhost:5173`

---

## Controles

| Tecla | Ação |
|-------|------|
| `P` | Mostrar/ocultar modo debug |

Os jogadores se movem automaticamente quicando nas paredes da arena.

---

## Sistema de Dados

O jogo carrega dados de classes e armas do Firebase Firestore. 
Veja [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md) para documentação completa do schema.

### Estrutura Resumida

**Classes** contêm:
- `baseStats` - HP, velocidade, chance de crítico, modificadores
- `onHitTaken/onHitGiven` - Efeitos ao receber/causar dano
- `activeSkill` - Habilidade ativa com cooldown e efeitos

**Armas** contêm:
- `baseStats` - Dano, velocidade de ataque, tamanho
- `hitbox` - Tipo (box/circle), dimensões, âncora
- `activeSkill` - Habilidade da arma

---

## Contribuições

Contruibuições são mais que bem vindas!

### Adicionando Classes ou Armas

Para adicionar ou modificar classes ou armas ao jogo:

1. Use os arquivos de referência em [`docs/data/`](docs/data/) (para sugerir modificações ou adições, utilize esses arquivos como base)
2. Siga o schema documentado em [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md)
3. Importe os dados no Firebase Firestore
4. Adicione os sprites correspondentes em `public/assets/graphics/`

### Arquivos de Referência

- [`docs/data/classes.json`](docs/data/classes.json) - Template para classes
- [`docs/data/weapons.json`](docs/data/weapons.json) - Template para armas

---

## Roadmap

### Em Desenvolvimento

**Sistema de Skills**
  - UI/hotkey para ativação de skills
  - Tracking de cooldown

**Customização**
  - Seletor de cores para o personagem

**Efeitos sonoros**
  - Efeitos de habilidades
  - Efeitos de dano
  - Trilha sonora

### Planejado

**Modo Campanha**
  - Seleção de 1 personagem apenas
  - Inimigos aleatórios com presets do banco de dados
  - Progressão sequencial de batalhas

**Redesign do Menu**
  - Nova identidade visual
  - Melhorar UX da tela de seleção

**Sistema Roguelike**
  - Escolher 1 de 3 upgrades após cada batalha
  - Gerenciamento de pool de upgrades
  - Persistência entre batalhas

---

## Licença

Este projeto está sob a licença MIT.

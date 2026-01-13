# Schema de Dados

Este documento descreve a estrutura dos dados do jogo armazenados no Firebase Firestore.

---

## Visão Geral

O jogo carrega dados de personagens e armas do Firestore. Os dados são organizados em coleções:

| Coleção | Descrição |
|---------|-----------|
| `classes` | Definições de classes de personagens |
| `weapons` | Definições de armas |

---

## Fluxo de Dados

```
docs/data/*.json  →  Firebase Firestore  →  Jogo (via DatabaseService)
    (referência)        (produção)           (runtime)
```

1. Use os arquivos em `docs/data/` como template
2. Importe para o Firestore manualmente ou via script
3. O jogo carrega os dados via `DatabaseService.getGameData()`

---

## Classes

### Estrutura Completa

```json
{
    "id": "identificador_unico",
    "name": "Nome Exibido",
    "description": "Descrição do personagem",
    "baseStats": { ... },
    "onHitTaken": { ... },
    "onHitGiven": { ... },
    "activeSkill": { ... }
}
```

### baseStats

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `hp` | number | Pontos de vida base |
| `moveSpeed` | number | Velocidade de movimento base |
| `sizeMultiplier` | number | Modificador de tamanho (0.0 = normal) |
| `criticalChance` | number | Chance de crítico (0.0 a 1.0) |
| `criticalMultiplier` | number | Multiplicador de dano crítico |
| `criticalDamageIncreaseMultiplier` | number | Aumento do multiplicador de crítico |
| `moveSpeedIncreaseFlat` | number | Aumento fixo de velocidade |
| `moveSpeedIncreaseMultiplier` | number | Aumento percentual de velocidade |
| `atkSpeedIncreaseFlat` | number | Aumento fixo de velocidade de ataque |
| `atkSpeedIncreaseMultiplier` | number | Aumento percentual de velocidade de ataque |
| `defenseIncreaseFlat` | number | Aumento fixo de defesa |
| `defenseIncreaseMultiplier` | number | Aumento percentual de defesa |
| `damageIncreaseFlat` | number | Aumento fixo de dano |
| `damageIncreaseMultiplier` | number | Aumento percentual de dano |

### onHitTaken / onHitGiven

Modificadores aplicados ao receber/causar dano.

### activeSkill

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único da skill |
| `name` | string | Nome exibido |
| `cooldown` | number | Tempo de recarga em segundos |
| `duration` | number | Duração do efeito em segundos |
| `effects` | object | Efeitos da skill (Ver abaixo)|

#### effects (activeSkill)

Os efeitos de uma skill não estão limitados a campos específicos, podendo afetar stats ou aplicando efeitos válidos.
Abaixo estão alguns exemplos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `atkSpeedMultiplier` | number | Bônus de velocidade de ataque |
| `moveSpeedMultiplier` | number | Bônus de velocidade de movimento |
| `sizeMultiplier` | number | Bônus de tamanho |
| `damageIncreaseFlat` | number | Bônus fixo de dano |
| `damageIncreaseMultiplier` | number | Bônus percentual de dano |
| `healOnActivate` | number | Cura ao ativar a skill |
| `poisonAllArena` | boolean | Aplica veneno em toda arena |
| `poisonDamagePerSecond` | number | Dano por segundo do veneno |
| `lifesteal` | number | Roubo de vida |

---

## Armas

### Estrutura Completa

```json
{
    "id": "identificador_unico",
    "name": "Nome Exibido",
    "description": "Descrição da arma",
    "baseStats": { ... },
    "hitbox": { ... },
    "activeSkill": { ... }
}
```

### baseStats

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `damage` | number | Dano base da arma |
| `sizeMultiplier` | number | Modificador de tamanho (0.0 = normal) |
| `baseAtkSpeed` | number | Velocidade de rotação base |
| `atkSpeedMultiplier` | number | Modificador de velocidade |
| `damageIncreaseFlat` | number | Aumento fixo de dano |
| `damageIncreaseMultiplier` | number | Aumento percentual de dano |

### hitbox

Define a área de colisão da arma:

#### Tipo Box (Retangular)

```json
{
    "type": "box",
    "width": 64,
    "height": 8,
    "anchorX": 1.5,
    "anchorY": 0.5
}
```

#### Tipo Circle (Circular)

```json
{
    "type": "circle",
    "radius": 20,
    "anchorX": 1.5,
    "anchorY": 0.5
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `type` | "box" \| "circle" | Tipo da hitbox |
| `width` | number | Largura (apenas box) |
| `height` | number | Altura (apenas box) |
| `radius` | number | Raio (apenas circle) |
| `anchorX` | number | Ponto de ancoragem X |
| `anchorY` | number | Ponto de ancoragem Y |

### activeSkill

Mesma estrutura das skills de classe. Veja seção acima.

---

## Cálculo de Stats

O sistema usa a fórmula:

```
valorFinal = (valorBase + totalFlat) * (1 + totalMultiplier)
```

Onde:
- `valorBase` - Valor original do stat
- `totalFlat` - Soma de todos os bônus fixos
- `totalMultiplier` - Soma de todos os bônus percentuais

---

## Exemplo: Adicionando uma Nova Classe

1. Copie o template de `docs/data/classes.json`
2. Modifique os valores:

```json
{
    "id": "minha_classe",
    "name": "Minha Classe",
    "description": "Descrição da classe...",
    "baseStats": {
        "hp": 100,
        "moveSpeed": 180,
        "sizeMultiplier": 0.0,
        "criticalChance": 0.15,
        ...
    },
    "activeSkill": {
        "id": "minha_skill",
        "name": "Nome da Skill",
        "cooldown": 10,
        "duration": 5,
        "effects": {
            "atkSpeedMultiplier": 0.3
        }
    }
}
```

3. Importe no Firestore na coleção `classes`
4. Adicione o sprite em `public/assets/graphics/classes/minha_classe.png`

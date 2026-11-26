# Contribuir

## Regras de uma skill

Cada skill é uma pasta `skills/ptf-<nome>/` com um `SKILL.md`. O CI recusa o pull request se alguma regra falhar:

| Regra | Exemplo |
|---|---|
| A pasta se chama `ptf-<nome>`: minúsculas, números e hífens, até 64 caracteres | `ptf-revisa-pr` |
| `name` no frontmatter é igual ao nome da pasta | `name: ptf-revisa-pr` |
| `description` diz o que a skill faz e quando usar, entre 30 e 1024 caracteres | `Revisa um PR apontando bugs. Use quando pedirem revisão.` |
| `metadata.category` diz em que aba do site a skill aparece | `desenvolvimento`, `carreira`, `performance` |
| O corpo do `SKILL.md` explica o que o agente deve fazer | |

Categorias novas são bem-vindas: use uma palavra em minúsculas com hífens (por exemplo `dados-e-ia`) e ela vira uma aba nova no site sozinha.

Use hífen no nome, não underline: o Claude Code só aceita minúsculas, números e hífens em nomes de skill.

Modelo pronto em [`templates/SKILL.md`](templates/SKILL.md).

## Antes de abrir o pull request

```bash
npm run check                 # valida as skills
npm test                      # testa o validador
claude plugin validate .      # valida o plugin, se tiver o Claude Code
```

Teste de verdade: instale a skill, diga uma frase que deveria dispará-la e confira que o agente a usou.

## Texto próprio

Escreva a skill do zero. Não copie skills, docs ou posts de terceiros sem licença que permita. Ao mandar, você publica sob a licença MIT do repositório.

## Segurança

Skills rodam com as permissões do agente de quem instalou. Pull requests com comandos que apagam dados, mandam dados para fora ou baixam e executam código sem a pessoa pedir serão recusados.

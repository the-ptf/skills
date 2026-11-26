<p align="center"><img src="assets/logo.png" alt="PTF" width="120"></p>

# PTF Skills

Skills open-source para agentes de código, feitas pela comunidade. Qualquer pessoa pode mandar a sua por pull request.

## Instalar

No Claude Code:

```
/plugin marketplace add the-ptf/ptfskills
/plugin install ptf@ptf
```

Ou copie só a pasta da skill que quiser para `~/.claude/skills/`.

## Mandar uma skill

1. Copie `templates/SKILL.md` para `skills/ptf-<nome>/SKILL.md`.
2. Preencha `name`, `description` e `metadata.category`.
3. Rode `npm run check` e abra o pull request.

As regras completas estão em [CONTRIBUTING.md](CONTRIBUTING.md).

## Site

O site é gerado a partir das próprias skills: cada `metadata.category` vira uma aba. Para ver local:

```bash
npm run build   # gera dist/index.html
```

## Licença

[MIT](LICENSE). Ao mandar uma skill, você concorda em publicá-la sob essa licença.

# Milestone 2 evidence matrix

Scope confirmed on 2026-07-29: add nine Cao–Xiahou figures, keep their visual
faction as Wei, and add only source-located parent, adoption, or bounded clan
relationships. Warfare, office, allegiance, and political-event edges remain
out of scope.

## Source and license review

The formal records below use short excerpts from the public-domain
*Records of the Three Kingdoms*. The locatable reading copy is the existing
Chinese Wikisource source already used by the project:
`https://zh.wikisource.org/wiki/三國志/卷09`. The host page identifies its text
carrier license as CC BY-SA 4.0. No Wikidata candidate was promoted into the
formal layer, and no third-party database dump was copied.

## People

| Local ID | Display | Courtesy name | Visual faction | Formal source | Review note |
| --- | --- | --- | --- | --- | --- |
| `person:sg:cao_ren` | 曹仁 | 子孝 | 魏 | 卷九·曹仁传 | 正文称“太祖从弟” |
| `person:sg:cao_hong` | 曹洪 | 子廉 | 魏 | 卷九·曹洪传 | 正文称“太祖从弟” |
| `person:sg:cao_xiu` | 曹休 | 文烈 | 魏 | 卷九·曹休传 | 正文称“太祖族子” |
| `person:sg:cao_zhen` | 曹真 | 子丹 | 魏 | 卷九·曹真传 | 正文称“太祖族子”；裴注异姓说不改写正文层 |
| `person:sg:cao_shuang` | 曹爽 | 昭伯 | 魏 | 卷九·曹真、曹爽传 | 正文记“子爽嗣” |
| `person:sg:xiahou_dun` | 夏侯惇 | 元让 | 魏 | 卷九·夏侯惇传 | 正文载字、籍贯 |
| `person:sg:xiahou_yuan` | 夏侯渊 | 妙才 | 魏 | 卷九·夏侯渊传 | 正文称“惇族弟” |
| `person:sg:xiahou_shang` | 夏侯尚 | 伯仁 | 魏 | 卷九·夏侯尚传 | 正文称“渊从子” |
| `person:sg:xiahou_xuan` | 夏侯玄 | 太初 | 魏 | 卷九·夏侯玄传 | 正文记“子玄嗣”“爽之姑子” |

Visual faction is a presentation classification and remains separate from
`Person.factions`.

## Relations

| Relation | Exact basis | Evidence basis | Certainty | Review |
| --- | --- | --- | --- | --- |
| 曹操—曹仁 | “太祖从弟” | direct record | confirmed | verified |
| 曹操—曹洪 | “太祖从弟” | direct record | confirmed | verified |
| 曹操—曹休 | “太祖族子” | direct record | confirmed | verified |
| 曹操—曹真 | “太祖族子” | direct record | confirmed | verified |
| 曹操→曹真（收养） | “收养与诸子同” | direct record | probable | verified |
| 曹真→曹爽 | “子爽嗣” | direct record | confirmed | verified |
| 夏侯惇—夏侯渊 | “惇族弟” | direct record | confirmed | verified |
| 夏侯渊—夏侯尚 | “渊从子” | direct record | confirmed | verified |
| 夏侯尚→夏侯玄 | “子玄嗣” | direct record | confirmed | verified |
| 曹爽—夏侯玄 | “玄，爽之姑子也” | direct record | confirmed | verified |

The adoption edge is intentionally `probable`: the wording directly supports
raising Cao Zhen with Cao Cao's sons, but the project does not equate that
without qualification to a modern legal adoption. Unnamed intermediate
parents, Cao Zhen–Xiahou Xuan kinship, and other computable connections remain
unpersisted.

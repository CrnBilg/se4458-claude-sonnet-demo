# Sources and references

Rule: every number on a slide must come from an **official Anthropic page**. Verified on 16 Nov 2026.
Third-party blogs were used only to find leads, never as the source on a slide.

## Verified figures (use these on slides)

| Slide claim | Value | Official source | Verified |
|---|---|---|---|
| Release date | 28 Sep 2026 | https://www.anthropic.com/claude-sonnet-5-5 and https://platform.claude.com/docs/en/models/sonnet-5-5/overview | 16 Nov 2026 |
| Model ID | `claude-sonnet-5-5` | https://platform.claude.com/docs/en/models/sonnet-5-5/overview | 16 Nov 2026 |
| API price | $2 per M input tokens, $10 per M output tokens | same two pages | 16 Nov 2026 |
| Context window | 1M tokens | platform.claude.com model page | 16 Nov 2026 |
| Max output | 128K tokens (Batch API beta: 300K) | platform.claude.com model page | 16 Nov 2026 |
| Knowledge cutoff | June 2026 | platform.claude.com models comparison table | 16 Nov 2026 |
| Speed / cost claim | "30%+ faster, up to 30% less per task" (vendor claim, for most work, vs Sonnet 5) | anthropic.com announcement | 16 Nov 2026 |
| Positioning | "faster, lower-cost complement to Opus 5.5"; Opus 5.5 priced $4 / $20 | anthropic.com announcement | 16 Nov 2026 |
| Claude Code with Pro | Pro includes Claude Code; limits shared with chat; 5-hour window plus weekly limit | https://support.claude.com/en/articles/11145838 | 16 Nov 2026 |
| API key warning | If `ANTHROPIC_API_KEY` is set, Claude Code uses it instead of the subscription and bills API usage | same support article | 16 Nov 2026 |

## Benchmarks (vendor-reported, from the official announcement)

Label every one on the slide as "reported by Anthropic". Do not mix with other vendors' numbers.

| Benchmark | Sonnet 5.5 | Sonnet 5 | Opus 5.5 |
|---|---|---|---|
| Terminal-Bench 4.0 | 70.6% | 10.3% | 66.4% (Xhigh effort) |
| FrontierCode 1.1 (Main) | 46.2% (Max), 52.1% (Xhigh) | 42.4% | 54.4% |
| CursorBench 4.0 | 55.5% | 34.1% | 57.8% |
| OSWorld 2.1 (partial credit) | 80.1% | 57.0% | 81.8% |
| Humanity's Last Exam (with tools) | 64.5% | 54.9% | 67.7% |

Footnote to keep: the announcement says Sonnet 5.5 scores lower at Max effort than at Xhigh on FrontierCode because that benchmark penalizes out-of-scope changes.

## Corrections: do NOT use these earlier figures

- **"SWE-Bench Pro 81.3%"**: it is NOT on the official announcement page. It came from a third-party blog. Do not put it on a slide. Use Terminal-Bench 4.0 and the table above instead.
- **Cache read price**: the announcement page lists $0.10 per M for Sonnet 5.5, while some blogs and the Sonnet 5 docs say $0.20. Leave cache pricing off the slides or re-check the pricing page right before presenting.

## Still to check before presenting

- Which Sonnet version Claude Code uses by default under Pro (check in `/model` during rehearsal and screenshot it).
- The 26 Nov usage limits of Pro (the support article gives the mechanism, not numbers).

## Course material

- SE 4458 slides: 01 Introduction, 03 API Design, 04 Architectural Building Blocks
- SE 4458 Assignment 1 demo instructions (PDF)

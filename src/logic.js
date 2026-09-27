// QVAC Project Intro Paragraph Writer — core logic.
// completion() does the actual generation; a small set of deterministic
// guards catch unusable model output (refusals, empty text, preamble).

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 1200) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able", "i apologize"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripPreamble(text) {
  return text
    .trim()
    .replace(/^here'?s?[^:\n]*:\s*/i, "")
    .replace(/^sure[,!]?\s*/i, "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .trim();
}

// NOTE: earlier versions of this fallback read "This project " + description,
// which only reads grammatically when the description happens to start with
// a verb (e.g. "helps users track..."). Most descriptions instead start with
// a noun phrase ("a CLI tool that...", "a mobile app for..."), which produced
// broken sentences like "This project a CLI tool that...". Using a colon
// instead of assuming a subject-verb fit works regardless of phrasing.
const FALLBACK = (v) => `About this project: ${v.trim().replace(/\.$/, "").slice(0, 220)}.`;

export async function generate(modelId, description) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content: "You are a technical writer. Given a short description of a software project (what it does, who it's for), write ONE polished README introduction paragraph (3-5 sentences) grounded strictly in the given description. Do not invent features, technologies, or audiences that were not mentioned. Reply with ONLY the paragraph, no heading, no preamble.",
      },
      { role: "user", content: `Project description: ${description}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.6, maxTokens: 220 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripPreamble(text);

  const output = looksUnusable(text) ? FALLBACK(description) : text;
  return { result: output };
}

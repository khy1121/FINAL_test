import type { SubjectId } from "../types";
import iosRawNotes from "../content/ios-notes.md?raw";
import wf2RawNotes from "../../wf2/3.md?raw";

export interface NoteSection {
  title: string;
  level: number;
  body: string;
}

export const notesBySubject: Record<SubjectId, string> = {
  ios: iosRawNotes,
  wf2: wf2RawNotes,
};

export const noteText = iosRawNotes;

export function extractNoteSections(markdown: string): NoteSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: NoteSection[] = [];
  let current: NoteSection | null = null;

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (current && current.body.trim()) {
        sections.push({ ...current, body: cleanMarkdown(current.body) });
      }
      current = {
        level: heading[1].length,
        title: heading[2].replace(/`/g, "").trim(),
        body: "",
      };
      continue;
    }

    if (current) {
      current.body += `${line}\n`;
    }
  }

  if (current && current.body.trim()) {
    sections.push({ ...current, body: cleanMarkdown(current.body) });
  }

  return sections;
}

function cleanMarkdown(value: string): string {
  return value
    .replace(/---+/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

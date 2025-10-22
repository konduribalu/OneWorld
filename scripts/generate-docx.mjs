import { promises as fs } from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const workspaceRoot = process.cwd();
const resumesDir = path.join(workspaceRoot, 'Resumes');
const onePageTxt = path.join(resumesDir, 'Balakrishna_Konduri_OnePage.txt');

function makeHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true })],
    spacing: { before: 240, after: 120 },
  });
}

function makeParagraph(text) {
  return new Paragraph({
    children: [new TextRun(text)],
    spacing: { after: 120 },
  });
}

function makeBullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 },
  });
}

async function generateFromTxt(inputPath, outputPath) {
  const content = await fs.readFile(inputPath, 'utf8');
  const lines = content.split(/\r?\n/);

  const children = [];

  // Header: Name then contact line
  const name = lines[0]?.trim();
  const contact = lines[1]?.trim();
  if (name) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: name, bold: true, size: 32 })],
        spacing: { after: 80 },
      })
    );
  }
  if (contact) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: contact, size: 22 })],
        spacing: { after: 200 },
      })
    );
  }

  const sectionHeadings = new Set(['SUMMARY', 'CORE SKILLS', 'EXPERIENCE', 'EDUCATION', 'AWARD', 'AWARDS']);

  for (let i = 2; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) { continue; }

    if (sectionHeadings.has(line.toUpperCase())) {
      children.push(makeHeading(line.toUpperCase()));
      continue;
    }

    if (line.startsWith('- ')) {
      children.push(makeBullet(line.substring(2)));
      continue;
    }

    // Role/company lines like "IPOLARITY LLC — Tech Lead (NIH) | Jun 2019–Present"
    if (/—|\|/.test(line) && /\d{4}/.test(line)) {
      children.push(new Paragraph({ children: [new TextRun({ text: line, bold: true })], spacing: { after: 60 } }));
      continue;
    }

    children.push(makeParagraph(line));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
}

async function main() {
  const outOnePage = path.join(resumesDir, 'Balakrishna_Konduri_OnePage.docx');
  const outResume = path.join(resumesDir, 'Balakrishna_Konduri_Resume.docx');
  await generateFromTxt(onePageTxt, outOnePage);
  // Also emit a copy named Resume.docx for convenience
  await generateFromTxt(onePageTxt, outResume);
  console.log('Generated:', outOnePage, 'and', outResume);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

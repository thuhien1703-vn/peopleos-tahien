import fs from 'fs';
import path from 'path';

export default function Course({ html }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'k5-recruiting-co-ban.html');
  const html = fs.readFileSync(filePath, 'utf8');
  return { props: { html } };
}

import fs from 'node:fs';

const templatePath = 'src/environments/environment.template.ts';
const outputPath = 'src/environments/environment.ts';

const replacements = {
  '__FIREBASE_API_KEY__': process.env.FIREBASE_API_KEY ?? '',
  '__FIREBASE_AUTH_DOMAIN__': process.env.FIREBASE_AUTH_DOMAIN ?? '',
  '__FIREBASE_PROJECT_ID__': process.env.FIREBASE_PROJECT_ID ?? '',
  '__FIREBASE_STORAGE_BUCKET__': process.env.FIREBASE_STORAGE_BUCKET ?? '',
  '__FIREBASE_MESSAGING_SENDER_ID__': process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  '__FIREBASE_APP_ID__': process.env.FIREBASE_APP_ID ?? '',
  '__TMDB_API_KEY__': process.env.TMDB_API_KEY ?? '',
  '__TMDB_BASE_URL__': process.env.TMDB_BASE_URL ?? '',
};

let content = fs.readFileSync(templatePath, 'utf8');

for (const [token, value] of Object.entries(replacements)) {
  content = content.replaceAll(token, value);
}

fs.writeFileSync(outputPath, content);

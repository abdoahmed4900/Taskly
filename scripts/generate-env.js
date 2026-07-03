const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const environment = `export const environment = {
  production: true,
  baseUrl: '${process.env.SUPABASE_URL}',
  apiKey: '${process.env.SUPABASE_ANON_KEY}',
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), environment);

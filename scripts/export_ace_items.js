const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[match[1].trim()]) {
          process.env[match[1].trim()] = val;
        }
      }
    }
  });
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '2n0p273q';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_TOKEN = process.env.SANITY_API_TOKEN;

const query = encodeURIComponent(`*[_type == "workItem" && (productId == "ace-acad" || !defined(productId))]{
  _id,
  itemNumber,
  title,
  description,
  type,
  priority,
  status,
  assignee,
  codeReference,
  projectId
} | order(itemNumber asc)`);

const options = {
  hostname: `${PROJECT_ID}.api.sanity.io`,
  path: `/v2024-01-01/data/query/${DATASET}?query=${query}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const outputPath = path.join('c:', 'Users', 'USER', 'Documents', 'GitHub', 'ace_acad_mobile', 'scripts', 'all_wstar_items.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsed.result, null, 2), 'utf8');
    console.log(`Saved ${parsed.result.length} items to ${outputPath}`);
  });
});

req.on('error', (e) => {
  console.error('Error querying Sanity:', e);
});

req.end();

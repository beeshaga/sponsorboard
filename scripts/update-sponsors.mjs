#!/usr/bin/env node

/**
 * UPDATE SPONSORS SCRIPT
 * 
 * Fetches the latest Home Office Register of Licensed Sponsors CSV,
 * parses it, filters for A-rated Skilled Worker sponsors, and updates
 * src/data/sponsors.js with the full list.
 * 
 * Usage:
 *   node scripts/update-sponsors.mjs
 * 
 * What it does:
 * 1. Scrapes the gov.uk page to find the current CSV download URL
 * 2. Downloads the CSV (~11MB)
 * 3. Parses all rows
 * 4. Filters for: Route includes "Skilled Worker" AND Rating = "A"
 * 5. Enriches with known careers URLs from the lookup table
 * 6. Writes the updated sponsors.js file
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── CAREERS URL LOOKUP ─────────────────────────────────────────────────────
// Map company names (as they appear in the CSV) to their careers page URLs.
// Add more as you discover them. Companies not in this lookup will get a
// Google search link as a fallback.
const CAREERS_URLS = {
  "google uk ltd": "https://careers.google.com/jobs/results/?location=United%20Kingdom",
  "meta platforms ireland limited": "https://www.metacareers.com/jobs?offices[0]=London%2C%20UK",
  "amazon uk services ltd": "https://www.amazon.jobs/en-gb/locations/united-kingdom",
  "microsoft limited": "https://careers.microsoft.com/us/en/search-results?keywords=&location=United%20Kingdom",
  "apple (uk) limited": "https://jobs.apple.com/en-gb/search",
  "spotify ab": "https://www.lifeatspotify.com/jobs?l=london",
  "salesforce uk limited": "https://www.salesforce.com/uk/company/careers/",
  "adobe systems europe limited": "https://www.adobe.com/uk/careers.html",
  "oracle corporation uk limited": "https://www.oracle.com/uk/careers/",
  "sap (uk) limited": "https://www.sap.com/uk/about/careers.html",
  "servicenow uk limited": "https://www.servicenow.com/careers.html",
  "stripe payments uk ltd": "https://stripe.com/jobs/search?l=london",
  "revolut ltd": "https://www.revolut.com/careers/",
  "monzo bank limited": "https://monzo.com/careers/",
  "wise payments limited": "https://www.wise.jobs/",
  "gocardless ltd": "https://gocardless.com/careers/",
  "checkout.com": "https://www.checkout.com/careers",
  "starling bank limited": "https://www.starlingbank.com/careers/",
  "cleo ai ltd": "https://web.meetcleo.com/careers",
  "goldman sachs international": "https://www.goldmansachs.com/careers/find-a-job",
  "jp morgan chase bank na": "https://careers.jpmorgan.com/global/en/home",
  "barclays bank plc": "https://search.jobs.barclays/search-jobs",
  "hsbc bank plc": "https://www.hsbc.com/careers",
  "natwest group plc": "https://jobs.natwestgroup.com/",
  "lloyds banking group": "https://www.lloydsbankinggroup.com/careers.html",
  "ubs ag": "https://www.ubs.com/global/en/careers.html",
  "deutsche bank ag": "https://careers.db.com/explore-the-bank/careers-in-the-uk/",
  "morgan stanley": "https://www.morganstanley.com/careers",
  "deloitte llp": "https://www2.deloitte.com/uk/en/careers/search.html",
  "pricewaterhousecoopers llp": "https://www.pwc.co.uk/careers.html",
  "ernst & young llp": "https://www.ey.com/en_uk/careers",
  "kpmg llp": "https://www.kpmgcareers.co.uk/",
  "mckinsey & company inc": "https://www.mckinsey.com/careers/search-jobs",
  "boston consulting group uk llp": "https://careers.bcg.com/",
  "bain & company": "https://www.bain.com/careers/",
  "capgemini uk plc": "https://www.capgemini.com/gb-en/careers/",
  "accenture (uk) limited": "https://www.accenture.com/gb-en/careers",
  "nhs england": "https://www.jobs.nhs.uk/",
  "glaxosmithkline plc": "https://www.gsk.com/en-gb/careers/",
  "astrazeneca uk limited": "https://careers.astrazeneca.com/",
  "vitality corporate services limited": "https://careers.vitality.co.uk/",
  "aviva plc": "https://www.aviva.co.uk/careers/",
  "asos.com limited": "https://www.asoscareers.com/",
  "farfetch uk limited": "https://www.farfetchcareers.com/",
  "dyson technology limited": "https://careers.dyson.com/",
  "unilever uk limited": "https://careers.unilever.com/",
  "easyjet airline company limited": "https://careers.easyjet.com/",
  "british airways plc": "https://careers.ba.com/",
  "booking.com bv": "https://careers.booking.com/",
  "trainline plc": "https://www.thetrainline.com/careers",
  "bbc": "https://careerssearch.bbc.co.uk/",
  "netflix services uk limited": "https://jobs.netflix.com/search?location=United%20Kingdom",
  "sky uk limited": "https://careers.sky.com/",
  "bt group plc": "https://www.bt.com/careers",
  "vodafone limited": "https://careers.vodafone.com/",
  "shell uk limited": "https://www.shell.co.uk/careers.html",
  "bp plc": "https://www.bp.com/en/global/corporate/careers.html",
  "octopus energy group ltd": "https://octopus.energy/careers/",
  "auto trader group plc": "https://careers.autotrader.co.uk/",
  "deliveroo plc": "https://careers.deliveroo.co.uk/",
  "canva pty ltd": "https://www.canva.com/careers/",
  "figma uk ltd": "https://www.figma.com/careers/",
  "notion labs inc": "https://www.notion.so/careers",
  "miro": "https://miro.com/careers/",
  "atlassian pty ltd": "https://www.atlassian.com/company/careers",
  "deepmind technologies": "https://deepmind.google/about/careers/",
  "palantir technologies uk": "https://www.palantir.com/careers/",
  "rightmove plc": "https://www.rightmove.co.uk/careers.html",
  "skyscanner ltd": "https://www.skyscanner.net/jobs",
  "uber london limited": "https://www.uber.com/gb/en/careers/",
  "bumble inc": "https://bumble.com/en/careers",
  "government digital service": "https://www.civilservicejobs.service.gov.uk/",
  "transport for london": "https://tfl.gov.uk/corporate/careers/",
  "gymshark limited": "https://careers.gymshark.com/",
  "charlotte tilbury beauty ltd": "https://www.charlottetilbury.com/uk/careers",
  "thought machine group limited": "https://thoughtmachine.net/careers",
  "tide platform limited": "https://www.tide.co/careers/",
  "darktrace plc": "https://darktrace.com/careers",
  "snyk limited": "https://snyk.io/careers/",
  "blackrock": "https://careers.blackrock.com/",
  "fidelity international": "https://www.fidelityinternational.com/careers/",
  "ocado group plc": "https://careers.ocadogroup.com/",
  "expedia group": "https://lifeatexpediagroup.com/jobs",
  "diageo plc": "https://www.diageo.com/en/careers",
  "jaguar land rover ltd": "https://www.jaguarlandrovercareers.com/",
  "national grid plc": "https://careers.nationalgrid.com/",
  "admiral group plc": "https://admiraljobs.co.uk/",
  "zurich insurance plc": "https://www.zurich.co.uk/careers",
  "legal & general group plc": "https://www.legalandgeneralgroup.com/careers/",
  "co-op": "https://jobs.coop.co.uk/",
  "matillion limited": "https://www.matillion.com/careers",
  "multiverse group limited": "https://www.multiverse.io/en-GB/careers",
};

// ─── REGION MAPPING ─────────────────────────────────────────────────────────
// Maps cities/counties from the CSV to broad UK regions
const REGION_MAP = {
  "london": "London",
  "westminster": "London",
  "city of london": "London",
  "islington": "London",
  "camden": "London",
  "hackney": "London",
  "tower hamlets": "London",
  "southwark": "London",
  "lambeth": "London",
  "brentford": "London",
  "isleworth": "London",
  "feltham": "London",
  "harmondsworth": "London",
  "manchester": "North West",
  "salford": "North West",
  "bolton": "North West",
  "liverpool": "North West",
  "chester": "North West",
  "warrington": "North West",
  "preston": "North West",
  "edinburgh": "Scotland",
  "glasgow": "Scotland",
  "aberdeen": "Scotland",
  "dundee": "Scotland",
  "leeds": "Yorkshire",
  "sheffield": "Yorkshire",
  "york": "Yorkshire",
  "bradford": "Yorkshire",
  "hull": "Yorkshire",
  "birmingham": "West Midlands",
  "coventry": "West Midlands",
  "solihull": "West Midlands",
  "wolverhampton": "West Midlands",
  "stoke-on-trent": "West Midlands",
  "bristol": "South West",
  "bath": "South West",
  "exeter": "South West",
  "bournemouth": "South West",
  "swindon": "South West",
  "malmesbury": "South West",
  "plymouth": "South West",
  "cambridge": "East",
  "norwich": "East",
  "ipswich": "East",
  "hatfield": "East",
  "welwyn garden city": "East",
  "luton": "East",
  "reading": "South East",
  "oxford": "South East",
  "guildford": "South East",
  "brighton": "South East",
  "newbury": "South East",
  "abingdon": "South East",
  "tadworth": "South East",
  "cardiff": "Wales",
  "swansea": "Wales",
  "newport": "Wales",
  "newcastle upon tyne": "North East",
  "sunderland": "North East",
  "durham": "North East",
  "middlesbrough": "North East",
  "nottingham": "East Midlands",
  "leicester": "East Midlands",
  "derby": "East Midlands",
  "northampton": "East Midlands",
  "belfast": "Northern Ireland",
};

function getRegion(city, county) {
  const cityLower = (city || '').toLowerCase().trim();
  const countyLower = (county || '').toLowerCase().trim();
  
  if (REGION_MAP[cityLower]) return REGION_MAP[cityLower];
  
  // Check county-based fallbacks
  if (countyLower.includes('london') || countyLower.includes('greater london')) return 'London';
  if (countyLower.includes('manchester') || countyLower.includes('lancashire') || countyLower.includes('merseyside') || countyLower.includes('cheshire')) return 'North West';
  if (countyLower.includes('yorkshire') || countyLower.includes('humberside')) return 'Yorkshire';
  if (countyLower.includes('west midlands') || countyLower.includes('warwickshire') || countyLower.includes('staffordshire')) return 'West Midlands';
  if (countyLower.includes('east midlands') || countyLower.includes('nottinghamshire') || countyLower.includes('leicestershire') || countyLower.includes('derbyshire')) return 'East Midlands';
  if (countyLower.includes('devon') || countyLower.includes('somerset') || countyLower.includes('dorset') || countyLower.includes('gloucestershire') || countyLower.includes('wiltshire') || countyLower.includes('cornwall') || countyLower.includes('avon')) return 'South West';
  if (countyLower.includes('surrey') || countyLower.includes('kent') || countyLower.includes('sussex') || countyLower.includes('hampshire') || countyLower.includes('berkshire') || countyLower.includes('oxfordshire') || countyLower.includes('buckinghamshire')) return 'South East';
  if (countyLower.includes('cambridgeshire') || countyLower.includes('norfolk') || countyLower.includes('suffolk') || countyLower.includes('essex') || countyLower.includes('hertfordshire') || countyLower.includes('bedfordshire')) return 'East';
  if (countyLower.includes('tyne') || countyLower.includes('northumberland') || countyLower.includes('durham')) return 'North East';
  if (countyLower.includes('wales') || countyLower.includes('glamorgan') || countyLower.includes('gwent') || countyLower.includes('dyfed') || countyLower.includes('powys')) return 'Wales';
  if (countyLower.includes('scotland') || countyLower.includes('lothian') || countyLower.includes('fife') || countyLower.includes('highlands')) return 'Scotland';
  if (countyLower.includes('antrim') || countyLower.includes('belfast') || countyLower.includes('northern ireland')) return 'Northern Ireland';
  
  return 'Other';
}

function getCareersUrl(companyName) {
  const key = companyName.toLowerCase().trim();
  if (CAREERS_URLS[key]) return CAREERS_URLS[key];
  
  // Fallback: Google search for their careers page
  const searchName = encodeURIComponent(companyName + ' careers jobs UK');
  return `https://www.google.com/search?q=${searchName}`;
}

// Simple CSV parser that handles quoted fields
function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  let row = [];
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
      row.push(current.trim());
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
      current = '';
      if (char === '\r') i++; // skip \n in \r\n
    } else {
      current += char;
    }
  }
  
  // Last row
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell !== '')) rows.push(row);
  }
  
  return rows;
}

async function main() {
  console.log('🔍 Step 1: Finding the latest CSV URL from gov.uk...\n');

  // Fetch the gov.uk page to extract the CSV link
  const pageRes = await fetch('https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers');
  const pageHtml = await pageRes.text();

  // Extract CSV URL from the page
  const csvMatch = pageHtml.match(/https:\/\/assets\.publishing\.service\.gov\.uk\/media\/[^"]+\.csv/);
  if (!csvMatch) {
    console.error('❌ Could not find CSV download URL on the gov.uk page.');
    console.error('   The page structure may have changed. Check manually:');
    console.error('   https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers');
    process.exit(1);
  }

  const csvUrl = csvMatch[0];
  console.log(`📥 Step 2: Downloading CSV from:\n   ${csvUrl}\n`);

  const csvRes = await fetch(csvUrl);
  const csvText = await csvRes.text();

  console.log(`📊 Step 3: Parsing CSV (${(csvText.length / 1024 / 1024).toFixed(1)}MB)...\n`);

  const rows = parseCSV(csvText);
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const data = rows.slice(1);

  // Find column indices
  const nameIdx = headers.findIndex(h => h.includes('organisation name') || h.includes('organisation'));
  const cityIdx = headers.findIndex(h => h.includes('town') || h.includes('city'));
  const countyIdx = headers.findIndex(h => h.includes('county'));
  const routeIdx = headers.findIndex(h => h.includes('route') || h.includes('type & rating'));
  const ratingIdx = headers.findIndex(h => h.includes('rating'));

  // Some CSV versions combine route and rating in one column like "Skilled Worker (A rating)"
  // Handle both formats
  const isCombinedFormat = routeIdx !== -1 && ratingIdx === -1;

  console.log(`   Found ${data.length} total rows`);
  console.log(`   Column mapping: name=${nameIdx}, city=${cityIdx}, county=${countyIdx}, route=${routeIdx}, rating=${ratingIdx}`);
  console.log(`   Format: ${isCombinedFormat ? 'Combined (route + rating)' : 'Separate columns'}\n`);

  // Filter for Skilled Worker + A-rated
  const filtered = data.filter(row => {
    if (!row[nameIdx]) return false;

    const routeVal = (row[routeIdx] || '').toLowerCase();
    
    if (isCombinedFormat) {
      // Combined format: "Skilled Worker" in route column
      return routeVal.includes('skilled worker');
    } else {
      // Separate format: check route AND rating
      const ratingVal = (row[ratingIdx] || '').toUpperCase().trim();
      return routeVal.includes('skilled worker') && ratingVal === 'A';
    }
  });

  console.log(`✅ Step 4: Filtered to ${filtered.length} A-rated Skilled Worker sponsors\n`);

  // Build sponsor objects
  const sponsors = filtered.map(row => ({
    name: row[nameIdx]?.trim() || '',
    city: row[cityIdx]?.trim() || '',
    region: getRegion(row[cityIdx], row[countyIdx]),
    careersUrl: getCareersUrl(row[nameIdx]),
  }));

  // Deduplicate by name (some appear multiple times for different sub-routes)
  const seen = new Set();
  const unique = sponsors.filter(s => {
    const key = s.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort alphabetically
  unique.sort((a, b) => a.name.localeCompare(b.name));

  console.log(`📝 Step 5: Writing ${unique.length} unique sponsors to sponsors.js...\n`);

  // Generate the file content
  const today = new Date().toISOString().split('T')[0];
  const fileContent = `/*
  UK SKILLED WORKER VISA — SPONSOR DATABASE
  
  AUTO-GENERATED on ${today}
  Source: Home Office Register of Licensed Sponsors (Worker)
  ${csvUrl}
  
  To regenerate: node scripts/update-sponsors.mjs
  To add careers URLs: edit the CAREERS_URLS lookup in scripts/update-sponsors.mjs
*/

const sponsors = ${JSON.stringify(unique, null, 2)};

export const INDUSTRIES = [...new Set(sponsors.map(s => s.industry).filter(Boolean))].sort();
export const REGIONS = [...new Set(sponsors.map(s => s.region))].sort();

export default sponsors;
`;

  const outputPath = join(__dirname, '..', 'src', 'data', 'sponsors.js');
  writeFileSync(outputPath, fileContent, 'utf-8');

  console.log(`✅ Done! Updated src/data/sponsors.js`);
  console.log(`   ${unique.length} sponsors written`);
  console.log(`   ${Object.keys(CAREERS_URLS).length} have known careers URLs`);
  console.log(`   ${unique.length - Object.keys(CAREERS_URLS).length} use Google search fallback`);
  console.log(`\n💡 To add more careers URLs, edit CAREERS_URLS in scripts/update-sponsors.mjs`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

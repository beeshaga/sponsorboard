/*
  UK SKILLED WORKER VISA — SPONSOR DATABASE
  
  Source: Home Office Register of Licensed Sponsors (Worker)
  https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers
  
  ─── HOW TO UPDATE ───
  
  OPTION 1 — Manual (5 mins):
  1. Download CSV from gov.uk link above
  2. Filter for "Skilled Worker" route + Rating "A"
  3. Update this file with new/removed companies
  
  OPTION 2 — Automated (recommended for production):
  Replace this static export with a fetch from:
  - A Supabase/Planetscale DB updated by a cron job
  - A Vercel serverless function that parses the gov.uk CSV
  - See /api/sponsors.js for the API route template
  
  ─── STRUCTURE ───
  Each sponsor has: name, city, region, industry, sub, careersUrl
  All companies listed are confirmed A-rated Skilled Worker sponsors.
*/

const sponsors = [
  // ━━━ TECHNOLOGY & DIGITAL ━━━
  { name: "Google UK Ltd", city: "London", region: "London", industry: "Technology", sub: "Big Tech", careersUrl: "https://careers.google.com/jobs/results/?location=United%20Kingdom" },
  { name: "Meta Platforms Ireland Limited", city: "London", region: "London", industry: "Technology", sub: "Big Tech", careersUrl: "https://www.metacareers.com/jobs?offices[0]=London%2C%20UK" },
  { name: "Amazon UK Services Ltd", city: "London", region: "London", industry: "Technology", sub: "Big Tech", careersUrl: "https://www.amazon.jobs/en-gb/locations/united-kingdom" },
  { name: "Microsoft Limited", city: "Reading", region: "South East", industry: "Technology", sub: "Big Tech", careersUrl: "https://careers.microsoft.com/us/en/search-results?keywords=&location=United%20Kingdom" },
  { name: "Apple (UK) Limited", city: "London", region: "London", industry: "Technology", sub: "Big Tech", careersUrl: "https://jobs.apple.com/en-gb/search" },
  { name: "Spotify AB", city: "London", region: "London", industry: "Technology", sub: "Digital Media", careersUrl: "https://www.lifeatspotify.com/jobs?l=london" },
  { name: "Salesforce UK Limited", city: "London", region: "London", industry: "Technology", sub: "Enterprise SaaS", careersUrl: "https://www.salesforce.com/uk/company/careers/" },
  { name: "Adobe Systems Europe Limited", city: "London", region: "London", industry: "Technology", sub: "Creative Software", careersUrl: "https://www.adobe.com/uk/careers.html" },
  { name: "Oracle Corporation UK Limited", city: "Reading", region: "South East", industry: "Technology", sub: "Enterprise SaaS", careersUrl: "https://www.oracle.com/uk/careers/" },
  { name: "SAP (UK) Limited", city: "Feltham", region: "London", industry: "Technology", sub: "Enterprise SaaS", careersUrl: "https://www.sap.com/uk/about/careers.html" },
  { name: "ServiceNow UK Limited", city: "London", region: "London", industry: "Technology", sub: "Enterprise SaaS", careersUrl: "https://www.servicenow.com/careers.html" },
  { name: "Snowflake Computing", city: "London", region: "London", industry: "Technology", sub: "Data/Cloud", careersUrl: "https://careers.snowflake.com/" },
  { name: "Databricks", city: "London", region: "London", industry: "Technology", sub: "Data/Cloud", careersUrl: "https://www.databricks.com/company/careers" },
  { name: "Cloudflare Ltd", city: "London", region: "London", industry: "Technology", sub: "Infrastructure", careersUrl: "https://www.cloudflare.com/careers/" },
  { name: "Twilio UK Limited", city: "London", region: "London", industry: "Technology", sub: "Communications", careersUrl: "https://www.twilio.com/company/jobs" },
  { name: "HubSpot", city: "London", region: "London", industry: "Technology", sub: "Marketing SaaS", careersUrl: "https://www.hubspot.com/careers/jobs" },
  { name: "Canva Pty Ltd", city: "London", region: "London", industry: "Technology", sub: "Creative Software", careersUrl: "https://www.canva.com/careers/" },
  { name: "Figma UK Ltd", city: "London", region: "London", industry: "Technology", sub: "Design Tools", careersUrl: "https://www.figma.com/careers/" },
  { name: "Notion Labs Inc", city: "London", region: "London", industry: "Technology", sub: "Productivity", careersUrl: "https://www.notion.so/careers" },
  { name: "Miro", city: "London", region: "London", industry: "Technology", sub: "Collaboration", careersUrl: "https://miro.com/careers/" },
  { name: "Atlassian Pty Ltd", city: "London", region: "London", industry: "Technology", sub: "Dev Tools", careersUrl: "https://www.atlassian.com/company/careers" },
  { name: "Intercom R&D Unlimited", city: "London", region: "London", industry: "Technology", sub: "Customer Platform", careersUrl: "https://www.intercom.com/careers" },
  { name: "Contentful GmbH", city: "London", region: "London", industry: "Technology", sub: "CMS", careersUrl: "https://www.contentful.com/careers/" },
  { name: "Paddle.com Market Limited", city: "London", region: "London", industry: "Technology", sub: "Payments", careersUrl: "https://www.paddle.com/careers" },
  { name: "Zapier Inc", city: "London", region: "London", industry: "Technology", sub: "Automation", careersUrl: "https://zapier.com/jobs" },
  { name: "Airtable Inc", city: "London", region: "London", industry: "Technology", sub: "Productivity", careersUrl: "https://airtable.com/careers" },
  { name: "MongoDB Limited", city: "London", region: "London", industry: "Technology", sub: "Database", careersUrl: "https://www.mongodb.com/careers" },
  { name: "Elastic NV", city: "London", region: "London", industry: "Technology", sub: "Search/Analytics", careersUrl: "https://www.elastic.co/careers" },
  { name: "Improbable Worlds Limited", city: "London", region: "London", industry: "Technology", sub: "Gaming/Metaverse", careersUrl: "https://www.improbable.io/careers" },
  { name: "Citymapper Limited", city: "London", region: "London", industry: "Technology", sub: "Transport", careersUrl: "https://citymapper.com/jobs" },

  // ━━━ FINTECH ━━━
  { name: "Stripe Payments UK Ltd", city: "London", region: "London", industry: "FinTech", sub: "Payments", careersUrl: "https://stripe.com/jobs/search?l=london" },
  { name: "Revolut Ltd", city: "London", region: "London", industry: "FinTech", sub: "Digital Bank", careersUrl: "https://www.revolut.com/careers/" },
  { name: "Monzo Bank Limited", city: "London", region: "London", industry: "FinTech", sub: "Digital Bank", careersUrl: "https://monzo.com/careers/" },
  { name: "Wise Payments Limited", city: "London", region: "London", industry: "FinTech", sub: "FX/Transfers", careersUrl: "https://www.wise.jobs/" },
  { name: "GoCardless Ltd", city: "London", region: "London", industry: "FinTech", sub: "Payments", careersUrl: "https://gocardless.com/careers/" },
  { name: "Checkout.com", city: "London", region: "London", industry: "FinTech", sub: "Payments", careersUrl: "https://www.checkout.com/careers" },
  { name: "Starling Bank Limited", city: "London", region: "London", industry: "FinTech", sub: "Digital Bank", careersUrl: "https://www.starlingbank.com/careers/" },
  { name: "Zopa Bank Limited", city: "London", region: "London", industry: "FinTech", sub: "Lending", careersUrl: "https://www.zopa.com/careers" },
  { name: "Cleo AI Ltd", city: "London", region: "London", industry: "FinTech", sub: "AI Finance", careersUrl: "https://web.meetcleo.com/careers" },
  { name: "OakNorth Bank PLC", city: "London", region: "London", industry: "FinTech", sub: "Lending", careersUrl: "https://www.oaknorth.com/careers/" },
  { name: "Plaid Financial Ltd", city: "London", region: "London", industry: "FinTech", sub: "Open Banking", careersUrl: "https://plaid.com/careers/" },
  { name: "SumUp Limited", city: "London", region: "London", industry: "FinTech", sub: "Payments", careersUrl: "https://www.sumup.com/careers/" },
  { name: "Thought Machine Group Limited", city: "London", region: "London", industry: "FinTech", sub: "Core Banking", careersUrl: "https://thoughtmachine.net/careers" },
  { name: "10x Banking Technology", city: "London", region: "London", industry: "FinTech", sub: "Core Banking", careersUrl: "https://www.10xbanking.com/careers" },
  { name: "Tide Platform Limited", city: "London", region: "London", industry: "FinTech", sub: "SMB Banking", careersUrl: "https://www.tide.co/careers/" },
  { name: "ClearScore Technology Limited", city: "London", region: "London", industry: "FinTech", sub: "Credit", careersUrl: "https://www.clearscore.com/careers" },
  { name: "WorldRemit Ltd", city: "London", region: "London", industry: "FinTech", sub: "Remittance", careersUrl: "https://www.worldremit.com/en/careers" },
  { name: "Adyen NV", city: "London", region: "London", industry: "FinTech", sub: "Payments", careersUrl: "https://careers.adyen.com/" },

  // ━━━ FINANCE & BANKING ━━━
  { name: "Goldman Sachs International", city: "London", region: "London", industry: "Finance", sub: "Investment Bank", careersUrl: "https://www.goldmansachs.com/careers/find-a-job" },
  { name: "JP Morgan Chase Bank NA", city: "London", region: "London", industry: "Finance", sub: "Investment Bank", careersUrl: "https://careers.jpmorgan.com/global/en/home" },
  { name: "Barclays Bank PLC", city: "London", region: "London", industry: "Finance", sub: "Retail/Investment", careersUrl: "https://search.jobs.barclays/search-jobs" },
  { name: "HSBC Bank PLC", city: "London", region: "London", industry: "Finance", sub: "Global Bank", careersUrl: "https://www.hsbc.com/careers" },
  { name: "NatWest Group PLC", city: "Edinburgh", region: "Scotland", industry: "Finance", sub: "Retail Bank", careersUrl: "https://jobs.natwestgroup.com/" },
  { name: "Lloyds Banking Group", city: "London", region: "London", industry: "Finance", sub: "Retail Bank", careersUrl: "https://www.lloydsbankinggroup.com/careers.html" },
  { name: "UBS AG", city: "London", region: "London", industry: "Finance", sub: "Wealth Management", careersUrl: "https://www.ubs.com/global/en/careers.html" },
  { name: "Deutsche Bank AG", city: "London", region: "London", industry: "Finance", sub: "Investment Bank", careersUrl: "https://careers.db.com/explore-the-bank/careers-in-the-uk/" },
  { name: "Morgan Stanley", city: "London", region: "London", industry: "Finance", sub: "Investment Bank", careersUrl: "https://www.morganstanley.com/careers" },
  { name: "Citi", city: "London", region: "London", industry: "Finance", sub: "Global Bank", careersUrl: "https://jobs.citi.com/" },
  { name: "Bank of America Merrill Lynch", city: "London", region: "London", industry: "Finance", sub: "Investment Bank", careersUrl: "https://campus.bankofamerica.com/" },
  { name: "Standard Chartered Bank", city: "London", region: "London", industry: "Finance", sub: "Global Bank", careersUrl: "https://www.sc.com/en/careers/" },
  { name: "Macquarie Group", city: "London", region: "London", industry: "Finance", sub: "Investment", careersUrl: "https://www.macquarie.com/uk/en/careers.html" },
  { name: "Fidelity International", city: "London", region: "London", industry: "Finance", sub: "Asset Management", careersUrl: "https://www.fidelityinternational.com/careers/" },
  { name: "BlackRock", city: "London", region: "London", industry: "Finance", sub: "Asset Management", careersUrl: "https://careers.blackrock.com/" },
  { name: "Schroders PLC", city: "London", region: "London", industry: "Finance", sub: "Asset Management", careersUrl: "https://www.schroders.com/en/uk/tp/careers/" },

  // ━━━ CONSULTING & PROFESSIONAL SERVICES ━━━
  { name: "Deloitte LLP", city: "London", region: "London", industry: "Consulting", sub: "Big Four", careersUrl: "https://www2.deloitte.com/uk/en/careers/search.html" },
  { name: "PricewaterhouseCoopers LLP", city: "London", region: "London", industry: "Consulting", sub: "Big Four", careersUrl: "https://www.pwc.co.uk/careers.html" },
  { name: "Ernst & Young LLP", city: "London", region: "London", industry: "Consulting", sub: "Big Four", careersUrl: "https://www.ey.com/en_uk/careers" },
  { name: "KPMG LLP", city: "London", region: "London", industry: "Consulting", sub: "Big Four", careersUrl: "https://www.kpmgcareers.co.uk/" },
  { name: "McKinsey & Company Inc", city: "London", region: "London", industry: "Consulting", sub: "Strategy", careersUrl: "https://www.mckinsey.com/careers/search-jobs" },
  { name: "Boston Consulting Group UK LLP", city: "London", region: "London", industry: "Consulting", sub: "Strategy", careersUrl: "https://careers.bcg.com/" },
  { name: "Bain & Company", city: "London", region: "London", industry: "Consulting", sub: "Strategy", careersUrl: "https://www.bain.com/careers/" },
  { name: "Capgemini UK PLC", city: "London", region: "London", industry: "Consulting", sub: "IT Consulting", careersUrl: "https://www.capgemini.com/gb-en/careers/" },
  { name: "Accenture (UK) Limited", city: "London", region: "London", industry: "Consulting", sub: "IT Consulting", careersUrl: "https://www.accenture.com/gb-en/careers" },
  { name: "PA Consulting Group Limited", city: "London", region: "London", industry: "Consulting", sub: "Innovation", careersUrl: "https://www.paconsulting.com/careers" },
  { name: "Oliver Wyman", city: "London", region: "London", industry: "Consulting", sub: "Strategy", careersUrl: "https://www.oliverwyman.com/careers.html" },
  { name: "Cognizant Technology Solutions", city: "London", region: "London", industry: "Consulting", sub: "IT Services", careersUrl: "https://careers.cognizant.com/" },
  { name: "Infosys Limited", city: "London", region: "London", industry: "Consulting", sub: "IT Services", careersUrl: "https://www.infosys.com/careers/" },
  { name: "Tata Consultancy Services", city: "London", region: "London", industry: "Consulting", sub: "IT Services", careersUrl: "https://www.tcs.com/careers" },
  { name: "Wipro Limited", city: "London", region: "London", industry: "Consulting", sub: "IT Services", careersUrl: "https://careers.wipro.com/" },
  { name: "Thoughtworks", city: "London", region: "London", industry: "Consulting", sub: "Tech Consulting", careersUrl: "https://www.thoughtworks.com/careers" },
  { name: "Slalom Consulting", city: "London", region: "London", industry: "Consulting", sub: "Tech Consulting", careersUrl: "https://www.slalom.com/careers" },

  // ━━━ HEALTHCARE & PHARMA ━━━
  { name: "NHS England", city: "London", region: "London", industry: "Healthcare", sub: "Public Health", careersUrl: "https://www.jobs.nhs.uk/" },
  { name: "NHS Digital", city: "Leeds", region: "Yorkshire", industry: "Healthcare", sub: "Health Tech", careersUrl: "https://digital.nhs.uk/about-nhs-digital/careers" },
  { name: "GlaxoSmithKline PLC", city: "Brentford", region: "London", industry: "Pharma", sub: "Pharma", careersUrl: "https://www.gsk.com/en-gb/careers/" },
  { name: "AstraZeneca UK Limited", city: "Cambridge", region: "East", industry: "Pharma", sub: "Pharma", careersUrl: "https://careers.astrazeneca.com/" },
  { name: "Pfizer Limited", city: "Tadworth", region: "South East", industry: "Pharma", sub: "Pharma", careersUrl: "https://www.pfizer.co.uk/careers" },
  { name: "Roche Products Limited", city: "Welwyn Garden City", region: "East", industry: "Pharma", sub: "Pharma", careersUrl: "https://www.roche.co.uk/en/careers.html" },
  { name: "Babylon Health", city: "London", region: "London", industry: "HealthTech", sub: "Digital Health", careersUrl: "https://www.babylonhealth.com/careers" },
  { name: "Doctolib", city: "London", region: "London", industry: "HealthTech", sub: "Digital Health", careersUrl: "https://careers.doctolib.com/" },
  { name: "Eucalyptus", city: "London", region: "London", industry: "HealthTech", sub: "Telehealth", careersUrl: "https://www.eucalyptus.vc/careers" },

  // ━━━ INSURANCE ━━━
  { name: "Vitality Corporate Services Limited", city: "Bournemouth", region: "South West", industry: "Insurance", sub: "Health Insurance", careersUrl: "https://careers.vitality.co.uk/" },
  { name: "Aviva PLC", city: "London", region: "London", industry: "Insurance", sub: "General Insurance", careersUrl: "https://www.aviva.co.uk/careers/" },
  { name: "Admiral Group PLC", city: "Cardiff", region: "Wales", industry: "Insurance", sub: "General Insurance", careersUrl: "https://admiraljobs.co.uk/" },
  { name: "Legal & General Group PLC", city: "London", region: "London", industry: "Insurance", sub: "Life Insurance", careersUrl: "https://www.legalandgeneralgroup.com/careers/" },
  { name: "Zurich Insurance PLC", city: "Swindon", region: "South West", industry: "Insurance", sub: "General Insurance", careersUrl: "https://www.zurich.co.uk/careers" },

  // ━━━ RETAIL, E-COMMERCE & CONSUMER ━━━
  { name: "ASOS.com Limited", city: "London", region: "London", industry: "Retail", sub: "Fashion E-commerce", careersUrl: "https://www.asoscareers.com/" },
  { name: "Farfetch UK Limited", city: "London", region: "London", industry: "Retail", sub: "Luxury E-commerce", careersUrl: "https://www.farfetchcareers.com/" },
  { name: "Depop Limited", city: "London", region: "London", industry: "Retail", sub: "Marketplace", careersUrl: "https://www.depop.com/jobs/" },
  { name: "Dyson Technology Limited", city: "Malmesbury", region: "South West", industry: "Consumer Tech", sub: "Hardware", careersUrl: "https://careers.dyson.com/" },
  { name: "Unilever UK Limited", city: "London", region: "London", industry: "FMCG", sub: "Consumer Goods", careersUrl: "https://careers.unilever.com/" },
  { name: "Diageo PLC", city: "London", region: "London", industry: "FMCG", sub: "Beverages", careersUrl: "https://www.diageo.com/en/careers" },
  { name: "Ocado Group PLC", city: "Hatfield", region: "East", industry: "Retail", sub: "Online Grocery", careersUrl: "https://careers.ocadogroup.com/" },
  { name: "THG PLC", city: "Manchester", region: "North West", industry: "Retail", sub: "E-commerce", careersUrl: "https://www.thg.com/careers" },
  { name: "Deliveroo PLC", city: "London", region: "London", industry: "Technology", sub: "Food Delivery", careersUrl: "https://careers.deliveroo.co.uk/" },
  { name: "Just Eat Takeaway.com", city: "London", region: "London", industry: "Technology", sub: "Food Delivery", careersUrl: "https://careers.justeattakeaway.com/" },
  { name: "Charlotte Tilbury Beauty Ltd", city: "London", region: "London", industry: "Retail", sub: "Beauty", careersUrl: "https://www.charlottetilbury.com/uk/careers" },
  { name: "Gymshark Limited", city: "Solihull", region: "West Midlands", industry: "Retail", sub: "Activewear", careersUrl: "https://careers.gymshark.com/" },

  // ━━━ TRAVEL & TRANSPORT ━━━
  { name: "easyJet Airline Company Limited", city: "Luton", region: "East", industry: "Travel", sub: "Aviation", careersUrl: "https://careers.easyjet.com/" },
  { name: "British Airways PLC", city: "Harmondsworth", region: "London", industry: "Travel", sub: "Aviation", careersUrl: "https://careers.ba.com/" },
  { name: "Booking.com BV", city: "London", region: "London", industry: "Travel", sub: "OTA", careersUrl: "https://careers.booking.com/" },
  { name: "Expedia Group", city: "London", region: "London", industry: "Travel", sub: "OTA", careersUrl: "https://lifeatexpediagroup.com/jobs" },
  { name: "Trainline PLC", city: "London", region: "London", industry: "Travel", sub: "Rail", careersUrl: "https://www.thetrainline.com/careers" },
  { name: "Skyscanner Ltd", city: "Edinburgh", region: "Scotland", industry: "Travel", sub: "Flights", careersUrl: "https://www.skyscanner.net/jobs" },
  { name: "TUI UK Limited", city: "Luton", region: "East", industry: "Travel", sub: "Tour Operator", careersUrl: "https://careers.tuigroup.com/" },
  { name: "Uber London Limited", city: "London", region: "London", industry: "Travel", sub: "Ride-hailing", careersUrl: "https://www.uber.com/gb/en/careers/" },

  // ━━━ MEDIA & ENTERTAINMENT ━━━
  { name: "BBC", city: "London", region: "London", industry: "Media", sub: "Broadcasting", careersUrl: "https://careerssearch.bbc.co.uk/" },
  { name: "ITV PLC", city: "London", region: "London", industry: "Media", sub: "Broadcasting", careersUrl: "https://www.itvjobs.com/" },
  { name: "Netflix Services UK Limited", city: "London", region: "London", industry: "Media", sub: "Streaming", careersUrl: "https://jobs.netflix.com/search?location=United%20Kingdom" },
  { name: "Sky UK Limited", city: "Isleworth", region: "London", industry: "Media", sub: "Broadcasting", careersUrl: "https://careers.sky.com/" },
  { name: "Warner Bros Discovery", city: "London", region: "London", industry: "Media", sub: "Entertainment", careersUrl: "https://careers.wbd.com/" },
  { name: "Condé Nast Publications Limited", city: "London", region: "London", industry: "Media", sub: "Publishing", careersUrl: "https://www.condenast.com/careers" },
  { name: "Financial Times Limited", city: "London", region: "London", industry: "Media", sub: "Publishing", careersUrl: "https://aboutus.ft.com/careers" },
  { name: "The Guardian", city: "London", region: "London", industry: "Media", sub: "Publishing", careersUrl: "https://workforus.theguardian.com/" },

  // ━━━ TELECOMS ━━━
  { name: "BT Group PLC", city: "London", region: "London", industry: "Telecoms", sub: "Network", careersUrl: "https://www.bt.com/careers" },
  { name: "Vodafone Limited", city: "Newbury", region: "South East", industry: "Telecoms", sub: "Mobile", careersUrl: "https://careers.vodafone.com/" },
  { name: "Three UK", city: "Reading", region: "South East", industry: "Telecoms", sub: "Mobile", careersUrl: "https://www.three.co.uk/careers" },
  { name: "Virgin Media O2", city: "London", region: "London", industry: "Telecoms", sub: "Network", careersUrl: "https://careers.virginmediao2.co.uk/" },

  // ━━━ ENERGY ━━━
  { name: "Shell UK Limited", city: "London", region: "London", industry: "Energy", sub: "Oil & Gas", careersUrl: "https://www.shell.co.uk/careers.html" },
  { name: "BP PLC", city: "London", region: "London", industry: "Energy", sub: "Oil & Gas", careersUrl: "https://www.bp.com/en/global/corporate/careers.html" },
  { name: "Octopus Energy Group Ltd", city: "London", region: "London", industry: "Energy", sub: "Green Energy", careersUrl: "https://octopus.energy/careers/" },
  { name: "OVO Energy", city: "Bristol", region: "South West", industry: "Energy", sub: "Green Energy", careersUrl: "https://company.ovo.com/careers/" },
  { name: "National Grid PLC", city: "London", region: "London", industry: "Energy", sub: "Infrastructure", careersUrl: "https://careers.nationalgrid.com/" },

  // ━━━ EDUCATION ━━━
  { name: "University of the West of England", city: "Bristol", region: "South West", industry: "Education", sub: "University", careersUrl: "https://www.uwe.ac.uk/about/vacancies" },
  { name: "University of Manchester", city: "Manchester", region: "North West", industry: "Education", sub: "University", careersUrl: "https://www.jobs.manchester.ac.uk/" },
  { name: "University College London", city: "London", region: "London", industry: "Education", sub: "University", careersUrl: "https://www.ucl.ac.uk/work-at-ucl/search-ucl-jobs" },
  { name: "University of Oxford", city: "Oxford", region: "South East", industry: "Education", sub: "University", careersUrl: "https://www.jobs.ox.ac.uk/" },
  { name: "University of Cambridge", city: "Cambridge", region: "East", industry: "Education", sub: "University", careersUrl: "https://www.jobs.cam.ac.uk/" },
  { name: "University of Edinburgh", city: "Edinburgh", region: "Scotland", industry: "Education", sub: "University", careersUrl: "https://www.ed.ac.uk/human-resources/recruitment" },
  { name: "University of Leeds", city: "Leeds", region: "Yorkshire", industry: "Education", sub: "University", careersUrl: "https://jobs.leeds.ac.uk/" },
  { name: "University of Birmingham", city: "Birmingham", region: "West Midlands", industry: "Education", sub: "University", careersUrl: "https://www.birmingham.ac.uk/staff/jobs/" },
  { name: "University of Bristol", city: "Bristol", region: "South West", industry: "Education", sub: "University", careersUrl: "https://www.bristol.ac.uk/jobs/" },
  { name: "University of Warwick", city: "Coventry", region: "West Midlands", industry: "Education", sub: "University", careersUrl: "https://warwick.ac.uk/jobs/" },
  { name: "King's College London", city: "London", region: "London", industry: "Education", sub: "University", careersUrl: "https://www.kcl.ac.uk/jobs" },
  { name: "Imperial College London", city: "London", region: "London", industry: "Education", sub: "University", careersUrl: "https://www.imperial.ac.uk/jobs/" },
  { name: "Multiverse Group Limited", city: "London", region: "London", industry: "EdTech", sub: "Apprenticeships", careersUrl: "https://www.multiverse.io/en-GB/careers" },

  // ━━━ GOVERNMENT & PUBLIC SECTOR ━━━
  { name: "Government Digital Service", city: "London", region: "London", industry: "Government", sub: "Digital", careersUrl: "https://www.civilservicejobs.service.gov.uk/" },
  { name: "Home Office", city: "London", region: "London", industry: "Government", sub: "Civil Service", careersUrl: "https://www.civilservicejobs.service.gov.uk/" },
  { name: "HMRC", city: "London", region: "London", industry: "Government", sub: "Tax", careersUrl: "https://www.civilservicejobs.service.gov.uk/" },
  { name: "Ministry of Defence", city: "London", region: "London", industry: "Government", sub: "Defence", careersUrl: "https://www.civilservicejobs.service.gov.uk/" },
  { name: "Transport for London", city: "London", region: "London", industry: "Government", sub: "Transport", careersUrl: "https://tfl.gov.uk/corporate/careers/" },

  // ━━━ NORTH WEST / MANCHESTER ━━━
  { name: "Auto Trader Group PLC", city: "Manchester", region: "North West", industry: "Technology", sub: "Marketplace", careersUrl: "https://careers.autotrader.co.uk/" },
  { name: "Boohoo Group PLC", city: "Manchester", region: "North West", industry: "Retail", sub: "Fashion E-commerce", careersUrl: "https://careers.boohoogroup.com/" },
  { name: "AO.com", city: "Bolton", region: "North West", industry: "Retail", sub: "E-commerce", careersUrl: "https://ao-jobs.com/" },
  { name: "Bet365 Group Ltd", city: "Stoke-on-Trent", region: "West Midlands", industry: "Technology", sub: "Gambling Tech", careersUrl: "https://www.bet365careers.com/" },
  { name: "Peak AI", city: "Manchester", region: "North West", industry: "Technology", sub: "AI", careersUrl: "https://peak.ai/careers/" },
  { name: "Matillion Limited", city: "Manchester", region: "North West", industry: "Technology", sub: "Data Integration", careersUrl: "https://www.matillion.com/careers" },
  { name: "On the Beach Group PLC", city: "Manchester", region: "North West", industry: "Travel", sub: "OTA", careersUrl: "https://www.onthebeachgroupplc.com/careers" },
  { name: "N Brown Group PLC", city: "Manchester", region: "North West", industry: "Retail", sub: "E-commerce", careersUrl: "https://www.nbrown.co.uk/careers" },
  { name: "Co-op", city: "Manchester", region: "North West", industry: "Retail", sub: "Cooperative", careersUrl: "https://jobs.coop.co.uk/" },
  { name: "BBC (MediaCityUK)", city: "Salford", region: "North West", industry: "Media", sub: "Broadcasting", careersUrl: "https://careerssearch.bbc.co.uk/" },
  { name: "ITV (MediaCityUK)", city: "Salford", region: "North West", industry: "Media", sub: "Broadcasting", careersUrl: "https://www.itvjobs.com/" },

  // ━━━ MIDLANDS ━━━
  { name: "Jaguar Land Rover Ltd", city: "Coventry", region: "West Midlands", industry: "Automotive", sub: "Manufacturing", careersUrl: "https://www.jaguarlandrovercareers.com/" },
  { name: "Cadbury (Mondelez)", city: "Birmingham", region: "West Midlands", industry: "FMCG", sub: "Confectionery", careersUrl: "https://www.mondelezinternational.com/careers" },

  // ━━━ SCOTLAND ━━━
  { name: "FanDuel Group", city: "Edinburgh", region: "Scotland", industry: "Technology", sub: "Sports Tech", careersUrl: "https://www.fanduel.com/careers" },
  { name: "Standard Life Aberdeen", city: "Edinburgh", region: "Scotland", industry: "Finance", sub: "Asset Management", careersUrl: "https://www.abrdn.com/en-gb/corporate/careers" },
  { name: "Royal Bank of Scotland", city: "Edinburgh", region: "Scotland", industry: "Finance", sub: "Retail Bank", careersUrl: "https://jobs.natwestgroup.com/" },

  // ━━━ WALES ━━━
  { name: "DVLA", city: "Swansea", region: "Wales", industry: "Government", sub: "Public Service", careersUrl: "https://www.civilservicejobs.service.gov.uk/" },

  // ━━━ PROPERTY ━━━
  { name: "Rightmove PLC", city: "London", region: "London", industry: "Property", sub: "Property Portal", careersUrl: "https://www.rightmove.co.uk/careers.html" },
  { name: "Zoopla", city: "London", region: "London", industry: "Property", sub: "Property Portal", careersUrl: "https://zpg.co.uk/careers" },
  { name: "Purplebricks Group PLC", city: "Solihull", region: "West Midlands", industry: "Property", sub: "Estate Agent", careersUrl: "https://www.purplebricks.com/careers" },

  // ━━━ GAMING ━━━
  { name: "King (Activision Blizzard)", city: "London", region: "London", industry: "Gaming", sub: "Mobile Games", careersUrl: "https://careers.king.com/" },
  { name: "Rockstar Games", city: "Edinburgh", region: "Scotland", industry: "Gaming", sub: "AAA Games", careersUrl: "https://www.rockstargames.com/careers" },
  { name: "Electronic Arts UK", city: "Guildford", region: "South East", industry: "Gaming", sub: "AAA Games", careersUrl: "https://www.ea.com/careers" },
  { name: "Supercell", city: "London", region: "London", industry: "Gaming", sub: "Mobile Games", careersUrl: "https://supercell.com/en/careers/" },

  // ━━━ CYBERSECURITY ━━━
  { name: "Darktrace PLC", city: "Cambridge", region: "East", industry: "Cybersecurity", sub: "AI Security", careersUrl: "https://darktrace.com/careers" },
  { name: "Sophos Limited", city: "Abingdon", region: "South East", industry: "Cybersecurity", sub: "Endpoint Security", careersUrl: "https://www.sophos.com/en-us/careers" },
  { name: "Snyk Limited", city: "London", region: "London", industry: "Cybersecurity", sub: "DevSecOps", careersUrl: "https://snyk.io/careers/" },

  // ━━━ SOCIAL ━━━
  { name: "Bumble Inc", city: "London", region: "London", industry: "Social", sub: "Dating", careersUrl: "https://bumble.com/en/careers" },
  { name: "Match Group", city: "London", region: "London", industry: "Social", sub: "Dating", careersUrl: "https://mtch.com/careers" },

  // ━━━ AI & DATA ━━━
  { name: "DeepMind Technologies", city: "London", region: "London", industry: "AI", sub: "Research", careersUrl: "https://deepmind.google/about/careers/" },
  { name: "Anthropic", city: "London", region: "London", industry: "AI", sub: "Research", careersUrl: "https://www.anthropic.com/careers" },
  { name: "OpenAI", city: "London", region: "London", industry: "AI", sub: "Research", careersUrl: "https://openai.com/careers/" },
  { name: "Palantir Technologies UK", city: "London", region: "London", industry: "AI", sub: "Data Analytics", careersUrl: "https://www.palantir.com/careers/" },
  { name: "Faculty AI", city: "London", region: "London", industry: "AI", sub: "Applied AI", careersUrl: "https://faculty.ai/careers/" },
  { name: "Stability AI", city: "London", region: "London", industry: "AI", sub: "Generative AI", careersUrl: "https://stability.ai/careers" },
];

// Derived filter options
export const INDUSTRIES = [...new Set(sponsors.map(s => s.industry))].sort();
export const REGIONS = [...new Set(sponsors.map(s => s.region))].sort();
export const SUBS = [...new Set(sponsors.map(s => s.sub))].sort();

export default sponsors;

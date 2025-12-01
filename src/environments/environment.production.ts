// Environment per produzione (Vercel)
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://dndcampaigntracker-alpha.vercel.app/api',
};

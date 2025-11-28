// Test API D&D Tracker Backend
// Apri questo file nella console del browser (F12) o usa Node.js con fetch

const API_URL = 'http://localhost:3000/api';

// Test 1: Health Check
async function testHealth() {
  const response = await fetch(`${API_URL}/health`);
  const data = await response.json();
  console.log('✅ Health Check:', data);
}

// Test 2: Get Campagne
async function getCampagne() {
  const response = await fetch(`${API_URL}/campagne`);
  const data = await response.json();
  console.log('📋 Campagne:', data);
  return data;
}

// Test 3: Crea Campagna
async function creaCampagna() {
  const response = await fetch(`${API_URL}/campagne`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Test Campagna',
      descrizione: 'Campagna di test via API',
      gmId: 1
    })
  });
  const data = await response.json();
  console.log('✨ Campagna creata:', data);
  return data;
}

// Test 4: Join Campagna
async function joinCampagna(campagnaId, userId) {
  const response = await fetch(`${API_URL}/campagne/${campagnaId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const data = await response.json();
  console.log('🎮 Join Campagna:', data);
  return data;
}

// Test 5: Get Personaggi
async function getPersonaggi(campagnaId) {
  const response = await fetch(`${API_URL}/personaggi?campagnaId=${campagnaId}`);
  const data = await response.json();
  console.log('👥 Personaggi:', data);
  return data;
}

// Test 6: Crea Personaggio
async function creaPersonaggio() {
  const response = await fetch(`${API_URL}/personaggi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Legolas',
      classe: 'Ranger',
      razza: 'Elfo',
      livello: 7,
      campagnaId: 1,
      userId: 2
    })
  });
  const data = await response.json();
  console.log('⚔️ Personaggio creato:', data);
  return data;
}

// Esegui tutti i test in sequenza
async function runAllTests() {
  console.log('🧪 Inizio test API...\n');
  
  await testHealth();
  await new Promise(r => setTimeout(r, 500));
  
  await getCampagne();
  await new Promise(r => setTimeout(r, 500));
  
  await creaCampagna();
  await new Promise(r => setTimeout(r, 500));
  
  await joinCampagna(1, 2);
  await new Promise(r => setTimeout(r, 500));
  
  await getPersonaggi(1);
  await new Promise(r => setTimeout(r, 500));
  
  await creaPersonaggio();
  
  console.log('\n✅ Test completati!');
}

// Esegui con: runAllTests()
console.log('🎲 API Test pronto! Esegui runAllTests() per iniziare.');

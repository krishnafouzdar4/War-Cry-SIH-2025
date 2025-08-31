/* =========================
   Safar Saathi — Frontend JS
   - Works offline (Leaflet map)
   - Use localStorage for demo auth/session
   - Replace API_BASE with your backend to persist data
   ========================= */

const API_BASE = '/api'; // <-- replace with your backend base URL when ready

/* ---------- Example places dataset (Kerala) ----------
   For each city key, include place name, lat, lng and image.
   You can expand/add more places as required.
*/
const PLACES = {
  "thiruvananthapuram": [
    {name:"Padmanabhaswamy Temple", lat:8.4877, lng:76.9483, img:"https://upload.wikimedia.org/wikipedia/commons/a/a0/Sree_Padmanabhaswamy_Temple.jpg"},
    {name:"Kovalam Beach", lat:8.4095, lng:76.9789, img:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Kovalam_Beach.jpg"},
    {name:"Napier Museum", lat:8.4880, lng:76.9486, img:"https://upload.wikimedia.org/wikipedia/commons/3/34/Napier_Museum.jpg"}
  ],
  "kochi": [
    {name:"Fort Kochi", lat:9.9667, lng:76.2400, img:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Fort_Kochi_beach.jpg"},
    {name:"Mattancherry Palace", lat:9.9660, lng:76.2490, img:"https://upload.wikimedia.org/wikipedia/commons/5/50/Mattancherry_Palace.jpg"},
    {name:"Marine Drive, Kochi", lat:9.9665, lng:76.2780, img:"https://upload.wikimedia.org/wikipedia/commons/e/e2/Marine_Drive_Kochi.jpg"}
  ],
  "munnar":[
    {name:"Munnar Tea Plantations", lat:10.0889, lng:77.0595, img:"https://upload.wikimedia.org/wikipedia/commons/5/50/Munnar_hillstation.jpg"},
    {name:"Eravikulam National Park", lat:10.0879, lng:77.0594, img:"https://upload.wikimedia.org/wikipedia/commons/9/9b/Eravikulam.jpg"},
    {name:"Attukal Waterfalls", lat:10.0792, lng:77.1178, img:"https://upload.wikimedia.org/wikipedia/commons/1/18/Attukad_Waterfalls.jpg"}
  ],
  "alappuzha":[
    {name:"Alleppey Backwaters", lat:9.4981, lng:76.3388, img:"https://upload.wikimedia.org/wikipedia/commons/3/3d/Alleppey_Houseboat.jpg"},
    {name:"Alappuzha Beach", lat:9.4907, lng:76.3210, img:"https://upload.wikimedia.org/wikipedia/commons/0/06/Alappuzha_Beach.jpg"},
    {name:"Krishnapuram Palace", lat:9.3010, lng:76.5900, img:"https://upload.wikimedia.org/wikipedia/commons/d/db/Krishnapuram_Palace.jpg"}
  ],
  "wayanad":[
    {name:"Edakkal Caves", lat:11.7093, lng:76.1231, img:"https://upload.wikimedia.org/wikipedia/commons/4/41/Edakkal_caves.jpg"},
    {name:"Banasura Sagar Dam", lat:11.6813, lng:76.0478, img:"https://upload.wikimedia.org/wikipedia/commons/8/85/Banasura_Sagar_Dam.jpg"},
    {name:"Chembra Peak", lat:11.4948, lng:76.0896, img:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Chembra_Peak.jpg"}
  ],
  "kozhikode":[
    {name:"Kozhikode Beach", lat:11.2565, lng:75.7804, img:"https://upload.wikimedia.org/wikipedia/commons/8/89/Kozhikode_Beach.jpg"},
    {name:"Mananchira Square", lat:11.2569, lng:75.7823, img:"https://upload.wikimedia.org/wikipedia/commons/a/a8/Mananchira_Square.jpg"},
    {name:"Beypore Port", lat:11.2268, lng:75.7797, img:"https://upload.wikimedia.org/wikipedia/commons/6/6e/Beypore_Port.jpg"}
  ],
  "kollam":[
    {name:"Ashtamudi Lake", lat:8.8932, lng:76.6041, img:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Ashtamudi_Lake.jpg"},
    {name:"Thangassery Lighthouse", lat:8.8784, lng:76.5770, img:"https://upload.wikimedia.org/wikipedia/commons/c/cd/Thangassery_Light_house.jpg"},
    {name:"Palaruvi Falls", lat:9.0719, lng:77.2087, img:"https://upload.wikimedia.org/wikipedia/commons/d/d5/Palaruvi_Waterfalls.jpg"}
  ],
  "kannur":[
    {name:"St. Angelo Fort", lat:11.8704, lng:75.3560, img:"https://upload.wikimedia.org/wikipedia/commons/3/36/St_Angelo_Fort.jpg"},
    {name:"Payyambalam Beach", lat:11.8725, lng:75.3678, img:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Payyambalam_Beach.jpg"},
    {name:"Parassinikkadavu Temple", lat:11.8735, lng:75.5217, img:"https://upload.wikimedia.org/wikipedia/commons/9/9f/Parassinikkadavu_temple.jpg"}
  ],
  "thrissur":[
    {name:"Vadakkunnathan Temple", lat:10.5167, lng:76.2144, img:"https://upload.wikimedia.org/wikipedia/commons/2/25/Vadakkunnathan_Temple.jpg"},
    {name:"Athirappilly Falls", lat:10.3056, lng:76.5056, img:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Athirappilly_waterfalls.jpg"}
  ],
  "palakkad":[
    {name:"Malampuzha Dam & Gardens", lat:10.7814, lng:76.6274, img:"https://upload.wikimedia.org/wikipedia/commons/8/8b/Malampuzha_Dam.jpg"},
    {name:"Palakkad Fort", lat:10.7724, lng:76.6550, img:"https://upload.wikimedia.org/wikipedia/commons/0/0f/Palakkad_Fort_Entrance.jpg"}
  ],
  "kottayam":[
    {name:"Kumarakom Bird Sanctuary", lat:9.5793, lng:76.4675, img:"https://upload.wikimedia.org/wikipedia/commons/6/60/Kumarakom_Bird_Sanctuary.jpg"},
    {name:"Vembanad Lake", lat:9.6122, lng:76.5391, img:"https://upload.wikimedia.org/wikipedia/commons/6/6f/Vembanad_Lake.jpg"}
  ],
  "idukki":[
    {name:"Idukki Arch Dam", lat:9.8536, lng:76.9766, img:"https://upload.wikimedia.org/wikipedia/commons/7/73/Idukki_Dam.jpg"}
  ],
  "kasaragod":[
    {name:"Bekal Fort", lat:12.4317, lng:74.9979, img:"https://upload.wikimedia.org/wikipedia/commons/2/2f/Bekal_Fort.jpg"}
  ],
  "malappuram":[
    {name:"Kottakkal Arya Vaidya Sala", lat:10.9796, lng:75.9590, img:"https://upload.wikimedia.org/wikipedia/commons/0/0b/Kottakkal_Arya_Vaidya_Sala.jpg"}
  ],
  "pathanamthitta":[
    {name:"Sabarimala (pilgrimage)", lat:9.4380, lng:77.1200, img:"https://upload.wikimedia.org/wikipedia/commons/0/0b/Sabarimala.jpg"}
  ]
};

/* -------------------------
   App state
   ------------------------- */
let state = {
  user: null, // {name,email,isGuest,points}
  watchId: null,
  map: null,
  userMarker: null,
  recoMarkers: []
};

/* ---------- Utilities ---------- */
function toast(msg, time=2400){
  const t = document.getElementById('toast');
  t.innerText = msg; t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'), time);
}

function saveUserToStorage(){
  if(state.user) localStorage.setItem('safar_user', JSON.stringify(state.user));
  else localStorage.removeItem('safar_user');
}
function loadUserFromStorage(){
  const raw = localStorage.getItem('safar_user');
  if(raw) state.user = JSON.parse(raw);
  else state.user = null;
}

/* Haversine distance (meters) */
function distanceMeters(lat1, lon1, lat2, lon2){
  const R=6371e3;
  const toRad=(d)=>d*Math.PI/180;
  const φ1=toRad(lat1), φ2=toRad(lat2);
  const Δφ=toRad(lat2-lat1);
  const Δλ=toRad(lon2-lon1);
  const a=Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
}

/* Points to rupee conversion: 1 point = ₹0.1 (so 2 points = ₹0.2) */
function pointsToRupees(points){ return (points * 0.10).toFixed(2); }

/* ---------- Auth flows (frontend demo) ---------- */
function showAuth(mode='signin'){
  document.getElementById('auth-overlay').classList.remove('hidden');
  document.getElementById('consent-overlay').classList.add('hidden');
}
function hideAuth(){ document.getElementById('auth-overlay').classList.add('hidden'); }

/* Basic Gmail validation */
function isValidGmail(email){
  if(!email) return false;
  email = email.trim();
  if(!email.endsWith('@gmail.com')) return false;
  // simple regex
  return /^[^\s@]+@[^\s@]+$/.test(email);
}

/* Sign up (frontend only) */
async function signup(){
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if(!name || !isValidGmail(email) || password.length < 4){
    return toast('Enter valid name, Gmail and password (≥4 chars).');
  }

  // Example: call backend to create user
  // await fetch(API_BASE + '/signup', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,email,password})});

  state.user = {name,email,isGuest:false,points:0};
  saveUserToStorage();
  toast('Account created. Proceed to consent.');
  hideAuth(); showConsent();
}

/* Sign in (frontend only) */
async function signin(){
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  if(!isValidGmail(email) || password.length < 1){
    return toast('Use a valid Gmail to sign in.');
  }

  // Example: call backend login -> session token
  // const res = await fetch(API_BASE + '/login',{...})
  // set state.user from response
  // For demo, create local user if not present
  const stored = JSON.parse(localStorage.getItem('safar_user') || 'null');
  if(stored && stored.email === email){
    state.user = stored; // restore
  } else {
    state.user = {name:email.split('@')[0],email,isGuest:false,points:0};
  }
  saveUserToStorage();
  toast('Signed in — proceed to consent.');
  hideAuth(); showConsent();
}

/* Guest */
function continueGuest(){
  state.user = {name:'Guest', email:null, isGuest:true, points:0};
  saveUserToStorage();
  hideAuth(); showConsent();
}

/* ---------- Consent & proceed ---------- */
function showConsent(){
  document.getElementById('consent-overlay').classList.remove('hidden');
}
function hideConsent(){
  document.getElementById('consent-overlay').classList.add('hidden');
}
function acceptConsent(){
  const ch = document.getElementById('consent-check');
  if(!ch.checked) return toast('Please accept terms to continue.');
  hideConsent();
  enterApp();
}

/* ---------- Enter App ---------- */
function enterApp(){
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('consent-overlay').classList.add('hidden');
  loadUserFromStorage();
  if(!state.user) {
    state.user = {name:'Guest',isGuest:true,points:0};
    saveUserToStorage();
  }
  updateUIForUser();
  initMap();
  populateGuide();
  startGeolocation();
}

/* Update topbar and vault displays */
function updateUIForUser(){
  document.getElementById('user-info').innerText = state.user && !state.user.isGuest ? state.user.name : 'Guest';
  const pts = state.user ? state.user.points || 0 : 0;
  document.getElementById('points-display').innerText = pts;
  document.getElementById('balance-display').innerText = pointsToRupees(pts);
  document.getElementById('vault-points').innerText = pts;
  document.getElementById('vault-balance').innerText = pointsToRupees(pts);
}

/* Sign out */
function signout(){
  state.user = null;
  saveUserToStorage();
  // reset map markers and UI
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-overlay').classList.remove('hidden');
  stopGeolocation();
}

/* ---------- Map & location ---------- */
function initMap(){
  // center Kerala by default
  const keralaCenter = [9.5, 76.5];
  state.map = L.map('mapid', {zoomControl:true}).setView(keralaCenter, 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(state.map);

  // user marker (empty until location found)
  state.userMarker = L.marker(keralaCenter, {title:'Your location'}).addTo(state.map);
  state.userMarker.bindPopup('Your location (not fixed)');
}

/* Start watching position */
function startGeolocation(){
  if(!navigator.geolocation){ toast('Geolocation not supported'); return; }
  state.watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {enableHighAccuracy:true, maximumAge:5000});
}

/* Stop watching */
function stopGeolocation(){
  if(state.watchId) navigator.geolocation.clearWatch(state.watchId);
  state.watchId = null;
}

/* Position update */
function onPosition(pos){
  const lat = pos.coords.latitude, lng = pos.coords.longitude;
  if(!state.map) initMap();
  state.userMarker.setLatLng([lat,lng]);
  state.userMarker.bindPopup('You are here').openPopup();
  state.map.setView([lat,lng], 13);
  document.getElementById('start-loc').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/* Position error */
function onPositionError(err){
  console.warn('geo err', err);
}

/* Center to me */
function centerToMe(){
  if(state.userMarker) state.map.setView(state.userMarker.getLatLng(), 13);
  else toast('No location yet. Click Use my location');
}

/* Manual location set */
function setManualLocation(){
  const lat = parseFloat(document.getElementById('manual-lat').value);
  const lng = parseFloat(document.getElementById('manual-lng').value);
  if(isNaN(lat) || isNaN(lng)) return toast('Provide valid lat/lng');
  state.userMarker.setLatLng([lat,lng]);
  state.map.setView([lat,lng], 12);
  document.getElementById('start-loc').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  toast('Manual location set');
}

/* Clear recommendation markers */
function clearRecoMarkers(){
  state.recoMarkers.forEach(m => state.map.removeLayer(m));
  state.recoMarkers = [];
  document.getElementById('recommend-list').innerHTML = '';
}

/* Add a set of recommendations to map */
function addRecommendationsToMap(list){
  clearRecoMarkers();
  const userLatLng = state.userMarker.getLatLng();
  list.forEach(p=>{
    const mark = L.marker([p.lat,p.lng]).addTo(state.map);
    const d = distanceMeters(userLatLng.lat, userLatLng.lng, p.lat, p.lng);
    mark.bindPopup(`<strong>${p.name}</strong><br>${(d/1000).toFixed(2)} km away`);
    state.recoMarkers.push(mark);
  });
  toast('Recommendations added to map');
}

/* ---------- Recommendation logic ---------- */
function findRecommendationsFor(dest){
  if(!dest) return [];
  dest = dest.trim().toLowerCase();
  // exact match or contains key
  const keys = Object.keys(PLACES);
  let matches = [];
  // try direct key
  if(PLACES[dest]) matches = PLACES[dest];
  else {
    // fuzzy: if dest contains city name token
    for(const k of keys){
      if(dest.includes(k) || k.includes(dest) || dest.startsWith(k.slice(0,4))) {
        matches = PLACES[k]; break;
      }
    }
    // fallback: check if any place name includes token
    if(matches.length===0){
      const token = dest.split(/\s/)[0];
      for(const k of keys){
        for(const p of PLACES[k]){
          if(p.name.toLowerCase().includes(token)){
            matches.push(p);
          }
        }
      }
    }
  }
  return matches.slice(0,6); // return up to 6
}

/* Show recommendation modal */
function showRecommendations(dest){
  const list = findRecommendationsFor(dest);
  if(list.length===0){ toast('No recommendations found for that destination'); return; }
  // populate modal
  const container = document.getElementById('reco-places'); container.innerHTML = '';
  const userLatLng = state.userMarker.getLatLng();
  list.forEach(p=>{
    const d = userLatLng ? (distanceMeters(userLatLng.lat, userLatLng.lng, p.lat, p.lng)/1000).toFixed(2) : '—';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div style="padding:12px">
        <h4 style="margin:6px 0">${p.name}</h4>
        <div class="muted small">${d} km from you</div>
        <div style="margin-top:10px"><button class="btn outline" onclick='zoomTo(${p.lat}, ${p.lng})'>View on map</button></div>
      </div>
    `;
    container.appendChild(card);
  });
  document.getElementById('reco-modal').classList.remove('hidden');
}

/* Close reco modal */
function closeReco(){ document.getElementById('reco-modal').classList.add('hidden'); }

/* Zoom to place */
function zoomTo(lat,lng){
  state.map.setView([lat,lng], 14);
}

/* Add current modal recommendations to map */
function addRecoToMap(){
  const container = document.getElementById('reco-places');
  const imgs = container.querySelectorAll('.card img');
  const list = [];
  imgs.forEach(img=>{
    // src alt -> we need to map back to PLACES to find coords
    const alt = img.alt;
    for(const k in PLACES){
      const found = PLACES[k].find(p=>p.name === alt);
      if(found) list.push(found);
    }
  });
  addRecommendationsToMap(list);
  closeReco();
}

/* ---------- Journey completion & survey ---------- */
async function completeJourney(){
  // Simulate journey completion
  if(!state.user) return toast('Sign in first');
  const dest = document.getElementById('destination').value.trim();
  if(!dest) return toast('Enter a destination');
  // open survey modal
  document.getElementById('survey-modal').classList.remove('hidden');

  // If not guest, award points now (or after survey submit)
  if(!state.user.isGuest){
    state.user.points = (state.user.points || 0) + 2; // +2 points per completed journey
    saveUserToStorage();
    updateUIForUser();
    toast('Journey completed — +2 points (₹0.20)');
  } else {
    toast('Journey recorded (guest — no points)');
  }

  // Send to backend (placeholder)
  /*
  await fetch(API_BASE + '/journey', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({
      email: state.user.email || null,
      isGuest: !!state.user.isGuest,
      start: document.getElementById('start-loc').value,
      destination: dest,
      mode: document.getElementById('mode').value,
      purpose: document.getElementById('purpose').value,
      timestamp: new Date().toISOString()
    })
  });
  */
}

/* Submit survey */
async function submitSurvey(){
  const rating = document.getElementById('survey-rating').value;
  const issues = document.getElementById('survey-issues').value;
  document.getElementById('survey-modal').classList.add('hidden');
  toast('Survey submitted — thank you!');
  // Send to backend
  /*
  await fetch(API_BASE + '/survey', {
    method:'POST', headers:{'content-type':'application/json'},
    body: JSON.stringify({ email: state.user.email || null, rating, issues, timestamp: new Date().toISOString()})
  });
  */
}

/* ---------- Vault & redeem ---------- */
function calcRedeem(){
  const pts = parseInt(document.getElementById('redeem-points').value || 0, 10);
  if(isNaN(pts) || pts<=0) return document.getElementById('redeem-result').innerText = 'Enter positive points';
  const rupees = pointsToRupees(pts);
  document.getElementById('redeem-result').innerText = `${pts} pts → ₹${rupees}`;
}

async function requestRedeem(){
  const pts = parseInt(document.getElementById('redeem-points').value || 0, 10);
  if(isNaN(pts) || pts<=0) return toast('Enter valid points to redeem');
  if(!state.user || state.user.isGuest) return toast('Only registered users can redeem');

  if(pts > (state.user.points||0)) return toast('Not enough points');

  // update locally (backend should validate)
  state.user.points -= pts;
  saveUserToStorage();
  updateUIForUser();
  toast(`Redeem requested: ${pts} pts → ₹${pointsToRupees(pts)}`);

  // send request to backend
  /*
  await fetch(API_BASE + '/redeem', {
    method:'POST',headers:{'content-type':'application/json'},
    body: JSON.stringify({email:state.user.email, points:pts})
  });
  */
}

/* ---------- Populate guide page ---------- */
function populateGuide(){
  const container = document.getElementById('guide-grid');
  container.innerHTML = '';
  for(const city in PLACES){
    PLACES[city].slice(0,3).forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<img src="${p.img}" alt="${p.name}"><div style="padding:10px"><h4>${p.name}</h4><div class="muted small">${city}</div></div>`;
      container.appendChild(card);
    });
  }
}

/* ---------- Navigation helpers ---------- */
function navTo(section){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  document.querySelectorAll('.sidebar .nav').forEach(n=>n.classList.remove('active'));
  document.getElementById(section).classList.remove('hidden');
  // highlight nav
  document.querySelectorAll('.sidebar .nav').forEach(n=>{
    if(n.dataset.section===section) n.classList.add('active');
  });
}

/* ---------- Wire UI events ---------- */
function wireEvents(){
  document.getElementById('tab-signin').onclick = ()=>{
    document.getElementById('signin-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('guest-block').classList.add('hidden');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-signin').classList.add('active');
  };
  document.getElementById('tab-signup').onclick = ()=>{
    document.getElementById('signin-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('guest-block').classList.add('hidden');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-signup').classList.add('active');
  };
  document.getElementById('tab-guest').onclick = ()=>{
    document.getElementById('signin-form').classList.add('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('guest-block').classList.remove('hidden');
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-guest').classList.add('active');
  };

  document.getElementById('btn-signup').onclick = signup;
  document.getElementById('btn-signin').onclick = signin;
  document.getElementById('btn-guest').onclick = continueGuest;

  document.getElementById('consent-back').onclick = ()=>{ document.getElementById('consent-overlay').classList.add('hidden'); document.getElementById('auth-overlay').classList.remove('hidden'); }
  document.getElementById('consent-continue').onclick = acceptConsent;

  // left nav
  document.querySelectorAll('.sidebar .nav').forEach(n=>{
    n.onclick = () => {
      const sec = n.dataset.section || n.getAttribute('data-section');
      if(sec) navTo(sec);
    }
  });
  document.getElementById('signout').onclick = signout;

  // diary actions
  document.getElementById('btn-use-location').onclick = ()=>{
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>{
      document.getElementById('start-loc').value = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
      state.userMarker.setLatLng([p.coords.latitude, p.coords.longitude]);
      state.map.setView([p.coords.latitude, p.coords.longitude], 13);
      toast('Using current location');
    }, ()=>toast('Unable to fetch location'));
  };
  document.getElementById('btn-set-manual').onclick = ()=>{
    const manual = prompt('Enter lat,lng (e.g. 9.4981,76.3388)');
    if(!manual) return;
    const [lat,lng] = manual.split(',').map(x=>parseFloat(x));
    if(isNaN(lat)||isNaN(lng)) return toast('Invalid coordinates');
    state.userMarker.setLatLng([lat,lng]); state.map.setView([lat,lng], 12);
    document.getElementById('start-loc').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  document.getElementById('btn-show-reco').onclick = ()=>{
    const dest = document.getElementById('destination').value;
    showRecommendations(dest);
  };

  document.getElementById('btn-submit-journey').onclick = () => completeJourney();

  document.getElementById('btn-submit-survey').onclick = submitSurvey;
  document.getElementById('btn-use-location').onclick = ()=>{}; // handled above

  // map actions
  document.getElementById('btn-center-me').onclick = () => centerToMe();
  document.getElementById('btn-clear-markers').onclick = () => clearRecoMarkers();
  document.getElementById('btn-set-manual-loc').onclick = setManualLocation;

  // Vault
  document.getElementById('open-vault').onclick = ()=>{ navTo('vault'); }
  document.getElementById('btn-calc-redeem').onclick = calcRedeem;
  document.getElementById('btn-request-redeem').onclick = requestRedeem;

  // Reveal auth on load
  showAuth('signin');
}

/* Run on load */
window.addEventListener('load', ()=>{
  wireEvents();
  loadUserFromStorage();
  // if user info exists and consent previously done — auto show app (optional)
  // for demo, always show auth overlay first
});


const API = "http://localhost:8000";

// Trip start
async function startTrip(mode, purpose, destination, lat, lng, userId="guest") {
  const res = await fetch(`${API}/api/trip/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      start_lat: lat,
      start_lng: lng,
      mode, purpose, destination
    })
  });
  const data = await res.json();
  return data.trip_id;
}

// Trip update (watchPosition ke andar se call karo)
async function updateTrip(tripId, lat, lng, acc) {
  await fetch(`${API}/api/trip/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trip_id: tripId, lat, lng, accuracy: acc })
  });
}

// Trip end
async function endTrip(tripId, lat, lng, rating=null, issues=null) {
  await fetch(`${API}/api/trip/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trip_id: tripId,
      end_lat: lat,
      end_lng: lng,
      survey_rating: rating,
      survey_issues: issues
    })
  });
}

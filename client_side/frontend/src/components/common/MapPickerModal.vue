<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style="max-height:90vh;">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h3 class="text-lg font-bold text-gray-800">Pin Delivery Location</h3>
          <p class="text-xs text-gray-500 mt-0.5">Drag the marker or click the map to set your exact delivery point</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Map -->
      <div ref="mapContainer" class="w-full flex-1" style="min-height:380px;"></div>

      <!-- Address display & search -->
      <div class="px-6 py-4 border-t bg-gray-50 space-y-3">
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            @keyup.enter="searchAddress"
            type="text"
            placeholder="Search address or landmark..."
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            @click="searchAddress"
            :disabled="searching"
            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60"
          >
            {{ searching ? '...' : 'Search' }}
          </button>
          <button
            @click="useCurrentLocation"
            :disabled="locating"
            title="Use my current location"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ locating ? '...' : 'Me' }}
          </button>
        </div>

        <div v-if="selectedAddress" class="text-sm text-gray-700 bg-white border rounded-lg px-3 py-2 flex items-start gap-2">
          <svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{{ selectedAddress }}</span>
        </div>
        <p v-else class="text-xs text-gray-400">Click or drag the marker to select a location.</p>
      </div>

      <!-- Confirm button -->
      <div class="px-6 py-4 border-t flex justify-end gap-3">
        <button @click="$emit('close')" class="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button
          @click="confirm"
          :disabled="!lat || !lng"
          class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
        >
          Confirm Location
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  initialLat: { type: Number, default: -1.2921 },
  initialLng: { type: Number, default: 36.8219 }
});

const emit = defineEmits(['close', 'confirm']);

const mapContainer = ref(null);
const lat = ref(null);
const lng = ref(null);
const selectedAddress = ref('');
const searchQuery = ref('');
const searching = ref(false);
const locating = ref(false);

let mapInstance = null;
let markerInstance = null;
let L = null;

const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) { resolve(window.L); return; }

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => resolve(window.L);
    document.head.appendChild(js);
  });
};

const reverseGeocode = async (latVal, lngVal) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latVal}&lon=${lngVal}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name || `${latVal.toFixed(5)}, ${lngVal.toFixed(5)}`;
  } catch {
    return `${latVal.toFixed(5)}, ${lngVal.toFixed(5)}`;
  }
};

const initMap = async () => {
  await nextTick();
  if (!mapContainer.value) return;

  L = await loadLeaflet();

  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  mapInstance = L.map(mapContainer.value).setView(
    [props.initialLat || -1.2921, props.initialLng || 36.8219],
    14
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Custom orange marker
  const icon = L.divIcon({
    html: `<div style="width:32px;height:32px;background:#f97316;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: ''
  });

  const startLat = props.initialLat || -1.2921;
  const startLng = props.initialLng || 36.8219;

  markerInstance = L.marker([startLat, startLng], { draggable: true, icon }).addTo(mapInstance);
  lat.value = startLat;
  lng.value = startLng;

  // Reverse geocode initial position
  reverseGeocode(startLat, startLng).then(addr => { selectedAddress.value = addr; });

  // On marker drag
  markerInstance.on('dragend', async (e) => {
    const pos = e.target.getLatLng();
    lat.value = pos.lat;
    lng.value = pos.lng;
    selectedAddress.value = await reverseGeocode(pos.lat, pos.lng);
  });

  // On map click
  mapInstance.on('click', async (e) => {
    lat.value = e.latlng.lat;
    lng.value = e.latlng.lng;
    markerInstance.setLatLng(e.latlng);
    selectedAddress.value = await reverseGeocode(e.latlng.lat, e.latlng.lng);
  });

  // Fix sizing after modal renders
  setTimeout(() => mapInstance.invalidateSize(), 200);
};

const searchAddress = async () => {
  if (!searchQuery.value.trim()) return;
  searching.value = true;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery.value)}&format=json&limit=1&countrycodes=ke`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const results = await res.json();
    if (results.length > 0) {
      const r = results[0];
      const newLat = parseFloat(r.lat);
      const newLng = parseFloat(r.lon);
      lat.value = newLat;
      lng.value = newLng;
      selectedAddress.value = r.display_name;
      mapInstance.setView([newLat, newLng], 16);
      markerInstance.setLatLng([newLat, newLng]);
    } else {
      alert('Location not found. Try a different search term.');
    }
  } catch {
    alert('Search failed. Please try again.');
  } finally {
    searching.value = false;
  }
};

const useCurrentLocation = () => {
  if (!navigator.geolocation) { alert('Geolocation is not supported by your browser.'); return; }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const newLat = pos.coords.latitude;
      const newLng = pos.coords.longitude;
      lat.value = newLat;
      lng.value = newLng;
      mapInstance.setView([newLat, newLng], 17);
      markerInstance.setLatLng([newLat, newLng]);
      selectedAddress.value = await reverseGeocode(newLat, newLng);
      locating.value = false;
    },
    () => {
      alert('Could not get your location. Please allow location access.');
      locating.value = false;
    }
  );
};

const confirm = () => {
  if (!lat.value || !lng.value) return;
  emit('confirm', {
    lat: lat.value,
    lng: lng.value,
    address: selectedAddress.value
  });
};

watch(() => props.show, (val) => {
  if (val) initMap();
});

onUnmounted(() => {
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
});
</script>

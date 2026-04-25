<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-8">My Profile</h1>
    
    <div class="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <!-- Avatar Section -->
      <div class="flex items-center gap-6 mb-8 pb-8 border-b">
        <div class="relative">
          <img 
            :src="avatarPreview || auth.user?.avatar_url || '/default-avatar.png'" 
            alt="Profile" 
            class="w-24 h-24 rounded-full object-cover border-4 border-primary-100 shadow-md"
            @error="handleAvatarError"
          />
          <div class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-3 border-white"></div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-800">{{ nickname || auth.user?.username }}</h2>
          <p class="text-sm text-gray-500">{{ auth.user?.email }}</p>
          <label class="cursor-pointer inline-flex items-center gap-2 mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Change Avatar
            <input 
              type="file" 
              @change="uploadAvatar" 
              accept="image/*" 
              class="hidden" 
              :disabled="uploading"
            />
          </label>
        </div>
      </div>

      <!-- Nickname Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
          <input 
            v-model="nickname" 
            type="text" 
            placeholder="Enter your preferred display name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
          <p class="text-xs text-gray-500 mt-1">This name will be shown in the navbar and on your orders.</p>
        </div>

        <button 
          @click="saveProfile" 
          :disabled="saving"
          class="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useToast } from 'vue-toast-notification';

const auth = useAuthStore();
const toast = useToast();

const nickname = ref(auth.user?.nickname || auth.user?.username || '');
const avatarPreview = ref(auth.user?.avatar_url || '');
const saving = ref(false);
const uploading = ref(false);

// Load user data on mount
onMounted(() => {
  if (auth.user) {
    nickname.value = auth.user.nickname || auth.user.username || '';
    avatarPreview.value = auth.user.avatar_url || '';
  }
});

const saveProfile = async () => {
  saving.value = true;
  try {
    const { data } = await api.put('/users/profile', { 
      nickname: nickname.value 
    });
    auth.updateUser({ 
      nickname: data.user.nickname, 
      avatar_url: data.user.avatar_url 
    });
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error('Profile update failed:', error);
    toast.error(error.response?.data?.message || 'Failed to update profile');
  } finally {
    saving.value = false;
  }
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    avatarPreview.value = data.avatar_url;
    auth.updateUser({ avatar_url: data.avatar_url });
    toast.success('Avatar uploaded successfully');
  } catch (error) {
    console.error('Avatar upload failed:', error);
    toast.error(error.response?.data?.message || 'Failed to upload avatar');
  } finally {
    uploading.value = false;
    // Reset input so same file can be selected again if needed
    event.target.value = '';
  }
};

const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png';
};
</script>

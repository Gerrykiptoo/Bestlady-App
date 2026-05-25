<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">Get in Touch</h1>
      <p class="text-purple-100 max-w-lg mx-auto">Have a question or need help? Our team is ready to assist you Monday–Saturday, 8am–6pm EAT.</p>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="font-black text-2xl text-gray-800 mb-6">Send Us a Message</h2>
          <form @submit.prevent="sendMessage" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <input v-model="form.firstName" type="text" placeholder="Jane" required
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input v-model="form.lastName" type="text" placeholder="Doe" required
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input v-model="form.email" type="email" placeholder="jane@example.com" required
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
              <select v-model="form.subject" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition bg-white">
                <option value="">Select a topic</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Help</option>
                <option value="product">Product Inquiry</option>
                <option value="account">Account Problem</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
              <textarea v-model="form.message" rows="5" placeholder="Describe your issue or question in detail..." required
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition resize-none"></textarea>
            </div>
            <button type="submit" :disabled="sending"
              class="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <svg v-if="!sending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>
            <p v-if="sent" class="text-center text-sm text-green-600 font-semibold">Message sent! We'll respond within 24 hours.</p>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-bold text-gray-800 mb-5">Contact Information</h3>
            <div class="space-y-5">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                  <a href="mailto:support@bestlady.co.ke" class="text-gray-800 font-medium hover:text-purple-600 transition">support@bestlady.co.ke</a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Phone / WhatsApp</p>
                  <p class="text-gray-800 font-medium">+254 700 000 000</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Office</p>
                  <p class="text-gray-800 font-medium">Westlands Business Park, Nairobi, Kenya</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Business Hours</p>
                  <p class="text-gray-800 font-medium">Mon–Sat, 8:00 AM – 6:00 PM EAT</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick links -->
          <div class="bg-purple-50 rounded-2xl border border-purple-100 p-6">
            <h3 class="font-bold text-gray-800 mb-4">Quick Help</h3>
            <div class="space-y-3">
              <router-link to="/faq" class="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition group">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition">
                  <svg class="w-4 h-4 text-purple-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">Browse FAQs</p>
                  <p class="text-xs text-gray-500">Find instant answers</p>
                </div>
              </router-link>
              <router-link to="/track-orders" class="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition group">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition">
                  <svg class="w-4 h-4 text-green-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">Track Your Order</p>
                  <p class="text-xs text-gray-500">Real-time order status</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const sending = ref(false)
const sent = ref(false)
const form = ref({ firstName: '', lastName: '', email: '', subject: '', message: '' })

const sendMessage = async () => {
  sending.value = true
  // Simulate send — wire to real API when email is configured
  await new Promise(r => setTimeout(r, 1200))
  sending.value = false
  sent.value = true
  form.value = { firstName: '', lastName: '', email: '', subject: '', message: '' }
  toast.success('Message sent! We\'ll get back to you soon.')
}
</script>

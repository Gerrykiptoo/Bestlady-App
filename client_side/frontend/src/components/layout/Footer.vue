\<template>
  <footer class="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-16">
    <!-- Newsletter Section -->
    <div class="border-b border-gray-800">
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p class="text-gray-400">Get the latest beauty tips, product launches, and exclusive offers.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <input 
              v-model="email"
              type="email" 
              placeholder="Enter your email" 
              class="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button 
              @click="subscribe"
              :disabled="subscribing"
              class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {{ subscribing ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Brand Column -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">BestLady</span>
            <span class="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">AI-Powered</span>
          </div>
          <p class="text-gray-400 text-sm mb-4 max-w-md">
            Premium beauty products for salons, supermarkets, and distributors. AI-powered inventory management and personalized recommendations.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group">
              <svg class="h-5 w-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group">
              <svg class="h-5 w-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.337-11.743 9.98 9.98 0 002.456-2.546z"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group">
              <svg class="h-5 w-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors group">
              <svg class="h-5 w-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-lg mb-4 text-white">Quick Links</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/products" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Products
            </router-link></li>
            <li><router-link to="/about" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              About Us
            </router-link></li>
            <li><router-link to="/contact" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Contact
            </router-link></li>
            <li><router-link to="/blog" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Blog
            </router-link></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h4 class="font-semibold text-lg mb-4 text-white">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/faq" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              FAQs
            </router-link></li>
            <li><router-link to="/shipping-info" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Shipping Info
            </router-link></li>
            <li><router-link to="/returns" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Returns Policy
            </router-link></li>
            <li><router-link to="/track-orders" class="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
              <svg class="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Track Order
            </router-link></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h4 class="font-semibold text-lg mb-4 text-white">Contact Us</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-3 text-gray-400">
              <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@bestlady.co.ke</span>
            </li>
            <li class="flex items-start gap-3 text-gray-400">
              <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="https://wa.me/254703888085" target="_blank" class="hover:text-white transition">+254 703 888 085</a>
            </li>
            <li class="flex items-start gap-3 text-gray-400">
              <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Payment Methods & Copyright -->
      <div class="border-t border-gray-800 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">We accept:</span>
            <div class="flex gap-2">
              <div class="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">VISA</div>
              <div class="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">MC</div>
              <div class="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">MPESA</div>
              <div class="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-400">WLT</div>
            </div>
          </div>
          <div class="text-center text-sm text-gray-500">
            &copy; {{ new Date().getFullYear() }} BestLady Cosmetics. All rights reserved.
          </div>
          <div class="flex gap-4 text-xs text-gray-500">
            <a href="#" class="hover:text-primary-400">Privacy Policy</a>
            <span>|</span>
            <a href="#" class="hover:text-primary-400">Terms of Service</a>
            <span>|</span>
            <a href="#" class="hover:text-primary-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const email = ref('')
const subscribing = ref(false)
const toast = useToast()

const subscribe = async () => {
  if (!email.value) {
    toast.error('Please enter your email')
    return
  }
  
  if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email.value)) {
    toast.error('Please enter a valid email')
    return
  }
  
  subscribing.value = true
  try {
    // Replace with your actual API call
    // await api.post('/newsletter/subscribe', { email: email.value })
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Subscribed successfully! Check your email for updates.')
    email.value = ''
  } catch (error) {
    toast.error('Failed to subscribe. Please try again.')
  } finally {
    subscribing.value = false
  }
}
</script>

<style scoped>
.container-custom {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container-custom {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    padding: 0 2rem;
  }
}

/* Animation for newsletter input */
input:focus {
  transform: scale(1.01);
  transition: transform 0.2s ease;
}
</style>
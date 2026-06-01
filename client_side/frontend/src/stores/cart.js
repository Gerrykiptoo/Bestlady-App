import { defineStore } from 'pinia';
import api from '@/services/api';

// Only sync to the server when the user is logged in
const isLoggedIn = () => !!localStorage.getItem('accessToken');

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
    // Items the customer parked to buy later (e.g. no funds yet) — persisted
    savedItems: JSON.parse(localStorage.getItem('savedItems')) || []
  }),
  getters: {
    savedCount: (state) => state.savedItems.length,
    totalItems: (state) => state.items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0),
    itemCount: (state) => state.items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0),
    subtotal: (state) => state.items.reduce((acc, item) => {
      const price = Number(item.discountedPrice ?? item.price) || 0;
      return acc + price * (Number(item.quantity) || 0);
    }, 0),
    tax: (state) => {
      const sub = state.items.reduce((acc, item) => {
        const price = Number(item.discountedPrice ?? item.price) || 0;
        return acc + price * (Number(item.quantity) || 0);
      }, 0);
      return sub * 0.16;
    },
    total: (state) => {
      const sub = state.items.reduce((acc, item) => {
        const price = Number(item.discountedPrice ?? item.price) || 0;
        return acc + price * (Number(item.quantity) || 0);
      }, 0);
      return sub + sub * 0.16 + (sub > 0 ? 250 : 0);
    }
  },
  actions: {
    addItem(product, price, quantity = 1) {
      const existing = this.items.find(item => item.product_id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({
          product_id: product.id,
          name: product.name,
          price: price,
          image_url: product.image_url,
          quantity: quantity
        });
      }
      this.save();
    },
    // Used by AI optimizer to pass discounted price as the effective cart price
    addDiscountedItem({ product_id, name, price, discountedPrice, discountPercent, quantity = 1 }) {
      const existing = this.items.find(item => item.product_id === product_id);
      if (existing) {
        existing.quantity += quantity;
        if (discountedPrice && discountedPrice < (existing.discountedPrice ?? existing.price)) {
          existing.discountedPrice = discountedPrice;
          existing.discountPercent = discountPercent;
        }
      } else {
        this.items.push({
          product_id,
          name,
          price,
          discountedPrice: discountedPrice ?? price,
          discountPercent: discountPercent ?? 0,
          quantity
        });
      }
      this.save();
    },
    // Apply an AI tier discount to an item already in the cart (keeps quantity)
    applyDiscount(productId, discountedPrice, discountPercent) {
      const item = this.items.find(i => i.product_id === productId);
      if (item) {
        item.discountedPrice = discountedPrice;
        item.discountPercent = discountPercent;
        this.save();
      }
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.product_id !== productId);
      this.save();
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.product_id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) this.removeItem(productId);
      }
      this.save();
    },
    clear() {
      this.items = [];
      this.save();
    },

    // ── Save for Later (synced to server when logged in) ─────────
    // Load the user's saved items from the server and merge with local
    async loadSavedFromServer() {
      if (!isLoggedIn()) return;
      try {
        const { data } = await api.get('/saved');
        // Server is the source of truth when logged in
        this.savedItems = data.map(s => ({
          product_id: s.product_id,
          name: s.name,
          price: Number(s.price) || 0,
          discountedPrice: s.discountedPrice != null ? Number(s.discountedPrice) : undefined,
          discountPercent: s.discountPercent || 0,
          image_url: s.image_url,
          quantity: s.quantity || 1
        }));
        this.save();
      } catch { /* offline / not critical — keep local */ }
    },

    // Move an item out of the active cart into the saved list
    saveForLater(productId) {
      const item = this.items.find(i => i.product_id === productId);
      if (!item) return;
      if (!this.savedItems.find(s => s.product_id === productId)) {
        this.savedItems.push({ ...item });
      }
      this.items = this.items.filter(i => i.product_id !== productId);
      this.save();
      // Sync to server (fire-and-forget)
      if (isLoggedIn()) {
        api.post('/saved', {
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          discountedPrice: item.discountedPrice,
          discountPercent: item.discountPercent || 0,
          image_url: item.image_url,
          quantity: item.quantity || 1
        }).catch(() => {});
      }
    },
    // Move a saved item back into the active cart
    moveToCart(productId) {
      const saved = this.savedItems.find(s => s.product_id === productId);
      if (!saved) return;
      const existing = this.items.find(i => i.product_id === productId);
      if (existing) {
        existing.quantity += saved.quantity || 1;
      } else {
        this.items.push({ ...saved });
      }
      this.savedItems = this.savedItems.filter(s => s.product_id !== productId);
      this.save();
      if (isLoggedIn()) api.delete(`/saved/${productId}`).catch(() => {});
    },
    removeSaved(productId) {
      this.savedItems = this.savedItems.filter(s => s.product_id !== productId);
      this.save();
      if (isLoggedIn()) api.delete(`/saved/${productId}`).catch(() => {});
    },

    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
      localStorage.setItem('savedItems', JSON.stringify(this.savedItems));
    }
  }
});

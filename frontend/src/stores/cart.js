import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    tax: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 0.16,
    total: (state) => {
      const sub = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      return sub + (sub * 0.16) + (sub > 0 ? 250 : 0); // 250 flat delivery if not empty
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
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }
});

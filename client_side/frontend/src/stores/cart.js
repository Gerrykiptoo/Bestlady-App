import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || []
  }),
  getters: {
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
    save() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    }
  }
});

// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: "Mango Pickle",
    price: 180,
    weight: "250g",
    category: "mango",
    image: "images/mango_pickle.png",
    tags: [
      { text: "Tangy & Spicy", type: "taste" },
      { text: "Mom's Special", type: "maker" }
    ],
    desc: "Traditional Kerala raw mango pickle. Sesame oil, mustard, and fenugreek — all in the perfect ratio.",
    bestseller: true
  },
  {
    id: 2,
    name: "Lime Pickle",
    price: 150,
    weight: "250g",
    category: "lime",
    image: "images/lime_pickle.png",
    tags: [
      { text: "Sour & Spicy", type: "taste" },
      { text: "Homemade", type: "maker" }
    ],
    desc: "Made with fresh limes and Kerala spices. The best combination with steamed rice!",
    bestseller: false
  },
  {
    id: 3,
    name: "Garlic Pickle",
    price: 200,
    weight: "250g",
    category: "garlic",
    image: "images/garlic_pickle.png",
    tags: [
      { text: "Spicy & Crunchy", type: "taste" },
      { text: "Health Boost", type: "maker" }
    ],
    desc: "Crunchy garlic with a perfect kick of spice. Great for boosting immunity and adding flavor!",
    bestseller: true
  },
  {
    id: 4,
    name: "Chilli Pickle",
    price: 160,
    weight: "250g",
    category: "chilli",
    image: "images/chilli_pickle.png",
    tags: [
      { text: "Extra Spicy 🔥", type: "taste" },
      { text: "Traditional", type: "maker" }
    ],
    desc: "Made for those who love it extra spicy! Green chilli pickle that goes perfectly with rice porridge.",
    bestseller: false
  },
  {
    id: 5,
    name: "Mixed Vegetable Pickle",
    price: 190,
    weight: "300g",
    category: "mixed",
    image: "images/mixed_pickle.png",
    tags: [
      { text: "Variety Mix", type: "taste" },
      { text: "Family Pack", type: "maker" }
    ],
    desc: "A special blend of mango, lime, ginger, and chilli. All the best flavors in one jar!",
    bestseller: true
  }
];

// ===== DOM ELEMENTS =====
const productsContainer = document.getElementById('productsContainer');
const productsHeader = document.getElementById('productsHeader');
const categoryTabs = document.getElementById('categoryTabs');
const cartBadge = document.getElementById('cartBadge');
const orderModal = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');
const orderForm = document.getElementById('orderForm');
const orderProductImg = document.getElementById('orderProductImg');
const orderProductName = document.getElementById('orderProductName');
const orderProductPrice = document.getElementById('orderProductPrice');
const paymentModal = document.getElementById('paymentModal');
const paymentModalClose = document.getElementById('paymentModalClose');
const paymentAmount = document.getElementById('paymentAmount');
const qrCodeBox = document.getElementById('qrCodeBox');
const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const offerCode = document.getElementById('offerCode');
const toast = document.getElementById('toast');

// ===== STATE =====
let cart = [];
let currentProduct = null;
let currentOrder = {};

// ===== RENDER PRODUCTS =====
function renderProducts(category = 'all') {
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  const categoryNames = {
    all: 'ALL PICKLES',
    mango: 'MANGO PICKLES',
    lime: 'LIME PICKLES',
    garlic: 'GARLIC PICKLES',
    chilli: 'CHILLI PICKLES',
    mixed: 'MIXED PICKLES'
  };

  productsHeader.textContent = categoryNames[category] || 'ALL PICKLES';

  productsContainer.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-info">
        <div class="product-badges">
          <div class="badge-veg"><div class="badge-veg-dot"></div></div>
          ${product.bestseller ? '<span class="badge-bestseller">🔥 Bestseller</span>' : ''}
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price}</span>
          <span class="product-weight">/ ${product.weight}</span>
        </div>
        <div class="product-tags">
          ${product.tags.map(tag => `
            <span class="product-tag tag-${tag.type}">${tag.text}</span>
          `).join('')}
        </div>
        <p class="product-desc">${product.desc}</p>
      </div>
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <button class="btn-add" onclick="openOrderModal(${product.id})">ORDER NOW</button>
      </div>
    </div>
  `).join('');
}

// ===== CATEGORY TABS =====
categoryTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.category-tab');
  if (!tab) return;

  // Update active tab
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');

  // Filter products
  const category = tab.dataset.category;
  renderProducts(category);
});

// ===== ORDER MODAL =====
function openOrderModal(productId) {
  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) return;

  orderProductImg.src = currentProduct.image;
  orderProductImg.alt = currentProduct.name;
  orderProductName.textContent = currentProduct.name;
  orderProductPrice.textContent = `₹${currentProduct.price} / ${currentProduct.weight}`;

  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
}

orderModalClose.addEventListener('click', closeOrderModal);
orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) closeOrderModal();
});

// ===== ORDER FORM SUBMIT =====
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const pincode = document.getElementById('customerPincode').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();

  if (!name || !address || !pincode || !phone) {
    showToast('Please fill in all the details! 📝');
    return;
  }

  if (pincode.length !== 6 || isNaN(pincode)) {
    showToast('Please enter a valid pincode! 📍');
    return;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    showToast('Please enter a valid phone number! 📱');
    return;
  }

  currentOrder = { name, address, pincode, phone, product: currentProduct };

  closeOrderModal();
  openPaymentModal();
});

// ===== PAYMENT MODAL =====
function openPaymentModal() {
  if (!currentProduct) return;

  paymentAmount.textContent = `Amount: ₹${currentProduct.price}`;

  // Generate QR code
  qrCodeBox.innerHTML = '';
  const upiUrl = `upi://pay?pa=badarudheen@okicici&pn=Badarudheen Pickle&am=${currentProduct.price}&cu=INR&tn=Order: ${currentProduct.name}`;

  if (typeof QRCode !== 'undefined') {
    QRCode.toCanvas(upiUrl, {
      width: 156,
      margin: 1,
      color: { dark: '#1E293B', light: '#FFFFFF' }
    }, (err, canvas) => {
      if (!err && canvas) {
        qrCodeBox.appendChild(canvas);
      } else {
        qrCodeBox.innerHTML = '<div style="font-size:0.8rem;color:#94A3B8;text-align:center;">QR Code<br>Could not<br>be generated</div>';
      }
    });
  } else {
    qrCodeBox.innerHTML = '<div style="font-size:0.8rem;color:#94A3B8;text-align:center;padding:20px;">UPI: badarudheen@okicici</div>';
  }

  paymentModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  paymentModal.classList.remove('active');
  document.body.style.overflow = '';
}

paymentModalClose.addEventListener('click', closePaymentModal);
paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) closePaymentModal();
});

// ===== WHATSAPP ORDER =====
whatsappOrderBtn.addEventListener('click', () => {
  if (!currentOrder.product) return;

  const message = `🫙 *BADARUDHEEN PICKLES - New Order!*

📦 *Product:* ${currentOrder.product.name}
💰 *Price:* ₹${currentOrder.product.price}

👤 *Name:* ${currentOrder.name}
📍 *Address:* ${currentOrder.address}
📮 *Pincode:* ${currentOrder.pincode}
📱 *Phone:* ${currentOrder.phone}

✅ Payment completed! You can also send a screenshot.

---
_Order via Badarudheen Pickles website_`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/919876543210?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank');

  closePaymentModal();
  showToast('Order sent via WhatsApp! ✅');

  // Reset form
  orderForm.reset();
  currentOrder = {};
  currentProduct = null;
});

// ===== TOAST =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== OFFER CODE COPY =====
offerCode.addEventListener('click', () => {
  navigator.clipboard.writeText('WELCOME120').then(() => {
    showToast('Code copied! 📋 WELCOME120');
  }).catch(() => {
    showToast('WELCOME120 — Paste this at checkout!');
  });
});

// ===== SCROLL TO TOP =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SEARCH BUTTON =====
document.getElementById('searchBtn').addEventListener('click', () => {
  showToast('Search coming soon! 🔍');
});

// ===== CART BUTTON =====
document.getElementById('cartBtn').addEventListener('click', () => {
  showToast('Cart coming soon! 🛒');
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

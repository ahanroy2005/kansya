// script.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Global Navigation Active State ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html') {
      link.classList.add('active');
    }
  });

  // --- Products Database ---
  const productsDatabase = {
    'figurine-pendant': { title: 'Figurine Pendant', price: 6500, img: 'Figurine Pendant.JPG', artisan: 'Sujata Behera', bio: 'Ritual Vessels & Masks • 28 Years Experience', face: 'lakshmi sahoo.png.webp' },
    'earrings': { title: 'Dhokra Earrings', price: 1800, img: 'Earrings.JPG', artisan: 'Ramesh Mohapatra', bio: 'Jewellery & Wearables • 35 Years Experience', face: 'Ramesh Mohapatra.jpg' },
    'necklace': { title: 'Dhokra Necklace', price: 3200, img: 'necklace.JPG', artisan: 'Ramesh Mohapatra', bio: 'Jewellery & Wearables • 35 Years Experience', face: 'Ramesh Mohapatra.jpg' },
    'choker': { title: 'Traditional Choker', price: 4800, img: 'Choker.JPG', artisan: 'Sujata Behera', bio: 'Ritual Vessels & Masks • 28 Years Experience', face: 'lakshmi sahoo.png.webp' },
    'pendant': { title: 'Sacred Pendant', price: 2400, img: 'pendant.JPG', artisan: 'Ramesh Mohapatra', bio: 'Jewellery & Wearables • 35 Years Experience', face: 'Ramesh Mohapatra.jpg' },
    'deer': { title: 'Totemic Deer', price: 8500, img: 'deer.JPG', artisan: 'Lata Pradhan', bio: 'Sacred Masks • 19 Years Experience', face: 'Kamala devi.png' },
    'durga-mask': { title: 'Durga Mask', price: 15000, img: 'durga mask.JPG', artisan: 'Lata Pradhan', bio: 'Sacred Masks • 19 Years Experience', face: 'Kamala devi.png' },
    'key-holder': { title: 'Brutalist Key Holder', price: 1200, img: 'key holder.JPG', artisan: 'Sujata Behera', bio: 'Ritual Vessels & Masks • 28 Years Experience', face: 'lakshmi sahoo.png.webp' },
    'peacock-pen-stand': { title: 'Peacock Pen Stand', price: 2800, img: 'peacock pen stand.JPG', artisan: 'Ramesh Mohapatra', bio: 'Jewellery & Wearables • 35 Years Experience', face: 'Ramesh Mohapatra.jpg' },
    'the-musicians': { title: 'The Musicians', price: 18000, img: 'the musicians.JPG', artisan: 'Lata Pradhan', bio: 'Sacred Masks • 19 Years Experience', face: 'Kamala devi.png' },
    'nandi-maharaj': { title: 'Nandi Maharaj', price: 12000, img: 'Nandi Maharaj.JPG', artisan: 'Sujata Behera', bio: 'Ritual Vessels & Masks • 28 Years Experience', face: 'lakshmi sahoo.png.webp' },
    'elephant': { title: 'Elephant', price: 6500, img: 'elephant.JPG', artisan: 'Lata Pradhan', bio: 'Sacred Masks • 19 Years Experience', face: 'Kamala devi.png' }
  };

  // --- Cart State Management ---
  let cartItems = localStorage.getItem('kansyaCartItems') ? JSON.parse(localStorage.getItem('kansyaCartItems')) : [];
  const cartBadgeElements = document.querySelectorAll('.cart-count');
  
  const updateCartBadge = () => {
    cartBadgeElements.forEach(el => {
      el.textContent = cartItems.length;
    });
  };
  
  updateCartBadge(); // Init global badge
  
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const urlParams = new URLSearchParams(window.location.search);
      let productId = urlParams.get('id');
      if (!productId) productId = 'figurine-pendant';
      
      if (productsDatabase[productId]) {
        cartItems.push({ id: productId, ...productsDatabase[productId] });
        localStorage.setItem('kansyaCartItems', JSON.stringify(cartItems));
        updateCartBadge();
        
        // Visual feedback
        const originalText = btn.textContent;
        btn.textContent = 'Added to Cart!';
        btn.style.backgroundColor = '#1A1008';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
        }, 1500);
      }
    });
  });

  // --- Cart Rendering (Cart Page) ---
  if (window.location.pathname.includes('cart.html')) {
    const cartContent = document.getElementById('cart-content');
    
    const renderCart = () => {
      if (cartItems.length === 0) {
        cartContent.innerHTML = `
          <div class="empty-cart-msg">
            <p>Your archive is currently empty.</p>
            <a href="collections.html" class="btn btn-filled" style="margin-top: 20px; display: inline-block;">Explore Collections</a>
          </div>
        `;
        return;
      }
      
      let html = '<div class="cart-items">';
      let total = 0;
      
      cartItems.forEach((item, index) => {
        total += item.price;
        html += `
          <div class="cart-item">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
              <h3 class="cart-item-title">${item.title}</h3>
              <p>Artisan: ${item.artisan}</p>
              <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
          </div>
        `;
      });
      
      html += '</div>';
      
      html += `
        <div class="cart-summary">
          <div class="cart-total">Total: ₹${total.toLocaleString('en-IN')}</div>
          <button class="btn btn-filled" style="width: 100%; max-width: 300px;">Proceed to Secure Checkout</button>
        </div>
      `;
      
      cartContent.innerHTML = html;
      
      // Bind remove buttons
      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          cartItems.splice(index, 1);
          localStorage.setItem('kansyaCartItems', JSON.stringify(cartItems));
          updateCartBadge();
          renderCart();
        });
      });
    };
    
    renderCart();
  }

  // --- Product Gallery (Product Detail Page) ---
  const mainImage = document.getElementById('main-image-img');
  const thumbnails = document.querySelectorAll('.thumb');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const newSrc = this.querySelector('img').src;
        mainImage.src = newSrc;
      });
    });
  }

  // --- Dynamic Product Routing (Product Detail Page) ---
  if (window.location.pathname.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    
    if (!productId) productId = 'figurine-pendant'; // fallback default
    
    if (productId && productsDatabase[productId]) {
      const product = productsDatabase[productId];
      
      document.title = product.title + " | KANSYA Archive";
      const titleEl = document.querySelector('.product-info-col h1');
      if(titleEl) titleEl.textContent = product.title.toUpperCase();
      
      const priceEl = document.querySelector('.detail-price');
      if(priceEl) priceEl.textContent = '₹' + product.price.toLocaleString('en-IN');
      
      if(mainImage) {
        mainImage.src = product.img;
        mainImage.alt = product.title;
      }
      
      if(thumbnails.length > 0) {
         thumbnails.forEach(t => {
           t.querySelector('img').src = product.img;
           t.querySelector('img').alt = product.title;
         });
      }
      
      const breadcrumb = document.querySelector('.breadcrumb');
      if(breadcrumb) breadcrumb.innerHTML = `<a href="collections.html">Collections</a> > <a href="#">Archive</a> > ${product.title}`;
      
      const avatarImg = document.querySelector('.profile-avatar img');
      if(avatarImg) avatarImg.src = product.face;
      
      const artisanName = document.querySelector('.profile-info h4');
      if(artisanName) artisanName.textContent = product.artisan;
      
      const artisanBio = document.querySelector('.profile-info p');
      if(artisanBio) artisanBio.textContent = product.bio;
    }
  }

  // --- Filter & Search (Collections Page) ---
  const filterPills = document.querySelectorAll('.pill[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  const searchInput = document.querySelector('.search-input');
  
  const applyFiltersAndSearch = () => {
    const activePill = document.querySelector('.pill.active');
    const filterValue = activePill ? activePill.getAttribute('data-filter') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('h3').textContent.toLowerCase();
      
      const matchesCategory = filterValue === 'all' || cardCategory === filterValue;
      const matchesSearch = cardTitle.includes(searchQuery);
      
      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (filterPills.length > 0 && productCards.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', function() {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        applyFiltersAndSearch();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndSearch);
  }

  // --- Sorting (Collections Page) ---
  const sortSelect = document.getElementById('sort-select');
  const productGrid = document.getElementById('product-grid');
  
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', function() {
      const cardsArray = Array.from(productCards);
      const val = this.value;
      
      cardsArray.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        if (val === 'low') return priceA - priceB;
        if (val === 'high') return priceB - priceA;
        return 0; // newest/default
      });
      
      productGrid.innerHTML = '';
      cardsArray.forEach(card => productGrid.appendChild(card));
      // Re-apply filters after sorting
      applyFiltersAndSearch();
    });
  }

  // --- Global Product Card Href Setup ---
  const productCardsAll = document.querySelectorAll('.product-card');
  productCardsAll.forEach(card => {
    const titleEl = card.querySelector('.product-info h3');
    if (titleEl) {
      const titleText = titleEl.textContent.trim().toLowerCase();
      let id = '';
      if (titleText.includes('figurine')) id = 'figurine-pendant';
      else if (titleText.includes('earring')) id = 'earrings';
      else if (titleText.includes('necklace')) id = 'necklace';
      else if (titleText.includes('choker')) id = 'choker';
      else if (titleText.includes('pendant')) id = 'pendant';
      else if (titleText.includes('deer')) id = 'deer';
      else if (titleText.includes('durga')) id = 'durga-mask';
      else if (titleText.includes('key')) id = 'key-holder';
      else if (titleText.includes('peacock')) id = 'peacock-pen-stand';
      else if (titleText.includes('musician')) id = 'the-musicians';
      else if (titleText.includes('nandi')) id = 'nandi-maharaj';
      else if (titleText.includes('elephant')) id = 'elephant';
      
      if (id) {
        card.href = `product.html?id=${id}`;
      }
    }
  });

  // --- Contact Page Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Transmitting...';
      setTimeout(() => {
        btn.textContent = 'Transmission Successful';
        btn.style.backgroundColor = '#1A1008';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }

});

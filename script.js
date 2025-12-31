// Load products from products.js
let products = typeof productsData !== 'undefined' ? productsData : [];

// Sidebar Navigation
const categoryItems = document.querySelectorAll(".category-item");
const pages = document.querySelectorAll(".page");

categoryItems.forEach((item) => {
  item.addEventListener("click", function () {
    const target = this.getAttribute("data-target");
    categoryItems.forEach((cat) => cat.classList.remove("active"));
    this.classList.add("active");
    pages.forEach((page) => page.classList.remove("active"));
    document.getElementById(target).classList.add("active");
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("active");
      document.getElementById("sidebarOverlay").classList.remove("active");
      const menuIcon = document.getElementById('menuToggle').querySelector('i');
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    }
  });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuIcon = menuToggle.querySelector('i');

function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
  
  if (sidebar.classList.contains('active')) {
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
  } else {
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
}

menuToggle.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

// Close sidebar on window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
});

// Slider Scroll Function
document.querySelectorAll('.scroll-btn').forEach((btn, index) => {
  btn.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const slider = document.getElementById(targetId);
    const isNext = this.querySelector('.fa-chevron-left');
    
    if (slider) {
      slider.scrollLeft += isNext ? -350 : 350;
    }
  });
});

// Filter & Sort Functions
function applyFilters(list) {
  let result = [...list];
  const priceInput = document.getElementById("filterPrice");
  const sortSelect = document.getElementById("sortSelect");
  const priceLimit = Number(priceInput.value);
  const sortValue = sortSelect.value;

  if (priceInput.value.trim() !== "" && priceLimit > 0) {
    result = result.filter((p) => (p.discountPrice || p.price) <= priceLimit);
  }

  if (sortValue === "low") {
    result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortValue === "high") {
    result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  }

  return result;
}

// Get image path
function getImagePath(imageName) {
  if (!imageName) return './public/placeholder.jpg';
  
  // Remove any leading './' or '/' or 'public/'
  imageName = imageName.replace(/^(\.\/|\/|public\/)+/, '');
  
  // Return the path to the public folder
  return './public/' + imageName;
}

// Load Products into Slider
function loadSliderProducts(sliderId, filterFn) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  
  slider.innerHTML = "";
  const filtered = applyFilters(products).filter(filterFn);

  if (filtered.length === 0) {
    slider.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--gray-500); width: 100%;">لا توجد منتجات متاحة</div>';
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    const discount = p.discountPrice 
      ? `<div class="discount-badge">-${Math.round(((p.price - p.discountPrice) / p.price) * 100)}%</div>` 
      : "";
    
    const priceHTML = p.discountPrice
      ? `<span class="new-price">${p.discountPrice}$</span><span class="old-price">${p.price}$</span>`
      : `<span class="new-price">${p.price}$</span>`;

    const imagePath = getImagePath(p.images && p.images[0] ? p.images[0] : '');

    card.innerHTML = `
      ${discount}
      <img src="${imagePath}" class="product-img" alt="${p.name}" onerror="this.src='./public/placeholder.jpg'">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.shortDesc}</p>
        <div class="product-price">${priceHTML}</div>
        <div class="actions">
          <button class="details-btn" data-id="${p.id}">عرض التفاصيل</button>
          <div class="save-btn ${p.saved ? "active" : ""}" data-id="${p.id}">❤</div>
        </div>
      </div>
    `;

    card.querySelector(".details-btn").addEventListener("click", () => openProductModal(p.id));
    card.querySelector(".save-btn").addEventListener("click", function() {
      toggleSave(this);
    });

    slider.appendChild(card);
  });
}

// Refresh All Sliders
function refreshAllSliders() {
  loadSliderProducts("sliderNew", (p) => true);
  loadSliderProducts("sliderFeatures", (p) => p.featured === "نعم");
  loadSliderProducts("sliderOffers", (p) => p.discountPrice);
  
  // Men's products
  loadSliderProducts("sliderSetsMan", (p) => p.category === "رجل" && p.type === "لبس");
  loadSliderProducts("sliderShoesMan", (p) => p.category === "رجل" && p.type === "حذاء");
  loadSliderProducts("sliderAccessoriesMan", (p) => p.category === "رجل" && p.type === "اكسسوارات");
  
  // Women's products
  loadSliderProducts("sliderSetsWomen", (p) => p.category === "انثى" && p.type === "لبس");
  loadSliderProducts("sliderShoesWomen", (p) => p.category === "انثى" && p.type === "حذاء");
  loadSliderProducts("sliderAccessoriesWomen", (p) => p.category === "انثى" && p.type === "اكسسوارات");
  
  // Children's products
  loadSliderProducts("sliderSetsChild", (p) => p.category === "اطفال" && p.type === "لبس");
  loadSliderProducts("sliderShoesChild", (p) => p.category === "اطفال" && p.type === "حذاء");
  loadSliderProducts("sliderAccessoriesChild", (p) => p.category === "اطفال" && p.type === "اكسسوارات");
  
  // Accessories
  loadSliderProducts("sliderAccessoriesFashion", (p) => p.type === "اكسسوارات" && p.group === "موضة");
  loadSliderProducts("sliderAccessoriesHours", (p) => p.type === "اكسسوارات" && p.group === "ساعات");
  loadSliderProducts("sliderAccessoriesGlass", (p) => p.type === "اكسسوارات" && p.group === "نضارات");
  loadSliderProducts("sliderAccessoriesOther", (p) => p.type === "اكسسوارات" && p.group === "غيرها");
  
  // Saved products
  loadSliderProducts("sliderSaves", (p) => p.saved === true);
}

document.getElementById("applyPriceFilter").addEventListener("click", refreshAllSliders);
document.getElementById("sortSelect").addEventListener("change", refreshAllSliders);

// Save/Unsave Product
function syncSaveButtons(productId, state) {
  document.querySelectorAll(`.save-btn[data-id="${productId}"]`).forEach((btn) => {
    btn.classList.toggle("active", state);
  });
}

function toggleSave(elm) {
  const id = Number(elm.getAttribute("data-id"));
  const product = products.find((p) => p.id === id);
  if (!product) return;
  
  product.saved = !product.saved;
  syncSaveButtons(id, product.saved);
  loadSliderProducts("sliderSaves", (p) => p.saved === true);
}

// Product Modal
let currentImages = [];
let currentIndex = 0;
let currentProduct = null;

function openProductModal(id) {
  currentProduct = products.find((p) => p.id == id);
  if (!currentProduct) return;

  document.getElementById("modalName").textContent = currentProduct.name;
  document.getElementById("modalShortDesc").textContent = currentProduct.shortDesc;
  document.getElementById("modalLongDesc").textContent = currentProduct.longDesc;

  const priceHTML = currentProduct.discountPrice
    ? `<span class="new-price">${currentProduct.discountPrice}$</span><span class="old-price">${currentProduct.price}$</span>`
    : `<span class="new-price">${currentProduct.price}$</span>`;
  document.getElementById("modalPrice").innerHTML = priceHTML;

  // Sizes
  const sizesHTML = currentProduct.size && currentProduct.size.length > 0
    ? currentProduct.size.map((s) => `<span>${s}</span>`).join("")
    : '<span>غير محدد</span>';
  document.getElementById("modalSizes").innerHTML = sizesHTML;

  // Colors
  const colorsHTML = currentProduct.colors && currentProduct.colors.length > 0
    ? currentProduct.colors.map((c) => `<span>${c}</span>`).join("")
    : '<span>غير محدد</span>';
  document.getElementById("modalColors").innerHTML = colorsHTML;

  // Images
  currentImages = currentProduct.images || [];
  currentIndex = 0;
  updateSlider();

  const thumbs = document.getElementById("modalThumbs");
  thumbs.innerHTML = "";
  
  if (currentImages.length > 0) {
    currentImages.forEach((img, i) => {
      const t = document.createElement("img");
      t.src = getImagePath(img);
      t.alt = `صورة ${i + 1}`;
      t.onerror = function() {
        this.src = './public/placeholder.jpg';
      };
      if (i === 0) t.classList.add("active");
      t.onclick = () => {
        currentIndex = i;
        updateSlider();
      };
      thumbs.appendChild(t);
    });
  }

  const saveBtn = document.getElementById("modalSaveBtn");
  saveBtn.classList.toggle("active", currentProduct.saved);
  saveBtn.onclick = toggleModalSave;

  const message = `مرحباً، أريد الاستفسار عن المنتج: ${currentProduct.name}`;
  document.getElementById("modalWhatsappBtn").href = `https://wa.me/9647700000000?text=${encodeURIComponent(message)}`;

  document.getElementById("productModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function updateSlider() {
  const mainImage = document.getElementById("mainModalImage");
  
  if (currentImages.length > 0) {
    mainImage.src = getImagePath(currentImages[currentIndex]);
    mainImage.onerror = function() {
      this.src = './public/placeholder.jpg';
    };
  } else {
    mainImage.src = './public/placeholder.jpg';
  }
  
  const thumbs = document.querySelectorAll("#modalThumbs img");
  thumbs.forEach((img) => img.classList.remove("active"));
  if (thumbs.length > 0 && thumbs[currentIndex]) {
    thumbs[currentIndex].classList.add("active");
  }
}

function nextImage() {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateSlider();
}

function prevImage() {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateSlider();
}

function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
  document.body.style.overflow = "auto";
}

function toggleModalSave() {
  if (!currentProduct) return;
  
  currentProduct.saved = !currentProduct.saved;
  this.classList.toggle("active", currentProduct.saved);
  syncSaveButtons(currentProduct.id, currentProduct.saved);
  loadSliderProducts("sliderSaves", (p) => p.saved === true);
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProductModal();
  }
});

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Products loaded:", products.length);
  refreshAllSliders();
});
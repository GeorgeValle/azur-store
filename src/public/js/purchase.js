document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('products-root');
    const feedback = document.getElementById('purchase-feedback');
  
    if (!root) return;
  
    const userId = root.dataset.userId;
  
    const setFeedback = (message, type = 'success') => {
      feedback.innerHTML = `
        <div class="alert alert-${type} shadow-sm" role="alert">
          ${message}
        </div>
      `;
    };
  
    const renderProducts = (products = []) => {
      if (!products.length) {
        root.innerHTML = `
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <p class="mb-0 text-muted">No hay productos cargados.</p>
              </div>
            </div>
          </div>
        `;
        return;
      }
  
      root.innerHTML = products.map((product) => `
        <div class="col-sm-6 col-lg-4">
          <article class="card h-100 border-0 shadow-sm">
            <img
              src="${product.thumbnail}"
              alt="${product.name}"
              class="card-img-top"
            >
  
            <div class="card-body d-flex flex-column">
              <span class="badge text-bg-light align-self-start mb-2">${product.category}</span>
              <h4 class="h5 card-title mb-2">${product.name}</h4>
              <p class="card-text text-muted flex-grow-1">${product.description}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <strong class="fs-5">$${product.price}</strong>
                <span class="text-muted small">Stock: ${product.stock}</span>
              </div>
            </div>
  
            <div class="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
              <button
                class="btn btn-dark w-100 js-add-to-cart"
                data-product-id="${product._id}"
                type="button"
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        </div>
      `).join('');
    };
  
    const loadProducts = async () => {
      root.innerHTML = `
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <p class="mb-0 text-muted">Cargando productos...</p>
            </div>
          </div>
        </div>
      `;
  
      try {
        const response = await fetch('/products');
        const payload = await response.json();
  
        if (!response.ok) {
          throw new Error(payload.message || 'No se pudieron obtener los productos');
        }
  
        renderProducts(payload.data || []);
      } catch (error) {
        root.innerHTML = `
          <div class="col-12">
            <div class="alert alert-danger shadow-sm mb-0" role="alert">
              ${error.message}
            </div>
          </div>
        `;
      }
    };
  
    root.addEventListener('click', async (event) => {
      const button = event.target.closest('.js-add-to-cart');
  
      if (!button) return;
  
      const { productId } = button.dataset;
  
      button.disabled = true;
      button.textContent = 'Agregando...';
  
      try {
        const response = await fetch(`/carts/${userId}/products/${productId}`, {
          method: 'PUT',
        });
  
        const payload = await response.json();
  
        if (!response.ok) {
          throw new Error(payload.message || 'No se pudo agregar el producto');
        }
  
        setFeedback('Producto agregado al carrito ✨');
      } catch (error) {
        setFeedback(error.message, 'danger');
      } finally {
        button.disabled = false;
        button.textContent = 'Agregar al carrito';
      }
    });
  
    loadProducts();
  });
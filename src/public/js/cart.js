document.addEventListener('DOMContentLoaded', () => {
    const page = document.getElementById('cart-page');
    const root = document.getElementById('cart-root');
    const feedback = document.getElementById('cart-feedback');
    const totalItemsElement = document.getElementById('cart-total-items');
    const totalPriceElement = document.getElementById('cart-total-price');
    const cleanButton = document.getElementById('clean-cart');
    const payButton = document.getElementById('pay');
  
    if (!page || !root) return;
  
    const userId = page.dataset.userId;
  
    const setFeedback = (message, type = 'success') => {
      feedback.innerHTML = `
        <div class="alert alert-${type} shadow-sm" role="alert">
          ${message}
        </div>
      `;
    };
  
    const setTotals = (cart = null) => {
      totalItemsElement.textContent = cart?.totalItems ?? 0;
      totalPriceElement.textContent = cart?.totalPrice ?? 0;
    };
  
    const renderCart = (cart = null) => {
        const products = (cart?.products || []).flat(Infinity).filter(
            (product) => product && typeof product === 'object' && !Array.isArray(product)
          );
  
      setTotals(cart);
  
      if (!products.length) {
        root.innerHTML = `
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <p class="mb-0 text-muted">El carrito está vacío.</p>
              </div>
            </div>
          </div>
        `;
        return;
      }
  
      root.innerHTML = products.map((product) => `
        <div class="col-12">
          <article class="card border-0 shadow-sm">
            <div class="row g-0 align-items-center">
              <div class="col-md-3">
                <img
                  src="${product.thumbnail}"
                  alt="${product.name}"
                  class="img-fluid rounded-start w-100 h-100"
                  style="object-fit: cover; min-height: 220px;"
                >
              </div>
  
              <div class="col-md-9">
                <div class="card-body p-4">
                  <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div>
                      <span class="badge text-bg-light mb-2">${product.category}</span>
                      <h3 class="h5 mb-2">${product.name}</h3>
                      <p class="text-muted mb-2">${product.description}</p>
                      <p class="mb-1"><strong>Precio:</strong> $${product.price}</p>
                      <p class="mb-0"><strong>Cantidad:</strong> ${product.quantity ?? 1}</p>
                    </div>
  
                    <div class="d-flex align-items-start">
                      <button
                        class="btn btn-outline-danger js-remove-product"
                        data-product-id="${product._id}"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      `).join('');
    };
  
    const loadCart = async () => {
      root.innerHTML = `
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <p class="mb-0 text-muted">Cargando carrito...</p>
            </div>
          </div>
        </div>
      `;
  
      try {
        const response = await fetch(`/carts/user/${userId}`);
  
        if (response.status === 404) {
          renderCart(null);
          return;
        }
  
        const payload = await response.json();
  
        if (!response.ok) {
          throw new Error(payload.message || 'No se pudo obtener el carrito');
        }
  
        renderCart(payload.data || null);
      } catch (error) {
        root.innerHTML = `
          <div class="col-12">
            <div class="alert alert-danger shadow-sm mb-0" role="alert">
              ${error.message}
            </div>
          </div>
        `;
        setTotals(null);
      }
    };
  
    root.addEventListener('click', async (event) => {
      const button = event.target.closest('.js-remove-product');
  
      if (!button) return;
  
      const { productId } = button.dataset;
  
      button.disabled = true;
      button.textContent = 'Eliminando...';
  
      try {
        const response = await fetch(`/carts/${userId}/products/${productId}`, {
          method: 'DELETE',
        });
  
        const payload = await response.json();
  
        if (!response.ok) {
          throw new Error(payload.message || 'No se pudo eliminar el producto');
        }
  
        setFeedback('Producto eliminado del carrito.');
        renderCart(payload.data || null);
      } catch (error) {
        setFeedback(error.message, 'danger');
      }
    });
  
    cleanButton?.addEventListener('click', async () => {
      cleanButton.disabled = true;
      cleanButton.textContent = 'Vaciando...';
  
      try {
        const response = await fetch(`/carts/${userId}`, {
          method: 'DELETE',
        });
  
        const payload = await response.json();
  
        if (!response.ok) {
          throw new Error(payload.message || 'No se pudo vaciar el carrito');
        }
  
        setFeedback('Carrito vaciado correctamente.');
        renderCart(null);
      } catch (error) {
        setFeedback(error.message, 'danger');
      } finally {
        cleanButton.disabled = false;
        cleanButton.textContent = 'Vaciar carrito';
      }
    });
  
    payButton?.addEventListener('click', async () => {
      payButton.disabled = true;
      payButton.textContent = 'Procesando...';
  
      try {
        const response = await fetch(`/orders/${userId}`, {
          method: 'POST',
        });
  
        const payload = await response.json();
  
        if (!response.ok) {
            throw new Error('No se pudo procesar el pago');
          }
  
        const order = payload.data;
  
        root.innerHTML = `
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <span class="badge text-bg-success mb-3">Orden generada</span>
                <h3 class="h4 mb-3">Tu compra fue procesada correctamente 🎉</h3>
                <p class="mb-2"><strong>Número de orden:</strong> ${order.numOrder}</p>
                <p class="mb-2"><strong>Total de items:</strong> ${order.totalItems}</p>
                <p class="mb-0"><strong>Total pagado:</strong> $${order.totalPrice}</p>
              </div>
            </div>
          </div>
        `;
  
        setTotals(null);
        setFeedback('La orden fue creada y el carrito se vació automáticamente.');
    } catch (error) {
        setFeedback('No se pudo procesar el pago. Intentá nuevamente.', 'danger');
      } finally {
        payButton.disabled = false;
        payButton.textContent = 'Pagar';
      }
    });
  
    loadCart();
  });
async function agregarAlCarrito(productId) {
    try {
        const response = await fetch(`/api/carts/current/product/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: 1 }),
        });

        if (!response.ok) {
            throw new Error("Error al agregar el producto al carrito");
        }

        const carritoActualizado = await response.json();
        console.log("Carrito actualizado:", carritoActualizado);
    } catch (error) {
        console.error("Error:", error);
    }
}

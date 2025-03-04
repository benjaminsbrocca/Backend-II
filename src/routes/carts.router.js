import express from "express";
const router = express.Router();
import passport from "passport";
import CartManager from "../managers/cart-manager.js";
const cartManager = new CartManager();
import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js";



router.get("/", async (req, res) => {
    try {
        const carritos = await CartModel.find({});
        res.json(carritos);
    } catch (error) {
        console.error("Error al obtener los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});





router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const carrito = await CartModel.findById(cartId);
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        carrito.products = [];

        await carrito.save();

        res.json({ message: "Todos los productos han sido eliminados del carrito" });

    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const nuevosProductos = req.body.products;
    try {
        const carrito = await CartModel.findById(cartId);
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        carrito.products = nuevosProductos;

        await carrito.save();
        res.json({ message: "Carrito actualizado exitosamente" });

    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



router.post(
    "/current/product/:productId",
    passport.authenticate("current", { session: false }),
    async (req, res) => {
      const userId = req.user._id;
      const { productId } = req.params; 
      const { quantity = 1 } = req.body; 
  
      try {
       
        const usuario = await UserModel.findById(userId).populate("cart");
        if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
  
        
        const cartId = usuario.cart;
        if (!cartId) {
          return res.status(404).json({ error: "El usuario no tiene un carrito asociado" });
        }
  
       
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
  
        res.json({ message: "Producto agregado al carrito", cart: carritoActualizado });

      } catch (error) {

        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        
      }
    }
  );




export default router;

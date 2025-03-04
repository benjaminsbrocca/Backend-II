import express from "express";
const router = express.Router();
import CartModel from "../models/cart.model.js";
import ProductManager from "../managers/product-manager.js";
import CartManager from "../managers/cart-manager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();



router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 3, sort, query } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit),
         sort,
         query
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();

         return { _id: producto._id, ...rest };
      });
      console.log("Productos para renderizar:", nuevoArray);

      res.render("products", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);

      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});



router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const carrito = await cartManager.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("carts", { productos: productosEnCarrito });

   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});




router.get("/carts", async (req, res) => {
   try {
      const carritos = await CartModel.find().populate('products.product', '_id title price');

      const carritosConProductos = carritos.map(carrito => ({
         _id: carrito._id,
         productos: carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
         }))
      }));

      res.render("carts", { productos: carritosConProductos });

   } catch (error) {
      console.error("Error al obtener los carritos", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});


router.get("/login", (req, res) => {
   res.render("login");
})



router.get("/register", (req, res) => {
   res.render("register"); 
})


export default router;
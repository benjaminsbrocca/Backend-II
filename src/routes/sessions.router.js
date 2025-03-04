import { Router } from "express";
import UserModel from "../models/user.model.js";
import CartManager from "../managers/cart-manager.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/util.js";

const router = Router();
const cartManager = new CartManager();

 

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    try {

        const existeUsuario = await UserModel.findOne({ email });

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }


        const nuevoUsuario = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });


        const nuevoCarrito = await cartManager.crearCarrito();
        nuevoUsuario.cart = nuevoCarrito._id;

        await nuevoUsuario.save();


        const token = jwt.sign({ first_name: nuevoUsuario.first_name, last_name: nuevoUsuario.last_name, email: nuevoUsuario.email, role: nuevoUsuario.role }, "coderhouse", { expiresIn: "1h" });
        console.log(token);


        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor.");
    }

})



router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {

        const usuarioEncontrado = await UserModel.findOne({ email });


        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no válido.");
        }


        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta.");
        }


        const token = jwt.sign({ first_name: usuarioEncontrado.first_name, last_name: usuarioEncontrado.last_name, email: usuarioEncontrado.email, role: usuarioEncontrado.role }, "coderhouse", { expiresIn: "1h" });
        console.log(token);


        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        res.status(500).send("Error interno del servidor.");
    }
})



router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    res.render("home", { first_name: req.user.first_name, last_name: req.user.last_name });
})



router.post("/logout", (req, res) => {

    res.clearCookie("coderCookieToken");

    res.redirect("/login");
})



router.get("/admin", passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).send("Acceso Denegado.");
    }
    res.render("admin");
})



export default router; 
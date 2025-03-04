import mongoose from "mongoose";


mongoose.connect("mongodb+srv://bsfrizzo:Holabackend12@cluster0.somyw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Conectado a MongoDB")
    })
    .catch((error) => {
        console.log("Tenemos un error: ", error)
    })
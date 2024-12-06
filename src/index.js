import express from 'express';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
config();

const PORT = process.env.PORT || 3000;

app.get("/api", (req, res) => {
    res.send("Selamat datang di API Aku");
});


app.get("/products", async (req, res) => {
    const products = await prisma.product.findMany()
    res.send(products)
})



//findproductsbyid

app.get("/products/:id", async (req, res) => {
    const product = await prisma.product.findUnique(
        {
            where: { id: parseInt(req.params.id) }
        });
    res.send(product)
})


//updateproducts
app.post("/products", async (req, res) => {
    const newProducts = req.body;

    const product = await prisma.product.create({
        data: {
            name: newProducts.name,
            description: newProducts.description,
            image: newProducts.image,
            price: newProducts.price,
        }
    });
    res.send({
        data: product,
        message: "Product created successfully"
    })
})

//DELETE FROM product WHERE id = {productId}
//deleteProduct
app.delete("/products/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.delete({
        where: { id: productId }
    });
    res.send({
        data: product,
        message: "Product deleted successfully"
    })
})

//edit data
app.put("/products/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    const productData = req.body;

    if(!productData.image && productData.price && productData.description && productData.name){
        // throw new Error("Fild mising")
        res.status(400).send("Some fields are missing")
        return;
    }

    const updateproducts = await prisma.product.update({
        where: { id: productId },
        data: {
            name: productData.name,
            description: productData.description,
            image: productData.image,
            price: productData.price,
        }
    });
    res.send({
        data: updateproducts,
        message: "edit product successfully"
    })
})


app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});

const express = require("express");
const stripe = require("stripe")("PRIVATE KEY STRIPE");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/config", (req, res) => {
    res.json({
        publishableKey: "PUBLIC KEY STRIPE",
    });
});

app.post("/create-checkout-session", async(req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["blik", "card"],
            line_items: req.body.items.map((item) => ({
                price_data: {
                    currency: "pln",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["PL"],
            },
            success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
            cancel_url: `${process.env.BASE_URL}/cancel`,
        });
        res.json({ id: session.id });
    } catch (err) {
        res.status(500).send("Błąd tworzenia sesji checkout: " + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie: ${PORT}`);
});
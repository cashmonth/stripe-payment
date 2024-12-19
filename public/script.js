fetch("/config")
    .then((response) => response.json())
    .then((data) => {
        const stripe = Stripe(data.publishableKey);

        document.querySelectorAll(".checkout-button").forEach((button) => {
            button.addEventListener("click", async(event) => {
                const productName = event.target.getAttribute("data-product-name");
                const productPrice = event.target.getAttribute("data-product-price");
                const productQuantity = event.target.getAttribute("data-product-quantity");

                const response = await fetch("/create-checkout-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: [{
                            name: productName,
                            price: parseInt(productPrice),
                            quantity: parseInt(productQuantity),
                        }]
                    })
                });

                if (!response.ok) {
                    console.error("Błąd po stronie serwera:", response.status);
                    return;
                }

                const session = await response.json();
                stripe.redirectToCheckout({ sessionId: session.id })
            });
        });
    })
    .catch((error) => {
        console.error("Płatności Stripe wyjebały się:", error);
    });
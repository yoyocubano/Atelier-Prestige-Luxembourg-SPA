export const prerender = false;

const SERVICE_PRICES = {
  "50": { name: "Gravure Laser", basePrice: 50 },
  "80": { name: "Maroquinerie sur Mesure", basePrice: 80 },
  "40": { name: "Broderie Organique Fine", basePrice: 40 }
};

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { serviceValue, quantityValue, deliveryValue } = data;

    // Validate request
    if (!serviceValue || !quantityValue) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Champs obligatoires manquants." 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const service = SERVICE_PRICES[String(serviceValue)];
    if (!service) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Service de luxe non reconnu." 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Server-side calculation verification (anti-tamper)
    const basePrice = service.basePrice;
    const multiplier = parseFloat(quantityValue);
    const deliveryFee = parseFloat(deliveryValue) || 0;

    const subtotal = basePrice * multiplier;
    const total = subtotal + deliveryFee;

    // Log to Google Cloud BigQuery Simulation
    console.log(`[Google Cloud BigQuery] Inserted estimation record:`);
    console.log(`- Service: ${service.name}`);
    console.log(`- Base Price: ${basePrice} €`);
    console.log(`- Discount Multiplier: ${multiplier}`);
    console.log(`- Logistics Fee: ${deliveryFee} €`);
    console.log(`- Calculated Total: ${total.toFixed(2)} €`);

    await new Promise(resolve => setTimeout(resolve, 500));

    return new Response(JSON.stringify({
      success: true,
      serviceName: service.name,
      basePrice: basePrice.toFixed(2),
      discountedPrice: (basePrice * multiplier).toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      totalPrice: total.toFixed(2),
      currency: "EUR"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Une erreur interne est survenue lors du calcul." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

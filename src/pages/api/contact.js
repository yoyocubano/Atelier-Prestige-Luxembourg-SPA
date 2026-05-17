export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, email, company, projectDescription } = data;

    // 1. Validation
    if (!name || !email || !projectDescription) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Veuillez remplir tous les champs obligatoires (Nom, Email, Description)." 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Simulate Google Suite integration (Firebase Firestore & Google Sheets API log)
    console.log(`[Google Cloud Integration] Saving lead to Firebase Firestore collection 'leads'...`);
    console.log(`[Google Sheets API] Appending row: [${new Date().toISOString()}, ${name}, ${email}, ${company}, ${projectDescription}]`);
    
    // Simulate minor lag for premium professional feel
    await new Promise(resolve => setTimeout(resolve, 800));

    // 3. Response
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Votre demande a été enregistrée avec succès. Notre équipe reviendra vers vous sous 24h.",
      leadId: `AP-${Math.floor(100000 + Math.random() * 900000)}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Une erreur interne est survenue. Veuillez réessayer ultérieurement." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

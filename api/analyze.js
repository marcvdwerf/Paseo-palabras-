export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!body.image) {
      return new Response(JSON.stringify({ error: "Geen foto ontvangen." }), { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Identificeer het voorwerp op de afbeelding en geef het Spaanse woord + contextzin." },
              {
                type: "image_url",
                image_url: {
                    url: body.image
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const output = data.choices?.[0]?.message?.content || "Geen resultaat.";

    return new Response(JSON.stringify({ result: output }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

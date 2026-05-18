import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant inside a futuristic AI social media platform.",
        },

        {
          role: "user",
          content: body.message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {

    return Response.json({
      reply: "AI server error.",
    });
  }
}
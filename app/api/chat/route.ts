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
          content: `
You are an advanced AI interest analyzer.

Analyze the user's posts deeply.

Find:
- hobbies
- interests
- personality
- habits
- emotional patterns
- lifestyle
- shopping interests
- best accessories/products
- ad targeting categories
- monthly behavior trends

Give response in beautiful point format.
          `,
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

    console.log(error);

    return Response.json({
      reply: "AI analysis failed",
    });

  }

}
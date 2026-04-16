export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.
Include:
1. Recipe name
2. Short description
3. Ingredients list
4. Step-by-step instructions`;

  return {
    resourcePath: "/model/us.anthropic.claude-sonnet-4-20250514-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return {
      body: "",
      error: ctx.error.message || JSON.stringify(ctx.error),
    };
  }

  const rawBody = ctx.result?.body;
  const parsedBody = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;

  const text = parsedBody?.content?.[0]?.text;

  if (!text) {
    return {
      body: "",
      error: `Unexpected Bedrock response: ${JSON.stringify(parsedBody)}`,
    };
  }

  return {
    body: text,
    error: "",
  };
}
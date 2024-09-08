// api/completion
import { OpenAIApi, Configuration } from "openai-edge";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
//
// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  // extrat the prompt from the body
  const { prompt } = await req.json();
  // take latest 30 charcters and pass as prompt

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    // prompt: prompt,
    messages: [
      {
        role: "system",
        content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences
              The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
          AI is a well-behaved and well-mannered individual.
          AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
      },
      {
        role: "user",
        content: `I am writing a piece of text in a notion text editor app. 
          Help me complete my sentence here: ##${prompt}##
          Keep the tone of the text consistent with the rest of the text. Keep the response short and sweet. Remember don't repeat my prompt, 
          it's supposed to be sentence autocomplete. Try to be grammatically correct when completeing my sentence.`,
      },
    ],
  });

  return result.toDataStreamResponse();

  //   const response = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences
  //             The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
  //         AI is a well-behaved and well-mannered individual.
  //         AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
  //       },
  //       {
  //         role: "user",
  //         content: `I am writing a piece of text in a notion text editor app.
  //         Help me complete my train of thought here: ##${prompt}##
  //         Keep the tone of the text consistent with the rest of the text. Keep the response short and sweet.`,
  //       },
  //     ],
  //     stream: true,
  //   });

  //   return new
}

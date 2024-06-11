const OpenAI = require("openai");
const { FSDB } = require("file-system-db");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const OPENAI_MODEL = "gpt-4o";
const ask = async (chatId, message) => {
  const db = new FSDB(`./db/${chatId}.json`, false);
  const messages = db.get("messages") || [];

  const newMessage = {
    role: "user",
    content: [],
  };
  if (message.text) {
    newMessage.content.push({ type: "text", text: message.text });
  }
  if (message.image_url) {
    newMessage.content.push({
      type: "image_url",
      image_url: { url: message.image_url },
    });
  }
  messages.push(newMessage);
  const completionResponse = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
  });
  const response = completionResponse.choices[0].message;
  messages.push(response);
  db.set("messages", messages);
  return response;
};
module.exports = { ask };

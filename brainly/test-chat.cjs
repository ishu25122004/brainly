const { generateChatResponse } = require('./dist/ai.js');
async function run() {
    try {
        const res = await generateChatResponse('What is a flag register?', ['Doc 1: The flag register is cool']);
        console.log("Success:", res);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();

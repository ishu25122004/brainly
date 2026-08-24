const { universalExtract } = require('./dist/extractor.js'); 
const { enrichContentWithAI } = require('./dist/ai.js'); 
const { ContentModel } = require('./dist/db.js');

async function run() { 
    // Wait for mongoose to connect (initiated in db.js)
    await new Promise(r => setTimeout(r, 2000));
    console.log("Starting PDF fix script...");
    const docs = await ContentModel.find({type: 'document'}); 
    for (let d of docs) { 
        if (!d.content || d.content.length === 0 || d.content.startsWith('http')) { 
            console.log('Fixing:', d.title, d.link); 
            try {
                const text = await universalExtract('document', d.link); 
                if (text && text.length > 0) { 
                    await ContentModel.updateOne({_id: d._id}, {$set: {content: text}}); 
                    await enrichContentWithAI(d._id.toString(), d.title, text, 'document'); 
                    console.log('Successfully fixed and enriched', d.title); 
                } else {
                    console.log('Extracted text was empty for', d.title);
                }
            } catch (e) {
                console.error("Error on", d.title, e);
            }
        } 
    } 
    console.log('Done'); 
    process.exit(0); 
} 
run();

import mongoose from "mongoose";
import { ContentModel } from "./db.js";
import { generateEmbedding } from "./ai.js";

async function backfill() {
    console.log("Connecting to database...");
    
    // The connection is handled in db.ts, so importing it above is enough.
    // Give it a moment to connect.
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Finding content without embeddings...");
    const contents = await ContentModel.find({ embedding: { $exists: false } });
    
    console.log(`Found ${contents.length} items to backfill.`);

    let count = 0;
    for (const content of contents) {
        try {
            const textToEmbed = `Title: ${content.title}. Summary: ${content.summary}`;
            const embedding = await generateEmbedding(textToEmbed);
            
            if (embedding) {
                await ContentModel.updateOne({ _id: content._id }, { $set: { embedding } });
                count++;
                console.log(`[${count}/${contents.length}] Successfully generated embedding for: ${content.title}`);
            } else {
                console.log(`Failed to generate embedding for: ${content.title}`);
            }
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            console.error(`Error processing ${content._id}:`, e);
        }
    }

    console.log(`Backfill complete. Updated ${count} items.`);
    process.exit(0);
}

backfill();

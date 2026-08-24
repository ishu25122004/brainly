const mongoose = require('mongoose');

async function migrate() {
    await mongoose.connect("mongodb+srv://kanishklodha25_db_user:naG3yilxf0Vo0X9x@cluster0.agavqo6.mongodb.net/");
    
    // We need to access the database directly to move fields
    const db = mongoose.connection.db;
    const contents = await db.collection('contents').find({}).toArray();
    
    console.log(`Found ${contents.length} contents. Processing...`);
    let updatedCount = 0;

    for (const doc of contents) {
        // If it's a document or youtube and the content is massive (likely extracted text)
        if (doc.type !== 'note' && doc.content && doc.content.length > 500) {
            console.log(`Migrating content for: ${doc.title} (Length: ${doc.content.length})`);
            
            // Move the content to extractedText, and clear content
            await db.collection('contents').updateOne(
                { _id: doc._id },
                { 
                    $set: { extractedText: doc.content },
                    $unset: { content: "" } 
                }
            );
            updatedCount++;
        }
    }

    console.log(`Successfully migrated ${updatedCount} documents.`);
    process.exit(0);
}

migrate();

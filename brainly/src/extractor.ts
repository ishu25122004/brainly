import axios from 'axios';
import * as cheerio from 'cheerio';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { YoutubeTranscript } from 'youtube-transcript';
import fs from 'fs';
import path from 'path';

export async function extractPDF(fileUrl: string): Promise<string> {
    try {
        const filename = fileUrl.split('/').pop();
        if (!filename) return "";
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            console.error("PDF file not found at", filePath);
            return "";
        }

        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } catch (e) {
        console.error("PDF extraction error:", e);
        return "";
    }
}

export async function extractYouTube(url: string): Promise<string> {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return transcript.map(t => t.text).join(' ');
    } catch (e) {
        console.error("YouTube extraction error:", e);
        return "";
    }
}

export async function extractTweet(url: string): Promise<string> {
    try {
        const response = await axios.get(`https://publish.twitter.com/oembed?url=${url}`);
        const html = response.data.html;
        const $ = cheerio.load(html);
        return $('p').text();
    } catch (e) {
        console.error("Twitter extraction error:", e);
        return "";
    }
}

export async function extractWebpage(url: string): Promise<string> {
    try {
        const response = await axios.get(url, { timeout: 8000 });
        const $ = cheerio.load(response.data);
        
        $('script, style, nav, header, footer, iframe, noscript').remove();
        
        let text = "";
        $('h1, h2, h3, p, article').each((_, el) => {
            const elText = $(el).text().trim();
            if (elText) text += elText + "\n\n";
        });
        
        return text.substring(0, 20000); // Limit length
    } catch (e) {
        console.error("Webpage extraction error:", e);
        return "";
    }
}

export async function universalExtract(type: string, url: string | undefined): Promise<string> {
    if (!url) return "";
    
    if (type === "document" && url.endsWith('.pdf')) {
        return await extractPDF(url);
    }
    
    if (type === "youtube") {
        return await extractYouTube(url);
    }
    
    if (type === "twitter") {
        return await extractTweet(url);
    }
    
    if (type === "link") {
        return await extractWebpage(url);
    }
    
    return "";
}

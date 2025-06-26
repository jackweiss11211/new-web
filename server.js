const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Helper function for human-like delays
const randomDelay = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to create zip file
const createZip = async (files, zipName) => {
    const zip = new AdmZip();
    
    // Add all files to zip
    for (const [filename, content] of Object.entries(files)) {
        zip.addFile(filename, Buffer.from(content, 'binary'));
    }
    
    // Create buffer from zip
    const zipBuffer = zip.toBuffer();
    
    return zipBuffer;
};

// Google Search Handler
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        // Create browser instance
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Navigate to Google with delay
        await page.goto('https://www.google.com', {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        
        // Wait for the search box to be available
        await page.waitForSelector('textarea[name="q"]', { visible: true, timeout: 10000 });
        
        // Add random delay
        await page.waitForTimeout(randomDelay(1000, 3000));
        
        // Type search query with delay
        await page.type('textarea[name="q"]', query, { delay: randomDelay(50, 150) });
        
        // Add random delay before submitting
        await page.waitForTimeout(randomDelay(1000, 3000));
        
        // Submit search
        await page.keyboard.press('Enter');
        
        // Wait for results page
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: 0
        });
        
        // Add random delay before capturing
        await page.waitForTimeout(randomDelay(2000, 5000));
        
        // Wait for results with delay
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: 0
        });
        
        // Add random delay before capturing
        await page.waitForTimeout(randomDelay(2000, 5000));
        
        // Capture HTML
        const html = await page.content();
        
        // Take screenshot
        const screenshot = await page.screenshot({
            fullPage: true,
            type: 'jpeg',
            quality: 80
        });
        
        // Close browser
        await browser.close();
        
        // Create zip file
        const zipBuffer = await createZip({
            'search-results.html': html,
            'screenshot.jpg': screenshot
        }, 'search-results.zip');
        
        // Send response
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=search-results.zip');
        res.send(zipBuffer);
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).json({ error: 'Failed to process search' });
    }
});

// URL Capture Handler
app.post('/api/capture-url', async (req, res) => {
    try {
        const { url } = req.body;
        
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Navigate with delay
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        
        // Add random delay
        await page.waitForTimeout(randomDelay(2000, 5000));
        
        // Capture HTML
        const html = await page.content();
        
        // Take screenshot
        const screenshot = await page.screenshot({
            fullPage: true,
            type: 'jpeg',
            quality: 80
        });
        
        await browser.close();
        
        const zipBuffer = await createZip({
            'page.html': html,
            'screenshot.jpg': screenshot
        }, 'page-capture.zip');
        
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=page-capture.zip');
        res.send(zipBuffer);
    } catch (error) {
        console.error('Error in capture-url:', error);
        res.status(500).json({ error: 'Failed to capture URL' });
    }
});

// Video Download Handler
app.post('/api/download-video', async (req, res) => {
    try {
        const { url } = req.body;
        
        // Get video content
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        
        // Create zip with video
        const zipBuffer = await createZip({
            'video.mp4': Buffer.from(response.data)
        }, 'video.zip');
        
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=video.zip');
        res.send(zipBuffer);
    } catch (error) {
        console.error('Error in download-video:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

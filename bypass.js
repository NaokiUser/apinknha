const express = require('express');
const axios = require('axios');

const app = express();

app.get('/api/bypass', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const apiEndpoints = [
    { 
        endpoint: `https://keybypass.vercel.app/api/fluxus?url=${encodeURIComponent(url)}`,
        validUrl: /^https:\/\/flux\.li\// 
    },
    { 
        endpoint: `https://keybypass.vercel.app/api/mboost?url=${encodeURIComponent(url)}`,
        validUrl: /^https:\/\/mboost\.me/ 
    },
    { 
        endpoint: `https://keybypass.vercel.app/api/paste_drop?url=${encodeURIComponent(url)}`,
        validUrl: /^https:\/\/paste-drop\.com\// 
    },
    { 
        endpoint: `https://keybypass.vercel.app/api/mediafire?url=${encodeURIComponent(url)}`,
        validUrl: /^https:\/\/www\.mediafire\.com\// 
    },
    { 
        endpoint: `https://keybypass.vercel.app/api/relzhub?url=${encodeURIComponent(url)}`,
        validUrl: /relzscript\.xyz/ 
    },
    { 
        endpoint: `https://keybypass.vercel.app/api/delta?url=${encodeURIComponent(url)}`,
        validUrl: /^https:\/\/gateway\.platoboost\.com/ 
    },
    { 
        endpoint: `https://prince-mysticmoth-api.vercel.app/api/linkvertise?link=${encodeURIComponent(url)}&apikey=Triple_0H9BP72`,
        validUrl: /^https:\/\/linkvertise\.com\//
    },
    {
        endpoint: `http://de01-3.uniplex.xyz:5743/trigon?url=${encodeURIComponent(url)}`, // Thêm dấu phẩy ở đây
        validUrl: /^https:\/\/trigonevo\.fun\//
    }
];

    const validEndpoints = apiEndpoints.filter(api => api.validUrl.test(url));

    if (validEndpoints.length === 0) {
        return res.status(400).json({ error: 'Invalid URL for any API' });
    }

    try {
        const results = await Promise.all(
            validEndpoints.map(async (api) => {
                try {
                    const response = await axios.get(api.endpoint);
                    return response.data;
                } catch (error) {
                    console.error(`Error fetching from ${api.endpoint}:`, error.message);
                    return null;
                }
            })
        );

        const key = results.map(result => result?.key).find(key => key);

        if (key) {
            return res.json({ key });
        } else {
            return res.status(404).json({ error: 'No keys found' });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app; // Xuất app để Vercel có thể sử dụng

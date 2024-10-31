const axios = require('axios');

module.exports = async (req, res) => {
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
            endpoint: `http://de01-3.uniplex.xyz:5743/trigon?url=${encodeURIComponent(url)}`,
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
                    console.log(`Response from ${api.endpoint}:`, response.data); // Ghi lại phản hồi
                    return response.data;
                } catch (error) {
                    console.error(`Error fetching from ${api.endpoint}:`, error.message);
                    return null; 
                }
            })
        );

        const key = results.map(result => result?.key || result?.result).find(value => value);

        if (key) {
            return res.json({ key });
        } else {
            return res.status(404).json({ error: 'No keys found' });
        }

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

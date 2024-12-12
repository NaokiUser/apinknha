const express = require('express');
const axios = require('axios');

const app = express();

// Endpoint API
app.get('/api/bypass', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Danh sách các API cần gọi với điều kiện chấp nhận URL
    const apiEndpoints = [
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /^https:\/\/flux\.li\// // Chấp Nhận Url: https://flux.li/ 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /^https:\/\/mboost\.me/ // Chấp Nhận Url: https://mboost.me 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /^https:\/\/paste-drop\.com\// // Chấp Nhận Url: https://paste-drop.com/ 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /^https:\/\/www\.mediafire\.com\// // Chấp Nhận Url: https://www.mediafire.com/ 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /relzscript\.xyz/ // Chấp Nhận Url: relzscript.xyz 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`,
            validUrl: /^https:\/\/gateway\.platoboost\.com/ // Chấp Nhận Url: https://gateway.platoboost.com 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}&apikey=Triple_0H9BP72`,
            validUrl: /^https:\/\/linkvertise\.com\// // Chấp Nhận Url: https://linkvertise.com/ 
        },
        { 
            endpoint: `https://hahabypasser.vercel.app/bypass?url=${encodeURIComponent(url)}`, // Thêm API mới
            validUrl: /^https:\/\/trigonevo\.fun\// // Chấp Nhận Url: https://trigonevo.fun/
        }
    ];

    // Tạo danh sách các API hợp lệ
    const validEndpoints = apiEndpoints.filter(api => api.validUrl.test(url));

    // Kiểm tra xem có API hợp lệ không
    if (validEndpoints.length === 0) {
        return res.status(400).json({ error: 'Invalid URL for any API' });
    }

    try {
        // Gửi yêu cầu đến từng API và lưu trữ kết quả
        const results = await Promise.all(
            validEndpoints.map(async (api) => {
                try {
                    const response = await axios.get(api.endpoint);
                    return response.data; // Giả sử dữ liệu trả về có key hoặc result
                } catch (error) {
                    console.error(`Error fetching from ${api.endpoint}:`, error.message);
                    return null; // Nếu có lỗi, trả về null
                }
            })
        );

        // Lọc ra các kết quả không null và lấy key hoặc result đầu tiên
        const key = results.map(result => result?.key || result?.result).find(value => value);

        if (key) {
            return res.json({ key }); // Trả về key hoặc result đầu tiên tìm được
        } else {
            return res.status(404).json({ error: 'No keys found' });
        }

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Xuất khẩu app cho Vercel
module.exports = app;

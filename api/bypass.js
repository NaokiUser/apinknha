// api/bypass.js
const fetch = require('node-fetch');

async function getBypassResult(url) {
    try {
        // Mã hóa URL và gửi yêu cầu đến API
        const apiUrl = `https://keybypass.vercel.app/api/loot?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        // Kiểm tra xem phản hồi có thành công không
        if (!response.ok) throw new Error("API Offline Or Unsupported Link");

        // Phân tích phản hồi JSON
        const data = await response.json();

        // Tạo đối tượng kết quả để trả về
        return {
            description: {
                fields: [
                    { name: "Result (PC)", value: `\`${data.result}\``, inline: false },
                    { name: "Result (Mobile)", value: data.result, inline: false }
                ]
            },
            footer: { text: "Made By ⚡Bypass Key⚡ Team" },
            timestamp: new Date(),
            color: "#6400ff"
        };
    } catch (error) {
        // Trả về lỗi nếu có
        return { content: error.message };
    }
}

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Tự động mã hóa URL nếu nó có dạng https://loot-link.com/
    if (/^https:\/\/loot-link\.com/.test(url)) {
        url = encodeURIComponent(url); // Mã hóa URL
    }

    // Danh sách các API cần gọi với điều kiện chấp nhận URL
    const apiEndpoints = [
        { 
            endpoint: `https://keybypass.vercel.app/api/fluxus?url=${url}`,
            validUrl: /^https:\/\/flux\.li\// 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/mboost?url=${url}`,
            validUrl: /^https:\/\/mboost\.me/ 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/paste_drop?url=${url}`,
            validUrl: /^https:\/\/paste-drop\.com\// 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/mediafire?url=${url}`,
            validUrl: /^https:\/\/www\.mediafire\.com\// 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/relzhub?url=${url}`,
            validUrl: /relzscript\.xyz/ 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/delta?url=${url}`,
            validUrl: /^https:\/\/gateway\.platoboost\.com/ 
        },
        { 
            endpoint: `https://prince-mysticmoth-api.vercel.app/api/linkvertise?link=${url}&apikey=Triple_0H9BP72`,
            validUrl: /^https:\/\/linkvertise\.com\// 
        },
        { 
            endpoint: `http://de01-3.uniplex.xyz:5743/trigon?url=${url}`,
            validUrl: /^https:\/\/trigonevo\.fun\// 
        },
        { 
            endpoint: `https://keybypass.vercel.app/api/loot?url=${url}`,
            validUrl: /^https:\/\/loot-link\.com\// 
        }
    ];

    // Tạo danh sách các API hợp lệ
    const validEndpoints = apiEndpoints.filter(api => api.validUrl.test(url));

    if (validEndpoints.length === 0) {
        return res.status(400).json({ error: 'Invalid URL for any API' });
    }

    try {
        // Gửi yêu cầu đến từng API và lưu trữ kết quả
        const results = await Promise.all(
            validEndpoints.map(async (api) => {
                try {
                    const response = await fetch(api.endpoint);
                    if (!response.ok) throw new Error("API Offline Or Unsupported Link");

                    const data = await response.json();
                    return data; // Giả sử dữ liệu trả về có key hoặc result
                } catch (error) {
                    console.error(`Error fetching from ${api.endpoint}:`, error.message);
                    return null; // Nếu có lỗi, trả về null
                }
            })
        );

        // Lọc ra các kết quả không null và lấy key hoặc result đầu tiên
        const key = results.map(result => result?.key || result?.result).find(value => value);

        if (key) {
            // Gọi hàm getBypassResult nếu có key
            const bypassResult = await getBypassResult(url);
            return res.json(bypassResult);
        } else {
            return res.status(404).json({ error: 'No keys found' });
        }

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

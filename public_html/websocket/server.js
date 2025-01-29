const http = require('http');
const WebSocket = require('ws');

// ساخت سرور HTTP
const server = http.createServer();

// WebSocket با مسیر `/websocket/`
const wss = new WebSocket.Server({ server, path: '/websocket/' });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const textMessage = message.toString(); // تبدیل پیام به متن

        // ارسال پیام به دیگر کلاینت‌ها
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// تنظیم سرور روی یک پورت (مثلاً 8080)
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

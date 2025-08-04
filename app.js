// تعیین پورت از محیط یا استفاده از 3000 به عنوان پیش‌فرض
var port = process.env.PORT || 3000,

    // بارگذاری ماژول http برای ایجاد سرور
    http = require('http'),

    // بارگذاری ماژول فایل‌سیستم برای خواندن فایل و نوشتن لاگ
    fs = require('fs'),

    // خواندن فایل index.html و ذخیره محتوا در متغیر html
    html = fs.readFileSync('index.html');


// تابع لاگ برای نوشتن پیام‌ها در فایل /tmp/sample-app.log همراه با زمان
var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};


// ایجاد سرور HTTP با پاسخ‌دهی به درخواست‌های ورودی
var server = http.createServer(function (req, res) {

    // اگر متد درخواست POST باشد
    if (req.method === 'POST') {

        // تعریف متغیر برای نگه‌داشتن بدنه درخواست
        var body = '';

        // جمع‌آوری دیتا به صورت تکه‌ای از بدنه درخواست
        req.on('data', function(chunk) {
            body += chunk;
        });

        // بعد از پایان دریافت بدنه
        req.on('end', function() {

            // اگر آدرس درخواست `/` بود، پیام دریافتی را لاگ کن
            if (req.url === '/') {
                log('Received message: ' + body);

            // اگر آدرس `/scheduled` بود، اطلاعات تسک زمان‌بندی‌شده را لاگ کن
            } else if (req.url === '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] +
                    ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            // پاسخ 200 به کلاینت با نوع text
            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });

    // اگر درخواست POST نبود (مثلاً GET)، فایل HTML را ارسال کن
    } else {
        res.writeHead(200);       // ارسال هدر پاسخ
        res.write(html);          // ارسال محتوای HTML
        res.end();                // بستن اتصال
    }
});


// اجرای سرور روی پورت مشخص‌شده
server.listen(port);


// چاپ پیام در کنسول که سرور روی چه پورتی اجرا شده
console.log('Server running at http://127.0.0.1:' + port + '/');

// === Oʻyinni Sozlash ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // 2D rasmlar uchun kontekst
let score = 0; // Boshlangʻich ochko

// Ekranning oʻlchamini moslash
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

// === Savat Objekti ===
const basket = {
    width: 100, // Savat kengligi
    height: 20, // Savat balandligi
    // Savatni pastda markazga joylashtiramiz
    x: canvas.width / 2 - 50, 
    y: canvas.height - 40,   
    color: '#A0522D', // Jigar rang
};

// === Tanga Objekti ===
class Coin {
    constructor() {
        this.radius = 10; // Tanga radiusi
        // Ekranning yuqorisida tasodifiy X pozitsiyasi
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius; 
        this.y = -this.radius; // Ekran yuqorisidan boshlash
        this.color = 'gold'; // Oltin rang
        this.fallSpeed = 2 + Math.random() * 2; // Tushish tezligi (tasodifiy)
    }

    // Tangani tushirish
    update() {
        this.y += this.fallSpeed;
    }

    // Tangani chizish
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

let coins = []; // Hamma tangalar uchun massiv
let coinSpawnRate = 100; // Har 100 kadrda yangi tanga yaratish
let frameCount = 0;

// === Asosiy Oʻyin Mantigʻi ===

// Ekranni chizish
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranni tozalash
    
    // 1. Savatni chizish
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // 2. Ochkolarni chizish
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Hisob: ' + score, 10, 30);
}

// Mantiqni yangilash (harakatlar, toʻqnashuvlar)
function update() {
    // Tanga yaratish
    frameCount++;
    if (frameCount % coinSpawnRate === 0) {
        coins.push(new Coin());
    }

    // Tangalarni tekshirish
    for (let i = 0; i < coins.length; i++) {
        let coin = coins[i];
        coin.update(); // Tangani tushirish

        // === Toʻqnashuvni tekshirish (Tanga yigʻish) ===
        if (
            // Tanga pastki qismi savat ustiga yetib keldi
            coin.y + coin.radius > basket.y && 
            // Tanga yuqori qismi savat ostidan pastda
            coin.y - coin.radius < basket.y + basket.height && 
            // Tanga oʻng tomoni savat chap tomonidan oʻtdi
            coin.x + coin.radius > basket.x && 
            // Tanga chap tomoni savat oʻng tomonidan oʻtmadi
            coin.x - coin.radius < basket.x + basket.width 
        ) {
            score++; // Ochko berish
            coins.splice(i, 1); // Tangani oʻyindan oʻchirish
            i--; // Indeksni tuzatish
            continue; 
        }

        // Tanga ekranning pastiga tushib ketdi
        if (coin.y > canvas.height + coin.radius) {
            coins.splice(i, 1); // Tangani oʻchirish
            i--; 
        }
        
        coin.draw(); 
    }
}

// Asosiy Oʻyin Sitskli (Doimiy ravishda takrorlanadi)
function gameLoop() {
    update(); // Mantiqni yangilash
    draw();   // Ekranni chizish
    
    // Keyingi kadrni soʻrash (Oʻyin animatsiyasini taʼminlaydi)
    requestAnimationFrame(gameLoop); 
}

// === Savatni Boshqarish ===

// Savatning X pozitsiyasini oʻrnatish
function setBasketX(clientX) {
    // Savatni barmoq/kursor ostida markazlashtirish
    let newX = clientX - basket.width / 2;
    
    // Savat ekrandan chiqib ketmasligini taʼminlash
    if (newX < 0) {
        newX = 0;
    } else if (newX + basket.width > canvas.width) {
        newX = canvas.width - basket.width;
    }
    basket.x = newX;
}

// Sensorli qurilmalar (Telefon) uchun boshqaruv
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Sahifaning siljishini toʻxtatish
    if (e.touches.length > 0) {
        setBasketX(e.touches[0].clientX); // Birinchi barmoq pozitsiyasi
    }
});

// Sichqoncha (Kompyuter) uchun boshqaruv
canvas.addEventListener('mousemove', function(e) {
    setBasketX(e.clientX);
});

// Oʻyinni ishga tushirish!
gameLoop();


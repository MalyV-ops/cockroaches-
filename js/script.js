let gamer; // имя игрока
let bugs = []; //массив букашек
let cockroach; //здесь хранится изображение таракана
let bee; //здесь хранится изображение пчелы
let score; //количество убитых тараканов
let totalClicks; // общее количество нажатий мышкой игроком
let playing; // доп флаг работы функции endGame()
let img; //здесь хранится фоновое изображение
let speed; // скорость перемещения жуков
let bugChance; // вероятность появления жуков


function preload(){
    img = loadImage('images/background.png');
    cockroach = loadImage('images/cockroach.png');
    bee = loadImage('images/bee.png');
}

function setup() {

    createCanvas(1200, 600);
    cursor('grab');
    score = 0;
    totalClicks = 0;
    playing = true;
    speed = 2;
    bugChance = 0.4;

    textSize(30);
}

function draw() {
    image(img,0,0, 1200, 600);

    handleBugs(); //обновление и отрисовка жуков,обработка выхода жуков за экран,обработка массива жуков
    attemptNewBug(frameCount);//frameCount - Системная переменная содержит количество кадров,
                              // отображаемых с момента запуска программы.
    handleDifficulty(frameCount, score); //задание сложности игры

    drawScore(); //отрисовывем счет
    gameOver(playing); //вызов функции сообщения об окончании игры(сработает при playing = false)
}

/**
 * Обработчик события нажатия нопки мыши
 * убит ли таракан? а может пчела?
 */
function mousePressed() {

    for (let i = 0; i < bugs.length; i++) {

        // обновляем состояние жука
        bugs[i].squashed = bugs[i].squashedBy(mouseX, mouseY);

        // если убита пчела вызываем функцию завершения игры
        if (bugs[i].squashed && bugs[i].type)
            endGame();
    }

    totalClicks++;
}

/**
 * обновление и отрисовка жуков
 * обработка выхода жуков за экран
 * обработка массива жуков
 */
function handleBugs() {

    for (let i = bugs.length - 1; i >= 0; i--) {

        /* обновляем и рисуем жуков */
        bugs[i].update();
        bugs[i].draw();
   //
        if (bugs[i].position.y > height && !bugs[i].type) {
            // если жук вышел за экран по y и это таракан

            endGame();
        }

        if (bugs[i].squashed) {
            //если жук убит

            bugs.splice(i, 1);
            score++;
        }
    }
}

/**
 * пушим жучков
 */
function attemptNewBug(frame) {

    if (frame % 60 === 0) { // каждую секунду

        if (random() < bugChance) { // вероятность пояления нового жука

            let x = random(width / 2) + width / 4; // только по середине
            let type = (random() > 0.8); // пчела или таракан
            bugs.push(new Insect(x, type));
        }
    }
}

/**
 * переменные, отвечающие за сложность,
 * устанавливаются на основе кадров и счета
 */
function handleDifficulty(frame, score) {

    if (frame % 60 === 0) {
        // обновляем каждую секунду
        //map-переназначем число из одного диапазона в другой
        bugChance = map(score, 0, 500, 0.4, 0.999);
        speed = map(score, 0, 500, 3, 30);
    }
}

/**
 * отрисовываю сообщения об окончании игры
 */
function gameOver(playing) {

    if (!playing) {
        // выполняется только в случае окончания игры

        fill(255);
        noStroke();
        textSize(60);
        textAlign(CENTER);


        text("Game Over!", width / 2, height / 2);

        // предотвращение ошибки деления на ноль
        totalClicks = (totalClicks === 0) ? 1 : totalClicks;
        //подсчитываем процент точного попадания по тараканам на основе общего количества кликов мыши
        let accuracy = Math.round(score / totalClicks * 100);
        textSize(30);
        text("Squash accuracy: " + accuracy + "%",
            width / 2, height / 2 + 70);
        textAlign(LEFT);
        textSize(30);
    }
}

/**
 * рисую счет
 */
function drawScore() {

    fill(255);
    noStroke();
    text(score, 10, 40);
}
/**
 * записываю в localStorage имя игрока и его счет
 */
function records(){
    localStorage.setItem(gamer, score);
}

/**
 * остановка непрерывного выполнения кода в draw() (функция noLoop())
 * завершение игры
 * запись имени игрока, после окончания игры
 * вывод данных в localStorage
 */
function endGame() {

    playing = false;
    noLoop();
    gamer = prompt('Введите ваше имя:');
    records();
}
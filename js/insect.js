
function Insect(x, type) {

    this.origin = x; // с какой точки начинать двигаться

    this.position = createVector(0, 0);
    this.serpentine = random(3) + 3; // дистанция для обновления траекторий жуков

    this.type = type; // false = cockroach, true = bee
    this.squashed = false; // состояние жука

    this.radius = 120; // средний размер жука
}

/**
 * рисуем жука, основываясь на типе
 */
Insect.prototype.draw = function() {

    if (this.type === true){
        image(bee, this.position.x, this.position.y, 200, 150);
    }
    else{
        image(cockroach, this.position.x, this.position.y, 150, 200);
    }

};

/**
 * задаем жучкам путь
 */
Insect.prototype.update = function() {
    //по y смещение за счет изменения скорости тараканов
    this.position.y += speed;
    //по x за счет изменения угла траектории и увеличения амплитуды траектории(за счет дистанции),
    // ну и начальной позиции тараканов
    this.position.x = cos(this.position.y * (0.005 * this.serpentine) + this.serpentine * 10) *
        (width / this.serpentine) + this.origin;
}

/**
 * возвращает true или false в зависимости от того,
 * находятся x и y в диапазоне размера жука или нет
 */
Insect.prototype.squashedBy = function(x, y) {
    //вычисляем расстояние между мышкой и тараканом
    let d = dist(x, y, this.position.x, this.position.y);

    return (d < this.radius);
};
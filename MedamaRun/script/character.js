/**
 * 座標を管理するためのクラス
 */
class Position {
    /**
     * ベクトルの長さを返す静的メソッド
     * @static
     * @param {number} x - X 要素
     * @param {number} y - Y 要素
     */
    static calcLength(x, y){
        return Math.sqrt(x * x + y * y);
    }
    /**
     * ベクトルを単位化した結果を返す静的メソッド
     * @static
     * @param {number} x - X 要素
     * @param {number} y - Y 要素
     */
    static calcNormal(x, y){
        let len = Position.calcLength(x, y);
        return new Position(x / len, y / len);
    }
    /**
     * 点と矩形の衝突判定をする
     * @param {Position} point - 点の座標
     * @param {Position} rectangle - 矩形の座標
     * @param {number} w - 矩形の幅
     * @param {number} h - 矩形の高さ
     */
    static collision_point_rectangle(point, rectangle, w, h) {
        let isCollision = (
            (point.x >= rectangle.x - w / 2) &&
            (point.x <= rectangle.x + w / 2) &&
            (point.y >= rectangle.y - h / 2) &&
            (point.y <= rectangle.y + h / 2)
        );
        return isCollision;
    }
    /**
     * 線と矩形の衝突判定をする。ただし、どちらも水平な場合のみ。
     * @param {Position} line1 - 線の端の座標
     * @param {Position} line2 - 線の端の座標
     * @param {Position} rectangle - 矩形の座標
     * @param {number} w - 矩形の幅
     * @param {number} h - 矩形の高さ
     */
    static collision_line_rectangle(line1, line2, rectangle, w, h){
        if(line1.y !== line2.y){
            return null;
        }
        let isCollision = (
            (
                (rectangle.x - w / 2 <= line1.x && rectangle.x + w / 2 >= line1.x) ||
                (rectangle.x - w / 2 <= line2.x && rectangle.x + w / 2 >= line2.x)
            ) && (
                (line1.y >= rectangle.y - h / 2) &&
                (line1.y <= rectangle.y + h / 2)
            )
        );
        return isCollision;
    }
    /**
     * 線と線の衝突判定をする
     * @param {Position} line1 - 線の端の座標
     * @param {Position} line2 - 線の端の座標
     * @param {Position} line3 - 線の端の座標
     * @param {Position} line4 - 線の端の座標
     */
    static collision_line_line(line1, line2, line3, line4){
        let isCollision = (
            (
                (line1.x <= line3.x && line2.x >= line3.x) ||
                (line1.x <= line4.x && line2.x >= line4.x)
            ) && (
                (line1.y <= line3.y && line2.y >= line3.y) ||
                (line1.y <= line4.y && line2.y >= line4.y)
            )
        );
        return isCollision;
    }

    /**
     * 円と矩形の衝突判定をする
     * @param {Position} circle - 円の座標
     * @param {number} radius - 円の半径
     * @param {Position} rect - 矩形の座標
     * @param {number} w - 矩形の幅
     * @param {number} h - 矩形の高さ
     */
    static collision_circle_rectangle(circle, radius, rectangle, w, h){
        let rect = new Position(rectangle.x , rectangle.y);
        if(Position.collision_point_rectangle(circle, rect, w, h + radius * 2)){
            return true;
        }
        if(Position.collision_point_rectangle(circle, rect, w + radius * 2, h)){
            return true;
        }
        rect.set(rect.x - w / 2, rect.y - h / 2);
        if(circle.distance(rect) <= radius){
            return true;
        }
        rect.set(rect.x, rect.y + h);
        if(circle.distance(rect) <= radius){
            return true;
        }
        rect.set(rect.x + w, rect.y);
        if(circle.distance(rect) <= radius){
            return true;
        }
        rect.set(rect.x, rect.y - h);
        if(circle.distance(rect) <= radius){
            return true;
        }
        return false;
    }

    /**
     * @constructor
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     */
    constructor(x, y){
        /**
         * X 座標
         * @type {number}
         */
        this.x = x;
        /**
         * Y 座標
         * @type {number}
         */
        this.y = y;
    }

    /**
     * 値を設定する
     * @param {number} [x] - 設定する X 座標
     * @param {number} [y] - 設定する Y 座標
     */
    set(x, y){
        if(x != null){this.x = x;}
        if(y != null){this.y = y;}
    }

    /**
     * 対象の Position クラスのインスタンスとの距離を返す
     * @param {Position} target - 距離を測る対象
     */
    distance(target){
        let x = this.x - target.x;
        let y = this.y - target.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 対象の Position クラスのインスタンスとの外積を計算する
     * @param {Position} target - 外積の計算を行う対象
     */
    cross(target){
        return this.x * target.y - this.y * target.x;
    }

    /**
     * 自身を単位化したベクトルを計算して返す
     */
    normalize(){
        // ベクトルの大きさを計算する
        let l = Math.sqrt(this.x * this.x + this.y * this.y);
        // 大きさが 0 の場合は XY も 0 なのでそのまま返す
        if(l === 0){
            return new Position(0, 0);
        }
        // 自身の XY 要素を大きさで割る
        let x = this.x / l;
        let y = this.y / l;
        // 単位化されたベクトルを返す
        return new Position(x, y);
    }

    /**
     * 指定されたラジアン分だけ自身を回転させる
     * @param {number} radian - 回転量
     */
    rotate(radian){
        // 指定されたラジアンからサインとコサインを求める
        let s = Math.sin(radian);
        let c = Math.cos(radian);
        // 2x2 の回転行列と乗算し回転させる
        this.x = this.x * c + this.y * -s;
        this.y = this.x * s + this.y * c;
    }
}

/**
 * キャラクター管理のための基幹クラス
 */
class Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {number} life - キャラクターのライフ（生存フラグを兼ねる）
     * @param {Array<string>} imagePath - キャラクター用の画像パスの配列
     * @param {Array<string>} gameover_imagePath - キャラクター用のゲームオーバー時の画像パスの配列
     */
    constructor(ctx, x, y, w, h, life, imagePath, gameover_imagePath = []){
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = ctx;
        /**
         * @type {Position}
         */
        this.position = new Position(x, y);
        /**
         * @type {Position}
         */
        this.vector = new Position(0.0, 0.0);
        /**
         * @type {number}
         */
        this.angle = 270 * Math.PI / 180;
        /**
         * @type {number}
         */
        this.width = w;
        /**
         * @type {number}
         */
        this.height = h;
        /**
         * @type {number}
         */
        this.life = life;
        /**
         * @type {number}
         */
        this.frame = 0;
        /**
         * @type {number}
         */
        this.previous_frame = 0;
        /**
         * @type {number}
         */
        this.now_i = 0;
        /**
         * @type {number}
         */
        this.switching_blank = 10;
        /**
         * @type {string}
         */
        this.update_method = 'update';
        /**
         * @type {boolean}
         */
        this.gameovered = false;
        /**
         * 自身のジャンプ力（ジャンプする際の初速度）
         * @type {number}
         */
        this.jumping_power = null;
        /**
         * 重力加速度
         * @type {number}
         */
        this.gravity = 1.2;
        /**
         * ジャンプ中かどうかを表すフラグ
         * @type {boolean}
         */
        this.isJumping = false;
        /**
         * 立っているかどうかを表すフラグ
         * @type {boolean}
         */
        this.isStanding = true;
        /**
         * 立っているブロック
         * @type {Block}
         */
        this.standing_Block = null;
        /**
         * 自身とダメージを受けないブロックとの衝突判定を取る対象を格納する
         * @type {Array<Character>}
         */
        this.targetArray = [];
        /**
         * @type {Array<boolean>}
         */
        this.readyArray = [];
        /**
         * @type {Array<Image>}
         */
        this.imageArray = [];
        /**
         * @type {Array<Image>}
         */
        this.gameover_imageArray = [];
        for(let i = 0; i < imagePath.length; ++i){
            this.readyArray[i] = false;
            this.imageArray[i] = new Image();
            this.imageArray[i].addEventListener('load', () => {
                // 画像のロードが完了したら準備完了フラグを立てる
                this.readyArray[i] = true;
            }, false);
            this.imageArray[i].src = imagePath[i];
        }
        for(let i = 0; i < gameover_imagePath.length; ++i){
            this.readyArray[imagePath.length + i] = false;
            this.gameover_imageArray[i] = new Image();
            this.gameover_imageArray[i].addEventListener('load', () => {
                // 画像のロードが完了したら準備完了フラグを立てる
                this.readyArray[imagePath.length + i] = true;
            }, false);
            this.gameover_imageArray[i].src = gameover_imagePath[i];
        }
    }

    /**
     * 進行方向を設定する
     * @param {number} x - X 方向の移動量
     * @param {number} y - Y 方向の移動量
     */
    setVector(x, y){
        // 自身の vector プロパティに設定する
        this.vector.set(x, y);
    }

    /**
     * update方法を設定する
     * @param {string} method - 設定するupdate方法
     */
    setUpdate(method = 'update'){
        // 自身の update_method プロパティに設定する
        this.update_method = method;
    }

    /**
     * 渡されたベクトルをもとにキャラクターを移動させる
     * @param {Position} vector 
     */
    move(vector = this.vector){
        this.position.x += vector.x;
        this.position.y += vector.y;
    }

    /**
     * キャラクターが立っているかどうかチェックしてフラグを調整する
     */
    checkIsStanding(){
        //足の位置（線）
        let foot1 = new Position(this.position.x - 24, this.position.y + this.height / 2);
        let foot2 = new Position(this.position.x + 15, this.position.y + this.height / 2);

        for(let i = 0; i < this.targetArray.length; ++i){
            // 自身か対象のライフが 0 以下の対象は無視する
            if(this.life > 0 && this.targetArray[i].life > 0){
                if(Position.collision_line_rectangle(foot1, foot2, this.targetArray[i].position, this.targetArray[i].width, this.targetArray[i].height) === true){
                    if(this.vector.y > 0){
                        //ぶつかったブロックの上辺の座標
                        let top1 = new Position(this.targetArray[i].position.x - this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        let top2 = new Position(this.targetArray[i].position.x + this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        //今の座標から逆算してぶつかったブロックの上辺にいた時間を計算する
                        let t = this.vector.y / this.gravity - Math.sqrt(Math.pow(this.vector.y / this.gravity, 2) - 2 * (foot1.y - top1.y) / this.gravity);
                        //求めた時間を元にぶつかったブロックの上辺のY座標にいた時の座標を求める
                        let p1 = new Position(foot1.x + this.vector.x * t, top1.y);
                        let p2 = new Position(foot2.x + this.vector.x * t, top1.y);
                        //線と線がぶつかっていたかどうかを判定する
                        if(!Position.collision_line_line(top1, top2, p1, p2)){
                            break;
                        }
                    }
                    this.isStanding = true;
                    this.standing_Block = this.targetArray[i];
                    return;
                }
            }
            if(this.life > 0 && this.targetArray[i].life > 0 && this.vector.y >= this.targetArray[i].height){
                if(Position.collision_line_rectangle(foot1, foot2, this.targetArray[i].position, this.targetArray[i].width, this.targetArray[i].height) === true){
                    if(this.vector.y > 0){
                        //ぶつかったブロックの上辺の座標
                        let top1 = new Position(this.targetArray[i].position.x - this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        let top2 = new Position(this.targetArray[i].position.x + this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        //今の座標から逆算してぶつかったブロックの上辺にいた時間を計算する
                        let t = this.vector.y / this.gravity - Math.sqrt(Math.pow(this.vector.y / this.gravity, 2) - 2 * (foot1.y - top1.y) / this.gravity);
                        //求めた時間を元にぶつかったブロックの上辺のY座標にいた時の座標を求める
                        let p1 = new Position(foot1.x + this.vector.x * t, top1.y);
                        let p2 = new Position(foot2.x + this.vector.x * t, top1.y);
                        //線と線がぶつかっていたかどうかを判定する
                        if(!Position.collision_line_line(top1, top2, p1, p2)){
                            break;
                        }
                    }
                    this.isStanding = true;
                    this.standing_Block = this.targetArray[i];
                    return;
                }else if(this.vector.y > 0){
                    if(foot1.y - this.vector.y + this.gravity <= this.targetArray[i].position.y - this.targetArray[i].height / 2 && foot1.y >= this.targetArray[i].position.y + this.targetArray[i].height / 2){
                        //ぶつかったブロックの上辺の座標
                        let top1 = new Position(this.targetArray[i].position.x - this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        let top2 = new Position(this.targetArray[i].position.x + this.targetArray[i].width / 2, this.targetArray[i].position.y - this.targetArray[i].height / 2);
                        //今の座標から逆算してぶつかったブロックの上辺にいた時間を計算する
                        let t = this.vector.y / this.gravity - Math.sqrt(Math.pow(this.vector.y / this.gravity, 2) - 2 * (foot1.y - top1.y) / this.gravity);
                        //求めた時間を元にぶつかったブロックの上辺のY座標にいた時の座標を求める
                        let p1 = new Position(foot1.x + this.vector.x * t, top1.y);
                        let p2 = new Position(foot2.x + this.vector.x * t, top1.y);
                        //線と線がぶつかっていたかどうかを判定する
                        if(!Position.collision_line_line(top1, top2, p1, p2)){
                            break;
                        }
                        this.isStanding = true;
                        this.standing_Block = this.targetArray[i];
                        return;
                    }
                }
            }
        }
        this.isStanding = false;
        this.standing_Block = null;
        return;
    }

    /**
     * 進行方向を角度を元に設定する
     * @param {number} angle - 回転量（ラジアン）
     */
    setVectorFromAngle(angle){
        // 自身の回転量を設定する
        this.angle = angle;
        // ラジアンからサインとコサインを求める
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        // 自身の vector プロパティに設定する
        this.vector.set(cos, sin);
    }

    /**
     * キャラクターを描画する
     * @param {Array<Image>} [imageArray = this.imageArray]
     */
    draw(imageArray = this.imageArray){
        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        //画像が一枚かそれ以上かで描画の仕方を変える
        if(imageArray.length === 1){
            // キャラクターの幅やオフセットする量を加味して描画する
            this.ctx.drawImage(
                imageArray[0],
                this.position.x - offsetX,
                this.position.y - offsetY,
                this.width,
                this.height
            );
        }else{
            if(this.frame >= this.previous_frame + this.switching_blank){
                if(this.now_i + 1 >= imageArray.length){
                    this.now_i = 0;
                }else{
                    this.now_i += 1;
                }
                this.previous_frame = this.frame;
            }
            // キャラクターの幅やオフセットする量を加味して描画する
            this.ctx.drawImage(
                imageArray[this.now_i],
                this.position.x - offsetX,
                this.position.y - offsetY,
                this.width,
                this.height
            );
        }
        ++this.frame;
    }


    gameover_draw(){
        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        //画像が一枚かそれ以上かで描画の仕方を変える
        if(this.gameover_imageArray.length === 1){
            // キャラクターの幅やオフセットする量を加味して描画する
            this.ctx.drawImage(
                this.gameover_imageArray[0],
                this.position.x - offsetX,
                this.position.y - offsetY,
                this.width,
                this.height
            );
        }else{
            if(this.frame >= this.previous_frame + this.switching_blank){
                if(this.now_i + 1 >= this.gameover_imageArray.length){
                    this.now_i = 0;
                }else{
                    this.now_i += 1;
                }
                this.previous_frame = this.frame;
            }
            // キャラクターの幅やオフセットする量を加味して描画する
            this.ctx.drawImage(
                this.gameover_imageArray[this.now_i],
                this.position.x - offsetX,
                this.position.y - offsetY,
                this.width,
                this.height
            );
        }
        ++this.frame;
    }

    /**
     * 自身の回転量を元に座標系を回転させる
     */
    rotationDraw(){
        // 座標系を回転する前の状態を保存する
        this.ctx.save();
        // 自身の位置が座標系の中心と重なるように平行移動する
        this.ctx.translate(this.position.x, this.position.y);
        // 座標系を回転させる（270 度の位置を基準にするため Math.PI * 1.5 を引いている）
        this.ctx.rotate(this.angle - Math.PI * 1.5);

        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        // キャラクターの幅やオフセットする量を加味して描画する
        this.ctx.drawImage(
            this.imageArray[0],
            -offsetX, // 先に translate で平行移動しているのでオフセットのみ行う
            -offsetY, // 先に translate で平行移動しているのでオフセットのみ行う
            this.width,
            this.height
        );

        // 座標系を回転する前の状態に戻す
        this.ctx.restore();
    }
}

/**
 * めだまクラス
 */
class Medama extends Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {string} imagePath - キャラクター用の画像パス
     * @param {string} gameover_imagePath - キャラクター用ゲームオーバー時のの画像パス
     */
    constructor(ctx, x, y, w, h, imagePath, gameover_imagePath){
        // Character クラスを継承しているので、まずは継承元となる
        // Character クラスのコンストラクタを呼び出すことで初期化する
        // （super が継承元のコンストラクタの呼び出しに相当する）
        super(ctx, x, y, w, h, 3, imagePath, gameover_imagePath);

        /**
         * 自身の移動スピード（update 一回あたりの移動量）
         * @type {number}
         */
        this.speed = 5.5;
        /**
         * 自身のジャンプ力（ジャンプする際の初速度）
         * @type {number}
         */
        this.jumping_power = 19;
        /**
         * 重力加速度
         * @type {number}
         */
        this.gravity = 1.2;
        /**
         * ショットを撃ったあとのチェック用カウンタ
         * @type {number}
         */
        this.shotCheckCounter = 0;
        /**
         * ショットを撃つことができる間隔（フレーム数）
         * @type {number}
         */
        this.shotInterval = 20;
        /**
         * めだまが登場中かどうかを表すフラグ
         * @type {boolean}
         */
        this.isComing = false;
        /**
         * 登場演出を開始した際のタイムスタンプ
         * @type {number}
         */
        this.comingStart = null;
        /**
         * 登場演出を開始する座標
         * @type {Position}
         */
        this.comingStartPosition = null;
        /**
         * 登場演出を完了とする座標
         * @type {Position}
         */
        this.comingEndPosition = null;
        /**
         * 自身とダメージを受けるブロックとの衝突判定を取る対象を格納する
         * @type {Array<Character>}
         */
        this.targetObstacle = [];
        /**
         * 自身とアイテムとの衝突判定を取る対象を格納する
         * @type {Array<Item>}
         */
        this.targetItem = [];
        /**
         * 自身が持つショットインスタンスの配列
         * @type {Array<Shot>}
         */
        this.shotArray = null;
        /**
         * ダメージを受けた直後かどうかを示すフラグ
         * @type {boolean}
         */
        this.isDamaged = false;
        /**
         * ダメージを受けた時のタイムスタンプ
         * @type {number}
         */
        this.damagedFrame = null;
    }

    /**
     * 登場演出に関する設定を行う
     * @param {number} startX - 登場開始時の X 座標
     * @param {number} startY - 登場開始時の Y 座標
     * @param {number} endX - 登場終了とする X 座標
     * @param {number} endY - 登場終了とする Y 座標
     */
    setComing(startX, startY, endX, endY){
        // 登場中のフラグを立てる
        this.isComing = true;
        // 登場開始時のタイムスタンプを取得する
        this.comingStart = Date.now();
        // 登場開始位置にめだまを移動させる
        this.position.set(startX, startY);
        // 登場開始位置を設定する
        this.comingStartPosition = new Position(startX, startY);
        // 登場終了とする座標を設定する
        this.comingEndPosition = new Position(endX, endY);
    }

    /**
     * ショットを設定する
     * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
     */
    setShotArray(shotArray){
        // 自身のプロパティに設定する
        this.shotArray = shotArray;
    }

    /**
     * 当たり判定の対象を設定する
     * @param {Array<Block>} [targets] - 衝突判定の対象を含む配列
     * @param {Array<Obstacle, Enemy>} [obstacle] - 衝突判定の対象を含む配列
     * @param {Array<Item>} [items]
     */
    setTarget(targets , obstacle, items){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
        if(obstacle != null && Array.isArray(obstacle) === true && obstacle.length > 0){
            this.targetObstacle = obstacle;
        }
        if(items != null && Array.isArray(items) === true && items.length > 0){
            this.targetItem = items;
        }
    }

    /**
     *　障害物に当たったているかどうか判定する
     */
    checkBumping(){
        //
        if(this.damagedFrame + 120 <= this.frame){
            this.isDamaged = false;
            this.damagedFrame = null;
        }
        for(let i = 0; i < this.targetObstacle.length; ++i){
            //自身か対象のライフが 0 以下の対象とダメージを受けた直後は無視する
            if(this.life > 0 && this.targetObstacle[i].life > 0 && this.isDamaged === false){
                if(this.position.distance(this.targetObstacle[i].position) < (this.width / 2 + this.targetObstacle[i].width / 2) * 4 / 5){
                    //自身のライフを減らす
                    this.life -= this.targetObstacle[i].damage;
                    //ダメージを受けたフラグを立てる
                    this.isDamaged = true;
                    this.damagedFrame = this.frame;
                    break;
                }
            }
        }
        for(let i = 0; i < this.targetItem.length; ++i){
            //自信か対象のライフが3以上0以下の時は無視する
            if(this.life < 3 && this.life > 0 && this.targetItem[i].life > 0){
                if(this.position.distance(this.targetItem[i].position) < (this.width / 2 + this.targetItem[i].width / 2) * 4 / 5){
                    //自身のライフを増やす
                    this.life += this.targetItem[i].healing;
                    this.targetItem[i].life = 0;
                    break;
                }
            }
        }
    } 

    /**
     * gameoverになった後の処理をする
     */
    gameover(){
        if(this.gameovered === false){
            this.vector.set(0, -10);
            this.gameovered = true;
        }else{
            this.vector.y += this.gravity;
        }
        this.move();
        this.gameover_draw();
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // 現時点のタイムスタンプを取得する
        let justTime = Date.now();

        // 登場シーンの処理
        if(this.isComing === true){           
            let comingTime = (justTime - this.comingStart) / 1000;
            // 登場中は時間が経つほど右に向かって進む
            let x = this.comingStartPosition.x + comingTime * 50;
            // 一定の位置まで移動したら登場シーンを終了する
            if(x >= this.comingEndPosition.x){
                this.isComing = false;             // 登場シーンフラグを下ろす
                x = this.comingEndPosition.x; // 行き過ぎの可能性もあるので位置を再設定
            }
            //求めたX座標をめだまに設定する
            this.position.set(x,this.position.y);

            // めだまの登場演出時は点滅させる
            if(justTime % 100 < 50){
                this.ctx.globalAlpha = 0.5;
            }
        }else{
            //立っているかどうか判定する
            this.checkIsStanding();

            if(this.isStanding === true && this.isJumping === false){                 
                //落下が終わった時の処理
                if (this.vector.y > 0){
                    this.vector.set(0, 0);
                    //立っているブロックをもとにめだまの Y 座標を設定
                    this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
                }else{
                    //立っている状態の処理    
                    if(window.isKeyDown['key_ '] === true || window.isKeyDown.key_ArrowUp ===true || window.isKeyDown.key_w === true){
                        //ジャンプ中のフラグを立てる
                        this.isJumping = true;
                        this.isStanding = false;
                        if(window.isKeyDown.key_ArrowLeft === true || window.isKeyDown.key_a === true){
                            this.vector.x = -this.speed; // アローキーの左
                        }else if(window.isKeyDown.key_ArrowRight === true || window.isKeyDown.key_d === true){                   
                            this.vector.x = this.speed; // アローキーの右
                        }else{
                            this.vector.x = 0;//何も入力されていなかったら0
                        }
                        this.vector.x += this.standing_Block.vector.x;
                        this.vector.y = -this.jumping_power;
                        //最初の動きをする
                        this.move();                  
                    }else{
                        // キーの押下状態を調べて挙動を変える
                        if(window.isKeyDown.key_ArrowLeft === true || window.isKeyDown.key_a === true){
                            this.vector.x -= this.speed / 8;// アローキーの左                              
                        }else if(window.isKeyDown.key_ArrowRight === true || window.isKeyDown.key_d === true){
                            this.vector.x += this.speed / 8; // アローキーの右
                        }else{
                            this.vector.x = this.standing_Block.vector.x;//何も入力されていなかったら0
                        }                        
                        //立っているブロックをもとにめだまの Y方向のベクトルを設定
                        this.vector.y =  this.standing_Block.vector.y;
                        //スピードが出すぎないように調整する
                        if(this.vector.x  - this.standing_Block.vector.x > this.speed){
                            this.vector.x = this.standing_Block.vector.x + this.speed;
                        }else if(this.vector.x  - this.standing_Block.vector.x < -this.speed){
                            this.vector.x = this.standing_Block.vector.x - this.speed;
                        }
                        //めだまを動かす
                        this.move();                   
                    }             
                }           
            }else if(this.isStanding === true && this.isJumping === true && this.vector.y >= 0){
                //ジャンプが終わって着地した瞬間の処理（落ちているときのみ）
                //vectorなどを設定し直す
                this.isJumping = false;
                this.vector.set(this.standing_Block.vector.x, 0);
                //立っているブロックをもとにめだまの Y 座標を設定
                this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
            }else if(this.isStanding === true && this.isJumping === true && this.vector.y < 0){
                //ジャンプ中（上昇中）に足がブロックに当たった場合
                this.isStanding = false;
                if(window.isKeyDown.key_ArrowLeft === true || window.isKeyDown.key_a === true){
                    if(this.vector.x > -this.speed){
                        this.vector.x -= this.speed / 64;// アローキーの左
                    }                  
                }else if(window.isKeyDown.key_ArrowRight === true || window.isKeyDown.key_d === true){    
                    if(this.vector.x < this.speed) {
                        this.vector.x += this.speed / 64; // アローキーの右
                    }                                 
                }  
                //重力による影響を与える
                this.vector.y += this.gravity;
                //めだまを動かす
                this.move();
            }else if(this.isStanding === false){      
                if(window.isKeyDown.key_ArrowLeft === true || window.isKeyDown.key_a === true){
                    if(this.vector.x > -this.speed){
                        this.vector.x -= this.speed / 64;// アローキーの左
                    }                  
                }else if(window.isKeyDown.key_ArrowRight === true || window.isKeyDown.key_d === true){    
                    if(this.vector.x < this.speed) {
                        this.vector.x += this.speed / 64; // アローキーの右
                    }                                 
                }          
                //重力による影響を与える
                this.vector.y += this.gravity;
                //めだまを動かす
                this.move();
                //移動してからブロックに当たった場合の処理 少し沈むのを防ぐため
                this.checkIsStanding();
                if(this.isStanding === true){
                    if(this.vector.y >= 0){
                        //ジャンプが終わって着地した瞬間の処理（落ちているときのみ）
                        //vectorなどを設定し直す
                        this.isJumping = false;
                        this.vector.set(this.standing_Block.vector.x, 0);
                        //立っているブロックをもとにめだまの Y 座標を設定
                        this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
                    }else{
                        //ジャンプ中（上昇中）に足がブロックに当たった場合
                        this.isStanding = false;
                    }
                }
            }

            // キーの押下状態を調べてショットを生成する
            if(window.isKeyDown.key_j === true){
                // ショットを撃てる状態なのかを確認する
                // ショットチェック用カウンタが 0 以上ならショットを生成できる
                if(this.shotCheckCounter >= 0){
                    let i;
                    // ショットの生存を確認し非生存のものがあれば生成する
                    for(i = 0; i < this.shotArray.length; ++i){
                        // 非生存かどうかを確認する
                        if(this.shotArray[i].life <= 0){
                            // 自機キャラクターの座標にショットを生成する
                            this.shotArray[i].set(this.position.x, this.position.y - 10);
                            // 中央のショットは攻撃力を 2 にする
                            this.shotArray[i].setPower(2);
                            // ショットを生成したのでインターバルを設定する
                            this.shotCheckCounter = -this.shotInterval;
                            // ひとつ生成したらループを抜ける
                            break;
                        }
                    }
                }
            }
            // ショットチェック用のカウンタをインクリメントする

            ++this.shotCheckCounter;
            
            this.checkBumping();

            // 移動後の位置が画面外へ出ていないか確認して修正する
            let canvasWidth = this.ctx.canvas.width;
            let canvasHeight = this.ctx.canvas.height;
            let tx = Math.min(Math.max(this.position.x, this.width / 2), canvasWidth - this.width / 2);
            let ty = Math.min(this.position.y, canvasHeight - 52);
            this.position.set(tx, ty);
            //ダメージを受けたあとは点滅させる
            if(this.isDamaged === true){
                if(justTime % 100 < 50){
                    this.ctx.globalAlpha = 0.5;
                }
                this.ctx.filter = 'hue-rotate(180deg)';
            }else{
                this.ctx.globalAlpha = 1.0;
                this.ctx.filter = 'none';
            }
        }
        //ライフが0の時の処理
        if(this.life <= 0){
            this.update_method = 'gameover';
            this.gameover();
            return;
        }

        // めだまを描画する
        this.draw();
    }
}


class Enemy extends Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     * @param {string} gameover_imagePath - キャラクター用ゲームオーバー時のの画像パス
     */
    constructor(ctx, x, y, w, h, imagePath, gameover_imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath, gameover_imagePath);

        /**
         * 自身のタイプ
         * @type {string}
         */
        this.type = 'Sugi';
        /**
         * 自身の移動スピード
         * @type {number}
         */
        this.speed = 4;
        /**
         * 自身のめだまに当たった時に与えるダメージ
         * @type {number}
         */
        this.damage = 1;
        /**
         * 自身のジャンプ力（ジャンプする際の初速度）
         * @type {number}
         */
        this.jumping_power = 19;
        /**
         * 自身が持つショットインスタンスの配列
         * @type {Array<Egg_Shot>}
         */
        this.shotArray = null;
        /**
         * 自身が攻撃の対象とする Character 由来のインスタンス
         * @type {Character}
         */
        this.attackTarget = null;
    }

    /**
     * 敵を配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [life=1] - 設定するライフ
     * @param {string} [type='default'] - 設定するタイプ
     */
    set(x, y, life = 1, type = 'Sugi'){
        // 登場開始位置に敵キャラクターを移動させる
        this.position.set(x, y);
        // 敵キャラクターのライフを 0 より大きい値（生存の状態）に設定する
        this.life = life;
        // 敵キャラクターのタイプを設定する
        this.type = type;
        // 敵キャラクターのフレームをリセットする
        this.frame = 0;
        this.previous_frame = 0;
        this.isDamaged = false;
        this.isJumping = false;
        this.isStanding = true;
        this.gameovered = false;
        this.vector.set(0, 0);
    }

    /**
     * ショットを設定する
     * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
     */
    setShotArray(shotArray){
        // 自身のプロパティに設定する
        this.shotArray = shotArray;
    }

    /**
     * 攻撃対象を設定する
     * @param {Character} target - 自身が攻撃対象とするインスタンス
     */
    setAttackTarget(target){
        // 自身のプロパティに設定する
        this.attackTarget = target;
    }

    /**
     * 当たり判定の対象を設定する
     * @param {Array<Block>} [targets] - 衝突判定の対象を含む配列
     */
    setTarget(targets){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もし敵キャラクターのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}
        //画面外に出た時の処理
        if(this.position.x + this.width < 0 || this.position.y - this.height > 480){
            this.life = 0;
        }

        switch(this.type){
            case 'Sugi':
            default:
                //立っているかどうか判定する
                this.checkIsStanding();

                if(this.isStanding === true && this.isJumping === false){                 
                    //落下が終わった時の処理
                    if (this.vector.y > 0){
                        this.vector.set(0, 0);
                        //立っているブロックをもとにY 座標を設定
                        this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
                    }else{
                        //立っている状態の処理    
                        if(this.frame % Math.floor(Math.random() * 300) === 0){
                            //ジャンプ中のフラグを立てる
                            this.isJumping = true;
                            this.isStanding = false;
                            this.vector.set(-this.speed + this.standing_Block.vector.x, -this.jumping_power);
                            //最初の動きをする
                            this.move();                  
                        }else{
                            this.vector.set(-this.speed + this.standing_Block.vector.x, this.standing_Block.vector.y);
                            //敵を動かす
                            this.move();                   
                        }             
                    }           
                }else if(this.isStanding === true && this.isJumping === true && this.vector.y >= 0){
                    //ジャンプが終わって着地した瞬間の処理（落ちているときのみ）
                    //vectorなどを設定し直す
                    this.isJumping = false;
                    this.vector.set(this.standing_Block.vector.x, 0);
                    //立っているブロックをもとに Y 座標を設定
                    this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
                }else if(this.isStanding === true && this.isJumping === true && this.vector.y < 0){
                    //ジャンプ中（上昇中）に足がブロックに当たった場合
                    //重力による影響を与える
                    this.vector.y += this.gravity;
                    //敵を動かす
                    this.move();
                }else if(this.isStanding === false){               
                    //重力による影響を与える
                    this.vector.y += this.gravity;
                    //敵を動かす
                    this.move();
                    //移動してからブロックに当たった場合の処理 少し沈むのを防ぐため
                    this.checkIsStanding();
                    if(this.isStanding === true){
                        if(this.vector.y >= 0){
                            //ジャンプが終わって着地した瞬間の処理（落ちているときのみ）
                            //vectorなどを設定し直す
                            this.isJumping = false;
                            this.vector.set(this.standing_Block.vector.x, 0);
                            //立っているブロックをもとに Y 座標を設定
                            this.position.y =  this.standing_Block.position.y - this.standing_Block.height / 2 - this.height / 2;
                        }else{
                            //ジャンプ中（上昇中）に足がブロックに当たった場合
                            this.isStanding = false;
                        }
                    }
                }
                break;

            case 'Flower':
                //ふわふわ浮く感じで
                this.vector.set(-4.5, Math.sin(this.frame / 10) * 5);
                this.move();
                //弾を発射する
                if(this.frame % 50 === 0){
                    // ショットの生存を確認し非生存のものがあれば生成する
                    for(let i = 0; i < this.shotArray.length; ++i){
                        // 非生存かどうかを確認する
                        if(this.shotArray[i].life <= 0){
                            // 自機キャラクターの座標にショットを生成する
                            this.shotArray[i].set(this.position.x, this.position.y + this.height / 2);
                            // 中央のショットは攻撃力を 1 にする
                            this.shotArray[i].setPower(1);
                            // ひとつ生成したらループを抜ける
                            break;
                        }
                    }
                }
                break;

            case 'Dust':
                //まっすぐ飛んでくる
                this.vector.set(this.vector.x, this.vector.y);
                this.move();
                break;
        }
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';
        // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
        this.draw();
    }

    /**
     * 画面内で死んだときの処理
     */
    gameover(){
        if(this.position.y > 550 || this.position.x < -64){
            this.update_method = 'update';
            return;
        }
        if(this.gameovered === false){
            this.vector.set(0, -10);
            this.gameovered = true;
        }else{
            this.vector.y += 1.2;
        }
        this.move();
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';
        this.gameover_draw();
    }

    /**
     * 自身から指定された方向にショットを放つ
     * @param {number} [x=0.0] - 進行方向ベクトルの X 要素
     * @param {number} [y=1.0] - 進行方向ベクトルの Y 要素
     * @param {number} [speed=5.0] - ショットのスピード
     */
    fire(x = 0.0, y = 1.0, speed = 5.0){
        // ショットの生存を確認し非生存のものがあれば生成する
        for(let i = 0; i < this.shotArray.length; ++i){
            // 非生存かどうかを確認する
            if(this.shotArray[i].life <= 0){
                // 敵キャラクターの座標にショットを生成する
                this.shotArray[i].set(this.position.x, this.position.y);
                // ショットのスピードを設定する
                this.shotArray[i].setSpeed(speed);
                // ショットの進行方向を設定する（真下）
                this.shotArray[i].setVector(x, y);
                // ひとつ生成したらループを抜ける
                break;
            }
        }
    }
}


class Boss extends Character{
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} image - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath, gameover_imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath, gameover_imagePath);

        /**
         * 自身のモード
         * @type {string}
         */
        this.mode = '';
        /**
         * 自身の移動スピード（update 一回あたりの移動量）
         * @type {number}
         */
        this.speed = 2;
        /**
         * 自身が持つショットインスタンスの配列
         * @type {Array<Shot>}
         */
        this.shotArray = null;
        /**
         * 自身が持つホーミングショットインスタンスの配列
         * @type {Array<Homing>}
         */
        this.homingArray = null;
        /**
         * 自身が攻撃の対象とする Character 由来のインスタンス
         * @type {Character}
         */
        this.attackTarget = null;
        /**
         * 自身が召喚対象とする Enemy 由来のインスタンスの配列
         * @type {Array<Enemy>}
         */
        this.summonArray = [];
    }

    /**
     * ボスを配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [life=1] - 設定するライフ
     */
    set(x, y, life = 1){
        // 登場開始位置にボスキャラクターを移動させる
        this.position.set(x, y);
        // ボスキャラクターのライフを 0 より大きい値（生存の状態）に設定する
        this.life = life;
        // ボスキャラクターのフレームをリセットする
        this.frame = 0;
        this.previous_frame = 0;
        this.isDamaged = false;
        this.isJumping = false;
        this.isStanding = true;
        this.gameovered = false;
        this.vector.set(0, 0);
    }

    /**
     * ショットを設定する
     * @param {Array<Shot>} shotArray - 自身に設定するショットの配列
     */
    setShotArray(shotArray){
        // 自身のプロパティに設定する
        this.shotArray = shotArray;
    }

    /**
     * ホーミングショットを設定する
     * @param {Array<Homing>} homingArray - 自身に設定するホーミングショットの配列
     */
    setHomingArray(homingArray){
        // 自身のプロパティに設定する
        this.homingArray = homingArray;
    }

    /**
     * 攻撃対象を設定する
     * @param {Character} target - 自身が攻撃対象とするインスタンス
     */
    setAttackTarget(target){
        // 自身のプロパティに設定する
        this.attackTarget = target;
    }

    /**
     * 召喚対象を設定する
     * @param {Enemy} [target] - 自身が召喚する敵キャラクター
     */
    setSummonTarget(targets){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.summonArray = targets;
        }
    }

    /**
     * モードを設定する
     * @param {string} mode - 自身に設定するモード
     */
    setMode(mode){
        // 自身のプロパティに設定する
        this.mode = mode;
    }

    /**
     * ボスキャラクターの状態を更新し描画を行う
     */
    update(){
        // もしボスキャラクターのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}

        // モードに応じて挙動を変える
        switch(this.mode){
            case 'invade':
                this.vector.set(-this.speed, 0);
                this.move();
                if(this.position.x < 900){
                    this.vector.set(0, 0);
                    this.mode = 'attacking';
                }
                // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
                this.switchDraw('default');
                break;
            // 退避する演出時
            case 'escape':
                this.vector.set(this.speed, 0);
                this.move();
                if(this.position.x > 1000 + this.width){
                    this.life = 0;
                }
                // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
                this.switchDraw('default');
                break;
            case 'attacking':
                // 配置後のフレーム数を 1500 で割ったとき、余りが 500 未満となる
                // 場合と、そうでない場合で、ショットに関する挙動を変化させる
                if(this.frame % 3000 < 1000){
                    // 配置後のフレーム数を 200 で割った余りが 100 より大きく、かつ、
                    // 10 で割り切れる場合に、自機キャラクター狙いショットを放つ
                    if(this.frame % 200 > 100 && this.frame % 30 === 0){
                        // 攻撃対象となる自機キャラクターに向かうベクトル
                        let tx = this.attackTarget.position.x - this.position.x + 100;
                        let ty = this.attackTarget.position.y - this.position.y + 20;
                        // ベクトルを単位化する
                        let tv = Position.calcNormal(tx, ty);
                        // 自機キャラクターにショットを放つ
                        this.fire(tv.x, tv.y, 10);
                    }
                    // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
                    this.switchDraw('attacking');
                }else if(this.frame % 1500 < 1000){
                    // ホーミングショットを放つ
                    if(this.frame % 150 === 0){
                        this.homingFire(-1, 0, 5);
                    }
                    // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
                    this.switchDraw('attacking');
                }else{
                    //敵（杉）を召喚する
                    if(this.frame % 30 === 0){
                        // ライフが 0 の状態の敵キャラクター（小）が見つかったら配置する
                        for(let i = 0; i < this.summonArray.length; ++i){
                            if(this.summonArray[i].life <= 0 && this.summonArray[i].update_method === 'update'){
                                let e = this.summonArray[i];
                                //右側面から出てくる
                                e.set(1000 + e.width,
                                    480 - 20 - e.height / 2,
                                    1, 'Sugi');
                                break;
                            }
                        }
                    }    
                    // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
                    this.switchDraw('summoning');              
                }
                break;
        }
        // 自身のフレームをインクリメントする
        ++this.frame;
    }

    /**
     * 画面内で死んだときの処理
     */
    gameover(){
        if(this.position.y > 550 || this.position.x < -64){
            this.update_method = 'update';
            return;
        }
        if(this.gameovered === false){
            this.vector.set(0, -10);
            this.gameovered = true;
        }else{
            this.vector.y += 1.2;
        }
        this.move();
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';
        this.gameover_draw();
    }

    /**
     * 自身から指定された方向にショットを放つ
     * @param {number} [x=0.0] - 進行方向ベクトルの X 要素
     * @param {number} [y=1.0] - 進行方向ベクトルの Y 要素
     * @param {number} [speed=5.0] - ショットのスピード
     */
    fire(x = -1.0, y = 0.0, speed = 5.0){
        // ショットの生存を確認し非生存のものがあれば生成する
        for(let i = 0; i < this.shotArray.length; ++i){
            // 非生存かどうかを確認する
            if(this.shotArray[i].life <= 0){
                // ボスキャラクターの座標にショットを生成する
                this.shotArray[i].set(this.position.x - 100, this.position.y - 20);
                // ショットのスピードを設定する
                this.shotArray[i].setSpeed(speed);
                //ショットの攻撃力を設定する
                this.shotArray[i].setPower(1);
                // ショットの進行方向を設定する（真下）
                this.shotArray[i].setVector(x, y);
                // ひとつ生成したらループを抜ける
                break;
            }
        }
    }

    /**
     * 自身から指定された方向にホーミングショットを放つ
     * @param {number} [x=0.0] - 進行方向ベクトルの X 要素
     * @param {number} [y=1.0] - 進行方向ベクトルの Y 要素
     * @param {number} [speed=3.0] - ショットのスピード
     */
    homingFire(x = -1.0, y = 0.0, speed = 3.0){
        // ショットの生存を確認し非生存のものがあれば生成する
        for(let i = 0; i < this.homingArray.length; ++i){
            // 非生存かどうかを確認する
            if(this.homingArray[i].life <= 0){
                // ボスキャラクターの座標にショットを生成する
                this.homingArray[i].set(this.position.x - 100, this.position.y - 20);
                // ショットのスピードを設定する
                this.homingArray[i].setSpeed(speed);
                // ショットの進行方向を設定する（真下）
                this.homingArray[i].setVector(x, y);
                // ひとつ生成したらループを抜ける
                break;
            }
        }
    }

    /**
     * 指定されたタイプの描画方法で描画する
     * @param {String} patern 
     */
    switchDraw(patern){
        switch(patern){
            case 'default':
            default:
                this.ctx.globalAlpha = 1.0;
                this.ctx.filter = 'none';
                this.draw([this.imageArray[0], this.imageArray[1]]);
                break;
            case 'attacking':
                this.ctx.globalAlpha = 1.0;
                this.ctx.filter = 'none';
                this.draw([this.imageArray[2], this.imageArray[3]]);
                break;
            case 'summoning':
                this.ctx.globalAlpha = 1.0;
                this.ctx.filter = 'none';
                this.draw([this.imageArray[4], this.imageArray[5]]);
                break;
        }
    }
}

/**
 * Shot クラス
 */
class Shot extends Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);

        /**
         * 自身の移動スピード
         * @type {number}
         */
        this.speed = 16;
        /**
         * 自身の攻撃力
         * @type {number}
         */
        this.power = 1;
        /**
         * 自身と衝突判定を取る対象を格納する
         * @type {Array<Character>}
         */
        this.targetArray = [];
    }

    /**
     * ショットを配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [speed] - 設定するスピード
     * @param {number} [power] - 設定する攻撃力
     */
    set(x, y, speed, power){
        // 登場開始位置にショットを移動させる
        this.position.set(x, y);
        // ショットのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // スピードを設定する
        this.setSpeed(speed);
        // 攻撃力を設定する
        this.setPower(power);
        //ベクトルを設定する
        this.vector.set(1, 0);
    }

    /**
     * ショットのスピードを設定する
     * @param {number} [speed] - 設定するスピード
     */
    setSpeed(speed){
        // もしスピード引数が有効なら設定する
        if(speed != null && speed > 0){
            this.speed = speed;
        }
    }

    /**
     * ショットの攻撃力を設定する
     * @param {number} [power] - 設定する攻撃力
     */
    setPower(power){
        // もしスピード引数が有効なら設定する
        if(power != null && power > 0){
            this.power = power;
        }
    }

    /**
     * ショットが衝突判定を行う対象を設定する
     * @param {Array<Character>} [targets] - 衝突判定の対象を含む配列
     */
    setTargets(targets){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしショットのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}
        // もしショットが画面外へ移動していたらライフを 0（非生存の状態）に設定する
        if(
            this.position.x + this.width < 0 ||
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y - this.height > this.ctx.canvas.height
        ){
            this.life = 0;
        }
        // ショットを進行方向に沿って移動させる
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        // ショットと対象との衝突判定を行う
        this.targetArray.map((v) => {
            // 自身か対象のライフが 0 以下の対象は無視する
            if(this.life <= 0 || (v.life <= 0)){return;}//弾を打つキャラクターが増えたら変更
            if(v instanceof Enemy === true && v.type === 'Sugi'){
                // 自身の位置と対象との距離を測る
                let dist = this.position.distance(v.position);
                // 自身と対象の幅の 1/4 の距離まで近づいている場合衝突とみなす
                if(dist <= (this.width + v.width) / 4){
                    // 対象のライフを攻撃力分減算する
                    v.life -= this.power;
                    let score = 0;
                    score = 100;
                    v.update_method = 'gameover';
                    // スコアシステムにもよるが仮でここでは最大スコアを制限
                    gameScore = Math.min(gameScore + score, 99999);
                    // 自身のライフを 0 にする
                    this.life = 0;
                }
            }else if(v instanceof Enemy === true && v.type === 'Flower'){
                if(Position.collision_circle_rectangle(this.position, this.width / 2, v.position, v.width, v.height)){
                    // 対象のライフを攻撃力分減算する
                    v.life -= this.power;
                    if(v.life <= 0){
                        let score = 0;
                        score = 500;
                        // スコアシステムにもよるが仮でここでは最大スコアを制限
                        gameScore = Math.min(gameScore + score, 99999);
                        v.update_method = 'gameover';
                    }
                    // 自身のライフを 0 にする
                    this.life = 0;
                }
            }else if(v instanceof Boss === true){
                if(Position.collision_circle_rectangle(this.position, this.width / 2, v.position, v.width, v.height)){
                    // 対象のライフを攻撃力分減算する
                    v.life -= this.power;
                    if(v.life <= 0){
                        let score = 0;
                        score = 10000;
                        // スコアシステムにもよるが仮でここでは最大スコアを制限
                        gameScore = Math.min(gameScore + score, 99999);
                        v.update_method = 'gameover';
                    }
                    // 自身のライフを 0 にする
                    this.life = 0;
                }
            }else if(v instanceof Medama === true){
                // 自身の位置と対象との距離を測る
                let dist = this.position.distance(v.position);
                // 自身と対象の幅の 1/4 の距離まで近づいている場合衝突とみなす
                if(dist <= (this.width + v.width) / 4){
                    // 自機キャラクターが対象の場合、isComing フラグによって無敵になる
                    //もしめだまがダメージを受けた直後なら無視する
                    if(v.isDamaged === false && v.isComing === false){
                        // 対象のライフを攻撃力分減算する
                       v.life -= this.power;
                       //めだまのフラグを立てる
                       v.isDamaged = true;
                       v.damagedFrame = v.frame;
                       // 自身のライフを 0 にする
                       this.life = 0;
                   }
                }
            }
        });
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';

        // 座標系の回転を考慮した描画を行う
        this.rotationDraw();
    }
}

/**
 * Egg_Shot クラス
 */
class Egg_Shot extends Shot{
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, imagePath);

        /**
         * 自身の移動スピード
         * @type {number}
         */
        this.speed = 5;
        /**
         * 自身の攻撃力
         * @type {number}
         */
        this.power = 1;
        /**
         * 自身と衝突判定を取る対象を格納する
         * @type {Array<Medama, Block>}
         */
        this.targetArray = [];
        /**
         * 自身から生まれる対象を格納する
         * @type {Array<Enemy>}
         */
        this.bornArray = [];
    }

    /**
     * ショットを配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [speed] - 設定するスピード
     * @param {number} [power] - 設定する攻撃力
     */
    set(x, y, speed, power){
        // 登場開始位置にショットを移動させる
        this.position.set(x, y);
        // ショットのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // スピードを設定する
        this.setSpeed(speed);
        // 攻撃力を設定する
        this.setPower(power);
        //ベクトルを設定する
        this.vector.set(-4.5, this.speed);
    }

    /**
     * ショットが衝突判定を行う対象と生むキャラクターを設定する
     * @param {Array<Character>} [targets] - 衝突判定の対象を含む配列
     * @param {Array<Enemy>} [borns] - 衝突判定の対象を含む配列
     */
    setCharacters(targets, borns){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
        // 引数の状態を確認して有効な場合は設定する
        if(borns != null && Array.isArray(borns) === true && borns.length > 0){
            this.bornArray = borns;
        }
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしショットのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}
        // もしショットが画面外へ移動していたらライフを 0（非生存の状態）に設定する
        if(
            this.position.x + this.width < 0 ||
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y - this.height > this.ctx.canvas.height
        ){
            this.life = 0;
        }
        // ショットを進行方向に沿って移動させる
        this.vector.set(this.vector.x, this.vector.y + this.gravity);
        //ショットを動かす
        this.move();

        // ショットと対象との衝突判定を行う
        this.targetArray.map((v) => {
            // 自身か対象のライフが 0 以下の対象は無視する
            if(this.life <= 0 || v.life <= 0){return;}
            //めだまかブロックかで衝突判定の仕方を変える
            if(v instanceof Medama === true){
                // 自身の位置と対象との距離を測る
                let dist = this.position.distance(v.position);
                // 自身と対象の幅の 1/4 の距離まで近づいている場合衝突とみなす
                if(dist <= (this.width + v.width) / 4){
                    // 自機キャラクターが対象の場合、isComing フラグによって無敵になる
                    //もしめだまがダメージを受けた直後なら無視する
                    if(v.isDamaged === false && v.isComing === false){
                        // 対象のライフを攻撃力分減算する
                       v.life -= this.power;
                       //めだまのフラグを立てる
                       v.isDamaged = true;
                       v.damagedFrame = v.frame;
                       // 自身のライフを 0 にする
                       this.life = 0;
                   }
                }
            }else if(v instanceof Block === true){
                if(Position.collision_circle_rectangle(this.position, this.width / 2, v.position, v.width, v.height)){
                    // ライフが 0 の状態の敵キャラクター（小）が見つかったら配置する
                    for(let i = 0; i < this.bornArray.length; ++i){
                        if(this.bornArray[i].life <= 0 && this.bornArray[i].update_method === 'update'){
                            let e = this.bornArray[i];
                            e.set(this.position.x, v.position.y - v.height / 2 - e.height / 2, 1, 'Sugi');
                            break;
                        }
                    }
                    // 自身のライフを 0 にする
                    this.life = 0;
                }
            }
        });
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';

        // 座標系の回転を考慮した描画を行う
        this.rotationDraw();
    }
}

class Homing extends Shot {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} image - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元（Shot）の初期化
        super(ctx, x, y, w, h, imagePath);

    }

    /**
     * ホーミングショットを配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [speed] - 設定するスピード
     * @param {number} [power] - 設定する攻撃力
     */
    set(x, y, speed, power){
        // 登場開始位置にショットを移動させる
        this.position.set(x, y);
        // ショットのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // スピードを設定する
        this.setSpeed(speed);
        // 攻撃力を設定する
        this.setPower(power);
        // フレームをリセットする
        this.frame = 0;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしショットのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}
        // もしショットが画面外へ移動していたらライフを 0（非生存の状態）に設定する
        if(
            this.position.x + this.width < 0 ||
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y - this.height > this.ctx.canvas.height
        ){
            this.life = 0;
        }
        // ショットをホーミングさせながら移動させる
        // ※ホーミングで狙う対象は、this.targetArray[0] のみに限定する
        let target = this.targetArray[this.targetArray.length - 1];
        // 自身のフレーム数が 100 より小さい場合はホーミングする
        if(this.frame < 100){
            // ターゲットとホーミングショットの相対位置からベクトルを生成する
            let vector = new Position(
                target.position.x - this.position.x,
                target.position.y - this.position.y
            );
            // 生成したベクトルを単位化する
            let normalizedVector = vector.normalize();
            // 自分自身の進行方向ベクトルも、念のため単位化しておく
            this.vector = this.vector.normalize();
            // ふたつの単位化済みベクトルから外積を計算する
            let cross = this.vector.cross(normalizedVector);
            // 外積の結果は、スクリーン空間では以下のように説明できる
            // 結果が 0.0     → 真正面か真後ろの方角にいる
            // 結果がプラス   → 右半分の方向にいる
            // 結果がマイナス → 左半分の方向にいる
            // １フレームで回転できる量は度数法で約 1 度程度に設定する
            let rad = Math.PI / 180.0;
            if(cross > 0.0){
                // 右側にターゲットいるので時計回りに回転させる
                this.vector.rotate(rad);
            }else if(cross < 0.0){
                // 左側にターゲットいるので反時計回りに回転させる
                this.vector.rotate(-rad);
            }
            // ※真正面や真後ろにいる場合はなにもしない
        }
        //だんだんとスピードを上げる
        this.speed += 0.1;
        // 進行方向ベクトルを元に移動させる
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        // 自身の進行方向からアングルを計算し設定する
        this.angle = Math.atan2(this.vector.y, this.vector.x);

        // ショットと対象との衝突判定を行う
        // ※以下は Shot クラスの衝突判定とまったく同じロジック
        this.targetArray.map((v) => {
            if(this.life <= 0 || v.life <= 0){return;}

            //めだまかブロックかで衝突判定の仕方を変える
            if(v instanceof Medama === true){
                // 自身の位置と対象との距離を測る
                let dist = this.position.distance(v.position);
                // 自身と対象の幅の 1/4 の距離まで近づいている場合衝突とみなす
                if(dist <= (this.width + v.width) / 4){
                    // 自機キャラクターが対象の場合、isComing フラグによって無敵になる
                    //もしめだまがダメージを受けた直後なら無視する
                    if(v.isDamaged === false && v.isComing === false){
                        // 対象のライフを攻撃力分減算する
                        v.life -= this.power;
                        //めだまのフラグを立てる
                        v.isDamaged = true;
                        v.damagedFrame = v.frame;
                        // 自身のライフを 0 にする
                        this.life = 0;
                    }
                }
            }else if(v instanceof Block === true){
                if(Position.collision_circle_rectangle(this.position, this.width / 2, v.position, v.width, v.height)){
                    
                    // 自身のライフを 0 にする
                    this.life = 0;
                }
            }
        });
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';
        // 座標系の回転を考慮した描画を行う
        this.rotationDraw();
        // 自身のフレームをインクリメントする
        ++this.frame;
    }
}

/**
 * Block クラス
 */
class Block extends Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);

        /**
         * 自身のタイプ
         * @type {string}
         */
        this.type = 'default';
        /**
         * 自身の移動スピード
         * @type {number}
         */
        this.speed = 5
        /**
         * 自身と衝突判定を取る対象を格納する
         * @type {Array<Character>}
         */
        this.targetArray = [];
         /**
          * 自身が持っている障害物を格納する
          * @type {Array<Obstacle>}
          */
        this.obstacleArray = [];
        /**
         * 自身が持っているアイテムを格納する
         * @type {Array<Item>}
         */
        this.itemArray = [];
    }

    /**
     * ブロックを配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {string} [type='default'] -設定するタイプ
     * @param {number} speed -設定するスピード
     * @param {Position} vector -設定するベクトル
     */
    set(x, y, type = 'default', speed, vector){
        // 登場開始位置にブロックを移動させる
        this.position.set(x, y);
        // ブロックのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // ブロックのタイプを設定する
        this.type = type;
        //ブロックのスピードを設定する
        this.speed = speed;
        //ブロックのベクトルを設定する
        this.vector = vector;
        // ブロックのフレームをリセットする
        this.frame = 0;
    }

    /**
     * 当たり判定の対象を設定する
     * @param {Array<Character>} [targets] - 衝突判定の対象を含む配列
     */
    setTarget(targets){
        // 引数の状態を確認して有効な場合は設定する
        if(targets != null && Array.isArray(targets) === true && targets.length > 0){
            this.targetArray = targets;
        }
    }

    /**
     * 自身が持っているキャラクターを設定する
     * @param {Array<Obstacle>} [obstacles] - 障害物が格納された配列
     * @param {Array<Item>} [items] - アイテムが格納された配列
     */
    setCharacters(obstacles, items){
        // 引数の状態を確認して有効な場合は設定する
        if(obstacles != null && Array.isArray(obstacles) === true && obstacles.length > 0){
            this.obstacleArray = obstacles;
        }
        // 引数の状態を確認して有効な場合は設定する
        if(items != null && Array.isArray(items) === true & items.length > 0){
            this.itemArray = items;
        }
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしブロックのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}

        // タイプに応じて挙動を変える
        // タイプに応じてライフを 0 にする条件も変える
        switch(this.type){
            // default タイプは設定されている進行方向にまっすぐ進むだけの挙動
            case 'default':
            default:
                this.move();
                // 画面外（画面左端）へ移動していたらライフを 0（非生存の状態）に設定する
                if(this.position.x + this.width < 0){
                    this.life = 0;
                }
                break;
            //グラウンドタイプは地面の働きをする
            case 'ground':
                break;
        }

        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';

        // 描画を行う（いまのところ特に回転は必要としていないのでそのまま描画）
        this.draw();
    }
}


/**
 * Obstacleクラス
 */
class Obstacle extends Character {
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);

        /**
         * 自身のタイプ
         * @type {string}
         */
        this.type = 'default';
        /**
         * 自身がくっついているブロック
         * @type {Block}
         */
        this.targetBlock = null;
        /**
         * 与えるダメージ
         * @type {number}
         */
        this.damage = null;
    }

    /**
     * 障害物を配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [type='default'] -設定するタイプ
     * @param {Block} block - くっつくブロック
     * @param {number} damage - 与えるダメージ
     */
    set(x, y, type = 'default', block, damage){
        // 登場開始位置にブロックを移動させる
        this.position.set(x, y);
        // ブロックのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // ブロックのタイプを設定する
        this.type = type;
        //くっつくブロックを設定する
        this.targetBlock = block;
        //与えるダメージを設定する
        this.damage = damage;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしブロックのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}

        switch(this.type){
            case 'default':
            default:
                this.move(this.targetBlock.vector);
                // 画面外（画面左端）へ移動していたらライフを 0（非生存の状態）に設定する
                if(this.position.x + this.width < 0){
                    this.life = 0;
                }
                break;
        }
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';

        // 描画を行う
        this.draw();
    }
}

/**
 * 
 */
class Item extends Block{
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, imagePath);

        /**
         * 自身のタイプ
         * @type {string}
         */
        this.type = 'heal';
        /**
         * 自身がくっついているブロック
         * @type {Block}
         */
        this.targetBlock = null;
        /**
         * 自身の移動スピード
         * @type {number}
         */
        this.speed = 5
        /**
         * 自身の回復量
         * @type {number}
         */
        this.healing = 1;
    }

    /**
     * 障害物を配置する
     * @param {number} x - 配置する X 座標
     * @param {number} y - 配置する Y 座標
     * @param {number} [type='heal'] -設定するタイプ
     * @param {Block} block - くっつくブロック
     * @param {number} [healing=1] - 与える回復量
     */
    set(x, y, type = 'heal', block, healing = 1){
        // 登場開始位置にブロックを移動させる
        this.position.set(x, y);
        // ブロックのライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
        // ブロックのタイプを設定する
        this.type = type;
        //くっつくブロックを設定する
        this.targetBlock = block;
        //与える回復量を設定する
        this.healing = healing;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしブロックのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}

        switch(this.type){
            case 'healing':
                this.move(this.targetBlock.vector);
                // 画面外（画面左端）へ移動していたらライフを 0（非生存の状態）に設定する
                if(this.position.x + this.width < 0){
                    this.life = 0;
                }
                break;
            default:
                this.move();
                // 画面外（画面左端）へ移動していたらライフを 0（非生存の状態）に設定する
                if(this.position.x + this.width < 0){
                    this.life = 0;
                }
                break;

        }
        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';

        // 描画を行う
        this.draw();
    }
}

/**
 * Heart クラス
 */
class Heart extends Character{
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} imagePath - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);

        /**
         * めだまを格納する
         * @type {Medama}
         */
        this.medama = null;
    }


    /**
     * ハートを配置する
     * @param {Medama} medama - めだま
     */
    set(medama){
        //めだまを格納する
        this.medama = medama;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
            this.ctx.globalAlpha = 1.0;
            this.ctx.filter = 'none';
        try {
            //満たされたハートの描画
            let i;
            for(i = 0; this.medama.life > i; ++i){
                this.position.set(120 + i * 40, 45);
                // 描画を行う
                this.heart_draw('filled');
            }
            //空のハートの描画
            if(i <= 2){
                for(i; 3 > i; ++i){
                    this.position.set(120 + i * 40, 45);
                    // 描画を行う
                    this.heart_draw('empty');
                }
            }
        } catch {
            return;
        }
    }


    /**
     * ハートクラスのための特殊な描画関数
     * @param {string} type - ハートのタイプ
     */
    heart_draw(type){
        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        switch(type){
            case 'empty':
                // キャラクターの幅やオフセットする量を加味して描画する
                this.ctx.drawImage(
                    this.imageArray[0],
                    this.position.x - offsetX,
                    this.position.y - offsetY,
                    this.width,
                    this.height
                );
                break;

            case 'filled':
                // キャラクターの幅やオフセットする量を加味して描画する
                this.ctx.drawImage(
                    this.imageArray[1],
                    this.position.x - offsetX,
                    this.position.y - offsetY,
                    this.width,
                    this.height
                );
                break;
        }
    }
}


class Background extends Character{
    /**
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - 描画などに利用する 2D コンテキスト
     * @param {number} x - X 座標
     * @param {number} y - Y 座標
     * @param {number} w - 幅
     * @param {number} h - 高さ
     * @param {Image} image - キャラクター用の画像のパス
     */
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);
    }

    set(x = this.width / 2, y = this.height / 2){
        // 移動させる
        this.position.set(x, y);
        // ライフを 0 より大きい値（生存の状態）に設定する
        this.life = 1;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // もしブロックのライフが 0 以下の場合はなにもしない
        if(this.life <= 0){return;}

        this.ctx.globalAlpha = 1.0;
        this.ctx.filter = 'none';
        this.draw();
    }

}
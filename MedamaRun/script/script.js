(() => {
    /**
     * キーの押下状態を調べるためのオブジェクト
     * このオブジェクトはプロジェクトのどこからでも参照できるように
     * window オブジェクトのカスタムプロパティとして設定する
     * @global
     * @type {object}
     */
    window.isKeyDown = {};
    /**
     * スコアを格納する
     * このオブジェクトはプロジェクトのどこからでも参照できるように
     * window オブジェクトのカスタムプロパティとして設定する
     * @global
     * @type {number}
     */
    window.gameScore = 0;
    
    /**
     * canvas の幅
     * @type {number}
     */
    const CANVAS_WIDTH = 1000;
    /**
     * canvas の高さ
     * @type {number}
     */
    const CANVAS_HEIGHT = 480;
    /**
     * 敵キャラクター（小）のインスタンス数
     * @type {number}
     */
    const ENEMY_SMALL_MAX_COUNT = 30;
    /**
     * 敵キャラクター（花）のインスタンス数
     * @type {number}
     */
    const ENEMY_FLOWER_MAX_COUNT = 10;
    /**
     * 敵キャラクター（埃）のインスタンス数
     * @type {number}
     */
    const ENEMY_DUST_MAX_COUNT = 10;
    /**
     * ショットの最大個数
     * @type {number}
     */
    const SHOT_MAX_COUNT = 10;
    /**
     * ボスのショットの最大個数
     * @type {number}
     */
    const BOSS_SHOT_MAX_COUNT = 30;
    /**
     * エッグショットの最大個数
     * @type {number}
     */
    const EGG_SHOT_MAX_COUNT = 20;
    /**
     * ボスキャラクターのホーミングショットの最大個数
     * @type {number}
     */
    const HOMING_MAX_COUNT = 50;
    /**
     * defaultブロックのインスタンス数
     * @type {number}
     */
    const BLOCK_DEFAULT_MAX_COUNT = 20;
    /**
     * default障害物のインスタンス数
     * @type {number}
     */
    const OBSTACLE_DEFAULT_MAX_COUNT = 40;
    /**
     * defaultアイテムのインスタンス数
     * @type {number}
     */
    const ITEM_DEFAULT_MAX_COUNT = 10;


    /**
     * Canvas2D API をラップしたユーティリティクラス
     * @type {Canvas2DUtility}
     */
    let util = null;
    /**
     * 描画対象となる Canvas Element
     * @type {HTMLCanvasElement}
     */
    let canvas = null;
    /**
     * Canvas2D API のコンテキスト
     * @type {CanvasRenderingContext2D}
     */
    let ctx = null;
    /**
     * シーンマネージャー
     * @type {SceneManager}
     */
    let scene = null;
    /**
     * 実行開始時のタイムスタンプ
     * @type {number}
     */
    let startTime = null;
    /**
     * めだまのインスタンス
     * @type {Medama}
     */
    let medama = null;
    /**
     * めだま登場演出時の開始X座標
     * @type {number}
     */
    let medamaStartX = null;
    /**
     * めだま登場演出時の開始Y座標
     * @type {number}
     */
    let medamaStartY = null;
    /**
     * めだま登場演出時の終了X座標
     * @type {number}
     */
    let medamaEndX = null;
    /**
     * めだま登場演出時の終了Y座標
     * @type {number}
     */
    let medamaEndY = null;
    /**
     * ボスキャラクターのインスタンスを格納する配列
     * @type {Boss}
     */
    let boss = null;
    /**
     * 敵キャラクターのインスタンスを格納する配列
     * @type {Array<Enemy>}
     */
    let enemyArray = [];
    /**
     * ショットのインスタンスを格納する配列
     * @type {Array<Shot>}
     */
    let shotArray = [];
    /**
     * ボスのショットのインスタンスを格納する配列
     * @type {Array<Shot>}
     */
    let bossShotArray = [];
    /**
     * エッグショットのインスタンスを格納する配列
     * @type {Array<Egg_Shot>}
     */
    let eggShotArray = [];
    /**
     * ボスキャラクターのホーミングショットのインスタンスを格納する配列
     * @type {Array<Homing>}
     */
    let homingArray = [];
    /**
     * ブロックのインスタンスを格納する配列
     * @type {Array<Block>}
     */
    let blockArray = [];
    /**
     * 地面タイプのブロックを格納する変数
     * @type {Block}
     */
    let ground = null;
    /**
     * 障害物のインスタンスを格納する配列
     * @type {Array<Obstacle>}
     */
    let obstacleArray = [];
    /**
     * アイテムのインスタンスを格納する配列
     * @type {Array<Item>}
     */
    let itemArray = [];
    /**
     * 再スタートするためのフラグ
     * @type {boolean}
     */
    let restart = false;
    /**
     * ハートを格納するための変数
     * @type {Heart}
     */
    let heart = null;
    /**
     * 背景を格納するための変数
     * @type {Background}
     */
    let back = null;
    var data = [];


    /**
     * ページのロードが完了したときに発火する load イベント
     */
    window.addEventListener('load', () => {
        // ユーティリティクラスを初期化
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        // ユーティリティクラスから canvas を取得
        canvas = util.canvas;
        // ユーティリティクラスから 2d コンテキストを取得
        ctx = util.context;
        // canvas の大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 初期化処理を行う
        initialize();
        // インスタンスの状態を確認する
        loadCheck();
    }, false);

    /**
     * canvas やコンテキストを初期化する
     */
    function initialize(){
        // シーンを初期化する
        scene = new SceneManager();
        //背景を初期化する
        back = new Background(ctx, CANVAS_WIDTH / 2, CANVAS_WIDTH / 2, CANVAS_WIDTH, CANVAS_HEIGHT, ['./image/Background_default.png']);

        // 自機のショットを初期化する
        for(let i = 0; i < SHOT_MAX_COUNT; ++i){
            shotArray[i] = new Shot(ctx, 0, 0, 32, 32, ['./image/medama_single_shot.png']);
        }
        
        //めだま登場演出時の値を設定（後でステージによって登場位置を変えるような処理をする）
        medamaStartX = 0;
        medamaStartY = CANVAS_HEIGHT - 54;
        medamaEndX = 100;
        medamaEndY = CANVAS_HEIGHT - 54;

        // めだまを初期化する
        medama = new Medama(ctx, 0, 0, 64, 64, ['./image/Medama_default1.png', './image/Medama_default2.png'], ['./image/Medama_gameover.png']);
        // 登場シーンからスタートするための設定を行う
        medama.setComing(
            medamaStartX,
            medamaStartY,
            medamaEndX,
            medamaEndY
        );
        // ショットを自機キャラクターに設定する
        medama.setShotArray(shotArray);
        //defaultブロックを初期化する
        for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT; ++i){
            blockArray[i] = new Block(ctx, 0, 0, 200, 30, ['./image/Block_default1.png']);
            blockArray[i].setTarget([medama]);
        }
        //groundブロックを初期化する
        ground = new Block(ctx, 0, 0, CANVAS_WIDTH * 2, 20, ['./image/Block_ground.png']);
        blockArray[BLOCK_DEFAULT_MAX_COUNT] = ground;        
        //障害物を初期化する
        for(let i = 0; i < OBSTACLE_DEFAULT_MAX_COUNT; ++i){
            obstacleArray[i] = new Obstacle(ctx, 0, 0, 32, 32, ['./image/Obstacle_default1.png']);
        }
        //アイテムを初期化する
        for(let i = 0; i < ITEM_DEFAULT_MAX_COUNT; ++i){
            itemArray[i] = new Item(ctx, 0, 0, 32, 32, ['./image/Item_healing.png']);
        }
        // 敵キャラクター（小）を初期化する
        for(let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i){
            enemyArray[i] = new Enemy(ctx, 0, 0, 64, 64, ['./image/Enemy_default1_1.png', './image/Enemy_default1_2.png'], ['./image/Enemy_default1_gameover.png']);
            //敵キャラクターの立つブロックを設定する
            enemyArray[i].setTarget(blockArray);
        }
        // ボスのショットを初期化する
        for(i = 0; i < BOSS_SHOT_MAX_COUNT; ++i){
            bossShotArray[i] = new Shot(ctx, 0, 0, 32, 32, ['./image/Boss_Shot.png']);
            bossShotArray[i].setTargets([medama]); // 引数は配列なので注意
        }
        // エッグショットを初期化する
        let Characters = [];
        for(let i = 0; i < blockArray.length; ++i){
            Characters[i] = blockArray[i];
        }
        Characters.push(medama);
        for(let i = 0; i < EGG_SHOT_MAX_COUNT; ++i){
            eggShotArray[i] = new Egg_Shot(ctx, 0, 0, 32, 32, ['./image/Egg_Shot_1.png']);
            // 衝突判定を行うために対象を設定する
            eggShotArray[i].setCharacters(Characters, enemyArray); // 引数は配列なので注意
        }
        // ボスキャラクターのホーミングショットを初期化する
        for(i = 0; i < HOMING_MAX_COUNT; ++i){
            homingArray[i] = new Homing(ctx, 0, 0, 32, 32, ['./image/Boss_Homing_Shot.png']);
            homingArray[i].setTargets(Characters); // 引数は配列なので注意
        }
        // ボスキャラクターを初期化する
        boss = new Boss(ctx, 0, 0, 250, 340, ['./image/Boss_default1.png', './image/Boss_default2.png', './image/Boss_attack1.png', './image/Boss_attack2.png', './image/Boss_summoning1.png', './image/Boss_summoning2.png'], ['./image/Boss_gameover.png']);
        // 敵キャラクターはすべて同じショットを共有するのでここで与えておく
        boss.setShotArray(bossShotArray);
        // ボスキャラクターはホーミングショットを持っているので設定する
        boss.setHomingArray(homingArray);
        // 敵キャラクターは常に自機キャラクターを攻撃対象とする
        boss.setAttackTarget(medama);
        //召喚対象の敵キャラクターを設定する
        boss.setSummonTarget(enemyArray)
        //敵キャラクター（花）を初期化する
        for(let i = 0;i < ENEMY_FLOWER_MAX_COUNT; ++i){
            enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 64, 153, ['./image/Enemy_flower_1.png', './image/Enemy_flower_2.png'], ['./image/Enemy_flower_gameover.png']);
            //敵キャラクターの持つショットを設定する
            enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(eggShotArray);
        }
        // ボスキャラクターも衝突判定の対象とするために配列に加えておく
        let concatEnemyArray = enemyArray.concat([boss]);
        // 衝突判定を行うために対象を設定する
        for(let i = 0; i < SHOT_MAX_COUNT; ++i){
            shotArray[i].setTargets(concatEnemyArray);
        }
        for(let i = 0; i < BOSS_SHOT_MAX_COUNT; ++i){
            bossShotArray[i].setTargets([medama]);
        }
        //敵キャラクター（埃）を初期化する
        for(let i = 0; i < ENEMY_DUST_MAX_COUNT; ++i){
            enemyArray[ENEMY_FLOWER_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 64, 64, ['./image/Enemy_dust.png']);
        }
        //めだまの衝突判定をとる相手を設定する
        let Obstacles = obstacleArray.concat(enemyArray);
        medama.setTarget(blockArray, Obstacles, itemArray);      
        //ハートを初期化する
        heart = new Heart(ctx, 0, 0, 32, 32, ['./image/empty_heart.png', './image/filled_heart.png'])
    }

    /**
     * インスタンスの準備が完了しているか確認する
     */
    function loadCheck(){
        // 準備完了を意味する真偽値
        let ready = true;
        // AND 演算で準備完了しているかチェックする
        medama.readyArray.map((r) => {
            ready = ready && r;
        });
        // 同様に敵キャラクターの準備状況も確認する
        enemyArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            })           
        })
        //同様にブロックの準備状況も確認する
        blockArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様に障害物の準備状況も確認する
        obstacleArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様にアイテムの準備状況も確認する
        itemArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様にショットの準備状況も確認する
        shotArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様にエッグショットの準備状況も確認する
        eggShotArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        // 同様にホーミングショットの準備状況も確認する
        homingArray.map((v) =>{
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様にボスのショットの準備状況も確認する
        bossShotArray.map((v) => {
            v.readyArray.map((r) => {
                ready = ready && r;
            });
        });
        //同様にハートの準備状況も確認する
        heart.readyArray.map((r) => {
            ready = ready && r;
        });
        //同様に背景の準備状況も確認する
        back.readyArray.map((r) => {
            ready = ready && r;
        });

        // 全ての準備が完了したら次の処理に進む
        if(ready === true){
            // イベントを設定する
            eventSetting();
            // シーンを定義する
            sceneSetting();
            // 実行開始時のタイムスタンプを取得する
            startTime = Date.now();
            // 描画処理を開始する
            render();
        }else{
            // 準備が完了していない場合は 0.1 秒ごとに再帰呼出しする
            setTimeout(loadCheck, 100);
        }
    }

    /**
     * イベントを設定する
     */
    function eventSetting(){
        // キーの押下時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keydown', (event) => {
            // キーの押下状態を管理するオブジェクトに押下されたことを設定する
            isKeyDown[`key_${event.key}`] = true;
             // ゲームオーバーから再スタートするための設定（エンターキー）
             if(event.key === 'Enter'){
                // 自機キャラクターのライフが 0 以下の状態
                if(medama.life <= 0){
                    // 再スタートフラグを立てる
                    restart = true;
                }
            }
        }, false);
        // キーが離された時に呼び出されるイベントリスナーを設定する
        window.addEventListener('keyup', (event) => {
            // キーが離されたことを設定する
            isKeyDown[`key_${event.key}`] = false;
        }, false);
    }

    /**
     * シーンを設定する
     */
    function sceneSetting(){
        // イントロシーン
        scene.add('intro', (time) => {
            if(scene.frame === 0){
                //地面を配置する
                let v = new Position(0, 0);
                ground.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT - ground.height / 2, 'ground', 0, v);
                medama.standing_Block = ground;
                //ハートを配置する
                heart.set(medama);
                //背景を配置する
                back.set();
            }
            if(time > 3.0){
                scene.use('small');
            }
        });
        scene.add('small', (time) => {
            if(scene.frame % 200 === 0){
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 150, 'default', 5, v);
                        //ライフが0の状態のデフォルト障害物が見つかったら配置する
                        for(let n = 0; n < OBSTACLE_DEFAULT_MAX_COUNT; ++n){
                            if(obstacleArray[n].life <= 0){
                                obstacleArray[n].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                blockArray[i].position.y - blockArray[i].height / 2 - obstacleArray[n].height / 2,
                                'default',
                                blockArray[i],
                                1);
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            if((scene.frame - 100) % 200 ===0){
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 250, 'default', 5, v);
                        //ライフが0の状態の回復アイテムが見つかったら配置する
                        if(scene.frame % 500 ===0){
                            for(let t = 0; t < ITEM_DEFAULT_MAX_COUNT; ++t){
                                if(itemArray[t].life <= 0){
                                    itemArray[t].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                    blockArray[i].position.y - blockArray[i].height / 2 - itemArray[t].height / 2,
                                    'healing',
                                    blockArray[i],
                                    1);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            if (scene.frame % 60 === 0) {
                // ライフが 0 の状態の敵キャラクター（小）が見つかったら配置する
                for(let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i){
                    if(enemyArray[i].life <= 0 && enemyArray[i].update_method === 'update'){
                        let e = enemyArray[i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width,
                              generateRandomInt(436),
                              1, 'Sugi');
                        break;
                    }
                }
            }
            if(scene.frame % 200 === 0){
                // ライフが 0 の状態の敵キャラクター（埃）が見つかったら配置する
                for(let i = 0; i < ENEMY_DUST_MAX_COUNT; ++i){
                    if(enemyArray[ENEMY_FLOWER_MAX_COUNT + i].life <= 0 && enemyArray[ENEMY_FLOWER_MAX_COUNT + i].update_method === 'update'){
                        let e = enemyArray[ENEMY_FLOWER_MAX_COUNT + i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width,
                              medama.position.y,
                              1, 'Dust');
                        e.setVector(-5, 0);
                        break;
                    }
                }
            }
            // めだまのライフが 0 になっていたらゲームオーバー
            if(medama.life <= 0){
                scene.use('gameover');
            }
            if(scene.frame === 600){
                scene.use('blank1');
            }
        });
        scene.add('blank1', (time) =>{
            // めだまのライフが 0 になっていたらゲームオーバー
            if(medama.life <= 0){
                scene.use('gameover');
            }
            if(scene.frame === 300){
                scene.use('flower');
            }
        });
        scene.add('flower', (time) =>{
            if(scene.frame % 200 === 0){
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 150, 'default', 5, v);
                        //ライフが0の状態のデフォルト障害物が見つかったら配置する
                        for(let n = 0; n < OBSTACLE_DEFAULT_MAX_COUNT; ++n){
                            if(obstacleArray[n].life <= 0){
                                obstacleArray[n].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                blockArray[i].position.y - blockArray[i].height / 2 - obstacleArray[n].height / 2,
                                'default',
                                blockArray[i],
                                1);
                                break;
                            }
                        }
                        break;
                    }
                }
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 280, 'default', 5, v);
                        //ライフが0の状態のデフォルト障害物が見つかったら配置する
                        for(let n = 0; n < OBSTACLE_DEFAULT_MAX_COUNT; ++n){
                            if(obstacleArray[n].life <= 0){
                                obstacleArray[n].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                blockArray[i].position.y - blockArray[i].height / 2 - obstacleArray[n].height / 2,
                                'default',
                                blockArray[i],
                                1);
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            if((scene.frame - 100) % 200 ===0){
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 220, 'default', 5, v);
                        //ライフが0の状態の回復アイテムが見つかったら配置する
                        if(scene.frame % 500 ===0){
                            for(let t = 0; t < ITEM_DEFAULT_MAX_COUNT; ++t){
                                if(itemArray[t].life <= 0){
                                    itemArray[t].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                    blockArray[i].position.y - blockArray[i].height / 2 - itemArray[t].height / 2,
                                    'healing',
                                    blockArray[i],
                                    1);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            if(scene.frame % 250 === 0){
                // ライフが 0 の状態の敵キャラクター（花）が見つかったら配置する
                for(let i = 0; i < ENEMY_FLOWER_MAX_COUNT; ++i){
                    if(enemyArray[ENEMY_SMALL_MAX_COUNT + i].life <= 0 && enemyArray[ENEMY_SMALL_MAX_COUNT + i].update_method === 'update'){
                        let e = enemyArray[ENEMY_SMALL_MAX_COUNT + i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width, 180, 10, 'Flower');
                        break;
                    }
                }
            }
            if(scene.frame % 100 ===0){
                // ライフが 0 の状態の敵キャラクター（小）が見つかったら配置する
                for(let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i){
                    if(enemyArray[i].life <= 0 && enemyArray[i].update_method === 'update'){
                        let e = enemyArray[i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width,
                              generateRandomInt(436),
                              1, 'Sugi');
                        break;
                    }
                }
            }
            if(scene.frame % 200 === 0){
                // ライフが 0 の状態の敵キャラクター（埃）が見つかったら配置する
                for(let i = 0; i < ENEMY_DUST_MAX_COUNT; ++i){
                    if(enemyArray[ENEMY_FLOWER_MAX_COUNT + i].life <= 0 && enemyArray[ENEMY_FLOWER_MAX_COUNT + i].update_method === 'update'){
                        let e = enemyArray[ENEMY_FLOWER_MAX_COUNT + i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width,
                              medama.position.y,
                              1, 'Dust');
                        e.setVector(-5, 0);
                        break;
                    }
                }
            }
            // めだまのライフが 0 になっていたらゲームオーバー
            if(medama.life <= 0){
                scene.use('gameover');
            }
            if(scene.frame === 600){
                scene.use('blank2');
            }
        });
        scene.add('blank2', (time) => {
            // めだまのライフが 0 になっていたらゲームオーバー
            if(medama.life <= 0){
                scene.use('gameover');
            }
            if(scene.frame === 300){
                scene.use('invade_boss');
            }
        });
        //normal シーン
        scene.add('normal', (time) => {
            if(scene.frame % 100 === 0){
                //ライフが0の状態のデフォルトブロックが見つかったら配置する
                for(let i = 0; i < BLOCK_DEFAULT_MAX_COUNT - 1; ++i){
                    if(blockArray[i].life <= 0){
                        let v = new Position(-3, 0);                       
                        blockArray[i].set(CANVAS_WIDTH + blockArray[i].width, CANVAS_HEIGHT - 150, 'default', 5, v);
                        //ライフが0の状態のデフォルト障害物が見つかったら配置する
                        for(let n = 0; n < OBSTACLE_DEFAULT_MAX_COUNT; ++n){
                            if(obstacleArray[n].life <= 0){
                                obstacleArray[n].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                blockArray[i].position.y - blockArray[i].height / 2 - obstacleArray[n].height / 2,
                                'default',
                                blockArray[i],
                                1);
                                //ライフが0の状態の回復アイテムが見つかったら配置する
                                if(scene.frame % 500 ===0){
                                    for(let t = 0; t < ITEM_DEFAULT_MAX_COUNT; ++t){
                                        if(itemArray[t].life <= 0){
                                            itemArray[t].set(blockArray[i].position.x - blockArray[i].width / 2 + Math.random() * blockArray[i].width,
                                            blockArray[i].position.y - blockArray[i].height / 2 - itemArray[t].height / 2,
                                            'healing',
                                            blockArray[i],
                                            1);
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            if(scene.frame % 150 === 0){
                // ライフが 0 の状態の敵キャラクター（小）が見つかったら配置する
                for(let i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i){
                    if(enemyArray[i].life <= 0 && enemyArray[i].update_method === 'update'){
                        let e = enemyArray[i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width,
                              CANVAS_HEIGHT - ground.height - e.height / 2,
                              1, 'Sugi');
                        break;
                    }
                }
            }
            if(scene.frame % 300 === 0){
                // ライフが 0 の状態の敵キャラクター（花）が見つかったら配置する
                for(let i = 0; i < ENEMY_FLOWER_MAX_COUNT; ++i){
                    if(enemyArray[ENEMY_SMALL_MAX_COUNT + i].life <= 0 && enemyArray[ENEMY_SMALL_MAX_COUNT + i].update_method === 'update'){
                        let e = enemyArray[ENEMY_SMALL_MAX_COUNT + i];
                        //右側面から出てくる
                        e.set(CANVAS_WIDTH + e.width, 200, 10, 'Flower');
                        break;
                    }
                }
            }
            if(scene.frame === 600){
                scene.use('invade_boss');
            }
            // めだまのライフが 0 になっていたらゲームオーバー
            if(medama.life <= 0){
                scene.use('gameover');
            }
        });
        // invade シーン（ボスキャラクターを生成）
        scene.add('invade_boss', (time) => {
            // シーンのフレーム数が 0 となる最初のフレームでボスを登場させる
            if(scene.frame === 0){
                // 画面中央上から登場するように位置を指定し、ライフは 250 に設定
                boss.set(CANVAS_WIDTH + boss.width, CANVAS_HEIGHT - ground.height / 2 - boss.height / 2, 180);
                // ボスキャラクター自身のモードは invade から始まるようにする
                boss.setMode('invade');
            }
            if(scene.frame % 600 === 0){
                for(let t = 0; t < ITEM_DEFAULT_MAX_COUNT; ++t){
                    if(itemArray[t].life <= 0){
                        itemArray[t].set(CANVAS_WIDTH + itemArray[t].width, CANVAS_HEIGHT - ground.height - itemArray[t].height / 2,
                        'default',
                        ground,
                        1);
                        itemArray[t].vector.set(-5, 0);
                        break;
                    }
                }
            }
            // 自機キャラクターが被弾してライフが 0 になっていたらゲームオーバー
            // ゲームオーバー画面が表示されているうちにボス自身は退避させる
            if(medama.life <= 0){
                scene.use('gameover');
                boss.setMode('escape');
            }
            // ボスが破壊されたらシーンを intro に設定する
            if(boss.life <= 0){
                scene.use('intro');
            }
        });
        // ゲームオーバーシーン
        // ここでは画面にゲームオーバーの文字が流れ続けるようにする
        scene.add('gameover', (time) => {
            // 流れる文字の幅は画面の幅の半分を最大の幅とする
            let textWidth = CANVAS_WIDTH / 2;
            // 文字の幅を全体の幅に足し、ループする幅を決める
            let loopWidth = CANVAS_WIDTH + textWidth;
            // フレーム数に対する除算の剰余を計算し、文字列の位置とする
            let x = CANVAS_WIDTH - (scene.frame * 2) % loopWidth;
            // 文字列の描画
            ctx.font = 'bold 72px sans-serif';
            util.drawText('GAME OVER', x, CANVAS_HEIGHT / 2, '#ff0000', textWidth);
            //順位の表示
            if(scene.frame === 0){
                data.push(gameScore);
            }
            
            function compareFunc(a, b) {
                return b - a;
            }
            data.sort(compareFunc);
            let rank = null;
            for(let i = 0; i < data.length; ++i){
                if(data[i] === gameScore){
                    rank = i;
                }
            }
            util.drawText(`あなたの順位：${rank + 1}位; 最高得点：${data[0]}点`, x, CANVAS_HEIGHT / 2 + 200, '#000000', textWidth);
            // 再スタートのための処理
            if(restart === true){
                // 再スタートフラグはここでまず最初に下げておく
                restart = false;
                // スコアをリセットしておく
                gameScore = 0;
                //ブロックのライフをゼロにする
                blockArray.map((v) => {
                    v.life = 0;
                });
                obstacleArray.map((v) => {
                    v.life = 0;
                });
                itemArray.map((v) => {
                    v.life = 0;
                });
                // 再度スタートするための座標等の設定
                medama.setComing(
                    medamaStartX,
                    medamaStartY,
                    medamaEndX,
                    medamaEndY
                );
                medama.frame = 0;
                medama.previous_frame = 0;
                medama.life = 3;
                medama.isDamaged = false;
                medama.isJumping = false;
                medama.isStanding = true;
                medama.gameovered = false;
                medama.vector.set(0, 0);
                medama.update_method = 'update';
                // シーンを intro に設定
                scene.use('intro');
            }
        });
        // 一番最初のシーンには intro を設定する
        scene.use('intro');
    }

    /**
     * 描画処理を行う
     */
    function render(){
        // グローバルなアルファを必ず 1.0 で描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 描画前に画面全体を不透明な明るいグレーで塗りつぶす
        util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');      
        //現在までの経過時間を取得する。
        let nowTime = (Date.now() - startTime) / 1000;

        //背景を描画する
        back.update();

        // スコアの表示
        ctx.font = 'bold 24px monospace';
        util.drawText(zeroPadding(gameScore, 5), 30, 50, '#ff0000');

        // シーンを更新する
        scene.update();

        if(medama.life > 0){
            //ブロックの状態を更新する
            blockArray.map((v) => {
                v.update();
            });

            //障害物の状態を更新する
            obstacleArray.map((v) => {
                v.update();
            });

            //アイテムの状態を更新する
            itemArray.map((v) => {
               v.update();
            });
        }else{
            //ブロックの状態を更新する
            blockArray.map((v) => {
                if(v.life > 0){v.draw();}
            });

            //障害物の状態を更新する
            obstacleArray.map((v) => {
                if(v.life > 0){v.draw();}
            });

            //アイテムの状態を更新する
            itemArray.map((v) => {
                if(v.life > 0){v.draw();}
            });
        }
        //ショットの状態を更新する
        shotArray.map((v) => {
            v.update();
        });

        //ボスのショットの状態を更新する
        bossShotArray.map((v) => {
            v.update();
        });

        //エッグショットの状態を更新する
        eggShotArray.map((v) => {
            v.update();
        });

        //ホーミングショットの状態を更新する
        homingArray.map((v) => {
            v.update();
        });

        //めだまの状態を更新する
        medama[`${medama.update_method}`]();

        //ボスの状態を更新する
        boss[`${boss.update_method}`]();

        //敵の状態を更新する
        enemyArray.map((v) => {
            v[`${v.update_method}`]();
        });
        //ハートの状態を更新する
        heart.update();      

        // 恒常ループのために描画処理を再帰呼出しする
        requestAnimationFrame(render);
    }

    /**
     * 度数法の角度からラジアンを生成する
     * @param {number} degrees - 度数法の度数
     */
    function degreesToRadians(degrees){
        return degrees * Math.PI / 180;
    }

    /**
     * 特定の範囲におけるランダムな整数の値を生成する
     * @param {number} range - 乱数を生成する範囲（0 以上 ～ range 未満）
     */
    function generateRandomInt(range){
        let random = Math.random();
        return Math.floor(random * range);
    }

    /**
     * 数値の不足した桁数をゼロで埋めた文字列を返す
     * @param {number} number - 数値
     * @param {number} count - 桁数（２桁以上）
     */
    function zeroPadding(number, count){
        // 配列を指定の桁数分の長さで初期化する
        let zeroArray = new Array(count);
        // 配列の要素を '0' を挟んで連結する（つまり「桁数 - 1」の 0 が連なる）
        let zeroString = zeroArray.join('0') + number;
        // 文字列の後ろから桁数分だけ文字を抜き取る
        return zeroString.slice(-count);
    }
})();
console.log("main.js loaded");

// let score_period_inner;

// let score_period
let alive = true;
let best_score = 0;
let score = 0;
let count = 0;
let song;

// intervals variables
let score_interval;
let pipe_period;
let gravity_interval;

// DOM variables
const flappy = document.querySelector(".flappy");
const cli = document.querySelector(".container");


//  here im fetching song from my current ongoing folder i get this idea from my previous project( music player )

// song fetching segment


async function song_source() {
    song = new Audio();
    let a = await fetch("http://127.0.0.1:3000/assets/music/flow-211881.mp3");// here im fetching music file 
    let response = await a.blob(); // here im turning that fetched file data in blob(binary large objects) , blob() converts file into binary large objects so we got music object in binary got from fetching
    let url = URL.createObjectURL(response);// here we are converting url from binary using URL.CreateObjectURL
    // console.log(url);
    song.src = url;
    song.play();
}

function musicstart() {

    song_source();

}


// score segment

function score_logic() {

    // we will get position by getboundingclirentreact fun
    let pipes = document.querySelectorAll(".pipe");
    let bird_post = flappy.getBoundingClientRect();
    pipes.forEach(pipe => {

        const pipe_post = pipe.getBoundingClientRect();
        // pipe.passed = false;
        if ((pipe_post.right < bird_post.left) && !pipe.passed) {
            score++;
            point_sound();
            pipe.passed = true;
            updateScore(score);
        }


        if (pipe_post.right < 0) {
            pipe.remove();
        }

        // console.log(score);


    })




    // console.log(bird_post);
    // console.log(pipe_post);
}


function updateScore(score) {

    let sc_div = document.querySelectorAll(".current_score")[0];
    sc_div.innerHTML = `CURRENT SCORE: ${score}`

}


function updateBestScore(best_score) {

    let bs = document.querySelector(".best_score");
    let bs_clas = document.querySelector(".bs-clas");
    bs.innerHTML = `BEST SCORE: ${best_score}`;
    bs_clas.innerHTML = `${best_score}`;

}


// death segment


function deathDisplay() {
    // console.log("omaiwa mo sindeyo");

    const cli = document.querySelectorAll(".container")[0];
    cli.style.opacity = 0.6;

    const death = document.createElement("div");
    death.className = "death_display h-[50%] w-[40%] flex justify-center items-center shadow-br";
    death.innerHTML = `        <div class="medal h-full w-[50%] flex justify-center items-center flex-col pixel-text text-[#EA7553]">
            <span class="text-3xl flex justify-center items-center w-full h-[20%]">MEDAL</span>
            <div class="medal_svg_div border bg-[#D9D08F] flex justify-center items-center"></div>
        </div>
        <div class="death_score_div h-full w-[50%] flex justify-center items-center flex-col">

            <span class="text-5xl super-pixel text-red-600">GAME OVER</span>
            <span class="pixel-text text-[#EA7553] text-3xl">SCORE</span>
            <span class="super-pixel text-white text-3xl">${score}</span>
            <span class="pixel-text text-[#EA7553] text-3xl">BEST SCORE</span>
            <span class="bs-clas super-pixel text-white text-3xl">${best_score}</span>
            <div class="shadow-br restart bg-blue-500 super-pixel flex justify-center items-center"><span>restart</span></div>
        </div>`

    document.querySelector("body").appendChild(death);


    let rest = document.querySelector(".restart");

    rest.addEventListener("click", function () {
        alive = true;
        cli.style.opacity = 1;
        document.querySelector(".death_display").remove();
        document.querySelectorAll(".pipe").forEach(function (pipe_style) {
            pipe_style.remove();
        });
        // score_interval;
        startGame();
        musicstart();
        gravity();
        count++;
        score = 0;
        updateScore(score);
    })


}


function death() {
    alive = false;
    song.pause();

    clearInterval(pipe_period);
    clearInterval(gravity_interval);
    clearInterval(score_interval);

    document.querySelectorAll(".pipe").forEach(function (pipe_style) {
        // pipe_style.remove();
        pipe_style.style.animationPlayState = "paused";
    });


    deathDisplay();
    if (score > best_score) {
        best_score = score;
        updateBestScore(best_score);
    }
    // updateScore(score);
    death_song();

}


// svg


function changeSvg() {

    flappy.style.backgroundImage = `url("assets/images/bird-2.png")`;

    setTimeout(() => {
        svgNormal();
    }, 750);

}

function svgNormal() {

    flappy.style.backgroundImage = `url("assets/images/bird.png")`;

}


// songs


async function point_sound() {

    let ps = new Audio();

    let b = await fetch("http://127.0.0.1:3000/assets/music/point.mp3");
    let response = await b.blob();
    let url = URL.createObjectURL(response);

    ps.src = url;
    ps.play();

}


async function death_song() {

    let ds = new Audio();

    let c = await fetch("http://127.0.0.1:3000/assets/music/death_song.mp3");
    let response = await c.blob();

    let url = URL.createObjectURL(response);

    ds.src = url;
    ds.play();

}


// gravity segment


function gravity() {
    console.log("gravity attivated");
    const bird = document.querySelector(".flappy");
    const cont = document.querySelector(".container");


    let post = 300;
    let velo = 0;
    let gravi = 0.5;
    let maxvelo = 10;
    let jump = -10;


    gravity_interval = setInterval(() => {

        if (!alive) {
            clearInterval(gravity_interval);
            return;
        }


        velo += gravi;
        if (velo > maxvelo) velo = maxvelo;

        post += velo;
        // console.log("aur kittna upr jayega bhadwe");
        bird.style.top = `${post}px`;


        if (post < 0) {
            post = 0;
            velo = 0;
        }

        if (post >= cont.clientHeight - bird.clientHeight) {
            post = cont.clientHeight - bird.clientHeight;


            // deathDisplay();
            // if (score > best_score) {
            //     best_score = score;
            //     updateBestScore(best_score);
            // }
            clearInterval(gravity_interval);
            if (alive) death()
            return;
        }



        // post += 0.6; 
    }, 30);

    cont.addEventListener("click", function () {
        if (alive) velo = jump
    })
}


// pipes generation and score_interval segment

function startGame() {

    const cont = document.querySelectorAll(".container")[0];

    clearInterval(pipe_period);


    pipe_period = setInterval(() => {

        if (alive) {
            let pipe = document.createElement('div');
            const gap = Math.random() * 150 + 175;
            pipe.className = `pipe h-full flex justify-center items-center flex-col`;
            pipe.style.gap = `${gap}px`;
            pipe.passed = false;
            pipe.collision = false;
            pipe.innerHTML = `        <div class="pipe1 bg-green-600 border-4 border-black border-t-0"></div>
                                  <div class="pipe2 bg-green-600 border-4 border-black border-b-0"></div>`


            cont.appendChild(pipe);
        }
        else {
            clearInterval(pipe_period);
        }

    }, 4000);


    score_interval = setInterval(() => {
        score_logic();
    }, 50);

    pipe_detection_interval = setInterval(() => {
        pipe_detection();
    }, 50);

}


// pipe detection segment

function pipe_detection() {

    let bird_post = flappy.getBoundingClientRect();
    let pipes1 = document.querySelectorAll(".pipe1");
    let pipes2 = document.querySelectorAll(".pipe2");

    pipes1.forEach(pipe => {

        const pipe_post = pipe.getBoundingClientRect();
        // console.log(pipe_post);

        if (!pipe.collision && ((bird_post.right > pipe_post.left && bird_post.left < pipe_post.right) && ((bird_post.bottom > pipe_post.top) && (bird_post.top < pipe_post.bottom)))) {
            death();
            pipe.collision = true;
        }

    })

    pipes2.forEach(pipe => {

        const pipe_post = pipe.getBoundingClientRect();
        // console.log(pipe_post);

        if (!pipe.collision && ((bird_post.right > pipe_post.left && bird_post.left < pipe_post.right) && ((bird_post.bottom > pipe_post.top) && (bird_post.top < pipe_post.bottom)))) {
            death();
            pipe.collision = true;
        }

    })

}


function main() {

    const cli = document.querySelectorAll(".container")[0];


    cli.addEventListener("click", function () {

        changeSvg();

        if (count == 0) {
            console.log("game start");
            startGame();
            musicstart();
            gravity();
            count++;
        }
        else {
            console.log("already game is running");
        }

    })


}

main();

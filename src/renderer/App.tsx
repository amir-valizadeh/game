/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import { useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useAudio from './utilies/audio';
import icon from '../../assets/icon.svg';
import wallBackground from '../../assets/wall3.png';
import wallQ from '../../assets/assets/wallQ.png';
import tank from '../../assets/tank2.png';
import bullet from '../../assets/bullet3.png';
import arteshLogo from '../../assets/assets/logo_artesh_free.png';
import backgroundSound from '../../assets/sounds/background.mp3';
import bulletSound from '../../assets/sounds/bullet.mp3';
import gameOver from '../../assets/sounds/gameover.mp3';
import './App.css';

const Hello = () => {
  const bSound = useMemo(() => new Audio(backgroundSound), []);
  const buSound = useMemo(() => new Audio(bulletSound), []);
  const gSound = useMemo(() => new Audio(gameOver), []);

  useEffect(() => {
    const sounds: any = {};
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    let animation: number;
    const ctx = canvas.getContext('2d');
    let wall = 40;
    const step = 240;
    const dx = 4;
    const dy = -5;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let bulletX = 15;
    let bulletY = 150;
    let hit = 0;
    let wallIncrease = 0.4;
    const brickColumnCount = 3;
    const brickRowCount = 3;
    const pressedKeys = new Set();
    window.onkeydown = (e) => {
      pressedKeys.add(e.code);
      console.log(e.code);
    };
    window.onkeyup = (e) => {
      pressedKeys.delete(e.code);
      console.log(e.code);
    };
    function playSound(key: string, options = {}) {
      if (sounds[key] === undefined) return false;
      sounds.explosion.currentTime = 0;

      sounds[key].play();
      return true;
    }
    // function gameOver() {
    //   playSound('gameover');
    // }
    let paddleX = canvas.width / 2 - 25;
    let rightPressed = false;
    let leftPressed = false;
    let answeredQuestion = 0;
    const textStyleOptions = {
      fontSize: 20,
      fontFamily: 'Arial',
      textColor: 'rgba(255, 255, 255,)',
      textAlign: 'center',
    };
    // generate a type for text

    const text: { [key: string]: any } = {
      0: [
        '۲۰ گلوله',
        '۳۰ گلوله',
        '۴۰ گلوله',
        'هر خشاب اسلحه ژ۳ دارای چند گلوله هست؟',
        255,
      ],
      1: [
        'رعایت سلسله مراتب',
        'مرتب کردن وسایل شخصی',
        'التزام عملی به ولایت فقیه',
        'کدام یک از موارد زیر شامل انظباط نیست؟',
        15,
      ],
      2: ['۷.۲۶', '۶.۲۷', '۷.۶۲', ' کالیبر اسلحه ژ۳ چقدر است؟', -225],
    };

    function keyDownHandler(e: any) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    }

    function keyUpHandler(e: any) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;

        if (paddleX < 600) {
          paddleX += step;

          if (bulletY > 140) {
            bulletX -= step;
          }
        }
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
        if (paddleX > step) {
          paddleX -= step;

          if (bulletY > 140) {
            bulletX += step;
          }
        }
      }
    }
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    //  write a event listener for keypress space and fire a bullet

    function drawTank() {
      // clear image before draw using paddleX

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      // add tank1.png image and make it move to left and right with keypress
      const img = new Image();
      img.src = tank;
      ctx?.drawImage(img, paddleX, canvas.height - 100, 50, 100);
    }

    function moveBullet() {
      if (pressedKeys.has('Space') && bulletY === 150) buSound.play();
      const img = new Image();
      img.src = bullet;
      console.log({
        bulletX,
        canvas: canvas.width,
        new: canvas.width - bulletX,
      });
      if (
        canvas.height - wall - bulletY < 40 &&
        bulletX === text[answeredQuestion][4]
      ) {
        hit += 1;
        bulletY = 150;
        return;
      }
      if (!pressedKeys.has('Space') && bulletY === 150) return;
      ctx?.drawImage(
        img,
        canvas.width / 2 - bulletX,
        canvas.height - bulletY,
        25,
        50
      );
      bulletY += 10;
      if (bulletY >= 640) {
        bulletY = 150;
      }
      if (y >= canvas.height) {
        bulletY = 150;
      }
    }
    // create a palletes of walls that will be destroyed by bullet
    function drawBricks() {
      // repeat wall3.webp image 3 times in a row
      const qImage = new Image();
      qImage.src = wallBackground;
      ctx?.drawImage(qImage, 0, 0, canvas.width, 120);
      if (hit >= 3) {
        wall = 40;
        hit = 0;
        answeredQuestion += 1;
        wallIncrease += 0.5;

        return;
      }
      let c: number;
      let r: number;
      for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
          const img = new Image();
          img.src = wallQ;
          if (ctx) {
            ctx.font = `${textStyleOptions.fontSize}px ${textStyleOptions.fontFamily}`;
            ctx.fillStyle = textStyleOptions.textColor;
            ctx.textAlign = textStyleOptions.textAlign as CanvasTextAlign;
          }

          ctx?.drawImage(img, c * 260 + 30, wall, 240, 80);

          ctx?.fillText(text[answeredQuestion][c], c * 260 + 140, wall + 40);
        }
      }

      ctx?.fillText(text[answeredQuestion][3], 440, 30);
      // if wall is more than canvas height then alert game over
      if (wall >= 600) {
        bSound.pause();

        gSound.play();

        setTimeout(() => {
          alert('game over');
        }, 0.4);
        // clearInterval(iterval);
        window.cancelAnimationFrame(animation);
        wall = 10;
      }
    }

    if (canvas.height - wall - bulletY < 20) {
      console.log('hit');
    }
    // move bullet up using setInterval
    // var iterval = setInterval(draw, 30);
    function draw() {
      // playSound('background', {
      //   loop: true,
      //   volume: 0.5,
      // });
      bSound.play();
      bSound.loop = true;
      bSound.volume = 0.5;

      drawTank();
      drawBricks();
      moveBullet();
      x += dx;
      y += dy;
      wall += wallIncrease;
      animation = window.requestAnimationFrame(draw);
      console.log(canvas.height - wall, bulletY);
    }
    animation = window.requestAnimationFrame(draw);

    // function loadAudio(path: any) {
    //   return new Promise((resolve, reject) => {
    //     const audio = new Audio(path);
    //     audio.oncanplaythrough = () => resolve(audio);
    //     audio.onerror = reject;
    //   });
    // }
    // function loadSounds() {
    //   const files = {
    //     background: '../../assets/sounds/background.mp3',
    //     gameover: '../../assets/sounds/gameover.mp3',
    //     bullet: '../../assets/sounds/bullet.mp3',
    //   };
    //   const promises = Object.entries(files).map(async ([key, value]) => {
    //     sounds[key] = await loadAudio(value);
    //   });
    //   return Promise.all(promises);
    // }

    // function pauseSound(key: string) {
    //   if (sounds[key] === undefined) return false;
    //   sounds[key].pause();
    //   return true;
    // }

    // eslint-disable-next-line promise/catch-or-return
    // loadSounds().then(() => console.log('all sounds loaded'));
  }, [bSound, buSound, gSound]);

  return (
    <div>
      {/* <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div> */}
      <div className="body">
        <canvas id="myCanvas" width="820px" height=" 620px" />
        <div className="artesh_image">
          <img src={arteshLogo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}

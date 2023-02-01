/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

import { useEffect, useMemo, useState, useRef } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import wallBackground from '../../assets/wall3.png';
import wallQ from '../../assets/assets/wallQ.png';
import tank from '../../assets/tank2.png';
import bullet from '../../assets/bullet3.png';
import arteshLogo from '../../assets/assets/logo_artesh_free.png';
import backgroundSound from '../../assets/sounds/background.mp3';
import bulletSound from '../../assets/sounds/bullet.mp3';
import gameOver from '../../assets/sounds/gameover.mp3';
import './App.css';
import questions from './questions';
import Modal from './modal';
import images from './images/images';
import muteImage from '../../assets/mute.png';
import unmuteImage from '../../assets/unmute.png';
import cry from '../../assets/cry.png';
import Menu from './menu/menu';

const Hello = () => {
  const navigate = useNavigate();
  const bSound = useMemo(() => new Audio(backgroundSound), []);
  const buSound = useMemo(() => new Audio(bulletSound), []);
  const gSound = useMemo(() => new Audio(gameOver), []);
  const [darage, setDarage] = useState<string>('1');
  const [animationPaused, setAnimationPaused] = useState(false);
  const [qLevel, setQLevel] = useState(false);
  const [mute, setMute] = useState(false);
  const [menubar, setMenubar] = useState(false);
  const [end, setEnd] = useState(false);
  const wall = useRef(40);
  const hit = useRef(0);
  const wallIncrease = useRef(0.4);
  const answeredQuestion = useRef(1);
  const animation = useRef(0);
  // parse json file
  let stopAnime = false;
  const step = 240;
  function playGame() {
    stopAnime = false;
    setAnimationPaused(false);
  }
  function stopGame() {
    stopAnime = true;
    setAnimationPaused(true);
  }
  function onMutef() {
    setMute(!mute);
  }
  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    let bulletX = 15;
    let bulletY = 150;
    const pressedKeys = new Set();
    window.onkeydown = (e) => {
      pressedKeys.add(e.code);
      console.log(e.code);
    };
    window.onkeyup = (e) => {
      pressedKeys.delete(e.code);
      console.log(e.code);
    };
    // if (!animationPaused) {
    //   window.cancelAnimationFrame(animation);
    // }
    let paddleX = canvas.width / 2 - 25;

    const textStyleOptions = {
      fontSize: 22,
      fontFamily: 'vazirmatn',
      textColor: 'rgb(51,51,0)',
      textAlign: 'center',
    };
    // generate a type for text
    // checked
    function keyUpHandler(e: any) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (paddleX < 600) {
          paddleX += step;

          if (bulletY > 140) {
            bulletX -= step;
          }
        }
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        if (paddleX > step) {
          paddleX -= step;

          if (bulletY > 140) {
            bulletX += step;
          }
        }
      }
    }
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
      // console.log({
      //   bulletX,
      //   canvas: canvas.width,
      //   new: canvas.width - bulletX,
      // });
      if (
        canvas.height - wall.current - bulletY < 40 &&
        bulletX === questions[answeredQuestion.current][4]
      ) {
        hit.current++;
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
      // if (bulletY >= 740) {
      //   bulletY = 150;
      // }
      if (bulletY >= canvas.height - 70) {
        bulletY = 150;
      }
    }
    // create a palletes of walls that will be destroyed by bullet
    function drawBricks() {
      // repeat wall3.webp image 3 times in a row
      const qImage = new Image();
      qImage.src = wallBackground;
      ctx?.drawImage(qImage, 0, 0, canvas.width, 120);
      if (hit.current >= 2) {
        wall.current = 40;
        hit.current = 0;
        if (answeredQuestion.current === 60) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          stopAnime = true;
          setAnimationPaused(false);
          window.cancelAnimationFrame(animation.current);
          alert('بازی تمام شد');
          return;
        }
        if (answeredQuestion.current % 3 === 0) {
          setDarage((answeredQuestion.current / 3).toFixed());
          setQLevel(true);
          stopAnime = !stopAnime;
          setAnimationPaused(!animationPaused);
        }
        answeredQuestion.current++;
        if (wallIncrease.current < 1.5) wallIncrease.current += 0.1;

        return;
      }

      for (let j = 1; j < 4; j++) {
        const img = new Image();
        img.src = wallQ;
        if (ctx) {
          ctx.font = `${textStyleOptions.fontSize}px ${textStyleOptions.fontFamily}`;
          ctx.fillStyle = textStyleOptions.textColor;
          ctx.textAlign = textStyleOptions.textAlign as CanvasTextAlign;
        }
        const tempJ = j - 1;
        ctx?.drawImage(img, tempJ * 260 + 30, wall.current, 240, 80);
        ctx?.fillText(
          questions[answeredQuestion.current][j],
          tempJ * 260 + 140,
          wall.current + 40
        );
      }

      ctx?.fillText(questions[answeredQuestion.current][0], 440, 30);
      console.log(wall.current, canvas.height - 150);
      if (wall.current >= canvas.height - 150) {
        setMute(true);
        stopGame();
        gSound.play();
        setEnd(true);

        // clearInterval(iterval);
        window.cancelAnimationFrame(animation.current);
        wall.current = 40;
      }
    }

    function draw() {
      drawTank();
      drawBricks();
      moveBullet();
      wall.current += wallIncrease.current;
      if (!stopAnime) {
        // console.log('stopAnime', stopAnime);
        window.requestAnimationFrame(draw);
      }
      // console.log(canvas.height - wall.current, bulletY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!animationPaused) {
      // console.log('animationPaused', animationPaused);
      animation.current = window.requestAnimationFrame(draw);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bSound, buSound, gSound, animationPaused]);
  useEffect(() => {
    if (mute) {
      bSound.pause();

      // backgroundSound.pause();
    } else {
      bSound.play();
      bSound.loop = true;
      bSound.volume = 0.5;
      // backgroundSound.pause();
    }
    // console.table({ animationPaused, mute });
  }, [animationPaused, bSound, mute]);

  useEffect(() => {
    if (!qLevel) {
      playGame();
    } else {
      stopGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qLevel]);
  return (
    <div>
      <div className="body">
        <canvas id="myCanvas" width="820px" height="768px" />
        <div className="artesh_image">
          <img src={arteshLogo} alt="" />
        </div>

        <div
          style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10000 }}
          className="onHover"
        >
          <img
            src={!mute ? muteImage : unmuteImage}
            alt=""
            width={50}
            onClick={onMutef}
            className={end ? `hidden` : ``}
          />
        </div>
        <div className={qLevel || end ? `hidden` : ``}>
          <button
            style={{ left: 0, zIndex: 10000 }}
            className={!menubar ? `none button-68 menu_gradiant` : `hidden`}
            type="button"
            onClick={() => {
              stopGame();
              setMenubar(true);
            }}
          >
            Menu
          </button>
        </div>
        <div className={qLevel ? `modal_background` : `none`}>
          <Modal
            name={qLevel ? `` : `off`}
            qlevel={setQLevel}
            src={images[darage]}
          />
        </div>
        <div className={menubar ? `modal_background menu` : `hidden`}>
          <button
            className="button-68 red"
            type="submit"
            onClick={() => window.close()}
          >
            خروج از بازی
          </button>
          <button
            className="button-68 green"
            type="submit"
            onClick={() => {
              navigate('/', { state: { first: true } });
            }}
          >
            آموزش نحوه ی بازی
          </button>
          <button
            className="button-68 green"
            type="submit"
            onClick={() => {
              playGame();
              setMenubar(false);
            }}
          >
            ادامه بازی
          </button>
        </div>
        <div className={end ? `modal_background menu gap_10` : `hidden`}>
          <p className="text"> متاسفانه شما قادر به پاسخگویی نبودید و باختید</p>
          <img src={cry} alt="" />
          <br />
          <button
            className="button-68 green"
            type="submit"
            // eslint-disable-next-line no-restricted-globals
            onClick={() => location.reload()}
          >
            بازی مجدد
          </button>
          <button
            className="button-68 red"
            type="submit"
            onClick={() => window.close()}
          >
            {' '}
            خروج از بازی
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/engine" element={<Hello />} />
        <Route path="/" element={<Menu />} />
      </Routes>
    </Router>
  );
}

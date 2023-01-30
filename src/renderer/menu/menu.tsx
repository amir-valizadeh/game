import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import key from '../../../assets/key.png';
import space from '../../../assets/space.png';
import './menu.css';

export default function Menu() {
  const [first, setFirst] = React.useState(true);
  const navigate = useNavigate();
  const lo = useLocation();
  useEffect(() => {
    console.log(lo);
    if (lo?.state?.first) {
      setFirst(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="background">
      <div className="menu-org">
        {first ? (
          <>
            <p> با سلام</p>
            به بازی آموزشی کتاب رزمی ارتش خوش آمدید این برنامه تلاش میکند با
            ارائه ی سوال هایی میزان اشنایی شمارا به همراه با کمی سرگرمی محک بزند{' '}
            <button
              className="button-68 green"
              type="submit"
              onClick={() => setFirst(false)}
            >
              ادامه توضیحات
            </button>
          </>
        ) : (
          <>
            در این بازی تانک به وسیله کلید های چپ و راست
            <img src={key} width={83} height={40} alt="" />
            حرکت میکند و با دکمه ی اسپیس
            <img src={space} width={164} height={44} alt="" />
            گلوله شلیک میکند و شما باید به هر جواب دو گلوله شلیک کنید تا بتوانید
            مرحله را بگذرانید
            <button
              className="button-68 blue"
              type="submit"
              onClick={() => navigate('/engine')}
            >
              شروع بازی{' '}
            </button>
            {/* <button
              className="button-68 blue"
              type="submit"
              onClick={() => setFirst(false)}
            >
              برگشت بازی{' '}
            </button> */}
          </>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function Modal(props: any) {
  const { name, src, qlevel } = props;

  return (
    <div className={`modal ${name}`} id="modal">
      <h2 style={{ textAlign: 'center' }}>افزایش درجه</h2>
      <div className="content">
        <p>تبریک به شما, درجه ی شما افزایش یافته و الان شما به عنوان </p>
        <strong>{src[1]}</strong>
        <img src={src[0]} width={55} alt="images" />
        <p>هستین لطفا برای ادامه ی بازی کلیک کنین</p>
      </div>
      <div className="actions">
        <button
          type="submit"
          className="toggle-button"
          onClick={() => qlevel(false)}
        >
          ادامه بازی
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("API'den veri alınamadı", err));
  }, []);

  const handleColorClick = (index, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [index]: color,
    }));
  };

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (

<div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
  <h1 className="page-title">Product List</h1>

  <div className="scroll-wrapper">
  {products.map((product, index) => {
    const selectedColor = selectedColors[index] || "yellow";
    return (
      <div key={index} className="product-card">
        <img
          src={product.images[selectedColor]}
          alt={product.name}
          className="product-image"
        />
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <div className="product-rating">
          <span className="stars">
          {Array.from({length:5}, (_,i) => {
            const full = i+1 <= product.rating;
            const half = i+0.5 === product.rating;
            return (
              <span key={i}>
                {full ? "★" : half ? "⯪" : "☆"}
              </span>
            );
          })} </span>
          <span className="rating-number"> {product.rating.toFixed(1)}/5</span>
        </div>
        <p className="product-color">
          {selectedColor === "yellow"
            ? "Yellow Gold"
            : selectedColor === "rose"
            ? "Rose Gold"
            : "White Gold"}
        </p>
        <div className="color-picker">
          {["yellow", "rose", "white"].map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(index, color)}
              className={`color-dot ${
                selectedColor === color ? "active" : ""
              } ${color}`}
            ></button>
          ))}
        </div>
      </div>
    );
  })}
</div>
</div>
  );
}

export default App;
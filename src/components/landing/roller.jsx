import React, { useEffect, useState } from "react";
import landing_background from "../../assets/landing_background.png";
import styled from "styled-components";

const CoolBackground = styled.div`
  background-image: url(${landing_background});
  background-size: cover;
  background-attachment: fixed; /* Make background static */
  background-position: center;
  background-blend-mode: hard-light;
  background-color: rgba(1, 1, 1, 0.8);
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;

  & > div {
    max-width: 80%;
    margin: 0 auto;
  }
`;

const RollerBackground = () => {
  const [positions, setPositions] = useState(Array(8).fill({ top: 0, left: 0 }));

  const textElements = [
    "Manage your business",
    "with one click",
    "in the cloud",
    "with ease and peace of mind",
    "you are secure in our hand",
    "you can manage your business from anywhere",
  ];

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const newPositions = positions.map((_, index) => ({
      top: 0,
      left: scrollY / (index + 1), 
    }));
    setPositions(newPositions);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <CoolBackground>
      <div>
        {textElements.map((text, index) => (
          <p
            key={index}
            style={{
              position: 'relative',
              top: 0,
              left: 0,
              transition: 'top 0.5s ease, left 0.5s ease',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </CoolBackground>
  );
};

export default RollerBackground;
import React from "react";
import "../../styles/Wie.css";
import LogoAnimation from "../Home/LogoAnimation";

const Hero = ({ children }) => {
  return (
    <section className="wie-hero">
      <LogoAnimation />
    </section>
  );
};

export default Hero;

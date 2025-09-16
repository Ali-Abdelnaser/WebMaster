import React from "react";
import "../../styles/CS.css";
import LogoAnimation from "../Home/LogoAnimation"

const Hero = ({ children }) => {
  return <section className="hero">
    <LogoAnimation />
  </section>;
};

export default Hero;

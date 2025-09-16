import { useEffect, useRef } from "react";
import "./Partners.css";
import Marquee from "react-fast-marquee";
const partners = [
  {
    img: "/img/Partners/BSA.svg",
    link: "https://www.facebook.com/Biomedicalscientific/",
  },
  {
    img: "/img/Partners/Cat.svg",
    link: "https://catreloaded.org/?fbclid=IwY2xjawMvEf5leHRuA2FlbQIxMABicmlkETFZTTV2M1JTb0VlVnNRS3lzAR6YuUUFtzFR-UVbn4ktHzvU0vhmIPSgHdWufcCQZge_v_exA33TR_Y0VIr8fg_aem_L3uukndspZdSqOUUzie5hA",
  },
  {
    img: "/img/Partners/Connectors.svg",
    link: "https://www.facebook.com/ConnectAIoT",
  },
  {
    img: "/img/Partners/Creativa.svg",
    link: "https://www.facebook.com/CreativaManoura",
  },
  {
    img: "/img/Partners/Digital Knights.svg",
    link: "https://digitalknightacadmey.com/",
  },
  { img: "/img/Partners/Dolce.svg", link: "https://meta.com" },
  {
    img: "/img/Partners/Hult Prize.svg",
    link: "https://meta.comhttps://www.facebook.com/profile.php?id=100071160218595",
  },
  {
    img: "/img/Partners/IEEE Egypt Section.svg",
    link: "https://ieee.org.eg/?fbclid=IwY2xjawMvE15leHRuA2FlbQIxMABicmlkETFZTTV2M1JTb0VlVnNRS3lzAR7O4TF5JJeg0beZJJkZIcyvciqB3ptL6PnIdSktKFmnREUccJ2Klf_5L5iQTg_aem_7KoNvghdCrMPygpgnY4QBA",
  },

  {
    img: "/img/Partners/Altera.svg",
    link: "https://www.facebook.com/Alteratech.eg",
  },
  {
    img: "/img/Partners/IEEE Menoufia.svg",
    link: "https://meta.com",
  },
  {
    img: "/img/Partners/IEEE MUSB.svg",
    link: "https://www.facebook.com/ieee.musb",
  },
  {
    img: "/img/Partners/IEEE SAC Egypt.svg",
    link: "https://ieee.org.eg/sac/",
  },
  {
    img: "/img/Partners/IQRAA.svg",
    link: "https://www.facebook.com/German.course.Mansoura",
  },
  {
    img: "/img/Partners/ITI Mansoura.svg",
    link: "https://www.facebook.com/ITIMansoura",
  },
  { img: "/img/Partners/Lamsa.svg", link: "https://www.facebook.com/lamsaapp" },
  {
    img: "/img/Partners/Mansoura Robotics.svg",
    link: "https://www.facebook.com/MansouraRoboticsClub",
  },
  { img: "/img/Partners/MEGA.svg", link: "https://meta.com" },
  {
    img: "/img/Partners/Microsfot Student Clubs - Mansoura.svg",
    link: "https://www.facebook.com/aoumsc",
  },
  {
    img: "/img/Partners/MIE.svg",
    link: "https://www.facebook.com/madeinegytcompetition",
  },
  { img: "/img/Partners/Rally.svg", link: "https://www.facebook.com/RallySCU" },
  {
    img: "/img/Partners/Riseup.svg",
    link: "https://www.facebook.com/riseupsummit",
  },
  {
    img: "/img/Partners/Techne.svg",
    link: "https://www.facebook.com/techne.me",
  },
  {
    img: "/img/Partners/Triago.svg",
    link: "https://www.facebook.com/triago.cws",
  },
  { img: "/img/Partners/Wasla Tech.svg", link: "https://wasllatech.com/" },
];

export default function Partners() {
  return (
    <section className="partners-section">
      <h2 className="section-title">Our Partners</h2>

      {/* Desktop: صف واحد */}
      <div className="desktop-only">
        <Marquee pauseOnHover={true} gradient={false} speed={50}>
          {partners.map((p, i) => (
            <a href={p.link} key={i} target="_blank" rel="noopener noreferrer">
              <img src={p.img} alt={`Partner ${i}`} className="partner-logo" />
            </a>
          ))}
        </Marquee>
      </div>

      {/* Mobile: صفين، التاني عكس الأول */}
      <div className="mobile-only">
        <Marquee pauseOnHover={true} gradient={false} speed={40}>
          {partners.map((p, i) => (
            <a
              href={p.link}
              key={`row1-${i}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={p.img} alt={`Partner ${i}`} className="partner-logo" />
            </a>
          ))}
        </Marquee>
        <Marquee
          pauseOnHover={true}
          gradient={false}
          direction="right"
          speed={40}
        >
          {partners.map((p, i) => (
            <a
              href={p.link}
              key={`row2-${i}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={p.img} alt={`Partner ${i}`} className="partner-logo" />
            </a>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

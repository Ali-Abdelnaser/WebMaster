
import React, { useState } from "react";
import "./WieFAQ.css";
import faqs from "../../data/wieQA.json"; // فايل JSON اللي فيه الأسئلة
import underline from "/img/WIE/Wie-hr.svg";
export default function WieFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="wie-faq">
          
      <div className="wie-about-header">
        <h2> IEEE WIE – FAQs </h2>
        <img src="/img/WIE/Wie-hr.svg" alt="faq-underline" className="faq-underline" />
      </div>
      <div className="wie-faq-container">
        {/* Image with animation */}
        <div className="wie-faq-image">
          <img src="/img/WIE/faq.svg" alt="FAQ Illustration" />
        </div>

        {/* FAQs Window */}
        <div className="wie-faq-content">
          <div className="wie-faq-window">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`wie-faq-item ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="wie-faq-question">
                  <span> Q{index + 1} </span> {faq.question}
                </div>
                <div
                  className="wie-faq-answer"
                  style={{
                    maxHeight: activeIndex === index ? "400px" : "0px",
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

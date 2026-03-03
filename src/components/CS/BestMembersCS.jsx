import React, { useEffect, useState } from "react";
import "./BestMembersCS.css";
import { supabase } from "../../config/supabase";

export default function BestMembersCS() {
  const [bestMembers, setBestMembers] = useState([]);

  useEffect(() => {
    const fetchBestMembers = async () => {
      const { data, error } = await supabase
        .from("cs_best_members")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setBestMembers(data);
    };
    fetchBestMembers();
  }, []);

  if (bestMembers.length === 0) return null;

  return (
    <section className="cs-best-members">
      <div className="wie-carousel-header">
        <h2 className="cs-title">CS BEST MEMBERS</h2>
        <img
          src="img/CS/CS-hr.svg"
          alt="Divider"
          className="wie-carousel-divider"
        />
      </div>
      <div className="cs-best-grid">
        {bestMembers.map((member, index) => (
          <div className="cs-best-card" key={index}>
            <div className="cs-best-img-wrapper">
               <div className="best-crown-badge"><i className="fas fa-crown"></i></div>
               <img src={member.image || "/img/CS/default.svg"} alt={member.name} />
            </div>
            <div className="cs-best-info">
                <span className="cs-best-track">{member.role}</span>
                <h3 className="cs-best-name">{member.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

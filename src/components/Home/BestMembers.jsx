import React, { useEffect, useState } from "react";
import "./BestMembers.css";
import { supabase } from "../../config/supabase";

const BestMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('best_members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  if (loading) return null; // أو ممكن تحط Spinner لطيف

  return (
    <section className="best-members-section section-with-bg">
      <div className="section-header">
        <h2 className="Home-title">BEST MEMBERS</h2>
        <img src="img/hr.svg" alt="Divider" className="HR-divider" />
      </div>
      <div className="members-grid">
        {members.map((member, index) => (
          <div className="best-card" key={index}>
            <div className="image-wrapper">
              <img src={member.image} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.team}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestMembers;

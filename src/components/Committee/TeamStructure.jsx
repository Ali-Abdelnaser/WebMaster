import "./TeamStructure.css";

export default function TeamStructure({ name, head, vice, advisors, members }) {
  return (
    <section className="team-structure">
      <h2 className="Home-title">Meet Our Team</h2>
      <img src="../img/hr.svg" alt="Divider" className="team-divider" />

      {/* Head */}
      <div className="team-head">
        <div className="special-card">
          <img src={head.image} alt={head.name} />
          <h3>{head.name}</h3>
          <p>{name} Head</p>
          <p>
            {head.college} — {head.level}
          </p>
        </div>
      </div>

      {/* Vice + Advisors */}
      <div className="team-row">
        {vice.map((v, i) => (
          <div className="special-card" key={`vice-${i}`}>
            <img src={v.image} alt={v.name} />
            <h3>{v.name}</h3>
            <p>{name} Vice</p>
            <p>
              {v.college} — {v.level}
            </p>
          </div>
        ))}
        {advisors.map((advisor, i) => (
          <div className="special-card" key={i}>
            <img src={advisor.image} alt={advisor.name} />
            <h3>{advisor.name}</h3>
            <p>{name} Advisor</p>
            <p>
              {advisor.college} — {advisor.level}
            </p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="team-grid">
        {members.map((member, i) => (
          <div className="member-card" key={i}>
            <img src={member.image} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{name} Member </p>
            <p>
              {member.college} — {member.level}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

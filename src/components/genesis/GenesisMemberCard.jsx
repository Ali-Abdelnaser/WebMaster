export default function GenesisMemberCard({
  member = {},
  index = 0,
  teamSize = 1,
  errors = {},
  isExpanded = true,
  onToggle,
  onNext,
  onChange,
}) {
  const isLeader = index === 0;
  const cardTitle = isLeader ? "Team Leader" : `Member #${index + 1}`;

  const academicYearOptions = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
  ];

  const handleTextChange = (field, value) => {
    onChange(index, field, value);
  };

  const handleDigitsOnly = (field, value, maxLen) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, maxLen);
    onChange(index, field, digitsOnly);
  };

  // Check if member is essentially completed
  const isComplete =
    member.full_name &&
    member.national_id &&
    member.national_id.length === 14 &&
    member.email &&
    member.phone &&
    member.phone.length === 11 &&
    member.university &&
    member.faculty &&
    member.academic_year &&
    member.discord_link;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div
      className={`genesis-member-card ${isLeader ? "leader-card" : ""} ${
        isExpanded ? "expanded" : "collapsed"
      } ${hasErrors ? "has-card-error" : ""}`}
    >
      {/* Collapsible Card Header */}
      <div
        className="member-card-header clickable"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="member-order-pill">
          <span className="order-number">{index + 1}</span>
          <span className="order-title">{cardTitle}</span>
          {!isExpanded && member.full_name && (
            <span className="collapsed-name-preview" title={member.full_name}>
              — {member.full_name}
            </span>
          )}
        </div>

        <div className="member-header-actions">
          {/* Status Indicator */}
          {hasErrors ? (
            <span className="member-status-tag error" title="Incomplete member data">
              <i className="fas fa-circle-exclamation"></i>
              <span className="status-tag-text">Incomplete</span>
            </span>
          ) : isComplete ? (
            <span className="member-status-tag complete" title="Member data ready">
              <i className="fas fa-circle-check"></i>
              <span className="status-tag-text">Ready</span>
            </span>
          ) : null}

          <div className="collapse-chevron-btn">
            <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      {isExpanded && (
        <div className="member-card-body">
          <div className="member-form-grid">
            {/* Row 1: Full Name & National ID */}
            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_name`} className="genesis-label">
                Full Name <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_name`}
                type="text"
                className={`genesis-input ${errors.full_name ? "has-error" : ""}`}
                placeholder="Legal full name"
                value={member.full_name || ""}
                onChange={(e) => handleTextChange("full_name", e.target.value)}
              />
              {errors.full_name && <span className="genesis-error">{errors.full_name}</span>}
            </div>

            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_national_id`} className="genesis-label">
                National ID <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_national_id`}
                type="text"
                inputMode="numeric"
                className={`genesis-input ${errors.national_id ? "has-error" : ""}`}
                placeholder="14-digit National ID"
                value={member.national_id || ""}
                onChange={(e) => handleDigitsOnly("national_id", e.target.value, 14)}
              />
              {errors.national_id && (
                <span className="genesis-error">{errors.national_id}</span>
              )}
            </div>

            {/* Row 2: Email & Phone */}
            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_email`} className="genesis-label">
                Email Address <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_email`}
                type="email"
                className={`genesis-input ${errors.email ? "has-error" : ""}`}
                placeholder="name@example.com"
                value={member.email || ""}
                onChange={(e) => handleTextChange("email", e.target.value)}
              />
              {errors.email && <span className="genesis-error">{errors.email}</span>}
            </div>

            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_phone`} className="genesis-label">
                Phone Number <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_phone`}
                type="tel"
                inputMode="numeric"
                className={`genesis-input ${errors.phone ? "has-error" : ""}`}
                placeholder="01012345678"
                value={member.phone || ""}
                onChange={(e) => handleDigitsOnly("phone", e.target.value, 11)}
              />
              {errors.phone && <span className="genesis-error">{errors.phone}</span>}
            </div>

            {/* Row 3: University & Faculty */}
            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_university`} className="genesis-label">
                University <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_university`}
                type="text"
                className={`genesis-input ${errors.university ? "has-error" : ""}`}
                placeholder="e.g. Mansoura University"
                value={member.university || ""}
                onChange={(e) => handleTextChange("university", e.target.value)}
              />
              {errors.university && (
                <span className="genesis-error">{errors.university}</span>
              )}
            </div>

            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_faculty`} className="genesis-label">
                Faculty / College <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_faculty`}
                type="text"
                className={`genesis-input ${errors.faculty ? "has-error" : ""}`}
                placeholder="e.g. Faculty of Engineering"
                value={member.faculty || ""}
                onChange={(e) => handleTextChange("faculty", e.target.value)}
              />
              {errors.faculty && <span className="genesis-error">{errors.faculty}</span>}
            </div>

            {/* Row 4: Academic Year & Discord */}
            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_academic_year`} className="genesis-label">
                Academic Year <span className="req">*</span>
              </label>
              <select
                id={`member_${index}_academic_year`}
                className={`genesis-select ${errors.academic_year ? "has-error" : ""}`}
                value={member.academic_year || ""}
                onChange={(e) => handleTextChange("academic_year", e.target.value)}
              >
                <option value="">Select Academic Year</option>
                {academicYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.academic_year && (
                <span className="genesis-error">{errors.academic_year}</span>
              )}
            </div>

            <div className="genesis-form-field">
              <label htmlFor={`member_${index}_discord`} className="genesis-label">
                Discord Username <span className="req">*</span>
              </label>
              <input
                id={`member_${index}_discord`}
                type="text"
                className={`genesis-input ${errors.discord_link ? "has-error" : ""}`}
                placeholder="username#0000 or link"
                value={member.discord_link || ""}
                onChange={(e) => handleTextChange("discord_link", e.target.value)}
              />
              {errors.discord_link && (
                <span className="genesis-error">{errors.discord_link}</span>
              )}
            </div>
          </div>

          {/* Quick collapse or jump to next member */}
          <div className="member-card-footer">
            {index < teamSize - 1 ? (
              <button
                type="button"
                className="next-member-btn"
                onClick={onNext}
              >
                <span>Done, Next Member (#{index + 2})</span>
                <i className="fas fa-arrow-down"></i>
              </button>
            ) : (
              <button
                type="button"
                className="collapse-done-btn"
                onClick={onToggle}
              >
                <i className="fas fa-check"></i>
                <span>Collapse Member</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

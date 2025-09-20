import { Link, useLocation } from "react-router-dom";

export default function SmartLink({ to, children, ...props }) {
  const location = useLocation();

  const handleClick = (e) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

import { memo } from "react";

export default memo(function TrackTechBackground() {
  return (
    <div className="track-tech-background">
      {/* Hexagon Pattern */}
      <div className="track-hex-pattern"></div>

      {/* Dots Pattern */}
      <div className="track-dots-pattern"></div>

      {/* Floating Orange Orbs - Reduced to 3 for better performance */}
      <div className="track-orb track-orb-1"></div>
      <div className="track-orb track-orb-2"></div>
      <div className="track-orb track-orb-3"></div>

      {/* Circuit Lines */}
      <div className="track-circuit-line track-circuit-line-h"></div>
      <div className="track-circuit-line track-circuit-line-v"></div>

      {/* Code Symbols - Reduced to 2 */}
      <div className="track-code-symbol track-code-symbol-1">{'{'}</div>
      <div className="track-code-symbol track-code-symbol-2">{'}'}</div>

      {/* Glowing Particles - Reduced to 3 */}
      <div className="track-particle track-particle-1"></div>
      <div className="track-particle track-particle-2"></div>
      <div className="track-particle track-particle-3"></div>

      {/* Geometric Shapes - Reduced to 1 */}
      <div className="track-geometric track-geometric-1"></div>

      {/* Scan Line */}
      <div className="track-scan-line"></div>
    </div>
  );
});

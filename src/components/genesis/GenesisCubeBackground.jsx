// src/components/genesis/GenesisCubeBackground.jsx
// Modular 3x3 Rubik's/Voxel Style 3D Animated Cubes matching Genesis Artwork

import React from "react";
import "./GenesisCubeBackground.css";

// Helper component to render a 3D Cube with 6 faces, each having a 3x3 (9-cell) modular grid
function ModularCube({ sizeClass, posClass, animClass }) {
  const faces = ["front", "back", "right", "left", "top", "bottom"];
  return (
    <div className={`cube-3d-wrapper ${sizeClass} ${posClass}`}>
      <div className={`cube-3d ${animClass}`}>
        {faces.map((face) => (
          <div key={face} className={`cube-face face-${face}`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="cube-cell">
                <span className="cell-inner-glow" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GenesisCubeBackground() {
  return (
    <div className="genesis-cube-bg-canvas" aria-hidden="true">
      {/* Ambient Gradient Light Glows */}
      <div className="cube-ambient-glow glow-top" />
      <div className="cube-ambient-glow glow-bottom" />
      <div className="cube-ambient-glow glow-center" />
      <div className="cube-ambient-glow glow-accent" />

      {/* Futuristic Perspective Grid */}
      <div className="cube-perspective-grid" />

      {/* 3D Scene with Modular 3x3 Genesis Cubes */}
      <div className="cube-3d-scene">
        {/* 1. Main Hero Modular Cube - Top Right */}
        <ModularCube
          sizeClass="cube-xlarge"
          posClass="cube-pos-top-right"
          animClass="rotate-anim-dynamic-1"
        />

        {/* 2. Secondary Modular Cube - Top Left */}
        <ModularCube
          sizeClass="cube-large"
          posClass="cube-pos-top-left"
          animClass="rotate-anim-dynamic-2"
        />

        {/* 3. Mid-Left Depth Modular Cube */}
        <ModularCube
          sizeClass="cube-medium"
          posClass="cube-pos-mid-left"
          animClass="rotate-anim-dynamic-3"
        />

        {/* 4. Mid-Right Floating Modular Cube */}
        <ModularCube
          sizeClass="cube-medium"
          posClass="cube-pos-mid-right"
          animClass="rotate-anim-dynamic-1"
        />

        {/* 5. Bottom Right Grounded Modular Cube */}
        <ModularCube
          sizeClass="cube-large"
          posClass="cube-pos-bottom-right"
          animClass="rotate-anim-dynamic-2"
        />

        {/* 6. Bottom Left Foreground Modular Cube */}
        <ModularCube
          sizeClass="cube-medium"
          posClass="cube-pos-bottom-left"
          animClass="rotate-anim-dynamic-3"
        />

        {/* 7. Deep Center Ambient Particle Cube */}
        <ModularCube
          sizeClass="cube-small"
          posClass="cube-pos-center-deep"
          animClass="rotate-anim-dynamic-1"
        />

        {/* 8. Upper Center Drifting Cube */}
        <ModularCube
          sizeClass="cube-small"
          posClass="cube-pos-upper-center"
          animClass="rotate-anim-dynamic-2"
        />
      </div>
    </div>
  );
}

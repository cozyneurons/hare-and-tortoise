import React from 'react';

// Pixel Tortoise (Teal / Forest Green with shell & headband)
export const PixelTortoiseSprite: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`inline-block ${className}`}
    >
      {/* Shell body */}
      <rect x="4" y="5" width="8" height="7" fill="#2A9D8F" />
      <rect x="5" y="4" width="6" height="1" fill="#264653" />
      <rect x="5" y="6" width="6" height="5" fill="#264653" />
      {/* Shell pattern highlights */}
      <rect x="6" y="7" width="2" height="1" fill="#E9C46A" />
      <rect x="9" y="8" width="2" height="1" fill="#E9C46A" />
      <rect x="6" y="9" width="2" height="1" fill="#E9C46A" />
      {/* Head */}
      <rect x="12" y="6" width="3" height="4" fill="#A7C957" />
      <rect x="14" y="7" width="1" height="1" fill="#0D1F18" /> {/* Eye */}
      {/* Bandana */}
      <rect x="11" y="5" width="3" height="1" fill="#E63946" />
      <rect x="10" y="4" width="2" height="1" fill="#E63946" />
      {/* Feet */}
      <rect x="4" y="12" width="2" height="2" fill="#A7C957" />
      <rect x="10" y="12" width="2" height="2" fill="#A7C957" />
      {/* Tail */}
      <rect x="2" y="9" width="2" height="1" fill="#A7C957" />
      {/* Dark pixel outlines */}
      <rect x="4" y="3" width="8" height="1" fill="#0D1F18" />
      <rect x="3" y="4" width="1" height="8" fill="#0D1F18" />
      <rect x="12" y="10" width="1" height="2" fill="#0D1F18" />
      <rect x="4" y="14" width="8" height="1" fill="#0D1F18" />
    </svg>
  );
};

// Pixel Hare (Warm Amber / Orange with long ears & lightning speed scarf)
export const PixelHareSprite: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={`inline-block ${className}`}
    >
      {/* Ears */}
      <rect x="4" y="0" width="2" height="5" fill="#E76F51" />
      <rect x="5" y="1" width="1" height="3" fill="#F4A261" />
      <rect x="8" y="0" width="2" height="4" fill="#E76F51" />
      <rect x="9" y="1" width="1" height="2" fill="#F4A261" />
      {/* Head */}
      <rect x="4" y="5" width="7" height="4" fill="#E76F51" />
      <rect x="9" y="6" width="1" height="1" fill="#0D1F18" /> {/* Eye */}
      <rect x="10" y="7" width="1" height="1" fill="#FFFFFF" /> {/* Snout */}
      {/* Speed Scarf */}
      <rect x="3" y="9" width="7" height="1" fill="#E9C46A" />
      <rect x="2" y="10" width="2" height="2" fill="#E9C46A" />
      {/* Body */}
      <rect x="4" y="10" width="6" height="3" fill="#E76F51" />
      <rect x="5" y="10" width="3" height="3" fill="#FAF5E6" /> {/* Belly */}
      {/* Running Paws */}
      <rect x="3" y="13" width="3" height="2" fill="#B04228" />
      <rect x="9" y="13" width="3" height="2" fill="#B04228" />
      {/* Fluffy Tail */}
      <rect x="2" y="11" width="2" height="2" fill="#FAF5E6" />
      {/* Outline */}
      <rect x="4" y="4" width="7" height="1" fill="#0D1F18" />
      <rect x="11" y="5" width="1" height="5" fill="#0D1F18" />
      <rect x="3" y="15" width="9" height="1" fill="#0D1F18" />
    </svg>
  );
};

// Pixel Collision Flash
export const PixelCollisionBurst: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className="inline-block animate-pulse"
    >
      {/* Outer burst */}
      <rect x="11" y="0" width="2" height="5" fill="#E63946" />
      <rect x="11" y="19" width="2" height="5" fill="#E63946" />
      <rect x="0" y="11" width="5" height="2" fill="#E63946" />
      <rect x="19" y="11" width="5" height="2" fill="#E63946" />
      {/* Diagonal rays */}
      <rect x="3" y="3" width="3" height="3" fill="#E9C46A" />
      <rect x="18" y="3" width="3" height="3" fill="#E9C46A" />
      <rect x="3" y="18" width="3" height="3" fill="#E9C46A" />
      <rect x="18" y="18" width="3" height="3" fill="#E9C46A" />
      {/* Inner star */}
      <rect x="8" y="8" width="8" height="8" fill="#FFFFFF" />
      <rect x="9" y="9" width="6" height="6" fill="#E9C46A" />
      <rect x="11" y="11" width="2" height="2" fill="#E63946" />
    </svg>
  );
};

// Pixel Overworld Tree
export const PixelTree: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {/* Foliage */}
      <rect x="4" y="1" width="8" height="2" fill="#386641" />
      <rect x="2" y="3" width="12" height="7" fill="#6A994E" />
      <rect x="4" y="4" width="4" height="2" fill="#A7C957" />
      <rect x="3" y="6" width="3" height="3" fill="#A7C957" />
      <rect x="3" y="10" width="10" height="2" fill="#386641" />
      {/* Trunk */}
      <rect x="6" y="11" width="4" height="4" fill="#6F4E37" />
      <rect x="7" y="12" width="2" height="3" fill="#8B5A2B" />
      {/* Border */}
      <rect x="4" y="0" width="8" height="1" fill="#0D1F18" />
      <rect x="1" y="3" width="1" height="7" fill="#0D1F18" />
      <rect x="14" y="3" width="1" height="7" fill="#0D1F18" />
      <rect x="5" y="15" width="6" height="1" fill="#0D1F18" />
    </svg>
  );
};

// Pixel Signpost
export const PixelSignpost: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {/* Signboard */}
      <rect x="2" y="2" width="12" height="8" fill="#F2E8CF" />
      <rect x="3" y="3" width="10" height="6" fill="#FAF5E6" />
      <rect x="4" y="4" width="8" height="1" fill="#0D1F18" />
      <rect x="4" y="6" width="6" height="1" fill="#0D1F18" />
      {/* Post */}
      <rect x="7" y="10" width="2" height="5" fill="#6F4E37" />
      {/* Outline */}
      <rect x="2" y="1" width="12" height="1" fill="#0D1F18" />
      <rect x="1" y="2" width="1" height="8" fill="#0D1F18" />
      <rect x="14" y="2" width="1" height="8" fill="#0D1F18" />
      <rect x="2" y="10" width="12" height="1" fill="#0D1F18" />
    </svg>
  );
};

// Pixel Laboratory Computer
export const PixelLabComputer: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {/* Screen */}
      <rect x="2" y="1" width="12" height="9" fill="#183C32" />
      <rect x="3" y="2" width="10" height="7" fill="#A7C957" />
      {/* Terminal lines */}
      <rect x="4" y="3" width="6" height="1" fill="#183C32" />
      <rect x="4" y="5" width="8" height="1" fill="#183C32" />
      <rect x="4" y="7" width="4" height="1" fill="#183C32" />
      {/* Stand & Base */}
      <rect x="6" y="10" width="4" height="2" fill="#D8CCA8" />
      <rect x="3" y="12" width="10" height="2" fill="#F2E8CF" />
      {/* Outline */}
      <rect x="2" y="0" width="12" height="1" fill="#0D1F18" />
      <rect x="1" y="1" width="1" height="9" fill="#0D1F18" />
      <rect x="14" y="1" width="1" height="9" fill="#0D1F18" />
      <rect x="2" y="14" width="12" height="1" fill="#0D1F18" />
    </svg>
  );
};

// Pixel Gym Badges
export const PixelBadge: React.FC<{ type: 'detection' | 'entry' | 'middle' | 'duplicate'; size?: number }> = ({
  type,
  size = 32,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
      {type === 'detection' && (
        <>
          {/* Boulder/Loop Badge */}
          <rect x="3" y="3" width="10" height="10" fill="#2A9D8F" />
          <rect x="5" y="5" width="6" height="6" fill="#F2E8CF" />
          <rect x="6" y="6" width="4" height="4" fill="#264653" />
          <rect x="2" y="2" width="12" height="1" fill="#0D1F18" />
          <rect x="2" y="13" width="12" height="1" fill="#0D1F18" />
        </>
      )}
      {type === 'entry' && (
        <>
          {/* Key / Entry Badge */}
          <rect x="4" y="2" width="8" height="8" fill="#E63946" />
          <rect x="6" y="4" width="4" height="4" fill="#FFFFFF" />
          <rect x="7" y="10" width="2" height="4" fill="#E9C46A" />
          <rect x="9" y="11" width="2" height="1" fill="#E9C46A" />
          <rect x="9" y="13" width="2" height="1" fill="#E9C46A" />
        </>
      )}
      {type === 'middle' && (
        <>
          {/* Balance / Scale Badge */}
          <rect x="2" y="4" width="12" height="2" fill="#E9C46A" />
          <rect x="7" y="2" width="2" height="11" fill="#A7C957" />
          <rect x="3" y="6" width="3" height="4" fill="#386641" />
          <rect x="10" y="6" width="3" height="4" fill="#386641" />
          <rect x="5" y="13" width="6" height="2" fill="#183C32" />
        </>
      )}
      {type === 'duplicate' && (
        <>
          {/* Twin Star Badge */}
          <rect x="3" y="5" width="4" height="6" fill="#E76F51" />
          <rect x="9" y="5" width="4" height="6" fill="#E76F51" />
          <rect x="6" y="7" width="4" height="2" fill="#E9C46A" />
          <rect x="4" y="4" width="2" height="1" fill="#FFFFFF" />
          <rect x="10" y="4" width="2" height="1" fill="#FFFFFF" />
        </>
      )}
    </svg>
  );
};

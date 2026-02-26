/**
 * Stanford Tree mascot — friendly chibi tree (round foliage + trunk + cute face)
 */
export default function StanfordTreeChibi({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Trunk */}
      <rect x="18" y="32" width="12" height="10" rx="3" fill="#6D4C41" />
      <rect x="19" y="33" width="10" height="8" rx="2" fill="#8D6E63" opacity="0.6" />

      {/* Foliage — round, fluffy tree shape (layered circles) */}
      <ellipse cx="24" cy="28" rx="14" ry="12" fill="#2E7D32" />
      <ellipse cx="24" cy="24" rx="13" ry="11" fill="#388E3C" />
      <ellipse cx="24" cy="20" rx="11" ry="10" fill="#43A047" />
      <ellipse cx="18" cy="26" rx="4" ry="4" fill="#66BB6A" opacity="0.5" />
      <ellipse cx="30" cy="24" rx="3.5" ry="3.5" fill="#66BB6A" opacity="0.5" />

      {/* Face — soft, friendly (big eyes + smile) */}
      {/* Left eye — white base + dark pupil + highlight */}
      <ellipse cx="20" cy="22" rx="3" ry="3.2" fill="#FFF" />
      <ellipse cx="20" cy="22.5" rx="1.4" ry="1.6" fill="#5D4037" />
      <ellipse cx="20.5" cy="21.8" rx="0.5" ry="0.6" fill="#FFF" />
      {/* Right eye */}
      <ellipse cx="28" cy="22" rx="3" ry="3.2" fill="#FFF" />
      <ellipse cx="28" cy="22.5" rx="1.4" ry="1.6" fill="#5D4037" />
      <ellipse cx="28.5" cy="21.8" rx="0.5" ry="0.6" fill="#FFF" />
      {/* Smile — friendly curve */}
      <path
        d="M20 27.5 Q24 30.5 28 27.5"
        stroke="#5D4037"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Rosy cheeks */}
      <ellipse cx="15" cy="25" rx="2.5" ry="1.5" fill="#EF9A9A" opacity="0.5" />
      <ellipse cx="33" cy="25" rx="2.5" ry="1.5" fill="#EF9A9A" opacity="0.5" />

      {/* Small cardinal accent on top (like a leaf/ribbon) */}
      <path
        d="M24 8 L26 14 L24 12 L22 14 Z"
        fill="#8C1515"
        opacity="0.9"
      />
    </svg>
  );
}

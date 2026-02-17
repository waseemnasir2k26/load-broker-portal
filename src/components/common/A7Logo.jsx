/**
 * A7 Transport Logo Component
 * Brand colors: Orange #FA9B00, Dark charcoal #2D3137
 */

export default function A7Logo({ size = 'md', showText = true, showTagline = true }) {
  const sizes = {
    sm: { container: 'gap-2', icon: 'text-2xl', text: 'text-base', tagline: 'text-[10px]' },
    md: { container: 'gap-3', icon: 'text-3xl', text: 'text-lg', tagline: 'text-xs' },
    lg: { container: 'gap-4', icon: 'text-5xl', text: 'text-2xl', tagline: 'text-sm' },
    xl: { container: 'gap-5', icon: 'text-7xl', text: 'text-3xl', tagline: 'text-base' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center ${s.container}`}>
      {/* Logo Mark */}
      <div className="relative">
        <div className={`${s.icon} font-black tracking-tighter leading-none`}>
          <span style={{ color: '#FA9B00' }}>A</span>
          <span className="text-white">7</span>
        </div>
        {/* Orange accent swoosh */}
        <div
          className="absolute -top-1 -left-1 w-full h-full"
          style={{
            borderTop: '3px solid #FA9B00',
            borderRight: '3px solid #FA9B00',
            borderRadius: '0 50% 0 0',
            transform: 'rotate(15deg) scale(1.1)',
            opacity: 0.6,
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`${s.text} font-bold text-white leading-none`}>
            A7 Transport
          </div>
          {showTagline && (
            <div className={`${s.tagline} text-slate-400 tracking-widest uppercase mt-0.5`}>
              Load Board & Tracking
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for TopBar/Sidebar
export function A7LogoCompact({ collapsed = false }) {
  if (collapsed) {
    return (
      <div className="relative">
        <div className="text-2xl font-black tracking-tighter leading-none">
          <span style={{ color: '#FA9B00' }}>A</span>
          <span className="text-white">7</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="text-2xl font-black tracking-tighter leading-none">
          <span style={{ color: '#FA9B00' }}>A</span>
          <span className="text-white">7</span>
        </div>
        <div
          className="absolute -top-0.5 -left-0.5 w-full h-full"
          style={{
            borderTop: '2px solid #FA9B00',
            borderRight: '2px solid #FA9B00',
            borderRadius: '0 50% 0 0',
            transform: 'rotate(15deg) scale(1.1)',
            opacity: 0.5,
          }}
        />
      </div>
      <div>
        <div className="text-base font-bold text-white leading-none">A7 Transport</div>
        <div className="text-[10px] text-slate-500 tracking-wider uppercase">Portal</div>
      </div>
    </div>
  )
}

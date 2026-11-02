import TicketStack from './TicketStack';

export default function Hero({ onLostClick, onFoundClick, activeCount }) {
  return (
    <section className="bg-cream-50 border-b border-cream-200 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(circle at 88% 18%, rgba(200,155,60,0.16), transparent 45%)'}}></div>
      <div className="wrap grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-14 pt-16 pb-14 items-center relative">
        <div>
          <div className="font-mono text-[11.5px] tracking-widest uppercase text-maroon-700 flex items-center gap-2.5 mb-4.5">
            <span className="w-[22px] h-px bg-maroon-700"></span>
            CAMPUS-WIDE REGISTRY
          </div>
          <h2 className="font-display text-[32px] md:text-[44px] leading-[1.12] text-ink-900">
            Left it somewhere?<br /><span className="text-maroon-700">Someone probably found it.</span>
          </h2>
          <p className="mt-4.5 text-base leading-relaxed text-ink-500 max-w-[46ch]">
            A shared board for everything that goes missing across KCT campus — ID cards, water bottles, chargers, the occasional bicycle. Report it, search it, get it back.
          </p>
          <div className="flex gap-3.5 mt-7 flex-wrap">
            <button onClick={onLostClick} className="bg-maroon-700 text-cream-50 border-none px-6 py-[13px] text-[14.5px] font-semibold rounded-sm hover:bg-maroon-600 transition-colors">
              I lost something
            </button>
            <button onClick={onFoundClick} className="bg-transparent text-maroon-700 border-[1.5px] border-maroon-700 px-6 py-[11.5px] text-[14.5px] font-semibold rounded-sm hover:bg-maroon-700 hover:text-cream-50 transition-colors">
              I found something
            </button>
          </div>
          <div className="flex gap-9 mt-11 flex-wrap">
            <div className="border-l-2 border-gold-500 pl-3.5">
              <b className="block font-display text-[27px] text-maroon-700">214</b>
              <span className="text-xs text-ink-500 font-mono">REPORTED THIS SEMESTER</span>
            </div>
            <div className="border-l-2 border-gold-500 pl-3.5">
              <b className="block font-display text-[27px] text-maroon-700">158</b>
              <span className="text-xs text-ink-500 font-mono">REUNITED WITH OWNERS</span>
            </div>
            <div className="border-l-2 border-gold-500 pl-3.5">
              <b className="block font-display text-[27px] text-maroon-700">{activeCount ?? '—'}</b>
              <span className="text-xs text-ink-500 font-mono">ACTIVE LISTINGS</span>
            </div>
          </div>
        </div>
        <TicketStack />
      </div>
    </section>
  );
}

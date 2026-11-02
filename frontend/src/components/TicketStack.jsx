export default function TicketStack() {
  return (
    <div className="ticket-stack" aria-hidden="true">
      <div className="ticket ticket-c shadow-card">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[11px] text-ink-500">#FX-2278</span>
          <span className="font-mono text-[10px] tracking-wider px-2 py-[3px] rounded-full uppercase font-medium bg-found-bg text-found">Found</span>
        </div>
        <h4 className="font-display text-[17px] mt-3 text-ink-900">Blue water bottle</h4>
        <p className="text-[12px] text-ink-500 mt-1.5">Milton, dented cap, name tag missing</p>
        <div className="t-dash"></div>
        <div className="text-[11.5px] text-ink-700 flex justify-between font-mono">
          <span>LT COMPLEX</span><span>18 JUL</span>
        </div>
      </div>
      <div className="ticket ticket-b shadow-card">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[11px] text-ink-500">#FX-2281</span>
          <span className="font-mono text-[10px] tracking-wider px-2 py-[3px] rounded-full uppercase font-medium bg-lost-bg text-lost">Lost</span>
        </div>
        <h4 className="font-display text-[17px] mt-3 text-ink-900">College ID card</h4>
        <p className="text-[12px] text-ink-500 mt-1.5">Roll no. ending 042, mech department</p>
        <div className="t-dash"></div>
        <div className="text-[11.5px] text-ink-700 flex justify-between font-mono">
          <span>CANTEEN</span><span>19 JUL</span>
        </div>
      </div>
      <div className="ticket ticket-a shadow-card">
        <div className="flex justify-between items-start">
          <span className="font-mono text-[11px] text-ink-500">#FX-2290</span>
          <span className="font-mono text-[10px] tracking-wider px-2 py-[3px] rounded-full uppercase font-medium bg-found-bg text-found">Found</span>
        </div>
        <h4 className="font-display text-[17px] mt-3 text-ink-900">Wired earphones</h4>
        <p className="text-[12px] text-ink-500 mt-1.5">White, boAt brand, in a pouch</p>
        <div className="t-dash"></div>
        <div className="text-[11.5px] text-ink-700 flex justify-between font-mono">
          <span>CENTRAL LIBRARY</span><span>21 JUL</span>
        </div>
      </div>
    </div>
  );
}

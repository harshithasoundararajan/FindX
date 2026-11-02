const steps = [
  { num: 1, title: 'Report it', body: 'Post what you lost or found — category, location, date, and a short description. Photos help a lot.' },
  { num: 2, title: 'Get matched', body: 'Browse the board or wait for a match. Every listing carries a claim code you can reference at the desk.' },
  { num: 3, title: 'Collect in person', body: 'Verified items are held at the Student Activity Centre desk. Bring your ID card to collect.' }
];

export default function HowItWorks() {
  return (
    <section className="bg-cream-100 border-y border-cream-200 py-[60px]">
      <div className="wrap">
        <h3 className="font-display text-2xl mb-8">How the registry works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((s) => (
            <div key={s.num}>
              <div className="font-display text-[15px] border-[1.5px] border-maroon-700 w-[34px] h-[34px] flex items-center justify-center rounded-full text-maroon-700 mb-3.5">
                {s.num}
              </div>
              <h4 className="text-base mb-2 font-display">{s.title}</h4>
              <p className="text-[13px] text-ink-500 leading-relaxed m-0">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

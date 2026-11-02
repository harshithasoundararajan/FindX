import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-maroon-900 text-cream-100 pt-12 pb-6">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-8 border-b border-white/10">
          <div>
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-gold-300 mb-3.5">FindX</h5>
            <p className="text-[13px] leading-relaxed text-cream-200 opacity-80 max-w-[38ch]">
              The Lost &amp; Found registry for Kumaraguru College of Technology. Report, browse, and reclaim campus items securely.
            </p>
          </div>
          <div>
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-gold-300 mb-3.5">Registry</h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              <li><Link to="/" className="text-[13px] text-cream-100 opacity-80 hover:opacity-100 no-underline hover:underline">Browse listings</Link></li>
              <li><Link to="/dashboard" className="text-[13px] text-cream-100 opacity-80 hover:opacity-100 no-underline hover:underline">My dashboard</Link></li>
              <li><Link to="/register" className="text-[13px] text-cream-100 opacity-80 hover:opacity-100 no-underline hover:underline">Create an account</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[11.5px] tracking-wider uppercase text-gold-300 mb-3.5">Collection desk</h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-[13px] opacity-80">
              <li>Student Activity Centre</li>
              <li>Mon–Sat, 09:00–17:00</li>
              <li>findx-support@kct.ac.in</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between pt-5 text-[11.5px] opacity-65 font-mono flex-wrap gap-2">
          <span>© 2026 FINDX · KUMARAGURU COLLEGE OF TECHNOLOGY</span>
          <span>CLOUD-NATIVE LOST &amp; FOUND MANAGEMENT SYSTEM</span>
        </div>
      </div>
    </footer>
  );
}

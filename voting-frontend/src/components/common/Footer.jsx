import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Envelope,
  Telephone,
  GeoAlt,
} from "react-bootstrap-icons";

export default function Footer() {
  const iconBox =
    "w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center cursor-pointer";

  const linkStyle =
    "text-white/70 hover:text-white text-base block mb-3 transition";

  return (
    <footer className="bg-[#080838] text-white px-10 py-13 border-t-4 border-purple-500 mt-10 flex-1">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* 🔷 Logo + Description */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold">VoteSecure</h2>
          </div>

          <p className="text-white/70 text-base leading-relaxed">
            Empowering democracy through secure, transparent, and accessible
            online voting solutions.
          </p>

          <div className="flex gap-3 mt-5">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <div key={i} className={iconBox}>
                <Icon size={22} />
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
          <Link to="/polls" className={linkStyle}>Home</Link>
          <Link to="/polls" className={linkStyle}>Elections</Link>
          <Link to="/results" className={linkStyle}>Results</Link>
          <Link to="/faq" className={linkStyle}>FAQ</Link>
        </div>

        {/* 🔹 Legal */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Legal</h3>
          <span className={linkStyle}>Privacy Policy</span>
          <span className={linkStyle}>Terms of Service</span>
          <span className={linkStyle}>Cookie Policy</span>
          <span className={linkStyle}>Security</span>
        </div>

        {/* 🔹 Contact */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Contact Us</h3>

          <div className="flex items-center gap-3 mb-3 text-white/70">
            <Envelope size={20} />
            <span>support@votesecure.com</span>
          </div>

          <div className="flex items-center gap-3 mb-3 text-white/70">
            <Telephone size={20} />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-start gap-3 text-white/70">
            <GeoAlt size={20} />
            <span>
              India <br />
              Secure Voting Network
            </span>
          </div>
        </div>
      </div>

      {/* 🔻 Divider */}
      <div className="border-t border-white/20 my-8"></div>

      {/* 🔻 Bottom */}
      <div className="flex flex-col lg:flex-row justify-between gap-3 text-white/60 text-sm">
        <span>© {new Date().getFullYear()} VoteSecure. All rights reserved.</span>

        <div className="flex gap-5 flex-wrap">
          <span className="hover:text-white cursor-pointer">Voter Rights</span>
          <span className="hover:text-white cursor-pointer">Guidelines</span>
          <span className="hover:text-white cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}
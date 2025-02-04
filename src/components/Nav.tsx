
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#8247E5] z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#8247E5] font-bold">
              LF
            </div>
            <span className="text-white font-semibold text-xl">LedgerFund</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Overview
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Get Investment Ready
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Why Now
            </Link>
            <Link to="/" className="text-white/80 hover:text-white transition-colors">
              Roadmap
            </Link>
          </div>

          <button className="hidden md:block px-6 py-2 bg-white text-[#8247E5] rounded-lg font-medium hover:bg-white/90 transition-colors">
            Launch App
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

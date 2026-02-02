
import React from 'react';
import { Share2, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="max-w-[1200px] mx-auto px-6 lg:px-40 py-12 border-t border-[#d0d4e7]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 opacity-50 grayscale">
          <div className="size-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase">INEFÁVEL</span>
        </div>
        
        <p className="text-xs text-text-muted font-medium text-center">
          © {new Date().getFullYear()} INEFÁVEL. Todos os direitos reservados. Branding e Posicionamento Digital.
        </p>
        
        <div className="flex gap-6">
          <a className="text-text-muted hover:text-primary transition-colors" href="#">
            <Share2 className="w-5 h-5" />
          </a>
          <a className="text-text-muted hover:text-primary transition-colors" href="#">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-accent text-accent-foreground mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <Leaf className="w-6 h-6" /> Kisan Bandhu
          </div>
          <p className="text-sm opacity-80">
            Empowering farmers by connecting them directly to buyers. Fair prices, transparent bidding, better lives.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/marketplace" className="block hover:opacity-100 transition-opacity">Marketplace</Link>
            <Link to="/advisory" className="block hover:opacity-100 transition-opacity">Crop Advisory</Link>
            <Link to="/msp-calculator" className="block hover:opacity-100 transition-opacity">MSP Calculator</Link>
            <Link to="/schemes" className="block hover:opacity-100 transition-opacity">Government Schemes</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact Us</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 96253-01837</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> kisanbandhu.contact@gmail.com</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> DTC 28/1, Knowledge Park-III, Greater Noida - 201306 (U.P.)</p>
            <p className="text-xs opacity-70">Mon - Sat | 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
  <Facebook size={18} />
</a>

<a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
  <Twitter size={18} />
</a>

<a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
  <Instagram size={18} />
</a>

<a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
  <Youtube size={18} />
</a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 Kisan Bandhu. All rights reserved. 
      </div>
    </div>
  </footer>
);

export default Footer;

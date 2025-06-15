
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="border-t bg-background/50 backdrop-blur-sm relative z-10">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ToolKit</span>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Professional tools for everyone. Free, secure, and always available.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Popular Tools</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/qr-generator" className="hover:text-primary transition-colors">QR Generator</Link></li>
            <li><Link to="/background-remover" className="hover:text-primary transition-colors">Background Remover</Link></li>
            <li><Link to="/password-generator" className="hover:text-primary transition-colors">Password Generator</Link></li>
            <li><Link to="/pdf-tools" className="hover:text-primary transition-colors">PDF Tools</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><span className="hover:text-primary transition-colors cursor-not-allowed">AI Content Tools</span></li>
            <li><span className="hover:text-primary transition-colors cursor-not-allowed">Fake Data Generators</span></li>
            <li><span className="hover:text-primary transition-colors cursor-not-allowed">Social Media Tools</span></li>
            <li><span className="hover:text-primary transition-colors cursor-not-allowed">Media Tools</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-8 pt-6 text-center">
        <p className="text-muted-foreground text-sm">
          © 2024 ToolKit. Free to use, forever. Built with ❤️ for the internet.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;

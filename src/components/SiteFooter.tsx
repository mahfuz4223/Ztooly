
import { Sparkles } from "lucide-react";

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
            <li><a href="/qr-generator" className="hover:text-primary transition-colors">QR Generator</a></li>
            <li><a href="/background-remover" className="hover:text-primary transition-colors">Background Remover</a></li>
            <li><a href="/password-generator" className="hover:text-primary transition-colors">Password Generator</a></li>
            <li><a href="/pdf-tools" className="hover:text-primary transition-colors">PDF Tools</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">AI Content Tools</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Fake Data Generators</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Social Media Tools</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Media Tools</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
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

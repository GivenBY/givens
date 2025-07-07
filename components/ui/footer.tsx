import { Github, Heart, Twitter } from "lucide-react";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for developers</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/givenby/givens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/GivenBY_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Givens. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-[#0a0a0a] dark:to-[#111] flex flex-col">
      {/* === HEADER / NAVBAR === */}
      <header className="flex justify-between items-center px-8 md:px-16 py-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
          tanjakai
        </h1>

        <nav className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300 font-medium">
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Download</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Partners</a>
        </nav>

        <div className="flex space-x-4">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white">
            <Link to={"/login"}>Log in</Link>
          </Button>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <section className="flex flex-col md:flex-row flex-1 items-center justify-between px-8 md:px-16 py-12 gap-10">
        {/* LEFT TEXT */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-blue-900 dark:text-blue-100">
            Bienvenue chez <span className="text-blue-700 dark:text-blue-400">Tanjakai</span>
          </h2>

          <Separator className="w-16 bg-blue-700 dark:bg-blue-500" />

          <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">
            Tanjakai simplifie la gestion RH et les processus internes grâce à une
            plateforme intuitive et moderne. Automatisez vos tâches et accédez à
            des outils décisionnels puissants.
          </p>

          <div className="flex space-x-4">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
              En savoir plus
            </Button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/Picture.png"
            alt="Illustration Tanjakai"
            className="w-[90%] md:w-[80%] h-auto drop-shadow-xl rounded-2xl"
          />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm ">
        © {new Date().getFullYear()} Tanjakai. Tous droits réservés.
      </footer>
    </div>
  );
}

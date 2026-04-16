import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatApp from "./ChatApp";

export default function PortfolioApp() {
    return (
        <div style={{ width: "100%", minHeight: "100vh" }}>
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <ChatApp />
            <Footer />
        </div>
    );
}
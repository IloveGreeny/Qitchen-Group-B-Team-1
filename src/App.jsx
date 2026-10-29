import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Menu from './components/Menu.jsx'
import Reservation from './components/Reservation.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Reservation />
        <About />
      </main>
      <Footer />
    </>
  )
}

import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Menu from './components/Menu.jsx'
import Reservation from './components/Reservation.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import OrderSuccess from './components/OrderSuccess.jsx'

export default function App() {
  // Only two pages, so we just look at the address instead of adding a router:
  // /order/success is where Stripe sends people back after paying; everything else is the home page.
  const isOrderSuccess = window.location.pathname === '/order/success'

  return (
    <>
      <Header />
      <main>
        {isOrderSuccess ? (
          <OrderSuccess />
        ) : (
          <>
            <Hero />
            <Menu />
            <Reservation />
            <About />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

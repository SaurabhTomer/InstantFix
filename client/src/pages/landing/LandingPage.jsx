import Navbar       from './Navbar'
import Hero         from './Hero'
import Features     from './Features'
import Categories   from './Categories'
import HowItWorks   from './HowItWorks'
import Testimonials from './Testimonials'
import Footer       from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  )
}
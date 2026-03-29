import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import PopularServices from './components/PopularServices'
import PromoBanner from './components/PromoBanner'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Categories />
      <PromoBanner />
      <PopularServices />
    </div>
  )
}

export default Dashboard
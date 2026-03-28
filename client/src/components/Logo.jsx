import { MdElectricBolt } from 'react-icons/md'

const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: { icon: 22, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-3xl' }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-blue-600 rounded-xl p-2">
        <MdElectricBolt size={sizes[size].icon} color="#facc15" />
      </div>
      <span className={`font-bold text-gray-800 ${sizes[size].text}`}>
        Instant<span className="text-blue-600">Fix</span>
      </span>
    </div>
  )
}

export default Logo
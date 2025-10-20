import { ReactNode } from 'react'
import clsx from 'clsx'

interface HeroProps {
  title: string
  subtitle?: string
  children?: ReactNode
  backgroundImage?: string
  height?: 'small' | 'medium' | 'large'
}

export default function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  height = 'large',
}: HeroProps) {
  // Debug: log the background image URL
  if (backgroundImage) {
    console.log('Hero background image:', backgroundImage)
  }
  const heightClasses = {
    small: 'min-h-[250px] md:min-h-[300px]',
    medium: 'min-h-[350px] md:min-h-[400px]',
    large: 'min-h-[500px] md:min-h-[600px]',
  }

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center text-white',
        heightClasses[height]
      )}
    >
      {/* Background */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-deep-navy to-deep-navy/80" />
      )}

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}


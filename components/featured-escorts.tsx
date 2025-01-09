import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface FeaturedEscortProps {
  name: string
  image: string
  title: string
}

function FeaturedEscort({ name, image, title }: FeaturedEscortProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0 relative">
        <Image
          src={image}
          alt={name}
          width={400}
          height={600}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-primary">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeaturedEscorts() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Featured Escorts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeaturedEscort
          name="Sophia"
          image="/placeholder.svg?height=600&width=400"
          title="Escort of the Day"
        />
        <FeaturedEscort
          name="Emma"
          image="/placeholder.svg?height=600&width=400"
          title="Escort of the Week"
        />
        <FeaturedEscort
          name="Isabella"
          image="/placeholder.svg?height=600&width=400"
          title="Escort of the Month"
        />
      </div>
    </div>
  )
}


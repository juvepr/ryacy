'use client'

import React from 'react'
import Image from 'next/image'
import { ShoppingCart, Star, Clock, Tag, ArrowRight, Calendar, Users, Check, Mail, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export interface Product {
  id: number
  name: string
  category: string
  description: string
  longDescription?: string
  price: number
  version: string
  lastUpdated: string
  rating: number
  features: string[]
  tags: string[]
  keyAuthLevel: string
  imageSrc: string
  systemRequirements?: string[]
  updates?: {
    date: string
    description: string
  }[]
  documentation?: string
  support?: {
    email?: string
    website?: string
    hours?: string
  }
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(true)
  const { toast } = useToast()

  const handlePurchase = async () => {
    try {
      setIsLoading(true)
      console.log('Starting purchase process for:', product.name)

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: product.price,
          productName: product.name,
          metadata: {
            productId: product.id,
            category: product.category,
            version: product.version,
            keyAuthLevel: product.keyAuthLevel
          }
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create checkout session')
      }

      const data = await response.json()

      if (data.error) {
        console.error('Checkout Error:', data.error)
        throw new Error(data.error)
      }

      console.log('Redirecting to checkout:', data.url)
      window.location.href = data.url

    } catch (error) {
      console.error('Purchase Error:', error)
      toast({
        title: "Error",
        description: "Failed to process purchase. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-muted">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          className={`
            object-cover transition-transform duration-300 group-hover:scale-105
            ${imageLoading ? 'blur-sm' : 'blur-0'}
          `}
          onLoadingComplete={() => setImageLoading(false)}
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-product.jpg'
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={product.id === 1}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/75 text-white">
            ${product.price}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl">{product.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4" />
          <span>Version {product.version}</span>
          <Star className="w-4 h-4 ml-2" />
          <span>{product.rating}/5.0</span>
        </div>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
          <ul className="space-y-2">
            {product.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-4 h-4 text-[#765de7]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button 
          className="flex-1 bg-[#765de7] hover:bg-[#765de7]/90 text-white"
          onClick={handlePurchase}
          disabled={isLoading}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Purchase'}
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex-1 border-[#765de7] text-[#765de7] hover:bg-[#765de7]/10"
            >
              Learn More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {product.name}
                <Badge variant="secondary" className="ml-2">
                  v{product.version}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-base pt-4">
                {product.longDescription || product.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Release Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {product.lastUpdated}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Version: {product.version}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" /> Support
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.support?.hours || "24/7 Technical Support"}
                  </p>
                  {product.support?.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {product.support.email}
                    </p>
                  )}
                  {product.support?.website && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {product.support.website}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* All Features */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Features & Capabilities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* System Requirements */}
              {product.systemRequirements && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-4">System Requirements</h3>
                    <ul className="space-y-2">
                      {product.systemRequirements.map((req) => (
                        <li key={req} className="text-sm flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-[#765de7]" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                </>
              )}

              {/* Recent Updates */}
              {product.updates && product.updates.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Recent Updates</h3>
                    <div className="space-y-4">
                      {product.updates.map((update, index) => (
                        <div key={index} className="border-l-2 border-[#765de7] pl-4">
                          <p className="text-sm font-medium">{update.date}</p>
                          <p className="text-sm text-muted-foreground">
                            {update.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Documentation Link */}
              {product.documentation && (
                <div className="text-sm">
                  <a 
                    href={product.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#765de7] hover:underline flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    View Documentation
                  </a>
                </div>
              )}

              {/* Purchase Section */}
              <div className="pt-4 flex justify-end gap-4">
                <Button
                  className="bg-[#765de7] hover:bg-[#765de7]/90 text-white"
                  onClick={handlePurchase}
                  disabled={isLoading}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Now - ${product.price}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
import React from 'react'
import { Shield, Layers } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard, { Product } from './product-card'

const ProductShowcase: React.FC = () => {
  const softwareProducts: Product[] = [
    {
      id: 1,
      name: "FloatNote",
      category: "AI Solutions",
      description: "Intelligent note-taking app that overlays on top of any application, with AI-powered formatting and organization.",
      longDescription: "FloatNote revolutionizes the way you take notes by combining the power of AI with a seamless floating interface. This innovative tool hovers over any application, allowing you to capture thoughts and information without switching contexts. With advanced AI processing, your notes are automatically formatted, categorized, and organized for optimal productivity.",
      price: 4.99,
      version: "1.5.0",
      lastUpdated: "2024-03-20",
      rating: 4.9,
      features: [
        "Advanced AI processing",
        "Workflow automation",
        "Windows OS Support",
        "macOS Support",
        "24/7 Operation",
        "Predictive Analytics",
        "Customizable Dashboards",
        "Floating Note Interface",
        "Automatic Note Formatting",
        "Cloud Sync",
        "Offline Mode",
        "Export to Multiple Formats"
      ],
      tags: [
        "Standard",
        "Automation",
        "AI",
        "Enterprise",
        "Productivity",
        "Note-Taking"
      ],
      keyAuthLevel: "1",
      imageSrc: "/images/products/floatnote-hero.jpg",
      systemRequirements: [
        "Windows 10/11 or macOS 10.15+",
        "4GB RAM minimum",
        "500MB free disk space",
        "Internet connection for cloud features",
        "1280x720 minimum screen resolution"
      ],
      updates: [
        {
          date: "March 20, 2024",
          description: "Added new AI-powered formatting options and improved cloud sync performance"
        },
        {
          date: "March 1, 2024",
          description: "Introduced dark mode and custom themes"
        },
        {
          date: "February 15, 2024",
          description: "Enhanced macOS compatibility and fixed minor bugs"
        }
      ],
      documentation: "https://docs.floatnote.com",
      support: {
        email: "support@floatnote.com",
        website: "https://support.floatnote.com",
        hours: "24/7 Technical Support"
      }
    }
    // Example of another product
  ]

  const filterProducts = (category: string): Product[] => {
    if (category === 'all') return softwareProducts
    return softwareProducts.filter(product => product.category === category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Ryacy <span className="text-[#765de7]">Solutions</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Delivering dependable software solutions since 2021
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm font-medium">
            <Shield className="w-4 h-4 mr-1" /> Security-First
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm font-medium">
            <Layers className="w-4 h-4 mr-1" /> Reliable
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="Scripts">Scripts</TabsTrigger>
            <TabsTrigger value="AI Solutions">AI Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterProducts('all').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="Scripts" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterProducts('Scripts').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="AI Solutions" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filterProducts('AI Solutions').map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductShowcase
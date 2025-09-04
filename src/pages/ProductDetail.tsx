import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Clock, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AddOnsSelector } from "@/components/AddOnsSelector";
import { ProductReviews } from "@/components/ProductReviews";
import { useCart, CartAddOn } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import pastriesImage from "@/assets/pastries-display.jpg";
import breadImage from "@/assets/bread-shelves.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<{name: string, price: string} | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<{pointsPerItem: number, bonusThreshold?: number, bonusPoints?: number} | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const products = [
    {
      id: "1",
      name: "Artisan Croissants",
      description: "Buttery, flaky croissants baked fresh every morning. Our signature croissants are made with French butter and folded to perfection, creating 81 delicate layers. Each bite delivers a perfect balance of crispy exterior and tender, airy interior.",
      fullDescription: "Our artisan croissants are crafted using traditional French techniques passed down through generations. We start early each morning, carefully laminating the dough with premium European butter to create those iconic flaky layers. Available in classic butter, rich almond with sliced almonds and pastry cream, and decadent chocolate with Belgian dark chocolate.",
      price: "From $3.50",
      image: pastriesImage,
      rating: 5,
      popular: true,
      prepTime: "15 minutes",
      ingredients: ["French butter", "Premium flour", "Fresh eggs", "Sea salt", "Belgian chocolate (chocolate variant)", "Almonds (almond variant)"],
      nutritional: {
        calories: "280",
        fat: "18g",
        carbs: "24g",
        protein: "6g"
      },
      variants: [
        { name: "Classic Butter", price: "$3.50" },
        { name: "Almond", price: "$4.25" },
        { name: "Chocolate", price: "$4.00" }
      ]
    },
    {
      id: "2", 
      name: "Sourdough Bread",
      description: "Traditional sourdough with a perfect crust and tangy flavor. Made from our 100-year-old starter.",
      fullDescription: "Our sourdough bread is made using our treasured 100-year-old starter, carefully maintained and fed daily. The slow fermentation process develops complex flavors and creates the perfect texture - a golden, crackling crust that gives way to an open, chewy crumb with delightful tang. Each loaf is hand-shaped and baked on stone for authentic results.",
      price: "$8.00",
      image: breadImage,  
      rating: 5,
      popular: true,
      prepTime: "72 hours (fermentation included)",
      ingredients: ["100-year-old sourdough starter", "Organic bread flour", "Sea salt", "Filtered water"],
      nutritional: {
        calories: "120 per slice",
        fat: "1g",
        carbs: "24g", 
        protein: "4g"
      },
      variants: [
        { name: "Regular Loaf", price: "$8.00" },
        { name: "Whole Grain", price: "$9.50" }
      ]
    },
    {
      id: "3",
      name: "Danish Pastries", 
      description: "Delicate pastries filled with seasonal fruits, cream cheese, or premium chocolate.",
      fullDescription: "Our Danish pastries showcase the art of laminated dough, similar to croissants but with a unique texture and shape. Each pastry is carefully shaped and filled with seasonal ingredients - from fresh berries and stone fruits to rich cream cheese and Belgian chocolate. The dough is tender yet structured, providing the perfect vessel for our artisanal fillings.",
      price: "From $4.25",
      image: pastriesImage,
      rating: 4.8,
      popular: false,
      prepTime: "20 minutes",
      ingredients: ["Laminated pastry dough", "Seasonal fruits", "Cream cheese", "Belgian chocolate", "Vanilla bean", "Fresh berries"],
      nutritional: {
        calories: "320",
        fat: "16g", 
        carbs: "38g",
        protein: "7g"
      },
      variants: [
        { name: "Berry Danish", price: "$4.25" },
        { name: "Cream Cheese", price: "$4.50" },
        { name: "Chocolate", price: "$4.75" }
      ]
    },
    {
      id: "4",
      name: "Artisan Baguettes",
      description: "Crusty French baguettes with an airy interior, perfect for sandwiches or alongside dinner.", 
      fullDescription: "Our traditional French baguettes are made using only four ingredients: flour, water, salt, and yeast. The magic happens in our technique - a long, slow fermentation develops flavor while creating the characteristic open crumb structure. Each baguette is hand-shaped, scored, and baked with steam to achieve that perfect golden crust with maximum crunch.",
      price: "$4.50",
      image: breadImage,
      rating: 4.9,
      popular: true,
      prepTime: "24 hours (slow fermentation)",
      ingredients: ["French bread flour", "Sea salt", "Active dry yeast", "Filtered water"],
      nutritional: {
        calories: "180 per serving",
        fat: "1g",
        carbs: "36g",
        protein: "6g"
      },
      variants: [
        { name: "Traditional", price: "$4.50" },
        { name: "Seeded", price: "$5.00" }
      ]
    }
  ];

  const product = products.find(p => p.id === id);

  // Fetch loyalty configuration for this product
  useEffect(() => {
    if (!id) return;
    
    const fetchLoyaltyConfig = async () => {
      try {
        const { data } = await supabase
          .from('loyalty_points_config')
          .select('*')
          .eq('product_id', id)
          .maybeSingle();
        
        if (data) {
          setLoyaltyConfig({
            pointsPerItem: data.points_per_item,
            bonusThreshold: data.bonus_threshold,
            bonusPoints: data.bonus_points
          });
        }
      } catch (error) {
        console.error('Error fetching loyalty config:', error);
      }
    };

    fetchLoyaltyConfig();
  }, [id]);

  // Set default variant
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    setIsAdding(true);
    const success = await addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      variantName: selectedVariant.name,
      variantPrice: parseFloat(selectedVariant.price.replace('$', '')),
      addOns: selectedAddOns,
      productImage: product.image
    });

    if (success) {
      setSelectedAddOns([]);
    }
    setIsAdding(false);
  };

  const getTotalPrice = () => {
    if (!selectedVariant) return 0;
    const variantPrice = parseFloat(selectedVariant.price.replace('$', ''));
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    return variantPrice + addOnsPrice;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')} variant="hero">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Mobile-optimized header */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border md:hidden">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="p-2 -ml-2 touch-target"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display font-semibold text-lg text-foreground truncate px-4">
              {product.name}
            </h1>
            <Button variant="ghost" size="sm" className="p-2 -mr-2 touch-target">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop back button */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>

        {/* Product Hero Section */}
        <section className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl shadow-warm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.popular && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-primary">
                      {product.price}
                    </div>
                  </div>
                </div>

                {/* Rating and prep time */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-secondary fill-secondary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{product.prepTime}</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

                {/* Variants */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-foreground">
                  Available Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer touch-target ${
                        selectedVariant?.name === variant.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card hover:bg-muted/30'
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {variant.name}
                      </span>
                      <span className="text-primary font-semibold">
                        {variant.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <AddOnsSelector 
                productId={product.id}
                selectedAddOns={selectedAddOns}
                onAddOnsChange={setSelectedAddOns}
              />

              {/* Loyalty Points */}
              {loyaltyConfig && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gift className="h-5 w-5 text-secondary" />
                      Loyalty Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Points per item:</span>
                      <span className="font-semibold text-secondary">
                        {loyaltyConfig.pointsPerItem} points
                      </span>
                    </div>
                    {loyaltyConfig.bonusThreshold && loyaltyConfig.bonusPoints && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Buy {loyaltyConfig.bonusThreshold}+ items:
                        </span>
                        <span className="font-semibold text-secondary">
                          +{loyaltyConfig.bonusPoints} bonus points!
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Price Summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {selectedVariant && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{selectedVariant.name}</span>
                        <span className="font-medium">{selectedVariant.price}</span>
                      </div>
                    )}
                    {selectedAddOns.map((addon, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{addon.name}</span>
                        <span className="font-medium">+${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile-optimized CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  size="lg" 
                  variant="hero" 
                  className="flex-1 touch-target"
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button size="lg" variant="outline" className="sm:w-auto touch-target">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Full Description */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                    About This Product
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {product.fullDescription}
                  </p>
                </div>

                {/* Ingredients */}
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="text-sm py-1 px-3"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Product Reviews */}
                <ProductReviews productId={product.id} productName={product.name} />
              </div>

              {/* Nutritional Info */}
              <div className="space-y-6">
                <div className="bakery-card">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                    Nutritional Information
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(product.nutritional).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-muted-foreground capitalize">
                          {key}
                        </span>
                        <span className="font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Order */}
                <div className="bakery-card">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-4">
                    Quick Order
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Call us directly to place your order for pickup or delivery.
                  </p>
                  <Button variant="outline" className="w-full touch-target">
                    Call (555) 123-BAKE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
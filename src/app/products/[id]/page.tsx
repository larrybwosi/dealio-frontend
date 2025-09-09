'use client'

import { useState, useEffect } from "react";
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
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image'

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<{name: string, price: string} | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<CartAddOn[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<{pointsPerItem: number, bonusThreshold?: number, bonusPoints?: number} | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Mobile header visibility state
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const products = [
    {
      id: "1",
      name: "Artisan Croissants",
      description: "Buttery, flaky croissants baked fresh every morning. Our signature croissants are made with French butter and folded to perfection, creating 81 delicate layers. Each bite delivers a perfect balance of crispy exterior and tender, airy interior.",
      fullDescription: "Our artisan croissants are crafted using traditional French techniques passed down through generations. We start early each morning, carefully laminating the dough with premium European butter to create those iconic flaky layers. Available in classic butter, rich almond with sliced almonds and pastry cream, and decadent chocolate with Belgian dark chocolate.",
      price: "From Ksh 350",
      image: '/bread-shelves.jpg',
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
        { name: "Classic Butter", price: "Ksh 350" },
        { name: "Almond", price: "Ksh 425" },
        { name: "Chocolate", price: "Ksh 400" }
      ]
    },
    {
      id: "2",
      name: "Sourdough Bread",
      description: "Traditional sourdough with a perfect crust and tangy flavor. Made from our 100-year-old starter.",
      fullDescription: "Our sourdough bread is made using our treasured 100-year-old starter, carefully maintained and fed daily. The slow fermentation process develops complex flavors and creates the perfect texture - a golden, crackling crust that gives way to an open, chewy crumb with delightful tang. Each loaf is hand-shaped and baked on stone for authentic results.",
      price: "Ksh 800",
      image: '/pastries-display.jpg',
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
        { name: "Regular Loaf", price: "Ksh 800" },
        { name: "Whole Grain", price: "Ksh 950" }
      ]
    },
    {
      id: "3",
      name: "Danish Pastries",
      description: "Delicate pastries filled with seasonal fruits, cream cheese, or premium chocolate.",
      fullDescription: "Our Danish pastries showcase the art of laminated dough, similar to croissants but with a unique texture and shape. Each pastry is carefully shaped and filled with seasonal ingredients - from fresh berries and stone fruits to rich cream cheese and Belgian chocolate. The dough is tender yet structured, providing the perfect vessel for our artisanal fillings.",
      price: "From Ksh 425",
      image: '/bread-shelves.jpg',
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
        { name: "Berry Danish", price: "Ksh 425" },
        { name: "Cream Cheese", price: "Ksh 450" },
        { name: "Chocolate", price: "Ksh 475" }
      ]
    },
    {
      id: "4",
      name: "Artisan Baguettes",
      description: "Crusty French baguettes with an airy interior, perfect for sandwiches or alongside dinner.",
      fullDescription: "Our traditional French baguettes are made using only four ingredients: flour, water, salt, and yeast. The magic happens in our technique - a long, slow fermentation develops flavor while creating the characteristic open crumb structure. Each baguette is hand-shaped, scored, and baked with steam to achieve that perfect golden crust with maximum crunch.",
      price: "Ksh 450",
      image: '/pastries-display.jpg',
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
        { name: "Traditional", price: "Ksh 450" },
        { name: "Seeded", price: "Ksh 500" }
      ]
    }
  ];

  const product = products.find(p => p.id === id);

  // Scroll detection for mobile header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // Minimum scroll distance before hiding/showing

      // Only apply scroll behavior on mobile
      if (window.innerWidth >= 768) return;

      // Show header when at top
      if (currentScrollY < 50) {
        setShowMobileHeader(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          setShowMobileHeader(false); // Scrolling down
        } else {
          setShowMobileHeader(true); // Scrolling up
        }
        setLastScrollY(currentScrollY);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Throttle function to limit scroll event firing
  function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

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
            pointsPerItem: data.points_per_item!,
            bonusThreshold: data.bonus_threshold!,
            bonusPoints: data.bonus_points!
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

    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const success = await addToCart({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      variantName: selectedVariant.name,
      variantPrice: parseFloat(selectedVariant.price.replace('Ksh ', '').replace('$', '')),
      addOns: selectedAddOns,
      productImage: product.image
    });

    if (success) {
      setSelectedAddOns([]);
      // Additional haptic feedback for success
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
    setIsAdding(false);
  };

  const getTotalPrice = () => {
    if (!selectedVariant) return 0;
    const variantPrice = parseFloat(selectedVariant.price.replace('Ksh ', '').replace('$', ''));
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    return variantPrice + addOnsPrice;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/')} variant="hero">
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
        {/* Mobile-optimized header with auto-hide behavior */}
        <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 md:hidden transition-transform duration-300 ease-in-out ${
          showMobileHeader ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(30);
                router.push('/');
              }}
              className="p-2 -ml-2 min-h-11 min-w-11 rounded-full active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display font-semibold text-lg text-foreground truncate px-4 max-w-[60%]">
              {product.name}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 -mr-2 min-h-11 min-w-11 rounded-full active:scale-95 transition-transform"
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(30);
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Spacer for mobile header */}
        <div className="h-16 md:hidden" />

        {/* Desktop back button */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>

        {/* Product Hero Section */}
        <section className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-4/3 md:aspect-square overflow-hidden rounded-2xl shadow-warm bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                {product.popular && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground shadow-lg">
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-right shrink-0">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
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

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-foreground text-lg">
                  Available Options
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(30);
                        setSelectedVariant(variant);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                        selectedVariant?.name === variant.name
                          ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/50 active:bg-muted/70'
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
                <Card className="border-secondary/20">
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
                      <span className="text-primary">Ksh {getTotalPrice().toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile-optimized CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  size="lg"
                  variant="hero"
                  className="flex-1 min-h-12 active:scale-[0.98] transition-transform shadow-lg"
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="sm:w-auto min-h-12 active:scale-[0.98] transition-transform"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(30);
                  }}
                >
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
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                    About This Product
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
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
                        className="text-sm py-1.5 px-3"
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
                      <div key={key} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
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
                {/*<div className="bakery-card">*/}
                {/*  <h3 className="text-lg font-display font-semibold text-foreground mb-4">*/}
                {/*    Quick Order*/}
                {/*  </h3>*/}
                {/*  <p className="text-muted-foreground text-sm mb-4">*/}
                {/*    Call us directly to place your order for pickup or delivery.*/}
                {/*  </p>*/}
                {/*  <Button*/}
                {/*    variant="outline"*/}
                {/*    className="w-full active:scale-[0.98] transition-transform"*/}
                {/*    onClick={() => {*/}
                {/*      if (navigator.vibrate) navigator.vibrate(30);*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    Call +254 114020977*/}
                {/*  </Button>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
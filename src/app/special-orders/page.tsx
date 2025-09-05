import { useState } from "react";
import { Calendar, ChefHat, Gift, Heart, Star, CheckCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Page = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("custom-cakes");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "",
    deliveryDate: "",
    description: "",
    servingSize: "",
    flavors: "",
    decorations: "",
    budget: "",
    allergies: "",
    inspiration: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Special Order Submitted!",
      description: "We'll review your request and contact you within 48 hours with a detailed quote.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      orderType: "",
      deliveryDate: "",
      description: "",
      servingSize: "",
      flavors: "",
      decorations: "",
      budget: "",
      allergies: "",
      inspiration: "",
    });
    setUploadedFiles([]);
  };

  const specialtyCategories = [
    {
      id: "custom-cakes",
      title: "Custom Cakes",
      description: "Bespoke celebration cakes designed just for you",
      icon: <Gift className="h-6 w-6" />,
      features: ["Multi-tier designs", "Custom flavors", "Detailed decorations", "Theme matching"],
      leadTime: "7-14 days",
      priceRange: "$75-500+"
    },
    {
      id: "wedding-cakes",
      title: "Wedding Cakes",
      description: "Elegant wedding cakes for your special day",
      icon: <Heart className="h-6 w-6" />,
      features: ["Tiered designs", "Fresh flowers", "Cutting ceremony", "Tasting sessions"],
      leadTime: "14-30 days",
      priceRange: "$200-1000+"
    },
    {
      id: "specialty-breads",
      title: "Specialty Breads",
      description: "Artisan breads crafted to your specifications",
      icon: <ChefHat className="h-6 w-6" />,
      features: ["Ancient grains", "Custom shapes", "Special ingredients", "Dietary adaptations"],
      leadTime: "3-7 days",
      priceRange: "$15-75+"
    }
  ];

  const portfolioItems = [
    {
      title: "Three-Tier Wedding Cake",
      description: "Elegant vanilla and raspberry cake with cascading sugar flowers",
      category: "Wedding",
      serves: "120 guests",
    },
    {
      title: "Corporate Logo Cake",
      description: "Custom branded cake for company anniversary celebration",
      category: "Corporate",
      serves: "50 guests",
    },
    {
      title: "Children's Character Cake",
      description: "3D sculpted superhero cake with detailed fondant work",
      category: "Birthday",
      serves: "25 guests",
    },
    {
      title: "Gluten-Free Celebration Cake",
      description: "Delicious chocolate cake with dietary accommodations",
      category: "Special Diet",
      serves: "30 guests",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-hero/20 via-primary/10 to-secondary/15" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-hero/20 text-hero-foreground border-hero/30">
                Custom Creations
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                Bring Your
                <span className="block bg-gradient-to-r from-hero via-primary to-secondary bg-clip-text text-transparent">
                  Sweet Dreams to Life
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                From custom wedding cakes to specialty breads, we craft unique baked goods 
                tailored to your vision and occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-hero hover:bg-hero/90 px-8">
                  Start Your Order
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Our Specialty Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your category to get started with your custom order
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-12 bg-card">
                {specialtyCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {specialtyCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card className="bg-card border-border/50">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                        {category.icon}
                      </div>
                      <CardTitle className="text-2xl font-display">{category.title}</CardTitle>
                      <CardDescription className="text-lg">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                          <Calendar className="h-8 w-8 mx-auto text-primary" />
                          <h4 className="font-semibold">Lead Time</h4>
                          <p className="text-muted-foreground">{category.leadTime}</p>
                        </div>
                        <div className="space-y-2">
                          <Star className="h-8 w-8 mx-auto text-secondary" />
                          <h4 className="font-semibold">Price Range</h4>
                          <p className="text-muted-foreground">{category.priceRange}</p>
                        </div>
                        <div className="space-y-2">
                          <CheckCircle className="h-8 w-8 mx-auto text-hero" />
                          <h4 className="font-semibold">Fully Custom</h4>
                          <p className="text-muted-foreground">Made to order</p>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-6">
                        <h4 className="font-semibold mb-3">What's Included:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {category.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Order Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                  Submit Your Special Order
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tell us about your vision and we'll make it a delicious reality
                </p>
              </div>

              <Card className="bg-card border-border/50 shadow-warm">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="orderType" className="text-sm font-medium text-foreground">
                          Order Type *
                        </label>
                        <Input
                          id="orderType"
                          name="orderType"
                          value={formData.orderType}
                          onChange={handleInputChange}
                          placeholder="Wedding cake, birthday cake, specialty bread, etc."
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="deliveryDate" className="text-sm font-medium text-foreground">
                          Needed By Date *
                        </label>
                        <Input
                          id="deliveryDate"
                          name="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="servingSize" className="text-sm font-medium text-foreground">
                          Serving Size
                        </label>
                        <Input
                          id="servingSize"
                          name="servingSize"
                          value={formData.servingSize}
                          onChange={handleInputChange}
                          placeholder="Number of people to serve"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium text-foreground">
                        Detailed Description *
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your vision in detail - size, shape, theme, colors, occasion, etc."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="flavors" className="text-sm font-medium text-foreground">
                          Preferred Flavors
                        </label>
                        <Input
                          id="flavors"
                          name="flavors"
                          value={formData.flavors}
                          onChange={handleInputChange}
                          placeholder="Vanilla, chocolate, lemon, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="decorations" className="text-sm font-medium text-foreground">
                          Decoration Style
                        </label>
                        <Input
                          id="decorations"
                          name="decorations"
                          value={formData.decorations}
                          onChange={handleInputChange}
                          placeholder="Fondant, buttercream, fresh flowers, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="budget" className="text-sm font-medium text-foreground">
                          Budget Range
                        </label>
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="e.g., $100-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="allergies" className="text-sm font-medium text-foreground">
                          Allergies / Dietary Restrictions
                        </label>
                        <Input
                          id="allergies"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          placeholder="Gluten-free, dairy-free, nut allergies, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="inspiration" className="text-sm font-medium text-foreground">
                        Inspiration & Reference Images
                      </label>
                      <Textarea
                        id="inspiration"
                        name="inspiration"
                        value={formData.inspiration}
                        onChange={handleInputChange}
                        placeholder="Describe any inspiration images or references you have..."
                        rows={3}
                      />
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground">
                        Upload Reference Images (Optional)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Uploaded Files:</p>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-hero hover:bg-hero/90">
                      Submit Special Order Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Our Recent Creations
              </h2>
              <p className="text-lg text-muted-foreground">
                Examples of our custom work to inspire your order
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item, index) => (
                <Card key={index} className="bg-card border-border/50 hover-lift group">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Serves: {item.serves}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Our Process
              </h2>
              <p className="text-lg text-muted-foreground">
                From concept to creation in simple steps
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "Submit Request", desc: "Tell us your vision" },
                  { step: "2", title: "Consultation", desc: "We discuss details & pricing" },
                  { step: "3", title: "Creation", desc: "Our artisans craft your order" },
                  { step: "4", title: "Delivery", desc: "Fresh delivery or pickup" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
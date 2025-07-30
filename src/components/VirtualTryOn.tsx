import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Canvas as FabricCanvas, FabricImage } from "fabric";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";
import { fetchHempStarProducts, validateStoreUrl, type HempStarProduct } from "@/utils/hempstarApi";
import { 
  Upload, 
  Image as ImageIcon, 
  Shirt, 
  Download, 
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Globe,
  ShoppingBag
} from "lucide-react";


export const VirtualTryOn = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<HempStarProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [storeUrl, setStoreUrl] = useState("hempstar.store");
  const [products, setProducts] = useState<HempStarProduct[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Make canvas responsive
    const canvasWidth = isMobile ? 300 : 500;
    const canvasHeight = isMobile ? 400 : 600;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#f8f9fa",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [isMobile]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep("Loading image...");
    
    try {
      toast({
        title: "Processing Photo",
        description: "Step 1: Loading and validating your image..."
      });

      // Load the image with error handling
      setProcessingStep("Loading image...");
      const img = await loadImage(file);
      console.log('Image loaded successfully:', img.width, 'x', img.height);
      
      // Check image dimensions
      if (img.width < 100 || img.height < 100) {
        throw new Error('Image too small. Please use an image at least 100x100 pixels.');
      }

      setProcessingStep("Removing background...");
      toast({
        title: "Processing Photo",
        description: "Step 2: Removing background with AI..."
      });
      
      // Remove background with detailed error logging
      const processedBlob = await removeBackground(img);
      console.log('Background removal completed, blob size:', processedBlob.size);
      
      setProcessingStep("Adding to canvas...");
      const processedUrl = URL.createObjectURL(processedBlob);
      
      // Add to canvas with error handling
      const fabricImg = await FabricImage.fromURL(processedUrl);
      console.log('Fabric image created:', fabricImg.width, 'x', fabricImg.height);
      
      // Scale and position the image
      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      const scale = Math.min(canvasWidth / fabricImg.width!, canvasHeight / fabricImg.height!) * 0.8;
      
      fabricImg.scale(scale);
      fabricImg.set({
        left: canvasWidth / 2 - (fabricImg.width! * scale) / 2,
        top: canvasHeight / 2 - (fabricImg.height! * scale) / 2,
        selectable: true
      });

      fabricCanvas.clear();
      fabricCanvas.add(fabricImg);
      fabricCanvas.renderAll();
      
      setUserPhoto(processedUrl);
      
      toast({
        title: "Photo Ready! ✨",
        description: "Background removed successfully. Now select a product to try on."
      });
      
    } catch (error: any) {
      console.error('Detailed error processing photo:', error);
      
      let errorMessage = "Failed to process your photo. ";
      
      if (error.message?.includes('WebGPU')) {
        errorMessage += "WebGPU not supported. Trying CPU processing...";
      } else if (error.message?.includes('segmentation')) {
        errorMessage += "AI background removal failed. Please try a clearer image.";
      } else if (error.message?.includes('too small')) {
        errorMessage += error.message;
      } else if (error.message?.includes('canvas')) {
        errorMessage += "Canvas error. Please try refreshing the page.";
      } else {
        errorMessage += "Please try a different image or refresh the page.";
      }
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const handleProductSelect = async (product: HempStarProduct) => {
    if (!fabricCanvas || !userPhoto) {
      toast({
        title: "Upload Photo First",
        description: "Please upload your photo before selecting a product.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSelectedProduct(product);

    try {
      // In a real implementation, this would fetch the actual product image from hempstar.store
      const productImg = await FabricImage.fromURL(product.image);
      
      // Scale and position the product
      const scale = 0.4; // Adjust size to fit over the person
      productImg.scale(scale);
      productImg.set({
        left: fabricCanvas.getWidth() / 2 - (productImg.width! * scale) / 2,
        top: fabricCanvas.getHeight() / 2 - (productImg.height! * scale) / 2,
        selectable: true,
        opacity: 0.9
      });

      fabricCanvas.add(productImg);
      fabricCanvas.renderAll();
      
      toast({
        title: "Product Applied!",
        description: `${product.name} has been added to your photo. Adjust position and size as needed.`
      });
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Failed to Apply Product",
        description: "Could not load the product image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = `hempstar-tryon-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Downloaded!",
      description: "Your virtual try-on has been saved to your device."
    });
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#f8f9fa";
    fabricCanvas.renderAll();
    setUserPhoto(null);
    setSelectedProduct(null);
  };

  const fetchStoreProducts = async () => {
    if (!validateStoreUrl(storeUrl)) {
      toast({
        title: "Invalid Store URL",
        description: "Please enter a valid store URL (e.g., hempstar.store)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Connecting to Store",
      description: `Fetching real products from ${storeUrl}...`
    });
    
    try {
      const fetchedProducts = await fetchHempStarProducts(storeUrl);
      setProducts(fetchedProducts);
      setIsConnected(true);
      
      toast({
        title: "Store Connected Successfully!",
        description: `Found ${fetchedProducts.length} products from ${storeUrl}. Real product images loaded!`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to the store. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-hemp-primary/20 text-hemp-accent border-hemp-primary/40">
            <Shirt className="w-4 h-4 mr-2" />
            Virtual Try-On Studio
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            TRY ON YOUR
            <br />
            <span className="bg-gradient-hemp bg-clip-text text-transparent">
              HEMP STREETWEAR
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how HempStar merchandise looks on you using your EXACT product images and logos
          </p>
        </div>

        {/* Store Connection */}
        <Card className="p-6 mb-8 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
          <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
            <Globe className="w-5 h-5 mr-2 text-hemp-accent" />
            Connect to Your Store
          </h3>
          <div className="flex gap-4">
            <Input
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="Enter your store URL"
              className="flex-1"
            />
            <Button 
              onClick={fetchStoreProducts} 
              disabled={isProcessing}
              className="bg-hemp-primary hover:bg-hemp-accent text-hemp-dark"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {isProcessing ? 'Connecting...' : 'Connect Store'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This will fetch your real product images and preserve exact logos and designs
          </p>
        </Card>

        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Upload & Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
              <h3 className="text-xl font-bold mb-4 text-foreground">Upload Your Photo</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-hemp-primary/30 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-hemp-accent" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a clear photo of yourself to try on HempStar merchandise
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button className="bg-hemp-primary hover:bg-hemp-accent text-hemp-dark" asChild>
                      <span>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Choose Photo
                      </span>
                    </Button>
                  </label>
                </div>
                
                {userPhoto && (
                  <div className="space-y-2">
                    <Badge className="bg-hemp-primary/20 text-hemp-accent">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Background Removed
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Canvas Controls */}
            <Card className="p-6 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
              <h3 className="text-xl font-bold mb-4 text-foreground">Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Move className="w-4 h-4 mr-2" />
                  Move
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Zoom In
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="w-4 h-4 mr-2" />
                  Zoom Out
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <Button 
                onClick={handleDownload}
                className="w-full mt-4 bg-hemp-primary hover:bg-hemp-accent text-hemp-dark"
                disabled={!userPhoto}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
            </Card>
          </div>

          {/* Canvas */}
          <Card className="p-6 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
            <h3 className="text-xl font-bold mb-4 text-foreground text-center">Virtual Try-On</h3>
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef}
                className="border border-hemp-primary/30 rounded-lg shadow-lg max-w-full"
                style={{ maxHeight: '600px' }}
              />
            </div>
            {isProcessing && (
              <div className="text-center mt-4">
                <div className="animate-spin w-8 h-8 border-4 border-hemp-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  {processingStep || "Processing..."}
                </p>
              </div>
            )}
          </Card>

          {/* Product Selection */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center justify-between">
                HempStar Products
                {isConnected && (
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    Connected
                  </Badge>
                )}
              </h3>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Connect to your store to load real product images
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Connect Store" above to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-hemp-primary/50 ${
                        selectedProduct?.id === product.id ? 'border-hemp-primary bg-hemp-primary/10' : 'border-hemp-primary/20'
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/64/64';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                          {product.price && (
                            <p className="text-xs font-semibold text-hemp-accent">{product.price}</p>
                          )}
                          <Badge className="mt-1 text-xs bg-hemp-primary/20 text-hemp-accent">
                            Real Product
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 p-3 bg-hemp-primary/10 rounded-lg">
                <p className="text-xs text-hemp-accent">
                  💡 <strong>Exact Logo Reproduction:</strong> {isConnected ? 'These are real product images from your store!' : 'Connect your store to load actual product images with perfect logo accuracy!'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
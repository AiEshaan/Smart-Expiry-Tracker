import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Calendar, ChevronDown, Bell, BellRing, Package, Lightbulb, X, RefreshCw, Circle, AlertTriangle, AlertCircle, CheckCircle, Upload, Image as ImageIcon, ScanBarcode, QrCode } from 'lucide-react';
import { Product, Category } from '../types';
import { formatISO } from 'date-fns';
import { cn } from '../lib/utils';
import { Html5Qrcode } from 'html5-qrcode';

interface AddItemProps {
  onAdd: (product: Product) => void;
}

export default function AddItem({ onAdd }: AddItemProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [reminderDays, setReminderDays] = useState(1);
  const [quantityAmount, setQuantityAmount] = useState('1');
  const [quantityUnit, setQuantityUnit] = useState('pieces');
  const [barcode, setBarcode] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop();
      }
    };
  }, [stream]);

  const startBarcodeScanner = async () => {
    setIsBarcodeScannerOpen(true);
    setCameraError(null);
    
    // Wait for the container to be in DOM
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("barcode-scanner-container");
        qrScannerRef.current = scanner;
        
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 }
          },
          (decodedText) => {
            setBarcode(decodedText);
            stopBarcodeScanner();
          },
          () => {
            // Error callback - ignore to keep scanning
          }
        );
      } catch (err: any) {
        console.error("Error starting barcode scanner:", err);
        setCameraError("Could not start barcode scanner. Please check permissions.");
      }
    }, 100);
  };

  const stopBarcodeScanner = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      await qrScannerRef.current.stop();
    }
    setIsBarcodeScannerOpen(false);
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      let message = "Could not access camera.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission dismissed')) {
        message = "Camera permission was denied or dismissed. Please allow camera access in your browser settings and try again.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = "No camera device found on this device.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = "Camera is already in use by another application.";
      }
      setCameraError(message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setImagePreview(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
  };

  const getStatus = (dateStr: string): 'critical' | 'warning' | 'safe' => {
    if (!dateStr) return 'safe';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'critical';
    if (diffDays <= 3) return 'warning';
    return 'safe';
  };

  const CATEGORY_DURATIONS: Record<Category, number> = {
    'Produce': 7,
    'Dairy': 10,
    'Meat': 3,
    'Bakery': 5,
    'Pantry': 180,
    'Frozen': 90
  };

  const suggestExpiry = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setExpiryDate(date.toISOString().split('T')[0]);
  };

  // Automatically suggest when name is first entered or category changes
  useEffect(() => {
    if (name.length > 0 && !expiryDate) {
      suggestExpiry(CATEGORY_DURATIONS[category] || 7);
    }
  }, [name, category]);

  const status = getStatus(expiryDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate) return;

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      category,
      quantity: `${quantityAmount} ${quantityUnit}`,
      expiryDate: formatISO(new Date(expiryDate)),
      reminderDays,
      status: getStatus(expiryDate),
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200',
      barcode: barcode || undefined,
    };

    onAdd(newProduct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      {/* Barcode Scanner Modal */}
      {isBarcodeScannerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ScanBarcode className="text-primary w-6 h-6" />
                <h3 className="text-xl font-bold">Scan Barcode</h3>
              </div>
              <button 
                onClick={stopBarcodeScanner}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div id="barcode-scanner-container" className="w-full aspect-video rounded-xl overflow-hidden bg-black" />
              <p className="mt-4 text-center text-sm text-on-surface-variant font-medium">
                Position the barcode within the frame to scan automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Add New Item</h1>
        <p className="text-on-surface-variant text-sm font-medium">Keep your inventory fresh and reduce waste.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Camera Capture Area */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative group h-64 w-full rounded-xl overflow-hidden bg-surface-container-low border-2 border-dashed flex flex-col items-center justify-center transition-all",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-outline-variant/30"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          {isCameraOpen ? (
            <div className="absolute inset-0 w-full h-full bg-black flex flex-col items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                <button 
                  type="button"
                  onClick={stopCamera}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  type="button"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-lg active:scale-90 transition-transform"
                >
                  <Circle className="w-10 h-10 fill-current" />
                </button>
              </div>
            </div>
          ) : cameraError ? (
            <div className="absolute inset-0 w-full h-full bg-surface-container-high flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-12 h-12 text-tertiary mb-4" />
              <p className="text-sm font-bold text-on-surface mb-2">Camera Access Failed</p>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed max-w-[280px]">{cameraError}</p>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={startCamera}
                  className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all"
                >
                  Try Again
                </button>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-surface-container-highest text-on-surface px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all"
                >
                  Upload Instead
                </button>
              </div>
            </div>
          ) : imagePreview ? (
            <div className="absolute inset-0 w-full h-full">
              <img 
                className="w-full h-full object-cover" 
                src={imagePreview}
                alt="Captured"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={startCamera}
                  className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-on-surface flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </button>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-on-surface flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Replace
                </button>
              </div>
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:bg-white transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-500">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
                  alt="Fresh produce"
                />
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center bg-surface-container-lowest/80 backdrop-blur-md px-8 py-6 rounded-2xl shadow-sm border border-outline-variant/20">
                  {isDragging ? (
                    <>
                      <ImageIcon className="text-primary w-10 h-10 mb-3 animate-bounce" />
                      <span className="text-sm font-bold text-primary">Drop to Upload</span>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-6 mb-4">
                        <button 
                          type="button"
                          onClick={startCamera}
                          className="flex flex-col items-center gap-2 group/btn"
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-on-primary transition-all">
                            <Camera className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-on-surface">Camera</span>
                        </button>
                        <div className="w-[1px] h-12 bg-outline-variant/30 self-center" />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-2 group/btn"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover/btn:bg-secondary group-hover/btn:text-on-secondary transition-all">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-on-surface">Upload</span>
                        </button>
                        <div className="w-[1px] h-12 bg-outline-variant/30 self-center" />
                        <button 
                          type="button"
                          onClick={startBarcodeScanner}
                          className="flex flex-col items-center gap-2 group/btn"
                        >
                          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover/btn:bg-tertiary group-hover/btn:text-on-tertiary transition-all">
                            <ScanBarcode className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-on-surface">Scan</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">or drag and drop image here</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 bg-surface-container-low p-5 rounded-xl">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-lg font-medium p-0 pb-1 transition-all"
              placeholder="e.g. Organic Baby Spinach"
            />
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-base font-medium p-0 pb-1 appearance-none cursor-pointer"
              >
                <option value="Produce">🍎 Produce</option>
                <option value="Dairy">🥛 Dairy</option>
                <option value="Meat">🥩 Meat & Poultry</option>
                <option value="Bakery">🥖 Bakery</option>
                <option value="Pantry">🥫 Pantry</option>
                <option value="Frozen">❄️ Frozen</option>
              </select>
              <ChevronDown className="absolute right-0 bottom-1 text-on-surface-variant pointer-events-none w-5 h-5" />
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</label>
              {expiryDate && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter transition-colors",
                  status === 'critical' ? "bg-tertiary-container text-on-tertiary-container" :
                  status === 'warning' ? "bg-secondary-container text-on-secondary-container" :
                  "bg-primary-container/20 text-on-primary-fixed-variant"
                )}>
                  {status === 'critical' ? <AlertCircle className="w-3 h-3" /> : 
                   status === 'warning' ? <AlertTriangle className="w-3 h-3" /> : 
                   <CheckCircle className="w-3 h-3" />}
                  {status === 'critical' ? 'Critical' : status === 'warning' ? 'Warning' : 'Safe'}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-base font-medium p-0 pb-1 cursor-pointer"
              />
              <Calendar className="absolute right-0 bottom-1 text-on-surface-variant pointer-events-none w-5 h-5" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[3, 7, 14, 30].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => suggestExpiry(days)}
                  className="px-3 py-1 rounded-full bg-surface-container-highest text-[10px] font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  +{days} Days
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Quantity</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={quantityAmount}
                onChange={(e) => setQuantityAmount(e.target.value)}
                className="w-1/2 bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-base font-medium p-0 pb-1 transition-all"
                placeholder="Amount"
                min="0"
                step="any"
              />
              <div className="relative w-1/2">
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-base font-medium p-0 pb-1 appearance-none cursor-pointer"
                >
                  <option value="pieces">pieces</option>
                  <option value="grams">grams (g)</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="liters">liters (L)</option>
                  <option value="packs">packs</option>
                  <option value="units">units</option>
                </select>
                <ChevronDown className="absolute right-0 bottom-1 text-on-surface-variant pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Barcode (Optional)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 text-base font-medium p-0 pb-1 pr-8 transition-all"
                  placeholder="Scan or enter barcode"
                />
                {barcode ? (
                  <button 
                    type="button"
                    onClick={() => setBarcode('')}
                    className="absolute right-6 bottom-1 text-on-surface-variant hover:text-tertiary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <QrCode className="absolute right-0 bottom-1 text-on-surface-variant pointer-events-none w-5 h-5" />
                )}
              </div>
              <button
                type="button"
                onClick={startBarcodeScanner}
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
                title="Scan Barcode"
              >
                <ScanBarcode className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2 bg-surface-container-low p-5 rounded-xl">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 px-1">Reminder Lead Time</label>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setReminderDays(1)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  reminderDays === 1 
                    ? "bg-surface-container-lowest border-2 border-primary text-primary" 
                    : "bg-surface-container-highest/50 border-2 border-transparent text-on-surface-variant"
                }`}
              >
                <BellRing className="w-4 h-4" />
                1 day before
              </button>
              <button
                type="button"
                onClick={() => setReminderDays(3)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  reminderDays === 3 
                    ? "bg-surface-container-lowest border-2 border-primary text-primary" 
                    : "bg-surface-container-highest/50 border-2 border-transparent text-on-surface-variant"
                }`}
              >
                <Bell className="w-4 h-4" />
                3 days before
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-5 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 mt-8"
        >
          <Package className="w-6 h-6 fill-current" />
          Add to Inventory
        </button>
      </form>

      <div className="mt-8 mb-12 p-6 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex gap-4 items-start">
        <Lightbulb className="text-primary w-6 h-6 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-primary-container uppercase tracking-tight">Pro Tip</p>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-1">Taking a clear photo of the barcode or expiry date label can help us automatically suggest the best category and duration for your item.</p>
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import { useState } from 'react';
import { 
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Image,
  Lock,
  Bell,
  User,
  Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsComp() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // Form state (In a real app, you would fetch this from an API)
  const [storeSettings, setStoreSettings] = useState({
    // General Settings
    storeName: 'PineShop',
    storeEmail: 'info@pineshop.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Fashion Street, New York, NY 10001',
    storeDescription: 'PineShop is a premium streetwear and casual fashion store offering the latest trends in urban fashion.',
    
    // Payment Settings
    currency: 'MNT',
    acceptCreditCard: true,
    acceptPayPal: true,
    acceptCash: true,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    productNotifications: false,
    customerNotifications: true,
    
    // Account Settings
    adminName: 'Admin User',
    adminEmail: 'admin@pineshop.com',
    adminLanguage: 'en',
    twoFactorEnabled: false,
    
    // Social Media
    facebook: 'https://facebook.com/pineshop',
    instagram: 'https://instagram.com/pineshop',
    twitter: '',
  });
  
  // Currency options
  const currencies = [
    { value: 'MNT', label: 'Mongolian Tugrik (₮)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
  ];
  
  // Language options
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'mn', label: 'Mongolian' },
  ];
  
  // Handle form field changes
  const handleChange = (field:any, value:any) => {
    setStoreSettings({
      ...storeSettings,
      [field]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    // In a real app, you would save the settings to the server
    console.log('Saving settings:', storeSettings);
    setSaveDialogOpen(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettingsSaved(true);
      setTimeout(() => {
        setSaveDialogOpen(false);
        setSettingsSaved(false);
      }, 1500);
    }, 1000);
  };
  
  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Тохиргоо</h1>
          <p className="text-gray-500">Дэлгүүрийн тохиргоо, тохируулгыг удирдах.</p>
        </div>
        <Button type="submit" form="settings-form">
          <Save className="mr-2 h-4 w-4" />
          Өөрчлөлтийг хадгалах
        </Button>
      </div>

      {/* Settings tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Ерөнхий</TabsTrigger>
          <TabsTrigger value="payment">Төлбөр</TabsTrigger>
          <TabsTrigger value="notifications">Мэдэгдэл</TabsTrigger>
          <TabsTrigger value="account">Хэрэглэгч</TabsTrigger>
        </TabsList>
        
        <form id="settings-form" onSubmit={handleSubmit}>
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Дэлгүүрийн мэдээлэл</CardTitle>
                <CardDescription>
                Хэрэглэгчдэд үзүүлэх дэлгүүрийнхээ талаарх үндсэн мэдээлэл
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Дэлгүүр нэр</Label>
                    <div className="flex items-center">
                      <Store className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="store-name" 
                        value={storeSettings.storeName}
                        onChange={(e) => handleChange('storeName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Дэлгүүр имэйл</Label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="store-email" 
                        type="email"
                        value={storeSettings.storeEmail}
                        onChange={(e) => handleChange('storeEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Дэлгүүр утас</Label>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="store-phone" 
                        value={storeSettings.storePhone}
                        onChange={(e) => handleChange('storePhone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-address">Дэлгүүр хаяг</Label>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="store-address" 
                        value={storeSettings.storeAddress}
                        onChange={(e) => handleChange('storeAddress', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Дэлгүүр нэмэлт мэдээлэл</Label>
                    <Textarea 
                      id="store-description" 
                      rows={4}
                      value={storeSettings.storeDescription}
                      onChange={(e) => handleChange('storeDescription', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Сошиал хаягууд</CardTitle>
                <CardDescription>
                  Дэлгүүрийн сошиал хаягууд.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="facebook" 
                        value={storeSettings.facebook}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourstore"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="instagram" 
                        value={storeSettings.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourstore"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="twitter" 
                        value={storeSettings.twitter}
                        onChange={(e) => handleChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourstore"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Settings Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Төлбөрийн тохиргоо</CardTitle>
                <CardDescription>
                Үйлчлүүлэгчид захиалгаа хэрхэн төлөхийг тохируулна уу.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Валют</Label>
                  <Select 
                    value={storeSettings.currency}
                    onValueChange={(value) => handleChange('currency', value)}
                  >
                    <SelectTrigger className="w-full">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <Label htmlFor="credit-card">Credit Card</Label>
                        <p className="text-sm text-gray-500">Accept Visa, Mastercard, and American Express</p>
                      </div>
                      <Switch 
                        id="credit-card" 
                        checked={storeSettings.acceptCreditCard}
                        onCheckedChange={(checked) => handleChange('acceptCreditCard', checked)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <Label htmlFor="paypal">PayPal</Label>
                        <p className="text-sm text-gray-500">Accept payments via PayPal</p>
                      </div>
                      <Switch 
                        id="paypal" 
                        checked={storeSettings.acceptPayPal}
                        onCheckedChange={(checked) => handleChange('acceptPayPal', checked)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <Label htmlFor="cash">Cash on Delivery</Label>
                        <p className="text-sm text-gray-500">Allow customers to pay when they receive the order</p>
                      </div>
                      <Switch 
                        id="cash" 
                        checked={storeSettings.acceptCash}
                        onCheckedChange={(checked) => handleChange('acceptCash', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Мэдэгдлийн тохиргоо</CardTitle>
                <CardDescription>
                Мэдэгдлийг хэзээ, хэрхэн хүлээн авахыг тохируулна уу.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Имэйлээр мэдэгдэл авах</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={storeSettings.emailNotifications}
                      onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Мэдэгдлийн төрлүүд</h3>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-notifications">Order Notifications</Label>
                      <p className="text-sm text-gray-500">Шинэ захиалга хийгдсэн үед мэдэгдэл авах</p>
                    </div>
                    <Switch 
                      id="order-notifications" 
                      checked={storeSettings.orderNotifications}
                      onCheckedChange={(checked) => handleChange('orderNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-notifications">Product Notifications</Label>
                      <p className="text-sm text-gray-500">Бараа дуусах дөхсөн үед мэдэгдэл авах</p>
                    </div>
                    <Switch 
                      id="product-notifications" 
                      checked={storeSettings.productNotifications}
                      onCheckedChange={(checked) => handleChange('productNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="customer-notifications">Customer Notifications</Label>
                      <p className="text-sm text-gray-500">Шинэ хэрэглэгч бүртгүүлсэн үед мэдэгдэл авах</p>
                    </div>
                    <Switch 
                      id="customer-notifications" 
                      checked={storeSettings.customerNotifications}
                      onCheckedChange={(checked) => handleChange('customerNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Аккаунт тохиргоо</CardTitle>
                <CardDescription>
                  Админ аккаунт-ийн мэдээлэл, нууц үг солих
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Нэр</Label>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="admin-name" 
                        value={storeSettings.adminName}
                        onChange={(e) => handleChange('adminName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Имэйл</Label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <Input 
                        id="admin-email" 
                        type="email"
                        value={storeSettings.adminEmail}
                        onChange={(e) => handleChange('adminEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-language">Хэл</Label>
                    <Select 
                      value={storeSettings.adminLanguage}
                      onValueChange={(value) => handleChange('adminLanguage', value)}
                    >
                      <SelectTrigger className="w-full">
                        <Globe className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Аюулгүй байдал</h3>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">2 шатлалт хамгаалалт</Label>
                      <p className="text-sm text-gray-500">Өөрийн бүртгэлд нэмэлт хамгаалалтын давхарга нэмнэ үү.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="two-factor" 
                        checked={storeSettings.twoFactorEnabled}
                        onCheckedChange={(checked) => handleChange('twoFactorEnabled', checked)}
                      />
                      {storeSettings.twoFactorEnabled ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Enabled</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Disabled</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Нууц үг солих
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
      
      {/* Save Changes Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{settingsSaved ? 'Settings Saved' : 'Saving Settings'}</DialogTitle>
            <DialogDescription>
              {settingsSaved 
                ? 'Your settings have been successfully saved.' 
                : 'Please wait while we save your settings...'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            {settingsSaved ? (
              <div className="rounded-full bg-green-100 p-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
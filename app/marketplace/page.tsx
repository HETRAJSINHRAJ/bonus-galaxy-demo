'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Store, Tag, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VoucherOffer {
  id: string;
  title: string;
  description: string;
  priceInPoints: number;
  originalPrice?: number;
  discountPercent?: number;
  category?: string;
  imageUrl?: string;
  isFeatured: boolean;
  soldCount: number;
  redeemedCount: number;
  shop: {
    id: string;
    name: string;
    logo?: string;
    address?: string;
  };
}

export default function MarketplacePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [offers, setOffers] = useState<VoucherOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, [selectedCategory]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/offers?${params}`);
      const data = await response.json();
      setOffers(data.offers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (offerId: string) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    setPurchasing(offerId);
    try {
      const response = await fetch(`/api/offers/${offerId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Voucher purchased successfully! Check your vouchers page.');
        router.push('/vouchers');
      } else {
        alert(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const categories = ['all', 'food', 'drink', 'service', 'entertainment'];

  const featuredOffers = offers.filter(o => o.isFeatured);
  const regularOffers = offers.filter(o => !o.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Voucher Marketplace</h1>
          <p className="text-white/60">Discover amazing deals from our partner shops</p>
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="bg-white/10">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">Loading offers...</p>
          </div>
        ) : (
          <>
            {/* Featured Offers */}
            {featuredOffers.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Offers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredOffers.map(offer => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onPurchase={handlePurchase}
                      purchasing={purchasing === offer.id}
                      featured
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Offers */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">All Offers</h2>
              {regularOffers.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="py-12 text-center">
                    <Store className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No offers available in this category</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularOffers.map(offer => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onPurchase={handlePurchase}
                      purchasing={purchasing === offer.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OfferCard({
  offer,
  onPurchase,
  purchasing,
  featured = false,
}: {
  offer: VoucherOffer;
  onPurchase: (id: string) => void;
  purchasing: boolean;
  featured?: boolean;
}) {
  return (
    <Card className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      <CardHeader>
        {featured && (
          <Badge className="w-fit mb-2 bg-yellow-400 text-black">Featured</Badge>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-white">{offer.title}</CardTitle>
            <CardDescription className="text-white/60 flex items-center gap-2 mt-1">
              <Store className="h-4 w-4" />
              {offer.shop.name}
            </CardDescription>
          </div>
          {offer.shop.logo && (
            <img src={offer.shop.logo} alt={offer.shop.name} className="h-12 w-12 rounded-lg object-cover" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-white/80 text-sm mb-4 line-clamp-2">{offer.description}</p>

        <div className="flex items-center gap-2 mb-4">
          {offer.category && (
            <Badge variant="outline" className="border-white/20 text-white/80">
              <Tag className="h-3 w-3 mr-1" />
              {offer.category}
            </Badge>
          )}
          {offer.discountPercent && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {offer.discountPercent}% OFF
            </Badge>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-cyan-400">{offer.priceInPoints}</span>
          <span className="text-white/60">points</span>
          {offer.originalPrice && (
            <span className="text-white/40 line-through ml-2">€{offer.originalPrice}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
          <span>{offer.soldCount} sold</span>
          <span>•</span>
          <span>{offer.redeemedCount} redeemed</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onPurchase(offer.id)}
          disabled={purchasing}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {purchasing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Purchasing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Purchase
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

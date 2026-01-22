"use client"

import { VoucherCard } from './voucher-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Bundle = {
  id: string;
  name: string;
  description: string;
  voucherCount: number;
  price: number;
  value: number;
  features: string[];
  pointsCost?: number;
  paymentMethod: 'cash' | 'points' | 'both';
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

interface VoucherCarouselProps {
  bundles: Bundle[];
  userPoints: number;
}

export function VoucherCarousel({ bundles, userPoints }: VoucherCarouselProps) {
  return (
    <div className="relative px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch">
          {bundles.map((bundle) => (
            <CarouselItem key={bundle.id} className="md:basis-1/2 lg:basis-1/3 pl-4 pt-4 pb-2">
              <div className="h-full">
                <VoucherCard bundle={bundle} userPoints={userPoints} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  );
}

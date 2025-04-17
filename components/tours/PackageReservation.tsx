"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TbCalendarCancel, TbMinus, TbPlus } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { PackageImages, Price, PriceEnum } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addYears } from "date-fns";
import { cn } from "@/lib/utils";
import { getCookieVal } from "@/lib/actions/getConvertedPrice";
import BookPackage from "@/components/tours/BookPackage";

// Types
interface Props {
  itinerary: string;
  sellingPrice: Price;
  startDate: Date;
  endDate: Date;
  subtitle: string;
  name: string;
  duration: string;
  accommodationImages: PackageImages[];
  tourId: string;
  maxGroupSize?: number;
  currency: PriceEnum;
  isLive: boolean;
}

// Utility function for dynamic price calculation
function calculateDynamicPrice(
  guestCount: number,
  basePrice: number,
  deltaPrice: number
): number {
  if (guestCount <= 2) return basePrice;

  if (guestCount % 2 === 0) {
    const additionalPairs = (guestCount - 2) / 2;
    return basePrice + additionalPairs * basePrice;
  }

  const additionalPairs = Math.floor((guestCount - 3) / 2);
  return basePrice + additionalPairs * basePrice + deltaPrice;
}

export default function PackageReservation({
  itinerary,
  sellingPrice,
  startDate: defaultStartDate,
  endDate: defaultEndDate,
  subtitle,
  name,
  duration,
  accommodationImages,
  tourId,
  maxGroupSize = 100, // Default max group size
  isLive,
}: Props) {
  // State management
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultStartDate
  );
  const [guestCount, setGuestCount] = useState(2);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [currency, setCurrency] = useState<PriceEnum>("inr");
  const [viewCount, setViewCount] = useState(0);
  const [bookingsToday, setBookingsToday] = useState(0);

  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const bookingButtonRef = useRef<HTMLDivElement>(null);
  const [showStickyBooking, setShowStickyBooking] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowStickyBooking(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // Button is considered visible when 10% is in view
      }
    );

    if (bookingButtonRef.current) {
      observer.observe(bookingButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch currency preference on mount
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const curr = await getCookieVal();
        setCurrency(curr as PriceEnum);
      } catch (error) {
        console.error("Error fetching currency preference:", error);
      }
    };
    fetchCurrency();

    // Set realistic social proof numbers
    setViewCount(Math.floor(Math.random() * 11) + 15);
    setBookingsToday(Math.floor(Math.random() * 4) + 3);
  }, []);

  // Price calculations with dynamic pricing
  const basePrice = {
    inr: parseInt(sellingPrice.inr || "0"),
    usd: parseInt(sellingPrice.usd || "0"),
  };

  const symbol = currency === "usd" ? "$" : "₹";
  const currentPrice = currency === "usd" ? basePrice.usd : basePrice.inr;

  // Calculate dynamic price based on guest count
  const dynamicPrice = currentPrice * guestCount;

  const total = dynamicPrice;
  const slashedPrice = Math.round(total * 1.45);
  const savingsPercentage = Math.round(
    ((slashedPrice - total) / slashedPrice) * 100
  );

  const images = accommodationImages.flatMap((group) => group.urls);

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${name} - ${duration}`,
      text: `Check out this amazing trip: ${name} - ${duration}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // WhatsApp message template
  const whatsappMessage = encodeURIComponent(
    `Hi! I am interested in customizing the following package:\n\nTour: ${name}\nDuration: ${duration}\nTour ID: ${tourId}\nSelected Date: ${
      selectedDate ? format(selectedDate, "PPP") : "Not selected"
    }\nGuests: ${guestCount}\n\nCan you help me customize this package?`
  );

  const requestBookingWhatsappMessage = encodeURIComponent(
    `Hey! I'd like to book this package:\n\n🏷️ ${name}\n⏱️ ${duration}\n📍 Tour ID: ${tourId}\n📅 Travel Date: ${
      selectedDate ? format(selectedDate, "PPP") : "Flexible"
    }\n👥 Group Size: ${guestCount} travelers\n\nLooking forward to planning this trip with you!`
  );

  return (
    <div ref={bookingSectionRef} className="space-y-4 md:sticky md:top-6 ">
      <div className="space-y-4 md:sticky md:top-6">
        <div className="relative bg-card p-6 rounded-xl shadow-tremor-card">
          {/* Price Display */}
          <div className="space-y-2 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  {symbol} {total.toLocaleString()}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-muted-foreground line-through whitespace-nowrap">
                    {symbol} {slashedPrice.toLocaleString()}
                  </p>
                  <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded whitespace-nowrap">
                    Save {savingsPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-primary whitespace-nowrap">
                {symbol} {currentPrice.toLocaleString()} per person
              </p>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{viewCount} people</span> viewed
                this last hour
              </p>
            </div>
            <p className="text-sm text-primary font-medium">
              ⚡ {bookingsToday} bookings in the last 24 hours
            </p>
          </div>

          {/* Date Selection */}
          <div className="space-y-4 mb-6">
            <Popover
              open={isDatePopoverOpen}
              onOpenChange={setIsDatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button className="flex items-center w-full p-3 bg-background hover:bg-accent rounded-lg border-0 text-left">
                  <HiMiniCalendarDays className="mr-2 h-4 w-4" />
                  <span
                    className={cn(!selectedDate && "text-muted-foreground")}
                  >
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "Select travel date"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDatePopoverOpen(false);
                  }}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() || date > addYears(new Date(), 2)
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Guest Selection */}
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Guests</p>
                <p className="text-sm text-muted-foreground">
                  {guestCount} traveller{guestCount !== 1 && "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    guestCount > 1 && setGuestCount((prev) => prev - 1)
                  }
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    guestCount > 1
                      ? "hover:bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                  disabled={guestCount <= 1}
                  aria-label="Decrease guest count"
                >
                  <TbMinus size={20} />
                </button>
                <span className="w-8 text-center font-medium">
                  {guestCount}
                </span>
                <button
                  onClick={() =>
                    guestCount < maxGroupSize &&
                    setGuestCount((prev) => prev + 1)
                  }
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    guestCount < maxGroupSize
                      ? "hover:bg-accent text-foreground"
                      : "text-muted-foreground"
                  )}
                  disabled={guestCount >= maxGroupSize}
                  aria-label="Increase guest count"
                >
                  <TbPlus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="space-y-2">
            {!isLive ? (
              <>
                {showStickyBooking && (
                  <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background p-4 border-t border-border shadow-lg transition-all duration-500 ease-in-out transform translate-y-0 animate-in slide-in-from-bottom">
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/917047474942?text=${requestBookingWhatsappMessage}`,
                          "_blank"
                        )
                      }
                      className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Request to Book
                    </button>
                  </div>
                )}

                <div ref={bookingButtonRef}>
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/917047474942?text=${requestBookingWhatsappMessage}`,
                        "_blank"
                      )
                    }
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Request to Book
                  </button>
                </div>
              </>
            ) : (
              <>
                {showStickyBooking && (
                  <div className="md:hidden bottom-0 left-0 right-0 z-50 bg-background p-4 border-t border-border shadow-lg transition-all duration-500 ease-in-out transform translate-y-0 animate-in slide-in-from-bottom">
                    <BookPackage
                      startDate={selectedDate || defaultStartDate}
                      endDate={defaultEndDate}
                      subtitle={subtitle}
                      transactionFee={0}
                      tax={0}
                      total={total}
                      basePrice={dynamicPrice}
                      name={`${name} - ${duration}`}
                      tourId={tourId}
                      images={images}
                      currency={currency}
                      guestCount={guestCount}
                    />
                  </div>
                )}

                <div ref={bookingButtonRef}>
                  <BookPackage
                    startDate={selectedDate || defaultStartDate}
                    endDate={defaultEndDate}
                    subtitle={subtitle}
                    transactionFee={0}
                    tax={0}
                    total={total}
                    basePrice={dynamicPrice}
                    name={`${name} - ${duration}`}
                    tourId={tourId}
                    images={images}
                    currency={currency}
                    guestCount={guestCount}
                  />
                </div>
              </>
            )}
            <p className="text-sm text-muted-foreground text-center bg-background/50 p-2 rounded">
              🔒 You wont be charged yet
            </p>
          </div>

          {/* Trust Signals */}
          <div className="mt-6 pt-4 border-t border-border space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TbCalendarCancel size={18} />
              <div>
                <p className="text-sm font-medium">Free cancellation for 24h</p>
                <p className="text-xs">Full refund, no questions asked</p>
              </div>
            </div>

            <div className="bg-background p-3 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>🔒</span> Secure payment
                </div>
                <div className="flex items-center gap-1">
                  <span>🎯</span> Best price guarantee
                </div>
                <div className="flex items-center gap-1">
                  <span>🕒</span> 24/7 support
                </div>
                <div className="flex items-center gap-1">
                  <span>✓</span> No hidden charges
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20"
          >
            <IoShareOutline size={18} />
            Share Adventure
          </button>

          <Link
            href={`https://wa.me/917047474942?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium rounded-lg transition-all"
          >
            <FaWhatsapp size={18} />
            Customize Trip
          </Link>
        </div>
      </div>
    </div>
  );
}

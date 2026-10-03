'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calculator, ArrowRight, AlertTriangle, Info, ShieldCheck, Scroll } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FALLBACK_TRANSPORT } from '@/lib/data/fallback';
import { VEHICLE_CONFIG, type TransportMatrix, type VehicleType } from '@/lib/types/database';
import { VEHICLE_ICONS } from '@/components/icons/TransportIcons';
import NawiTipCard from '@/components/mascot/NawiTipCard';

/** Round to nearest ₱0.25 as per LTFRB rules */
function roundToNearest25(value: number): number {
  return Math.round(value * 4) / 4;
}

export default function FareCalculatorPage() {
  const [transportData, setTransportData] = useState<TransportMatrix[]>(FALLBACK_TRANSPORT);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('tricycle');
  const [distance, setDistance] = useState(3);
  const [isSpecialTrip, setIsSpecialTrip] = useState(false);
  const [passengerType, setPassengerType] = useState<'regular' | 'discounted'>('regular');

  useEffect(() => {
    async function fetchTransport() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('transport_matrix')
          .select('*');

        if (!error && data && data.length > 0) {
          setTransportData(data as TransportMatrix[]);
        }
      } catch {
        // Use fallback
      }
    }
    fetchTransport();
  }, []);

  const currentVehicle = useMemo(
    () => transportData.find((t) => t.vehicle_type === selectedVehicle),
    [transportData, selectedVehicle]
  );

  const discountRate = currentVehicle?.discount_percent ?? 0;
  const hasDiscount = discountRate > 0 && selectedVehicle !== 'boat';

  const fareBreakdown = useMemo(() => {
    if (!currentVehicle) return null;

    if (selectedVehicle === 'boat') {
      return {
        baseFare: currentVehicle.base_fare,
        extraFare: 0,
        totalFare: isSpecialTrip ? currentVehicle.special_trip_rate : currentVehicle.base_fare,
        label: isSpecialTrip ? 'Extended Tour' : 'Standard Tour',
        discountedTotal: null,
      };
    }

    const extraKm = Math.max(0, distance - currentVehicle.base_km);
    const extraFare = extraKm * currentVehicle.per_km_rate;
    let totalFare = currentVehicle.base_fare + extraFare;

    // Apply rounding for jeepney (LTFRB rounds to nearest ₱0.25)
    if (selectedVehicle === 'jeepney') {
      totalFare = roundToNearest25(totalFare);
    }

    // Discounted fare (S/E/D — 20% off)
    let discountedTotal: number | null = null;
    if (hasDiscount) {
      const discountMultiplier = 1 - discountRate / 100;
      const discountedBase = currentVehicle.base_fare * discountMultiplier;
      const discountedPerKm = currentVehicle.per_km_rate * discountMultiplier;
      let rawDiscounted = discountedBase + extraKm * discountedPerKm;
      if (selectedVehicle === 'jeepney') {
        rawDiscounted = roundToNearest25(rawDiscounted);
      }
      discountedTotal = rawDiscounted;
    }

    const isDiscountedSelected = passengerType === 'discounted' && hasDiscount;

    return {
      baseFare: currentVehicle.base_fare,
      extraFare,
      totalFare: isDiscountedSelected && discountedTotal !== null ? discountedTotal : totalFare,
      regularTotal: totalFare,
      discountedTotal,
      label: isDiscountedSelected ? 'Discounted Fare (S/E/D)' : 'Regular Fare',
    };
  }, [currentVehicle, distance, isSpecialTrip, selectedVehicle, passengerType, hasDiscount, discountRate]);

  return (
    <div className="px-4 py-6 md:py-8 max-w-3xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="space-y-1 animate-fade-in">
        <div className="flex items-center gap-2">
          <Calculator size={18} className="text-emerald-600" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-slate-900">
            Fare Calculator
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Official transport fares for getting around Naujan
        </p>
      </div>

      {/* Vehicle Selector */}
      <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
        {(Object.entries(VEHICLE_CONFIG) as [VehicleType, typeof VEHICLE_CONFIG[VehicleType]][]).map(
          ([type, config]) => (
            <button
              key={type}
              onClick={() => {
                setSelectedVehicle(type);
                setIsSpecialTrip(false);
                setPassengerType('regular');
              }}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200
                ${selectedVehicle === type
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }
              `}
              id={`vehicle-${type}`}
            >
              {(() => {
                const VIcon = VEHICLE_ICONS[type];
                return VIcon ? <VIcon size={28} /> : <span className="text-2xl">{config.emoji}</span>;
              })()}
              <span className="text-xs font-semibold">{config.label}</span>
            </button>
          )
        )}
      </div>

      {/* Passenger Type Selector (for vehicles with S/E/D discount) */}
      {hasDiscount && (
        <div className="card p-3 animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Passenger Type
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPassengerType('regular')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                passengerType === 'regular'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              id="passenger-regular"
            >
              Regular
            </button>
            <button
              onClick={() => setPassengerType('discounted')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                passengerType === 'discounted'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              id="passenger-discounted"
            >
              <ShieldCheck size={13} />
              Student / Senior / PWD
            </button>
          </div>
          {passengerType === 'discounted' && (
            <p className="text-[10px] text-sky-600 mt-2 font-medium px-1">
              {discountRate}% discount per MC 2017-024 — applies everyday including weekends and holidays.
            </p>
          )}
        </div>
      )}

      {/* Distance Slider (not for boat) */}
      {selectedVehicle !== 'boat' && (
        <div className="card p-4 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-900">Distance</label>
            <span className="text-lg font-bold text-emerald-600">{distance} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={selectedVehicle === 'jeepney' ? 34 : 10}
            step={0.5}
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full"
            id="distance-slider"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1 km</span>
            <span>{selectedVehicle === 'jeepney' ? '17 km' : '5 km'}</span>
            <span>{selectedVehicle === 'jeepney' ? '34 km' : '10 km'}</span>
          </div>
        </div>
      )}

      {/* Special Trip Toggle */}
      {selectedVehicle === 'boat' && (
        <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <label className="flex items-center justify-between cursor-pointer">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">Extended Tour</p>
              <p className="text-[10px] text-slate-500">2-3 hour extended lake tour</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isSpecialTrip}
                onChange={(e) => setIsSpecialTrip(e.target.checked)}
                className="sr-only peer"
                id="special-trip-toggle"
              />
              <div className="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-emerald-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      )}

      {/* Fare Result */}
      {fareBreakdown && (
        <div className="card p-5 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {fareBreakdown.label}
            </p>
            <p className="text-4xl font-extrabold font-[family-name:var(--font-display)] text-emerald-600">
              ₱{fareBreakdown.totalFare.toFixed(2)}
            </p>
            {/* Show both fares when applicable */}
            {hasDiscount && fareBreakdown.discountedTotal !== null && fareBreakdown.regularTotal !== undefined && (
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  passengerType === 'regular'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  Regular: ₱{fareBreakdown.regularTotal.toFixed(2)}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  passengerType === 'discounted'
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  S/E/D: ₱{fareBreakdown.discountedTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-200/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">
                Base fare {currentVehicle && selectedVehicle !== 'boat' && `(first ${currentVehicle.base_km} km)`}
              </span>
              <span className="text-slate-900 font-medium">₱{fareBreakdown.baseFare.toFixed(2)}</span>
            </div>
            {fareBreakdown.extraFare > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <ArrowRight size={10} />
                  Additional ({(distance - (currentVehicle?.base_km || 0)).toFixed(1)} km × ₱{currentVehicle?.per_km_rate.toFixed(2)})
                </span>
                <span className="text-slate-900 font-medium">₱{fareBreakdown.extraFare.toFixed(2)}</span>
              </div>
            )}
            {passengerType === 'discounted' && hasDiscount && (
              <div className="flex justify-between text-xs">
                <span className="text-sky-600 flex items-center gap-1">
                  <ShieldCheck size={10} />
                  S/E/D discount ({discountRate}% off)
                </span>
                <span className="text-sky-600 font-medium">
                  −₱{((fareBreakdown.regularTotal ?? fareBreakdown.totalFare) - fareBreakdown.totalFare).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Official Source */}
          {currentVehicle?.fare_source && (
            <div className="flex gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[10px] text-emerald-700">
              <Scroll size={12} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold">Official source:</span>{' '}
                {currentVehicle.fare_source}
              </p>
            </div>
          )}

          {/* Notes */}
          {currentVehicle?.notes && (
            <div className="flex gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-[10px] text-slate-500">
              <Info size={12} className="shrink-0 mt-0.5 text-sky-600" />
              <p className="leading-relaxed">{currentVehicle.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Jeepney fare table excerpt */}
      {selectedVehicle === 'jeepney' && (
        <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Calapan City Pier → Naujan (TP) — Key Stops
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-1.5 font-semibold text-slate-600">KM</th>
                  <th className="text-left py-1.5 font-semibold text-slate-600">Stop</th>
                  <th className="text-right py-1.5 font-semibold text-slate-600">Regular</th>
                  <th className="text-right py-1.5 font-semibold text-slate-600">S/E/D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { km: 0, stop: 'Calapan City Pier', reg: '—', sed: '—' },
                  { km: 4, stop: 'Lalud / Tawiran', reg: '₱12.00', sed: '₱9.50' },
                  { km: 7, stop: 'Sta. Isabel', reg: '₱15.50', sed: '₱12.50' },
                  { km: 10, stop: 'Malad', reg: '₱21.00', sed: '₱16.75' },
                  { km: 15, stop: 'Bucayao', reg: '₱30.00', sed: '₱24.00' },
                  { km: 20, stop: 'Tamaraw', reg: '₱40.75', sed: '₱32.75' },
                  { km: 25, stop: 'Kurba-Naujan', reg: '₱49.75', sed: '₱39.75' },
                  { km: 30, stop: 'Santiago', reg: '₱58.75', sed: '₱47.00' },
                  { km: 34, stop: 'Naujan Town Proper', reg: '₱66.00', sed: '₱52.75' },
                ].map((row) => (
                  <tr key={row.km} className="hover:bg-slate-50 transition-colors">
                    <td className="py-1.5 text-slate-400 tabular-nums">{row.km}</td>
                    <td className="py-1.5 text-slate-800 font-medium">{row.stop}</td>
                    <td className="py-1.5 text-right text-slate-800 tabular-nums">{row.reg}</td>
                    <td className="py-1.5 text-right text-sky-600 tabular-nums">{row.sed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tricycle fare table */}
      {selectedVehicle === 'tricycle' && (
        <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Tricycle Zonal Fare Matrix — Poblacion / Curva Zone
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-1.5 font-semibold text-slate-600">Distance</th>
                  <th className="text-right py-1.5 font-semibold text-slate-600">Regular</th>
                  <th className="text-right py-1.5 font-semibold text-slate-600">Senior/PWD/Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { dist: '2 km', reg: '₱15.00', disc: '₱12.00' },
                  { dist: '4 km', reg: '₱21.00', disc: '₱16.80' },
                  { dist: '5 km', reg: '₱24.00', disc: '₱19.20' },
                  { dist: '7 km', reg: '₱30.00', disc: '₱24.00' },
                  { dist: '8 km', reg: '₱33.00', disc: '₱26.40' },
                ].map((row) => (
                  <tr key={row.dist} className="hover:bg-slate-50 transition-colors">
                    <td className="py-1.5 text-slate-800 font-medium">{row.dist}</td>
                    <td className="py-1.5 text-right text-slate-800 tabular-nums">{row.reg}</td>
                    <td className="py-1.5 text-right text-sky-600 tabular-nums">{row.disc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Pambayang Ordinansa BLG. 151 • Bayan ng Naujan • 2023
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <p className="text-[10px] text-amber-700 leading-relaxed">
          Fares shown are based on official rates from LTFRB and Municipal Ordinance.
          Actual fare may vary during holidays or inclement weather.
          Always confirm the fare with your driver before departure.
        </p>
      </div>

      {/* Nawi Tip Card */}
      <NawiTipCard />
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Calculator, ArrowRight, AlertTriangle, Info, ShieldCheck, Scroll, Bus, Compass } from 'lucide-react';
import { JEEPNEY_STOPS, calculateJeepneyFareBetweenStops, calculateTricycleFare, type JeepneyStop } from '@/lib/data/jeepney-route';
import NawiTipCard from '@/components/mascot/NawiTipCard';

export default function FareCalculatorPage() {
  // Mode selection: 'combined' (Jeepney + Tricycle) or 'boat' (Lake Tour)
  const [mode, setMode] = useState<'combined' | 'boat'>('combined');

  // Combined mode state
  const [boardingStopIndex, setBoardingStopIndex] = useState<number>(0); // Calapan Pier default
  const [dropoffStopIndex, setDropoffStopIndex] = useState<number>(8);   // Naujan TP default
  const [innerDistanceKm, setInnerDistanceKm] = useState<number>(2.0);  // Inner tricycle distance
  const [passengerType, setPassengerType] = useState<'regular' | 'discounted'>('regular');

  // Boat mode state
  const [isExtendedBoatTour, setIsExtendedBoatTour] = useState(false);

  // Derived stops
  const boardingStop: JeepneyStop = JEEPNEY_STOPS[boardingStopIndex] || JEEPNEY_STOPS[0];
  const dropoffStop: JeepneyStop = JEEPNEY_STOPS[dropoffStopIndex] || JEEPNEY_STOPS[JEEPNEY_STOPS.length - 1];

  // Calculate combined fare
  const combinedFare = useMemo(() => {
    // Jeepney leg (along highway)
    const jeepney = calculateJeepneyFareBetweenStops(boardingStop, dropoffStop);
    
    // Last-mile leg (inside non-highway area)
    const tricycle = calculateTricycleFare(innerDistanceKm);

    const totalRegular = Math.round((jeepney.regular + tricycle.regular) * 100) / 100;
    const totalDiscounted = Math.round((jeepney.discounted + tricycle.discounted) * 100) / 100;

    return {
      jeepney,
      tricycle,
      totalRegular,
      totalDiscounted,
    };
  }, [boardingStop, dropoffStop, innerDistanceKm]);

  // Active total fare depending on passenger type selection
  const activeFare = passengerType === 'discounted' ? combinedFare.totalDiscounted : combinedFare.totalRegular;

  return (
    <div className="px-4 py-6 md:py-8 max-w-3xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="space-y-1 animate-fade-in">
        <div className="flex items-center gap-2">
          <Calculator size={20} className="text-emerald-600" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-slate-900">
            Route &amp; Fare Calculator
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Combined Jeepney Highway + Inner Tricycle fare calculation for Naujan
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 gap-2 animate-fade-in-up">
        <button
          onClick={() => setMode('combined')}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
            mode === 'combined'
              ? 'bg-emerald-600 text-white shadow-md font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold'
          }`}
          id="mode-combined"
        >
          <Bus size={18} />
          <span className="text-xs">Jeepney + Tricycle</span>
        </button>
        <button
          onClick={() => setMode('boat')}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
            mode === 'boat'
              ? 'bg-emerald-600 text-white shadow-md font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold'
          }`}
          id="mode-boat"
        >
          <Compass size={18} />
          <span className="text-xs">Bangka Lake Tour</span>
        </button>
      </div>

      {mode === 'combined' ? (
        <div className="space-y-4">
          {/* Passenger Type Selector */}
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
                20% discount per LTFRB / Ordinance rules — applies everyday including weekends and holidays.
              </p>
            )}
          </div>

          {/* Jeepney Highway Route Stops */}
          <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              1. Jeepney Highway Route (National Highway)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Boarding Stop (Jeepney)
                </label>
                <select
                  value={boardingStopIndex}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBoardingStopIndex(val);
                    if (val >= dropoffStopIndex) {
                      setDropoffStopIndex(Math.min(JEEPNEY_STOPS.length - 1, val + 1));
                    }
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  id="boarding-stop-select"
                >
                  {JEEPNEY_STOPS.map((stop, idx) => (
                    <option key={stop.name} value={idx}>
                      {stop.name} (KM {stop.km})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highway Drop-off Stop
                </label>
                <select
                  value={dropoffStopIndex}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setDropoffStopIndex(val);
                    if (val <= boardingStopIndex) {
                      setBoardingStopIndex(Math.max(0, val - 1));
                    }
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  id="dropoff-stop-select"
                >
                  {JEEPNEY_STOPS.map((stop, idx) => (
                    <option key={stop.name} value={idx}>
                      {stop.name} (KM {stop.km})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inner Tricycle Distance */}
          <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  2. Tricycle Last-Mile Access (Non-Highway Inside)
                </p>
                <p className="text-[10px] text-slate-400">
                  Distance from highway drop-off to inner destination
                </p>
              </div>
              <span className="text-base font-bold text-emerald-600">{innerDistanceKm.toFixed(1)} km</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={innerDistanceKm}
              onChange={(e) => setInnerDistanceKm(parseFloat(e.target.value))}
              className="w-full"
              id="inner-distance-slider"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 km (on highway)</span>
              <span>5 km</span>
              <span>10 km (deep inside)</span>
            </div>
          </div>

          {/* Total Combined Fare Result */}
          <div className="card p-5 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Total Combined Fare ({passengerType === 'discounted' ? 'S/E/D Discounted' : 'Regular'})
              </p>
              <p className="text-4xl font-extrabold font-[family-name:var(--font-display)] text-emerald-600">
                ₱{activeFare.toFixed(2)}
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  passengerType === 'regular'
                    ? 'bg-emerald-100 text-emerald-700 font-bold'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  Regular: ₱{combinedFare.totalRegular.toFixed(2)}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  passengerType === 'discounted'
                    ? 'bg-sky-100 text-sky-700 font-bold'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  S/E/D: ₱{combinedFare.totalDiscounted.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Fare Breakdown List */}
            <div className="space-y-2 pt-3 border-t border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Cost Breakdown
              </p>

              {/* Jeepney Leg */}
              <div className="flex items-start justify-between text-xs text-slate-700">
                <div className="flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5 font-bold">🚐</span>
                  <div>
                    <p className="font-semibold text-slate-900">Jeepney Highway Fare</p>
                    <p className="text-[10px] text-slate-500">
                      {boardingStop.name} → {dropoffStop.name} ({Math.abs(dropoffStop.km - boardingStop.km)} km)
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">
                  ₱{(passengerType === 'discounted' ? combinedFare.jeepney.discounted : combinedFare.jeepney.regular).toFixed(2)}
                </span>
              </div>

              {/* Tricycle Leg */}
              {innerDistanceKm > 0 && (
                <div className="flex items-start justify-between text-xs text-slate-700">
                  <div className="flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5 font-bold">🛺</span>
                    <div>
                      <p className="font-semibold text-slate-900">Tricycle Inner Access</p>
                      <p className="text-[10px] text-slate-500">
                        From {dropoffStop.name} ({innerDistanceKm.toFixed(1)} km inside)
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ₱{(passengerType === 'discounted' ? combinedFare.tricycle.discounted : combinedFare.tricycle.regular).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Official Source */}
            <div className="flex gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[10px] text-emerald-700">
              <Scroll size={12} className="shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold">Official Fare Matrix:</span> Jeepney rates based on LTFRB Oriental Mindoro Matrix; Tricycle rates based on Naujan Pambayang Ordinansa BLG. 151.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Bangka Mode */
        <div className="card p-5 space-y-4 animate-fade-in-up">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Bangka / Lake Tour Rates</h3>
            <p className="text-xs text-slate-500">Naujan Lake motorboat Eco-tour tariffs</p>
          </div>

          <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900 font-[family-name:var(--font-display)]">
                Extended Lake Tour (2-3 hrs)
              </p>
              <p className="text-[10px] text-slate-500">Includes complete lake perimeter and sanctuary visit</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isExtendedBoatTour}
                onChange={(e) => setIsExtendedBoatTour(e.target.checked)}
                className="sr-only peer"
                id="special-trip-toggle"
              />
              <div className="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-emerald-500 transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
          </label>

          <div className="text-center py-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {isExtendedBoatTour ? 'Extended Tour Special Rate' : 'Standard Lake Tour Fare'}
            </p>
            <p className="text-3xl font-extrabold font-[family-name:var(--font-display)] text-emerald-700 mt-1">
              ₱{isExtendedBoatTour ? '1,500.00' : '800.00'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Per boat (fits up to 6 passengers) • LGU Tourist Center Tariffs
            </p>
          </div>
        </div>
      )}

      {/* Jeepney fare table reference */}
      <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Jeepney Official Highway Fare Table (Calapan Pier → Naujan)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-1.5 font-semibold text-slate-600">KM</th>
                <th className="text-left py-1.5 font-semibold text-slate-600">Stop Name</th>
                <th className="text-right py-1.5 font-semibold text-slate-600">Regular</th>
                <th className="text-right py-1.5 font-semibold text-slate-600">S/E/D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {JEEPNEY_STOPS.map((stop) => (
                <tr key={stop.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-1.5 text-slate-400 tabular-nums">{stop.km}</td>
                  <td className="py-1.5 text-slate-800 font-medium">{stop.name}</td>
                  <td className="py-1.5 text-right text-slate-800 tabular-nums">
                    {stop.regularFare > 0 ? `₱${stop.regularFare.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-1.5 text-right text-sky-600 tabular-nums">
                    {stop.discountedFare > 0 ? `₱${stop.discountedFare.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tricycle zonal fare reference */}
      <div className="card p-4 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.22s' }}>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Tricycle Zonal Fare Matrix — Naujan Ordinansa BLG. 151
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-1.5 font-semibold text-slate-600">Inner Distance</th>
                <th className="text-right py-1.5 font-semibold text-slate-600">Regular</th>
                <th className="text-right py-1.5 font-semibold text-slate-600">Student/Senior/PWD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { dist: 'First 2.0 km (Base)', reg: '₱15.00', disc: '₱12.00' },
                { dist: '3.0 km', reg: '₱18.00', disc: '₱14.40' },
                { dist: '4.0 km', reg: '₱21.00', disc: '₱16.80' },
                { dist: '5.0 km', reg: '₱24.00', disc: '₱19.20' },
                { dist: '7.0 km', reg: '₱30.00', disc: '₱24.00' },
                { dist: '10.0 km', reg: '₱39.00', disc: '₱31.20' },
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
          * Per km rate inside non-highway areas: ₱15.00 for first 2 km + ₱3.00/km for succeedings.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <p className="text-[10px] text-amber-700 leading-relaxed">
          Fares shown are calculated by combining jeepney national highway tariffs and tricycle inner barangay access rates. Always verify with drivers before departing.
        </p>
      </div>

      {/* Nawi Tip Card */}
      <NawiTipCard />
    </div>
  );
}

import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

type Province = {
    id: number;
    name: string;
};

type Regency = {
    id: number;
    province_id: number;
    type: string;
    name: string;
};

type LocationProps = {
    compact: boolean;
    province: string;
    setProvince: (value: string) => void;
    regency: string;
    setRegency: (value: string) => void;
    provinces: Province[];
    regencies: Regency[];
};

export default function Location({
    compact,
    province,
    setProvince,
    regency,
    setRegency,
    provinces,
    regencies,
}: LocationProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedProvince = provinces.find(
        (item) => String(item.id) === province,
    );

    const selectedRegency = regencies.find(
        (item) => String(item.id) === regency,
    );

    const selectClass =
        'h-9 w-full rounded-sm border border-[#d4e0eb] bg-white px-2 text-xs text-[#566779] shadow-inner outline-none transition focus:border-[#a9c8e0] focus:ring-1 focus:ring-[#dcebf6]';

    return (
        <div className="border-t border-[#dce4ec] bg-[#f7f9fb]">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-2 bg-gradient-to-b from-white to-[#f0f4f8] px-3 text-left transition-all duration-300 ${
                    compact ? 'py-2' : 'py-2.5'
                }`}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="size-4 shrink-0 text-[#91afc8]" />

                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#566779]">
                            Lokasi toko
                        </p>

                        <p className="truncate text-[10px] text-[#91a1b1]">
                            {selectedProvince?.name ?? 'Semua provinsi'}
                            {selectedRegency
                                ? ` · ${selectedRegency.type} ${selectedRegency.name}`
                                : ''}
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-4 shrink-0 text-[#8296a9] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Content */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-2 border-t border-[#e2e8ef] bg-[#fbfcfd] p-3">
                        {/* Province */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[10px] font-bold text-[#8296a9]">
                                Provinsi
                            </label>

                            <select
                                value={province}
                                onChange={(e) => {
                                    setProvince(e.target.value);
                                    setRegency('');
                                }}
                                className={selectClass}
                            >
                                <option value="">Semua provinsi</option>

                                {provinces.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Regency */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[10px] font-bold text-[#8296a9]">
                                Kabupaten / Kota
                            </label>

                            <select
                                value={regency}
                                onChange={(e) => setRegency(e.target.value)}
                                disabled={!province}
                                className={`${selectClass} disabled:cursor-not-allowed disabled:bg-[#f0f3f6] disabled:text-[#aab6c2]`}
                            >
                                <option value="">Semua kabupaten / kota</option>

                                {regencies.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.type} {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset */}
                        {(province || regency) && (
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProvince('');
                                        setRegency('');
                                    }}
                                    className="text-[10px] font-semibold text-[#b17b55] transition hover:text-[#95603c]"
                                >
                                    Reset lokasi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
        'h-9 w-full rounded-sm border border-[#EAE2D9] bg-white px-2 text-xs text-[#665548] shadow-inner outline-none transition focus:border-[#D69B70] focus:ring-1 focus:ring-[#F5DCC7] disabled:cursor-not-allowed disabled:bg-[#F3EFEA] disabled:text-[#B5A99D]';

    return (
        <div className="border-t border-[#EAE2D9] bg-[#FAF8F5]">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-2 bg-gradient-to-b from-white to-[#F7F3EE] px-3 text-left transition-all duration-300 hover:to-[#FAF0E6] ${
                    compact ? 'py-2' : 'py-2.5'
                }`}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#E8C3A3] bg-[#FFF1E5]">
                        <MapPin className="size-4 text-[#C4773D]" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#665548]">
                            Lokasi toko
                        </p>

                        <p className="truncate text-[10px] text-[#A99B8D]">
                            {selectedProvince?.name ?? 'Semua provinsi'}
                            {selectedRegency
                                ? ` · ${selectedRegency.type} ${selectedRegency.name}`
                                : ''}
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-4 shrink-0 text-[#C4773D] transition-transform duration-300 ${
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
                    <div className="grid grid-cols-2 gap-2 border-t border-[#EAE2D9] bg-[#FDFBF8] p-3">
                        {/* Province */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[10px] font-bold text-[#928477]">
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
                            <label className="mb-1.5 block text-[10px] font-bold text-[#928477]">
                                Kabupaten / Kota
                            </label>

                            <select
                                value={regency}
                                onChange={(e) => setRegency(e.target.value)}
                                disabled={!province}
                                className={selectClass}
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
                            <div className="col-span-2 flex justify-end border-t border-[#EAE2D9] pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProvince('');
                                        setRegency('');
                                    }}
                                    className="flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold text-[#C4773D] transition hover:bg-[#FFF1E5] hover:text-[#A95E2D]"
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

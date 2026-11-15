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
        'h-9 w-full rounded-sm border border-[#DEDAD4] bg-white px-2 text-xs font-medium text-[#292522] shadow-inner outline-none transition focus:border-[#F07818] focus:ring-1 focus:ring-[#F07818]/30 disabled:cursor-not-allowed disabled:bg-[#F0EEEA] disabled:text-[#A39B92]';

    return (
        <div className="border-t border-[#DEDAD4] bg-[#F5F4F1]">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-2 border-b border-[#DEDAD4] bg-white px-3 text-left transition-all duration-300 hover:bg-[#FAF8F5] ${
                    compact ? 'py-2' : 'py-2.5'
                }`}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#D9630B] bg-[#F07818] shadow-sm">
                        <MapPin className="size-4 text-white" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#292522]">
                            Lokasi toko
                        </p>

                        <p className="truncate text-[10px] text-[#77716B]">
                            {selectedProvince?.name ?? 'Semua provinsi'}
                            {selectedRegency
                                ? ` · ${selectedRegency.type} ${selectedRegency.name}`
                                : ''}
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-4 shrink-0 text-[#F07818] transition-transform duration-300 ${
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
                    <div className="grid grid-cols-2 gap-2 border-t border-white bg-[#F5F4F1] p-3">
                        {/* Province */}
                        <div className="min-w-0">
                            <label className="mb-1.5 block text-[10px] font-bold text-[#625B54]">
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
                            <label className="mb-1.5 block text-[10px] font-bold text-[#625B54]">
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
                            <div className="col-span-2 flex justify-end border-t border-[#DEDAD4] pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProvince('');
                                        setRegency('');
                                    }}
                                    className="flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold text-[#E66B0B] transition hover:bg-[#FFF0E2] hover:text-[#D9630B]"
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

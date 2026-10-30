<?php

namespace Modules\Master\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Master\Models\City;
use Modules\Master\Models\Regency;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regencyIds = Regency::pluck('id')->toArray();

        if (empty($regencyIds)) {
            $this->command->warn('Tabel ref_regencies masih kosong. Jalankan RegencySeeder terlebih dahulu!');
            return;
        }

        // Contoh sampel data Kecamatan / Wilayah tingkat 3
        $cities = [
            'Kecamatan Coblong',
            'Kecamatan Sukasari',
            'Kecamatan Cibinong',
            'Kecamatan Tegalsari',
            'Kecamatan Gubeng',
            'Kecamatan Banjarsari',
            'Kecamatan Laweyan',
            'Kecamatan Gondokusuman',
            'Kecamatan Umbulharjo',
            'Kecamatan Kuta',
            'Kecamatan Kuta Utara',
            'Kecamatan Medan Baru',
            'Kecamatan Panakkukang',
            'Kecamatan Tampan',
            'Kecamatan Ilir Timur I',
        ];

        foreach ($cities as $cityName) {
            City::firstOrCreate([
                'name' => $cityName,
                'slug' => Str::slug($cityName),
            ], [
                'regency_id' => $regencyIds[array_rand($regencyIds)],
            ]);
        }
    }
}

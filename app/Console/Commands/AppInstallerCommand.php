<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AppInstallerCommand extends Command
{
    protected $signature = 'app:install';

    protected $description = 'Fresh migrate, import location SQL, migrate modules, and seed database';

    public function handle(): int
    {
        /*
        |--------------------------------------------------------------------------
        | 1. Wipe Database
        |--------------------------------------------------------------------------
        */

        $this->info('Wiping database...');

        if ($this->call('db:wipe', [
            '--force' => true,
        ]) !== self::SUCCESS) {
            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Import Location SQL
        |--------------------------------------------------------------------------
        */

        $files = [
            'location_province.sql',
            'location_city.sql',
        ];

        foreach ($files as $file) {
            $path = database_path("migrations/ref/{$file}");

            if (!file_exists($path)) {
                $this->error("SQL file not found: {$path}");

                return self::FAILURE;
            }

            try {
                $this->info("Importing: {$file}");

                DB::unprepared(file_get_contents($path));

                $this->info("Imported: {$file}");

            } catch (\Throwable $e) {
                $this->error("Import failed: {$e->getMessage()}");

                return self::FAILURE;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Laravel Migrations
        |--------------------------------------------------------------------------
        */

        $this->info('Running Laravel migrations...');

        if ($this->call('migrate', [
            '--force' => true,
        ]) !== self::SUCCESS) {
            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Module Migrations
        |--------------------------------------------------------------------------
        */

        $migrations = [];

        foreach (glob(base_path('modules/*/database/migrations'), GLOB_ONLYDIR) as $path) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator(
                    $path,
                    \FilesystemIterator::SKIP_DOTS
                )
            );

            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getExtension() === 'php') {
                    $migrations[] = $file->getPathname();
                }
            }
        }

        usort($migrations, fn ($a, $b) => basename($a) <=> basename($b));

        foreach ($migrations as $migration) {
            $relativePath = str_replace(
                base_path() . DIRECTORY_SEPARATOR,
                '',
                $migration
            );

            $this->line("Migrating: {$relativePath}");

            if ($this->call('migrate', [
                '--path' => $relativePath,
                '--force' => true,
            ]) !== self::SUCCESS) {
                $this->error("Migration failed: {$relativePath}");

                return self::FAILURE;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Database Seeder
        |--------------------------------------------------------------------------
        */

        $this->info('Running database seeders...');

        if ($this->call('db:seed', [
            '--force' => true,
        ]) !== self::SUCCESS) {
            return self::FAILURE;
        }

        $this->info('Application installed successfully.');

        return self::SUCCESS;
    }
}

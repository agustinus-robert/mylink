<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AppInstallerCommand extends Command
{
    protected $signature = 'app:install';

    protected $description = 'Fresh migrate, migrate modules, and seed database';

    public function handle(): int
    {
        $this->call('migrate:fresh');

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

        usort($migrations, function ($a, $b) {
            return basename($a) <=> basename($b);
        });

        foreach ($migrations as $migration) {
            $this->line('Migrating: ' . $migration);

            $this->call('migrate', [
                '--path' => str_replace(
                    base_path() . DIRECTORY_SEPARATOR,
                    '',
                    $migration
                ),
                '--force' => true,
            ]);
        }

        $this->call('db:seed');

        $this->info('Database migrated and seeded successfully.');

        return self::SUCCESS;
    }
}

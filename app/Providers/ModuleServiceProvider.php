<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $modulesPath = base_path('modules');

        if (! File::isDirectory($modulesPath)) {
            return;
        }

        foreach (File::directories($modulesPath) as $directory) {

            $moduleJson = $directory.'/module.json';

            if (! File::isFile($moduleJson)) {
                continue;
            }

            $module = json_decode(File::get($moduleJson), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException(
                    "Invalid JSON: {$moduleJson}"
                );
            }

            if (! ($module['enabled'] ?? true)) {
                continue;
            }

            $provider = $module['provider'] ?? null;

            if (empty($provider)) {
                continue;
            }

            if (! class_exists($provider)) {
                throw new \RuntimeException(
                    "Module provider [{$provider}] not found."
                );
            }

            $this->app->register($provider);
        }
    }

    public function boot(): void
    {
        //
    }
}
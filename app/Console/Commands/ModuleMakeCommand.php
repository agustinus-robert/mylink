<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ModuleMakeCommand extends Command
{
    protected $signature = 'module:make {name}';

    protected $description = 'Create new module';

    public function handle()
    {
        $name = ucfirst($this->argument('name'));

        $stubPath = base_path('stubs/module');
        $modulePath = base_path("modules/{$name}");

        if (! File::exists($stubPath)) {
            $this->error('Stub module tidak ditemukan.');

            return self::FAILURE;
        }

        if (File::exists($modulePath)) {
            $this->error("Module {$name} sudah ada.");

            return self::FAILURE;
        }

        File::copyDirectory($stubPath, $modulePath);
        $this->rename($modulePath, $name);
        $this->replace($modulePath, $name);

        $this->info("Module {$name} berhasil dibuat.");

        return self::SUCCESS;
    }

    protected function rename(string $path, string $module): void
    {
        // Rename file dulu
        foreach (File::allFiles($path) as $file) {

            $old = $file->getRealPath();

            $new = str_replace('{{Module}}', $module, $old);

            if ($old !== $new) {
                File::move($old, $new);
            }
        }

        // Rename folder (dari dalam keluar)
        $directories = collect(File::directories($path))
            ->sortDesc();

        foreach ($directories as $directory) {

            $new = str_replace('{{Module}}', $module, $directory);

            if ($directory !== $new) {
                File::moveDirectory($directory, $new);
            }
        }
    }

    protected function replace(string $path, string $module): void
    {
        $namespace = "Modules\\{$module}";

        $replace = [
            '{{Module}}'        => $module,
            '{{module}}'        => strtolower($module),
            '{{Namespace}}'     => $namespace,
            '{{NamespaceJson}}' => str_replace('\\', '\\\\', $namespace),
            '{{Route}}'         => strtolower($module),
            '{{Table}}'         => strtolower($module).'s',
        ];

        foreach (File::allFiles($path) as $file) {

            $content = File::get($file->getRealPath());

            $content = str_replace(
                array_keys($replace),
                array_values($replace),
                $content
            );

            File::put($file->getRealPath(), $content);
        }
    }
}
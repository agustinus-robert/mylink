<?php

namespace {{Namespace}}\Providers;

use Illuminate\Support\ServiceProvider;

class {{Module}}ServiceProvider extends ServiceProvider
{
    protected string $modulePath;

    public function __construct($app)
    {
        parent::__construct($app);

        $this->modulePath = realpath(__DIR__ . '/..');
    }

    public function register(): void
    {
        $config = $this->modulePath . '/config/config.php';

        if (is_file($config)) {
            $this->mergeConfigFrom(
                $config,
                '{{module}}'
            );
        }
    }

    public function boot(): void
    {
        $web = $this->modulePath . '/Routes/web.php';
        $api = $this->modulePath . '/Routes/api.php';

        if (is_file($web)) {
            $this->loadRoutesFrom($web);
        }

        if (is_file($api)) {
            $this->loadRoutesFrom($api);
        }

        $views = $this->modulePath . '/resources/views';

        if (is_dir($views)) {
            $this->loadViewsFrom(
                $views,
                '{{module}}'
            );
        }

        $migrations = $this->modulePath . '/database/migrations';

        if (is_dir($migrations)) {
            $this->loadMigrationsFrom($migrations);
        }
    }
}
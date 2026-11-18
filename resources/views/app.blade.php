<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #f4f5f2 !important;
                color-scheme: light;
            }

            html.dark {
                background-color: #f4f5f2 !important;
                color-scheme: light;
            }

            body {
                background-color: #f4f5f2 !important;
            }
        </style>

        <link rel="icon" href="/icon-16.png" sizes="any">
        <link rel="apple-touch-icon" href="/icon-70.png">
        @routes
        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        <x-inertia::head>
            <title>Shop</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <div @class([
            'mx-auto min-h-200 w-full rounded',
            'max-w-[410px]' => request()->routeIs(
                'home',
                'topik',
                'sender',
                'note',
                'notification'
            ),
        ])>
            <x-inertia::app />
        </div>
    </body>
</html>

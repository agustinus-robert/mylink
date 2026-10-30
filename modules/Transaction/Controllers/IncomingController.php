<?php

namespace Modules\Transaction\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Master\Models\Category;
use Modules\Transaction\Models\Product;
use Modules\Master\Models\SubCategory;
use Modules\Master\Models\Province;
use Modules\Master\Models\Regency;
use Modules\Transaction\Exports\IncomingExport;
use Modules\Transaction\Models\Incoming;
use Modules\Transaction\Requests\IncomingRequests;
use Modules\Transaction\Services\IncomingService;

class IncomingController extends Controller
{
    public function __construct(
        protected IncomingService $incomingService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only([
            'category_id',
            'sub_category_id',
            'year',
            'search',
            'sort',
            'direction',
            'dateFrom',
            'dateTo',
            'archived',
        ]);

        $incomings = $this->incomingService->paginate($filters);

        return Inertia::render('transaction/incoming/index', [
            'incomings' => $incomings,
            'filters' => $filters,

            'categories' => Category::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),

            'subCategories' => SubCategory::query()
                ->select('id', 'category_id', 'name')
                ->orderBy('name')
                ->get(),

            'years' => Incoming::query()
                ->selectRaw('YEAR(created_at) as year')
                ->distinct()
                ->orderByDesc('year')
                ->pluck('year'),

            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function create()
    {
        return Inertia::render('transaction/incoming/form', [
            'categories' => $this->getCategories(),
            'subCategories' => $this->getSubCategories(),
            'provinces' => $this->getProvince(),
            'districts' => $this->getDistrict(),
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function edit(Product $incoming)
    {
        $incoming->load('detail.location.province', 'detail.location.district', 'category', 'subCategory');
 
        return Inertia::render('transaction/incoming/form', [
            'incoming' => $incoming,
            'categories' => $this->getCategories(),
            'subCategories' => $this->getSubCategories(),
            'provinces' => $this->getProvince(),
            'districts' => $this->getDistrict(),
        ]);
    }

    public function export(Request $request)
    {
        $filters = $request->only([
            'category_id',
            'sub_category_id',
            'year',
            'search',
            'sort',
            'direction',
            'dateFrom',
            'dateTo',
            'archived',
        ]);

        return Excel::download(
            new IncomingExport($filters),
            'data-pemasukan-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }

    public function store(IncomingRequests $request)
    {
        try {
            $this->incomingService->form(null, $request->transform());
            return to_route('transaction.incoming.index')
                ->with('success', 'Data pemasukan berhasil ditambahkan.');
        } catch (\Throwable $e) {
            dd($e->getMessage());
            Log::error('Gagal menyimpan transaksi masuk', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withErrors([
                    'message' => 'Gagal menyimpan transaksi masuk.',
                ])
                ->withInput();
        }
    }

    public function update(
        IncomingRequests $request,
        Product $incoming
    ) {

        try {
            $this->incomingService->form($incoming->id, $request->transform());
            return to_route('transaction.incoming.index')
                ->with('success', 'Data pemasukan berhasil diperbarui.');
        } catch (\Throwable $e) {
            dd($e->getMessage());
            Log::error('Gagal memperbarui transaksi masuk', [
                'incoming_id' => $incoming->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withErrors([
                    'message' => 'Gagal memperbarui transaksi masuk.',
                ])
                ->withInput();
        }
    }

    public function destroy(Incoming $incoming)
    {
        if (! $this->isAdmin()) {
            abort_unless(
                (int) $incoming->operator_id === (int) Auth::id(),
                403
            );
        }

        try {
            $this->incomingService->deletion($incoming->id);

            return to_route('transaction.incoming.index')
                ->with('success', 'Data pemasukan berhasil dihapus.');
        } catch (\Throwable $e) {
            Log::error('Gagal menghapus transaksi masuk', [
                'incoming_id' => $incoming->id,
                'message' => $e->getMessage(),
            ]);

            return back()
                ->withErrors([
                    'message' => 'Gagal menghapus transaksi masuk.',
                ]);
        }
    }

    public function verify(Incoming $incoming)
    {
        abort_unless($this->isAdmin(), 403);

        if ($incoming->is_verified) {
            return back()->with('info', 'Invoice sudah diverifikasi.');
        }

        $incoming->forceFill([
            'is_verified' => true,
            'updated_by' => Auth::id(),
        ])->save();

        return back()->with('success', 'Invoice berhasil diverifikasi.');
    }

    public function receipt(Incoming $incoming)
    {
        $incoming->load([
            'creator:id,name',
            'category:id,name',
            'subCategory:id,name',
            'items',
        ]);

        return Inertia::render('transaction/incoming/receipt', [
            'incoming' => $incoming,
        ]);
    }

    private function isAdmin(): bool
    {
        $user = Auth::user();

        if (! $user instanceof User) {
            return false;
        }

        return $user->roles()
            ->where('slug', 'admin')
            ->exists();
    }

    private function getCategories()
    {
        return Category::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    private function getProvince(){
        return Province::query()
        ->select('id', 'name')
        ->orderBy('name')
        ->get();
    }

    private function getDistrict(){
        return Regency::query()
        ->select('id', 'province_id', 'name')
        ->orderBy('name')
        ->get();   
    }

    private function getSubCategories()
    {
        return SubCategory::query()
            ->select('id', 'category_id', 'name', 'price')
            ->orderBy('name')
            ->get();
    }

    private function getOperators()
    {
        $query = User::query()
            ->select('id', 'name')
            ->whereHas('roles', function ($query) {
                $query->where('slug', 'operator');
            });

        if (! $this->isAdmin()) {
            $query->where('id', Auth::id());
        }

        return $query->orderBy('name')->get();
    }
}


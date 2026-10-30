export default function Posting() {
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
                Buat Request Barang
            </h3>

            <div className="space-y-3">
                <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm transition outline-none focus:border-sky-400 focus:bg-white"
                    placeholder="Nama peminta..."
                />

                <textarea
                    className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm transition outline-none placeholder:text-gray-400 focus:border-sky-400 focus:bg-white"
                    placeholder="Saya mencari CPU, RAM murah daerah Solo..."
                />
            </div>

            <div className="mt-3 flex justify-end">
                <button className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-600">
                    Kirim Request
                </button>
            </div>
        </div>
    );
}

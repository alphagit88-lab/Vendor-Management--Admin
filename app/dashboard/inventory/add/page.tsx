"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Search, Save, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Item {
  id: number;
  description_name: string;
  item_number: string;
  cost: number;
  vendor_cost: number;
}

export default function AddInventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form State
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.description_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity_changed: parseInt(quantity),
          type: 'RESTOCK',
          notes: notes || 'Direct Inventory Addition',
          unit_cost: parseFloat(unitCost)
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: `Stock added successfully for ${selectedItem.description_name}` });
        // Reset form
        setSelectedItem(null);
        setQuantity('');
        setUnitCost('');
        setNotes('');
        setSearchTerm('');
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to update inventory' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            Back to Inventory
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <PlusCircle className="w-6 h-6 text-indigo-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Stock</h1>
          </div>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
          status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-medium text-[15px]">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Step 1: Search & Select */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">1. Select Product</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all w-full max-w-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="p-2 max-h-100 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-4">
                <RefreshCw className="w-8 h-8 animate-spin" strokeWidth={1.5} />
                <p className="font-medium">Loading items catalog...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic">No items found matching your search.</div>
            ) : (
              <div className="grid gap-1">
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                        setSelectedItem(item);
                        setUnitCost((item.vendor_cost > 0 ? item.vendor_cost : item.cost).toString());
                    }}
                    className={`flex flex-col text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedItem?.id === item.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-[15px]">{item.description_name}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            selectedItem?.id === item.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>#{item.item_number}</span>
                    </div>
                    <span className={`text-xs ${selectedItem?.id === item.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                      Catalog Cost: ${parseFloat((item.vendor_cost > 0 ? item.vendor_cost : item.cost).toString()).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
          <div className="p-6 border-b border-gray-50 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">2. Purchase Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {!selectedItem ? (
              <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4">
                <div className="p-3 bg-slate-50 rounded-full">
                    <Package className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Please select a product from the left list to continue.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Selected Product</label>
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 font-bold flex flex-col">
                        <span>{selectedItem.description_name}</span>
                        <span className="text-xs font-medium text-indigo-400 mt-1 uppercase tracking-wider">{selectedItem.item_number}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase QTY</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Unit Cost ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold"
                        value={unitCost}
                        onChange={e => setUnitCost(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Restock Notes</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Batch #452 from Main Supplier..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Total Value Addition</span>
                    <span className="text-xl font-black text-slate-900">
                        ${((parseFloat(quantity) || 0) * (parseFloat(unitCost) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !quantity || !unitCost}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-100 transition-all"
                  >
                    {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Confirm Stock Addition
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// Icon for step 2 empty state
function Package(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    )
}

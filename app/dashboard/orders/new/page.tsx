"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, Store, Package, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import Link from 'next/link';

export default function NewOrderPage() {
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const [shopsRes, itemsRes] = await Promise.all([
          fetch(`${API_URL}/shops`, { headers }),
          fetch(`${API_URL}/items`, { headers })
        ]);
        const [shopsData, itemsData] = await Promise.all([shopsRes.json(), itemsRes.json()]);
        if (shopsData.success) setShops(shopsData.data);
        if (itemsData.success) setItems(itemsData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const addItemToOrder = (item: any) => {
    const existing = orderItems.find(oi => oi.item_id === item.id);
    if (existing) {
      updateQuantity(item.id, existing.quantity + 1);
    } else {
      setOrderItems([...orderItems, {
        item_id: item.id,
        name: item.name,
        unit_price: item.price,
        quantity: 1,
        unit_discount: 0,
        unit_deposit: 0,
        subtotal: item.price
      }]);
    }
  };

  const updateQuantity = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    setOrderItems(orderItems.map(oi => {
      if (oi.item_id === itemId) {
        const subtotal = (oi.unit_price - oi.unit_discount + oi.unit_deposit) * newQty;
        return { ...oi, quantity: newQty, subtotal };
      }
      return oi;
    }));
  };

  const updateItemField = (itemId: number, field: string, value: number) => {
    setOrderItems(orderItems.map(oi => {
      if (oi.item_id === itemId) {
        const updated = { ...oi, [field]: value };
        updated.subtotal = (updated.unit_price - updated.unit_discount + updated.unit_deposit) * updated.quantity;
        return updated;
      }
      return oi;
    }));
  };

  const removeItem = (itemId: number) => {
    setOrderItems(orderItems.filter(oi => oi.item_id !== itemId));
  };

  const totalAmount = orderItems.reduce((acc, oi) => acc + oi.subtotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopId || orderItems.length === 0) {
      alert("Please select a shop and at least one item.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          shop_id: selectedShopId,
          notes,
          load_number: loadNumber,
          total_credits: totalCredits,
          total_deposit: totalDeposit,
          items: orderItems
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/orders');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/orders" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[30px] leading-none font-bold text-slate-900 tracking-tight">Generate New Order</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Map products to distribution nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Load Number</label>
                <input 
                  type="text"
                  value={loadNumber}
                  onChange={(e) => setLoadNumber(e.target.value)}
                  placeholder="e.g. 7606"
                  className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Branch/Shop Node</label>
                <select 
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition text-sm font-medium"
                >
                  <option value="">Choose location...</option>
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.account_id || s.id})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 min-h-100">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">2. Catalog Selection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/10 transition-all flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="text-blue-600 font-mono text-xs font-bold mt-1">${parseFloat(item.price).toFixed(2)} / unit</p>
                  </div>
                  <button 
                    onClick={() => addItemToOrder(item)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Area */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl sticky top-8 flex flex-col h-150">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
              {orderItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm italic">No items drafted yet.</p>
                </div>
              )}
              {orderItems.map(oi => (
                <div key={oi.item_id} className="bg-slate-800/50 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-sm text-slate-200 line-clamp-2">{oi.name}</h4>
                    <button onClick={() => removeItem(oi.item_id)} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3 bg-slate-900 rounded-lg px-2 py-1 border border-slate-700">
                      <button onClick={() => updateQuantity(oi.item_id, oi.quantity - 1)} className="p-1 hover:text-blue-400 text-slate-400 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold min-w-5 text-center">{oi.quantity}</span>
                      <button onClick={() => updateQuantity(oi.item_id, oi.quantity + 1)} className="p-1 hover:text-blue-400 text-slate-400 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase text-slate-500 font-bold">Disc</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={oi.unit_discount}
                          onChange={(e) => updateItemField(oi.item_id, 'unit_discount', parseFloat(e.target.value) || 0)}
                          className="w-12 bg-slate-800 border-none text-[11px] text-red-400 font-bold p-1 text-right focus:ring-0 rounded"
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase text-slate-500 font-bold">Dep</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={oi.unit_deposit}
                          onChange={(e) => updateItemField(oi.item_id, 'unit_deposit', parseFloat(e.target.value) || 0)}
                          className="w-12 bg-slate-800 border-none text-[11px] text-blue-400 font-bold p-1 text-right focus:ring-0 rounded"
                        />
                      </div>
                    </div>

                    <span className="font-bold text-blue-400 ml-2">${oi.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Total Credits</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-200 focus:ring-0"
                  />
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Total Deposit</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={totalDeposit}
                    onChange={(e) => setTotalDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-200 focus:ring-0"
                  />
                </div>
              </div>

              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Shipping notes or special instructions..."
                className="w-full bg-slate-800 border-none rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/50 mb-2 resize-none h-20"
              />
              <div className="flex justify-between items-end mb-4">
                <span className="text-slate-400 text-sm">Total Valuation</span>
                <span className="text-3xl font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={loading || orderItems.length === 0 || !selectedShopId}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                {loading ? "Processing..." : (
                  <>
                    Complete Order
                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Building2, MapPin, Phone, ChevronRight, Search, 
  Plus, Minus, X, ShoppingCart, Receipt, Package, CheckCircle2, History
} from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sale States
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [orderMeta, setOrderMeta] = useState({ notes: '', load_number: '', credits: 0, deposit: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Invoice View
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoiceData, setLastInvoiceData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [custRes, invRes] = await Promise.all([
        fetch(`${API_URL}/customers`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_URL}/inventory`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      const [custData, invData] = await Promise.all([custRes.json(), invRes.json()]);
      
      if (custData.success) setCustomers(custData.data);
      if (invData.success) {
        let user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Fallback: If user.id is missing, try to extract it from the token
        if (!user.id) {
          try {
            const token = localStorage.getItem('token');
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              user = { id: payload.id };
            }
          } catch (e) { console.error('Token Decode Error:', e); }
        }

        // Only show items that this salesperson has in their sub-inventory
        const filteredInv = invData.data.filter((item: any) => {
            const sub = (item.sub_inventories || []).find((s: any) => s.user_id == user.id);
            return sub && Number(sub.quantity) > 0;
        }).map((item: any) => {
            const sub = (item.sub_inventories || []).find((s: any) => s.user_id == user.id);
            return { ...item, salesperson_stock: Number(sub.quantity) };
        });
        setInventory(filteredInv);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToSale = (item: any) => {
    if (saleItems.some(i => i.item_id === item.id)) return;
    const unitPrice = Number(item.price || 0);
    const product = { 
        item_id: item.id, 
        name: item.item_name, 
        quantity: 1, 
        price: unitPrice, 
        subtotal: unitPrice,
        salesperson_stock: item.salesperson_stock
    };
    setSaleItems([...saleItems, product]);
  };

  const updateQty = (id: string, delta: number) => {
    setSaleItems(saleItems.map(item => {
        if (item.item_id === id) {
            const newQty = Math.max(1, Math.min(item.salesperson_stock, item.quantity + delta));
            return { ...item, quantity: newQty, subtotal: newQty * item.price };
        }
        return item;
    }));
  };

  const removeFromSale = (id: string) => {
    setSaleItems(saleItems.filter(i => i.item_id !== id));
  };

  const itemsTotal = saleItems.reduce((acc, si) => acc + si.subtotal, 0);
  const grandTotal = itemsTotal + Number(orderMeta.deposit) - Number(orderMeta.credits);

  const handleProcessSale = async () => {
    if (saleItems.length === 0) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          items: saleItems.map(i => ({
            item_id: i.item_id,
            quantity: i.quantity,
            price: i.price,
            subtotal: i.subtotal
          })),
          total_credits: Number(orderMeta.credits),
          total_deposit: Number(orderMeta.deposit),
          notes: `POS Sale to ${selectedCustomer.dba}`,
          load_number: orderMeta.load_number || 'POS'
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setLastInvoiceData({
           order: data.data,
           customer: selectedCustomer,
           items: [...saleItems],
           meta: {...orderMeta},
           total: grandTotal
        });
        
        setShowSaleModal(false);
        setSaleItems([]);
        setOrderMeta({ notes: '', load_number: '', credits: 0, deposit: 0 });
        setShowInvoice(true);
        fetchData();
      } else {
        alert(data.message || "Sale processing failed");
      }
    } catch (err) {
      alert("Error connecting to sales server");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-in fade-in duration-700 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-24 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
            <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none text-center">Syncing Local Stock & Accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sales Portal: Map View</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-wider text-xs">Direct procurement interface for assigned retailer networks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-lg bg-slate-50/50">ID: {customer.account_id}</span>
            </div>

            <div className="space-y-1 mb-6 relative z-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter truncate group-hover:text-indigo-700 transition-colors uppercase">{customer.dba || 'Unnamed Retailer'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide truncate">{customer.registered_company_name || 'No Registered Entity'}</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-50 relative z-10">
                <div className="flex items-center gap-3 text-slate-500">
                    <Phone className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">{customer.phone || 'NO CONTACT'}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-500">
                    <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold leading-relaxed line-clamp-2">{customer.address || 'LOCATION UNAVAILABLE'}</span>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between relative z-10">
                <span className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{customer.payment_type || 'COD'} TERMS</span>
                <button 
                    onClick={() => { setSelectedCustomer(customer); setShowSaleModal(true); }}
                    className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                >
                    Initiate Sale <ChevronRight className="w-3 h-3" />
                </button>
            </div>
          </div>
        ))}
      </div>

      {showSaleModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowSaleModal(false)} />
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[85vh] shadow-[0_20px_70px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            
            <div className="flex-1 flex flex-col bg-slate-50/50 border-r border-slate-100">
              <div className="p-8 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter transition-all">Select Products</h2>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">Personal Sub-Inventory Only</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sale targeting: {selectedCustomer.dba}</p>
              </div>

              <div className="p-6 overflow-y-auto flex-1 h-full scrollbar-thin scrollbar-thumb-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {inventory.map(item => (
                     <button 
                        key={item.id}
                        onClick={() => addToSale(item)}
                        className="p-4 bg-white border border-slate-100 rounded-3xl text-left hover:border-indigo-400 hover:shadow-lg transition-all group relative"
                     >
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-indigo-300 uppercase">Held: {item.salesperson_stock}</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-sm leading-tight uppercase line-clamp-2">{item.item_name}</h4>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-indigo-600 font-black text-lg">${Number(item.price || 0).toFixed(2)}</span>
                            <div className="p-1 px-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity">ADD</div>
                        </div>
                     </button>
                   ))}

                   {inventory.length === 0 && (
                     <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-slate-50 rounded-full">
                           <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-slate-900 uppercase">No Inventory Assigned</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Please contact admin to allocate products to your profile.</p>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-[400px] flex flex-col bg-white">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <ShoppingCart className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase">Order Summary</h3>
                  </div>
                  <button onClick={() => setShowSaleModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-300">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {saleItems.map(item => (
                    <div key={item.item_id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-800 uppercase line-clamp-1">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${item.price.toFixed(2)} each</span>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Total: ${item.subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 group/qty">
                            <button 
                                onClick={() => updateQty(item.item_id, 1)} 
                                className={`p-1 transition ${item.quantity >= item.salesperson_stock ? 'text-slate-200 cursor-not-allowed' : 'hover:text-indigo-600'}`}
                                disabled={item.quantity >= item.salesperson_stock}
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-black text-slate-900 leading-none">{item.quantity}</span>
                                <span className="text-[8px] font-black text-slate-300 uppercase mt-0.5">/ {item.salesperson_stock}</span>
                            </div>
                            <button onClick={() => updateQty(item.item_id, -1)} className="p-1 hover:text-rose-600 transition"><Minus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => removeFromSale(item.item_id)} className="p-2 text-slate-300 hover:text-rose-500 transition">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                  ))}
                  {saleItems.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-40">
                        <Receipt className="w-12 h-12 text-slate-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cart Entry Pipeline Empty</p>
                    </div>
                  )}
               </div>

               <div className="p-8 bg-slate-900 text-white space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Credit Memo (-)</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-rose-500"
                            value={orderMeta.credits || ''}
                            onChange={(e) => setOrderMeta({...orderMeta, credits: Number(e.target.value)})}
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Container Deposit (+)</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                            value={orderMeta.deposit || ''}
                            onChange={(e) => setOrderMeta({...orderMeta, deposit: Number(e.target.value)})}
                            placeholder="0"
                        />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Payable Total</span>
                        <span className="text-3xl font-black text-white tracking-tighter">${grandTotal.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleProcessSale}
                        disabled={saleItems.length === 0 || isProcessing}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/50 transition transform active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        {isProcessing ? 'Generating Official Invoice...' : 'Submit Sale & Generate Bill'}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {showInvoice && lastInvoiceData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl" />
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col p-12 transition-all">
            
            <div className="flex border-b border-slate-100 pb-10 mb-10 justify-between items-start">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow shadow-indigo-100">
                        <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">Official Invoice</h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lastInvoiceData.order.order_number}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">Customer Entry</p>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{lastInvoiceData.customer.dba}</h3>
                    <p className="text-xs font-bold text-slate-400 max-w-xs">{lastInvoiceData.customer.address}</p>
                  </div>
               </div>
               <div className="text-right space-y-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-widest self-end">Confirmed (COD)</span>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date().toLocaleString()}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
                <table className="w-full text-left font-sans">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Item Description</th>
                        <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Qty</th>
                        <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Unit</th>
                        <th className="pb-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Subtotal</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {lastInvoiceData.items.map((item: any) => (
                      <tr key={item.item_id}>
                        <td className="py-4 text-xs font-black text-slate-700 uppercase">{item.name}</td>
                        <td className="py-4 text-sm font-black text-slate-900 text-center">{item.quantity}</td>
                        <td className="py-4 text-xs font-bold text-slate-400 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-sm font-black text-slate-900 text-right font-mono">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-slate-50 rounded-3xl p-8 space-y-3">
                   <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                      <span>Itemized Subtotal</span>
                      <span>${lastInvoiceData.items.reduce((acc: number, i: any) => acc + i.subtotal, 0).toFixed(2)}</span>
                   </div>
                   {Number(lastInvoiceData.meta.deposit) > 0 && (
                     <div className="flex justify-between items-center text-xs text-emerald-600 font-bold uppercase tracking-widest">
                        <span>Container Deposits (+)</span>
                        <span>${Number(lastInvoiceData.meta.deposit).toFixed(2)}</span>
                     </div>
                   )}
                   {Number(lastInvoiceData.meta.credits) > 0 && (
                     <div className="flex justify-between items-center text-xs text-rose-600 font-bold uppercase tracking-widest">
                        <span>Credit Memos (-)</span>
                        <span>-${Number(lastInvoiceData.meta.credits).toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Net Invoice Payload</span>
                      <span className="text-3xl font-black text-indigo-600">${lastInvoiceData.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                   </div>
                </div>
            </div>

            <div className="mt-10 flex gap-4 no-print">
               <button onClick={() => setShowInvoice(false)} className="flex-1 py-5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition">Close Document & Finish</button>
               <button onClick={() => window.print()} className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition flex items-center justify-center gap-2">
                 Print Invoice / Get PDF
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

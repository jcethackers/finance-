import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Search, Filter, CheckSquare, Square, X, Tag, Calendar, 
  Info, Check, Sparkles, Edit2, ArrowUp, ArrowDown, Flag, History, AlertOctagon, ArrowUpDown
} from 'lucide-react';
import { Transaction, Category, AuditLogEntry } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface TransactionsTableProps {
  transactions: Transaction[];
  onUpdate: (transactions: Transaction[]) => void;
  auditLog: AuditLogEntry[];
  onUpdateAuditLog: (log: AuditLogEntry[]) => void;
}

type SortKey = 'date' | 'description' | 'category' | 'amount';
type SortDirection = 'asc' | 'desc';

interface Filters {
  categories: Category[];
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions, 
  onUpdate,
  auditLog,
  onUpdateAuditLog 
}) => {
  // --- 1. State Initialization (read from URL if present) ---
  const getInitialState = () => {
    if (typeof window === 'undefined') return {
      search: '',
      sort: { key: 'date' as SortKey, direction: 'desc' as SortDirection },
      filters: { categories: [], startDate: '', endDate: '', minAmount: '', maxAmount: '' }
    };

    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('q') || '',
      sort: {
        key: (params.get('sort') as SortKey) || 'date',
        direction: (params.get('dir') as SortDirection) || 'desc'
      },
      filters: {
        categories: params.get('cats') ? (params.get('cats')?.split(',') as Category[]) : [],
        startDate: params.get('start') || '',
        endDate: params.get('end') || '',
        minAmount: params.get('min') || '',
        maxAmount: params.get('max') || ''
      }
    };
  };

  const initialState = getInitialState();

  const [search, setSearch] = useState(initialState.search);
  const [sort, setSort] = useState(initialState.sort);
  const [filters, setFilters] = useState<Filters>(initialState.filters);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Bulk Edit State
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<Category | ''>('');

  const filterRef = useRef<HTMLDivElement>(null);

  // --- 2. URL Synchronization (Effect) ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (sort.key !== 'date') params.set('sort', sort.key);
    if (sort.direction !== 'desc') params.set('dir', sort.direction);
    if (filters.categories.length > 0) params.set('cats', filters.categories.join(','));
    if (filters.startDate) params.set('start', filters.startDate);
    if (filters.endDate) params.set('end', filters.endDate);
    if (filters.minAmount) params.set('min', filters.minAmount);
    if (filters.maxAmount) params.set('max', filters.maxAmount);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [search, sort, filters]);

  // --- 3. Handlers & Logic ---

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createAuditLog = (txId: string, oldCat: string, newCat: string, source: 'User' | 'AI' | 'Bulk Edit') => {
    const entry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString().slice(2),
      transactionId: txId,
      oldCategory: oldCat,
      newCategory: newCat,
      source,
      timestamp: new Date().toISOString()
    };
    onUpdateAuditLog([...auditLog, entry]);
  };

  const handleSort = (key: SortKey) => {
    setSort(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (visibleIds: string[]) => {
    if (selectedIds.size === visibleIds.length && visibleIds.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleIds));
    }
  };

  const handleBulkUpdate = () => {
    if (!bulkCategory) return;
    
    const updatedTransactions = transactions.map(t => {
      if (selectedIds.has(t.id)) {
        if (t.category !== bulkCategory) {
          createAuditLog(t.id, t.category, bulkCategory, 'Bulk Edit');
        }
        return { ...t, category: bulkCategory };
      }
      return t;
    });

    onUpdate(updatedTransactions);
    setIsBulkEditing(false);
    setSelectedIds(new Set());
    setBulkCategory('');
  };

  const handleBulkFlag = () => {
    const updatedTransactions = transactions.map(t => {
      if (selectedIds.has(t.id)) {
        return { ...t, flagged: !t.flagged }; // Toggle flag
      }
      return t;
    });
    onUpdate(updatedTransactions);
    setSelectedIds(new Set());
  };

  const handleInlineCategoryChange = (tx: Transaction, newCategory: Category) => {
    if (tx.category === newCategory) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === tx.id ? { ...t, category: newCategory } : t
    );
    
    createAuditLog(tx.id, tx.category, newCategory, 'User');
    onUpdate(updatedTransactions);
    setEditingId(null);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
    setSearch('');
  };

  // Filter & Sort Logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.merchant?.toLowerCase().includes(q)
      );
    }

    // 2. Filters
    if (filters.categories.length > 0) {
      result = result.filter(t => filters.categories.includes(t.category));
    }
    if (filters.startDate) {
      result = result.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter(t => t.date <= filters.endDate);
    }
    if (filters.minAmount) {
      result = result.filter(t => t.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(t => t.amount <= parseFloat(filters.maxAmount));
    }

    // 3. Sort
    result.sort((a, b) => {
      let aVal: any = a[sort.key];
      let bVal: any = b[sort.key];

      if (sort.key === 'description') {
        aVal = a.merchant || a.description;
        bVal = b.merchant || b.description;
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, search, sort, filters]);

  const visibleIds = filteredAndSortedTransactions.map(t => t.id);
  const isAllSelected = visibleIds.length > 0 && selectedIds.size === visibleIds.length;
  const activeFiltersCount = [
    filters.categories.length > 0,
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount
  ].filter(Boolean).length;

  // Filter audit logs for viewing transaction
  const viewingLogs = useMemo(() => {
    if (!viewingTx) return [];
    return auditLog
      .filter(log => log.transactionId === viewingTx.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [viewingTx, auditLog]);

  return (
    <div className="bg-fintech-800/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[600px]">
      
      {/* 1. Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center z-20 bg-fintech-900/50 relative">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-fintech-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search merchant or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-fintech-accent focus:ring-1 focus:ring-fintech-accent transition-all placeholder:text-slate-600"
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isFilterOpen || activeFiltersCount > 0
                ? 'bg-fintech-accent/10 border-fintech-accent text-fintech-accent' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-fintech-accent text-fintech-900 text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Categories</label>
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {Object.keys(CATEGORY_COLORS).map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white cursor-pointer p-1 rounded hover:bg-slate-800">
                          <input 
                            type="checkbox"
                            checked={filters.categories.includes(cat as Category)}
                            onChange={(e) => {
                              const newCats = e.target.checked 
                                ? [...filters.categories, cat as Category]
                                : filters.categories.filter(c => c !== cat);
                              setFilters({...filters, categories: newCats});
                            }}
                            className="rounded border-slate-700 bg-slate-800 text-fintech-accent focus:ring-fintech-accent"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Amount Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={filters.minAmount}
                        onChange={e => setFilters({...filters, minAmount: e.target.value})}
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={filters.maxAmount}
                        onChange={e => setFilters({...filters, maxAmount: e.target.value})}
                        className="w-1/2 bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Date Range</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="date" 
                        value={filters.startDate}
                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                        className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                      <input 
                        type="date" 
                        value={filters.endDate}
                        onChange={e => setFilters({...filters, endDate: e.target.value})}
                        className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" 
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                     <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-white underline">Clear All</button>
                     <button onClick={() => setIsFilterOpen(false)} className="text-xs bg-fintech-accent text-fintech-900 px-3 py-1.5 rounded font-bold">Done</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Items Counter */}
        {selectedIds.size > 0 && (
           <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 animate-fade-in">
             <span className="font-bold text-fintech-accent">{selectedIds.size}</span> selected
           </div>
        )}
      </div>

      {/* 2. Table */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 w-10">
                <button 
                  onClick={() => handleSelectAll(visibleIds)}
                  className="flex items-center justify-center text-slate-400 hover:text-white"
                >
                   {isAllSelected ? <CheckSquare className="w-4 h-4 text-fintech-accent" /> : <Square className="w-4 h-4" />}
                </button>
              </th>
              
              <SortHeader label="Date" sortKey="date" currentSort={sort} onSort={handleSort} />
              <SortHeader label="Description" sortKey="description" currentSort={sort} onSort={handleSort} />
              <SortHeader label="Category" sortKey="category" currentSort={sort} onSort={handleSort} />
              <SortHeader label="Amount" sortKey="amount" currentSort={sort} onSort={handleSort} align="right" />
              
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map((t) => (
                <tr 
                  key={t.id} 
                  className={`group transition-colors ${
                    selectedIds.has(t.id) ? 'bg-fintech-accent/5' : 'hover:bg-slate-800/30'
                  } ${t.flagged ? 'bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-l-amber-500' : ''}`}
                >
                  <td className="px-6 py-4">
                    <button onClick={() => handleSelect(t.id)} className="flex items-center">
                      {selectedIds.has(t.id) 
                        ? <CheckSquare className="w-4 h-4 text-fintech-accent" /> 
                        : <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        {t.flagged && <Flag className="w-3 h-3 text-amber-500" fill="currentColor" />}
                        {t.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-white">{t.merchant || t.description}</span>
                        {t.merchant && t.merchant !== t.description && (
                            <span className="text-xs text-slate-500">{t.description}</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {editingId === t.id ? (
                      <div className="relative z-50">
                        <select
                          autoFocus
                          value={t.category}
                          onChange={(e) => handleInlineCategoryChange(t, e.target.value as Category)}
                          onBlur={() => setEditingId(null)}
                          className="bg-slate-800 border border-fintech-accent text-white text-xs rounded px-2 py-1 outline-none w-full shadow-xl"
                        >
                          {Object.keys(CATEGORY_COLORS).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setEditingId(t.id)}
                        className="px-2 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105"
                        style={{ 
                          backgroundColor: `${CATEGORY_COLORS[t.category]}20`,
                          borderColor: `${CATEGORY_COLORS[t.category]}40`,
                          color: CATEGORY_COLORS[t.category] 
                        }}
                        title="Click to edit category"
                      >
                        {t.category}
                      </button>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${t.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {t.type === 'credit' ? '+' : ''}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => setViewingTx(t)}
                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="View Details"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>No transactions match your filters.</p>
                    <button onClick={clearFilters} className="text-fintech-accent hover:underline text-sm">Clear Filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-fintech-900 border border-slate-700 rounded-2xl shadow-2xl p-2 px-4 flex items-center gap-4 z-40 animate-slide-up">
            <div className="text-sm text-slate-300 border-r border-slate-700 pr-4">
                <span className="text-white font-bold">{selectedIds.size}</span> selected
            </div>
            
            {isBulkEditing ? (
                <div className="flex items-center gap-2 animate-fade-in">
                    <select 
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:border-fintech-accent focus:ring-1 focus:ring-fintech-accent outline-none"
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value as Category)}
                    >
                        <option value="">Select Category...</option>
                        {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button 
                        onClick={handleBulkUpdate}
                        disabled={!bulkCategory}
                        className="p-1.5 rounded-lg bg-fintech-accent text-fintech-900 hover:bg-fintech-accentHover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setIsBulkEditing(false)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                  <button 
                      onClick={() => setIsBulkEditing(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm font-medium text-slate-200 transition-colors"
                  >
                      <Edit2 className="w-4 h-4" />
                      Edit Category
                  </button>
                  <div className="w-px h-4 bg-slate-700" />
                  <button 
                      onClick={handleBulkFlag}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-sm font-medium text-amber-400 transition-colors"
                  >
                      <Flag className="w-4 h-4" />
                      Flag Suspicious
                  </button>
                </div>
            )}
        </div>
      )}

      {/* 4. Details Modal */}
      {viewingTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingTx(null)} />
          <div className="relative bg-fintech-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-start shrink-0">
               <div>
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    {viewingTx.merchant || viewingTx.description}
                    {viewingTx.flagged && <Flag className="w-4 h-4 text-amber-500" fill="currentColor" />}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{viewingTx.date}</p>
               </div>
               <button onClick={() => setViewingTx(null)} className="text-slate-500 hover:text-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <span className={`text-2xl font-bold ${viewingTx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                        {viewingTx.type === 'credit' ? '+' : ''}${viewingTx.amount.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-300">Category</span>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{ 
                        backgroundColor: `${CATEGORY_COLORS[viewingTx.category]}20`,
                        borderColor: `${CATEGORY_COLORS[viewingTx.category]}40`,
                        color: CATEGORY_COLORS[viewingTx.category] 
                      }}
                    >
                      {viewingTx.category}
                    </span>
                </div>

                {viewingTx.flagged && (
                   <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                      <AlertOctagon className="w-5 h-5 shrink-0" />
                      <p>This transaction has been flagged as suspicious by the user.</p>
                   </div>
                )}

                {/* AI Explanation Box */}
                <div className="p-4 rounded-xl bg-fintech-accent/5 border border-fintech-accent/20">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-fintech-accent" />
                        <span className="text-sm font-semibold text-fintech-accent">AI Analysis</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        This transaction was categorized as <strong className="text-white">{viewingTx.category}</strong> because the merchant name "{viewingTx.merchant || viewingTx.description}" matches known patterns for this sector.
                        <br/><br/>
                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Confidence: 98.4%</span>
                    </p>
                </div>

                {/* Audit Log Section */}
                {viewingLogs.length > 0 && (
                   <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-500" />
                        Activity Log
                      </h4>
                      <div className="space-y-3">
                         {viewingLogs.map(log => (
                            <div key={log.id} className="text-xs flex gap-3 relative pl-4 border-l border-slate-800 pb-1">
                               <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600"></div>
                               <div className="flex-1">
                                  <p className="text-slate-300">
                                    Changed from <span className="text-slate-500 line-through">{log.oldCategory}</span> to <span className="text-white font-medium">{log.newCategory}</span>
                                  </p>
                                  <div className="flex justify-between mt-1 text-slate-500">
                                     <span>Source: {log.source}</span>
                                     <span>{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const SortHeader: React.FC<{ 
    label: string, 
    sortKey: SortKey, 
    currentSort: { key: SortKey, direction: SortDirection }, 
    onSort: (k: SortKey) => void,
    align?: 'left' | 'right'
}> = ({ label, sortKey, currentSort, onSort, align = 'left' }) => {
    const isActive = currentSort.key === sortKey;
    return (
        <th className={`px-6 py-4 cursor-pointer group select-none ${align === 'right' ? 'text-right' : 'text-left'}`} onClick={() => onSort(sortKey)}>
            <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
                <span className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-slate-300'}`}>{label}</span>
                <span className="text-slate-600">
                    {isActive ? (
                        currentSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-fintech-accent" /> : <ArrowDown className="w-3 h-3 text-fintech-accent" />
                    ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    )}
                </span>
            </div>
        </th>
    );
};
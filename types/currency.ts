export interface CurrencyState {
     selectedCurrency: string;
     currencies: string[];
     exchangeRates: Record<string, number>;
     isLoading: boolean;
     error: string | null;
}

export type CurrencyActions = {
     setSelectedCurrency: (currencySymbol: string) => void;
     getSelectedCurrencyInfo: () => CurrencyOption | undefined;
     fetchExchangeRates: () => Promise<void>;
     convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
     formatCurrency: (amount: number, currencySymbol?: string) => string;
     clearError: () => void;
     getAllCurrencies: () => CurrencyOption[];
};

export type CurrencyOption = {
     code: string;
     name: string;
     symbol: string;
     region: string;
};

export interface Receipt {
     id: number;
     expense_id: number;
     amount: number;
     currency: string;
     description: string;
     date: string;
     receipt_url?: string;
     receipt_confirmed?: boolean;
     status: 'pending' | 'approved' | 'rejected' | 'completed';
     created_at: string;
     updated_at: string;
     // Additional fields
     parent_id?: number;
     payment_method?: string;
     category?: string;
}

export interface ReceiptsState {
     receipts: Receipt[];
     isLoading: boolean;
     error: string | null;
}

export interface ReceiptsActions {
     fetchReceiptsByExpenseId: (expenseId: number) => Promise<Receipt[]>;
     fetchAllReceipts: () => Promise<void>;
     addReceipt: (receipt: Omit<Receipt, 'id' | 'created_at' | 'updated_at'>) => Promise<Receipt>;
     updateReceipt: (id: number, updates: Partial<Receipt>) => Promise<void>;
     deleteReceipt: (id: number) => Promise<void>;
     confirmReceipt: (id: number) => Promise<void>;
     rejectReceipt: (id: number) => Promise<void>;
     clearError: () => void;
}
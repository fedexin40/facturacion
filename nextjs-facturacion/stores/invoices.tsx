import { create } from 'zustand';

export interface invoiceDetails {
  rfc: string;
  name: string;
  orderNumber: string;
  email?: string;
  zip: string;
  regimenFiscal: string;
  usoCFDI: string,
  formaPago: string
}

interface invoice extends invoiceDetails {
  actions: {
    // eslint-disable-next-line no-unused-vars
    setInvoiceDetails: (invoice: invoiceDetails) => void;
  };
}

interface invoiceError {
  errorMessage: string;
  Error: boolean;
  actions: {
    openError: () => void;
    closeError: () => void;
    // eslint-disable-next-line no-unused-vars
    setErrorMessage: (message: string) => void;
  }
}

interface Email {
  open: boolean;
  actions: {
    openEmail: () => void;
    closeEmail: () => void;
  }
}

const useInvoiceDetails = create<invoice>()((set) => ({
  rfc: '',
  name: '',
  orderNumber: '',
  email: '',
  emailConfirmation: '',
  zip: '',
  regimenFiscal: '',
  usoCFDI: '',
  formaPago: '',
  actions: {
    setInvoiceDetails: (invoice: invoiceDetails) =>
      set({
        rfc: invoice.rfc,
        name: invoice.name,
        orderNumber: invoice.orderNumber,
        email: invoice.email,
        zip: invoice.zip,
        regimenFiscal: invoice.regimenFiscal,
        usoCFDI: invoice.usoCFDI,
        formaPago: invoice.formaPago
      }),
  },
}));

const useInvoiceError = create<invoiceError>()((set) => ({
  Error: false,
  errorMessage: '',
  actions: {
    openError: () => set({ Error: true }),
    closeError: () => set({ Error: false }),
    setErrorMessage: (message) => set({ errorMessage: message }),
  },
}));


const email = create<Email>()((set) => ({
  open: false,
  actions: {
    openEmail: () => set({ open: true }),
    closeEmail: () => set({ open: false }),
  }
}))

export const useInvoiceDetailsActions = () => useInvoiceDetails((state) => state.actions);
export const useDetailsInvoice = () => useInvoiceDetails((state) => state);
export const useInvoiceErrorActions = () => useInvoiceError((state) => state.actions);
export const useErrorInvoice = () => useInvoiceError((state) => state)
export const useEmail = () => email((state) => state);
export const useEmailActions = () => email((state: any) => state.actions);
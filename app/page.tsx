// app/page.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import './styles.css';

// ==================== Types ====================
interface ProductRow {
  particulars: string;
  qty: number;
  unitPrice: number;
}

interface QuotationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  projectName: string;
  validUntil: string;
  notes: string;
}

type ActiveView = 'delivery' | 'quotation' | 'receipt' | 'invoice';

// Currency formatter for Ugandan Shilling
const formatUGX = (amount: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Default product sets for each section
const defaultDeliveryProducts: ProductRow[] = [
  { particulars: 'Dar Paint Premium Gloss Enamel - White (20L)', qty: 5, unitPrice: 185000 },
  { particulars: 'Dar Paint Acrylic Emulsion - Matt (15L)', qty: 8, unitPrice: 165000 },
  { particulars: 'Dar Paint Epoxy Primer (5L set)', qty: 3, unitPrice: 245000 },
];

const defaultQuotationProducts: ProductRow[] = [
  { particulars: 'Dar Paint Premium Gloss Enamel - White (20L)', qty: 5, unitPrice: 185000 },
  { particulars: 'Dar Paint Acrylic Emulsion - Matt (15L)', qty: 8, unitPrice: 165000 },
  { particulars: 'Dar Paint Epoxy Primer (5L set)', qty: 3, unitPrice: 245000 },
];

const defaultReceiptProducts: ProductRow[] = [
  { particulars: 'Dar Paint Premium Gloss Enamel - White (20L)', qty: 5, unitPrice: 185000 },
  { particulars: 'Dar Paint Acrylic Emulsion - Matt (15L)', qty: 8, unitPrice: 165000 },
  { particulars: 'Dar Paint Epoxy Primer (5L set)', qty: 3, unitPrice: 245000 },
];

const defaultInvoiceProducts: ProductRow[] = [
  { particulars: 'Dar Paint Premium Gloss Enamel - White (20L)', qty: 5, unitPrice: 185000 },
  { particulars: 'Dar Paint Acrylic Emulsion - Matt (15L)', qty: 8, unitPrice: 165000 },
  { particulars: 'Dar Paint Epoxy Primer (5L set)', qty: 3, unitPrice: 245000 },
];

// ==================== Main Component ====================
export default function AllDocumentsPage() {
  const [activeView, setActiveView] = useState<ActiveView>('delivery');
  const [isMounted, setIsMounted] = useState(false);
  
  // Refs for each document type
  const deliveryRef = useRef<HTMLDivElement>(null);
  const quotationRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // ---- Delivery Note State ----
  const [deliveryProducts, setDeliveryProducts] = useState<ProductRow[]>(defaultDeliveryProducts);
  const [deliveryNumber, setDeliveryNumber] = useState('DN-2409-001');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [address, setAddress] = useState('Kampala, Uganda');
  const [orderRef, setOrderRef] = useState('PO-2456/DAH');
  const [vehiclePlate, setVehiclePlate] = useState('UBA 123K');
  const [deliveredBy, setDeliveredBy] = useState('darPaint');
  const [receivedBy, setReceivedBy] = useState('darPaint');
  const [customerName, setCustomerName] = useState('Name of customer');

  // ---- Quotation State ----
  const [quotationProducts, setQuotationProducts] = useState<ProductRow[]>(defaultQuotationProducts);
  const [quotationData, setQuotationData] = useState<QuotationFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    projectName: '',
    validUntil: '',
    notes: '',
  });
  const [showQuotationPreview, setShowQuotationPreview] = useState(false);

  // ---- Receipt State ----
  const [receiptProducts, setReceiptProducts] = useState<ProductRow[]>(defaultReceiptProducts);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [receiptCustomerName, setReceiptCustomerName] = useState('darPaint');
  const [receiptCustomerPhone, setReceiptCustomerPhone] = useState('+256 702 096 737');

  // ---- Invoice State ----
  const [invoiceProducts, setInvoiceProducts] = useState<ProductRow[]>(defaultInvoiceProducts);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [bankDetails, setBankDetails] = useState('Bank of Uganda | Account: 1234567890 | Branch: Kampala Road');
  
  const [billToName, setBillToName] = useState('darPaint');
  const [billToAddress, setBillToAddress] = useState('Kampala, Uganda');
  const [billToPhone, setBillToPhone] = useState('+256 702 096 737');
  const [billToEmail, setBillToEmail] = useState('darpaint@gmail.com');
  
  const [fromCompany, setFromCompany] = useState('Dar Paint SMC Ltd');
  const [fromAddress, setFromAddress] = useState('Katwe Market, Kayemba Road | P.O Box Kampala, Kampala, Uganda');
  const [fromPhone, setFromPhone] = useState('+256 702 096 737');
  const [fromEmail, setFromEmail] = useState('darpaint@gmail.com');
  const [fromTin, setFromTin] = useState('1000123456');

  // Set initial dates after mount
  useEffect(() => {
    setIsMounted(true);
    if (!deliveryDate) setDeliveryDate(new Date().toISOString().split('T')[0]);
    if (!receiptNumber) setReceiptNumber(`RCP-${Date.now().toString().slice(-8)}`);
    if (!receiptDate) setReceiptDate(new Date().toISOString().split('T')[0]);
    if (!invoiceNumber) setInvoiceNumber(`INV-${Date.now().toString().slice(-8)}`);
    if (!invoiceDate) setInvoiceDate(new Date().toISOString().split('T')[0]);
    if (!dueDate) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setDueDate(date.toISOString().split('T')[0]);
    }
  }, []);

  // Computed Totals
  const deliveryTotal = deliveryProducts.reduce((sum, row) => sum + row.qty * row.unitPrice, 0);
  const quotationTotal = quotationProducts.reduce((sum, row) => sum + row.qty * row.unitPrice, 0);
  const receiptTotal = receiptProducts.reduce((sum, row) => sum + row.qty * row.unitPrice, 0);
  const invoiceTotal = invoiceProducts.reduce((sum, row) => sum + row.qty * row.unitPrice, 0);

  // ==================== Print Function ====================
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // ==================== Handlers ====================
  const updateDeliveryRow = useCallback((index: number, field: keyof ProductRow, value: string | number) => {
    setDeliveryProducts((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: field === 'qty' || field === 'unitPrice' ? Number(value) : value } : row
      )
    );
  }, []);

  const addDeliveryRow = useCallback(() => {
    if (deliveryProducts.length < 6) {
      setDeliveryProducts((prev) => [...prev, { particulars: 'New Item', qty: 1, unitPrice: 0 }]);
    } else {
      alert('Maximum 6 items to keep document on one page');
    }
  }, [deliveryProducts.length]);

  const removeDeliveryRow = useCallback((index: number) => {
    if (deliveryProducts.length > 1) {
      setDeliveryProducts((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert('At least one line item is required');
    }
  }, [deliveryProducts.length]);

  const updateQuotationRow = useCallback((index: number, field: keyof ProductRow, value: string | number) => {
    setQuotationProducts((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: field === 'qty' || field === 'unitPrice' ? Number(value) : value } : row
      )
    );
  }, []);

  const addQuotationRow = useCallback(() => {
    if (quotationProducts.length < 6) {
      setQuotationProducts((prev) => [...prev, { particulars: 'New Item', qty: 1, unitPrice: 0 }]);
    } else {
      alert('Maximum 6 items to keep document on one page');
    }
  }, [quotationProducts.length]);

  const removeQuotationRow = useCallback((index: number) => {
    if (quotationProducts.length > 1) {
      setQuotationProducts((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert('At least one line item is required');
    }
  }, [quotationProducts.length]);

  const updateReceiptRow = useCallback((index: number, field: keyof ProductRow, value: string | number) => {
    setReceiptProducts((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: field === 'qty' || field === 'unitPrice' ? Number(value) : value } : row
      )
    );
  }, []);

  const addReceiptRow = useCallback(() => {
    if (receiptProducts.length < 6) {
      setReceiptProducts((prev) => [...prev, { particulars: 'New Item', qty: 1, unitPrice: 0 }]);
    } else {
      alert('Maximum 6 items to keep document on one page');
    }
  }, [receiptProducts.length]);

  const removeReceiptRow = useCallback((index: number) => {
    if (receiptProducts.length > 1) {
      setReceiptProducts((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert('At least one line item is required');
    }
  }, [receiptProducts.length]);

  const updateInvoiceRow = useCallback((index: number, field: keyof ProductRow, value: string | number) => {
    setInvoiceProducts((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: field === 'qty' || field === 'unitPrice' ? Number(value) : value } : row
      )
    );
  }, []);

  const addInvoiceRow = useCallback(() => {
    if (invoiceProducts.length < 6) {
      setInvoiceProducts((prev) => [...prev, { particulars: 'New Item', qty: 1, unitPrice: 0 }]);
    } else {
      alert('Maximum 6 items to keep document on one page');
    }
  }, [invoiceProducts.length]);

  const removeInvoiceRow = useCallback((index: number) => {
    if (invoiceProducts.length > 1) {
      setInvoiceProducts((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert('At least one line item is required');
    }
  }, [invoiceProducts.length]);

  const updateQuotationField = (field: keyof QuotationFormData, value: string) => {
    setQuotationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotationData.customerName || !quotationData.projectName) {
      alert('Please fill in Customer Name and Project Name');
      return;
    }
    setShowQuotationPreview(true);
  };

  const resetAll = useCallback(() => {
    // Delivery Note
    setDeliveryNumber('DN-2409-001');
    setDeliveryDate(new Date().toISOString().split('T')[0]);
    setAddress('Katwe Market, Kayemba Road | P.O Box Kampala');
    setOrderRef('PO-2456/DAR');
    setVehiclePlate('UBA 123K');
    setDeliveredBy('darPaint');
    setReceivedBy('darPaint');
    setCustomerName('darPaint');
    setDeliveryProducts(defaultDeliveryProducts);
    
    // Quotation
    setQuotationProducts(defaultQuotationProducts);
    setQuotationData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      projectName: '',
      validUntil: '',
      notes: '',
    });
    setShowQuotationPreview(false);
    
    // Receipt
    setReceiptProducts(defaultReceiptProducts);
    setReceiptNumber(`RCP-${Date.now().toString().slice(-8)}`);
    setReceiptDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Cash');
    setPaymentStatus('Paid');
    setReceiptCustomerName('darPaint');
    setReceiptCustomerPhone('+256 702 096 737');
    
    // Invoice
    setInvoiceProducts(defaultInvoiceProducts);
    setInvoiceNumber(`INV-${Date.now().toString().slice(-8)}`);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setDueDate(date.toISOString().split('T')[0]);
    setBankDetails('Bank of Uganda | Account: 1234567890 | Branch: Kampala Road');
    setBillToName('darPaint');
    setBillToAddress('Kampala, Uganda');
    setBillToPhone('+256 702 096 737');
    setBillToEmail('darpaint@gmail.com');
    setFromCompany('Dar Paint SMC Ltd');
  }, []);

  // ==================== Render Functions ====================
  const renderProductTable = (
    products: ProductRow[],
    updateRow: (index: number, field: keyof ProductRow, value: string | number) => void,
    removeRow: (index: number) => void,
    addRow: () => void,
    editable: boolean,
    total: number
  ) => (
    <>
      <div className="table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>Particulars</th>
              <th style={{ width: '100px' }}>Unit Price (UGX)</th>
              <th style={{ width: '60px' }}>Qty</th>
              <th style={{ width: '100px' }}>Total (UGX)</th>
              {editable && <th style={{ width: '30px' }}></th>}
            </tr>
          </thead>
          <tbody>
            {products.map((row, idx) => {
              const lineTotal = row.qty * row.unitPrice;
              return (
                <tr key={idx}>
                  <td style={{ fontWeight: '500' }}>{idx + 1}</td>
                  <td>
                    {editable ? (
                      <input
                        type="text"
                        value={row.particulars}
                        onChange={(e) => updateRow(idx, 'particulars', e.target.value)}
                        className="item-input"
                        placeholder="Product name"
                      />
                    ) : (
                      row.particulars
                    )}
                  </td>
                  <td>
                    {editable ? (
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={row.unitPrice}
                        onChange={(e) => updateRow(idx, 'unitPrice', e.target.value)}
                        className="price-input"
                      />
                    ) : (
                      formatUGX(row.unitPrice)
                    )}
                  </td>
                  <td className="qty-cell">
                    {editable ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={row.qty}
                        onChange={(e) => updateRow(idx, 'qty', e.target.value)}
                        className="qty-input"
                      />
                    ) : (
                      row.qty
                    )}
                  </td>
                  <td className="total-cell">{formatUGX(lineTotal)}</td>
                  {editable && (
                    <td>
                      <button className="remove-row" onClick={() => removeRow(idx)} title="Remove item">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL</td>
              <td style={{ fontWeight: 800, background: '#fef5e7' }}>{formatUGX(total)}</td>
              {editable && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
      {editable && (
        <button className="add-row-btn" onClick={addRow}>
          <i className="fas fa-plus-circle"></i> Add line item
        </button>
      )}
    </>
  );

  const renderDocumentHeader = (badgeIcon: string, badgeText: string) => (
    <div className="note-header">
      <div className="brand">
        <h1>Dar <span>Paint</span> SMC Ltd</h1>
        <p>Industrial Coatings & Factory Supplies - Kampala, Uganda</p>
        <p style={{ fontSize: '0.7rem', marginTop: '2px' }}>
          <i className="fas fa-map-marker-alt"></i> Katwe Market, Kayemba Road | P.O Box Kampala | Tel: +256 702 096 737
        </p>
      </div>
      <div className="doc-badge">
        <i className={`fas ${badgeIcon}`}></i> {badgeText}
      </div>
    </div>
  );

  if (!isMounted) {
    return (
      <div className="app-container">
        <div className="document-card">
          <div className="compact-content">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Print Options - Only Print/Save as PDF */}
      <div className="pdf-options-bar no-print">
        <div className="options-header">
          <i className="fas fa-print"></i> Print Options
        </div>
        <div className="options-buttons">
          <button className="option-btn print-btn" onClick={handlePrint}>
            <i className="fas fa-print"></i> Print / Save as PDF
            <span className="recommended-badge">Best Quality</span>
          </button>
        </div>
        <div className="quality-note">
          <i className="fas fa-info-circle"></i> On mobile, select "Save as PDF" or "Save to Files" from the print dialog
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons no-print">
        <button className={`toggle-btn ${activeView === 'delivery' ? 'active' : ''}`} onClick={() => setActiveView('delivery')}>
          <i className="fas fa-truck"></i> Delivery Note
        </button>
        <button className={`toggle-btn ${activeView === 'quotation' ? 'active' : ''}`} onClick={() => setActiveView('quotation')}>
          <i className="fas fa-file-invoice"></i> Quotation
        </button>
        <button className={`toggle-btn ${activeView === 'receipt' ? 'active' : ''}`} onClick={() => setActiveView('receipt')}>
          <i className="fas fa-receipt"></i> Receipt
        </button>
        <button className={`toggle-btn ${activeView === 'invoice' ? 'active' : ''}`} onClick={() => setActiveView('invoice')}>
          <i className="fas fa-file-invoice-dollar"></i> Invoice
        </button>
      </div>

      {/* Delivery Note View */}
      {activeView === 'delivery' && deliveryDate && (
        <div ref={deliveryRef}>
          <div className="document-card print-one-page">
            {renderDocumentHeader('fa-truck-fast', 'DELIVERY NOTE')}
            <div className="compact-content">
              <div className="compact-grid">
                <div className="compact-field">
                  <label>Delivery Note No.</label>
                  <input type="text" value={deliveryNumber} onChange={(e) => setDeliveryNumber(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Date</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Delivery Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Order Ref.</label>
                  <input type="text" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Vehicle Plate</label>
                  <input type="text" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Customer</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </div>
              </div>

              {renderProductTable(deliveryProducts, updateDeliveryRow, removeDeliveryRow, addDeliveryRow, true, deliveryTotal)}

              <div className="compact-signatures">
                <div className="compact-sign">
                  <label>DELIVERED BY</label>
                  <input type="text" className="sign-input" value={deliveredBy} onChange={(e) => setDeliveredBy(e.target.value)} />
                </div>
                <div className="compact-sign">
                  <label>RECEIVED BY</label>
                  <input type="text" className="sign-input" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation View */}
      {activeView === 'quotation' && (
        <div className="quotation-view">
          <div className="quotation-section no-print">
            <div className="section-header">
              <h2><i className="fas fa-file-invoice"></i> Quotation Form</h2>
              <p>Fill in customer details and generate a professional quotation</p>
            </div>

            <form onSubmit={handleQuotationSubmit} className="quotation-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>Quotation To: (Customer Name) *</label>
                  <input type="text" value={quotationData.customerName} onChange={(e) => updateQuotationField('customerName', e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Project Name *</label>
                  <input type="text" value={quotationData.projectName} onChange={(e) => updateQuotationField('projectName', e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Date</label>
                  <input type="date" value={quotationData.validUntil || new Date().toISOString().split('T')[0]} onChange={(e) => updateQuotationField('validUntil', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Customer Email</label>
                  <input type="email" value={quotationData.customerEmail} onChange={(e) => updateQuotationField('customerEmail', e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Customer Phone</label>
                  <input type="tel" value={quotationData.customerPhone} onChange={(e) => updateQuotationField('customerPhone', e.target.value)} />
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea value={quotationData.notes} onChange={(e) => updateQuotationField('notes', e.target.value)} rows={2} />
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Products / Services</label>
                {renderProductTable(quotationProducts, updateQuotationRow, removeQuotationRow, addQuotationRow, true, quotationTotal)}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary"><i className="fas fa-eye"></i> Preview Quotation</button>
              </div>
            </form>
          </div>

          {showQuotationPreview && quotationData.customerName && (
            <div ref={quotationRef}>
              <div className="document-card print-one-page">
                {renderDocumentHeader('fa-file-invoice', 'QUOTATION')}
                <div className="compact-content">
                  <div className="quotation-customer-info">
                    <div>
                      <p><strong>Quotation To:</strong> {quotationData.customerName}</p>
                      <p><strong>Project:</strong> {quotationData.projectName}</p>
                      <p><strong>Date:</strong> {quotationData.validUntil || new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      {quotationData.customerPhone && <p><strong>Phone:</strong> {quotationData.customerPhone}</p>}
                      {quotationData.customerEmail && <p><strong>Email:</strong> {quotationData.customerEmail}</p>}
                    </div>
                  </div>

                  {renderProductTable(quotationProducts, updateQuotationRow, removeQuotationRow, addQuotationRow, false, quotationTotal)}

                  {quotationData.notes && (
                    <div className="compact-notes">
                      <strong>Notes:</strong> {quotationData.notes}
                    </div>
                  )}

                  <div className="compact-signatures">
                    <div className="compact-sign">
                      <label>FOR Dar Paint SMC Ltd</label>
                      <div className="sign-line"><span>(Authorized Signature)</span></div>
                    </div>
                    <div className="compact-sign">
                      <label>CUSTOMER ACCEPTANCE</label>
                      <div className="sign-line"><span>(Signature & Date)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt View */}
      {activeView === 'receipt' && receiptDate && receiptNumber && (
        <div ref={receiptRef}>
          <div className="document-card print-one-page">
            {renderDocumentHeader('fa-receipt', 'OFFICIAL RECEIPT')}
            <div className="compact-content">
              <div className="compact-grid">
                <div className="compact-field">
                  <label>Receipt No.</label>
                  <input type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Date</label>
                  <input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Received From</label>
                  <input type="text" value={receiptCustomerName} onChange={(e) => setReceiptCustomerName(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Phone</label>
                  <input type="text" value={receiptCustomerPhone} onChange={(e) => setReceiptCustomerPhone(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="select-input">
                    <option>Cash</option><option>Bank Transfer</option><option>Mobile Money</option><option>Cheque</option>
                  </select>
                </div>
                <div className="compact-field">
                  <label>Status</label>
                  <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="select-input">
                    <option>Paid</option><option>Partial</option><option>Pending</option>
                  </select>
                </div>
              </div>

              {renderProductTable(receiptProducts, updateReceiptRow, removeReceiptRow, addReceiptRow, true, receiptTotal)}

              <div className="receipt-summary">
                <div><strong>Amount Paid:</strong> {formatUGX(receiptTotal)}</div>
                <div><strong>Method:</strong> {paymentMethod}</div>
                <div><strong>Status:</strong> <span className="status-badge">{paymentStatus}</span></div>
              </div>

              <div className="compact-signatures">
                <div className="compact-sign">
                  <label>CASHIER</label>
                  <input type="text" className="sign-input" placeholder="Cashier name" defaultValue="DarPaint" />
                </div>
                <div className="compact-sign">
                  <label>CUSTOMER SIGNATURE</label>
                  <div className="sign-line"><span>(Acknowledgment)</span></div>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Thank you for your payment. This is a computer-generated receipt.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice View */}
      {activeView === 'invoice' && invoiceDate && invoiceNumber && dueDate && (
        <div ref={invoiceRef}>
          <div className="document-card print-one-page">
            {renderDocumentHeader('fa-file-invoice-dollar', 'TAX INVOICE')}
            <div className="compact-content">
              <div className="compact-grid">
                <div className="compact-field">
                  <label>Invoice No.</label>
                  <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Invoice Date</label>
                  <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="compact-field">
                  <label>TIN No.</label>
                  <input type="text" value={fromTin} onChange={(e) => setFromTin(e.target.value)} />
                </div>
              </div>

              <div className="invoice-parties">
                <div className="bill-to-section">
                  <h4>Bill To:</h4>
                  <input type="text" value={billToName} onChange={(e) => setBillToName(e.target.value)} placeholder="Name" />
                  <input type="text" value={billToAddress} onChange={(e) => setBillToAddress(e.target.value)} placeholder="Address" />
                  <input type="text" value={billToPhone} onChange={(e) => setBillToPhone(e.target.value)} placeholder="Phone" />
                  <input type="email" value={billToEmail} onChange={(e) => setBillToEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="from-section">
                  <h4>From:</h4>
                  <input type="text" value={fromCompany} onChange={(e) => setFromCompany(e.target.value)} placeholder="Company" />
                  <input type="text" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="Address" />
                  <input type="text" value={fromPhone} onChange={(e) => setFromPhone(e.target.value)} placeholder="Phone" />
                  <input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="Email" />
                </div>
              </div>

              {renderProductTable(invoiceProducts, updateInvoiceRow, removeInvoiceRow, addInvoiceRow, true, invoiceTotal)}

              <div className="invoice-footer-info">
                <div className="bank-details-edit">
                  <label>Bank Details:</label>
                  <input type="text" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className="bank-input" />
                </div>
                <div className="amount-due-box">
                  <span>Total Amount Due:</span>
                  <strong>{formatUGX(invoiceTotal)}</strong>
                </div>
              </div>

              <div className="compact-signatures">
                <div className="compact-sign">
                  <label>AUTHORIZED SIGNATURE</label>
                  <div className="sign-line"><span>(For Dar Paint SMC Ltd)</span></div>
                </div>
                <div className="compact-sign">
                  <label>CUSTOMER ACKNOWLEDGMENT</label>
                  <div className="sign-line"><span>(Signature & Date)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="action-buttons no-print">
        <button className="btn-reset" onClick={resetAll}>
          <i className="fas fa-undo-alt"></i> Reset All
        </button>
      </div>
    </div>
  );
}
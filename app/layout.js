// app/layout.js
import './globals.css';
import './styles.css';

export const metadata = {
  title: 'Dar Paint SMC Ltd - Document Management System',
  description: 'Professional delivery notes, quotations, receipts and invoices',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        <style>
          {`
            @media print {
              /* Force one page on all devices */
              html, body {
                height: auto !important;
                overflow: visible !important;
              }
              
              /* Ensure no orphans or widows */
              p, div, table, tr, td, th {
                orphans: 2;
                widows: 2;
              }
              
              /* Remove any extra spacing that could cause page breaks */
              * {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
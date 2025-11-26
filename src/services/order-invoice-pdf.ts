// src/services/exportOrderInvoicePdf.ts
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import dayjs from "dayjs";

// type any here, or import your real Order type
type Order = any;

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatAmount = (amount: number | undefined | null, currency: string) => {
  if (amount == null) return `${currency}0.00`;
  return `${currency}${Number(amount).toFixed(2)}`;
};

const buildOrderInvoiceHtml = (params: {
  order: Order;
  currency: string;
  shopName?: string;
  shopAddress?: string;
  generatedAt: string;
}) => {
  const { order, currency, shopName, shopAddress, generatedAt } = params;

  const invoiceNo = order.invoice ?? order._id;
  const customer = order.user_info ?? {};
  const items = order.cart ?? [];

  const statusLabel = String(order.status ?? "").toUpperCase() || "PENDING";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice #${escapeHtml(invoiceNo)}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
    }
    .page {
      padding: 16px;
    }

    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px 20px 16px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
      border: 1px solid #e2e8f0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .shop-name {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: .03em;
      text-transform: uppercase;
      color: #0f766e;
    }
    .shop-address {
      margin-top: 4px;
      font-size: 12px;
      color: #64748b;
      white-space: pre-line;
    }

    .invoice-meta {
      text-align: right;
      font-size: 12px;
      color: #475569;
    }
    .invoice-title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .badge-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-top: 6px;
      background: #ecfdf5;
      color: #166534;
    }

    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #64748b;
      margin-bottom: 8px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .column {
      flex: 1;
      font-size: 13px;
    }
    .label {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .value {
      font-size: 13px;
      color: #0f172a;
      margin-top: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    thead th {
      padding: 10px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .08em;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
    }
    tbody td {
      padding: 10px 8px;
      font-size: 13px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    tbody tr:nth-child(even) {
      background: #f9fafb;
    }

    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .muted { color: #6b7280; font-size: 12px; }

    .summary {
      margin-top: 12px;
      width: 260px;
      margin-left: auto;
      font-size: 13px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .summary-row.total {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-weight: 800;
      font-size: 15px;
    }
    .summary-label {
      color: #6b7280;
    }
    .summary-value {
      font-weight: 600;
      color: #0f172a;
    }
    .summary-value.positive { color: #16a34a; }

    footer {
      margin-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }

    @page {
      margin: 12mm;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <header class="header">
        <div>
          <div class="shop-name">${escapeHtml(shopName ?? "Invoice")}</div>
          ${
            shopAddress
              ? `<div class="shop-address">${escapeHtml(shopAddress)}</div>`
              : ""
          }
        </div>
        <div class="invoice-meta">
          <div class="invoice-title">Invoice #${escapeHtml(invoiceNo)}</div>
          <div>Order ID: ${escapeHtml(order._id)}</div>
          <div>Date: ${escapeHtml(
            dayjs(order.createdAt).format("MMM D, YYYY h:mm A")
          )}</div>
          <div>Generated: ${escapeHtml(generatedAt)}</div>
          <div class="badge-status">${escapeHtml(statusLabel)}</div>
        </div>
      </header>

      <section class="section">
        <div class="row">
          <div class="column">
            <div class="section-title">Bill To</div>
            <div class="label">Customer</div>
            <div class="value">${escapeHtml(customer.name ?? "-")}</div>

            <div class="label" style="margin-top:8px;">Contact</div>
            <div class="value">
              ${escapeHtml(customer.contact ?? "-")}<br/>
              ${escapeHtml(customer.email ?? "")}
            </div>
          </div>
          <div class="column">
            <div class="section-title">Shipping Address</div>
            <div class="value">
              ${escapeHtml(customer.address ?? "-")}<br/>
              ${escapeHtml(
                [customer.city, customer.country].filter(Boolean).join(", ")
              )} ${escapeHtml(customer.zipCode ?? "")}
            </div>

            <div class="label" style="margin-top:8px;">Payment Method</div>
            <div class="value">${escapeHtml(order.paymentMethod ?? "-")}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title">Items</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              items.length === 0
                ? `<tr><td colspan="5" class="text-center muted" style="padding:24px;">No items found.</td></tr>`
                : items
                    .map((item: any, index: number) => {
                      return `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(item.title ?? "-")}</td>
                <td class="text-center">${escapeHtml(
                  String(item.quantity ?? 0)
                )}</td>
                <td class="text-right">${escapeHtml(
                  formatAmount(item.price, currency)
                )}</td>
                <td class="text-right">${escapeHtml(
                  formatAmount(item.itemTotal, currency)
                )}</td>
              </tr>
            `;
                    })
                    .join("")
            }
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <div class="summary-label">Subtotal</div>
            <div class="summary-value">
              ${escapeHtml(formatAmount(order.subTotal, currency))}
            </div>
          </div>
          <div class="summary-row">
            <div class="summary-label">Shipping</div>
            <div class="summary-value">
              ${
                order.shippingCost
                  ? escapeHtml(formatAmount(order.shippingCost, currency))
                  : "Free"
              }
            </div>
          </div>
          ${
            order.discount && order.discount > 0
              ? `
          <div class="summary-row">
            <div class="summary-label">Discount</div>
            <div class="summary-value positive">
              -${escapeHtml(formatAmount(order.discount, currency))}
            </div>
          </div>`
              : ""
          }

          <div class="summary-row total">
            <div class="summary-label">Total</div>
            <div class="summary-value">
              ${escapeHtml(formatAmount(order.total, currency))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        Thank you for your purchase.<br/>
        Generated by Kachabazar — ${escapeHtml(generatedAt)}
      </footer>
    </div>
  </div>
</body>
</html>
`;
};

export const exportOrderInvoicePdf = async (params: {
  order: Order;
  currency: string;
  shopName?: string;
  shopAddress?: string;
}): Promise<string> => {
  const { order, currency, shopName, shopAddress } = params;

  const generatedAt = dayjs().format("MMM D, YYYY h:mm A");

  const html = buildOrderInvoiceHtml({
    order,
    currency,
    shopName,
    shopAddress,
    generatedAt,
  });

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: `Invoice #${order.invoice ?? order._id}`,
    });
  }

  return uri;
};

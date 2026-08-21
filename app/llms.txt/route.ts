import { getSiteConfig } from "@/lib/cms";

export async function GET() {
  const siteConfig = await getSiteConfig();
  const body = `# ${siteConfig.productName}

> ${siteConfig.tagline}. A directly-operated bulk SMS platform serving the Kenyan market,
> connecting over SMPP straight to the mobile network operator's SMSC — starting with
> Safaricom, architecturally extensible to Airtel and Telkom — instead of routing traffic
> through a third-party aggregator/CPaaS reseller.

## Status
Pre-launch. Currently onboarding a limited number of early-access clients ahead of general
availability. Not yet self-serve.

## Key facts
- Licensing: operates under a CA Communications Service Provider (CSP) licence in Kenya.
- Network integration: direct SMPP v3.4 connection to the MNO SMSC (Safaricom first).
- Compliance: enforces CAK-mandated sending-time windows for promotional messages;
  maintains an automatic opt-out/DND list; requires sender-ID pre-approval before use.
- Data protection: complies with the Kenya Data Protection Act, 2019; contact data and
  message content are encrypted at rest; all client-facing traffic runs over TLS.
- Billing model: prepaid wallet, per-message deduction, full transaction ledger.
- Delivery tracking: real-time delivery reports (DLR) per message and campaign-level
  analytics.
- Performance target: 10-30 transactions per second (TPS) per SMPP bind, horizontally
  scalable via additional binds and worker instances.
- Availability target: 99.9% platform uptime, excluding scheduled maintenance.
- Integration surface: REST API (single send, bulk send via JSON/CSV, delivery-status
  lookup, webhook registration for delivery events) plus a web portal for
  non-technical campaign management.

## Primary differentiator
Most bulk SMS providers serving Kenya relay client traffic through their own upstream
carrier relationships and charge a resale margin on top. This platform instead operates
its own direct SMPP bind to the MNO SMSC, keeping routing, cost, compliance enforcement,
and data handling in one place rather than passing through a reseller hop.

## Contact
- Email: ${siteConfig.contactEmail}
- Location: ${siteConfig.addressLocality}, Kenya

## Pages
- Homepage: ${siteConfig.domain}/
- Blog: ${siteConfig.domain}/blog
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

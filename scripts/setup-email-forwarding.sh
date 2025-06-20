#!/bin/bash

# Email Forwarding DNS Configuration Helper
# This script provides the DNS records needed for ImprovMX email forwarding

echo "=========================================="
echo "Email Forwarding DNS Configuration"
echo "Domain: reggiepangilinan.com"
echo "Service: ImprovMX"
echo "=========================================="
echo ""

echo "DNS Records to Add:"
echo "==================="
echo ""

echo "1. MX Records (Mail Exchange):"
echo "   Type: MX"
echo "   Name: @ (or root domain)"
echo "   Value: mx1.improvmx.com"
echo "   Priority: 10"
echo ""
echo "   Type: MX"
echo "   Name: @ (or root domain)"  
echo "   Value: mx2.improvmx.com"
echo "   Priority: 20"
echo ""

echo "2. SPF Record (Sender Policy Framework):"
echo "   Type: TXT"
echo "   Name: @ (or root domain)"
echo "   Value: \"v=spf1 include:_spf.improvmx.com ~all\""
echo ""

echo "3. Optional DMARC Record:"
echo "   Type: TXT"
echo "   Name: _dmarc"
echo "   Value: \"v=DMARC1; p=quarantine; rua=mailto:me@reggiepangilinan.com\""
echo ""

echo "Instructions:"
echo "============="
echo "1. Log into your DNS provider (Netlify DNS)"
echo "2. Navigate to DNS settings for reggiepangilinan.com"
echo "3. Add the MX and TXT records above"
echo "4. Save changes and wait for propagation (24-48 hours)"
echo "5. Test by sending email to me@reggiepangilinan.com"
echo ""

echo "Verification Commands:"
echo "====================="
echo "Check MX records: dig MX reggiepangilinan.com"
echo "Check SPF record: dig TXT reggiepangilinan.com"
echo "Check DMARC:      dig TXT _dmarc.reggiepangilinan.com"
echo ""

echo "Setup URL: https://improvmx.com/"
echo "Documentation: $(dirname "$0")/../docs/setup/EMAIL_FORWARDING_IMPLEMENTATION.md"

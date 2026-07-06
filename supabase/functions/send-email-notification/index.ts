import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@victasure.com"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable")
    }

    const { type, data } = await req.json()
    let subject = ""
    let htmlContent = ""

    if (type === 'enquiry') {
      subject = `🚨 New B2B Lead Enquiry from ${data.full_name}`
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0284c7; margin-bottom: 20px;">New B2B Lead Enquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 10px 0;">${data.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Work Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${data.work_email}">${data.work_email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Country / Port:</td>
              <td style="padding: 10px 0;">${data.country} ${data.delivery_port ? `(Port: ${data.delivery_port})` : ''}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 10px 0;">${data.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Category:</td>
              <td style="padding: 10px 0;">${data.category_interest}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Product/Subcat:</td>
              <td style="padding: 10px 0;">${data.product_interest}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Quantity:</td>
              <td style="padding: 10px 0;">${data.quantity} ${data.qty_unit || ''}</td>
            </tr>
          </table>
          ${data.notes ? `
            <div style="margin-top: 20px; padding: 15px; bg-color: #f8fafc; border-radius: 8px;">
              <strong style="display: block; margin-bottom: 5px;">Client Notes:</strong>
              <p style="margin: 0; font-style: italic; color: #475569;">"${data.notes}"</p>
            </div>
          ` : ''}
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated notification from VictaSure Global Trade Portal.</p>
        </div>
      `
    } else if (type === 'download') {
      subject = `📥 Catalogue Download Request from ${data.full_name}`
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #10b981; margin-bottom: 20px;">Catalogue Download Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 10px 0;">${data.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Work Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${data.work_email}">${data.work_email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Country:</td>
              <td style="padding: 10px 0;">${data.country}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 10px 0;">${data.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold;">Selected Item:</td>
              <td style="padding: 10px 0;">${data.product_interest} (${data.category_interest})</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated notification from VictaSure Global Trade Portal.</p>
        </div>
      `
    } else {
      return new Response(JSON.stringify({ error: "Invalid notification type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      })
    }

    // Call Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "VictaSure Portal <portal@updates.victasure.com>", // Make sure domain is verified on Resend
        to: [ADMIN_EMAIL],
        subject: subject,
        html: htmlContent
      })
    })

    const resData = await res.json()

    return new Response(JSON.stringify({ success: true, info: resData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})

-- =========================================================================
-- VICTASURE TRADE PORTAL - DIRECT SUPABASE TO RESEND EMAIL TRIGGERS
-- =========================================================================
-- Copy and run this SQL script in the Supabase SQL Editor (https://supabase.com)
-- to automatically trigger email notifications directly to victasureglobal@gmail.com
-- =========================================================================

-- Enable pg_net extension to allow outbound HTTP requests natively from PostgreSQL
create extension if not exists pg_net;

-- 1. Trigger Function for Enquiries (Using onboarding@resend.dev to victasureglobal@gmail.com)
CREATE OR REPLACE FUNCTION notify_admin_on_enquiry_insert_direct()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://api.resend.com/emails'::text, -- url as text
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer re_QbosuxdX_FydtdZNPzvSNGDgaEm6zs1XW'
      ),
      body := jsonb_build_object( -- body as pure jsonb
        'from', 'onboarding@resend.dev',
        'to', jsonb_build_array('victasureglobal@gmail.com'),
        'subject', '🚨 New B2B Lead Enquiry: ' || NEW.name, -- Removed (TEST)
        'html', '
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0284c7; margin-bottom: 20px;">New B2B Lead Enquiry</h2> -- Removed (TEST)
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; width: 150px;">Full Name:</td>
                <td style="padding: 10px 0;">' || NEW.name || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Work Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:' || NEW.email || '">' || NEW.email || '</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Country:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.country, 'Unknown') || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">State / Province:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.state, 'Unknown') || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Phone Number:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.phone, 'Unknown') || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Product Interested:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.product_interested, 'Unknown') || '</td>
              </tr>
            </table>
            ' || COALESCE('
              <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                <strong style="display: block; margin-bottom: 5px;">Message / Description:</strong>
                <p style="margin: 0; font-style: italic; color: #475569;">"' || NEW.message || '"</p>
              </div>
            ', '') || '
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated notification from VictaSure Global Trade Portal.</p>
          </div>
        '
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger on enquiries
DROP TRIGGER IF EXISTS on_enquiry_inserted_direct ON enquiries;
CREATE TRIGGER on_enquiry_inserted_direct
AFTER INSERT ON enquiries
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_enquiry_insert_direct();


-- 2. Trigger Function for Catalogue Downloads
CREATE OR REPLACE FUNCTION notify_admin_on_download_insert_direct()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://api.resend.com/emails'::text, -- url as text
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer re_QbosuxdX_FydtdZNPzvSNGDgaEm6zs1XW'
      ),
      body := jsonb_build_object( -- body as pure jsonb
        'from', 'onboarding@resend.dev',
        'to', jsonb_build_array('victasureglobal@gmail.com'), -- Sending to the registered Resend account email
        'subject', '📥 Catalogue Download: ' || NEW.name, -- Removed (TEST)
        'html', '
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #10b981; margin-bottom: 20px;">Catalogue Download Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold; width: 150px;">Full Name:</td>
                <td style="padding: 10px 0;">' || NEW.name || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Work Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:' || NEW.email || '">' || NEW.email || '</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Country:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.country, 'Unknown') || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Phone Number:</td>
                <td style="padding: 10px 0;">' || NEW.phone || '</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: bold;">Selected Item:</td>
                <td style="padding: 10px 0;">' || COALESCE(NEW.product_interest, 'General Catalogue') || ' (' || COALESCE(NEW.category_interest, 'All') || ')</td>
              </tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">This is an automated notification from VictaSure Global Trade Portal.</p>
          </div>
        '
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger on catalogue_downloads
DROP TRIGGER IF EXISTS on_download_inserted_direct ON catalogue_downloads;
CREATE TRIGGER on_download_inserted_direct
AFTER INSERT ON catalogue_downloads
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_download_insert_direct();

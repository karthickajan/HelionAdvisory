# EmailJS Integration Setup Guide

## Quick Summary
The contact form is now configured to send emails through EmailJS when users submit an enquiry. Emails will be sent to `karthickajangs@gmail.com` for testing, formatted as:

```
[Name] from [Organisation]

Area of Interest: [Selected Category]

[User Message]
```

The email will be sent FROM the user's email address so you can reply directly.

---

## Step-by-Step Setup

### 1. Create EmailJS Account
- Go to **https://www.emailjs.com/**
- Sign up for a free account
- Verify your email

### 2. Add Email Service
1. Click **"Add Service"** in your dashboard
2. Choose your email provider (Gmail, Outlook, etc.) or use SMTP
3. For **Gmail**, select "Gmail" and authenticate your account
4. For testing, use: **karthickajangs@gmail.com**
5. Click **"Connect Account"**
6. Copy your **Service ID** (format: `service_helion`)

### 3. Create Email Template
1. Go to **"Email Templates"** in your dashboard
2. Click **"Create New Template"**
3. Set up the template with these variables:

```
From: {{from_email}}
To: {{to_email}}
Subject: {{subject}}
Reply-To: {{reply_to}}

{{message}}
```

4. Copy your **Template ID** (format: `template_xxxxxxxxx`)

### 4. Get Your Public Key
1. Go to **"Account"** → **"API Keys"**
2. Copy your **Public Key** (format: `xxxxxxxxxxxxxxxxx`)

### 5. Update index.html
Replace the three placeholders in `index.html` with your EmailJS credentials:

**Line ~817** (in the EmailJS initialization):
```javascript
emailjs.init('YOUR_PUBLIC_KEY_HERE'); 
// Replace with your actual public key
```

**Lines ~867-868** (in the service and template IDs):
```javascript
await emailjs.send(
  'SERVICE_ID_HERE',        // Replace with your service ID
  'TEMPLATE_ID_HERE',       // Replace with your template ID
  {
    // ... rest of code
  }
);
```

---

## Testing the Form

1. **Fill out the contact form** with test data:
   - Name: John Doe
   - Organisation: Test Corp
   - Email: your-test-email@example.com
   - Area of Interest: Select any option
   - Message: This is a test message
   - Math verification: Answer the math question

2. **Click "Send Enquiry"**

3. **Check your inbox** at `karthickajangs@gmail.com` for the email

4. **Verify the email format** matches:
   ```
   John Doe from Test Corp
   
   Area of Interest: [Your Selected Category]
   
   This is a test message
   ```

---

## Email Flow Overview

| Field | Value |
|-------|-------|
| **From** | User's email address |
| **To** | karthickajangs@gmail.com (for testing) |
| **Subject** | Area of Interest selected (e.g., "Early Development & Regulatory Readiness") |
| **Reply-To** | User's email address |
| **Body** | Name from Organisation + Area + Message |

---

## Future Customization

When you're ready to change the recipient email:
- Simply update `'karthickajangs@gmail.com'` on **line ~863** to your desired email
- No need to regenerate templates or service IDs
- The EmailJS credentials remain the same

---

## Troubleshooting

**Email not sending?**
1. Check that SERVICE_ID and TEMPLATE_ID are correctly replaced
2. Check browser console for error messages (F12 → Console)
3. Verify your EmailJS service is connected to your email provider
4. Ensure your email account allows third-party apps

**Email template looks wrong?**
1. Go to EmailJS dashboard → Email Templates
2. Edit your template to match the expected format
3. Test the template with sample variables

**Form submission stuck?**
1. Check browser console (F12)
2. Look for EmailJS errors
3. Verify your public key is correctly set

---

## Security Notes

✅ **Public key is safe** - It's meant to be public (emailjs.init uses it)
✅ **Service ID is safe** - It only works with your EmailJS account
✅ **Template ID is safe** - It's specific to your account
✅ **Honeypot enabled** - Spam bots are automatically rejected
✅ **Math CAPTCHA enabled** - Only humans can submit the form

---

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
- Contact us in the code comments if you need modifications

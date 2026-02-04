# n8n WhatsApp Reminders Setup

## 1. Import Workflow
1. Open your n8n instance.
2. Go to **Workflows** > **Import**.
3. Select the `n8n-workflow.json` file generated in your project folder.

## 2. Configure Credentials
The workflow uses a Postgres node. You need to set up the credentials in n8n:
1. Open the **Postgres** node.
2. Create a new credential or select your existing one.
3. Use the Neon DB connection string found in your `ProgramDetail.tsx` or `.env`.
   - Host: `ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech`
   - Database: `neondatabase`
   - User: `neondatabase_owner`
   - Password: (The one from your connection string)
   - SSL: On

## 3. WAHA Connection
The workflow assumes you have a WAHA (WhatsApp HTTP API) instance running or accessible.
- The URL is set to `http://waha:3000`. Update this in the **Send WA** nodes if your WAHA is hosted elsewhere (e.g., `https://waha.yourdomain.com`).

## 4. Usage
- Calls to the webhook `https://n8n.premierchoiceint.online/webhook/daily-reminders-subscribe` will add users to the `whatsapp_subscribers` table.
- The workflow automatically runs at 6:00 PM, 7:40 PM, and 8:00 PM to send messages to all subscribers.

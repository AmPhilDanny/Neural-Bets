import axios from 'axios';

export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram notifications not configured');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

export async function sendWhatsAppNotification(phone: string, message: string) {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const baseUrl = process.env.WHATSAPP_API_URL;

  if (!apiKey || !baseUrl) {
    console.warn('WhatsApp notifications not configured');
    return;
  }

  try {
    await axios.post(`${baseUrl}/send`, {
      phone,
      message,
      apikey: apiKey
    });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
  }
}

export async function notifyNewOdds(category: string, odds: number) {
  const message = `🔥 <b>New ${category} Odds Available!</b>\n\nTarget Odds: <b>${odds}×</b>\nConfidence: High\n\n<a href="${process.env.NEXT_PUBLIC_APP_URL}">Unlock Now on Neural-Bets</a>`;
  
  await sendTelegramNotification(message);
  // WhatsApp is usually sent to specific subscribers in a loop or group
}

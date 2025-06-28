import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  // This is the important part for security (CORS)
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allows any origin to access
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle the browser's pre-flight "OPTIONS" request, which checks permissions
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers
    };
  }
  
  // We only allow POST requests for the actual sending
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: 'Reading Companion <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify(error)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error sending email' })
    };
  }
};

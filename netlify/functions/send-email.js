import { Resend } from 'resend';

// The API key is safely stored in Netlify, not in your code
const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  // We only allow POST requests for security
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: 'Reading Companion <onboarding@resend.dev>', // This is a default from Resend
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error sending email' })
    };
  }
};
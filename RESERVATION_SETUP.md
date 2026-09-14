# ARVESSO — Email Reservation Setup

The reservation form is built for a static website and uses Formspree as the email-oriented form backend.

Flow:

`Guest → ARVESSO website → Formspree → restaurant staff email`

The staff receives a reservation request by email and confirms it manually. The website never tells the guest that a table is confirmed before staff accepts the request.

## One-time setup

1. Create a form in Formspree.
2. Set the restaurant's staff email as the form's Target Email.
3. Copy the endpoint shown in the Formspree dashboard. It looks like:

   `https://formspree.io/f/xxxxxxxx`

4. Open `index.html` and find:

   `action="https://formspree.io/f/YOUR_FORM_ID"`

5. Replace `YOUR_FORM_ID` with the real form ID.
6. Publish the website.

Formspree's current HTML integration uses a form `action`, `method="POST"`, and named fields. Submissions can be delivered to a Target Email configured for the form.

## Data sent to staff

- Guest name
- Restaurant location
- Date
- Time
- Number of guests
- Phone number
- Guest email, if provided
- Guest note, if provided

The email subject is automatically set to:

`New ARVESSO table reservation request`

If the guest enters an email address, it is also sent as `_replyto`, allowing staff to reply directly.

## Template behavior

No restaurant email address is hardcoded into ARVESSO. The template can therefore be sold to different restaurants without changing the frontend structure.

For a real deployment, use a monitored address such as `reservations@restaurant-domain.am` as the Formspree Target Email.

## Important distinction

This is an email-based **reservation request** system, not a live table inventory system. It is intentionally simple:

1. Guest submits request.
2. Restaurant receives email.
3. Staff checks availability.
4. Staff confirms or calls the guest.

That is appropriate for a static restaurant website and does not require a separate staff dashboard.

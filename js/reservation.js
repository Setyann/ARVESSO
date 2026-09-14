(() => {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    const message = document.getElementById('reservation-message');
    const submit = document.getElementById('reservation-submit');
    const dateInput = document.getElementById('reservation-date');
    const emailInput = document.getElementById('reservation-email');
    const replyTo = document.getElementById('reservation-replyto');
    const honeypot = form.querySelector('[name="_gotcha"]');
    const endpoint = form.getAttribute('action') || '';

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 10);
    dateInput.min = localDate;

    const showMessage = (html, type = '') => {
        message.className = `reservation-message ${type}`;
        message.innerHTML = html;
    };

    const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));

    form.addEventListener('submit', async event => {
        event.preventDefault();

        if (honeypot?.value) return;

        if (endpoint.includes('YOUR_FORM_ID')) {
            showMessage(
                '<strong>Email delivery is not configured yet.</strong><br><span>Replace YOUR_FORM_ID in index.html with the restaurant\'s Formspree form ID before publishing.</span>',
                'success'
            );
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (dateInput.value < localDate) {
            dateInput.setCustomValidity('Please choose a future date.');
            dateInput.reportValidity();
            dateInput.setCustomValidity('');
            return;
        }

        replyTo.value = emailInput.value.trim();
        submit.disabled = true;
        submit.textContent = 'Sending request…';
        showMessage('Sending your reservation request…');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                let errorText = 'We could not send the request. Please try again or call the restaurant.';
                try {
                    const data = await response.json();
                    if (data?.errors?.length) errorText = data.errors.map(error => error.message).join(' ');
                } catch (_) {}
                throw new Error(errorText);
            }

            const data = new FormData(form);
            const name = data.get('name');
            const location = data.get('location');
            const date = data.get('date');
            const time = data.get('time');
            const guests = data.get('guests');

            showMessage(
                `<strong>Request sent.</strong><br><span>Thanks, ${escapeHtml(name)}. We received your request for ${escapeHtml(location)} on ${escapeHtml(date)} at ${escapeHtml(time)} for ${escapeHtml(guests)} guest${guests === '1' ? '' : 's'}. The restaurant will confirm the table by phone or email.</span>`,
                'success'
            );

            form.reset();
            dateInput.min = localDate;
        } catch (error) {
            showMessage(`<strong>Something went wrong.</strong><br><span>${escapeHtml(error.message)}</span>`);
        } finally {
            submit.disabled = false;
            submit.textContent = 'Request a table';
        }
    });
})();

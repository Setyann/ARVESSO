document.addEventListener('DOMContentLoaded', () => {
    const reviews = [
        { text: 'The food is thoughtful without feeling formal. You can actually sit down and enjoy the evening.', author: 'Anna M.', meta: 'Yerevan · Dinner' },
        { text: 'Everything felt considered — from the fire-roasted vegetables to the way the table was set. We stayed much longer than planned.', author: 'David K.', meta: 'Yerevan · Dinner' },
        { text: 'A very easy place to bring friends. Great food, relaxed room and enough variety for everyone at the table.', author: 'Mariam S.', meta: 'Yerevan · Friends' },
        { text: 'The open kitchen is the best part. You can smell the fire before the plates even arrive.', author: 'Arman T.', meta: 'Yerevan · Late Lunch' },
        { text: 'We came for dessert and ended up ordering half the menu. The cheesecake alone is worth coming back for.', author: 'Lilit A.', meta: 'Yerevan · Evening' }
    ];

    const card = document.getElementById('review-card');
    const text = document.getElementById('review-text');
    const author = document.getElementById('review-author');
    const meta = document.getElementById('review-meta');
    const indexLabel = document.getElementById('review-index');
    const prev = document.getElementById('review-prev');
    const next = document.getElementById('review-next');
    const dots = document.getElementById('review-dots');

    if (!card || !text || !author || !meta || !indexLabel || !prev || !next || !dots) return;

    let current = 0;
    let timer = null;

    dots.innerHTML = '';
    reviews.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'review-dot';
        dot.setAttribute('aria-label', `Show review ${i + 1}`);
        dot.addEventListener('click', () => render(i));
        dots.appendChild(dot);
    });

    function render(index) {
        current = (index + reviews.length) % reviews.length;
        const review = reviews[current];
        text.textContent = `“${review.text}”`;
        author.textContent = review.author;
        meta.textContent = review.meta;
        indexLabel.textContent = `${String(current + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;

        dots.querySelectorAll('.review-dot').forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle('active', active);
            if (active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    function change(direction) {
        clearTimeout(timer);
        card.classList.remove('is-entering', 'is-changing');
        card.classList.add('is-changing');
        timer = setTimeout(() => {
            render(current + direction);
            card.classList.remove('is-changing');
            void card.offsetWidth;
            card.classList.add('is-entering');
        }, 120);
    }

    prev.addEventListener('click', () => change(-1));
    next.addEventListener('click', () => change(1));

    card.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            change(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            change(1);
        }
    });

    let touchStartX = null;
    card.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    card.addEventListener('touchend', (event) => {
        if (touchStartX === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) >= 45) change(distance < 0 ? 1 : -1);
    }, { passive: true });

    render(0);
});

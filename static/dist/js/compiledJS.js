document.addEventListener('DOMContentLoaded', () => {
  const s = document.querySelector('.hamburger'),
    e = document.querySelector('.hamburger__items'),
    t = document.querySelector('.hamburger__close');
  s &&
    e &&
    s.addEventListener('click', () => {
      e.classList.toggle('active'), s.classList.toggle('open');
    }),
    t &&
      t.addEventListener('click', () => {
        e.classList.remove('active'), s.classList.remove('open');
      });
});
class w {
  constructor(e) {
    this.apiPath = e;
  }
  async fetchData() {
    try {
      return (await (await fetch(this.apiPath)).json()).liveEvents;
    } catch (e) {
      return console.error('Error fetching data:', e), [];
    }
  }
}
class f {
  constructor(e) {
    this.container = document.querySelector(e);
  }
  createLiveEvent({ title: e, description: t, image: n }) {
    const i = document.createElement('li');
    return (
      i.classList.add('live__list-item'),
      (i.innerHTML = `
        <div class="live__list-item-image-wrapper">
                <img src="${n}" class="live__list-item-image" alt="${e}" />
            </div>
            <div class="live__list-item-title">
                <h3>${e}</h3>
                <button class="live__list-item-btn" aria-label="Book ticket to live event">BOKA</button>
            </div>
            <div class="live__list-item-description">
                <p>${t}</p>
            </div>
            `),
      i
    );
  }
  renderLiveEvents(e) {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    if (!Array.isArray(e) || e.length === 0) {
      this.container.innerHTML = '<p> No live events founds.</p>';
      return;
    }
    this.container.innerHTML = '';
    const t = document.createDocumentFragment();
    e.forEach((n) => {
      const i = this.createLiveEvent(n);
      t.appendChild(i);
    }),
      this.container.appendChild(t);
  }
}
async function E() {
  const s = './static/dist/json/liveEvents.json',
    e = new w(s),
    t = new f('.live__list');
  try {
    const n = await e.fetchData();
    t.renderLiveEvents(n);
  } catch (n) {
    console.error('Error initializing live events:', n);
  }
}
const C = async () => {
  if (window.location.pathname.startsWith('/movie/')) {
    const e = (function () {
      const n = window.location.pathname.match(/\/movie\/(\d+)/);
      return n ? n[1] : null;
    })();
    if (e)
      try {
        const n = await (await fetch(`/api/screenings/${e}/movie`)).json();
        return !n || n.length === 0
          ? (console.warn('No screening available for this movie'), [])
          : n.map((a) => {
              const o = new Date(a.start_time),
                r = o.getFullYear(),
                l = (o.getMonth() + 1).toString().padStart(2, '0'),
                c = o.getDate().toString().padStart(2, '0'),
                d = o.getHours().toString().padStart(2, '0'),
                h = o.getMinutes().toString().padStart(2, '0');
              return { formattedTime: `${r}-${l}-${c} ${d}:${h}`, room: a.room };
            });
      } catch (t) {
        return console.error('Error fetching screenings:', t), null;
      }
    else return console.error('No movie ID found in the url'), null;
  }
  return null;
};
async function L() {
  if (window.location.pathname.startsWith('/movie/')) {
    const s = await C(),
      e = document.querySelector('.screening__info-list');
    if (!s || s.length === 0) {
      console.log('No screening data available.');
      const t = document.createElement('li');
      (t.innerHTML = ' <span class="screening-time">Listan är tom</span>'), e.appendChild(t);
      return;
    }
    s.sort((t, n) => {
      const i = new Date(t.formattedTime),
        a = new Date(n.formattedTime);
      return i - a;
    }),
      (e.innerHTML = ''),
      s.forEach(({ formattedTime: t, room: n }) => {
        const i = document.createElement('li');
        (i.innerHTML = ` <span class="screening-time">Tid: ${t}</span>
  <span class="screening-room">Sal: ${n}</span>`),
          e.appendChild(i);
      });
  }
}
L();
const g = async (s) => {
  const e = `/movie/${s}/screenings/upcoming`;
  return await (await fetch(e)).json();
};
async function y() {
  const s = document.querySelectorAll('.movie-link'),
    e = Array.prototype.map.call(s, (i) => i.id);
  let t = 0;
  const n = [];
  for (const i of e)
    try {
      const a = await g(i);
      console.log(`Upcoming screenings for movie ID ${i}:`, a);
      const o = document.getElementById(i);
      if (!o) {
        console.error(`No movie container found for movie ID ${i}`);
        continue;
      }
      if (a.length > 0) {
        const r = a[0],
          l = new Date(r.attributes.start_time),
          c = r.attributes.room;
        if (l && c) {
          const d = document.createElement('p');
          d.classList.add('showings'),
            (d.textContent = `${c} - ${l.toLocaleString()}`),
            o.appendChild(d),
            t++,
            n.push(r);
        } else console.error(`Invalid screening data for movie ID ${i}:`, r);
      } else {
        const r = document.createElement('p');
        (r.textContent = 'Inga visningar'), r.classList.add('no-showings'), o.appendChild(r);
      }
      if (t >= 10) break;
    } catch (a) {
      console.error(`Error fetching screenings for movie ID ${i}:`, a);
    }
  if (t < 10)
    for (const i of e)
      try {
        const o = (await g(i)).filter((r) => !n.includes(r));
        for (const r of o) {
          if (t >= 10) break;
          const l = new Date(r.attributes.start_time),
            c = r.attributes.room;
          if (l && c) {
            const d = document.getElementById(i),
              h = document.createElement('p');
            h.classList.add('showings'),
              (h.textContent = `${c} - ${l.toLocaleString()}`),
              d.appendChild(h),
              t++,
              n.push(r);
          } else console.error(`Invalid screening data for movie ID ${i}:`, r);
        }
        if (t >= 10) break;
      } catch (a) {
        console.error(`Error fetching screenings for movie ID ${i}:`, a);
      }
}
class v {
  static getMovieIdFromPath() {
    const t = window.location.pathname.match(/\/movie\/(\d+)/);
    if (!t || !t[1]) throw new Error('Movie ID not found in URL');
    return t[1];
  }
}
class b {
  static validate(e, t, n) {
    if (!t || t < 1) throw new Error('Please select a rating');
    if (!(e != null && e.trim())) throw new Error('Please write a review');
    if (!n.authBtnClick && !n.isLoggedIn) throw new Error('Wrong password');
    return !0;
  }
}
class S {
  static format(e, t, n, i) {
    return {
      data: {
        comment: e,
        rating: t,
        author: i.username,
        verified: i.status,
        movie: n,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
class _ {
  static async submit(e, t) {
    const n = await fetch('/movie/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    if (!n.ok) throw new Error('Failed to submit review');
    return n.json();
  }
}
class I extends EventTarget {
  constructor(e) {
    super(),
      (this.api = e),
      (this.result = 'Guest'),
      (this.status = !1),
      (this.dialog = null),
      (this.isLoggedIn = !1),
      (this.authBtnClick = !1);
  }
  render() {
    (this.dialog = document.createElement('dialog')), (this.dialog.className = 'auth-dialog');
    const e = document.createElement('span');
    (e.className = 'auth-guest'), (e.innerHTML = 'Submit as a guest');
    const t = document.createElement('span');
    (t.className = 'hint'), (t.innerHTML = 'The default password is: default');
    const n = document.createElement('form');
    (n.method = 'dialog'), (n.className = 'auth-form');
    const i = document.createElement('div');
    i.className = 'input-group';
    const a = document.createElement('label');
    (a.className = 'auth-label'), (a.htmlFor = 'username'), (a.textContent = 'Username:');
    const o = document.createElement('input');
    (o.className = 'auth-input'), (o.type = 'text'), (o.id = 'username'), (o.required = !0);
    const r = document.createElement('div');
    r.className = 'input-group';
    const l = document.createElement('label');
    (l.className = 'auth-label'), (l.htmlFor = 'password'), (l.textContent = 'Password:');
    const c = document.createElement('input');
    (c.className = 'auth-input'), (c.type = 'password'), (c.id = 'password'), (c.required = !0);
    const d = document.createElement('button');
    return (
      (d.className = 'submit-button'),
      (d.type = 'submit'),
      (d.textContent = 'Login'),
      e.addEventListener('click', () => {
        (this.authBtnClick = !0), this.dispatchEvent(new Event('auth')), this.dialog.close();
      }),
      n.addEventListener('submit', async (h) => {
        h.preventDefault();
        try {
          const m = await this.api.login(o.value, c.value),
            u = await this.api.getUserData(m.token);
          (this.result = u.user.username),
            (this.status = u.user.isVerified),
            (this.isLoggedIn = u.user.isLoggedIn),
            this.dispatchEvent(new Event('auth')),
            this.dialog.close();
        } catch {
          this.dialog.close(), this.dispatchEvent(new Event('auth'));
        }
      }),
      i.append(a, o),
      r.append(l, c),
      n.append(i, r, d, t, e),
      this.dialog.append(n),
      this.dialog
    );
  }
}
class R {
  constructor(e) {
    this.apiUrl = e;
  }
  async login(e, t) {
    const n = `${e}:${t}`,
      i = btoa(n),
      a = await fetch(this.apiUrl + '/login', { method: 'POST', headers: { Authorization: 'Basic ' + i } });
    if (!a.ok) throw new Error('Login failed');
    return await a.json();
  }
  async getUserData(e) {
    const t = await fetch(this.apiUrl + '/user', { headers: { Authorization: 'Bearer ' + e } });
    if (!t.ok) throw new Error('Failed to get user data');
    return await t.json();
  }
}
class k {
  constructor() {}
  static async showAuthDialog() {
    const e = new R(''),
      t = new I(e),
      n = t.render();
    return (
      document.body.appendChild(n),
      n.showModal(),
      await new Promise((i) => {
        t.addEventListener('auth', i, { once: !0 });
      }),
      n.close(),
      n.remove(),
      { username: t.result, status: t.status, isLoggedIn: t.isLoggedIn, authBtnClick: t.authBtnClick }
    );
  }
}
class M {
  constructor() {
    (this.selectedRating = 0), this.createReview(), this.attachEventListeners();
  }
  render() {
    (this.selectedRating = 0), this.initializeUI(), this.attachEventListeners();
  }
  initializeUI() {
    this.createReview(), this.appendToDOM();
  }
  createReview() {
    (this.container = document.createElement('section')),
      (this.container.className = 'review__form'),
      (this.stars = document.createElement('div')),
      (this.stars.className = 'review__stars'),
      (this.stars.id = 'stars');
    for (let e = 1; e <= 5; e++) {
      const t = document.createElement('span');
      (t.className = 'review__star'), (t.dataset.value = e), (t.textContent = '★'), this.stars.appendChild(t);
    }
    this.container.appendChild(this.stars),
      (this.textarea = document.createElement('textarea')),
      (this.textarea.className = 'review__textarea'),
      (this.textarea.placeholder = 'Write your review here'),
      this.container.appendChild(this.textarea),
      (this.submit = document.createElement('button')),
      (this.submit.className = 'review__submit'),
      (this.submit.textContent = 'Submit'),
      this.container.appendChild(this.submit);
  }
  appendToDOM() {
    const e = document.querySelector('.review');
    if (!e) throw new Error('Review container not found');
    e.appendChild(this.container);
  }
  attachEventListeners() {
    this.stars.querySelectorAll('.review__star').forEach((e) => {
      e.addEventListener('click', () => this.handleStarClick(e));
    }),
      this.submit.addEventListener('click', () => this.handleSubmit());
  }
  handleStarClick(e) {
    (this.selectedRating = parseInt(e.dataset.value)), this.updateStars();
  }
  updateStars() {
    this.stars.querySelectorAll('.review__star').forEach((e) => {
      const t = parseInt(e.dataset.value);
      e.classList.toggle('active', t <= this.selectedRating);
    });
  }
  async validateReview() {
    const e = this.textarea.value.trim(),
      t = v.getMovieIdFromPath(),
      n = await k.showAuthDialog();
    return console.log('author:', n), b.validate(e, this.selectedRating, n), S.format(e, this.selectedRating, t, n);
  }
  async handleSubmit() {
    try {
      const e = await this.validateReview();
      console.log(`Film id: ${e.data.movie}`),
        console.log(`Film data: ${e}`),
        await _.submit(e.data.movie, e),
        this.resetForm(),
        this.showSuccess('Review submitted successfully!');
    } catch (e) {
      this.showError(e.message);
    }
  }
  resetForm() {
    (this.selectedRating = 0), (this.textarea.value = ''), this.updateStars();
  }
  showSuccess(e) {
    this.showFeedback(e, 'success');
  }
  showError(e) {
    this.showFeedback(e, 'error');
  }
  showFeedback(e, t) {
    const n = document.createElement('div');
    (n.className = `review__feedback review__feedback--${t}`),
      (n.textContent = e),
      this.container.appendChild(n),
      setTimeout(() => n.remove(), 5e3);
  }
}
class D {
  constructor(e, t, n = 1, i = 5) {
    (this.url = e), (this.movieId = t), (this.page = n), (this.pageSize = i);
  }
  async fetchReviews() {
    try {
      const e = await fetch(`${this.url}/movie/${this.movieId}/reviews?page=${this.page}&pageSize=${this.pageSize}`);
      if (!e.ok) throw new Error('Failed to fetch reviews');
      return await e.json();
    } catch (e) {
      return console.error('Error fetching movie reviews:', e), { data: [], meta: { currentPage: 1, totalPages: 1 } };
    }
  }
  setPage(e) {
    this.page = e;
  }
}
class x {
  constructor(e) {
    this.data = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('review');
    const t = document.createElement('span');
    (t.textContent = this.data.rating), e.appendChild(t);
    const n = document.createElement('p');
    (n.textContent = this.data.comment), e.appendChild(n);
    const i = document.createElement('h4');
    return (i.textContent = this.data.author), e.appendChild(i), e;
  }
}
class $ {
  constructor(e) {
    (this.backend = e), (this.currentPage = 1), (this.totalPages = 1);
  }
  async initReviews(e) {
    const { reviews: t, meta: n } = await this.backend.fetchReviews();
    (this.totalPages = n.totalPages),
      (this.reviewsContainer = document.createElement('div')),
      e.appendChild(this.reviewsContainer),
      (this.paginationContainer = document.createElement('div')),
      this.paginationContainer.classList.add('pagination'),
      e.appendChild(this.paginationContainer),
      this.renderReviews(t),
      this.renderPagination();
  }
  renderReviews(e) {
    (this.reviewsContainer.innerHTML = ''),
      e.forEach((t) => {
        const n = new x(t);
        this.reviewsContainer.append(n.render());
      });
  }
  renderPagination() {
    this.paginationContainer.innerHTML = '';
    const e = document.createElement('button');
    (e.textContent = 'Föregående'),
      (e.disabled = this.currentPage === 1),
      e.addEventListener('click', () => this.changePage(this.currentPage - 1));
    const t = document.createElement('button');
    (t.textContent = 'Nästa'),
      (t.disabled = this.currentPage === this.totalPages),
      t.addEventListener('click', () => this.changePage(this.currentPage + 1));
    const n = document.createElement('span');
    (n.textContent = `Sida ${this.currentPage} av ${this.totalPages}`),
      this.paginationContainer.appendChild(e),
      this.paginationContainer.appendChild(n),
      this.paginationContainer.appendChild(t);
  }
  async changePage(e) {
    if (e < 1 || e > this.totalPages) return;
    (this.currentPage = e), this.backend.setPage(e);
    const { reviews: t } = await this.backend.fetchReviews();
    this.renderReviews(t), this.updatePagination();
  }
  updatePagination() {
    const e = this.paginationContainer.querySelector('button:first-child'),
      t = this.paginationContainer.querySelector('button:last-child'),
      n = this.paginationContainer.querySelector('span');
    (e.disabled = this.currentPage === 1),
      (t.disabled = this.currentPage === this.totalPages),
      (n.textContent = `Sida ${this.currentPage} av ${this.totalPages}`);
  }
}
class P {
  constructor(e, t) {
    (this.url = e), (this.movieId = t);
  }
  async fetchAverageRating() {
    try {
      const e = await fetch(`${this.url}/movie/${this.movieId}/ratings/average`);
      if (!e.ok) throw new Error('Failed to fetch average rating');
      return (await e.json()).averageRating;
    } catch (e) {
      return console.error('Error fetching average rating:', e), null;
    }
  }
}
class T {
  constructor(e) {
    this.ratingValue = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('rating');
    const t = document.createElement('span');
    return t.classList.add('rating__value'), (t.textContent = this.ratingValue.toFixed(1)), e.appendChild(t), e;
  }
}
class A {
  constructor(e, t) {
    (this.backend = e), (this.movieId = t);
  }
  async renderAvRating(e) {
    const t = await this.backend.fetchAverageRating();
    if (t !== null) {
      const n = new T(t);
      e.appendChild(n.render());
    }
  }
}
class N {
  constructor(e) {
    this.apiUrl = e;
  }
  async fetchTopMovies() {
    try {
      const e = await fetch(this.apiUrl),
        t = await e.json();
      if (!e.ok)
        throw (
          (console.error('Serverfel vid hämtning:', e.status, e.statusText, t),
          new Error('Serverfel vid hämtning av topplistan.'))
        );
      return console.log('Hämtade toppfilmer:', t), t;
    } catch (e) {
      console.error('Fel vid hämtning av topprankade filmer:', e);
      const t = document.createElement('span');
      (t.textContent = 'Kunde inte hämta populära filmer. Försök igen senare.'),
        (t.style.color = 'white'),
        (t.style.textAlign = 'center');
      const n = document.querySelector('.topmovies');
      return n && n.appendChild(t), [];
    }
  }
}
class F {
  constructor(e) {
    this.moviesList = document.querySelector(e);
  }
  clearList() {
    for (; this.moviesList.firstChild; ) this.moviesList.removeChild(this.moviesList.firstChild);
  }
  renderLoadingMessage() {
    this.clearList();
    const e = document.createElement('li');
    e.classList.add('loading__top_movies'), (e.textContent = 'Laddar topplistan...'), this.moviesList.appendChild(e);
  }
  renderErrorMessage() {
    this.clearList();
    const e = document.createElement('li');
    (e.textContent = 'Kunde inte ladda populära filmer.'),
      (e.style.color = 'white'),
      (e.style.textAlign = 'center'),
      this.moviesList.appendChild(e);
  }
  renderMovies(e) {
    if ((this.clearList(), !e.length)) {
      const t = document.createElement('li');
      (t.textContent = 'Inga topprankade filmer hittades.'), this.moviesList.appendChild(t);
      return;
    }
    e.forEach((t) => {
      var c;
      const n = document.createElement('li'),
        i = document.createElement('a');
      (i.href = `/movie/${t.id}`), (i.id = t.id);
      const a = document.createElement('article');
      a.classList.add('topmovie-card');
      const o = document.createElement('img');
      o.classList.add('topmovie-card__image'),
        (o.src = ((c = t.attributes.image) == null ? void 0 : c.url) || '/static/dist/images/Kino_doors.png'),
        (o.alt = `Movie title: ${t.attributes.title}`);
      const r = document.createElement('h3');
      r.classList.add('topmovie-card_title'), (r.textContent = t.attributes.title);
      const l = document.createElement('span');
      l.classList.add('topmovie-card_rating'),
        (l.textContent = `⭐ Rating: ${t.attributes.avgRating}/5`),
        a.appendChild(o),
        a.appendChild(r),
        a.appendChild(l),
        i.appendChild(a),
        n.appendChild(i),
        this.moviesList.appendChild(n);
    });
  }
}
if (document.querySelector('.reviews__container')) {
  const s = 'http://localhost:5080',
    e = v.getMovieIdFromPath(),
    t = new D(s, e),
    n = new P(s, e);
  new $(t).initReviews(document.querySelector('.reviews__container')),
    new A(n).renderAvRating(document.querySelector('.averageRating__container'));
} else console.log('Not on a movie page, skipping reviews.');
const p = document.querySelector('.review');
console.log(p);
try {
  p ? new M().render() : console.log('No review element found');
} catch (s) {
  console.error('Error initializing review service:', s);
}
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', async () => {
    E();
    const s = new N('/api/top-movies'),
      e = new F('.topmovies__list');
    e.renderLoadingMessage();
    const t = await s.fetchTopMovies();
    t.length ? e.renderMovies(t) : (e.renderErrorMessage(), console.log('No movies received, showing error message'));
  });
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-card')) y();
    else {
      const s = document.querySelector('.movies__header'),
        e = document.createElement('p');
      (e.textContent = 'Inga visningar för tillfället...'),
        e.classList.add('no-showings'),
        s.insertAdjacentElement('afterend', e);
    }
  });

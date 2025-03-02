document.addEventListener('DOMContentLoaded', () => {
  const t = document.querySelector('.hamburger'),
    e = document.querySelector('.hamburger__items'),
    i = document.querySelector('.hamburger__close');
  t &&
    e &&
    t.addEventListener('click', () => {
      e.classList.toggle('active'), t.classList.toggle('open');
    }),
    i &&
      i.addEventListener('click', () => {
        e.classList.remove('active'), t.classList.remove('open');
      });
});
class Jo {
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
class tr {
  constructor(e) {
    this.container = document.querySelector(e);
  }
  createLiveEvent({ title: e, description: i, image: s }) {
    const o = document.createElement('li');
    return (
      o.classList.add('live__list-item'),
      (o.innerHTML = `
        <div class="live__list-item-image-wrapper">
                <img src="${s}" class="live__list-item-image" alt="${e}" />
            </div>
            <div class="live__list-item-title">
                <h3>${e}</h3>
                <button class="live__list-item-btn" aria-label="Book ticket to live event">BOKA</button>
            </div>
            <div class="live__list-item-description">
                <p>${i}</p>
            </div>
            `),
      o
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
    const i = document.createDocumentFragment();
    e.forEach((s) => {
      const o = this.createLiveEvent(s);
      i.appendChild(o);
    }),
      this.container.appendChild(i);
  }
}
async function er() {
  const t = './static/dist/json/liveEvents.json',
    e = new Jo(t),
    i = new tr('.live__list');
  try {
    const s = await e.fetchData();
    i.renderLiveEvents(s);
  } catch (s) {
    console.error('Error initializing live events:', s);
  }
}
const ir = async () => {
  if (window.location.pathname.startsWith('/movie/')) {
    const e = (function () {
      const s = window.location.pathname.match(/\/movie\/(\d+)/);
      return s ? s[1] : null;
    })();
    if (e)
      try {
        const s = await (await fetch(`/api/screenings/${e}/movie`)).json();
        return !s || s.length === 0
          ? (console.warn('No screening available for this movie'), [])
          : s.map((a) => {
              const n = new Date(a.start_time),
                c = n.getFullYear(),
                d = (n.getMonth() + 1).toString().padStart(2, '0'),
                h = n.getDate().toString().padStart(2, '0'),
                f = n.getHours().toString().padStart(2, '0'),
                u = n.getMinutes().toString().padStart(2, '0');
              return { formattedTime: `${c}-${d}-${h} ${f}:${u}`, room: a.room };
            });
      } catch (i) {
        return console.error('Error fetching screenings:', i), null;
      }
    else return console.error('No movie ID found in the url'), null;
  }
  return null;
};
async function sr() {
  if (window.location.pathname.startsWith('/movie/')) {
    const t = await ir(),
      e = document.querySelector('.screening__info-list');
    if (!t || t.length === 0) {
      console.log('No screening data available.');
      const i = document.createElement('li');
      (i.innerHTML = ' <span class="screening-time">Listan är tom</span>'), e.appendChild(i);
      return;
    }
    t.sort((i, s) => {
      const o = new Date(i.formattedTime),
        a = new Date(s.formattedTime);
      return o - a;
    }),
      (e.innerHTML = ''),
      t.forEach(({ formattedTime: i, room: s }) => {
        const o = document.createElement('li');
        (o.innerHTML = ` <span class="screening-time">Tid: ${i}</span>
  <span class="screening-room">Sal: ${s}</span>`),
          e.appendChild(o);
      });
  }
}
sr();
const As = async (t) => {
  const e = `/movie/${t}/screenings/upcoming`;
  return await (await fetch(e)).json();
};
async function or() {
  const t = document.querySelectorAll('.movie-link'),
    e = Array.prototype.map.call(t, (o) => o.id);
  let i = 0;
  const s = [];
  for (const o of e)
    try {
      const a = await As(o);
      console.log(`Upcoming screenings for movie ID ${o}:`, a);
      const n = document.getElementById(o);
      if (!n) {
        console.error(`No movie container found for movie ID ${o}`);
        continue;
      }
      if (a.length > 0) {
        const c = a[0],
          d = new Date(c.attributes.start_time),
          h = c.attributes.room;
        if (d && h) {
          const f = document.createElement('p');
          f.classList.add('showings'),
            (f.textContent = `${h} - ${d.toLocaleString()}`),
            n.appendChild(f),
            i++,
            s.push(c);
        } else console.error(`Invalid screening data for movie ID ${o}:`, c);
      } else {
        const c = document.createElement('p');
        (c.textContent = 'Inga visningar'), c.classList.add('no-showings'), n.appendChild(c);
      }
      if (i >= 10) break;
    } catch (a) {
      console.error(`Error fetching screenings for movie ID ${o}:`, a);
    }
  if (i < 10)
    for (const o of e)
      try {
        const n = (await As(o)).filter((c) => !s.includes(c));
        for (const c of n) {
          if (i >= 10) break;
          const d = new Date(c.attributes.start_time),
            h = c.attributes.room;
          if (d && h) {
            const f = document.getElementById(o),
              u = document.createElement('p');
            u.classList.add('showings'),
              (u.textContent = `${h} - ${d.toLocaleString()}`),
              f.appendChild(u),
              i++,
              s.push(c);
          } else console.error(`Invalid screening data for movie ID ${o}:`, c);
        }
        if (i >= 10) break;
      } catch (a) {
        console.error(`Error fetching screenings for movie ID ${o}:`, a);
      }
}
class po {
  static getMovieIdFromPath() {
    const i = window.location.pathname.match(/\/movie\/(\d+)/);
    if (!i || !i[1]) throw new Error('Movie ID not found in URL');
    return i[1];
  }
}
class rr {
  static validate(e, i, s) {
    if (!i || i < 1) throw new Error('Please select a rating');
    if (!(e != null && e.trim())) throw new Error('Please write a review');
    if (!s.authBtnClick && !s.isLoggedIn) throw new Error('Wrong password');
    return !0;
  }
}
class ar {
  static format(e, i, s, o) {
    return {
      data: {
        comment: e,
        rating: i,
        author: o.username,
        verified: o.status,
        movie: s,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
class nr {
  static async submit(e, i) {
    const s = await fetch('/movie/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(i),
    });
    if (!s.ok) throw new Error('Failed to submit review');
    return s.json();
  }
}
class lr extends EventTarget {
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
    const i = document.createElement('span');
    (i.className = 'hint'), (i.innerHTML = 'The default password is: default');
    const s = document.createElement('form');
    (s.method = 'dialog'), (s.className = 'auth-form');
    const o = document.createElement('div');
    o.className = 'input-group';
    const a = document.createElement('label');
    (a.className = 'auth-label'), (a.htmlFor = 'username'), (a.textContent = 'Username:');
    const n = document.createElement('input');
    (n.className = 'auth-input'), (n.type = 'text'), (n.id = 'username'), (n.required = !0);
    const c = document.createElement('div');
    c.className = 'input-group';
    const d = document.createElement('label');
    (d.className = 'auth-label'), (d.htmlFor = 'password'), (d.textContent = 'Password:');
    const h = document.createElement('input');
    (h.className = 'auth-input'), (h.type = 'password'), (h.id = 'password'), (h.required = !0);
    const f = document.createElement('button');
    return (
      (f.className = 'submit-button'),
      (f.type = 'submit'),
      (f.textContent = 'Login'),
      e.addEventListener('click', () => {
        (this.authBtnClick = !0), this.dispatchEvent(new Event('auth')), this.dialog.close();
      }),
      s.addEventListener('submit', async (u) => {
        u.preventDefault();
        try {
          const p = await this.api.login(n.value, h.value),
            m = await this.api.getUserData(p.token);
          (this.result = m.user.username),
            (this.status = m.user.isVerified),
            (this.isLoggedIn = m.user.isLoggedIn),
            this.dispatchEvent(new Event('auth')),
            this.dialog.close();
        } catch {
          this.dialog.close(), this.dispatchEvent(new Event('auth'));
        }
      }),
      o.append(a, n),
      c.append(d, h),
      s.append(o, c, f, i, e),
      this.dialog.append(s),
      this.dialog
    );
  }
}
class cr {
  constructor(e) {
    this.apiUrl = e;
  }
  async login(e, i) {
    const s = `${e}:${i}`,
      o = btoa(s),
      a = await fetch(this.apiUrl + '/login', { method: 'POST', headers: { Authorization: 'Basic ' + o } });
    if (!a.ok) throw new Error('Login failed');
    return await a.json();
  }
  async getUserData(e) {
    const i = await fetch(this.apiUrl + '/user', { headers: { Authorization: 'Bearer ' + e } });
    if (!i.ok) throw new Error('Failed to get user data');
    return await i.json();
  }
}
class dr {
  constructor() {}
  static async showAuthDialog() {
    const e = new cr(''),
      i = new lr(e),
      s = i.render();
    return (
      document.body.appendChild(s),
      s.showModal(),
      await new Promise((o) => {
        i.addEventListener('auth', o, { once: !0 });
      }),
      s.close(),
      s.remove(),
      { username: i.result, status: i.status, isLoggedIn: i.isLoggedIn, authBtnClick: i.authBtnClick }
    );
  }
}
class hr {
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
      const i = document.createElement('span');
      (i.className = 'review__star'), (i.dataset.value = e), (i.textContent = '★'), this.stars.appendChild(i);
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
      const i = parseInt(e.dataset.value);
      e.classList.toggle('active', i <= this.selectedRating);
    });
  }
  async validateReview() {
    const e = this.textarea.value.trim(),
      i = po.getMovieIdFromPath(),
      s = await dr.showAuthDialog();
    return console.log('author:', s), rr.validate(e, this.selectedRating, s), ar.format(e, this.selectedRating, i, s);
  }
  async handleSubmit() {
    try {
      const e = await this.validateReview();
      console.log(`Film id: ${e.data.movie}`),
        console.log(`Film data: ${e}`),
        await nr.submit(e.data.movie, e),
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
  showFeedback(e, i) {
    const s = document.createElement('div');
    (s.className = `review__feedback review__feedback--${i}`),
      (s.textContent = e),
      this.container.appendChild(s),
      setTimeout(() => s.remove(), 5e3);
  }
}
class ur {
  constructor(e, i, s = 1, o = 5) {
    (this.url = e), (this.movieId = i), (this.page = s), (this.pageSize = o);
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
class pr {
  constructor(e) {
    this.data = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('review');
    const i = document.createElement('span');
    (i.textContent = this.data.rating), e.appendChild(i);
    const s = document.createElement('p');
    (s.textContent = this.data.comment), e.appendChild(s);
    const o = document.createElement('h4');
    return (o.textContent = this.data.author), e.appendChild(o), e;
  }
}
class fr {
  constructor(e) {
    (this.backend = e), (this.currentPage = 1), (this.totalPages = 1);
  }
  async initReviews(e) {
    const { reviews: i, meta: s } = await this.backend.fetchReviews();
    (this.totalPages = s.totalPages),
      (this.reviewsContainer = document.createElement('div')),
      e.appendChild(this.reviewsContainer),
      (this.paginationContainer = document.createElement('div')),
      this.paginationContainer.classList.add('pagination'),
      e.appendChild(this.paginationContainer),
      this.renderReviews(i),
      this.renderPagination();
  }
  renderReviews(e) {
    (this.reviewsContainer.innerHTML = ''),
      e.forEach((i) => {
        const s = new pr(i);
        this.reviewsContainer.append(s.render());
      });
  }
  renderPagination() {
    this.paginationContainer.innerHTML = '';
    const e = document.createElement('button');
    (e.textContent = 'Föregående'),
      (e.disabled = this.currentPage === 1),
      e.addEventListener('click', () => this.changePage(this.currentPage - 1));
    const i = document.createElement('button');
    (i.textContent = 'Nästa'),
      (i.disabled = this.currentPage === this.totalPages),
      i.addEventListener('click', () => this.changePage(this.currentPage + 1));
    const s = document.createElement('span');
    (s.textContent = `Sida ${this.currentPage} av ${this.totalPages}`),
      this.paginationContainer.appendChild(e),
      this.paginationContainer.appendChild(s),
      this.paginationContainer.appendChild(i);
  }
  async changePage(e) {
    if (e < 1 || e > this.totalPages) return;
    (this.currentPage = e), this.backend.setPage(e);
    const { reviews: i } = await this.backend.fetchReviews();
    this.renderReviews(i), this.updatePagination();
  }
  updatePagination() {
    const e = this.paginationContainer.querySelector('button:first-child'),
      i = this.paginationContainer.querySelector('button:last-child'),
      s = this.paginationContainer.querySelector('span');
    (e.disabled = this.currentPage === 1),
      (i.disabled = this.currentPage === this.totalPages),
      (s.textContent = `Sida ${this.currentPage} av ${this.totalPages}`);
  }
}
class mr {
  constructor(e, i) {
    (this.url = e), (this.movieId = i);
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
class gr {
  constructor(e) {
    this.ratingValue = e;
  }
  render() {
    const e = document.createElement('div');
    e.classList.add('rating');
    const i = document.createElement('span');
    return i.classList.add('rating__value'), (i.textContent = this.ratingValue.toFixed(1)), e.appendChild(i), e;
  }
}
class br {
  constructor(e, i) {
    (this.backend = e), (this.movieId = i);
  }
  async renderAvRating(e) {
    const i = await this.backend.fetchAverageRating();
    if (i !== null) {
      const s = new gr(i);
      e.appendChild(s.render());
    }
  }
}
class vr {
  constructor(e) {
    this.apiUrl = e;
  }
  async fetchTopMovies() {
    try {
      const e = await fetch(this.apiUrl),
        i = await e.json();
      if (!e.ok)
        throw (
          (console.error('Serverfel vid hämtning:', e.status, e.statusText, i),
          new Error('Serverfel vid hämtning av topplistan.'))
        );
      return console.log('Hämtade toppfilmer:', i), i;
    } catch (e) {
      console.error('Fel vid hämtning av topprankade filmer:', e);
      const i = document.createElement('span');
      (i.textContent = 'Kunde inte hämta populära filmer. Försök igen senare.'),
        (i.style.color = 'white'),
        (i.style.textAlign = 'center');
      const s = document.querySelector('.topmovies');
      return s && s.appendChild(i), [];
    }
  }
}
class yr {
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
      const i = document.createElement('li');
      (i.textContent = 'Inga topprankade filmer hittades.'), this.moviesList.appendChild(i);
      return;
    }
    e.forEach((i) => {
      var h;
      const s = document.createElement('li'),
        o = document.createElement('a');
      (o.href = `/movie/${i.id}`), (o.id = i.id);
      const a = document.createElement('article');
      a.classList.add('topmovie-card');
      const n = document.createElement('img');
      n.classList.add('topmovie-card__image'),
        (n.src = ((h = i.attributes.image) == null ? void 0 : h.url) || '/static/dist/images/Kino_doors.png'),
        (n.alt = `Movie title: ${i.attributes.title}`);
      const c = document.createElement('h3');
      c.classList.add('topmovie-card_title'), (c.textContent = i.attributes.title);
      const d = document.createElement('span');
      d.classList.add('topmovie-card_rating'),
        (d.textContent = `⭐ Rating: ${i.attributes.avgRating}/5`),
        a.appendChild(n),
        a.appendChild(c),
        a.appendChild(d),
        o.appendChild(a),
        s.appendChild(o),
        this.moviesList.appendChild(s);
    });
  }
}
var fo = Object.defineProperty,
  wr = Object.defineProperties,
  _r = Object.getOwnPropertyDescriptor,
  xr = Object.getOwnPropertyDescriptors,
  Ts = Object.getOwnPropertySymbols,
  kr = Object.prototype.hasOwnProperty,
  Cr = Object.prototype.propertyIsEnumerable,
  Bi = (t, e) => ((e = Symbol[t]) ? e : Symbol.for('Symbol.' + t)),
  us = (t) => {
    throw TypeError(t);
  },
  Ls = (t, e, i) => (e in t ? fo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i)),
  Qt = (t, e) => {
    for (var i in e || (e = {})) kr.call(e, i) && Ls(t, i, e[i]);
    if (Ts) for (var i of Ts(e)) Cr.call(e, i) && Ls(t, i, e[i]);
    return t;
  },
  ii = (t, e) => wr(t, xr(e)),
  r = (t, e, i, s) => {
    for (var o = s > 1 ? void 0 : s ? _r(e, i) : e, a = t.length - 1, n; a >= 0; a--)
      (n = t[a]) && (o = (s ? n(e, i, o) : n(o)) || o);
    return s && o && fo(e, i, o), o;
  },
  mo = (t, e, i) => e.has(t) || us('Cannot ' + i),
  $r = (t, e, i) => (mo(t, e, 'read from private field'), e.get(t)),
  Sr = (t, e, i) =>
    e.has(t) ? us('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, i),
  zr = (t, e, i, s) => (mo(t, e, 'write to private field'), e.set(t, i), i),
  Er = function (t, e) {
    (this[0] = t), (this[1] = e);
  },
  Ar = (t) => {
    var e = t[Bi('asyncIterator')],
      i = !1,
      s,
      o = {};
    return (
      e == null
        ? ((e = t[Bi('iterator')]()), (s = (a) => (o[a] = (n) => e[a](n))))
        : ((e = e.call(t)),
          (s = (a) =>
            (o[a] = (n) => {
              if (i) {
                if (((i = !1), a === 'throw')) throw n;
                return n;
              }
              return (
                (i = !0),
                {
                  done: !1,
                  value: new Er(
                    new Promise((c) => {
                      var d = e[a](n);
                      d instanceof Object || us('Object expected'), c(d);
                    }),
                    1
                  ),
                }
              );
            }))),
      (o[Bi('iterator')] = () => o),
      s('next'),
      'throw' in e
        ? s('throw')
        : (o.throw = (a) => {
            throw a;
          }),
      'return' in e && s('return'),
      o
    );
  },
  Me = new WeakMap(),
  Re = new WeakMap(),
  Fe = new WeakMap(),
  Vi = new WeakSet(),
  pi = new WeakMap(),
  Zt = class {
    constructor(t, e) {
      (this.handleFormData = (i) => {
        const s = this.options.disabled(this.host),
          o = this.options.name(this.host),
          a = this.options.value(this.host),
          n = this.host.tagName.toLowerCase() === 'sl-button';
        this.host.isConnected &&
          !s &&
          !n &&
          typeof o == 'string' &&
          o.length > 0 &&
          typeof a < 'u' &&
          (Array.isArray(a)
            ? a.forEach((c) => {
                i.formData.append(o, c.toString());
              })
            : i.formData.append(o, a.toString()));
      }),
        (this.handleFormSubmit = (i) => {
          var s;
          const o = this.options.disabled(this.host),
            a = this.options.reportValidity;
          this.form &&
            !this.form.noValidate &&
            ((s = Me.get(this.form)) == null ||
              s.forEach((n) => {
                this.setUserInteracted(n, !0);
              })),
            this.form &&
              !this.form.noValidate &&
              !o &&
              !a(this.host) &&
              (i.preventDefault(), i.stopImmediatePropagation());
        }),
        (this.handleFormReset = () => {
          this.options.setValue(this.host, this.options.defaultValue(this.host)),
            this.setUserInteracted(this.host, !1),
            pi.set(this.host, []);
        }),
        (this.handleInteraction = (i) => {
          const s = pi.get(this.host);
          s.includes(i.type) || s.push(i.type),
            s.length === this.options.assumeInteractionOn.length && this.setUserInteracted(this.host, !0);
        }),
        (this.checkFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const i = this.form.querySelectorAll('*');
            for (const s of i) if (typeof s.checkValidity == 'function' && !s.checkValidity()) return !1;
          }
          return !0;
        }),
        (this.reportFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const i = this.form.querySelectorAll('*');
            for (const s of i) if (typeof s.reportValidity == 'function' && !s.reportValidity()) return !1;
          }
          return !0;
        }),
        (this.host = t).addController(this),
        (this.options = Qt(
          {
            form: (i) => {
              const s = i.form;
              if (s) {
                const a = i.getRootNode().querySelector(`#${s}`);
                if (a) return a;
              }
              return i.closest('form');
            },
            name: (i) => i.name,
            value: (i) => i.value,
            defaultValue: (i) => i.defaultValue,
            disabled: (i) => {
              var s;
              return (s = i.disabled) != null ? s : !1;
            },
            reportValidity: (i) => (typeof i.reportValidity == 'function' ? i.reportValidity() : !0),
            checkValidity: (i) => (typeof i.checkValidity == 'function' ? i.checkValidity() : !0),
            setValue: (i, s) => (i.value = s),
            assumeInteractionOn: ['sl-input'],
          },
          e
        ));
    }
    hostConnected() {
      const t = this.options.form(this.host);
      t && this.attachForm(t),
        pi.set(this.host, []),
        this.options.assumeInteractionOn.forEach((e) => {
          this.host.addEventListener(e, this.handleInteraction);
        });
    }
    hostDisconnected() {
      this.detachForm(),
        pi.delete(this.host),
        this.options.assumeInteractionOn.forEach((t) => {
          this.host.removeEventListener(t, this.handleInteraction);
        });
    }
    hostUpdated() {
      const t = this.options.form(this.host);
      t || this.detachForm(),
        t && this.form !== t && (this.detachForm(), this.attachForm(t)),
        this.host.hasUpdated && this.setValidity(this.host.validity.valid);
    }
    attachForm(t) {
      t
        ? ((this.form = t),
          Me.has(this.form) ? Me.get(this.form).add(this.host) : Me.set(this.form, new Set([this.host])),
          this.form.addEventListener('formdata', this.handleFormData),
          this.form.addEventListener('submit', this.handleFormSubmit),
          this.form.addEventListener('reset', this.handleFormReset),
          Re.has(this.form) ||
            (Re.set(this.form, this.form.reportValidity), (this.form.reportValidity = () => this.reportFormValidity())),
          Fe.has(this.form) ||
            (Fe.set(this.form, this.form.checkValidity), (this.form.checkValidity = () => this.checkFormValidity())))
        : (this.form = void 0);
    }
    detachForm() {
      if (!this.form) return;
      const t = Me.get(this.form);
      t &&
        (t.delete(this.host),
        t.size <= 0 &&
          (this.form.removeEventListener('formdata', this.handleFormData),
          this.form.removeEventListener('submit', this.handleFormSubmit),
          this.form.removeEventListener('reset', this.handleFormReset),
          Re.has(this.form) && ((this.form.reportValidity = Re.get(this.form)), Re.delete(this.form)),
          Fe.has(this.form) && ((this.form.checkValidity = Fe.get(this.form)), Fe.delete(this.form)),
          (this.form = void 0)));
    }
    setUserInteracted(t, e) {
      e ? Vi.add(t) : Vi.delete(t), t.requestUpdate();
    }
    doAction(t, e) {
      if (this.form) {
        const i = document.createElement('button');
        (i.type = t),
          (i.style.position = 'absolute'),
          (i.style.width = '0'),
          (i.style.height = '0'),
          (i.style.clipPath = 'inset(50%)'),
          (i.style.overflow = 'hidden'),
          (i.style.whiteSpace = 'nowrap'),
          e &&
            ((i.name = e.name),
            (i.value = e.value),
            ['formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'].forEach((s) => {
              e.hasAttribute(s) && i.setAttribute(s, e.getAttribute(s));
            })),
          this.form.append(i),
          i.click(),
          i.remove();
      }
    }
    getForm() {
      var t;
      return (t = this.form) != null ? t : null;
    }
    reset(t) {
      this.doAction('reset', t);
    }
    submit(t) {
      this.doAction('submit', t);
    }
    setValidity(t) {
      const e = this.host,
        i = !!Vi.has(e),
        s = !!e.required;
      e.toggleAttribute('data-required', s),
        e.toggleAttribute('data-optional', !s),
        e.toggleAttribute('data-invalid', !t),
        e.toggleAttribute('data-valid', t),
        e.toggleAttribute('data-user-invalid', !t && i),
        e.toggleAttribute('data-user-valid', t && i);
    }
    updateValidity() {
      const t = this.host;
      this.setValidity(t.validity.valid);
    }
    emitInvalidEvent(t) {
      const e = new CustomEvent('sl-invalid', { bubbles: !1, composed: !1, cancelable: !0, detail: {} });
      t || e.preventDefault(), this.host.dispatchEvent(e) || t == null || t.preventDefault();
    }
  },
  Li = Object.freeze({
    badInput: !1,
    customError: !1,
    patternMismatch: !1,
    rangeOverflow: !1,
    rangeUnderflow: !1,
    stepMismatch: !1,
    tooLong: !1,
    tooShort: !1,
    typeMismatch: !1,
    valid: !0,
    valueMissing: !1,
  }),
  Tr = Object.freeze(ii(Qt({}, Li), { valid: !1, valueMissing: !0 })),
  Lr = Object.freeze(ii(Qt({}, Li), { valid: !1, customError: !0 }));
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const wi = globalThis,
  ps =
    wi.ShadowRoot &&
    (wi.ShadyCSS === void 0 || wi.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  fs = Symbol(),
  Is = new WeakMap();
let go = class {
  constructor(e, i, s) {
    if (((this._$cssResult$ = !0), s !== fs))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    (this.cssText = e), (this.t = i);
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ps && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = Is.get(i)),
        e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Is.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ir = (t) => new go(typeof t == 'string' ? t : t + '', void 0, fs),
  T = (t, ...e) => {
    const i =
      t.length === 1
        ? t[0]
        : e.reduce(
            (s, o, a) =>
              s +
              ((n) => {
                if (n._$cssResult$ === !0) return n.cssText;
                if (typeof n == 'number') return n;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    n +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                );
              })(o) +
              t[a + 1],
            t[0]
          );
    return new go(i, t, fs);
  },
  Dr = (t, e) => {
    if (ps) t.adoptedStyleSheets = e.map((i) => (i instanceof CSSStyleSheet ? i : i.styleSheet));
    else
      for (const i of e) {
        const s = document.createElement('style'),
          o = wi.litNonce;
        o !== void 0 && s.setAttribute('nonce', o), (s.textContent = i.cssText), t.appendChild(s);
      }
  },
  Ds = ps
    ? (t) => t
    : (t) =>
        t instanceof CSSStyleSheet
          ? ((e) => {
              let i = '';
              for (const s of e.cssRules) i += s.cssText;
              return Ir(i);
            })(t)
          : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: Pr,
    defineProperty: Or,
    getOwnPropertyDescriptor: Mr,
    getOwnPropertyNames: Rr,
    getOwnPropertySymbols: Fr,
    getPrototypeOf: Br,
  } = Object,
  se = globalThis,
  Ps = se.trustedTypes,
  Vr = Ps ? Ps.emptyScript : '',
  Ni = se.reactiveElementPolyfillSupport,
  Ue = (t, e) => t,
  Se = {
    toAttribute(t, e) {
      switch (e) {
        case Boolean:
          t = t ? Vr : null;
          break;
        case Object:
        case Array:
          t = t == null ? t : JSON.stringify(t);
      }
      return t;
    },
    fromAttribute(t, e) {
      let i = t;
      switch (e) {
        case Boolean:
          i = t !== null;
          break;
        case Number:
          i = t === null ? null : Number(t);
          break;
        case Object:
        case Array:
          try {
            i = JSON.parse(t);
          } catch {
            i = null;
          }
      }
      return i;
    },
  },
  ms = (t, e) => !Pr(t, e),
  Os = { attribute: !0, type: String, converter: Se, reflect: !1, hasChanged: ms };
Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  se.litPropertyMetadata ?? (se.litPropertyMetadata = new WeakMap());
class ke extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Os) {
    if ((i.state && (i.attribute = !1), this._$Ei(), this.elementProperties.set(e, i), !i.noAccessor)) {
      const s = Symbol(),
        o = this.getPropertyDescriptor(e, s, i);
      o !== void 0 && Or(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: o, set: a } = Mr(this.prototype, e) ?? {
      get() {
        return this[i];
      },
      set(n) {
        this[i] = n;
      },
    };
    return {
      get() {
        return o == null ? void 0 : o.call(this);
      },
      set(n) {
        const c = o == null ? void 0 : o.call(this);
        a.call(this, n), this.requestUpdate(e, c, s);
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Os;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ue('elementProperties'))) return;
    const e = Br(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), (this.elementProperties = new Map(e.elementProperties));
  }
  static finalize() {
    if (this.hasOwnProperty(Ue('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(Ue('properties')))) {
      const i = this.properties,
        s = [...Rr(i), ...Fr(i)];
      for (const o of s) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, o] of i) this.elementProperties.set(s, o);
    }
    this._$Eh = new Map();
    for (const [i, s] of this.elementProperties) {
      const o = this._$Eu(i, s);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const o of s) i.unshift(Ds(o));
    } else e !== void 0 && i.push(Ds(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == 'string' ? s : typeof e == 'string' ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), (this._$Ep = void 0), (this.isUpdatePending = !1), (this.hasUpdated = !1), (this._$Em = null), this._$Ev();
  }
  _$Ev() {
    var e;
    (this._$ES = new Promise((i) => (this.enableUpdating = i))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = new Set())).add(e),
      this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = new Map(),
      i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Dr(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      (e = this._$EO) == null ||
        e.forEach((i) => {
          var s;
          return (s = i.hostConnected) == null ? void 0 : s.call(i);
        });
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null ||
      e.forEach((i) => {
        var s;
        return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
      });
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$EC(e, i) {
    var a;
    const s = this.constructor.elementProperties.get(e),
      o = this.constructor._$Eu(e, s);
    if (o !== void 0 && s.reflect === !0) {
      const n = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : Se).toAttribute(
        i,
        s.type
      );
      (this._$Em = e), n == null ? this.removeAttribute(o) : this.setAttribute(o, n), (this._$Em = null);
    }
  }
  _$AK(e, i) {
    var a;
    const s = this.constructor,
      o = s._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const n = s.getPropertyOptions(o),
        c =
          typeof n.converter == 'function'
            ? { fromAttribute: n.converter }
            : ((a = n.converter) == null ? void 0 : a.fromAttribute) !== void 0
              ? n.converter
              : Se;
      (this._$Em = o), (this[o] = c.fromAttribute(i, n.type)), (this._$Em = null);
    }
  }
  requestUpdate(e, i, s) {
    if (e !== void 0) {
      if ((s ?? (s = this.constructor.getPropertyOptions(e)), !(s.hasChanged ?? ms)(this[e], i))) return;
      this.P(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(e, i, s) {
    this._$AL.has(e) || this._$AL.set(e, i),
      s.reflect === !0 && this._$Em !== e && (this._$Ej ?? (this._$Ej = new Set())).add(e);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && (await e), !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep)) {
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0)
        for (const [a, n] of o) n.wrapped !== !0 || this._$AL.has(a) || this[a] === void 0 || this.P(a, this[a], n);
    }
    let e = !1;
    const i = this._$AL;
    try {
      (e = this.shouldUpdate(i)),
        e
          ? (this.willUpdate(i),
            (s = this._$EO) == null ||
              s.forEach((o) => {
                var a;
                return (a = o.hostUpdate) == null ? void 0 : a.call(o);
              }),
            this.update(i))
          : this._$EU();
    } catch (o) {
      throw ((e = !1), this._$EU(), o);
    }
    e && this._$AE(i);
  }
  willUpdate(e) {}
  _$AE(e) {
    var i;
    (i = this._$EO) == null ||
      i.forEach((s) => {
        var o;
        return (o = s.hostUpdated) == null ? void 0 : o.call(s);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e);
  }
  _$EU() {
    (this._$AL = new Map()), (this.isUpdatePending = !1);
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((i) => this._$EC(i, this[i]))), this._$EU();
  }
  updated(e) {}
  firstUpdated(e) {}
}
(ke.elementStyles = []),
  (ke.shadowRootOptions = { mode: 'open' }),
  (ke[Ue('elementProperties')] = new Map()),
  (ke[Ue('finalized')] = new Map()),
  Ni == null || Ni({ ReactiveElement: ke }),
  (se.reactiveElementVersions ?? (se.reactiveElementVersions = [])).push('2.0.4');
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const qe = globalThis,
  Ci = qe.trustedTypes,
  Ms = Ci ? Ci.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
  bo = '$lit$',
  ee = `lit$${Math.random().toFixed(9).slice(2)}$`,
  vo = '?' + ee,
  Nr = `<${vo}>`,
  fe = document,
  Ze = () => fe.createComment(''),
  Je = (t) => t === null || (typeof t != 'object' && typeof t != 'function'),
  gs = Array.isArray,
  Hr = (t) => gs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == 'function',
  Hi = `[ 	
\f\r]`,
  Be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Rs = /-->/g,
  Fs = />/g,
  ce = RegExp(
    `>|${Hi}(?:([^\\s"'>=/]+)(${Hi}*=${Hi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g'
  ),
  Bs = /'/g,
  Vs = /"/g,
  yo = /^(?:script|style|textarea|title)$/i,
  Ur =
    (t) =>
    (e, ...i) => ({ _$litType$: t, strings: e, values: i }),
  y = Ur(1),
  kt = Symbol.for('lit-noChange'),
  K = Symbol.for('lit-nothing'),
  Ns = new WeakMap(),
  ue = fe.createTreeWalker(fe, 129);
function wo(t, e) {
  if (!gs(t) || !t.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return Ms !== void 0 ? Ms.createHTML(e) : e;
}
const qr = (t, e) => {
  const i = t.length - 1,
    s = [];
  let o,
    a = e === 2 ? '<svg>' : e === 3 ? '<math>' : '',
    n = Be;
  for (let c = 0; c < i; c++) {
    const d = t[c];
    let h,
      f,
      u = -1,
      p = 0;
    for (; p < d.length && ((n.lastIndex = p), (f = n.exec(d)), f !== null); )
      (p = n.lastIndex),
        n === Be
          ? f[1] === '!--'
            ? (n = Rs)
            : f[1] !== void 0
              ? (n = Fs)
              : f[2] !== void 0
                ? (yo.test(f[2]) && (o = RegExp('</' + f[2], 'g')), (n = ce))
                : f[3] !== void 0 && (n = ce)
          : n === ce
            ? f[0] === '>'
              ? ((n = o ?? Be), (u = -1))
              : f[1] === void 0
                ? (u = -2)
                : ((u = n.lastIndex - f[2].length), (h = f[1]), (n = f[3] === void 0 ? ce : f[3] === '"' ? Vs : Bs))
            : n === Vs || n === Bs
              ? (n = ce)
              : n === Rs || n === Fs
                ? (n = Be)
                : ((n = ce), (o = void 0));
    const m = n === ce && t[c + 1].startsWith('/>') ? ' ' : '';
    a +=
      n === Be ? d + Nr : u >= 0 ? (s.push(h), d.slice(0, u) + bo + d.slice(u) + ee + m) : d + ee + (u === -2 ? c : m);
  }
  return [wo(t, a + (t[i] || '<?>') + (e === 2 ? '</svg>' : e === 3 ? '</math>' : '')), s];
};
class ti {
  constructor({ strings: e, _$litType$: i }, s) {
    let o;
    this.parts = [];
    let a = 0,
      n = 0;
    const c = e.length - 1,
      d = this.parts,
      [h, f] = qr(e, i);
    if (((this.el = ti.createElement(h, s)), (ue.currentNode = this.el.content), i === 2 || i === 3)) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (o = ue.nextNode()) !== null && d.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes())
          for (const u of o.getAttributeNames())
            if (u.endsWith(bo)) {
              const p = f[n++],
                m = o.getAttribute(u).split(ee),
                g = /([.?@])?(.*)/.exec(p);
              d.push({
                type: 1,
                index: a,
                name: g[2],
                strings: m,
                ctor: g[1] === '.' ? jr : g[1] === '?' ? Kr : g[1] === '@' ? Yr : Ii,
              }),
                o.removeAttribute(u);
            } else u.startsWith(ee) && (d.push({ type: 6, index: a }), o.removeAttribute(u));
        if (yo.test(o.tagName)) {
          const u = o.textContent.split(ee),
            p = u.length - 1;
          if (p > 0) {
            o.textContent = Ci ? Ci.emptyScript : '';
            for (let m = 0; m < p; m++) o.append(u[m], Ze()), ue.nextNode(), d.push({ type: 2, index: ++a });
            o.append(u[p], Ze());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === vo) d.push({ type: 2, index: a });
        else {
          let u = -1;
          for (; (u = o.data.indexOf(ee, u + 1)) !== -1; ) d.push({ type: 7, index: a }), (u += ee.length - 1);
        }
      a++;
    }
  }
  static createElement(e, i) {
    const s = fe.createElement('template');
    return (s.innerHTML = e), s;
  }
}
function ze(t, e, i = t, s) {
  var n, c;
  if (e === kt) return e;
  let o = s !== void 0 ? ((n = i._$Co) == null ? void 0 : n[s]) : i._$Cl;
  const a = Je(e) ? void 0 : e._$litDirective$;
  return (
    (o == null ? void 0 : o.constructor) !== a &&
      ((c = o == null ? void 0 : o._$AO) == null || c.call(o, !1),
      a === void 0 ? (o = void 0) : ((o = new a(t)), o._$AT(t, i, s)),
      s !== void 0 ? ((i._$Co ?? (i._$Co = []))[s] = o) : (i._$Cl = o)),
    o !== void 0 && (e = ze(t, o._$AS(t, e.values), o, s)),
    e
  );
}
class Wr {
  constructor(e, i) {
    (this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = i);
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const {
        el: { content: i },
        parts: s,
      } = this._$AD,
      o = ((e == null ? void 0 : e.creationScope) ?? fe).importNode(i, !0);
    ue.currentNode = o;
    let a = ue.nextNode(),
      n = 0,
      c = 0,
      d = s[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let h;
        d.type === 2
          ? (h = new si(a, a.nextSibling, this, e))
          : d.type === 1
            ? (h = new d.ctor(a, d.name, d.strings, this, e))
            : d.type === 6 && (h = new Xr(a, this, e)),
          this._$AV.push(h),
          (d = s[++c]);
      }
      n !== (d == null ? void 0 : d.index) && ((a = ue.nextNode()), n++);
    }
    return (ue.currentNode = fe), o;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV)
      s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), (i += s.strings.length - 2)) : s._$AI(e[i])), i++;
  }
}
class si {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, s, o) {
    (this.type = 2),
      (this._$AH = K),
      (this._$AN = void 0),
      (this._$AA = e),
      (this._$AB = i),
      (this._$AM = s),
      (this.options = o),
      (this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0);
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    (e = ze(this, e, i)),
      Je(e)
        ? e === K || e == null || e === ''
          ? (this._$AH !== K && this._$AR(), (this._$AH = K))
          : e !== this._$AH && e !== kt && this._(e)
        : e._$litType$ !== void 0
          ? this.$(e)
          : e.nodeType !== void 0
            ? this.T(e)
            : Hr(e)
              ? this.k(e)
              : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
  }
  _(e) {
    this._$AH !== K && Je(this._$AH) ? (this._$AA.nextSibling.data = e) : this.T(fe.createTextNode(e)), (this._$AH = e);
  }
  $(e) {
    var a;
    const { values: i, _$litType$: s } = e,
      o =
        typeof s == 'number'
          ? this._$AC(e)
          : (s.el === void 0 && (s.el = ti.createElement(wo(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === o) this._$AH.p(i);
    else {
      const n = new Wr(o, this),
        c = n.u(this.options);
      n.p(i), this.T(c), (this._$AH = n);
    }
  }
  _$AC(e) {
    let i = Ns.get(e.strings);
    return i === void 0 && Ns.set(e.strings, (i = new ti(e))), i;
  }
  k(e) {
    gs(this._$AH) || ((this._$AH = []), this._$AR());
    const i = this._$AH;
    let s,
      o = 0;
    for (const a of e)
      o === i.length ? i.push((s = new si(this.O(Ze()), this.O(Ze()), this, this.options))) : (s = i[o]),
        s._$AI(a),
        o++;
    o < i.length && (this._$AR(s && s._$AB.nextSibling, o), (i.length = o));
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); e && e !== this._$AB; ) {
      const o = e.nextSibling;
      e.remove(), (e = o);
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && ((this._$Cv = e), (i = this._$AP) == null || i.call(this, e));
  }
}
class Ii {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, o, a) {
    (this.type = 1),
      (this._$AH = K),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = i),
      (this._$AM = o),
      (this.options = a),
      s.length > 2 || s[0] !== '' || s[1] !== ''
        ? ((this._$AH = Array(s.length - 1).fill(new String())), (this.strings = s))
        : (this._$AH = K);
  }
  _$AI(e, i = this, s, o) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) (e = ze(this, e, i, 0)), (n = !Je(e) || (e !== this._$AH && e !== kt)), n && (this._$AH = e);
    else {
      const c = e;
      let d, h;
      for (e = a[0], d = 0; d < a.length - 1; d++)
        (h = ze(this, c[s + d], i, d)),
          h === kt && (h = this._$AH[d]),
          n || (n = !Je(h) || h !== this._$AH[d]),
          h === K ? (e = K) : e !== K && (e += (h ?? '') + a[d + 1]),
          (this._$AH[d] = h);
    }
    n && !o && this.j(e);
  }
  j(e) {
    e === K ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? '');
  }
}
let jr = class extends Ii {
  constructor() {
    super(...arguments), (this.type = 3);
  }
  j(e) {
    this.element[this.name] = e === K ? void 0 : e;
  }
};
class Kr extends Ii {
  constructor() {
    super(...arguments), (this.type = 4);
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== K);
  }
}
class Yr extends Ii {
  constructor(e, i, s, o, a) {
    super(e, i, s, o, a), (this.type = 5);
  }
  _$AI(e, i = this) {
    if ((e = ze(this, e, i, 0) ?? K) === kt) return;
    const s = this._$AH,
      o = (e === K && s !== K) || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive,
      a = e !== K && (s === K || o);
    o && this.element.removeEventListener(this.name, this, s),
      a && this.element.addEventListener(this.name, this, e),
      (this._$AH = e);
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == 'function'
      ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e)
      : this._$AH.handleEvent(e);
  }
}
class Xr {
  constructor(e, i, s) {
    (this.element = e), (this.type = 6), (this._$AN = void 0), (this._$AM = i), (this.options = s);
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ze(this, e);
  }
}
const Ui = qe.litHtmlPolyfillSupport;
Ui == null || Ui(ti, si), (qe.litHtmlVersions ?? (qe.litHtmlVersions = [])).push('3.2.1');
const Gr = (t, e, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? e;
  let o = s._$litPart$;
  if (o === void 0) {
    const a = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = o = new si(e.insertBefore(Ze(), a), a, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ let We = class extends ke {
  constructor() {
    super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0);
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(e),
      (this._$Do = Gr(i, this.renderRoot, this.renderOptions));
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return kt;
  }
};
var uo;
(We._$litElement$ = !0),
  (We.finalized = !0),
  (uo = globalThis.litElementHydrateSupport) == null || uo.call(globalThis, { LitElement: We });
const qi = globalThis.litElementPolyfillSupport;
qi == null || qi({ LitElement: We });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push('4.1.1');
var Qr = T`
  :host(:not(:focus-within)) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    clip: rect(0 0 0 0) !important;
    clip-path: inset(50%) !important;
    border: none !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    padding: 0 !important;
  }
`,
  D = T`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Zr = { attribute: !0, type: String, converter: Se, reflect: !1, hasChanged: ms },
  Jr = (t = Zr, e, i) => {
    const { kind: s, metadata: o } = i;
    let a = globalThis.litPropertyMetadata.get(o);
    if ((a === void 0 && globalThis.litPropertyMetadata.set(o, (a = new Map())), a.set(i.name, t), s === 'accessor')) {
      const { name: n } = i;
      return {
        set(c) {
          const d = e.get.call(this);
          e.set.call(this, c), this.requestUpdate(n, d, t);
        },
        init(c) {
          return c !== void 0 && this.P(n, void 0, t), c;
        },
      };
    }
    if (s === 'setter') {
      const { name: n } = i;
      return function (c) {
        const d = this[n];
        e.call(this, c), this.requestUpdate(n, d, t);
      };
    }
    throw Error('Unsupported decorator location: ' + s);
  };
function l(t) {
  return (e, i) =>
    typeof i == 'object'
      ? Jr(t, e, i)
      : ((s, o, a) => {
          const n = o.hasOwnProperty(a);
          return (
            o.constructor.createProperty(a, n ? { ...s, wrapped: !0 } : s),
            n ? Object.getOwnPropertyDescriptor(o, a) : void 0
          );
        })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function L(t) {
  return l({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function oi(t) {
  return (e, i) => {
    const s = typeof e == 'function' ? e : e[i];
    Object.assign(s, t);
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const _o = (t, e, i) => (
  (i.configurable = !0),
  (i.enumerable = !0),
  Reflect.decorate && typeof e != 'object' && Object.defineProperty(t, e, i),
  i
);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function k(t, e) {
  return (i, s, o) => {
    const a = (n) => {
      var c;
      return ((c = n.renderRoot) == null ? void 0 : c.querySelector(t)) ?? null;
    };
    return _o(i, s, {
      get() {
        return a(this);
      },
    });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function ta(t) {
  return (e, i) =>
    _o(e, i, {
      async get() {
        var s;
        return await this.updateComplete, ((s = this.renderRoot) == null ? void 0 : s.querySelector(t)) ?? null;
      },
    });
}
var _i,
  E = class extends We {
    constructor() {
      super(),
        Sr(this, _i, !1),
        (this.initialReflectedProperties = new Map()),
        Object.entries(this.constructor.dependencies).forEach(([t, e]) => {
          this.constructor.define(t, e);
        });
    }
    emit(t, e) {
      const i = new CustomEvent(t, Qt({ bubbles: !0, cancelable: !1, composed: !0, detail: {} }, e));
      return this.dispatchEvent(i), i;
    }
    static define(t, e = this, i = {}) {
      const s = customElements.get(t);
      if (!s) {
        try {
          customElements.define(t, e, i);
        } catch {
          customElements.define(t, class extends e {}, i);
        }
        return;
      }
      let o = ' (unknown version)',
        a = o;
      'version' in e && e.version && (o = ' v' + e.version),
        'version' in s && s.version && (a = ' v' + s.version),
        !(o && a && o === a) &&
          console.warn(`Attempted to register <${t}>${o}, but <${t}>${a} has already been registered.`);
    }
    attributeChangedCallback(t, e, i) {
      $r(this, _i) ||
        (this.constructor.elementProperties.forEach((s, o) => {
          s.reflect && this[o] != null && this.initialReflectedProperties.set(o, this[o]);
        }),
        zr(this, _i, !0)),
        super.attributeChangedCallback(t, e, i);
    }
    willUpdate(t) {
      super.willUpdate(t),
        this.initialReflectedProperties.forEach((e, i) => {
          t.has(i) && this[i] == null && (this[i] = e);
        });
    }
  };
_i = new WeakMap();
E.version = '2.20.0';
E.dependencies = {};
r([l()], E.prototype, 'dir', 2);
r([l()], E.prototype, 'lang', 2);
var bs = class extends E {
  render() {
    return y` <slot></slot> `;
  }
};
bs.styles = [D, Qr];
bs.define('sl-visually-hidden');
var ea = T`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`,
  ia = T`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;
const Ji = new Set(),
  Ce = new Map();
let he,
  vs = 'ltr',
  ys = 'en';
const xo = typeof MutationObserver < 'u' && typeof document < 'u' && typeof document.documentElement < 'u';
if (xo) {
  const t = new MutationObserver(Co);
  (vs = document.documentElement.dir || 'ltr'),
    (ys = document.documentElement.lang || navigator.language),
    t.observe(document.documentElement, { attributes: !0, attributeFilter: ['dir', 'lang'] });
}
function ko(...t) {
  t.map((e) => {
    const i = e.$code.toLowerCase();
    Ce.has(i) ? Ce.set(i, Object.assign(Object.assign({}, Ce.get(i)), e)) : Ce.set(i, e), he || (he = e);
  }),
    Co();
}
function Co() {
  xo && ((vs = document.documentElement.dir || 'ltr'), (ys = document.documentElement.lang || navigator.language)),
    [...Ji.keys()].map((t) => {
      typeof t.requestUpdate == 'function' && t.requestUpdate();
    });
}
let sa = class {
  constructor(e) {
    (this.host = e), this.host.addController(this);
  }
  hostConnected() {
    Ji.add(this.host);
  }
  hostDisconnected() {
    Ji.delete(this.host);
  }
  dir() {
    return `${this.host.dir || vs}`.toLowerCase();
  }
  lang() {
    return `${this.host.lang || ys}`.toLowerCase();
  }
  getTranslationData(e) {
    var i, s;
    const o = new Intl.Locale(e.replace(/_/g, '-')),
      a = o == null ? void 0 : o.language.toLowerCase(),
      n =
        (s = (i = o == null ? void 0 : o.region) === null || i === void 0 ? void 0 : i.toLowerCase()) !== null &&
        s !== void 0
          ? s
          : '',
      c = Ce.get(`${a}-${n}`),
      d = Ce.get(a);
    return { locale: o, language: a, region: n, primary: c, secondary: d };
  }
  exists(e, i) {
    var s;
    const { primary: o, secondary: a } = this.getTranslationData(
      (s = i.lang) !== null && s !== void 0 ? s : this.lang()
    );
    return (
      (i = Object.assign({ includeFallback: !1 }, i)),
      !!((o && o[e]) || (a && a[e]) || (i.includeFallback && he && he[e]))
    );
  }
  term(e, ...i) {
    const { primary: s, secondary: o } = this.getTranslationData(this.lang());
    let a;
    if (s && s[e]) a = s[e];
    else if (o && o[e]) a = o[e];
    else if (he && he[e]) a = he[e];
    else return console.error(`No translation found for: ${String(e)}`), String(e);
    return typeof a == 'function' ? a(...i) : a;
  }
  date(e, i) {
    return (e = new Date(e)), new Intl.DateTimeFormat(this.lang(), i).format(e);
  }
  number(e, i) {
    return (e = Number(e)), isNaN(e) ? '' : new Intl.NumberFormat(this.lang(), i).format(e);
  }
  relativeTime(e, i, s) {
    return new Intl.RelativeTimeFormat(this.lang(), s).format(e, i);
  }
};
var $o = {
  $code: 'en',
  $name: 'English',
  $dir: 'ltr',
  carousel: 'Carousel',
  clearEntry: 'Clear entry',
  close: 'Close',
  copied: 'Copied',
  copy: 'Copy',
  currentValue: 'Current value',
  error: 'Error',
  goToSlide: (t, e) => `Go to slide ${t} of ${e}`,
  hidePassword: 'Hide password',
  loading: 'Loading',
  nextSlide: 'Next slide',
  numOptionsSelected: (t) =>
    t === 0 ? 'No options selected' : t === 1 ? '1 option selected' : `${t} options selected`,
  previousSlide: 'Previous slide',
  progress: 'Progress',
  remove: 'Remove',
  resize: 'Resize',
  scrollToEnd: 'Scroll to end',
  scrollToStart: 'Scroll to start',
  selectAColorFromTheScreen: 'Select a color from the screen',
  showPassword: 'Show password',
  slideNum: (t) => `Slide ${t}`,
  toggleColorFormat: 'Toggle color format',
};
ko($o);
var oa = $o,
  N = class extends sa {};
ko(oa);
const oe = Math.min,
  xt = Math.max,
  $i = Math.round,
  fi = Math.floor,
  qt = (t) => ({ x: t, y: t }),
  ra = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
  aa = { start: 'end', end: 'start' };
function ts(t, e, i) {
  return xt(t, oe(e, i));
}
function Ae(t, e) {
  return typeof t == 'function' ? t(e) : t;
}
function re(t) {
  return t.split('-')[0];
}
function Te(t) {
  return t.split('-')[1];
}
function So(t) {
  return t === 'x' ? 'y' : 'x';
}
function ws(t) {
  return t === 'y' ? 'height' : 'width';
}
function me(t) {
  return ['top', 'bottom'].includes(re(t)) ? 'y' : 'x';
}
function _s(t) {
  return So(me(t));
}
function na(t, e, i) {
  i === void 0 && (i = !1);
  const s = Te(t),
    o = _s(t),
    a = ws(o);
  let n = o === 'x' ? (s === (i ? 'end' : 'start') ? 'right' : 'left') : s === 'start' ? 'bottom' : 'top';
  return e.reference[a] > e.floating[a] && (n = Si(n)), [n, Si(n)];
}
function la(t) {
  const e = Si(t);
  return [es(t), e, es(e)];
}
function es(t) {
  return t.replace(/start|end/g, (e) => aa[e]);
}
function ca(t, e, i) {
  const s = ['left', 'right'],
    o = ['right', 'left'],
    a = ['top', 'bottom'],
    n = ['bottom', 'top'];
  switch (t) {
    case 'top':
    case 'bottom':
      return i ? (e ? o : s) : e ? s : o;
    case 'left':
    case 'right':
      return e ? a : n;
    default:
      return [];
  }
}
function da(t, e, i, s) {
  const o = Te(t);
  let a = ca(re(t), i === 'start', s);
  return o && ((a = a.map((n) => n + '-' + o)), e && (a = a.concat(a.map(es)))), a;
}
function Si(t) {
  return t.replace(/left|right|bottom|top/g, (e) => ra[e]);
}
function ha(t) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...t };
}
function zo(t) {
  return typeof t != 'number' ? ha(t) : { top: t, right: t, bottom: t, left: t };
}
function zi(t) {
  const { x: e, y: i, width: s, height: o } = t;
  return { width: s, height: o, top: i, left: e, right: e + s, bottom: i + o, x: e, y: i };
}
function Hs(t, e, i) {
  let { reference: s, floating: o } = t;
  const a = me(e),
    n = _s(e),
    c = ws(n),
    d = re(e),
    h = a === 'y',
    f = s.x + s.width / 2 - o.width / 2,
    u = s.y + s.height / 2 - o.height / 2,
    p = s[c] / 2 - o[c] / 2;
  let m;
  switch (d) {
    case 'top':
      m = { x: f, y: s.y - o.height };
      break;
    case 'bottom':
      m = { x: f, y: s.y + s.height };
      break;
    case 'right':
      m = { x: s.x + s.width, y: u };
      break;
    case 'left':
      m = { x: s.x - o.width, y: u };
      break;
    default:
      m = { x: s.x, y: s.y };
  }
  switch (Te(e)) {
    case 'start':
      m[n] -= p * (i && h ? -1 : 1);
      break;
    case 'end':
      m[n] += p * (i && h ? -1 : 1);
      break;
  }
  return m;
}
const ua = async (t, e, i) => {
  const { placement: s = 'bottom', strategy: o = 'absolute', middleware: a = [], platform: n } = i,
    c = a.filter(Boolean),
    d = await (n.isRTL == null ? void 0 : n.isRTL(e));
  let h = await n.getElementRects({ reference: t, floating: e, strategy: o }),
    { x: f, y: u } = Hs(h, s, d),
    p = s,
    m = {},
    g = 0;
  for (let b = 0; b < c.length; b++) {
    const { name: C, fn: S } = c[b],
      {
        x: _,
        y: $,
        data: v,
        reset: w,
      } = await S({
        x: f,
        y: u,
        initialPlacement: s,
        placement: p,
        strategy: o,
        middlewareData: m,
        rects: h,
        platform: n,
        elements: { reference: t, floating: e },
      });
    (f = _ ?? f),
      (u = $ ?? u),
      (m = { ...m, [C]: { ...m[C], ...v } }),
      w &&
        g <= 50 &&
        (g++,
        typeof w == 'object' &&
          (w.placement && (p = w.placement),
          w.rects &&
            (h = w.rects === !0 ? await n.getElementRects({ reference: t, floating: e, strategy: o }) : w.rects),
          ({ x: f, y: u } = Hs(h, p, d))),
        (b = -1));
  }
  return { x: f, y: u, placement: p, strategy: o, middlewareData: m };
};
async function xs(t, e) {
  var i;
  e === void 0 && (e = {});
  const { x: s, y: o, platform: a, rects: n, elements: c, strategy: d } = t,
    {
      boundary: h = 'clippingAncestors',
      rootBoundary: f = 'viewport',
      elementContext: u = 'floating',
      altBoundary: p = !1,
      padding: m = 0,
    } = Ae(e, t),
    g = zo(m),
    C = c[p ? (u === 'floating' ? 'reference' : 'floating') : u],
    S = zi(
      await a.getClippingRect({
        element:
          (i = await (a.isElement == null ? void 0 : a.isElement(C))) == null || i
            ? C
            : C.contextElement || (await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(c.floating))),
        boundary: h,
        rootBoundary: f,
        strategy: d,
      })
    ),
    _ = u === 'floating' ? { x: s, y: o, width: n.floating.width, height: n.floating.height } : n.reference,
    $ = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c.floating)),
    v = (await (a.isElement == null ? void 0 : a.isElement($)))
      ? (await (a.getScale == null ? void 0 : a.getScale($))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    w = zi(
      a.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: c,
            rect: _,
            offsetParent: $,
            strategy: d,
          })
        : _
    );
  return {
    top: (S.top - w.top + g.top) / v.y,
    bottom: (w.bottom - S.bottom + g.bottom) / v.y,
    left: (S.left - w.left + g.left) / v.x,
    right: (w.right - S.right + g.right) / v.x,
  };
}
const pa = (t) => ({
    name: 'arrow',
    options: t,
    async fn(e) {
      const { x: i, y: s, placement: o, rects: a, platform: n, elements: c, middlewareData: d } = e,
        { element: h, padding: f = 0 } = Ae(t, e) || {};
      if (h == null) return {};
      const u = zo(f),
        p = { x: i, y: s },
        m = _s(o),
        g = ws(m),
        b = await n.getDimensions(h),
        C = m === 'y',
        S = C ? 'top' : 'left',
        _ = C ? 'bottom' : 'right',
        $ = C ? 'clientHeight' : 'clientWidth',
        v = a.reference[g] + a.reference[m] - p[m] - a.floating[g],
        w = p[m] - a.reference[m],
        P = await (n.getOffsetParent == null ? void 0 : n.getOffsetParent(h));
      let M = P ? P[$] : 0;
      (!M || !(await (n.isElement == null ? void 0 : n.isElement(P)))) && (M = c.floating[$] || a.floating[g]);
      const F = v / 2 - w / 2,
        O = M / 2 - b[g] / 2 - 1,
        A = oe(u[S], O),
        ot = oe(u[_], O),
        tt = A,
        ft = M - b[g] - ot,
        et = M / 2 - b[g] / 2 + F,
        It = ts(tt, et, ft),
        Nt = !d.arrow && Te(o) != null && et !== It && a.reference[g] / 2 - (et < tt ? A : ot) - b[g] / 2 < 0,
        Ht = Nt ? (et < tt ? et - tt : et - ft) : 0;
      return {
        [m]: p[m] + Ht,
        data: { [m]: It, centerOffset: et - It - Ht, ...(Nt && { alignmentOffset: Ht }) },
        reset: Nt,
      };
    },
  }),
  fa = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'flip',
        options: t,
        async fn(e) {
          var i, s;
          const { placement: o, middlewareData: a, rects: n, initialPlacement: c, platform: d, elements: h } = e,
            {
              mainAxis: f = !0,
              crossAxis: u = !0,
              fallbackPlacements: p,
              fallbackStrategy: m = 'bestFit',
              fallbackAxisSideDirection: g = 'none',
              flipAlignment: b = !0,
              ...C
            } = Ae(t, e);
          if ((i = a.arrow) != null && i.alignmentOffset) return {};
          const S = re(o),
            _ = me(c),
            $ = re(c) === c,
            v = await (d.isRTL == null ? void 0 : d.isRTL(h.floating)),
            w = p || ($ || !b ? [Si(c)] : la(c)),
            P = g !== 'none';
          !p && P && w.push(...da(c, b, g, v));
          const M = [c, ...w],
            F = await xs(e, C),
            O = [];
          let A = ((s = a.flip) == null ? void 0 : s.overflows) || [];
          if ((f && O.push(F[S]), u)) {
            const et = na(o, n, v);
            O.push(F[et[0]], F[et[1]]);
          }
          if (((A = [...A, { placement: o, overflows: O }]), !O.every((et) => et <= 0))) {
            var ot, tt;
            const et = (((ot = a.flip) == null ? void 0 : ot.index) || 0) + 1,
              It = M[et];
            if (It) return { data: { index: et, overflows: A }, reset: { placement: It } };
            let Nt =
              (tt = A.filter((Ht) => Ht.overflows[0] <= 0).sort((Ht, Jt) => Ht.overflows[1] - Jt.overflows[1])[0]) ==
              null
                ? void 0
                : tt.placement;
            if (!Nt)
              switch (m) {
                case 'bestFit': {
                  var ft;
                  const Ht =
                    (ft = A.filter((Jt) => {
                      if (P) {
                        const te = me(Jt.placement);
                        return te === _ || te === 'y';
                      }
                      return !0;
                    })
                      .map((Jt) => [Jt.placement, Jt.overflows.filter((te) => te > 0).reduce((te, Zo) => te + Zo, 0)])
                      .sort((Jt, te) => Jt[1] - te[1])[0]) == null
                      ? void 0
                      : ft[0];
                  Ht && (Nt = Ht);
                  break;
                }
                case 'initialPlacement':
                  Nt = c;
                  break;
              }
            if (o !== Nt) return { reset: { placement: Nt } };
          }
          return {};
        },
      }
    );
  };
async function ma(t, e) {
  const { placement: i, platform: s, elements: o } = t,
    a = await (s.isRTL == null ? void 0 : s.isRTL(o.floating)),
    n = re(i),
    c = Te(i),
    d = me(i) === 'y',
    h = ['left', 'top'].includes(n) ? -1 : 1,
    f = a && d ? -1 : 1,
    u = Ae(e, t);
  let {
    mainAxis: p,
    crossAxis: m,
    alignmentAxis: g,
  } = typeof u == 'number'
    ? { mainAxis: u, crossAxis: 0, alignmentAxis: null }
    : { mainAxis: u.mainAxis || 0, crossAxis: u.crossAxis || 0, alignmentAxis: u.alignmentAxis };
  return (
    c && typeof g == 'number' && (m = c === 'end' ? g * -1 : g), d ? { x: m * f, y: p * h } : { x: p * h, y: m * f }
  );
}
const ga = function (t) {
    return (
      t === void 0 && (t = 0),
      {
        name: 'offset',
        options: t,
        async fn(e) {
          var i, s;
          const { x: o, y: a, placement: n, middlewareData: c } = e,
            d = await ma(e, t);
          return n === ((i = c.offset) == null ? void 0 : i.placement) && (s = c.arrow) != null && s.alignmentOffset
            ? {}
            : { x: o + d.x, y: a + d.y, data: { ...d, placement: n } };
        },
      }
    );
  },
  ba = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'shift',
        options: t,
        async fn(e) {
          const { x: i, y: s, placement: o } = e,
            {
              mainAxis: a = !0,
              crossAxis: n = !1,
              limiter: c = {
                fn: (C) => {
                  let { x: S, y: _ } = C;
                  return { x: S, y: _ };
                },
              },
              ...d
            } = Ae(t, e),
            h = { x: i, y: s },
            f = await xs(e, d),
            u = me(re(o)),
            p = So(u);
          let m = h[p],
            g = h[u];
          if (a) {
            const C = p === 'y' ? 'top' : 'left',
              S = p === 'y' ? 'bottom' : 'right',
              _ = m + f[C],
              $ = m - f[S];
            m = ts(_, m, $);
          }
          if (n) {
            const C = u === 'y' ? 'top' : 'left',
              S = u === 'y' ? 'bottom' : 'right',
              _ = g + f[C],
              $ = g - f[S];
            g = ts(_, g, $);
          }
          const b = c.fn({ ...e, [p]: m, [u]: g });
          return { ...b, data: { x: b.x - i, y: b.y - s, enabled: { [p]: a, [u]: n } } };
        },
      }
    );
  },
  va = function (t) {
    return (
      t === void 0 && (t = {}),
      {
        name: 'size',
        options: t,
        async fn(e) {
          var i, s;
          const { placement: o, rects: a, platform: n, elements: c } = e,
            { apply: d = () => {}, ...h } = Ae(t, e),
            f = await xs(e, h),
            u = re(o),
            p = Te(o),
            m = me(o) === 'y',
            { width: g, height: b } = a.floating;
          let C, S;
          u === 'top' || u === 'bottom'
            ? ((C = u),
              (S =
                p === ((await (n.isRTL == null ? void 0 : n.isRTL(c.floating))) ? 'start' : 'end') ? 'left' : 'right'))
            : ((S = u), (C = p === 'end' ? 'top' : 'bottom'));
          const _ = b - f.top - f.bottom,
            $ = g - f.left - f.right,
            v = oe(b - f[C], _),
            w = oe(g - f[S], $),
            P = !e.middlewareData.shift;
          let M = v,
            F = w;
          if (
            ((i = e.middlewareData.shift) != null && i.enabled.x && (F = $),
            (s = e.middlewareData.shift) != null && s.enabled.y && (M = _),
            P && !p)
          ) {
            const A = xt(f.left, 0),
              ot = xt(f.right, 0),
              tt = xt(f.top, 0),
              ft = xt(f.bottom, 0);
            m
              ? (F = g - 2 * (A !== 0 || ot !== 0 ? A + ot : xt(f.left, f.right)))
              : (M = b - 2 * (tt !== 0 || ft !== 0 ? tt + ft : xt(f.top, f.bottom)));
          }
          await d({ ...e, availableWidth: F, availableHeight: M });
          const O = await n.getDimensions(c.floating);
          return g !== O.width || b !== O.height ? { reset: { rects: !0 } } : {};
        },
      }
    );
  };
function Di() {
  return typeof window < 'u';
}
function Le(t) {
  return Eo(t) ? (t.nodeName || '').toLowerCase() : '#document';
}
function Ct(t) {
  var e;
  return (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function jt(t) {
  var e;
  return (e = (Eo(t) ? t.ownerDocument : t.document) || window.document) == null ? void 0 : e.documentElement;
}
function Eo(t) {
  return Di() ? t instanceof Node || t instanceof Ct(t).Node : !1;
}
function Dt(t) {
  return Di() ? t instanceof Element || t instanceof Ct(t).Element : !1;
}
function Wt(t) {
  return Di() ? t instanceof HTMLElement || t instanceof Ct(t).HTMLElement : !1;
}
function Us(t) {
  return !Di() || typeof ShadowRoot > 'u' ? !1 : t instanceof ShadowRoot || t instanceof Ct(t).ShadowRoot;
}
function ri(t) {
  const { overflow: e, overflowX: i, overflowY: s, display: o } = Pt(t);
  return /auto|scroll|overlay|hidden|clip/.test(e + s + i) && !['inline', 'contents'].includes(o);
}
function ya(t) {
  return ['table', 'td', 'th'].includes(Le(t));
}
function Pi(t) {
  return [':popover-open', ':modal'].some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function Oi(t) {
  const e = ks(),
    i = Dt(t) ? Pt(t) : t;
  return (
    ['transform', 'translate', 'scale', 'rotate', 'perspective'].some((s) => (i[s] ? i[s] !== 'none' : !1)) ||
    (i.containerType ? i.containerType !== 'normal' : !1) ||
    (!e && (i.backdropFilter ? i.backdropFilter !== 'none' : !1)) ||
    (!e && (i.filter ? i.filter !== 'none' : !1)) ||
    ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'].some((s) =>
      (i.willChange || '').includes(s)
    ) ||
    ['paint', 'layout', 'strict', 'content'].some((s) => (i.contain || '').includes(s))
  );
}
function wa(t) {
  let e = ae(t);
  for (; Wt(e) && !Ee(e); ) {
    if (Oi(e)) return e;
    if (Pi(e)) return null;
    e = ae(e);
  }
  return null;
}
function ks() {
  return typeof CSS > 'u' || !CSS.supports ? !1 : CSS.supports('-webkit-backdrop-filter', 'none');
}
function Ee(t) {
  return ['html', 'body', '#document'].includes(Le(t));
}
function Pt(t) {
  return Ct(t).getComputedStyle(t);
}
function Mi(t) {
  return Dt(t) ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop } : { scrollLeft: t.scrollX, scrollTop: t.scrollY };
}
function ae(t) {
  if (Le(t) === 'html') return t;
  const e = t.assignedSlot || t.parentNode || (Us(t) && t.host) || jt(t);
  return Us(e) ? e.host : e;
}
function Ao(t) {
  const e = ae(t);
  return Ee(e) ? (t.ownerDocument ? t.ownerDocument.body : t.body) : Wt(e) && ri(e) ? e : Ao(e);
}
function ei(t, e, i) {
  var s;
  e === void 0 && (e = []), i === void 0 && (i = !0);
  const o = Ao(t),
    a = o === ((s = t.ownerDocument) == null ? void 0 : s.body),
    n = Ct(o);
  if (a) {
    const c = is(n);
    return e.concat(n, n.visualViewport || [], ri(o) ? o : [], c && i ? ei(c) : []);
  }
  return e.concat(o, ei(o, [], i));
}
function is(t) {
  return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null;
}
function To(t) {
  const e = Pt(t);
  let i = parseFloat(e.width) || 0,
    s = parseFloat(e.height) || 0;
  const o = Wt(t),
    a = o ? t.offsetWidth : i,
    n = o ? t.offsetHeight : s,
    c = $i(i) !== a || $i(s) !== n;
  return c && ((i = a), (s = n)), { width: i, height: s, $: c };
}
function Cs(t) {
  return Dt(t) ? t : t.contextElement;
}
function $e(t) {
  const e = Cs(t);
  if (!Wt(e)) return qt(1);
  const i = e.getBoundingClientRect(),
    { width: s, height: o, $: a } = To(e);
  let n = (a ? $i(i.width) : i.width) / s,
    c = (a ? $i(i.height) : i.height) / o;
  return (!n || !Number.isFinite(n)) && (n = 1), (!c || !Number.isFinite(c)) && (c = 1), { x: n, y: c };
}
const _a = qt(0);
function Lo(t) {
  const e = Ct(t);
  return !ks() || !e.visualViewport ? _a : { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop };
}
function xa(t, e, i) {
  return e === void 0 && (e = !1), !i || (e && i !== Ct(t)) ? !1 : e;
}
function ge(t, e, i, s) {
  e === void 0 && (e = !1), i === void 0 && (i = !1);
  const o = t.getBoundingClientRect(),
    a = Cs(t);
  let n = qt(1);
  e && (s ? Dt(s) && (n = $e(s)) : (n = $e(t)));
  const c = xa(a, i, s) ? Lo(a) : qt(0);
  let d = (o.left + c.x) / n.x,
    h = (o.top + c.y) / n.y,
    f = o.width / n.x,
    u = o.height / n.y;
  if (a) {
    const p = Ct(a),
      m = s && Dt(s) ? Ct(s) : s;
    let g = p,
      b = is(g);
    for (; b && s && m !== g; ) {
      const C = $e(b),
        S = b.getBoundingClientRect(),
        _ = Pt(b),
        $ = S.left + (b.clientLeft + parseFloat(_.paddingLeft)) * C.x,
        v = S.top + (b.clientTop + parseFloat(_.paddingTop)) * C.y;
      (d *= C.x), (h *= C.y), (f *= C.x), (u *= C.y), (d += $), (h += v), (g = Ct(b)), (b = is(g));
    }
  }
  return zi({ width: f, height: u, x: d, y: h });
}
function $s(t, e) {
  const i = Mi(t).scrollLeft;
  return e ? e.left + i : ge(jt(t)).left + i;
}
function Io(t, e, i) {
  i === void 0 && (i = !1);
  const s = t.getBoundingClientRect(),
    o = s.left + e.scrollLeft - (i ? 0 : $s(t, s)),
    a = s.top + e.scrollTop;
  return { x: o, y: a };
}
function ka(t) {
  let { elements: e, rect: i, offsetParent: s, strategy: o } = t;
  const a = o === 'fixed',
    n = jt(s),
    c = e ? Pi(e.floating) : !1;
  if (s === n || (c && a)) return i;
  let d = { scrollLeft: 0, scrollTop: 0 },
    h = qt(1);
  const f = qt(0),
    u = Wt(s);
  if ((u || (!u && !a)) && ((Le(s) !== 'body' || ri(n)) && (d = Mi(s)), Wt(s))) {
    const m = ge(s);
    (h = $e(s)), (f.x = m.x + s.clientLeft), (f.y = m.y + s.clientTop);
  }
  const p = n && !u && !a ? Io(n, d, !0) : qt(0);
  return {
    width: i.width * h.x,
    height: i.height * h.y,
    x: i.x * h.x - d.scrollLeft * h.x + f.x + p.x,
    y: i.y * h.y - d.scrollTop * h.y + f.y + p.y,
  };
}
function Ca(t) {
  return Array.from(t.getClientRects());
}
function $a(t) {
  const e = jt(t),
    i = Mi(t),
    s = t.ownerDocument.body,
    o = xt(e.scrollWidth, e.clientWidth, s.scrollWidth, s.clientWidth),
    a = xt(e.scrollHeight, e.clientHeight, s.scrollHeight, s.clientHeight);
  let n = -i.scrollLeft + $s(t);
  const c = -i.scrollTop;
  return Pt(s).direction === 'rtl' && (n += xt(e.clientWidth, s.clientWidth) - o), { width: o, height: a, x: n, y: c };
}
function Sa(t, e) {
  const i = Ct(t),
    s = jt(t),
    o = i.visualViewport;
  let a = s.clientWidth,
    n = s.clientHeight,
    c = 0,
    d = 0;
  if (o) {
    (a = o.width), (n = o.height);
    const h = ks();
    (!h || (h && e === 'fixed')) && ((c = o.offsetLeft), (d = o.offsetTop));
  }
  return { width: a, height: n, x: c, y: d };
}
function za(t, e) {
  const i = ge(t, !0, e === 'fixed'),
    s = i.top + t.clientTop,
    o = i.left + t.clientLeft,
    a = Wt(t) ? $e(t) : qt(1),
    n = t.clientWidth * a.x,
    c = t.clientHeight * a.y,
    d = o * a.x,
    h = s * a.y;
  return { width: n, height: c, x: d, y: h };
}
function qs(t, e, i) {
  let s;
  if (e === 'viewport') s = Sa(t, i);
  else if (e === 'document') s = $a(jt(t));
  else if (Dt(e)) s = za(e, i);
  else {
    const o = Lo(t);
    s = { x: e.x - o.x, y: e.y - o.y, width: e.width, height: e.height };
  }
  return zi(s);
}
function Do(t, e) {
  const i = ae(t);
  return i === e || !Dt(i) || Ee(i) ? !1 : Pt(i).position === 'fixed' || Do(i, e);
}
function Ea(t, e) {
  const i = e.get(t);
  if (i) return i;
  let s = ei(t, [], !1).filter((c) => Dt(c) && Le(c) !== 'body'),
    o = null;
  const a = Pt(t).position === 'fixed';
  let n = a ? ae(t) : t;
  for (; Dt(n) && !Ee(n); ) {
    const c = Pt(n),
      d = Oi(n);
    !d && c.position === 'fixed' && (o = null),
      (
        a
          ? !d && !o
          : (!d && c.position === 'static' && !!o && ['absolute', 'fixed'].includes(o.position)) ||
            (ri(n) && !d && Do(t, n))
      )
        ? (s = s.filter((f) => f !== n))
        : (o = c),
      (n = ae(n));
  }
  return e.set(t, s), s;
}
function Aa(t) {
  let { element: e, boundary: i, rootBoundary: s, strategy: o } = t;
  const n = [...(i === 'clippingAncestors' ? (Pi(e) ? [] : Ea(e, this._c)) : [].concat(i)), s],
    c = n[0],
    d = n.reduce(
      (h, f) => {
        const u = qs(e, f, o);
        return (
          (h.top = xt(u.top, h.top)),
          (h.right = oe(u.right, h.right)),
          (h.bottom = oe(u.bottom, h.bottom)),
          (h.left = xt(u.left, h.left)),
          h
        );
      },
      qs(e, c, o)
    );
  return { width: d.right - d.left, height: d.bottom - d.top, x: d.left, y: d.top };
}
function Ta(t) {
  const { width: e, height: i } = To(t);
  return { width: e, height: i };
}
function La(t, e, i) {
  const s = Wt(e),
    o = jt(e),
    a = i === 'fixed',
    n = ge(t, !0, a, e);
  let c = { scrollLeft: 0, scrollTop: 0 };
  const d = qt(0);
  if (s || (!s && !a))
    if (((Le(e) !== 'body' || ri(o)) && (c = Mi(e)), s)) {
      const p = ge(e, !0, a, e);
      (d.x = p.x + e.clientLeft), (d.y = p.y + e.clientTop);
    } else o && (d.x = $s(o));
  const h = o && !s && !a ? Io(o, c) : qt(0),
    f = n.left + c.scrollLeft - d.x - h.x,
    u = n.top + c.scrollTop - d.y - h.y;
  return { x: f, y: u, width: n.width, height: n.height };
}
function Wi(t) {
  return Pt(t).position === 'static';
}
function Ws(t, e) {
  if (!Wt(t) || Pt(t).position === 'fixed') return null;
  if (e) return e(t);
  let i = t.offsetParent;
  return jt(t) === i && (i = i.ownerDocument.body), i;
}
function Po(t, e) {
  const i = Ct(t);
  if (Pi(t)) return i;
  if (!Wt(t)) {
    let o = ae(t);
    for (; o && !Ee(o); ) {
      if (Dt(o) && !Wi(o)) return o;
      o = ae(o);
    }
    return i;
  }
  let s = Ws(t, e);
  for (; s && ya(s) && Wi(s); ) s = Ws(s, e);
  return s && Ee(s) && Wi(s) && !Oi(s) ? i : s || wa(t) || i;
}
const Ia = async function (t) {
  const e = this.getOffsetParent || Po,
    i = this.getDimensions,
    s = await i(t.floating);
  return {
    reference: La(t.reference, await e(t.floating), t.strategy),
    floating: { x: 0, y: 0, width: s.width, height: s.height },
  };
};
function Da(t) {
  return Pt(t).direction === 'rtl';
}
const xi = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ka,
  getDocumentElement: jt,
  getClippingRect: Aa,
  getOffsetParent: Po,
  getElementRects: Ia,
  getClientRects: Ca,
  getDimensions: Ta,
  getScale: $e,
  isElement: Dt,
  isRTL: Da,
};
function Oo(t, e) {
  return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}
function Pa(t, e) {
  let i = null,
    s;
  const o = jt(t);
  function a() {
    var c;
    clearTimeout(s), (c = i) == null || c.disconnect(), (i = null);
  }
  function n(c, d) {
    c === void 0 && (c = !1), d === void 0 && (d = 1), a();
    const h = t.getBoundingClientRect(),
      { left: f, top: u, width: p, height: m } = h;
    if ((c || e(), !p || !m)) return;
    const g = fi(u),
      b = fi(o.clientWidth - (f + p)),
      C = fi(o.clientHeight - (u + m)),
      S = fi(f),
      $ = { rootMargin: -g + 'px ' + -b + 'px ' + -C + 'px ' + -S + 'px', threshold: xt(0, oe(1, d)) || 1 };
    let v = !0;
    function w(P) {
      const M = P[0].intersectionRatio;
      if (M !== d) {
        if (!v) return n();
        M
          ? n(!1, M)
          : (s = setTimeout(() => {
              n(!1, 1e-7);
            }, 1e3));
      }
      M === 1 && !Oo(h, t.getBoundingClientRect()) && n(), (v = !1);
    }
    try {
      i = new IntersectionObserver(w, { ...$, root: o.ownerDocument });
    } catch {
      i = new IntersectionObserver(w, $);
    }
    i.observe(t);
  }
  return n(!0), a;
}
function Oa(t, e, i, s) {
  s === void 0 && (s = {});
  const {
      ancestorScroll: o = !0,
      ancestorResize: a = !0,
      elementResize: n = typeof ResizeObserver == 'function',
      layoutShift: c = typeof IntersectionObserver == 'function',
      animationFrame: d = !1,
    } = s,
    h = Cs(t),
    f = o || a ? [...(h ? ei(h) : []), ...ei(e)] : [];
  f.forEach((S) => {
    o && S.addEventListener('scroll', i, { passive: !0 }), a && S.addEventListener('resize', i);
  });
  const u = h && c ? Pa(h, i) : null;
  let p = -1,
    m = null;
  n &&
    ((m = new ResizeObserver((S) => {
      let [_] = S;
      _ &&
        _.target === h &&
        m &&
        (m.unobserve(e),
        cancelAnimationFrame(p),
        (p = requestAnimationFrame(() => {
          var $;
          ($ = m) == null || $.observe(e);
        }))),
        i();
    })),
    h && !d && m.observe(h),
    m.observe(e));
  let g,
    b = d ? ge(t) : null;
  d && C();
  function C() {
    const S = ge(t);
    b && !Oo(b, S) && i(), (b = S), (g = requestAnimationFrame(C));
  }
  return (
    i(),
    () => {
      var S;
      f.forEach((_) => {
        o && _.removeEventListener('scroll', i), a && _.removeEventListener('resize', i);
      }),
        u == null || u(),
        (S = m) == null || S.disconnect(),
        (m = null),
        d && cancelAnimationFrame(g);
    }
  );
}
const Ma = ga,
  Ra = ba,
  Fa = fa,
  js = va,
  Ba = pa,
  Va = (t, e, i) => {
    const s = new Map(),
      o = { platform: xi, ...i },
      a = { ...o.platform, _c: s };
    return ua(t, e, { ...o, platform: a });
  };
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ut = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 },
  ai =
    (t) =>
    (...e) => ({ _$litDirective$: t, values: e });
let ni = class {
  constructor(e) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, s) {
    (this._$Ct = e), (this._$AM = i), (this._$Ci = s);
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const I = ai(
  class extends ni {
    constructor(t) {
      var e;
      if (
        (super(t), t.type !== Ut.ATTRIBUTE || t.name !== 'class' || ((e = t.strings) == null ? void 0 : e.length) > 2)
      )
        throw Error(
          '`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.'
        );
    }
    render(t) {
      return (
        ' ' +
        Object.keys(t)
          .filter((e) => t[e])
          .join(' ') +
        ' '
      );
    }
    update(t, [e]) {
      var s, o;
      if (this.st === void 0) {
        (this.st = new Set()),
          t.strings !== void 0 &&
            (this.nt = new Set(
              t.strings
                .join(' ')
                .split(/\s/)
                .filter((a) => a !== '')
            ));
        for (const a in e) e[a] && !((s = this.nt) != null && s.has(a)) && this.st.add(a);
        return this.render(e);
      }
      const i = t.element.classList;
      for (const a of this.st) a in e || (i.remove(a), this.st.delete(a));
      for (const a in e) {
        const n = !!e[a];
        n === this.st.has(a) ||
          ((o = this.nt) != null && o.has(a)) ||
          (n ? (i.add(a), this.st.add(a)) : (i.remove(a), this.st.delete(a)));
      }
      return kt;
    }
  }
);
function Na(t) {
  return Ha(t);
}
function ji(t) {
  return t.assignedSlot ? t.assignedSlot : t.parentNode instanceof ShadowRoot ? t.parentNode.host : t.parentNode;
}
function Ha(t) {
  for (let e = t; e; e = ji(e)) if (e instanceof Element && getComputedStyle(e).display === 'none') return null;
  for (let e = ji(t); e; e = ji(e)) {
    if (!(e instanceof Element)) continue;
    const i = getComputedStyle(e);
    if (i.display !== 'contents' && (i.position !== 'static' || Oi(i) || e.tagName === 'BODY')) return e;
  }
  return null;
}
function Ua(t) {
  return (
    t !== null &&
    typeof t == 'object' &&
    'getBoundingClientRect' in t &&
    ('contextElement' in t ? t instanceof Element : !0)
  );
}
var U = class extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.active = !1),
      (this.placement = 'top'),
      (this.strategy = 'absolute'),
      (this.distance = 0),
      (this.skidding = 0),
      (this.arrow = !1),
      (this.arrowPlacement = 'anchor'),
      (this.arrowPadding = 10),
      (this.flip = !1),
      (this.flipFallbackPlacements = ''),
      (this.flipFallbackStrategy = 'best-fit'),
      (this.flipPadding = 0),
      (this.shift = !1),
      (this.shiftPadding = 0),
      (this.autoSizePadding = 0),
      (this.hoverBridge = !1),
      (this.updateHoverBridge = () => {
        if (this.hoverBridge && this.anchorEl) {
          const t = this.anchorEl.getBoundingClientRect(),
            e = this.popup.getBoundingClientRect(),
            i = this.placement.includes('top') || this.placement.includes('bottom');
          let s = 0,
            o = 0,
            a = 0,
            n = 0,
            c = 0,
            d = 0,
            h = 0,
            f = 0;
          i
            ? t.top < e.top
              ? ((s = t.left),
                (o = t.bottom),
                (a = t.right),
                (n = t.bottom),
                (c = e.left),
                (d = e.top),
                (h = e.right),
                (f = e.top))
              : ((s = e.left),
                (o = e.bottom),
                (a = e.right),
                (n = e.bottom),
                (c = t.left),
                (d = t.top),
                (h = t.right),
                (f = t.top))
            : t.left < e.left
              ? ((s = t.right),
                (o = t.top),
                (a = e.left),
                (n = e.top),
                (c = t.right),
                (d = t.bottom),
                (h = e.left),
                (f = e.bottom))
              : ((s = e.right),
                (o = e.top),
                (a = t.left),
                (n = t.top),
                (c = e.right),
                (d = e.bottom),
                (h = t.left),
                (f = t.bottom)),
            this.style.setProperty('--hover-bridge-top-left-x', `${s}px`),
            this.style.setProperty('--hover-bridge-top-left-y', `${o}px`),
            this.style.setProperty('--hover-bridge-top-right-x', `${a}px`),
            this.style.setProperty('--hover-bridge-top-right-y', `${n}px`),
            this.style.setProperty('--hover-bridge-bottom-left-x', `${c}px`),
            this.style.setProperty('--hover-bridge-bottom-left-y', `${d}px`),
            this.style.setProperty('--hover-bridge-bottom-right-x', `${h}px`),
            this.style.setProperty('--hover-bridge-bottom-right-y', `${f}px`);
        }
      });
  }
  async connectedCallback() {
    super.connectedCallback(), await this.updateComplete, this.start();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.stop();
  }
  async updated(t) {
    super.updated(t),
      t.has('active') && (this.active ? this.start() : this.stop()),
      t.has('anchor') && this.handleAnchorChange(),
      this.active && (await this.updateComplete, this.reposition());
  }
  async handleAnchorChange() {
    if ((await this.stop(), this.anchor && typeof this.anchor == 'string')) {
      const t = this.getRootNode();
      this.anchorEl = t.getElementById(this.anchor);
    } else
      this.anchor instanceof Element || Ua(this.anchor)
        ? (this.anchorEl = this.anchor)
        : (this.anchorEl = this.querySelector('[slot="anchor"]'));
    this.anchorEl instanceof HTMLSlotElement && (this.anchorEl = this.anchorEl.assignedElements({ flatten: !0 })[0]),
      this.anchorEl && this.active && this.start();
  }
  start() {
    !this.anchorEl ||
      !this.active ||
      (this.cleanup = Oa(this.anchorEl, this.popup, () => {
        this.reposition();
      }));
  }
  async stop() {
    return new Promise((t) => {
      this.cleanup
        ? (this.cleanup(),
          (this.cleanup = void 0),
          this.removeAttribute('data-current-placement'),
          this.style.removeProperty('--auto-size-available-width'),
          this.style.removeProperty('--auto-size-available-height'),
          requestAnimationFrame(() => t()))
        : t();
    });
  }
  reposition() {
    if (!this.active || !this.anchorEl) return;
    const t = [Ma({ mainAxis: this.distance, crossAxis: this.skidding })];
    this.sync
      ? t.push(
          js({
            apply: ({ rects: i }) => {
              const s = this.sync === 'width' || this.sync === 'both',
                o = this.sync === 'height' || this.sync === 'both';
              (this.popup.style.width = s ? `${i.reference.width}px` : ''),
                (this.popup.style.height = o ? `${i.reference.height}px` : '');
            },
          })
        )
      : ((this.popup.style.width = ''), (this.popup.style.height = '')),
      this.flip &&
        t.push(
          Fa({
            boundary: this.flipBoundary,
            fallbackPlacements: this.flipFallbackPlacements,
            fallbackStrategy: this.flipFallbackStrategy === 'best-fit' ? 'bestFit' : 'initialPlacement',
            padding: this.flipPadding,
          })
        ),
      this.shift && t.push(Ra({ boundary: this.shiftBoundary, padding: this.shiftPadding })),
      this.autoSize
        ? t.push(
            js({
              boundary: this.autoSizeBoundary,
              padding: this.autoSizePadding,
              apply: ({ availableWidth: i, availableHeight: s }) => {
                this.autoSize === 'vertical' || this.autoSize === 'both'
                  ? this.style.setProperty('--auto-size-available-height', `${s}px`)
                  : this.style.removeProperty('--auto-size-available-height'),
                  this.autoSize === 'horizontal' || this.autoSize === 'both'
                    ? this.style.setProperty('--auto-size-available-width', `${i}px`)
                    : this.style.removeProperty('--auto-size-available-width');
              },
            })
          )
        : (this.style.removeProperty('--auto-size-available-width'),
          this.style.removeProperty('--auto-size-available-height')),
      this.arrow && t.push(Ba({ element: this.arrowEl, padding: this.arrowPadding }));
    const e = this.strategy === 'absolute' ? (i) => xi.getOffsetParent(i, Na) : xi.getOffsetParent;
    Va(this.anchorEl, this.popup, {
      placement: this.placement,
      middleware: t,
      strategy: this.strategy,
      platform: ii(Qt({}, xi), { getOffsetParent: e }),
    }).then(({ x: i, y: s, middlewareData: o, placement: a }) => {
      const n = this.localize.dir() === 'rtl',
        c = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[a.split('-')[0]];
      if (
        (this.setAttribute('data-current-placement', a),
        Object.assign(this.popup.style, { left: `${i}px`, top: `${s}px` }),
        this.arrow)
      ) {
        const d = o.arrow.x,
          h = o.arrow.y;
        let f = '',
          u = '',
          p = '',
          m = '';
        if (this.arrowPlacement === 'start') {
          const g = typeof d == 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
          (f = typeof h == 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : ''),
            (u = n ? g : ''),
            (m = n ? '' : g);
        } else if (this.arrowPlacement === 'end') {
          const g = typeof d == 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
          (u = n ? '' : g),
            (m = n ? g : ''),
            (p = typeof h == 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '');
        } else
          this.arrowPlacement === 'center'
            ? ((m = typeof d == 'number' ? 'calc(50% - var(--arrow-size-diagonal))' : ''),
              (f = typeof h == 'number' ? 'calc(50% - var(--arrow-size-diagonal))' : ''))
            : ((m = typeof d == 'number' ? `${d}px` : ''), (f = typeof h == 'number' ? `${h}px` : ''));
        Object.assign(this.arrowEl.style, {
          top: f,
          right: u,
          bottom: p,
          left: m,
          [c]: 'calc(var(--arrow-size-diagonal) * -1)',
        });
      }
    }),
      requestAnimationFrame(() => this.updateHoverBridge()),
      this.emit('sl-reposition');
  }
  render() {
    return y`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${I({ 'popup-hover-bridge': !0, 'popup-hover-bridge--visible': this.hoverBridge && this.active })}
      ></span>

      <div
        part="popup"
        class=${I({ popup: !0, 'popup--active': this.active, 'popup--fixed': this.strategy === 'fixed', 'popup--has-arrow': this.arrow })}
      >
        <slot></slot>
        ${this.arrow ? y`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ''}
      </div>
    `;
  }
};
U.styles = [D, ia];
r([k('.popup')], U.prototype, 'popup', 2);
r([k('.popup__arrow')], U.prototype, 'arrowEl', 2);
r([l()], U.prototype, 'anchor', 2);
r([l({ type: Boolean, reflect: !0 })], U.prototype, 'active', 2);
r([l({ reflect: !0 })], U.prototype, 'placement', 2);
r([l({ reflect: !0 })], U.prototype, 'strategy', 2);
r([l({ type: Number })], U.prototype, 'distance', 2);
r([l({ type: Number })], U.prototype, 'skidding', 2);
r([l({ type: Boolean })], U.prototype, 'arrow', 2);
r([l({ attribute: 'arrow-placement' })], U.prototype, 'arrowPlacement', 2);
r([l({ attribute: 'arrow-padding', type: Number })], U.prototype, 'arrowPadding', 2);
r([l({ type: Boolean })], U.prototype, 'flip', 2);
r(
  [
    l({
      attribute: 'flip-fallback-placements',
      converter: {
        fromAttribute: (t) =>
          t
            .split(' ')
            .map((e) => e.trim())
            .filter((e) => e !== ''),
        toAttribute: (t) => t.join(' '),
      },
    }),
  ],
  U.prototype,
  'flipFallbackPlacements',
  2
);
r([l({ attribute: 'flip-fallback-strategy' })], U.prototype, 'flipFallbackStrategy', 2);
r([l({ type: Object })], U.prototype, 'flipBoundary', 2);
r([l({ attribute: 'flip-padding', type: Number })], U.prototype, 'flipPadding', 2);
r([l({ type: Boolean })], U.prototype, 'shift', 2);
r([l({ type: Object })], U.prototype, 'shiftBoundary', 2);
r([l({ attribute: 'shift-padding', type: Number })], U.prototype, 'shiftPadding', 2);
r([l({ attribute: 'auto-size' })], U.prototype, 'autoSize', 2);
r([l()], U.prototype, 'sync', 2);
r([l({ type: Object })], U.prototype, 'autoSizeBoundary', 2);
r([l({ attribute: 'auto-size-padding', type: Number })], U.prototype, 'autoSizePadding', 2);
r([l({ attribute: 'hover-bridge', type: Boolean })], U.prototype, 'hoverBridge', 2);
var Mo = new Map(),
  qa = new WeakMap();
function Wa(t) {
  return t ?? { keyframes: [], options: { duration: 0 } };
}
function Ks(t, e) {
  return e.toLowerCase() === 'rtl' ? { keyframes: t.rtlKeyframes || t.keyframes, options: t.options } : t;
}
function q(t, e) {
  Mo.set(t, Wa(e));
}
function Y(t, e, i) {
  const s = qa.get(t);
  if (s != null && s[e]) return Ks(s[e], i.dir);
  const o = Mo.get(e);
  return o ? Ks(o, i.dir) : { keyframes: [], options: { duration: 0 } };
}
function bt(t, e) {
  return new Promise((i) => {
    function s(o) {
      o.target === t && (t.removeEventListener(e, s), i());
    }
    t.addEventListener(e, s);
  });
}
function Q(t, e, i) {
  return new Promise((s) => {
    if ((i == null ? void 0 : i.duration) === 1 / 0) throw new Error('Promise-based animations must be finite.');
    const o = t.animate(e, ii(Qt({}, i), { duration: ss() ? 0 : i.duration }));
    o.addEventListener('cancel', s, { once: !0 }), o.addEventListener('finish', s, { once: !0 });
  });
}
function Ys(t) {
  return (
    (t = t.toString().toLowerCase()),
    t.indexOf('ms') > -1 ? parseFloat(t) : t.indexOf('s') > -1 ? parseFloat(t) * 1e3 : parseFloat(t)
  );
}
function ss() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function st(t) {
  return Promise.all(
    t.getAnimations().map(
      (e) =>
        new Promise((i) => {
          e.cancel(), requestAnimationFrame(i);
        })
    )
  );
}
function Ei(t, e) {
  return t.map((i) => ii(Qt({}, i), { height: i.height === 'auto' ? `${e}px` : i.height }));
}
function x(t, e) {
  const i = Qt({ waitUntilFirstUpdate: !1 }, e);
  return (s, o) => {
    const { update: a } = s,
      n = Array.isArray(t) ? t : [t];
    s.update = function (c) {
      n.forEach((d) => {
        const h = d;
        if (c.has(h)) {
          const f = c.get(h),
            u = this[h];
          f !== u && (!i.waitUntilFirstUpdate || this.hasUpdated) && this[o](f, u);
        }
      }),
        a.call(this, c);
    };
  };
}
var nt = class extends E {
  constructor() {
    super(),
      (this.localize = new N(this)),
      (this.content = ''),
      (this.placement = 'top'),
      (this.disabled = !1),
      (this.distance = 8),
      (this.open = !1),
      (this.skidding = 0),
      (this.trigger = 'hover focus'),
      (this.hoist = !1),
      (this.handleBlur = () => {
        this.hasTrigger('focus') && this.hide();
      }),
      (this.handleClick = () => {
        this.hasTrigger('click') && (this.open ? this.hide() : this.show());
      }),
      (this.handleFocus = () => {
        this.hasTrigger('focus') && this.show();
      }),
      (this.handleDocumentKeyDown = (t) => {
        t.key === 'Escape' && (t.stopPropagation(), this.hide());
      }),
      (this.handleMouseOver = () => {
        if (this.hasTrigger('hover')) {
          const t = Ys(getComputedStyle(this).getPropertyValue('--show-delay'));
          clearTimeout(this.hoverTimeout), (this.hoverTimeout = window.setTimeout(() => this.show(), t));
        }
      }),
      (this.handleMouseOut = () => {
        if (this.hasTrigger('hover')) {
          const t = Ys(getComputedStyle(this).getPropertyValue('--hide-delay'));
          clearTimeout(this.hoverTimeout), (this.hoverTimeout = window.setTimeout(() => this.hide(), t));
        }
      }),
      this.addEventListener('blur', this.handleBlur, !0),
      this.addEventListener('focus', this.handleFocus, !0),
      this.addEventListener('click', this.handleClick),
      this.addEventListener('mouseover', this.handleMouseOver),
      this.addEventListener('mouseout', this.handleMouseOut);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(),
      (t = this.closeWatcher) == null || t.destroy(),
      document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }
  firstUpdated() {
    (this.body.hidden = !this.open), this.open && ((this.popup.active = !0), this.popup.reposition());
  }
  hasTrigger(t) {
    return this.trigger.split(' ').includes(t);
  }
  async handleOpenChange() {
    var t, e;
    if (this.open) {
      if (this.disabled) return;
      this.emit('sl-show'),
        'CloseWatcher' in window
          ? ((t = this.closeWatcher) == null || t.destroy(),
            (this.closeWatcher = new CloseWatcher()),
            (this.closeWatcher.onclose = () => {
              this.hide();
            }))
          : document.addEventListener('keydown', this.handleDocumentKeyDown),
        await st(this.body),
        (this.body.hidden = !1),
        (this.popup.active = !0);
      const { keyframes: i, options: s } = Y(this, 'tooltip.show', { dir: this.localize.dir() });
      await Q(this.popup.popup, i, s), this.popup.reposition(), this.emit('sl-after-show');
    } else {
      this.emit('sl-hide'),
        (e = this.closeWatcher) == null || e.destroy(),
        document.removeEventListener('keydown', this.handleDocumentKeyDown),
        await st(this.body);
      const { keyframes: i, options: s } = Y(this, 'tooltip.hide', { dir: this.localize.dir() });
      await Q(this.popup.popup, i, s), (this.popup.active = !1), (this.body.hidden = !0), this.emit('sl-after-hide');
    }
  }
  async handleOptionsChange() {
    this.hasUpdated && (await this.updateComplete, this.popup.reposition());
  }
  handleDisabledChange() {
    this.disabled && this.open && this.hide();
  }
  async show() {
    if (!this.open) return (this.open = !0), bt(this, 'sl-after-show');
  }
  async hide() {
    if (this.open) return (this.open = !1), bt(this, 'sl-after-hide');
  }
  render() {
    return y`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${I({ tooltip: !0, 'tooltip--open': this.open })}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        arrow
        hover-bridge
      >
        ${''}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${''}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open ? 'polite' : 'off'}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `;
  }
};
nt.styles = [D, ea];
nt.dependencies = { 'sl-popup': U };
r([k('slot:not([name])')], nt.prototype, 'defaultSlot', 2);
r([k('.tooltip__body')], nt.prototype, 'body', 2);
r([k('sl-popup')], nt.prototype, 'popup', 2);
r([l()], nt.prototype, 'content', 2);
r([l()], nt.prototype, 'placement', 2);
r([l({ type: Boolean, reflect: !0 })], nt.prototype, 'disabled', 2);
r([l({ type: Number })], nt.prototype, 'distance', 2);
r([l({ type: Boolean, reflect: !0 })], nt.prototype, 'open', 2);
r([l({ type: Number })], nt.prototype, 'skidding', 2);
r([l()], nt.prototype, 'trigger', 2);
r([l({ type: Boolean })], nt.prototype, 'hoist', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], nt.prototype, 'handleOpenChange', 1);
r([x(['content', 'distance', 'hoist', 'placement', 'skidding'])], nt.prototype, 'handleOptionsChange', 1);
r([x('disabled')], nt.prototype, 'handleDisabledChange', 1);
q('tooltip.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 150, easing: 'ease' },
});
q('tooltip.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 150, easing: 'ease' },
});
nt.define('sl-tooltip');
var ja = T`
  :host {
    /*
     * These are actually used by tree item, but we define them here so they can more easily be set and all tree items
     * stay consistent.
     */
    --indent-guide-color: var(--sl-color-neutral-200);
    --indent-guide-offset: 0;
    --indent-guide-style: solid;
    --indent-guide-width: 0;
    --indent-size: var(--sl-spacing-large);

    display: block;

    /*
     * Tree item indentation uses the "em" unit to increment its width on each level, so setting the font size to zero
     * here removes the indentation for all the nodes on the first level.
     */
    font-size: 0;
  }
`,
  Ka = T`
  :host {
    display: block;
    outline: 0;
    z-index: 0;
  }

  :host(:focus) {
    outline: none;
  }

  slot:not([name])::slotted(sl-icon) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    color: var(--sl-color-neutral-700);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .tree-item__checkbox {
    pointer-events: none;
  }

  .tree-item__expand-button,
  .tree-item__checkbox,
  .tree-item__label {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    letter-spacing: var(--sl-letter-spacing-normal);
  }

  .tree-item__checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .tree-item__indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .tree-item__expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-x-small);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .tree-item__expand-button {
    transition: var(--sl-transition-medium) rotate ease;
  }

  .tree-item--expanded .tree-item__expand-button {
    rotate: 90deg;
  }

  .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
    rotate: -90deg;
  }

  .tree-item--expanded slot[name='expand-icon'],
  .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
    display: none;
  }

  .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
    display: none;
  }

  .tree-item__expand-button--visible {
    cursor: pointer;
  }

  .tree-item__item {
    display: flex;
    align-items: center;
    border-inline-start: solid 3px transparent;
  }

  .tree-item--disabled .tree-item__item {
    opacity: 0.5;
    outline: none;
    cursor: not-allowed;
  }

  :host(:focus-visible) .tree-item__item {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
    z-index: 2;
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
    background-color: var(--sl-color-neutral-100);
    border-inline-start-color: var(--sl-color-primary-600);
  }

  :host(:not([aria-disabled='true'])) .tree-item__expand-button {
    color: var(--sl-color-neutral-600);
  }

  .tree-item__label {
    display: flex;
    align-items: center;
    transition: var(--sl-transition-fast) color;
  }

  .tree-item__children {
    display: block;
    font-size: calc(1em + var(--indent-size, var(--sl-spacing-medium)));
  }

  /* Indentation lines */
  .tree-item__children {
    position: relative;
  }

  .tree-item__children::before {
    content: '';
    position: absolute;
    top: var(--indent-guide-offset);
    bottom: var(--indent-guide-offset);
    left: calc(1em - (var(--indent-guide-width) / 2) - 1px);
    border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);
    z-index: 1;
  }

  .tree-item--rtl .tree-item__children::before {
    left: auto;
    right: 1em;
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
      outline: dashed 1px SelectedItem;
    }
  }
`,
  Ya = T`
  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`,
  Ie =
    (t = 'value') =>
    (e, i) => {
      const s = e.constructor,
        o = s.prototype.attributeChangedCallback;
      s.prototype.attributeChangedCallback = function (a, n, c) {
        var d;
        const h = s.getPropertyOptions(t),
          f = typeof h.attribute == 'string' ? h.attribute : t;
        if (a === f) {
          const u = h.converter || Se,
            m = (
              typeof u == 'function' ? u : (d = u == null ? void 0 : u.fromAttribute) != null ? d : Se.fromAttribute
            )(c, h.type);
          this[t] !== m && (this[i] = m);
        }
        o.call(this, a, n, c);
      };
    },
  ve = T`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`,
  vt = class {
    constructor(t, ...e) {
      (this.slotNames = []),
        (this.handleSlotChange = (i) => {
          const s = i.target;
          ((this.slotNames.includes('[default]') && !s.name) || (s.name && this.slotNames.includes(s.name))) &&
            this.host.requestUpdate();
        }),
        (this.host = t).addController(this),
        (this.slotNames = e);
    }
    hasDefaultSlot() {
      return [...this.host.childNodes].some((t) => {
        if (t.nodeType === t.TEXT_NODE && t.textContent.trim() !== '') return !0;
        if (t.nodeType === t.ELEMENT_NODE) {
          const e = t;
          if (e.tagName.toLowerCase() === 'sl-visually-hidden') return !1;
          if (!e.hasAttribute('slot')) return !0;
        }
        return !1;
      });
    }
    hasNamedSlot(t) {
      return this.host.querySelector(`:scope > [slot="${t}"]`) !== null;
    }
    test(t) {
      return t === '[default]' ? this.hasDefaultSlot() : this.hasNamedSlot(t);
    }
    hostConnected() {
      this.host.shadowRoot.addEventListener('slotchange', this.handleSlotChange);
    }
    hostDisconnected() {
      this.host.shadowRoot.removeEventListener('slotchange', this.handleSlotChange);
    }
  };
function Xa(t) {
  if (!t) return '';
  const e = t.assignedNodes({ flatten: !0 });
  let i = '';
  return (
    [...e].forEach((s) => {
      s.nodeType === Node.TEXT_NODE && (i += s.textContent);
    }),
    i
  );
}
var os = '';
function Xs(t) {
  os = t;
}
function Ga(t = '') {
  if (!os) {
    const e = [...document.getElementsByTagName('script')],
      i = e.find((s) => s.hasAttribute('data-shoelace'));
    if (i) Xs(i.getAttribute('data-shoelace'));
    else {
      const s = e.find(
        (a) => /shoelace(\.min)?\.js($|\?)/.test(a.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(a.src)
      );
      let o = '';
      s && (o = s.getAttribute('src')), Xs(o.split('/').slice(0, -1).join('/'));
    }
  }
  return os.replace(/\/$/, '') + (t ? `/${t.replace(/^\//, '')}` : '');
}
var Qa = { name: 'default', resolver: (t) => Ga(`assets/icons/${t}.svg`) },
  Za = Qa,
  Gs = {
    caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
    check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    'chevron-down': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    'chevron-left': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
    'chevron-right': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
    copy: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,
    eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
    'eye-slash': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
    eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
    'grip-vertical': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
    indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
    'person-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
    'play-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
    'pause-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
    radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
    'star-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
    'x-lg': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
    'x-circle-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `,
  },
  Ja = { name: 'system', resolver: (t) => (t in Gs ? `data:image/svg+xml,${encodeURIComponent(Gs[t])}` : '') },
  tn = Ja,
  en = [Za, tn],
  rs = [];
function sn(t) {
  rs.push(t);
}
function on(t) {
  rs = rs.filter((e) => e !== t);
}
function Qs(t) {
  return en.find((e) => e.name === t);
}
var rn = T`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const an = (t, e) => (t == null ? void 0 : t._$litType$) !== void 0,
  Ro = (t) => t.strings === void 0,
  nn = {},
  ln = (t, e = nn) => (t._$AH = e);
var Ve = Symbol(),
  mi = Symbol(),
  Ki,
  Yi = new Map(),
  j = class extends E {
    constructor() {
      super(...arguments), (this.initialRender = !1), (this.svg = null), (this.label = ''), (this.library = 'default');
    }
    async resolveIcon(t, e) {
      var i;
      let s;
      if (e != null && e.spriteSheet)
        return (
          (this.svg = y`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`),
          this.svg
        );
      try {
        if (((s = await fetch(t, { mode: 'cors' })), !s.ok)) return s.status === 410 ? Ve : mi;
      } catch {
        return mi;
      }
      try {
        const o = document.createElement('div');
        o.innerHTML = await s.text();
        const a = o.firstElementChild;
        if (((i = a == null ? void 0 : a.tagName) == null ? void 0 : i.toLowerCase()) !== 'svg') return Ve;
        Ki || (Ki = new DOMParser());
        const c = Ki.parseFromString(a.outerHTML, 'text/html').body.querySelector('svg');
        return c ? (c.part.add('svg'), document.adoptNode(c)) : Ve;
      } catch {
        return Ve;
      }
    }
    connectedCallback() {
      super.connectedCallback(), sn(this);
    }
    firstUpdated() {
      (this.initialRender = !0), this.setIcon();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), on(this);
    }
    getIconSource() {
      const t = Qs(this.library);
      return this.name && t ? { url: t.resolver(this.name), fromLibrary: !0 } : { url: this.src, fromLibrary: !1 };
    }
    handleLabelChange() {
      typeof this.label == 'string' && this.label.length > 0
        ? (this.setAttribute('role', 'img'),
          this.setAttribute('aria-label', this.label),
          this.removeAttribute('aria-hidden'))
        : (this.removeAttribute('role'), this.removeAttribute('aria-label'), this.setAttribute('aria-hidden', 'true'));
    }
    async setIcon() {
      var t;
      const { url: e, fromLibrary: i } = this.getIconSource(),
        s = i ? Qs(this.library) : void 0;
      if (!e) {
        this.svg = null;
        return;
      }
      let o = Yi.get(e);
      if ((o || ((o = this.resolveIcon(e, s)), Yi.set(e, o)), !this.initialRender)) return;
      const a = await o;
      if ((a === mi && Yi.delete(e), e === this.getIconSource().url)) {
        if (an(a)) {
          if (((this.svg = a), s)) {
            await this.updateComplete;
            const n = this.shadowRoot.querySelector("[part='svg']");
            typeof s.mutator == 'function' && n && s.mutator(n);
          }
          return;
        }
        switch (a) {
          case mi:
          case Ve:
            (this.svg = null), this.emit('sl-error');
            break;
          default:
            (this.svg = a.cloneNode(!0)),
              (t = s == null ? void 0 : s.mutator) == null || t.call(s, this.svg),
              this.emit('sl-load');
        }
      }
    }
    render() {
      return this.svg;
    }
  };
j.styles = [D, rn];
r([L()], j.prototype, 'svg', 2);
r([l({ reflect: !0 })], j.prototype, 'name', 2);
r([l()], j.prototype, 'src', 2);
r([l()], j.prototype, 'label', 2);
r([l({ reflect: !0 })], j.prototype, 'library', 2);
r([x('label')], j.prototype, 'handleLabelChange', 1);
r([x(['name', 'src', 'library'])], j.prototype, 'setIcon', 1);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const z = (t) => t ?? K;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const be = ai(
  class extends ni {
    constructor(t) {
      if ((super(t), t.type !== Ut.PROPERTY && t.type !== Ut.ATTRIBUTE && t.type !== Ut.BOOLEAN_ATTRIBUTE))
        throw Error('The `live` directive is not allowed on child or event bindings');
      if (!Ro(t)) throw Error('`live` bindings can only contain a single expression');
    }
    render(t) {
      return t;
    }
    update(t, [e]) {
      if (e === kt || e === K) return e;
      const i = t.element,
        s = t.name;
      if (t.type === Ut.PROPERTY) {
        if (e === i[s]) return kt;
      } else if (t.type === Ut.BOOLEAN_ATTRIBUTE) {
        if (!!e === i.hasAttribute(s)) return kt;
      } else if (t.type === Ut.ATTRIBUTE && i.getAttribute(s) === e + '') return kt;
      return ln(t), e;
    }
  }
);
var rt = class extends E {
  constructor() {
    super(...arguments),
      (this.formControlController = new Zt(this, {
        value: (t) => (t.checked ? t.value || 'on' : void 0),
        defaultValue: (t) => t.defaultChecked,
        setValue: (t, e) => (t.checked = e),
      })),
      (this.hasSlotController = new vt(this, 'help-text')),
      (this.hasFocus = !1),
      (this.title = ''),
      (this.name = ''),
      (this.size = 'medium'),
      (this.disabled = !1),
      (this.checked = !1),
      (this.indeterminate = !1),
      (this.defaultChecked = !1),
      (this.form = ''),
      (this.required = !1),
      (this.helpText = '');
  }
  get validity() {
    return this.input.validity;
  }
  get validationMessage() {
    return this.input.validationMessage;
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  handleClick() {
    (this.checked = !this.checked), (this.indeterminate = !1), this.emit('sl-change');
  }
  handleBlur() {
    (this.hasFocus = !1), this.emit('sl-blur');
  }
  handleInput() {
    this.emit('sl-input');
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  handleFocus() {
    (this.hasFocus = !0), this.emit('sl-focus');
  }
  handleDisabledChange() {
    this.formControlController.setValidity(this.disabled);
  }
  handleStateChange() {
    (this.input.checked = this.checked),
      (this.input.indeterminate = this.indeterminate),
      this.formControlController.updateValidity();
  }
  click() {
    this.input.click();
  }
  focus(t) {
    this.input.focus(t);
  }
  blur() {
    this.input.blur();
  }
  checkValidity() {
    return this.input.checkValidity();
  }
  getForm() {
    return this.formControlController.getForm();
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(t) {
    this.input.setCustomValidity(t), this.formControlController.updateValidity();
  }
  render() {
    const t = this.hasSlotController.test('help-text'),
      e = this.helpText ? !0 : !!t;
    return y`
      <div
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-help-text': e })}
      >
        <label
          part="base"
          class=${I({ checkbox: !0, 'checkbox--checked': this.checked, 'checkbox--disabled': this.disabled, 'checkbox--focused': this.hasFocus, 'checkbox--indeterminate': this.indeterminate, 'checkbox--small': this.size === 'small', 'checkbox--medium': this.size === 'medium', 'checkbox--large': this.size === 'large' })}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${z(this.value)}
            .indeterminate=${be(this.indeterminate)}
            .checked=${be(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked ? 'true' : 'false'}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />

          <span
            part="control${this.checked ? ' control--checked' : ''}${this.indeterminate ? ' control--indeterminate' : ''}"
            class="checkbox__control"
          >
            ${
              this.checked
                ? y`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `
                : ''
            }
            ${
              !this.checked && this.indeterminate
                ? y`
                  <sl-icon
                    part="indeterminate-icon"
                    class="checkbox__indeterminate-icon"
                    library="system"
                    name="indeterminate"
                  ></sl-icon>
                `
                : ''
            }
          </span>

          <div part="label" class="checkbox__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${e ? 'false' : 'true'}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
rt.styles = [D, ve, Ya];
rt.dependencies = { 'sl-icon': j };
r([k('input[type="checkbox"]')], rt.prototype, 'input', 2);
r([L()], rt.prototype, 'hasFocus', 2);
r([l()], rt.prototype, 'title', 2);
r([l()], rt.prototype, 'name', 2);
r([l()], rt.prototype, 'value', 2);
r([l({ reflect: !0 })], rt.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], rt.prototype, 'disabled', 2);
r([l({ type: Boolean, reflect: !0 })], rt.prototype, 'checked', 2);
r([l({ type: Boolean, reflect: !0 })], rt.prototype, 'indeterminate', 2);
r([Ie('checked')], rt.prototype, 'defaultChecked', 2);
r([l({ reflect: !0 })], rt.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], rt.prototype, 'required', 2);
r([l({ attribute: 'help-text' })], rt.prototype, 'helpText', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], rt.prototype, 'handleDisabledChange', 1);
r([x(['checked', 'indeterminate'], { waitUntilFirstUpdate: !0 })], rt.prototype, 'handleStateChange', 1);
var cn = T`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`,
  li = class extends E {
    constructor() {
      super(...arguments), (this.localize = new N(this));
    }
    render() {
      return y`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term('loading')}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
    }
  };
li.styles = [D, cn];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function Zs(t, e, i) {
  return t ? e(t) : i == null ? void 0 : i(t);
}
var Z = class as extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.indeterminate = !1),
      (this.isLeaf = !1),
      (this.loading = !1),
      (this.selectable = !1),
      (this.expanded = !1),
      (this.selected = !1),
      (this.disabled = !1),
      (this.lazy = !1);
  }
  static isTreeItem(e) {
    return e instanceof Element && e.getAttribute('role') === 'treeitem';
  }
  connectedCallback() {
    super.connectedCallback(),
      this.setAttribute('role', 'treeitem'),
      this.setAttribute('tabindex', '-1'),
      this.isNestedItem() && (this.slot = 'children');
  }
  firstUpdated() {
    (this.childrenContainer.hidden = !this.expanded),
      (this.childrenContainer.style.height = this.expanded ? 'auto' : '0'),
      (this.isLeaf = !this.lazy && this.getChildrenItems().length === 0),
      this.handleExpandedChange();
  }
  async animateCollapse() {
    this.emit('sl-collapse'), await st(this.childrenContainer);
    const { keyframes: e, options: i } = Y(this, 'tree-item.collapse', { dir: this.localize.dir() });
    await Q(this.childrenContainer, Ei(e, this.childrenContainer.scrollHeight), i),
      (this.childrenContainer.hidden = !0),
      this.emit('sl-after-collapse');
  }
  isNestedItem() {
    const e = this.parentElement;
    return !!e && as.isTreeItem(e);
  }
  handleChildrenSlotChange() {
    (this.loading = !1), (this.isLeaf = !this.lazy && this.getChildrenItems().length === 0);
  }
  willUpdate(e) {
    e.has('selected') && !e.has('indeterminate') && (this.indeterminate = !1);
  }
  async animateExpand() {
    this.emit('sl-expand'), await st(this.childrenContainer), (this.childrenContainer.hidden = !1);
    const { keyframes: e, options: i } = Y(this, 'tree-item.expand', { dir: this.localize.dir() });
    await Q(this.childrenContainer, Ei(e, this.childrenContainer.scrollHeight), i),
      (this.childrenContainer.style.height = 'auto'),
      this.emit('sl-after-expand');
  }
  handleLoadingChange() {
    this.setAttribute('aria-busy', this.loading ? 'true' : 'false'), this.loading || this.animateExpand();
  }
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }
  handleSelectedChange() {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }
  handleExpandedChange() {
    this.isLeaf
      ? this.removeAttribute('aria-expanded')
      : this.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
  }
  handleExpandAnimation() {
    this.expanded
      ? this.lazy
        ? ((this.loading = !0), this.emit('sl-lazy-load'))
        : this.animateExpand()
      : this.animateCollapse();
  }
  handleLazyChange() {
    this.emit('sl-lazy-change');
  }
  getChildrenItems({ includeDisabled: e = !0 } = {}) {
    return this.childrenSlot
      ? [...this.childrenSlot.assignedElements({ flatten: !0 })].filter((i) => as.isTreeItem(i) && (e || !i.disabled))
      : [];
  }
  render() {
    const e = this.localize.dir() === 'rtl',
      i = !this.loading && (!this.isLeaf || this.lazy);
    return y`
      <div
        part="base"
        class="${I({ 'tree-item': !0, 'tree-item--expanded': this.expanded, 'tree-item--selected': this.selected, 'tree-item--disabled': this.disabled, 'tree-item--leaf': this.isLeaf, 'tree-item--has-expand-button': i, 'tree-item--rtl': this.localize.dir() === 'rtl' })}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled ? 'item--disabled' : ''}
            ${this.expanded ? 'item--expanded' : ''}
            ${this.indeterminate ? 'item--indeterminate' : ''}
            ${this.selected ? 'item--selected' : ''}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${I({ 'tree-item__expand-button': !0, 'tree-item__expand-button--visible': i })}
            aria-hidden="true"
          >
            ${Zs(this.loading, () => y` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `)}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <sl-icon library="system" name=${e ? 'chevron-left' : 'chevron-right'}></sl-icon>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <sl-icon library="system" name=${e ? 'chevron-left' : 'chevron-right'}></sl-icon>
            </slot>
          </div>

          ${Zs(
            this.selectable,
            () => y`
              <sl-checkbox
                part="checkbox"
                exportparts="
                    base:checkbox__base,
                    control:checkbox__control,
                    control--checked:checkbox__control--checked,
                    control--indeterminate:checkbox__control--indeterminate,
                    checked-icon:checkbox__checked-icon,
                    indeterminate-icon:checkbox__indeterminate-icon,
                    label:checkbox__label
                  "
                class="tree-item__checkbox"
                ?disabled="${this.disabled}"
                ?checked="${be(this.selected)}"
                ?indeterminate="${this.indeterminate}"
                tabindex="-1"
              ></sl-checkbox>
            `
          )}

          <slot class="tree-item__label" part="label"></slot>
        </div>

        <div class="tree-item__children" part="children" role="group">
          <slot name="children" @slotchange="${this.handleChildrenSlotChange}"></slot>
        </div>
      </div>
    `;
  }
};
Z.styles = [D, Ka];
Z.dependencies = { 'sl-checkbox': rt, 'sl-icon': j, 'sl-spinner': li };
r([L()], Z.prototype, 'indeterminate', 2);
r([L()], Z.prototype, 'isLeaf', 2);
r([L()], Z.prototype, 'loading', 2);
r([L()], Z.prototype, 'selectable', 2);
r([l({ type: Boolean, reflect: !0 })], Z.prototype, 'expanded', 2);
r([l({ type: Boolean, reflect: !0 })], Z.prototype, 'selected', 2);
r([l({ type: Boolean, reflect: !0 })], Z.prototype, 'disabled', 2);
r([l({ type: Boolean, reflect: !0 })], Z.prototype, 'lazy', 2);
r([k('slot:not([name])')], Z.prototype, 'defaultSlot', 2);
r([k('slot[name=children]')], Z.prototype, 'childrenSlot', 2);
r([k('.tree-item__item')], Z.prototype, 'itemElement', 2);
r([k('.tree-item__children')], Z.prototype, 'childrenContainer', 2);
r([k('.tree-item__expand-button slot')], Z.prototype, 'expandButtonSlot', 2);
r([x('loading', { waitUntilFirstUpdate: !0 })], Z.prototype, 'handleLoadingChange', 1);
r([x('disabled')], Z.prototype, 'handleDisabledChange', 1);
r([x('selected')], Z.prototype, 'handleSelectedChange', 1);
r([x('expanded', { waitUntilFirstUpdate: !0 })], Z.prototype, 'handleExpandedChange', 1);
r([x('expanded', { waitUntilFirstUpdate: !0 })], Z.prototype, 'handleExpandAnimation', 1);
r([x('lazy', { waitUntilFirstUpdate: !0 })], Z.prototype, 'handleLazyChange', 1);
var je = Z;
q('tree-item.expand', {
  keyframes: [
    { height: '0', opacity: '0', overflow: 'hidden' },
    { height: 'auto', opacity: '1', overflow: 'hidden' },
  ],
  options: { duration: 250, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
});
q('tree-item.collapse', {
  keyframes: [
    { height: 'auto', opacity: '1', overflow: 'hidden' },
    { height: '0', opacity: '0', overflow: 'hidden' },
  ],
  options: { duration: 200, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' },
});
function it(t, e, i) {
  const s = (o) => (Object.is(o, -0) ? 0 : o);
  return t < e ? s(e) : t > i ? s(i) : s(t);
}
function Js(t, e = !1) {
  function i(a) {
    const n = a.getChildrenItems({ includeDisabled: !1 });
    if (n.length) {
      const c = n.every((h) => h.selected),
        d = n.every((h) => !h.selected && !h.indeterminate);
      (a.selected = c), (a.indeterminate = !c && !d);
    }
  }
  function s(a) {
    const n = a.parentElement;
    je.isTreeItem(n) && (i(n), s(n));
  }
  function o(a) {
    for (const n of a.getChildrenItems()) (n.selected = e ? a.selected || n.selected : !n.disabled && a.selected), o(n);
    e && i(a);
  }
  o(t), s(t);
}
var ye = class extends E {
  constructor() {
    super(),
      (this.selection = 'single'),
      (this.clickTarget = null),
      (this.localize = new N(this)),
      (this.initTreeItem = (t) => {
        (t.selectable = this.selection === 'multiple'),
          ['expand', 'collapse']
            .filter((e) => !!this.querySelector(`[slot="${e}-icon"]`))
            .forEach((e) => {
              const i = t.querySelector(`[slot="${e}-icon"]`),
                s = this.getExpandButtonIcon(e);
              s && (i === null ? t.append(s) : i.hasAttribute('data-default') && i.replaceWith(s));
            });
      }),
      (this.handleTreeChanged = (t) => {
        for (const e of t) {
          const i = [...e.addedNodes].filter(je.isTreeItem),
            s = [...e.removedNodes].filter(je.isTreeItem);
          i.forEach(this.initTreeItem),
            this.lastFocusedItem && s.includes(this.lastFocusedItem) && (this.lastFocusedItem = null);
        }
      }),
      (this.handleFocusOut = (t) => {
        const e = t.relatedTarget;
        (!e || !this.contains(e)) && (this.tabIndex = 0);
      }),
      (this.handleFocusIn = (t) => {
        const e = t.target;
        t.target === this && this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]),
          je.isTreeItem(e) &&
            !e.disabled &&
            (this.lastFocusedItem && (this.lastFocusedItem.tabIndex = -1),
            (this.lastFocusedItem = e),
            (this.tabIndex = -1),
            (e.tabIndex = 0));
      }),
      this.addEventListener('focusin', this.handleFocusIn),
      this.addEventListener('focusout', this.handleFocusOut),
      this.addEventListener('sl-lazy-change', this.handleSlotChange);
  }
  async connectedCallback() {
    super.connectedCallback(),
      this.setAttribute('role', 'tree'),
      this.setAttribute('tabindex', '0'),
      await this.updateComplete,
      (this.mutationObserver = new MutationObserver(this.handleTreeChanged)),
      this.mutationObserver.observe(this, { childList: !0, subtree: !0 });
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this.mutationObserver) == null || t.disconnect();
  }
  getExpandButtonIcon(t) {
    const i = (t === 'expand' ? this.expandedIconSlot : this.collapsedIconSlot).assignedElements({ flatten: !0 })[0];
    if (i) {
      const s = i.cloneNode(!0);
      return (
        [s, ...s.querySelectorAll('[id]')].forEach((o) => o.removeAttribute('id')),
        s.setAttribute('data-default', ''),
        (s.slot = `${t}-icon`),
        s
      );
    }
    return null;
  }
  selectItem(t) {
    const e = [...this.selectedItems];
    if (this.selection === 'multiple') (t.selected = !t.selected), t.lazy && (t.expanded = !0), Js(t);
    else if (this.selection === 'single' || t.isLeaf) {
      const s = this.getAllTreeItems();
      for (const o of s) o.selected = o === t;
    } else this.selection === 'leaf' && (t.expanded = !t.expanded);
    const i = this.selectedItems;
    (e.length !== i.length || i.some((s) => !e.includes(s))) &&
      Promise.all(i.map((s) => s.updateComplete)).then(() => {
        this.emit('sl-selection-change', { detail: { selection: i } });
      });
  }
  getAllTreeItems() {
    return [...this.querySelectorAll('sl-tree-item')];
  }
  focusItem(t) {
    t == null || t.focus();
  }
  handleKeyDown(t) {
    if (
      !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(t.key) ||
      t.composedPath().some((o) => {
        var a;
        return ['input', 'textarea'].includes((a = o == null ? void 0 : o.tagName) == null ? void 0 : a.toLowerCase());
      })
    )
      return;
    const e = this.getFocusableItems(),
      i = this.localize.dir() === 'ltr',
      s = this.localize.dir() === 'rtl';
    if (e.length > 0) {
      t.preventDefault();
      const o = e.findIndex((d) => d.matches(':focus')),
        a = e[o],
        n = (d) => {
          const h = e[it(d, 0, e.length - 1)];
          this.focusItem(h);
        },
        c = (d) => {
          a.expanded = d;
        };
      t.key === 'ArrowDown'
        ? n(o + 1)
        : t.key === 'ArrowUp'
          ? n(o - 1)
          : (i && t.key === 'ArrowRight') || (s && t.key === 'ArrowLeft')
            ? !a || a.disabled || a.expanded || (a.isLeaf && !a.lazy)
              ? n(o + 1)
              : c(!0)
            : (i && t.key === 'ArrowLeft') || (s && t.key === 'ArrowRight')
              ? !a || a.disabled || a.isLeaf || !a.expanded
                ? n(o - 1)
                : c(!1)
              : t.key === 'Home'
                ? n(0)
                : t.key === 'End'
                  ? n(e.length - 1)
                  : (t.key === 'Enter' || t.key === ' ') && (a.disabled || this.selectItem(a));
    }
  }
  handleClick(t) {
    const e = t.target,
      i = e.closest('sl-tree-item'),
      s = t.composedPath().some((o) => {
        var a;
        return (a = o == null ? void 0 : o.classList) == null ? void 0 : a.contains('tree-item__expand-button');
      });
    !i || i.disabled || e !== this.clickTarget || (s ? (i.expanded = !i.expanded) : this.selectItem(i));
  }
  handleMouseDown(t) {
    this.clickTarget = t.target;
  }
  handleSlotChange() {
    this.getAllTreeItems().forEach(this.initTreeItem);
  }
  async handleSelectionChange() {
    const t = this.selection === 'multiple',
      e = this.getAllTreeItems();
    this.setAttribute('aria-multiselectable', t ? 'true' : 'false');
    for (const i of e) i.selectable = t;
    t && (await this.updateComplete, [...this.querySelectorAll(':scope > sl-tree-item')].forEach((i) => Js(i, !0)));
  }
  get selectedItems() {
    const t = this.getAllTreeItems(),
      e = (i) => i.selected;
    return t.filter(e);
  }
  getFocusableItems() {
    const t = this.getAllTreeItems(),
      e = new Set();
    return t.filter((i) => {
      var s;
      if (i.disabled) return !1;
      const o = (s = i.parentElement) == null ? void 0 : s.closest('[role=treeitem]');
      return o && (!o.expanded || o.loading || e.has(o)) && e.add(i), !e.has(i);
    });
  }
  render() {
    return y`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <span hidden aria-hidden="true"><slot name="expand-icon"></slot></span>
        <span hidden aria-hidden="true"><slot name="collapse-icon"></slot></span>
      </div>
    `;
  }
};
ye.styles = [D, ja];
r([k('slot:not([name])')], ye.prototype, 'defaultSlot', 2);
r([k('slot[name=expand-icon]')], ye.prototype, 'expandedIconSlot', 2);
r([k('slot[name=collapse-icon]')], ye.prototype, 'collapsedIconSlot', 2);
r([l()], ye.prototype, 'selection', 2);
r([x('selection')], ye.prototype, 'handleSelectionChange', 1);
ye.define('sl-tree');
je.define('sl-tree-item');
var dn = T`
  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`,
  hn = 0,
  ci = class extends E {
    constructor() {
      super(...arguments),
        (this.attrId = ++hn),
        (this.componentId = `sl-tab-panel-${this.attrId}`),
        (this.name = ''),
        (this.active = !1);
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.id = this.id.length > 0 ? this.id : this.componentId),
        this.setAttribute('role', 'tabpanel');
    }
    handleActiveChange() {
      this.setAttribute('aria-hidden', this.active ? 'false' : 'true');
    }
    render() {
      return y`
      <slot
        part="base"
        class=${I({ 'tab-panel': !0, 'tab-panel--active': this.active })}
      ></slot>
    `;
    }
  };
ci.styles = [D, dn];
r([l({ reflect: !0 })], ci.prototype, 'name', 2);
r([l({ type: Boolean, reflect: !0 })], ci.prototype, 'active', 2);
r([x('active')], ci.prototype, 'handleActiveChange', 1);
ci.define('sl-tab-panel');
var un = T`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`,
  pn = T`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Fo = Symbol.for(''),
  fn = (t) => {
    if ((t == null ? void 0 : t.r) === Fo) return t == null ? void 0 : t._$litStatic$;
  },
  Ai = (t, ...e) => ({
    _$litStatic$: e.reduce(
      (i, s, o) =>
        i +
        ((a) => {
          if (a._$litStatic$ !== void 0) return a._$litStatic$;
          throw Error(`Value passed to 'literal' function must be a 'literal' result: ${a}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
        })(s) +
        t[o + 1],
      t[0]
    ),
    r: Fo,
  }),
  to = new Map(),
  mn =
    (t) =>
    (e, ...i) => {
      const s = i.length;
      let o, a;
      const n = [],
        c = [];
      let d,
        h = 0,
        f = !1;
      for (; h < s; ) {
        for (d = e[h]; h < s && ((a = i[h]), (o = fn(a)) !== void 0); ) (d += o + e[++h]), (f = !0);
        h !== s && c.push(a), n.push(d), h++;
      }
      if ((h === s && n.push(e[s]), f)) {
        const u = n.join('$$lit$$');
        (e = to.get(u)) === void 0 && ((n.raw = n), to.set(u, (e = n))), (i = c);
      }
      return t(e, ...i);
    },
  Ke = mn(y);
var at = class extends E {
  constructor() {
    super(...arguments), (this.hasFocus = !1), (this.label = ''), (this.disabled = !1);
  }
  handleBlur() {
    (this.hasFocus = !1), this.emit('sl-blur');
  }
  handleFocus() {
    (this.hasFocus = !0), this.emit('sl-focus');
  }
  handleClick(t) {
    this.disabled && (t.preventDefault(), t.stopPropagation());
  }
  click() {
    this.button.click();
  }
  focus(t) {
    this.button.focus(t);
  }
  blur() {
    this.button.blur();
  }
  render() {
    const t = !!this.href,
      e = t ? Ai`a` : Ai`button`;
    return Ke`
      <${e}
        part="base"
        class=${I({ 'icon-button': !0, 'icon-button--disabled': !t && this.disabled, 'icon-button--focused': this.hasFocus })}
        ?disabled=${z(t ? void 0 : this.disabled)}
        type=${z(t ? void 0 : 'button')}
        href=${z(t ? this.href : void 0)}
        target=${z(t ? this.target : void 0)}
        download=${z(t ? this.download : void 0)}
        rel=${z(t && this.target ? 'noreferrer noopener' : void 0)}
        role=${z(t ? void 0 : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label="${this.label}"
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${z(this.name)}
          library=${z(this.library)}
          src=${z(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `;
  }
};
at.styles = [D, pn];
at.dependencies = { 'sl-icon': j };
r([k('.icon-button')], at.prototype, 'button', 2);
r([L()], at.prototype, 'hasFocus', 2);
r([l()], at.prototype, 'name', 2);
r([l()], at.prototype, 'library', 2);
r([l()], at.prototype, 'src', 2);
r([l()], at.prototype, 'href', 2);
r([l()], at.prototype, 'target', 2);
r([l()], at.prototype, 'download', 2);
r([l()], at.prototype, 'label', 2);
r([l({ type: Boolean, reflect: !0 })], at.prototype, 'disabled', 2);
var ne = class extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.variant = 'neutral'),
      (this.size = 'medium'),
      (this.pill = !1),
      (this.removable = !1);
  }
  handleRemoveClick() {
    this.emit('sl-remove');
  }
  render() {
    return y`
      <span
        part="base"
        class=${I({ tag: !0, 'tag--primary': this.variant === 'primary', 'tag--success': this.variant === 'success', 'tag--neutral': this.variant === 'neutral', 'tag--warning': this.variant === 'warning', 'tag--danger': this.variant === 'danger', 'tag--text': this.variant === 'text', 'tag--small': this.size === 'small', 'tag--medium': this.size === 'medium', 'tag--large': this.size === 'large', 'tag--pill': this.pill, 'tag--removable': this.removable })}
      >
        <slot part="content" class="tag__content"></slot>

        ${
          this.removable
            ? y`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term('remove')}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `
            : ''
        }
      </span>
    `;
  }
};
ne.styles = [D, un];
ne.dependencies = { 'sl-icon-button': at };
r([l({ reflect: !0 })], ne.prototype, 'variant', 2);
r([l({ reflect: !0 })], ne.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], ne.prototype, 'pill', 2);
r([l({ type: Boolean })], ne.prototype, 'removable', 2);
ne.define('sl-tag');
var gn = T`
  :host {
    display: block;
  }

  .textarea {
    display: grid;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    color: var(--sl-input-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea__control,
  .textarea__size-adjuster {
    grid-area: 1 / 1 / 2 / 2;
  }

  .textarea__size-adjuster {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--sl-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea__control {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.4;
    color: var(--sl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
  }

  .textarea--small .textarea__control {
    padding: 0.5em var(--sl-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .textarea--medium .textarea__control {
    padding: 0.5em var(--sl-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
  }

  .textarea--large .textarea__control {
    padding: 0.5em var(--sl-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`,
  H = class extends E {
    constructor() {
      super(...arguments),
        (this.formControlController = new Zt(this, { assumeInteractionOn: ['sl-blur', 'sl-input'] })),
        (this.hasSlotController = new vt(this, 'help-text', 'label')),
        (this.hasFocus = !1),
        (this.title = ''),
        (this.name = ''),
        (this.value = ''),
        (this.size = 'medium'),
        (this.filled = !1),
        (this.label = ''),
        (this.helpText = ''),
        (this.placeholder = ''),
        (this.rows = 4),
        (this.resize = 'vertical'),
        (this.disabled = !1),
        (this.readonly = !1),
        (this.form = ''),
        (this.required = !1),
        (this.spellcheck = !0),
        (this.defaultValue = '');
    }
    get validity() {
      return this.input.validity;
    }
    get validationMessage() {
      return this.input.validationMessage;
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight())),
        this.updateComplete.then(() => {
          this.setTextareaHeight(), this.resizeObserver.observe(this.input);
        });
    }
    firstUpdated() {
      this.formControlController.updateValidity();
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(), this.input && ((t = this.resizeObserver) == null || t.unobserve(this.input));
    }
    handleBlur() {
      (this.hasFocus = !1), this.emit('sl-blur');
    }
    handleChange() {
      (this.value = this.input.value), this.setTextareaHeight(), this.emit('sl-change');
    }
    handleFocus() {
      (this.hasFocus = !0), this.emit('sl-focus');
    }
    handleInput() {
      (this.value = this.input.value), this.emit('sl-input');
    }
    handleInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    setTextareaHeight() {
      this.resize === 'auto'
        ? ((this.sizeAdjuster.style.height = `${this.input.clientHeight}px`),
          (this.input.style.height = 'auto'),
          (this.input.style.height = `${this.input.scrollHeight}px`))
        : (this.input.style.height = '');
    }
    handleDisabledChange() {
      this.formControlController.setValidity(this.disabled);
    }
    handleRowsChange() {
      this.setTextareaHeight();
    }
    async handleValueChange() {
      await this.updateComplete, this.formControlController.updateValidity(), this.setTextareaHeight();
    }
    focus(t) {
      this.input.focus(t);
    }
    blur() {
      this.input.blur();
    }
    select() {
      this.input.select();
    }
    scrollPosition(t) {
      if (t) {
        typeof t.top == 'number' && (this.input.scrollTop = t.top),
          typeof t.left == 'number' && (this.input.scrollLeft = t.left);
        return;
      }
      return { top: this.input.scrollTop, left: this.input.scrollTop };
    }
    setSelectionRange(t, e, i = 'none') {
      this.input.setSelectionRange(t, e, i);
    }
    setRangeText(t, e, i, s = 'preserve') {
      const o = e ?? this.input.selectionStart,
        a = i ?? this.input.selectionEnd;
      this.input.setRangeText(t, o, a, s),
        this.value !== this.input.value && ((this.value = this.input.value), this.setTextareaHeight());
    }
    checkValidity() {
      return this.input.checkValidity();
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return this.input.reportValidity();
    }
    setCustomValidity(t) {
      this.input.setCustomValidity(t), this.formControlController.updateValidity();
    }
    render() {
      const t = this.hasSlotController.test('label'),
        e = this.hasSlotController.test('help-text'),
        i = this.label ? !0 : !!t,
        s = this.helpText ? !0 : !!e;
      return y`
      <div
        part="form-control"
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-label': i, 'form-control--has-help-text': s })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${i ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${I({ textarea: !0, 'textarea--small': this.size === 'small', 'textarea--medium': this.size === 'medium', 'textarea--large': this.size === 'large', 'textarea--standard': !this.filled, 'textarea--filled': this.filled, 'textarea--disabled': this.disabled, 'textarea--focused': this.hasFocus, 'textarea--empty': !this.value, 'textarea--resize-none': this.resize === 'none', 'textarea--resize-vertical': this.resize === 'vertical', 'textarea--resize-auto': this.resize === 'auto' })}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title}
              name=${z(this.name)}
              .value=${be(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${z(this.placeholder)}
              rows=${z(this.rows)}
              minlength=${z(this.minlength)}
              maxlength=${z(this.maxlength)}
              autocapitalize=${z(this.autocapitalize)}
              autocorrect=${z(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${z(this.spellcheck)}
              enterkeyhint=${z(this.enterkeyhint)}
              inputmode=${z(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
            <!-- This "adjuster" exists to prevent layout shifting. https://github.com/shoelace-style/shoelace/issues/2180 -->
            <div part="textarea-adjuster" class="textarea__size-adjuster" ?hidden=${this.resize !== 'auto'}></div>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
    }
  };
H.styles = [D, ve, gn];
r([k('.textarea__control')], H.prototype, 'input', 2);
r([k('.textarea__size-adjuster')], H.prototype, 'sizeAdjuster', 2);
r([L()], H.prototype, 'hasFocus', 2);
r([l()], H.prototype, 'title', 2);
r([l()], H.prototype, 'name', 2);
r([l()], H.prototype, 'value', 2);
r([l({ reflect: !0 })], H.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], H.prototype, 'filled', 2);
r([l()], H.prototype, 'label', 2);
r([l({ attribute: 'help-text' })], H.prototype, 'helpText', 2);
r([l()], H.prototype, 'placeholder', 2);
r([l({ type: Number })], H.prototype, 'rows', 2);
r([l()], H.prototype, 'resize', 2);
r([l({ type: Boolean, reflect: !0 })], H.prototype, 'disabled', 2);
r([l({ type: Boolean, reflect: !0 })], H.prototype, 'readonly', 2);
r([l({ reflect: !0 })], H.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], H.prototype, 'required', 2);
r([l({ type: Number })], H.prototype, 'minlength', 2);
r([l({ type: Number })], H.prototype, 'maxlength', 2);
r([l()], H.prototype, 'autocapitalize', 2);
r([l()], H.prototype, 'autocorrect', 2);
r([l()], H.prototype, 'autocomplete', 2);
r([l({ type: Boolean })], H.prototype, 'autofocus', 2);
r([l()], H.prototype, 'enterkeyhint', 2);
r(
  [
    l({
      type: Boolean,
      converter: { fromAttribute: (t) => !(!t || t === 'false'), toAttribute: (t) => (t ? 'true' : 'false') },
    }),
  ],
  H.prototype,
  'spellcheck',
  2
);
r([l()], H.prototype, 'inputmode', 2);
r([Ie()], H.prototype, 'defaultValue', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], H.prototype, 'handleDisabledChange', 1);
r([x('rows', { waitUntilFirstUpdate: !0 })], H.prototype, 'handleRowsChange', 1);
r([x('value', { waitUntilFirstUpdate: !0 })], H.prototype, 'handleValueChange', 1);
H.define('sl-textarea');
var bn = T`
  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    border-radius: var(--sl-border-radius-medium);
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-medium) var(--sl-spacing-large);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition:
      var(--transition-speed) box-shadow,
      var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible) {
    color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width) - var(--sl-focus-ring-offset));
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--sl-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab__close-button {
    font-size: var(--sl-font-size-small);
    margin-inline-start: var(--sl-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--sl-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`,
  vn = 0,
  Ot = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.attrId = ++vn),
        (this.componentId = `sl-tab-${this.attrId}`),
        (this.panel = ''),
        (this.active = !1),
        (this.closable = !1),
        (this.disabled = !1),
        (this.tabIndex = 0);
    }
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'tab');
    }
    handleCloseClick(t) {
      t.stopPropagation(), this.emit('sl-close');
    }
    handleActiveChange() {
      this.setAttribute('aria-selected', this.active ? 'true' : 'false');
    }
    handleDisabledChange() {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false'),
        this.disabled && !this.active ? (this.tabIndex = -1) : (this.tabIndex = 0);
    }
    render() {
      return (
        (this.id = this.id.length > 0 ? this.id : this.componentId),
        y`
      <div
        part="base"
        class=${I({ tab: !0, 'tab--active': this.active, 'tab--closable': this.closable, 'tab--disabled': this.disabled })}
      >
        <slot></slot>
        ${
          this.closable
            ? y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term('close')}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `
            : ''
        }
      </div>
    `
      );
    }
  };
Ot.styles = [D, bn];
Ot.dependencies = { 'sl-icon-button': at };
r([k('.tab')], Ot.prototype, 'tab', 2);
r([l({ reflect: !0 })], Ot.prototype, 'panel', 2);
r([l({ type: Boolean, reflect: !0 })], Ot.prototype, 'active', 2);
r([l({ type: Boolean, reflect: !0 })], Ot.prototype, 'closable', 2);
r([l({ type: Boolean, reflect: !0 })], Ot.prototype, 'disabled', 2);
r([l({ type: Number, reflect: !0 })], Ot.prototype, 'tabIndex', 2);
r([x('active')], Ot.prototype, 'handleActiveChange', 1);
r([x('disabled')], Ot.prototype, 'handleDisabledChange', 1);
Ot.define('sl-tab');
var yn = T`
  :host {
    --indicator-color: var(--sl-color-primary-600);
    --track-color: var(--sl-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group__indicator {
    position: absolute;
    transition:
      var(--sl-transition-fast) translate ease,
      var(--sl-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sl-spacing-x-large);
  }

  .tab-group--has-scroll-controls .tab-group__scroll-button--start--hidden,
  .tab-group--has-scroll-controls .tab-group__scroll-button--end--hidden {
    visibility: hidden;
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }
`,
  wn = T`
  :host {
    display: contents;
  }
`,
  di = class extends E {
    constructor() {
      super(...arguments), (this.observedElements = []), (this.disabled = !1);
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.resizeObserver = new ResizeObserver((t) => {
          this.emit('sl-resize', { detail: { entries: t } });
        })),
        this.disabled || this.startObserver();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.stopObserver();
    }
    handleSlotChange() {
      this.disabled || this.startObserver();
    }
    startObserver() {
      const t = this.shadowRoot.querySelector('slot');
      if (t !== null) {
        const e = t.assignedElements({ flatten: !0 });
        this.observedElements.forEach((i) => this.resizeObserver.unobserve(i)),
          (this.observedElements = []),
          e.forEach((i) => {
            this.resizeObserver.observe(i), this.observedElements.push(i);
          });
      }
    }
    stopObserver() {
      this.resizeObserver.disconnect();
    }
    handleDisabledChange() {
      this.disabled ? this.stopObserver() : this.startObserver();
    }
    render() {
      return y` <slot @slotchange=${this.handleSlotChange}></slot> `;
    }
  };
di.styles = [D, wn];
r([l({ type: Boolean, reflect: !0 })], di.prototype, 'disabled', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], di.prototype, 'handleDisabledChange', 1);
function _n(t, e) {
  return {
    top: Math.round(t.getBoundingClientRect().top - e.getBoundingClientRect().top),
    left: Math.round(t.getBoundingClientRect().left - e.getBoundingClientRect().left),
  };
}
var ns = new Set();
function xn() {
  const t = document.documentElement.clientWidth;
  return Math.abs(window.innerWidth - t);
}
function kn() {
  const t = Number(getComputedStyle(document.body).paddingRight.replace(/px/, ''));
  return isNaN(t) || !t ? 0 : t;
}
function Ye(t) {
  if ((ns.add(t), !document.documentElement.classList.contains('sl-scroll-lock'))) {
    const e = xn() + kn();
    let i = getComputedStyle(document.documentElement).scrollbarGutter;
    (!i || i === 'auto') && (i = 'stable'),
      e < 2 && (i = ''),
      document.documentElement.style.setProperty('--sl-scroll-lock-gutter', i),
      document.documentElement.classList.add('sl-scroll-lock'),
      document.documentElement.style.setProperty('--sl-scroll-lock-size', `${e}px`);
  }
}
function Xe(t) {
  ns.delete(t),
    ns.size === 0 &&
      (document.documentElement.classList.remove('sl-scroll-lock'),
      document.documentElement.style.removeProperty('--sl-scroll-lock-size'));
}
function ls(t, e, i = 'vertical', s = 'smooth') {
  const o = _n(t, e),
    a = o.top + e.scrollTop,
    n = o.left + e.scrollLeft,
    c = e.scrollLeft,
    d = e.scrollLeft + e.offsetWidth,
    h = e.scrollTop,
    f = e.scrollTop + e.offsetHeight;
  (i === 'horizontal' || i === 'both') &&
    (n < c
      ? e.scrollTo({ left: n, behavior: s })
      : n + t.clientWidth > d && e.scrollTo({ left: n - e.offsetWidth + t.clientWidth, behavior: s })),
    (i === 'vertical' || i === 'both') &&
      (a < h
        ? e.scrollTo({ top: a, behavior: s })
        : a + t.clientHeight > f && e.scrollTo({ top: a - e.offsetHeight + t.clientHeight, behavior: s }));
}
var ht = class extends E {
  constructor() {
    super(...arguments),
      (this.tabs = []),
      (this.focusableTabs = []),
      (this.panels = []),
      (this.localize = new N(this)),
      (this.hasScrollControls = !1),
      (this.shouldHideScrollStartButton = !1),
      (this.shouldHideScrollEndButton = !1),
      (this.placement = 'top'),
      (this.activation = 'auto'),
      (this.noScrollControls = !1),
      (this.fixedScrollControls = !1),
      (this.scrollOffset = 1);
  }
  connectedCallback() {
    const t = Promise.all([customElements.whenDefined('sl-tab'), customElements.whenDefined('sl-tab-panel')]);
    super.connectedCallback(),
      (this.resizeObserver = new ResizeObserver(() => {
        this.repositionIndicator(), this.updateScrollControls();
      })),
      (this.mutationObserver = new MutationObserver((e) => {
        if (
          (e.some((i) => !['aria-labelledby', 'aria-controls'].includes(i.attributeName)) &&
            setTimeout(() => this.setAriaLabels()),
          e.some((i) => i.attributeName === 'disabled'))
        )
          this.syncTabsAndPanels();
        else if (e.some((i) => i.attributeName === 'active')) {
          const s = e
            .filter((o) => o.attributeName === 'active' && o.target.tagName.toLowerCase() === 'sl-tab')
            .map((o) => o.target)
            .find((o) => o.active);
          s && this.setActiveTab(s);
        }
      })),
      this.updateComplete.then(() => {
        this.syncTabsAndPanels(),
          this.mutationObserver.observe(this, { attributes: !0, childList: !0, subtree: !0 }),
          this.resizeObserver.observe(this.nav),
          t.then(() => {
            new IntersectionObserver((i, s) => {
              var o;
              i[0].intersectionRatio > 0 &&
                (this.setAriaLabels(),
                this.setActiveTab((o = this.getActiveTab()) != null ? o : this.tabs[0], { emitEvents: !1 }),
                s.unobserve(i[0].target));
            }).observe(this.tabGroup);
          });
      });
  }
  disconnectedCallback() {
    var t, e;
    super.disconnectedCallback(),
      (t = this.mutationObserver) == null || t.disconnect(),
      this.nav && ((e = this.resizeObserver) == null || e.unobserve(this.nav));
  }
  getAllTabs() {
    return this.shadowRoot.querySelector('slot[name="nav"]').assignedElements();
  }
  getAllPanels() {
    return [...this.body.assignedElements()].filter((t) => t.tagName.toLowerCase() === 'sl-tab-panel');
  }
  getActiveTab() {
    return this.tabs.find((t) => t.active);
  }
  handleClick(t) {
    const i = t.target.closest('sl-tab');
    (i == null ? void 0 : i.closest('sl-tab-group')) === this &&
      i !== null &&
      this.setActiveTab(i, { scrollBehavior: 'smooth' });
  }
  handleKeyDown(t) {
    const i = t.target.closest('sl-tab');
    if (
      (i == null ? void 0 : i.closest('sl-tab-group')) === this &&
      (['Enter', ' '].includes(t.key) &&
        i !== null &&
        (this.setActiveTab(i, { scrollBehavior: 'smooth' }), t.preventDefault()),
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(t.key))
    ) {
      const o = this.tabs.find((c) => c.matches(':focus')),
        a = this.localize.dir() === 'rtl';
      let n = null;
      if ((o == null ? void 0 : o.tagName.toLowerCase()) === 'sl-tab') {
        if (t.key === 'Home') n = this.focusableTabs[0];
        else if (t.key === 'End') n = this.focusableTabs[this.focusableTabs.length - 1];
        else if (
          (['top', 'bottom'].includes(this.placement) && t.key === (a ? 'ArrowRight' : 'ArrowLeft')) ||
          (['start', 'end'].includes(this.placement) && t.key === 'ArrowUp')
        ) {
          const c = this.tabs.findIndex((d) => d === o);
          n = this.findNextFocusableTab(c, 'backward');
        } else if (
          (['top', 'bottom'].includes(this.placement) && t.key === (a ? 'ArrowLeft' : 'ArrowRight')) ||
          (['start', 'end'].includes(this.placement) && t.key === 'ArrowDown')
        ) {
          const c = this.tabs.findIndex((d) => d === o);
          n = this.findNextFocusableTab(c, 'forward');
        }
        if (!n) return;
        (n.tabIndex = 0),
          n.focus({ preventScroll: !0 }),
          this.activation === 'auto'
            ? this.setActiveTab(n, { scrollBehavior: 'smooth' })
            : this.tabs.forEach((c) => {
                c.tabIndex = c === n ? 0 : -1;
              }),
          ['top', 'bottom'].includes(this.placement) && ls(n, this.nav, 'horizontal'),
          t.preventDefault();
      }
    }
  }
  handleScrollToStart() {
    this.nav.scroll({
      left:
        this.localize.dir() === 'rtl'
          ? this.nav.scrollLeft + this.nav.clientWidth
          : this.nav.scrollLeft - this.nav.clientWidth,
      behavior: 'smooth',
    });
  }
  handleScrollToEnd() {
    this.nav.scroll({
      left:
        this.localize.dir() === 'rtl'
          ? this.nav.scrollLeft - this.nav.clientWidth
          : this.nav.scrollLeft + this.nav.clientWidth,
      behavior: 'smooth',
    });
  }
  setActiveTab(t, e) {
    if (((e = Qt({ emitEvents: !0, scrollBehavior: 'auto' }, e)), t !== this.activeTab && !t.disabled)) {
      const i = this.activeTab;
      (this.activeTab = t),
        this.tabs.forEach((s) => {
          (s.active = s === this.activeTab), (s.tabIndex = s === this.activeTab ? 0 : -1);
        }),
        this.panels.forEach((s) => {
          var o;
          return (s.active = s.name === ((o = this.activeTab) == null ? void 0 : o.panel));
        }),
        this.syncIndicator(),
        ['top', 'bottom'].includes(this.placement) && ls(this.activeTab, this.nav, 'horizontal', e.scrollBehavior),
        e.emitEvents &&
          (i && this.emit('sl-tab-hide', { detail: { name: i.panel } }),
          this.emit('sl-tab-show', { detail: { name: this.activeTab.panel } }));
    }
  }
  setAriaLabels() {
    this.tabs.forEach((t) => {
      const e = this.panels.find((i) => i.name === t.panel);
      e &&
        (t.setAttribute('aria-controls', e.getAttribute('id')),
        e.setAttribute('aria-labelledby', t.getAttribute('id')));
    });
  }
  repositionIndicator() {
    const t = this.getActiveTab();
    if (!t) return;
    const e = t.clientWidth,
      i = t.clientHeight,
      s = this.localize.dir() === 'rtl',
      o = this.getAllTabs(),
      n = o
        .slice(0, o.indexOf(t))
        .reduce((c, d) => ({ left: c.left + d.clientWidth, top: c.top + d.clientHeight }), { left: 0, top: 0 });
    switch (this.placement) {
      case 'top':
      case 'bottom':
        (this.indicator.style.width = `${e}px`),
          (this.indicator.style.height = 'auto'),
          (this.indicator.style.translate = s ? `${-1 * n.left}px` : `${n.left}px`);
        break;
      case 'start':
      case 'end':
        (this.indicator.style.width = 'auto'),
          (this.indicator.style.height = `${i}px`),
          (this.indicator.style.translate = `0 ${n.top}px`);
        break;
    }
  }
  syncTabsAndPanels() {
    (this.tabs = this.getAllTabs()),
      (this.focusableTabs = this.tabs.filter((t) => !t.disabled)),
      (this.panels = this.getAllPanels()),
      this.syncIndicator(),
      this.updateComplete.then(() => this.updateScrollControls());
  }
  findNextFocusableTab(t, e) {
    let i = null;
    const s = e === 'forward' ? 1 : -1;
    let o = t + s;
    for (; t < this.tabs.length; ) {
      if (((i = this.tabs[o] || null), i === null)) {
        e === 'forward' ? (i = this.focusableTabs[0]) : (i = this.focusableTabs[this.focusableTabs.length - 1]);
        break;
      }
      if (!i.disabled) break;
      o += s;
    }
    return i;
  }
  updateScrollButtons() {
    this.hasScrollControls &&
      !this.fixedScrollControls &&
      ((this.shouldHideScrollStartButton = this.scrollFromStart() <= this.scrollOffset),
      (this.shouldHideScrollEndButton = this.isScrolledToEnd()));
  }
  isScrolledToEnd() {
    return this.scrollFromStart() + this.nav.clientWidth >= this.nav.scrollWidth - this.scrollOffset;
  }
  scrollFromStart() {
    return this.localize.dir() === 'rtl' ? -this.nav.scrollLeft : this.nav.scrollLeft;
  }
  updateScrollControls() {
    this.noScrollControls
      ? (this.hasScrollControls = !1)
      : (this.hasScrollControls =
          ['top', 'bottom'].includes(this.placement) && this.nav.scrollWidth > this.nav.clientWidth + 1),
      this.updateScrollButtons();
  }
  syncIndicator() {
    this.getActiveTab()
      ? ((this.indicator.style.display = 'block'), this.repositionIndicator())
      : (this.indicator.style.display = 'none');
  }
  show(t) {
    const e = this.tabs.find((i) => i.panel === t);
    e && this.setActiveTab(e, { scrollBehavior: 'smooth' });
  }
  render() {
    const t = this.localize.dir() === 'rtl';
    return y`
      <div
        part="base"
        class=${I({ 'tab-group': !0, 'tab-group--top': this.placement === 'top', 'tab-group--bottom': this.placement === 'bottom', 'tab-group--start': this.placement === 'start', 'tab-group--end': this.placement === 'end', 'tab-group--rtl': this.localize.dir() === 'rtl', 'tab-group--has-scroll-controls': this.hasScrollControls })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${
            this.hasScrollControls
              ? y`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${I({ 'tab-group__scroll-button': !0, 'tab-group__scroll-button--start': !0, 'tab-group__scroll-button--start--hidden': this.shouldHideScrollStartButton })}
                  name=${t ? 'chevron-right' : 'chevron-left'}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term('scrollToStart')}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              `
              : ''
          }

          <div class="tab-group__nav" @scrollend=${this.updateScrollButtons}>
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <sl-resize-observer @sl-resize=${this.syncIndicator}>
                <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
              </sl-resize-observer>
            </div>
          </div>

          ${
            this.hasScrollControls
              ? y`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class=${I({ 'tab-group__scroll-button': !0, 'tab-group__scroll-button--end': !0, 'tab-group__scroll-button--end--hidden': this.shouldHideScrollEndButton })}
                  name=${t ? 'chevron-left' : 'chevron-right'}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term('scrollToEnd')}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              `
              : ''
          }
        </div>

        <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
      </div>
    `;
  }
};
ht.styles = [D, yn];
ht.dependencies = { 'sl-icon-button': at, 'sl-resize-observer': di };
r([k('.tab-group')], ht.prototype, 'tabGroup', 2);
r([k('.tab-group__body')], ht.prototype, 'body', 2);
r([k('.tab-group__nav')], ht.prototype, 'nav', 2);
r([k('.tab-group__indicator')], ht.prototype, 'indicator', 2);
r([L()], ht.prototype, 'hasScrollControls', 2);
r([L()], ht.prototype, 'shouldHideScrollStartButton', 2);
r([L()], ht.prototype, 'shouldHideScrollEndButton', 2);
r([l()], ht.prototype, 'placement', 2);
r([l()], ht.prototype, 'activation', 2);
r([l({ attribute: 'no-scroll-controls', type: Boolean })], ht.prototype, 'noScrollControls', 2);
r([l({ attribute: 'fixed-scroll-controls', type: Boolean })], ht.prototype, 'fixedScrollControls', 2);
r([oi({ passive: !0 })], ht.prototype, 'updateScrollButtons', 1);
r([x('noScrollControls', { waitUntilFirstUpdate: !0 })], ht.prototype, 'updateScrollControls', 1);
r([x('placement', { waitUntilFirstUpdate: !0 })], ht.prototype, 'syncIndicator', 1);
ht.define('sl-tab-group');
li.define('sl-spinner');
var Cn = T`
  :host {
    --divider-width: 4px;
    --divider-hit-area: 12px;
    --min: 0%;
    --max: 100%;

    display: grid;
  }

  .start,
  .end {
    overflow: hidden;
  }

  .divider {
    flex: 0 0 var(--divider-width);
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-900);
    z-index: 1;
  }

  .divider:focus {
    outline: none;
  }

  :host(:not([disabled])) .divider:focus-visible {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  :host([disabled]) .divider {
    cursor: not-allowed;
  }

  /* Horizontal */
  :host(:not([vertical], [disabled])) .divider {
    cursor: col-resize;
  }

  :host(:not([vertical])) .divider::after {
    display: flex;
    content: '';
    position: absolute;
    height: 100%;
    left: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    width: var(--divider-hit-area);
  }

  /* Vertical */
  :host([vertical]) {
    flex-direction: column;
  }

  :host([vertical]:not([disabled])) .divider {
    cursor: row-resize;
  }

  :host([vertical]) .divider::after {
    content: '';
    position: absolute;
    width: 100%;
    top: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    height: var(--divider-hit-area);
  }

  @media (forced-colors: active) {
    .divider {
      outline: solid 1px transparent;
    }
  }
`;
function Ge(t, e) {
  function i(o) {
    const a = t.getBoundingClientRect(),
      n = t.ownerDocument.defaultView,
      c = a.left + n.scrollX,
      d = a.top + n.scrollY,
      h = o.pageX - c,
      f = o.pageY - d;
    e != null && e.onMove && e.onMove(h, f);
  }
  function s() {
    document.removeEventListener('pointermove', i),
      document.removeEventListener('pointerup', s),
      e != null && e.onStop && e.onStop();
  }
  document.addEventListener('pointermove', i, { passive: !0 }),
    document.addEventListener('pointerup', s),
    (e == null ? void 0 : e.initialEvent) instanceof PointerEvent && i(e.initialEvent);
}
var eo = () => null,
  $t = class extends E {
    constructor() {
      super(...arguments),
        (this.isCollapsed = !1),
        (this.localize = new N(this)),
        (this.positionBeforeCollapsing = 0),
        (this.position = 50),
        (this.vertical = !1),
        (this.disabled = !1),
        (this.snapValue = ''),
        (this.snapFunction = eo),
        (this.snapThreshold = 12);
    }
    toSnapFunction(t) {
      const e = t.split(' ');
      return ({ pos: i, size: s, snapThreshold: o, isRtl: a, vertical: n }) => {
        let c = i,
          d = Number.POSITIVE_INFINITY;
        return (
          e.forEach((h) => {
            let f;
            if (h.startsWith('repeat(')) {
              const p = t.substring(7, t.length - 1),
                m = p.endsWith('%'),
                g = Number.parseFloat(p),
                b = m ? s * (g / 100) : g;
              f = Math.round((a && !n ? s - i : i) / b) * b;
            } else h.endsWith('%') ? (f = s * (Number.parseFloat(h) / 100)) : (f = Number.parseFloat(h));
            a && !n && (f = s - f);
            const u = Math.abs(i - f);
            u <= o && u < d && ((c = f), (d = u));
          }),
          c
        );
      };
    }
    set snap(t) {
      (this.snapValue = t ?? ''),
        t ? (this.snapFunction = typeof t == 'string' ? this.toSnapFunction(t) : t) : (this.snapFunction = eo);
    }
    get snap() {
      return this.snapValue;
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.resizeObserver = new ResizeObserver((t) => this.handleResize(t))),
        this.updateComplete.then(() => this.resizeObserver.observe(this)),
        this.detectSize(),
        (this.cachedPositionInPixels = this.percentageToPixels(this.position));
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(), (t = this.resizeObserver) == null || t.unobserve(this);
    }
    detectSize() {
      const { width: t, height: e } = this.getBoundingClientRect();
      this.size = this.vertical ? e : t;
    }
    percentageToPixels(t) {
      return this.size * (t / 100);
    }
    pixelsToPercentage(t) {
      return (t / this.size) * 100;
    }
    handleDrag(t) {
      const e = this.localize.dir() === 'rtl';
      this.disabled ||
        (t.cancelable && t.preventDefault(),
        Ge(this, {
          onMove: (i, s) => {
            var o;
            let a = this.vertical ? s : i;
            this.primary === 'end' && (a = this.size - a),
              (a =
                (o = this.snapFunction({
                  pos: a,
                  size: this.size,
                  snapThreshold: this.snapThreshold,
                  isRtl: e,
                  vertical: this.vertical,
                })) != null
                  ? o
                  : a),
              (this.position = it(this.pixelsToPercentage(a), 0, 100));
          },
          initialEvent: t,
        }));
    }
    handleKeyDown(t) {
      if (
        !this.disabled &&
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(t.key)
      ) {
        let e = this.position;
        const i = (t.shiftKey ? 10 : 1) * (this.primary === 'end' ? -1 : 1);
        if (
          (t.preventDefault(),
          ((t.key === 'ArrowLeft' && !this.vertical) || (t.key === 'ArrowUp' && this.vertical)) && (e -= i),
          ((t.key === 'ArrowRight' && !this.vertical) || (t.key === 'ArrowDown' && this.vertical)) && (e += i),
          t.key === 'Home' && (e = this.primary === 'end' ? 100 : 0),
          t.key === 'End' && (e = this.primary === 'end' ? 0 : 100),
          t.key === 'Enter')
        )
          if (this.isCollapsed) (e = this.positionBeforeCollapsing), (this.isCollapsed = !1);
          else {
            const s = this.position;
            (e = 0),
              requestAnimationFrame(() => {
                (this.isCollapsed = !0), (this.positionBeforeCollapsing = s);
              });
          }
        this.position = it(e, 0, 100);
      }
    }
    handleResize(t) {
      const { width: e, height: i } = t[0].contentRect;
      (this.size = this.vertical ? i : e),
        (isNaN(this.cachedPositionInPixels) || this.position === 1 / 0) &&
          ((this.cachedPositionInPixels = Number(this.getAttribute('position-in-pixels'))),
          (this.positionInPixels = Number(this.getAttribute('position-in-pixels'))),
          (this.position = this.pixelsToPercentage(this.positionInPixels))),
        this.primary && (this.position = this.pixelsToPercentage(this.cachedPositionInPixels));
    }
    handlePositionChange() {
      (this.cachedPositionInPixels = this.percentageToPixels(this.position)),
        (this.isCollapsed = !1),
        (this.positionBeforeCollapsing = 0),
        (this.positionInPixels = this.percentageToPixels(this.position)),
        this.emit('sl-reposition');
    }
    handlePositionInPixelsChange() {
      this.position = this.pixelsToPercentage(this.positionInPixels);
    }
    handleVerticalChange() {
      this.detectSize();
    }
    render() {
      const t = this.vertical ? 'gridTemplateRows' : 'gridTemplateColumns',
        e = this.vertical ? 'gridTemplateColumns' : 'gridTemplateRows',
        i = this.localize.dir() === 'rtl',
        s = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,
        o = 'auto';
      return (
        this.primary === 'end'
          ? i && !this.vertical
            ? (this.style[t] = `${s} var(--divider-width) ${o}`)
            : (this.style[t] = `${o} var(--divider-width) ${s}`)
          : i && !this.vertical
            ? (this.style[t] = `${o} var(--divider-width) ${s}`)
            : (this.style[t] = `${s} var(--divider-width) ${o}`),
        (this.style[e] = ''),
        y`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${z(this.disabled ? void 0 : '0')}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term('resize')}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `
      );
    }
  };
$t.styles = [D, Cn];
r([k('.divider')], $t.prototype, 'divider', 2);
r([l({ type: Number, reflect: !0 })], $t.prototype, 'position', 2);
r([l({ attribute: 'position-in-pixels', type: Number })], $t.prototype, 'positionInPixels', 2);
r([l({ type: Boolean, reflect: !0 })], $t.prototype, 'vertical', 2);
r([l({ type: Boolean, reflect: !0 })], $t.prototype, 'disabled', 2);
r([l()], $t.prototype, 'primary', 2);
r([l({ reflect: !0 })], $t.prototype, 'snap', 1);
r([l({ type: Number, attribute: 'snap-threshold' })], $t.prototype, 'snapThreshold', 2);
r([x('position')], $t.prototype, 'handlePositionChange', 1);
r([x('positionInPixels')], $t.prototype, 'handlePositionInPixelsChange', 1);
r([x('vertical')], $t.prototype, 'handleVerticalChange', 1);
$t.define('sl-split-panel');
var $n = T`
  :host {
    display: inline-block;
  }

  :host([size='small']) {
    --height: var(--sl-toggle-size-small);
    --thumb-size: calc(var(--sl-toggle-size-small) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-small);
  }

  :host([size='medium']) {
    --height: var(--sl-toggle-size-medium);
    --thumb-size: calc(var(--sl-toggle-size-medium) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-medium);
  }

  :host([size='large']) {
    --height: var(--sl-toggle-size-large);
    --thumb-size: calc(var(--sl-toggle-size-large) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-large);
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-input-font-family);
    font-size: inherit;
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--sl-color-neutral-400);
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    border-radius: var(--height);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: 50%;
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    translate: calc((var(--width) - var(--height)) / -2);
    transition:
      var(--sl-transition-fast) translate ease,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-400);
  }

  /* Focus */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch__label {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .switch__label::after {
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }
`,
  mt = class extends E {
    constructor() {
      super(...arguments),
        (this.formControlController = new Zt(this, {
          value: (t) => (t.checked ? t.value || 'on' : void 0),
          defaultValue: (t) => t.defaultChecked,
          setValue: (t, e) => (t.checked = e),
        })),
        (this.hasSlotController = new vt(this, 'help-text')),
        (this.hasFocus = !1),
        (this.title = ''),
        (this.name = ''),
        (this.size = 'medium'),
        (this.disabled = !1),
        (this.checked = !1),
        (this.defaultChecked = !1),
        (this.form = ''),
        (this.required = !1),
        (this.helpText = '');
    }
    get validity() {
      return this.input.validity;
    }
    get validationMessage() {
      return this.input.validationMessage;
    }
    firstUpdated() {
      this.formControlController.updateValidity();
    }
    handleBlur() {
      (this.hasFocus = !1), this.emit('sl-blur');
    }
    handleInput() {
      this.emit('sl-input');
    }
    handleInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    handleClick() {
      (this.checked = !this.checked), this.emit('sl-change');
    }
    handleFocus() {
      (this.hasFocus = !0), this.emit('sl-focus');
    }
    handleKeyDown(t) {
      t.key === 'ArrowLeft' && (t.preventDefault(), (this.checked = !1), this.emit('sl-change'), this.emit('sl-input')),
        t.key === 'ArrowRight' &&
          (t.preventDefault(), (this.checked = !0), this.emit('sl-change'), this.emit('sl-input'));
    }
    handleCheckedChange() {
      (this.input.checked = this.checked), this.formControlController.updateValidity();
    }
    handleDisabledChange() {
      this.formControlController.setValidity(!0);
    }
    click() {
      this.input.click();
    }
    focus(t) {
      this.input.focus(t);
    }
    blur() {
      this.input.blur();
    }
    checkValidity() {
      return this.input.checkValidity();
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return this.input.reportValidity();
    }
    setCustomValidity(t) {
      this.input.setCustomValidity(t), this.formControlController.updateValidity();
    }
    render() {
      const t = this.hasSlotController.test('help-text'),
        e = this.helpText ? !0 : !!t;
      return y`
      <div
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-help-text': e })}
      >
        <label
          part="base"
          class=${I({ switch: !0, 'switch--checked': this.checked, 'switch--disabled': this.disabled, 'switch--focused': this.hasFocus, 'switch--small': this.size === 'small', 'switch--medium': this.size === 'medium', 'switch--large': this.size === 'large' })}
        >
          <input
            class="switch__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${z(this.value)}
            .checked=${be(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            role="switch"
            aria-checked=${this.checked ? 'true' : 'false'}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          />

          <span part="control" class="switch__control">
            <span part="thumb" class="switch__thumb"></span>
          </span>

          <div part="label" class="switch__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${e ? 'false' : 'true'}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
    }
  };
mt.styles = [D, ve, $n];
r([k('input[type="checkbox"]')], mt.prototype, 'input', 2);
r([L()], mt.prototype, 'hasFocus', 2);
r([l()], mt.prototype, 'title', 2);
r([l()], mt.prototype, 'name', 2);
r([l()], mt.prototype, 'value', 2);
r([l({ reflect: !0 })], mt.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], mt.prototype, 'disabled', 2);
r([l({ type: Boolean, reflect: !0 })], mt.prototype, 'checked', 2);
r([Ie('checked')], mt.prototype, 'defaultChecked', 2);
r([l({ reflect: !0 })], mt.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], mt.prototype, 'required', 2);
r([l({ attribute: 'help-text' })], mt.prototype, 'helpText', 2);
r([x('checked', { waitUntilFirstUpdate: !0 })], mt.prototype, 'handleCheckedChange', 1);
r([x('disabled', { waitUntilFirstUpdate: !0 })], mt.prototype, 'handleDisabledChange', 1);
mt.define('sl-switch');
di.define('sl-resize-observer');
var Sn = T`
  :host {
    display: block;
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--sl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select__display-input::placeholder {
    color: var(--sl-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--sl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--sl-spacing-2x-small);
  }

  .select__tags::slotted(sl-tag) {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags::slotted(sl-tag) {
    cursor: not-allowed !important;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-small);
  }

  .select--small .select__clear {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-block: 2px;
    padding-inline-start: 0;
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 3px;
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-large);
  }

  .select--large .select__clear {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 4px;
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--sl-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--sl-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--sl-input-height-large);
  }

  /* Prefix and Suffix */
  .select__prefix,
  .select__suffix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--sl-input-placeholder-color);
  }

  .select__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-small);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .select__clear:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--sl-spacing-small);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: 0;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .select__listbox ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }

  .select__listbox ::slotted(small) {
    display: block;
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-500);
    padding-block: var(--sl-spacing-2x-small);
    padding-inline: var(--sl-spacing-x-large);
  }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ let cs = class extends ni {
  constructor(e) {
    if ((super(e), (this.it = K), e.type !== Ut.CHILD))
      throw Error(this.constructor.directiveName + '() can only be used in child bindings');
  }
  render(e) {
    if (e === K || e == null) return (this._t = void 0), (this.it = e);
    if (e === kt) return e;
    if (typeof e != 'string') throw Error(this.constructor.directiveName + '() called with a non-string value');
    if (e === this.it) return this._t;
    this.it = e;
    const i = [e];
    return (i.raw = i), (this._t = { _$litType$: this.constructor.resultType, strings: i, values: [] });
  }
};
(cs.directiveName = 'unsafeHTML'), (cs.resultType = 1);
const ki = ai(cs);
var B = class extends E {
  constructor() {
    super(...arguments),
      (this.formControlController = new Zt(this, { assumeInteractionOn: ['sl-blur', 'sl-input'] })),
      (this.hasSlotController = new vt(this, 'help-text', 'label')),
      (this.localize = new N(this)),
      (this.typeToSelectString = ''),
      (this.hasFocus = !1),
      (this.displayLabel = ''),
      (this.selectedOptions = []),
      (this.valueHasChanged = !1),
      (this.name = ''),
      (this._value = ''),
      (this.defaultValue = ''),
      (this.size = 'medium'),
      (this.placeholder = ''),
      (this.multiple = !1),
      (this.maxOptionsVisible = 3),
      (this.disabled = !1),
      (this.clearable = !1),
      (this.open = !1),
      (this.hoist = !1),
      (this.filled = !1),
      (this.pill = !1),
      (this.label = ''),
      (this.placement = 'bottom'),
      (this.helpText = ''),
      (this.form = ''),
      (this.required = !1),
      (this.getTag = (t) => y`
      <sl-tag
        part="tag"
        exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button,
              remove-button__base:tag__remove-button__base
            "
        ?pill=${this.pill}
        size=${this.size}
        removable
        @sl-remove=${(e) => this.handleTagRemove(e, t)}
      >
        ${t.getTextLabel()}
      </sl-tag>
    `),
      (this.handleDocumentFocusIn = (t) => {
        const e = t.composedPath();
        this && !e.includes(this) && this.hide();
      }),
      (this.handleDocumentKeyDown = (t) => {
        const e = t.target,
          i = e.closest('.select__clear') !== null,
          s = e.closest('sl-icon-button') !== null;
        if (!(i || s)) {
          if (
            (t.key === 'Escape' &&
              this.open &&
              !this.closeWatcher &&
              (t.preventDefault(), t.stopPropagation(), this.hide(), this.displayInput.focus({ preventScroll: !0 })),
            t.key === 'Enter' || (t.key === ' ' && this.typeToSelectString === ''))
          ) {
            if ((t.preventDefault(), t.stopImmediatePropagation(), !this.open)) {
              this.show();
              return;
            }
            this.currentOption &&
              !this.currentOption.disabled &&
              ((this.valueHasChanged = !0),
              this.multiple
                ? this.toggleOptionSelection(this.currentOption)
                : this.setSelectedOptions(this.currentOption),
              this.updateComplete.then(() => {
                this.emit('sl-input'), this.emit('sl-change');
              }),
              this.multiple || (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
            return;
          }
          if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(t.key)) {
            const o = this.getAllOptions(),
              a = o.indexOf(this.currentOption);
            let n = Math.max(0, a);
            if ((t.preventDefault(), !this.open && (this.show(), this.currentOption))) return;
            t.key === 'ArrowDown'
              ? ((n = a + 1), n > o.length - 1 && (n = 0))
              : t.key === 'ArrowUp'
                ? ((n = a - 1), n < 0 && (n = o.length - 1))
                : t.key === 'Home'
                  ? (n = 0)
                  : t.key === 'End' && (n = o.length - 1),
              this.setCurrentOption(o[n]);
          }
          if ((t.key && t.key.length === 1) || t.key === 'Backspace') {
            const o = this.getAllOptions();
            if (t.metaKey || t.ctrlKey || t.altKey) return;
            if (!this.open) {
              if (t.key === 'Backspace') return;
              this.show();
            }
            t.stopPropagation(),
              t.preventDefault(),
              clearTimeout(this.typeToSelectTimeout),
              (this.typeToSelectTimeout = window.setTimeout(() => (this.typeToSelectString = ''), 1e3)),
              t.key === 'Backspace'
                ? (this.typeToSelectString = this.typeToSelectString.slice(0, -1))
                : (this.typeToSelectString += t.key.toLowerCase());
            for (const a of o)
              if (a.getTextLabel().toLowerCase().startsWith(this.typeToSelectString)) {
                this.setCurrentOption(a);
                break;
              }
          }
        }
      }),
      (this.handleDocumentMouseDown = (t) => {
        const e = t.composedPath();
        this && !e.includes(this) && this.hide();
      });
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.multiple ? (t = Array.isArray(t) ? t : t.split(' ')) : (t = Array.isArray(t) ? t.join(' ') : t),
      this._value !== t && ((this.valueHasChanged = !0), (this._value = t));
  }
  get validity() {
    return this.valueInput.validity;
  }
  get validationMessage() {
    return this.valueInput.validationMessage;
  }
  connectedCallback() {
    super.connectedCallback(),
      setTimeout(() => {
        this.handleDefaultSlotChange();
      }),
      (this.open = !1);
  }
  addOpenListeners() {
    var t;
    document.addEventListener('focusin', this.handleDocumentFocusIn),
      document.addEventListener('keydown', this.handleDocumentKeyDown),
      document.addEventListener('mousedown', this.handleDocumentMouseDown),
      this.getRootNode() !== document && this.getRootNode().addEventListener('focusin', this.handleDocumentFocusIn),
      'CloseWatcher' in window &&
        ((t = this.closeWatcher) == null || t.destroy(),
        (this.closeWatcher = new CloseWatcher()),
        (this.closeWatcher.onclose = () => {
          this.open && (this.hide(), this.displayInput.focus({ preventScroll: !0 }));
        }));
  }
  removeOpenListeners() {
    var t;
    document.removeEventListener('focusin', this.handleDocumentFocusIn),
      document.removeEventListener('keydown', this.handleDocumentKeyDown),
      document.removeEventListener('mousedown', this.handleDocumentMouseDown),
      this.getRootNode() !== document && this.getRootNode().removeEventListener('focusin', this.handleDocumentFocusIn),
      (t = this.closeWatcher) == null || t.destroy();
  }
  handleFocus() {
    (this.hasFocus = !0), this.displayInput.setSelectionRange(0, 0), this.emit('sl-focus');
  }
  handleBlur() {
    (this.hasFocus = !1), this.emit('sl-blur');
  }
  handleLabelClick() {
    this.displayInput.focus();
  }
  handleComboboxMouseDown(t) {
    const i = t.composedPath().some((s) => s instanceof Element && s.tagName.toLowerCase() === 'sl-icon-button');
    this.disabled ||
      i ||
      (t.preventDefault(), this.displayInput.focus({ preventScroll: !0 }), (this.open = !this.open));
  }
  handleComboboxKeyDown(t) {
    t.key !== 'Tab' && (t.stopPropagation(), this.handleDocumentKeyDown(t));
  }
  handleClearClick(t) {
    t.stopPropagation(),
      (this.valueHasChanged = !0),
      this.value !== '' &&
        (this.setSelectedOptions([]),
        this.displayInput.focus({ preventScroll: !0 }),
        this.updateComplete.then(() => {
          this.emit('sl-clear'), this.emit('sl-input'), this.emit('sl-change');
        }));
  }
  handleClearMouseDown(t) {
    t.stopPropagation(), t.preventDefault();
  }
  handleOptionClick(t) {
    const i = t.target.closest('sl-option'),
      s = this.value;
    i &&
      !i.disabled &&
      ((this.valueHasChanged = !0),
      this.multiple ? this.toggleOptionSelection(i) : this.setSelectedOptions(i),
      this.updateComplete.then(() => this.displayInput.focus({ preventScroll: !0 })),
      this.value !== s &&
        this.updateComplete.then(() => {
          this.emit('sl-input'), this.emit('sl-change');
        }),
      this.multiple || (this.hide(), this.displayInput.focus({ preventScroll: !0 })));
  }
  handleDefaultSlotChange() {
    customElements.get('sl-option') ||
      customElements.whenDefined('sl-option').then(() => this.handleDefaultSlotChange());
    const t = this.getAllOptions(),
      e = this.valueHasChanged ? this.value : this.defaultValue,
      i = Array.isArray(e) ? e : [e],
      s = [];
    t.forEach((o) => s.push(o.value)), this.setSelectedOptions(t.filter((o) => i.includes(o.value)));
  }
  handleTagRemove(t, e) {
    t.stopPropagation(),
      (this.valueHasChanged = !0),
      this.disabled ||
        (this.toggleOptionSelection(e, !1),
        this.updateComplete.then(() => {
          this.emit('sl-input'), this.emit('sl-change');
        }));
  }
  getAllOptions() {
    return [...this.querySelectorAll('sl-option')];
  }
  getFirstOption() {
    return this.querySelector('sl-option');
  }
  setCurrentOption(t) {
    this.getAllOptions().forEach((i) => {
      (i.current = !1), (i.tabIndex = -1);
    }),
      t && ((this.currentOption = t), (t.current = !0), (t.tabIndex = 0), t.focus());
  }
  setSelectedOptions(t) {
    const e = this.getAllOptions(),
      i = Array.isArray(t) ? t : [t];
    e.forEach((s) => (s.selected = !1)), i.length && i.forEach((s) => (s.selected = !0)), this.selectionChanged();
  }
  toggleOptionSelection(t, e) {
    e === !0 || e === !1 ? (t.selected = e) : (t.selected = !t.selected), this.selectionChanged();
  }
  selectionChanged() {
    var t, e, i;
    const s = this.getAllOptions();
    this.selectedOptions = s.filter((a) => a.selected);
    const o = this.valueHasChanged;
    if (this.multiple)
      (this.value = this.selectedOptions.map((a) => a.value)),
        this.placeholder && this.value.length === 0
          ? (this.displayLabel = '')
          : (this.displayLabel = this.localize.term('numOptionsSelected', this.selectedOptions.length));
    else {
      const a = this.selectedOptions[0];
      (this.value = (t = a == null ? void 0 : a.value) != null ? t : ''),
        (this.displayLabel =
          (i = (e = a == null ? void 0 : a.getTextLabel) == null ? void 0 : e.call(a)) != null ? i : '');
    }
    (this.valueHasChanged = o),
      this.updateComplete.then(() => {
        this.formControlController.updateValidity();
      });
  }
  get tags() {
    return this.selectedOptions.map((t, e) => {
      if (e < this.maxOptionsVisible || this.maxOptionsVisible <= 0) {
        const i = this.getTag(t, e);
        return y`<div @sl-remove=${(s) => this.handleTagRemove(s, t)}>
          ${typeof i == 'string' ? ki(i) : i}
        </div>`;
      } else if (e === this.maxOptionsVisible)
        return y`<sl-tag size=${this.size}>+${this.selectedOptions.length - e}</sl-tag>`;
      return y``;
    });
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  handleDisabledChange() {
    this.disabled && ((this.open = !1), this.handleOpenChange());
  }
  attributeChangedCallback(t, e, i) {
    if ((super.attributeChangedCallback(t, e, i), t === 'value')) {
      const s = this.valueHasChanged;
      (this.value = this.defaultValue), (this.valueHasChanged = s);
    }
  }
  handleValueChange() {
    if (!this.valueHasChanged) {
      const i = this.valueHasChanged;
      (this.value = this.defaultValue), (this.valueHasChanged = i);
    }
    const t = this.getAllOptions(),
      e = Array.isArray(this.value) ? this.value : [this.value];
    this.setSelectedOptions(t.filter((i) => e.includes(i.value)));
  }
  async handleOpenChange() {
    if (this.open && !this.disabled) {
      this.setCurrentOption(this.selectedOptions[0] || this.getFirstOption()),
        this.emit('sl-show'),
        this.addOpenListeners(),
        await st(this),
        (this.listbox.hidden = !1),
        (this.popup.active = !0),
        requestAnimationFrame(() => {
          this.setCurrentOption(this.currentOption);
        });
      const { keyframes: t, options: e } = Y(this, 'select.show', { dir: this.localize.dir() });
      await Q(this.popup.popup, t, e),
        this.currentOption && ls(this.currentOption, this.listbox, 'vertical', 'auto'),
        this.emit('sl-after-show');
    } else {
      this.emit('sl-hide'), this.removeOpenListeners(), await st(this);
      const { keyframes: t, options: e } = Y(this, 'select.hide', { dir: this.localize.dir() });
      await Q(this.popup.popup, t, e), (this.listbox.hidden = !0), (this.popup.active = !1), this.emit('sl-after-hide');
    }
  }
  async show() {
    if (this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return (this.open = !0), bt(this, 'sl-after-show');
  }
  async hide() {
    if (!this.open || this.disabled) {
      this.open = !1;
      return;
    }
    return (this.open = !1), bt(this, 'sl-after-hide');
  }
  checkValidity() {
    return this.valueInput.checkValidity();
  }
  getForm() {
    return this.formControlController.getForm();
  }
  reportValidity() {
    return this.valueInput.reportValidity();
  }
  setCustomValidity(t) {
    this.valueInput.setCustomValidity(t), this.formControlController.updateValidity();
  }
  focus(t) {
    this.displayInput.focus(t);
  }
  blur() {
    this.displayInput.blur();
  }
  render() {
    const t = this.hasSlotController.test('label'),
      e = this.hasSlotController.test('help-text'),
      i = this.label ? !0 : !!t,
      s = this.helpText ? !0 : !!e,
      o = this.clearable && !this.disabled && this.value.length > 0,
      a = this.placeholder && this.value && this.value.length <= 0;
    return y`
      <div
        part="form-control"
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-label': i, 'form-control--has-help-text': s })}
      >
        <label
          id="label"
          part="form-control-label"
          class="form-control__label"
          aria-hidden=${i ? 'false' : 'true'}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-popup
            class=${I({ select: !0, 'select--standard': !0, 'select--filled': this.filled, 'select--pill': this.pill, 'select--open': this.open, 'select--disabled': this.disabled, 'select--multiple': this.multiple, 'select--focused': this.hasFocus, 'select--placeholder-visible': a, 'select--top': this.placement === 'top', 'select--bottom': this.placement === 'bottom', 'select--small': this.size === 'small', 'select--medium': this.size === 'medium', 'select--large': this.size === 'large' })}
            placement=${this.placement}
            strategy=${this.hoist ? 'fixed' : 'absolute'}
            flip
            shift
            sync="width"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div
              part="combobox"
              class="select__combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                class="select__display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open ? 'true' : 'false'}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled ? 'true' : 'false'}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              />

              ${this.multiple ? y`<div part="tags" class="select__tags">${this.tags}</div>` : ''}

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value) ? this.value.join(', ') : this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${() => this.focus()}
                @invalid=${this.handleInvalid}
              />

              ${
                o
                  ? y`
                    <button
                      part="clear-button"
                      class="select__clear"
                      type="button"
                      aria-label=${this.localize.term('clearEntry')}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  `
                  : ''
              }

              <slot name="suffix" part="suffix" class="select__suffix"></slot>

              <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
                <sl-icon library="system" name="chevron-down"></sl-icon>
              </slot>
            </div>

            <div
              id="listbox"
              role="listbox"
              aria-expanded=${this.open ? 'true' : 'false'}
              aria-multiselectable=${this.multiple ? 'true' : 'false'}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              @slotchange=${this.handleDefaultSlotChange}
            >
              <slot></slot>
            </div>
          </sl-popup>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
B.styles = [D, ve, Sn];
B.dependencies = { 'sl-icon': j, 'sl-popup': U, 'sl-tag': ne };
r([k('.select')], B.prototype, 'popup', 2);
r([k('.select__combobox')], B.prototype, 'combobox', 2);
r([k('.select__display-input')], B.prototype, 'displayInput', 2);
r([k('.select__value-input')], B.prototype, 'valueInput', 2);
r([k('.select__listbox')], B.prototype, 'listbox', 2);
r([L()], B.prototype, 'hasFocus', 2);
r([L()], B.prototype, 'displayLabel', 2);
r([L()], B.prototype, 'currentOption', 2);
r([L()], B.prototype, 'selectedOptions', 2);
r([L()], B.prototype, 'valueHasChanged', 2);
r([l()], B.prototype, 'name', 2);
r([L()], B.prototype, 'value', 1);
r([l({ attribute: 'value' })], B.prototype, 'defaultValue', 2);
r([l({ reflect: !0 })], B.prototype, 'size', 2);
r([l()], B.prototype, 'placeholder', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'multiple', 2);
r([l({ attribute: 'max-options-visible', type: Number })], B.prototype, 'maxOptionsVisible', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'disabled', 2);
r([l({ type: Boolean })], B.prototype, 'clearable', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'open', 2);
r([l({ type: Boolean })], B.prototype, 'hoist', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'filled', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'pill', 2);
r([l()], B.prototype, 'label', 2);
r([l({ reflect: !0 })], B.prototype, 'placement', 2);
r([l({ attribute: 'help-text' })], B.prototype, 'helpText', 2);
r([l({ reflect: !0 })], B.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], B.prototype, 'required', 2);
r([l()], B.prototype, 'getTag', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], B.prototype, 'handleDisabledChange', 1);
r([x(['defaultValue', 'value'], { waitUntilFirstUpdate: !0 })], B.prototype, 'handleValueChange', 1);
r([x('open', { waitUntilFirstUpdate: !0 })], B.prototype, 'handleOpenChange', 1);
q('select.show', {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 100, easing: 'ease' },
});
q('select.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 },
  ],
  options: { duration: 100, easing: 'ease' },
});
B.define('sl-select');
var zn = T`
  :host {
    --border-radius: var(--sl-border-radius-pill);
    --color: var(--sl-color-neutral-200);
    --sheen-color: var(--sl-color-neutral-300);

    display: block;
    position: relative;
  }

  .skeleton {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 1rem;
  }

  .skeleton__indicator {
    flex: 1 1 auto;
    background: var(--color);
    border-radius: var(--border-radius);
  }

  .skeleton--sheen .skeleton__indicator {
    background: linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));
    background-size: 400% 100%;
    animation: sheen 8s ease-in-out infinite;
  }

  .skeleton--pulse .skeleton__indicator {
    animation: pulse 2s ease-in-out 0.5s infinite;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    :host {
      --color: GrayText;
    }
  }

  @keyframes sheen {
    0% {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`,
  Ss = class extends E {
    constructor() {
      super(...arguments), (this.effect = 'none');
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ skeleton: !0, 'skeleton--pulse': this.effect === 'pulse', 'skeleton--sheen': this.effect === 'sheen' })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
    }
  };
Ss.styles = [D, zn];
r([l()], Ss.prototype, 'effect', 2);
Ss.define('sl-skeleton');
var En = T`
  :host {
    --thumb-size: 20px;
    --tooltip-offset: 10px;
    --track-color-active: var(--sl-color-neutral-200);
    --track-color-inactive: var(--sl-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
  }

  .range__control {
    --percent: 0%;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--sl-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    border: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border: solid var(--sl-input-border-width) var(--sl-color-primary-600);
    -webkit-appearance: none;
    margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);
    cursor: pointer;
  }

  .range__control:enabled::-webkit-slider-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-webkit-slider-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-webkit-slider-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    border: none;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
    cursor: pointer;
  }

  .range__control:enabled::-moz-range-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-moz-range-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-moz-range-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }

  /* Tooltip output */
  .range__tooltip {
    position: absolute;
    z-index: var(--sl-z-index-tooltip);
    left: 0;
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    color: var(--sl-tooltip-color);
    opacity: 0;
    padding: var(--sl-tooltip-padding);
    transition: var(--sl-transition-fast) opacity;
    pointer-events: none;
  }

  .range__tooltip:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    translate: calc(-1 * var(--sl-tooltip-arrow-size));
  }

  .range--tooltip-visible .range__tooltip {
    opacity: 1;
  }

  /* Tooltip on top */
  .range--tooltip-top .range__tooltip {
    top: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-top .range__tooltip:after {
    border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    top: 100%;
  }

  /* Tooltip on bottom */
  .range--tooltip-bottom .range__tooltip {
    bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-bottom .range__tooltip:after {
    border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    bottom: 100%;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__tooltip {
      border: solid 1px transparent;
    }

    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }

    .range__tooltip:after {
      display: none;
    }
  }
`,
  X = class extends E {
    constructor() {
      super(...arguments),
        (this.formControlController = new Zt(this)),
        (this.hasSlotController = new vt(this, 'help-text', 'label')),
        (this.localize = new N(this)),
        (this.hasFocus = !1),
        (this.hasTooltip = !1),
        (this.title = ''),
        (this.name = ''),
        (this.value = 0),
        (this.label = ''),
        (this.helpText = ''),
        (this.disabled = !1),
        (this.min = 0),
        (this.max = 100),
        (this.step = 1),
        (this.tooltip = 'top'),
        (this.tooltipFormatter = (t) => t.toString()),
        (this.form = ''),
        (this.defaultValue = 0);
    }
    get validity() {
      return this.input.validity;
    }
    get validationMessage() {
      return this.input.validationMessage;
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.resizeObserver = new ResizeObserver(() => this.syncRange())),
        this.value < this.min && (this.value = this.min),
        this.value > this.max && (this.value = this.max),
        this.updateComplete.then(() => {
          this.syncRange(), this.resizeObserver.observe(this.input);
        });
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(), (t = this.resizeObserver) == null || t.unobserve(this.input);
    }
    handleChange() {
      this.emit('sl-change');
    }
    handleInput() {
      (this.value = parseFloat(this.input.value)), this.emit('sl-input'), this.syncRange();
    }
    handleBlur() {
      (this.hasFocus = !1), (this.hasTooltip = !1), this.emit('sl-blur');
    }
    handleFocus() {
      (this.hasFocus = !0), (this.hasTooltip = !0), this.emit('sl-focus');
    }
    handleThumbDragStart() {
      this.hasTooltip = !0;
    }
    handleThumbDragEnd() {
      this.hasTooltip = !1;
    }
    syncProgress(t) {
      this.input.style.setProperty('--percent', `${t * 100}%`);
    }
    syncTooltip(t) {
      if (this.output !== null) {
        const e = this.input.offsetWidth,
          i = this.output.offsetWidth,
          s = getComputedStyle(this.input).getPropertyValue('--thumb-size'),
          o = this.localize.dir() === 'rtl',
          a = e * t;
        if (o) {
          const n = `${e - a}px + ${t} * ${s}`;
          this.output.style.translate = `calc((${n} - ${i / 2}px - ${s} / 2))`;
        } else {
          const n = `${a}px - ${t} * ${s}`;
          this.output.style.translate = `calc(${n} - ${i / 2}px + ${s} / 2)`;
        }
      }
    }
    handleValueChange() {
      this.formControlController.updateValidity(),
        (this.input.value = this.value.toString()),
        (this.value = parseFloat(this.input.value)),
        this.syncRange();
    }
    handleDisabledChange() {
      this.formControlController.setValidity(this.disabled);
    }
    syncRange() {
      const t = Math.max(0, (this.value - this.min) / (this.max - this.min));
      this.syncProgress(t),
        this.tooltip !== 'none' && this.hasTooltip && this.updateComplete.then(() => this.syncTooltip(t));
    }
    handleInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    focus(t) {
      this.input.focus(t);
    }
    blur() {
      this.input.blur();
    }
    stepUp() {
      this.input.stepUp(), this.value !== Number(this.input.value) && (this.value = Number(this.input.value));
    }
    stepDown() {
      this.input.stepDown(), this.value !== Number(this.input.value) && (this.value = Number(this.input.value));
    }
    checkValidity() {
      return this.input.checkValidity();
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return this.input.reportValidity();
    }
    setCustomValidity(t) {
      this.input.setCustomValidity(t), this.formControlController.updateValidity();
    }
    render() {
      const t = this.hasSlotController.test('label'),
        e = this.hasSlotController.test('help-text'),
        i = this.label ? !0 : !!t,
        s = this.helpText ? !0 : !!e;
      return y`
      <div
        part="form-control"
        class=${I({ 'form-control': !0, 'form-control--medium': !0, 'form-control--has-label': i, 'form-control--has-help-text': s })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${i ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${I({ range: !0, 'range--disabled': this.disabled, 'range--focused': this.hasFocus, 'range--rtl': this.localize.dir() === 'rtl', 'range--tooltip-visible': this.hasTooltip, 'range--tooltip-top': this.tooltip === 'top', 'range--tooltip-bottom': this.tooltip === 'bottom' })}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title}
              type="range"
              name=${z(this.name)}
              ?disabled=${this.disabled}
              min=${z(this.min)}
              max=${z(this.max)}
              step=${z(this.step)}
              .value=${be(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${
              this.tooltip !== 'none' && !this.disabled
                ? y`
                  <output part="tooltip" class="range__tooltip">
                    ${typeof this.tooltipFormatter == 'function' ? this.tooltipFormatter(this.value) : this.value}
                  </output>
                `
                : ''
            }
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
    }
  };
X.styles = [D, ve, En];
r([k('.range__control')], X.prototype, 'input', 2);
r([k('.range__tooltip')], X.prototype, 'output', 2);
r([L()], X.prototype, 'hasFocus', 2);
r([L()], X.prototype, 'hasTooltip', 2);
r([l()], X.prototype, 'title', 2);
r([l()], X.prototype, 'name', 2);
r([l({ type: Number })], X.prototype, 'value', 2);
r([l()], X.prototype, 'label', 2);
r([l({ attribute: 'help-text' })], X.prototype, 'helpText', 2);
r([l({ type: Boolean, reflect: !0 })], X.prototype, 'disabled', 2);
r([l({ type: Number })], X.prototype, 'min', 2);
r([l({ type: Number })], X.prototype, 'max', 2);
r([l({ type: Number })], X.prototype, 'step', 2);
r([l()], X.prototype, 'tooltip', 2);
r([l({ attribute: !1 })], X.prototype, 'tooltipFormatter', 2);
r([l({ reflect: !0 })], X.prototype, 'form', 2);
r([Ie()], X.prototype, 'defaultValue', 2);
r([oi({ passive: !0 })], X.prototype, 'handleThumbDragStart', 1);
r([x('value', { waitUntilFirstUpdate: !0 })], X.prototype, 'handleValueChange', 1);
r([x('disabled', { waitUntilFirstUpdate: !0 })], X.prototype, 'handleDisabledChange', 1);
r([x('hasTooltip', { waitUntilFirstUpdate: !0 })], X.prototype, 'syncRange', 1);
X.define('sl-range');
var An = T`
  :host {
    --symbol-color: var(--sl-color-neutral-300);
    --symbol-color-active: var(--sl-color-amber-500);
    --symbol-size: 1.2rem;
    --symbol-spacing: var(--sl-spacing-3x-small);

    display: inline-flex;
  }

  .rating {
    position: relative;
    display: inline-flex;
    border-radius: var(--sl-border-radius-medium);
    vertical-align: middle;
  }

  .rating:focus {
    outline: none;
  }

  .rating:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .rating__symbols {
    display: inline-flex;
    position: relative;
    font-size: var(--symbol-size);
    line-height: 0;
    color: var(--symbol-color);
    white-space: nowrap;
    cursor: pointer;
  }

  .rating__symbols > * {
    padding: var(--symbol-spacing);
  }

  .rating__symbol--active,
  .rating__partial--filled {
    color: var(--symbol-color-active);
  }

  .rating__partial-symbol-container {
    position: relative;
  }

  .rating__partial--filled {
    position: absolute;
    top: var(--symbol-spacing);
    left: var(--symbol-spacing);
  }

  .rating__symbol {
    transition: var(--sl-transition-fast) scale;
    pointer-events: none;
  }

  .rating__symbol--hover {
    scale: 1.2;
  }

  .rating--disabled .rating__symbols,
  .rating--readonly .rating__symbols {
    cursor: default;
  }

  .rating--disabled .rating__symbol--hover,
  .rating--readonly .rating__symbol--hover {
    scale: none;
  }

  .rating--disabled {
    opacity: 0.5;
  }

  .rating--disabled .rating__symbols {
    cursor: not-allowed;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    .rating__symbol--active {
      color: SelectedItem;
    }
  }
`;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Bo = 'important',
  Tn = ' !' + Bo,
  yt = ai(
    class extends ni {
      constructor(t) {
        var e;
        if (
          (super(t), t.type !== Ut.ATTRIBUTE || t.name !== 'style' || ((e = t.strings) == null ? void 0 : e.length) > 2)
        )
          throw Error(
            'The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.'
          );
      }
      render(t) {
        return Object.keys(t).reduce((e, i) => {
          const s = t[i];
          return s == null
            ? e
            : e +
                `${(i = i.includes('-') ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, '-$&').toLowerCase())}:${s};`;
        }, '');
      }
      update(t, [e]) {
        const { style: i } = t.element;
        if (this.ft === void 0) return (this.ft = new Set(Object.keys(e))), this.render(e);
        for (const s of this.ft)
          e[s] == null && (this.ft.delete(s), s.includes('-') ? i.removeProperty(s) : (i[s] = null));
        for (const s in e) {
          const o = e[s];
          if (o != null) {
            this.ft.add(s);
            const a = typeof o == 'string' && o.endsWith(Tn);
            s.includes('-') || a ? i.setProperty(s, a ? o.slice(0, -11) : o, a ? Bo : '') : (i[s] = o);
          }
        }
        return kt;
      }
    }
  );
var gt = class extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.hoverValue = 0),
      (this.isHovering = !1),
      (this.label = ''),
      (this.value = 0),
      (this.max = 5),
      (this.precision = 1),
      (this.readonly = !1),
      (this.disabled = !1),
      (this.getSymbol = () => '<sl-icon name="star-fill" library="system"></sl-icon>');
  }
  getValueFromMousePosition(t) {
    return this.getValueFromXCoordinate(t.clientX);
  }
  getValueFromTouchPosition(t) {
    return this.getValueFromXCoordinate(t.touches[0].clientX);
  }
  getValueFromXCoordinate(t) {
    const e = this.localize.dir() === 'rtl',
      { left: i, right: s, width: o } = this.rating.getBoundingClientRect(),
      a = e
        ? this.roundToPrecision(((s - t) / o) * this.max, this.precision)
        : this.roundToPrecision(((t - i) / o) * this.max, this.precision);
    return it(a, 0, this.max);
  }
  handleClick(t) {
    this.disabled || (this.setValue(this.getValueFromMousePosition(t)), this.emit('sl-change'));
  }
  setValue(t) {
    this.disabled || this.readonly || ((this.value = t === this.value ? 0 : t), (this.isHovering = !1));
  }
  handleKeyDown(t) {
    const e = this.localize.dir() === 'ltr',
      i = this.localize.dir() === 'rtl',
      s = this.value;
    if (!(this.disabled || this.readonly)) {
      if (t.key === 'ArrowDown' || (e && t.key === 'ArrowLeft') || (i && t.key === 'ArrowRight')) {
        const o = t.shiftKey ? 1 : this.precision;
        (this.value = Math.max(0, this.value - o)), t.preventDefault();
      }
      if (t.key === 'ArrowUp' || (e && t.key === 'ArrowRight') || (i && t.key === 'ArrowLeft')) {
        const o = t.shiftKey ? 1 : this.precision;
        (this.value = Math.min(this.max, this.value + o)), t.preventDefault();
      }
      t.key === 'Home' && ((this.value = 0), t.preventDefault()),
        t.key === 'End' && ((this.value = this.max), t.preventDefault()),
        this.value !== s && this.emit('sl-change');
    }
  }
  handleMouseEnter(t) {
    (this.isHovering = !0), (this.hoverValue = this.getValueFromMousePosition(t));
  }
  handleMouseMove(t) {
    this.hoverValue = this.getValueFromMousePosition(t);
  }
  handleMouseLeave() {
    this.isHovering = !1;
  }
  handleTouchStart(t) {
    (this.isHovering = !0), (this.hoverValue = this.getValueFromTouchPosition(t)), t.preventDefault();
  }
  handleTouchMove(t) {
    this.hoverValue = this.getValueFromTouchPosition(t);
  }
  handleTouchEnd(t) {
    (this.isHovering = !1), this.setValue(this.hoverValue), this.emit('sl-change'), t.preventDefault();
  }
  roundToPrecision(t, e = 0.5) {
    const i = 1 / e;
    return Math.ceil(t * i) / i;
  }
  handleHoverValueChange() {
    this.emit('sl-hover', { detail: { phase: 'move', value: this.hoverValue } });
  }
  handleIsHoveringChange() {
    this.emit('sl-hover', { detail: { phase: this.isHovering ? 'start' : 'end', value: this.hoverValue } });
  }
  focus(t) {
    this.rating.focus(t);
  }
  blur() {
    this.rating.blur();
  }
  render() {
    const t = this.localize.dir() === 'rtl',
      e = Array.from(Array(this.max).keys());
    let i = 0;
    return (
      this.disabled || this.readonly ? (i = this.value) : (i = this.isHovering ? this.hoverValue : this.value),
      y`
      <div
        part="base"
        class=${I({ rating: !0, 'rating--readonly': this.readonly, 'rating--disabled': this.disabled, 'rating--rtl': t })}
        role="slider"
        aria-label=${this.label}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-readonly=${this.readonly ? 'true' : 'false'}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols">
          ${e.map((s) =>
            i > s && i < s + 1
              ? y`
                <span
                  class=${I({ rating__symbol: !0, 'rating__partial-symbol-container': !0, 'rating__symbol--hover': this.isHovering && Math.ceil(i) === s + 1 })}
                  role="presentation"
                >
                  <div
                    style=${yt({ clipPath: t ? `inset(0 ${(i - s) * 100}% 0 0)` : `inset(0 0 0 ${(i - s) * 100}%)` })}
                  >
                    ${ki(this.getSymbol(s + 1))}
                  </div>
                  <div
                    class="rating__partial--filled"
                    style=${yt({ clipPath: t ? `inset(0 0 0 ${100 - (i - s) * 100}%)` : `inset(0 ${100 - (i - s) * 100}% 0 0)` })}
                  >
                    ${ki(this.getSymbol(s + 1))}
                  </div>
                </span>
              `
              : y`
              <span
                class=${I({ rating__symbol: !0, 'rating__symbol--hover': this.isHovering && Math.ceil(i) === s + 1, 'rating__symbol--active': i >= s + 1 })}
                role="presentation"
              >
                ${ki(this.getSymbol(s + 1))}
              </span>
            `
          )}
        </span>
      </div>
    `
    );
  }
};
gt.styles = [D, An];
gt.dependencies = { 'sl-icon': j };
r([k('.rating')], gt.prototype, 'rating', 2);
r([L()], gt.prototype, 'hoverValue', 2);
r([L()], gt.prototype, 'isHovering', 2);
r([l()], gt.prototype, 'label', 2);
r([l({ type: Number })], gt.prototype, 'value', 2);
r([l({ type: Number })], gt.prototype, 'max', 2);
r([l({ type: Number })], gt.prototype, 'precision', 2);
r([l({ type: Boolean, reflect: !0 })], gt.prototype, 'readonly', 2);
r([l({ type: Boolean, reflect: !0 })], gt.prototype, 'disabled', 2);
r([l()], gt.prototype, 'getSymbol', 2);
r([oi({ passive: !0 })], gt.prototype, 'handleTouchMove', 1);
r([x('hoverValue')], gt.prototype, 'handleHoverValueChange', 1);
r([x('isHovering')], gt.prototype, 'handleIsHoveringChange', 1);
gt.define('sl-rating');
var Ln = [
    { max: 276e4, value: 6e4, unit: 'minute' },
    { max: 72e6, value: 36e5, unit: 'hour' },
    { max: 5184e5, value: 864e5, unit: 'day' },
    { max: 24192e5, value: 6048e5, unit: 'week' },
    { max: 28512e6, value: 2592e6, unit: 'month' },
    { max: 1 / 0, value: 31536e6, unit: 'year' },
  ],
  we = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.isoTime = ''),
        (this.relativeTime = ''),
        (this.date = new Date()),
        (this.format = 'long'),
        (this.numeric = 'auto'),
        (this.sync = !1);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), clearTimeout(this.updateTimeout);
    }
    render() {
      const t = new Date(),
        e = new Date(this.date);
      if (isNaN(e.getMilliseconds())) return (this.relativeTime = ''), (this.isoTime = ''), '';
      const i = e.getTime() - t.getTime(),
        { unit: s, value: o } = Ln.find((a) => Math.abs(i) < a.max);
      if (
        ((this.isoTime = e.toISOString()),
        (this.relativeTime = this.localize.relativeTime(Math.round(i / o), s, {
          numeric: this.numeric,
          style: this.format,
        })),
        clearTimeout(this.updateTimeout),
        this.sync)
      ) {
        let a;
        s === 'minute'
          ? (a = gi('second'))
          : s === 'hour'
            ? (a = gi('minute'))
            : s === 'day'
              ? (a = gi('hour'))
              : (a = gi('day')),
          (this.updateTimeout = window.setTimeout(() => this.requestUpdate(), a));
      }
      return y` <time datetime=${this.isoTime}>${this.relativeTime}</time> `;
    }
  };
r([L()], we.prototype, 'isoTime', 2);
r([L()], we.prototype, 'relativeTime', 2);
r([l()], we.prototype, 'date', 2);
r([l()], we.prototype, 'format', 2);
r([l()], we.prototype, 'numeric', 2);
r([l({ type: Boolean })], we.prototype, 'sync', 2);
function gi(t) {
  const i = { second: 1e3, minute: 6e4, hour: 36e5, day: 864e5 }[t];
  return i - (Date.now() % i);
}
we.define('sl-relative-time');
var Vo = T`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`,
  In = T`
  ${Vo}

  .button__prefix,
  .button__suffix,
  .button__label {
    display: inline-flex;
    position: relative;
    align-items: center;
  }

  /* We use a hidden input so constraint validation errors work, since they don't appear to show when used with buttons.
    We can't actually hide it, though, otherwise the messages will be suppressed by the browser. */
  .hidden-input {
    all: unset;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: dotted 1px red;
    opacity: 0;
    z-index: -1;
  }
`,
  Mt = class extends E {
    constructor() {
      super(...arguments),
        (this.hasSlotController = new vt(this, '[default]', 'prefix', 'suffix')),
        (this.hasFocus = !1),
        (this.checked = !1),
        (this.disabled = !1),
        (this.size = 'medium'),
        (this.pill = !1);
    }
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'presentation');
    }
    handleBlur() {
      (this.hasFocus = !1), this.emit('sl-blur');
    }
    handleClick(t) {
      if (this.disabled) {
        t.preventDefault(), t.stopPropagation();
        return;
      }
      this.checked = !0;
    }
    handleFocus() {
      (this.hasFocus = !0), this.emit('sl-focus');
    }
    handleDisabledChange() {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    focus(t) {
      this.input.focus(t);
    }
    blur() {
      this.input.blur();
    }
    render() {
      return Ke`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? ' button--checked' : ''}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${I({ button: !0, 'button--default': !0, 'button--small': this.size === 'small', 'button--medium': this.size === 'medium', 'button--large': this.size === 'large', 'button--checked': this.checked, 'button--disabled': this.disabled, 'button--focused': this.hasFocus, 'button--outline': !0, 'button--pill': this.pill, 'button--has-label': this.hasSlotController.test('[default]'), 'button--has-prefix': this.hasSlotController.test('prefix'), 'button--has-suffix': this.hasSlotController.test('suffix') })}
          aria-disabled=${this.disabled}
          type="button"
          value=${z(this.value)}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
    }
  };
Mt.styles = [D, In];
r([k('.button')], Mt.prototype, 'input', 2);
r([k('.hidden-input')], Mt.prototype, 'hiddenInput', 2);
r([L()], Mt.prototype, 'hasFocus', 2);
r([l({ type: Boolean, reflect: !0 })], Mt.prototype, 'checked', 2);
r([l()], Mt.prototype, 'value', 2);
r([l({ type: Boolean, reflect: !0 })], Mt.prototype, 'disabled', 2);
r([l({ reflect: !0 })], Mt.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], Mt.prototype, 'pill', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], Mt.prototype, 'handleDisabledChange', 1);
Mt.define('sl-radio-button');
var Dn = T`
  :host {
    display: block;
  }

  .form-control {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-control__label {
    padding: 0;
  }

  .radio-group--required .radio-group__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`,
  Pn = T`
  :host {
    display: inline-block;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
  }
`,
  _e = class extends E {
    constructor() {
      super(...arguments), (this.disableRole = !1), (this.label = '');
    }
    handleFocus(t) {
      const e = Ne(t.target);
      e == null || e.toggleAttribute('data-sl-button-group__button--focus', !0);
    }
    handleBlur(t) {
      const e = Ne(t.target);
      e == null || e.toggleAttribute('data-sl-button-group__button--focus', !1);
    }
    handleMouseOver(t) {
      const e = Ne(t.target);
      e == null || e.toggleAttribute('data-sl-button-group__button--hover', !0);
    }
    handleMouseOut(t) {
      const e = Ne(t.target);
      e == null || e.toggleAttribute('data-sl-button-group__button--hover', !1);
    }
    handleSlotChange() {
      const t = [...this.defaultSlot.assignedElements({ flatten: !0 })];
      t.forEach((e) => {
        const i = t.indexOf(e),
          s = Ne(e);
        s &&
          (s.toggleAttribute('data-sl-button-group__button', !0),
          s.toggleAttribute('data-sl-button-group__button--first', i === 0),
          s.toggleAttribute('data-sl-button-group__button--inner', i > 0 && i < t.length - 1),
          s.toggleAttribute('data-sl-button-group__button--last', i === t.length - 1),
          s.toggleAttribute('data-sl-button-group__button--radio', s.tagName.toLowerCase() === 'sl-radio-button'));
      });
    }
    render() {
      return y`
      <div
        part="base"
        class="button-group"
        role="${this.disableRole ? 'presentation' : 'group'}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
    }
  };
_e.styles = [D, Pn];
r([k('slot')], _e.prototype, 'defaultSlot', 2);
r([L()], _e.prototype, 'disableRole', 2);
r([l()], _e.prototype, 'label', 2);
function Ne(t) {
  var e;
  const i = 'sl-button, sl-radio-button';
  return (e = t.closest(i)) != null ? e : t.querySelector(i);
}
var ut = class extends E {
  constructor() {
    super(...arguments),
      (this.formControlController = new Zt(this)),
      (this.hasSlotController = new vt(this, 'help-text', 'label')),
      (this.customValidityMessage = ''),
      (this.hasButtonGroup = !1),
      (this.errorMessage = ''),
      (this.defaultValue = ''),
      (this.label = ''),
      (this.helpText = ''),
      (this.name = 'option'),
      (this.value = ''),
      (this.size = 'medium'),
      (this.form = ''),
      (this.required = !1);
  }
  get validity() {
    const t = this.required && !this.value;
    return this.customValidityMessage !== '' ? Lr : t ? Tr : Li;
  }
  get validationMessage() {
    const t = this.required && !this.value;
    return this.customValidityMessage !== ''
      ? this.customValidityMessage
      : t
        ? this.validationInput.validationMessage
        : '';
  }
  connectedCallback() {
    super.connectedCallback(), (this.defaultValue = this.value);
  }
  firstUpdated() {
    this.formControlController.updateValidity();
  }
  getAllRadios() {
    return [...this.querySelectorAll('sl-radio, sl-radio-button')];
  }
  handleRadioClick(t) {
    const e = t.target.closest('sl-radio, sl-radio-button'),
      i = this.getAllRadios(),
      s = this.value;
    !e ||
      e.disabled ||
      ((this.value = e.value),
      i.forEach((o) => (o.checked = o === e)),
      this.value !== s && (this.emit('sl-change'), this.emit('sl-input')));
  }
  handleKeyDown(t) {
    var e;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(t.key)) return;
    const i = this.getAllRadios().filter((c) => !c.disabled),
      s = (e = i.find((c) => c.checked)) != null ? e : i[0],
      o = t.key === ' ' ? 0 : ['ArrowUp', 'ArrowLeft'].includes(t.key) ? -1 : 1,
      a = this.value;
    let n = i.indexOf(s) + o;
    n < 0 && (n = i.length - 1),
      n > i.length - 1 && (n = 0),
      this.getAllRadios().forEach((c) => {
        (c.checked = !1), this.hasButtonGroup || c.setAttribute('tabindex', '-1');
      }),
      (this.value = i[n].value),
      (i[n].checked = !0),
      this.hasButtonGroup
        ? i[n].shadowRoot.querySelector('button').focus()
        : (i[n].setAttribute('tabindex', '0'), i[n].focus()),
      this.value !== a && (this.emit('sl-change'), this.emit('sl-input')),
      t.preventDefault();
  }
  handleLabelClick() {
    this.focus();
  }
  handleInvalid(t) {
    this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
  }
  async syncRadioElements() {
    var t, e;
    const i = this.getAllRadios();
    if (
      (await Promise.all(
        i.map(async (s) => {
          await s.updateComplete, (s.checked = s.value === this.value), (s.size = this.size);
        })
      ),
      (this.hasButtonGroup = i.some((s) => s.tagName.toLowerCase() === 'sl-radio-button')),
      i.length > 0 && !i.some((s) => s.checked))
    )
      if (this.hasButtonGroup) {
        const s = (t = i[0].shadowRoot) == null ? void 0 : t.querySelector('button');
        s && s.setAttribute('tabindex', '0');
      } else i[0].setAttribute('tabindex', '0');
    if (this.hasButtonGroup) {
      const s = (e = this.shadowRoot) == null ? void 0 : e.querySelector('sl-button-group');
      s && (s.disableRole = !0);
    }
  }
  syncRadios() {
    if (customElements.get('sl-radio') && customElements.get('sl-radio-button')) {
      this.syncRadioElements();
      return;
    }
    customElements.get('sl-radio')
      ? this.syncRadioElements()
      : customElements.whenDefined('sl-radio').then(() => this.syncRadios()),
      customElements.get('sl-radio-button')
        ? this.syncRadioElements()
        : customElements.whenDefined('sl-radio-button').then(() => this.syncRadios());
  }
  updateCheckedRadio() {
    this.getAllRadios().forEach((e) => (e.checked = e.value === this.value)),
      this.formControlController.setValidity(this.validity.valid);
  }
  handleSizeChange() {
    this.syncRadios();
  }
  handleValueChange() {
    this.hasUpdated && this.updateCheckedRadio();
  }
  checkValidity() {
    const t = this.required && !this.value,
      e = this.customValidityMessage !== '';
    return t || e ? (this.formControlController.emitInvalidEvent(), !1) : !0;
  }
  getForm() {
    return this.formControlController.getForm();
  }
  reportValidity() {
    const t = this.validity.valid;
    return (
      (this.errorMessage = this.customValidityMessage || t ? '' : this.validationInput.validationMessage),
      this.formControlController.setValidity(t),
      (this.validationInput.hidden = !0),
      clearTimeout(this.validationTimeout),
      t ||
        ((this.validationInput.hidden = !1),
        this.validationInput.reportValidity(),
        (this.validationTimeout = setTimeout(() => (this.validationInput.hidden = !0), 1e4))),
      t
    );
  }
  setCustomValidity(t = '') {
    (this.customValidityMessage = t),
      (this.errorMessage = t),
      this.validationInput.setCustomValidity(t),
      this.formControlController.updateValidity();
  }
  focus(t) {
    const e = this.getAllRadios(),
      i = e.find((a) => a.checked),
      s = e.find((a) => !a.disabled),
      o = i || s;
    o && o.focus(t);
  }
  render() {
    const t = this.hasSlotController.test('label'),
      e = this.hasSlotController.test('help-text'),
      i = this.label ? !0 : !!t,
      s = this.helpText ? !0 : !!e,
      o = y`
      <slot @slotchange=${this.syncRadios} @click=${this.handleRadioClick} @keydown=${this.handleKeyDown}></slot>
    `;
    return y`
      <fieldset
        part="form-control"
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--radio-group': !0, 'form-control--has-label': i, 'form-control--has-help-text': s })}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${i ? 'false' : 'true'}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div class="visually-hidden">
            <div id="error-message" aria-live="assertive">${this.errorMessage}</div>
            <label class="radio-group__validation">
              <input
                type="text"
                class="radio-group__validation-input"
                ?required=${this.required}
                tabindex="-1"
                hidden
                @invalid=${this.handleInvalid}
              />
            </label>
          </div>

          ${
            this.hasButtonGroup
              ? y`
                <sl-button-group part="button-group" exportparts="base:button-group__base" role="presentation">
                  ${o}
                </sl-button-group>
              `
              : o
          }
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </fieldset>
    `;
  }
};
ut.styles = [D, ve, Dn];
ut.dependencies = { 'sl-button-group': _e };
r([k('slot:not([name])')], ut.prototype, 'defaultSlot', 2);
r([k('.radio-group__validation-input')], ut.prototype, 'validationInput', 2);
r([L()], ut.prototype, 'hasButtonGroup', 2);
r([L()], ut.prototype, 'errorMessage', 2);
r([L()], ut.prototype, 'defaultValue', 2);
r([l()], ut.prototype, 'label', 2);
r([l({ attribute: 'help-text' })], ut.prototype, 'helpText', 2);
r([l()], ut.prototype, 'name', 2);
r([l({ reflect: !0 })], ut.prototype, 'value', 2);
r([l({ reflect: !0 })], ut.prototype, 'size', 2);
r([l({ reflect: !0 })], ut.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], ut.prototype, 'required', 2);
r([x('size', { waitUntilFirstUpdate: !0 })], ut.prototype, 'handleSizeChange', 1);
r([x('value')], ut.prototype, 'handleValueChange', 1);
ut.define('sl-radio-group');
var On = T`
  :host {
    --size: 128px;
    --track-width: 4px;
    --track-color: var(--sl-color-neutral-200);
    --indicator-width: var(--track-width);
    --indicator-color: var(--sl-color-primary-600);
    --indicator-transition-duration: 0.35s;

    display: inline-flex;
  }

  .progress-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .progress-ring__image {
    width: var(--size);
    height: var(--size);
    rotate: -90deg;
    transform-origin: 50% 50%;
  }

  .progress-ring__track,
  .progress-ring__indicator {
    --radius: calc(var(--size) / 2 - max(var(--track-width), var(--indicator-width)) * 0.5);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    fill: none;
    r: var(--radius);
    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
  }

  .progress-ring__track {
    stroke: var(--track-color);
    stroke-width: var(--track-width);
  }

  .progress-ring__indicator {
    stroke: var(--indicator-color);
    stroke-width: var(--indicator-width);
    stroke-linecap: round;
    transition-property: stroke-dashoffset;
    transition-duration: var(--indicator-transition-duration);
    stroke-dasharray: var(--circumference) var(--circumference);
    stroke-dashoffset: calc(var(--circumference) - var(--percentage) * var(--circumference));
  }

  .progress-ring__label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
    -webkit-user-select: none;
  }
`,
  De = class extends E {
    constructor() {
      super(...arguments), (this.localize = new N(this)), (this.value = 0), (this.label = '');
    }
    updated(t) {
      if ((super.updated(t), t.has('value'))) {
        const e = parseFloat(getComputedStyle(this.indicator).getPropertyValue('r')),
          i = 2 * Math.PI * e,
          s = i - (this.value / 100) * i;
        this.indicatorOffset = `${s}px`;
      }
    }
    render() {
      return y`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length > 0 ? this.label : this.localize.term('progress')}
        aria-describedby="label"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value / 100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <slot id="label" part="label" class="progress-ring__label"></slot>
      </div>
    `;
    }
  };
De.styles = [D, On];
r([k('.progress-ring__indicator')], De.prototype, 'indicator', 2);
r([L()], De.prototype, 'indicatorOffset', 2);
r([l({ type: Number, reflect: !0 })], De.prototype, 'value', 2);
r([l()], De.prototype, 'label', 2);
De.define('sl-progress-ring');
var Mn = T`
  :host {
    display: inline-block;
  }
`;
let No = null;
class Ho {}
Ho.render = function (t, e) {
  No(t, e);
};
self.QrCreator = Ho;
(function (t) {
  function e(c, d, h, f) {
    var u = {},
      p = t(h, d);
    p.u(c), p.J(), (f = f || 0);
    var m = p.h(),
      g = p.h() + 2 * f;
    return (
      (u.text = c),
      (u.level = d),
      (u.version = h),
      (u.O = g),
      (u.a = function (b, C) {
        return (b -= f), (C -= f), 0 > b || b >= m || 0 > C || C >= m ? !1 : p.a(b, C);
      }),
      u
    );
  }
  function i(c, d, h, f, u, p, m, g, b, C) {
    function S(_, $, v, w, P, M, F) {
      _ ? (c.lineTo($ + M, v + F), c.arcTo($, v, w, P, p)) : c.lineTo($, v);
    }
    m ? c.moveTo(d + p, h) : c.moveTo(d, h),
      S(g, f, h, f, u, -p, 0),
      S(b, f, u, d, u, 0, -p),
      S(C, d, u, d, h, p, 0),
      S(m, d, h, f, h, 0, p);
  }
  function s(c, d, h, f, u, p, m, g, b, C) {
    function S(_, $, v, w) {
      c.moveTo(_ + v, $), c.lineTo(_, $), c.lineTo(_, $ + w), c.arcTo(_, $, _ + v, $, p);
    }
    m && S(d, h, p, p), g && S(f, h, -p, p), b && S(f, u, -p, -p), C && S(d, u, p, -p);
  }
  function o(c, d) {
    var h = d.fill;
    if (typeof h == 'string') c.fillStyle = h;
    else {
      var f = h.type,
        u = h.colorStops;
      if (((h = h.position.map((m) => Math.round(m * d.size))), f === 'linear-gradient'))
        var p = c.createLinearGradient.apply(c, h);
      else if (f === 'radial-gradient') p = c.createRadialGradient.apply(c, h);
      else throw Error('Unsupported fill');
      u.forEach(([m, g]) => {
        p.addColorStop(m, g);
      }),
        (c.fillStyle = p);
    }
  }
  function a(c, d) {
    t: {
      var h = d.text,
        f = d.v,
        u = d.N,
        p = d.K,
        m = d.P;
      for (u = Math.max(1, u || 1), p = Math.min(40, p || 40); u <= p; u += 1)
        try {
          var g = e(h, f, u, m);
          break t;
        } catch {}
      g = void 0;
    }
    if (!g) return null;
    for (
      h = c.getContext('2d'),
        d.background && ((h.fillStyle = d.background), h.fillRect(d.left, d.top, d.size, d.size)),
        f = g.O,
        p = d.size / f,
        h.beginPath(),
        m = 0;
      m < f;
      m += 1
    )
      for (u = 0; u < f; u += 1) {
        var b = h,
          C = d.left + u * p,
          S = d.top + m * p,
          _ = m,
          $ = u,
          v = g.a,
          w = C + p,
          P = S + p,
          M = _ - 1,
          F = _ + 1,
          O = $ - 1,
          A = $ + 1,
          ot = Math.floor(Math.min(0.5, Math.max(0, d.R)) * p),
          tt = v(_, $),
          ft = v(M, O),
          et = v(M, $);
        M = v(M, A);
        var It = v(_, A);
        (A = v(F, A)),
          ($ = v(F, $)),
          (F = v(F, O)),
          (_ = v(_, O)),
          (C = Math.round(C)),
          (S = Math.round(S)),
          (w = Math.round(w)),
          (P = Math.round(P)),
          tt
            ? i(b, C, S, w, P, ot, !et && !_, !et && !It, !$ && !It, !$ && !_)
            : s(b, C, S, w, P, ot, et && _ && ft, et && It && M, $ && It && A, $ && _ && F);
      }
    return o(h, d), h.fill(), c;
  }
  var n = {
    minVersion: 1,
    maxVersion: 40,
    ecLevel: 'L',
    left: 0,
    top: 0,
    size: 200,
    fill: '#000',
    background: null,
    text: 'no text',
    radius: 0.5,
    quiet: 0,
  };
  No = function (c, d) {
    var h = {};
    Object.assign(h, n, c),
      (h.N = h.minVersion),
      (h.K = h.maxVersion),
      (h.v = h.ecLevel),
      (h.left = h.left),
      (h.top = h.top),
      (h.size = h.size),
      (h.fill = h.fill),
      (h.background = h.background),
      (h.text = h.text),
      (h.R = h.radius),
      (h.P = h.quiet),
      d instanceof HTMLCanvasElement
        ? ((d.width !== h.size || d.height !== h.size) && ((d.width = h.size), (d.height = h.size)),
          d.getContext('2d').clearRect(0, 0, d.width, d.height),
          a(d, h))
        : ((c = document.createElement('canvas')),
          (c.width = h.size),
          (c.height = h.size),
          (h = a(c, h)),
          d.appendChild(h));
  };
})(
  (function () {
    function t(d) {
      var h = i.s(d);
      return {
        S: function () {
          return 4;
        },
        b: function () {
          return h.length;
        },
        write: function (f) {
          for (var u = 0; u < h.length; u += 1) f.put(h[u], 8);
        },
      };
    }
    function e() {
      var d = [],
        h = 0,
        f = {
          B: function () {
            return d;
          },
          c: function (u) {
            return ((d[Math.floor(u / 8)] >>> (7 - (u % 8))) & 1) == 1;
          },
          put: function (u, p) {
            for (var m = 0; m < p; m += 1) f.m(((u >>> (p - m - 1)) & 1) == 1);
          },
          f: function () {
            return h;
          },
          m: function (u) {
            var p = Math.floor(h / 8);
            d.length <= p && d.push(0), u && (d[p] |= 128 >>> h % 8), (h += 1);
          },
        };
      return f;
    }
    function i(d, h) {
      function f(_, $) {
        for (var v = -1; 7 >= v; v += 1)
          if (!(-1 >= _ + v || g <= _ + v))
            for (var w = -1; 7 >= w; w += 1)
              -1 >= $ + w ||
                g <= $ + w ||
                (m[_ + v][$ + w] =
                  (0 <= v && 6 >= v && (w == 0 || w == 6)) ||
                  (0 <= w && 6 >= w && (v == 0 || v == 6)) ||
                  (2 <= v && 4 >= v && 2 <= w && 4 >= w));
      }
      function u(_, $) {
        for (var v = (g = 4 * d + 17), w = Array(v), P = 0; P < v; P += 1) {
          w[P] = Array(v);
          for (var M = 0; M < v; M += 1) w[P][M] = null;
        }
        for (m = w, f(0, 0), f(g - 7, 0), f(0, g - 7), v = a.G(d), w = 0; w < v.length; w += 1)
          for (P = 0; P < v.length; P += 1) {
            M = v[w];
            var F = v[P];
            if (m[M][F] == null)
              for (var O = -2; 2 >= O; O += 1)
                for (var A = -2; 2 >= A; A += 1)
                  m[M + O][F + A] = O == -2 || O == 2 || A == -2 || A == 2 || (O == 0 && A == 0);
          }
        for (v = 8; v < g - 8; v += 1) m[v][6] == null && (m[v][6] = v % 2 == 0);
        for (v = 8; v < g - 8; v += 1) m[6][v] == null && (m[6][v] = v % 2 == 0);
        for (v = a.w((p << 3) | $), w = 0; 15 > w; w += 1)
          (P = !_ && ((v >> w) & 1) == 1),
            (m[6 > w ? w : 8 > w ? w + 1 : g - 15 + w][8] = P),
            (m[8][8 > w ? g - w - 1 : 9 > w ? 15 - w : 14 - w] = P);
        if (((m[g - 8][8] = !_), 7 <= d)) {
          for (v = a.A(d), w = 0; 18 > w; w += 1)
            (P = !_ && ((v >> w) & 1) == 1), (m[Math.floor(w / 3)][(w % 3) + g - 8 - 3] = P);
          for (w = 0; 18 > w; w += 1) (P = !_ && ((v >> w) & 1) == 1), (m[(w % 3) + g - 8 - 3][Math.floor(w / 3)] = P);
        }
        if (b == null) {
          for (_ = c.I(d, p), v = e(), w = 0; w < C.length; w += 1)
            (P = C[w]), v.put(4, 4), v.put(P.b(), a.f(4, d)), P.write(v);
          for (w = P = 0; w < _.length; w += 1) P += _[w].j;
          if (v.f() > 8 * P) throw Error('code length overflow. (' + v.f() + '>' + 8 * P + ')');
          for (v.f() + 4 <= 8 * P && v.put(0, 4); v.f() % 8 != 0; ) v.m(!1);
          for (; !(v.f() >= 8 * P) && (v.put(236, 8), !(v.f() >= 8 * P)); ) v.put(17, 8);
          var ot = 0;
          for (P = w = 0, M = Array(_.length), F = Array(_.length), O = 0; O < _.length; O += 1) {
            var tt = _[O].j,
              ft = _[O].o - tt;
            for (w = Math.max(w, tt), P = Math.max(P, ft), M[O] = Array(tt), A = 0; A < M[O].length; A += 1)
              M[O][A] = 255 & v.B()[A + ot];
            for (
              ot += tt, A = a.C(ft), tt = s(M[O], A.b() - 1).l(A), F[O] = Array(A.b() - 1), A = 0;
              A < F[O].length;
              A += 1
            )
              (ft = A + tt.b() - F[O].length), (F[O][A] = 0 <= ft ? tt.c(ft) : 0);
          }
          for (A = v = 0; A < _.length; A += 1) v += _[A].o;
          for (v = Array(v), A = ot = 0; A < w; A += 1)
            for (O = 0; O < _.length; O += 1) A < M[O].length && ((v[ot] = M[O][A]), (ot += 1));
          for (A = 0; A < P; A += 1)
            for (O = 0; O < _.length; O += 1) A < F[O].length && ((v[ot] = F[O][A]), (ot += 1));
          b = v;
        }
        for (_ = b, v = -1, w = g - 1, P = 7, M = 0, $ = a.F($), F = g - 1; 0 < F; F -= 2)
          for (F == 6 && --F; ; ) {
            for (O = 0; 2 > O; O += 1)
              m[w][F - O] == null &&
                ((A = !1),
                M < _.length && (A = ((_[M] >>> P) & 1) == 1),
                $(w, F - O) && (A = !A),
                (m[w][F - O] = A),
                --P,
                P == -1 && ((M += 1), (P = 7)));
            if (((w += v), 0 > w || g <= w)) {
              (w -= v), (v = -v);
              break;
            }
          }
      }
      var p = o[h],
        m = null,
        g = 0,
        b = null,
        C = [],
        S = {
          u: function (_) {
            (_ = t(_)), C.push(_), (b = null);
          },
          a: function (_, $) {
            if (0 > _ || g <= _ || 0 > $ || g <= $) throw Error(_ + ',' + $);
            return m[_][$];
          },
          h: function () {
            return g;
          },
          J: function () {
            for (var _ = 0, $ = 0, v = 0; 8 > v; v += 1) {
              u(!0, v);
              var w = a.D(S);
              (v == 0 || _ > w) && ((_ = w), ($ = v));
            }
            u(!1, $);
          },
        };
      return S;
    }
    function s(d, h) {
      if (typeof d.length > 'u') throw Error(d.length + '/' + h);
      var f = (function () {
          for (var p = 0; p < d.length && d[p] == 0; ) p += 1;
          for (var m = Array(d.length - p + h), g = 0; g < d.length - p; g += 1) m[g] = d[g + p];
          return m;
        })(),
        u = {
          c: function (p) {
            return f[p];
          },
          b: function () {
            return f.length;
          },
          multiply: function (p) {
            for (var m = Array(u.b() + p.b() - 1), g = 0; g < u.b(); g += 1)
              for (var b = 0; b < p.b(); b += 1) m[g + b] ^= n.i(n.g(u.c(g)) + n.g(p.c(b)));
            return s(m, 0);
          },
          l: function (p) {
            if (0 > u.b() - p.b()) return u;
            for (var m = n.g(u.c(0)) - n.g(p.c(0)), g = Array(u.b()), b = 0; b < u.b(); b += 1) g[b] = u.c(b);
            for (b = 0; b < p.b(); b += 1) g[b] ^= n.i(n.g(p.c(b)) + m);
            return s(g, 0).l(p);
          },
        };
      return u;
    }
    i.s = function (d) {
      for (var h = [], f = 0; f < d.length; f++) {
        var u = d.charCodeAt(f);
        128 > u
          ? h.push(u)
          : 2048 > u
            ? h.push(192 | (u >> 6), 128 | (u & 63))
            : 55296 > u || 57344 <= u
              ? h.push(224 | (u >> 12), 128 | ((u >> 6) & 63), 128 | (u & 63))
              : (f++,
                (u = 65536 + (((u & 1023) << 10) | (d.charCodeAt(f) & 1023))),
                h.push(240 | (u >> 18), 128 | ((u >> 12) & 63), 128 | ((u >> 6) & 63), 128 | (u & 63)));
      }
      return h;
    };
    var o = { L: 1, M: 0, Q: 3, H: 2 },
      a = (function () {
        function d(u) {
          for (var p = 0; u != 0; ) (p += 1), (u >>>= 1);
          return p;
        }
        var h = [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170],
          ],
          f = {
            w: function (u) {
              for (var p = u << 10; 0 <= d(p) - d(1335); ) p ^= 1335 << (d(p) - d(1335));
              return ((u << 10) | p) ^ 21522;
            },
            A: function (u) {
              for (var p = u << 12; 0 <= d(p) - d(7973); ) p ^= 7973 << (d(p) - d(7973));
              return (u << 12) | p;
            },
            G: function (u) {
              return h[u - 1];
            },
            F: function (u) {
              switch (u) {
                case 0:
                  return function (p, m) {
                    return (p + m) % 2 == 0;
                  };
                case 1:
                  return function (p) {
                    return p % 2 == 0;
                  };
                case 2:
                  return function (p, m) {
                    return m % 3 == 0;
                  };
                case 3:
                  return function (p, m) {
                    return (p + m) % 3 == 0;
                  };
                case 4:
                  return function (p, m) {
                    return (Math.floor(p / 2) + Math.floor(m / 3)) % 2 == 0;
                  };
                case 5:
                  return function (p, m) {
                    return ((p * m) % 2) + ((p * m) % 3) == 0;
                  };
                case 6:
                  return function (p, m) {
                    return (((p * m) % 2) + ((p * m) % 3)) % 2 == 0;
                  };
                case 7:
                  return function (p, m) {
                    return (((p * m) % 3) + ((p + m) % 2)) % 2 == 0;
                  };
                default:
                  throw Error('bad maskPattern:' + u);
              }
            },
            C: function (u) {
              for (var p = s([1], 0), m = 0; m < u; m += 1) p = p.multiply(s([1, n.i(m)], 0));
              return p;
            },
            f: function (u, p) {
              if (u != 4 || 1 > p || 40 < p) throw Error('mode: ' + u + '; type: ' + p);
              return 10 > p ? 8 : 16;
            },
            D: function (u) {
              for (var p = u.h(), m = 0, g = 0; g < p; g += 1)
                for (var b = 0; b < p; b += 1) {
                  for (var C = 0, S = u.a(g, b), _ = -1; 1 >= _; _ += 1)
                    if (!(0 > g + _ || p <= g + _))
                      for (var $ = -1; 1 >= $; $ += 1)
                        0 > b + $ || p <= b + $ || ((_ != 0 || $ != 0) && S == u.a(g + _, b + $) && (C += 1));
                  5 < C && (m += 3 + C - 5);
                }
              for (g = 0; g < p - 1; g += 1)
                for (b = 0; b < p - 1; b += 1)
                  (C = 0),
                    u.a(g, b) && (C += 1),
                    u.a(g + 1, b) && (C += 1),
                    u.a(g, b + 1) && (C += 1),
                    u.a(g + 1, b + 1) && (C += 1),
                    (C == 0 || C == 4) && (m += 3);
              for (g = 0; g < p; g += 1)
                for (b = 0; b < p - 6; b += 1)
                  u.a(g, b) &&
                    !u.a(g, b + 1) &&
                    u.a(g, b + 2) &&
                    u.a(g, b + 3) &&
                    u.a(g, b + 4) &&
                    !u.a(g, b + 5) &&
                    u.a(g, b + 6) &&
                    (m += 40);
              for (b = 0; b < p; b += 1)
                for (g = 0; g < p - 6; g += 1)
                  u.a(g, b) &&
                    !u.a(g + 1, b) &&
                    u.a(g + 2, b) &&
                    u.a(g + 3, b) &&
                    u.a(g + 4, b) &&
                    !u.a(g + 5, b) &&
                    u.a(g + 6, b) &&
                    (m += 40);
              for (b = C = 0; b < p; b += 1) for (g = 0; g < p; g += 1) u.a(g, b) && (C += 1);
              return (m += (Math.abs((100 * C) / p / p - 50) / 5) * 10);
            },
          };
        return f;
      })(),
      n = (function () {
        for (var d = Array(256), h = Array(256), f = 0; 8 > f; f += 1) d[f] = 1 << f;
        for (f = 8; 256 > f; f += 1) d[f] = d[f - 4] ^ d[f - 5] ^ d[f - 6] ^ d[f - 8];
        for (f = 0; 255 > f; f += 1) h[d[f]] = f;
        return {
          g: function (u) {
            if (1 > u) throw Error('glog(' + u + ')');
            return h[u];
          },
          i: function (u) {
            for (; 0 > u; ) u += 255;
            for (; 256 <= u; ) u -= 255;
            return d[u];
          },
        };
      })(),
      c = (function () {
        function d(u, p) {
          switch (p) {
            case o.L:
              return h[4 * (u - 1)];
            case o.M:
              return h[4 * (u - 1) + 1];
            case o.Q:
              return h[4 * (u - 1) + 2];
            case o.H:
              return h[4 * (u - 1) + 3];
          }
        }
        var h = [
            [1, 26, 19],
            [1, 26, 16],
            [1, 26, 13],
            [1, 26, 9],
            [1, 44, 34],
            [1, 44, 28],
            [1, 44, 22],
            [1, 44, 16],
            [1, 70, 55],
            [1, 70, 44],
            [2, 35, 17],
            [2, 35, 13],
            [1, 100, 80],
            [2, 50, 32],
            [2, 50, 24],
            [4, 25, 9],
            [1, 134, 108],
            [2, 67, 43],
            [2, 33, 15, 2, 34, 16],
            [2, 33, 11, 2, 34, 12],
            [2, 86, 68],
            [4, 43, 27],
            [4, 43, 19],
            [4, 43, 15],
            [2, 98, 78],
            [4, 49, 31],
            [2, 32, 14, 4, 33, 15],
            [4, 39, 13, 1, 40, 14],
            [2, 121, 97],
            [2, 60, 38, 2, 61, 39],
            [4, 40, 18, 2, 41, 19],
            [4, 40, 14, 2, 41, 15],
            [2, 146, 116],
            [3, 58, 36, 2, 59, 37],
            [4, 36, 16, 4, 37, 17],
            [4, 36, 12, 4, 37, 13],
            [2, 86, 68, 2, 87, 69],
            [4, 69, 43, 1, 70, 44],
            [6, 43, 19, 2, 44, 20],
            [6, 43, 15, 2, 44, 16],
            [4, 101, 81],
            [1, 80, 50, 4, 81, 51],
            [4, 50, 22, 4, 51, 23],
            [3, 36, 12, 8, 37, 13],
            [2, 116, 92, 2, 117, 93],
            [6, 58, 36, 2, 59, 37],
            [4, 46, 20, 6, 47, 21],
            [7, 42, 14, 4, 43, 15],
            [4, 133, 107],
            [8, 59, 37, 1, 60, 38],
            [8, 44, 20, 4, 45, 21],
            [12, 33, 11, 4, 34, 12],
            [3, 145, 115, 1, 146, 116],
            [4, 64, 40, 5, 65, 41],
            [11, 36, 16, 5, 37, 17],
            [11, 36, 12, 5, 37, 13],
            [5, 109, 87, 1, 110, 88],
            [5, 65, 41, 5, 66, 42],
            [5, 54, 24, 7, 55, 25],
            [11, 36, 12, 7, 37, 13],
            [5, 122, 98, 1, 123, 99],
            [7, 73, 45, 3, 74, 46],
            [15, 43, 19, 2, 44, 20],
            [3, 45, 15, 13, 46, 16],
            [1, 135, 107, 5, 136, 108],
            [10, 74, 46, 1, 75, 47],
            [1, 50, 22, 15, 51, 23],
            [2, 42, 14, 17, 43, 15],
            [5, 150, 120, 1, 151, 121],
            [9, 69, 43, 4, 70, 44],
            [17, 50, 22, 1, 51, 23],
            [2, 42, 14, 19, 43, 15],
            [3, 141, 113, 4, 142, 114],
            [3, 70, 44, 11, 71, 45],
            [17, 47, 21, 4, 48, 22],
            [9, 39, 13, 16, 40, 14],
            [3, 135, 107, 5, 136, 108],
            [3, 67, 41, 13, 68, 42],
            [15, 54, 24, 5, 55, 25],
            [15, 43, 15, 10, 44, 16],
            [4, 144, 116, 4, 145, 117],
            [17, 68, 42],
            [17, 50, 22, 6, 51, 23],
            [19, 46, 16, 6, 47, 17],
            [2, 139, 111, 7, 140, 112],
            [17, 74, 46],
            [7, 54, 24, 16, 55, 25],
            [34, 37, 13],
            [4, 151, 121, 5, 152, 122],
            [4, 75, 47, 14, 76, 48],
            [11, 54, 24, 14, 55, 25],
            [16, 45, 15, 14, 46, 16],
            [6, 147, 117, 4, 148, 118],
            [6, 73, 45, 14, 74, 46],
            [11, 54, 24, 16, 55, 25],
            [30, 46, 16, 2, 47, 17],
            [8, 132, 106, 4, 133, 107],
            [8, 75, 47, 13, 76, 48],
            [7, 54, 24, 22, 55, 25],
            [22, 45, 15, 13, 46, 16],
            [10, 142, 114, 2, 143, 115],
            [19, 74, 46, 4, 75, 47],
            [28, 50, 22, 6, 51, 23],
            [33, 46, 16, 4, 47, 17],
            [8, 152, 122, 4, 153, 123],
            [22, 73, 45, 3, 74, 46],
            [8, 53, 23, 26, 54, 24],
            [12, 45, 15, 28, 46, 16],
            [3, 147, 117, 10, 148, 118],
            [3, 73, 45, 23, 74, 46],
            [4, 54, 24, 31, 55, 25],
            [11, 45, 15, 31, 46, 16],
            [7, 146, 116, 7, 147, 117],
            [21, 73, 45, 7, 74, 46],
            [1, 53, 23, 37, 54, 24],
            [19, 45, 15, 26, 46, 16],
            [5, 145, 115, 10, 146, 116],
            [19, 75, 47, 10, 76, 48],
            [15, 54, 24, 25, 55, 25],
            [23, 45, 15, 25, 46, 16],
            [13, 145, 115, 3, 146, 116],
            [2, 74, 46, 29, 75, 47],
            [42, 54, 24, 1, 55, 25],
            [23, 45, 15, 28, 46, 16],
            [17, 145, 115],
            [10, 74, 46, 23, 75, 47],
            [10, 54, 24, 35, 55, 25],
            [19, 45, 15, 35, 46, 16],
            [17, 145, 115, 1, 146, 116],
            [14, 74, 46, 21, 75, 47],
            [29, 54, 24, 19, 55, 25],
            [11, 45, 15, 46, 46, 16],
            [13, 145, 115, 6, 146, 116],
            [14, 74, 46, 23, 75, 47],
            [44, 54, 24, 7, 55, 25],
            [59, 46, 16, 1, 47, 17],
            [12, 151, 121, 7, 152, 122],
            [12, 75, 47, 26, 76, 48],
            [39, 54, 24, 14, 55, 25],
            [22, 45, 15, 41, 46, 16],
            [6, 151, 121, 14, 152, 122],
            [6, 75, 47, 34, 76, 48],
            [46, 54, 24, 10, 55, 25],
            [2, 45, 15, 64, 46, 16],
            [17, 152, 122, 4, 153, 123],
            [29, 74, 46, 14, 75, 47],
            [49, 54, 24, 10, 55, 25],
            [24, 45, 15, 46, 46, 16],
            [4, 152, 122, 18, 153, 123],
            [13, 74, 46, 32, 75, 47],
            [48, 54, 24, 14, 55, 25],
            [42, 45, 15, 32, 46, 16],
            [20, 147, 117, 4, 148, 118],
            [40, 75, 47, 7, 76, 48],
            [43, 54, 24, 22, 55, 25],
            [10, 45, 15, 67, 46, 16],
            [19, 148, 118, 6, 149, 119],
            [18, 75, 47, 31, 76, 48],
            [34, 54, 24, 34, 55, 25],
            [20, 45, 15, 61, 46, 16],
          ],
          f = {
            I: function (u, p) {
              var m = d(u, p);
              if (typeof m > 'u') throw Error('bad rs block @ typeNumber:' + u + '/errorCorrectLevel:' + p);
              (u = m.length / 3), (p = []);
              for (var g = 0; g < u; g += 1)
                for (var b = m[3 * g], C = m[3 * g + 1], S = m[3 * g + 2], _ = 0; _ < b; _ += 1) {
                  var $ = S,
                    v = {};
                  (v.o = C), (v.j = $), p.push(v);
                }
              return p;
            },
          };
        return f;
      })();
    return i;
  })()
);
const Rn = QrCreator;
var Rt = class extends E {
  constructor() {
    super(...arguments),
      (this.value = ''),
      (this.label = ''),
      (this.size = 128),
      (this.fill = 'black'),
      (this.background = 'white'),
      (this.radius = 0),
      (this.errorCorrection = 'H');
  }
  firstUpdated() {
    this.generate();
  }
  generate() {
    this.hasUpdated &&
      Rn.render(
        {
          text: this.value,
          radius: this.radius,
          ecLevel: this.errorCorrection,
          fill: this.fill,
          background: this.background,
          size: this.size * 2,
        },
        this.canvas
      );
  }
  render() {
    var t;
    return y`
      <canvas
        part="base"
        class="qr-code"
        role="img"
        aria-label=${((t = this.label) == null ? void 0 : t.length) > 0 ? this.label : this.value}
        style=${yt({ width: `${this.size}px`, height: `${this.size}px` })}
      ></canvas>
    `;
  }
};
Rt.styles = [D, Mn];
r([k('canvas')], Rt.prototype, 'canvas', 2);
r([l()], Rt.prototype, 'value', 2);
r([l()], Rt.prototype, 'label', 2);
r([l({ type: Number })], Rt.prototype, 'size', 2);
r([l()], Rt.prototype, 'fill', 2);
r([l()], Rt.prototype, 'background', 2);
r([l({ type: Number })], Rt.prototype, 'radius', 2);
r([l({ attribute: 'error-correction' })], Rt.prototype, 'errorCorrection', 2);
r([x(['background', 'errorCorrection', 'fill', 'radius', 'size', 'value'])], Rt.prototype, 'generate', 1);
Rt.define('sl-qr-code');
var Fn = T`
  :host {
    display: block;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: top;
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-font-size-medium);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .radio--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .radio--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .radio__checked-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 50%;
    background-color: var(--sl-input-background-color);
    color: transparent;
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .radio--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  .radio:not(.radio--checked) svg circle {
    opacity: 0;
  }

  .radio__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }
`,
  Kt = class extends E {
    constructor() {
      super(),
        (this.checked = !1),
        (this.hasFocus = !1),
        (this.size = 'medium'),
        (this.disabled = !1),
        (this.handleBlur = () => {
          (this.hasFocus = !1), this.emit('sl-blur');
        }),
        (this.handleClick = () => {
          this.disabled || (this.checked = !0);
        }),
        (this.handleFocus = () => {
          (this.hasFocus = !0), this.emit('sl-focus');
        }),
        this.addEventListener('blur', this.handleBlur),
        this.addEventListener('click', this.handleClick),
        this.addEventListener('focus', this.handleFocus);
    }
    connectedCallback() {
      super.connectedCallback(), this.setInitialAttributes();
    }
    setInitialAttributes() {
      this.setAttribute('role', 'radio'),
        this.setAttribute('tabindex', '-1'),
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    handleCheckedChange() {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false'),
        this.setAttribute('tabindex', this.checked ? '0' : '-1');
    }
    handleDisabledChange() {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    render() {
      return y`
      <span
        part="base"
        class=${I({ radio: !0, 'radio--checked': this.checked, 'radio--disabled': this.disabled, 'radio--focused': this.hasFocus, 'radio--small': this.size === 'small', 'radio--medium': this.size === 'medium', 'radio--large': this.size === 'large' })}
      >
        <span part="${`control${this.checked ? ' control--checked' : ''}`}" class="radio__control">
          ${this.checked ? y` <sl-icon part="checked-icon" class="radio__checked-icon" library="system" name="radio"></sl-icon> ` : ''}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `;
    }
  };
Kt.styles = [D, Fn];
Kt.dependencies = { 'sl-icon': j };
r([L()], Kt.prototype, 'checked', 2);
r([L()], Kt.prototype, 'hasFocus', 2);
r([l()], Kt.prototype, 'value', 2);
r([l({ reflect: !0 })], Kt.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], Kt.prototype, 'disabled', 2);
r([x('checked')], Kt.prototype, 'handleCheckedChange', 1);
r([x('disabled', { waitUntilFirstUpdate: !0 })], Kt.prototype, 'handleDisabledChange', 1);
Kt.define('sl-radio');
var Bn = T`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-medium) var(--sl-spacing-x-small) var(--sl-spacing-x-small);
    transition: var(--sl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--sl-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--sl-spacing-2x-small);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`,
  Lt = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.isInitialized = !1),
        (this.current = !1),
        (this.selected = !1),
        (this.hasHover = !1),
        (this.value = ''),
        (this.disabled = !1);
    }
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'option'), this.setAttribute('aria-selected', 'false');
    }
    handleDefaultSlotChange() {
      this.isInitialized
        ? customElements.whenDefined('sl-select').then(() => {
            const t = this.closest('sl-select');
            t && t.handleDefaultSlotChange();
          })
        : (this.isInitialized = !0);
    }
    handleMouseEnter() {
      this.hasHover = !0;
    }
    handleMouseLeave() {
      this.hasHover = !1;
    }
    handleDisabledChange() {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    handleSelectedChange() {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
    handleValueChange() {
      typeof this.value != 'string' && (this.value = String(this.value)),
        this.value.includes(' ') &&
          (console.error('Option values cannot include a space. All spaces have been replaced with underscores.', this),
          (this.value = this.value.replace(/ /g, '_')));
    }
    getTextLabel() {
      const t = this.childNodes;
      let e = '';
      return (
        [...t].forEach((i) => {
          i.nodeType === Node.ELEMENT_NODE && (i.hasAttribute('slot') || (e += i.textContent)),
            i.nodeType === Node.TEXT_NODE && (e += i.textContent);
        }),
        e.trim()
      );
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ option: !0, 'option--current': this.current, 'option--disabled': this.disabled, 'option--selected': this.selected, 'option--hover': this.hasHover })}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `;
    }
  };
Lt.styles = [D, Bn];
Lt.dependencies = { 'sl-icon': j };
r([k('.option__label')], Lt.prototype, 'defaultSlot', 2);
r([L()], Lt.prototype, 'current', 2);
r([L()], Lt.prototype, 'selected', 2);
r([L()], Lt.prototype, 'hasHover', 2);
r([l({ reflect: !0 })], Lt.prototype, 'value', 2);
r([l({ type: Boolean, reflect: !0 })], Lt.prototype, 'disabled', 2);
r([x('disabled')], Lt.prototype, 'handleDisabledChange', 1);
r([x('selected')], Lt.prototype, 'handleSelectedChange', 1);
r([x('value')], Lt.prototype, 'handleValueChange', 1);
Lt.define('sl-option');
U.define('sl-popup');
var Vn = T`
  :host {
    --height: 1rem;
    --track-color: var(--sl-color-neutral-200);
    --indicator-color: var(--sl-color-primary-600);
    --label-color: var(--sl-color-neutral-0);

    display: block;
  }

  .progress-bar {
    position: relative;
    background-color: var(--track-color);
    height: var(--height);
    border-radius: var(--sl-border-radius-pill);
    box-shadow: inset var(--sl-shadow-small);
    overflow: hidden;
  }

  .progress-bar__indicator {
    height: 100%;
    font-family: var(--sl-font-sans);
    font-size: 12px;
    font-weight: var(--sl-font-weight-normal);
    background-color: var(--indicator-color);
    color: var(--label-color);
    text-align: center;
    line-height: var(--height);
    white-space: nowrap;
    overflow: hidden;
    transition:
      400ms width,
      400ms background-color;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Indeterminate */
  .progress-bar--indeterminate .progress-bar__indicator {
    position: absolute;
    animation: indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1);
  }

  .progress-bar--indeterminate.progress-bar--rtl .progress-bar__indicator {
    animation-name: indeterminate-rtl;
  }

  @media (forced-colors: active) {
    .progress-bar {
      outline: solid 1px SelectedItem;
      background-color: var(--sl-color-neutral-0);
    }

    .progress-bar__indicator {
      outline: solid 1px SelectedItem;
      background-color: SelectedItem;
    }
  }

  @keyframes indeterminate {
    0% {
      left: -50%;
      width: 50%;
    }
    75%,
    100% {
      left: 100%;
      width: 50%;
    }
  }

  @keyframes indeterminate-rtl {
    0% {
      right: -50%;
      width: 50%;
    }
    75%,
    100% {
      right: 100%;
      width: 50%;
    }
  }
`,
  hi = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.value = 0),
        (this.indeterminate = !1),
        (this.label = '');
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ 'progress-bar': !0, 'progress-bar--indeterminate': this.indeterminate, 'progress-bar--rtl': this.localize.dir() === 'rtl' })}
        role="progressbar"
        title=${z(this.title)}
        aria-label=${this.label.length > 0 ? this.label : this.localize.term('progress')}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate ? 0 : this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${yt({ width: `${this.value}%` })}>
          ${this.indeterminate ? '' : y` <slot part="label" class="progress-bar__label"></slot> `}
        </div>
      </div>
    `;
    }
  };
hi.styles = [D, Vn];
r([l({ type: Number, reflect: !0 })], hi.prototype, 'value', 2);
r([l({ type: Boolean, reflect: !0 })], hi.prototype, 'indeterminate', 2);
r([l()], hi.prototype, 'label', 2);
hi.define('sl-progress-bar');
var Nn = T`
  :host {
    display: contents;
  }
`,
  Yt = class extends E {
    constructor() {
      super(...arguments),
        (this.attrOldValue = !1),
        (this.charData = !1),
        (this.charDataOldValue = !1),
        (this.childList = !1),
        (this.disabled = !1),
        (this.handleMutation = (t) => {
          this.emit('sl-mutation', { detail: { mutationList: t } });
        });
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.mutationObserver = new MutationObserver(this.handleMutation)),
        this.disabled || this.startObserver();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.stopObserver();
    }
    startObserver() {
      const t = typeof this.attr == 'string' && this.attr.length > 0,
        e = t && this.attr !== '*' ? this.attr.split(' ') : void 0;
      try {
        this.mutationObserver.observe(this, {
          subtree: !0,
          childList: this.childList,
          attributes: t,
          attributeFilter: e,
          attributeOldValue: this.attrOldValue,
          characterData: this.charData,
          characterDataOldValue: this.charDataOldValue,
        });
      } catch {}
    }
    stopObserver() {
      this.mutationObserver.disconnect();
    }
    handleDisabledChange() {
      this.disabled ? this.stopObserver() : this.startObserver();
    }
    handleChange() {
      this.stopObserver(), this.startObserver();
    }
    render() {
      return y` <slot></slot> `;
    }
  };
Yt.styles = [D, Nn];
r([l({ reflect: !0 })], Yt.prototype, 'attr', 2);
r([l({ attribute: 'attr-old-value', type: Boolean, reflect: !0 })], Yt.prototype, 'attrOldValue', 2);
r([l({ attribute: 'char-data', type: Boolean, reflect: !0 })], Yt.prototype, 'charData', 2);
r([l({ attribute: 'char-data-old-value', type: Boolean, reflect: !0 })], Yt.prototype, 'charDataOldValue', 2);
r([l({ attribute: 'child-list', type: Boolean, reflect: !0 })], Yt.prototype, 'childList', 2);
r([l({ type: Boolean, reflect: !0 })], Yt.prototype, 'disabled', 2);
r([x('disabled')], Yt.prototype, 'handleDisabledChange', 1);
r(
  [
    x('attr', { waitUntilFirstUpdate: !0 }),
    x('attr-old-value', { waitUntilFirstUpdate: !0 }),
    x('char-data', { waitUntilFirstUpdate: !0 }),
    x('char-data-old-value', { waitUntilFirstUpdate: !0 }),
    x('childList', { waitUntilFirstUpdate: !0 }),
  ],
  Yt.prototype,
  'handleChange',
  1
);
Yt.define('sl-mutation-observer');
var Hn = T`
  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`,
  zs = class extends E {
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'menu');
    }
    handleClick(t) {
      const e = ['menuitem', 'menuitemcheckbox'],
        i = t.composedPath(),
        s = i.find((c) => {
          var d;
          return e.includes(((d = c == null ? void 0 : c.getAttribute) == null ? void 0 : d.call(c, 'role')) || '');
        });
      if (
        !s ||
        i.find((c) => {
          var d;
          return ((d = c == null ? void 0 : c.getAttribute) == null ? void 0 : d.call(c, 'role')) === 'menu';
        }) !== this
      )
        return;
      const n = s;
      n.type === 'checkbox' && (n.checked = !n.checked), this.emit('sl-select', { detail: { item: n } });
    }
    handleKeyDown(t) {
      if (t.key === 'Enter' || t.key === ' ') {
        const e = this.getCurrentItem();
        t.preventDefault(), t.stopPropagation(), e == null || e.click();
      } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(t.key)) {
        const e = this.getAllItems(),
          i = this.getCurrentItem();
        let s = i ? e.indexOf(i) : 0;
        e.length > 0 &&
          (t.preventDefault(),
          t.stopPropagation(),
          t.key === 'ArrowDown'
            ? s++
            : t.key === 'ArrowUp'
              ? s--
              : t.key === 'Home'
                ? (s = 0)
                : t.key === 'End' && (s = e.length - 1),
          s < 0 && (s = e.length - 1),
          s > e.length - 1 && (s = 0),
          this.setCurrentItem(e[s]),
          e[s].focus());
      }
    }
    handleMouseDown(t) {
      const e = t.target;
      this.isMenuItem(e) && this.setCurrentItem(e);
    }
    handleSlotChange() {
      const t = this.getAllItems();
      t.length > 0 && this.setCurrentItem(t[0]);
    }
    isMenuItem(t) {
      var e;
      return (
        t.tagName.toLowerCase() === 'sl-menu-item' ||
        ['menuitem', 'menuitemcheckbox', 'menuitemradio'].includes((e = t.getAttribute('role')) != null ? e : '')
      );
    }
    getAllItems() {
      return [...this.defaultSlot.assignedElements({ flatten: !0 })].filter((t) => !(t.inert || !this.isMenuItem(t)));
    }
    getCurrentItem() {
      return this.getAllItems().find((t) => t.getAttribute('tabindex') === '0');
    }
    setCurrentItem(t) {
      this.getAllItems().forEach((i) => {
        i.setAttribute('tabindex', i === t ? '0' : '-1');
      });
    }
    render() {
      return y`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `;
    }
  };
zs.styles = [D, Hn];
r([k('slot')], zs.prototype, 'defaultSlot', 2);
zs.define('sl-menu');
var Un = T`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`,
  R = class extends E {
    constructor() {
      super(...arguments),
        (this.formControlController = new Zt(this, { assumeInteractionOn: ['sl-blur', 'sl-input'] })),
        (this.hasSlotController = new vt(this, 'help-text', 'label')),
        (this.localize = new N(this)),
        (this.hasFocus = !1),
        (this.title = ''),
        (this.__numberInput = Object.assign(document.createElement('input'), { type: 'number' })),
        (this.__dateInput = Object.assign(document.createElement('input'), { type: 'date' })),
        (this.type = 'text'),
        (this.name = ''),
        (this.value = ''),
        (this.defaultValue = ''),
        (this.size = 'medium'),
        (this.filled = !1),
        (this.pill = !1),
        (this.label = ''),
        (this.helpText = ''),
        (this.clearable = !1),
        (this.disabled = !1),
        (this.placeholder = ''),
        (this.readonly = !1),
        (this.passwordToggle = !1),
        (this.passwordVisible = !1),
        (this.noSpinButtons = !1),
        (this.form = ''),
        (this.required = !1),
        (this.spellcheck = !0);
    }
    get valueAsDate() {
      var t;
      return (
        (this.__dateInput.type = this.type),
        (this.__dateInput.value = this.value),
        ((t = this.input) == null ? void 0 : t.valueAsDate) || this.__dateInput.valueAsDate
      );
    }
    set valueAsDate(t) {
      (this.__dateInput.type = this.type), (this.__dateInput.valueAsDate = t), (this.value = this.__dateInput.value);
    }
    get valueAsNumber() {
      var t;
      return (
        (this.__numberInput.value = this.value),
        ((t = this.input) == null ? void 0 : t.valueAsNumber) || this.__numberInput.valueAsNumber
      );
    }
    set valueAsNumber(t) {
      (this.__numberInput.valueAsNumber = t), (this.value = this.__numberInput.value);
    }
    get validity() {
      return this.input.validity;
    }
    get validationMessage() {
      return this.input.validationMessage;
    }
    firstUpdated() {
      this.formControlController.updateValidity();
    }
    handleBlur() {
      (this.hasFocus = !1), this.emit('sl-blur');
    }
    handleChange() {
      (this.value = this.input.value), this.emit('sl-change');
    }
    handleClearClick(t) {
      t.preventDefault(),
        this.value !== '' && ((this.value = ''), this.emit('sl-clear'), this.emit('sl-input'), this.emit('sl-change')),
        this.input.focus();
    }
    handleFocus() {
      (this.hasFocus = !0), this.emit('sl-focus');
    }
    handleInput() {
      (this.value = this.input.value), this.formControlController.updateValidity(), this.emit('sl-input');
    }
    handleInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    handleKeyDown(t) {
      const e = t.metaKey || t.ctrlKey || t.shiftKey || t.altKey;
      t.key === 'Enter' &&
        !e &&
        setTimeout(() => {
          !t.defaultPrevented && !t.isComposing && this.formControlController.submit();
        });
    }
    handlePasswordToggle() {
      this.passwordVisible = !this.passwordVisible;
    }
    handleDisabledChange() {
      this.formControlController.setValidity(this.disabled);
    }
    handleStepChange() {
      (this.input.step = String(this.step)), this.formControlController.updateValidity();
    }
    async handleValueChange() {
      await this.updateComplete, this.formControlController.updateValidity();
    }
    focus(t) {
      this.input.focus(t);
    }
    blur() {
      this.input.blur();
    }
    select() {
      this.input.select();
    }
    setSelectionRange(t, e, i = 'none') {
      this.input.setSelectionRange(t, e, i);
    }
    setRangeText(t, e, i, s = 'preserve') {
      const o = e ?? this.input.selectionStart,
        a = i ?? this.input.selectionEnd;
      this.input.setRangeText(t, o, a, s), this.value !== this.input.value && (this.value = this.input.value);
    }
    showPicker() {
      'showPicker' in HTMLInputElement.prototype && this.input.showPicker();
    }
    stepUp() {
      this.input.stepUp(), this.value !== this.input.value && (this.value = this.input.value);
    }
    stepDown() {
      this.input.stepDown(), this.value !== this.input.value && (this.value = this.input.value);
    }
    checkValidity() {
      return this.input.checkValidity();
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return this.input.reportValidity();
    }
    setCustomValidity(t) {
      this.input.setCustomValidity(t), this.formControlController.updateValidity();
    }
    render() {
      const t = this.hasSlotController.test('label'),
        e = this.hasSlotController.test('help-text'),
        i = this.label ? !0 : !!t,
        s = this.helpText ? !0 : !!e,
        a =
          this.clearable &&
          !this.disabled &&
          !this.readonly &&
          (typeof this.value == 'number' || this.value.length > 0);
      return y`
      <div
        part="form-control"
        class=${I({ 'form-control': !0, 'form-control--small': this.size === 'small', 'form-control--medium': this.size === 'medium', 'form-control--large': this.size === 'large', 'form-control--has-label': i, 'form-control--has-help-text': s })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${i ? 'false' : 'true'}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${I({ input: !0, 'input--small': this.size === 'small', 'input--medium': this.size === 'medium', 'input--large': this.size === 'large', 'input--pill': this.pill, 'input--standard': !this.filled, 'input--filled': this.filled, 'input--disabled': this.disabled, 'input--focused': this.hasFocus, 'input--empty': !this.value, 'input--no-spin-buttons': this.noSpinButtons })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
              title=${this.title}
              name=${z(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${z(this.placeholder)}
              minlength=${z(this.minlength)}
              maxlength=${z(this.maxlength)}
              min=${z(this.min)}
              max=${z(this.max)}
              step=${z(this.step)}
              .value=${be(this.value)}
              autocapitalize=${z(this.autocapitalize)}
              autocomplete=${z(this.autocomplete)}
              autocorrect=${z(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${z(this.pattern)}
              enterkeyhint=${z(this.enterkeyhint)}
              inputmode=${z(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${
              a
                ? y`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term('clearEntry')}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `
                : ''
            }
            ${
              this.passwordToggle && !this.disabled
                ? y`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible ? 'hidePassword' : 'showPassword')}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${
                      this.passwordVisible
                        ? y`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `
                        : y`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `
                    }
                  </button>
                `
                : ''
            }

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s ? 'false' : 'true'}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
    }
  };
R.styles = [D, ve, Un];
R.dependencies = { 'sl-icon': j };
r([k('.input__control')], R.prototype, 'input', 2);
r([L()], R.prototype, 'hasFocus', 2);
r([l()], R.prototype, 'title', 2);
r([l({ reflect: !0 })], R.prototype, 'type', 2);
r([l()], R.prototype, 'name', 2);
r([l()], R.prototype, 'value', 2);
r([Ie()], R.prototype, 'defaultValue', 2);
r([l({ reflect: !0 })], R.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], R.prototype, 'filled', 2);
r([l({ type: Boolean, reflect: !0 })], R.prototype, 'pill', 2);
r([l()], R.prototype, 'label', 2);
r([l({ attribute: 'help-text' })], R.prototype, 'helpText', 2);
r([l({ type: Boolean })], R.prototype, 'clearable', 2);
r([l({ type: Boolean, reflect: !0 })], R.prototype, 'disabled', 2);
r([l()], R.prototype, 'placeholder', 2);
r([l({ type: Boolean, reflect: !0 })], R.prototype, 'readonly', 2);
r([l({ attribute: 'password-toggle', type: Boolean })], R.prototype, 'passwordToggle', 2);
r([l({ attribute: 'password-visible', type: Boolean })], R.prototype, 'passwordVisible', 2);
r([l({ attribute: 'no-spin-buttons', type: Boolean })], R.prototype, 'noSpinButtons', 2);
r([l({ reflect: !0 })], R.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], R.prototype, 'required', 2);
r([l()], R.prototype, 'pattern', 2);
r([l({ type: Number })], R.prototype, 'minlength', 2);
r([l({ type: Number })], R.prototype, 'maxlength', 2);
r([l()], R.prototype, 'min', 2);
r([l()], R.prototype, 'max', 2);
r([l()], R.prototype, 'step', 2);
r([l()], R.prototype, 'autocapitalize', 2);
r([l()], R.prototype, 'autocorrect', 2);
r([l()], R.prototype, 'autocomplete', 2);
r([l({ type: Boolean })], R.prototype, 'autofocus', 2);
r([l()], R.prototype, 'enterkeyhint', 2);
r(
  [
    l({
      type: Boolean,
      converter: { fromAttribute: (t) => !(!t || t === 'false'), toAttribute: (t) => (t ? 'true' : 'false') },
    }),
  ],
  R.prototype,
  'spellcheck',
  2
);
r([l()], R.prototype, 'inputmode', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], R.prototype, 'handleDisabledChange', 1);
r([x('step', { waitUntilFirstUpdate: !0 })], R.prototype, 'handleStepChange', 1);
r([x('value', { waitUntilFirstUpdate: !0 })], R.prototype, 'handleValueChange', 1);
R.define('sl-input');
var qn = T`
  :host {
    --submenu-offset: -2px;

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(sl-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading sl-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
    );
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  sl-popup::part(popup) {
    box-shadow: var(--sl-shadow-large);
    z-index: var(--sl-z-index-dropdown);
    margin-left: var(--submenu-offset);
  }

  .menu-item--rtl sl-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Qe = (t, e) => {
    var s;
    const i = t._$AN;
    if (i === void 0) return !1;
    for (const o of i) (s = o._$AO) == null || s.call(o, e, !1), Qe(o, e);
    return !0;
  },
  Ti = (t) => {
    let e, i;
    do {
      if ((e = t._$AM) === void 0) break;
      (i = e._$AN), i.delete(t), (t = e);
    } while ((i == null ? void 0 : i.size) === 0);
  },
  Uo = (t) => {
    for (let e; (e = t._$AM); t = e) {
      let i = e._$AN;
      if (i === void 0) e._$AN = i = new Set();
      else if (i.has(t)) break;
      i.add(t), Kn(e);
    }
  };
function Wn(t) {
  this._$AN !== void 0 ? (Ti(this), (this._$AM = t), Uo(this)) : (this._$AM = t);
}
function jn(t, e = !1, i = 0) {
  const s = this._$AH,
    o = this._$AN;
  if (o !== void 0 && o.size !== 0)
    if (e)
      if (Array.isArray(s)) for (let a = i; a < s.length; a++) Qe(s[a], !1), Ti(s[a]);
      else s != null && (Qe(s, !1), Ti(s));
    else Qe(this, t);
}
const Kn = (t) => {
  t.type == Ut.CHILD && (t._$AP ?? (t._$AP = jn), t._$AQ ?? (t._$AQ = Wn));
};
class Yn extends ni {
  constructor() {
    super(...arguments), (this._$AN = void 0);
  }
  _$AT(e, i, s) {
    super._$AT(e, i, s), Uo(this), (this.isConnected = e._$AU);
  }
  _$AO(e, i = !0) {
    var s, o;
    e !== this.isConnected &&
      ((this.isConnected = e),
      e ? (s = this.reconnected) == null || s.call(this) : (o = this.disconnected) == null || o.call(this)),
      i && (Qe(this, e), Ti(this));
  }
  setValue(e) {
    if (Ro(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const i = [...this._$Ct._$AH];
      (i[this._$Ci] = e), this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {}
  reconnected() {}
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Xn = () => new Gn();
class Gn {}
const Xi = new WeakMap(),
  Qn = ai(
    class extends Yn {
      render(t) {
        return K;
      }
      update(t, [e]) {
        var s;
        const i = e !== this.Y;
        return (
          i && this.Y !== void 0 && this.rt(void 0),
          (i || this.lt !== this.ct) &&
            ((this.Y = e), (this.ht = (s = t.options) == null ? void 0 : s.host), this.rt((this.ct = t.element))),
          K
        );
      }
      rt(t) {
        if ((this.isConnected || (t = void 0), typeof this.Y == 'function')) {
          const e = this.ht ?? globalThis;
          let i = Xi.get(e);
          i === void 0 && ((i = new WeakMap()), Xi.set(e, i)),
            i.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0),
            i.set(this.Y, t),
            t !== void 0 && this.Y.call(this.ht, t);
        } else this.Y.value = t;
      }
      get lt() {
        var t, e;
        return typeof this.Y == 'function'
          ? (t = Xi.get(this.ht ?? globalThis)) == null
            ? void 0
            : t.get(this.Y)
          : (e = this.Y) == null
            ? void 0
            : e.value;
      }
      disconnected() {
        this.lt === this.ct && this.rt(void 0);
      }
      reconnected() {
        this.rt(this.ct);
      }
    }
  );
var Zn = class {
    constructor(t, e) {
      (this.popupRef = Xn()),
        (this.enableSubmenuTimer = -1),
        (this.isConnected = !1),
        (this.isPopupConnected = !1),
        (this.skidding = 0),
        (this.submenuOpenDelay = 100),
        (this.handleMouseMove = (i) => {
          this.host.style.setProperty('--safe-triangle-cursor-x', `${i.clientX}px`),
            this.host.style.setProperty('--safe-triangle-cursor-y', `${i.clientY}px`);
        }),
        (this.handleMouseOver = () => {
          this.hasSlotController.test('submenu') && this.enableSubmenu();
        }),
        (this.handleKeyDown = (i) => {
          switch (i.key) {
            case 'Escape':
            case 'Tab':
              this.disableSubmenu();
              break;
            case 'ArrowLeft':
              i.target !== this.host &&
                (i.preventDefault(), i.stopPropagation(), this.host.focus(), this.disableSubmenu());
              break;
            case 'ArrowRight':
            case 'Enter':
            case ' ':
              this.handleSubmenuEntry(i);
              break;
          }
        }),
        (this.handleClick = (i) => {
          var s;
          i.target === this.host
            ? (i.preventDefault(), i.stopPropagation())
            : i.target instanceof Element &&
              (i.target.tagName === 'sl-menu-item' || ((s = i.target.role) != null && s.startsWith('menuitem'))) &&
              this.disableSubmenu();
        }),
        (this.handleFocusOut = (i) => {
          (i.relatedTarget && i.relatedTarget instanceof Element && this.host.contains(i.relatedTarget)) ||
            this.disableSubmenu();
        }),
        (this.handlePopupMouseover = (i) => {
          i.stopPropagation();
        }),
        (this.handlePopupReposition = () => {
          const i = this.host.renderRoot.querySelector("slot[name='submenu']"),
            s = i == null ? void 0 : i.assignedElements({ flatten: !0 }).filter((h) => h.localName === 'sl-menu')[0],
            o = getComputedStyle(this.host).direction === 'rtl';
          if (!s) return;
          const { left: a, top: n, width: c, height: d } = s.getBoundingClientRect();
          this.host.style.setProperty('--safe-triangle-submenu-start-x', `${o ? a + c : a}px`),
            this.host.style.setProperty('--safe-triangle-submenu-start-y', `${n}px`),
            this.host.style.setProperty('--safe-triangle-submenu-end-x', `${o ? a + c : a}px`),
            this.host.style.setProperty('--safe-triangle-submenu-end-y', `${n + d}px`);
        }),
        (this.host = t).addController(this),
        (this.hasSlotController = e);
    }
    hostConnected() {
      this.hasSlotController.test('submenu') && !this.host.disabled && this.addListeners();
    }
    hostDisconnected() {
      this.removeListeners();
    }
    hostUpdated() {
      this.hasSlotController.test('submenu') && !this.host.disabled
        ? (this.addListeners(), this.updateSkidding())
        : this.removeListeners();
    }
    addListeners() {
      this.isConnected ||
        (this.host.addEventListener('mousemove', this.handleMouseMove),
        this.host.addEventListener('mouseover', this.handleMouseOver),
        this.host.addEventListener('keydown', this.handleKeyDown),
        this.host.addEventListener('click', this.handleClick),
        this.host.addEventListener('focusout', this.handleFocusOut),
        (this.isConnected = !0)),
        this.isPopupConnected ||
          (this.popupRef.value &&
            (this.popupRef.value.addEventListener('mouseover', this.handlePopupMouseover),
            this.popupRef.value.addEventListener('sl-reposition', this.handlePopupReposition),
            (this.isPopupConnected = !0)));
    }
    removeListeners() {
      this.isConnected &&
        (this.host.removeEventListener('mousemove', this.handleMouseMove),
        this.host.removeEventListener('mouseover', this.handleMouseOver),
        this.host.removeEventListener('keydown', this.handleKeyDown),
        this.host.removeEventListener('click', this.handleClick),
        this.host.removeEventListener('focusout', this.handleFocusOut),
        (this.isConnected = !1)),
        this.isPopupConnected &&
          this.popupRef.value &&
          (this.popupRef.value.removeEventListener('mouseover', this.handlePopupMouseover),
          this.popupRef.value.removeEventListener('sl-reposition', this.handlePopupReposition),
          (this.isPopupConnected = !1));
    }
    handleSubmenuEntry(t) {
      const e = this.host.renderRoot.querySelector("slot[name='submenu']");
      if (!e) {
        console.error('Cannot activate a submenu if no corresponding menuitem can be found.', this);
        return;
      }
      let i = null;
      for (const s of e.assignedElements())
        if (((i = s.querySelectorAll("sl-menu-item, [role^='menuitem']")), i.length !== 0)) break;
      if (!(!i || i.length === 0)) {
        i[0].setAttribute('tabindex', '0');
        for (let s = 1; s !== i.length; ++s) i[s].setAttribute('tabindex', '-1');
        this.popupRef.value &&
          (t.preventDefault(),
          t.stopPropagation(),
          this.popupRef.value.active
            ? i[0] instanceof HTMLElement && i[0].focus()
            : (this.enableSubmenu(!1),
              this.host.updateComplete.then(() => {
                i[0] instanceof HTMLElement && i[0].focus();
              }),
              this.host.requestUpdate()));
      }
    }
    setSubmenuState(t) {
      this.popupRef.value &&
        this.popupRef.value.active !== t &&
        ((this.popupRef.value.active = t), this.host.requestUpdate());
    }
    enableSubmenu(t = !0) {
      t
        ? (window.clearTimeout(this.enableSubmenuTimer),
          (this.enableSubmenuTimer = window.setTimeout(() => {
            this.setSubmenuState(!0);
          }, this.submenuOpenDelay)))
        : this.setSubmenuState(!0);
    }
    disableSubmenu() {
      window.clearTimeout(this.enableSubmenuTimer), this.setSubmenuState(!1);
    }
    updateSkidding() {
      var t;
      if (!((t = this.host.parentElement) != null && t.computedStyleMap)) return;
      const e = this.host.parentElement.computedStyleMap(),
        s = ['padding-top', 'border-top-width', 'margin-top'].reduce((o, a) => {
          var n;
          const c = (n = e.get(a)) != null ? n : new CSSUnitValue(0, 'px'),
            h = (c instanceof CSSUnitValue ? c : new CSSUnitValue(0, 'px')).to('px');
          return o - h.value;
        }, 0);
      this.skidding = s;
    }
    isExpanded() {
      return this.popupRef.value ? this.popupRef.value.active : !1;
    }
    renderSubmenu() {
      const t = getComputedStyle(this.host).direction === 'rtl';
      return this.isConnected
        ? y`
      <sl-popup
        ${Qn(this.popupRef)}
        placement=${t ? 'left-start' : 'right-start'}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot name="submenu"></slot>
      </sl-popup>
    `
        : y` <slot name="submenu" hidden></slot> `;
    }
  },
  St = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.type = 'normal'),
        (this.checked = !1),
        (this.value = ''),
        (this.loading = !1),
        (this.disabled = !1),
        (this.hasSlotController = new vt(this, 'submenu')),
        (this.submenuController = new Zn(this, this.hasSlotController)),
        (this.handleHostClick = (t) => {
          this.disabled && (t.preventDefault(), t.stopImmediatePropagation());
        }),
        (this.handleMouseOver = (t) => {
          this.focus(), t.stopPropagation();
        });
    }
    connectedCallback() {
      super.connectedCallback(),
        this.addEventListener('click', this.handleHostClick),
        this.addEventListener('mouseover', this.handleMouseOver);
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        this.removeEventListener('click', this.handleHostClick),
        this.removeEventListener('mouseover', this.handleMouseOver);
    }
    handleDefaultSlotChange() {
      const t = this.getTextLabel();
      if (typeof this.cachedTextLabel > 'u') {
        this.cachedTextLabel = t;
        return;
      }
      t !== this.cachedTextLabel &&
        ((this.cachedTextLabel = t), this.emit('slotchange', { bubbles: !0, composed: !1, cancelable: !1 }));
    }
    handleCheckedChange() {
      if (this.checked && this.type !== 'checkbox') {
        (this.checked = !1),
          console.error('The checked attribute can only be used on menu items with type="checkbox"', this);
        return;
      }
      this.type === 'checkbox'
        ? this.setAttribute('aria-checked', this.checked ? 'true' : 'false')
        : this.removeAttribute('aria-checked');
    }
    handleDisabledChange() {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    handleTypeChange() {
      this.type === 'checkbox'
        ? (this.setAttribute('role', 'menuitemcheckbox'),
          this.setAttribute('aria-checked', this.checked ? 'true' : 'false'))
        : (this.setAttribute('role', 'menuitem'), this.removeAttribute('aria-checked'));
    }
    getTextLabel() {
      return Xa(this.defaultSlot);
    }
    isSubmenu() {
      return this.hasSlotController.test('submenu');
    }
    render() {
      const t = this.localize.dir() === 'rtl',
        e = this.submenuController.isExpanded();
      return y`
      <div
        id="anchor"
        part="base"
        class=${I({ 'menu-item': !0, 'menu-item--rtl': t, 'menu-item--checked': this.checked, 'menu-item--disabled': this.disabled, 'menu-item--loading': this.loading, 'menu-item--has-submenu': this.isSubmenu(), 'menu-item--submenu-expanded': e })}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${!!e}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${t ? 'chevron-left' : 'chevron-right'} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading ? y` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> ` : ''}
      </div>
    `;
    }
  };
St.styles = [D, qn];
St.dependencies = { 'sl-icon': j, 'sl-popup': U, 'sl-spinner': li };
r([k('slot:not([name])')], St.prototype, 'defaultSlot', 2);
r([k('.menu-item')], St.prototype, 'menuItem', 2);
r([l()], St.prototype, 'type', 2);
r([l({ type: Boolean, reflect: !0 })], St.prototype, 'checked', 2);
r([l()], St.prototype, 'value', 2);
r([l({ type: Boolean, reflect: !0 })], St.prototype, 'loading', 2);
r([l({ type: Boolean, reflect: !0 })], St.prototype, 'disabled', 2);
r([x('checked')], St.prototype, 'handleCheckedChange', 1);
r([x('disabled')], St.prototype, 'handleDisabledChange', 1);
r([x('type')], St.prototype, 'handleTypeChange', 1);
St.define('sl-menu-item');
var Jn = T`
  :host {
    display: block;
  }

  .menu-label {
    display: inline-block;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-large);
    user-select: none;
    -webkit-user-select: none;
  }
`,
  qo = class extends E {
    render() {
      return y` <slot part="base" class="menu-label"></slot> `;
    }
  };
qo.styles = [D, Jn];
qo.define('sl-menu-label');
var tl = T`
  :host {
    --divider-width: 2px;
    --handle-size: 2.5rem;

    display: inline-block;
    position: relative;
  }

  .image-comparer {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .image-comparer__before,
  .image-comparer__after {
    display: block;
    pointer-events: none;
  }

  .image-comparer__before::slotted(img),
  .image-comparer__after::slotted(img),
  .image-comparer__before::slotted(svg),
  .image-comparer__after::slotted(svg) {
    display: block;
    max-width: 100% !important;
    height: auto;
  }

  .image-comparer__after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .image-comparer__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: var(--divider-width);
    height: 100%;
    background-color: var(--sl-color-neutral-0);
    translate: calc(var(--divider-width) / -2);
    cursor: ew-resize;
  }

  .image-comparer__handle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(50% - (var(--handle-size) / 2));
    width: var(--handle-size);
    height: var(--handle-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: var(--sl-border-radius-circle);
    font-size: calc(var(--handle-size) * 0.5);
    color: var(--sl-color-neutral-700);
    cursor: inherit;
    z-index: 10;
  }

  .image-comparer__handle:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }
`,
  xe = class extends E {
    constructor() {
      super(...arguments), (this.localize = new N(this)), (this.position = 50);
    }
    handleDrag(t) {
      const { width: e } = this.base.getBoundingClientRect(),
        i = this.localize.dir() === 'rtl';
      t.preventDefault(),
        Ge(this.base, {
          onMove: (s) => {
            (this.position = parseFloat(it((s / e) * 100, 0, 100).toFixed(2))),
              i && (this.position = 100 - this.position);
          },
          initialEvent: t,
        });
    }
    handleKeyDown(t) {
      const e = this.localize.dir() === 'ltr',
        i = this.localize.dir() === 'rtl';
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(t.key)) {
        const s = t.shiftKey ? 10 : 1;
        let o = this.position;
        t.preventDefault(),
          ((e && t.key === 'ArrowLeft') || (i && t.key === 'ArrowRight')) && (o -= s),
          ((e && t.key === 'ArrowRight') || (i && t.key === 'ArrowLeft')) && (o += s),
          t.key === 'Home' && (o = 0),
          t.key === 'End' && (o = 100),
          (o = it(o, 0, 100)),
          (this.position = o);
      }
    }
    handlePositionChange() {
      this.emit('sl-change');
    }
    render() {
      const t = this.localize.dir() === 'rtl';
      return y`
      <div
        part="base"
        id="image-comparer"
        class=${I({ 'image-comparer': !0, 'image-comparer--rtl': t })}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <div part="before" class="image-comparer__before">
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${yt({ clipPath: t ? `inset(0 0 0 ${100 - this.position}%)` : `inset(0 ${100 - this.position}% 0 0)` })}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${yt({ left: t ? `${100 - this.position}%` : `${this.position}%` })}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <div
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <slot name="handle">
              <sl-icon library="system" name="grip-vertical"></sl-icon>
            </slot>
          </div>
        </div>
      </div>
    `;
    }
  };
xe.styles = [D, tl];
xe.scopedElement = { 'sl-icon': j };
r([k('.image-comparer')], xe.prototype, 'base', 2);
r([k('.image-comparer__handle')], xe.prototype, 'handle', 2);
r([l({ type: Number, reflect: !0 })], xe.prototype, 'position', 2);
r([x('position', { waitUntilFirstUpdate: !0 })], xe.prototype, 'handlePositionChange', 1);
xe.define('sl-image-comparer');
var el = T`
  :host {
    display: block;
  }
`,
  Gi = new Map();
function il(t, e = 'cors') {
  const i = Gi.get(t);
  if (i !== void 0) return Promise.resolve(i);
  const s = fetch(t, { mode: e }).then(async (o) => {
    const a = { ok: o.ok, status: o.status, html: await o.text() };
    return Gi.set(t, a), a;
  });
  return Gi.set(t, s), s;
}
var Pe = class extends E {
  constructor() {
    super(...arguments), (this.mode = 'cors'), (this.allowScripts = !1);
  }
  executeScript(t) {
    const e = document.createElement('script');
    [...t.attributes].forEach((i) => e.setAttribute(i.name, i.value)),
      (e.textContent = t.textContent),
      t.parentNode.replaceChild(e, t);
  }
  async handleSrcChange() {
    try {
      const t = this.src,
        e = await il(t, this.mode);
      if (t !== this.src) return;
      if (!e.ok) {
        this.emit('sl-error', { detail: { status: e.status } });
        return;
      }
      (this.innerHTML = e.html),
        this.allowScripts && [...this.querySelectorAll('script')].forEach((i) => this.executeScript(i)),
        this.emit('sl-load');
    } catch {
      this.emit('sl-error', { detail: { status: -1 } });
    }
  }
  render() {
    return y`<slot></slot>`;
  }
};
Pe.styles = [D, el];
r([l()], Pe.prototype, 'src', 2);
r([l()], Pe.prototype, 'mode', 2);
r([l({ attribute: 'allow-scripts', type: Boolean })], Pe.prototype, 'allowScripts', 2);
r([x('src')], Pe.prototype, 'handleSrcChange', 1);
Pe.define('sl-include');
j.define('sl-icon');
at.define('sl-icon-button');
var Ri = class extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.value = 0),
      (this.unit = 'byte'),
      (this.display = 'short');
  }
  render() {
    if (isNaN(this.value)) return '';
    const t = ['', 'kilo', 'mega', 'giga', 'tera'],
      e = ['', 'kilo', 'mega', 'giga', 'tera', 'peta'],
      i = this.unit === 'bit' ? t : e,
      s = Math.max(0, Math.min(Math.floor(Math.log10(this.value) / 3), i.length - 1)),
      o = i[s] + this.unit,
      a = parseFloat((this.value / Math.pow(1e3, s)).toPrecision(3));
    return this.localize.number(a, { style: 'unit', unit: o, unitDisplay: this.display });
  }
};
r([l({ type: Number })], Ri.prototype, 'value', 2);
r([l()], Ri.prototype, 'unit', 2);
r([l()], Ri.prototype, 'display', 2);
Ri.define('sl-format-bytes');
var zt = class extends E {
  constructor() {
    super(...arguments), (this.localize = new N(this)), (this.date = new Date()), (this.hourFormat = 'auto');
  }
  render() {
    const t = new Date(this.date),
      e = this.hourFormat === 'auto' ? void 0 : this.hourFormat === '12';
    if (!isNaN(t.getMilliseconds()))
      return y`
      <time datetime=${t.toISOString()}>
        ${this.localize.date(t, { weekday: this.weekday, era: this.era, year: this.year, month: this.month, day: this.day, hour: this.hour, minute: this.minute, second: this.second, timeZoneName: this.timeZoneName, timeZone: this.timeZone, hour12: e })}
      </time>
    `;
  }
};
r([l()], zt.prototype, 'date', 2);
r([l()], zt.prototype, 'weekday', 2);
r([l()], zt.prototype, 'era', 2);
r([l()], zt.prototype, 'year', 2);
r([l()], zt.prototype, 'month', 2);
r([l()], zt.prototype, 'day', 2);
r([l()], zt.prototype, 'hour', 2);
r([l()], zt.prototype, 'minute', 2);
r([l()], zt.prototype, 'second', 2);
r([l({ attribute: 'time-zone-name' })], zt.prototype, 'timeZoneName', 2);
r([l({ attribute: 'time-zone' })], zt.prototype, 'timeZone', 2);
r([l({ attribute: 'hour-format' })], zt.prototype, 'hourFormat', 2);
zt.define('sl-format-date');
var Ft = class extends E {
  constructor() {
    super(...arguments),
      (this.localize = new N(this)),
      (this.value = 0),
      (this.type = 'decimal'),
      (this.noGrouping = !1),
      (this.currency = 'USD'),
      (this.currencyDisplay = 'symbol');
  }
  render() {
    return isNaN(this.value)
      ? ''
      : this.localize.number(this.value, {
          style: this.type,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          useGrouping: !this.noGrouping,
          minimumIntegerDigits: this.minimumIntegerDigits,
          minimumFractionDigits: this.minimumFractionDigits,
          maximumFractionDigits: this.maximumFractionDigits,
          minimumSignificantDigits: this.minimumSignificantDigits,
          maximumSignificantDigits: this.maximumSignificantDigits,
        });
  }
};
r([l({ type: Number })], Ft.prototype, 'value', 2);
r([l()], Ft.prototype, 'type', 2);
r([l({ attribute: 'no-grouping', type: Boolean })], Ft.prototype, 'noGrouping', 2);
r([l()], Ft.prototype, 'currency', 2);
r([l({ attribute: 'currency-display' })], Ft.prototype, 'currencyDisplay', 2);
r([l({ attribute: 'minimum-integer-digits', type: Number })], Ft.prototype, 'minimumIntegerDigits', 2);
r([l({ attribute: 'minimum-fraction-digits', type: Number })], Ft.prototype, 'minimumFractionDigits', 2);
r([l({ attribute: 'maximum-fraction-digits', type: Number })], Ft.prototype, 'maximumFractionDigits', 2);
r([l({ attribute: 'minimum-significant-digits', type: Number })], Ft.prototype, 'minimumSignificantDigits', 2);
r([l({ attribute: 'maximum-significant-digits', type: Number })], Ft.prototype, 'maximumSignificantDigits', 2);
Ft.define('sl-format-number');
var sl = T`
  :host {
    --color: var(--sl-panel-border-color);
    --width: var(--sl-panel-border-width);
    --spacing: var(--sl-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }
`,
  Fi = class extends E {
    constructor() {
      super(...arguments), (this.vertical = !1);
    }
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'separator');
    }
    handleVerticalChange() {
      this.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');
    }
  };
Fi.styles = [D, sl];
r([l({ type: Boolean, reflect: !0 })], Fi.prototype, 'vertical', 2);
r([x('vertical')], Fi.prototype, 'handleVerticalChange', 1);
Fi.define('sl-divider');
var ol = T`
  :host {
    --size: 25rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .drawer {
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .drawer--contained {
    position: absolute;
    z-index: initial;
  }

  .drawer--fixed {
    position: fixed;
    z-index: var(--sl-z-index-drawer);
  }

  .drawer__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-large);
    overflow: auto;
    pointer-events: all;
  }

  .drawer__panel:focus {
    outline: none;
  }

  .drawer--top .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--end .drawer__panel {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    width: var(--size);
    height: 100%;
  }

  .drawer--bottom .drawer__panel {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--start .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: var(--size);
    height: 100%;
  }

  .drawer__header {
    display: flex;
  }

  .drawer__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .drawer__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .drawer__header-actions sl-icon-button,
  .drawer__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .drawer__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .drawer__footer {
    text-align: right;
    padding: var(--footer-spacing);
  }

  .drawer__footer ::slotted(sl-button:not(:last-of-type)) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .drawer:not(.drawer--has-footer) .drawer__footer {
    display: none;
  }

  .drawer__overlay {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
    pointer-events: all;
  }

  .drawer--contained .drawer__overlay {
    display: none;
  }

  @media (forced-colors: active) {
    .drawer__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`,
  io = new WeakMap();
function Wo(t) {
  let e = io.get(t);
  return e || ((e = window.getComputedStyle(t, null)), io.set(t, e)), e;
}
function rl(t) {
  if (typeof t.checkVisibility == 'function') return t.checkVisibility({ checkOpacity: !1, checkVisibilityCSS: !0 });
  const e = Wo(t);
  return e.visibility !== 'hidden' && e.display !== 'none';
}
function al(t) {
  const e = Wo(t),
    { overflowY: i, overflowX: s } = e;
  return i === 'scroll' || s === 'scroll'
    ? !0
    : i !== 'auto' || s !== 'auto'
      ? !1
      : (t.scrollHeight > t.clientHeight && i === 'auto') || (t.scrollWidth > t.clientWidth && s === 'auto');
}
function nl(t) {
  const e = t.tagName.toLowerCase(),
    i = Number(t.getAttribute('tabindex'));
  if ((t.hasAttribute('tabindex') && (isNaN(i) || i <= -1)) || t.hasAttribute('disabled') || t.closest('[inert]'))
    return !1;
  if (e === 'input' && t.getAttribute('type') === 'radio') {
    const a = t.getRootNode(),
      n = `input[type='radio'][name="${t.getAttribute('name')}"]`,
      c = a.querySelector(`${n}:checked`);
    return c ? c === t : a.querySelector(n) === t;
  }
  return rl(t)
    ? ((e === 'audio' || e === 'video') && t.hasAttribute('controls')) ||
      t.hasAttribute('tabindex') ||
      (t.hasAttribute('contenteditable') && t.getAttribute('contenteditable') !== 'false') ||
      ['button', 'input', 'select', 'textarea', 'a', 'audio', 'video', 'summary', 'iframe'].includes(e)
      ? !0
      : al(t)
    : !1;
}
function ll(t) {
  var e, i;
  const s = ds(t),
    o = (e = s[0]) != null ? e : null,
    a = (i = s[s.length - 1]) != null ? i : null;
  return { start: o, end: a };
}
function cl(t, e) {
  var i;
  return ((i = t.getRootNode({ composed: !0 })) == null ? void 0 : i.host) !== e;
}
function ds(t) {
  const e = new WeakMap(),
    i = [];
  function s(o) {
    if (o instanceof Element) {
      if (o.hasAttribute('inert') || o.closest('[inert]') || e.has(o)) return;
      e.set(o, !0),
        !i.includes(o) && nl(o) && i.push(o),
        o instanceof HTMLSlotElement &&
          cl(o, t) &&
          o.assignedElements({ flatten: !0 }).forEach((a) => {
            s(a);
          }),
        o.shadowRoot !== null && o.shadowRoot.mode === 'open' && s(o.shadowRoot);
    }
    for (const a of o.children) s(a);
  }
  return (
    s(t),
    i.sort((o, a) => {
      const n = Number(o.getAttribute('tabindex')) || 0;
      return (Number(a.getAttribute('tabindex')) || 0) - n;
    })
  );
}
function* Es(t = document.activeElement) {
  t != null &&
    (yield t,
    'shadowRoot' in t && t.shadowRoot && t.shadowRoot.mode !== 'closed' && (yield* Ar(Es(t.shadowRoot.activeElement))));
}
function dl() {
  return [...Es()].pop();
}
var He = [],
  jo = class {
    constructor(t) {
      (this.tabDirection = 'forward'),
        (this.handleFocusIn = () => {
          this.isActive() && this.checkFocus();
        }),
        (this.handleKeyDown = (e) => {
          var i;
          if (e.key !== 'Tab' || this.isExternalActivated || !this.isActive()) return;
          const s = dl();
          if (((this.previousFocus = s), this.previousFocus && this.possiblyHasTabbableChildren(this.previousFocus)))
            return;
          e.shiftKey ? (this.tabDirection = 'backward') : (this.tabDirection = 'forward');
          const o = ds(this.element);
          let a = o.findIndex((c) => c === s);
          this.previousFocus = this.currentFocus;
          const n = this.tabDirection === 'forward' ? 1 : -1;
          for (;;) {
            a + n >= o.length ? (a = 0) : a + n < 0 ? (a = o.length - 1) : (a += n),
              (this.previousFocus = this.currentFocus);
            const c = o[a];
            if (
              (this.tabDirection === 'backward' &&
                this.previousFocus &&
                this.possiblyHasTabbableChildren(this.previousFocus)) ||
              (c && this.possiblyHasTabbableChildren(c))
            )
              return;
            e.preventDefault(),
              (this.currentFocus = c),
              (i = this.currentFocus) == null || i.focus({ preventScroll: !1 });
            const d = [...Es()];
            if (d.includes(this.currentFocus) || !d.includes(this.previousFocus)) break;
          }
          setTimeout(() => this.checkFocus());
        }),
        (this.handleKeyUp = () => {
          this.tabDirection = 'forward';
        }),
        (this.element = t),
        (this.elementsWithTabbableControls = ['iframe']);
    }
    activate() {
      He.push(this.element),
        document.addEventListener('focusin', this.handleFocusIn),
        document.addEventListener('keydown', this.handleKeyDown),
        document.addEventListener('keyup', this.handleKeyUp);
    }
    deactivate() {
      (He = He.filter((t) => t !== this.element)),
        (this.currentFocus = null),
        document.removeEventListener('focusin', this.handleFocusIn),
        document.removeEventListener('keydown', this.handleKeyDown),
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    isActive() {
      return He[He.length - 1] === this.element;
    }
    activateExternal() {
      this.isExternalActivated = !0;
    }
    deactivateExternal() {
      this.isExternalActivated = !1;
    }
    checkFocus() {
      if (this.isActive() && !this.isExternalActivated) {
        const t = ds(this.element);
        if (!this.element.matches(':focus-within')) {
          const e = t[0],
            i = t[t.length - 1],
            s = this.tabDirection === 'forward' ? e : i;
          typeof (s == null ? void 0 : s.focus) == 'function' &&
            ((this.currentFocus = s), s.focus({ preventScroll: !1 }));
        }
      }
    }
    possiblyHasTabbableChildren(t) {
      return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase()) || t.hasAttribute('controls');
    }
  };
function so(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
var Et = class extends E {
  constructor() {
    super(...arguments),
      (this.hasSlotController = new vt(this, 'footer')),
      (this.localize = new N(this)),
      (this.modal = new jo(this)),
      (this.open = !1),
      (this.label = ''),
      (this.placement = 'end'),
      (this.contained = !1),
      (this.noHeader = !1),
      (this.handleDocumentKeyDown = (t) => {
        this.contained ||
          (t.key === 'Escape' &&
            this.modal.isActive() &&
            this.open &&
            (t.stopImmediatePropagation(), this.requestClose('keyboard')));
      });
  }
  firstUpdated() {
    (this.drawer.hidden = !this.open),
      this.open && (this.addOpenListeners(), this.contained || (this.modal.activate(), Ye(this)));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Xe(this), this.removeOpenListeners();
  }
  requestClose(t) {
    if (this.emit('sl-request-close', { cancelable: !0, detail: { source: t } }).defaultPrevented) {
      const i = Y(this, 'drawer.denyClose', { dir: this.localize.dir() });
      Q(this.panel, i.keyframes, i.options);
      return;
    }
    this.hide();
  }
  addOpenListeners() {
    var t;
    'CloseWatcher' in window
      ? ((t = this.closeWatcher) == null || t.destroy(),
        this.contained ||
          ((this.closeWatcher = new CloseWatcher()), (this.closeWatcher.onclose = () => this.requestClose('keyboard'))))
      : document.addEventListener('keydown', this.handleDocumentKeyDown);
  }
  removeOpenListeners() {
    var t;
    document.removeEventListener('keydown', this.handleDocumentKeyDown), (t = this.closeWatcher) == null || t.destroy();
  }
  async handleOpenChange() {
    if (this.open) {
      this.emit('sl-show'),
        this.addOpenListeners(),
        (this.originalTrigger = document.activeElement),
        this.contained || (this.modal.activate(), Ye(this));
      const t = this.querySelector('[autofocus]');
      t && t.removeAttribute('autofocus'),
        await Promise.all([st(this.drawer), st(this.overlay)]),
        (this.drawer.hidden = !1),
        requestAnimationFrame(() => {
          this.emit('sl-initial-focus', { cancelable: !0 }).defaultPrevented ||
            (t ? t.focus({ preventScroll: !0 }) : this.panel.focus({ preventScroll: !0 })),
            t && t.setAttribute('autofocus', '');
        });
      const e = Y(this, `drawer.show${so(this.placement)}`, { dir: this.localize.dir() }),
        i = Y(this, 'drawer.overlay.show', { dir: this.localize.dir() });
      await Promise.all([Q(this.panel, e.keyframes, e.options), Q(this.overlay, i.keyframes, i.options)]),
        this.emit('sl-after-show');
    } else {
      this.emit('sl-hide'),
        this.removeOpenListeners(),
        this.contained || (this.modal.deactivate(), Xe(this)),
        await Promise.all([st(this.drawer), st(this.overlay)]);
      const t = Y(this, `drawer.hide${so(this.placement)}`, { dir: this.localize.dir() }),
        e = Y(this, 'drawer.overlay.hide', { dir: this.localize.dir() });
      await Promise.all([
        Q(this.overlay, e.keyframes, e.options).then(() => {
          this.overlay.hidden = !0;
        }),
        Q(this.panel, t.keyframes, t.options).then(() => {
          this.panel.hidden = !0;
        }),
      ]),
        (this.drawer.hidden = !0),
        (this.overlay.hidden = !1),
        (this.panel.hidden = !1);
      const i = this.originalTrigger;
      typeof (i == null ? void 0 : i.focus) == 'function' && setTimeout(() => i.focus()), this.emit('sl-after-hide');
    }
  }
  handleNoModalChange() {
    this.open && !this.contained && (this.modal.activate(), Ye(this)),
      this.open && this.contained && (this.modal.deactivate(), Xe(this));
  }
  async show() {
    if (!this.open) return (this.open = !0), bt(this, 'sl-after-show');
  }
  async hide() {
    if (this.open) return (this.open = !1), bt(this, 'sl-after-hide');
  }
  render() {
    return y`
      <div
        part="base"
        class=${I({ drawer: !0, 'drawer--open': this.open, 'drawer--top': this.placement === 'top', 'drawer--end': this.placement === 'end', 'drawer--bottom': this.placement === 'bottom', 'drawer--start': this.placement === 'start', 'drawer--contained': this.contained, 'drawer--fixed': !this.contained, 'drawer--rtl': this.localize.dir() === 'rtl', 'drawer--has-footer': this.hasSlotController.test('footer') })}
      >
        <div part="overlay" class="drawer__overlay" @click=${() => this.requestClose('overlay')} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-label=${z(this.noHeader ? this.label : void 0)}
          aria-labelledby=${z(this.noHeader ? void 0 : 'title')}
          tabindex="0"
        >
          ${
            this.noHeader
              ? ''
              : y`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length > 0 ? this.label : '\uFEFF'} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      label=${this.localize.term('close')}
                      library="system"
                      @click=${() => this.requestClose('close-button')}
                    ></sl-icon-button>
                  </div>
                </header>
              `
          }

          <slot part="body" class="drawer__body"></slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
  }
};
Et.styles = [D, ol];
Et.dependencies = { 'sl-icon-button': at };
r([k('.drawer')], Et.prototype, 'drawer', 2);
r([k('.drawer__panel')], Et.prototype, 'panel', 2);
r([k('.drawer__overlay')], Et.prototype, 'overlay', 2);
r([l({ type: Boolean, reflect: !0 })], Et.prototype, 'open', 2);
r([l({ reflect: !0 })], Et.prototype, 'label', 2);
r([l({ reflect: !0 })], Et.prototype, 'placement', 2);
r([l({ type: Boolean, reflect: !0 })], Et.prototype, 'contained', 2);
r([l({ attribute: 'no-header', type: Boolean, reflect: !0 })], Et.prototype, 'noHeader', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], Et.prototype, 'handleOpenChange', 1);
r([x('contained', { waitUntilFirstUpdate: !0 })], Et.prototype, 'handleNoModalChange', 1);
q('drawer.showTop', {
  keyframes: [
    { opacity: 0, translate: '0 -100%' },
    { opacity: 1, translate: '0 0' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.hideTop', {
  keyframes: [
    { opacity: 1, translate: '0 0' },
    { opacity: 0, translate: '0 -100%' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.showEnd', {
  keyframes: [
    { opacity: 0, translate: '100%' },
    { opacity: 1, translate: '0' },
  ],
  rtlKeyframes: [
    { opacity: 0, translate: '-100%' },
    { opacity: 1, translate: '0' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.hideEnd', {
  keyframes: [
    { opacity: 1, translate: '0' },
    { opacity: 0, translate: '100%' },
  ],
  rtlKeyframes: [
    { opacity: 1, translate: '0' },
    { opacity: 0, translate: '-100%' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.showBottom', {
  keyframes: [
    { opacity: 0, translate: '0 100%' },
    { opacity: 1, translate: '0 0' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.hideBottom', {
  keyframes: [
    { opacity: 1, translate: '0 0' },
    { opacity: 0, translate: '0 100%' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.showStart', {
  keyframes: [
    { opacity: 0, translate: '-100%' },
    { opacity: 1, translate: '0' },
  ],
  rtlKeyframes: [
    { opacity: 0, translate: '100%' },
    { opacity: 1, translate: '0' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.hideStart', {
  keyframes: [
    { opacity: 1, translate: '0' },
    { opacity: 0, translate: '-100%' },
  ],
  rtlKeyframes: [
    { opacity: 1, translate: '0' },
    { opacity: 0, translate: '100%' },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('drawer.denyClose', { keyframes: [{ scale: 1 }, { scale: 1.01 }, { scale: 1 }], options: { duration: 250 } });
q('drawer.overlay.show', { keyframes: [{ opacity: 0 }, { opacity: 1 }], options: { duration: 250 } });
q('drawer.overlay.hide', { keyframes: [{ opacity: 1 }, { opacity: 0 }], options: { duration: 250 } });
Et.define('sl-drawer');
var hl = T`
  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`,
  pt = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.open = !1),
        (this.placement = 'bottom-start'),
        (this.disabled = !1),
        (this.stayOpenOnSelect = !1),
        (this.distance = 0),
        (this.skidding = 0),
        (this.hoist = !1),
        (this.sync = void 0),
        (this.handleKeyDown = (t) => {
          this.open && t.key === 'Escape' && (t.stopPropagation(), this.hide(), this.focusOnTrigger());
        }),
        (this.handleDocumentKeyDown = (t) => {
          var e;
          if (t.key === 'Escape' && this.open && !this.closeWatcher) {
            t.stopPropagation(), this.focusOnTrigger(), this.hide();
            return;
          }
          if (t.key === 'Tab') {
            if (
              this.open &&
              ((e = document.activeElement) == null ? void 0 : e.tagName.toLowerCase()) === 'sl-menu-item'
            ) {
              t.preventDefault(), this.hide(), this.focusOnTrigger();
              return;
            }
            setTimeout(() => {
              var i, s, o;
              const a =
                ((i = this.containingElement) == null ? void 0 : i.getRootNode()) instanceof ShadowRoot
                  ? (o = (s = document.activeElement) == null ? void 0 : s.shadowRoot) == null
                    ? void 0
                    : o.activeElement
                  : document.activeElement;
              (!this.containingElement ||
                (a == null ? void 0 : a.closest(this.containingElement.tagName.toLowerCase())) !==
                  this.containingElement) &&
                this.hide();
            });
          }
        }),
        (this.handleDocumentMouseDown = (t) => {
          const e = t.composedPath();
          this.containingElement && !e.includes(this.containingElement) && this.hide();
        }),
        (this.handlePanelSelect = (t) => {
          const e = t.target;
          !this.stayOpenOnSelect && e.tagName.toLowerCase() === 'sl-menu' && (this.hide(), this.focusOnTrigger());
        });
    }
    connectedCallback() {
      super.connectedCallback(), this.containingElement || (this.containingElement = this);
    }
    firstUpdated() {
      (this.panel.hidden = !this.open), this.open && (this.addOpenListeners(), (this.popup.active = !0));
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.removeOpenListeners(), this.hide();
    }
    focusOnTrigger() {
      const t = this.trigger.assignedElements({ flatten: !0 })[0];
      typeof (t == null ? void 0 : t.focus) == 'function' && t.focus();
    }
    getMenu() {
      return this.panel.assignedElements({ flatten: !0 }).find((t) => t.tagName.toLowerCase() === 'sl-menu');
    }
    handleTriggerClick() {
      this.open ? this.hide() : (this.show(), this.focusOnTrigger());
    }
    async handleTriggerKeyDown(t) {
      if ([' ', 'Enter'].includes(t.key)) {
        t.preventDefault(), this.handleTriggerClick();
        return;
      }
      const e = this.getMenu();
      if (e) {
        const i = e.getAllItems(),
          s = i[0],
          o = i[i.length - 1];
        ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(t.key) &&
          (t.preventDefault(),
          this.open || (this.show(), await this.updateComplete),
          i.length > 0 &&
            this.updateComplete.then(() => {
              (t.key === 'ArrowDown' || t.key === 'Home') && (e.setCurrentItem(s), s.focus()),
                (t.key === 'ArrowUp' || t.key === 'End') && (e.setCurrentItem(o), o.focus());
            }));
      }
    }
    handleTriggerKeyUp(t) {
      t.key === ' ' && t.preventDefault();
    }
    handleTriggerSlotChange() {
      this.updateAccessibleTrigger();
    }
    updateAccessibleTrigger() {
      const e = this.trigger.assignedElements({ flatten: !0 }).find((s) => ll(s).start);
      let i;
      if (e) {
        switch (e.tagName.toLowerCase()) {
          case 'sl-button':
          case 'sl-icon-button':
            i = e.button;
            break;
          default:
            i = e;
        }
        i.setAttribute('aria-haspopup', 'true'), i.setAttribute('aria-expanded', this.open ? 'true' : 'false');
      }
    }
    async show() {
      if (!this.open) return (this.open = !0), bt(this, 'sl-after-show');
    }
    async hide() {
      if (this.open) return (this.open = !1), bt(this, 'sl-after-hide');
    }
    reposition() {
      this.popup.reposition();
    }
    addOpenListeners() {
      var t;
      this.panel.addEventListener('sl-select', this.handlePanelSelect),
        'CloseWatcher' in window
          ? ((t = this.closeWatcher) == null || t.destroy(),
            (this.closeWatcher = new CloseWatcher()),
            (this.closeWatcher.onclose = () => {
              this.hide(), this.focusOnTrigger();
            }))
          : this.panel.addEventListener('keydown', this.handleKeyDown),
        document.addEventListener('keydown', this.handleDocumentKeyDown),
        document.addEventListener('mousedown', this.handleDocumentMouseDown);
    }
    removeOpenListeners() {
      var t;
      this.panel &&
        (this.panel.removeEventListener('sl-select', this.handlePanelSelect),
        this.panel.removeEventListener('keydown', this.handleKeyDown)),
        document.removeEventListener('keydown', this.handleDocumentKeyDown),
        document.removeEventListener('mousedown', this.handleDocumentMouseDown),
        (t = this.closeWatcher) == null || t.destroy();
    }
    async handleOpenChange() {
      if (this.disabled) {
        this.open = !1;
        return;
      }
      if ((this.updateAccessibleTrigger(), this.open)) {
        this.emit('sl-show'),
          this.addOpenListeners(),
          await st(this),
          (this.panel.hidden = !1),
          (this.popup.active = !0);
        const { keyframes: t, options: e } = Y(this, 'dropdown.show', { dir: this.localize.dir() });
        await Q(this.popup.popup, t, e), this.emit('sl-after-show');
      } else {
        this.emit('sl-hide'), this.removeOpenListeners(), await st(this);
        const { keyframes: t, options: e } = Y(this, 'dropdown.hide', { dir: this.localize.dir() });
        await Q(this.popup.popup, t, e), (this.panel.hidden = !0), (this.popup.active = !1), this.emit('sl-after-hide');
      }
    }
    render() {
      return y`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${z(this.sync ? this.sync : void 0)}
        class=${I({ dropdown: !0, 'dropdown--open': this.open })}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open ? 'false' : 'true'} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `;
    }
  };
pt.styles = [D, hl];
pt.dependencies = { 'sl-popup': U };
r([k('.dropdown')], pt.prototype, 'popup', 2);
r([k('.dropdown__trigger')], pt.prototype, 'trigger', 2);
r([k('.dropdown__panel')], pt.prototype, 'panel', 2);
r([l({ type: Boolean, reflect: !0 })], pt.prototype, 'open', 2);
r([l({ reflect: !0 })], pt.prototype, 'placement', 2);
r([l({ type: Boolean, reflect: !0 })], pt.prototype, 'disabled', 2);
r([l({ attribute: 'stay-open-on-select', type: Boolean, reflect: !0 })], pt.prototype, 'stayOpenOnSelect', 2);
r([l({ attribute: !1 })], pt.prototype, 'containingElement', 2);
r([l({ type: Number })], pt.prototype, 'distance', 2);
r([l({ type: Number })], pt.prototype, 'skidding', 2);
r([l({ type: Boolean })], pt.prototype, 'hoist', 2);
r([l({ reflect: !0 })], pt.prototype, 'sync', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], pt.prototype, 'handleOpenChange', 1);
q('dropdown.show', {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 100, easing: 'ease' },
});
q('dropdown.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 },
  ],
  options: { duration: 100, easing: 'ease' },
});
pt.define('sl-dropdown');
var ul = T`
  :host {
    --error-color: var(--sl-color-danger-600);
    --success-color: var(--sl-color-success-600);

    display: inline-block;
  }

  .copy-button__button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`,
  lt = class extends E {
    constructor() {
      super(...arguments),
        (this.localize = new N(this)),
        (this.isCopying = !1),
        (this.status = 'rest'),
        (this.value = ''),
        (this.from = ''),
        (this.disabled = !1),
        (this.copyLabel = ''),
        (this.successLabel = ''),
        (this.errorLabel = ''),
        (this.feedbackDuration = 1e3),
        (this.tooltipPlacement = 'top'),
        (this.hoist = !1);
    }
    async handleCopy() {
      if (this.disabled || this.isCopying) return;
      this.isCopying = !0;
      let t = this.value;
      if (this.from) {
        const e = this.getRootNode(),
          i = this.from.includes('.'),
          s = this.from.includes('[') && this.from.includes(']');
        let o = this.from,
          a = '';
        i ? ([o, a] = this.from.trim().split('.')) : s && ([o, a] = this.from.trim().replace(/\]$/, '').split('['));
        const n = 'getElementById' in e ? e.getElementById(o) : null;
        n
          ? s
            ? (t = n.getAttribute(a) || '')
            : i
              ? (t = n[a] || '')
              : (t = n.textContent || '')
          : (this.showStatus('error'), this.emit('sl-error'));
      }
      if (!t) this.showStatus('error'), this.emit('sl-error');
      else
        try {
          await navigator.clipboard.writeText(t),
            this.showStatus('success'),
            this.emit('sl-copy', { detail: { value: t } });
        } catch {
          this.showStatus('error'), this.emit('sl-error');
        }
    }
    async showStatus(t) {
      const e = this.copyLabel || this.localize.term('copy'),
        i = this.successLabel || this.localize.term('copied'),
        s = this.errorLabel || this.localize.term('error'),
        o = t === 'success' ? this.successIcon : this.errorIcon,
        a = Y(this, 'copy.in', { dir: 'ltr' }),
        n = Y(this, 'copy.out', { dir: 'ltr' });
      (this.tooltip.content = t === 'success' ? i : s),
        await this.copyIcon.animate(n.keyframes, n.options).finished,
        (this.copyIcon.hidden = !0),
        (this.status = t),
        (o.hidden = !1),
        await o.animate(a.keyframes, a.options).finished,
        setTimeout(async () => {
          await o.animate(n.keyframes, n.options).finished,
            (o.hidden = !0),
            (this.status = 'rest'),
            (this.copyIcon.hidden = !1),
            await this.copyIcon.animate(a.keyframes, a.options).finished,
            (this.tooltip.content = e),
            (this.isCopying = !1);
        }, this.feedbackDuration);
    }
    render() {
      const t = this.copyLabel || this.localize.term('copy');
      return y`
      <sl-tooltip
        class=${I({ 'copy-button': !0, 'copy-button--success': this.status === 'success', 'copy-button--error': this.status === 'error' })}
        content=${t}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <sl-icon library="system" name="copy"></sl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <sl-icon library="system" name="check"></sl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <sl-icon library="system" name="x-lg"></sl-icon>
          </slot>
        </button>
      </sl-tooltip>
    `;
    }
  };
lt.styles = [D, ul];
lt.dependencies = { 'sl-icon': j, 'sl-tooltip': nt };
r([k('slot[name="copy-icon"]')], lt.prototype, 'copyIcon', 2);
r([k('slot[name="success-icon"]')], lt.prototype, 'successIcon', 2);
r([k('slot[name="error-icon"]')], lt.prototype, 'errorIcon', 2);
r([k('sl-tooltip')], lt.prototype, 'tooltip', 2);
r([L()], lt.prototype, 'isCopying', 2);
r([L()], lt.prototype, 'status', 2);
r([l()], lt.prototype, 'value', 2);
r([l()], lt.prototype, 'from', 2);
r([l({ type: Boolean, reflect: !0 })], lt.prototype, 'disabled', 2);
r([l({ attribute: 'copy-label' })], lt.prototype, 'copyLabel', 2);
r([l({ attribute: 'success-label' })], lt.prototype, 'successLabel', 2);
r([l({ attribute: 'error-label' })], lt.prototype, 'errorLabel', 2);
r([l({ attribute: 'feedback-duration', type: Number })], lt.prototype, 'feedbackDuration', 2);
r([l({ attribute: 'tooltip-placement' })], lt.prototype, 'tooltipPlacement', 2);
r([l({ type: Boolean })], lt.prototype, 'hoist', 2);
q('copy.in', {
  keyframes: [
    { scale: '.25', opacity: '.25' },
    { scale: '1', opacity: '1' },
  ],
  options: { duration: 100 },
});
q('copy.out', {
  keyframes: [
    { scale: '1', opacity: '1' },
    { scale: '.25', opacity: '0' },
  ],
  options: { duration: 100 },
});
lt.define('sl-copy-button');
var pl = T`
  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-medium);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`,
  Bt = class extends E {
    constructor() {
      super(...arguments), (this.localize = new N(this)), (this.open = !1), (this.disabled = !1);
    }
    firstUpdated() {
      (this.body.style.height = this.open ? 'auto' : '0'),
        this.open && (this.details.open = !0),
        (this.detailsObserver = new MutationObserver((t) => {
          for (const e of t)
            e.type === 'attributes' && e.attributeName === 'open' && (this.details.open ? this.show() : this.hide());
        })),
        this.detailsObserver.observe(this.details, { attributes: !0 });
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(), (t = this.detailsObserver) == null || t.disconnect();
    }
    handleSummaryClick(t) {
      t.preventDefault(), this.disabled || (this.open ? this.hide() : this.show(), this.header.focus());
    }
    handleSummaryKeyDown(t) {
      (t.key === 'Enter' || t.key === ' ') && (t.preventDefault(), this.open ? this.hide() : this.show()),
        (t.key === 'ArrowUp' || t.key === 'ArrowLeft') && (t.preventDefault(), this.hide()),
        (t.key === 'ArrowDown' || t.key === 'ArrowRight') && (t.preventDefault(), this.show());
    }
    async handleOpenChange() {
      if (this.open) {
        if (((this.details.open = !0), this.emit('sl-show', { cancelable: !0 }).defaultPrevented)) {
          (this.open = !1), (this.details.open = !1);
          return;
        }
        await st(this.body);
        const { keyframes: e, options: i } = Y(this, 'details.show', { dir: this.localize.dir() });
        await Q(this.body, Ei(e, this.body.scrollHeight), i),
          (this.body.style.height = 'auto'),
          this.emit('sl-after-show');
      } else {
        if (this.emit('sl-hide', { cancelable: !0 }).defaultPrevented) {
          (this.details.open = !0), (this.open = !0);
          return;
        }
        await st(this.body);
        const { keyframes: e, options: i } = Y(this, 'details.hide', { dir: this.localize.dir() });
        await Q(this.body, Ei(e, this.body.scrollHeight), i),
          (this.body.style.height = 'auto'),
          (this.details.open = !1),
          this.emit('sl-after-hide');
      }
    }
    async show() {
      if (!(this.open || this.disabled)) return (this.open = !0), bt(this, 'sl-after-show');
    }
    async hide() {
      if (!(!this.open || this.disabled)) return (this.open = !1), bt(this, 'sl-after-hide');
    }
    render() {
      const t = this.localize.dir() === 'rtl';
      return y`
      <details
        part="base"
        class=${I({ details: !0, 'details--open': this.open, 'details--disabled': this.disabled, 'details--rtl': t })}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="content"
          aria-disabled=${this.disabled ? 'true' : 'false'}
          tabindex=${this.disabled ? '-1' : '0'}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${t ? 'chevron-left' : 'chevron-right'}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${t ? 'chevron-left' : 'chevron-right'}></sl-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `;
    }
  };
Bt.styles = [D, pl];
Bt.dependencies = { 'sl-icon': j };
r([k('.details')], Bt.prototype, 'details', 2);
r([k('.details__header')], Bt.prototype, 'header', 2);
r([k('.details__body')], Bt.prototype, 'body', 2);
r([k('.details__expand-icon-slot')], Bt.prototype, 'expandIconSlot', 2);
r([l({ type: Boolean, reflect: !0 })], Bt.prototype, 'open', 2);
r([l()], Bt.prototype, 'summary', 2);
r([l({ type: Boolean, reflect: !0 })], Bt.prototype, 'disabled', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], Bt.prototype, 'handleOpenChange', 1);
q('details.show', {
  keyframes: [
    { height: '0', opacity: '0' },
    { height: 'auto', opacity: '1' },
  ],
  options: { duration: 250, easing: 'linear' },
});
q('details.hide', {
  keyframes: [
    { height: 'auto', opacity: '1' },
    { height: '0', opacity: '0' },
  ],
  options: { duration: 250, easing: 'linear' },
});
Bt.define('sl-details');
var fl = T`
  :host {
    --width: 31rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--sl-z-index-dialog);
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--sl-spacing-2x-large));
    max-height: calc(100% - var(--sl-spacing-2x-large));
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
  }

  .dialog__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .dialog__header-actions sl-icon-button,
  .dialog__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(sl-button:not(:first-of-type)) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`,
  Xt = class extends E {
    constructor() {
      super(...arguments),
        (this.hasSlotController = new vt(this, 'footer')),
        (this.localize = new N(this)),
        (this.modal = new jo(this)),
        (this.open = !1),
        (this.label = ''),
        (this.noHeader = !1),
        (this.handleDocumentKeyDown = (t) => {
          t.key === 'Escape' &&
            this.modal.isActive() &&
            this.open &&
            (t.stopPropagation(), this.requestClose('keyboard'));
        });
    }
    firstUpdated() {
      (this.dialog.hidden = !this.open), this.open && (this.addOpenListeners(), this.modal.activate(), Ye(this));
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.modal.deactivate(), Xe(this), this.removeOpenListeners();
    }
    requestClose(t) {
      if (this.emit('sl-request-close', { cancelable: !0, detail: { source: t } }).defaultPrevented) {
        const i = Y(this, 'dialog.denyClose', { dir: this.localize.dir() });
        Q(this.panel, i.keyframes, i.options);
        return;
      }
      this.hide();
    }
    addOpenListeners() {
      var t;
      'CloseWatcher' in window
        ? ((t = this.closeWatcher) == null || t.destroy(),
          (this.closeWatcher = new CloseWatcher()),
          (this.closeWatcher.onclose = () => this.requestClose('keyboard')))
        : document.addEventListener('keydown', this.handleDocumentKeyDown);
    }
    removeOpenListeners() {
      var t;
      (t = this.closeWatcher) == null || t.destroy(),
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }
    async handleOpenChange() {
      if (this.open) {
        this.emit('sl-show'),
          this.addOpenListeners(),
          (this.originalTrigger = document.activeElement),
          this.modal.activate(),
          Ye(this);
        const t = this.querySelector('[autofocus]');
        t && t.removeAttribute('autofocus'),
          await Promise.all([st(this.dialog), st(this.overlay)]),
          (this.dialog.hidden = !1),
          requestAnimationFrame(() => {
            this.emit('sl-initial-focus', { cancelable: !0 }).defaultPrevented ||
              (t ? t.focus({ preventScroll: !0 }) : this.panel.focus({ preventScroll: !0 })),
              t && t.setAttribute('autofocus', '');
          });
        const e = Y(this, 'dialog.show', { dir: this.localize.dir() }),
          i = Y(this, 'dialog.overlay.show', { dir: this.localize.dir() });
        await Promise.all([Q(this.panel, e.keyframes, e.options), Q(this.overlay, i.keyframes, i.options)]),
          this.emit('sl-after-show');
      } else {
        this.emit('sl-hide'),
          this.removeOpenListeners(),
          this.modal.deactivate(),
          await Promise.all([st(this.dialog), st(this.overlay)]);
        const t = Y(this, 'dialog.hide', { dir: this.localize.dir() }),
          e = Y(this, 'dialog.overlay.hide', { dir: this.localize.dir() });
        await Promise.all([
          Q(this.overlay, e.keyframes, e.options).then(() => {
            this.overlay.hidden = !0;
          }),
          Q(this.panel, t.keyframes, t.options).then(() => {
            this.panel.hidden = !0;
          }),
        ]),
          (this.dialog.hidden = !0),
          (this.overlay.hidden = !1),
          (this.panel.hidden = !1),
          Xe(this);
        const i = this.originalTrigger;
        typeof (i == null ? void 0 : i.focus) == 'function' && setTimeout(() => i.focus()), this.emit('sl-after-hide');
      }
    }
    async show() {
      if (!this.open) return (this.open = !0), bt(this, 'sl-after-show');
    }
    async hide() {
      if (this.open) return (this.open = !1), bt(this, 'sl-after-hide');
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ dialog: !0, 'dialog--open': this.open, 'dialog--has-footer': this.hasSlotController.test('footer') })}
      >
        <div part="overlay" class="dialog__overlay" @click=${() => this.requestClose('overlay')} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-label=${z(this.noHeader ? this.label : void 0)}
          aria-labelledby=${z(this.noHeader ? void 0 : 'title')}
          tabindex="-1"
        >
          ${
            this.noHeader
              ? ''
              : y`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length > 0 ? this.label : '\uFEFF'} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term('close')}
                      library="system"
                      @click="${() => this.requestClose('close-button')}"
                    ></sl-icon-button>
                  </div>
                </header>
              `
          }
          ${''}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `;
    }
  };
Xt.styles = [D, fl];
Xt.dependencies = { 'sl-icon-button': at };
r([k('.dialog')], Xt.prototype, 'dialog', 2);
r([k('.dialog__panel')], Xt.prototype, 'panel', 2);
r([k('.dialog__overlay')], Xt.prototype, 'overlay', 2);
r([l({ type: Boolean, reflect: !0 })], Xt.prototype, 'open', 2);
r([l({ reflect: !0 })], Xt.prototype, 'label', 2);
r([l({ attribute: 'no-header', type: Boolean, reflect: !0 })], Xt.prototype, 'noHeader', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], Xt.prototype, 'handleOpenChange', 1);
q('dialog.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('dialog.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('dialog.denyClose', { keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }], options: { duration: 250 } });
q('dialog.overlay.show', { keyframes: [{ opacity: 0 }, { opacity: 1 }], options: { duration: 250 } });
q('dialog.overlay.hide', { keyframes: [{ opacity: 1 }, { opacity: 0 }], options: { duration: 250 } });
Xt.define('sl-dialog');
rt.define('sl-checkbox');
var ml = T`
  :host {
    --grid-width: 280px;
    --grid-height: 200px;
    --grid-handle-size: 16px;
    --slider-height: 15px;
    --slider-handle-size: 17px;
    --swatch-size: 25px;

    display: inline-block;
  }

  .color-picker {
    width: var(--grid-width);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    color: var(--color);
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    user-select: none;
    -webkit-user-select: none;
  }

  .color-picker--inline {
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
  }

  .color-picker--inline:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__grid {
    position: relative;
    height: var(--grid-height);
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%),
      linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    border-top-left-radius: var(--sl-border-radius-medium);
    border-top-right-radius: var(--sl-border-radius-medium);
    cursor: crosshair;
    forced-color-adjust: none;
  }

  .color-picker__grid-handle {
    position: absolute;
    width: var(--grid-handle-size);
    height: var(--grid-handle-size);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    border: solid 2px white;
    margin-top: calc(var(--grid-handle-size) / -2);
    margin-left: calc(var(--grid-handle-size) / -2);
    transition: var(--sl-transition-fast) scale;
  }

  .color-picker__grid-handle--dragging {
    cursor: none;
    scale: 1.5;
  }

  .color-picker__grid-handle:focus-visible {
    outline: var(--sl-focus-ring);
  }

  .color-picker__controls {
    padding: var(--sl-spacing-small);
    display: flex;
    align-items: center;
  }

  .color-picker__sliders {
    flex: 1 1 auto;
  }

  .color-picker__slider {
    position: relative;
    height: var(--slider-height);
    border-radius: var(--sl-border-radius-pill);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    forced-color-adjust: none;
  }

  .color-picker__slider:not(:last-of-type) {
    margin-bottom: var(--sl-spacing-small);
  }

  .color-picker__slider-handle {
    position: absolute;
    top: calc(50% - var(--slider-handle-size) / 2);
    width: var(--slider-handle-size);
    height: var(--slider-handle-size);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    margin-left: calc(var(--slider-handle-size) / -2);
  }

  .color-picker__slider-handle:focus-visible {
    outline: var(--sl-focus-ring);
  }

  .color-picker__hue {
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .color-picker__alpha .color-picker__alpha-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .color-picker__preview {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    border-radius: var(--sl-border-radius-circle);
    background: none;
    margin-left: var(--sl-spacing-small);
    cursor: copy;
    forced-color-adjust: none;
  }

  .color-picker__preview:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);

    /* We use a custom property in lieu of currentColor because of https://bugs.webkit.org/show_bug.cgi?id=216780 */
    background-color: var(--preview-color);
  }

  .color-picker__preview:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__preview-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
  }

  .color-picker__preview-color--copied {
    animation: pulse 0.75s;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--sl-color-primary-500);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .color-picker__user-input {
    display: flex;
    padding: 0 var(--sl-spacing-small) var(--sl-spacing-small) var(--sl-spacing-small);
  }

  .color-picker__user-input sl-input {
    min-width: 0; /* fix input width in Safari */
    flex: 1 1 auto;
  }

  .color-picker__user-input sl-button-group {
    margin-left: var(--sl-spacing-small);
  }

  .color-picker__user-input sl-button {
    min-width: 3.25rem;
    max-width: 3.25rem;
    font-size: 1rem;
  }

  .color-picker__swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    border-top: solid 1px var(--sl-color-neutral-200);
    padding: var(--sl-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__swatch {
    position: relative;
    width: var(--swatch-size);
    height: var(--swatch-size);
    border-radius: var(--sl-border-radius-small);
  }

  .color-picker__swatch .color-picker__swatch-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: inherit;
    cursor: pointer;
  }

  .color-picker__swatch:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__transparent-bg {
    background-image: linear-gradient(45deg, var(--sl-color-neutral-300) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--sl-color-neutral-300) 75%),
      linear-gradient(45deg, transparent 75%, var(--sl-color-neutral-300) 75%),
      linear-gradient(45deg, var(--sl-color-neutral-300) 25%, transparent 25%);
    background-size: 10px 10px;
    background-position:
      0 0,
      0 0,
      -5px -5px,
      5px 5px;
  }

  .color-picker--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .color-picker--disabled .color-picker__grid,
  .color-picker--disabled .color-picker__grid-handle,
  .color-picker--disabled .color-picker__slider,
  .color-picker--disabled .color-picker__slider-handle,
  .color-picker--disabled .color-picker__preview,
  .color-picker--disabled .color-picker__swatch,
  .color-picker--disabled .color-picker__swatch-color {
    pointer-events: none;
  }

  /*
   * Color dropdown
   */

  .color-dropdown::part(panel) {
    max-height: none;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    overflow: visible;
  }

  .color-dropdown__trigger {
    display: inline-block;
    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-dropdown__trigger.color-dropdown__trigger--small {
    width: var(--sl-input-height-small);
    height: var(--sl-input-height-small);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger.color-dropdown__trigger--medium {
    width: var(--sl-input-height-medium);
    height: var(--sl-input-height-medium);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger.color-dropdown__trigger--large {
    width: var(--sl-input-height-large);
    height: var(--sl-input-height-large);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: currentColor;
    box-shadow:
      inset 0 0 0 2px var(--sl-input-border-color),
      inset 0 0 0 4px var(--sl-color-neutral-0);
  }

  .color-dropdown__trigger--empty:before {
    background-color: transparent;
  }

  .color-dropdown__trigger:focus-visible {
    outline: none;
  }

  .color-dropdown__trigger:focus-visible:not(.color-dropdown__trigger--disabled) {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-dropdown__trigger.color-dropdown__trigger--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,
  W = class extends E {
    constructor() {
      super(...arguments),
        (this.formControlController = new Zt(this, { assumeInteractionOn: ['click'] })),
        (this.hasSlotController = new vt(this, '[default]', 'prefix', 'suffix')),
        (this.localize = new N(this)),
        (this.hasFocus = !1),
        (this.invalid = !1),
        (this.title = ''),
        (this.variant = 'default'),
        (this.size = 'medium'),
        (this.caret = !1),
        (this.disabled = !1),
        (this.loading = !1),
        (this.outline = !1),
        (this.pill = !1),
        (this.circle = !1),
        (this.type = 'button'),
        (this.name = ''),
        (this.value = ''),
        (this.href = ''),
        (this.rel = 'noreferrer noopener');
    }
    get validity() {
      return this.isButton() ? this.button.validity : Li;
    }
    get validationMessage() {
      return this.isButton() ? this.button.validationMessage : '';
    }
    firstUpdated() {
      this.isButton() && this.formControlController.updateValidity();
    }
    handleBlur() {
      (this.hasFocus = !1), this.emit('sl-blur');
    }
    handleFocus() {
      (this.hasFocus = !0), this.emit('sl-focus');
    }
    handleClick() {
      this.type === 'submit' && this.formControlController.submit(this),
        this.type === 'reset' && this.formControlController.reset(this);
    }
    handleInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    isButton() {
      return !this.href;
    }
    isLink() {
      return !!this.href;
    }
    handleDisabledChange() {
      this.isButton() && this.formControlController.setValidity(this.disabled);
    }
    click() {
      this.button.click();
    }
    focus(t) {
      this.button.focus(t);
    }
    blur() {
      this.button.blur();
    }
    checkValidity() {
      return this.isButton() ? this.button.checkValidity() : !0;
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return this.isButton() ? this.button.reportValidity() : !0;
    }
    setCustomValidity(t) {
      this.isButton() && (this.button.setCustomValidity(t), this.formControlController.updateValidity());
    }
    render() {
      const t = this.isLink(),
        e = t ? Ai`a` : Ai`button`;
      return Ke`
      <${e}
        part="base"
        class=${I({ button: !0, 'button--default': this.variant === 'default', 'button--primary': this.variant === 'primary', 'button--success': this.variant === 'success', 'button--neutral': this.variant === 'neutral', 'button--warning': this.variant === 'warning', 'button--danger': this.variant === 'danger', 'button--text': this.variant === 'text', 'button--small': this.size === 'small', 'button--medium': this.size === 'medium', 'button--large': this.size === 'large', 'button--caret': this.caret, 'button--circle': this.circle, 'button--disabled': this.disabled, 'button--focused': this.hasFocus, 'button--loading': this.loading, 'button--standard': !this.outline, 'button--outline': this.outline, 'button--pill': this.pill, 'button--rtl': this.localize.dir() === 'rtl', 'button--has-label': this.hasSlotController.test('[default]'), 'button--has-prefix': this.hasSlotController.test('prefix'), 'button--has-suffix': this.hasSlotController.test('suffix') })}
        ?disabled=${z(t ? void 0 : this.disabled)}
        type=${z(t ? void 0 : this.type)}
        title=${this.title}
        name=${z(t ? void 0 : this.name)}
        value=${z(t ? void 0 : this.value)}
        href=${z(t && !this.disabled ? this.href : void 0)}
        target=${z(t ? this.target : void 0)}
        download=${z(t ? this.download : void 0)}
        rel=${z(t ? this.rel : void 0)}
        role=${z(t ? void 0 : 'button')}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : '0'}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? Ke` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> ` : ''}
        ${this.loading ? Ke`<sl-spinner part="spinner"></sl-spinner>` : ''}
      </${e}>
    `;
    }
  };
W.styles = [D, Vo];
W.dependencies = { 'sl-icon': j, 'sl-spinner': li };
r([k('.button')], W.prototype, 'button', 2);
r([L()], W.prototype, 'hasFocus', 2);
r([L()], W.prototype, 'invalid', 2);
r([l()], W.prototype, 'title', 2);
r([l({ reflect: !0 })], W.prototype, 'variant', 2);
r([l({ reflect: !0 })], W.prototype, 'size', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'caret', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'disabled', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'loading', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'outline', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'pill', 2);
r([l({ type: Boolean, reflect: !0 })], W.prototype, 'circle', 2);
r([l()], W.prototype, 'type', 2);
r([l()], W.prototype, 'name', 2);
r([l()], W.prototype, 'value', 2);
r([l()], W.prototype, 'href', 2);
r([l()], W.prototype, 'target', 2);
r([l()], W.prototype, 'rel', 2);
r([l()], W.prototype, 'download', 2);
r([l()], W.prototype, 'form', 2);
r([l({ attribute: 'formaction' })], W.prototype, 'formAction', 2);
r([l({ attribute: 'formenctype' })], W.prototype, 'formEnctype', 2);
r([l({ attribute: 'formmethod' })], W.prototype, 'formMethod', 2);
r([l({ attribute: 'formnovalidate', type: Boolean })], W.prototype, 'formNoValidate', 2);
r([l({ attribute: 'formtarget' })], W.prototype, 'formTarget', 2);
r([x('disabled', { waitUntilFirstUpdate: !0 })], W.prototype, 'handleDisabledChange', 1);
function dt(t, e) {
  gl(t) && (t = '100%');
  const i = bl(t);
  return (
    (t = e === 360 ? t : Math.min(e, Math.max(0, parseFloat(t)))),
    i && (t = parseInt(String(t * e), 10) / 100),
    Math.abs(t - e) < 1e-6
      ? 1
      : (e === 360
          ? (t = (t < 0 ? (t % e) + e : t % e) / parseFloat(String(e)))
          : (t = (t % e) / parseFloat(String(e))),
        t)
  );
}
function bi(t) {
  return Math.min(1, Math.max(0, t));
}
function gl(t) {
  return typeof t == 'string' && t.indexOf('.') !== -1 && parseFloat(t) === 1;
}
function bl(t) {
  return typeof t == 'string' && t.indexOf('%') !== -1;
}
function Ko(t) {
  return (t = parseFloat(t)), (isNaN(t) || t < 0 || t > 1) && (t = 1), t;
}
function vi(t) {
  return Number(t) <= 1 ? `${Number(t) * 100}%` : t;
}
function pe(t) {
  return t.length === 1 ? '0' + t : String(t);
}
function vl(t, e, i) {
  return { r: dt(t, 255) * 255, g: dt(e, 255) * 255, b: dt(i, 255) * 255 };
}
function oo(t, e, i) {
  (t = dt(t, 255)), (e = dt(e, 255)), (i = dt(i, 255));
  const s = Math.max(t, e, i),
    o = Math.min(t, e, i);
  let a = 0,
    n = 0;
  const c = (s + o) / 2;
  if (s === o) (n = 0), (a = 0);
  else {
    const d = s - o;
    switch (((n = c > 0.5 ? d / (2 - s - o) : d / (s + o)), s)) {
      case t:
        a = (e - i) / d + (e < i ? 6 : 0);
        break;
      case e:
        a = (i - t) / d + 2;
        break;
      case i:
        a = (t - e) / d + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: n, l: c };
}
function Qi(t, e, i) {
  return (
    i < 0 && (i += 1),
    i > 1 && (i -= 1),
    i < 1 / 6 ? t + (e - t) * (6 * i) : i < 1 / 2 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
  );
}
function yl(t, e, i) {
  let s, o, a;
  if (((t = dt(t, 360)), (e = dt(e, 100)), (i = dt(i, 100)), e === 0)) (o = i), (a = i), (s = i);
  else {
    const n = i < 0.5 ? i * (1 + e) : i + e - i * e,
      c = 2 * i - n;
    (s = Qi(c, n, t + 1 / 3)), (o = Qi(c, n, t)), (a = Qi(c, n, t - 1 / 3));
  }
  return { r: s * 255, g: o * 255, b: a * 255 };
}
function ro(t, e, i) {
  (t = dt(t, 255)), (e = dt(e, 255)), (i = dt(i, 255));
  const s = Math.max(t, e, i),
    o = Math.min(t, e, i);
  let a = 0;
  const n = s,
    c = s - o,
    d = s === 0 ? 0 : c / s;
  if (s === o) a = 0;
  else {
    switch (s) {
      case t:
        a = (e - i) / c + (e < i ? 6 : 0);
        break;
      case e:
        a = (i - t) / c + 2;
        break;
      case i:
        a = (t - e) / c + 4;
        break;
    }
    a /= 6;
  }
  return { h: a, s: d, v: n };
}
function wl(t, e, i) {
  (t = dt(t, 360) * 6), (e = dt(e, 100)), (i = dt(i, 100));
  const s = Math.floor(t),
    o = t - s,
    a = i * (1 - e),
    n = i * (1 - o * e),
    c = i * (1 - (1 - o) * e),
    d = s % 6,
    h = [i, n, a, a, c, i][d],
    f = [c, i, i, n, a, a][d],
    u = [a, a, c, i, i, n][d];
  return { r: h * 255, g: f * 255, b: u * 255 };
}
function ao(t, e, i, s) {
  const o = [pe(Math.round(t).toString(16)), pe(Math.round(e).toString(16)), pe(Math.round(i).toString(16))];
  return s && o[0].startsWith(o[0].charAt(1)) && o[1].startsWith(o[1].charAt(1)) && o[2].startsWith(o[2].charAt(1))
    ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0)
    : o.join('');
}
function _l(t, e, i, s, o) {
  const a = [pe(Math.round(t).toString(16)), pe(Math.round(e).toString(16)), pe(Math.round(i).toString(16)), pe(kl(s))];
  return o &&
    a[0].startsWith(a[0].charAt(1)) &&
    a[1].startsWith(a[1].charAt(1)) &&
    a[2].startsWith(a[2].charAt(1)) &&
    a[3].startsWith(a[3].charAt(1))
    ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0)
    : a.join('');
}
function xl(t, e, i, s) {
  const o = t / 100,
    a = e / 100,
    n = i / 100,
    c = s / 100,
    d = 255 * (1 - o) * (1 - c),
    h = 255 * (1 - a) * (1 - c),
    f = 255 * (1 - n) * (1 - c);
  return { r: d, g: h, b: f };
}
function no(t, e, i) {
  let s = 1 - t / 255,
    o = 1 - e / 255,
    a = 1 - i / 255,
    n = Math.min(s, o, a);
  return (
    n === 1
      ? ((s = 0), (o = 0), (a = 0))
      : ((s = ((s - n) / (1 - n)) * 100), (o = ((o - n) / (1 - n)) * 100), (a = ((a - n) / (1 - n)) * 100)),
    (n *= 100),
    { c: Math.round(s), m: Math.round(o), y: Math.round(a), k: Math.round(n) }
  );
}
function kl(t) {
  return Math.round(parseFloat(t) * 255).toString(16);
}
function lo(t) {
  return _t(t) / 255;
}
function _t(t) {
  return parseInt(t, 16);
}
function Cl(t) {
  return { r: t >> 16, g: (t & 65280) >> 8, b: t & 255 };
}
const hs = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};
function $l(t) {
  let e = { r: 0, g: 0, b: 0 },
    i = 1,
    s = null,
    o = null,
    a = null,
    n = !1,
    c = !1;
  return (
    typeof t == 'string' && (t = El(t)),
    typeof t == 'object' &&
      (wt(t.r) && wt(t.g) && wt(t.b)
        ? ((e = vl(t.r, t.g, t.b)), (n = !0), (c = String(t.r).substr(-1) === '%' ? 'prgb' : 'rgb'))
        : wt(t.h) && wt(t.s) && wt(t.v)
          ? ((s = vi(t.s)), (o = vi(t.v)), (e = wl(t.h, s, o)), (n = !0), (c = 'hsv'))
          : wt(t.h) && wt(t.s) && wt(t.l)
            ? ((s = vi(t.s)), (a = vi(t.l)), (e = yl(t.h, s, a)), (n = !0), (c = 'hsl'))
            : wt(t.c) && wt(t.m) && wt(t.y) && wt(t.k) && ((e = xl(t.c, t.m, t.y, t.k)), (n = !0), (c = 'cmyk')),
      Object.prototype.hasOwnProperty.call(t, 'a') && (i = t.a)),
    (i = Ko(i)),
    {
      ok: n,
      format: t.format || c,
      r: Math.min(255, Math.max(e.r, 0)),
      g: Math.min(255, Math.max(e.g, 0)),
      b: Math.min(255, Math.max(e.b, 0)),
      a: i,
    }
  );
}
const Sl = '[-\\+]?\\d+%?',
  zl = '[-\\+]?\\d*\\.\\d+%?',
  ie = '(?:' + zl + ')|(?:' + Sl + ')',
  Zi = '[\\s|\\(]+(' + ie + ')[,|\\s]+(' + ie + ')[,|\\s]+(' + ie + ')\\s*\\)?',
  yi = '[\\s|\\(]+(' + ie + ')[,|\\s]+(' + ie + ')[,|\\s]+(' + ie + ')[,|\\s]+(' + ie + ')\\s*\\)?',
  Tt = {
    CSS_UNIT: new RegExp(ie),
    rgb: new RegExp('rgb' + Zi),
    rgba: new RegExp('rgba' + yi),
    hsl: new RegExp('hsl' + Zi),
    hsla: new RegExp('hsla' + yi),
    hsv: new RegExp('hsv' + Zi),
    hsva: new RegExp('hsva' + yi),
    cmyk: new RegExp('cmyk' + yi),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  };
function El(t) {
  if (((t = t.trim().toLowerCase()), t.length === 0)) return !1;
  let e = !1;
  if (hs[t]) (t = hs[t]), (e = !0);
  else if (t === 'transparent') return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
  let i = Tt.rgb.exec(t);
  return i
    ? { r: i[1], g: i[2], b: i[3] }
    : ((i = Tt.rgba.exec(t)),
      i
        ? { r: i[1], g: i[2], b: i[3], a: i[4] }
        : ((i = Tt.hsl.exec(t)),
          i
            ? { h: i[1], s: i[2], l: i[3] }
            : ((i = Tt.hsla.exec(t)),
              i
                ? { h: i[1], s: i[2], l: i[3], a: i[4] }
                : ((i = Tt.hsv.exec(t)),
                  i
                    ? { h: i[1], s: i[2], v: i[3] }
                    : ((i = Tt.hsva.exec(t)),
                      i
                        ? { h: i[1], s: i[2], v: i[3], a: i[4] }
                        : ((i = Tt.cmyk.exec(t)),
                          i
                            ? { c: i[1], m: i[2], y: i[3], k: i[4] }
                            : ((i = Tt.hex8.exec(t)),
                              i
                                ? { r: _t(i[1]), g: _t(i[2]), b: _t(i[3]), a: lo(i[4]), format: e ? 'name' : 'hex8' }
                                : ((i = Tt.hex6.exec(t)),
                                  i
                                    ? { r: _t(i[1]), g: _t(i[2]), b: _t(i[3]), format: e ? 'name' : 'hex' }
                                    : ((i = Tt.hex4.exec(t)),
                                      i
                                        ? {
                                            r: _t(i[1] + i[1]),
                                            g: _t(i[2] + i[2]),
                                            b: _t(i[3] + i[3]),
                                            a: lo(i[4] + i[4]),
                                            format: e ? 'name' : 'hex8',
                                          }
                                        : ((i = Tt.hex3.exec(t)),
                                          i
                                            ? {
                                                r: _t(i[1] + i[1]),
                                                g: _t(i[2] + i[2]),
                                                b: _t(i[3] + i[3]),
                                                format: e ? 'name' : 'hex',
                                              }
                                            : !1))))))))));
}
function wt(t) {
  return typeof t == 'number' ? !Number.isNaN(t) : Tt.CSS_UNIT.test(t);
}
class G {
  constructor(e = '', i = {}) {
    if (e instanceof G) return e;
    typeof e == 'number' && (e = Cl(e)), (this.originalInput = e);
    const s = $l(e);
    (this.originalInput = e),
      (this.r = s.r),
      (this.g = s.g),
      (this.b = s.b),
      (this.a = s.a),
      (this.roundA = Math.round(100 * this.a) / 100),
      (this.format = i.format ?? s.format),
      (this.gradientType = i.gradientType),
      this.r < 1 && (this.r = Math.round(this.r)),
      this.g < 1 && (this.g = Math.round(this.g)),
      this.b < 1 && (this.b = Math.round(this.b)),
      (this.isValid = s.ok);
  }
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return !this.isDark();
  }
  getBrightness() {
    const e = this.toRgb();
    return (e.r * 299 + e.g * 587 + e.b * 114) / 1e3;
  }
  getLuminance() {
    const e = this.toRgb();
    let i, s, o;
    const a = e.r / 255,
      n = e.g / 255,
      c = e.b / 255;
    return (
      a <= 0.03928 ? (i = a / 12.92) : (i = Math.pow((a + 0.055) / 1.055, 2.4)),
      n <= 0.03928 ? (s = n / 12.92) : (s = Math.pow((n + 0.055) / 1.055, 2.4)),
      c <= 0.03928 ? (o = c / 12.92) : (o = Math.pow((c + 0.055) / 1.055, 2.4)),
      0.2126 * i + 0.7152 * s + 0.0722 * o
    );
  }
  getAlpha() {
    return this.a;
  }
  setAlpha(e) {
    return (this.a = Ko(e)), (this.roundA = Math.round(100 * this.a) / 100), this;
  }
  isMonochrome() {
    const { s: e } = this.toHsl();
    return e === 0;
  }
  toHsv() {
    const e = ro(this.r, this.g, this.b);
    return { h: e.h * 360, s: e.s, v: e.v, a: this.a };
  }
  toHsvString() {
    const e = ro(this.r, this.g, this.b),
      i = Math.round(e.h * 360),
      s = Math.round(e.s * 100),
      o = Math.round(e.v * 100);
    return this.a === 1 ? `hsv(${i}, ${s}%, ${o}%)` : `hsva(${i}, ${s}%, ${o}%, ${this.roundA})`;
  }
  toHsl() {
    const e = oo(this.r, this.g, this.b);
    return { h: e.h * 360, s: e.s, l: e.l, a: this.a };
  }
  toHslString() {
    const e = oo(this.r, this.g, this.b),
      i = Math.round(e.h * 360),
      s = Math.round(e.s * 100),
      o = Math.round(e.l * 100);
    return this.a === 1 ? `hsl(${i}, ${s}%, ${o}%)` : `hsla(${i}, ${s}%, ${o}%, ${this.roundA})`;
  }
  toHex(e = !1) {
    return ao(this.r, this.g, this.b, e);
  }
  toHexString(e = !1) {
    return '#' + this.toHex(e);
  }
  toHex8(e = !1) {
    return _l(this.r, this.g, this.b, this.a, e);
  }
  toHex8String(e = !1) {
    return '#' + this.toHex8(e);
  }
  toHexShortString(e = !1) {
    return this.a === 1 ? this.toHexString(e) : this.toHex8String(e);
  }
  toRgb() {
    return { r: Math.round(this.r), g: Math.round(this.g), b: Math.round(this.b), a: this.a };
  }
  toRgbString() {
    const e = Math.round(this.r),
      i = Math.round(this.g),
      s = Math.round(this.b);
    return this.a === 1 ? `rgb(${e}, ${i}, ${s})` : `rgba(${e}, ${i}, ${s}, ${this.roundA})`;
  }
  toPercentageRgb() {
    const e = (i) => `${Math.round(dt(i, 255) * 100)}%`;
    return { r: e(this.r), g: e(this.g), b: e(this.b), a: this.a };
  }
  toPercentageRgbString() {
    const e = (i) => Math.round(dt(i, 255) * 100);
    return this.a === 1
      ? `rgb(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%)`
      : `rgba(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%, ${this.roundA})`;
  }
  toCmyk() {
    return { ...no(this.r, this.g, this.b) };
  }
  toCmykString() {
    const { c: e, m: i, y: s, k: o } = no(this.r, this.g, this.b);
    return `cmyk(${e}, ${i}, ${s}, ${o})`;
  }
  toName() {
    if (this.a === 0) return 'transparent';
    if (this.a < 1) return !1;
    const e = '#' + ao(this.r, this.g, this.b, !1);
    for (const [i, s] of Object.entries(hs)) if (e === s) return i;
    return !1;
  }
  toString(e) {
    const i = !!e;
    e = e ?? this.format;
    let s = !1;
    const o = this.a < 1 && this.a >= 0;
    return !i && o && (e.startsWith('hex') || e === 'name')
      ? e === 'name' && this.a === 0
        ? this.toName()
        : this.toRgbString()
      : (e === 'rgb' && (s = this.toRgbString()),
        e === 'prgb' && (s = this.toPercentageRgbString()),
        (e === 'hex' || e === 'hex6') && (s = this.toHexString()),
        e === 'hex3' && (s = this.toHexString(!0)),
        e === 'hex4' && (s = this.toHex8String(!0)),
        e === 'hex8' && (s = this.toHex8String()),
        e === 'name' && (s = this.toName()),
        e === 'hsl' && (s = this.toHslString()),
        e === 'hsv' && (s = this.toHsvString()),
        e === 'cmyk' && (s = this.toCmykString()),
        s || this.toHexString());
  }
  toNumber() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  }
  clone() {
    return new G(this.toString());
  }
  lighten(e = 10) {
    const i = this.toHsl();
    return (i.l += e / 100), (i.l = bi(i.l)), new G(i);
  }
  brighten(e = 10) {
    const i = this.toRgb();
    return (
      (i.r = Math.max(0, Math.min(255, i.r - Math.round(255 * -(e / 100))))),
      (i.g = Math.max(0, Math.min(255, i.g - Math.round(255 * -(e / 100))))),
      (i.b = Math.max(0, Math.min(255, i.b - Math.round(255 * -(e / 100))))),
      new G(i)
    );
  }
  darken(e = 10) {
    const i = this.toHsl();
    return (i.l -= e / 100), (i.l = bi(i.l)), new G(i);
  }
  tint(e = 10) {
    return this.mix('white', e);
  }
  shade(e = 10) {
    return this.mix('black', e);
  }
  desaturate(e = 10) {
    const i = this.toHsl();
    return (i.s -= e / 100), (i.s = bi(i.s)), new G(i);
  }
  saturate(e = 10) {
    const i = this.toHsl();
    return (i.s += e / 100), (i.s = bi(i.s)), new G(i);
  }
  greyscale() {
    return this.desaturate(100);
  }
  spin(e) {
    const i = this.toHsl(),
      s = (i.h + e) % 360;
    return (i.h = s < 0 ? 360 + s : s), new G(i);
  }
  mix(e, i = 50) {
    const s = this.toRgb(),
      o = new G(e).toRgb(),
      a = i / 100,
      n = { r: (o.r - s.r) * a + s.r, g: (o.g - s.g) * a + s.g, b: (o.b - s.b) * a + s.b, a: (o.a - s.a) * a + s.a };
    return new G(n);
  }
  analogous(e = 6, i = 30) {
    const s = this.toHsl(),
      o = 360 / i,
      a = [this];
    for (s.h = (s.h - ((o * e) >> 1) + 720) % 360; --e; ) (s.h = (s.h + o) % 360), a.push(new G(s));
    return a;
  }
  complement() {
    const e = this.toHsl();
    return (e.h = (e.h + 180) % 360), new G(e);
  }
  monochromatic(e = 6) {
    const i = this.toHsv(),
      { h: s } = i,
      { s: o } = i;
    let { v: a } = i;
    const n = [],
      c = 1 / e;
    for (; e--; ) n.push(new G({ h: s, s: o, v: a })), (a = (a + c) % 1);
    return n;
  }
  splitcomplement() {
    const e = this.toHsl(),
      { h: i } = e;
    return [this, new G({ h: (i + 72) % 360, s: e.s, l: e.l }), new G({ h: (i + 216) % 360, s: e.s, l: e.l })];
  }
  onBackground(e) {
    const i = this.toRgb(),
      s = new G(e).toRgb(),
      o = i.a + s.a * (1 - i.a);
    return new G({
      r: (i.r * i.a + s.r * s.a * (1 - i.a)) / o,
      g: (i.g * i.a + s.g * s.a * (1 - i.a)) / o,
      b: (i.b * i.a + s.b * s.a * (1 - i.a)) / o,
      a: o,
    });
  }
  triad() {
    return this.polyad(3);
  }
  tetrad() {
    return this.polyad(4);
  }
  polyad(e) {
    const i = this.toHsl(),
      { h: s } = i,
      o = [this],
      a = 360 / e;
    for (let n = 1; n < e; n++) o.push(new G({ h: (s + n * a) % 360, s: i.s, l: i.l }));
    return o;
  }
  equals(e) {
    const i = new G(e);
    return this.format === 'cmyk' || i.format === 'cmyk'
      ? this.toCmykString() === i.toCmykString()
      : this.toRgbString() === i.toRgbString();
  }
}
var co = 'EyeDropper' in window,
  V = class extends E {
    constructor() {
      super(),
        (this.formControlController = new Zt(this)),
        (this.isSafeValue = !1),
        (this.localize = new N(this)),
        (this.hasFocus = !1),
        (this.isDraggingGridHandle = !1),
        (this.isEmpty = !1),
        (this.inputValue = ''),
        (this.hue = 0),
        (this.saturation = 100),
        (this.brightness = 100),
        (this.alpha = 100),
        (this.value = ''),
        (this.defaultValue = ''),
        (this.label = ''),
        (this.format = 'hex'),
        (this.inline = !1),
        (this.size = 'medium'),
        (this.noFormatToggle = !1),
        (this.name = ''),
        (this.disabled = !1),
        (this.hoist = !1),
        (this.opacity = !1),
        (this.uppercase = !1),
        (this.swatches = ''),
        (this.form = ''),
        (this.required = !1),
        (this.handleFocusIn = () => {
          (this.hasFocus = !0), this.emit('sl-focus');
        }),
        (this.handleFocusOut = () => {
          (this.hasFocus = !1), this.emit('sl-blur');
        }),
        this.addEventListener('focusin', this.handleFocusIn),
        this.addEventListener('focusout', this.handleFocusOut);
    }
    get validity() {
      return this.input.validity;
    }
    get validationMessage() {
      return this.input.validationMessage;
    }
    firstUpdated() {
      this.input.updateComplete.then(() => {
        this.formControlController.updateValidity();
      });
    }
    handleCopy() {
      this.input.select(),
        document.execCommand('copy'),
        this.previewButton.focus(),
        this.previewButton.classList.add('color-picker__preview-color--copied'),
        this.previewButton.addEventListener('animationend', () => {
          this.previewButton.classList.remove('color-picker__preview-color--copied');
        });
    }
    handleFormatToggle() {
      const t = ['hex', 'rgb', 'hsl', 'hsv'],
        e = (t.indexOf(this.format) + 1) % t.length;
      (this.format = t[e]), this.setColor(this.value), this.emit('sl-change'), this.emit('sl-input');
    }
    handleAlphaDrag(t) {
      const e = this.shadowRoot.querySelector('.color-picker__slider.color-picker__alpha'),
        i = e.querySelector('.color-picker__slider-handle'),
        { width: s } = e.getBoundingClientRect();
      let o = this.value,
        a = this.value;
      i.focus(),
        t.preventDefault(),
        Ge(e, {
          onMove: (n) => {
            (this.alpha = it((n / s) * 100, 0, 100)),
              this.syncValues(),
              this.value !== a && ((a = this.value), this.emit('sl-input'));
          },
          onStop: () => {
            this.value !== o && ((o = this.value), this.emit('sl-change'));
          },
          initialEvent: t,
        });
    }
    handleHueDrag(t) {
      const e = this.shadowRoot.querySelector('.color-picker__slider.color-picker__hue'),
        i = e.querySelector('.color-picker__slider-handle'),
        { width: s } = e.getBoundingClientRect();
      let o = this.value,
        a = this.value;
      i.focus(),
        t.preventDefault(),
        Ge(e, {
          onMove: (n) => {
            (this.hue = it((n / s) * 360, 0, 360)),
              this.syncValues(),
              this.value !== a && ((a = this.value), this.emit('sl-input'));
          },
          onStop: () => {
            this.value !== o && ((o = this.value), this.emit('sl-change'));
          },
          initialEvent: t,
        });
    }
    handleGridDrag(t) {
      const e = this.shadowRoot.querySelector('.color-picker__grid'),
        i = e.querySelector('.color-picker__grid-handle'),
        { width: s, height: o } = e.getBoundingClientRect();
      let a = this.value,
        n = this.value;
      i.focus(),
        t.preventDefault(),
        (this.isDraggingGridHandle = !0),
        Ge(e, {
          onMove: (c, d) => {
            (this.saturation = it((c / s) * 100, 0, 100)),
              (this.brightness = it(100 - (d / o) * 100, 0, 100)),
              this.syncValues(),
              this.value !== n && ((n = this.value), this.emit('sl-input'));
          },
          onStop: () => {
            (this.isDraggingGridHandle = !1), this.value !== a && ((a = this.value), this.emit('sl-change'));
          },
          initialEvent: t,
        });
    }
    handleAlphaKeyDown(t) {
      const e = t.shiftKey ? 10 : 1,
        i = this.value;
      t.key === 'ArrowLeft' && (t.preventDefault(), (this.alpha = it(this.alpha - e, 0, 100)), this.syncValues()),
        t.key === 'ArrowRight' && (t.preventDefault(), (this.alpha = it(this.alpha + e, 0, 100)), this.syncValues()),
        t.key === 'Home' && (t.preventDefault(), (this.alpha = 0), this.syncValues()),
        t.key === 'End' && (t.preventDefault(), (this.alpha = 100), this.syncValues()),
        this.value !== i && (this.emit('sl-change'), this.emit('sl-input'));
    }
    handleHueKeyDown(t) {
      const e = t.shiftKey ? 10 : 1,
        i = this.value;
      t.key === 'ArrowLeft' && (t.preventDefault(), (this.hue = it(this.hue - e, 0, 360)), this.syncValues()),
        t.key === 'ArrowRight' && (t.preventDefault(), (this.hue = it(this.hue + e, 0, 360)), this.syncValues()),
        t.key === 'Home' && (t.preventDefault(), (this.hue = 0), this.syncValues()),
        t.key === 'End' && (t.preventDefault(), (this.hue = 360), this.syncValues()),
        this.value !== i && (this.emit('sl-change'), this.emit('sl-input'));
    }
    handleGridKeyDown(t) {
      const e = t.shiftKey ? 10 : 1,
        i = this.value;
      t.key === 'ArrowLeft' &&
        (t.preventDefault(), (this.saturation = it(this.saturation - e, 0, 100)), this.syncValues()),
        t.key === 'ArrowRight' &&
          (t.preventDefault(), (this.saturation = it(this.saturation + e, 0, 100)), this.syncValues()),
        t.key === 'ArrowUp' &&
          (t.preventDefault(), (this.brightness = it(this.brightness + e, 0, 100)), this.syncValues()),
        t.key === 'ArrowDown' &&
          (t.preventDefault(), (this.brightness = it(this.brightness - e, 0, 100)), this.syncValues()),
        this.value !== i && (this.emit('sl-change'), this.emit('sl-input'));
    }
    handleInputChange(t) {
      const e = t.target,
        i = this.value;
      t.stopPropagation(),
        this.input.value ? (this.setColor(e.value), (e.value = this.value)) : (this.value = ''),
        this.value !== i && (this.emit('sl-change'), this.emit('sl-input'));
    }
    handleInputInput(t) {
      this.formControlController.updateValidity(), t.stopPropagation();
    }
    handleInputKeyDown(t) {
      if (t.key === 'Enter') {
        const e = this.value;
        this.input.value
          ? (this.setColor(this.input.value),
            (this.input.value = this.value),
            this.value !== e && (this.emit('sl-change'), this.emit('sl-input')),
            setTimeout(() => this.input.select()))
          : (this.hue = 0);
      }
    }
    handleInputInvalid(t) {
      this.formControlController.setValidity(!1), this.formControlController.emitInvalidEvent(t);
    }
    handleTouchMove(t) {
      t.preventDefault();
    }
    parseColor(t) {
      const e = new G(t);
      if (!e.isValid) return null;
      const i = e.toHsl(),
        s = { h: i.h, s: i.s * 100, l: i.l * 100, a: i.a },
        o = e.toRgb(),
        a = e.toHexString(),
        n = e.toHex8String(),
        c = e.toHsv(),
        d = { h: c.h, s: c.s * 100, v: c.v * 100, a: c.a };
      return {
        hsl: {
          h: s.h,
          s: s.s,
          l: s.l,
          string: this.setLetterCase(`hsl(${Math.round(s.h)}, ${Math.round(s.s)}%, ${Math.round(s.l)}%)`),
        },
        hsla: {
          h: s.h,
          s: s.s,
          l: s.l,
          a: s.a,
          string: this.setLetterCase(
            `hsla(${Math.round(s.h)}, ${Math.round(s.s)}%, ${Math.round(s.l)}%, ${s.a.toFixed(2).toString()})`
          ),
        },
        hsv: {
          h: d.h,
          s: d.s,
          v: d.v,
          string: this.setLetterCase(`hsv(${Math.round(d.h)}, ${Math.round(d.s)}%, ${Math.round(d.v)}%)`),
        },
        hsva: {
          h: d.h,
          s: d.s,
          v: d.v,
          a: d.a,
          string: this.setLetterCase(
            `hsva(${Math.round(d.h)}, ${Math.round(d.s)}%, ${Math.round(d.v)}%, ${d.a.toFixed(2).toString()})`
          ),
        },
        rgb: {
          r: o.r,
          g: o.g,
          b: o.b,
          string: this.setLetterCase(`rgb(${Math.round(o.r)}, ${Math.round(o.g)}, ${Math.round(o.b)})`),
        },
        rgba: {
          r: o.r,
          g: o.g,
          b: o.b,
          a: o.a,
          string: this.setLetterCase(
            `rgba(${Math.round(o.r)}, ${Math.round(o.g)}, ${Math.round(o.b)}, ${o.a.toFixed(2).toString()})`
          ),
        },
        hex: this.setLetterCase(a),
        hexa: this.setLetterCase(n),
      };
    }
    setColor(t) {
      const e = this.parseColor(t);
      return e === null
        ? !1
        : ((this.hue = e.hsva.h),
          (this.saturation = e.hsva.s),
          (this.brightness = e.hsva.v),
          (this.alpha = this.opacity ? e.hsva.a * 100 : 100),
          this.syncValues(),
          !0);
    }
    setLetterCase(t) {
      return typeof t != 'string' ? '' : this.uppercase ? t.toUpperCase() : t.toLowerCase();
    }
    async syncValues() {
      const t = this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`);
      t !== null &&
        (this.format === 'hsl'
          ? (this.inputValue = this.opacity ? t.hsla.string : t.hsl.string)
          : this.format === 'rgb'
            ? (this.inputValue = this.opacity ? t.rgba.string : t.rgb.string)
            : this.format === 'hsv'
              ? (this.inputValue = this.opacity ? t.hsva.string : t.hsv.string)
              : (this.inputValue = this.opacity ? t.hexa : t.hex),
        (this.isSafeValue = !0),
        (this.value = this.inputValue),
        await this.updateComplete,
        (this.isSafeValue = !1));
    }
    handleAfterHide() {
      this.previewButton.classList.remove('color-picker__preview-color--copied');
    }
    handleEyeDropper() {
      if (!co) return;
      new EyeDropper()
        .open()
        .then((e) => {
          const i = this.value;
          this.setColor(e.sRGBHex), this.value !== i && (this.emit('sl-change'), this.emit('sl-input'));
        })
        .catch(() => {});
    }
    selectSwatch(t) {
      const e = this.value;
      this.disabled || (this.setColor(t), this.value !== e && (this.emit('sl-change'), this.emit('sl-input')));
    }
    getHexString(t, e, i, s = 100) {
      const o = new G(`hsva(${t}, ${e}%, ${i}%, ${s / 100})`);
      return o.isValid ? o.toHex8String() : '';
    }
    stopNestedEventPropagation(t) {
      t.stopImmediatePropagation();
    }
    handleFormatChange() {
      this.syncValues();
    }
    handleOpacityChange() {
      this.alpha = 100;
    }
    handleValueChange(t, e) {
      if (
        ((this.isEmpty = !e),
        e || ((this.hue = 0), (this.saturation = 0), (this.brightness = 100), (this.alpha = 100)),
        !this.isSafeValue)
      ) {
        const i = this.parseColor(e);
        i !== null
          ? ((this.inputValue = this.value),
            (this.hue = i.hsva.h),
            (this.saturation = i.hsva.s),
            (this.brightness = i.hsva.v),
            (this.alpha = i.hsva.a * 100),
            this.syncValues())
          : (this.inputValue = t ?? '');
      }
    }
    focus(t) {
      this.inline ? this.base.focus(t) : this.trigger.focus(t);
    }
    blur() {
      var t;
      const e = this.inline ? this.base : this.trigger;
      this.hasFocus && (e.focus({ preventScroll: !0 }), e.blur()),
        (t = this.dropdown) != null && t.open && this.dropdown.hide();
    }
    getFormattedValue(t = 'hex') {
      const e = this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha / 100})`);
      if (e === null) return '';
      switch (t) {
        case 'hex':
          return e.hex;
        case 'hexa':
          return e.hexa;
        case 'rgb':
          return e.rgb.string;
        case 'rgba':
          return e.rgba.string;
        case 'hsl':
          return e.hsl.string;
        case 'hsla':
          return e.hsla.string;
        case 'hsv':
          return e.hsv.string;
        case 'hsva':
          return e.hsva.string;
        default:
          return '';
      }
    }
    checkValidity() {
      return this.input.checkValidity();
    }
    getForm() {
      return this.formControlController.getForm();
    }
    reportValidity() {
      return !this.inline && !this.validity.valid
        ? (this.dropdown.show(),
          this.addEventListener('sl-after-show', () => this.input.reportValidity(), { once: !0 }),
          this.disabled || this.formControlController.emitInvalidEvent(),
          !1)
        : this.input.reportValidity();
    }
    setCustomValidity(t) {
      this.input.setCustomValidity(t), this.formControlController.updateValidity();
    }
    render() {
      const t = this.saturation,
        e = 100 - this.brightness,
        i = Array.isArray(this.swatches) ? this.swatches : this.swatches.split(';').filter((o) => o.trim() !== ''),
        s = y`
      <div
        part="base"
        class=${I({ 'color-picker': !0, 'color-picker--inline': this.inline, 'color-picker--disabled': this.disabled, 'color-picker--focused': this.hasFocus })}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-labelledby="label"
        tabindex=${this.inline ? '0' : '-1'}
      >
        ${
          this.inline
            ? y`
              <sl-visually-hidden id="label">
                <slot name="label">${this.label}</slot>
              </sl-visually-hidden>
            `
            : null
        }

        <div
          part="grid"
          class="color-picker__grid"
          style=${yt({ backgroundColor: this.getHexString(this.hue, 100, 100) })}
          @pointerdown=${this.handleGridDrag}
          @touchmove=${this.handleTouchMove}
        >
          <span
            part="grid-handle"
            class=${I({ 'color-picker__grid-handle': !0, 'color-picker__grid-handle--dragging': this.isDraggingGridHandle })}
            style=${yt({ top: `${e}%`, left: `${t}%`, backgroundColor: this.getHexString(this.hue, this.saturation, this.brightness, this.alpha) })}
            role="application"
            aria-label="HSV"
            tabindex=${z(this.disabled ? void 0 : '0')}
            @keydown=${this.handleGridKeyDown}
          ></span>
        </div>

        <div class="color-picker__controls">
          <div class="color-picker__sliders">
            <div
              part="slider hue-slider"
              class="color-picker__hue color-picker__slider"
              @pointerdown=${this.handleHueDrag}
              @touchmove=${this.handleTouchMove}
            >
              <span
                part="slider-handle hue-slider-handle"
                class="color-picker__slider-handle"
                style=${yt({ left: `${this.hue === 0 ? 0 : 100 / (360 / this.hue)}%` })}
                role="slider"
                aria-label="hue"
                aria-orientation="horizontal"
                aria-valuemin="0"
                aria-valuemax="360"
                aria-valuenow=${`${Math.round(this.hue)}`}
                tabindex=${z(this.disabled ? void 0 : '0')}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${
              this.opacity
                ? y`
                  <div
                    part="slider opacity-slider"
                    class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                    @pointerdown="${this.handleAlphaDrag}"
                    @touchmove=${this.handleTouchMove}
                  >
                    <div
                      class="color-picker__alpha-gradient"
                      style=${yt({
                        backgroundImage: `linear-gradient(
                          to right,
                          ${this.getHexString(this.hue, this.saturation, this.brightness, 0)} 0%,
                          ${this.getHexString(this.hue, this.saturation, this.brightness, 100)} 100%
                        )`,
                      })}
                    ></div>
                    <span
                      part="slider-handle opacity-slider-handle"
                      class="color-picker__slider-handle"
                      style=${yt({ left: `${this.alpha}%` })}
                      role="slider"
                      aria-label="alpha"
                      aria-orientation="horizontal"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${Math.round(this.alpha)}
                      tabindex=${z(this.disabled ? void 0 : '0')}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                `
                : ''
            }
          </div>

          <button
            type="button"
            part="preview"
            class="color-picker__preview color-picker__transparent-bg"
            aria-label=${this.localize.term('copy')}
            style=${yt({ '--preview-color': this.getHexString(this.hue, this.saturation, this.brightness, this.alpha) })}
            @click=${this.handleCopy}
          ></button>
        </div>

        <div class="color-picker__user-input" aria-live="polite">
          <sl-input
            part="input"
            type="text"
            name=${this.name}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            value=${this.isEmpty ? '' : this.inputValue}
            ?required=${this.required}
            ?disabled=${this.disabled}
            aria-label=${this.localize.term('currentValue')}
            @keydown=${this.handleInputKeyDown}
            @sl-change=${this.handleInputChange}
            @sl-input=${this.handleInputInput}
            @sl-invalid=${this.handleInputInvalid}
            @sl-blur=${this.stopNestedEventPropagation}
            @sl-focus=${this.stopNestedEventPropagation}
          ></sl-input>

          <sl-button-group>
            ${
              this.noFormatToggle
                ? ''
                : y`
                  <sl-button
                    part="format-button"
                    aria-label=${this.localize.term('toggleColorFormat')}
                    exportparts="
                      base:format-button__base,
                      prefix:format-button__prefix,
                      label:format-button__label,
                      suffix:format-button__suffix,
                      caret:format-button__caret
                    "
                    @click=${this.handleFormatToggle}
                    @sl-blur=${this.stopNestedEventPropagation}
                    @sl-focus=${this.stopNestedEventPropagation}
                  >
                    ${this.setLetterCase(this.format)}
                  </sl-button>
                `
            }
            ${
              co
                ? y`
                  <sl-button
                    part="eye-dropper-button"
                    exportparts="
                      base:eye-dropper-button__base,
                      prefix:eye-dropper-button__prefix,
                      label:eye-dropper-button__label,
                      suffix:eye-dropper-button__suffix,
                      caret:eye-dropper-button__caret
                    "
                    @click=${this.handleEyeDropper}
                    @sl-blur=${this.stopNestedEventPropagation}
                    @sl-focus=${this.stopNestedEventPropagation}
                  >
                    <sl-icon
                      library="system"
                      name="eyedropper"
                      label=${this.localize.term('selectAColorFromTheScreen')}
                    ></sl-icon>
                  </sl-button>
                `
                : ''
            }
          </sl-button-group>
        </div>

        ${
          i.length > 0
            ? y`
              <div part="swatches" class="color-picker__swatches">
                ${i.map((o) => {
                  const a = this.parseColor(o);
                  return a
                    ? y`
                    <div
                      part="swatch"
                      class="color-picker__swatch color-picker__transparent-bg"
                      tabindex=${z(this.disabled ? void 0 : '0')}
                      role="button"
                      aria-label=${o}
                      @click=${() => this.selectSwatch(o)}
                      @keydown=${(n) => !this.disabled && n.key === 'Enter' && this.setColor(a.hexa)}
                    >
                      <div
                        class="color-picker__swatch-color"
                        style=${yt({ backgroundColor: a.hexa })}
                      ></div>
                    </div>
                  `
                    : (console.error(`Unable to parse swatch color: "${o}"`, this), '');
                })}
              </div>
            `
            : ''
        }
      </div>
    `;
      return this.inline
        ? s
        : y`
      <sl-dropdown
        class="color-dropdown"
        aria-disabled=${this.disabled ? 'true' : 'false'}
        .containingElement=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @sl-after-hide=${this.handleAfterHide}
      >
        <button
          part="trigger"
          slot="trigger"
          class=${I({ 'color-dropdown__trigger': !0, 'color-dropdown__trigger--disabled': this.disabled, 'color-dropdown__trigger--small': this.size === 'small', 'color-dropdown__trigger--medium': this.size === 'medium', 'color-dropdown__trigger--large': this.size === 'large', 'color-dropdown__trigger--empty': this.isEmpty, 'color-dropdown__trigger--focused': this.hasFocus, 'color-picker__transparent-bg': !0 })}
          style=${yt({ color: this.getHexString(this.hue, this.saturation, this.brightness, this.alpha) })}
          type="button"
        >
          <sl-visually-hidden>
            <slot name="label">${this.label}</slot>
          </sl-visually-hidden>
        </button>
        ${s}
      </sl-dropdown>
    `;
    }
  };
V.styles = [D, ml];
V.dependencies = {
  'sl-button-group': _e,
  'sl-button': W,
  'sl-dropdown': pt,
  'sl-icon': j,
  'sl-input': R,
  'sl-visually-hidden': bs,
};
r([k('[part~="base"]')], V.prototype, 'base', 2);
r([k('[part~="input"]')], V.prototype, 'input', 2);
r([k('.color-dropdown')], V.prototype, 'dropdown', 2);
r([k('[part~="preview"]')], V.prototype, 'previewButton', 2);
r([k('[part~="trigger"]')], V.prototype, 'trigger', 2);
r([L()], V.prototype, 'hasFocus', 2);
r([L()], V.prototype, 'isDraggingGridHandle', 2);
r([L()], V.prototype, 'isEmpty', 2);
r([L()], V.prototype, 'inputValue', 2);
r([L()], V.prototype, 'hue', 2);
r([L()], V.prototype, 'saturation', 2);
r([L()], V.prototype, 'brightness', 2);
r([L()], V.prototype, 'alpha', 2);
r([l()], V.prototype, 'value', 2);
r([Ie()], V.prototype, 'defaultValue', 2);
r([l()], V.prototype, 'label', 2);
r([l()], V.prototype, 'format', 2);
r([l({ type: Boolean, reflect: !0 })], V.prototype, 'inline', 2);
r([l({ reflect: !0 })], V.prototype, 'size', 2);
r([l({ attribute: 'no-format-toggle', type: Boolean })], V.prototype, 'noFormatToggle', 2);
r([l()], V.prototype, 'name', 2);
r([l({ type: Boolean, reflect: !0 })], V.prototype, 'disabled', 2);
r([l({ type: Boolean })], V.prototype, 'hoist', 2);
r([l({ type: Boolean })], V.prototype, 'opacity', 2);
r([l({ type: Boolean })], V.prototype, 'uppercase', 2);
r([l()], V.prototype, 'swatches', 2);
r([l({ reflect: !0 })], V.prototype, 'form', 2);
r([l({ type: Boolean, reflect: !0 })], V.prototype, 'required', 2);
r([oi({ passive: !1 })], V.prototype, 'handleTouchMove', 1);
r([x('format', { waitUntilFirstUpdate: !0 })], V.prototype, 'handleFormatChange', 1);
r([x('opacity', { waitUntilFirstUpdate: !0 })], V.prototype, 'handleOpacityChange', 1);
r([x('value')], V.prototype, 'handleValueChange', 1);
V.define('sl-color-picker');
var Al = T`
  :host {
    --border-color: var(--sl-color-neutral-200);
    --border-radius: var(--sl-border-radius-medium);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: calc(var(--padding) / 2) var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`,
  Yo = class extends E {
    constructor() {
      super(...arguments), (this.hasSlotController = new vt(this, 'footer', 'header', 'image'));
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ card: !0, 'card--has-footer': this.hasSlotController.test('footer'), 'card--has-image': this.hasSlotController.test('image'), 'card--has-header': this.hasSlotController.test('header') })}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `;
    }
  };
Yo.styles = [D, Al];
Yo.define('sl-card');
var Tl = class {
    constructor(t, e) {
      (this.timerId = 0),
        (this.activeInteractions = 0),
        (this.paused = !1),
        (this.stopped = !0),
        (this.pause = () => {
          this.activeInteractions++ || ((this.paused = !0), this.host.requestUpdate());
        }),
        (this.resume = () => {
          --this.activeInteractions || ((this.paused = !1), this.host.requestUpdate());
        }),
        t.addController(this),
        (this.host = t),
        (this.tickCallback = e);
    }
    hostConnected() {
      this.host.addEventListener('mouseenter', this.pause),
        this.host.addEventListener('mouseleave', this.resume),
        this.host.addEventListener('focusin', this.pause),
        this.host.addEventListener('focusout', this.resume),
        this.host.addEventListener('touchstart', this.pause, { passive: !0 }),
        this.host.addEventListener('touchend', this.resume);
    }
    hostDisconnected() {
      this.stop(),
        this.host.removeEventListener('mouseenter', this.pause),
        this.host.removeEventListener('mouseleave', this.resume),
        this.host.removeEventListener('focusin', this.pause),
        this.host.removeEventListener('focusout', this.resume),
        this.host.removeEventListener('touchstart', this.pause),
        this.host.removeEventListener('touchend', this.resume);
    }
    start(t) {
      this.stop(),
        (this.stopped = !1),
        (this.timerId = window.setInterval(() => {
          this.paused || this.tickCallback();
        }, t));
    }
    stop() {
      clearInterval(this.timerId), (this.stopped = !0), this.host.requestUpdate();
    }
  },
  Ll = T`
  :host {
    --slide-gap: var(--sl-spacing-medium, 1rem);
    --aspect-ratio: 16 / 9;
    --scroll-hint: 0px;

    display: flex;
  }

  .carousel {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr min-content;
    grid-template-areas:
      '. slides .'
      '. pagination .';
    gap: var(--sl-spacing-medium);
    align-items: center;
    min-height: 100%;
    min-width: 100%;
    position: relative;
  }

  .carousel__pagination {
    grid-area: pagination;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--sl-spacing-small);
  }

  .carousel__slides {
    grid-area: slides;

    display: grid;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    aspect-ratio: calc(var(--aspect-ratio) * var(--slides-per-page));
    border-radius: var(--sl-border-radius-small);

    --slide-size: calc((100% - (var(--slides-per-page) - 1) * var(--slide-gap)) / var(--slides-per-page));
  }

  @media (prefers-reduced-motion) {
    :where(.carousel__slides) {
      scroll-behavior: auto;
    }
  }

  .carousel__slides--horizontal {
    grid-auto-flow: column;
    grid-auto-columns: var(--slide-size);
    grid-auto-rows: 100%;
    column-gap: var(--slide-gap);
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--scroll-hint);
    padding-inline: var(--scroll-hint);
    overflow-y: hidden;
  }

  .carousel__slides--vertical {
    grid-auto-flow: row;
    grid-auto-columns: 100%;
    grid-auto-rows: var(--slide-size);
    row-gap: var(--slide-gap);
    scroll-snap-type: y mandatory;
    scroll-padding-block: var(--scroll-hint);
    padding-block: var(--scroll-hint);
    overflow-x: hidden;
  }

  .carousel__slides--dragging {
  }

  :host([vertical]) ::slotted(sl-carousel-item) {
    height: 100%;
  }

  .carousel__slides::-webkit-scrollbar {
    display: none;
  }

  .carousel__navigation {
    grid-area: navigation;
    display: contents;
    font-size: var(--sl-font-size-x-large);
  }

  .carousel__navigation-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-small);
    font-size: inherit;
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-medium) color;
    appearance: none;
  }

  .carousel__navigation-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .carousel__navigation-button--disabled::part(base) {
    pointer-events: none;
  }

  .carousel__navigation-button--previous {
    grid-column: 1;
    grid-row: 1;
  }

  .carousel__navigation-button--next {
    grid-column: 3;
    grid-row: 1;
  }

  .carousel__pagination-item {
    display: block;
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: var(--sl-border-radius-circle);
    width: var(--sl-spacing-small);
    height: var(--sl-spacing-small);
    background-color: var(--sl-color-neutral-300);
    padding: 0;
    margin: 0;
  }

  .carousel__pagination-item--active {
    background-color: var(--sl-color-neutral-700);
    transform: scale(1.2);
  }

  /* Focus styles */
  .carousel__slides:focus-visible,
  .carousel__navigation-button:focus-visible,
  .carousel__pagination-item:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }
`;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function* Il(t, e) {
  if (t !== void 0) {
    let i = 0;
    for (const s of t) yield e(s, i++);
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function* Dl(t, e, i = 1) {
  const s = e === void 0 ? 0 : t;
  e ?? (e = t);
  for (let o = s; i > 0 ? o < e : e < o; o += i) yield o;
}
var J = class extends E {
  constructor() {
    super(...arguments),
      (this.loop = !1),
      (this.navigation = !1),
      (this.pagination = !1),
      (this.autoplay = !1),
      (this.autoplayInterval = 3e3),
      (this.slidesPerPage = 1),
      (this.slidesPerMove = 1),
      (this.orientation = 'horizontal'),
      (this.mouseDragging = !1),
      (this.activeSlide = 0),
      (this.scrolling = !1),
      (this.dragging = !1),
      (this.autoplayController = new Tl(this, () => this.next())),
      (this.dragStartPosition = [-1, -1]),
      (this.localize = new N(this)),
      (this.pendingSlideChange = !1),
      (this.handleMouseDrag = (t) => {
        this.dragging ||
          (this.scrollContainer.style.setProperty('scroll-snap-type', 'none'),
          (this.dragging = !0),
          (this.dragStartPosition = [t.clientX, t.clientY])),
          this.scrollContainer.scrollBy({ left: -t.movementX, top: -t.movementY, behavior: 'instant' });
      }),
      (this.handleMouseDragEnd = () => {
        const t = this.scrollContainer;
        document.removeEventListener('pointermove', this.handleMouseDrag, { capture: !0 });
        const e = t.scrollLeft,
          i = t.scrollTop;
        t.style.removeProperty('scroll-snap-type'), t.style.setProperty('overflow', 'hidden');
        const s = t.scrollLeft,
          o = t.scrollTop;
        t.style.removeProperty('overflow'),
          t.style.setProperty('scroll-snap-type', 'none'),
          t.scrollTo({ left: e, top: i, behavior: 'instant' }),
          requestAnimationFrame(async () => {
            (e !== s || i !== o) &&
              (t.scrollTo({ left: s, top: o, behavior: ss() ? 'auto' : 'smooth' }), await bt(t, 'scrollend')),
              t.style.removeProperty('scroll-snap-type'),
              (this.dragging = !1),
              (this.dragStartPosition = [-1, -1]),
              this.handleScrollEnd();
          });
      }),
      (this.handleSlotChange = (t) => {
        t.some((i) =>
          [...i.addedNodes, ...i.removedNodes].some((s) => this.isCarouselItem(s) && !s.hasAttribute('data-clone'))
        ) && this.initializeSlides(),
          this.requestUpdate();
      });
  }
  connectedCallback() {
    super.connectedCallback(),
      this.setAttribute('role', 'region'),
      this.setAttribute('aria-label', this.localize.term('carousel'));
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this.mutationObserver) == null || t.disconnect();
  }
  firstUpdated() {
    this.initializeSlides(),
      (this.mutationObserver = new MutationObserver(this.handleSlotChange)),
      this.mutationObserver.observe(this, { childList: !0, subtree: !0 });
  }
  willUpdate(t) {
    (t.has('slidesPerMove') || t.has('slidesPerPage')) &&
      (this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage));
  }
  getPageCount() {
    const t = this.getSlides().length,
      { slidesPerPage: e, slidesPerMove: i, loop: s } = this,
      o = s ? t / i : (t - e) / i + 1;
    return Math.ceil(o);
  }
  getCurrentPage() {
    return Math.ceil(this.activeSlide / this.slidesPerMove);
  }
  canScrollNext() {
    return this.loop || this.getCurrentPage() < this.getPageCount() - 1;
  }
  canScrollPrev() {
    return this.loop || this.getCurrentPage() > 0;
  }
  getSlides({ excludeClones: t = !0 } = {}) {
    return [...this.children].filter((e) => this.isCarouselItem(e) && (!t || !e.hasAttribute('data-clone')));
  }
  handleClick(t) {
    if (this.dragging && this.dragStartPosition[0] > 0 && this.dragStartPosition[1] > 0) {
      const e = Math.abs(this.dragStartPosition[0] - t.clientX),
        i = Math.abs(this.dragStartPosition[1] - t.clientY);
      Math.sqrt(e * e + i * i) >= 10 && t.preventDefault();
    }
  }
  handleKeyDown(t) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(t.key)) {
      const e = t.target,
        i = this.localize.dir() === 'rtl',
        s = e.closest('[part~="pagination-item"]') !== null,
        o = t.key === 'ArrowDown' || (!i && t.key === 'ArrowRight') || (i && t.key === 'ArrowLeft'),
        a = t.key === 'ArrowUp' || (!i && t.key === 'ArrowLeft') || (i && t.key === 'ArrowRight');
      t.preventDefault(),
        a && this.previous(),
        o && this.next(),
        t.key === 'Home' && this.goToSlide(0),
        t.key === 'End' && this.goToSlide(this.getSlides().length - 1),
        s &&
          this.updateComplete.then(() => {
            var n;
            const c = (n = this.shadowRoot) == null ? void 0 : n.querySelector('[part~="pagination-item--active"]');
            c && c.focus();
          });
    }
  }
  handleMouseDragStart(t) {
    this.mouseDragging &&
      t.button === 0 &&
      (t.preventDefault(),
      document.addEventListener('pointermove', this.handleMouseDrag, { capture: !0, passive: !0 }),
      document.addEventListener('pointerup', this.handleMouseDragEnd, { capture: !0, once: !0 }));
  }
  handleScroll() {
    (this.scrolling = !0), this.pendingSlideChange || this.synchronizeSlides();
  }
  synchronizeSlides() {
    const t = new IntersectionObserver(
      (e) => {
        t.disconnect();
        for (const c of e) {
          const d = c.target;
          d.toggleAttribute('inert', !c.isIntersecting),
            d.classList.toggle('--in-view', c.isIntersecting),
            d.setAttribute('aria-hidden', c.isIntersecting ? 'false' : 'true');
        }
        const i = e.find((c) => c.isIntersecting);
        if (!i) return;
        const s = this.getSlides({ excludeClones: !1 }),
          o = this.getSlides().length,
          a = s.indexOf(i.target),
          n = this.loop ? a - this.slidesPerPage : a;
        if (
          ((this.activeSlide = (Math.ceil(n / this.slidesPerMove) * this.slidesPerMove + o) % o),
          !this.scrolling && this.loop && i.target.hasAttribute('data-clone'))
        ) {
          const c = Number(i.target.getAttribute('data-clone'));
          this.goToSlide(c, 'instant');
        }
      },
      { root: this.scrollContainer, threshold: 0.6 }
    );
    this.getSlides({ excludeClones: !1 }).forEach((e) => {
      t.observe(e);
    });
  }
  handleScrollEnd() {
    !this.scrolling ||
      this.dragging ||
      ((this.scrolling = !1), (this.pendingSlideChange = !1), this.synchronizeSlides());
  }
  isCarouselItem(t) {
    return t instanceof Element && t.tagName.toLowerCase() === 'sl-carousel-item';
  }
  initializeSlides() {
    this.getSlides({ excludeClones: !1 }).forEach((t, e) => {
      t.classList.remove('--in-view'),
        t.classList.remove('--is-active'),
        t.setAttribute('aria-label', this.localize.term('slideNum', e + 1)),
        t.hasAttribute('data-clone') && t.remove();
    }),
      this.updateSlidesSnap(),
      this.loop && this.createClones(),
      this.goToSlide(this.activeSlide, 'auto'),
      this.synchronizeSlides();
  }
  createClones() {
    const t = this.getSlides(),
      e = this.slidesPerPage,
      i = t.slice(-e),
      s = t.slice(0, e);
    i.reverse().forEach((o, a) => {
      const n = o.cloneNode(!0);
      n.setAttribute('data-clone', String(t.length - a - 1)), this.prepend(n);
    }),
      s.forEach((o, a) => {
        const n = o.cloneNode(!0);
        n.setAttribute('data-clone', String(a)), this.append(n);
      });
  }
  handleSlideChange() {
    const t = this.getSlides();
    t.forEach((e, i) => {
      e.classList.toggle('--is-active', i === this.activeSlide);
    }),
      this.hasUpdated &&
        this.emit('sl-slide-change', { detail: { index: this.activeSlide, slide: t[this.activeSlide] } });
  }
  updateSlidesSnap() {
    const t = this.getSlides(),
      e = this.slidesPerMove;
    t.forEach((i, s) => {
      (s + e) % e === 0
        ? i.style.removeProperty('scroll-snap-align')
        : i.style.setProperty('scroll-snap-align', 'none');
    });
  }
  handleAutoplayChange() {
    this.autoplayController.stop(), this.autoplay && this.autoplayController.start(this.autoplayInterval);
  }
  previous(t = 'smooth') {
    this.goToSlide(this.activeSlide - this.slidesPerMove, t);
  }
  next(t = 'smooth') {
    this.goToSlide(this.activeSlide + this.slidesPerMove, t);
  }
  goToSlide(t, e = 'smooth') {
    const { slidesPerPage: i, loop: s } = this,
      o = this.getSlides(),
      a = this.getSlides({ excludeClones: !1 });
    if (!o.length) return;
    const n = s ? (t + o.length) % o.length : it(t, 0, o.length - i);
    this.activeSlide = n;
    const c = this.localize.dir() === 'rtl',
      d = it(t + (s ? i : 0) + (c ? i - 1 : 0), 0, a.length - 1),
      h = a[d];
    this.scrollToSlide(h, ss() ? 'auto' : e);
  }
  scrollToSlide(t, e = 'smooth') {
    (this.pendingSlideChange = !0),
      window.requestAnimationFrame(() => {
        if (!this.scrollContainer) return;
        const i = this.scrollContainer,
          s = i.getBoundingClientRect(),
          o = t.getBoundingClientRect(),
          a = o.left - s.left,
          n = o.top - s.top;
        a || n
          ? ((this.pendingSlideChange = !0), i.scrollTo({ left: a + i.scrollLeft, top: n + i.scrollTop, behavior: e }))
          : (this.pendingSlideChange = !1);
      });
  }
  render() {
    const { slidesPerMove: t, scrolling: e } = this,
      i = this.getPageCount(),
      s = this.getCurrentPage(),
      o = this.canScrollPrev(),
      a = this.canScrollNext(),
      n = this.localize.dir() === 'ltr';
    return y`
      <div part="base" class="carousel">
        <div
          id="scroll-container"
          part="scroll-container"
          class="${I({ carousel__slides: !0, 'carousel__slides--horizontal': this.orientation === 'horizontal', 'carousel__slides--vertical': this.orientation === 'vertical', 'carousel__slides--dragging': this.dragging })}"
          style="--slides-per-page: ${this.slidesPerPage};"
          aria-busy="${e ? 'true' : 'false'}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @mousedown="${this.handleMouseDragStart}"
          @scroll="${this.handleScroll}"
          @scrollend=${this.handleScrollEnd}
          @click=${this.handleClick}
        >
          <slot></slot>
        </div>

        ${
          this.navigation
            ? y`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${I({ 'carousel__navigation-button': !0, 'carousel__navigation-button--previous': !0, 'carousel__navigation-button--disabled': !o })}"
                  aria-label="${this.localize.term('previousSlide')}"
                  aria-controls="scroll-container"
                  aria-disabled="${o ? 'false' : 'true'}"
                  @click=${o ? () => this.previous() : null}
                >
                  <slot name="previous-icon">
                    <sl-icon library="system" name="${n ? 'chevron-left' : 'chevron-right'}"></sl-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${I({ 'carousel__navigation-button': !0, 'carousel__navigation-button--next': !0, 'carousel__navigation-button--disabled': !a })}
                  aria-label="${this.localize.term('nextSlide')}"
                  aria-controls="scroll-container"
                  aria-disabled="${a ? 'false' : 'true'}"
                  @click=${a ? () => this.next() : null}
                >
                  <slot name="next-icon">
                    <sl-icon library="system" name="${n ? 'chevron-right' : 'chevron-left'}"></sl-icon>
                  </slot>
                </button>
              </div>
            `
            : ''
        }
        ${
          this.pagination
            ? y`
              <div part="pagination" role="tablist" class="carousel__pagination" aria-controls="scroll-container">
                ${Il(Dl(i), (c) => {
                  const d = c === s;
                  return y`
                    <button
                      part="pagination-item ${d ? 'pagination-item--active' : ''}"
                      class="${I({ 'carousel__pagination-item': !0, 'carousel__pagination-item--active': d })}"
                      role="tab"
                      aria-selected="${d ? 'true' : 'false'}"
                      aria-label="${this.localize.term('goToSlide', c + 1, i)}"
                      tabindex=${d ? '0' : '-1'}
                      @click=${() => this.goToSlide(c * t)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `;
                })}
              </div>
            `
            : ''
        }
      </div>
    `;
  }
};
J.styles = [D, Ll];
J.dependencies = { 'sl-icon': j };
r([l({ type: Boolean, reflect: !0 })], J.prototype, 'loop', 2);
r([l({ type: Boolean, reflect: !0 })], J.prototype, 'navigation', 2);
r([l({ type: Boolean, reflect: !0 })], J.prototype, 'pagination', 2);
r([l({ type: Boolean, reflect: !0 })], J.prototype, 'autoplay', 2);
r([l({ type: Number, attribute: 'autoplay-interval' })], J.prototype, 'autoplayInterval', 2);
r([l({ type: Number, attribute: 'slides-per-page' })], J.prototype, 'slidesPerPage', 2);
r([l({ type: Number, attribute: 'slides-per-move' })], J.prototype, 'slidesPerMove', 2);
r([l()], J.prototype, 'orientation', 2);
r([l({ type: Boolean, reflect: !0, attribute: 'mouse-dragging' })], J.prototype, 'mouseDragging', 2);
r([k('.carousel__slides')], J.prototype, 'scrollContainer', 2);
r([k('.carousel__pagination')], J.prototype, 'paginationContainer', 2);
r([L()], J.prototype, 'activeSlide', 2);
r([L()], J.prototype, 'scrolling', 2);
r([L()], J.prototype, 'dragging', 2);
r([oi({ passive: !0 })], J.prototype, 'handleScroll', 1);
r(
  [x('loop', { waitUntilFirstUpdate: !0 }), x('slidesPerPage', { waitUntilFirstUpdate: !0 })],
  J.prototype,
  'initializeSlides',
  1
);
r([x('activeSlide')], J.prototype, 'handleSlideChange', 1);
r([x('slidesPerMove')], J.prototype, 'updateSlidesSnap', 1);
r([x('autoplay')], J.prototype, 'handleAutoplayChange', 1);
J.define('sl-carousel');
var Pl = (t, e) => {
    let i = 0;
    return function (...s) {
      window.clearTimeout(i),
        (i = window.setTimeout(() => {
          t.call(this, ...s);
        }, e));
    };
  },
  ho = (t, e, i) => {
    const s = t[e];
    t[e] = function (...o) {
      s.call(this, ...o), i.call(this, s, ...o);
    };
  };
(() => {
  if (typeof window > 'u') return;
  if (!('onscrollend' in window)) {
    const e = new Set(),
      i = new WeakMap(),
      s = (a) => {
        for (const n of a.changedTouches) e.add(n.identifier);
      },
      o = (a) => {
        for (const n of a.changedTouches) e.delete(n.identifier);
      };
    document.addEventListener('touchstart', s, !0),
      document.addEventListener('touchend', o, !0),
      document.addEventListener('touchcancel', o, !0),
      ho(EventTarget.prototype, 'addEventListener', function (a, n) {
        if (n !== 'scrollend') return;
        const c = Pl(() => {
          e.size ? c() : this.dispatchEvent(new Event('scrollend'));
        }, 100);
        a.call(this, 'scroll', c, { passive: !0 }), i.set(this, c);
      }),
      ho(EventTarget.prototype, 'removeEventListener', function (a, n) {
        if (n !== 'scrollend') return;
        const c = i.get(this);
        c && a.call(this, 'scroll', c, { passive: !0 });
      });
  }
})();
var Ol = T`
  :host {
    --aspect-ratio: inherit;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    aspect-ratio: var(--aspect-ratio);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  ::slotted(img) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }
`,
  Xo = class extends E {
    connectedCallback() {
      super.connectedCallback(), this.setAttribute('role', 'group');
    }
    render() {
      return y` <slot></slot> `;
    }
  };
Xo.styles = [D, Ol];
Xo.define('sl-carousel-item');
_e.define('sl-button-group');
W.define('sl-button');
var Ml = T`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`,
  Oe = class extends E {
    constructor() {
      super(...arguments), (this.localize = new N(this)), (this.separatorDir = this.localize.dir()), (this.label = '');
    }
    getSeparator() {
      const e = this.separatorSlot.assignedElements({ flatten: !0 })[0].cloneNode(!0);
      return (
        [e, ...e.querySelectorAll('[id]')].forEach((i) => i.removeAttribute('id')),
        e.setAttribute('data-default', ''),
        (e.slot = 'separator'),
        e
      );
    }
    handleSlotChange() {
      const t = [...this.defaultSlot.assignedElements({ flatten: !0 })].filter(
        (e) => e.tagName.toLowerCase() === 'sl-breadcrumb-item'
      );
      t.forEach((e, i) => {
        const s = e.querySelector('[slot="separator"]');
        s === null
          ? e.append(this.getSeparator())
          : s.hasAttribute('data-default') && s.replaceWith(this.getSeparator()),
          i === t.length - 1 ? e.setAttribute('aria-current', 'page') : e.removeAttribute('aria-current');
      });
    }
    render() {
      return (
        this.separatorDir !== this.localize.dir() &&
          ((this.separatorDir = this.localize.dir()), this.updateComplete.then(() => this.handleSlotChange())),
        y`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir() === 'rtl' ? 'chevron-left' : 'chevron-right'} library="system"></sl-icon>
        </slot>
      </span>
    `
      );
    }
  };
Oe.styles = [D, Ml];
Oe.dependencies = { 'sl-icon': j };
r([k('slot')], Oe.prototype, 'defaultSlot', 2);
r([k('slot[name="separator"]')], Oe.prototype, 'separatorSlot', 2);
r([l()], Oe.prototype, 'label', 2);
Oe.define('sl-breadcrumb');
var Rl = T`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`,
  ui = class extends E {
    constructor() {
      super(...arguments), (this.variant = 'primary'), (this.pill = !1), (this.pulse = !1);
    }
    render() {
      return y`
      <span
        part="base"
        class=${I({ badge: !0, 'badge--primary': this.variant === 'primary', 'badge--success': this.variant === 'success', 'badge--neutral': this.variant === 'neutral', 'badge--warning': this.variant === 'warning', 'badge--danger': this.variant === 'danger', 'badge--pill': this.pill, 'badge--pulse': this.pulse })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
    }
  };
ui.styles = [D, Rl];
r([l({ reflect: !0 })], ui.prototype, 'variant', 2);
r([l({ type: Boolean, reflect: !0 })], ui.prototype, 'pill', 2);
r([l({ type: Boolean, reflect: !0 })], ui.prototype, 'pulse', 2);
ui.define('sl-badge');
var Fl = T`
  :host {
    display: inline-flex;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-600);
    line-height: var(--sl-line-height-normal);
    white-space: nowrap;
  }

  .breadcrumb-item__label {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    color: inherit;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: var(--sl-transition-fast) --color;
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label {
    color: var(--sl-color-primary-600);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:hover {
    color: var(--sl-color-primary-500);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:active {
    color: var(--sl-color-primary-600);
  }

  .breadcrumb-item__label:focus {
    outline: none;
  }

  .breadcrumb-item__label:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .breadcrumb-item__prefix,
  .breadcrumb-item__suffix {
    display: none;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .breadcrumb-item--has-prefix .breadcrumb-item__prefix {
    display: inline-flex;
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .breadcrumb-item--has-suffix .breadcrumb-item__suffix {
    display: inline-flex;
    margin-inline-start: var(--sl-spacing-x-small);
  }

  :host(:last-of-type) .breadcrumb-item__separator {
    display: none;
  }

  .breadcrumb-item__separator {
    display: inline-flex;
    align-items: center;
    margin: 0 var(--sl-spacing-x-small);
    user-select: none;
    -webkit-user-select: none;
  }
`,
  le = class extends E {
    constructor() {
      super(...arguments),
        (this.hasSlotController = new vt(this, 'prefix', 'suffix')),
        (this.renderType = 'button'),
        (this.rel = 'noreferrer noopener');
    }
    setRenderType() {
      const t =
        this.defaultSlot.assignedElements({ flatten: !0 }).filter((e) => e.tagName.toLowerCase() === 'sl-dropdown')
          .length > 0;
      if (this.href) {
        this.renderType = 'link';
        return;
      }
      if (t) {
        this.renderType = 'dropdown';
        return;
      }
      this.renderType = 'button';
    }
    hrefChanged() {
      this.setRenderType();
    }
    handleSlotChange() {
      this.setRenderType();
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ 'breadcrumb-item': !0, 'breadcrumb-item--has-prefix': this.hasSlotController.test('prefix'), 'breadcrumb-item--has-suffix': this.hasSlotController.test('suffix') })}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${
          this.renderType === 'link'
            ? y`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${z(this.target ? this.target : void 0)}"
                rel=${z(this.target ? this.rel : void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            `
            : ''
        }
        ${
          this.renderType === 'button'
            ? y`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            `
            : ''
        }
        ${
          this.renderType === 'dropdown'
            ? y`
              <div part="label" class="breadcrumb-item__label breadcrumb-item__label--drop-down">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            `
            : ''
        }

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `;
    }
  };
le.styles = [D, Fl];
r([k('slot:not([name])')], le.prototype, 'defaultSlot', 2);
r([L()], le.prototype, 'renderType', 2);
r([l()], le.prototype, 'href', 2);
r([l()], le.prototype, 'target', 2);
r([l()], le.prototype, 'rel', 2);
r([x('href', { waitUntilFirstUpdate: !0 })], le.prototype, 'hrefChanged', 1);
le.define('sl-breadcrumb-item');
var Bl = T`
  :host {
    display: contents;
  }
`;
const Vl = [
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
    { offset: 0.2, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
    {
      offset: 0.4,
      easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
    },
    {
      offset: 0.43,
      easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
    },
    { offset: 0.53, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
    {
      offset: 0.7,
      easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
    },
    {
      offset: 0.8,
      'transition-timing-function': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      transform: 'translate3d(0, 0, 0) scaleY(0.95)',
    },
    { offset: 0.9, transform: 'translate3d(0, -4px, 0) scaleY(1.02)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
  ],
  Nl = [
    { offset: 0, opacity: '1' },
    { offset: 0.25, opacity: '0' },
    { offset: 0.5, opacity: '1' },
    { offset: 0.75, opacity: '0' },
    { offset: 1, opacity: '1' },
  ],
  Hl = [
    { offset: 0, transform: 'translateX(0)' },
    { offset: 0.065, transform: 'translateX(-6px) rotateY(-9deg)' },
    { offset: 0.185, transform: 'translateX(5px) rotateY(7deg)' },
    { offset: 0.315, transform: 'translateX(-3px) rotateY(-5deg)' },
    { offset: 0.435, transform: 'translateX(2px) rotateY(3deg)' },
    { offset: 0.5, transform: 'translateX(0)' },
  ],
  Ul = [
    { offset: 0, transform: 'scale(1)' },
    { offset: 0.14, transform: 'scale(1.3)' },
    { offset: 0.28, transform: 'scale(1)' },
    { offset: 0.42, transform: 'scale(1.3)' },
    { offset: 0.7, transform: 'scale(1)' },
  ],
  ql = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.111, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.222, transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
    { offset: 0.33299999999999996, transform: 'skewX(6.25deg) skewY(6.25deg)' },
    { offset: 0.444, transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
    { offset: 0.555, transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
    { offset: 0.6659999999999999, transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
    { offset: 0.777, transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
    { offset: 0.888, transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Wl = [
    { offset: 0, transform: 'scale3d(1, 1, 1)' },
    { offset: 0.5, transform: 'scale3d(1.05, 1.05, 1.05)' },
    { offset: 1, transform: 'scale3d(1, 1, 1)' },
  ],
  jl = [
    { offset: 0, transform: 'scale3d(1, 1, 1)' },
    { offset: 0.3, transform: 'scale3d(1.25, 0.75, 1)' },
    { offset: 0.4, transform: 'scale3d(0.75, 1.25, 1)' },
    { offset: 0.5, transform: 'scale3d(1.15, 0.85, 1)' },
    { offset: 0.65, transform: 'scale3d(0.95, 1.05, 1)' },
    { offset: 0.75, transform: 'scale3d(1.05, 0.95, 1)' },
    { offset: 1, transform: 'scale3d(1, 1, 1)' },
  ],
  Kl = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.1, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.2, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.3, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.4, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.5, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.6, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.7, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.8, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.9, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Yl = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.1, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.2, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.3, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.4, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.5, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.6, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.7, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 0.8, transform: 'translate3d(10px, 0, 0)' },
    { offset: 0.9, transform: 'translate3d(-10px, 0, 0)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Xl = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.1, transform: 'translate3d(0, -10px, 0)' },
    { offset: 0.2, transform: 'translate3d(0, 10px, 0)' },
    { offset: 0.3, transform: 'translate3d(0, -10px, 0)' },
    { offset: 0.4, transform: 'translate3d(0, 10px, 0)' },
    { offset: 0.5, transform: 'translate3d(0, -10px, 0)' },
    { offset: 0.6, transform: 'translate3d(0, 10px, 0)' },
    { offset: 0.7, transform: 'translate3d(0, -10px, 0)' },
    { offset: 0.8, transform: 'translate3d(0, 10px, 0)' },
    { offset: 0.9, transform: 'translate3d(0, -10px, 0)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Gl = [
    { offset: 0.2, transform: 'rotate3d(0, 0, 1, 15deg)' },
    { offset: 0.4, transform: 'rotate3d(0, 0, 1, -10deg)' },
    { offset: 0.6, transform: 'rotate3d(0, 0, 1, 5deg)' },
    { offset: 0.8, transform: 'rotate3d(0, 0, 1, -5deg)' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, 0deg)' },
  ],
  Ql = [
    { offset: 0, transform: 'scale3d(1, 1, 1)' },
    { offset: 0.1, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.2, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.3, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
    { offset: 0.4, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.5, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
    { offset: 0.6, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.7, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
    { offset: 0.8, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.9, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
    { offset: 1, transform: 'scale3d(1, 1, 1)' },
  ],
  Zl = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 0.15, transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)' },
    { offset: 0.3, transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)' },
    { offset: 0.45, transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)' },
    { offset: 0.6, transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)' },
    { offset: 0.75, transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Jl = [
    { offset: 0, transform: 'translateY(-1200px) scale(0.7)', opacity: '0.7' },
    { offset: 0.8, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'scale(1)', opacity: '1' },
  ],
  tc = [
    { offset: 0, transform: 'translateX(-2000px) scale(0.7)', opacity: '0.7' },
    { offset: 0.8, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'scale(1)', opacity: '1' },
  ],
  ec = [
    { offset: 0, transform: 'translateX(2000px) scale(0.7)', opacity: '0.7' },
    { offset: 0.8, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'scale(1)', opacity: '1' },
  ],
  ic = [
    { offset: 0, transform: 'translateY(1200px) scale(0.7)', opacity: '0.7' },
    { offset: 0.8, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'scale(1)', opacity: '1' },
  ],
  sc = [
    { offset: 0, transform: 'scale(1)', opacity: '1' },
    { offset: 0.2, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'translateY(700px) scale(0.7)', opacity: '0.7' },
  ],
  oc = [
    { offset: 0, transform: 'scale(1)', opacity: '1' },
    { offset: 0.2, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'translateX(-2000px) scale(0.7)', opacity: '0.7' },
  ],
  rc = [
    { offset: 0, transform: 'scale(1)', opacity: '1' },
    { offset: 0.2, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'translateX(2000px) scale(0.7)', opacity: '0.7' },
  ],
  ac = [
    { offset: 0, transform: 'scale(1)', opacity: '1' },
    { offset: 0.2, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
    { offset: 1, transform: 'translateY(-700px) scale(0.7)', opacity: '0.7' },
  ],
  nc = [
    { offset: 0, opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.2, transform: 'scale3d(1.1, 1.1, 1.1)' },
    { offset: 0.2, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.4, transform: 'scale3d(0.9, 0.9, 0.9)' },
    { offset: 0.4, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.6, opacity: '1', transform: 'scale3d(1.03, 1.03, 1.03)' },
    { offset: 0.6, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.8, transform: 'scale3d(0.97, 0.97, 0.97)' },
    { offset: 0.8, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 1, opacity: '1', transform: 'scale3d(1, 1, 1)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  ],
  lc = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, -3000px, 0) scaleY(3)' },
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.6, opacity: '1', transform: 'translate3d(0, 25px, 0) scaleY(0.9)' },
    { offset: 0.6, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.75, transform: 'translate3d(0, -10px, 0) scaleY(0.95)' },
    { offset: 0.75, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.9, transform: 'translate3d(0, 5px, 0) scaleY(0.985)' },
    { offset: 0.9, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  ],
  cc = [
    { offset: 0, opacity: '0', transform: 'translate3d(-3000px, 0, 0) scaleX(3)' },
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.6, opacity: '1', transform: 'translate3d(25px, 0, 0) scaleX(1)' },
    { offset: 0.6, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.75, transform: 'translate3d(-10px, 0, 0) scaleX(0.98)' },
    { offset: 0.75, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.9, transform: 'translate3d(5px, 0, 0) scaleX(0.995)' },
    { offset: 0.9, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  ],
  dc = [
    { offset: 0, opacity: '0', transform: 'translate3d(3000px, 0, 0) scaleX(3)' },
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.6, opacity: '1', transform: 'translate3d(-25px, 0, 0) scaleX(1)' },
    { offset: 0.6, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.75, transform: 'translate3d(10px, 0, 0) scaleX(0.98)' },
    { offset: 0.75, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.9, transform: 'translate3d(-5px, 0, 0) scaleX(0.995)' },
    { offset: 0.9, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  ],
  hc = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, 3000px, 0) scaleY(5)' },
    { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.6, opacity: '1', transform: 'translate3d(0, -20px, 0) scaleY(0.9)' },
    { offset: 0.6, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.75, transform: 'translate3d(0, 10px, 0) scaleY(0.95)' },
    { offset: 0.75, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 0.9, transform: 'translate3d(0, -5px, 0) scaleY(0.985)' },
    { offset: 0.9, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' },
  ],
  uc = [
    { offset: 0.2, transform: 'scale3d(0.9, 0.9, 0.9)' },
    { offset: 0.5, opacity: '1', transform: 'scale3d(1.1, 1.1, 1.1)' },
    { offset: 0.55, opacity: '1', transform: 'scale3d(1.1, 1.1, 1.1)' },
    { offset: 1, opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
  ],
  pc = [
    { offset: 0.2, transform: 'translate3d(0, 10px, 0) scaleY(0.985)' },
    { offset: 0.4, opacity: '1', transform: 'translate3d(0, -20px, 0) scaleY(0.9)' },
    { offset: 0.45, opacity: '1', transform: 'translate3d(0, -20px, 0) scaleY(0.9)' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, 2000px, 0) scaleY(3)' },
  ],
  fc = [
    { offset: 0.2, opacity: '1', transform: 'translate3d(20px, 0, 0) scaleX(0.9)' },
    { offset: 1, opacity: '0', transform: 'translate3d(-2000px, 0, 0) scaleX(2)' },
  ],
  mc = [
    { offset: 0.2, opacity: '1', transform: 'translate3d(-20px, 0, 0) scaleX(0.9)' },
    { offset: 1, opacity: '0', transform: 'translate3d(2000px, 0, 0) scaleX(2)' },
  ],
  gc = [
    { offset: 0.2, transform: 'translate3d(0, -10px, 0) scaleY(0.985)' },
    { offset: 0.4, opacity: '1', transform: 'translate3d(0, 20px, 0) scaleY(0.9)' },
    { offset: 0.45, opacity: '1', transform: 'translate3d(0, 20px, 0) scaleY(0.9)' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, -2000px, 0) scaleY(3)' },
  ],
  bc = [
    { offset: 0, opacity: '0' },
    { offset: 1, opacity: '1' },
  ],
  vc = [
    { offset: 0, opacity: '0', transform: 'translate3d(-100%, 100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  yc = [
    { offset: 0, opacity: '0', transform: 'translate3d(100%, 100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  wc = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, -100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  _c = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, -2000px, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  xc = [
    { offset: 0, opacity: '0', transform: 'translate3d(-100%, 0, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  kc = [
    { offset: 0, opacity: '0', transform: 'translate3d(-2000px, 0, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  Cc = [
    { offset: 0, opacity: '0', transform: 'translate3d(100%, 0, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  $c = [
    { offset: 0, opacity: '0', transform: 'translate3d(2000px, 0, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  Sc = [
    { offset: 0, opacity: '0', transform: 'translate3d(-100%, -100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  zc = [
    { offset: 0, opacity: '0', transform: 'translate3d(100%, -100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  Ec = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, 100%, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  Ac = [
    { offset: 0, opacity: '0', transform: 'translate3d(0, 2000px, 0)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  Tc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0' },
  ],
  Lc = [
    { offset: 0, opacity: '1', transform: 'translate3d(0, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'translate3d(-100%, 100%, 0)' },
  ],
  Ic = [
    { offset: 0, opacity: '1', transform: 'translate3d(0, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'translate3d(100%, 100%, 0)' },
  ],
  Dc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, 100%, 0)' },
  ],
  Pc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, 2000px, 0)' },
  ],
  Oc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(-100%, 0, 0)' },
  ],
  Mc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(-2000px, 0, 0)' },
  ],
  Rc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(100%, 0, 0)' },
  ],
  Fc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(2000px, 0, 0)' },
  ],
  Bc = [
    { offset: 0, opacity: '1', transform: 'translate3d(0, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'translate3d(-100%, -100%, 0)' },
  ],
  Vc = [
    { offset: 0, opacity: '1', transform: 'translate3d(0, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'translate3d(100%, -100%, 0)' },
  ],
  Nc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, -100%, 0)' },
  ],
  Hc = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(0, -2000px, 0)' },
  ],
  Uc = [
    {
      offset: 0,
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)',
      easing: 'ease-out',
    },
    {
      offset: 0.4,
      transform: `perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -190deg)`,
      easing: 'ease-out',
    },
    {
      offset: 0.5,
      transform: `perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px)
      rotate3d(0, 1, 0, -170deg)`,
      easing: 'ease-in',
    },
    {
      offset: 0.8,
      transform: `perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0)
      rotate3d(0, 1, 0, 0deg)`,
      easing: 'ease-in',
    },
    {
      offset: 1,
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
      easing: 'ease-in',
    },
  ],
  qc = [
    { offset: 0, transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', easing: 'ease-in', opacity: '0' },
    { offset: 0.4, transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', easing: 'ease-in' },
    { offset: 0.6, transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)', opacity: '1' },
    { offset: 0.8, transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)' },
    { offset: 1, transform: 'perspective(400px)' },
  ],
  Wc = [
    { offset: 0, transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', easing: 'ease-in', opacity: '0' },
    { offset: 0.4, transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', easing: 'ease-in' },
    { offset: 0.6, transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)', opacity: '1' },
    { offset: 0.8, transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)' },
    { offset: 1, transform: 'perspective(400px)' },
  ],
  jc = [
    { offset: 0, transform: 'perspective(400px)' },
    { offset: 0.3, transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: '1' },
    { offset: 1, transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: '0' },
  ],
  Kc = [
    { offset: 0, transform: 'perspective(400px)' },
    { offset: 0.3, transform: 'perspective(400px) rotate3d(0, 1, 0, -15deg)', opacity: '1' },
    { offset: 1, transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: '0' },
  ],
  Yc = [
    { offset: 0, transform: 'translate3d(-100%, 0, 0) skewX(30deg)', opacity: '0' },
    { offset: 0.6, transform: 'skewX(-20deg)', opacity: '1' },
    { offset: 0.8, transform: 'skewX(5deg)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Xc = [
    { offset: 0, transform: 'translate3d(100%, 0, 0) skewX(-30deg)', opacity: '0' },
    { offset: 0.6, transform: 'skewX(20deg)', opacity: '1' },
    { offset: 0.8, transform: 'skewX(-5deg)' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  Gc = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'translate3d(-100%, 0, 0) skewX(-30deg)', opacity: '0' },
  ],
  Qc = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'translate3d(100%, 0, 0) skewX(30deg)', opacity: '0' },
  ],
  Zc = [
    { offset: 0, transform: 'rotate3d(0, 0, 1, -200deg)', opacity: '0' },
    { offset: 1, transform: 'translate3d(0, 0, 0)', opacity: '1' },
  ],
  Jc = [
    { offset: 0, transform: 'rotate3d(0, 0, 1, -45deg)', opacity: '0' },
    { offset: 1, transform: 'translate3d(0, 0, 0)', opacity: '1' },
  ],
  td = [
    { offset: 0, transform: 'rotate3d(0, 0, 1, 45deg)', opacity: '0' },
    { offset: 1, transform: 'translate3d(0, 0, 0)', opacity: '1' },
  ],
  ed = [
    { offset: 0, transform: 'rotate3d(0, 0, 1, 45deg)', opacity: '0' },
    { offset: 1, transform: 'translate3d(0, 0, 0)', opacity: '1' },
  ],
  id = [
    { offset: 0, transform: 'rotate3d(0, 0, 1, -90deg)', opacity: '0' },
    { offset: 1, transform: 'translate3d(0, 0, 0)', opacity: '1' },
  ],
  sd = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, 200deg)', opacity: '0' },
  ],
  od = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, 45deg)', opacity: '0' },
  ],
  rd = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, -45deg)', opacity: '0' },
  ],
  ad = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, -45deg)', opacity: '0' },
  ],
  nd = [
    { offset: 0, opacity: '1' },
    { offset: 1, transform: 'rotate3d(0, 0, 1, 90deg)', opacity: '0' },
  ],
  ld = [
    { offset: 0, transform: 'translate3d(0, -100%, 0)', visibility: 'visible' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  cd = [
    { offset: 0, transform: 'translate3d(-100%, 0, 0)', visibility: 'visible' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  dd = [
    { offset: 0, transform: 'translate3d(100%, 0, 0)', visibility: 'visible' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  hd = [
    { offset: 0, transform: 'translate3d(0, 100%, 0)', visibility: 'visible' },
    { offset: 1, transform: 'translate3d(0, 0, 0)' },
  ],
  ud = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, visibility: 'hidden', transform: 'translate3d(0, 100%, 0)' },
  ],
  pd = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, visibility: 'hidden', transform: 'translate3d(-100%, 0, 0)' },
  ],
  fd = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, visibility: 'hidden', transform: 'translate3d(100%, 0, 0)' },
  ],
  md = [
    { offset: 0, transform: 'translate3d(0, 0, 0)' },
    { offset: 1, visibility: 'hidden', transform: 'translate3d(0, -100%, 0)' },
  ],
  gd = [
    { offset: 0, easing: 'ease-in-out' },
    { offset: 0.2, transform: 'rotate3d(0, 0, 1, 80deg)', easing: 'ease-in-out' },
    { offset: 0.4, transform: 'rotate3d(0, 0, 1, 60deg)', easing: 'ease-in-out', opacity: '1' },
    { offset: 0.6, transform: 'rotate3d(0, 0, 1, 80deg)', easing: 'ease-in-out' },
    { offset: 0.8, transform: 'rotate3d(0, 0, 1, 60deg)', easing: 'ease-in-out', opacity: '1' },
    { offset: 1, transform: 'translate3d(0, 700px, 0)', opacity: '0' },
  ],
  bd = [
    { offset: 0, opacity: '0', transform: 'scale(0.1) rotate(30deg)', 'transform-origin': 'center bottom' },
    { offset: 0.5, transform: 'rotate(-10deg)' },
    { offset: 0.7, transform: 'rotate(3deg)' },
    { offset: 1, opacity: '1', transform: 'scale(1)' },
  ],
  vd = [
    { offset: 0, opacity: '0', transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' },
    { offset: 1, opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ],
  yd = [
    { offset: 0, opacity: '1' },
    { offset: 1, opacity: '0', transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)' },
  ],
  wd = [
    { offset: 0, opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
    { offset: 0.5, opacity: '1' },
  ],
  _d = [
    {
      offset: 0,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 0.6,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  xd = [
    {
      offset: 0,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 0.6,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  kd = [
    {
      offset: 0,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 0.6,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  Cd = [
    {
      offset: 0,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 0.6,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  $d = [
    { offset: 0, opacity: '1' },
    { offset: 0.5, opacity: '0', transform: 'scale3d(0.3, 0.3, 0.3)' },
    { offset: 1, opacity: '0' },
  ],
  Sd = [
    {
      offset: 0.4,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 1,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  zd = [
    { offset: 0.4, opacity: '1', transform: 'scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'scale(0.1) translate3d(-2000px, 0, 0)' },
  ],
  Ed = [
    { offset: 0.4, opacity: '1', transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0)' },
    { offset: 1, opacity: '0', transform: 'scale(0.1) translate3d(2000px, 0, 0)' },
  ],
  Ad = [
    {
      offset: 0.4,
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
      easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    {
      offset: 1,
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  ],
  Go = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
    easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
    easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
    easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
    easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
    easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
    easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  Td = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        backInDown: Jl,
        backInLeft: tc,
        backInRight: ec,
        backInUp: ic,
        backOutDown: sc,
        backOutLeft: oc,
        backOutRight: rc,
        backOutUp: ac,
        bounce: Vl,
        bounceIn: nc,
        bounceInDown: lc,
        bounceInLeft: cc,
        bounceInRight: dc,
        bounceInUp: hc,
        bounceOut: uc,
        bounceOutDown: pc,
        bounceOutLeft: fc,
        bounceOutRight: mc,
        bounceOutUp: gc,
        easings: Go,
        fadeIn: bc,
        fadeInBottomLeft: vc,
        fadeInBottomRight: yc,
        fadeInDown: wc,
        fadeInDownBig: _c,
        fadeInLeft: xc,
        fadeInLeftBig: kc,
        fadeInRight: Cc,
        fadeInRightBig: $c,
        fadeInTopLeft: Sc,
        fadeInTopRight: zc,
        fadeInUp: Ec,
        fadeInUpBig: Ac,
        fadeOut: Tc,
        fadeOutBottomLeft: Lc,
        fadeOutBottomRight: Ic,
        fadeOutDown: Dc,
        fadeOutDownBig: Pc,
        fadeOutLeft: Oc,
        fadeOutLeftBig: Mc,
        fadeOutRight: Rc,
        fadeOutRightBig: Fc,
        fadeOutTopLeft: Bc,
        fadeOutTopRight: Vc,
        fadeOutUp: Nc,
        fadeOutUpBig: Hc,
        flash: Nl,
        flip: Uc,
        flipInX: qc,
        flipInY: Wc,
        flipOutX: jc,
        flipOutY: Kc,
        headShake: Hl,
        heartBeat: Ul,
        hinge: gd,
        jackInTheBox: bd,
        jello: ql,
        lightSpeedInLeft: Yc,
        lightSpeedInRight: Xc,
        lightSpeedOutLeft: Gc,
        lightSpeedOutRight: Qc,
        pulse: Wl,
        rollIn: vd,
        rollOut: yd,
        rotateIn: Zc,
        rotateInDownLeft: Jc,
        rotateInDownRight: td,
        rotateInUpLeft: ed,
        rotateInUpRight: id,
        rotateOut: sd,
        rotateOutDownLeft: od,
        rotateOutDownRight: rd,
        rotateOutUpLeft: ad,
        rotateOutUpRight: nd,
        rubberBand: jl,
        shake: Kl,
        shakeX: Yl,
        shakeY: Xl,
        slideInDown: ld,
        slideInLeft: cd,
        slideInRight: dd,
        slideInUp: hd,
        slideOutDown: ud,
        slideOutLeft: pd,
        slideOutRight: fd,
        slideOutUp: md,
        swing: Gl,
        tada: Ql,
        wobble: Zl,
        zoomIn: wd,
        zoomInDown: _d,
        zoomInLeft: xd,
        zoomInRight: kd,
        zoomInUp: Cd,
        zoomOut: $d,
        zoomOutDown: Sd,
        zoomOutLeft: zd,
        zoomOutRight: Ed,
        zoomOutUp: Ad,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
var ct = class extends E {
  constructor() {
    super(...arguments),
      (this.hasStarted = !1),
      (this.name = 'none'),
      (this.play = !1),
      (this.delay = 0),
      (this.direction = 'normal'),
      (this.duration = 1e3),
      (this.easing = 'linear'),
      (this.endDelay = 0),
      (this.fill = 'auto'),
      (this.iterations = 1 / 0),
      (this.iterationStart = 0),
      (this.playbackRate = 1),
      (this.handleAnimationFinish = () => {
        (this.play = !1), (this.hasStarted = !1), this.emit('sl-finish');
      }),
      (this.handleAnimationCancel = () => {
        (this.play = !1), (this.hasStarted = !1), this.emit('sl-cancel');
      });
  }
  get currentTime() {
    var t, e;
    return (e = (t = this.animation) == null ? void 0 : t.currentTime) != null ? e : 0;
  }
  set currentTime(t) {
    this.animation && (this.animation.currentTime = t);
  }
  connectedCallback() {
    super.connectedCallback(), this.createAnimation();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.destroyAnimation();
  }
  handleSlotChange() {
    this.destroyAnimation(), this.createAnimation();
  }
  async createAnimation() {
    var t, e;
    const i = (t = Go[this.easing]) != null ? t : this.easing,
      s = (e = this.keyframes) != null ? e : Td[this.name],
      a = (await this.defaultSlot).assignedElements()[0];
    return !a || !s
      ? !1
      : (this.destroyAnimation(),
        (this.animation = a.animate(s, {
          delay: this.delay,
          direction: this.direction,
          duration: this.duration,
          easing: i,
          endDelay: this.endDelay,
          fill: this.fill,
          iterationStart: this.iterationStart,
          iterations: this.iterations,
        })),
        (this.animation.playbackRate = this.playbackRate),
        this.animation.addEventListener('cancel', this.handleAnimationCancel),
        this.animation.addEventListener('finish', this.handleAnimationFinish),
        this.play ? ((this.hasStarted = !0), this.emit('sl-start')) : this.animation.pause(),
        !0);
  }
  destroyAnimation() {
    this.animation &&
      (this.animation.cancel(),
      this.animation.removeEventListener('cancel', this.handleAnimationCancel),
      this.animation.removeEventListener('finish', this.handleAnimationFinish),
      (this.hasStarted = !1));
  }
  handleAnimationChange() {
    this.hasUpdated && this.createAnimation();
  }
  handlePlayChange() {
    return this.animation
      ? (this.play && !this.hasStarted && ((this.hasStarted = !0), this.emit('sl-start')),
        this.play ? this.animation.play() : this.animation.pause(),
        !0)
      : !1;
  }
  handlePlaybackRateChange() {
    this.animation && (this.animation.playbackRate = this.playbackRate);
  }
  cancel() {
    var t;
    (t = this.animation) == null || t.cancel();
  }
  finish() {
    var t;
    (t = this.animation) == null || t.finish();
  }
  render() {
    return y` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
ct.styles = [D, Bl];
r([ta('slot')], ct.prototype, 'defaultSlot', 2);
r([l()], ct.prototype, 'name', 2);
r([l({ type: Boolean, reflect: !0 })], ct.prototype, 'play', 2);
r([l({ type: Number })], ct.prototype, 'delay', 2);
r([l()], ct.prototype, 'direction', 2);
r([l({ type: Number })], ct.prototype, 'duration', 2);
r([l()], ct.prototype, 'easing', 2);
r([l({ attribute: 'end-delay', type: Number })], ct.prototype, 'endDelay', 2);
r([l()], ct.prototype, 'fill', 2);
r([l({ type: Number })], ct.prototype, 'iterations', 2);
r([l({ attribute: 'iteration-start', type: Number })], ct.prototype, 'iterationStart', 2);
r([l({ attribute: !1 })], ct.prototype, 'keyframes', 2);
r([l({ attribute: 'playback-rate', type: Number })], ct.prototype, 'playbackRate', 2);
r(
  [
    x([
      'name',
      'delay',
      'direction',
      'duration',
      'easing',
      'endDelay',
      'fill',
      'iterations',
      'iterationsStart',
      'keyframes',
    ]),
  ],
  ct.prototype,
  'handleAnimationChange',
  1
);
r([x('play')], ct.prototype, 'handlePlayChange', 1);
r([x('playbackRate')], ct.prototype, 'handlePlaybackRateChange', 1);
ct.define('sl-animation');
var Ld = T`
  :host {
    display: inline-block;

    --size: 3rem;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--size);
    height: var(--size);
    background-color: var(--sl-color-neutral-400);
    font-family: var(--sl-font-sans);
    font-size: calc(var(--size) * 0.5);
    font-weight: var(--sl-font-weight-normal);
    color: var(--sl-color-neutral-0);
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
  }

  .avatar--circle,
  .avatar--circle .avatar__image {
    border-radius: var(--sl-border-radius-circle);
  }

  .avatar--rounded,
  .avatar--rounded .avatar__image {
    border-radius: var(--sl-border-radius-medium);
  }

  .avatar--square {
    border-radius: 0;
  }

  .avatar__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .avatar__initials {
    line-height: 1;
    text-transform: uppercase;
  }

  .avatar__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`,
  Gt = class extends E {
    constructor() {
      super(...arguments),
        (this.hasError = !1),
        (this.image = ''),
        (this.label = ''),
        (this.initials = ''),
        (this.loading = 'eager'),
        (this.shape = 'circle');
    }
    handleImageChange() {
      this.hasError = !1;
    }
    handleImageLoadError() {
      (this.hasError = !0), this.emit('sl-error');
    }
    render() {
      const t = y`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${this.handleImageLoadError}"
      />
    `;
      let e = y``;
      return (
        this.initials
          ? (e = y`<div part="initials" class="avatar__initials">${this.initials}</div>`)
          : (e = y`
        <div part="icon" class="avatar__icon" aria-hidden="true">
          <slot name="icon">
            <sl-icon name="person-fill" library="system"></sl-icon>
          </slot>
        </div>
      `),
        y`
      <div
        part="base"
        class=${I({ avatar: !0, 'avatar--circle': this.shape === 'circle', 'avatar--rounded': this.shape === 'rounded', 'avatar--square': this.shape === 'square' })}
        role="img"
        aria-label=${this.label}
      >
        ${this.image && !this.hasError ? t : e}
      </div>
    `
      );
    }
  };
Gt.styles = [D, Ld];
Gt.dependencies = { 'sl-icon': j };
r([L()], Gt.prototype, 'hasError', 2);
r([l()], Gt.prototype, 'image', 2);
r([l()], Gt.prototype, 'label', 2);
r([l()], Gt.prototype, 'initials', 2);
r([l()], Gt.prototype, 'loading', 2);
r([l({ reflect: !0 })], Gt.prototype, 'shape', 2);
r([x('image')], Gt.prototype, 'handleImageChange', 1);
Gt.define('sl-avatar');
var Id = T`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-top-width: calc(var(--sl-panel-border-width) * 3);
    border-radius: var(--sl-border-radius-medium);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    border-top-color: var(--sl-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--sl-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--sl-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--sl-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--sl-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    padding-inline-end: var(--sl-spacing-medium);
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--sl-panel-border-width) * 3);
    background-color: var(--sl-panel-border-color);
    display: flex;
  }

  .alert__countdown--ltr {
    justify-content: flex-end;
  }

  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
  }

  .alert--primary .alert__countdown-elapsed {
    background-color: var(--sl-color-primary-600);
  }

  .alert--success .alert__countdown-elapsed {
    background-color: var(--sl-color-success-600);
  }

  .alert--neutral .alert__countdown-elapsed {
    background-color: var(--sl-color-neutral-600);
  }

  .alert--warning .alert__countdown-elapsed {
    background-color: var(--sl-color-warning-600);
  }

  .alert--danger .alert__countdown-elapsed {
    background-color: var(--sl-color-danger-600);
  }

  .alert__timer {
    display: none;
  }
`,
  At = class de extends E {
    constructor() {
      super(...arguments),
        (this.hasSlotController = new vt(this, 'icon', 'suffix')),
        (this.localize = new N(this)),
        (this.open = !1),
        (this.closable = !1),
        (this.variant = 'primary'),
        (this.duration = 1 / 0),
        (this.remainingTime = this.duration);
    }
    static get toastStack() {
      return (
        this.currentToastStack ||
          (this.currentToastStack = Object.assign(document.createElement('div'), { className: 'sl-toast-stack' })),
        this.currentToastStack
      );
    }
    firstUpdated() {
      this.base.hidden = !this.open;
    }
    restartAutoHide() {
      this.handleCountdownChange(),
        clearTimeout(this.autoHideTimeout),
        clearInterval(this.remainingTimeInterval),
        this.open &&
          this.duration < 1 / 0 &&
          ((this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration)),
          (this.remainingTime = this.duration),
          (this.remainingTimeInterval = window.setInterval(() => {
            this.remainingTime -= 100;
          }, 100)));
    }
    pauseAutoHide() {
      var e;
      (e = this.countdownAnimation) == null || e.pause(),
        clearTimeout(this.autoHideTimeout),
        clearInterval(this.remainingTimeInterval);
    }
    resumeAutoHide() {
      var e;
      this.duration < 1 / 0 &&
        ((this.autoHideTimeout = window.setTimeout(() => this.hide(), this.remainingTime)),
        (this.remainingTimeInterval = window.setInterval(() => {
          this.remainingTime -= 100;
        }, 100)),
        (e = this.countdownAnimation) == null || e.play());
    }
    handleCountdownChange() {
      if (this.open && this.duration < 1 / 0 && this.countdown) {
        const { countdownElement: e } = this,
          i = '100%',
          s = '0';
        this.countdownAnimation = e.animate([{ width: i }, { width: s }], {
          duration: this.duration,
          easing: 'linear',
        });
      }
    }
    handleCloseClick() {
      this.hide();
    }
    async handleOpenChange() {
      if (this.open) {
        this.emit('sl-show'),
          this.duration < 1 / 0 && this.restartAutoHide(),
          await st(this.base),
          (this.base.hidden = !1);
        const { keyframes: e, options: i } = Y(this, 'alert.show', { dir: this.localize.dir() });
        await Q(this.base, e, i), this.emit('sl-after-show');
      } else {
        this.emit('sl-hide'),
          clearTimeout(this.autoHideTimeout),
          clearInterval(this.remainingTimeInterval),
          await st(this.base);
        const { keyframes: e, options: i } = Y(this, 'alert.hide', { dir: this.localize.dir() });
        await Q(this.base, e, i), (this.base.hidden = !0), this.emit('sl-after-hide');
      }
    }
    handleDurationChange() {
      this.restartAutoHide();
    }
    async show() {
      if (!this.open) return (this.open = !0), bt(this, 'sl-after-show');
    }
    async hide() {
      if (this.open) return (this.open = !1), bt(this, 'sl-after-hide');
    }
    async toast() {
      return new Promise((e) => {
        this.handleCountdownChange(),
          de.toastStack.parentElement === null && document.body.append(de.toastStack),
          de.toastStack.appendChild(this),
          requestAnimationFrame(() => {
            this.clientWidth, this.show();
          }),
          this.addEventListener(
            'sl-after-hide',
            () => {
              de.toastStack.removeChild(this),
                e(),
                de.toastStack.querySelector('sl-alert') === null && de.toastStack.remove();
            },
            { once: !0 }
          );
      });
    }
    render() {
      return y`
      <div
        part="base"
        class=${I({ alert: !0, 'alert--open': this.open, 'alert--closable': this.closable, 'alert--has-countdown': !!this.countdown, 'alert--has-icon': this.hasSlotController.test('icon'), 'alert--primary': this.variant === 'primary', 'alert--success': this.variant === 'success', 'alert--neutral': this.variant === 'neutral', 'alert--warning': this.variant === 'warning', 'alert--danger': this.variant === 'danger' })}
        role="alert"
        aria-hidden=${this.open ? 'false' : 'true'}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${
          this.closable
            ? y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term('close')}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `
            : ''
        }

        <div role="timer" class="alert__timer">${this.remainingTime}</div>

        ${
          this.countdown
            ? y`
              <div
                class=${I({ alert__countdown: !0, 'alert__countdown--ltr': this.countdown === 'ltr' })}
              >
                <div class="alert__countdown-elapsed"></div>
              </div>
            `
            : ''
        }
      </div>
    `;
    }
  };
At.styles = [D, Id];
At.dependencies = { 'sl-icon-button': at };
r([k('[part~="base"]')], At.prototype, 'base', 2);
r([k('.alert__countdown-elapsed')], At.prototype, 'countdownElement', 2);
r([l({ type: Boolean, reflect: !0 })], At.prototype, 'open', 2);
r([l({ type: Boolean, reflect: !0 })], At.prototype, 'closable', 2);
r([l({ reflect: !0 })], At.prototype, 'variant', 2);
r([l({ type: Number })], At.prototype, 'duration', 2);
r([l({ type: String, reflect: !0 })], At.prototype, 'countdown', 2);
r([L()], At.prototype, 'remainingTime', 2);
r([x('open', { waitUntilFirstUpdate: !0 })], At.prototype, 'handleOpenChange', 1);
r([x('duration')], At.prototype, 'handleDurationChange', 1);
var Dd = At;
q('alert.show', {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 250, easing: 'ease' },
});
q('alert.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 },
  ],
  options: { duration: 250, easing: 'ease' },
});
Dd.define('sl-alert');
var Pd = T`
  :host {
    --control-box-size: 3rem;
    --icon-size: calc(var(--control-box-size) * 0.625);

    display: inline-flex;
    position: relative;
    cursor: pointer;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  img[aria-hidden='true'] {
    display: none;
  }

  .animated-image__control-box {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    top: calc(50% - var(--control-box-size) / 2);
    right: calc(50% - var(--control-box-size) / 2);
    width: var(--control-box-size);
    height: var(--control-box-size);
    font-size: var(--icon-size);
    background: none;
    border: solid 2px currentColor;
    background-color: rgb(0 0 0 /50%);
    border-radius: var(--sl-border-radius-circle);
    color: white;
    pointer-events: none;
    transition: var(--sl-transition-fast) opacity;
  }

  :host([play]:hover) .animated-image__control-box {
    opacity: 1;
  }

  :host([play]:not(:hover)) .animated-image__control-box {
    opacity: 0;
  }

  :host([play]) slot[name='play-icon'],
  :host(:not([play])) slot[name='pause-icon'] {
    display: none;
  }
`,
  Vt = class extends E {
    constructor() {
      super(...arguments), (this.isLoaded = !1);
    }
    handleClick() {
      this.play = !this.play;
    }
    handleLoad() {
      const t = document.createElement('canvas'),
        { width: e, height: i } = this.animatedImage;
      (t.width = e),
        (t.height = i),
        t.getContext('2d').drawImage(this.animatedImage, 0, 0, e, i),
        (this.frozenFrame = t.toDataURL('image/gif')),
        this.isLoaded || (this.emit('sl-load'), (this.isLoaded = !0));
    }
    handleError() {
      this.emit('sl-error');
    }
    handlePlayChange() {
      this.play && ((this.animatedImage.src = ''), (this.animatedImage.src = this.src));
    }
    handleSrcChange() {
      this.isLoaded = !1;
    }
    render() {
      return y`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play ? 'false' : 'true'}
          @click=${this.handleClick}
          @load=${this.handleLoad}
          @error=${this.handleError}
        />

        ${
          this.isLoaded
            ? y`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play ? 'true' : 'false'}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <slot name="play-icon"><sl-icon name="play-fill" library="system"></sl-icon></slot>
                <slot name="pause-icon"><sl-icon name="pause-fill" library="system"></sl-icon></slot>
              </div>
            `
            : ''
        }
      </div>
    `;
    }
  };
Vt.styles = [D, Pd];
Vt.dependencies = { 'sl-icon': j };
r([k('.animated-image__animated')], Vt.prototype, 'animatedImage', 2);
r([L()], Vt.prototype, 'frozenFrame', 2);
r([L()], Vt.prototype, 'isLoaded', 2);
r([l()], Vt.prototype, 'src', 2);
r([l()], Vt.prototype, 'alt', 2);
r([l({ type: Boolean, reflect: !0 })], Vt.prototype, 'play', 2);
r([x('play', { waitUntilFirstUpdate: !0 })], Vt.prototype, 'handlePlayChange', 1);
r([x('src')], Vt.prototype, 'handleSrcChange', 1);
Vt.define('sl-animated-image');
function Od() {
  const t = document.querySelector('.login__container'),
    e = document.createElement('h1');
  (e.textContent = 'Logga in'), (e.className = 'login__text');
  const i = document.createElement('div');
  (i.className = 'error-message'), (i.style.color = 'red');
  const s = document.createElement('form');
  s.id = 'loginForm';
  const o = document.createElement('sl-input');
  (o.placeholder = 'E-post eller telefonnummer'), (o.className = 'userField');
  const a = document.createElement('sl-input');
  a.setAttribute('type', 'password'),
    a.setAttribute('password-toggle', ''),
    (a.className = 'passwordField'),
    (a.placeholder = 'Lösenord');
  const n = document.createElement('h2');
  (n.textContent = 'Glömt lösenordet?'), (n.className = 'forgotPassword__text');
  const c = document.createElement('sl-button');
  (c.className = 'yellow'),
    c.setAttribute('variant', 'default'),
    (c.type = 'submit'),
    (c.textContent = 'Logga in'),
    s.addEventListener('submit', async (d) => {
      d.preventDefault(), (i.textContent = '');
      const h = o.value,
        f = a.value,
        u = { email: h, password: f };
      try {
        const p = await fetch('/newLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(u),
          }),
          m = await p.json();
        p.ok
          ? (console.log('Login success:', m),
            localStorage.setItem('token', m.token),
            (window.location.href = '/profile'))
          : (console.error('Login failed:', m), (i.textContent = m.message));
      } catch (p) {
        console.error('Error during login:', p), (i.textContent = 'An error occurred during login.');
      }
    }),
    s.append(e, o, a, n, i, c),
    t.append(s);
}
function Md() {
  const t = document.querySelector('.login__container');
  t.className = 'login__container';
  const e = document.createElement('form');
  e.id = 'registerForm';
  const i = document.createElement('h1');
  (i.textContent = 'Registrering'), (i.className = 'login__text');
  const s = document.createElement('sl-input');
  (s.type = 'email'),
    (s.placeholder = 't.ex användare@mail.com'),
    (s.className = 'userField'),
    (s.required = !0),
    (s.name = 'username');
  const o = document.createElement('sl-input');
  (o.placeholder = 'Telefonnummer'), (o.className = 'userField'), (o.required = !0), (o.name = 'telefonnummer');
  const a = document.createElement('sl-input');
  a.setAttribute('type', 'password'),
    a.setAttribute('password-toggle', ''),
    (a.className = 'passwordField'),
    (a.placeholder = 'Lösenord'),
    (a.required = !0),
    (a.name = 'password');
  const n = document.createElement('sl-input');
  n.setAttribute('type', 'password'),
    n.setAttribute('password-toggle', ''),
    (n.className = 'passwordField'),
    (n.placeholder = 'Bekräfta lösenord'),
    (n.required = !0),
    (n.name = 'password2');
  const c = document.createElement('div');
  (c.className = 'error-message'), (c.style.color = 'red');
  const d = document.createElement('sl-button');
  (d.className = 'yellow'), d.setAttribute('variant', 'default'), (d.type = 'submit'), (d.textContent = 'Skapa konto');
  const h = document.createElement('h2');
  (h.textContent = 'Redan medlem? Logga in här!'),
    (h.className = 'login__msg'),
    document.createElement('a'),
    (h.href = '/loginM'),
    e.addEventListener('submit', async (f) => {
      f.preventDefault(), (c.textContent = '');
      const u = o.value,
        p = s.value,
        m = a.value,
        g = n.value;
      if (m !== g) {
        c.textContent = 'Lösenord inte stämmer';
        return;
      }
      const b = { email: p, number: u, password: m };
      try {
        const C = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(b),
          }),
          S = await C.json();
        C.ok
          ? (console.log('Registration success:', S), (window.location.href = '/loginM'))
          : (console.error('Registration failed:', S), (c.textContent = S.message));
      } catch (C) {
        console.error('Error during registration:', C), (c.textContent = 'An error occurred during registration.');
      }
    }),
    e.append(i, s, o, a, n, c, d),
    t.append(e, h);
}
function Rd() {
  const t = document.querySelector('.profile__container');
  if (!t) return;
  const e = localStorage.getItem('token');
  if (!e || e === '' || e === 'undefined' || e === null) {
    t.innerHTML = '<p>Du är inte inloggad.</p>';
    return;
  }
  fetch('/current', { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${e}` } })
    .then((i) => {
      if (!i.ok) throw new Error('Failed to fetch user profile');
      return i.json();
    })
    .then((i) => {
      const s = document.createElement('button');
      (s.textContent = 'Logga ut'),
        s.classList.add('logout__button'),
        s.addEventListener('click', () => {
          localStorage.removeItem('token'), (window.location.href = '/loginM');
        }),
        (t.innerHTML = `
        <h2>Välkommen!</h2>
        <p>Din e-post: ${i.email}</p>
        <p>Ditt telefonnummer: ${i.number}</p>
      `),
        t.appendChild(s);
    })
    .catch((i) => {
      console.error('Error fetching user profile:', i), (t.innerHTML = '<p>Kunde inte hämta din profil.</p>');
    });
}
if (document.querySelector('.reviews__container')) {
  const t = '',
    e = po.getMovieIdFromPath(),
    i = new ur(t, e),
    s = new mr(t, e);
  new fr(i).initReviews(document.querySelector('.reviews__container')),
    new br(s).renderAvRating(document.querySelector('.averageRating__container'));
} else console.log('Not on a movie page, skipping reviews.');
const Qo = document.querySelector('.review');
console.log(Qo);
try {
  Qo ? new hr().render() : console.log('No review element found');
} catch (t) {
  console.error('Error initializing review service:', t);
}
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', async () => {
    er();
    const t = new vr('/api/top-movies'),
      e = new yr('.topmovies__list');
    e.renderLoadingMessage();
    const i = await t.fetchTopMovies();
    i.length ? e.renderMovies(i) : (e.renderErrorMessage(), console.log('No movies received, showing error message'));
  });
window.location.pathname === '/' &&
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.movie-card')) or();
    else {
      const t = document.querySelector('.movies__header'),
        e = document.createElement('p');
      (e.textContent = 'Inga visningar för tillfället...'),
        e.classList.add('no-showings'),
        t.insertAdjacentElement('afterend', e);
    }
  });
window.location.pathname === '/loginM' && Od();
window.location.pathname === '/registerM' && Md();
window.location.pathname === '/profile' && Rd();

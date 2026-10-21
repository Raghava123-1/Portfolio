document.addEventListener('DOMContentLoaded', () => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* =====================================================
       Shared helpers: toast + theme
       ===================================================== */
    const toastEl = $('#toast');
    let toastTimer;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    const THEMES = ['green', 'amber', 'cyan', 'magenta'];
    const accent = { main: '#00ff41', bright: '#d7ffe2' };
    function readAccent() {
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--rgb').trim() || '0, 255, 65';
        accent.main = `rgb(${rgb})`;
    }
    function setTheme(name) {
        if (!THEMES.includes(name)) return false;
        if (name === 'green') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', name);
        try { localStorage.setItem('theme', name); } catch (e) { /* storage blocked: theme just won't persist */ }
        readAccent();
        return true;
    }
    readAccent();

    /* =====================================================
       Intro video
       ===================================================== */
    const intro = $('#intro');
    const introVideo = $('#openingVideo');
    const introBar = $('#introBar');
    const skipButton = $('#skipButton');
    let introDone = false;

    function finishIntro() {
        if (introDone) return;
        introDone = true;
        intro.classList.add('fade-out');
        document.body.classList.remove('intro-active');
        introVideo.pause();
        setTimeout(() => { intro.style.display = 'none'; }, 1000);
        startReveals();
        startCounters();
        showTermHint();
    }

    if (reducedMotion) {
        intro.style.display = 'none';
        document.body.classList.remove('intro-active');
        introDone = true;
    } else {
        introVideo.playbackRate = 3.5;
        introVideo.addEventListener('timeupdate', () => {
            if (introVideo.duration) {
                introBar.style.width = `${(introVideo.currentTime / introVideo.duration) * 100}%`;
            }
        });
        introVideo.addEventListener('ended', finishIntro);
        introVideo.addEventListener('error', finishIntro);
        skipButton.addEventListener('click', finishIntro);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') finishIntro(); });

        // autoplay can be blocked; never trap the visitor behind the intro
        const attempt = introVideo.play();
        if (attempt && attempt.catch) attempt.catch(finishIntro);
        setTimeout(finishIntro, 12000);
    }

    /* =====================================================
       Matrix rain background
       ===================================================== */
    const canvas = $('#matrix');
    if (canvas && !reducedMotion) {
        const ctx = canvas.getContext('2d');
        const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEF<>/\\{}[]$#';
        // lighter rain on touch / low-core devices to save battery
        const lowPower = !finePointer || (navigator.hardwareConcurrency || 8) <= 4;
        const size = lowPower ? 20 : 16;
        const frameGap = lowPower ? 80 : 50;
        let drops = [];
        let last = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drops = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -50);
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = (now) => {
            requestAnimationFrame(draw);
            if (document.hidden || now - last < frameGap) return; // ~12-20fps is plenty for rain
            last = now;
            ctx.fillStyle = 'rgba(2, 5, 3, 0.14)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${size}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
                ctx.fillStyle = Math.random() > 0.96 ? accent.bright : accent.main;
                ctx.fillText(ch, i * size, drops[i] * size);
                if (drops[i] * size > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };
        requestAnimationFrame(draw);
    }

    if (reducedMotion) $('.bg-video')?.pause();

    /* =====================================================
       Typing role text
       ===================================================== */
    const roleEl = $('#dynamic-text');
    const roles = ['Cyber Security Student', 'MERN Stack Developer', 'Ethical Hacker'];
    if (!reducedMotion) {
        let roleIdx = 0;
        let charIdx = 0;
        let deleting = false;

        const tick = () => {
            const word = roles[roleIdx];
            charIdx += deleting ? -1 : 1;
            roleEl.textContent = word.slice(0, charIdx);

            let delay = deleting ? 45 : 90;
            if (!deleting && charIdx === word.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 1800);
    }

    /* =====================================================
       Scroll reveal (+ staggering, + heading scramble)
       ===================================================== */
    $$('[data-stagger]').forEach((group) => {
        $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 8) * 90}ms`));
    });
    $$('.hero .reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 140}ms`));

    const scrambleChars = '!<>-_\\/[]{}=+*^?#01';
    function scramble(el) {
        if (reducedMotion || el.dataset.scrambled) return;
        el.dataset.scrambled = '1';
        const finalText = el.textContent;
        const total = 28;
        let frame = 0;
        const run = () => {
            const reveal = Math.floor((frame / total) * finalText.length);
            el.textContent = finalText
                .split('')
                .map((c, i) => (c === ' ' || i < reveal ? c : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]))
                .join('');
            if (frame++ < total) requestAnimationFrame(run);
            else el.textContent = finalText;
        };
        run();
    }

    let revealObserver = null;
    function startReveals() {
        const items = $$('.reveal');
        if (!('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                revealObserver.unobserve(el);
                el.classList.add('in');
                $$('.scramble', el).forEach(scramble);
                // once settled, drop the reveal class so its transition-delay
                // doesn't linger on hover/tilt transitions
                const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
                setTimeout(() => el.classList.remove('reveal', 'in'), delay + 1000);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        items.forEach((el) => revealObserver.observe(el));
    }
    if (introDone) startReveals();

    /* =====================================================
       Stat counters
       ===================================================== */
    function startCounters() {
        $$('[data-count]').forEach((el) => {
            const target = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            if (reducedMotion) return;
            const duration = 1600;
            const begin = performance.now() + 700; // let the hero settle first
            const step = (now) => {
                const t = Math.min(Math.max((now - begin) / duration, 0), 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = (target * eased).toFixed(decimals);
                if (t < 1) requestAnimationFrame(step);
            };
            el.textContent = (0).toFixed(decimals);
            requestAnimationFrame(step);
        });
    }
    if (introDone) startCounters();

    /* =====================================================
       Nav: scrolled state, active link, progress bar
       ===================================================== */
    const nav = $('.nav');
    const progress = $('#progress');
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
            nav.classList.toggle('scrolled', window.scrollY > 20);
            ticking = false;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if ('IntersectionObserver' in window) {
        const links = new Map($$('[data-nav]').map((a) => [a.dataset.nav, a]));
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((a) => a.classList.remove('active'));
                const link = links.get(entry.target.id);
                link?.classList.add('active');
                // on phones the nav scrolls sideways; keep the active link in view
                const bar = link?.closest('.nav-links');
                if (bar && bar.scrollWidth > bar.clientWidth) {
                    bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id]').forEach((s) => spy.observe(s));
    }

    /* =====================================================
       Pointer effects: cursor glow + card tilt
       ===================================================== */
    if (finePointer && !reducedMotion) {
        const glow = $('.cursor-glow');
        const bgLayer = $('.video-background');
        let nx = 0;
        let ny = 0;
        let parallaxRaf = 0;
        window.addEventListener('pointermove', (e) => {
            glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            glow.classList.add('on');
            // background drifts opposite the pointer for a subtle depth effect
            nx = e.clientX / window.innerWidth - 0.5;
            ny = e.clientY / window.innerHeight - 0.5;
            if (!parallaxRaf) {
                parallaxRaf = requestAnimationFrame(() => {
                    parallaxRaf = 0;
                    bgLayer.style.transform = `translate3d(${nx * -18}px, ${ny * -18}px, 0) scale(1.06)`;
                    canvas.style.translate = `${nx * -8}px ${ny * -8}px`;
                });
            }
        }, { passive: true });
        document.addEventListener('mouseleave', () => glow.classList.remove('on'));

        // magnetic buttons: they lean toward the pointer, then spring back
        $$('.btn, .term-toggle').forEach((el) => {
            const pull = 0.22;
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                el.style.translate = `${dx * pull}px ${dy * pull}px`;
            });
            el.addEventListener('pointerleave', () => { el.style.translate = ''; });
        });

        $$('.tilt').forEach((card) => {
            const max = 6; // degrees
            card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.setProperty('--ry', `${(x - 0.5) * 2 * max}deg`);
                card.style.setProperty('--rx', `${(0.5 - y) * 2 * max}deg`);
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
            });
            card.addEventListener('pointerleave', () => {
                card.classList.remove('is-tilting');
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* =====================================================
       Interactive terminal
       ===================================================== */
    const termBody = $('#terminal-content');
    const termInput = $('#terminal-input');
    const termChips = $('#terminal-chips');
    const PROMPT = 'raghava@portfolio:~$';

    // Terminal reads its data from the page itself so content lives in one place.
    const data = {
        certs: () => $$('.cert').map((c) => ({ n: $('em', c).textContent, name: $('span', c).textContent, url: c.href })),
        roles: () => $$('.role').map((r) => r.textContent.replace(/^\d+/, '').trim()),
        education: () => $$('.tl-item').map((t) => ({
            title: $('h3', t).textContent,
            place: $('.tl-place', t).textContent,
            meta: $$('.tl-meta span', t).map((s) => s.textContent).join(' | '),
        })),
        projects: () => $$('.project-card').map((p) => ({
            title: $('h3', p).textContent,
            tag: $('.badge', p).textContent,
            text: $('p', p).textContent.replace(/\.+$/, '.'),
        })),
        skills: () => $$('.skill-cat').map((s) => ({
            cat: $('h3', s).textContent,
            items: $$('li', s).map((li) => li.textContent.trim()).join(', '),
        })),
        contacts: () => $$('.contact-icons a').map((a) => ({ name: a.dataset.name, url: a.href })),
    };

    // "flag{wake_up_neo}" encoded; kept encoded so the answer isn't sitting in the source as plain text
    const FLAG_B64 = 'ZmxhZ3t3YWtlX3VwX25lb30=';

    // Optional keystroke clicks (off by default). The AudioContext is only created after a user click.
    let soundOn = false;
    let audioCtx = null;
    const soundBtn = $('#term-sound');
    function tick(freq = 1400) {
        if (!soundOn || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = audioCtx.currentTime;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.025, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.035);
    }
    function setSound(on) {
        soundOn = on;
        if (on) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) { soundOn = false; toast('Audio is not supported in this browser'); }
            else {
                audioCtx = audioCtx || new AC();
                if (audioCtx.state === 'suspended') audioCtx.resume();
            }
        }
        soundBtn.setAttribute('aria-pressed', String(soundOn));
        soundBtn.textContent = `sound: ${soundOn ? 'on' : 'off'}`;
        if (soundOn) tick(900);
    }
    soundBtn.addEventListener('click', () => setSound(!soundOn));

    // A queue keeps output in order even if the user fires commands quickly.
    let queue = Promise.resolve();
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    function addLine(parts) {
        const line = document.createElement('div');
        line.className = 'line';
        [].concat(parts).forEach((p) => {
            const item = typeof p === 'string' ? { t: p } : p;
            const node = document.createElement(item.href ? 'a' : 'span');
            node.textContent = item.t;
            if (item.c) node.className = item.c;
            if (item.href) {
                node.href = item.href;
                node.target = '_blank';
                node.rel = 'noopener noreferrer';
                node.classList.add('t-link');
            }
            line.appendChild(node);
        });
        termBody.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }

    function print(lines, delay = 35) {
        queue = queue.then(async () => {
            for (const l of lines) {
                addLine(l);
                if (!reducedMotion && delay) await wait(delay);
            }
        });
        return queue;
    }

    const section = (title) => [{ t: `[ ${title} ]`, c: 't-info' }, ''];

    const commands = {
        help: () => [
            ...section('available commands'),
            [{ t: '  1 | about      ', c: 't-ok' }, { t: 'who I am', c: 't-muted' }],
            [{ t: '  2 | certs      ', c: 't-ok' }, { t: 'courses & certifications', c: 't-muted' }],
            [{ t: '  3 | education  ', c: 't-ok' }, { t: 'academic background', c: 't-muted' }],
            [{ t: '  4 | projects   ', c: 't-ok' }, { t: 'things I have built', c: 't-muted' }],
            [{ t: '  5 | skills     ', c: 't-ok' }, { t: 'tech stack', c: 't-muted' }],
            [{ t: '  6 | roles      ', c: 't-ok' }, { t: 'roles & responsibilities', c: 't-muted' }],
            [{ t: '    | contact     ', c: 't-ok' }, { t: 'ways to reach me', c: 't-muted' }],
            [{ t: '    | cat resume  ', c: 't-ok' }, { t: 'my resume link + summary', c: 't-muted' }],
            [{ t: '    | theme <name>', c: 't-ok' }, { t: 'green | amber | cyan | magenta', c: 't-muted' }],
            [{ t: '    | ctf         ', c: 't-ok' }, { t: 'a small puzzle (answer with: submit <flag>)', c: 't-muted' }],
            [{ t: '    | sound       ', c: 't-ok' }, { t: 'toggle keystroke clicks', c: 't-muted' }],
            [{ t: '    | goto <name> ', c: 't-ok' }, { t: 'scroll to a section (e.g. goto projects)', c: 't-muted' }],
            [{ t: '    | clear       ', c: 't-ok' }, { t: 'clear the screen', c: 't-muted' }],
            '',
            [{ t: 'tip: use Tab to autocomplete and the arrow keys for history.', c: 't-muted' }],
        ],
        about: () => [
            ...section('about'),
            'Computer Science student at VNRVJIET (BTech, graduating 2026),',
            'focused on Cyber Security and ethical hacking.',
            'Interests: network security, penetration testing, cryptography.',
        ],
        certs: () => [
            ...section('certifications'),
            ...data.certs().map((c) => [{ t: `${c.n}. `, c: 't-muted' }, { t: c.name, href: c.url }]),
        ],
        education: () => [
            ...section('education'),
            ...data.education().flatMap((e) => [[{ t: e.title, c: 't-ok' }], [`  ${e.place}`], [{ t: `  ${e.meta}`, c: 't-warn' }], '']),
        ],
        projects: () => [
            ...section('projects'),
            ...data.projects().flatMap((p) => [[{ t: p.title, c: 't-ok' }, { t: `  [${p.tag}]`, c: 't-warn' }], [{ t: `  ${p.text}`, c: 't-muted' }], '']),
        ],
        skills: () => [
            ...section('skills'),
            ...data.skills().map((s) => [{ t: s.cat.padEnd(24), c: 't-ok' }, { t: s.items }]),
        ],
        roles: () => [
            ...section('roles & responsibilities'),
            ...data.roles().map((r, i) => [{ t: `${i + 1}. `, c: 't-muted' }, r]),
        ],
        contact: () => [
            ...section('contact'),
            ...data.contacts().map((c) => [{ t: c.name.padEnd(12), c: 't-ok' }, { t: c.url.replace(/^mailto:/, ''), href: c.url }]),
        ],
        whoami: () => ['root (just kidding) - guest@portfolio'],
        ls: () => [{ t: 'about  certs  education  projects  skills  roles  contact', c: 't-info' }],
        date: () => [new Date().toString()],
        pwd: () => ['/home/raghava/portfolio'],
        neofetch: () => [
            [{ t: 'raghava', c: 't-ok' }, '@', { t: 'portfolio', c: 't-ok' }],
            '-----------------',
            [{ t: 'Role   ', c: 't-info' }, 'Cyber Security Student'],
            [{ t: 'Uni    ', c: 't-info' }, 'VNR VJIET, Hyderabad'],
            [{ t: 'OS     ', c: 't-info' }, 'Kali Linux / Windows 11'],
            [{ t: 'Shell   ', c: 't-info' }, 'your browser'],
            [{ t: 'Stack  ', c: 't-info' }, 'MongoDB, Express, React, Node'],
        ],
    };

    const aliases = {
        1: 'about', 2: 'certs', 3: 'education', 4: 'projects', 5: 'skills', 6: 'roles',
        certifications: 'certs', cert: 'certs', project: 'projects', skill: 'skills',
        '?': 'help', man: 'help', ll: 'ls', dir: 'ls',
    };

    const sectionIds = { about: 'about', certs: 'courses', certifications: 'courses', education: 'education', projects: 'projects', skills: 'skills', roles: 'roles', home: 'home' };

    function run(raw) {
        const input = raw.trim();
        if (!input) return;
        const [cmdRaw, ...args] = input.split(/\s+/);
        const cmd = cmdRaw.toLowerCase();

        print([[{ t: PROMPT + ' ', c: 't-ok' }, { t: input, c: 't-cmd' }]], 0);

        if (cmd === 'clear' || cmd === 'cls') {
            queue = queue.then(() => { termBody.textContent = ''; });
            return;
        }
        if (cmd === 'goto' || cmd === 'cd') {
            const id = sectionIds[(args[0] || '').toLowerCase().replace(/^\.?\/?/, '')];
            if (id) {
                print([[{ t: `navigating to ${args[0]}...`, c: 't-muted' }]]);
                document.getElementById(id).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                setTimeout(() => setTerminal(false), 700); // close so the page is actually visible
            } else {
                print([[{ t: `goto: unknown section. try: ${Object.keys(sectionIds).join(', ')}`, c: 't-err' }]]);
            }
            return;
        }
        if (cmd === 'cat') {
            const target = (args[0] || '').toLowerCase().replace(/\.(pdf|md|txt)$/, '');
            if (target === 'resume' || target === 'cv') {
                const resume = $('.contact-icons a[data-name="Resume"]').href;
                print([
                    [{ t: '[ resume.pdf ]', c: 't-info' }],
                    '',
                    [{ t: 'Name       ', c: 't-ok' }, 'Vuyyuru Raghavendra Sai'],
                    [{ t: 'Focus      ', c: 't-ok' }, 'Cyber Security | MERN Stack | Ethical Hacking'],
                    [{ t: 'College    ', c: 't-ok' }, 'VNR VJIET, Hyderabad (B.Tech CSE - Cyber Security)'],
                    [{ t: 'Open       ', c: 't-ok' }, { t: resume, href: resume }],
                    '',
                ]);
            } else if (target === 'about' || target === 'readme') {
                print(commands.about().concat(['']));
            } else if (!target) {
                print([[{ t: 'usage: cat resume', c: 't-warn' }]]);
            } else {
                print([[{ t: `cat: ${args[0]}: No such file or directory`, c: 't-err' }]]);
            }
            return;
        }
        if (cmd === 'theme') {
            const name = (args[0] || '').toLowerCase();
            if (!name) {
                const cur = document.documentElement.getAttribute('data-theme') || 'green';
                print([[{ t: 'themes: ', c: 't-info' }, THEMES.map((t) => (t === cur ? `[${t}]` : t)).join('  ')], [{ t: 'usage: theme <name>', c: 't-muted' }]]);
            } else if (setTheme(name)) {
                print([[{ t: `theme set to ${name}`, c: 't-ok' }]]);
            } else {
                print([[{ t: `theme: unknown "${args[0]}". try: ${THEMES.join(', ')}`, c: 't-err' }]]);
            }
            return;
        }
        if (cmd === 'ctf') {
            print([
                [{ t: '[ CHALLENGE 01 : warm-up ]', c: 't-info' }],
                '',
                'A message was intercepted on the wire:',
                '',
                [{ t: `  ${FLAG_B64}`, c: 't-warn' }],
                '',
                [{ t: 'hint: it looks encoded, and the "=" at the end is a clue.', c: 't-muted' }],
                [{ t: 'when you have the flag, run: submit flag{...}', c: 't-muted' }],
                '',
            ]);
            return;
        }
        if (cmd === 'submit') {
            const guess = args.join(' ').trim();
            if (!guess) {
                print([[{ t: 'usage: submit flag{...}', c: 't-warn' }]]);
            } else if (guess === atob(FLAG_B64)) {
                print([
                    [{ t: '[+] correct! flag accepted.', c: 't-ok' }],
                    [{ t: 'Nice work. If you enjoy this sort of thing, say hi through the contact form.', c: 't-info' }],
                    '',
                ]);
                toast('Flag captured!');
            } else {
                print([[{ t: '[-] wrong flag. keep digging.', c: 't-err' }]]);
            }
            return;
        }
        if (cmd === 'sound') {
            setSound(!soundOn);
            print([[{ t: `keystroke sound: ${soundOn ? 'on' : 'off'}`, c: 't-ok' }]]);
            return;
        }
        if (cmd === 'sudo') {
            print([[{ t: 'nice try. this incident will be reported.', c: 't-err' }]]);
            return;
        }
        if (cmd === 'rm') {
            print([[{ t: 'rm: permission denied. (good instincts though, never run that.)', c: 't-err' }]]);
            return;
        }
        if (cmd === 'echo') {
            print([args.join(' ')]);
            return;
        }
        if (cmd === 'hack') {
            print(['[*] scanning ports...', '[*] enumerating services...', '[+] 22/tcp open  ssh', '[+] 80/tcp open  http', { t: '[!] relax - this is a portfolio, not a target.', c: 't-warn' }].map((l) => (typeof l === 'string' ? [l] : [l])), 350);
            return;
        }

        const key = aliases[cmd] || cmd;
        if (commands[key]) {
            print(commands[key]().concat(['']));
        } else {
            print([[{ t: `command not found: ${cmd}`, c: 't-err' }, { t: "  (type 'help')", c: 't-muted' }]]);
        }
    }

    // history + tab-complete
    const history = [];
    let hIdx = 0;
    const completions = [...Object.keys(commands), 'goto', 'clear', 'hack', 'sudo', 'cat resume', 'ctf', 'submit', 'sound', ...THEMES.map((t) => `theme ${t}`)];

    termInput.addEventListener('keydown', (e) => {
        if (e.key.length === 1 || e.key === 'Backspace') tick(1400 + Math.random() * 300);
        if (e.key === 'Enter') {
            tick(700);
            const v = termInput.value;
            if (v.trim()) { history.push(v); hIdx = history.length; }
            run(v);
            termInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (hIdx > 0) termInput.value = history[--hIdx];
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            hIdx = Math.min(hIdx + 1, history.length);
            termInput.value = history[hIdx] || '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const v = termInput.value.toLowerCase();
            const hit = v && completions.find((c) => c.startsWith(v));
            if (hit) termInput.value = hit;
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            run('clear');
        }
    });

    ['help', 'about', 'certs', 'education', 'projects', 'skills', 'roles', 'contact', 'clear'].forEach((name) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = name;
        b.addEventListener('click', () => { run(name); termInput.focus({ preventScroll: true }); });
        termChips.appendChild(b);
    });

    // Boot sequence plays the first time the terminal is opened.
    let booted = false;
    const boot = () => {
        if (booted) return;
        booted = true;
        print([
            [{ t: 'Welcome to Vuyyuru Raghavendra Sai\'s Cyber Security Portfolio', c: 't-ok' }],
            [{ t: '[ OK ] ', c: 't-ok' }, { t: 'secure channel established' }],
            [{ t: '[ OK ] ', c: 't-ok' }, { t: 'firewall: all quiet' }],
            [{ t: '[ OK ] ', c: 't-ok' }, { t: 'profile loaded' }],
            '',
            [{ t: "Type a number (1-6) or 'help' to get started. Esc closes.", c: 't-info' }],
            '',
        ], 220);
    };
    // Left-dock launcher + slide-in drawer
    const termToggle = $('#term-toggle');
    const termDrawer = $('#term-drawer');
    const termBackdrop = $('#term-backdrop');
    const termHint = $('#term-hint');
    let termOpen = false;
    let hintTimer;
    termDrawer.inert = true;

    function hideTermHint() {
        clearTimeout(hintTimer);
        termHint.classList.remove('show');
    }

    function showTermHint() {
        if (termOpen) return;
        hintTimer = setTimeout(() => {
            termHint.classList.add('show');
            hintTimer = setTimeout(hideTermHint, 7000);
        }, 1500);
    }

    function setTerminal(open) {
        if (open === termOpen) return;
        termOpen = open;
        document.body.classList.toggle('term-open', open);
        termToggle.setAttribute('aria-expanded', String(open));
        termDrawer.setAttribute('aria-hidden', String(!open));
        termDrawer.inert = !open;
        if (open) {
            hideTermHint();
            boot();
            setTimeout(() => termInput.focus({ preventScroll: true }), reducedMotion ? 0 : 350);
        } else {
            termToggle.focus({ preventScroll: true });
        }
    }

    termToggle.addEventListener('click', () => setTerminal(!termOpen));
    $('#term-close').addEventListener('click', () => setTerminal(false));
    termBackdrop.addEventListener('click', () => setTerminal(false));
    $$('[data-open-terminal]').forEach((b) => b.addEventListener('click', () => setTerminal(true)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termOpen) {
            setTerminal(false);
        } else if (e.key === '`' && !/^(INPUT|TEXTAREA)$/.test(e.target.tagName) && !document.body.classList.contains('intro-active')) {
            e.preventDefault();
            setTerminal(!termOpen);
        }
    });

    if (introDone) showTermHint(); // reduced-motion path skips the intro

    // Clicking anywhere on the terminal body focuses the input (without jumping the page).
    termBody.addEventListener('click', () => {
        if (!window.getSelection().toString()) termInput.focus({ preventScroll: true });
    });

    /* =====================================================
       Copy email
       ===================================================== */
    const copyBtn = $('.copy-mail');
    copyBtn.addEventListener('click', async () => {
        const email = copyBtn.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
        } catch (err) {
            // clipboard API unavailable (insecure context / denied): fall back to a hidden textarea
            const ta = document.createElement('textarea');
            ta.value = email;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e2) { /* ignore */ }
            ta.remove();
            if (!ok) { toast(`Copy failed - email: ${email}`); return; }
        }
        toast('Email copied to clipboard');
    });

    /* ===================================================== */
    $('#year').textContent = new Date().getFullYear();
});

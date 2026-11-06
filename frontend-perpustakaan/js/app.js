const routes = {
    dashboard: () => DashboardPage.render(),
    buku: () => BooksPage.render(),
    kategori: () => CategoriesPage.render(),
};

function navigate() {
    const name = (location.hash || '#dashboard').slice(1);
    const route = routes[name] || routes.dashboard;
    document.querySelectorAll('nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + name);
    });
    route();
}

window.addEventListener('hashchange', navigate);
navigate();

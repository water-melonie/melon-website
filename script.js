let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        pages[currentPage].style.transform = 'rotateY(-180deg)';
        currentPage++;
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].style.transform = 'rotateY(0deg)';
    }
});
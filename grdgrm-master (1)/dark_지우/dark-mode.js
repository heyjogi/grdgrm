const toggleThemeBtn = document.querySelector('.header__theme-button');

// const body = document.documentElement; // <html>을 대상으로
// const sunIcon = document.querySelector(".header__theme-button-sun");
// const moonIcon = document.querySelector(".header__theme-button-moon");

//다크모드 유지
window.onload = function() {
    setInitialTheme(localStorage.getItem('theme'));
}
function setInitialTheme(themeKey) {
    if(themeKey === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
}
        
toggleThemeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');

    if(document.documentElement.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
})

// function updateThemeIcon() {
//     console.log("다크 모드 상태:", body.classList.contains("dark-mode"));
//     if (body.classList.contains("dark-mode")) {
//         sunIcon.style.display = "unset";  
//         moonIcon.style.display = "none";  
//     } else {
//         sunIcon.style.display = "none";  
//         moonIcon.style.display = "unset";
//     }}

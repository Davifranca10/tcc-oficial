document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".feedback-card")
    const img1 = elements[0]
    const img2 = elements[1]
    const img3 = elements[2]

    const feedbacksSection = document.querySelector(".feedbacks");

    let sectionTop = 0;
    let inView = false
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionTop = window.scrollY;
                inView=true
                // Stop observing after first intersection
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    observer.observe(feedbacksSection);

    window.addEventListener('scroll', () => {
        if(!inView){
            return
        }
        const scrollY = window.scrollY - sectionTop;    
        console.log(scrollY);
        // Adjust these multipliers for different speeds
        img1.style.transform = `translateY(${scrollY * -0.6}px)`;
        img2.style.transform = `translateY(${scrollY * -0.4}px)`;
        img3.style.transform = `translateY(${scrollY * -0.2}px)`;
    });
});

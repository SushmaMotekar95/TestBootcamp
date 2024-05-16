document.addEventListener("DOMContentLoaded", function() {
    const popupLinks = document.querySelectorAll(".popup-link");
    const modal = document.getElementById("popup-modal");
    const modalImage = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close-btn");

    popupLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            modal.style.display = "block";
            modalImage.src = this.href;
        });
    });

    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});


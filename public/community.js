// community.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#postForm");
    const postsBoard = document.querySelector("#postsBoard");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Collect user input
            const title = document.querySelector("#title").value.trim();
            const content = document.querySelector("#content").value.trim();
            const author = document.querySelector("#author").value.trim();
            const date = new Date().toLocaleString();

            // Validate inputs
            if (!title || !content || !author) {
                alert("Please fill in all fields before publishing!");
                return;
            }

            // Create post card
            const postCard = document.createElement("article");
            postCard.classList.add("post-card");
            postCard.innerHTML = `
                <h3>${title}</h3>
                <p>${content}</p>
                <p class="post-meta">Posted by <strong>${author}</strong> on ${date}</p>
                <button class="delete-btn">Delete</button>
            `;

            // Remove placeholder if it's still there
            if (postsBoard.querySelector("p")) {
                postsBoard.innerHTML = "";
            }

            // Add new post to board
            postsBoard.prepend(postCard);

            // Clear form
            form.reset();

            // Delete functionality
            postCard.querySelector(".delete-btn").addEventListener("click", () => {
                postCard.remove();
                if (postsBoard.children.length === 0) {
                    postsBoard.innerHTML = <p>No posts yet. Be the first to share your thoughts ✨</p>;
                }
            });
        });
    }
});
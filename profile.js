const btn = document.querySelector('[data-testid="profile-button"]');
const message = document.querySelector('[data-testid="profile-message"]');
const name = document.querySelector('[data-testid="profile-name"]').textContent;

if (btn) {
  btn.addEventListener("click", () => {
    const isFollowing = btn.textContent === "Following";

    if (!isFollowing) {
      btn.textContent = "Following";
      btn.setAttribute("aria-pressed", "true");
      message.textContent = `You have followed ${name}`;
    } else {
      btn.textContent = "Follow";
      btn.setAttribute("aria-pressed", "false");
      message.textContent = `You unfollowed ${name}`;
    }
  });
}
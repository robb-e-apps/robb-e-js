async function login() {
  const res = await fetch('/auth-url');
  const { url } = await res.json();
  window.location.href = url;
}

window.onload = () => {
  document.getElementById('login-btn').onclick = login;
};

async function login() {
  const flow = 'application-user';
  const params = new URLSearchParams({ flow });

  const res = await fetch(`/auth-url?${params.toString()}`);
  const { url } = await res.json();
  window.location.href = url;
}

window.onload = () => {
  document.getElementById('login-btn').onclick = login;
};

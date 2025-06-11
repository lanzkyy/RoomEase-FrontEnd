// auth/auth.js
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    console.error('Error checking token:', error);
    return true;
  }
}

function checkToken() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    alert("Sesi Anda telah berakhir. Silakan login kembali.");
    localStorage.clear();
    window.location.href = "../auth/login.html";
    return false;
  }
  return true;
}

function logout() {
  localStorage.clear();
  alert("Anda telah logout.");
  window.location.href = "../auth/login.html";
}

async function loadUserProfile() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    return false;
  }
  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = '../auth/login.html';
        return false;
      }
      throw new Error('Gagal mengambil profil');
    }
    const userData = await response.json();
    localStorage.setItem('nama_pengguna', userData.nama_pengguna || '');
    localStorage.setItem('email', userData.email || '');
    localStorage.setItem('peran', userData.peran || '');
    localStorage.setItem('id_kelas', userData.id_kelas || '');
    localStorage.setItem('id_pengguna', userData.id_pengguna || '');
    return true;
  } catch (error) {
    console.error('Error loading profile:', error);
    localStorage.clear();
    return false;
  }
}

function handleAuthClick(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    logout();
  } else {
    window.location.href = "../auth/login.html";
  }
}

module.exports = { isTokenExpired, checkToken, logout, loadUserProfile, handleAuthClick };

export function logout(empresa?: string) {
    localStorage.removeItem('accessToken');
    window.location.href = `/${empresa}`;
}
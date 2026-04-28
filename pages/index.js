import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  async function girisYap(e) {
    e.preventDefault();
    setYukleniyor(true);
    setHata('');
    await new Promise(r => setTimeout(r, 600));
    const dogruSifre = process.env.NEXT_PUBLIC_PANEL_SIFRE || 'ajans2024';
    if (sifre === dogruSifre) {
      localStorage.setItem('ajans_giris', '1');
      router.push('/dashboard');
    } else {
      setHata('Hatalı şifre');
      setYukleniyor(false);
    }
  }

  return (
    <>
      <Head><title>Ajans Paneli — Giriş</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, #6c63ff18, transparent)',
      }}>
        <div className="fade-up" style={{ width: 380, padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>⚡</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 6px', color: 'var(--text)' }}>
              Ajans Paneli
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>
              Reklam ve müşteri yönetim sistemi
            </p>
          </div>
          <form onSubmit={girisYap}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="password"
                placeholder="Şifre"
                value={sifre}
                onChange={e => setSifre(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'var(--bg3)', border: '1px solid var(--border2)',
                  borderRadius: 10, color: 'var(--text)', fontSize: 14,
                  outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            {hata && (
              <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>
                {hata}
              </p>
            )}
            <button
              type="submit"
              disabled={yukleniyor || !sifre}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                border: 'none', borderRadius: 10,
                color: 'white', fontSize: 14, fontWeight: 500,
                cursor: yukleniyor ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: (!sifre || yukleniyor) ? 0.6 : 1,
              }}
            >
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--text3)' }}>
            Ajans Otomasyon Sistemi v1.0
          </p>
        </div>
      </div>
    </>
  );
}

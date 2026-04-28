import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api } from '../lib/api';

const STATUS_RENK = { iyi: '#22c55e', dikkat: '#f59e0b', kritik: '#ef4444' };
const STATUS_BG = { iyi: '#22c55e18', dikkat: '#f59e0b18', kritik: '#ef444418' };

function MetrikKart({ baslik, deger, alt, renk, gecikme }) {
  return (
    <div className={`fade-up-${gecikme}`} style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 22px', flex: 1,
    }}>
      <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {baslik}
      </p>
      <p style={{ fontSize: 28, fontWeight: 600, margin: '0 0 4px', color: renk || 'var(--text)', fontFamily: 'DM Mono, monospace' }}>
        {deger}
      </p>
      {alt && <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>{alt}</p>}
    </div>
  );
}

function MusterіSatir({ musteri, index }) {
  const durum = musteri.durum || 'iyi';
  return (
    <div className={`fade-up-${Math.min(index + 2, 5)}`} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${STATUS_BG[durum]}`,
        border: `1px solid ${STATUS_RENK[durum]}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color: STATUS_RENK[durum],
        flexShrink: 0,
      }}>
        {musteri.name?.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
          {musteri.name}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text2)' }}>
          {musteri.email || 'email yok'}
        </p>
      </div>
      <div style={{
        padding: '3px 10px', borderRadius: 20,
        background: STATUS_BG[durum],
        border: `1px solid ${STATUS_RENK[durum]}40`,
        fontSize: 11, color: STATUS_RENK[durum], fontWeight: 500,
      }}>
        {durum}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [veri, setVeri] = useState(null);
  const [musteriler, setMusteriler] = useState([]);
  const [gorevler, setGorevler] = useState([]);
  const [sistem, setSistem] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [aktifSayfa, setAktifSayfa] = useState('dashboard');

  useEffect(() => {
    if (!localStorage.getItem('ajans_giris')) {
      router.push('/');
      return;
    }
    verileriYukle();
    const interval = setInterval(verileriYukle, 30000);
    return () => clearInterval(interval);
  }, []);

  async function verileriYukle() {
    const [d, m, t, s] = await Promise.all([
      api.dashboard(), api.clients(), api.tasks(), api.health()
    ]);
    if (d) setVeri(d);
    if (m) setMusteriler(m);
    if (t) setGorevler(t);
    if (s) setSistem(s);
    setYukleniyor(false);
  }

  async function raporGonder() {
    await api.triggerReport();
    alert('Rapor Telegram\'a gönderildi!');
  }

  function cikisYap() {
    localStorage.removeItem('ajans_giris');
    router.push('/');
  }

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'musteriler', label: 'Müşteriler', icon: '◈' },
    { id: 'gorevler', label: 'Görevler', icon: '◎' },
    { id: 'raporlar', label: 'Raporlar', icon: '◉' },
  ];

  return (
    <>
      <Head><title>Ajans Paneli</title></Head>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 0', position: 'sticky', top: 0, height: '100vh',
        }}>
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>⚡</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Ajans Paneli</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div className="live-dot" />
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--text2)' }}>Çevrimiçi</p>
                </div>
              </div>
            </div>
          </div>

          <nav style={{ padding: '16px 12px', flex: 1 }}>
            {nav.map(item => (
              <button key={item.id} onClick={() => setAktifSayfa(item.id)} style={{
                width: '100%', padding: '9px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: aktifSayfa === item.id ? 'var(--bg3)' : 'transparent',
                border: aktifSayfa === item.id ? '1px solid var(--border2)' : '1px solid transparent',
                borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
                color: aktifSayfa === item.id ? 'var(--text)' : 'var(--text2)',
                fontSize: 13, fontWeight: aktifSayfa === item.id ? 500 : 400,
                marginBottom: 3, textAlign: 'left', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
                {item.id === 'gorevler' && gorevler.length > 0 && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                    background: '#ef444420', color: '#ef4444',
                    padding: '2px 6px', borderRadius: 20,
                    border: '1px solid #ef444430',
                  }}>{gorevler.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={raporGonder} style={{
              width: '100%', padding: '9px 12px',
              background: '#6c63ff18', border: '1px solid #6c63ff30',
              borderRadius: 9, color: 'var(--accent2)', fontSize: 12,
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              marginBottom: 6, transition: 'all 0.15s',
            }}>
              📨 Rapor Gönder
            </button>
            <button onClick={cikisYap} style={{
              width: '100%', padding: '9px 12px',
              background: 'transparent', border: '1px solid transparent',
              borderRadius: 9, color: 'var(--text3)', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Çıkış →
            </button>
          </div>
        </aside>

        {/* Ana içerik */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 600 }}>
                {aktifSayfa === 'dashboard' && 'Genel Bakış'}
                {aktifSayfa === 'musteriler' && 'Müşteriler'}
                {aktifSayfa === 'gorevler' && 'Görevler'}
                {aktifSayfa === 'raporlar' && 'Raporlar'}
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text2)' }}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            {sistem && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 20,
                background: sistem.anthropic_bagli ? '#22c55e12' : '#ef444412',
                border: `1px solid ${sistem.anthropic_bagli ? '#22c55e30' : '#ef444430'}`,
                fontSize: 11, color: sistem.anthropic_bagli ? '#22c55e' : '#ef4444',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                Claude {sistem.anthropic_bagli ? 'Bağlı' : 'Bağlı Değil'}
              </div>
            )}
          </div>

          {yukleniyor ? (
            <div style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', paddingTop: 60 }}>
              Yükleniyor...
            </div>
          ) : (
            <>
              {/* Dashboard sayfası */}
              {aktifSayfa === 'dashboard' && (
                <>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                    <MetrikKart baslik="Aktif Müşteri" deger={veri?.toplam_musteri ?? musteriler.length} alt="toplam kayıtlı" renk="var(--accent2)" gecikme={1} />
                    <MetrikKart baslik="Bekleyen Görev" deger={veri?.bekleyen_gorev ?? gorevler.length} alt={`${veri?.acil_gorev ?? 0} acil`} renk={gorevler.length > 0 ? 'var(--amber)' : 'var(--green)'} gecikme={2} />
                    <MetrikKart baslik="Sistem Durumu" deger={sistem?.status === 'ok' ? 'Aktif' : 'Hata'} alt="Railway üzerinde" renk="var(--green)" gecikme={3} />
                    <MetrikKart baslik="Son Güncelleme" deger={new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} alt="otomatik yenileme" gecikme={4} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {/* Müşteri listesi */}
                    <div className="fade-up-3" style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: '20px 22px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Müşteriler</p>
                        <span style={{ fontSize: 11, color: 'var(--text2)' }}>{musteriler.length} kayıt</span>
                      </div>
                      {musteriler.length === 0 ? (
                        <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                          Henüz müşteri yok
                        </p>
                      ) : (
                        musteriler.slice(0, 6).map((m, i) => <MusterіSatir key={m.id} musteri={m} index={i} />)
                      )}
                    </div>

                    {/* Görevler */}
                    <div className="fade-up-4" style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: '20px 22px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Görevler</p>
                        <span style={{ fontSize: 11, color: 'var(--red)' }}>{gorevler.filter(g => g.priority === 'urgent').length} acil</span>
                      </div>
                      {gorevler.length === 0 ? (
                        <p style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                          Tüm görevler tamamlandı ✓
                        </p>
                      ) : (
                        gorevler.slice(0, 6).map((g, i) => (
                          <div key={g.id} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '10px 0', borderBottom: '1px solid var(--border)',
                          }}>
                            <div style={{
                              width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                              background: g.priority === 'urgent' ? 'var(--red)' : g.priority === 'high' ? 'var(--amber)' : 'var(--text3)',
                            }} />
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--text)', lineHeight: 1.5, flex: 1 }}>{g.title}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Müşteriler sayfası */}
              {aktifSayfa === 'musteriler' && (
                <div className="fade-up" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '20px 22px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Tüm Müşteriler</p>
                    <button style={{
                      padding: '7px 14px', background: 'var(--accent)', border: 'none',
                      borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>+ Yeni Müşteri</button>
                  </div>
                  {musteriler.length === 0 ? (
                    <p style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
                      Henüz müşteri eklenmemiş.<br />
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>API üzerinden veya yukarıdaki butonla ekleyebilirsiniz.</span>
                    </p>
                  ) : (
                    musteriler.map((m, i) => <MusterіSatir key={m.id} musteri={m} index={i} />)
                  )}
                </div>
              )}

              {/* Görevler sayfası */}
              {aktifSayfa === 'gorevler' && (
                <div className="fade-up" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '20px 22px',
                }}>
                  <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 500 }}>Tüm Görevler</p>
                  {gorevler.length === 0 ? (
                    <p style={{ color: 'var(--green)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
                      Tüm görevler tamamlandı ✓
                    </p>
                  ) : (
                    gorevler.map((g) => (
                      <div key={g.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '13px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: g.priority === 'urgent' ? 'var(--red)' : g.priority === 'high' ? 'var(--amber)' : 'var(--text3)',
                        }} />
                        <p style={{ margin: 0, fontSize: 13, flex: 1 }}>{g.title}</p>
                        <span style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 20,
                          background: g.priority === 'urgent' ? '#ef444420' : '#f59e0b20',
                          color: g.priority === 'urgent' ? '#ef4444' : '#f59e0b',
                          border: `1px solid ${g.priority === 'urgent' ? '#ef444430' : '#f59e0b30'}`,
                        }}>{g.priority}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Raporlar sayfası */}
              {aktifSayfa === 'raporlar' && (
                <div className="fade-up" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '32px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 32, margin: '0 0 12px' }}>📨</p>
                  <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>Rapor Merkezi</p>
                  <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 24px' }}>
                    Raporlar her gün sabah 08:00 ve akşam 18:00'de Telegram'a otomatik gönderilir.
                  </p>
                  <button onClick={raporGonder} style={{
                    padding: '11px 24px',
                    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                    border: 'none', borderRadius: 10, color: 'white',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    Şimdi Rapor Gönder
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
